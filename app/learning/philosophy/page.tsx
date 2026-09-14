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

/**
 * 三个入口。
 *
 * 「从问题开始」仍然是核心，排第一，并且它指向的就是原来那份核心问题清单——
 * 新增另外两个入口不是为了取代它，而是因为「我什么都不知道」和「我想从某个
 * 传统进入」是它回答不了的两种真实需求。
 *
 * 版式上刻意克制：三条细规则线，不做成三张巨大的卡片。
 */
const entries = [
  {
    id: 'entry-question',
    title: '从问题开始',
    href: '#by-question',
    for: '我现在对某个问题感兴趣。',
    note: `${coreQuestions.length} 个核心问题，分成 ${questionDomains.length} 个问题域列出。每一个都可以单独读完，不必从第一个开始。`,
  },
  {
    id: 'entry-path',
    title: '系统学习',
    href: '/learning/philosophy/path',
    for: '我什么都不知道，该从哪里开始？',
    note: `一条 ${basicPath.steps.length} 步的推荐基础路线，从一个日常判断起步，最后落到死亡与意义。它不是唯一正确的顺序。`,
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
              三个入口指向同一批内容，只是起点不同。你也可以都不选，直接打开
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
                    {(tradition.children ?? []).map((thread) => (
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
