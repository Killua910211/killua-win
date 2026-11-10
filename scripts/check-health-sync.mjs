#!/usr/bin/env node
/**
 * Apple Health 同步解析的回归测试。
 *
 * app/lib/health-sync.ts 是纯函数、零依赖、只用可擦除的 TS 语法，所以 Node 直接
 * import 就能跑（需要类型擦除：Node 22.18+ 默认开启，更早的 22.x 由 package.json
 * 里的 --experimental-strip-types 打开）。
 *
 * 覆盖：日期与数值文本的几种写法、睡眠类别归类、按日聚合与窗口边界、
 * 结构错误的报告方式，以及一次约一年的回填请求的解析耗时。
 *
 *   pnpm test:health-sync
 */

import {
  classifySleepValue,
  parseHealthDate,
  parseHealthNumber,
  planHealthSync,
  summarizeHealthSync,
} from '../app/lib/health-sync.ts';

const failures = [];
function check(ok, message) {
  if (!ok) failures.push(message);
}
function near(actual, expected, tolerance = 1e-6) {
  return typeof actual === 'number' && Math.abs(actual - expected) <= tolerance;
}

// ------------------------------------------------------------------ 日期文本

const dateCases = [
  ['2026-11-10T00:00:00+08:00', '2026-11-10', Date.UTC(2026, 10, 9, 16)],
  ['2026-11-10T23:30:00+0800', '2026-11-10', Date.UTC(2026, 10, 10, 15, 30)],
  ['2026-11-10T08:15:00Z', '2026-11-10', Date.UTC(2026, 10, 10, 8, 15)],
  ['2026-11-10T08:15:00.123+09:00', '2026-11-10', Date.UTC(2026, 10, 9, 23, 15)],
  ['2026-11-10', '2026-11-10', Date.UTC(2026, 10, 9, 16)],
  ['2026-11-10 07:05', '2026-11-10', Date.UTC(2026, 10, 9, 23, 5)],
  ['2026/11/10 0:00', '2026-11-10', Date.UTC(2026, 10, 9, 16)],
  ['2026年11月10日 下午1:30', '2026-11-10', Date.UTC(2026, 10, 10, 5, 30)],
  ['2026年11月10日 上午12:10', '2026-11-10', Date.UTC(2026, 10, 9, 16, 10)],
  ['2026年11月10日 中午12:10', '2026-11-10', Date.UTC(2026, 10, 10, 4, 10)],
  ['2026年11月10日', '2026-11-10', Date.UTC(2026, 10, 9, 16)],
];
for (const [text, localDate, ms] of dateCases) {
  const parsed = parseHealthDate(text);
  check(parsed?.localDate === localDate && parsed?.ms === ms, `parseHealthDate(${text}) = ${JSON.stringify(parsed)}`);
}
for (const text of ['2026-02-30', '2026-13-01T00:00:00+08:00', 'Nov 10, 2026', '', '2026-11-10T25:00:00+08:00']) {
  check(parseHealthDate(text) === null, `parseHealthDate(${JSON.stringify(text)}) 应当拒绝`);
}

// ------------------------------------------------------------------ 数值文本

const numberCases = [
  ['12515', 12515, ''],
  ['12,515', 12515, ''],
  ['1,234,567.5', 1234567.5, ''],
  ['65.789', 65.789, ''],
  ['65,8', 65.8, ''],
  ['369 千卡', 369, '千卡'],
  ['1544 kJ', 1544, 'kJ'],
  ['95%', 95, '%'],
  ['0.95', 0.95, ''],
  [' 61 ', 61, ''],
];
for (const [text, value, unitHint] of numberCases) {
  const parsed = parseHealthNumber(text);
  check(near(parsed?.value, value) && parsed?.unitHint === unitHint, `parseHealthNumber(${text}) = ${JSON.stringify(parsed)}`);
}
for (const text of ['', 'abc', '1,23,4']) {
  check(parseHealthNumber(text) === null, `parseHealthNumber(${JSON.stringify(text)}) 应当拒绝`);
}

