#!/usr/bin/env node
/**
 * 把 migrations/*.sql 按序重放进一个内存 sqlite，然后用 app/lib/posts.ts 里
 * 真实的查询列去查它。
 *
 * 一条测试同时盯住三类风险：
 *   1. SQL 语法 —— 任何一个迁移写坏了，重放当场就炸；
 *   2. 迁移顺序 —— 先 SELECT 后 ALTER 这类错误会在重放时暴露；
 *   3. 类型漂移 —— interface 字段、SELECT 列清单、真实表结构三者必须完全一致。
 *
 * 第 3 点是重点：列清单和 interface 都从 posts.ts 里解析出来，而不是抄一份到
 * 这里。抄一份的话，改了 posts.ts 忘了改这里，测试反而会绿。
 *
 * 依赖只有 Node 22 内置的 node:sqlite —— 项目零运行时依赖，测试也不破例。
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIGRATIONS_DIR = join(ROOT, 'migrations');
const POSTS_TS = join(ROOT, 'app', 'lib', 'posts.ts');

const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
  return ok;
}

/** 剥掉 TS 里的块注释和行注释，免得注释正文被当成 interface 字段解析出来。 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

/**
 * 解析 `export const NAME = '...'`（允许跨行，Prettier 常把长字符串折到下一行）。
 */
function readColumnList(source, name) {
  const matched = new RegExp(
    `export const ${name}\\s*(?::[^=]+)?=\\s*(['"\`])([\\s\\S]*?)\\1`,
  ).exec(source);
  if (!matched) {
    throw new Error(
      `app/lib/posts.ts 里找不到 export const ${name}，无法确定真实查询列。`,
    );
  }
  return matched[2]
    .split(',')
    .map((column) => column.trim())
    .filter(Boolean);
}

/**
 * 解析 interface 的字段名。要能吃下 `published_at: string | null;` 这种联合类型
 * —— 字段类型随时会变，这个解析器只关心冒号左边那个名字。
 * `extends` 的父接口字段会被递归并入。
 */
function readInterfaceFields(source, name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);

  const matched = new RegExp(
    `interface\\s+${name}\\s*(?:extends\\s+([A-Za-z0-9_,\\s]+?))?\\s*\\{([\\s\\S]*?)\\n\\}`,
  ).exec(source);
  if (!matched) {
    throw new Error(`app/lib/posts.ts 里找不到 interface ${name}。`);
  }

  const inherited = (matched[1] ?? '')
    .split(',')
    .map((parent) => parent.trim())
    .filter(Boolean)
    .flatMap((parent) => readInterfaceFields(source, parent, seen));

  const own = [];
  for (const line of matched[2].split('\n')) {
    const field = /^\s*([A-Za-z_][A-Za-z0-9_]*)\??\s*:/.exec(line);
    if (field) own.push(field[1]);
  }

  return [...inherited, ...own];
}

function sameSet(left, right) {
  const a = new Set(left);
  const b = new Set(right);
  return a.size === b.size && [...a].every((item) => b.has(item));
}

function describeDiff(actual, expected) {
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  const parts = [];
  if (missing.length) parts.push(`缺少 [${missing.join(', ')}]`);
  if (extra.length) parts.push(`多出 [${extra.join(', ')}]`);
  return parts.join('；');
}

// ---------------------------------------------------------------- 重放迁移

const migrationFiles = readdirSync(MIGRATIONS_DIR)
  .filter((name) => name.endsWith('.sql'))
  .sort();

if (migrationFiles.length === 0) {
  console.error('✗ migrations/ 目录下没有任何 .sql 文件。');
  process.exit(1);
}

