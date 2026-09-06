import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { NodeBody, NodeChildren } from '../node-content';
import { ReadingProgress } from '../reading-state';
import {
  coreQuestionIds,
  getNodeBySlug,
  isCoreQuestion,
  neighborsOf,
  nodeHref,
  nodePath,
  nodeSlug,
  OVERVIEW_ID,
  philosophyNodes,
  shortDescription,
  type PhilosophyNode,
} from '../tree';

type NodePageProps = {
  params: Promise<{ node: string }>;
};

/**
 * 39 个节点全部在构建期生成。
 *
 * 数据来自仓库里的 data.json，没有数据库依赖，所以和 /notes 的分类页不同，
 * 这里可以放心用 generateStaticParams —— vinext 的预渲染跑在纯 Node 里。
 */
export function generateStaticParams() {
  return philosophyNodes
    .filter((node) => node.id !== OVERVIEW_ID)
    .map((node) => ({ node: nodeSlug(node) }));
}

function resolveNode(slug: string): PhilosophyNode | undefined {
  const node = getNodeBySlug(slug);
  // 总览住在 /learning/philosophy，不在这个动态段里重复一份。
  return node && node.id !== OVERVIEW_ID ? node : undefined;
}

export async function generateMetadata({ params }: NodePageProps): Promise<Metadata> {
  const { node: slug } = await params;
  const node = resolveNode(slug);

  if (!node) {
    return { title: '节点未找到' };
  }

  return buildMetadata({
    title: `${node.title} · 哲学`,
    description: shortDescription(node),
    path: `/learning/philosophy/${nodeSlug(node)}`,
  });
}

export default async function PhilosophyNodePage({ params }: NodePageProps) {
  const { node: slug } = await params;
  const node = resolveNode(slug);

  if (!node) {
    notFound();
  }

  const trail = nodePath(node.id).slice(0, -1);
  const { previous, next } = neighborsOf(node.id);
  const core = isCoreQuestion(node);
  const childrenTitle =
    node.type === '问题领域'
      ? '这个问题域下的核心问题'
      : node.type === '传统导航'
        ? '这条传统里的线索'
        : '下一层';

  return (
    <>
      <SiteHeader current="learning" />

      <main id="main" className="learning-page philosophy-page">
        <article>
          <section className="philosophy-hero" aria-labelledby="philosophy-node-title">
            <div className="section-label light" lang="en">
              <span>01</span>
              <span>Philosophy node</span>
            </div>
            <div className="philosophy-hero-body">
              <nav className="philosophy-breadcrumb" aria-label="面包屑">
                <Link href="/learning">学习空间</Link>
                {trail.map((ancestor) => (
                  <span className="philosophy-breadcrumb-item" key={ancestor.id}>
                    <span aria-hidden="true">/</span>
                    <Link href={nodeHref(ancestor)}>{ancestor.title}</Link>
                  </span>
                ))}
                <span className="philosophy-breadcrumb-item">
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{node.title}</span>
                </span>
              </nav>
              <p className="eyebrow">{node.type}</p>
              <h1 id="philosophy-node-title">{node.title}</h1>
              {node.question && <p className="philosophy-question">{node.question}</p>}
              <p className="philosophy-summary">{node.summary}</p>
              <ReadingProgress
                coreIds={coreQuestionIds}
                markId={core ? node.id : undefined}
                caption={core ? `${coreQuestionIds.length} core questions` : 'Reading progress'}
              />
            </div>
          </section>

          <section className="philosophy-section" aria-labelledby="philosophy-node-detail">
            <div className="section-label" lang="en">
              <span>02</span>
              <span>Detail</span>
            </div>
            <div className="philosophy-section-body">
              <h2 className="sr-only" id="philosophy-node-detail">
                {node.title}｜内容
              </h2>
              <NodeBody node={node} />
              <NodeChildren node={node} title={childrenTitle} />
            </div>
          </section>
        </article>

        <nav className="philosophy-pager" aria-label="哲学体系树导航">
          {previous ? (
            <Link className="philosophy-pager-link" href={nodeHref(previous)}>
              <span lang="en">↖ PREV</span>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <div className="philosophy-pager-slot" />
          )}
          {next ? (
            <Link className="philosophy-pager-link philosophy-pager-next" href={nodeHref(next)}>
              <span lang="en">NEXT ↗</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <div className="philosophy-pager-slot" />
          )}
        </nav>

        <p className="philosophy-legacy-note">
          回到 <Link href="/learning/philosophy">哲学总览</Link>，或使用旧版单页导航{' '}
          <a href="/learning/philosophy-tree">/learning/philosophy-tree</a>。
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
