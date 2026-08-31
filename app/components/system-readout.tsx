type PublicStats = {
  days: number;
  records: number;
  decisions: number;
  decided: number;
  traces: number;
  commitmentRate: number | null;
  checkinWeeks: number;
  lastSync: string;
};

/**
 * KILLUA OS 的运行读数。
 *
 * 数据来自 os.killua.win 的公开端点，那个端点只返回数字 —— 它的返回类型里
 * 没有任何承载内容的字符串字段（lastSync 是格式化后的日期），所以这里不会
 * 意外把一条私人记录渲染出来。本站不绑定 OS 的数据库。
 *
 * 注意这个保证的边界：TypeScript 的类型断言是编译期的，运行时拿到的是
 * 对端此刻返回的 JSON。下面只读取已知的数值字段并逐个 String() 化，
 * 多余字段一律不进入渲染 —— 保证来自这段取值代码，不来自类型声明。
 *
 * 超时 1.5 秒。没有这个 signal 的话，对端挂起（而非报错）时 catch 分支
 * 不会执行，整个首页会跟着卡在 flush 第一个字节之前。调用方另外用
 * Suspense 包住了这个组件，所以慢的时候首页其余部分照常先出。
 */
async function fetchStats(): Promise<PublicStats | null> {
  try {
    const res = await fetch('https://os.killua.win/api/public/stats', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicStats;
  } catch {
    return null;
  }
}

/** 只接受有限的数值，防止对端返回 null/字符串/NaN 时渲染出奇怪的东西。 */
function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function SystemReadout() {
  const stats = await fetchStats();
  const days = num(stats?.days);
  if (!days) return null;

  // 数字和单位分开渲染：数字走 44px 的信号绿，单位走 15px 的白 —— 仪表读数的
  // 比例靠这个悬殊拉开，写成 "3 days" 一个字符串就做不到。
  const plural = (n: number, unit: string) => `${unit}${n === 1 ? '' : 's'}`;

  const records = num(stats?.records) ?? 0;
  const decisions = num(stats?.decisions) ?? 0;
  const decided = num(stats?.decided) ?? 0;
  const traces = num(stats?.traces) ?? 0;
  const commitmentRate = num(stats?.commitmentRate);
  const checkinWeeks = num(stats?.checkinWeeks) ?? 0;

  const rows: { label: string; value: string; unit?: string }[] = [
    { label: 'Uptime', value: String(days), unit: plural(days, 'day') },
    { label: 'Records', value: String(records) },
    {
      label: 'Decisions',
      value: String(decisions),
      ...(decided > 0 ? { unit: `/ ${decided} settled` } : {}),
    },
    { label: 'Traces', value: String(traces) },
  ];
  if (commitmentRate !== null) rows.push({ label: 'Kept', value: `${commitmentRate}%` });
  if (checkinWeeks > 0) {
    rows.push({
      label: 'Check-ins',
      value: String(checkinWeeks),
      unit: plural(checkinWeeks, 'week'),
    });
  }

  const lastSync = typeof stats?.lastSync === 'string' ? stats.lastSync : null;

  return (
    <section className="readout" id="system" aria-labelledby="readout-heading">
      <div className="section-label light" lang="en">
        <span>04</span>
        <span>System readout</span>
      </div>

      <div className="readout-body">
        <h2 className="eyebrow readout-eyebrow" id="readout-heading" lang="en">
          <span className="readout-pulse" aria-hidden="true" />
          KILLUA OS · Live
        </h2>
        <p className="readout-lede">
          一个自建的个人记录与决策系统，每天在用。
          <br />
          下面是它自己报出来的数字 —— 不含任何一条记录的内容。
        </p>

        <dl className="readout-grid" lang="en">
          {rows.map(({ label, value, unit }) => (
            <div className="readout-cell" key={label}>
              <dt>{label}</dt>
              <dd>
                {value}
                {unit ? <span className="readout-unit">{unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>

        {lastSync ? (
          <p className="readout-sync" lang="en">
            Last sync {lastSync} · All systems nominal
          </p>
        ) : null}
      </div>
    </section>
  );
}
