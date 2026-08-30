import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPublishedDate, getPublishedPost } from '@/app/lib/posts';

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return { title: '文章未找到 — KILLUA.WIN' };
  }

  return {
    title: `${post.title} — KILLUA.WIN`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.published_at,
      url: `/notes/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <main className="post-page">
      <header className="site-header page-site-header">
        <Link className="wordmark" href="/" aria-label="killua.win 首页">
          <span className="wordmark-dot" />
          KILLUA.WIN
        </Link>
        <nav aria-label="主导航">
          <Link href="/">Home</Link>
          <Link href="/notes">Notes</Link>
        </nav>
        <span className="edition">ED. 001</span>
      </header>

      <article className="post-article">
        <header className="post-heading">
          <Link className="back-link" href="/notes">
            ← Back to notes
          </Link>
          <div className="post-meta">
            <time dateTime={post.published_at}>
              {formatPublishedDate(post.published_at)}
            </time>
            <span>{post.source}</span>
          </div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="post-deck">{post.excerpt}</p> : null}
        </header>

        <div className="post-layout">
          <aside aria-label="文章信息">
            <span>Archive no.</span>
            <strong>{post.published_at.slice(0, 4)}</strong>
          </aside>
          <div className="post-body">
            {paragraphs.map((paragraph, index) => (
              <p key={`${post.slug}-${index}`}>{paragraph}</p>
            ))}

            <div className="post-origin">
              <span>FROM THE ARCHIVE</span>
              <p>原载于 {post.source}，迁移时仅清理了排版与异常空格。</p>
              {post.source_url ? (
                <a href={post.source_url} rel="noreferrer" target="_blank">
                  查看原文 ↗
                </a>
              ) : null}
            </div>

            {post.ai_summary ? (
              <section className="post-analysis" aria-label="AI 分析总结">
                <span>AI READING NOTE</span>
                <p>{post.ai_summary}</p>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      <footer>
        <Link className="wordmark footer-mark" href="/">
          <span className="wordmark-dot" />
          KILLUA.WIN
        </Link>
        <p>Ideas need somewhere to land.</p>
        <p>© 2026 / ALL SYSTEMS NOMINAL</p>
      </footer>
    </main>
  );
}
