import type { Metadata } from 'next';

export const SITE = {
  url: 'https://www.killua.win',
  name: 'KILLUA.WIN',
  tagline: 'A quiet place for loud ideas',
  description: '一个正在生长的个人数字空间，收集作品、实验与有趣的未完成。',
  ogImage: '/og.png',
  locale: 'zh_CN',
} as const;

type PageMetadataInput = {
  /** 页面标题，不含站点后缀。传 null 表示用站点默认标题（首页）。 */
  title: string | null;
  description: string;
  /** 站内绝对路径，如 '/notes'。用于 canonical 与 og:url。 */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
};

/**
 * 生成一页的完整 metadata。
 *
 * 存在的理由：Next 的 metadata 合并语义是**同名 key 整体覆盖**，不是深合并。
 * 页面只要写了 `openGraph: { title }`，就会把 layout 里的 `images`、`locale`
 * 全部丢掉 —— 之前 57 篇文章的分享卡片就是这么集体失去 og:image 的。
 * 同理 twitter：只要 layout 声明过 twitter，openGraph → twitter 的自动回填
 * 就不再发生，页面不显式写就会一直显示站点标题。
 *
 * 所以这里每次都把 openGraph / twitter / canonical 完整地重新拼一遍，
 * 任何一页都不依赖继承。
 */
export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const images = [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }];

  return {
    title: title ?? { absolute: fullTitle },
    description,
    // alternates 也是整体覆盖的，所以 RSS 链接要在这里重申一遍，
    // 否则除了继承默认值的那几个页面，全站都不会声明 feed。
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': '/feed.xml' },
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      locale: SITE.locale,
      url: path,
      siteName: SITE.name,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [SITE.ogImage],
    },
  };
}
