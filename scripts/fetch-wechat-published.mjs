import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile(resolve('.env.wechat.local'));
} catch (error) {
  if (error?.code !== 'ENOENT') {
    throw error;
  }
}

const APP_ID = process.env.WECHAT_APP_ID?.trim();
const APP_SECRET = process.env.WECHAT_APP_SECRET?.trim();
const OUTPUT_PATH = resolve('outputs/wechat-published.json');
const PAGE_SIZE = 20;

const ENTITY_MAP = new Map([
  ['amp', '&'],
  ['apos', "'"],
  ['gt', '>'],
  ['lt', '<'],
  ['nbsp', ' '],
  ['quot', '"'],
]);

function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, token) => {
    if (token.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(token.slice(2), 16));
    }

    if (token.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(token.slice(1), 10));
    }

    return ENTITY_MAP.get(token.toLowerCase()) ?? entity;
  });
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(?:p|section|div|h[1-6]|li|blockquote)>/gi, '\n\n')
      .replace(/<li\b[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/\u00a0/g, ' '),
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function sanitizeApiMessage(message) {
  return String(message ?? '未知错误').replace(
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    '[IP]',
  );
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`微信接口请求失败（HTTP ${response.status}）`);
  }

  const payload = await response.json();
  if (payload.errcode && payload.errcode !== 0) {
    throw new Error(
      `微信接口错误 ${payload.errcode}：${sanitizeApiMessage(payload.errmsg)}`,
    );
  }

  return payload;
}

async function getAccessToken() {
  const payload = await requestJson(
    'https://api.weixin.qq.com/cgi-bin/stable_token',
    {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'client_credential',
        appid: APP_ID,
        secret: APP_SECRET,
        force_refresh: false,
      }),
    },
  );

  if (!payload.access_token) {
    throw new Error('微信接口没有返回 access_token');
  }

  return payload.access_token;
}

async function getPublishedPage(accessToken, offset) {
  return requestJson(
    `https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      body: JSON.stringify({
        offset,
        count: PAGE_SIZE,
        no_content: 0,
      }),
    },
  );
}

async function getMaterialPage(accessToken, offset) {
  return requestJson(
    `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'news',
        offset,
        count: PAGE_SIZE,
      }),
    },
  );
}

function flattenPublishedItems(items) {
  return items.flatMap((item) => {
    const publishedAt = new Date(item.update_time * 1000).toISOString();

    return (item.content?.news_item ?? [])
      .filter((article) => article.is_deleted !== 1)
      .map((article, articleIndex) => ({
        article_id: item.article_id ?? item.media_id,
        article_index: articleIndex,
        title: article.title?.trim() ?? '',
        author: article.author?.trim() ?? '',
        digest: article.digest?.trim() ?? '',
        content_text: htmlToText(article.content ?? ''),
        content_source_url: article.content_source_url ?? '',
        source_url: article.url ?? '',
        thumb_url: article.thumb_url ?? '',
        published_at: publishedAt,
      }));
  });
}

async function getAllPages(accessToken, getPage) {
  const records = [];
  let offset = 0;
  let totalCount = Number.POSITIVE_INFINITY;

  while (offset < totalCount) {
    const page = await getPage(accessToken, offset);
    const pageItems = page.item ?? [];
    totalCount = Number(page.total_count ?? pageItems.length);
    records.push(...pageItems);

    if (pageItems.length === 0) {
      break;
    }

    offset += pageItems.length;
  }

  return records;
}

async function main() {
  if (!APP_ID || !APP_SECRET) {
    throw new Error('需要 WECHAT_APP_ID 和 WECHAT_APP_SECRET 环境变量');
  }

  const accessToken = await getAccessToken();
  let records;
  let apiSource = 'published';

  try {
    records = await getAllPages(accessToken, getPublishedPage);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('错误 48001')) {
      throw error;
    }

    apiSource = 'permanent_material';
    records = await getAllPages(accessToken, getMaterialPage);
  }

  const articles = flattenPublishedItems(records).filter(
    (article) => article.title && article.content_text,
  );

  await mkdir(resolve('outputs'), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(
      {
        fetched_at: new Date().toISOString(),
        account_app_id: APP_ID,
        api_source: apiSource,
        published_record_count: records.length,
        article_count: articles.length,
        articles,
      },
      null,
      2,
    )}\n`,
    { encoding: 'utf8', mode: 0o600 },
  );

  console.log(`已安全读取 ${records.length} 条发表记录、${articles.length} 篇文章。`);
  console.log(`结果已保存到 ${OUTPUT_PATH}；文件不包含 AppSecret 或 access_token。`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
