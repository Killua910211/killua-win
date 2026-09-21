import type { LedgerSource } from './content-ledger';
import type { StudyGuide } from './study-guides';
import { ClaimSources } from './citation';
import { ConceptList } from './concept-card';

/**
 * 精读层里四个「数据驱动」的区块：概念、哲学家、案例推演、人物与原典。
 *
 * 抽出来的理由：手写教学主线（being-change、mind-self）走的是提前 return，
 * 拿不到通用模板里的这几段 JSX。当初 being-change 的做法是把内容重抄一遍，
 * 结果 study-guides.ts 里那一份就再也没人渲染——同一批论断有了两个版本，
 * 改一处不会改另一处。这里只抽 JSX，数据仍然只有 study-guides.ts 那一份。
 *
 * headingLevel 跟随调用页：条目页用 h2，嵌在别处时用 h3。
 */

type HeadingLevel = 'h2' | 'h3';

type SectionProps = {
  guide: StudyGuide;
  nodeId: string;
  sources: LedgerSource[];
  headingLevel?: HeadingLevel;
};

/**
 * 「先把问题拆开」。
 *
 * `id="concepts"` 挂在这一节上，不能改名：行内概念注解的「展开读」链到
 * `<页面>#concepts`（见 concept-card.tsx 的 expandHref），概念卡就在这里。
 */
export function GuideConcepts({
  guide,
  nodeId,
  headingLevel = 'h2',
  heading = '先把问题拆开',
}: SectionProps & { heading?: string }) {
  const BlockHeading = headingLevel;

  return (
    <section
      aria-labelledby={`${nodeId}-orientation`}
      className="philosophy-block philosophy-study-intro"
      id="concepts"
    >
      {/*
        标题可传入。通用模板里这一块排在正文之前，叫「先把问题拆开」；
        手写主线的页面把它移到了文末当参考，那里再叫「先」就与位置打架。
      */}
      <BlockHeading className="philosophy-block-title" id={`${nodeId}-orientation`}>
        {heading}
      </BlockHeading>
      <p className="philosophy-study-orientation">{guide.orientation}</p>
      {guide.conceptRefs && <ConceptList currentNodeId={nodeId} refs={guide.conceptRefs} />}
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
  );
}

/** 「哲学家怎样改写这个问题」。 */
export function GuideVoices({ guide, nodeId, sources, headingLevel = 'h2' }: SectionProps) {
  const BlockHeading = headingLevel;
  const SubHeading = headingLevel === 'h2' ? 'h3' : 'h4';
  if (!guide.philosopherViews || guide.philosopherViews.length === 0) return null;

  return (
    <section aria-labelledby={`${nodeId}-voices`} className="philosophy-block">
      <BlockHeading className="philosophy-block-title" id={`${nodeId}-voices`}>
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
  );
}

/** 「案例推演」。 */
export function GuideCaseStudy({ guide, nodeId, headingLevel = 'h2' }: SectionProps) {
  const BlockHeading = headingLevel;
  const SubHeading = headingLevel === 'h2' ? 'h3' : 'h4';

  return (
    <section aria-labelledby={`${nodeId}-case`} className="philosophy-block">
      <BlockHeading className="philosophy-block-title" id={`${nodeId}-case`}>
        案例推演
      </BlockHeading>
      <div className="philosophy-case-study">
        <SubHeading>{guide.caseStudy.title}</SubHeading>
        <p>{guide.caseStudy.setup}</p>
        <ol>
          {guide.caseStudy.prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 「人物与原典：从哪里读起」。 */
export function GuideTexts({ guide, nodeId, sources, headingLevel = 'h2' }: SectionProps) {
  const BlockHeading = headingLevel;
  const SubHeading = headingLevel === 'h2' ? 'h3' : 'h4';

  return (
    <section aria-labelledby={`${nodeId}-texts`} className="philosophy-block">
      <BlockHeading className="philosophy-block-title" id={`${nodeId}-texts`}>
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
  );
}
