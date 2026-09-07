# 决策：区分 Site 测试环境与正式网站

- 状态：已接受
- 日期：2026-09-07

## 决定

Codex Sites 地址只作为测试环境使用；只有 `https://www.killua.win/` 才视为正式网站，才使用“部署上线”这个说法。

## 原因

测试环境用于比较和验收，不应让交付描述误导为正式发布。正式网站由项目既有 Cloudflare Worker 链路承载，两者用途和发布入口不同。

## 证据

- `.openai/hosting.json`：Site 测试项目配置。
- `wrangler.jsonc`：正式 Worker 配置。
- `package.json`：`pnpm deploy:only` 和包含迁移的 `pnpm deploy`。
- `.cursor/rules/deployment-environment-language.mdc`：始终生效的命名规则。

## 后果

视觉改动先进入 Site 测试环境；用户明确确认后，才使用正式 Worker 部署流程。汇报时必须标明具体环境。
