# 当前任务：学习空间改为一门科目一个分区，并入 AI 编程工作流课程设计

状态：已完成并发布正式网站（2026-09-08）。

## 需求

- 把 `~/Documents/Claude/AI CODE/阶段一/01-课程设计.md`（《AI 编程工作流学习指南》课程设计）按当前网站风格改造，放进学习页。
- 学习页原有的哲学体系保留；AI 编程工作流与哲学**同级别**，是并列的两门科目，不是主线加附录。
- 结构要能容纳后续新增的其他科目。
- 沿用现有深色栏目语言：标签列 / 正文列同一条轨道、等宽小标签、ember 强调色，不引入新的颜色或圆角语言。
- 原设计里的 🟢🟡⚪ 与 🚀🛠🔬 emoji 标记换成站内的文字标签。

## 验收

- `/learning` 的分区结构是 `01` 首屏 → `02` 哲学 → `03` AI 编程工作流 → `04` 学习方法：一门科目一个分区，两者同级。
- 哲学原有的「按问题」「按传统」内容全部保留，收进哲学分区内部的两块。
- 后续新增科目排在同一层，学习方法自动往后顺延。
- `/learning/ai-workflow` 完整承载课程设计：断点分析、三原则、三条阅读路径、快车道五步与升级触发器、六级能力地图与十项能力、57 章完整目录、四个不同与五种证据标记。
- 新增科目只需要改一份数据。
- 桌面与移动端都不撑破页面；所有分区落在同一条内容轨道上。
- `pnpm check` 与 `pnpm build` 通过。

## 本次改动

1. 新增 `app/learning/ai-workflow/curriculum.ts`：课程设计的结构化数据。章数、部分数、重点章数由数据推出，不在正文写死。
2. 新增 `app/learning/ai-workflow/page.tsx`：七个分区（首屏 + 02 断在哪 … 07 方法与证据），复用 `PageHero` / `SectionNav` / `SiteHeader` / `SiteFooter`。
3. 新增 `app/learning/subjects.ts`：科目清单的唯一来源。分区编号（`subjectSectionNumber` / `methodSectionNumber`）、深浅面交替、分区导航和规划中的科目全部由它推出，新增科目只改这一个数组。
4. 重写 `app/learning/page.tsx` 的分区结构：
   - 02 哲学：原有的「按问题」「按传统」两条轴收进同一个分区，成为内部两块（标题层级从 `h2` 降到 `h3`，`CoreQuestionGroups` 传 `headingLevel="h4"`），正文、链接与 23 个问题、5 条传统导航完全不变。
   - 03 AI 编程工作流：与哲学分区同一种外壳，含三条原则、快车道五步、三条阅读路径与课程设计总览入口。
   - 04 学习方法：保留学习循环，「之后的科目（规划中）」列表改由 `plannedSubjects` 渲染。
5. `app/globals.css`：`.learning-questions` / `.learning-traditions` 两个分区级类合并为 `.learning-subject-section`（含 `--a` / `--b` 两种面），新增 `.workflow-*`、`.learning-block-*`、`.learning-workflow-*`、`.learning-path-*`；`.learning-method` 改用最深的 `var(--black)` 收尾，避免和上一节撞成同一个面；`.learning-tradition` / `.learning-question-group` 的标题选择器改为 `:is(h3, h4)`，让哲学总览页继续用 `h3`。
6. `app/sitemap.ts`：加入 `/learning/ai-workflow`。
7. `docs/architecture.md`：路由表补两条，并写明科目清单的来源文件。
8. 新增 `docs/decisions/0005-learning-subject-layer.md`：记录「一门科目一个分区、学习方法排最后、新增科目先改 `subjects.ts`」这个长期决定。

## 验证与证据

