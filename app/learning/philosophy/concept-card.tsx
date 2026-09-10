import Link from 'next/link';
import { getConcept, requireConcept, type Concept } from './concepts';
import { getNodeById, nodeHref } from './tree';

/**
 * 概念卡。
 *
 * 同一份定义有两种用法：正文里的行内注解，和条目开头的概念清单。
 *
 * 行内注解用原生 <details>：自带键盘操作和展开语义，不需要 JS，手机上是
 * 点击展开而不是 hover，也不会有浮层被挤出屏幕的问题。代价是 <details>
 * 属于 flow content，不能放进 <p>——带注解的段落因此渲染成 .philosophy-para
 * （见 prose.tsx）。行内面板内部只用短语级元素，保持它可以随文排版。
 */

function ConceptOriginal({ concept }: { concept: Concept }) {
  if (!concept.original) return null;
  return (
    <span className="philosophy-concept-original" lang="en">
      {concept.original}
    </span>
  );
}

/** 正文里的行内概念注解。同一页同一个概念只标第一次出现，避免链接噪音。 */
export function ConceptGloss({ id, children }: { id: string; children: string }) {
  const concept = requireConcept(id);

  return (
    <details className="philosophy-gloss">
      <summary>
        <span className="philosophy-gloss-term">{children}</span>
        <span aria-hidden="true" className="philosophy-gloss-marker">
          ?
        </span>
        <span className="sr-only">：展开概念说明</span>
      </summary>
      <span className="philosophy-gloss-panel">
        <span className="philosophy-gloss-head">
          <strong>{concept.term}</strong>
          <ConceptOriginal concept={concept} />
        </span>
        <span className="philosophy-gloss-short">{concept.short}</span>
        {concept.distinctions.length > 0 && (
          <span className="philosophy-gloss-line">
            <span className="philosophy-gloss-label">不是</span>
            {concept.distinctions.map((distinction) => (
              <span className="philosophy-gloss-item" key={distinction.from}>
                {distinction.from}
              </span>
            ))}
          </span>
        )}
        <span className="philosophy-gloss-line">
          <span className="philosophy-gloss-label">展开读</span>
          <Link href={`${nodeHref(getNodeById(concept.nodeIds[0])!)}#concepts`}>
            {getNodeById(concept.nodeIds[0])!.title}
          </Link>
        </span>
      </span>
    </details>
  );
}

export type ConceptRef = { id: string; angle?: string };

/** 条目开头的概念清单。定义来自共享的概念层，各页只补一句「在本页」的角度。 */
export function ConceptList({ refs }: { refs: ConceptRef[] }) {
  const items: { concept: Concept; angle?: string }[] = [];
  for (const ref of refs) {
    const concept = getConcept(ref.id);
    if (concept) items.push({ concept, angle: ref.angle });
  }

  if (items.length === 0) return null;

  return (
    <div className="philosophy-concept-cards">
      {items.map(({ concept, angle }) => {
        const nodes = concept.nodeIds
          .map((id) => getNodeById(id))
          .filter((node): node is NonNullable<typeof node> => Boolean(node));

        return (
          <article className="philosophy-concept-card" key={concept.id}>
            <h4>
              {concept.term}
              <ConceptOriginal concept={concept} />
            </h4>
            <p className="philosophy-concept-short">{concept.short}</p>
            {concept.detail && <p className="philosophy-concept-detail">{concept.detail}</p>}
            {angle && (
              <p className="philosophy-concept-angle">
                <span>在本页</span>
                {angle}
              </p>
            )}
            {concept.distinctions.length > 0 && (
              <div className="philosophy-concept-distinctions">
                <p className="philosophy-concept-subhead">不要和这些混为一谈</p>
                <ul>
                  {concept.distinctions.map((distinction) => (
                    <li key={distinction.from}>
                      <strong>{distinction.from}</strong>
                      {distinction.note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {nodes.length > 1 && (
              <p className="philosophy-concept-where">
                <span>也在这些条目里被讨论</span>
                {nodes.map((node) => (
                  <Link href={nodeHref(node)} key={node.id}>
                    {node.title}
                  </Link>
                ))}
              </p>
            )}
            {concept.sources.length > 0 && (
              <p className="philosophy-concept-sources">
                <span>定义依据</span>
                {concept.sources.map((source) => (
                  <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                    {source.title}
                    <span className="sr-only">（在新标签页打开）</span>
                  </a>
                ))}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
