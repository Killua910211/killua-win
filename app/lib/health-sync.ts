/**
 * Apple Health 每日汇总的解析与聚合。
 *
 * iPhone 快捷指令用「查找健康样本」取最近若干天的数据，把每个指标的
 * 「开始日期」「值」等属性各自作为一个文本字段 POST 到 /api/health/sync。
 * 快捷指令把列表转成文本时一项一行，所以这里按行拆开、逐行配对。
 * 搭建步骤见 docs/health-sync.md。
 *
 * 纯函数、零依赖、只用可擦除的 TS 语法：路由在 Worker 里调用它，
 * scripts/check-health-sync.mjs 在 Node 里直接 import 它做回归测试。
 *
 * 口径与 2026-10-05 那次手动快照一致：
 *   - 累计型（步数、活动能量、距离）在手机端按天分组，由 HealthKit 合并多设备来源；
 *   - 离散型（静息心率、HRV、血氧）按本地日期取样本均值，不把缺失记作 0；
 *   - 睡眠只纳入已睡类别（未细分/核心/深度/快速动眼），排除卧床与清醒，
 *     合并重叠时段后按醒来那天归属。
 */

/** 健康页统一按北京时间判定「今天」和「这一天是否已经结束」。 */
export const HEALTH_SYNC_UTC_OFFSET_MINUTES = 480;

export const HEALTH_DAILY_METRICS = [
  'steps',
  'active_energy',
  'distance',
  'sleep',
  'resting_hr',
  'hrv',
  'spo2',
] as const;

export type HealthDailyMetric = (typeof HEALTH_DAILY_METRICS)[number];

export const HEALTH_DAILY_METRIC_LABELS: Record<HealthDailyMetric, string> = {
  steps: '步数',
  active_energy: '活动能量',
  distance: '步行+跑步距离',
  sleep: '睡眠',
  resting_hr: '静息心率',
  hrv: 'HRV',
  spo2: '血氧',
};

export type HealthDailyRow = {
  metric: HealthDailyMetric;
  date: string;
  value: number;
  /** 写入时这一天（北京时间）是否已经结束。 */
  complete: 0 | 1;
};

export type HealthSyncMetricReport = {
  metric: HealthDailyMetric;
  label: string;
  /** written：有数据写入；empty：字段在但没有样本；missing：没传这一项；error：结构错误。 */
  status: 'written' | 'empty' | 'missing' | 'error';
  days: number;
  from: string | null;
  to: string | null;
  /** 日期落在本次窗口之外（since 当天及更早、或晚于今天）而被略过的行数。 */
  outOfWindow: number;
  /** 日期或数值无法解析、或超出合理范围而被丢弃的行数。 */
  rejected: number;
  examples: string[];
  message?: string;
};

export type HealthSyncPlan = {
  /** 本次数据完整覆盖的起点（不含当天）。 */
  since: string;
  today: string;
  rows: HealthDailyRow[];
  reports: HealthSyncMetricReport[];
  /** 无法归类的睡眠类别原文，最多 10 个。 */
  unknownSleepValues: string[];
};

export type HealthSyncResult = { ok: true; plan: HealthSyncPlan } | { ok: false; error: string };

/** 单个字段最多接受的行数：约两年的原始睡眠片段，防止异常请求占满 CPU。 */
const MAX_LINES_PER_FIELD = 40_000;
/** since 最早只能回溯这么多天，限定一次写入的规模。 */
const MAX_SYNC_DAYS = 800;
const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const MAX_EXAMPLES = 3;

type QuantitySpec = {
  metric: Exclude<HealthDailyMetric, 'sleep'>;
  dateField: string;
  valueField: string;
  aggregate: 'sum' | 'mean';
  min: number;
  max: number;
  /** 把带单位提示的读数换算成存储单位；返回 null 表示单位无法识别。 */
  normalize?: (value: number, unitHint: string) => number | null;
};

