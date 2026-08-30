import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPublishedDate, listPublishedPosts } from '@/app/lib/posts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notes — KILLUA.WIN',
  description: '旧文章与新想法，在这里继续生长。',
};

type NotesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const posts = await listPublishedPosts();
  const { category: requestedCategory } = await searchParams;
  const categoryCounts = posts.reduce<Map<string, number>>((counts, post) => {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    return counts;
  }, new Map());
  const categories = [...categoryCounts.entries()].sort(([left], [right]) =>
    left.localeCompare(right, 'zh-CN'),
  );
  const activeCategory = categoryCounts.has(requestedCategory ?? '')
    ? requestedCategory
    : undefined;
  const visiblePosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

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
          <span>01—{String(visiblePosts.length).padStart(2, '0')}</span>
          <span>Published notes</span>
        </div>
        <div>
          <nav className="notes-categories" aria-label="文章分类">
            <Link
              aria-current={activeCategory ? undefined : 'page'}
              className={!activeCategory ? 'is-active' : undefined}
              href="/notes"
            >
              全部 <span>{posts.length}</span>
            </Link>
            {categories.map(([category, count]) => (
              <Link
                aria-current={activeCategory === category ? 'page' : undefined}
                className={activeCategory === category ? 'is-active' : undefined}
                href={`/notes?category=${encodeURIComponent(category)}`}
                key={category}
              >
                {category} <span>{count}</span>
              </Link>
            ))}
          </nav>
          <div className="notes-list">
            {visiblePosts.map((post, index) => (
              <Link className="note-row" href={`/notes/${post.slug}`} key={post.slug}>
                <span className="note-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="note-main">
                  <div className="note-meta">
                    <time dateTime={post.published_at}>
                      {formatPublishedDate(post.published_at)}
                    </time>
                    <span>{post.category}</span>
                  </div>
                  <h2>{post.title}</h2>
                  {post.excerpt ? <p>{post.excerpt}</p> : null}
                </div>
                <span className="note-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
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
