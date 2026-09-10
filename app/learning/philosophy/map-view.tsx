import Link from 'next/link';
import { concepts } from './concepts';
import {
  crossDomainChains,
  relationGroupsFor,
  relationLabels,
  type RelationKind,
} from './relations';
import { getNodeById, isCoreQuestion, nodeHref, questionDomains, traditions } from './tree';

/**
 * 哲学知识地图。
 *
 * 先是信息设计，然后才是视觉：没有粒子背景、没有物理引擎、没有需要拖拽
 * 缩放才能使用的画布。每个节点是一个原生 <details>，点开就能看到它的一句话
 * 介绍、按语义分组的直接相关节点，以及进入专题的入口——手机上和桌面上
 * 是同一套操作，服务端渲染完就不再需要 JS。
 */

const kindHint: Record<RelationKind, string> = {
  prerequisite: '前置',
  distinction: '易混',
  objection: '压力',
  extension: '延伸',
  'case-domain': '处境',
  'cross-tradition': '跨传统',
  'historical-context': '历史',
};

function MapNode({ nodeId }: { nodeId: string }) {
  const node = getNodeById(nodeId);
  if (!node) return null;
  const groups = relationGroupsFor(nodeId);

  return (
    <details className="philosophy-map-node">
      <summary>
        <span className="philosophy-map-node-title">{node.title}</span>
        <span aria-hidden="true" className="philosophy-map-node-marker" />
      </summary>
      <div className="philosophy-map-node-body">
        <p className="philosophy-map-node-summary">{node.question ?? node.summary}</p>
        {groups.length > 0 ? (
          <ul className="philosophy-map-node-relations">
            {groups.map((group) =>
              group.entries.map((entry) => (
                <li key={`${group.kind}-${entry.node.id}-${entry.reversed ? 'in' : 'out'}`}>
                  <span className="philosophy-map-relation-kind">{kindHint[group.kind]}</span>
                  <Link href={nodeHref(entry.node)}>{entry.node.title}</Link>
                  <span className="philosophy-map-relation-why">{entry.why}</span>
                </li>
              )),
            )}
          </ul>
        ) : (
          <p className="philosophy-map-node-empty">这个节点还没有建立语义关系。</p>
        )}
        <p className="philosophy-map-node-enter">
          <Link href={nodeHref(node)}>
            进入专题
            <span aria-hidden="true"> ↗</span>
          </Link>
        </p>
      </div>
    </details>
  );
}

export function MapLegend() {
  return (
    <dl className="philosophy-map-legend">
      {(Object.keys(relationLabels) as RelationKind[])
        .sort((a, b) => relationLabels[a].order - relationLabels[b].order)
        .map((kind) => (
          <div key={kind}>
            <dt>{kindHint[kind]}</dt>
            <dd>{relationLabels[kind].outbound}</dd>
          </div>
        ))}
    </dl>
  );
}

export function MapDomains() {
  return (
    <div className="philosophy-map-domains">
      {questionDomains.map((domain) => (
        <section className="philosophy-map-domain" key={domain.id}>
          <h3>
            <Link href={nodeHref(domain)}>{domain.title}</Link>
          </h3>
          <p className="philosophy-map-domain-summary">{domain.summary}</p>
          <div className="philosophy-map-node-list">
            {(domain.children ?? []).filter(isCoreQuestion).map((question) => (
              <MapNode key={question.id} nodeId={question.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function MapChains() {
  if (crossDomainChains.length === 0) return null;

  return (
    <div className="philosophy-map-chains">
      {crossDomainChains.map((chain) => (
        <section className="philosophy-map-chain" key={chain.id}>
          <h3>{chain.title}</h3>
          <p className="philosophy-map-chain-why">{chain.why}</p>
          <ol className="philosophy-map-chain-steps">
            {chain.nodeIds.map((nodeId, index) => {
              const node = getNodeById(nodeId);
              if (!node) return null;
              return (
                <li key={nodeId}>
                  {index > 0 && (
                    <span aria-hidden="true" className="philosophy-map-chain-arrow">
                      ↓
                    </span>
                  )}
                  <Link href={nodeHref(node)}>{node.title}</Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

export function MapConcepts() {
  if (concepts.length === 0) return null;

  return (
    <ul className="philosophy-map-concepts">
      {concepts.map((concept) => (
        <li key={concept.id}>
          <p className="philosophy-map-concept-term">
            {concept.term}
            {concept.original && (
              <span className="philosophy-concept-original" lang="en">
                {concept.original}
              </span>
            )}
          </p>
          <p className="philosophy-map-concept-short">{concept.short}</p>
          <p className="philosophy-map-concept-nodes">
            {concept.nodeIds.map((nodeId) => {
              const node = getNodeById(nodeId);
              if (!node) return null;
              return (
                <Link href={nodeHref(node)} key={nodeId}>
                  {node.title}
                </Link>
              );
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function MapTraditions() {
  return (
    <div className="philosophy-map-traditions">
      {traditions.map((tradition) => (
        <section className="philosophy-map-tradition" key={tradition.id}>
          <h3>
            <Link href={nodeHref(tradition)}>{tradition.title}</Link>
          </h3>
          <div className="philosophy-map-node-list">
            {(tradition.children ?? []).map((thread) => (
              <MapNode key={thread.id} nodeId={thread.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
