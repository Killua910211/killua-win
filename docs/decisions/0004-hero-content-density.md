# 决策：共享 Hero 只承载首屏内容

- 状态：已接受
- 日期：2026-09-08

## 决定

顶层页面的共享 `PageHero` 只负责栏目标签、标题、说明和可选装饰；不再提供页面 CTA 或 footer 插槽。页内跳转统一交给首屏后的 `SectionNav`，具体行动入口放在对应正文模块。

## 原因

Hero 同时承载标题、行动按钮、状态指标和页脚时，页面之间的高度、对齐和视觉密度会随内容变化，容易让装饰层与正文重叠。收窄接口后，各栏目共享同一横向轨道，首屏主层级更稳定。

## 证据

- `app/components/page-hero.tsx`：当前 props 只保留标题、说明、标签、编号、ID、变体和可选装饰。
- `app/page.tsx`、`app/health/page.tsx`、`app/mind/page.tsx`、`app/learning/page.tsx`、`app/notes/page.tsx`：当前顶层页面均以共享 Hero + `SectionNav` 组织首屏与页内导航。
- `app/globals.css`：`.page-hero__grid` 统一标签列和正文列，桌面端分区标签统一向左 200px，移动端不应用该偏移。

## 后果

后续新增首屏动作时，先判断它是否属于该栏目正文模块；不要为了局部页面方便重新扩大共享 Hero API。若确实需要特殊首屏装饰，只通过 `decoration` 接入，并保持标题和说明可读。
