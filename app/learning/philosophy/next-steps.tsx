import Link from 'next/link';
import { relationGroupsFor } from './relations';
import { nodeHref } from './tree';

/**
 * 继续学习。
 *
 * 这一块替代原来那份「相关节点」清单。差别不在样式，而在每一条都必须
 * 回答「为什么推荐这一篇」：它是前置知识、另一种回答、一个反驳、一个延伸
 * 问题、一段历史语境，还是一个只能并置的跨传统问题。
 *
 * 关系按语义分组，每组的标题就是这个理由；条目下面那句话是具体理由。
 * 没有理由的边不会出现在这里——它在数据层就被拒绝了。
 */
export function NextSteps({ nodeId }: { nodeId: string }) {
  const groups = relationGroupsFor(nodeId);
  if (groups.length === 0) return null;

  return (
    <div className="philosophy-next">
      {groups.map((group) => (
        <section className="philosophy-next-group" key={`${group.kind}-${group.title}`}>
          <h3 className="philosophy-next-group-title">{group.title}</h3>
          <ul>
            {group.entries.map((entry) => (
              <li key={`${entry.node.id}-${entry.reversed ? 'in' : 'out'}`}>
                <Link className="philosophy-next-link" href={nodeHref(entry.node)}>
                  {entry.node.title}
                  <span aria-hidden="true"> ↗</span>
                </Link>
                <p className="philosophy-next-why">{entry.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
