#!/usr/bin/env node
/**
 * 真正执行哲学知识库的数据不变式。
 *
 * 为什么需要它：这套数据的校验（关系方向、prerequisite 无环、同页来源编号唯一、
 * 分页器不自指……）全部写成模块加载期的 `throw`，注释里一度写着「`pnpm build`
 * 预渲染时会全部执行，构建就是这套数据的回归测试」。这句话是错的：
 *
 *   - `vinext build` 只做打包和静态分析，从不 import 应用模块；
 *   - `app/learning/philosophy/[node]/page.tsx` 里 `export const revalidate = 0`
 *     把该路由标成 Dynamic，`generateStaticParams` 不产出任何预渲染产物；
 *   - CI 只跑 lint、tsc --noEmit 和迁移重放，连 build 都没有。
 *
 * 结果是：这些断言第一次真正执行的时刻，是生产 Worker 里的第一次请求——数据写坏
 * 了不会构建失败，会是线上 500。这个脚本把它们拉回到提交前：用项目已有的 Vite
 * 把相关模块打成一个 bundle 再 import，模块顶层的断言就会真的跑一遍。
 *
 * 用 Vite 而不是直接 import：这些模块是 TypeScript，且 tree.ts 用
 * `import rawTree from './data.json'`——Node 原生 ESM 要求 JSON 导入带
 * `with { type: 'json' }`，改数据源去迁就测试脚本是本末倒置。Vite 已经是项目
 * 依赖，不引入任何新依赖。
 *
 * 它只覆盖机器能判定的结构性不变式。内容是否正确、来源是否真的支持论断，仍然
 * 必须人工核对——参见 check-philosophy-sources.mjs 顶部的同一条说明。
 *
 *   node scripts/check-philosophy-invariants.mjs
 *
 * 退出码：全部通过 0，任一断言抛错 1。
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

/**
 * 每一项是一个要被加载的模块，以及它顶层断言负责的不变式。
 * 说明文字只用于报告，真正的判定来自模块自己 throw 不 throw。
 */
const MODULES = [
  {
    file: 'app/learning/philosophy/tree.ts',
    guards: [
      '节点 ID 唯一',
      '存在 pt-core 与 pt-traditions 分组',
      '导航页的阅读顺序说明与下一级节点一一对应',
    ],
  },
  {
    file: 'app/learning/philosophy/content-ledger.ts',
    guards: ['按纯文本渲染的字段里没有未解析的行内概念标记'],
  },
  {
    file: 'app/learning/philosophy/relations.ts',
    guards: [
      '边指向存在的节点、无自指、why 非空',
      '非对称关系正反措辞不同，对称关系两向一致',
      'why 里没有会翻面的方向性指代（本页／该页／同一页）',
      'prerequisite 无环',
      '同一对节点之间没有重复边',
      '横向链条的步进方向不与 prerequisite 冲突',
      '来源账「默认已知」条目都写了回顾、不自指、目标节点存在',
    ],
  },
  {
    file: 'app/learning/philosophy/study-guides.ts',
    guards: ['positionArguments 的键是该条目真实的立场名'],
  },
  {
    file: 'app/learning/philosophy/argument-maps.ts',
    guards: ['论证地图挂在存在的节点上'],
  },
  {
    file: 'app/learning/philosophy/page-sources.ts',
    guards: ['同一页上一个来源编号不指向两份不同材料'],
  },
  {
    file: 'app/learning/philosophy/learning-path.ts',
    guards: [
      '推荐路线的每一步都指向存在的节点',
      '支线不重不漏地覆盖主线之外的全部核心问题',
    ],
  },
  {
    file: 'app/learning/philosophy/pager.ts',
    guards: ['分页器不指向自己', '两个语境不给出完全相同的前后页'],
  },
];

async function main() {
  const dir = await mkdtemp(path.join(tmpdir(), 'philosophy-invariants-'));

  try {
    // 一个入口把所有模块 import 进来；顶层断言在 import 时执行。
    const entry = path.join(dir, 'entry.mjs');
    const imports = MODULES.map(
      (m) => `import ${JSON.stringify(path.resolve(process.cwd(), m.file))};`,
    ).join('\n');
    await writeFile(entry, `${imports}\nexport const ok = true;\n`, 'utf8');

    await build({
      configFile: false,
      logLevel: 'silent',
      build: {
        ssr: true,
        outDir: dir,
        emptyOutDir: false,
        write: true,
        rollupOptions: {
          input: entry,
          output: { entryFileNames: 'bundle.mjs', format: 'es' },
        },
      },
      resolve: { alias: { '@': path.resolve(process.cwd(), '.') } },
    });

    await import(pathToFileURL(path.join(dir, 'bundle.mjs')).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  const guardCount = MODULES.reduce((sum, m) => sum + m.guards.length, 0);
  console.log(`✓ 哲学知识库数据不变式全部通过`);
  console.log(`  模块：${MODULES.length} 个｜不变式：${guardCount} 条`);
  for (const m of MODULES) {
    console.log(`  ${path.basename(m.file)}：${m.guards.join('、')}`);
  }
}

main().catch((error) => {
  console.error('✗ 哲学知识库数据不变式未通过\n');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
