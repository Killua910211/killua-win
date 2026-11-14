#!/usr/bin/env node
/**
 * 首页天气解析的回归测试。
 *
 * app/lib/weather.ts 的解析部分是纯函数、零依赖、只用可擦除的 TS 语法，
 * 所以 Node 直接 import 就能跑（类型擦除：Node 22.18+ 默认开启，更早的 22.x
 * 由 package.json 里的 --experimental-strip-types 打开）。
 *
 * 覆盖：一份真实的 Open-Meteo 响应、字段缺失与越界时的逐日剔除、
 * WMO 代码的归类与兜底、东京日历日与相对日期的换算。
 *
 *   pnpm test:weather
 */

import {
  dayOffset,
  describeWeatherCode,
  parseTokyoWeather,
  relativeDayLabel,
  tokyoCalendarDate,
  WEATHER_FUTURE_DAYS,
  WEATHER_PAST_DAYS,
} from '../app/lib/weather.ts';

const failures = [];
function check(ok, message) {
  if (!ok) failures.push(message);
}

// --------------------------------------------------------- 真实响应（2026-11-14 东京）

const FIXTURE = {
  latitude: 35.7,
  longitude: 139.6875,
  utc_offset_seconds: 32400,
  timezone: 'Asia/Tokyo',
  current_units: { time: 'iso8601', temperature_2m: '°C', weather_code: 'wmo code' },
  current: {
    time: '2026-11-14T21:45',
    interval: 900,
    temperature_2m: 13.3,
    weather_code: 2,
    relative_humidity_2m: 77,
  },
  daily_units: { time: 'iso8601', temperature_2m_max: '°C' },
  daily: {
    time: [
      '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11',
      '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16',
      '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21',
    ],
    weather_code: [2, 2, 63, 61, 1, 1, 1, 3, 63, 2, 55, 81, 45, 1, 0],
    temperature_2m_max: [19.3, 16.8, 10.5, 11.9, 14.8, 17.8, 19.5, 17.9, 12.7, 18.5, 13.0, 17.2, 18.1, 14.0, 14.4],
    temperature_2m_min: [10.0, 9.0, 8.0, 8.8, 6.8, 7.8, 8.2, 8.8, 10.7, 11.6, 9.9, 9.2, 8.9, 5.6, 3.3],
    precipitation_sum: [0, 0, 9.7, 12.6, 0, 0, 0, 0, 18.6, 0, 2.1, 15.6, 0, 0, 0],
    precipitation_probability_max: [45, 0, 100, 100, 0, 0, 0, 4, 100, 47, 65, 84, 12, 1, 0],
  },
};

const TODAY = '2026-11-14';
const parsed = parseTokyoWeather(FIXTURE, TODAY);

check(parsed !== null, '真实响应应当解析成功');
check(parsed?.days.length === 15, `真实响应应当得到 15 天，实际 ${parsed?.days.length}`);
check(parsed?.days[0]?.date === '2026-11-07', '第一天应当是 11-07');
check(parsed?.days.at(-1)?.date === '2026-11-21', '最后一天应当是 11-21');
check(
  WEATHER_PAST_DAYS === 7 && WEATHER_FUTURE_DAYS === 7 && parsed?.days.length === WEATHER_PAST_DAYS + 1 + WEATHER_FUTURE_DAYS,
  '天数应当正好是「前 7 天 + 今天 + 后 7 天」',
);

const today = parsed?.days.find((day) => day.date === TODAY);
check(today?.weekday === '周六', `11-14 是周六，实际 ${today?.weekday}`);
check(today?.monthDay === '11.14', `monthDay 应当是 11.14，实际 ${today?.monthDay}`);
check(today?.high === 18 && today?.low === 9, `今天应当四舍五入成 18°/9°，实际 ${today?.high}/${today?.low}`);
check(today?.label === '阴' && today?.icon === 'overcast', `WMO 3 应当是阴，实际 ${today?.label}/${today?.icon}`);
check(today?.precipitation === 0 && today?.precipitationChance === 4, '今天的降水量与概率应当原样带出');

const rainy = parsed?.days.find((day) => day.date === '2026-11-15');
check(rainy?.precipitation === 18.6 && rainy?.label === '中雨', '11-15 应当是中雨 18.6 mm');
check(parsed?.days.find((day) => day.date === '2026-11-21')?.weekday === '周六', '11-21 应当是周六');

check(parsed?.now?.temperature === 13, `当前气温应当是 13，实际 ${parsed?.now?.temperature}`);
check(parsed?.now?.observedAt === '21:45', `观测时刻应当是 21:45，实际 ${parsed?.now?.observedAt}`);
check(parsed?.now?.humidity === 77 && parsed?.now?.label === '多云', '当前湿度与说法应当带出');

// --------------------------------------------------------- 结构错误整块拒绝

for (const payload of [null, undefined, 'x', 42, [], {}, { daily: null }, { daily: [] }, { daily: { time: [] } }]) {
  check(parseTokyoWeather(payload, TODAY) === null, `结构错误应当返回 null：${JSON.stringify(payload) ?? 'undefined'}`);
}

// --------------------------------------------------------- 单日字段越界只丢那一天

function daysOf(overrides) {
  const daily = { ...FIXTURE.daily, ...overrides };
  const result = parseTokyoWeather({ ...FIXTURE, daily }, TODAY);
  return result ? result.days : [];
}

