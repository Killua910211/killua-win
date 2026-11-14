'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 天气条的横向滚动容器。
 *
 * 15 天在宽屏上一排正好放得下，窄屏放不下就横向滚动。窄屏默认停在最左边
 * 意味着先看到一周前，所以挂载后把「今天」挪到可视区中间。
 *
 * 直接改 scrollLeft 而不是 scrollIntoView：后者会连带滚动整个页面，
 * 首屏刚打开就被顶走。宽屏放得下时不做任何事。
 */
export function WeatherTrack({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const centerToday = () => {
      if (track.scrollWidth <= track.clientWidth) return;
      const today = track.querySelector('[data-weather-today="true"]');
      if (!(today instanceof HTMLElement)) return;
      track.scrollLeft = today.offsetLeft - (track.clientWidth - today.offsetWidth) / 2;
    };

    centerToday();

    // 只在宽度真的变了（旋屏、窗口缩放）之后重新居中。手机地址栏收起只改高度，
    // 那种情况下重新居中会把用户刚刚手动滑到的位置弹回去。
    if (typeof ResizeObserver === 'undefined') return;
    let lastWidth = track.clientWidth;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth) return;
      lastWidth = track.clientWidth;
      centerToday();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <ol aria-label={label} className="home-weather-track" ref={trackRef}>
      {children}
    </ol>
  );
}