// ------------------------------------------------------------------ 睡眠类别

const sleepCases = [
  ['In Bed', 'excluded'], ['卧床', 'excluded'], ['Awake', 'excluded'], ['清醒', 'excluded'],
  ['Asleep', 'asleep'], ['Asleep (Unspecified)', 'asleep'], ['Core', 'asleep'], ['Deep', 'asleep'],
  ['REM', 'asleep'], ['核心睡眠', 'asleep'], ['深度睡眠', 'asleep'], ['快速动眼', 'asleep'], ['已入睡', 'asleep'],
  ['0', 'excluded'], ['2', 'excluded'], ['1', 'asleep'], ['3', 'asleep'], ['5', 'asleep'],
  ['Something', 'unknown'],
];
for (const [text, kind] of sleepCases) {
  check(classifySleepValue(text) === kind, `classifySleepValue(${text}) = ${classifySleepValue(text)}，应为 ${kind}`);
}

// ------------------------------------------------------------------ 聚合与窗口

// 「现在」是 2026-11-11 12:30（北京时间）。since 为 2026-11-07 12:30：
// 11-07 只覆盖了一部分不写入；11-08 至 11-10 已结束；11-11 写入但标记未完成。
const now = Date.UTC(2026, 10, 11, 4, 30);
const lines = (...items) => items.join('\n');

const payload = {
  since: '2026-11-07T12:30:00+08:00',
  steps_date: lines('2026-11-07T00:00:00+08:00', '2026-11-08T00:00:00+08:00', '2026-11-09T00:00:00+08:00', '2026-11-10T00:00:00+08:00', '2026-11-11T00:00:00+08:00'),
  steps_value: lines('4,000', '12,000', '9,500', '13,001', '3,200'),
  energy_date: ['2026-11-08', '2026-11-09'],
  energy_value: ['400', '1673.6 kJ'],
  distance_date: lines('2026-11-08', '2026-11-09'),
  distance_value: lines('8.5', '7'),
  // 静息心率 11-09 两条取均值；11-10 缺失就是缺失，不补 0。
  resting_hr_date: lines('2026-11-08T07:00:00+08:00', '2026-11-09T07:00:00+08:00', '2026-11-09T21:00:00+08:00'),
  resting_hr_value: lines('60', '62', '64'),
  hrv_date: lines('2026-11-08T03:00:00+08:00', '2026-11-08T05:00:00+08:00'),
  hrv_value: lines('50', '70'),
  spo2_date: lines('2026-11-08T03:00:00+08:00', '2026-11-08T04:00:00+08:00'),
  spo2_value: lines('0.95', '0.97'),
  // 11-08 醒来那一夜：23:30 起跨午夜，核心与深度重叠，卧床、清醒不计，
  // 另有手表与手机重复记录的同一时段。还有一个白天小睡和一个无法识别的类别。
  sleep_start: lines(
    '2026-11-07T23:30:00+08:00',
    '2026-11-08T01:00:00+08:00',
    '2026-11-08T01:30:00+08:00',
    '2026-11-07T23:00:00+08:00',
    '2026-11-08T07:00:00+08:00',
    '2026-11-08T14:00:00+08:00',
    '2026-11-09T01:00:00+08:00',
    '2026-11-09T02:00:00+08:00',
  ),
  sleep_end: lines(
    '2026-11-08T02:00:00+08:00',
    '2026-11-08T07:00:00+08:00',
    '2026-11-08T03:00:00+08:00',
    '2026-11-08T08:00:00+08:00',
    '2026-11-08T07:20:00+08:00',
    '2026-11-08T14:30:00+08:00',
    '2026-11-09T08:00:00+08:00',
    '2026-11-09T03:00:00+08:00',
  ),
  sleep_value: lines('Core', 'Deep', 'REM', 'In Bed', 'Awake', '核心睡眠', 'Asleep', 'Mystery'),
};

