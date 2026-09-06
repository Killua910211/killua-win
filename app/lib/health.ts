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

/**
 * 该窗口为此前已完成的 Apple Health 七日分析所覆盖的真实日期区间，
 * 是写死的显式常量，不由页面访问时刻计算得出，避免每次访问漂移。
 */
export const HEALTH_WEEKLY_WINDOW_START = '2026-08-25';
export const HEALTH_WEEKLY_WINDOW_END = '2026-08-31';
export const HEALTH_WEEKLY_TIME_ZONE = '北京时间 (UTC+8)';
/** 本周窗口数据的更新时间，与页面级 HEALTH_UPDATED_AT 一致。 */
export const HEALTH_WEEKLY_DATA_UPDATED_AT = HEALTH_UPDATED_AT;

export type HealthMetricStatus = 'ok' | 'zero' | 'unknown' | 'error';

export type HealthWeeklyAverage = {
  label: string;
  value: string;
  unit?: string;
  /** 窗口内实际有读数的天数/夜数。 */
  validDays: number | null;
  /** 窗口总天数/夜数，恒为 7。 */
  totalDays: number;
  sampleUnit: '天' | '夜';
  /**
   * ok：真实读数；zero：真实为 0（非缺失）；
   * unknown：窗口内暂无该指标读数；error：本次读取失败。
   */
  status: HealthMetricStatus;
};

export type HealthWeeklyAverageDisplay = {
  value: string;
  unit?: string;
  note: string | null;
};

export function getHealthWeeklyAverageDisplay(item: HealthWeeklyAverage): HealthWeeklyAverageDisplay {
  if (item.status === 'unknown') return { value: '—', note: '窗口内暂无读数' };
  if (item.status === 'error') return { value: '读取失败', note: '本次读取失败，非真实为 0' };
  if (item.status === 'zero') return { value: item.value, unit: item.unit, note: '真实读数为 0' };
  return { value: item.value, unit: item.unit, note: null };
}

/** 数值来自此前已完成的 Apple Health 七日分析，窗口见 HEALTH_WEEKLY_WINDOW_START/END。 */
export const HEALTH_WEEKLY_AVERAGES: HealthWeeklyAverage[] = [
  { label: '日均步数', value: '13,800', unit: '步 / 日', validDays: 7, totalDays: 7, sampleUnit: '天', status: 'ok' },
  { label: '日均活动能量', value: '493', unit: 'kcal / 日', validDays: 7, totalDays: 7, sampleUnit: '天', status: 'ok' },
  { label: '平均睡眠', value: '7.5', unit: '小时 / 夜', validDays: 7, totalDays: 7, sampleUnit: '夜', status: 'ok' },
  { label: '平均静息心率', value: '64.1', unit: 'bpm', validDays: 7, totalDays: 7, sampleUnit: '天', status: 'ok' },
  { label: '平均 HRV · SDNN', value: '52.4', unit: 'ms', validDays: 7, totalDays: 7, sampleUnit: '天', status: 'ok' },
  { label: '平均血氧饱和度', value: '96.0', unit: '%', validDays: 7, totalDays: 7, sampleUnit: '天', status: 'ok' },
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
      { label: '定位', text: '支持免疫功能、能量代谢、神经系统与骨骼健康，补充多种维生素和矿物质。' },
      { label: '营养价值', text: '1 粒对应标签 2 粒份量的一半：维 A 525 μg、维 C 125 mg、D3 25 μg（1,000 IU）、维 E 8.25 mg、维 K 200 μg、叶酸 333.5 μg DFE、B12 300 μg；另含钙 26 mg、镁 10 mg、锌 7.5 mg、硒 100 μg、碘 37.5 μg。' },
      { label: '注意', text: '随餐通常更易耐受；维 K 拮抗类抗凝药物使用期间需注意相互作用。' },
    ],
  },
  {
    name: 'Thorne Super EPA',
    amount: '1 粒 / 日',
    role: 'Omega-3',
    details: [
      { label: '定位', text: '支持心血管、脑与视觉相关营养需求，补充海洋来源的 Omega-3 脂肪酸。' },
      { label: '营养价值', text: 'EPA 425 mg + DHA 270 mg，合计约 695 mg；约 10 kcal、1 g 脂肪。' },
      { label: '注意', text: '与含脂肪的正餐同服通常更容易坚持；抗凝或抗血小板药物使用期间、近期准备手术时需注意相互作用。' },
    ],
  },
  {
    name: 'Sunfiber AI',
    amount: '6 g / 日',
    role: '水溶性膳食纤维 / 益生元',
    details: [
      { label: '定位', text: '增加水溶性膳食纤维摄入，促进规律排便，并作为益生元支持肠道菌群。' },
      { label: '营养价值', text: '6 g 提供 6 g 水溶性膳食纤维；按 1.9 kcal/g 计为 11.4 kcal。' },
      { label: '注意', text: '用足量水冲调；初次或肠胃敏感时用半量，与药物错开约 2 小时。' },
    ],
  },
  {
    name: 'DAILY NUTS & FRUITS 混合坚果',
    amount: '20 g / 日',
    role: '食物型补充',
    details: [
      { label: '定位', text: '提供不饱和脂肪、维生素 E、镁、铜和纤维，支持心血管、神经肌肉与抗氧化相关营养需求。' },
      { label: '营养价值', text: '20 g 单袋标示为 125 kcal、3.4 g 蛋白质、11.6 g 脂肪、4 g 碳水化合物。' },
      { label: '注意', text: '优先无盐少调味版本；提前称量，过敏者不要食用。' },
    ],
  },
  {
    name: 'Solaray Calcium Citrate',
    amount: '1 粒 / 日',
    role: '补充钙缺口',
    details: [
      { label: '定位', text: '支持骨骼和牙齿健康，也参与肌肉收缩与神经传导，补充每日钙摄入。' },
      { label: '营养价值', text: '每日 1 粒提供 250 mg 元素钙；与 Basic Nutrients 合计约 276 mg 钙。' },
      { label: '注意', text: '与左甲状腺素、部分抗生素或铁剂错开；肾结石史、肾功能异常或高钙血症时需注意总摄入。' },
    ],
  },
  {
    name: 'Thorne Magnesium Glycinate',
    amount: '1 粒 / 日',
    role: '补充镁缺口',
    details: [
      { label: '定位', text: '参与能量代谢、神经传导、肌肉功能与骨骼健康，补充每日镁摄入。' },
      { label: '营养价值', text: '每日 1 粒提供 120 mg 元素镁；与 Basic Nutrients 合计约 130 mg，参与能量代谢、神经传导、肌肉功能与骨骼健康。' },
      { label: '注意', text: '肾功能异常时需注意总摄入；与部分抗生素、双膦酸盐错开。' },
    ],
  },
];

