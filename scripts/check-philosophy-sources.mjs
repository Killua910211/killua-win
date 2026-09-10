#!/usr/bin/env node
/**
 * 哲学知识库的来源链接体检。
 *
 * 为什么需要它：2026-09-11 的审查在标着「已核验」的来源里查出 9 条失效链接
 * （其中一条是 pt-western-ancient 唯一的来源，整页每条论断都挂在一个不存在的
 * 页面上），还有一条指向已经不能解析的域名，以及一个返回 200 但内容是
 * 「Not Yet Available」占位页的 SEP 地址。这类问题人工核对时最容易漏，
 * 而它直接决定知识库还算不算可追溯。
 *
 * 这个脚本只做机器能确认的那一层：链接是否还活着。它**不能**替代人工核对
 * ——章节定位是否存在、supports 声称的论断是否真的由该页支持，仍然必须
 * 实际打开页面读。所以它不进 CI 的必过项（CI 里没有网络，也不该依赖外网），
 * 每轮内容整改前手动跑一次。
 *
 *   node scripts/check-philosophy-sources.mjs
 *   node scripts/check-philosophy-sources.mjs --json
 *
 * 退出码：全部可达时 0，出现失效链接时 1。
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const PHILOSOPHY_DIR = path.join(process.cwd(), 'app/learning/philosophy');
const CONCURRENCY = 6;
const TIMEOUT_MS = 25_000;

/** SEP 对尚未撰写的条目返回 200，页面标题是 Not Yet Available。这不是有效来源。 */
const PLACEHOLDER_TITLES = [/not\s+yet\s+available/i];

async function collectUrls() {
  const entries = await readdir(PHILOSOPHY_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.(ts|tsx|json)$/.test(entry.name))
    .map((entry) => path.join(PHILOSOPHY_DIR, entry.name));

  /** @type {Map<string, string[]>} */
  const byUrl = new Map();
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      for (const match of line.matchAll(/https?:\/\/[^\s'"`)\],]+/g)) {
        const url = match[0].replace(/[.,;:]+$/, '');
        const where = `${path.relative(process.cwd(), file)}:${index + 1}`;
        byUrl.set(url, [...(byUrl.get(url) ?? []), where]);
      }
    });
  }
  return byUrl;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // 先 GET：部分学术站点对 HEAD 返回 405，而我们还需要读标题判断占位页。
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'killua-win-source-check' },
    });
    const status = response.status;
    let title = '';
    if (response.ok) {
      const body = await response.text();
      title = body.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
    }
    const placeholder = PLACEHOLDER_TITLES.some((pattern) => pattern.test(title));
    return {
      url,
      status,
      title,
      verdict: placeholder ? 'placeholder' : response.ok ? 'ok' : 'bad-status',
    };
  } catch (error) {
    return {
      url,
      status: 0,
      title: '',
      verdict: 'unreachable',
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const asJson = process.argv.includes('--json');
  const byUrl = await collectUrls();
  const urls = [...byUrl.keys()].sort();

  const results = [];
  for (let start = 0; start < urls.length; start += CONCURRENCY) {
    const batch = urls.slice(start, start + CONCURRENCY);
    results.push(...(await Promise.all(batch.map(probe))));
    // 只有真的接在终端上才画进度条：管道里的 \r 会把一行拼成一长串噪音。
    if (!asJson && process.stderr.isTTY) {
      process.stderr.write(`\r核对中 ${Math.min(start + CONCURRENCY, urls.length)}/${urls.length}`);
    }
  }
  if (!asJson && process.stderr.isTTY) process.stderr.write('\r');

  const problems = results.filter((result) => result.verdict !== 'ok');

  if (asJson) {
    console.log(
      JSON.stringify(
        { total: urls.length, problems: problems.map((p) => ({ ...p, where: byUrl.get(p.url) })) },
        null,
        2,
      ),
    );
  } else {
    console.log(`共 ${urls.length} 个来源地址，${problems.length} 个有问题。`);
    for (const problem of problems) {
      const label =
        problem.verdict === 'placeholder'
          ? `占位页（标题「${problem.title}」）`
          : problem.verdict === 'unreachable'
            ? `无法访问（${problem.error}）`
            : `HTTP ${problem.status}`;
      console.log(`\n✗ ${problem.url}\n  ${label}`);
      for (const where of byUrl.get(problem.url) ?? []) {
        console.log(`  ← ${where}`);
      }
    }
    if (problems.length === 0) {
      console.log('全部可达。注意：这只说明链接活着，不说明章节定位和论断对得上。');
    }
  }

  process.exitCode = problems.length > 0 ? 1 : 0;
}

await main();
