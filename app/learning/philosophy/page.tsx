import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { CoreQuestionGroups, NodeBody, type QuestionGroup } from './node-content';
import {
  coreSection,
  isCoreQuestion,
  neighborsOf,
  nodeHref,
  philosophyTree,
  questionDomains,
  traditions,
  traditionsSection,
} from './tree';

export const metadata = buildMetadata({
  title: '哲学 · 从问题开始',
  description:
    '按问题组织的哲学地图：五个问题域、17 个核心问题，以及西方、中国、印度三条平行的历史导航。',
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

export default function PhilosophyOverviewPage() {
  const { next } = neighborsOf(philosophyTree.id);

  return (
    <>
      <SiteHeader current="learning" />

      <main id="main" className="learning-page philosophy-page">
        <section className="philosophy-hero" aria-labelledby="philosophy-title">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Philosophy</span>
          </div>
          <div className="philosophy-hero-body">
            <nav className="philosophy-breadcrumb" aria-label="面包屑">
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

        <section className="philosophy-section" aria-labelledby="philosophy-overview-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>How to read it</span>
          </div>
          <div className="philosophy-section-body">
            <h2 className="philosophy-section-heading" id="philosophy-overview-heading">
              这张地图怎么用
            </h2>
            <NodeBody node={philosophyTree} headingLevel="h3" />
          </div>
        </section>

        <section className="philosophy-section" aria-labelledby="philosophy-core-heading">
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

        <section className="philosophy-section" aria-labelledby="philosophy-traditions-heading">
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

        {next && (
          <nav className="philosophy-pager" aria-label="哲学体系树导航">
            <div className="philosophy-pager-slot" />
            <Link className="philosophy-pager-link philosophy-pager-next" href={nodeHref(next)}>
              <span lang="en">NEXT ↗</span>
              <strong>{next.title}</strong>
            </Link>
          </nav>
        )}

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
