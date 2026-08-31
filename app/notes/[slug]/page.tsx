import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata, SITE } from '@/app/lib/metadata';
import { formatPublishedDate, getPublishedPost, type Post } from '@/app/lib/posts';

/**
 * 从 force-dynamic 改成按需 ISR：第一个请求渲染并写入缓存，
 * 之后一小时内的请求直接命中，不再打 D1。
 *
 * 没有 generateStaticParams：vinext 的预渲染阶段跑在纯 Node 里
 * （run-prerender.js: "no wrangler/miniflare is needed"），构建期没有
 * D1 绑定，在那里查库会让 `vinext build` 直接失败。所以这里不做构建期
 * 静态化，只做运行期按需缓存 —— 对一个内容几乎不变的归档站，效果接近。
 *
 * 这一段**不要加 loading.tsx**。它会给整个 segment 套一层 Suspense，
 * 响应随之变成流式，200 在 notFound() 执行之前就已经提交 —— 线上实测
 * /notes/<不存在的 slug> 返回 200 而不是 404（没有 loading.tsx 的
 * /notes/category/<不存在> 同样调用 notFound()，返回的就是 404）。
 * 软 404 会被搜索引擎收录，代价远大于一块骨架屏。本地 wrangler dev
 * 不走这条流式路径，所以只能在部署后才看得出来。
 */
export const revalidate = 3600;

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // getPublishedPost 包了 React cache()，和下面的页面组件共享同一次查询。
  const post = await getPublishedPost(slug);

  if (!post) {
    return { title: '文章未找到', robots: { index: false, follow: true } };
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? SITE.description,
    path: `/notes/${post.slug}`,
    type: 'article',
    ...(post.published_at ? { publishedTime: post.published_at } : {}),
  });
}

/**
 * Article 结构化数据。
 *
 * JSON.stringify 不转义 `<`，标题里真出现 "</script" 就能从这个块里逃出去。
 * 把 `<` 全部转成 < 是这个场景的标准写法 —— JSON 里合法，HTML 解析器
 * 看不到闭合标签。
 */
function ArticleJsonLd({ post }: { post: Post }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    inLanguage: 'zh-CN',
    author: { '@type': 'Person', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/notes/${post.slug}`,
    image: `${SITE.url}${SITE.ogImage}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  // 只按空行切段。trim() 会吃掉全角空格 U+3000，所以纯全角空格的"空段"
  // 不会再渲染成一个撑出两行留白的空 <p>。
  const paragraphs = post.content.split(/\n{2,}/).filter((block) => block.trim() !== '');
  const archiveYear = post.published_at?.slice(0, 4) ?? null;

  return (
    <>
      <SiteHeader current="notes" />

      <main id="main" className="post-page">
        <ArticleJsonLd post={post} />

        <article className="post-article">
          <header className="post-heading">
            <Link className="back-link" href="/notes" lang="en">
              ← Back to notes
            </Link>
            <div className="post-meta">
              {post.published_at ? (
                <time dateTime={post.published_at}>
                  {formatPublishedDate(post.published_at)}
                </time>
              ) : null}
              <span>{post.category}</span>
              <span>{post.source}</span>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="post-deck">{post.excerpt}</p> : null}
          </header>

          <div className="post-layout">
            {archiveYear ? (
              <aside aria-label="文章信息">
                <span lang="en">Archive no.</span>
                <strong>{archiveYear}</strong>
              </aside>
            ) : (
              <div />
            )}
            <div className="post-body">
              {paragraphs.map((paragraph, index) => (
                <p key={`${post.slug}-${index}`}>{paragraph}</p>
              ))}

              <div className="post-origin">
                <span lang="en">FROM THE ARCHIVE</span>
                <p>原载于 {post.source}，迁移时仅清理了排版与异常空格。</p>
                {post.source_url ? (
                  <a href={post.source_url} rel="noreferrer noopener" target="_blank">
                    查看原文 ↗
                  </a>
                ) : null}
              </div>

              {post.ai_summary ? (
                <section className="post-analysis" aria-label="AI 分析总结">
                  <span lang="en">AI READING NOTE</span>
                  <p>{post.ai_summary}</p>
                </section>
              ) : null}
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
