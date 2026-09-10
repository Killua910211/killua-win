import { sourceCheckLabels, type CoreEntryLedger } from './content-ledger';

/**
 * 研究层。
 *
 * 来源核验、内容状态、编辑说明、审查记录和待办对维护这个知识库是必要的，
 * 但它们不该和哲学正文处在同一个阅读层级：读者刚点进「自由意志」，第一屏
 * 就读到「本轮审查与待办」，这不是严谨，是把维护日志摆在了正文前面。
 *
 * 所以这些内容整块收进一个默认折叠的 <details>，放在正文之后。
 * 两点没有让步：
 *   - 正文里的来源角标仍然直接指向来源本身，不需要先展开这一层；
 *   - 折叠标题上写清里面有多少条来源、什么审查模式、核对到哪一天，
 *     不把状态藏成一个需要点开才知道的秘密。
 */
export function ResearchLayer({ ledger, nodeId }: { ledger: CoreEntryLedger; nodeId: string }) {
  const verified = ledger.sources.filter((source) => source.checked === 'verified').length;
  const broken = ledger.sources.filter((source) => source.checked === 'broken').length;
  const pending = ledger.sources.length - verified - broken;

  /**
   * 条目状态由来源的真实状态推出，不用 `ledger.status` 里手写的那句。
   *
   * `status` 的类型是字面量 `'核验正文｜自审完成'`，42 条 ledger 全取同一个值——
   * 也就是说它不承载任何信息，而在还有来源待核验或链接失效的页面上，这句话
   * 是不成立的。手写的断言会随内容漂移，数出来的不会。
   */
  const derivedStatus = broken > 0
    ? '有来源链接失效，待更换'
    : pending > 0
      ? verified > 0
        ? '来源部分已核验，其余待核验'
        : '来源待逐条核验'
      : '来源已逐条核验';

  return (
    <details className="philosophy-research" id={`${nodeId}-research`}>
      <summary>
        <span className="philosophy-research-title">来源、核验与修订记录</span>
        <span className="philosophy-research-meta">
          {ledger.sources.length} 条来源
          {verified > 0 && `，已核验 ${verified}`}
          {pending > 0 && `，待核验 ${pending}`}
          {broken > 0 && `，链接失效 ${broken}`} · {ledger.review.mode}
        </span>
      </summary>

      <div className="philosophy-research-body">
        <section aria-labelledby={`${nodeId}-research-scope`}>
          <h3 className="philosophy-research-heading" id={`${nodeId}-research-scope`}>
            本条状态
          </h3>
          <p className="philosophy-research-status">
            {derivedStatus} · {ledger.review.mode}
          </p>
          <p className="philosophy-research-text">{ledger.scope}</p>
        </section>

        <section aria-labelledby={`${nodeId}-research-sources`}>
          <h3 className="philosophy-research-heading" id={`${nodeId}-research-sources`}>
            来源与核验记录
          </h3>
          <p className="philosophy-research-text">
            每项只说明本轮实际核对到的定位和它支持的论断；原典入口不等于整部文本已经完成校勘。
          </p>
          <ol className="philosophy-source-records">
            {ledger.sources.map((source) => (
              <li className={`philosophy-source-${source.checked}`} key={source.id}>
                <p className="philosophy-source-id">
                  {source.id} · {source.kind} · {sourceCheckLabels[source.checked]}
                  {source.checkedOn && ` · ${source.checkedOn}`}
                </p>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.title}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
                <p>
                  <strong>定位：</strong>
                  {source.locator}
                </p>
                <p>
                  <strong>用于：</strong>
                  {source.supports}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby={`${nodeId}-research-review`}>
          <h3 className="philosophy-research-heading" id={`${nodeId}-research-review`}>
            本轮审查与待办
          </h3>
          <ol className="philosophy-review-findings">
            {ledger.review.findings.map((finding) => (
              <li key={finding.location}>
                <h4>{finding.location}</h4>
                <p>
                  <strong>发现：</strong>
                  {finding.issue}
                </p>
                <p>
                  <strong>依据：</strong>
                  {finding.evidence}
                </p>
                <p>
                  <strong>修订：</strong>
                  {finding.revision}
                </p>
              </li>
            ))}
          </ol>
          <p className="philosophy-review-impact">
            <strong>相邻条目影响：</strong>
            {ledger.review.adjacentImpact}
          </p>
          <p className="philosophy-review-impact">
            <strong>下一优先：</strong>
            {ledger.review.nextPriority}
          </p>
          {ledger.review.remaining.length > 0 && (
            <ul className="philosophy-review-todos">
              {ledger.review.remaining.map((item) => (
                <li key={item}>待办：{item}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </details>
  );
}
