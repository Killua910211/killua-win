import Link from 'next/link';
import { getNodeById, nodeHref, type PhilosophyNode } from './tree';
import { getStudyGuide } from './study-guides';
import { getCoreEntryLedger, type LedgerParagraph } from './content-ledger';

type HeadingLevel = 'h2' | 'h3';

export type QuestionGroup = {
  id: string;
  title: string;
  href: string;
  summary: string;
  questions: { id: string; title: string; href: string }[];
};

/**
 * 「按问题」区块：全部问题域与核心问题的真实链接。
 *
 * 这里刻意没有任何状态：这份地图是可以反复回来查的参考，不是一次性课程，
 * 所以只有编号、标题和一个静态的题目数，没有读没读过的区分。
 */
export function CoreQuestionGroups({
  groups,
  headingLevel = 'h3',
}: {
  groups: QuestionGroup[];
  headingLevel?: 'h3' | 'h4';
}) {
  const GroupHeading = headingLevel;
  const QuestionHeading = headingLevel === 'h3' ? 'h4' : 'h5';

  return (
    <div className="learning-question-groups">
      {groups.map((group, groupIndex) => {
        // 编号在整个列表里连续，而不是每组重新数。
        const questionOffset = groups
          .slice(0, groupIndex)
          .reduce((total, item) => total + item.questions.length, 0);

        return (
          <article className="learning-question-group" key={group.id}>
            <div className="learning-question-group-head">
              <GroupHeading>
                <Link className="learning-question-domain-link" href={group.href}>
                  {group.title}
                </Link>
              </GroupHeading>
              <p className="learning-question-count">{group.questions.length} 个问题</p>
            </div>
            <p className="learning-question-group-summary">{group.summary}</p>
            <ul className="learning-question-list">
              {group.questions.map((question, questionIndex) => (
                <li key={question.id}>
                  <Link className="learning-question-link" href={question.href}>
                    <span className="learning-question-index" lang="en" aria-hidden="true">
                      {String(questionOffset + questionIndex + 1).padStart(2, '0')}
                    </span>
                    <QuestionHeading className="learning-question-title">
                      {question.title}
                    </QuestionHeading>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

/**
 * 节点正文。总览页和每个节点页共用同一套渲染：基础树数据保持完整呈现，
 * 新增核心问题则在其上叠加概念、论证和原典的精读层。
 *
 * headingLevel 让同一套内容在「本页主体」和「某一节里的一块」两种位置
 * 都能保持标题层级连续。
 */
export function NodeBody({
  node,
  headingLevel = 'h2',
}: {
  node: PhilosophyNode;
  headingLevel?: HeadingLevel;
}) {
  const BlockHeading = headingLevel;
  const SubHeading = headingLevel === 'h2' ? 'h3' : 'h4';
  const notes = node.notes ?? [];
  const positions = node.positions ?? [];
  const figures = node.figures ?? [];
  const guide = getStudyGuide(node.id);
  const ledger = getCoreEntryLedger(node.id);
  const related = (node.related ?? [])
    .map((id) => getNodeById(id))
    .filter((relatedNode): relatedNode is PhilosophyNode => Boolean(relatedNode));
  const sources = node.sources ?? [];

  const sourceLinks = (paragraph: LedgerParagraph) =>
    paragraph.sourceIds?.map((sourceId) => {
      const source = ledger?.sources.find((item) => item.id === sourceId);
      if (!source) return null;
      return (
        <a
          className="philosophy-citation"
          href={source.url}
          key={source.id}
          target="_blank"
          rel="noreferrer"
          aria-label={`来源 ${source.id}：${source.title}（在新标签页打开）`}
        >
          [{source.id}]
        </a>
      );
    });

  return (
    <div className="philosophy-body-main">
      {ledger && (
        <section className="philosophy-block philosophy-entry-status" aria-labelledby={`${node.id}-status`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-status`}>
            本条范围与状态
          </BlockHeading>
          <p className="philosophy-entry-status-label">{ledger.status}</p>
          <p className="philosophy-entry-status-text">{ledger.scope}</p>
        </section>
      )}

      {ledger && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-origin`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-origin`}>
            {ledger.sectionHeadings?.origin ?? '问题为何会出现'}
          </BlockHeading>
          <div className="philosophy-ledger-prose">
            {ledger.origin.map((paragraph, index) => (
              <p key={`${paragraph.kind}-${index}`}>
                <span className="philosophy-content-kind">{paragraph.kind}</span>
                {paragraph.text}
                {sourceLinks(paragraph)}
              </p>
            ))}
          </div>
        </section>
      )}

      {ledger && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-boundaries`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-boundaries`}>
            {ledger.sectionHeadings?.boundaries ?? '定义与边界'}
          </BlockHeading>
          <div className="philosophy-ledger-prose">
            {ledger.boundaries.map((paragraph, index) => (
              <p key={`${paragraph.kind}-${index}`}>
                <span className="philosophy-content-kind">{paragraph.kind}</span>
                {paragraph.text}
                {sourceLinks(paragraph)}
              </p>
            ))}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-notes`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-notes`}>
            阅读提醒
          </BlockHeading>
          <ul className="philosophy-notes">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {guide && (
        <section className="philosophy-block philosophy-study-intro" aria-labelledby={`${node.id}-orientation`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-orientation`}>
            先把问题拆开
          </BlockHeading>
          <p className="philosophy-study-orientation">{guide.orientation}</p>
          <dl className="philosophy-concept-grid">
            {guide.concepts.map((concept) => (
              <div key={concept.term}>
                <dt>{concept.term}</dt>
                <dd>{concept.explanation}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {positions.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-positions`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-positions`}>
            主要立场
          </BlockHeading>
          <ol className="philosophy-positions">
            {positions.map((position, index) => (
              <li key={position.name}>
                <p className="philosophy-position-index" lang="en" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <SubHeading className="philosophy-position-name">{position.name}</SubHeading>
                <p className="philosophy-position-text">{position.text}</p>
                {guide?.positionPaths[index] && (
                  <div className="philosophy-position-path">
                    <p>论证路径</p>
                    <ol>
                      {guide.positionPaths[index].map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {position.objection && (
                  <p className="philosophy-position-objection">
                    <span className="philosophy-tag">反对意见</span>
                    {position.objection}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {ledger && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-objections`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-objections`}>
            {ledger.sectionHeadings?.objections ?? '有力反对及回应'}
          </BlockHeading>
          <div className="philosophy-ledger-prose">
            {ledger.objections.map((paragraph, index) => (
              <p key={`${paragraph.kind}-${index}`}>
                <span className="philosophy-content-kind">{paragraph.kind}</span>
                {paragraph.text}
                {sourceLinks(paragraph)}
              </p>
            ))}
          </div>
        </section>
      )}

      {guide && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-texts`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-texts`}>
            人物与原典：从哪里读起
          </BlockHeading>
          <p className="philosophy-block-intro">
            先抓住每部文本在争论中解决什么问题，再回到原文核对论证；不要把作者的名字当成某个立场的标签。
          </p>
          <ol className="philosophy-texts">
            {guide.texts.map((text, index) => (
              <li key={`${text.author}-${text.work}`}>
                <p className="philosophy-text-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="philosophy-text-author">{text.author}</p>
                <h3>{text.work}</h3>
                <p className="philosophy-text-period">{text.period}</p>
                <p className="philosophy-text-contribution">{text.contribution}</p>
                <p className="philosophy-text-question">
                  <span>带着这个问题读</span>
                  {text.readingQuestion}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!guide && figures.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-figures`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-figures`}>
            相关人物与文本
          </BlockHeading>
          {figures.map((figure) => (
            <p className="philosophy-paragraph" key={figure}>
              {figure}
            </p>
          ))}
        </section>
      )}

      {guide ? (
        <section className="philosophy-block" aria-labelledby={`${node.id}-case`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-case`}>
            案例推演
          </BlockHeading>
          <div className="philosophy-case-study">
            <h3>{guide.caseStudy.title}</h3>
            <p>{guide.caseStudy.setup}</p>
            <ol>
              {guide.caseStudy.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ol>
          </div>
        </section>
      ) : node.example ? (
        <section className="philosophy-block" aria-labelledby={`${node.id}-example`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-example`}>
            一个例子
          </BlockHeading>
          <p className="philosophy-example">{node.example}</p>
        </section>
      ) : null}

      {ledger && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-confusions`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-confusions`}>
            {ledger.sectionHeadings?.confusions ?? '容易混淆的地方'}
          </BlockHeading>
          <ul className="philosophy-confusions">
            {ledger.confusions.map((paragraph, index) => (
              <li key={`${paragraph.kind}-${index}`}>
                <span className="philosophy-content-kind">{paragraph.kind}</span>
                {paragraph.text}
                {sourceLinks(paragraph)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {ledger && ledger.historicalContext.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-history`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-history`}>
            {ledger.sectionHeadings?.historicalContext ?? '放回历史线索'}
          </BlockHeading>
          <ul className="philosophy-history-links">
            {ledger.historicalContext.map((item) => {
              const historyNode = getNodeById(item.nodeId);
              return (
                <li key={item.nodeId}>
                  {historyNode ? <Link href={nodeHref(historyNode)}>{item.label}</Link> : <span>{item.label}</span>}
                  <p>{item.note}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {guide && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-next-questions`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-next-questions`}>
            带着问题继续读
          </BlockHeading>
          <ul className="philosophy-next-questions">
            {guide.nextQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-related`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-related`}>
            相关节点
          </BlockHeading>
          <ul className="philosophy-related">
            {related.map((relatedNode) => (
              <li key={relatedNode.id}>
                <Link href={nodeHref(relatedNode)}>
                  <span className="philosophy-related-type" lang="zh-CN">
                    {relatedNode.type}
                  </span>
                  <span className="philosophy-related-title">{relatedNode.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ledger ? (
        <section className="philosophy-block" aria-labelledby={`${node.id}-sources`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-sources`}>
            来源与核验记录
          </BlockHeading>
          <p className="philosophy-block-intro">
            每项只说明本轮实际核对到的定位和它支持的论断；原典入口不等于整部文本已经完成校勘。
          </p>
          <ol className="philosophy-source-records">
            {ledger.sources.map((source) => (
              <li key={source.id}>
                <p className="philosophy-source-id">{source.id} · {source.kind} · 已核验</p>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
                <p><strong>定位：</strong>{source.locator}</p>
                <p><strong>用于：</strong>{source.supports}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : sources.length > 0 && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-sources`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-sources`}>
            延伸阅读
          </BlockHeading>
          <ul className="philosophy-sources">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ledger && (
        <section className="philosophy-block" aria-labelledby={`${node.id}-review`}>
          <BlockHeading className="philosophy-block-title" id={`${node.id}-review`}>
            本轮审查与待办
          </BlockHeading>
          <p className="philosophy-review-meta">{ledger.review.mode} · {ledger.review.checkedOn}</p>
          <ol className="philosophy-review-findings">
            {ledger.review.findings.map((finding) => (
              <li key={finding.location}>
                <h3>{finding.location}</h3>
                <p><strong>发现：</strong>{finding.issue}</p>
                <p><strong>依据：</strong>{finding.evidence}</p>
                <p><strong>修订：</strong>{finding.revision}</p>
              </li>
            ))}
          </ol>
          <p className="philosophy-review-impact"><strong>相邻条目影响：</strong>{ledger.review.adjacentImpact}</p>
          <p className="philosophy-review-impact"><strong>下一优先：</strong>{ledger.review.nextPriority}</p>
          {ledger.review.remaining.length > 0 && (
            <ul className="philosophy-review-todos">
              {ledger.review.remaining.map((item) => <li key={item}>待办：{item}</li>)}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

/** 子节点入口。分组、问题域和传统导航靠它继续往下走。 */
export function NodeChildren({
  node,
  title = '下一层',
  headingLevel = 'h2',
}: {
  node: PhilosophyNode;
  title?: string;
  headingLevel?: HeadingLevel;
}) {
  const BlockHeading = headingLevel;
  const ItemHeading = headingLevel === 'h2' ? 'h3' : 'h4';
  const children = node.children ?? [];
  if (children.length === 0) return null;

  return (
    <section className="philosophy-block" aria-labelledby={`${node.id}-children`}>
      <BlockHeading className="philosophy-block-title" id={`${node.id}-children`}>
        {title}
      </BlockHeading>
      {/*
        链接只包住标题，摘要留在链接外面：整块可点的卡片会把一整段摘要
        念成链接名，焦点框也会拉成一大块。
      */}
      <ul className="philosophy-children">
        {children.map((child) => (
          <li key={child.id}>
            <p className="philosophy-children-type" lang="zh-CN">
              {child.type}
            </p>
            <ItemHeading className="philosophy-children-title">
              <Link href={nodeHref(child)}>
                {child.title}
                <span aria-hidden="true"> ↗</span>
              </Link>
            </ItemHeading>
            <p className="philosophy-children-summary">{child.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
