/**
 * 首页首屏的东京天气：过去 7 天、今天、未来 7 天。
 *
 * 数据来自 Open-Meteo 的公开接口（免费、无需密钥、无需署名之外的授权）。
 * 一次请求就能同时拿到回看与预报：`past_days=7` 往前取 7 个已结束日，
 * `forecast_days=8` 从今天起往后取 8 天，合起来正好 15 天。
 *
 * 这里只做取数与解析，不渲染。返回的每一个字段都在运行期重新校验过
 * 类型和范围：拿到的是对端此刻返回的 JSON，TypeScript 的断言管不到它
 * （见 AGENTS.md 对公开汇总数据的要求）。任何一天的某个字段不合法，
 * 只丢掉那一天，不让整块天气消失。
 */

/** 东京都厅（新宿）；Open-Meteo 会吸附到最近的网格点。 */
const TOKYO_LATITUDE = 35.6895;
const TOKYO_LONGITUDE = 139.6917;
const TOKYO_TIME_ZONE = 'Asia/Tokyo';

/** 往前 7 个已结束日 + 今天 + 往后 7 天。 */
export const WEATHER_PAST_DAYS = 7;
export const WEATHER_FUTURE_DAYS = 7;
const FORECAST_DAYS = WEATHER_FUTURE_DAYS + 1;
/** 解析时的行数上限：正常 15 天，留一点余量，再多的一律截断。 */
const MAX_DAYS = 24;

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
] as const;
const CURRENT_FIELDS = ['temperature_2m', 'weather_code', 'relative_humidity_2m'] as const;

/**
 * 两个来源都是 Open-Meteo，返回结构完全一致。
 *
 * 第二个是备用：主域名在某些网络里不可达（开发机上就是如此，
 * `api.open-meteo.com` 的那个 IP 连不通，而 historical-forecast 可以），
 * 线上 Worker 走哪一个都能出数据，本地也还能验证真实渲染。
 */
const SOURCES = [
  'https://api.open-meteo.com/v1/forecast',
  'https://historical-forecast-api.open-meteo.com/v1/forecast',
] as const;

/** 单次请求的超时。首屏不能等一个挂起的上游。 */
const REQUEST_TIMEOUT_MS = 2500;
/** 缓存多久算新鲜。天气按小时变，半小时足够，也把上游请求量压到很低。 */
const FRESH_MS = 30 * 60 * 1000;
/** 刷新失败时，旧数据还能顶多久。过期就宁可显示读取失败，不显示昨天的天。 */
const STALE_MS = 6 * 60 * 60 * 1000;

export type WeatherIconKind =
  | 'clear'
  | 'mostly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'showers'
  | 'snow'
  | 'thunder';

export type WeatherDay = {
  /** 东京本地日，YYYY-MM-DD。 */
  date: string;
  /** 「11.14」。 */
  monthDay: string;
  /** 「周五」。 */
  weekday: string;
  code: number;
  label: string;
  icon: WeatherIconKind;
  /** 已经四舍五入到整数摄氏度。 */
  high: number;
  low: number;
  /** 毫米；过去是实况累计，未来是预报累计。取不到为 null。 */
  precipitation: number | null;
  /** 当天最高降水概率（%）。取不到为 null。 */
  precipitationChance: number | null;
};

export type WeatherNow = {
  temperature: number;
  code: number;
  label: string;
  icon: WeatherIconKind;
  /** 相对湿度（%）。取不到为 null。 */
  humidity: number | null;
  /** 东京本地的观测时刻，「21:45」。 */
  observedAt: string;
};

export type TokyoWeather = {
  /** 按日期升序；正常是 15 天，上游缺字段时可能少几天。 */
  days: WeatherDay[];
  /** 东京今天的日期，YYYY-MM-DD。 */
  today: string;
  now: WeatherNow | null;
  /** true 表示这次刷新失败，显示的是上一次取到的数据。 */
  stale: boolean;
};

