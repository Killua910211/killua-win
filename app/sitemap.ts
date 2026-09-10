import type { MetadataRoute } from 'next';
import { allNodePaths } from '@/app/learning/philosophy/tree';
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
  const philosophyUpdatedAt = new Date('2026-09-11T00:00:00+08:00');
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/notes`, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: `${SITE.url}/learning`,
      lastModified: new Date('2026-09-11T00:00:00+08:00'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 哲学总览与每个知识节点各占一页。
    // 旧的 /learning/philosophy-tree 仍然可访问，但它的 canonical 已经指向
    // 新总览，所以不再出现在地图里，免得两套 URL 抢同一批内容。
    ...allNodePaths().map((path, index) => ({
      url: `${SITE.url}${path}`,
      lastModified: philosophyUpdatedAt,
      changeFrequency: 'monthly' as const,
      priority: index === 0 ? 0.8 : 0.6,
    })),
    // 知识地图与推荐学习路径是哲学空间的两个入口页，不在节点树里。
    {
      url: `${SITE.url}/learning/philosophy/map`,
      lastModified: philosophyUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE.url}/learning/philosophy/path`,
      lastModified: philosophyUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE.url}/health`,
      lastModified: new Date('2026-08-31T00:00:00+08:00'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE.url}/mind`,
      lastModified: new Date('2026-09-06T00:00:00+08:00'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
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
