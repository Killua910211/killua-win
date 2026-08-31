# killua.win

个人写作站。把 2008—2025 年散落在 QQ 空间和微信公众号的 57 篇文字，收拢到自己的域名下。

线上：<https://www.killua.win> ｜ 订阅：<https://www.killua.win/feed.xml>

---

## 技术栈

| 层 | 用什么 | 说明 |
| --- | --- | --- |
| 框架 | **vinext 1.0.0-beta.8** | Vite 驱动的 Next App Router 运行时。`next` 包只提供类型和 ESLint 规则，运行时零参与 |
| 构建 | Vite 8 + `@cloudflare/vite-plugin` | 产物在 **`dist/`**，不是 `.next/` |
| 运行 | Cloudflare Workers | `wrangler.jsonc`，`nodejs_compat` |
| 数据 | Cloudflare D1 | binding `DB`，库名 `killua-win-d1`。文章全部存库，没有 Markdown 源文件 |
| 样式 | 手写 CSS（`app/globals.css`） | 没有 CSS 框架。文件顶部有一段替代 Tailwind Preflight 的极简 reset |
| 包管理 | **pnpm**（见 `packageManager` 字段） | Node ≥ 22.13 |

> **注意：不要用 npm。** 仓库只有 `pnpm-lock.yaml`。

## 常用命令

```bash
pnpm dev              # 本地开发（自带 miniflare + 本地 D1）
pnpm check            # lint + 类型检查 + 迁移回放，CI 跑的就是这三条
pnpm build            # 产出 dist/
pnpm preview          # 用 wrangler 跑生产构建产物
pnpm deploy           # build → 应用远程迁移 → wrangler deploy
```

`pnpm deploy` 把三步串在一条命令里是**有意的**。pnpm 7+ 默认不执行 `pre`/`post` 脚本
（`enable-pre-post-scripts` 默认 false），所以写成 `predeploy` 不会自动触发。
先迁移后部署的顺序也是有意的：迁移都是增量加列，先加列再上引用新列的代码才不会有窗口期。

只想重新部署、不想动数据库时用 `pnpm deploy:only`。

内容类迁移上线前先导一份生产库：

```bash
pnpm exec wrangler d1 export killua-win-d1 --remote --output .wrangler/backups/pre-NNNN.sql
```

## 发一篇新文章

**不要手写 SQL 迁移。** 57 篇正文里 ASCII 单引号数恰好为 0 纯属运气 —— 写进一个 `don't` 就会炸库。

```bash
# 1. 写一个带 front-matter 的 Markdown
cat > /tmp/new-post.md <<'EOF'
---
slug: my-new-post
title: 标题
excerpt: 一句话摘要
category: 随笔
source: original
published_at: 2026-09-01T10:00:00Z
---
正文第一段。

正文第二段。
EOF

# 2. 生成迁移（自动取下一个编号，所有值统一转义）
pnpm newpost /tmp/new-post.md

# 3. 先本地验，再上远程
pnpm migrate:local && pnpm dev
pnpm migrate
```

front-matter 字段：`slug`(必填) `title`(必填) `excerpt` `category`(默认 `随笔`)
`source`(默认 `original`) `source_url` `published_at`(默认当前时间) `ai_summary` `status`(默认 `published`)。

## 数据

`posts` 表 13 列，由 4 个迁移逐步长成：
`0001` 建表 → `0002` 加 `source`/`source_url` → `0005` 加 `ai_summary` → `0006` 加 `category`。

```
id, slug, title, excerpt, content, status, published_at,
created_at, updated_at, source, source_url, ai_summary, category
```

`app/lib/posts.ts` 里的 `POST_SUMMARY_COLUMNS` / `POST_DETAIL_COLUMNS` 是**导出的字符串常量**，
`scripts/replay-migrations.mjs` 会把它们和迁移重放后的真实表结构、以及两个 TypeScript
interface 三方比对。改列名时三处必须同时改，否则 `pnpm check` 会红。别把它们改成模板拼接。

`projects` 表建好了但还没用（首页 02/03 两块标着 `SOON`）。

### 迁移的三条纪律

