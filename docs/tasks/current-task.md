# 当前任务：项目上下文与规则结构化

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
- 本次文档变更验证：`git diff --check` 通过；本次没有业务代码变更，因此未重复运行构建或部署。

## 结果

新的长期事实来源如下：

- 通用规则与入口：`AGENTS.md`
- Claude Code 入口：`CLAUDE.md`
- Codex 入口：`CODEX.md`
- 当前任务：本文件
- 架构：`docs/architecture.md`
- 长期决策：`docs/decisions/`