export type HealthNutritionReferenceType = 'RDA' | 'AI' | 'DG' | 'EER' | 'PERSONAL';

export type HealthNutritionCoverage = {
  nutrient: string;
  intake: { amount: number; display: string };
  reference: { amount: number; display: string; type: HealthNutritionReferenceType };
  upperLimit?: {
    amount: number;
    display: string;
    note?: string;
    /** Do not compare a total amount when the UL applies to a narrower form/source. */
    comparable?: boolean;
  };
  /** Labels that use a different unit or nutrient definition are not compared. */
  comparable?: boolean;
  comparisonNote?: string;
};

export type HealthNutritionReferenceStatus = { label: string; progress: number | null };
export type HealthNutritionUpperLimitStatus = {
  label: string;
  tone: 'default' | 'warning' | 'danger';
};

const HEALTH_NUTRITION_REFERENCE_LABELS: Record<HealthNutritionReferenceType, string> = {
  RDA: '推奨量',
  AI: '目安量',
  DG: '目標量',
  EER: '推定能量需要量',
  PERSONAL: '个人中心值',
};

export function getHealthNutritionReferenceLabel(type: HealthNutritionReferenceType) {
  return HEALTH_NUTRITION_REFERENCE_LABELS[type];
}

export function getHealthNutritionReferenceStatus(item: HealthNutritionCoverage): HealthNutritionReferenceStatus {
  if (item.comparable === false) return { label: '不作覆盖判定', progress: null };

  const coverage = item.intake.amount / item.reference.amount;
  if (item.reference.type === 'EER') {
    return { label: '补剂热量占日参考量', progress: Math.min(coverage, 1) };
  }
  if (item.reference.type === 'PERSONAL') {
    return { label: '补剂热量占个人中心值', progress: Math.min(coverage, 1) };
  }
  if (coverage < 0.8) return { label: '部分覆盖', progress: coverage };
  if (coverage < 1) return { label: '接近参考量', progress: coverage };
  return { label: `已达到${getHealthNutritionReferenceLabel(item.reference.type)}`, progress: 1 };
}

export function getHealthNutritionUpperLimitStatus(
  item: HealthNutritionCoverage,
): HealthNutritionUpperLimitStatus | null {
  if (!item.upperLimit) return null;
  const { upperLimit } = item;
  if (item.comparable === false || upperLimit.comparable === false) {
    return { label: upperLimit.display, tone: 'default' };
  }

  const ratio = item.intake.amount / upperLimit.amount;
  const label = `${upperLimit.display} · 当前约为上限的 ${Math.round(ratio * 100)}%`;
  if (ratio >= 1) return { label, tone: 'danger' };
  if (ratio >= 0.8) return { label, tone: 'warning' };
  return { label, tone: 'default' };
}

