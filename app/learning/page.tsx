import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import { CoreQuestionGroups, type QuestionGroup } from './philosophy/node-content';
import { fastLaneSteps, principles, readingPaths, trackLabel } from './ai-workflow/curriculum';
import {
  liveSubjects,
  methodSectionNumber,
  plannedSubjects,
  subjectNumber,
  subjectSectionId,
  subjectSectionNumber,
  subjectSectionTone,
} from './subjects';
import {
  coreQuestions,
  isCoreQuestion,
  nodeHref,
  philosophyNodes,
  questionDomains,
  traditions,
} from './philosophy/tree';

export const metadata = buildMetadata({
  title: '学习空间｜哲学与 AI 编程工作流',
  description: `按科目组织的个人学习工作台：哲学铺开了 ${coreQuestions.length} 个核心问题与 ${traditions.length} 条传统导航，AI 编程工作流是一份把「想法 → 交付」拆开的课程设计，之后还会加别的科目。`,
  path: '/learning',
});

const questionGroups: QuestionGroup[] = questionDomains.map((domain) => ({
  id: domain.id,
  title: domain.title,
  href: nodeHref(domain),
  summary: domain.summary,
  questions: (domain.children ?? []).filter(isCoreQuestion).map((question) => ({
    id: question.id,
    title: question.title,
    href: nodeHref(question),
  })),
}));

/** 科目分区共用的外壳：编号、标签和深浅面都由科目清单决定。 */
function subjectSectionProps(id: string, label: string) {
  return {
    className: `learning-subject-section learning-subject-section--${subjectSectionTone(id)}`,
    id: subjectSectionId(id),
    number: subjectSectionNumber(id),
    label,
    headingId: `${subjectSectionId(id)}-heading`,
  };
}

const philosophy = subjectSectionProps('philosophy', 'Philosophy');
const aiWorkflow = subjectSectionProps('ai-workflow', 'AI workflow');