- `pnpm check`：通过（ESLint、TypeScript、迁移回放 15 个迁移 / 58 篇文章）。
- `pnpm build`：通过，路由表包含 `/learning/ai-workflow`。
- `git diff --check`：通过。
- 浏览器实测（本地 dev，1440 / 1600 / 375 三种视口）：
  - `/learning` 分区为 `01` 首屏、`02` learning-philosophy、`03` learning-ai-workflow、`04` learning-method，正文列全部 `left 260 / width 1085`，标签列全部 `left -120 / width 180`；`/learning/ai-workflow` 六个分区同样彼此一致，并与 `.learning-method` 对齐在同一条轨道上。
  - 三个分区的面依次为 `#0e0e11`、`#1a1a1f`、`#080809`，没有相邻同色。
  - 1440 与 375 下两页 `documentElement.scrollWidth === clientWidth`，无横向溢出；移动端三个分区正文列都在 `x = 20`。
  - 哲学内容计数不变：23 个核心问题、6 个问题域、5 条传统导航；规划中的科目 3 条。页内锚点全部命中（`badAnchors` 为空）。
  - `/learning`、`/learning/ai-workflow`、`/learning/philosophy` 在干净标签页里控制台均无错误；哲学总览页的问题组标题仍是 `h3` 且仍为 21px。
- 检查中发现并修复：
  1. 学习页新增分区（当时叫 `.learning-tracks`，现为 `.learning-workflow`）最初只写了背景没写 `display: grid`，正文列错位到最左边，与其他分区不在同一条轨道上。
  2. `.workflow-track` 用 `inline-flex` 会把「Start / 上手」中间的空格当成 flex item 间距吃掉，改为 `inline-block`。
  3. `.workflow-step-cost` 和两个 caveat 类被同块内的元素选择器（`.workflow-steps p` 等）压过，原本靠 `!important` 掩盖；改为带父类的选择器后去掉了全部 `!important`，五步的耗时才真正对齐到同一条底线（实测 5 个 bottom 均为 3599）。
  4. 移动端新分区落在基础规则的 `4vw`（375 下 15px）上，比其他栏目分区的 20px 窄，科目行那对负外边距正好顶出 1px 横向溢出（`scrollWidth 376 / clientWidth 375`）；把 760px 断点下的左右内边距统一成 20px 后消失。

## 正式网站发布记录

- 用户明确要求部署到生产环境。按 AGENTS.md，视觉改动本应先经 Codex Sites 测试环境确认；测试环境属于 Codex Sites 项目（`.openai/hosting.json`），本次会话没有对应的部署工具，因此跳过该步并已向用户说明。
- 发布前重跑 `pnpm check` 与 `pnpm build`，均通过。
- 用 `pnpm deploy:only` 部署（不含 `pnpm migrate`）：本次是纯前端改动，没有新迁移，按长期规则不触碰远程数据库。
- Worker Version ID：`17741be9-d6dd-4208-8efd-71781982026e`；上传 9 个新增/变更静态资源，Worker 启动时间 25ms。
- 发布后实测 `https://www.killua.win/`、`/learning`、`/learning/ai-workflow`、`/learning/philosophy`、`/notes` 均返回 HTTP 200。
- 正式网站 `/learning` 复核：分区为 `01` 首屏、`02` Philosophy、`03` AI workflow、`04` How to use；eyebrow 为「Subject 01 / 哲学」「Subject 02 / AI 编程工作流」；三个分区的面依次 `#0e0e11`、`#1a1a1f`、`#080809`；23 个核心问题、5 条传统导航、3 条规划中科目；无横向溢出、控制台无错误。
- 正式网站 `/learning/ai-workflow` 复核：6 个分区、57 章、29 章重点展开，页内锚点全部命中，无横向溢出、控制台无错误。
- `https://www.killua.win/sitemap.xml` 已包含 `/learning/ai-workflow`。

## 尚待处理

- 浏览器面板在本次会话中处于隐藏状态，滚动后不绘制，所以本地只有「隐藏其他分区后置顶截图」的证据，没有真实滚动过程的视觉回归；正式网站的复核同样是 DOM 探测加首屏截图。
- **本次改动尚未提交到 Git**：正式网站跑的是当时工作树的内容，`git status` 里仍有未提交文件。后续需要单独 review 并提交。
- 工作树里还有一处不属于本次任务的改动：`app/icon.svg` 的圆点颜色从 `#ccff00` 改为 `#e0632a`，本次未改动它，但它随这次发布一起上线了。
- 站点字体变量链在 `:root` 上就已失效（`--font-barlow` 等由 `next/font` 挂在 `<body>`，而 `--font-body` / `--font-mono` 定义在 `:root`），正式网站实测同样退回系统中文字体。这是既有问题，本次未改动，新样式沿用同一套变量。

---

# 历史任务：同步最新项目上下文文档

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
