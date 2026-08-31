import type { MetadataRoute } from 'next';
import { SITE } from '@/app/lib/metadata';
import { groupByCategory, listPublishedPosts } from '@/app/lib/posts';

export const revalidate = 3600;

/**
 * 站点地图。
 *
 * lastModified 用 updated_at 而不是 published_at：这批文章的发布时间
 * 是 2008—2025 的原始时间，而内容修订（比如 0010、0013 两次批量清洗）
 * 发生在今年。搜索引擎要的是「上次改动」，不是「首次发表」。
 *
 * 数据库出问题时退回只含静态页的地图，而不是让 /sitemap.xml 直接 500 —— 
 * 一份不完整的地图远好过一份取不到的地图。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/notes`, changeFrequency: 'weekly', priority: 0.9 },
  ];

  let posts;
  try {
    posts = await listPublishedPosts();
  } catch (error) {
    console.error('sitemap.posts_failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return staticEntries;
  }

  const categoryEntries: MetadataRoute.Sitemap = groupByCategory(posts).map(([category]) => ({
    url: `${SITE.url}/notes/category/${encodeURIComponent(category)}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/notes/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
