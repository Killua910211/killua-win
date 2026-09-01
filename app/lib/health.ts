export const HEALTH_UPDATED_AT = '2026-08-31';
export const HEALTH_COVERAGE_START = '2021-02-20';

export const HEALTH_BIRTH_AT_ISO = '1991-02-11T23:50:00+08:00';

const HEALTH_DAY_MS = 86_400_000;
const HEALTH_REFERENCE_YEARS = 80;
const HEALTH_REFERENCE_YEAR_DAYS = 365.2425;

export type HealthLifeProgressSnapshot = {
  asOfMilliseconds: number;
  elapsedMilliseconds: number;
  totalDays: number;
  percent: number;
};

export function getHealthLifeProgressSnapshot(
  asOfMilliseconds = Date.now(),
): HealthLifeProgressSnapshot {
  const birthMilliseconds = Date.parse(HEALTH_BIRTH_AT_ISO);
  const elapsedMilliseconds = Math.max(0, asOfMilliseconds - birthMilliseconds);
  const totalDays = Math.floor(elapsedMilliseconds / HEALTH_DAY_MS);
  const percent = Math.min(
    100,
    (elapsedMilliseconds / (HEALTH_REFERENCE_YEARS * HEALTH_REFERENCE_YEAR_DAYS * HEALTH_DAY_MS)) * 100,
  );

  return { asOfMilliseconds, elapsedMilliseconds, totalDays, percent };
}

export type HealthWeeklyAverage = {
  label: string;
  value: string;
  unit?: string;
  coverage: string;
};

/** 数值来自此前已完成的 Apple Health 七日分析。 */
export const HEALTH_WEEKLY_AVERAGES: HealthWeeklyAverage[] = [
  { label: '日均步数', value: '13,800', unit: '步 / 日', coverage: '7 / 7 DAYS' },
  { label: '日均活动能量', value: '493', unit: 'kcal / 日', coverage: '7 / 7 DAYS' },
  { label: '平均睡眠', value: '7.5', unit: '小时 / 夜', coverage: '7 / 7 NIGHTS' },
  { label: '平均静息心率', value: '64.1', unit: 'bpm', coverage: '7 / 7 DAYS' },
  { label: '平均 HRV · SDNN', value: '52.4', unit: 'ms', coverage: '7 / 7 DAYS' },
  { label: '平均血氧饱和度', value: '96.0', unit: '%', coverage: '7 / 7 DAYS' },
];

export type SmokingCessationRecord = {
  lastSmokingAt: string;
  lastSmokingAtISO: string;
  timeZone: string;
  smokingHistory: string;
  dailyCigarettes: string;
  relapseStatus: string;
  source: string;
  confirmation: string;
};

/**
 * ChatGPT 历史对话中的用户自述与用户确认，不属于 Apple Health 导出指标。
 * 连续戒烟时间由页面访问时间动态计算。
 */
export const HEALTH_SMOKING_RECORD: SmokingCessationRecord = {
  lastSmokingAt: '2025-12-26 01:30',
  lastSmokingAtISO: '2025-12-26T01:30:00+08:00',
  timeZone: '北京时间 (UTC+8)',
  smokingHistory: '约 20 年',
  dailyCigarettes: '20 支',
  relapseStatus: '已确认没有吸烟',
  source: 'ChatGPT 历史用户自述 + 用户确认',
  confirmation: '已确认',
};

export type HealthTrendPoint = {
  year: number;
  value: number;
};

export type HealthTrendSeries = {
  label: string;
  unit: string;
  precision: number;
  points: HealthTrendPoint[];
};

/** Apple Health 报告中的年度日均序列。 */
export const HEALTH_TRENDS: HealthTrendSeries[] = [
  {
    label: '日均步数',
    unit: '步',
    precision: 0,
    points: [
      { year: 2021, value: 4447.9 },
      { year: 2022, value: 3660.2 },
      { year: 2023, value: 2311.8 },
      { year: 2024, value: 1566.4 },
      { year: 2025, value: 6122.7 },
      { year: 2026, value: 8728.5 },
    ],
  },
  {
    label: '步行 + 跑步距离',
    unit: 'km / 日',
    precision: 1,
    points: [
      { year: 2021, value: 2.7 },
      { year: 2022, value: 2.2 },
      { year: 2023, value: 1.4 },
      { year: 2024, value: 1.0 },
      { year: 2025, value: 4.1 },
      { year: 2026, value: 5.9 },
    ],
  },
  {
    label: '活动能量',
    unit: 'kcal / 日',
    precision: 0,
    points: [
      { year: 2022, value: 56.4 },
      { year: 2023, value: 50.7 },
      { year: 2024, value: 35.2 },
      { year: 2025, value: 266.7 },
      { year: 2026, value: 358.3 },
    ],
  },
  {
    label: '睡眠时长',
    unit: '小时 / 日',
    precision: 2,
    points: [
      { year: 2024, value: 5.31 },
      { year: 2025, value: 6.18 },
      { year: 2026, value: 7.04 },
    ],
  },
  {
    label: '静息心率',
    unit: 'bpm',
    precision: 1,
    points: [
      { year: 2024, value: 78.0 },
      { year: 2025, value: 75.2 },
      { year: 2026, value: 66.3 },
    ],
  },
  {
    label: 'HRV · SDNN',
    unit: 'ms',
    precision: 1,
    points: [
      { year: 2024, value: 39.8 },
      { year: 2025, value: 45.0 },
      { year: 2026, value: 58.4 },
    ],
  },
];
