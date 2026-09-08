# 当前任务：同步最新项目上下文文档

状态：已完成（2026-09-08）

## 需求

- 以当前源代码、配置、Git 历史和工作树为证据，重新 review 项目，而不是沿用旧文档。
- 更新项目任务、架构、决策和长期规则，使其与当前实现一致。
- 明确区分已提交代码、已部署正式网站的版本和工作树中尚未发布的改动。

## Review 快照

- 复核基线：`HEAD` 为 `5e745a0`（`Record formal site deployment`）；本地 `main` 在复核开始时领先 `origin/main` 10 个提交。
- 工作树仍有用户未提交的业务与清理改动，包括首页/各栏目 Hero、全局样式、58 篇文章文案同步、健康/学习/心理/Notes 页面，以及旧 Lab 素材删除；本次没有回退或覆盖这些改动。
- 当前站点结构没有 `/lab` 或 `/workflow` 应用路由；`public/learning/philosophy-tree.html` 仍是兼容静态入口。
- 数据事实：迁移回放通过，15 个迁移、数据库版本 15、58 篇已发布文章；分类为随笔 53、诗歌 2、短篇 2、阅读 1。
- 哲学事实：`data.json` 共 55 个节点，其中 23 个核心问题、6 个问题领域、5 个传统导航、7 个历史时段、10 个传统线索和 1 个方法论争论。
- 正式网站已记录版本为 Worker Version ID `17505b49-ea67-4420-b131-2074228659c8`；当前工作树改动尚未因此自动成为正式网站版本。

## 本次更新

1. 更新 `AGENTS.md`：补充以 `git status`/`git log` 复核事实、区分发布状态、维护当前任务单和静态文章回退的规则。
2. 重写 `docs/architecture.md`：补齐静态文章回退、当前路由与无 Lab 事实、哲学节点数量、缓存/验证边界、环境命名和最近正式发布记录。
3. 修订 `docs/decisions/0003-hero-scan-pacing.md`：记录五种扫描形态的当前周期和首页特殊装饰边界。
4. 新增 `docs/decisions/0004-hero-content-density.md`：记录共享 Hero 收窄为内容骨架的长期决定。
5. 本文件顶部改为当前 review 任务，旧的清理、模块对齐、正式发布和上下文结构化记录保留在历史区。
6. 同步两处过期技术注释：文章分享卡片不再写死旧文章数量，404 行为使用“正式网站实测”措辞。

## 验证与证据

- `pnpm check`：通过（ESLint、TypeScript、迁移回放）。
- `pnpm build`：通过，5 个构建阶段完成；构建路由与当前 `app/` 目录一致。
- `git diff --check`：通过。
- 证据文件：`package.json`、`wrangler.jsonc`、`.openai/hosting.json`、`.github/workflows/ci.yml`、`app/` 路由、`migrations/`、`scripts/replay-migrations.mjs`、`scripts/generate-static-posts.mjs`。

## 尚待处理

- 当前工作树的业务/资源清理改动仍未提交；后续如需写入远程仓库，应先单独 review 这些改动，再决定提交和是否发布测试环境。
- 当前正式网站发布记录只覆盖已记录的 Worker 版本；不能把本次工作树的 Hero、页面文案或资源删除描述为已部署上线。
- CI 尚不运行 `pnpm build`，也不自动发布测试环境或正式网站；正式发布仍需显式执行并验证 `https://www.killua.win/`。

---

# 历史任务：仓库与本地文件清理

状态：已完成（2026-09-07）

- 统一 README、发文脚本、文章查询注释和 Notes 列表注释中的文章数为 58。
- 删除已无 JSX 引用的旧 Hero/Lab 样式、空目录、旧审阅页、旧 Health 设计档案和 4 个无引用 Lab 图片素材；保留构建产物与哲学兼容静态入口。
- `pnpm check`、`pnpm build`、`git diff --check` 和引用检查均通过；迁移回放确认 15 个迁移、58 篇已发布文章。

# 历史任务：首屏与正文模块对齐、修正页面序号

状态：已完成（2026-09-07）

- 统一桌面端首屏、首页读数、Notes、Health、Mind、Learning 和哲学页面的内容轨道。
- 修正 Health 顶层序号为首屏 `01`、时间线 `02`、一周均值 `03`、长期趋势 `04`、补剂 `05`、数据观察 `06`；嵌套时间线保留 `Life 01 / Quit 02`。
- 先完成 `pnpm lint`、`pnpm typecheck`、`pnpm build`，再更新测试环境：`https://killua-win.farhangisahel9.chatgpt.site`。
- 后续桌面端统一将分区编号向左移动 200px，移动端保持原位；这些改动与正式发布记录分开维护。

## 正式网站发布记录

- 用户明确确认发布正式网站。
- 使用生产 Worker 发布流程部署已验证版本：`17505b49-ea67-4420-b131-2074228659c8`。
- `https://www.killua.win/` 与 `https://www.killua.win/notes` 发布后检查均返回 HTTP 200。

# 历史任务：项目上下文与规则结构化

状态：已完成（2026-09-07）

已建立并持续维护以下入口：

- 通用规则：`AGENTS.md`
- Claude Code 入口：`CLAUDE.md`
- Codex 入口：`CODEX.md`
- 架构：`docs/architecture.md`
- 长期决策：`docs/decisions/`
- 哲学局部规则：`app/learning/philosophy/AGENTS.md` 与 `KNOWLEDGE_BASE.md`

初次结构化 review 确认了 vinext/Vite/Workers/D1 基线、公开 stats 数据边界、哲学知识库局部规则、CI 静态检查与迁移回放边界，并建立了测试环境与正式网站的专门称呼规则。
