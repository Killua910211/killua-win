import Link from 'next/link';
import { childOrderNote, getNodeById, nodeHref, orderedChildren, type PhilosophyNode } from './tree';
import { getStudyGuide } from './study-guides';
import { getCoreEntryLedger, type CoreEntryLedger, type LedgerParagraph } from './content-ledger';
import { BeingChangeEntry } from './being-change-entry';
import { getArgumentMap } from './argument-maps';
import { getThoughtExperiment } from './thought-experiments';
import { comparisonsForNode } from './comparisons';
import { prerequisitesOf, relationGroupsFor } from './relations';
import { ArgumentMap } from './argument-map';
import { Citations, ClaimSources } from './citation';
import { ComparisonBlock } from './comparison';
import { ConceptList } from './concept-card';
import { NextSteps } from './next-steps';
import { hasGloss, Prose, renderProse } from './prose';
import { ResearchLayer } from './research-layer';
import { collectPageSources } from './page-sources';
import { ThoughtExperiment } from './thought-experiment';

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
                    <span aria-hidden="true" className="learning-question-index" lang="en">
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
 * 页首的「读这一页之前」。
 *
 * 两层信息并在一块，因为对读者来说是同一件事：
 *
 *   1. 关系层声明的整页前置（`prerequisite`）。这类边全库只有十二条，
 *      每条都写明了对面那一页的哪个区分是本页的前提。它原本只出现在页尾
 *      「继续学习」的第一组里——读完之后才告诉读者「其实你该先读那一篇」，
 *      位置本身在传达错误信息。反向的「以本页为前置的问题」仍然留在页尾，
 *      那属于读完之后的去处。
 *   2. 来源账的 `assumed`：本页会用到、但要到别的页才展开的具体区分，
 *      每条附一句回顾，让不想跳转的读者也能接着往下读。
 *
 * 同一个节点在两层都出现时只显示一次，用来源账那条（它带回顾）。
 */
