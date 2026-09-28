'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ReadingPoint = { element: HTMLElement; title: string; excerpt: string; top: number };
const MAX_POINTS = 20;

/** Progressive enhancement: the document remains the native scroll container. */
export function ReadingRail() {
  const pathname = usePathname();
  return <PageReadingRail key={pathname} />;
}

function PageReadingRail() {
  const [points, setPoints] = useState<ReadingPoint[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const desktop = window.matchMedia('(min-width: 1000px)');
    let entries: ReadingPoint[] = [];
    let frame = 0;
    let measureFrame = 0;
    let disposed = false;
    const text = (element: Element | null, limit: number) =>
      (element?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
    const visible = (element: HTMLElement) => element.getClientRects().length > 0;

    function updateActive() {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.25;
      let index = 0;
      entries.forEach((entry, i) => { if (entry.top <= line) index = i; });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        index = Math.max(0, entries.length - 1);
      }
      setActive(index);
    }

    function measure() {
      measureFrame = 0;
      if (disposed) return;
      if (!desktop.matches || document.documentElement.scrollHeight < window.innerHeight * 1.5) {
        entries = [];
        setPoints([]);
        return;
      }
      const headings = Array.from(main!.querySelectorAll<HTMLElement>('h1, h2')).filter(visible);
      const paragraphs = Array.from(main!.querySelectorAll<HTMLElement>('.post-body > p')).filter(visible);
      const candidates = headings.length < 3 && paragraphs.length > 3
        ? [...headings.filter((heading) => heading.tagName === 'H1'), ...paragraphs]
        : headings;
      // Sample oversized outlines evenly, keeping both the beginning and end.
      const selected = candidates.length <= MAX_POINTS ? candidates : Array.from(
        { length: MAX_POINTS },
        (_, i) => candidates[Math.round(i * (candidates.length - 1) / (MAX_POINTS - 1))],
      );
      entries = selected.map((element) => {
        const isParagraph = element.tagName === 'P';
        const sibling = element.nextElementSibling;
        const excerpt = isParagraph ? text(element, 160)
          : text(sibling?.matches('p') ? sibling : element.parentElement?.querySelector('p') ?? null, 160);
        return {
          element,
          title: text(element, isParagraph ? 32 : 80),
          excerpt,
          top: element.getBoundingClientRect().top + window.scrollY,
        };
      });
      setPoints(entries.length > 1 ? entries : []);
      updateActive();
    }
    function scheduleMeasure() {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(updateActive);
    }
    const resize = new ResizeObserver(scheduleMeasure);
    resize.observe(main);
    const mutation = new MutationObserver(scheduleMeasure);
    mutation.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    desktop.addEventListener('change', scheduleMeasure);
    void document.fonts.ready.then(scheduleMeasure);
    measure();
    return () => {
      disposed = true;
      resize.disconnect();
      mutation.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleMeasure);
      desktop.removeEventListener('change', scheduleMeasure);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measureFrame);
    };
  }, []);

  if (!points.length) return null;
  return (
    <nav className="reading-rail" aria-label="阅读位置导航">
      {points.map((point, index) => (
        <button
          key={index}
          type="button"
          className="reading-rail-point"
          aria-label={`跳转到：${point.title}`}
          aria-current={index === active ? 'location' : undefined}
          onClick={() => {
            const localNav = document.querySelector('.section-local-nav');
            const offset = (localNav?.getBoundingClientRect().height ?? 0) + 24;
            window.scrollTo({
              top: Math.max(0, point.element.getBoundingClientRect().top + window.scrollY - offset),
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            });
          }}
        >
          <span className="reading-rail-tick" aria-hidden="true" />
          <span className="reading-rail-preview" aria-hidden="true">
            <span className="reading-rail-counter">{String(index + 1).padStart(2, '0')} / {String(points.length).padStart(2, '0')}</span>
            <strong>{point.title}</strong>
            {point.excerpt && <span className="reading-rail-excerpt">{point.excerpt}</span>}
          </span>
        </button>
      ))}
    </nav>
  );
}