/** WMO 天气代码 → 中文说法与图标。未列出的代码按区间兜底。 */
const WEATHER_CODES: Record<number, { label: string; icon: WeatherIconKind }> = {
  0: { label: '晴', icon: 'clear' },
  1: { label: '晴间少云', icon: 'mostly-clear' },
  2: { label: '多云', icon: 'partly-cloudy' },
  3: { label: '阴', icon: 'overcast' },
  45: { label: '雾', icon: 'fog' },
  48: { label: '雾凇', icon: 'fog' },
  51: { label: '小毛毛雨', icon: 'drizzle' },
  53: { label: '毛毛雨', icon: 'drizzle' },
  55: { label: '强毛毛雨', icon: 'drizzle' },
  56: { label: '冻毛毛雨', icon: 'drizzle' },
  57: { label: '强冻毛毛雨', icon: 'drizzle' },
  61: { label: '小雨', icon: 'rain' },
  63: { label: '中雨', icon: 'rain' },
  65: { label: '大雨', icon: 'rain' },
  66: { label: '冻雨', icon: 'rain' },
  67: { label: '强冻雨', icon: 'rain' },
  71: { label: '小雪', icon: 'snow' },
  73: { label: '中雪', icon: 'snow' },
  75: { label: '大雪', icon: 'snow' },
  77: { label: '米雪', icon: 'snow' },
  80: { label: '阵雨', icon: 'showers' },
  81: { label: '强阵雨', icon: 'showers' },
  82: { label: '暴雨', icon: 'showers' },
  85: { label: '阵雪', icon: 'snow' },
  86: { label: '强阵雪', icon: 'snow' },
  95: { label: '雷阵雨', icon: 'thunder' },
  96: { label: '雷阵雨伴冰雹', icon: 'thunder' },
  99: { label: '强雷暴伴冰雹', icon: 'thunder' },
};

/** 代码表里没有的值按区间归类，而不是直接丢掉这一天。 */
export function describeWeatherCode(code: number): { label: string; icon: WeatherIconKind } {
  const known = WEATHER_CODES[code];
  if (known) return known;
  if (code >= 95) return { label: '雷暴', icon: 'thunder' };
  if (code >= 80) return { label: '阵性降水', icon: 'showers' };
  if (code >= 71) return { label: '雪', icon: 'snow' };
  if (code >= 61) return { label: '雨', icon: 'rain' };
  if (code >= 51) return { label: '毛毛雨', icon: 'drizzle' };
  if (code >= 45) return { label: '雾', icon: 'fog' };
  if (code >= 1) return { label: '多云', icon: 'partly-cloudy' };
  return { label: '晴', icon: 'clear' };
}

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** 把 YYYY-MM-DD 当成一个纯日历日来算星期，不经过本地时区。 */
function weekdayOf(date: string): string | null {
  const milliseconds = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(milliseconds)) return null;
  return WEEKDAY_NAMES[new Date(milliseconds).getUTCDay()] ?? null;
}

/** 东京此刻的日历日。用服务端当前时刻换算，不依赖上游返回的 current.time。 */
export function tokyoCalendarDate(nowMilliseconds: number): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(nowMilliseconds);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

/** 两个日历日之间差几天；非法输入返回 null。 */
export function dayOffset(date: string, today: string): number | null {
  if (!DATE_PATTERN.test(date) || !DATE_PATTERN.test(today)) return null;
  const from = Date.parse(`${today}T00:00:00Z`);
  const to = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return Math.round((to - from) / 86_400_000);
}

/** 「今天 / 明天 / 昨天」，其余日子不另外加说明。 */
export function relativeDayLabel(offset: number): string | null {
  if (offset === 0) return '今天';
  if (offset === 1) return '明天';
  if (offset === -1) return '昨天';
  return null;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** 地表气温的合理区间；超出就当这一天没取到，而不是把它画出来。 */
function temperature(value: unknown): number | null {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= -80 && parsed <= 70 ? parsed : null;
}

function weatherCode(value: unknown): number | null {
  const parsed = finiteNumber(value);
  return parsed !== null && Number.isInteger(parsed) && parsed >= 0 && parsed <= 99 ? parsed : null;
}

function precipitation(value: unknown): number | null {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= 0 && parsed <= 2000 ? Math.round(parsed * 10) / 10 : null;
}

function percentage(value: unknown): number | null {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= 0 && parsed <= 100 ? Math.round(parsed) : null;
}

function numberAt(source: unknown, index: number): unknown {
  return Array.isArray(source) ? source[index] : undefined;
}

/** 「2026-11-14T21:45」→「21:45」；格式不对就不显示观测时刻。 */
function clockOf(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(value);
  return match ? match[1] : null;
}

function parseDays(payload: Record<string, unknown>): WeatherDay[] {
  const daily = payload.daily;
  if (!daily || typeof daily !== 'object' || Array.isArray(daily)) return [];

  const columns = daily as Record<string, unknown>;
  const times = Array.isArray(columns.time) ? columns.time.slice(0, MAX_DAYS) : [];

  const days: WeatherDay[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < times.length; index += 1) {
    const date = times[index];
    if (typeof date !== 'string' || !DATE_PATTERN.test(date) || seen.has(date)) continue;

    const weekday = weekdayOf(date);
    const code = weatherCode(numberAt(columns.weather_code, index));
    const high = temperature(numberAt(columns.temperature_2m_max, index));
    const low = temperature(numberAt(columns.temperature_2m_min, index));
    // 气温和天气是这一格的主体，缺任何一个就不画这一天；降水是补充信息，可以缺。
    if (weekday === null || code === null || high === null || low === null) continue;

    seen.add(date);
    const described = describeWeatherCode(code);
    days.push({
      date,
      monthDay: `${date.slice(5, 7)}.${date.slice(8, 10)}`,
      weekday,
      code,
      label: described.label,
      icon: described.icon,
      high: Math.round(high),
      low: Math.round(low),
      precipitation: precipitation(numberAt(columns.precipitation_sum, index)),
      precipitationChance: percentage(numberAt(columns.precipitation_probability_max, index)),
    });
  }

  days.sort((left, right) => (left.date < right.date ? -1 : 1));
  return days;
}

function parseNow(payload: Record<string, unknown>): WeatherNow | null {
  const current = payload.current;
  if (!current || typeof current !== 'object' || Array.isArray(current)) return null;

  const fields = current as Record<string, unknown>;
  const value = temperature(fields.temperature_2m);
  const code = weatherCode(fields.weather_code);
  const observedAt = clockOf(fields.time);
  if (value === null || code === null || observedAt === null) return null;

  const described = describeWeatherCode(code);
  return {
    temperature: Math.round(value),
    code,
    label: described.label,
    icon: described.icon,
    humidity: percentage(fields.relative_humidity_2m),
    observedAt,
  };
}

/**
 * 把上游 JSON 解析成页面要用的形状。纯函数，便于单独测试。
 * 一天都解析不出来时返回 null —— 调用方据此显示「读取失败」。
 */
export function parseTokyoWeather(payload: unknown, today: string): Omit<TokyoWeather, 'stale'> | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const record = payload as Record<string, unknown>;
  const days = parseDays(record);
  if (days.length === 0) return null;

  return { days, today, now: parseNow(record) };
}

