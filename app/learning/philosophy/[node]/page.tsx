import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { NodeBody, NodeChildren } from '../node-content';
import { pagerContextsFor } from '../pager';
import {
  getNodeBySlug,
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

// 条目正文由随部署发布的来源账驱动。关闭跨部署的页面缓存，避免新修订的
// 历史／问题页继续显示上一版静态正文；静态素材仍由 CDN 缓存。
export const revalidate = 0;

/**
 * 除总览外，枚举全部节点的路由参数。
 *
 * 数据来自仓库里的 data.json，没有数据库依赖，所以和 /notes 的分类页不同，
 * 这里可以放心枚举。但注意：上面的 `revalidate = 0` 把这条路由标成了 Dynamic，
 * 所以这份清单当前**不会**产出预渲染的 HTML/RSC 产物——节点页是按请求渲染的。
 * 条目数据的结构性校验因此也不靠构建兜底，见 `pnpm test:philosophy`。
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
  const pagerContexts = pagerContextsFor(node.id);
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

        {/*
          分页器按语境分组：同一问题域／同一传统里的次序是一组，推荐路线的
          前后步是另一组。目录页没有合理顺序，`pagerContextsFor` 返回空数组，
          这里就什么都不渲染——不给一条并不存在的阅读线。
        */}
        {pagerContexts.map((context) => (
          <nav className="philosophy-pager" aria-label={context.label} key={context.label}>
            <p className="philosophy-pager-context">{context.label}</p>
            {context.previous ? (
              <Link className="philosophy-pager-link" href={nodeHref(context.previous)}>
                <span lang="en">↖ PREV</span>
                <strong>{context.previous.title}</strong>
              </Link>
            ) : (
              <div className="philosophy-pager-slot" />
            )}
            {context.next ? (
              <Link className="philosophy-pager-link philosophy-pager-next" href={nodeHref(context.next)}>
                <span lang="en">NEXT ↗</span>
                <strong>{context.next.title}</strong>
              </Link>
            ) : (
              <div className="philosophy-pager-slot" />
            )}
          </nav>
        ))}

      </main>

      <SiteFooter />
    </>
  );
}