const result = planHealthSync(payload, now);
check(result.ok, `planHealthSync 应当成功：${JSON.stringify(result)}`);
if (result.ok) {
  const { plan } = result;
  const row = (metric, date) => plan.rows.find((item) => item.metric === metric && item.date === date);
  const report = (metric) => plan.reports.find((item) => item.metric === metric);

  check(plan.since === '2026-11-07' && plan.today === '2026-11-11', `窗口 ${plan.since} → ${plan.today}`);
  check(row('steps', '2026-11-07') === undefined, 'since 当天不应写入');
  check(row('steps', '2026-11-08')?.value === 12000 && row('steps', '2026-11-08')?.complete === 1, '步数 11-08');
  check(row('steps', '2026-11-11')?.value === 3200 && row('steps', '2026-11-11')?.complete === 0, '今天写入但未完成');
  check(report('steps')?.outOfWindow === 1 && report('steps')?.days === 4, `步数报告 ${JSON.stringify(report('steps'))}`);
  check(near(row('active_energy', '2026-11-09')?.value, 400), `kJ 换算为 kcal：${row('active_energy', '2026-11-09')?.value}`);
  check(row('distance', '2026-11-09')?.value === 7, '距离');
  check(row('resting_hr', '2026-11-09')?.value === 63, '静息心率同日取均值');
  check(row('resting_hr', '2026-11-10') === undefined, '缺失日不补 0');
  check(row('hrv', '2026-11-08')?.value === 60, 'HRV 同日取均值');
  check(near(row('spo2', '2026-11-08')?.value, 96), `血氧比例换算为百分数：${row('spo2', '2026-11-08')?.value}`);
  // 23:30–07:00 合并为 7.5 小时，加 14:00–14:30 小睡 0.5 小时 = 8 小时。
  check(near(row('sleep', '2026-11-08')?.value, 8), `睡眠 11-08 = ${row('sleep', '2026-11-08')?.value}`);
  check(near(row('sleep', '2026-11-09')?.value, 7), `睡眠 11-09 = ${row('sleep', '2026-11-09')?.value}`);
  check(plan.unknownSleepValues.join() === 'Mystery', `未识别类别 ${plan.unknownSleepValues}`);
  check(summarizeHealthSync(plan).includes('步数 4 天'), summarizeHealthSync(plan));
}

// 超出合理范围的日值被丢弃并计数，其余照常写入。
const outlier = planHealthSync(
  { since: '2026-11-07', resting_hr_date: lines('2026-11-08', '2026-11-09'), resting_hr_value: lines('400', '61') },
  now,
);
check(
  outlier.ok && outlier.plan.rows.length === 1 && outlier.plan.reports.find((item) => item.metric === 'resting_hr')?.rejected === 1,
  `越界值应被丢弃：${JSON.stringify(outlier)}`,
);

// 没有按天分组的步数会出现同日多行：照常相加，但要提醒。
const ungrouped = planHealthSync(
  { since: '2026-11-07', steps_date: lines('2026-11-08T08:00:00+08:00', '2026-11-08T09:00:00+08:00'), steps_value: lines('100', '200') },
  now,
);
check(
  ungrouped.ok && ungrouped.plan.reports.find((item) => item.metric === 'steps')?.message?.includes('按天分组'),
  '同日多条步数应提示按天分组',
);

// ------------------------------------------------------------------ 结构错误

const structural = [
  [null, '请求体必须是 JSON 对象'],
  [{ steps_date: '2026-11-08', steps_value: '1' }, '缺少 since'],
  [{ since: '2026-11-11T08:00:00+08:00', steps_date: '2026-11-11', steps_value: '1' }, '必须早于今天'],
  [{ since: '2020-01-01', steps_date: '2026-11-08', steps_value: '1' }, '最早只能回溯'],
  [{ since: '2026-11-07' }, '没有收到任何指标字段'],
];
for (const [body, fragment] of structural) {
  const outcome = planHealthSync(body, now);
  check(!outcome.ok && outcome.error.includes(fragment), `结构错误「${fragment}」：${JSON.stringify(outcome)}`);
}