// ---------------------------------------- D1 兼容性：迁移里不许出现 LIKE
//
// 本地 SQLite 和 Cloudflare D1 对 LIKE 的模式长度限制不同。D1 那边低得多：
// `LIKE '%那个啥 ！。 有时候%'`（中文 9 字）能过，而跨换行的
// `LIKE '%还是回家吧。' || char(10) || '旧人不知我近况…%'`（24 字）会直接报
// `LIKE or GLOB pattern too complex`。这类失败**本地重放测不出来**，只会在
// `wrangler d1 migrations apply --remote` 那一刻炸在生产库上。
//
// INSTR 没有这个限制，语义也够用（`INSTR(x, s) > 0` 等价于 `x LIKE '%s%'`，
// `INSTR(x, s) = 1` 等价于前缀匹配）。唯一的差别是 LIKE 对 ASCII 字母大小写
// 不敏感而 INSTR 敏感 —— 真需要忽略大小写时用 LOWER() 显式处理。
for (const name of migrationFiles) {
  const sql = stripComments(readFileSync(join(MIGRATIONS_DIR, name), 'utf8'));
  if (/\bLIKE\b/i.test(sql)) {
    check(false, `migrations/${name} 里用了 LIKE。D1 的模式长度上限远低于本地 SQLite，` +
      '这类失败只会在应用到生产库时才暴露 —— 改用 INSTR()。');
  }
}

const db = new DatabaseSync(':memory:');

for (const name of migrationFiles) {
  try {
    db.exec(readFileSync(join(MIGRATIONS_DIR, name), 'utf8'));
  } catch (error) {
    console.error(`✗ 迁移 migrations/${name} 执行失败：${error.message}`);
    console.error('  后续迁移未执行 —— 先修好这一个再重跑。');
    process.exit(1);
  }
}

// ------------------------------------------------------- 真实查询 + 字段比对

const postsSource = readFileSync(POSTS_TS, 'utf8');
let summaryColumns;
let detailColumns;
let summaryFields;
let detailFields;

try {
  const stripped = stripComments(postsSource);
  summaryColumns = readColumnList(postsSource, 'POST_SUMMARY_COLUMNS');
  detailColumns = readColumnList(postsSource, 'POST_DETAIL_COLUMNS');
  summaryFields = readInterfaceFields(stripped, 'PostSummary');
  detailFields = readInterfaceFields(stripped, 'Post');
} catch (error) {
  console.error(`✗ 解析 app/lib/posts.ts 失败：${error.message}`);
  process.exit(1);
}

/**
 * 下面两条 SQL 与 posts.ts 的 listPublishedPosts / getPublishedPost 同构：
 * 列清单直接来自那两个导出常量，所以这里不会和线上查询走偏。
 */
const listSql = `SELECT ${summaryColumns.join(', ')} FROM posts WHERE status = 'published' ORDER BY published_at DESC`;
const detailSql = `SELECT ${detailColumns.join(', ')} FROM posts WHERE slug = ? AND status = 'published' LIMIT 1`;

let listRows = [];
try {
  listRows = db.prepare(listSql).all();
} catch (error) {
  failures.push(
    `列表查询执行失败（SELECT 的列在表里不存在？）：${error.message}\n    SQL: ${listSql}`,
  );
}

if (listRows.length > 0) {
  const actual = Object.keys(listRows[0]);
  check(
    sameSet(actual, summaryFields),
    `列表查询返回的列与 interface PostSummary 不一致：${describeDiff(actual, summaryFields)}。` +
      '改了 interface 就要同步改 POST_SUMMARY_COLUMNS。',
  );
}

// 刻意不复用 listRows 里的 slug：列表查询自己坏掉时，详情查询也要照样被验一遍，
// 否则一次修复只能暴露一个问题。
const sampleSlug = db
  .prepare(`SELECT slug FROM posts WHERE status = 'published' LIMIT 1`)
  .get()?.slug;

let detailRow = null;
if (sampleSlug !== undefined) {
  try {
    detailRow = db.prepare(detailSql).get(sampleSlug);
  } catch (error) {
    failures.push(
      `详情查询执行失败（SELECT 的列在表里不存在？）：${error.message}\n    SQL: ${detailSql}`,
    );
  }
}

