# 决策：首页只展示受限的 OS 公开汇总

- 状态：已接受
- 日期：2026-09-07

## 决定

首页只读取 `https://os.killua.win/api/public/stats` 的数字、日期和受限分类标签；不读取或渲染私人记录、任务标题、备注和正文。

## 原因

首页需要保留个人系统的运行感，但不能因为跨站数据接入而泄露内容。运行期校验必须独立于 TypeScript 类型声明。

## 证据

- `app/components/system-readout.tsx`：`num()`、`getLastSync()`、`MAX_KINDS`、`MAX_LABEL_LENGTH`、超时和失败状态。
- `app/page.tsx`：首页以 Suspense 包裹读数，外部端点变慢时不阻塞其余页面。

## 后果

OS 可以新增受限分类而不要求官网同步映射；异常字段会被丢弃或显示为未知，不会把正文带入首页。
