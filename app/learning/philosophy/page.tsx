import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { buildMetadata } from '@/app/lib/metadata';
import { CoreQuestionGroups, NodeBody, type QuestionGroup } from './node-content';
import { philosophyCoverage } from './coverage';
import { basicPath } from './learning-path';
import { philosophyRelations } from './relations';
import {
  coreSection,
  coreQuestions,
  isCoreQuestion,
  nodeHref,
  orderedChildren,
  philosophyTree,
  questionDomains,
  traditions,
  traditionsSection,
} from './tree';

export const metadata = buildMetadata({
  title: '哲学 · 从问题开始',
  description: `按问题组织的哲学地图：${questionDomains.length} 个问题域、${coreQuestions.length} 个核心问题，以及 ${traditions.length} 条平行的传统导航。三个入口：从问题开始、按推荐路线系统学习、从传统进入。`,
  path: '/learning/philosophy',
});

/**
 * 条目页的固定结构。
 *
 * 写在总览上，是因为本轮把这套顺序当成教学承诺：概念解释排在「定义与边界」
 * 之前、前置理解排在正文之前、页尾一定有一块把分歧收回来。读者知道了这个形状，
 * 才谈得上「翻到任何一页都知道去哪里找」。
 *
 * 顺序必须与 `node-content.tsx` 的渲染顺序一致。
 */
const pageShape = [
  { block: '本页范围', does: '这一页处理哪一问，哪几问在别处处理。' },
  { block: '读这一页之前', does: '本页默认你已经有的区分，每条附一句回顾——不点过去也能继续读。' },
  { block: '问题为何会出现', does: '先给一个具体情形，再由它逼出这一页要处理的问题。' },
  { block: '先把问题拆开', does: '本页要用到的词在这里解释清楚，然后正文才开始用它们推理。两条手写教学主线（存在与变化、心灵、身体与「我」）例外：它们把每个概念放在正文第一次用到的位置讲，页末另附一份集中的概念一览。' },
  { block: '定义与边界', does: '争点到底是什么，以及哪几个相近的问题不是本页要争的。' },
  { block: '论证地图 / 主要立场', does: '每个立场从什么前提出发、被攻击哪一步、怎样回应、回应要付什么代价。' },
  { block: '有力反对及回应', does: '正文承认的最难回答的那一击，以及它是否真的被答掉。' },
  { block: '思想实验 / 案例推演', does: '改一个条件，看判断为什么跟着变；也写明它不能证明什么。' },
  { block: '回到问题', does: '核心问题、分歧落在哪一步、现在能确定什么、还不能确定什么。' },
  { block: '来源、核验与修订记录', does: '折叠在页尾的维护层：每条来源的定位与核验状态，以及本页还欠什么。' },
];

/*
  目录里的次序必须和问题域页上的次序一致。
  以前这里直接用 `domain.children`，也就是 data.json 的书写顺序；而问题域页
  现在按 `guidance.order` 编号显示。两处不一致时，总览会把逻辑排在第 02，
  点进「知识、理由与语言」却看到它是第 01。
*/
const questionGroups: QuestionGroup[] = questionDomains.map((domain) => ({
  id: domain.id,
  title: domain.title,
  href: nodeHref(domain),
  summary: domain.summary,
  questions: orderedChildren(domain)
    .filter(isCoreQuestion)
    .map((question) => ({
      id: question.id,
      title: question.title,
      href: nodeHref(question),
    })),
}));

/**
 * 三个入口。
 *
 * 「系统学习」排第一，是本轮改的：三个入口原来按「从问题开始 / 系统学习 /
 * 从传统进入」排，而第一个入口要求读者**已经**有一个想追问的问题。没有的人
 * 才是最需要帮助的那一种，他得跳过第一栏才找得到给自己的那条路。
 *
 * 另外两个入口没有被降级——它们回答的是另外两种真实需求，只是不该排在
 * 「我什么都不知道」前面。
 *
 * 版式上刻意克制：三条细规则线，不做成三张巨大的卡片。
 */
const entries = [
  {
    id: 'entry-path',
    title: '系统学习',
    href: '/learning/philosophy/path',
    for: '我什么都不知道，该从哪里开始？',
    note: `一条 ${basicPath.steps.length} 步的推荐基础路线：从一辆换光零件的自行车起步，最后落到死亡与意义。每一步都说明它为下一步准备了什么。剩下的 ${coreQuestions.length - basicPath.steps.length} 个核心问题按「你关心什么」列在同一页。`,
  },
  {
    id: 'entry-question',
    title: '从问题开始',
    href: '#by-question',
    for: '我现在就有一个想追问的问题。',
    note: `${coreQuestions.length} 个核心问题，分成 ${questionDomains.length} 个问题域列出。需要前置理解的那些页，开头会写明它默认你已经知道什么并附一句回顾；不写的那些，是因为它不需要。所以可以直接打开任何一页。`,
  },
  {
    id: 'entry-tradition',
    title: '从传统进入',
    href: '#by-tradition',
    for: '我想从某个传统的文本和论辩史进入。',
    note: `${traditions.length} 条平行的历史导航，各自按时段和思想线索展开。不必先读完核心问题再进来。`,
  },
];

