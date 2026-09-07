# 当前任务：首屏与正文模块对齐、修正页面序号

状态：已完成（2026-09-07）

## 需求

- 修复各页面首屏模块与后续正文模块的横向内容轨道不一致问题。
- 检查并修正页面级分区序号重复问题。

## 执行计划与状态

1. 检查共享 `PageHero`、各页面分区网格和编号：已完成。
2. 统一首屏与正文模块的标签列、正文列、外侧边界和列间距：已完成。
3. 修正 Health 页顶层分区序号：已完成。
4. 完成本地检查并更新测试环境：已完成。

## 结果与证据

- `app/components/page-hero.tsx`：首屏无装饰列时不再占用空的第三列；真实传入装饰时才保留第三列。
- `app/globals.css`：桌面端首屏、首页读数、Notes、Health、Mind、Learning 及哲学页面共用同一内容轨道。
- `app/health/page.tsx`：顶层序号由首屏 `01`、时间线 `02` 连续到数据观察 `06`，保留时间线内部 `Life 01 / Quit 02` 等嵌套序号。
- `pnpm lint`：通过。
- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `git diff --check`：通过。
- 测试环境已发布：`https://killua-win.farhangisahel9.chatgpt.site`。
- 未跟踪的 `hero-typography-review.html` 未修改、未纳入本次提交。

## 补充调整

- 首屏与后续模块恢复到原有无额外列间距的左对齐轨道，首屏正文向左回移 `28px`。
- 所有顶层分区序号统一使用 `--ember` 橙色，包括深色分区。
- 补充调整后的 `pnpm lint`、`pnpm typecheck` 和 `pnpm build` 均通过。

## 补充调整（二）

- 所有共享首屏编号标签（如 `01 / Writing archive`）在桌面端统一向左移动 `200px`，移动端保持原位。

---

# 历史任务：项目上下文与规则结构化

状态：已完成（2026-09-07）

## 需求

梳理项目的任务、决策、证据和上下文，并将长期规则按以下结构写回代码仓库：

```text
AGENTS.md
CLAUDE.md
CODEX.md
docs/
├── tasks/current-task.md
├── architecture.md
└── decisions/
```

## 验收标准

- 根目录有精简的 `AGENTS.md`，包含长期规则和文档入口。
- `CLAUDE.md`、`CODEX.md` 指向同一套公共规则，不复制出两套事实。
- `docs/tasks/current-task.md` 记录本任务的需求、验收、计划、状态和证据。
- `docs/architecture.md` 描述当前真实架构、路由、数据边界和两条部署链路。
- `docs/decisions/` 只保留有长期价值且有代码证据的决定。
- 删除旧的重复上下文入口，README 指向新的入口。
- 不改业务代码，不创建空文件，不虚构没有执行过的验证。

## 执行计划与状态

1. 盘点现有规则、README、项目配置和局部 `AGENTS.md`：已完成。
2. 将原 `PROJECT_CONTEXT.md` 的有效信息拆分到根级入口、架构、任务和决定文档：已完成。
3. 修正 README 的上下文入口与环境术语：已完成。
4. 检查文档结构、链接目标和 Git diff：已完成。

## 证据

- 原有上下文来源：已移入本目录、`AGENTS.md`、`docs/architecture.md` 和 `docs/decisions/`。
- 技术基线：`package.json`、`wrangler.jsonc`、`.openai/hosting.json`。
- 路由与功能：`app/page.tsx`、`app/notes/`、`app/health/`、`app/mind/`、`app/learning/`。
- 公开数据边界：`app/components/system-readout.tsx`。
- 视觉扫描实现：`app/components/page-hero.tsx`、`app/globals.css`。
- 环境称呼规则：`.cursor/rules/deployment-environment-language.mdc`。
- CI 与验证边界：`.github/workflows/ci.yml`、`package.json`、`scripts/replay-migrations.mjs`。
- 本次文档变更验证：`git diff --check` 通过；本次没有业务代码变更，因此未重复运行构建或部署。

## 项目体检与 Review 结论

- 项目已有清晰的 vinext/Workers/D1 运行骨架、模块级哲学知识库规则和 GitHub CI。
- 之前的主要治理缺口是缺少根级工具入口、任务状态文件、架构文档和可追溯决策记录；本次已补齐。
- 当前验证边界是：CI 覆盖静态检查和迁移回放，但不覆盖完整构建；没有自动部署工作流，正式网站发布需要显式执行并单独验证。
- 当前没有发现需要立即修改的业务架构问题；后续优先维护 `current-task.md` 和新增长期决策，而不是继续堆叠总览文档。

### 体检模块：Health

- 入口：`/health`，实现位于 `app/health/page.tsx`，数据和展示辅助函数主要位于 `app/lib/health.ts`。
- 覆盖内容：个人时间线、已存活时间、戒烟记录、恢复时间线、七日均值、长期趋势、营养覆盖、补剂方案和数据观察。
- 首屏设计：Health 使用共享 `PageHero` 和 `SectionNav`，其中时间线和导航优先进入首屏；服务端时间作为计时器首屏基准，避免客户端接管前出现不一致读数。
- 当前证据：`HEALTH_COVERAGE_START`、`HEALTH_UPDATED_AT`、`HEALTH_WEEKLY_AVERAGES`、`HEALTH_TRENDS`、`HEALTH_NUTRITION_COVERAGE` 和 `HEALTH_SUPPLEMENTS` 均在页面中有明确消费位置。
- 当前风险：没有独立的 Health 自动化测试目录；如果修改健康计算或时间边界，至少要运行类型检查、Lint、构建，并人工检查 `/health` 的桌面和移动端表现。

## 结果

新的长期事实来源如下：

- 通用规则与入口：`AGENTS.md`
- Claude Code 入口：`CLAUDE.md`
- Codex 入口：`CODEX.md`
- 当前任务：本文件
- 架构：`docs/architecture.md`
- 长期决策：`docs/decisions/`