const QUANTITY_SPECS: QuantitySpec[] = [
  { metric: 'steps', dateField: 'steps_date', valueField: 'steps_value', aggregate: 'sum', min: 0, max: 150_000 },
  {
    metric: 'active_energy',
    dateField: 'energy_date',
    valueField: 'energy_value',
    aggregate: 'sum',
    min: 0,
    max: 10_000,
    // 存 kcal。健康 App 若设成千焦，读数会带 kJ / 千焦。
    normalize: (value, unit) => {
      if (unit === '' || /kcal|cal|千卡|大卡|卡路里/i.test(unit)) return value;
      if (/kj|千焦/i.test(unit)) return value / 4.184;
      return null;
    },
  },
  {
    metric: 'distance',
    dateField: 'distance_date',
    valueField: 'distance_value',
    aggregate: 'sum',
    min: 0,
    max: 300,
    // 存 km。
    normalize: (value, unit) => {
      if (unit === '' || /km|公里|千米/i.test(unit)) return value;
      if (/mi|英里/i.test(unit)) return value * 1.609344;
      if (/^m$|^米$/i.test(unit)) return value / 1000;
      return null;
    },
  },
  { metric: 'resting_hr', dateField: 'resting_hr_date', valueField: 'resting_hr_value', aggregate: 'mean', min: 25, max: 220 },
  { metric: 'hrv', dateField: 'hrv_date', valueField: 'hrv_value', aggregate: 'mean', min: 1, max: 500 },
  {
    metric: 'spo2',
    dateField: 'spo2_date',
    valueField: 'spo2_value',
    aggregate: 'mean',
    min: 50,
    max: 100,
    // 存百分数。HealthKit 内部是 0–1 的比例，快捷指令可能给 0.95 也可能给 95。
    normalize: (value) => (value <= 1 ? value * 100 : value),
  },
];

const SLEEP_FIELDS = { start: 'sleep_start', end: 'sleep_end', value: 'sleep_value' } as const;
const MAX_SLEEP_SEGMENT_MS = DAY_MS;

// ------------------------------------------------------------------ 基础解析

export type ParsedHealthDate = {
  /** 文本里写的本地日期，不做时区换算。 */
  localDate: string;
  /** 绝对时刻；文本没带时区时按北京时间理解。 */
  ms: number;
};

function pad2(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

function buildDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  offsetMinutes: number,
): ParsedHealthDate | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour > 23 || minute > 59 || second > 60) return null;
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  const ms = Date.UTC(year, month - 1, day, hour, minute, second) - offsetMinutes * MINUTE_MS;
  return { localDate: `${year}-${pad2(month)}-${pad2(day)}`, ms };
}

function parseOffset(text: string | undefined): number | null {
  if (!text) return HEALTH_SYNC_UTC_OFFSET_MINUTES;
  if (text === 'Z' || text === 'z') return 0;
  const matched = /^([+-])(\d{2}):?(\d{2})$/.exec(text);
  if (!matched) return null;
  const minutes = Number(matched[2]) * 60 + Number(matched[3]);
  if (minutes > 14 * 60) return null;
  return matched[1] === '-' ? -minutes : minutes;
}

