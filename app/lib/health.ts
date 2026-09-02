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

export type HealthSupplement = {
  name: string;
  amount: string;
  role: string;
  detail: string;
};

export const HEALTH_SUPPLEMENTS: HealthSupplement[] = [
  {
    name: 'Thorne Basic Nutrients 2/Day',
    amount: '1 粒 / 日',
    role: '综合维生素与矿物质',
    detail: '广谱补充维生素与矿物质；1 粒约含维 A 525 μg、维 C 125 mg、D3 25 μg（1,000 IU）、维 K 约 200 μg、叶酸约 333 μg DFE、B12 约 300 μg，并含锌、硒、碘等。随餐通常更易耐受；使用维 K 拮抗类抗凝药时先咨询。',
  },
  {
    name: 'Thorne Super EPA',
    amount: '1 粒 / 日',
    role: 'Omega-3',
    detail: '浓缩鱼油，EPA 425 mg + DHA 270 mg，合计约 695 mg；约 10 kcal、1 g 脂肪。与含脂肪的正餐同服通常更容易坚持；使用抗凝或抗血小板药物、近期准备手术时先确认。',
  },
  {
    name: 'Sunfiber AI',
    amount: '约 6 g / 日',
    role: '水溶性膳食纤维 / 益生元',
    detail: '以部分水解瓜尔胶为主；约 6 g 粉含约 5.1 g 水溶性膳食纤维、约 12.5 kcal。用足量水冲调；初次或肠胃敏感时先用半量，与药物最好错开约 2 小时。',
  },
  {
    name: 'DAILY NUTS & FRUITS 混合坚果',
    amount: '20 g / 日',
    role: '食物型补充',
    detail: '四种坚果按固定份量补充不饱和脂肪、维生素 E、镁、铜和少量纤维；20 g 约 120–130 kcal、10–12 g 脂肪、1–2 g 纤维，数值随配比浮动。优先无盐少调味版本；有坚果过敏时不要食用。',
  },
  {
    name: 'Solaray Calcium Citrate',
    amount: '1 粒起 / 日',
    role: '补充钙缺口',
    detail: '柠檬酸钙补充剂；按当前版本估算，每粒约 250 mg 元素钙。评估的是总钙摄入，不是额外补满固定剂量；与左甲状腺素、部分抗生素或铁剂需按说明错开，肾结石史、肾功能异常或高钙血症者先咨询。',
  },
  {
    name: 'Thorne Magnesium Glycinate',
    amount: '1 粒 / 日',
    role: '补充镁缺口',
    detail: '甘氨酸镁 / 双甘氨酸镁补充剂；按当前版本估算，每粒约 120 mg 元素镁，参与能量代谢、神经传导、肌肉功能与骨骼健康。以个人耐受和产品标签为准；肾功能异常者先咨询，与部分抗生素、双膦酸盐需错开。',
  },
];

export type HealthNutritionCoverage = {
  label: string;
  status: string;
  detail: string;
};

export const HEALTH_NUTRITION_COVERAGE: HealthNutritionCoverage[] = [
  { label: '维生素与微量元素', status: '广谱覆盖', detail: 'Basic Nutrients 约提供维 A、C、D3、E、K、B 族、叶酸、B12，以及锌、硒、碘等。' },
  { label: 'Omega-3', status: '已纳入', detail: 'Super EPA 每日提供约 695 mg EPA + DHA。' },
  { label: '钙与镁', status: '定向补充', detail: 'Calcium Citrate 每粒约 250 mg 元素钙；Magnesium Glycinate 每粒约 120 mg 元素镁。' },
  { label: '膳食纤维', status: '有所改善', detail: 'Sunfiber 约提供 5.1 g 水溶性纤维，坚果再提供少量；不能替代多样化食物。' },
  { label: '优质脂肪', status: '已纳入', detail: '坚果提供单/多不饱和脂肪，Super EPA 提供 EPA 与 DHA。' },
  { label: '钾', status: '仍需留意', detail: '这套补充方案没有直接解决钾；不自行使用高剂量钾片。' },
  { label: '植物性食物多样性', status: '仍是缺口', detail: '补剂不能完整提供植物食物中的天然纤维、多酚和类胡萝卜素。' },
  { label: '额外热量', status: '约 145–155 kcal / 日', detail: '20 g 坚果约 120–130 kcal，Super EPA 约 10 kcal，Sunfiber 约 12.5 kcal。' },
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