export default function LearningPage() {
  return (
    <>
      <SiteHeader current="learning" />
      <main id="main" className="learning-page">
        <PageHero
          description={
            <>
              先定位问题，再比较立场。现在铺开了 {liveSubjects.length} 门科目：哲学有 {philosophyNodes.length} 个节点、
              {coreQuestions.length} 个核心问题，AI 编程工作流有一份完整的课程设计。
            </>
          }
          eyebrow="Learn / 学习空间"
          label="Learning desk"
          number="01"
          title={<>FIND THE<br />RIGHT<br /><span className="outline">QUESTION.</span></>}
          titleId="learning-title"
        />

        <SectionNav
          label="学习页分区"
          items={[
            ...liveSubjects.map((subject) => ({
              href: `#${subjectSectionId(subject.id)}`,
              label: subject.title,
            })),
            { href: '#learning-method', label: '学习方法' },
          ]}
        />

        {/* 科目 01 · 哲学。原有的「按问题」「按传统」两条轴收进同一个分区。 */}
        <section className={philosophy.className} id={philosophy.id} aria-labelledby={philosophy.headingId}>
          <div className="section-label" lang="en">
            <span>{philosophy.number}</span>
            <span>{philosophy.label}</span>
          </div>
          <div className="learning-section-body">
            <p className="eyebrow">Subject {subjectNumber('philosophy')} / 哲学</p>
            <h2 id={philosophy.headingId}>
              {coreQuestions.length} 个核心问题，<br />每一个都可以单独读完。
            </h2>
            <p className="learning-section-lede">
              按问题类型排列，而不是按国别、时代或哲学家。每个问题都可以单独打开，也可以隔很久再回来重读；传统地图是平行的第二条轴，不是另一条主线。
            </p>
            <p className="learning-section-actions">
              <Link className="learning-inline-link" href="/learning/philosophy">
                哲学总览 <span aria-hidden="true">↗</span>
              </Link>
            </p>

            <h3 className="learning-block-heading" id="learning-philosophy-questions">
              按问题 / Main path
            </h3>
            <p className="learning-block-lede">
              {questionDomains.length} 个问题域，{coreQuestions.length} 个核心问题。这是主路径。
            </p>
            <CoreQuestionGroups groups={questionGroups} headingLevel="h4" />

            <h3 className="learning-block-heading" id="learning-philosophy-traditions">
              按传统 / Parallel history
            </h3>
            <p className="learning-block-lede">
              同一批问题，在不同传统里怎么被追问 —— 把它们放回文本、语言、制度与论辩史中。
            </p>
            <div className="learning-tradition-grid">
              {traditions.map((tradition) => (
                <article className="learning-tradition" key={tradition.id}>
                  <h4>
                    <Link href={nodeHref(tradition)}>
                      {tradition.title} <span aria-hidden="true">↗</span>
                    </Link>
                  </h4>
                  <p>{tradition.summary}</p>
                  <ul>
                    {(tradition.children ?? []).map((thread) => (
                      <li key={thread.id}>
                        <Link href={nodeHref(thread)}>{thread.title}</Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 科目 02 · AI 编程工作流。和哲学分区同一层。 */}
        <section className={aiWorkflow.className} id={aiWorkflow.id} aria-labelledby={aiWorkflow.headingId}>
          <div className="section-label light" lang="en">
            <span>{aiWorkflow.number}</span>
            <span>{aiWorkflow.label}</span>
          </div>
          <div className="learning-section-body">
            <p className="eyebrow">Subject {subjectNumber('ai-workflow')} / AI 编程工作流</p>
            <h2 id={aiWorkflow.headingId}>
              把「想法 → 交付」拆开，<br />默认档位刻意做轻。
            </h2>
            <p className="learning-section-lede">
              问题换成了「AI 已经能写代码，为什么还是交付不了」。断点有三个：输入没有闭合、责任没有划分、完成没有定义 —— 没有一个在提示词上。
            </p>
            <p className="learning-section-actions">
              <Link className="learning-inline-link" href="/learning/ai-workflow">
                课程设计总览 <span aria-hidden="true">↗</span>
              </Link>
            </p>

            <h3 className="learning-block-heading" id="learning-workflow-principles">
              三条原则 / Principles
            </h3>
            <p className="learning-block-lede">默认走轻的，升级靠触发器不靠自觉，流程预算不超过 20%。</p>
            <ol className="learning-workflow-principles" aria-labelledby="learning-workflow-principles">
              {principles.map((principle, index) => (
                <li key={principle.id}>
                  <span lang="en">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{principle.title}</strong>
                  <p>{principle.lede}</p>
                </li>
              ))}
            </ol>

            <h3 className="learning-block-heading" id="learning-workflow-steps">
              快车道五步 / Fast lane
            </h3>
            <p className="learning-block-lede">第一次约 10 分钟，熟练后 3 分钟，全程不产生任何流程文件。</p>
            <ol className="learning-workflow-steps" aria-labelledby="learning-workflow-steps">
              {fastLaneSteps.map((step) => (
                <li key={step.no}>
                  <span className="learning-workflow-step-index" lang="en" aria-hidden="true">
                    {step.no}
                  </span>
                  <strong>{step.title}</strong>
                  <span className="learning-workflow-step-cost">{step.cost}</span>
                </li>
              ))}
            </ol>

            <h3 className="learning-block-heading" id="learning-workflow-paths">
              三条阅读路径 / Reading paths
            </h3>
            <p className="learning-block-lede">不要从头读到尾；先读能当天用上的那 8 章。</p>
            <div className="learning-path-grid">
              {readingPaths.map((path) => (
                <article className={`learning-path${path.id === 'start' ? ' is-first' : ''}`} key={path.id}>
                  <p className="learning-path-tag" lang="en">
                    {trackLabel[path.track].en}
                    <span lang="zh-CN"> / {trackLabel[path.track].zh}</span>
                  </p>
                  <p className="learning-path-scale">
                    {path.scale}
                    <span>{path.cost}</span>
                  </p>
                  <p className="learning-path-outcome">{path.outcome}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 学习方法永远排在科目后面，编号随科目数量顺延。 */}
        <section className="learning-method" id="learning-method" aria-labelledby="learning-method-heading">
          <div className="section-label light" lang="en">
            <span>{methodSectionNumber}</span>
            <span>How to use</span>
          </div>
          <div className="learning-method-body">
            <p className="eyebrow">Learning loop / 学习循环</p>
            <h2 id="learning-method-heading">
              不是先记住答案，<br />而是先看见问题。
            </h2>
            <p className="learning-section-lede">
              这条循环对每门科目都一样：哲学里是立场与理由，AI 编程工作流里是方案与证据。
            </p>
            <ol className="learning-loop">
              <li>
                <span lang="en">01</span>
                <strong>定位问题</strong>
                <p>知道自己究竟在追问什么。</p>
              </li>
              <li>
                <span lang="en">02</span>
                <strong>比较立场</strong>
                <p>同时看见理由、前提和反对意见。</p>
              </li>
              <li>
                <span lang="en">03</span>
                <strong>连接生活</strong>
                <p>让抽象思想回应真实经验。</p>
              </li>
            </ol>

            <h3 className="learning-roadmap-heading" id="learning-roadmap-heading">
              之后的科目（规划中）
            </h3>
            <ul className="learning-roadmap" aria-labelledby="learning-roadmap-heading">
              {plannedSubjects.map((subject) => (
                <li key={subject.id}>
                  <span className="learning-roadmap-index" lang="en">
                    {subjectNumber(subject.id)}
                  </span>
                  <span className="learning-roadmap-title">
                    {subject.title}
                    <span className="learning-roadmap-code" lang="en">
                      {subject.code}
                    </span>
                  </span>
                  <span className="learning-roadmap-note">{subject.note}</span>
                  <span className="learning-roadmap-state" lang="en">
                    IN PLANNING
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
