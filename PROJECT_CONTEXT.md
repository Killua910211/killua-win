# KILLUA.WIN 项目上下文

> 这份文档记录项目当前的任务边界、已经做出的关键决策、可复核证据和后续工作。涉及部署环境的称呼，以 `.cursor/rules/deployment-environment-language.mdc` 为准。

## 1. 项目定位

KILLUA.WIN 是一个个人数字空间：把 2008—2025 年散落在 QQ 空间和微信公众号的文字收拢到个人域名，同时维护健康记录、心理认知对话和哲学学习地图。

核心体验不是后台管理，而是一个可持续回看的个人档案：阅读旧文字、观察身体变化、整理认知问题、沿问题和传统继续学习。

技术基线：Next App Router 兼容层（vinext）、Vite、Cloudflare Workers、Cloudflare D1、手写 CSS、pnpm。正式运行入口由 `wrangler.jsonc` 管理，Site 测试项目由 `.openai/hosting.json` 标识。

## 2. 任务台账

### 已完成

- 完成个人写作站的文章归档、文章详情、分类路由、RSS、sitemap 和 robots 路由。
- 完成 `/health` 健康快照：活动、睡眠、恢复、体能趋势、营养补充、戒烟记录和长期时间线。
- 完成 `/mind` 认知笔记和对话索引，明确“观察与假设”不等于诊断。
- 完成 `/learning` 及哲学问题地图，支持按问题、传统和学习路径进入内容。
- 首页接入 KILLUA OS 公开汇总，只显示脱敏数字和受限分类标签，不显示私人记录正文。
- Hero 视觉效果从单一扫描扩展为斜向、横向、纵向、网格面、径向五种低对比扫描；最近一次调整已将它们改为短时出现、错峰、不同周期，降低重叠和规律性。
- 已将部署环境术语写入始终生效的项目规则：Codex Sites 叫“测试环境”，`https://www.killua.win/` 才叫“正式网站/部署上线”。
- 当前扫描效果版本已经部署到正式网站，并完成正式域名 `HTTP 200` 访问确认。

### 当前状态

- 当前没有未完成的产品开发任务。
- 最近一次视觉迭代的目标是“更丰富但不混乱”：后续如继续调整，应优先观察扫描层之间的时间关系、透明度和移动端表现，不要继续无条件增加层数。

### 后续候选任务

- 首页的 Builds / Elsewhere 两块仍是 `SOON`，`projects` 表暂未接入展示。
- 如访问量增加，再评估跨 Worker isolate 共享 ISR 缓存；目前进程内缓存对项目体量足够。
- Site 测试项目的自定义域名绑定曾处于待验证状态；正式网站当前走项目既有的 Cloudflare Worker 部署链路。若以后需要让 Site 测试环境使用自定义域名，先处理 DNS/TXT 验证，再称为测试环境入口。

## 3. 关键决策记录

| 决策 | 原因 | 证据 |
| --- | --- | --- |
| Site 部署统一称为测试环境 | 避免把审阅用环境误称为正式发布 | `.cursor/rules/deployment-environment-language.mdc`、`.openai/hosting.json` |
| 只有 `https://www.killua.win/` 称为正式网站并可说“部署上线” | 用户明确指定正式发布边界 | `app/lib/metadata.ts`、`wrangler.jsonc`、README 部署脚本 |
| 正式网站沿用 `pnpm deploy:only` | 这次只发布已验证构建，不涉及数据库结构变化 | `package.json`、`README.md` |
| Site 测试环境与正式 Worker 部署分开 | 测试环境用于预览和比较；正式域名由 Worker 链路承载 | `.openai/hosting.json`、`wrangler.jsonc` |
| Hero 扫描保持低对比 | 扫描是氛围和系统感，不应压过标题与正文 | `app/globals.css` 的 `.hero-scan*` 规则 |
| 扫描层采用短窗口、错峰和不同周期 | 同时出现会造成重叠；同周期又会形成明显重复节拍 | `app/globals.css` 的 `@keyframes hero-scan-*` 及各层 `animation` 设置 |
| 首页动态读取 OS 汇总 | OS 公开字段变化后，整页缓存可能保留旧结构或旧读数 | `app/page.tsx` 的 `revalidate = 0`、`app/components/system-readout.tsx` 的 `cache: 'no-store'` |
| 公开 OS 数据只接受有限数字和短标签 | 保留可用汇总，同时避免把私人内容或异常正文带入首页 | `app/components/system-readout.tsx` 的 `num()`、`MAX_KINDS`、`MAX_LABEL_LENGTH` |
| 文章分类使用路由段，不使用 searchParams | 保持分类页可缓存，避免整页被请求态输入拖成动态渲染 | `app/notes/category/[category]/page.tsx`、`README.md` |
| 不在文章详情页加入 `loading.tsx` | 流式响应可能让 `notFound()` 前先提交 200，造成软 404 | `app/notes/[slug]/page.tsx`、README 的 vinext 说明 |
| 页面 metadata 每页完整生成 | vinext 的 metadata 合并不是深合并，局部覆盖会丢失 OG 字段 | `app/lib/metadata.ts` 的 `buildMetadata()` |
| 迁移只前滚且 INSERT 幂等 | D1 迁移不依赖可回滚事务，重跑必须安全 | `README.md` 的“迁移的三条纪律”、`migrations/` |

## 4. 证据索引

### 代码证据

- 站点元数据和正式域名：`app/lib/metadata.ts`
- 正式 Worker 入口、D1 绑定和兼容配置：`wrangler.jsonc`
- Site 测试项目标识：`.openai/hosting.json`
- 包管理、测试、构建和正式部署命令：`package.json`
- 首页结构和动态策略：`app/page.tsx`
- OS 公开数据边界、超时和失败状态：`app/components/system-readout.tsx`
- Hero 扫描层结构：`app/components/page-hero.tsx`、`app/page.tsx`
- Hero 扫描动画、错峰周期和减少动态效果：`app/globals.css`
- 部署环境命名规则：`.cursor/rules/deployment-environment-language.mdc`

### 已执行验证

2026-09-07，最近一次扫描调整后执行：

- `pnpm typecheck`：通过
- `pnpm lint`：通过
- `pnpm build`：通过
- 正式网站 `https://www.killua.win/`：只读访问返回 `HTTP 200`

这些验证证明构建和正式入口可访问；它们不等同于完整浏览器视觉回归测试。涉及视觉改动时，仍应在测试环境先比较，再决定是否正式网站部署上线。

## 5. 工作约定

1. 先在本地完成类型检查、Lint 和构建。
2. 视觉改动先部署到 Site 测试环境，交付时称“测试环境”。
3. 只有用户明确要求且版本已验证，才执行 `pnpm deploy:only` 或包含迁移的正式部署流程。
4. 需要数据库结构或内容变化时，先本地迁移和回放，再决定是否运行远程迁移；不要为了普通样式改动触碰 D1。
5. 不改历史迁移；新增内容或修订使用新的幂等迁移。
6. 任何公开汇总都要在运行期限制字段类型、长度和数量，不能只依赖 TypeScript 类型断言。
7. 继续使用 pnpm，不引入 npm lockfile；保持现有 vinext/Workers 结构。

## 6. 部署地图

| 环境 | 地址 | 用途 | 用户-facing 称呼 |
| --- | --- | --- | --- |
| Site | `https://killua-win.farhangisahel9.chatgpt.site` | 预览、比较、验收 | 测试环境 |
| 正式 Worker | `https://www.killua.win/` | 面向正式域名的发布 | 正式网站 / 部署上线 |

不要把第一行描述为正式上线；不要把第二行描述为 Site 测试环境。
