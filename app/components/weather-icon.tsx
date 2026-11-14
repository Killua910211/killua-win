import type { WeatherIconKind } from '@/app/lib/weather';

const SUN = <circle cx="12" cy="12" r="4.1" />;
const SUN_RAYS = (
  <g strokeLinecap="round">
    <path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
  </g>
);
const CLOUD = <path d="M7.4 19h9.2a3.6 3.6 0 0 0 .5-7.2 5.3 5.3 0 0 0-10.2-1A3.6 3.6 0 0 0 7.4 19Z" />;
const SMALL_CLOUD = <path d="M9.6 20h7.8a3.1 3.1 0 0 0 .4-6.2 4.6 4.6 0 0 0-8.8-.8A3 3 0 0 0 9.6 20Z" />;

/** 雨滴、雪花和闪电都挂在云下面，位置对齐同一条基线。 */
const RAIN_LIGHT = <path d="M9.5 20.5l-.9 2M14.5 20.5l-.9 2" strokeLinecap="round" />;
const RAIN = <path d="M8.6 20.3l-1.1 2.4M12 20.3l-1.1 2.4M15.4 20.3l-1.1 2.4" strokeLinecap="round" />;
const SNOW = (
  <g strokeLinecap="round">
    <path d="M8.1 21.3h1.8M9 20.4v1.8" />
    <path d="M11.1 23h1.8M12 22.1v1.8" />
    <path d="M14.1 21.3h1.8M15 20.4v1.8" />
  </g>
);
const LIGHTNING = <path d="M12.8 19.4l-2.9 3.4h2.4l-1 2.6" strokeLinecap="round" strokeLinejoin="round" />;

/**
 * WMO 代码分组后的天气图标。线条图标，颜色跟随 currentColor。
 *
 * 图标本身对读屏没有意义，所以统一 aria-hidden —— 天气说法在卡片里有文字。
 */
export function WeatherIcon({ kind, className }: { kind: WeatherIconKind; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className ? `weather-icon ${className}` : 'weather-icon'}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeWidth="1.4"
      viewBox="0 0 24 26"
      xmlns="http://www.w3.org/2000/svg"
    >
      {kind === 'clear' ? (
        <g>
          {SUN}
          {SUN_RAYS}
        </g>
      ) : null}
      {kind === 'mostly-clear' ? (
        <g>
          <circle cx="9.4" cy="9.6" r="3.3" />
          <path d="M9.4 3.4v1.6M3.2 9.6h1.6M5 5.2l1.1 1.1M13.8 5.2l-1.1 1.1" strokeLinecap="round" />
          {SMALL_CLOUD}
        </g>
      ) : null}
      {kind === 'partly-cloudy' ? (
        <g>
          <circle cx="9" cy="8.6" r="2.9" />
          <path d="M9 2.8v1.4M3.6 8.6H5M4.9 4.5l1 1M13.1 4.5l-1 1" strokeLinecap="round" />
          {SMALL_CLOUD}
        </g>
      ) : null}
      {kind === 'overcast' ? (
        <g>
          <path d="M6 9.4a4.6 4.6 0 0 1 8.8-1.2" />
          {SMALL_CLOUD}
        </g>
      ) : null}
      {kind === 'fog' ? (
        <g>
          {CLOUD}
          <path d="M5.6 21.4h12.8M7.8 24h8.4" strokeLinecap="round" />
        </g>
      ) : null}
      {kind === 'drizzle' ? (
        <g>
          {CLOUD}
          {RAIN_LIGHT}
        </g>
      ) : null}
      {kind === 'rain' || kind === 'showers' ? (
        <g>
          {CLOUD}
          {RAIN}
        </g>
      ) : null}
      {kind === 'snow' ? (
        <g>
          {CLOUD}
          {SNOW}
        </g>
      ) : null}
      {kind === 'thunder' ? (
        <g>
          {CLOUD}
          {LIGHTNING}
        </g>
      ) : null}
    </svg>
  );
}