const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|z|[+-]\d{2}:?\d{2})?)?$/;
const SLASH_DATE = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const CHINESE_DATE = /^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s*(?:星期.|周.))?(?:\s*(上午|下午|凌晨|早上|中午|晚上)?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * 接受快捷指令可能给出的几种日期文本：ISO 8601（推荐，带时区）、
 * 2026/11/10 0:00、2026年11月10日 下午1:30。不带时区的一律按北京时间。
 */
export function parseHealthDate(input: string): ParsedHealthDate | null {
  const text = input.trim();

  let matched = ISO_DATE.exec(text);
  if (matched) {
    const offset = parseOffset(matched[7]);
    if (offset === null) return null;
    return buildDate(
      Number(matched[1]),
      Number(matched[2]),
      Number(matched[3]),
      Number(matched[4] ?? 0),
      Number(matched[5] ?? 0),
      Number(matched[6] ?? 0),
      offset,
    );
  }

  matched = SLASH_DATE.exec(text);
  if (matched) {
    return buildDate(
      Number(matched[1]),
      Number(matched[2]),
      Number(matched[3]),
      Number(matched[4] ?? 0),
      Number(matched[5] ?? 0),
      Number(matched[6] ?? 0),
      HEALTH_SYNC_UTC_OFFSET_MINUTES,
    );
  }

  matched = CHINESE_DATE.exec(text);
  if (matched) {
    let hour = Number(matched[5] ?? 0);
    const period = matched[4];
    if (period === '下午' || period === '晚上') {
      if (hour < 12) hour += 12;
    } else if (period === '中午') {
      if (hour < 11) hour += 12;
    } else if (period && hour === 12) {
      hour = 0;
    }
    return buildDate(
      Number(matched[1]),
      Number(matched[2]),
      Number(matched[3]),
      hour,
      Number(matched[6] ?? 0),
      Number(matched[7] ?? 0),
      HEALTH_SYNC_UTC_OFFSET_MINUTES,
    );
  }

  return null;
}

export type ParsedHealthNumber = { value: number; unitHint: string };

/**
 * 读数文本取开头的数字，剩下的部分当作单位提示（例如「369 千卡」「95%」）。
 * 千分位逗号（12,515）去掉；单个逗号且后面不是三位数时视为小数点。
 */
export function parseHealthNumber(input: string): ParsedHealthNumber | null {
  const text = input.replace(/[\s  ]/g, '');
  const matched = /^([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/.exec(text);
  if (!matched) return null;

  let numeric = matched[1];
  if (numeric.includes(',')) {
    if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(numeric)) {
      numeric = numeric.replace(/,/g, '');
    } else if (/^[+-]?\d+,\d+$/.test(numeric)) {
      numeric = numeric.replace(',', '.');
    } else {
      return null;
    }
  }

  const value = Number(numeric);
  if (!Number.isFinite(value)) return null;
  return { value, unitHint: matched[2] };
}

/** 字段缺失返回 null；字符串按行拆分，数组逐项取文本。 */
function readLines(payload: Record<string, unknown>, field: string): string[] | null | 'invalid' {
  const raw = payload[field];
  if (raw === undefined || raw === null) return null;

  let lines: string[];
  if (typeof raw === 'string') {
    lines = raw.split(/\r\n|\r|\n/);
  } else if (typeof raw === 'number') {
    lines = [String(raw)];
  } else if (Array.isArray(raw)) {
    if (raw.length > MAX_LINES_PER_FIELD) return 'invalid';
    lines = raw.map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item) : ''));
  } else {
    return 'invalid';
  }

  const cleaned = lines.map((line) => line.trim()).filter((line) => line !== '');
  return cleaned.length > MAX_LINES_PER_FIELD ? 'invalid' : cleaned;
}

export function healthLocalDate(ms: number) {
  const shifted = new Date(ms + HEALTH_SYNC_UTC_OFFSET_MINUTES * MINUTE_MS);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}

export function shiftHealthDate(date: string, days: number) {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day) + days * DAY_MS);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function emptyReport(metric: HealthDailyMetric): HealthSyncMetricReport {
  return {
    metric,
    label: HEALTH_DAILY_METRIC_LABELS[metric],
    status: 'missing',
    days: 0,
    from: null,
    to: null,
    outOfWindow: 0,
    rejected: 0,
    examples: [],
  };
}

function rejectLine(report: HealthSyncMetricReport, example: string) {
  report.rejected += 1;
  if (report.examples.length < MAX_EXAMPLES) report.examples.push(example.slice(0, 80));
}

type Window = { since: string; today: string };

function inWindow(date: string, window: Window) {
  return date > window.since && date <= window.today;
}

function finishReport(
  report: HealthSyncMetricReport,
  rows: HealthDailyRow[],
): HealthSyncMetricReport {
  if (rows.length === 0) {
    report.status = report.status === 'missing' ? 'empty' : report.status;
    return report;
  }
  const dates = rows.map((row) => row.date).sort();
  report.status = 'written';
  report.days = rows.length;
  report.from = dates[0];
  report.to = dates[dates.length - 1];
  return report;
}

