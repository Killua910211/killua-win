import Link from 'next/link';
import { getNodeById, nodeHref, type PhilosophyNode } from './tree';
import { getStudyGuide } from './study-guides';
import { getCoreEntryLedger, type CoreEntryLedger, type LedgerParagraph } from './content-ledger';
import { BeingChangeEntry } from './being-change-entry';
import { getArgumentMap } from './argument-maps';
import { getThoughtExperiment } from './thought-experiments';
import { comparisonsForNode } from './comparisons';
import { relationGroupsFor } from './relations';
import { ArgumentMap } from './argument-map';
import { Citations, ClaimSources } from './citation';
import { ComparisonBlock } from './comparison';
import { ConceptList } from './concept-card';
import { NextSteps } from './next-steps';
import { Prose } from './prose';
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
  const experimentEntry = experiment
    ? { id: `${node.id}-experiment`, label: '思想实验' }
    : guide
      ? { id: `${node.id}-case`, label: '案例推演' }
      : node.example
        ? { id: `${node.id}-example`, label: '一个例子' }
        : null;

  const toc = [
    ledger && { id: `${node.id}-origin`, label: headings.origin },
    ledger && { id: `${node.id}-boundaries`, label: headings.boundaries },
    notes.length > 0 && { id: `${node.id}-notes`, label: '阅读提醒' },
    guide && { id: `${node.id}-orientation`, label: '先把问题拆开' },
    argument && { id: `${node.id}-argument`, label: '论证地图' },
    positions.length > 0 && { id: `${node.id}-positions`, label: headings.positions },
    ledger && { id: `${node.id}-objections`, label: headings.objections },
    guide?.philosopherViews?.length && { id: `${node.id}-voices`, label: '哲学家怎样改写这个问题' },
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
    guide?.nextQuestions.length && { id: `${node.id}-next-questions`, label: '带着问题继续读' },
    relationGroups.length > 0 && { id: `${node.id}-next`, label: '继续学习' },
  ].filter((entry): entry is { id: string; label: string } => Boolean(entry));

  // 「存在与变化」有自己一条手写教学主线；新增能力挂在它后面，不套通用模板。
  if (node.id === 'pt-being-change') {
    return (
      <div className="philosophy-body-main">
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
          <LedgerProse paragraphs={ledger.origin} sources={sources} />
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
          {guide.conceptRefs && <ConceptList refs={guide.conceptRefs} />}
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
            下面这些人并不是在为同一条现成结论各投一票。每一则先说明这个人原来的论证在处理什么问题、着力点在哪里，再说明它能怎样推进本页的讨论；“不能直接推出”那一行是用来挡住跨时代、跨传统的草率等同的。
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

      {experiment ? (
        <section aria-labelledby={`${node.id}-experiment`} className="philosophy-block">
          <BlockHeading className="philosophy-block-title" id={`${node.id}-experiment`}>
            思想实验
          </BlockHeading>
          <ThoughtExperiment experiment={experiment} />
        </section>
      ) : guide ? (
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
      ) : node.example ? (
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
                {paragraph.text}
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
            先抓住每部文本在争论中解决什么问题，再回到原文核对论证；不要把作者的名字当成某个立场的标签。
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
            比较不从「哪个传统相当于哪一派」开始，而从一个双方真的能对话的问题开始。每一栏保留它
            自己的问题框架；它们不一定在回答完全相同的问题。
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
            每一条都说明为什么推荐它：是前置知识，是另一种回答，是一个反驳，是延伸问题，还是一个
            只能并置比较的跨传统问题。
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

  return (
    <section aria-labelledby={`${node.id}-children`} className="philosophy-block">
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
