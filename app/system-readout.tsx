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
 * 数据来自 os.killua.win 的公开端点，那个端点**只返回数字** ——
 * 它的返回类型里没有任何承载内容的字符串字段，所以这里不可能
 * 意外把一条私人记录渲染出来。本站不绑定 OS 的数据库。
 *
 * 取不到数据时整块不渲染：首页上少一块，好过挂一个报错。
 */
async function fetchStats(): Promise<PublicStats | null> {
  try {
    const res = await fetch('https://os.killua.win/api/public/stats', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicStats;
  } catch {
    return null;
  }
}

export async function SystemReadout() {
  const stats = await fetchStats();
  if (!stats || stats.days === 0) return null;

  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

  const rows: [string, string][] = [
    ['Uptime', plural(stats.days, 'day')],
    ['Records', String(stats.records)],
    ['Decisions', `${stats.decisions}${stats.decided > 0 ? ` / ${stats.decided} settled` : ''}`],
    ['Traces', String(stats.traces)],
  ];
  if (stats.commitmentRate !== null) rows.push(['Kept', `${stats.commitmentRate}%`]);
  if (stats.checkinWeeks > 0) rows.push(['Check-ins', plural(stats.checkinWeeks, 'week')]);

  return (
    <section className="readout" id="system">
      <div className="section-label light">
        <span>04</span>
        <span>System readout</span>
      </div>

      <div className="readout-body">
        <p className="eyebrow readout-eyebrow">KILLUA OS · Live</p>
        <p className="readout-lede">
          一个自建的个人记录与决策系统，每天在用。
          <br />
          下面是它自己报出来的数字 —— 不含任何一条记录的内容。
        </p>

        <dl className="readout-grid">
          {rows.map(([label, value]) => (
            <div className="readout-cell" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <p className="readout-sync">Last sync {stats.lastSync} · All systems nominal</p>
      </div>
    </section>
  );
}
