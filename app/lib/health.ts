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

export type HealthSupplementDetail = {
  label: string;
  text: string;
};

export type HealthSupplement = {
  name: string;
  amount: string;
  role: string;
  details: HealthSupplementDetail[];
};

export const HEALTH_SUPPLEMENTS: HealthSupplement[] = [
  {
    name: 'Thorne Basic Nutrients 2/Day',
    amount: '1 粒 / 日',
    role: '综合维生素与矿物质',
    details: [
      { label: '定位', text: '广谱补充维生素与矿物质，覆盖当前记录中较容易不足的项目。' },
      { label: '营养价值', text: '1 粒对应标签 2 粒份量的一半：维 A 525 μg、维 C 125 mg、D3 25 μg（1,000 IU）、维 E 8.25 mg、维 K 200 μg、叶酸 333.5 μg DFE、B12 300 μg；另含钙 26 mg、镁 10 mg、锌 7.5 mg、硒 100 μg、碘 37.5 μg。' },
      { label: '注意', text: '随餐通常更易耐受；使用维 K 拮抗类抗凝药时先咨询。' },
    ],
  },
  {
    name: 'Thorne Super EPA',
    amount: '1 粒 / 日',
    role: 'Omega-3',
    details: [
      { label: '定位', text: '浓缩鱼油，用于补充海洋来源的 Omega-3 脂肪酸。' },
      { label: '营养价值', text: 'EPA 425 mg + DHA 270 mg，合计约 695 mg；约 10 kcal、1 g 脂肪。' },
      { label: '注意', text: '与含脂肪的正餐同服通常更容易坚持；使用抗凝或抗血小板药物、近期准备手术时先确认。' },
    ],
  },
  {
    name: 'Sunfiber AI',
    amount: '6 g / 日',
    role: '水溶性膳食纤维 / 益生元',
    details: [
      { label: '定位', text: '以部分水解瓜尔胶为主的水溶性膳食纤维产品。' },
      { label: '营养价值', text: '6 g 提供 6 g 水溶性膳食纤维；按 1.9 kcal/g 计为 11.4 kcal。' },
      { label: '注意', text: '用足量水冲调；初次或肠胃敏感时先用半量，与药物最好错开约 2 小时。' },
    ],
  },
  {
    name: 'DAILY NUTS & FRUITS 混合坚果',
    amount: '20 g / 日',
    role: '食物型补充',
    details: [
      { label: '定位', text: '按固定份量补充不饱和脂肪、维生素 E、镁、铜和少量纤维。' },
      { label: '营养价值', text: '20 g 单袋标示为 125 kcal、3.4 g 蛋白质、11.6 g 脂肪、4 g 碳水化合物。' },
      { label: '注意', text: '优先无盐少调味版本；提前称量，过敏者不要食用。' },
    ],
  },
  {
    name: 'Solaray Calcium Citrate',
    amount: '1 粒 / 日',
    role: '补充钙缺口',
    details: [
      { label: '定位', text: '柠檬酸钙补充剂，用于补足每日总钙摄入。' },
      { label: '营养价值', text: '每日 1 粒提供 250 mg 元素钙；与 Basic Nutrients 合计约 276 mg 钙。' },
      { label: '注意', text: '与左甲状腺素、部分抗生素或铁剂需按说明错开；肾结石史、肾功能异常或高钙血症者先咨询。' },
    ],
  },
  {
    name: 'Thorne Magnesium Glycinate',
    amount: '1 粒 / 日',
    role: '补充镁缺口',
    details: [
      { label: '定位', text: '甘氨酸镁 / 双甘氨酸镁补充剂，用于填补每日镁摄入缺口。' },
      { label: '营养价值', text: '每日 1 粒提供 120 mg 元素镁；与 Basic Nutrients 合计约 130 mg，参与能量代谢、神经传导、肌肉功能与骨骼健康。' },
      { label: '注意', text: '肾功能异常者先咨询；与部分抗生素、双膦酸盐需错开。' },
    ],
  },
];

export type HealthNutritionCoverage = {
  nutrient: string;
  intake: string;
  reference: string;
  coverage: string;
  visual: number | null;
  judgment: string;
};

export const HEALTH_NUTRITION_COVERAGE: HealthNutritionCoverage[] = [
  // 只统计当前 6 项补充方案可直接得到的数值，不包括基础饮食。
  { nutrient: '蛋白质', intake: '3.4 g', reference: '50 g / 日', coverage: '≈7%', visual: 7, judgment: '仅少量贡献' },
  { nutrient: '脂肪', intake: '12.6 g', reference: '78 g / 日', coverage: '≈16%', visual: 16, judgment: '少量贡献' },
  { nutrient: '总碳水化合物', intake: '4 g', reference: '275 g / 日', coverage: '≈1%', visual: 1, judgment: '影响较小' },
  { nutrient: '膳食纤维', intake: '6 g', reference: '28 g / 日', coverage: '≈21%', visual: 21, judgment: '部分覆盖' },
  { nutrient: '钙', intake: '约 276 mg', reference: '成人 19–50 岁 1,000 mg / 日', coverage: '≈28%', visual: 28, judgment: '部分覆盖' },
  { nutrient: '镁', intake: '130 mg', reference: '420 mg / 日', coverage: '≈31%', visual: 31, judgment: '部分覆盖' },
  { nutrient: '维生素 A', intake: '525 μg', reference: '900 μg / 日', coverage: '≈58%', visual: 58, judgment: '部分覆盖' },
  { nutrient: '维生素 C', intake: '125 mg', reference: '90 mg / 日', coverage: '≥139%', visual: 100, judgment: '已达到参考值' },
  { nutrient: '维生素 D3', intake: '25 μg', reference: '20 μg / 日', coverage: '≥125%', visual: 100, judgment: '已达到参考值' },
  { nutrient: '维生素 E', intake: '8.25 mg', reference: '15 mg / 日', coverage: '≈55%', visual: 55, judgment: '部分覆盖' },
  { nutrient: '维生素 K', intake: '200 μg', reference: '120 μg / 日', coverage: '≥167%', visual: 100, judgment: '已达到参考值' },
  { nutrient: '叶酸', intake: '333.5 μg DFE', reference: '400 μg DFE / 日', coverage: '≈83%', visual: 83, judgment: '接近参考值' },
  { nutrient: '碘', intake: '37.5 μg', reference: '150 μg / 日', coverage: '≈25%', visual: 25, judgment: '部分覆盖' },
  { nutrient: '锌', intake: '7.5 mg', reference: '11 mg / 日', coverage: '≈68%', visual: 68, judgment: '部分覆盖' },
  { nutrient: 'Omega-3（EPA + DHA）', intake: '695 mg', reference: '无统一 %DV', coverage: '—', visual: null, judgment: '已纳入' },
  { nutrient: '额外热量', intake: '约 146.4 kcal', reference: '2,000 kcal / 日', coverage: '≈7%', visual: 7, judgment: '影响较小' },
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