function requestUrl(origin: string): string {
  const url = new URL(origin);
  url.searchParams.set('latitude', String(TOKYO_LATITUDE));
  url.searchParams.set('longitude', String(TOKYO_LONGITUDE));
  url.searchParams.set('timezone', TOKYO_TIME_ZONE);
  url.searchParams.set('past_days', String(WEATHER_PAST_DAYS));
  url.searchParams.set('forecast_days', String(FORECAST_DAYS));
  url.searchParams.set('daily', DAILY_FIELDS.join(','));
  url.searchParams.set('current', CURRENT_FIELDS.join(','));
  return url.toString();
}

type CacheEntry = { days: WeatherDay[]; now: WeatherNow | null; fetchedAt: number };

/**
 * 进程内缓存。Worker 的 isolate 会在多次请求之间存活，所以同一个 isolate
 * 半小时只打一次上游；isolate 被回收就重新取一次，代价只是一次请求。
 * inFlight 让同时到达的几个请求共用同一次取数，而不是各打一次。
 */
let cache: CacheEntry | null = null;
let inFlight: Promise<CacheEntry | null> | null = null;

async function fetchFromSource(origin: string, today: string): Promise<CacheEntry | null> {
  try {
    const response = await fetch(requestUrl(origin), {
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const parsed = parseTokyoWeather(await response.json(), today);
    return parsed ? { days: parsed.days, now: parsed.now, fetchedAt: Date.now() } : null;
  } catch (error) {
    console.error('weather.fetch_failed', {
      origin,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function refresh(today: string): Promise<CacheEntry | null> {
  for (const origin of SOURCES) {
    const entry = await fetchFromSource(origin, today);
    if (entry) return entry;
  }
  return null;
}

/**
 * 首页首屏用的东京天气。取不到且没有可用的旧数据时返回 null。
 *
 * 缓存里只存按日期排好的天，不存「今天是哪天」——过了午夜还在用旧缓存时，
 * 「今天」由这里当场重新判定，不会把昨天标成今天。
 */
export async function getTokyoWeather(nowMilliseconds = Date.now()): Promise<TokyoWeather | null> {
  const today = tokyoCalendarDate(nowMilliseconds);
  const cached = cache;
  if (cached && nowMilliseconds - cached.fetchedAt < FRESH_MS) {
    return { days: cached.days, today, now: cached.now, stale: false };
  }

  inFlight ??= refresh(today).finally(() => {
    inFlight = null;
  });
  const fresh = await inFlight;
  if (fresh) {
    cache = fresh;
    return { days: fresh.days, today, now: fresh.now, stale: false };
  }

  // 刷新失败：半天之内的旧数据还能看，明说它是旧的；再旧就不显示了。
  // 这里重新读一次 cache —— 等待期间可能有另一个请求刚把它填上。
  const fallback = cache;
  if (fallback && nowMilliseconds - fallback.fetchedAt < STALE_MS) {
    return { days: fallback.days, today, now: fallback.now, stale: true };
  }
  return null;
}
