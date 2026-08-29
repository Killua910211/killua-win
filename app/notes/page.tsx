import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPublishedDate, listPublishedPosts } from '@/app/lib/posts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notes — KILLUA.WIN',
  description: '旧文章与新想法，在这里继续生长。',
};

export default async function NotesPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="notes-page">
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

      <section className="notes-hero">
        <div className="section-label light">
          <span>01</span>
          <span>Writing archive</span>
        </div>
        <div>
          <p className="eyebrow">Notes / 碎片与思考</p>
          <h1>
            OLD WORDS,
            <br />
            NEW <span className="outline">LIGHT.</span>
          </h1>
          <p className="notes-intro">
            从旧空间迁来的文字，也会放进以后持续写下的新想法。
          </p>
        </div>
      </section>

      <section className="notes-index">
        <div className="section-label">
          <span>01—{String(posts.length).padStart(2, '0')}</span>
          <span>Published notes</span>
        </div>
        <div className="notes-list">
          {posts.map((post, index) => (
            <Link className="note-row" href={`/notes/${post.slug}`} key={post.slug}>
              <span className="note-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="note-main">
                <time dateTime={post.published_at}>
                  {formatPublishedDate(post.published_at)}
                </time>
                <h2>{post.title}</h2>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </div>
              <span className="note-source">{post.source}</span>
              <span className="note-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

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