function ReadingPrep({ nodeId, assumed }: { nodeId: string; assumed?: CoreEntryLedger['assumed'] }) {
  const assumedIds = new Set((assumed ?? []).map((item) => item.nodeId).filter(Boolean));
  const prerequisites = prerequisitesOf(nodeId).filter((entry) => !assumedIds.has(entry.node.id));
  if (prerequisites.length === 0 && (assumed ?? []).length === 0) return null;

  return (
    <aside aria-labelledby={`${nodeId}-prereq`} className="philosophy-prereq">
      <p className="philosophy-prereq-label" id={`${nodeId}-prereq`}>
        读这一页之前
      </p>
      <ul>
        {prerequisites.map((entry) => (
          <li key={entry.node.id}>
            <Link href={nodeHref(entry.node)}>{entry.node.title}</Link>
            <span className="philosophy-prereq-why">{entry.why}</span>
          </li>
        ))}
        {(assumed ?? []).map((item) => {
          const target = item.nodeId ? getNodeById(item.nodeId) : undefined;
          return (
            <li key={item.point}>
              <span className="philosophy-prereq-point">{item.point}</span>
              <span className="philosophy-prereq-why">{item.recap}</span>
              {target && (
                <span className="philosophy-prereq-recap">
                  <span>展开读</span>
                  <Link href={nodeHref(target)}>{target.title}</Link>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/**
 * 导航页的读者导语。
 *
 * 问题域、传统导航和两个目录分组没有研究层，原来直接从「主要立场」或子节点
 * 清单开始——读者点进「1. 存在、世界与人」，第一屏就是「自然连续论」这样
 * 一个没有铺垫的名字。这一块负责在那之前说清：这一组问题在追问什么，
 * 为什么它们被放在一起。
 */
function GuidanceLead({ node }: { node: PhilosophyNode }) {
  const lead = node.guidance?.lead ?? [];
  if (lead.length === 0) return null;
  return (
    <div className="philosophy-guidance-lead">
      {lead.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

/** 来源账里的一段正文。kind 标出它是原文、概括、解释性重构还是原创例子。 */
function LedgerProse({
  paragraphs,
  sources,
}: {
  paragraphs: LedgerParagraph[];
  sources: CoreEntryLedger['sources'];
}) {
  return (
    <div className="philosophy-ledger-prose">
      {paragraphs.map((paragraph, index) => (
        <Prose
          key={`${paragraph.kind}-${index}`}
          trailing={
            <>
              <Citations ids={paragraph.sourceIds} sources={sources} />
            </>
          }
        >
          {paragraph.text}
        </Prose>
      ))}
    </div>
  );
}

/**
 * 节点正文。
 *
 * 阅读层的顺序按「问题 → 分歧 → 理由 → 论证 → 反驳 → 回应 → 检验 → 连接」
 * 组织，而不是按数据结构的字段顺序。维护信息（条目状态、来源核验记录、
 * 审查与待办）整块收进末尾的研究层——正文里的来源角标仍然直接指向来源，
 * 不需要先展开折叠区。
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
  const argument = getArgumentMap(node.id);
  const experiment = getThoughtExperiment(node.id);
  const comparisons = comparisonsForNode(node.id);
  const relationGroups = relationGroupsFor(node.id);
  const sources = ledger?.sources ?? [];
  const legacyRelated = (node.related ?? [])
    .map((id) => getNodeById(id))
    .filter((relatedNode): relatedNode is PhilosophyNode => Boolean(relatedNode));
  const legacySources = node.sources ?? [];

  // 区块标题抽出来一份，目录和正文用同一个来源，不会各写一遍再漂移。
  const headings = {
    origin: ledger?.sectionHeadings?.origin ?? '问题为何会出现',
    boundaries: ledger?.sectionHeadings?.boundaries ?? '定义与边界',
    objections: ledger?.sectionHeadings?.objections ?? '有力反对及回应',
    confusions: ledger?.sectionHeadings?.confusions ?? '容易混淆的地方',
    historicalContext: ledger?.sectionHeadings?.historicalContext ?? '放回历史线索',
    positions: ledger?.sectionHeadings?.positions ?? '主要立场',
  };

  /**
   * 页内目录。
   *
   * 核心问题页现在有十来个区块，手机上要滚两万像素才到底。折叠正文不是办法
   * ——正文本来就该读；给它一个入口才是。区块少的条目（传统导航、问题域）
   * 不需要目录，所以只在超过六块时才出现。
   *
   * 条件必须和下面的渲染条件一致，否则会出现指向不存在锚点的死链。
   */
  /*
    案例推演与思想实验原本是三选一（`experiment ? … : guide ? … : example`）。
    结果是：有思想实验的七个页面上，精读层写好的案例推演一个字都不渲染——而
    思想实验的开场白又写着「在本页前面那次案例推演上加装变量」，读者被指向一段
    他根本看不到的内容。本轮的「完整走一遍」分析示范也正写在案例推演里。

    改为两块都渲染，先案例后实验：案例把一次判断从头走到尾（示范怎么做），
    实验再逐个改变量（示范判断为什么会变）。两者分工不同，不是同一块的两个版本。
    `example` 仍然只在两者都没有时兜底。
  */
  const caseEntry = guide ? { id: `${node.id}-case`, label: '案例推演' } : null;
  const experimentEntry = experiment
    ? { id: `${node.id}-experiment`, label: '思想实验' }
    : !guide && node.example
      ? { id: `${node.id}-example`, label: '一个例子' }
      : null;

  /*
    区块顺序按「读者需要先懂什么」排，不按数据结构的字段顺序排。

    本轮改掉的那一处是：概念解释（「先把问题拆开」）原本排在「定义与边界」
    之后，而「定义与边界」几乎每一页都已经在用这些概念——自由那一页的
    第二块就同时出现相容论、不相容论、决定论、宿命论、基本应得和责任的
    三种意义，它们的解释要再往下翻一屏才到。现在概念紧跟在「问题为何会
    出现」后面，「定义与边界」拿到的是已经解释过的词。

    这个数组和下面的渲染顺序必须一致，否则目录会指向一个还没出现的锚点。
  */
  const toc = [
    ledger && { id: `${node.id}-origin`, label: headings.origin },
    guide && { id: `${node.id}-orientation`, label: '先把问题拆开' },
    ledger && { id: `${node.id}-boundaries`, label: headings.boundaries },
    notes.length > 0 && { id: `${node.id}-notes`, label: '阅读提醒' },
    argument && { id: `${node.id}-argument`, label: '论证地图' },
    positions.length > 0 && { id: `${node.id}-positions`, label: headings.positions },
    ledger && { id: `${node.id}-objections`, label: headings.objections },
    guide?.philosopherViews?.length && { id: `${node.id}-voices`, label: '哲学家怎样改写这个问题' },
    caseEntry,
    experimentEntry,
    ledger && { id: `${node.id}-confusions`, label: headings.confusions },
    !guide && figures.length > 0 && { id: `${node.id}-figures`, label: '相关人物与文本' },
    guide && { id: `${node.id}-texts`, label: '人物与原典' },
    comparisons.length > 0 && { id: `${node.id}-comparisons`, label: '跨传统的可比问题' },
    ledger &&
      ledger.historicalContext.length > 0 && {
        id: `${node.id}-history`,
        label: headings.historicalContext,
      },
    ledger?.takeaway && { id: `${node.id}-takeaway`, label: '回到问题' },
    guide?.nextQuestions.length && { id: `${node.id}-next-questions`, label: '带着问题继续读' },
    relationGroups.length > 0 && { id: `${node.id}-next`, label: '继续学习' },
  ].filter((entry): entry is { id: string; label: string } => Boolean(entry));

  // 「存在与变化」有自己一条手写教学主线；新增能力挂在它后面，不套通用模板。
  if (node.id === 'pt-being-change') {
    return (
      <div className="philosophy-body-main">
        {/* 手写主线也从「本页范围」开始：这一行是每个条目页共有的，不能因为走了提前 return 就丢掉。 */}
        {ledger && (
          <p className="philosophy-scope">
            <span className="philosophy-scope-label">本页范围</span>
            {ledger.scope}
          </p>
        )}
        <ReadingPrep assumed={ledger?.assumed} nodeId={node.id} />
        {/*
          具体入口也要渲染。它原本只写在下面的通用模板里，于是这条手写主线
          会把来源账里写好的 entry 整块吞掉——和当年「本页范围」漏在提前
          return 之外是同一个毛病。这里不带「问题为何会出现」那个标题：
          手写主线的第一节自己就是问题的起点。
        */}
        {ledger?.entry && (
          <div className="philosophy-opening philosophy-opening--standalone">
            <p className="philosophy-opening-scene">{ledger.entry.scene}</p>
            <p className="philosophy-opening-turn">{ledger.entry.turn}</p>
          </div>
        )}
        <BeingChangeEntry node={node} />
        <SharedTail
          argument={argument}
          comparisons={comparisons}
          experiment={experiment}
          headingLevel={headingLevel}
          ledger={ledger}
          // 手写主线也要有出口：没有语义关系时退回 data.json 的 related，
          // 否则这一页会变成全库最强也最孤立的一页。
          legacyRelated={legacyRelated}
          nextQuestions={guide?.nextQuestions}
          node={node}
          relationGroupCount={relationGroups.length}
        />
      </div>
    );
  }

  return (
    <div className="philosophy-body-main">
      {ledger && (
        <p className="philosophy-scope">
          <span className="philosophy-scope-label">本页范围</span>
          {ledger.scope}
        </p>
      )}

      <ReadingPrep assumed={ledger?.assumed} nodeId={node.id} />

      <GuidanceLead node={node} />

      {toc.length > 6 && (
        <nav aria-label="本页区块导航" className="philosophy-toc">
          {toc.map((entry) => (
            <a href={`#${entry.id}`} key={entry.id}>
              {entry.label}
            </a>
          ))}
        </nav>
      )}

      {ledger && (
        <section aria-labelledby={`${node.id}-origin`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-origin`}>
            {headings.origin}
          </BlockHeading>
          {/*
            具体入口排在概括之前。这一页要讨论的东西先以一个能想象的情形出现，
            再由它逼出问题——而不是先给一句「本问题在两种直觉的冲突中产生」，
            让读者一边猜画面一边读判断。
          */}
          {ledger.entry && (
            <div className="philosophy-opening">
              <p className="philosophy-opening-scene">{ledger.entry.scene}</p>
              <p className="philosophy-opening-turn">{ledger.entry.turn}</p>
            </div>
          )}
          <LedgerProse paragraphs={ledger.origin} sources={sources} />
        </section>
      )}

      {/*
        概念解释排在「定义与边界」之前。顺序改过来的理由写在上面 toc 那段注释里：
        边界那一块本来就在用这些词做推理，解释却排在它后面。
      */}
      {guide && (
        <section
          aria-labelledby={`${node.id}-orientation`}
          className="philosophy-block philosophy-study-intro"
          id="concepts"
        >
          <BlockHeading className="philosophy-block-title" id={`${node.id}-orientation`}>
            先把问题拆开
          </BlockHeading>
          <p className="philosophy-study-orientation">{guide.orientation}</p>
          {guide.conceptRefs && <ConceptList currentNodeId={node.id} refs={guide.conceptRefs} />}
          {guide.concepts.length > 0 && (
            <dl className="philosophy-concept-grid">
              {guide.concepts.map((concept) => (
                <div key={concept.term}>
                  <dt>{concept.term}</dt>
                  <dd>{concept.explanation}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      {ledger && (
        <section aria-labelledby={`${node.id}-boundaries`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-boundaries`}>
            {headings.boundaries}
          </BlockHeading>
          <LedgerProse paragraphs={ledger.boundaries} sources={sources} />
        </section>
      )}

      {notes.length > 0 && (
        <section aria-labelledby={`${node.id}-notes`} className="philosophy-block">
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

      {argument && (
        <section aria-labelledby={`${node.id}-argument`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-argument`}>
            论证地图
          </BlockHeading>
          <ArgumentMap map={argument} sources={sources} />
        </section>
      )}

      {positions.length > 0 && (
        <section aria-labelledby={`${node.id}-positions`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-positions`}>
            {headings.positions}
          </BlockHeading>
          {/*
            导语放在区块开头，而不是最后一张卡片的论证路径末尾：读者是按顺序
            读的，「这三项不是三选一」写在第三张卡片里等于没写。
          */}
          {ledger?.positionsIntro && (
            <p className="philosophy-block-intro">{ledger.positionsIntro}</p>
          )}
          <ol className="philosophy-positions">
            {positions.map((position, index) => {
              // 按立场名取论证路径，不按下标：下标对齐曾把论证挂到别的立场上。
              const argument = guide?.positionArguments?.[position.name];
              return (
              <li key={position.name}>
                <p aria-hidden="true" className="philosophy-position-index" lang="en">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <SubHeading className="philosophy-position-name">{position.name}</SubHeading>
                <p className="philosophy-position-text">{position.text}</p>
                {argument && (
                  <>
                    <ClaimSources ids={argument.sourceIds} sources={sources} />
                    <div className="philosophy-position-path">
                      <p>论证路径</p>
                      <ol>
                        {argument.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
                {position.objection && (
                  <p className="philosophy-position-objection">
                    {/* 适用限制不是反驳，不能和真正的反驳共用一个标签。 */}
                    <span
                      className={
                        position.objectionKind && position.objectionKind !== '反对意见'
                          ? 'philosophy-tag philosophy-tag--scope'
                          : 'philosophy-tag'
                      }
                    >
                      {position.objectionKind ?? '反对意见'}
                    </span>
                    {position.objection}
                  </p>
                )}
                {position.response && (
                  <p className="philosophy-position-response">
                    <span className="philosophy-tag philosophy-tag--response">回应</span>
                    {position.response}
                  </p>
                )}
              </li>
              );
            })}
          </ol>
        </section>
      )}

      {ledger && (
        <section aria-labelledby={`${node.id}-objections`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-objections`}>
            {headings.objections}
          </BlockHeading>
          <LedgerProse paragraphs={ledger.objections} sources={sources} />
        </section>
      )}

      {guide?.philosopherViews && guide.philosopherViews.length > 0 && (
        <section aria-labelledby={`${node.id}-voices`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-voices`}>
            哲学家怎样改写这个问题
          </BlockHeading>
          <p className="philosophy-block-intro">
            这些人不是在为同一条现成结论各投一票，他们的名字也不等于某个立场的标签。每一则先回到他本来在处理的问题，再看它能怎样推进本页的讨论；「不能直接推出」那一行挡的是跨时代、跨传统的草率等同。
          </p>
          <div className="philosophy-voices">
            {guide.philosopherViews.map((view) => (
              <article key={`${view.philosopher}-${view.work}`}>
                <p className="philosophy-voice-period">{view.period}</p>
                <div>
                  <SubHeading>{view.philosopher}</SubHeading>
                  <p className="philosophy-voice-work">{view.work}</p>
                  <p>{view.framing}</p>
                  <p className="philosophy-voice-application">
                    <span>对本页的推进</span>
                    {view.application}
                  </p>
                  <p className="philosophy-voice-caution">
                    <span>不能直接推出</span>
                    {view.caution}
                  </p>
                  <ClaimSources ids={view.sourceIds} sources={sources} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {guide && (
        <section aria-labelledby={`${node.id}-case`} className="philosophy-block">
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
      )}

      {experiment ? (
        <section aria-labelledby={`${node.id}-experiment`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-experiment`}>
            思想实验
          </BlockHeading>
          <ThoughtExperiment experiment={experiment} />
        </section>
      ) : !guide && node.example ? (
        <section aria-labelledby={`${node.id}-example`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-example`}>
            一个例子
          </BlockHeading>
          <p className="philosophy-example">{node.example}</p>
        </section>
      ) : null}

      {ledger && (
        <section aria-labelledby={`${node.id}-confusions`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-confusions`}>
            {headings.confusions}
          </BlockHeading>
          <ul className="philosophy-confusions">
            {ledger.confusions.map((paragraph, index) => (
              <li key={`${paragraph.kind}-${index}`}>
                <span className="philosophy-content-kind">
                  {paragraph.kind}
                  <span className="sr-only">：</span>
                </span>
                {/*
                  这一栏也要过一遍行内概念注解。以前它直接输出 paragraph.text，于是
                  「容易混淆的地方」里写的 [[concept-id|显示文本]] 原样印在页面上——
                  正是最该解释术语的那一栏，把标记本身给了读者。<li> 里可以放 <details>，
                  不像 <p> 会被提前闭合，所以这里直接用 renderProse。
                */}
                {hasGloss(paragraph.text) ? renderProse(paragraph.text) : paragraph.text}
                <Citations ids={paragraph.sourceIds} sources={sources} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {!guide && figures.length > 0 && (
        <section aria-labelledby={`${node.id}-figures`} className="philosophy-block">
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

      {guide && (
        <section aria-labelledby={`${node.id}-texts`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-texts`}>
            人物与原典：从哪里读起
          </BlockHeading>
          <p className="philosophy-block-intro">
            先抓住每部文本在这场争论里要解决什么问题，再回到原文核对它自己的论证。
          </p>
          <ol className="philosophy-texts">
            {guide.texts.map((text, index) => (
              <li key={`${text.author}-${text.work}`}>
                <p aria-hidden="true" className="philosophy-text-index">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="philosophy-text-author">{text.author}</p>
                <SubHeading>{text.work}</SubHeading>
                <p className="philosophy-text-period">{text.period}</p>
                <p className="philosophy-text-contribution">{text.contribution}</p>
                <ClaimSources ids={text.sourceIds} sources={sources} />
                <p className="philosophy-text-question">
                  <span>带着这个问题读</span>
                  {text.readingQuestion}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <SharedTail
        argument={undefined}
        comparisons={comparisons}
        experiment={undefined}
        headingLevel={headingLevel}
        ledger={ledger}
        legacyRelated={legacyRelated}
        legacySources={legacySources}
        nextQuestions={guide?.nextQuestions}
        node={node}
        relationGroupCount={relationGroups.length}
      />
    </div>
  );
}

/**
 * 所有条目共享的尾部：跨传统比较、历史线索、继续学习、研究层。
 *
 * 「存在与变化」那条手写主线也走这里，所以新增能力不必在两处各写一遍。
 * argument / experiment 只有手写页需要传进来——通用模板已经在正文中间
 * 按顺序渲染过它们了。
 */
function SharedTail({
  argument,
  comparisons,
  experiment,
  headingLevel,
  ledger,
  legacyRelated = [],
  legacySources = [],
  nextQuestions,
  node,
  relationGroupCount,
}: {
  argument: ReturnType<typeof getArgumentMap>;
  comparisons: ReturnType<typeof comparisonsForNode>;
  experiment: ReturnType<typeof getThoughtExperiment>;
  headingLevel: HeadingLevel;
  ledger: CoreEntryLedger | undefined;
  legacyRelated?: PhilosophyNode[];
  legacySources?: { label: string; url: string }[];
  nextQuestions?: string[];
  node: PhilosophyNode;
  relationGroupCount: number;
}) {
  const BlockHeading = headingLevel;
  const sources = ledger?.sources ?? [];

  return (
    <>
      {argument && (
        <section aria-labelledby={`${node.id}-argument`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-argument`}>
            论证地图
          </BlockHeading>
          <ArgumentMap map={argument} sources={sources} />
        </section>
      )}

      {experiment && (
        <section aria-labelledby={`${node.id}-experiment`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-experiment`}>
            思想实验
          </BlockHeading>
          <ThoughtExperiment experiment={experiment} />
        </section>
      )}

      {comparisons.length > 0 && (
        <section aria-labelledby={`${node.id}-comparisons`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-comparisons`}>
            跨传统的可比问题
          </BlockHeading>
          <p className="philosophy-block-intro">
            比较不从「哪个传统相当于哪一派」开始，而从一个双方真的能对话的问题开始；每一栏按它
            自己的问题框架陈述，不译成同一套术语。
          </p>
          {comparisons.map((item) => (
            // 比较栏的角标以前只在 item.sources 里查，条目来源账已登记过的材料
            // 要想引用就得再登记一遍。两边都给，编号才是全页一套。
            <ComparisonBlock item={item} key={item.id} ledgerSources={sources} />
          ))}
        </section>
      )}

      {ledger && ledger.historicalContext.length > 0 && (
        <section aria-labelledby={`${node.id}-history`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-history`}>
            {ledger.sectionHeadings?.historicalContext ?? '放回历史线索'}
          </BlockHeading>
          <ul className="philosophy-history-links">
            {ledger.historicalContext.map((item) => {
              const historyNode = getNodeById(item.nodeId);
              // 链接文字取节点当前标题，不取 label：label 是手写副本，本轮审查
              // 查出 13 处已经和目标页标题对不上，页面显示的是不存在的标题。
              return (
                <li key={item.nodeId}>
                  {historyNode ? (
                    <Link href={nodeHref(historyNode)}>{historyNode.title}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  <p>{item.note}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/*
        回到问题。放在「带着问题继续读」之前：先把这一页收住，再往外走。
        四问是分开的四件事，所以逐条给标签，而不是合成一段「总之……」。
      */}
      {ledger?.takeaway && (
        <section aria-labelledby={`${node.id}-takeaway`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-takeaway`}>
            回到问题：现在能说什么
          </BlockHeading>
          <dl className="philosophy-takeaway">
            <div>
              <dt>这一页在问什么</dt>
              <dd>{ledger.takeaway.question}</dd>
            </div>
            <div>
              <dt>分歧落在哪里</dt>
              <dd>{ledger.takeaway.split}</dd>
            </div>
            <div>
              <dt>现在可以确定什么</dt>
              <dd>{ledger.takeaway.settled}</dd>
            </div>
            <div>
              <dt>还不能确定什么</dt>
              <dd>{ledger.takeaway.open}</dd>
            </div>
          </dl>
        </section>
      )}

      {nextQuestions && nextQuestions.length > 0 && (
        <section aria-labelledby={`${node.id}-next-questions`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-next-questions`}>
            带着问题继续读
          </BlockHeading>
          <ul className="philosophy-next-questions">
            {nextQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
      )}

      {relationGroupCount > 0 ? (
        <section aria-labelledby={`${node.id}-next`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-next`}>
            继续学习
          </BlockHeading>
          <p className="philosophy-block-intro">
            这几条不是按相似度推荐的：分组标题说明它和本页构成哪一种关系，下面那句话说明为什么
            值得现在就读。
          </p>
          <NextSteps nodeId={node.id} />
        </section>
      ) : (
        legacyRelated.length > 0 && (
          <section aria-labelledby={`${node.id}-related`} className="philosophy-block">
            <BlockHeading className="philosophy-block-title" id={`${node.id}-related`}>
              相关节点
            </BlockHeading>
            <ul className="philosophy-related">
              {legacyRelated.map((relatedNode) => (
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
        )
      )}

      {!ledger && legacySources.length > 0 && (
        <section aria-labelledby={`${node.id}-sources`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-sources`}>
            延伸阅读
          </BlockHeading>
          <ul className="philosophy-sources">
            {legacySources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.label}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（在新标签页打开）</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/*
        研究层的来源统计覆盖整页，而不是只数 ledger：论证地图、跨传统比较、
        思想实验和概念卡的自带来源也在这一页上渲染，漏掉它们会让「N 条来源」
        小于读者实际点得到的角标数。
      */}
      {ledger && (
        <ResearchLayer ledger={ledger} nodeId={node.id} registry={collectPageSources(node.id)} />
      )}
    </>
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

  /*
    有建议顺序时按建议顺序排，并给每一条写出它排在这里的理由。
    没有理由就不排——一份没有理由的顺序只是把目录换了个次序，读者
    仍然不知道该从哪一篇开始。
  */
  const order = node.guidance?.order;
  const ordered = orderedChildren(node);

  return (
    <section aria-labelledby={`${node.id}-children`} className="philosophy-block">
      <BlockHeading className="philosophy-block-title" id={`${node.id}-children`}>
        {title}
      </BlockHeading>
      {order && (
        <p className="philosophy-block-intro">
          下面按建议的阅读顺序排列，每一条后面说明它为什么排在这里。任何一篇都可以单独打开，
          这个顺序只解决「先读哪一篇比较省力」。
        </p>
      )}
      {/*
        链接只包住标题，摘要留在链接外面：整块可点的卡片会把一整段摘要
        念成链接名，焦点框也会拉成一大块。
      */}
      <ul className="philosophy-children">
        {ordered.map((child, index) => (
          <li key={child.id}>
            <p className="philosophy-children-type" lang="zh-CN">
              {order && (
                <span className="philosophy-children-order" lang="en">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              {child.type}
            </p>
            <ItemHeading className="philosophy-children-title">
              <Link href={nodeHref(child)}>
                {child.title}
                <span aria-hidden="true"> ↗</span>
              </Link>
            </ItemHeading>
            <p className="philosophy-children-summary">{child.summary}</p>
            {childOrderNote(node, child.id) && (
              <p className="philosophy-children-note">
                <span>为什么排在这里</span>
                {childOrderNote(node, child.id)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
