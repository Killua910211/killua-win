# KILLUA.WIN 项目规则

这是项目级长期规则与文档入口。开始工作前，先读本文件；任务状态和验收以 [docs/tasks/current-task.md](docs/tasks/current-task.md) 为准，长期决定以 [docs/decisions/](docs/decisions/) 为准，系统结构见 [docs/architecture.md](docs/architecture.md)。

## 长期规则

- 保持现有 vinext + Vite + Cloudflare Workers + D1 + pnpm 技术基线；不要为了普通样式改动更换框架或包管理器。
- 先完成本地类型检查、Lint 和构建，再更新测试环境或正式网站；不要把构建通过写成完整视觉回归通过。
- D1 迁移只前滚；内容 INSERT 必须幂等；普通样式改动不要触碰远程数据库。`migrations/` 是内容事实源，`app/lib/static-posts.ts` 只能由生成脚本更新。
- 公开汇总数据必须做运行期字段、长度和数量边界检查，不要只依赖 TypeScript 类型断言。
- 修改哲学知识库时，先遵守 [app/learning/philosophy/AGENTS.md](app/learning/philosophy/AGENTS.md) 和其中指定的知识库规则。

## 文档维护

- 每个具体需求在 `docs/tasks/current-task.md` 记录需求、验收、计划、状态和证据；完成后保留结果，不伪造未执行的验证。
- 只有会影响未来实现或运维的决定才写入 `docs/decisions/`，并附上代码证据和后果。
- 发现旧文档与代码不一致时，优先修正文档或代码中的事实冲突，并在当前任务中记录。
- Review 前先检查 `git status`、`git log` 和实际源文件；必须区分已提交代码、工作树改动和已经发布到正式网站的版本，不能把未提交改动写成已发布事实。
- `docs/tasks/current-task.md` 顶部只保留当前任务；已完成任务移到下方历史区，避免多个“当前任务”并列。
- 不创建空的架构、证据或任务文件；不把一次性聊天内容写成没有证据的长期规则。