export const HEALTH_NUTRITION_COVERAGE: HealthNutritionCoverage[] = [
  // 只统计当前 6 项补充方案可直接得到的数值，不包括基础饮食。
  // 参考基准：日本人の食事摂取基準（2025年版），30–49 岁男性。
  // 脂肪与碳水化合物按个人中心值 2,100 kcal / 日换算为克数。
  { nutrient: '蛋白质', intake: { amount: 3.4, display: '3.4 g' }, reference: { amount: 65, display: '65 g / 日', type: 'RDA' } },
  { nutrient: '脂肪', intake: { amount: 12.6, display: '12.6 g' }, reference: { amount: 47, display: '20–30%E（约 47–70 g / 日）', type: 'DG' } },
  { nutrient: '总碳水化合物', intake: { amount: 4, display: '4 g' }, reference: { amount: 263, display: '50–65%E（约 263–341 g / 日）', type: 'DG' } },
  { nutrient: '膳食纤维', intake: { amount: 6, display: '6 g' }, reference: { amount: 22, display: '22 g / 日以上', type: 'DG' } },
  { nutrient: '钙', intake: { amount: 276, display: '约 276 mg' }, reference: { amount: 750, display: '750 mg / 日', type: 'RDA' }, upperLimit: { amount: 2500, display: '耐容上限 2,500 mg / 日' } },
  { nutrient: '镁', intake: { amount: 130, display: '130 mg' }, reference: { amount: 380, display: '380 mg / 日', type: 'RDA' }, upperLimit: { amount: 350, display: '耐容上限 350 mg / 日', note: '仅适用于通常食品以外的来源' } },
  { nutrient: '维生素 A', intake: { amount: 525, display: '525 μg RAE' }, reference: { amount: 900, display: '900 μg RAE / 日', type: 'RDA' }, upperLimit: { amount: 2700, display: '耐容上限 2,700 μg RAE / 日', note: '仅适用于不含前维生素 A 类胡萝卜素的维生素 A', comparable: false } },
  { nutrient: '维生素 C', intake: { amount: 125, display: '125 mg' }, reference: { amount: 100, display: '100 mg / 日', type: 'RDA' } },
  { nutrient: '维生素 D3', intake: { amount: 25, display: '25 μg' }, reference: { amount: 9, display: '9 μg / 日', type: 'AI' }, upperLimit: { amount: 100, display: '耐容上限 100 μg / 日' } },
  { nutrient: '维生素 E', intake: { amount: 8.25, display: '8.25 mg' }, reference: { amount: 6.5, display: '6.5 mg / 日', type: 'AI' }, upperLimit: { amount: 800, display: '耐容上限 800 mg / 日', note: '以 α-生育酚计' } },
  { nutrient: '维生素 K', intake: { amount: 200, display: '200 μg' }, reference: { amount: 150, display: '150 μg / 日', type: 'AI' } },
  { nutrient: '叶酸', intake: { amount: 333.5, display: '333.5 μg DFE' }, reference: { amount: 240, display: '240 μg / 日', type: 'RDA' }, upperLimit: { amount: 1000, display: '耐容上限 1,000 μg / 日', note: '适用于通常食品以外来源的叶酸', comparable: false }, comparable: false, comparisonNote: '标签以 DFE 标示，未换算为日本表内叶酸当量。' },
  { nutrient: '碘', intake: { amount: 37.5, display: '37.5 μg' }, reference: { amount: 140, display: '140 μg / 日', type: 'RDA' }, upperLimit: { amount: 3000, display: '耐容上限 3,000 μg / 日' } },
  { nutrient: '锌', intake: { amount: 7.5, display: '7.5 mg' }, reference: { amount: 9.5, display: '9.5 mg / 日', type: 'RDA' }, upperLimit: { amount: 45, display: '耐容上限 45 mg / 日' } },
  { nutrient: 'Omega-3（EPA + DHA）', intake: { amount: 695, display: '695 mg' }, reference: { amount: 2200, display: 'n-3 系脂肪酸 2.2 g / 日', type: 'AI' }, comparable: false, comparisonNote: 'EPA + DHA 不能直接等同于 n-3 系脂肪酸总量。' },
  { nutrient: '额外热量', intake: { amount: 146.4, display: '约 146.4 kcal' }, reference: { amount: 2100, display: '2,100 kcal / 日', type: 'PERSONAL' } },
];

export type SmokingCessationRecord = {
  lastSmokingAt: string;
  lastSmokingAtISO: string;
  timeZone: string;
  smokingHistory: string;
  dailyCigarettes: string;
  source: string;
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
  source: 'ChatGPT 历史用户自述 + 用户确认',
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
