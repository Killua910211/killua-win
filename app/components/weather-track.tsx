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
 *
 * 另外把「这一侧还有没有没露出来的卡片」写成 data 属性，样式据此只在那一侧
 * 做渐隐。CSS 自己看不出滚动位置，滑到头了还盖着渐隐会把完整的卡片压暗。
 */
export function WeatherTrack({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncEdges = () => {
      const hidden = track.scrollWidth - track.clientWidth;
      // 1px 的余量：缩放和亚像素会让滚到底的 scrollLeft 差一点点到不了头。
      const scrollable = hidden > 1;
      track.dataset.edgeStart = String(scrollable && track.scrollLeft > 1);
      track.dataset.edgeEnd = String(scrollable && track.scrollLeft < hidden - 1);
    };

    const centerToday = () => {
      if (track.scrollWidth <= track.clientWidth) return;
      const today = track.querySelector('[data-weather-today="true"]');
      if (!(today instanceof HTMLElement)) return;
      // 按可视矩形算偏移，不用 offsetLeft：offsetLeft 是相对定位祖先的，
      // 轨道有内距、又在窄屏上满宽时，两者差一个内距。
      const offset = today.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      track.scrollLeft = offset - (track.clientWidth - today.offsetWidth) / 2;
    };

    centerToday();
    syncEdges();

    track.addEventListener('scroll', syncEdges, { passive: true });

    // 只在宽度真的变了（旋屏、窗口缩放）之后重新居中。手机地址栏收起只改高度，
    // 那种情况下重新居中会把用户刚刚手动滑到的位置弹回去。
    if (typeof ResizeObserver === 'undefined') {
      return () => track.removeEventListener('scroll', syncEdges);
    }
    let lastWidth = track.clientWidth;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth) {
        syncEdges();
        return;
      }
      lastWidth = track.clientWidth;
      centerToday();
      syncEdges();
    });
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', syncEdges);
      observer.disconnect();
    };
  }, []);

  return (
    <ol aria-label={label} className="home-weather-track" ref={trackRef}>
      {children}
    </ol>
  );
}
