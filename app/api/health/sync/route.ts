import { env } from 'cloudflare:workers';
import { planHealthSync, summarizeHealthSync } from '@/app/lib/health-sync';

export const dynamic = 'force-dynamic';

/** 一年多的原始睡眠片段约 1–2 MB；留足余量，同时挡住异常大的请求。 */
const MAX_BODY_BYTES = 8 * 1024 * 1024;

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

/** 出错时同样带 summary：快捷指令末尾只取 summary 显示，成功失败都能看到原因。 */
function fail(status: number, error: string) {
  return reply(status, { ok: false, error, summary: `同步失败：${error}` });
}

/**
 * 两边先各自做 SHA-256，再逐字节异或累加比较：两个摘要定长 32 字节，
 * 比较耗时不随令牌内容或长度变化，也不会在第一个不同字节处提前返回。
 */
async function tokenMatches(provided: string, expected: string) {
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

/**
 * iPhone 快捷指令推送 Apple Health 每日汇总的写入口。
 *
 * 只写不读：没有任何公开的读取接口，健康页在服务端直接查 health_daily。
 * 同一天重复推送是幂等的覆盖写，所以快捷指令每次都发最近十天，
 * 某天没跑成功，下一次会自动补上。
 */
export async function POST(request: Request) {
  const expected = env.HEALTH_SYNC_TOKEN;
  if (typeof expected !== 'string' || expected.length < 32) {
    console.error('health.sync.token_not_configured');
    return fail(503, '服务端尚未配置同步令牌。');
  }

  const authorization = request.headers.get('authorization') ?? '';
  const provided = /^Bearer\s+(.+)$/i.exec(authorization)?.[1]?.trim() ?? '';
  if (!(await tokenMatches(provided, expected))) {
    return fail(401, '同步令牌无效。');
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) {
    return fail(413, '请求体过大，请缩短回填范围后分批发送。');
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return fail(413, '请求体过大，请缩短回填范围后分批发送。');
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return fail(400, '请求体不是合法的 JSON：请把请求体类型设为 JSON。');
  }

  const result = planHealthSync(payload, Date.now());
  if (!result.ok) return fail(422, result.error);

  const { plan } = result;
  const syncedAt = Date.now();

  if (plan.rows.length > 0) {
    try {
      // 整批行作为一个 JSON 参数交给 json_each，一条语句写完：
      // 不受 D1 每条语句 100 个绑定参数、每次调用查询条数的限制。
      // INSERT … SELECT 接 ON CONFLICT 时，SELECT 必须带 WHERE，否则 ON 会被当成连接条件。
      await env.DB.prepare(
        `INSERT INTO health_daily (metric, date, value, complete, synced_at)
         SELECT json_extract(value, '$.metric'),
                json_extract(value, '$.date'),
                json_extract(value, '$.value'),
                json_extract(value, '$.complete'),
                ?
         FROM json_each(?)
         WHERE true
         ON CONFLICT (metric, date) DO UPDATE SET
           value = excluded.value,
           complete = excluded.complete,
           synced_at = excluded.synced_at`,
      )
        .bind(syncedAt, JSON.stringify(plan.rows))
        .run();
    } catch (error) {
      console.error('health.sync.write_failed', {
        error: error instanceof Error ? error.message : String(error),
        rows: plan.rows.length,
      });
      return fail(500, '写入数据库失败，请稍后重试。');
    }
  }

  console.log('health.sync.ok', {
    since: plan.since,
    today: plan.today,
    rows: plan.rows.length,
    reports: plan.reports.map((report) => `${report.metric}:${report.status}:${report.days}:${report.rejected}`),
    // 原始样本去重的来源构成：只记类别（手表 / iPhone / 其他）、条数与数量，不记设备名。
    sources: plan.reports
      .filter((report) => report.sources)
      .map((report) => ({ metric: report.metric, sources: report.sources, variants: report.variants })),
    unknownSleepValues: plan.unknownSleepValues.length,
  });

  return reply(200, {
    ok: true,
    summary: summarizeHealthSync(plan),
    since: plan.since,
    today: plan.today,
    rows: plan.rows.length,
    reports: plan.reports,
    unknownSleepValues: plan.unknownSleepValues,
    unknownStandValues: plan.unknownStandValues,
  });
}
