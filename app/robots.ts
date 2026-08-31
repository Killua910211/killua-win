import type { MetadataRoute } from 'next';
import { SITE } from '@/app/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 健康检查端点没有内容价值，不必被抓。
      disallow: '/api/',
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
