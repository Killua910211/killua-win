import { env } from 'cloudflare:workers';
import { cache } from 'react';

/**
 * 查询列清单以常量形式导出，而不是内联在 SQL 字符串里。
 *
 * 理由：`scripts/replay-migrations.mjs` 会把这两个常量解析出来，和迁移重放后的
 * 真实表结构、以及下面两个 interface 的字段逐一比对。三者只要有一处漂移，
 * `pnpm test:migrations` 就会红 —— 这是这个项目里唯一能自动抓到
 * "改了 interface 忘了改 SQL" / "SELECT 了一个还没迁移的列" 的机制。
 * 改动这两行时不要改成模板拼接，解析器要的是字面量。
 */
export const POST_SUMMARY_COLUMNS =
  'slug, title, excerpt, published_at, updated_at, category, source';
export const POST_DETAIL_COLUMNS =
  'slug, title, excerpt, published_at, updated_at, category, source, content, source_url, ai_summary';

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  /**
   * 0001_initial.sql 把这一列建成了可空。目前 57 篇线上文章全都有值，
   * 但类型上必须诚实 —— 声明成 string 会让 `.slice(0, 4)` 这类调用
   * 在真出现 NULL 时直接 500，而不是在编译期被挡下来。
   */
  published_at: string | null;
  updated_at: string;
  category: string;
  source: string;
}

export interface Post extends PostSummary {
  content: string;
  source_url: string | null;
  ai_summary: string | null;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export const listPublishedPosts = cache(async () => {
  try {
    const result = await env.DB.prepare(
      `SELECT ${POST_SUMMARY_COLUMNS}
       FROM posts
       WHERE status = ?
       ORDER BY published_at DESC`,
    )
      .bind('published')
      .all<PostSummary>();

    return result.results;
  } catch (error) {
    console.error('d1.posts.list_failed', { error: errorMessage(error) });
    throw new Error('Unable to load published posts', { cause: error });
  }
});

export const getPublishedPost = cache(async (slug: string) => {
  try {
    return await env.DB.prepare(
      `SELECT ${POST_DETAIL_COLUMNS}
       FROM posts
       WHERE slug = ? AND status = ?
       LIMIT 1`,
    )
      .bind(slug, 'published')
      .first<Post>();
  } catch (error) {
    console.error('d1.posts.get_failed', {
      error: errorMessage(error),
      slug,
    });
    throw new Error('Unable to load the published post', { cause: error });
  }
});

/** RSS 用：只取最近 N 篇，避免整库正文（约 177 KB）都塞进 feed。 */
export const listRecentPostsWithContent = cache(async (limit: number) => {
  try {
    const result = await env.DB.prepare(
      `SELECT ${POST_DETAIL_COLUMNS}
       FROM posts
       WHERE status = ?
       ORDER BY published_at DESC
       LIMIT ?`,
    )
      .bind('published', limit)
      .all<Post>();

    return result.results;
  } catch (error) {
    console.error('d1.posts.feed_failed', { error: errorMessage(error) });
    throw new Error('Unable to load posts for the feed', { cause: error });
  }
});

/**
 * 首页那个 "57 ESSAYS" 用。
 *
 * 和其它查询不同，这里**吞掉**错误返回 null：首页原本不依赖数据库，
 * 不该因为把一个计数改成真实数据就多出一条能让整个首页 500 的路径。
 * 取不到就退回一个静态文案。
 */
export const countPublishedPosts = cache(async () => {
  try {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS count FROM posts WHERE status = ?`,
    )
      .bind('published')
      .first<{ count: number }>();

    return row?.count ?? null;
  } catch (error) {
    console.error('d1.posts.count_failed', { error: errorMessage(error) });
    return null;
  }
});

/**
 * 按分类分组计数。
 *
 * 刻意在内存里做，而不是再发一条 GROUP BY：调用方（/notes、分类页、sitemap）
 * 本来就已经把这批 summary 全部查出来渲染了，多一条 SQL 只是多一次 D1 往返，
 * 而 D1 的延迟远大于遍历 57 行的成本。等文章数到几千篇、列表需要分页时，
 * 这个判断才需要反过来。
 */
export function groupByCategory(posts: readonly PostSummary[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) =>
    left.localeCompare(right, 'zh-CN'),
  );
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}