// ------------------------------------------------------------------ 指标聚合

function planQuantity(
  spec: QuantitySpec,
  payload: Record<string, unknown>,
  window: Window,
): { report: HealthSyncMetricReport; rows: HealthDailyRow[] } {
  const report = emptyReport(spec.metric);
  const dates = readLines(payload, spec.dateField);
  const values = readLines(payload, spec.valueField);

  if (dates === null && values === null) return { report, rows: [] };
  if (dates === 'invalid' || values === 'invalid') {
    report.status = 'error';
    report.message = `${spec.dateField} / ${spec.valueField} 不是文本，或行数超过上限。`;
    return { report, rows: [] };
  }
  if (dates === null || values === null) {
    report.status = 'error';
    report.message = `只收到了 ${dates === null ? spec.valueField : spec.dateField}，缺少另一半。`;
    return { report, rows: [] };
  }
  if (dates.length !== values.length) {
    report.status = 'error';
    report.message = `日期 ${dates.length} 行、数值 ${values.length} 行，对不上。`;
    return { report, rows: [] };
  }

  report.status = 'empty';
  const buckets = new Map<string, { sum: number; count: number }>();
  for (let index = 0; index < dates.length; index += 1) {
    const date = parseHealthDate(dates[index]);
    if (!date) {
      rejectLine(report, `日期无法解析：${dates[index]}`);
      continue;
    }
    if (!inWindow(date.localDate, window)) {
      report.outOfWindow += 1;
      continue;
    }
    const parsed = parseHealthNumber(values[index]);
    if (!parsed) {
      rejectLine(report, `数值无法解析：${values[index]}`);
      continue;
    }
    const normalized = spec.normalize ? spec.normalize(parsed.value, parsed.unitHint) : parsed.value;
    if (normalized === null) {
      rejectLine(report, `单位无法识别：${values[index]}`);
      continue;
    }
    const bucket = buckets.get(date.localDate) ?? { sum: 0, count: 0 };
    bucket.sum += normalized;
    bucket.count += 1;
    buckets.set(date.localDate, bucket);
  }

  const rows: HealthDailyRow[] = [];
  let duplicatedDays = 0;
  for (const [date, bucket] of buckets) {
    if (bucket.count > 1) duplicatedDays += 1;
    const value = spec.aggregate === 'sum' ? bucket.sum : bucket.sum / bucket.count;
    if (value < spec.min || value > spec.max) {
      rejectLine(report, `${date} 的日值 ${round(value, 2)} 超出合理范围 ${spec.min}–${spec.max}`);
      continue;
    }
    rows.push({ metric: spec.metric, date, value: round(value, 4), complete: date < window.today ? 1 : 0 });
  }

  if (spec.aggregate === 'sum' && duplicatedDays > 0) {
    report.message = `${duplicatedDays} 天出现多条记录并已相加；请确认「查找健康样本」按天分组，否则多设备会重复计数。`;
  }

  return { report: finishReport(report, rows), rows };
}

type SleepKind = 'asleep' | 'excluded' | 'unknown';

/**
 * HKCategoryValueSleepAnalysis：0 卧床、1 已睡（未细分）、2 清醒、3 核心、4 深度、5 快速动眼。
 * 快捷指令给出的多半是本地化文字，所以数字和中英文写法都认。先判排除项，
 * 因为「In Bed」「卧床」本身不含「睡」字，而「清醒」要先于泛化的匹配拦下。
 */
export function classifySleepValue(input: string): SleepKind {
  const text = input.replace(/\s+/g, '').toLowerCase();
  if (/^[0-5]$/.test(text)) return text === '0' || text === '2' ? 'excluded' : 'asleep';
  if (/inbed|卧床|在床|awake|清醒|醒着|醒来/.test(text)) return 'excluded';
  if (/asleep|sleep|core|deep|rem|unspecified|睡|核心|深度|快速动眼/.test(text)) return 'asleep';
  return 'unknown';
}

