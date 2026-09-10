import Link from 'next/link';
import type { ComparativeQuestion } from './comparisons';
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
export function ComparisonBlock({ item }: { item: ComparativeQuestion }) {
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
                <Citations ids={framing.sourceIds} sources={item.sources} />
              </p>
            </article>
          );
        })}
      </div>

      <p className="philosophy-comparison-caution">
        <span className="philosophy-comparison-caution-label">这不是几种竞争理论</span>
        {item.caution}
      </p>

      {item.pending && item.pending.length > 0 && (
        <ul className="philosophy-comparison-pending">
          {item.pending.map((pendingItem) => (
            <li key={pendingItem}>待核验：{pendingItem}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
