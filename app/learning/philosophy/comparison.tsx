import Link from 'next/link';
import type { ComparativeQuestion } from './comparisons';
import type { LedgerSource } from './content-ledger';
import { Citations } from './citation';
import { getNodeById, nodeHref } from './tree';

/**
 * 跨传统比较。
 *
 * 版式本身就是那条规则：标题是一个可比问题，不是「东西方对照表」；每一栏
 * 先列它关心什么，再说它怎么组织问题；最后一定有一句差异提示，说明这些
 * 传统不一定在回答同一个问题。
 *
 * 因此这里刻意不用表格。表格的每一行都在暗示「同一个格子对应同一个东西」，
 * 而这正是跨传统比较最容易犯的错。
 */
export function ComparisonBlock({
  item,
  ledgerSources = [],
}: {
  item: ComparativeQuestion;
  /**
   * 该条目来源账里的来源。
   *
   * 比较栏的角标以前只在 `item.sources` 里查，于是这些编号成了一个独立命名
   * 空间：想引用条目已核验过的材料，只能在 comparisons.ts 里照抄登记一遍。
   * 两边合起来查（和论证地图一样），同一页的编号才是同一套。
   */
  ledgerSources?: LedgerSource[];
}) {
  const allSources = [...ledgerSources, ...item.sources];

  return (
    <div className="philosophy-comparison">
      <h3 className="philosophy-comparison-question">{item.question}</h3>
      <p className="philosophy-comparison-why">{item.why}</p>

      <div className="philosophy-comparison-framings">
        {item.framings.map((framing) => {
          const node = framing.nodeId ? getNodeById(framing.nodeId) : undefined;
          return (
            <article className="philosophy-comparison-framing" key={framing.tradition}>
              <h4>
                {node ? <Link href={nodeHref(node)}>{framing.tradition}</Link> : framing.tradition}
              </h4>
              <ul className="philosophy-comparison-cares">
                {framing.caresAbout.map((care) => (
                  <li key={care}>{care}</li>
                ))}
              </ul>
              <p className="philosophy-comparison-note">
                {framing.note}
                <Citations ids={framing.sourceIds} sources={allSources} />
              </p>
            </article>
          );
        })}
      </div>

      <p className="philosophy-comparison-caution">
        <span className="philosophy-comparison-caution-label">不可等同之处</span>
        {item.caution}
      </p>

      {/*
        待核验清单是维护记录，不该插在阅读流里。
        复审实测：/western-ancient 的跨传统比较下面直接排着四条待核验，其中还带着
        「昔勒尼学派」这种全页没出现过的新名词；/mind-self 有七条。页尾的来源账
        已经整块折叠，这里用同样的办法。
      */}
      {item.pending && item.pending.length > 0 && (
        <details className="philosophy-comparison-pending-wrap">
          <summary>
            这一组比较还欠 {item.pending.length} 项核验
            <span className="sr-only">（展开查看）</span>
          </summary>
          <ul className="philosophy-comparison-pending">
            {item.pending.map((pendingItem) => (
              <li key={pendingItem}>{pendingItem}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