function planSleep(
  payload: Record<string, unknown>,
  window: Window,
  unknownValues: Set<string>,
): { report: HealthSyncMetricReport; rows: HealthDailyRow[] } {
  const report = emptyReport('sleep');
  const starts = readLines(payload, SLEEP_FIELDS.start);
  const ends = readLines(payload, SLEEP_FIELDS.end);
  const kinds = readLines(payload, SLEEP_FIELDS.value);

  if (starts === null && ends === null && kinds === null) return { report, rows: [] };
  if (starts === 'invalid' || ends === 'invalid' || kinds === 'invalid') {
    report.status = 'error';
    report.message = 'sleep_start / sleep_end / sleep_value 不是文本，或行数超过上限。';
    return { report, rows: [] };
  }
  if (starts === null || ends === null || kinds === null) {
    report.status = 'error';
    report.message = '睡眠需要 sleep_start、sleep_end、sleep_value 三个字段同时提供。';
    return { report, rows: [] };
  }
  if (starts.length !== ends.length || starts.length !== kinds.length) {
    report.status = 'error';
    report.message = `开始 ${starts.length} 行、结束 ${ends.length} 行、类别 ${kinds.length} 行，对不上。`;
    return { report, rows: [] };
  }

  report.status = 'empty';
  const segments: { start: number; end: number; endDate: string }[] = [];
  for (let index = 0; index < starts.length; index += 1) {
    const kind = classifySleepValue(kinds[index]);
    if (kind === 'excluded') continue;
    if (kind === 'unknown') {
      if (unknownValues.size < 10) unknownValues.add(kinds[index].slice(0, 40));
      continue;
    }
    const start = parseHealthDate(starts[index]);
    const end = parseHealthDate(ends[index]);
    if (!start || !end) {
      rejectLine(report, `时间无法解析：${starts[index]} → ${ends[index]}`);
      continue;
    }
    if (end.ms <= start.ms || end.ms - start.ms > MAX_SLEEP_SEGMENT_MS) {
      rejectLine(report, `时段不合理：${starts[index]} → ${ends[index]}`);
      continue;
    }
    segments.push({ start: start.ms, end: end.ms, endDate: end.localDate });
  }

  // 合并重叠或首尾相接的片段：多设备、多来源的同一段睡眠只算一次。
  // 合并后的时段整体归到最晚结束那一刻的本地日期，即醒来那天。
  segments.sort((left, right) => left.start - right.start);
  const totals = new Map<string, number>();
  let current: { start: number; end: number; endDate: string } | null = null;
  const flush = () => {
    if (!current) return;
    if (inWindow(current.endDate, window)) {
      totals.set(current.endDate, (totals.get(current.endDate) ?? 0) + (current.end - current.start));
    } else {
      report.outOfWindow += 1;
    }
  };
  for (const segment of segments) {
    if (current && segment.start <= current.end) {
      if (segment.end > current.end) {
        current.end = segment.end;
        current.endDate = segment.endDate;
      }
      continue;
    }
    flush();
    current = { ...segment };
  }
  flush();

  const rows: HealthDailyRow[] = [];
  for (const [date, milliseconds] of totals) {
    const hours = milliseconds / 3_600_000;
    if (hours > 24) {
      rejectLine(report, `${date} 的睡眠合计 ${round(hours, 2)} 小时，超过 24 小时`);
      continue;
    }
    rows.push({ metric: 'sleep', date, value: round(hours, 4), complete: date < window.today ? 1 : 0 });
  }

  return { report: finishReport(report, rows), rows };
}

// ------------------------------------------------------------------ 入口

/**
 * 由 days 推出「完整覆盖」的起点（不含）。
 *
 * 快捷指令的「开始日期在最近 N 天内」可能按滚动 N×24 小时算，也可能按自然日算，
 * 最晚的起点是 N−1 天前的零点：那一天的步数等是完整的，但醒在那天的睡眠可能
 * 始于前一晚、没被查到。所以再让一天，从 N−2 天前起写入：N=10 时写 8 个整天加今天。
 */