const mismatched = planHealthSync({ since: '2026-11-07', steps_date: lines('2026-11-08', '2026-11-09'), steps_value: '1' }, now);
check(
  mismatched.ok && mismatched.plan.reports.find((item) => item.metric === 'steps')?.status === 'error',
  '日期与数值行数不一致时该指标报错，不写入',
);
const halfSleep = planHealthSync({ since: '2026-11-07', sleep_start: '2026-11-08T01:00:00+08:00' }, now);
check(
  halfSleep.ok && halfSleep.plan.reports.find((item) => item.metric === 'sleep')?.status === 'error',
  '睡眠字段不全时报错',
);

// ------------------------------------------------------------------ 回填规模

// 330 天：累计和离散指标按天分组，每夜 30 段原始睡眠片段。
const backfillNow = Date.UTC(2026, 10, 11, 4, 30);
const days = 330;
const dates = [];
for (let offset = days; offset >= 0; offset -= 1) {
  const date = new Date(backfillNow + 8 * 3_600_000 - offset * 86_400_000).toISOString().slice(0, 10);
  dates.push(date);
}
const sleepStarts = [];
const sleepEnds = [];
const sleepKinds = [];
const kinds = ['Core', 'Deep', 'REM', 'Awake', 'In Bed'];
for (const date of dates) {
  const base = Date.parse(`${date}T00:30:00+08:00`);
  for (let segment = 0; segment < 30; segment += 1) {
    const start = base + segment * 15 * 60_000;
    sleepStarts.push(new Date(start + 8 * 3_600_000).toISOString().replace('Z', '+08:00').replace('.000', ''));
    sleepEnds.push(new Date(start + 16 * 60_000 + 8 * 3_600_000).toISOString().replace('Z', '+08:00').replace('.000', ''));
    sleepKinds.push(kinds[segment % kinds.length]);
  }
}
const grouped = (value) => ({ date: dates.map((date) => `${date}T00:00:00+08:00`).join('\n'), value: dates.map(() => value).join('\n') });
const backfill = {
  since: `${dates[0]}T12:30:00+08:00`,
  steps_date: grouped('9,000').date, steps_value: grouped('9,000').value,
  energy_date: grouped('350').date, energy_value: grouped('350').value,
  distance_date: grouped('6.1').date, distance_value: grouped('6.1').value,
  resting_hr_date: grouped('62').date, resting_hr_value: grouped('62').value,
  hrv_date: grouped('55.5').date, hrv_value: grouped('55.5').value,
  spo2_date: grouped('0.96').date, spo2_value: grouped('0.96').value,
  sleep_start: sleepStarts.join('\n'), sleep_end: sleepEnds.join('\n'), sleep_value: sleepKinds.join('\n'),
};
const bodyText = JSON.stringify(backfill);
const started = performance.now();
const parsedBackfill = planHealthSync(JSON.parse(bodyText), backfillNow);
const elapsed = performance.now() - started;
check(parsedBackfill.ok && parsedBackfill.plan.rows.length === days * 7, `回填应写入 ${days * 7} 行：${parsedBackfill.ok ? parsedBackfill.plan.rows.length : parsedBackfill.error}`);

// ------------------------------------------------------------------ 结果

if (failures.length > 0) {
  console.error(`✗ health-sync：${failures.length} 项失败`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `✓ health-sync：日期 ${dateCases.length}、数值 ${numberCases.length}、睡眠类别 ${sleepCases.length} 项与聚合断言全部通过；` +
    `${days} 天回填（${(bodyText.length / 1024).toFixed(0)} KB、${sleepStarts.length} 段睡眠）解析 ${elapsed.toFixed(1)} ms。`,
);
