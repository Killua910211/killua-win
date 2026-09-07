# KILLUA.WIN 架构

## 产品边界

KILLUA.WIN 是个人数字空间，不是后台管理系统。它把旧文章、健康快照、心理认知对话和哲学学习材料组织成可持续回看的个人档案。

## 运行结构

```text
浏览器
  ↓
vinext / Next App Router 兼容层
  ↓
Vite 构建 → Cloudflare Worker（wrangler.jsonc）
  ├─ D1：文章与站点数据（binding DB）
  └─ 外部公开端点：os.killua.win/api/public/stats
```

- 包管理器是 pnpm，构建产物在 `dist/`。
- Worker 名称是 `killua-win`，D1 数据库是 `killua-win-d1`。
- Site 测试项目由 `.openai/hosting.json` 标识；它不是正式网站的事实来源。
- 正式网站由项目既有 Cloudflare Worker 部署链路承载，使用 `pnpm deploy:only` 发布已构建产物；涉及数据库变更时才使用包含远程迁移的 `pnpm deploy`。

## 路由与模块

| 路径 | 责任 | 主要来源 |
| --- | --- | --- |
| `/` | 首页、Hero、OS 脱敏汇总 | `app/page.tsx`、`app/components/system-readout.tsx` |
| `/notes` | 文章归档与前言 | `app/notes/page.tsx`、`app/components/notes-archive.tsx` |
| `/notes/[slug]` | 文章详情与 Article JSON-LD | `app/notes/[slug]/page.tsx` |
| `/notes/category/[category]` | 分类归档 | `app/notes/category/[category]/page.tsx` |
| `/health` | 健康时间线、快照、趋势和补剂 | `app/health/`、`app/lib/health.ts` |
| `/mind` | 认知地图与对话索引 | `app/mind/`、`app/knowledge/` |
| `/learning` | 问题、传统和学习路径入口 | `app/learning/page.tsx` |
| `/learning/philosophy` | 哲学问题地图 | `app/learning/philosophy/` |
| `/sitemap.xml`、`/robots.txt`、`/feed.xml` | 搜索索引与订阅 | `app/sitemap.ts`、`app/robots.ts`、`app/feed.xml/route.ts` |
| `/api/database` | 数据库健康检查 | `app/api/database/route.ts` |

## 数据边界

- 文章正文进入 D1，不维护一份 Markdown 正文副本；迁移位于 `migrations/`。
- 首页 OS 区只读公开数字、日期和受限短标签；`system-readout.tsx` 对运行期数据逐项校验，不渲染标题、备注或正文。
- `/health` 的公开内容来自 `app/lib/health.ts` 中的快照数据和组件；计时器以服务端快照为首屏基准。
- 哲学知识库的正文、来源状态和覆盖范围由 `KNOWLEDGE_BASE.md`、`content-ledger.ts` 等文件共同约束，修改前必须读取局部 `AGENTS.md`。

## 关键运行约束

- 首页和健康动态读数关闭整页缓存；首页 OS fetch 使用 `cache: 'no-store'`，避免部署后继续显示旧结构或旧读数。
- Notes 分类使用路由段而不是 `searchParams`，保持可缓存；文章详情页不要添加 `loading.tsx`，避免 vinext 流式 404 变成软 404。
- 每页通过 `app/lib/metadata.ts` 的 `buildMetadata()` 生成完整 metadata，避免 vinext 的整体覆盖语义丢失 OG 字段。
- 构建期没有 D1；不要在 `generateStaticParams` 等构建阶段查询数据库。
- Hero 的扫描层是低对比装饰，不应遮挡内容；当前包含斜向、横向、纵向、网格面和径向形式，并通过短窗口、错峰和不同周期控制重叠。

## 验证与发布链路

- GitHub CI 由 `.github/workflows/ci.yml` 在 `main` 的 push 和 pull request 上触发。
- CI 当前执行 `pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm exec tsc --noEmit` 和 `node scripts/replay-migrations.mjs`。
- CI 当前不执行 `pnpm build`，也不负责 Site 测试环境或正式网站部署；构建和部署仍由协作流程按需执行。
- 项目没有独立的测试目录；数据库结构和迁移内容的回放脚本是当前主要的自动化验证脚本。
- 普通无数据库改动的正式发布使用 `pnpm deploy:only`；数据库结构或内容迁移才使用 `pnpm deploy`。

## 环境地图

| 环境 | 地址 | 入口 | 用途 |
| --- | --- | --- | --- |
| Site 测试环境 | `https://killua-win.farhangisahel9.chatgpt.site` | `.openai/hosting.json` | 预览、比较、验收 |
| 正式网站 | `https://www.killua.win/` | `wrangler.jsonc` / `pnpm deploy:only` | 正式发布 |

环境命名和交付措辞以 `.cursor/rules/deployment-environment-language.mdc` 为准。
