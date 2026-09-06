import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { CoreQuestionGroups, type QuestionGroup } from './philosophy/node-content';
import {
  coreQuestions,
  isCoreQuestion,
  nodeHref,
  philosophyNodes,
  questionDomains,
  traditions,
} from './philosophy/tree';

export const metadata = buildMetadata({
  title: '学习空间｜哲学与跨学科问题地图',
  description: `按问题组织的个人学习工作台：${coreQuestions.length} 个哲学核心问题、${questionDomains.length} 个问题域，以及 ${traditions.length} 条平行的传统导航，可以随时回来查。`,
  path: '/learning',
});

const roadmap = [
  ['02', 'PSYCHOLOGY', '心理学', '理解心智、行为与关系'],
  ['03', 'HISTORY', '历史', '在时间与因果中理解世界'],
  ['04', 'SCIENCE', '科学', '从证据、模型与实验出发'],
] as const;

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

export default function LearningPage() {
  return (
    <>
      <SiteHeader current="learning" />
      <main id="main" className="learning-page">
        {/*
          Hero 现在是工作台的顶栏，不是海报：移动端整块压到 480px 以内，
          主 CTA 直接出现在首屏，且始终指向哲学地图——这里没有「上次读到哪」。
        */}
        <section className="learning-hero" aria-labelledby="learning-title">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Learning desk</span>
          </div>
          <div className="learning-hero-body">
            <p className="eyebrow">Learn / 学习空间</p>
            <h1 id="learning-title" lang="en">
              FIND THE <span className="outline">QUESTION.</span>
            </h1>
            <p className="learning-hero-intro">
              先定位问题，再比较立场。哲学部分已经铺好 {philosophyNodes.length} 个节点、
              {coreQuestions.length} 个核心问题。
            </p>
            <div className="learning-resume">
              <Link className="learning-resume-cta" href="/learning/philosophy">
                <span>进入哲学地图</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <p className="learning-resume-hint">
                {questionDomains.length} 个问题域 · 想到哪个问题就从哪个问题读起，随时可以回来重看。
              </p>
            </div>
            <p className="learning-hero-foot" lang="en">
              <span>Subject 001 · Philosophy · {philosophyNodes.length} nodes</span>
              <span>Growing archive · 2026</span>
            </p>
          </div>
        </section>

        <section className="learning-questions" aria-labelledby="learning-questions-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>By question</span>
          </div>
          <div className="learning-section-body">
            <p className="eyebrow">Main path / 按问题</p>
            <h2 id="learning-questions-heading">
              {coreQuestions.length} 个核心问题，<br />每一个都可以单独读完。
            </h2>
            <p className="learning-section-lede">
              这是主学习路径：按问题类型排列，而不是按国别、时代或哲学家。每个问题都可以单独打开，也可以隔很久再回来重读。
            </p>
            <p className="learning-section-actions">
              <Link className="learning-inline-link" href="/learning/philosophy">
                哲学总览 <span aria-hidden="true">↗</span>
              </Link>
            </p>
            <CoreQuestionGroups groups={questionGroups} />
          </div>
        </section>

        <section className="learning-traditions" aria-labelledby="learning-traditions-heading">
          <div className="section-label light" lang="en">
            <span>03</span>
            <span>By tradition</span>
          </div>
          <div className="learning-section-body">
            <p className="eyebrow">Parallel history / 按传统</p>
            <h2 id="learning-traditions-heading">
              同一批问题，<br />在不同传统里怎么被追问。
            </h2>
            <p className="learning-section-lede">
              传统地图是平行导航，不是另一条主线。它把问题放回文本、语言、制度与论辩史中。
            </p>
            <div className="learning-tradition-grid">
              {traditions.map((tradition) => (
                <article className="learning-tradition" key={tradition.id}>
                  <h3>
                    <Link href={nodeHref(tradition)}>
                      {tradition.title} <span aria-hidden="true">↗</span>
                    </Link>
                  </h3>
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

        <section className="learning-method" aria-labelledby="learning-method-heading">
          <div className="section-label light" lang="en">
            <span>04</span>
            <span>How to use</span>
          </div>
          <div className="learning-method-body">
            <p className="eyebrow">Learning loop / 学习循环</p>
            <h2 id="learning-method-heading">
              不是先记住答案，<br />而是先看见问题。
            </h2>
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
              之后的学科（规划中）
            </h3>
            <ul className="learning-roadmap" aria-labelledby="learning-roadmap-heading">
              {roadmap.map(([index, code, title, description]) => (
                <li key={code}>
                  <span className="learning-roadmap-index" lang="en">
                    {index}
                  </span>
                  <span className="learning-roadmap-title">
                    {title}
                    <span className="learning-roadmap-code" lang="en">
                      {code}
                    </span>
                  </span>
                  <span className="learning-roadmap-note">{description}</span>
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
