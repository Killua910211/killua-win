import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 构建产物和生成文件不参与检查。这里要写全：只靠 CLI 的 --ignore-pattern
  // 兜底的话，编辑器里的 ESLint 插件读不到，会对 dist/ 报出几千条噪音。
  globalIgnores([
    '.next/**',
    '.vinext/**',
    'dist/**',
    'out/**',
    'build/**',
    '.wrangler/**',
    // 代理会在 .claude/worktrees/ 下建仓库的完整副本；那是另一个 checkout，
    // 由它自己那边检查，不该让本仓库的 `eslint .` 把它整个扫一遍。
    '.claude/**',
    'next-env.d.ts',
    'worker-configuration.d.ts',
  ]),
]);

export default eslintConfig;