export default function PhilosophyOverviewPage() {
  return (
    <>
      <SiteHeader current="learning" />

      <main className="learning-page philosophy-page" id="main">
        <section aria-labelledby="philosophy-title" className="philosophy-hero">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Philosophy</span>
          </div>
          <div className="philosophy-hero-body">
            <nav aria-label="面包屑" className="philosophy-breadcrumb">
              <Link href="/learning">学习空间</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">哲学</span>
            </nav>
            <p className="eyebrow">{philosophyTree.type} / Philosophy</p>
            <h1 id="philosophy-title">{philosophyTree.title}</h1>
            {philosophyTree.question && (
              <p className="philosophy-question">{philosophyTree.question}</p>
            )}
            <p className="philosophy-summary">{philosophyTree.summary}</p>
          </div>
        </section>

        <SectionNav
          items={[
            { href: '#entries', label: '三个入口' },
            { href: '#by-question', label: '按问题' },
            { href: '#by-tradition', label: '按传统' },
            { href: '#how-to-read', label: '怎么读' },
          ]}
          label="哲学分区"
        />

        <section aria-labelledby="entries-heading" className="philosophy-section" id="entries">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Ways in</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Ways in / 三个入口</p>
            <h2 className="philosophy-section-heading" id="entries-heading">
              你现在是哪一种情况？
            </h2>
            <p className="philosophy-lede">
              三个入口指向同一批内容，只是起点不同。没有特别想追问的问题，就走第一个。你也可以都不选，直接打开
              <Link className="philosophy-inline-map-link" href="/learning/philosophy/map">
                哲学知识地图
              </Link>
              ，用 {philosophyRelations.length} 条写明理由的连接找路。
            </p>

            <div className="philosophy-entries">
              {entries.map((entry) => (
                <article className="philosophy-entry" key={entry.id}>
                  <h3>
                    <Link href={entry.href}>
                      {entry.title}
                      <span aria-hidden="true"> ↗</span>
                    </Link>
                  </h3>
                  <p className="philosophy-entry-for">{entry.for}</p>
                  <p className="philosophy-entry-note">{entry.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="philosophy-core-heading" className="philosophy-section" id="by-question">
          <div className="section-label" lang="en">
            <span>03</span>
            <span>By question</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Main path / 按问题</p>
            <h2 className="philosophy-section-heading" id="philosophy-core-heading">
              {coreSection.title}
            </h2>
            <p className="philosophy-lede">{coreSection.summary}</p>
            {(coreSection.notes ?? []).length > 0 && (
              <ul className="philosophy-notes">
                {(coreSection.notes ?? []).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
            <CoreQuestionGroups groups={questionGroups} />
          </div>
        </section>

        <section
          aria-labelledby="philosophy-traditions-heading"
          className="philosophy-section"
          id="by-tradition"
        >
          <div className="section-label" lang="en">
            <span>04</span>
            <span>By tradition</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Parallel history / 按传统</p>
            <h2 className="philosophy-section-heading" id="philosophy-traditions-heading">
              {traditionsSection.title}
            </h2>
            <p className="philosophy-lede">{traditionsSection.summary}</p>
            {(traditionsSection.notes ?? []).length > 0 && (
              <ul className="philosophy-notes">
                {(traditionsSection.notes ?? []).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}

            <div className="philosophy-tradition-grid">
              {traditions.map((tradition) => (
                <article className="philosophy-tradition" key={tradition.id}>
                  <h3>
                    <Link href={nodeHref(tradition)}>{tradition.title}</Link>
                  </h3>
                  <p>{tradition.summary}</p>
                  <ul>
                    {orderedChildren(tradition).map((thread) => (
                      <li key={thread.id}>
                        <Link href={nodeHref(thread)}>
                          <span className="philosophy-thread-type" lang="zh-CN">
                            {thread.type}
                          </span>
                          <span>{thread.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="how-to-read-heading" className="philosophy-section" id="how-to-read">
          <div className="section-label" lang="en">
            <span>05</span>
            <span>How to read it</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Scope / 范围与缺口</p>
            <h2 className="philosophy-section-heading" id="how-to-read-heading">
              这套内容怎么读，以及它还没做到什么
            </h2>
            <p className="philosophy-lede">
              下面这几块每页都有，顺序也固定。除此之外各页还会按内容多出几块——哲学家怎样改写这个问题、容易混淆的地方、人物与原典、跨传统的可比问题、放回历史线索。《存在与变化》那一页是单独写的教学主线，区块名与下表不同，但顺序遵循同一条线。
            </p>
            <ol className="philosophy-page-shape">
              {pageShape.map((item) => (
                <li key={item.block}>
                  <strong>{item.block}</strong>
                  <span>{item.does}</span>
                </li>
              ))}
            </ol>
            <NodeBody headingLevel="h3" node={philosophyTree} />

            <h3 className="philosophy-block-title philosophy-coverage-heading">本版覆盖范围</h3>
            <p className="philosophy-lede">
              每篇的状态由正文、来源定位和审查记录决定；目录、标题和参考书目本身不算完成。
            </p>
            <dl className="philosophy-coverage-map">
              {Object.values(philosophyCoverage).map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <p className="philosophy-legacy-note">
          旧版单页导航仍然可用：
          <a href="/learning/philosophy-tree">/learning/philosophy-tree</a>
          （含站内搜索与可展开的目录树）。
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
