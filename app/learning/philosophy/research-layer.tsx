import { sourceCheckLabels, type CoreEntryLedger } from './content-ledger';
import type { PageSourceRegistry, SourceUsage } from './page-sources';

/**
 * 一份材料整体标成什么状态。
 *
 * 取最差的那一处，不取第一处：同一个 SEP 条目可能在正文里核对过 §4、在论证
 * 地图里引了尚未核对的 §5。按第一处上色会把「其中一处还没核」显示成绿色。
 */
function worstState(usages: SourceUsage[]): SourceUsage['checked'] {
  if (usages.some((usage) => usage.checked === 'broken')) return 'broken';
  if (usages.some((usage) => usage.checked === 'pending')) return 'pending';
  return 'verified';
}

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
 *
 * 统计口径以整页为准（page-sources.ts），不是只数条目来源账。以前只数来源账，
 * 于是自由意志页正文点得到 14 个角标、研究层却写「3 条来源，已核验 3」——
 * 那个数字既对不上页面，又让人以为全页引文都已核验。
 */
export function ResearchLayer({
  ledger,
  nodeId,
  registry,
}: {
  ledger: CoreEntryLedger;
  nodeId: string;
  registry: PageSourceRegistry;
}) {
  const { materialCount, usageCount, verified, pending, broken } = registry;

  /**
   * 条目状态由来源的真实状态推出，不用 `ledger.status` 里手写的那句。
   *
   * `status` 的类型是字面量 `'核验正文｜自审完成'`，每一条 ledger 都取同一个值——
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
          {/*
            同一份材料常被正文和论证地图各引一次、定位不同。只报「份数」会少算
            核验工作量，只报「引用数」又会让人以为有那么多份不同的材料，所以
            两个数都写出来，两者相等时才合并成一句。
          */}
          {materialCount === usageCount
            ? `${usageCount} 条来源`
            : `${usageCount} 条引用 · ${materialCount} 份材料`}
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
          {/*
            这里只说来源核到了哪一步。审查模式已经写在折叠标题上，本页范围已经写在
            正文最前面那行「本页范围」里——两处都曾在这一节里再渲染一遍，等于每个
            条目页把同一段范围说明印两次。
          */}
          <p className="philosophy-research-status">{derivedStatus}</p>
        </section>

        <section aria-labelledby={`${nodeId}-research-sources`}>
          <h3 className="philosophy-research-heading" id={`${nodeId}-research-sources`}>
            来源与核验记录
          </h3>
          <p className="philosophy-research-text">
            本页引用的来源都在这里，按材料归并：同一份材料被多处引用时只列一条，但每一处的定位、
            支持的论断和核验状态分开记。每项只说明本轮实际核对到的那一处定位，原典入口不等于整部
            文本都已校勘。
            {registry.extraUses.length > 0 &&
              `本页除正文外，${registry.extraUses.join('、')}也各自带了来源。`}
          </p>
          <ol className="philosophy-source-records">
            {registry.sources.map((source) => {
              const state = worstState(source.usages);
              return (
              <li className={`philosophy-source-${state}`} key={source.url}>
                <p className="philosophy-source-id">
                  {source.ids.join(' / ')} · {source.kind}
                  {/*
                    待核验和链接失效要有文字，不能只靠左边那条色边——颜色单独承担
                    语义，色觉差异和高对比模式下就什么都没说。全部已核验时不写，
                    免得每一条都挂一个「已核验」，反而把真正需要注意的那条淹掉。
                  */}
                  {state !== 'verified' && ` · ${sourceCheckLabels[state]}`}
                </p>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.title}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
                {/*
                  同一份材料的多处引用逐条列出。合并成一条会丢掉「这一处核对到的
                  是哪一小节、支持的是哪一句」，而那正是这份清单存在的理由。
                */}
                <ul className="philosophy-source-usages">
                  {source.usages.map((usage) => (
                    <li key={`${usage.id}-${usage.usedIn}-${usage.locator}`}>
                      <p className="philosophy-source-usage-head">
                        {usage.id} · {usage.usedIn} · {sourceCheckLabels[usage.checked]}
                        {usage.checkedOn && ` · ${usage.checkedOn}`}
                      </p>
                      <p>
                        <strong>定位：</strong>
                        {usage.locator}
                      </p>
                      <p>
                        <strong>用于：</strong>
                        {usage.supports}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
              );
            })}
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