if (detailRow) {
  const actual = Object.keys(detailRow);
  check(
    sameSet(actual, detailFields),
    `详情查询返回的列与 interface Post 不一致：${describeDiff(actual, detailFields)}。` +
      '改了 interface 就要同步改 POST_DETAIL_COLUMNS。',
  );
}

// ------------------------------------------------------------------ 数据断言

const publishedCount = db
  .prepare(`SELECT COUNT(*) AS n FROM posts WHERE status = 'published'`)
  .get().n;

check(publishedCount > 0, '重放完迁移后一篇已发布文章都没有 —— 内容导入的迁移是不是漏了？');

// 声明为 NOT NULL 的列真的没有 NULL。sqlite 只在写入时检查约束，
// 而迁移里的 ALTER TABLE ADD COLUMN ... NOT NULL DEFAULT 有可能被后来的
// UPDATE 写空，所以这里对着真实数据再验一次。
for (const table of ['posts', 'site_settings', 'projects']) {
  for (const column of db.prepare(`PRAGMA table_info(${table})`).all()) {
    if (column.notnull !== 1) continue;
    const nulls = db
      .prepare(`SELECT COUNT(*) AS n FROM "${table}" WHERE "${column.name}" IS NULL`)
      .get().n;
    check(
      nulls === 0,
      `${table}.${column.name} 声明为 NOT NULL，却有 ${nulls} 行是 NULL。`,
    );
  }
}

// published_at 在 schema 上可空，但已发布文章必须有一个能被 Date 解析的值：
// 列表页按它排序、详情页按它渲染日期，为空会直接把页面打成 Invalid Date。
const badDates = db
  .prepare(
    `SELECT slug, published_at FROM posts WHERE status = 'published' AND (published_at IS NULL OR published_at = '')`,
  )
  .all();
check(
  badDates.length === 0,
  `${badDates.length} 篇已发布文章的 published_at 为空：${badDates.map((row) => row.slug).join(', ')}`,
);

const unparsable = db
  .prepare(
    `SELECT slug, published_at FROM posts WHERE status = 'published' AND published_at IS NOT NULL AND published_at != ''`,
  )
  .all()
  .filter((row) => Number.isNaN(new Date(row.published_at).getTime()));
check(
  unparsable.length === 0,
  `${unparsable.length} 篇文章的 published_at 无法被 Date 解析：${unparsable
    .map((row) => `${row.slug}(${row.published_at})`)
    .join(', ')}`,
);

const dupes = db
  .prepare(`SELECT slug, COUNT(*) AS n FROM posts GROUP BY slug HAVING n > 1`)
  .all();
check(dupes.length === 0, `slug 不唯一：${dupes.map((row) => row.slug).join(', ')}`);

const version = db
  .prepare(`SELECT value FROM site_settings WHERE key = 'database_version'`)
  .get();
check(
  version !== undefined && version !== null,
  'site_settings 里没有 database_version —— 新迁移末尾漏了那条 UPSERT？',
);

// ---------------------------------------------------------------------- 汇总

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} 项断言失败：\n`);
  for (const [index, message] of failures.entries()) {
    console.error(`  ${index + 1}. ${message}`);
  }
  console.error('');
  process.exit(1);
}

const categories = db
  .prepare(
    `SELECT category, COUNT(*) AS n FROM posts WHERE status = 'published' GROUP BY category ORDER BY n DESC`,
  )
  .all();

console.log('✓ 迁移重放测试全部通过');
console.log(`  迁移文件：${migrationFiles.length} 个（${migrationFiles[0]} → ${migrationFiles.at(-1)}）`);
console.log(`  database_version：${version.value}`);
console.log(`  已发布文章：${publishedCount} 篇`);
console.log(`  分类分布：${categories.map((row) => `${row.category} ${row.n}`).join(' / ')}`);
console.log(`  列表查询列：${summaryColumns.join(', ')}`);
console.log(`  详情查询列：${detailColumns.join(', ')}`);
process.exit(0);