const badMax = [...FIXTURE.daily.temperature_2m_max];
badMax[3] = 999;
check(daysOf({ temperature_2m_max: badMax }).length === 14, '越界气温应当只丢掉那一天');
check(!daysOf({ temperature_2m_max: badMax }).some((day) => day.date === '2026-11-10'), '被丢掉的应当是 11-10');

const nullMin = [...FIXTURE.daily.temperature_2m_min];
nullMin[0] = null;
check(daysOf({ temperature_2m_min: nullMin }).length === 14, '缺最低气温应当丢掉那一天');

const badCode = [...FIXTURE.daily.weather_code];
badCode[1] = 3.5;
check(daysOf({ weather_code: badCode }).length === 14, '非整数天气代码应当丢掉那一天');

const badCode2 = [...FIXTURE.daily.weather_code];
badCode2[1] = 120;
check(daysOf({ weather_code: badCode2 }).length === 14, '越界天气代码应当丢掉那一天');

const badDates = [...FIXTURE.daily.time];
badDates[5] = '2026/11/12';
check(daysOf({ time: badDates }).length === 14, '非 YYYY-MM-DD 的日期应当丢掉那一天');

const duplicated = [...FIXTURE.daily.time];
duplicated[6] = '2026-11-12';
check(daysOf({ time: duplicated }).length === 14, '重复日期只保留一条');

// 降水是补充信息：缺了照样画这一天，只是不显示降水。
const noRain = daysOf({ precipitation_sum: new Array(15).fill(null), precipitation_probability_max: new Array(15).fill('x') });
check(noRain.length === 15, '缺降水字段不应当影响天数');
check(noRain.every((day) => day.precipitation === null && day.precipitationChance === null), '缺降水字段应当落到 null');

// 排序不依赖上游顺序。
const shuffled = { ...FIXTURE.daily };
const order = [...FIXTURE.daily.time];
const reversedDaily = {
  time: [...order].reverse(),
  weather_code: [...FIXTURE.daily.weather_code].reverse(),
  temperature_2m_max: [...FIXTURE.daily.temperature_2m_max].reverse(),
  temperature_2m_min: [...FIXTURE.daily.temperature_2m_min].reverse(),
  precipitation_sum: [...FIXTURE.daily.precipitation_sum].reverse(),
  precipitation_probability_max: [...FIXTURE.daily.precipitation_probability_max].reverse(),
};
const reversed = parseTokyoWeather({ ...FIXTURE, daily: { ...shuffled, ...reversedDaily } }, TODAY);
check(reversed?.days[0]?.date === '2026-11-07', '解析结果应当按日期升序');
check(reversed?.days.find((day) => day.date === TODAY)?.high === 18, '乱序输入也应当对上各自的值');

// current 块坏掉时只丢 current，天数照常。
const brokenNow = parseTokyoWeather({ ...FIXTURE, current: { time: 'x', temperature_2m: 13.3, weather_code: 2 } }, TODAY);
check(brokenNow?.now === null && brokenNow?.days.length === 15, 'current 坏掉不应当影响每日数据');

// --------------------------------------------------------- WMO 代码归类

const codeCases = [
  [0, '晴', 'clear'],
  [1, '晴间少云', 'mostly-clear'],
  [2, '多云', 'partly-cloudy'],
  [3, '阴', 'overcast'],
  [48, '雾凇', 'fog'],
  [53, '毛毛雨', 'drizzle'],
  [65, '大雨', 'rain'],
  [75, '大雪', 'snow'],
  [82, '暴雨', 'showers'],
  [95, '雷阵雨', 'thunder'],
];
for (const [code, label, icon] of codeCases) {
  const described = describeWeatherCode(code);
  check(described.label === label && described.icon === icon, `WMO ${code} 应当是 ${label}/${icon}`);
}
// 表里没有的代码按区间兜底，不能抛错也不能变成空白。
for (const code of [4, 20, 44, 49, 59, 68, 79, 88, 97]) {
  const described = describeWeatherCode(code);
  check(typeof described.label === 'string' && described.label.length > 0, `WMO ${code} 应当有兜底说法`);
}

// --------------------------------------------------------- 日期换算

check(tokyoCalendarDate(Date.UTC(2026, 10, 14, 12, 45)) === '2026-11-14', '东京 21:45 仍是当天');
check(tokyoCalendarDate(Date.UTC(2026, 10, 14, 15, 30)) === '2026-11-15', 'UTC 15:30 在东京已是第二天');
check(tokyoCalendarDate(Date.UTC(2026, 11, 31, 15, 0)) === '2027-01-01', '跨年也要算对');

check(dayOffset('2026-11-14', TODAY) === 0, '同一天 offset 为 0');
check(dayOffset('2026-11-07', TODAY) === -7, '一周前 offset 为 -7');
check(dayOffset('2026-11-21', TODAY) === 7, '一周后 offset 为 7');
// 夏令时不影响：两端都按 UTC 零点算纯日历日。
check(dayOffset('2026-04-01', '2026-03-29') === 3, '跨夏令时的日差仍是整数天');
check(dayOffset('2026-13-01', TODAY) === null, '非法日期返回 null');

check(relativeDayLabel(0) === '今天', 'offset 0 应当是今天');
check(relativeDayLabel(1) === '明天' && relativeDayLabel(-1) === '昨天', '±1 应当是明天/昨天');
check(relativeDayLabel(2) === null && relativeDayLabel(-2) === null, '其余日子不另外加说明');

// ---------------------------------------------------------

if (failures.length > 0) {
  console.error(`天气解析测试失败 ${failures.length} 项：`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('天气解析测试通过：真实响应、字段越界、WMO 归类、日期换算。');
