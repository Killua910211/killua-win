#!/usr/bin/env node
/**
 * Generate the read-only fallback used by Sites deployments whose D1 database
 * has not been initialized yet. The canonical source remains migrations/.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const db = new DatabaseSync(':memory:');

for (const name of readdirSync(join(root, 'migrations')).filter((file) => file.endsWith('.sql')).sort()) {
  db.exec(readFileSync(join(root, 'migrations', name), 'utf8'));
}

const posts = db
  .prepare(
    `SELECT slug, title, excerpt, published_at, updated_at, category, source,
            content, source_url, ai_summary
     FROM posts
     WHERE status = 'published'
     ORDER BY published_at DESC`,
  )
  .all();

const output = `// Generated from migrations/. Do not edit by hand.\nexport const STATIC_POSTS = ${JSON.stringify(posts, null, 2)} as const;\n`;
writeFileSync(join(root, 'app', 'lib', 'static-posts.ts'), output);
console.log(`Generated ${posts.length} static posts.`);