function sinceFromDays(raw: unknown, today: string): string | { error: string } {
  const text = typeof raw === 'number' ? String(raw) : typeof raw === 'string' ? raw.trim() : '';
  if (!/^\d{1,4}$/.test(text)) return { error: `days 必须是整数天数：${String(raw).slice(0, 20)}` };
  const days = Number(text);
  if (days < 3) return { error: 'days 至少为 3：最近两天不足以覆盖一个完整日。' };
  if (days > MAX_SYNC_DAYS) return { error: `days 最多 ${MAX_SYNC_DAYS} 天，请分批回填。` };
  return shiftHealthDate(today, 1 - days);
}

/**
 * 把一次同步请求的 JSON 变成要写入的行。只做解析和校验，不碰数据库。
 *
 * 窗口由 days（推荐：与各个「查找健康样本」的「在最近 N 天内」同一个 N）或
 * since（一个时刻，查找的起点）给出。起点所在那天只覆盖了一部分，不写入；
 * 之后到今天的每一天都由本次数据完整给出。
 */
export function planHealthSync(payload: unknown, nowMs: number): HealthSyncResult {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: '请求体必须是 JSON 对象。' };
  }
  const body = payload as Record<string, unknown>;
  const today = healthLocalDate(nowMs);

  let sinceDate: string;
  if (body.days !== undefined && body.days !== null && body.days !== '') {
    const derived = sinceFromDays(body.days, today);
    if (typeof derived !== 'string') return { ok: false, error: derived.error };
    sinceDate = derived;
  } else if (typeof body.since === 'string' && body.since.trim() !== '') {
    const since = parseHealthDate(body.since);
    if (!since) return { ok: false, error: `since 无法解析：${body.since.slice(0, 60)}` };
    sinceDate = since.localDate;
  } else {
    return { ok: false, error: '缺少 days：请把查找的天数（例如 10）作为 days 字段一起发送。' };
  }

  if (sinceDate >= today) {
    return { ok: false, error: `起点（${sinceDate}）必须早于今天（${today}）。` };
  }
  if (sinceDate < shiftHealthDate(today, -MAX_SYNC_DAYS)) {
    return { ok: false, error: `最早只能回溯 ${MAX_SYNC_DAYS} 天，请分批回填。` };
  }

  const window: Window = { since: sinceDate, today };
  const unknownSleepValues = new Set<string>();
  const reports: HealthSyncMetricReport[] = [];
  const rows: HealthDailyRow[] = [];

  for (const spec of QUANTITY_SPECS) {
    const planned = planQuantity(spec, body, window);
    reports.push(planned.report);
    rows.push(...planned.rows);
  }
  const sleep = planSleep(body, window, unknownSleepValues);
  reports.push(sleep.report);
  rows.push(...sleep.rows);

  if (reports.every((report) => report.status === 'missing')) {
    return { ok: false, error: '没有收到任何指标字段，请检查「获取 URL 内容」的请求体。' };
  }

  return {
    ok: true,
    plan: { since: sinceDate, today, rows, reports, unknownSleepValues: [...unknownSleepValues] },
  };
}

/** 给快捷指令「显示结果」看的一段中文摘要。 */
export function summarizeHealthSync(plan: HealthSyncPlan) {
  const parts = plan.reports.map((report) => {
    if (report.status === 'written') {
      const extra = report.rejected > 0 ? `，丢弃 ${report.rejected} 行` : '';
      return `${report.label} ${report.days} 天${extra}`;
    }
    if (report.status === 'empty') return `${report.label} 无样本`;
    if (report.status === 'missing') return `${report.label} 未发送`;
    return `${report.label} 出错`;
  });
  const lines = [`同步 ${plan.since} 之后至 ${plan.today}：${parts.join('、')}。`];
  for (const report of plan.reports) {
    if (report.message) lines.push(`${report.label}：${report.message}`);
    if (report.examples.length > 0) lines.push(`${report.label} 例：${report.examples.join('；')}`);
  }
  if (plan.unknownSleepValues.length > 0) {
    lines.push(`未识别的睡眠类别（已忽略）：${plan.unknownSleepValues.join('、')}`);
  }
  return lines.join('\n');
}
