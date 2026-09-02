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

export type HealthNutritionRoutine = {
  time: string;
  items: string[];
  focus: string;
};

/** 根据 ChatGPT 对话中最终确认的每日饮食与补充安排。 */
export const HEALTH_NUTRITION_ROUTINE: HealthNutritionRoutine[] = [
  {
    time: '中午',
    items: [
      '全蛋 3 个 + 蛋白 3 个',
      '牛奶约 300 ml',
      'Thorne Basic Nutrients 2/Day · 1 粒',
      'Solaray Calcium Citrate · 1 粒',
    ],
    focus: '高质量蛋白、胆碱、钙与基础微量营养。',
  },
  {
    time: '白天',
    items: ['4 种混合坚果 · 20 g', 'Sunfiber AI · 先 3 g，适应后 6 g'],
    focus: '维生素 E、镁、不饱和脂肪与水溶性膳食纤维。',
  },
  {
    time: '晚餐 / 睡前',
    items: [
      '偏瘦牛肉约 270 g + 米饭约 2 碗',
      'Thorne Super EPA · 1 粒',
      'Thorne Magnesium Glycinate · 1 粒',
    ],
    focus: '高质量蛋白、EPA/DHA 与镁。',
  },
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
    detail: '约含维 C 125 mg、D3 25 μg、维 K 200 μg、叶酸 333 μg DFE、锌 7.5 mg、硒 100 μg。',
  },
  {
    name: 'Thorne Super EPA',
    amount: '1 粒 / 日',
    role: 'Omega-3',
    detail: 'EPA 425 mg + DHA 270 mg，合计约 695 mg；约 10 kcal、1 g 脂肪。',
  },
  {
    name: 'Sunfiber AI',
    amount: '3 g → 6 g / 日',
    role: '水溶性膳食纤维 / 益生元',
    detail: '先从 3 g 适应，之后约 6 g；6 g 粉约含 5.1 g 膳食纤维，可加入水、牛奶或咖啡。',
  },
  {
    name: 'DAILY NUTS & FRUITS 混合坚果',
    amount: '20 g / 日',
    role: '食物型补充',
    detail: '无盐无油的杏仁、核桃、腰果与夏威夷果；约 125 kcal、11.6 g 脂肪、3.4 g 蛋白质。',
  },
  {
    name: 'Solaray Calcium Citrate',
    amount: '1 粒 / 日',
    role: '补充钙缺口',
    detail: '按当前版本估算，每粒约 250 mg 元素钙；奶制品特别少时再评估是否增加。',
  },
  {
    name: 'Thorne Magnesium Glycinate',
    amount: '1 粒 / 日',
    role: '补充镁缺口',
    detail: '按当前版本估算，每粒约 120 mg 元素镁，安排在晚餐后或睡前。',
  },
];

export type HealthNutritionCoverage = {
  label: string;
  status: string;
  detail: string;
};

export const HEALTH_NUTRITION_COVERAGE: HealthNutritionCoverage[] = [
  { label: '蛋白质', status: '强项', detail: '约 110–125 g / 日，主要来自蛋、奶与偏瘦牛肉。' },
  { label: '脂肪', status: '基本合适', detail: '目标约 50–65 g / 日；坚果与鱼油改善脂肪质量。' },
  { label: '维生素与微量元素', status: '已补强', detail: '复合维生素提供基础兜底，但不等同于蔬菜水果。' },
  { label: '钙与镁', status: '定向补充', detail: '牛奶、坚果与单独的钙镁产品共同覆盖。' },
  { label: '膳食纤维', status: '有所改善', detail: 'Sunfiber 解决一部分缺口，但总量仍可能低于理想水平。' },
  { label: '钾', status: '仍需留意', detail: '不使用高剂量钾片；优先低钠盐或偶尔摄入含钾食物。' },
  { label: '植物性食物多样性', status: '仍是缺口', detail: '补剂不能替代水果、蔬菜、豆类带来的天然纤维与植物化合物。' },
  { label: '额外热量', status: '约 150 kcal / 日', detail: '主要来自 20 g 坚果；鱼油约 10 kcal，Sunfiber 约 12.5 kcal。' },
  { label: '总热量', status: '持续观察', detail: '估算受牛肉部位、牛奶种类、米饭份量与活动量影响。' },
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