1. **每条 INSERT 都要 `ON CONFLICT(slug) DO UPDATE`。** D1 迁移不跑事务，中途失败会留下
   半应用状态；全幂等才能修好直接重跑。
2. **只前滚，不改历史迁移。** 内容修订走新迁移（`0010`、`0013` 就是这么做的）。
   代价是单个迁移文件不再是最终内容的忠实记录 —— 做内容审计必须按顺序回放全部迁移，
   或者直接查库。
3. **迁移里不许用 `LIKE`，用 `INSTR`。** D1 对 LIKE 的模式长度限制远低于本地
   SQLite：`LIKE '%那个啥 ！。 有时候%'`（中文 9 字）能过，跨换行的 24 字
   模式就会报 `LIKE or GLOB pattern too complex`。**这类失败本地重放测不出来**，
   只在 `wrangler d1 migrations apply --remote` 那一刻炸在生产库上（0013 就中过一次）。
   `INSTR(x, s) > 0` 等价于 `x LIKE '%s%'`，`INSTR(x, s) = 1` 等价于前缀匹配。
   `scripts/replay-migrations.mjs` 现在会静态拦截迁移里的 LIKE。

## vinext 的几个坑

这套栈不是主流 Next，下面几条都是踩过的：

- **`metadata` 是同名 key 整体覆盖，不是深合并。** 页面只要写 `openGraph: { title }`，
  就会把 layout 里的 `images`、`locale` 全丢掉。所以**每一页都必须用
  `app/lib/metadata.ts` 的 `buildMetadata()` 生成完整一份**，不要依赖继承。
- **`alternates.types` 只能给字符串。** Next 支持的 `[{ url, title }]` 数组形式在
  vinext 里会抛 `url.startsWith is not a function`
  （`dist/shims/metadata.js:770` → `:337`）。
- **构建期没有 D1。** 预渲染阶段跑在纯 Node 里（`dist/build/run-prerender.js`:
  "no wrangler/miniflare is needed"），所以**不能写查库的 `generateStaticParams`**，
  会让 `vinext build` 直接失败。页面用的是按需 ISR（`export const revalidate`）。
- **ISR 缓存默认是进程内的 `Map`**（`dist/shims/cache-handler.js:50`），
  在 Workers 上等于每个 colo 的 isolate 各存一份。够用，但不跨 isolate 共享。
- **`vinext start` 在本项目跑不起来** —— Node 的 ESM loader 解析不了 `cloudflare:workers`。
  要预览生产构建用 `pnpm preview`（走 wrangler）。

## 路由

| 路径 | 说明 |
| --- | --- |
| `/` | 首页。文章数从数据库实时读取 |
| `/notes` | 全部文章 + 前言 |
| `/notes/category/[category]` | 按分类筛选。**刻意用路由段而不是 `?category=`** —— 读 searchParams 会让页面永远动态渲染，缓存声明就失效了 |
| `/notes/[slug]` | 文章页，带 Article JSON-LD |
| `/sitemap.xml` `/robots.txt` `/feed.xml` | 索引与订阅 |
| `/api/database` | 健康检查，返回 `database_version` |

## 重新生成 Workers 类型

`worker-configuration.d.ts`（587 KB，已入库）由 wrangler 生成。改了 `wrangler.jsonc`
的绑定之后：

```bash
pnpm exec wrangler types
```

## 以后可以做的事

- **跨 isolate 共享 ISR 缓存**：装 `@vinext/cloudflare`，绑一个 KV namespace，
  在 `vite.config.ts` 里配 `vinext({ cache: { cdn: cdnAdapter(), data: kvDataAdapter(...) } })`。
  现在的进程内缓存对这个体量够用，等流量起来再说。
- **`og.png` 的取舍**：现在是 192 色调色板 PNG（122 KB，原图 847 KB）。
  2 倍放大能看到球体暗部有抖动噪点，但在社交卡片实际尺寸（约 600px 宽）下
  与原图肉眼无法区分（最大偏差 8/255）。要完全无损得回到 713 KB。
- **Builds / Elsewhere 两块**（首页 02、03）还是 `SOON`，`projects` 表已经建好了。
