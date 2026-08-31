import { SITE } from '@/app/lib/metadata';
import { listRecentPostsWithContent } from '@/app/lib/posts';

export const revalidate = 3600;

/** 只放最近 30 篇。整库正文约 177 KB，全塞进 feed 对订阅端不礼貌。 */
const FEED_LIMIT = 30;

/** XML 五个特殊字符全转义。正文走这里而不是 CDATA —— 内容里出现 `]]>` 就够毁掉整份 feed。 */
function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/** 正文是纯文本，按空行切段包成 <p>，让阅读器有基本的排版。 */
function contentToHtml(content: string) {
  return content
    .split(/\n{2,}/)
    .filter((block) => block.trim() !== '')
    .map((block) => `<p>${escapeXml(block)}</p>`)
    .join('');
}

function toRfc822(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toUTCString();
}

export async function GET() {
  let posts;
  try {
    posts = await listRecentPostsWithContent(FEED_LIMIT);
  } catch (error) {
    console.error('feed.posts_failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return new Response('Feed temporarily unavailable', { status: 503 });
  }

  const items = posts
    .map((post) => {
      const link = `${SITE.url}/notes/${post.slug}`;
      const pubDate = toRfc822(post.published_at);
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
        `      <category>${escapeXml(post.category)}</category>`,
        post.excerpt ? `      <description>${escapeXml(post.excerpt)}</description>` : null,
        `      <content:encoded>${contentToHtml(post.content)}</content:encoded>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const latest = toRfc822(posts[0]?.updated_at ?? null);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.name} — Notes`)}</title>
    <link>${SITE.url}/notes</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${latest}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
