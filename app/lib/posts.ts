import { env } from 'cloudflare:workers';
import { cache } from 'react';

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
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

export async function listPublishedPosts() {
  try {
    const result = await env.DB.prepare(
      `SELECT slug, title, excerpt, published_at, category, source
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
}

export const getPublishedPost = cache(async (slug: string) => {
  try {
    return await env.DB.prepare(
      `SELECT slug, title, excerpt, content, published_at, category, source, source_url, ai_summary
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

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}
