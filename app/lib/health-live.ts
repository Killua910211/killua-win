import { env } from 'cloudflare:workers';
import { HEALTH_WEEKLY_SPECS, type HealthWeeklyAverage } from '@/app/lib/health';
import {
  HEALTH_DAILY_METRICS,
  healthLocalDate,
  healthWeeklyWindow,
  type HealthDailyMetric,
} from '@/app/lib/health-sync';

/**
 * 健康页「7 日均值」的服务端读取。同步每周一次，窗口以最近一个已同步的完整日为终点。
 *
 * 只在服务端组件里调用：health_daily 没有任何公开读取接口，页面只拿到按周聚合后的
 * 均值。D1 返回的是运行期 JSON，所以每一行都重新校验字段、类型和范围，不依赖
 * 类型断言（见 AGENTS.md 对公开汇总数据的要求）。
 *
 * 「长期趋势」暂时仍用 app/lib/health.ts 里的报告值：今年的日数据要等一次性回填
 * 核对通过后才完整，届时再从这里按年聚合。
 */

const WEEK_DAYS = 7;
/** 聚合结果行数上限：每个指标最多一行。 */
const MAX_AGGREGATE_ROWS = HEALTH_DAILY_METRICS.length;

type Aggregate = { days: number; average: number };

function isMetric(value: unknown): value is HealthDailyMetric {
  return typeof value === 'string' && (HEALTH_DAILY_METRICS as readonly string[]).includes(value);
}

function readAggregate(row: unknown): (Aggregate & { metric: HealthDailyMetric }) | null {
  if (!row || typeof row !== 'object') return null;
  const { metric, days, average } = row as Record<string, unknown>;
  if (!isMetric(metric)) return null;
  if (typeof days !== 'number' || !Number.isInteger(days) || days < 1 || days > WEEK_DAYS) return null;
  if (typeof average !== 'number' || !Number.isFinite(average) || average < 0) return null;
  return { metric, days, average };
}

/**
 * 最近 7 个已同步的完整日（窗口规则见 healthWeeklyWindow：同步每周一次，以最新完整日为终点，
 * 最多比昨天早 7 天）；读取失败返回 null，由调用方显示「读取失败」。
 */
async function loadWeekly(today: string): Promise<Map<HealthDailyMetric, Aggregate> | null> {
  try {
    const latest = await env.DB.prepare(
      `SELECT MAX(date) AS latest FROM health_daily WHERE complete = 1 AND date < ?`,
    )
      .bind(today)
      .first<{ latest: unknown }>();
    const latestDate =
      typeof latest?.latest === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(latest.latest) ? latest.latest : null;
    const window = healthWeeklyWindow(today, latestDate, WEEK_DAYS);

    const result = await env.DB.prepare(
      `SELECT metric, COUNT(*) AS days, AVG(value) AS average
       FROM health_daily
       WHERE complete = 1 AND date >= ? AND date <= ?
       GROUP BY metric`,
    )
      .bind(window.start, window.end)
      .all();

    const weekly = new Map<HealthDailyMetric, Aggregate>();
    for (const row of (result.results ?? []).slice(0, MAX_AGGREGATE_ROWS)) {
      const aggregate = readAggregate(row);
      if (aggregate) weekly.set(aggregate.metric, { days: aggregate.days, average: aggregate.average });
    }
    return weekly;
  } catch (error) {
    console.error('d1.health.weekly_failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function formatAverage(value: number, precision: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/** 以服务端当前时刻为准，算出「7 日均值」的六张卡片。 */
export async function getHealthWeeklyAverages(nowMilliseconds: number): Promise<HealthWeeklyAverage[]> {
  const weekly = await loadWeekly(healthLocalDate(nowMilliseconds));

  return HEALTH_WEEKLY_SPECS.map((spec) => {
    const base = { label: spec.label, unit: spec.unit, totalDays: WEEK_DAYS, sampleUnit: spec.sampleUnit };
    if (!weekly) return { ...base, value: '', validDays: null, status: 'error' as const };

    const aggregate = weekly.get(spec.metric);
    if (!aggregate) return { ...base, value: '', validDays: 0, status: 'unknown' as const };

    return {
      ...base,
      value: formatAverage(aggregate.average, spec.precision),
      validDays: aggregate.days,
      status: aggregate.average === 0 ? ('zero' as const) : ('ok' as const),
    };
  });
}
