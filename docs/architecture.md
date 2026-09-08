# KILLUA.WIN 架构

最后复核：2026-09-08。以下事实以当前工作树为准；工作树尚未提交的内容不等于正式网站已发布内容。

## 产品边界

KILLUA.WIN 是个人数字空间，不是后台管理系统。它把旧文章、健康快照、心理认知对话和哲学学习材料组织成可持续回看的个人档案。

## 运行结构

```text
浏览器
  ↓
vinext / Next App Router 兼容层
  ↓
Vite 构建 → Cloudflare Worker（wrangler.jsonc）
  ├─ D1：文章与站点数据（binding DB，正式运行时主存储）
  ├─ 静态文章回退：app/lib/static-posts.ts（D1 未初始化时使用）
  └─ 外部公开端点：os.killua.win/api/public/stats
```

- 包管理器是 pnpm，构建产物在 `dist/`。
- Worker 名称是 `killua-win`，D1 数据库是 `killua-win-d1`。
- Site 测试项目由 `.openai/hosting.json` 标识；Site 称为“测试环境”，它不是正式网站的事实来源。
- 正式网站由项目既有 Cloudflare Worker 部署链路承载，使用 `pnpm deploy:only` 发布已构建产物；涉及数据库变更时才使用包含远程迁移的 `pnpm deploy`。
- 数据库结构和文章内容的规范来源是 `migrations/`；`scripts/generate-static-posts.mjs` 从迁移回放生成只读回退数据，不能手改生成文件。

## 路由与模块

| 路径 | 责任 | 主要来源 |
| --- | --- | --- |
| `/` | 首页、Hero、OS 脱敏汇总 | `app/page.tsx`、`app/components/system-readout.tsx` |
| `/notes` | 文章归档与前言 | `app/notes/page.tsx`、`app/components/notes-archive.tsx` |
| `/notes/[slug]` | 文章详情与 Article JSON-LD | `app/notes/[slug]/page.tsx` |
| `/notes/category/[category]` | 分类归档 | `app/notes/category/[category]/page.tsx` |
| `/health` | 健康时间线、快照、趋势和补剂 | `app/health/`、`app/lib/health.ts` |
| `/mind` | 认知地图与对话索引 | `app/mind/`、`app/knowledge/` |
| `/learning` | 科目分区（当前只有哲学）与学习方法 | `app/learning/page.tsx`、`app/learning/subjects.ts` |
| `/learning/philosophy` | 哲学问题地图 | `app/learning/philosophy/` |
| `/sitemap.xml`、`/robots.txt`、`/feed.xml` | 搜索索引与订阅 | `app/sitemap.ts`、`app/robots.ts`、`app/feed.xml/route.ts` |
| `/api/database` | 数据库健康检查 | `app/api/database/route.ts` |

学习空间按科目组织，一门科目一个顶层分区，学习方法排在所有科目之后：`app/learning/subjects.ts` 是科目清单的唯一来源，分区编号、分区锚点、深浅面交替和规划中的科目都从它推出，新增科目先改这份数据。当前已铺开的科目只有哲学；曾短暂上线过 `/learning/ai-workflow`，已于 2026-09-09 撤下。当前没有 `/lab` 或 `/workflow` 应用路由；旧 Lab 图片、样式和旧 Health 设计档案已从当前工作树清理。`public/learning/philosophy-tree.html` 仍作为旧哲学入口的兼容静态文件保留，当前哲学页面的数据源是 `app/learning/philosophy/data.json`。

## 数据边界

- 文章正文的规范来源进入 `migrations/` 并回放到 D1；仓库不维护 Markdown 正文副本。`app/lib/static-posts.ts` 是由迁移生成的只读回退，不是第二套手工内容源。
- 首页 OS 区只读公开数字、日期和受限短标签；`system-readout.tsx` 对运行期数据逐项校验，不渲染标题、备注或正文。
- `/health` 的公开内容来自 `app/lib/health.ts` 中的快照数据和组件；计时器以服务端快照为首屏基准。
- 哲学知识库的结构化数据来自 `data.json`：当前共 55 个节点，包括 23 个核心问题、6 个问题领域、5 个传统导航、7 个历史时段、10 个传统线索和 1 个方法论争论；正文来源状态和覆盖范围由 `KNOWLEDGE_BASE.md`、`content-ledger.ts`、`coverage.ts` 等文件共同约束，修改前必须读取局部 `AGENTS.md`。

## 关键运行约束

- 首页和健康动态读数关闭整页缓存；首页 OS fetch 使用 `cache: 'no-store'`，避免部署后继续显示旧结构或旧读数。
- Notes 分类使用路由段而不是 `searchParams`，保持可缓存；文章详情页不要添加 `loading.tsx`，避免 vinext 流式 404 变成软 404。
- 每页通过 `app/lib/metadata.ts` 的 `buildMetadata()` 生成完整 metadata，避免 vinext 的整体覆盖语义丢失 OG 字段。
- 构建期没有 D1；不要在 `generateStaticParams` 等构建阶段查询数据库。
- 顶层页面通过共享 `PageHero` 使用同一首屏内容骨架；默认栏目提供标题、说明和标签，首页额外提供装饰层。当前接口不再提供 Hero 内嵌 CTA/footer 槽位，页内导航由 `SectionNav` 承担。
- Hero 的扫描层是低对比装饰，不应遮挡内容；当前包含斜向、横向、纵向、网格面和径向五种形式，并通过不同周期、相位和 `prefers-reduced-motion` 控制重叠。

## 验证与发布链路

- GitHub CI 由 `.github/workflows/ci.yml` 在 `main` 的 push 和 pull request 上触发。
- CI 当前执行 `pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm exec tsc --noEmit` 和 `node scripts/replay-migrations.mjs`。
- CI 当前不执行 `pnpm build`，也不负责 Site 测试环境或正式网站部署；构建和部署仍由协作流程按需执行。
- 项目没有独立的测试目录；数据库结构和迁移内容的回放脚本是当前主要的自动化验证脚本。
- 本地 `pnpm check` 是 CI 三项检查的快捷串联；完整发布前仍需另跑 `pnpm build`。
- 普通无数据库改动的正式发布使用 `pnpm deploy:only`；数据库结构或内容迁移才使用 `pnpm deploy`。

## 环境地图

| 环境 | 地址 | 入口 | 用途 |
| --- | --- | --- | --- |
| 测试环境 | `https://killua-win.farhangisahel9.chatgpt.site` | `.openai/hosting.json` | 仅供预览、比较、验收 |
| 正式网站 | `https://www.killua.win/` | `wrangler.jsonc` / `pnpm deploy:only` | 只有这里才称为部署上线 |

环境命名和交付措辞以 `.cursor/rules/deployment-environment-language.mdc` 为准。

最近一次正式网站发布是 Worker Version ID `e2ae9304-77d7-4303-93d7-7b0ec91cae18`（2026-09-09，撤下 AI 编程工作流，学习页保留一门科目一个分区的结构），对应提交 `cb9b966`，使用 `pnpm deploy:only`，未触碰远程数据库。上一次是 `70b5ff22-d27a-423e-8fc5-e4dfaf025141`（2026-09-08，对应 `d6c8b63`），再往前是 `17741be9-d6dd-4208-8efd-71781982026e` 与 `17505b49-ea67-4420-b131-2074228659c8`。
