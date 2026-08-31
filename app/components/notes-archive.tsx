import Link from 'next/link';
import { formatPublishedDate, groupByCategory, type PostSummary } from '@/app/lib/posts';

type NotesArchiveProps = {
  /** 全部已发布文章。分类计数需要完整集合，所以这里不接收过滤后的结果。 */
  posts: readonly PostSummary[];
  /** 当前分类；undefined 表示「全部」。 */
  activeCategory?: string;
  /** 左侧序号栏显示的分区编号。 */
  sectionNumber: string;
};

export function NotesArchive({ posts, activeCategory, sectionNumber }: NotesArchiveProps) {
  const categories = groupByCategory(posts);
  const visiblePosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    /*
      id="archive"：分类切换是跨路由导航，默认会落到新页面顶部，用户得重新
      滚到列表才能看到筛选结果。下面每个分类链接都带 #archive，让浏览器直接
      停在这一区 —— 点完之后那排分类按钮还在原来的视线位置上。
    */
    <section className="notes-index" id="archive">
      <div className="section-label" lang="en">
        <span>
          {sectionNumber}—{String(visiblePosts.length).padStart(2, '0')}
        </span>
        <span>Published notes</span>
      </div>
      <div>
        <nav className="notes-categories" aria-label="文章分类">
          <Link
            aria-current={activeCategory ? undefined : 'page'}
            className={!activeCategory ? 'is-active' : undefined}
            href="/notes#archive"
          >
            全部 <span>{posts.length}</span>
          </Link>
          {categories.map(([category, count]) => (
            <Link
              aria-current={activeCategory === category ? 'page' : undefined}
              className={activeCategory === category ? 'is-active' : undefined}
              href={`/notes/category/${encodeURIComponent(category)}#archive`}
              key={category}
            >
              {category} <span>{count}</span>
            </Link>
          ))}
        </nav>
        <div className="notes-list">
          {visiblePosts.map((post, index) => (
            /*
              prefetch={false}：这一页最多同时挂 57 个链接，默认的视口预取
              会在滚动时把每一篇文章页都完整渲染一遍（本项目没有 loading 骨架
              可供只取外壳），等于 57 次 Worker 调用 + 57 次 D1 查询 + 全文下载。
              列表页的点击率远低于 100%，这笔预取不划算。
            */
            <Link
              className="note-row"
              href={`/notes/${post.slug}`}
              key={post.slug}
              prefetch={false}
            >
              <span className="note-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="note-main">
                <div className="note-meta">
                  {post.published_at ? (
                    <time dateTime={post.published_at}>
                      {formatPublishedDate(post.published_at)}
                    </time>
                  ) : null}
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
  );
}
