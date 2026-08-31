#!/usr/bin/env node
/**
 * 从一篇带 YAML front-matter 的 Markdown 生成 D1 迁移。
 *
 * 存在的唯一理由是 sqlQuote()：正文里出现一个 ASCII 单引号（don't、it's）
 * 就足以让手写的 INSERT 变成语法错误，或者更糟 —— 变成一条语义被改写、
 * 却仍然合法的 SQL。现有 57 篇正文里恰好一个都没有，纯属运气。
 * 所有进入 SQL 的值必须经过 sqlQuote，不留任何旁路。
 *
 * 用法：node scripts/mkpost.mjs <path-to-markdown>
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIGRATIONS_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'migrations',
);

/** 与 migrations/0012 的列顺序保持一致，方便人工 diff 两份迁移。 */
const COLUMNS = [
  'slug',
  'title',
  'excerpt',
  'content',
  'status',
  'published_at',
  'category',
  'source',
  'source_url',
  'ai_summary',
];

/** ON CONFLICT 时不重写 slug（它就是冲突键），其余列全部覆盖。 */
const UPSERT_COLUMNS = COLUMNS.filter((column) => column !== 'slug');

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

/**
 * SQLite 字符串字面量：单引号内把单引号翻倍。
 * 这是整个脚本的核心，改动前请先想清楚 sqlite 的转义规则只有这一条。
 */
function sqlQuote(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

/**
 * 自建 front-matter 解析器。
 *
 * 项目运行时零依赖，不想为了一个发文脚本引入 gray-matter。
 * 只支持 `key: value`，value 可选地被单/双引号包裹 —— 发一篇文章需要的
 * 就这么多；真需要数组或嵌套时再换库也不迟。
 */
function parseFrontMatter(raw) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) {
    fail('文件开头没有 `---` 包裹的 front-matter，无法解析。');
  }

  const data = {};
  const lines = match[1].split('\n');
  for (const [index, line] of lines.entries()) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;

    const pair = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/.exec(line);
    if (!pair) {
      fail(`front-matter 第 ${index + 1} 行无法解析：${line}`);
    }

    const key = pair[1];
    let value = pair[2].trim();

    // 引号包裹的 value：整段剥掉外层引号，并还原被转义的同名引号。
    const quoted = /^(['"])([\s\S]*)\1$/.exec(value);
    if (quoted) {
      const quote = quoted[1];
      value = quoted[2].replaceAll(`\\${quote}`, quote);
      if (quote === "'") value = value.replaceAll("''", "'");
    }

    data[key] = value;
  }

  return { data, body: text.slice(match[0].length) };
}

/** 空串一律当作"没填"，落库成 NULL，而不是一个假的空字符串。 */
function optional(value) {
  if (value === undefined) return null;
  const trimmed = String(value).trim();
  if (trimmed === '' || trimmed === 'null') return null;
  return value;
}

function nextMigrationNumber() {
  let max = 0;
  for (const name of readdirSync(MIGRATIONS_DIR)) {
    const matched = /^(\d+)_.*\.sql$/.exec(name);
    if (matched) max = Math.max(max, Number(matched[1]));
  }
  return max + 1;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    fail('用法：node scripts/mkpost.mjs <path-to-markdown>');
  }

  let raw;
  try {
    raw = readFileSync(resolve(inputPath), 'utf8');
  } catch (error) {
    fail(`读不到文件 ${inputPath}：${error.message}`);
  }

  const { data, body } = parseFrontMatter(raw);

  const slug = (data.slug ?? '').trim();
  const title = (data.title ?? '').trim();
  const content = body.trim();

  if (!slug) fail('front-matter 缺少必填字段 slug。');
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail(`slug「${slug}」不合法：只允许小写字母、数字和连字符。`);
  }
  if (!title) fail('front-matter 缺少必填字段 title。');
  if (!content) fail('正文为空：front-matter 之后没有任何内容。');

  const status = (optional(data.status) ?? 'published').trim();
  if (status !== 'published' && status !== 'draft') {
    fail(`status「${status}」不合法：只能是 published 或 draft。`);
  }

  const publishedRaw = optional(data.published_at) ?? new Date().toISOString();
  const publishedDate = new Date(String(publishedRaw).trim());
  if (Number.isNaN(publishedDate.getTime())) {
    fail(`published_at「${publishedRaw}」无法被 Date 解析，请用 ISO8601。`);
  }

  const values = {
    slug,
    title,
    excerpt: optional(data.excerpt),
    content,
    status,
    published_at: publishedDate.toISOString(),
    category: (optional(data.category) ?? '随笔').trim(),
    source: (optional(data.source) ?? 'original').trim(),
    source_url: optional(data.source_url),
    ai_summary: optional(data.ai_summary),
  };

  const version = nextMigrationNumber();
  const fileName = `${String(version).padStart(4, '0')}_add_${slug}.sql`;
  const outPath = join(MIGRATIONS_DIR, fileName);

  const sql = `-- 由 scripts/mkpost.mjs 从 ${basename(inputPath)} 生成，勿手工编辑正文里的引号。
INSERT INTO posts (${COLUMNS.join(', ')})
VALUES (
${COLUMNS.map((column) => `  ${sqlQuote(values[column])}`).join(',\n')}
)
ON CONFLICT(slug) DO UPDATE SET ${UPSERT_COLUMNS.map(
    (column) => `${column}=excluded.${column}`,
  ).join(', ')}, updated_at=CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value) VALUES ('database_version', ${sqlQuote(
    String(version),
  )})
ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP;
`;

  writeFileSync(outPath, sql, 'utf8');

  console.log(`✓ 已生成 ${outPath}`);
  console.log(`  slug=${slug}  分类=${values.category}  发布时间=${values.published_at}`);
  console.log('下一步：pnpm migrate:local 然后 pnpm migrate');
}

main();
