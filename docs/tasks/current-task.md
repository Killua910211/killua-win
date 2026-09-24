# 当前任务：哲学人物与学派缺口补充（2026-09-24）

状态：**已提交、推送 origin/main 并部署正式 Worker**（2026-09-24，线上复验延续至 09-25）。顾问完整答复仍待回收；本轮内容保留自审标记。

## 需求与边界

分析正式网站 `/learning` 的哲学学习内容，补充缺失人物与学派。用户显式调用
`codex-chatgpt-collaboration`：已向 ChatGPT 发送一次中文任务摘要（无文件、源码或敏感数据），已收到阶段性意见，但尚无完整顾问答复。
保留问题驱动、零客户端 JS、现有 URL 与技术栈；用户随后明确授权提交、发布与部署上线；不运行远程数据库迁移。

## 验收与计划

1. 对照线上入口、重点历史页及本地全库，区分人物仅被提及、论证缺失与来源缺失。
2. 核对可访问学术来源及中文材料；先修正误导，再将人物与学派接入历史正文、来源账和问题关系。
3. 每项补充说明争点、理由、反对或限度、继续阅读路径；不以数量冒充完整性。
4. 执行 `pnpm check`、`pnpm build`，检查哲学路由与来源链接渲染，浏览器核对桌面及窄屏。
5. 保存自审结果与未覆盖范围，清楚区分本地成果和正式网站。

## 基线证据

- 开始时工作树干净，HEAD `5864574`（合并 `sites/main`）；最近还有 `/mind` 修改，非本任务。
- 本地数据树 55 节点、23 核心问题、18 条历史／传统线索，线上 `/learning` 显示相同数字。
- 浏览器实际打开 `/learning`、`/learning/philosophy/western-contemporary`、`/learning/philosophy/chinese-later`。
- 后两页正文均明确记录缺项：实用主义无来源账，清代考据只有摘要。本地全文检索核对人名，不能把检索未命中当作哲学史价值排序。
- 网页抓取工具无法取得站点正文，直接 HTTP 请求返回 403；线上证据来自浏览器正常访问。


## 本轮结果

- 保留 55 节点、23 核心问题、18 历史／传统线索，在六个既有历史条目补充论证。
- 古代补塞克斯都与普罗提诺；中世纪补奥卡姆；近代补贝克莱；近当代补实用主义、具身现象学、逻辑经验主义与法兰克福学派；中国后期补王弼解释方法、戴震伦理；印度补数论与古典瑜伽的邻近对照。
- 每条有具体争点、理由、反对或限度及阅读入口。新增 14 条来源，实际打开 SEP、IEP 或中文研究论文核对章节；更新现象学与梵论两条已有来源的核验范围。没有把综述给出的书名当成读过整部原典。
- 修正维特根斯坦前后期、朱王内外二分、梵的人格性、怀疑论与经验论直线叙述。八条新增关系、两条已有历史关系和一条跨传统关系连接到具体问题。
- 变更只涉及内容、来源与关系数据及文档；未修改运行时组件、依赖、迁移或静态文章生成文件。
- 跨页发现和后续缺口见 [整改清单](../../app/learning/philosophy/CONTENT_GAP_REVIEW.md)。本轮为自审，未作独立复审。

## 验收证据

- `pnpm check`：Lint、TypeScript、16 个迁移的本地回放、哲学 8 模块／18 项不变式通过。
- `pnpm build`：vinext 五阶段构建通过；构建工具仍提示部分路由无法静态分类，这不是页面请求失败。
- 本地 HTTP：学习入口、55 个哲学节点、地图、路径共 58 路由均 200；六个修改页的新增人物／来源编号在 HTML 中，非空页内锚点可解析。
- 浏览器：桌面抽查近当代页；375px 视口抽查中国后期页首与正文，展开来源记录确认章节、状态和日期正常；六个修改页均测得 `scrollWidth === clientWidth`（内容区 360px，视口含滚动条）。未宣称全站视觉回归。
- `git diff --check` 通过。上述为发布前本地证据；发布结果见下方记录。

## 发布记录

- 用户要求先将已完善内容提交并上线；顾问未完成不阻断本轮已核验内容的发布。
- 发布前再次执行 `pnpm check && pnpm build`，全部通过。
- `origin/main` 无新增提交，本地另有 5 条待推送既有提交：`5864574`（合并 sites/main）、`11e56e3`（mind 结构与练习指导）、`8e5ea56`（section labels 左移）、`5eb09fc`（hero labels 左移）、`63f3c40`（桌面 hero labels 调整）；本次一并发布。
- 使用现有 Cloudflare Worker `killua-win` 和 `pnpm deploy:only`；按项目发布规则部署正式域名，不更改 Sites 托管配置或数据库。
- 内容提交 `e0a4af6` 已推送 `origin/main`；Worker Version ID：`86c3eda2-0823-40f9-bbfd-80e8e7d48609`。部署命令成功，未执行远程数据库迁移。
- 正式浏览器逐页检查学习入口、55 个哲学节点、地图、路径、旧兼容入口共 59 个学习路由；另检查 `/mind`。六个修改页均出现新增人物与学派正文。
- 批量访问期间 9 个路由首次未正常输出（其中 8 个明确出现 1102，1 个无正文标题）；Worker tail 在复查死亡页时确认 `outcome: exceededCpu`、`cpuTime: 10`、`wallTime: 12`、HTTP 503。随后逐一重试这 9 页全部恢复正常标题和正文。当前页面可访问，但 CPU 限制导致的间歇性风险未根治；没有修改资源限额、计费计划或缓存架构。
- 本次发布记录补记仅变更文档，运行代码与上述 Worker 版本一致。

## 顾问协作证据

- 显式调用技能构成授权；仅发送中文任务摘要，无附件、源码、日志或凭据；两项咨询问题。
- 独占新建标签页，三次空输入观察跨度至少五秒；无已有草稿、无附件。页面所选模型标签为 `6 Pro`。
- 输入为 927 码点／32 行；标记 `92bd779c69616478`；提交前正文、长度、标记、SHA-256 与输入框规范文本一致。
- SHA-256：`818da34317e1eac51233a578ab5811e11f2894499d01bf2e581a815c58be68bd`。只发送一次，用户消息标记只出现一次；没有补发。
- 会话名 `codx-哲学学习补充建议` 已在侧栏核对；会话链接只保留在本地协作上下文，不写入仓库。
- 完成等待上限约 15 分钟；截至本轮结束仍显示「停止回答」，只有检索过程与阶段性意见，没有最终答复或完成操作区。未冒充两次稳定最终读取，未补发或中断生成；保留会话以供后续回收。咨询状态为 `BLOCKED`，本地实现与验证完成，不是完整外部复审完成。
- 阶段性建议包括补既有关系背后的论证、复核维特根斯坦前后期和朱王争论。本地另行打开学术来源后完成这些修正；阶段性输出不是完整外部复审。

---

# 历史任务：/mind 页面复审与优化（2026-09-22）

状态：**已发布正式网站（2026-09-22）**。提交 `495d49d` → 推送 `origin/main` → `pnpm deploy:only`，
Worker Version ID `47fd656e-788b-4990-bda6-43ac3291ef28`（无数据库改动）。同一次部署顺带把 main 上两条
不属于本轮的学习页提交带上线：`9bf35af`（《心灵、身体与「我」》R1—R6 定点整改）与 `e651e45`（进阶区
「两块」措辞修正），它们此前已提交、已推送，但还没有部署过。

## 需求

对正式网站 `https://killua.win/mind` 做一次复审并落实优化：先按可访问性、交互语义、内容可被找到的程度、
客户端体积和死代码逐项检查线上页面，再把查出来的问题改掉。保留这一页的版面语言、分区编号与公开 URL。

## 验收

- 线上量到的对比度不达标项全部修掉：正文类文字 ≥ 4.5:1，本页复核为 0 处不达标。
- 主题切换对读屏软件可用：当前项可被识别、标签与面板互相指认、方向键可操作。
- 「自我复习」区名副其实：答案默认不直接显示。
- 卡片索引四张卡片的正文都在页面里，不再只存在于被点中的那一张。
- 本地 `pnpm check`（lint、typecheck、迁移回放、哲学不变式）与 `pnpm build` 通过；本页控制台无错误。

## 计划

1. 打开线上页面逐项量：对比度、无障碍语义、客户端 chunk、死 CSS、交互与内容是否匹配。
2. 按问题改代码，不做与本页无关的改动。
3. 本地复验（含 375px 宽度与键盘操作），再提交 → 推送 → 部署 → 线上逐项复验。

## 复审发现与处理

| # | 发现（改前的线上状态） | 处理 |
| --- | --- | --- |
| 1 | 28 处小号元信息用 `--rock-gray` 铺在深色面上，实测 3.11–3.47:1，字号 9–11px。2026-09-15 那轮无障碍审查只覆盖了哲学专区，这一页没跟上 | 本页统一改用既有的 `--meta-on-dark`，实测升到 5.31–5.72:1 |
| 2 | 五个主题按钮只靠 `is-active` 这个 class 表示选中：读屏软件读到五个一样的按钮，既不知道哪个是当前项，也不知道右边那块内容归谁；方向键不可用 | 改成 WAI-ARIA tab 模式：`tablist`／`tab`／`tabpanel`、`aria-selected`、`aria-controls`、roving tabindex、↑↓←→ 与 Home/End；选中样式改由 `aria-selected` 驱动，不再另挂 class |
| 3 | 04 区写着「先自己回答，再回看当时的结论」，而答案就印在问题下面，主动回忆没有发生的机会 | 答案折进原生 `<details>`（与文章页 AI 评注、健康页恢复表同一套做法），标题改为「先自己回答，再展开当时的结论」 |
| 4 | 05 区四张卡片里，三张的正文不在页面上——只有被点中的那张会渲染到右侧面板，页内查找、复制和抓取都读不到另外三条 | 四张卡片各自写全，改为服务端渲染的静态清单；卡片标题由 `<strong>` 升为 `<h3>`，本页有了真正的三级标题 |
| 5 | 两个搜索框：03 区搜 5 个主题、05 区搜 4 张卡片，搜索对象比控件本身还少；05 区还有一排分类筛选 | 两个搜索框与分类筛选一并去掉；主题与卡片都是一眼能看完的量 |
| 6 | 02、04、06 三区没有任何交互，却和交互层打包在同一个客户端组件里 | 拆开：页面只留「主题切换」一个客户端岛，其余回到服务端渲染 |
| 7 | `tone` 字段（lime/blue/warm/violet/soft）在全站深色化之后已经不起作用，四张卡片渲染出来完全一样；配套的浅色皮肤 CSS 连同 `.knowledge-card-green`、`.knowledge-card-neutral` 这两个从来不存在的类名一起留在样式表里 | 删掉 `tone` 字段与对应的死规则 |
| 8 | 首屏说「整理关于『我是什么样的人』的对话」，正文却整页用第二人称「你」，访客容易读成在说自己 | 首屏说明补一句：正文里的「你」是对话里 AI 对我的称呼 |
| 9 | 页内导航把 05 区叫「对话索引」，该区自己的标题是「Card index／提炼后的卡片」 | 导航项改为「卡片索引」 |
| 10 | `sitemap.ts` 里 `/mind` 的 `lastModified` 仍是 2026-09-06 | 改为 2026-09-22 |

## 本次改动

7 个文件。

- `app/mind/page.tsx`：改回服务端组件，02「核心地图」与 04「自我复习」直接在页面里渲染；复习答案改成 `<details>`；首屏说明补人称说明；页内导航「对话索引」→「卡片索引」。
- `app/mind/mind-explorer.tsx` → `app/mind/mind-topics.tsx`：只留 03 区的主题切换，按 tab 模式重写，删掉主题搜索与过滤（过滤还会让左侧序号跟着跳号，并且可能出现「详情显示的主题不在列表里」）。
- `app/mind/mind-explorer.module.css` → `app/mind/mind.module.css`：跟随改名，复习卡的局部样式改挂到 `details` 上。
- `app/knowledge/knowledge-library.tsx`：改为服务端组件，四张卡片全文直出，去掉搜索、分类筛选与右侧详情面板，`tone` 字段删除。
- `app/globals.css`：本页元信息换 `--meta-on-dark`；新增复习卡 `details`／`summary` 与卡片清单样式；删掉搜索框、分类筛选、详情面板、卡片浅色皮肤、`.mind-detail-*` 四个浅色变体、`.mind-empty`／`.knowledge-empty` 等随功能一起消失的规则。
- `app/sitemap.ts`：`/mind` 的 `lastModified` 更新。
- `docs/architecture.md`：`/mind` 一行补上「一个客户端岛」的事实，并记录本轮发布。

## 验证与证据

- 改前线上量化（脚本在页面上跑，按 WCAG 前景／背景合成计算）：28 处文字不达标，分布在 `.mind-card-index`、`.mind-subhead`、`.mind-detail-topline`、`.mind-topic-nav button span/em`、`.knowledge-card-topline`、`.knowledge-categories button span`、`.knowledge-index-heading .eyebrow`，最低 3.11:1。
- 改后本地同一脚本：不达标 0 处；上述元素分别为 5.51、5.72、5.72、5.31、5.31、5.51、5.51:1。
- 键盘与语义（本地实测）：5 个 tab／5 个 panel 一一对应，`aria-controls` 与 `aria-labelledby` 双向正确，任一时刻只有一个 `aria-selected="true"`、只有一个面板可见，tabindex 为 0/-1；↓ 切到下一项并跟随焦点、End 到末项、再 ↓ 回到首项。
- `<details>`：四张复习卡答案默认收起，展开后提示文案由「展开 ▾」变「收起 ▴」。
- 客户端 JS：`mind-explorer`（10,748 B）+ `knowledge-library`（6,615 B）两个 chunk 合计 17,363 B，改为单个 `mind-topics` chunk 7,528 B，少一个请求，约 −57%。
- 版面：1024px 下主题区 260px + 447px 两栏、卡片两栏各 375px；375px 下全部单栏，`scrollWidth` 375，无横向滚动；主题按钮高 67px。
- 工程检查：`pnpm check`（lint、typecheck、16 个迁移回放、哲学不变式 8 模块 18 条）与 `pnpm build` 均通过。控制台无错误。

## 线上复验（发布后在正式网站上跑）

- `/mind` 200，HTML 72,121 字节。对比度脚本在线上重跑：不达标 0 处。
- 服务端 HTML 里 `role="tab"` 5 个、`role="tabpanel"` 5 个、`aria-selected="true"` 恰好 1 个、
  `<details class="mind-review-details">` 4 个；旧的搜索框、分类筛选与详情面板标记 0 处。
- 四张卡片的正文（「满足一个欲望」「连续记录才能把偶然波动」「先让 AI 产出一个可讨论的版本」
  「列出选项、风险和权重」）逐条能在服务端 HTML 里抓到。
- 线上交互实测：↓ 切到「敏感与理性化」并跟随焦点、End 跳到「好奇心与保护因素」、点击切换与
  `aria-selected` 同步、复习卡展开后读到答案全文；控制台无错误。
- 客户端 chunk：`knowledge-library-*.js` 已不再请求，只剩 `mind-topics-Cz3e1o2f.js`。
- 标题层级：h1 → 5 个 h2 → 各区 h3，无跳级。
- 一并复验其它路由均 200：`/`、`/notes`、`/health`、`/learning`、`/learning/philosophy`、
  `/learning/philosophy/mind-self`、`/learning/philosophy/map`、`/sitemap.xml`、`/api/database`；
  `/sitemap.xml` 里 `/mind` 的 `lastmod` 已是 `2026-09-21T16:00:00.000Z`（即 +08:00 的 09-22）。

## 未做的项

- `--rock-gray` 铺深色面的同类问题在 `/notes`、`/health`、首页仍然存在（`.section-label`、`.note-time`、`.post-meta`、`.health-kpi dt` 等共约 30 处选择器）。本轮只改 `/mind` 用到的那几条，避免在一次针对单页的复审里改动其它页面的视觉；这条留作下一轮的站级项。
- 这一页仍然没有写明这些对话发生在什么时候。给档案页标注时间需要真实日期，不能由我编，等提供后再补。

## 补充调整（二）

- 所有编号标签（包括 `01`、`02`、`03` 等分区编号）在桌面端统一向左移动 `200px`，移动端保持原位。

---

# 上一轮：《心灵、身体与「我」》重建（2026-09-20）

状态：**已发布正式网站（2026-09-20）**。

改写与复审期间按本轮任务的要求没有自行发布；用户随后指示「提交 部署」，于是按 `AGENTS.md` 的口径
一次做完三件事：提交（`bf1ba3a` 代码与内容、`015aaf0` 记录）→ 推送 `origin/main` → `pnpm deploy:only`
（本轮无数据库改动）。Worker Version ID `724790f9-51bb-454a-bf0f-15f5eeab7d61`。

### 线上复验（发布后逐条请求）

- 58 条路由：失败 0；未解析行内标记 0；undefined/NaN 0；禁用例子 0；具体入口出现行话 0。
- `/learning/philosophy/mind-self`：读者正文 32412 字（发布前线上版约 27958 字）。任务点名的八条表述
  **全部从读者正文消失**，只余留在折叠的研究层里——审查记录与来源说明本来就要写明原文是什么。
- 标题序列与本地一致：先把问题拆开 → 三个单元 → 有力反对及回应 → 哲学家 → 案例推演 → 思想实验 →
  容易混淆的地方 → 进阶（折叠）→ 人物与原典 → 迁移练习 → 跨传统 → 历史 → 回到问题 → 带着问题继续读 → 继续学习。
- 汉译原典引文逐条在线上抓到：「色非是我」「若諸沙門……見有我者」「如牝虎銜子」「撥俗我為無」
  「恐撥無假我」「我謂主宰」「非自在故，不可名主」「非即蘊離蘊」「如和合众材」。
- 「展开读本页的概念卡」在线上生效；全站自指「展开读」复扫为 0。

## 需求

复审并重建 `/learning/philosophy/mind-self`：基础主线按零基础读者的理解顺序重组为三个学习单元，
技术内容移入重写过的进阶区，八条具体的概念与推理订正逐条落实，案例与推演重新设计，
中文资料实际检索并可核验，然后把同类问题在全站扫一遍。不修改无关专区，不破坏路由、锚点、内容标识。

## 本次改动

14 个文件。完整记录在
[app/learning/philosophy/MIND_SELF_REBUILD.md](../../app/learning/philosophy/MIND_SELF_REBUILD.md)
（当前状态确认、结构、八条订正、中文资料核对表、全站清查、工程检查、数据债、未完成项），
跨页结论另记于 [CONTENT_GAP_REVIEW.md](../../app/learning/philosophy/CONTENT_GAP_REVIEW.md) 的
「2026-09-20 轮」。

### 清单 A：页面覆盖（分母不缩）

| 范围 | 页数 | 本轮处理 |
| --- | --- | --- |
| 本轮重点页 | 1（mind-self） | 全页重建 |
| 全站同类问题清查 | 58 条路由全部扫过 | 命中并修复 8 页 11 处「展开读」自指；其余 7 类问题只命中 mind-self |
| 共享层（概念卡、渲染组件） | `concepts.ts`、`concept-card.tsx`、`prose.tsx`、`research-layer.tsx`、`guide-sections.tsx`、`node-content.tsx` | 各改一处，影响全部 55 个节点页 |
| 未改动的哲学页 | 其余 54 个节点页 | 按类别 grep 逐条判读后判定不改，依据记在 MIND_SELF_REBUILD.md 第四节 |
| 非哲学学习专区 | 0 | 按要求不动 |

### 清单 B：要求覆盖

| 任务要求 | 落在哪里 | 状态 |
| --- | --- | --- |
| 先确认当前状态，区分线上／仓库／本地 | MIND_SELF_REBUILD.md 第零节（10 条逐条判定） | 完成 |
| 基础主线改成三个学习单元并写明交接 | `mind-self-entry.tsx` | 完成 |
| 基础／进阶真正分开，进阶重写而非折叠隐藏 | 同上，进阶甲／乙 | 完成 |
| 八条概念与推理订正 | `data.json`、`study-guides.ts`、`thought-experiments.ts`、`concepts.ts`、`content-ledger.ts`、`argument-maps.ts` | 8/8 完成 |
| 案例与推演重新设计（保留失忆／承诺案例并后置） | `study-guides.ts` caseStudy、`thought-experiments.ts` | 完成 |
| 中文资料实际检索并可核验 | 来源账新增 MS-6～MS-14 共 12 条，全部本轮实际打开逐字比对 | 完成 |
| 自然中文重写 | 三个单元全文改写；译名陷阱就地说破（人格／随附／假名／数值同一） | 完成 |
| 全站同类问题清查并直接修复 | 8 类逐类 grep；命中即修，未改的写明依据 | 完成 |
| 复审—修复—复验闭环 | 两轮阅读复审，各自抓到的问题已修并重新取页复验 | 完成 |
| 工程检查真实执行 | lint / typecheck / test:migrations / test:philosophy / build / 58 路由扫描 / 锚点扫描 / 浏览器控制台 / 375px | 全部执行，结果见第五节 |
| 不提交不推送不部署 | —— | 遵守 |

### 逐文件

**新增**：`mind-self-entry.tsx`（手写教学主线）、`guide-sections.tsx`（精读层四段的共用 JSX）、
`MIND_SELF_REBUILD.md`。
**改名**：`being-change-entry.module.css` → `teaching-entry.module.css`（两页共用）。
**修改**：`node-content.tsx`（`handwritten` 描述取代写死的节点判断）、`prose.tsx`（接收 `LedgerProse`，
`currentNodeId` 下传）、`concept-card.tsx`（「展开读」不再指向本页）、`research-layer.tsx`（findings 的 key）、
`being-change-entry.tsx`（样式模块改名）、`data.json`、`study-guides.ts`、`thought-experiments.ts`、
`argument-maps.ts`、`concepts.ts`、`content-ledger.ts`、`KNOWLEDGE_BASE.md`、`CONTENT_GAP_REVIEW.md`。

---

# 历史任务：哲学学习专区教学重构（面向零基础读者）

状态：已发布正式网站（2026-09-19）。

## 需求

把 `/learning/philosophy` 从「知识资料与研究笔记的集合」改造成「初学者能循序渐进读下去的课程」。要求：先理解问题再认识概念再理解论证；后文需要的前提必须在前文或明确的前置里解释；保留专业术语与哲学深度但讲清楚；不改成人生感悟或只有结论的科普；不以增加知识点、篇幅或交互组件为目标。

另有一条贯穿全程的硬要求：**重点检索、阅读并对照高质量中文哲学资料**，消除英文直译造成的理解障碍；中文原典相关主题要对照原典与可靠中文注释，不绕经英文再译回来。

## 验收

- 全范围：清点全部哲学页面与内容源，不漏页；不修改与哲学无关的学习专区；保留现有路由与内容标识。
- 先重建全站学习顺序与前置依赖，再逐页改写。
- 每页：具体入口、术语在承担推理作用时解释、一次推进一个理解、展示观点怎样得到、例子参与解释、区块之间有过渡、总结帮助重建理解。
- 学术准确性与全站一致性逐项检查；不编造引文、页码、来源或核验结果。
- 完整自我复审（零基础阅读／哲学内容／跨页路径／工程渲染四个维度），修复后重新复审形成闭环。
- 本地 Type Check、Lint、Build、数据不变式通过；全部路由渲染正常、控制台无错误。

## 计划与执行

1. 清点：58 条路由（55 个节点 + `/map` + `/path`，另加 `/learning`）与全部内容源。
2. 六条中文资料检索线（形上学与心灵／知识论与语言逻辑／伦理政治美学／中国哲学原典／印度伊斯兰非洲／科学宗教死亡与 AI），要求实际打开页面读正文；主线另行亲自核对其中最吃重的六份来源。
3. 结构层：新增三个教学字段、重排区块顺序、前置理解从页尾移到页首、导航页补导语与建议阅读顺序、推荐路线加一步并新增支线层。
4. 内容层：八条并行改写线按文件独占分工。
5. 复审：四条零基础复审线覆盖全部 58 条路由 + 一份机器辅助扫描。
6. 修复：四条修复线按文件独占分工；跨文件与组件层由主线处理。
7. 修复后重新复审、全量工程检查。

## 本次改动

21 个文件。结构改动、内容改写、译名统一、复审修复四部分，详见
[app/learning/philosophy/TEACHING_REBUILD.md](../../app/learning/philosophy/TEACHING_REBUILD.md)（本轮的完整记录：中文资料对照、结构改动、逐页清单、自我复审、未完成事项），跨页结论另记于
[CONTENT_GAP_REVIEW.md](../../app/learning/philosophy/CONTENT_GAP_REVIEW.md) 的「2026-09-19 教学重构轮」。

**结构层**（`content-ledger.ts` 类型、`tree.ts`、`node-content.tsx`、`concept-card.tsx`、`comparison.tsx`、`pager.ts`、`relations.ts`、`learning-path.ts`、`coverage.ts`、`map-view.tsx`、两个 `page.tsx`、`globals.css`）：

- 新增三个教学字段：`entry`（具体入口，41 页）、`assumed`（本页默认你已经知道的，28 页）、`takeaway`（回到问题四问，41 页）。
- 区块顺序：概念解释由「定义与边界」之后提到之前。原顺序下，自由页第二块同时用到六个术语，而它们的解释要再往下翻一屏。
- 前置理解从页尾「继续学习」移到页首「读这一页之前」。
- 14 个导航页新增 `guidance`（读者导语 + 建议阅读顺序 + 每条「为什么排在这里」）；展示顺序统一走 `orderedChildren()`，覆盖目录页、条目页、学习首页、知识地图与分页器。
- 知识域顺序改为「逻辑 → 知识来源 → 语言」，美学域改为「解释 → 艺术 → 审美判断」（后者原本与关系层早已声明的两条前置边相反），伦理域与边界域同步重排。
- 推荐路线 10 步 → 11 步（补入「何种权力与制度是正当的」），并新增支线层：主线之外的 12 个核心问题按「你关心什么」分五组，每条写明它默认你已经有哪个区分、在主线第几步给出。
- 修掉四个既有渲染缺陷：《存在与变化》吞掉具体入口；行内概念注解的「展开读」指向不渲染该卡的页面（5 条概念）；概念卡把当前页列进「也在这些条目里被讨论」（25 条自指链接）；有思想实验的 7 页吞掉自己的案例推演，而实验开场白又写着它建立在那次案例上。
- 新增 4 条构建期不变式（`pnpm test:philosophy` 由 6 模块 13 条增为 7 模块 17 条）。

**内容层**：41 份来源账、23 份精读层、8 张论证地图、7 个思想实验、8 组跨传统比较、21 条共享概念、104 条关系、55 个节点的立场与摘要，全部过了一遍。

**译名统一**（依据见 TEACHING_REBUILD 第一节）：认知正当性→认知证成、内部主义／外部主义→内在论／外在论、认识不公→认知不正义、解释不公→解释不正义、证言不公→证言不正义、最佳解释推断→最佳解释推理、工具中立论→技术工具论、责任缺口→责任鸿沟、照护伦理→关怀伦理、公民抗命→公民不服从（立场名与论证路径索引键同步）、物种主义→物种歧视、耐存论／延存论→持续论／接续论、法兰克福型案例→法兰克福式案例、莱布尼茨律→莱布尼茨定律、认知条件→认识条件。先秦的「法」此前在两处来源账与跨传统比较里写作拉丁转写 `fa`，已改回汉字。

## 验证与证据

- `pnpm typecheck`、`pnpm lint`、`pnpm build`：均通过。
- `node scripts/check-philosophy-invariants.mjs`：7 个模块 17 条不变式全部通过。
- `node scripts/replay-migrations.mjs`：通过；本轮未触碰 D1 与 `migrations/`。
- 逐条请求本地 58 条路由：0 条失败。可见文本扫描：无未解析的 `[[` 标记、无 `undefined`／`NaN`、41 个条目页的具体入口里无哲学行话。
- 全 58 条路由的锚点检查：页内目录死锚点 0、任意站内锚点死链 0、概念卡自指链接 0（本轮修掉 25 条）。
- 浏览器复核 `/responsibility`、`/path`、`/map`：控制台无错误；页内目录顺序与正文区块顺序一致；「读这一页之前」「具体入口」「案例推演」「思想实验」「回到问题」五块均正常渲染；点「回到问题」目录项后落点为 132px，等于该 id 的 `scroll-margin-top`。
- 375px 复核 `/freedom`、`/responsibility`、`/knowledge`、`/path`、`/legalism`、`/mind-self`：无横向溢出；「回到问题」四问在窄屏折成单列；跨传统比较的待核验清单已折叠。
- **来源账未被非授权触碰**：脚本把本轮全部译名替换先抵消，再比对来源字段。URL 集合与核验状态计数与 HEAD 完全一致，没有任何 `pending` 被改成 `verified`，没有新增来源、引文、页码或章节号。唯一改动过的是一批点名授权的译名替换（逐条列在 TEACHING_REBUILD 第 4.4 节）。
- 译名残留扫描：旧译名在读者正文里只剩 10 处，逐条核对全部是有意保留的「也译作／旧译」说明。

### 发布与正式网站复验

- 本轮无新增迁移，未触碰 D1 与 `migrations/`，因此按 `pnpm build` + `pnpm deploy:only` 发布，未执行 `pnpm migrate`、未连接远程数据库。发布时工作树只有本任务的改动，无夹带。
- 两次提交、两次发布：
  - `8f30bc3` 教学重构主体 —— Worker Version ID `af3f8505-1431-4715-aa4b-be2e9ed72d78`，上传 10 个新增／变更静态资源，Worker 启动 15ms。
  - `c997276` 线上复验抓到的一处修复 —— Worker Version ID `9fe2c73f-0563-4830-a386-6dffb45f8792`。
- **线上复验抓到一处本地扫描漏掉的问题并已修复**：`/learning/philosophy/knowledge-sources` 的研究层里出现了未解析的 `[[epistemic-justification|认知证成]]`。原因是一条 `review.findings` 为说明改动照抄了原句，而原句带着行内概念标记——研究层按纯文本渲染，标记被原样印出。本地那一轮扫描只看折叠的研究层之前的正文，这一块恰好在折叠层里。已改写该条记录，并加一条构建期校验：`scope` / `entry` / `assumed` / `takeaway` / `review` 这些按纯文本渲染的字段里不得出现 `[[…|…]]`。数据不变式由 7 模块 17 条增为 **8 模块 18 条**。
- 修复后重新发布并复验：逐条请求 `https://www.killua.win` 上的 58 条路由，**0 条失败、0 处问题**——无未解析标记、无 `undefined`／`NaN`、无死锚点、无概念卡自指。渲染计数与本地一致：具体入口 41、回到问题 41、读这一页之前 33、案例推演 23。
- 正式网站译名扫描：旧译名在读者正文里出现 17 处，逐条核对**全部**是「也译作／旧译／港台多写作」这类有意保留的异译说明。
- 浏览器复核正式网站 `/learning/philosophy/daoism`：具体入口与「回到问题」正常渲染，页内目录无死锚点，分页器语境标签正确，控制台无错误；「无为」一段的三层改写（正面三要点 → 《老子》二章与三十七章的用例 → `non-action` 回译的来路）已在线上生效。
- **顺带修正两处文档与事实不符**：`docs/architecture.md` 的「最近一次正式网站发布」停在 2026-09-11，漏记了 09-13 与 09-15 两轮（那两轮把版本号只写进了 `current-task.md`）。已补齐发布链并更新到本轮。另按用户在本轮明确的口径，把「发布＝提交 + 推送 `origin/main` + 部署 Worker」写进 `AGENTS.md` 的长期规则。这两份文档不参与站点构建，因此没有为它们再发一次 Worker。

## 未完成事项（本轮明确不做或受阻，非待办给用户）

- **来源核验本轮完全不做**：没有把任何 `pending` 改成 `verified`，没有打开外部页面核对既有来源的定位。上一轮的存疑点原样留着。
- **没有真实用户测试，也没有独立专家审校**。本轮所有复审都是自审；各条目 `review.mode` 仍为「自审（尚未独立复审）」。
- **本轮 WebSearch 配额（200 次）在中文资料检索阶段用尽**，后续核查只能直接打开已知 URL。TEACHING_REBUILD 第 1.7 节里若干「未能核实」是这个限制的直接结果。
- 其余已知遗留（不渲染的 `example`／`figures`、来源编号当主语、`/core` 与总览各缺一半、`pt-being-change` 研究层四段不渲染、`pt-legalism` 缺 `question`、`personhood-community` 概念卡无处渲染、约 148 句超长句）逐条列在 TEACHING_REBUILD 第 5.5 节。

---

# 历史任务：哲学学习内容全范围复审（重复与表达清晰度）

状态：已发布正式网站（2026-09-15）。

## 需求

对 `/learning/philosophy` 全部内容做一次全范围复审，重点修两类问题：**重复的内容**与**表达不清晰**。不新增节点、不改视觉、不扩充篇数、不做来源核验。修完直接提交并发布正式网站，不留待办给用户。

## 验收

- 同一页里被说两遍以上的定义、反对、判断收敛到该出现的那一层。
- 跨条目复制的模板句、段内自我复述、同义词回环清掉。
- 术语在被用于推理前有界定；指代明确；长句拆开；标签与内容相符；生硬中文改掉。
- 术语译名与标点风格在库内统一。
- 来源账（`url` / `locator` / `checked` / `checkedOn` / `supports`）一字不改，不把 `pending` 改成 `verified`。
- 本地 Type Check、Lint、Build、数据不变式通过；57 条哲学路由全部渲染正常、控制台无错误。
- 上一轮明确写为「留待专门处理」的尾巴一并处理掉。

## 计划与执行

1. 先做机器扫描定位可查的重复（全库句子级重复、同节点跨层近重复），得到线索清单。
2. 写一份共用的复审标准（判定口径 + 红线 + 记录格式），10 条并行审查线按文件独占分工，各线只写自己的文件、可读全库。
3. 主线逐条复核各线上报，处理跨文件重复、译名统一、标点归一、立场改名这类必须跨文件同步的部分。
4. 本地检查 + 逐条请求全部路由 + 浏览器复核，再提交发布。

## 本次改动

21 个文件。并行 10 条线共约 600 处内容改写，主线另做跨文件收敛、译名统一、标点归一与三处立场改名；`content-ledger.ts` / `remaining-content-ledgers.ts` 的 41 个条目各追加一条 `2026-09-15 复审` 记录。

分线（按文件独占）：

- `data.json` 108 处。最大一处是全库级的：`node-content.tsx` 已经在 `response` 前渲染「回应」标签，而 61 条回应正文又都以「回应是……」开头，立场卡实际读作「回应 ‖ 回应是……」。
- `content-ledger.ts` 84 处、`remaining-content-ledgers.ts` 106 处。研究层与精读层重复的定义归精读层，研究层留边界与理由；`review.findings` / `adjacentImpact` 里对读者直呼 `data.json`、`historicalContext`、`locator` 等字段名的 62 处改成读者语言。
- `study-guides.ts` 56 处、`remaining-study-guides.ts` 85 处。页内概念卡与共享概念层、与论证路径、与 `philosopherViews` 之间的三类重复。
- `argument-maps.ts` 47 处（含两处标签名实不符、一处指向页面上不存在的步骤编号、一处主干跳步）。
- `thought-experiments.ts` + `comparisons.ts` 67 处。
- `concepts.ts` + `relations.ts` 52 处。
- `being-change-entry.tsx` 31 处（长文的节首复述、与论证图重复的骨架、四处「路」的比喻、三处指错节）。
- 页面与组件文案 44 处（总览／地图／路径三页互相复述、区块导语分工、`learning-path.ts` 相邻步骤对写同一句）。

主线跨文件部分：

- **`ledger.scope` 每页渲染两次**：正文顶部「本页范围」与研究层「本条状态」下各一份，41 个条目页各印两遍。删研究层那份，并给《存在与变化》的手写分支补上「本页范围」（它走提前 return，原本看不到顶部那行）。
- **`[[concept-id|显示文本]]` 在「容易混淆的地方」一栏原样印给读者**：`node-content.tsx` 的 `confusions` 没有过行内概念解析器，pt-interpretation 与 pt-islamic-reason-revelation 两页把标记本身显示了出来。改为与其它正文一样走 `renderProse`。这是既有缺陷，不是本轮引入。
- **三个把两条路线压成一个名字的立场名改名**（上一轮写明留待专门处理）：`修身与解脱` → `修养取向`、`德性与照护取向` → `德性取向`、`公民抗命与修复性视角` → `公民抗命`。三处的「代价」一栏原话都是「这个立场名把两条路并置了」「立场名里的这半边目前是空的」。`data.json` 的立场名与 `positionArguments` 的索引键同步改，缺口改写成各自的边界说明，并给照护与修复两支指向真正展开它们的页。
- **译名统一**：证词→证言（15）、诠释不公→解释不公（3）、诠释学→解释学（1）、内在论／外在论→内部主义／外部主义（6）、中立性论题→工具中立论（3）。
- **标点统一**：哲学目录内 `「」` 与 `“”` 两套引号混用（1978 : 1335），而同一个节点页会同时渲染两种风格。按「只转换括住中文的那一对」归一 1278 处，英文条目标题里的 `“Identity: ‘Strict’ and ‘Loose’”` 保持原样；页面上只剩 88 处英文引号。
- **`coverage.ts` 的 23／18／55**：数字核对无误但写死，加节点就会静默失真，改成从节点树实时数。
- **`concepts.ts` 的 `personal-autonomy`**：声明了四个母页，却没有任何页面引用它，卡片从不渲染。挂到 `pt-good-life`（该页「自主与真实」这条论证一直靠它承重）。
- **`app/learning/page.tsx`**（学习空间首页）：核心问题数在同一页出现三次、「每个问题可单独读完」说了两遍、「这条循环对每门科目都一样／换成别的科目也是同一套动作」同句自我复述。

## 验证与证据

- `pnpm typecheck`、`pnpm lint`、`pnpm build`：均通过。
- `node scripts/check-philosophy-invariants.mjs`：6 个模块 13 条不变式全部通过（含立场改名后 `positionArguments` 键名与立场名仍然一致）。
- `node scripts/replay-migrations.mjs`：通过；本轮未触碰 D1 与 `migrations/`。
- 逐条请求本地 58 条路由（57 条哲学路由 + `/learning`）：0 条失败。剥掉 RSC 载荷后按可见文本扫描：无未解析的 `[[` 标记、无重复的「本页范围」、无 `undefined`／`NaN`、无残留的中文弯引号、无旧立场名（`/good-life` 上那一处是审查记录里「当时叫……现名……」的说明，故意保留）。
- 浏览器复核 `/learning/philosophy/freedom`：渲染正常，研究层「本条状态」已不再重复本页范围，控制台无错误；`/learning/philosophy/interpretation` 的「相对主义」已渲染成可展开的概念注解。
- 机器复查重复：同节点跨层近重复候选由 32 对降到 16 对，剩下的全部是审查记录为说明改动而引述原句、或来源定位与核验说明本就同文，不属于读者可见的重复。
- **来源账未被触碰**：脚本逐条比对 `url` / `checked` / `checkedOn` 字段，7 个文件共 516 处与 HEAD 完全一致；本轮没有把任何 `pending` 改成 `verified`，没有新增来源、引文、页码或章节号。
- 结构比对：41 个台账条目中，正文段落数只有 `pt-islamic-later` 减少 1 段（易混第二条被反对第三条完整包含，删除后信息量未减），其余全部不变。
- 发布：本轮无新增迁移，未触碰 D1，按 `pnpm build` + `pnpm deploy:only` 发布，未执行 `pnpm migrate`、未连接远程数据库。发布时工作树只有本任务的改动，无夹带。Worker Version ID `43e4d315-6f83-455c-9a40-8f2837838a78`，上传 8 个新增／变更静态资源，Worker 启动 32ms。
- 正式网站复验：逐条请求 `https://www.killua.win` 上的 58 条路由，0 条失败；可见文本扫描无未解析标记、无重复「本页范围」、无残留中文弯引号、无旧立场名。浏览器复核 `/learning/philosophy/law`：立场名已是「公民抗命」，「本页范围」只出现一次，控制台无错误。（首轮扫描时 `/environment-animals` 命中一次弯引号，随后带无缓存头与随机查询串复请求均为 0，判定为发布瞬间命中的旧 isolate，非内容问题。）

## 未完成事项（本轮明确不做，非待办给用户）

- **来源核验**：本轮完全不做。上一轮记下的存疑点（各原典篇幅估计、七处定位是否覆盖相应论断、`pt-history-tech` 受福柯影响那一段的来源缺口等）仍在，需要开外部页面逐条核对，属另一类工作。
- 各线新报的存疑点（`comparisons` 第 1 组康德「自由与道德法则互为条件」无来源支撑、`pt-legalism` 「非人格标准更少出错」是否由 LEGZ-1 §2.3 支持、`pt-science-reality` 的波普尔卡无 `sourceIds`、`pt-right-action` 称阿奎那为双重效应「这条线索的源头」是否准确）都属来源与哲学判断问题，未据此改动内容。
- `pt-nyaya` 的 `figures` 用拉丁转写人名（Gautama、Vātsyāyana、Udayana、Gaṅgeśa），全库其余人名用中文。补中文译名等于替本库选定一套转写方案，需要来源支持，未做。
- `pt-legalism` 是唯一没有 `question` 字段的传统线索节点；补它要写新内容，不在本轮范围。
- `concepts.ts` 的 `self-cultivation`（pt-confucian）、`pratityasamutpada` / `personal-identity`（pt-buddhist）挂在没有精读层的页上，概念卡在那些页不渲染——概念卡只从 `guide.conceptRefs` 出。要让它们露面得先给那些页建精读层，属加内容。
- `pt-being-change` 的研究层四段（问题起点／定义与边界／有力反对及回应／易混）在该页不渲染（手写主线覆盖），本轮对它们的修订读者看不到；该条 `review.remaining` 已写明这一点。

---


# 历史任务：哲学学习空间内容整改（定义、标签、答非所问、术语与中文）

状态：已发布正式网站（2026-09-13）。

## 需求

整改 `/learning/philosophy` 及其全部子页面的内容：文章正文、论证地图、概念说明、思想实验和知识关系文案。不增加功能、不重做视觉、不扩充文章数量。保留专业性，把内容讲清楚，并保证概念、论证与中文表达准确。先修《存在与变化》的五项具体问题，再按同一标准逐页处理其余页面。

## 验收

- 《存在与变化》：数值同一性统一为定义式表述；构成论那段不再标成对上述质疑的直接回应；论证图里名不副实的「反例」改正；「真正做工的是」「接管历史」等生硬中文改掉；四维主义及其回应补齐解释过程。
- 其余页面按同一标准逐页审查并直接修订，已合格的保留。
- 从真实内容源列出全部页面，不沿用旧的页面数量。
- 本地 Type Check、Lint、Build 通过；全部路由渲染正常、控制台无错误；数据不变式通过。
- 涉及实质性哲学纠错时核对可靠来源；不编造原话、页码、理论归属或核验记录。

## 页面清单（从 data.json 与路由文件枚举）

**57 条路由** = 55 个节点（总览住在 `/learning/philosophy` 本身）+ `/learning/philosophy/map` + `/learning/philosophy/path`。
节点分布：总览 1、目录分组 2、问题域 6、核心问题 23、传统导航 5、历史时段 8、传统线索 9、方法论争论 1。

## 计划与执行

1. 先完成《存在与变化》五项定点整改（主线手工）。
2. 其余内容按文件划分为 8 条并行审查线，各线独占文件、互不写同一个文件，共用一份整改标准。
3. 主线逐条复核各线上报的结构性改动与存疑点，误报不执行。
4. 本地 typecheck / lint / build / 不变式脚本 / 全路由渲染验证。

## 本次改动

17 个文件（含两份文档），约 486 处内容修订，另追加 40 条审查记录。

按路由计（共 57 条）：**已审查并修改 47 条**（45 个节点页 + `/map` + `/path`）；**已审查、本轮判定无需修改 10 条**——全部是目录分组、问题域与传统导航这类没有立场、没有研究层、也没有精读层的导航节点（`pt-core`、`pt-traditions`、`pt-ethics`、`pt-aesthetics`、`pt-boundaries`、`pt-western`、`pt-chinese`、`pt-indian`、`pt-islamic`、`pt-african`）。

分层：

- `being-change-entry.tsx`：《存在与变化》正文 40 余处（见下）。
- `data.json`：61 处，覆盖 55 个节点中的 32 个；`objectionKind` 新增 12 条「适用限制」、撤销 1 条误标。未动任何立场 `name`（它是论证路径的索引键）。
- `content-ledger.ts` / `remaining-content-ledgers.ts`：研究层 41 条全部过一遍，正文修订 117 处，`review.findings` 追加 40 条。
- `study-guides.ts` / `remaining-study-guides.ts`：精读层 23 条全部过一遍，约 100 处。
- `argument-maps.ts`：8 张图中 7 张有改动，40 处；`thought-experiments.ts`：7 个中 6 个有改动，19 处。
- `concepts.ts`（29 处）/ `comparisons.ts`（33 处）：跨条目复用层。
- `relations.ts`（18 处）、`learning-path.ts`、`page.tsx`、`map/page.tsx`、`node-content.tsx`。
- `argument-map.tsx`：`objection` / `response` 新增可选 `label`，默认仍是「反对」「回应」。硬编码的「回应」曾把一条不回答该反对的论证呈现成已经答掉了它。

四类问题与代表性改例见 [app/learning/philosophy/CONTENT_GAP_REVIEW.md](../../app/learning/philosophy/CONTENT_GAP_REVIEW.md) 的「2026-09-13 内容整改轮」。

## 验证与证据

- `pnpm typecheck`、`pnpm lint`、`pnpm build`：均通过。
- `node scripts/check-philosophy-invariants.mjs`：6 个模块 13 条不变式全部通过（含 `positionArguments` 键名与立场名一致、关系边方向、prerequisite 无环、来源编号不冲突）。
- 逐条请求 57 条路由：0 条失败；浏览器控制台无错误。
- 实读核对：《存在与变化》全文、`pt-freedom` 重构后的论证主干、`pt-law` 与 `pt-knowledge-sources` 的新标签渲染。
- 未触碰 D1 与迁移文件。本轮无新增迁移，因此按 `pnpm build` + `pnpm deploy:only` 发布，未执行 `pnpm migrate`、未连接远程数据库。
- 发布记录：Worker Version ID `18d5d178-3f3e-4978-9978-ff8cabfc1ff7`，上传 8 个新增／变更静态资源，Worker 启动 23ms。`deploy:only` 从当前工作树构建；本次发布时工作树里只有本任务的哲学内容改动与两份文档，没有夹带其他未提交改动。
- 正式网站复验：逐条请求 `https://www.killua.win` 上的 57 条哲学路由，0 条失败；抽查确认《存在与变化》五项整改、`pt-law` 与 `pt-knowledge-sources` 的新标签、`pt-freedom` 改标为「前提」的传递规则、跨页复用的认知正当性新定义、`objectionKind`「适用限制」渲染、关系层改型后的逻辑→语言说明，以及被删除的那条伪造边，均与本地一致。
- 一处需要说明：`pt-indian-vedanta` 修正的来源标签（限定不二论 Viśiṣṭādvaita）位于 `data.json` 的 `sources`，而该字段只在节点没有研究层时才渲染（`node-content.tsx:654`）。该节点有研究层，所以这条修正不出现在页面上，属数据层修正而非读者可见改动。

## 未完成事项

- 本轮无网络核验：没有把任何 `pending` 改成 `verified`，没有改动任何 `checked` / `checkedOn` / `url` / `locator`。
- 需开外部页面才能确认的存疑点（不据此改来源账）：各原典篇幅估计；「责任缺口」的首创归属（SEP 写 esp. Sparrow 2007，另有文献归给 2004 年一篇论文，正文已改为不下首创断言）；荀子「道非天之道」一句的校勘定位（已从引文降为转述）；紧缩论不在 LAN-2 已核定位内（已移除该词）；`LAW-1 §4`、`ART-1 §4.2`、`ISL2-2 §6`、`LEGZ-1 §4.2`、`JUS-2`、`AES-2 §2.2`、`ISR-3 §7.3` 七处定位是否覆盖相应论断；本轮补写的若干教科书式术语解释虽落在既有定位内，但未逐句回查。
- `pt-history-tech` 受福柯影响的一段，TEC-1 那一节只到温纳与哈拉维；已就地标为解释性重构并写明来源缺口，待补来源。
- 三个把两条路线压成一个名字的立场名（`pt-law`「公民抗命与修复性视角」、`pt-right-action`「德性与照护取向」、`pt-good-life`「修身与解脱」）本轮只在正文写明缺口；改名会动 `data.json` 的立场名并影响按名索引的论证路径。
- 「证言／证词」两套译名并存（前者 54 处、后者 6 处），本轮未统一。
- `coverage.ts` 的 23／18／55 三个数字本轮核对无误，但它们是写死的，不随 `data.json` 变化。

---


# 历史任务：/mind 页面去掉重复内容

状态：本地已完成，未发布正式网站（2026-09-13）。

## 需求

`https://www.killua.win/mind#mind-library` 有重复内容，需要合理调整：同一场对话的结论在同一页里被复述多次。

## 验收

- `#mind-library` 不再收录与本页「主题线索」「自我复习」同源、同话的卡片。
- 分类筛选里不留计数为 0、永远筛不出内容的按钮。
- 本地 Type Check、Lint、Build 通过；本地页面渲染正常、控制台无错误、页内锚点仍能跳转。

## 计划

1. 先核对页面上同一批结论出现了几次，分别在哪一区。
2. 卡片索引只保留其它对话的卡片，并在分区导语里写明这一层的边界。
3. 本地检查与页面复核；是否发布正式网站由用户决定。

## 本次改动

- `app/knowledge/knowledge-library.tsx`：删掉「心理认知」4 张卡片（`emotion`、`control`、`meaning`、`curiosity`）。它们的 takeaway 与 03 区各主题的 practice、04 区自我复习的答案几乎逐字相同，来源又都写着同一场「人格结构分析」对话，等于同一批结论在一页里出现第三遍；卡片列表里还连着 4 行一模一样的来源文字。
- `app/knowledge/knowledge-library.tsx`：分区标题改为「把其它对话里的好东西，放进一个可以回来找的地方。」，并新增一句导语，说明心理认知那场对话在本页哪两区展开（带 `#mind-workspace`、`#mind-review` 锚点）。
- `app/knowledge/knowledge-library.tsx`：分类列表改为从卡片数据生成，删掉某一类卡片后不会留下计数为 0 的筛选按钮；同时删掉只为 `emotion` 一张卡片写的两处硬编码高亮 JSX。
- `app/mind/mind-explorer.tsx`：02 区 MEANING 卡正文原本与 04 区结尾「你已经很擅长得到想要的东西……得到以后呢？」是同一句话，改写成该区自己的判断。
- `app/globals.css`：新增 `.knowledge-index-intro`（正文色、深色面配色与行内链接样式）。

## 验证与证据

- `pnpm typecheck`、`pnpm lint`、`pnpm build`：均通过。
- 本地 `http://localhost:3000/mind#mind-library`：卡片索引剩 4 张（哲学与生活 1、健康与身体 1、工作与 AI 2），筛选为「全部 4」，没有空分类；导语链接跳转后 `#mind-workspace` 的落点为 132px，等于该 id 的 `scroll-margin-top`；控制台无错误；375px 宽度下导语、搜索框与筛选按钮换行正常。
- 未触碰 D1 与迁移文件；未执行 `pnpm deploy:only`，正式网站仍是改动前的版本。

---


# 历史任务：《存在与变化》面向初学者的教学性重写

状态：已发布正式网站（2026-09-13）。只改这一篇及它页面上的论证图，未批量套用。

## 本次改动

**补上缺失的发动机。** 原文第二节写「反过来，同一个对象也可以有不同性质：去年是红色，今天补漆成黑色」，当作理所当然；到了「对象怎样跨时间存在」一节，又说「它如何既有不同性质，又仍是一个对象」是最深的难题。同一件事前面说没问题、后面说是大问题，中间那一步从未出现——缺的是莱布尼茨律。新增一段引入「同一者不可分辨」，把变化难题立成一道明确欠着的账，第六节开头再还它。

依据 BEC-1 §2.3，本轮实际打开 SEP《Identity Over Time》核对：该节标题即「Leibniz's Law and the Possibility of Change: The Problem of Temporary Intrinsics」；莱布尼茨律指「同一者不可分辨」，方向相反的「不可分辨者同一」争议更大；§2.2 另写明同一性的对称性与传递性均可由莱布尼茨律推出，这条把第二节与第四节的传递性论证接上了。

**术语教学。** 质料／形式／实体原本只有半句带过（「实体」全文 5 次从未解释），现按 BEC-7 §6、§8 展开，并点破它与中文日常语感几乎相反；无限制融合／Y 形分叉对象／真部分原本三个未解释术语叠在一句话里，已拆成三段；传递性与对称性写出定义并演示矛盾如何推出；暂时内在性质、潜能与实现、实际契机、中观、自性、分叉与「不对称」均在首次使用处解释。

**顺序修正。** 耐存论／延存论原本在龙树卡片里先于第六节出现，已改为描述性前指；四个持续理论术语现全部首现于第六节之后。

**论证图（同页渲染）改 7 处**：等价关系补齐三条性质、莱布尼茨律、构成论的「构成不等于同一」、模态属性、ens successivum（译出「相继之物」）、无限制融合、真部分。

**其他**：新增第二节锚点 `#being-distinction` 并进目录；重写若干生硬中文；关键位置把「综述文献」改为点名「斯坦福哲学百科」。

## 验证与证据

- `pnpm check`（lint + typecheck + 迁移回放 + 哲学不变式）与 `pnpm build` 通过。
- 脚本逐项核对 22 个术语的首次出现上下文，全部在首现处即有解释。
- 375px 无横向溢出；目录 8 个锚点全部有对应元素、无死链；39 个来源角标全部解析成功，无「待核验」占位；控制台 error 为 0。

## 正式网站发布记录

- 用户明确要求发布。
- `pnpm deploy:only` 发布 Worker Version ID：`e5d5f5b7-dae3-4129-bd93-87053d14fb01`（上传 11 个资源，Worker 启动 20ms）。无 D1 迁移。
- 线上核对：`/`、`/learning`、`/learning/philosophy`、`/being-change`、`/logic`、`/freedom`、`/notes` 均 200；莱布尼茨律段、实体解释、真部分与无限制融合解释、ens successivum 译名均已在线；耐存论／延存论／时间部分确认首现于第六节之后；8 个锚点齐全。

## 需要注意：本次发布连带上线了 /mind 的未提交改动

`pnpm deploy:only` 从当前工作树构建，没有办法只发布其中一部分。发布时工作树里还有 `app/mind/mind-explorer.tsx` 的未提交改动（「/mind 页面去掉重复内容」那条任务），于是它也一并上线了——线上 `/mind` 现在显示「全部 4」，即那条任务所描述的改动后状态。那条任务的记录里写着「未执行 `pnpm deploy:only`，正式网站仍是改动前的版本」，该说法自本次发布起不再成立。

发布前应当先确认工作树里有没有别人未打算上线的改动，这一步本轮漏了。若要撤回，须回滚整个 Worker 版本（会同时撤回本篇重写），或先提交／暂存 `/mind` 的改动后重新发布。

## 尚待处理

- 只改了这一篇。其他条目的同类问题（例如别处也用「实体」而不解释）本轮未动。
- 本篇仍标「自审（尚未独立复审）」。

---

# 待续任务：学习空间内容纠错与体验收敛

状态：已发布正式网站（2026-09-12）。P0 全部完成；P1 完成 4 项，搜索一项未做（见「尚待处理」）。

## 需求

按《Learning 学习空间：内容纠错与体验收敛整改提示词》定点整改，不做全面升级：修正内容错误、关系方向、页面模板与导航。先核对最新源码和浏览器页面，逐项区分仍存在／已解决／无法复现／需资料核验；已解决的只验收，不重复改造。保留现有视觉、有效内容与公开 URL。

## 本次改动

### P0 逻辑页知识错误

- `study-guides.ts`｜pt-logic 概念「健全性」：删去「从假前提出发的有效论证毫无用处」，改为说明「不健全」的确切代价，并新增概念「反证法（间接证明）」。依据 LOG-7（IEP：Reductio ad Absurdum §1–§3）。
- `study-guides.ts`｜pt-logic 案例推演第 3、4 问：原文把「相关≠因果」扩成「只有干预能研究因果」。改为分界在「有没有可辩护、可被反驳的因果假设」，并补上实验自身的代价（依从性、失访、外推）。依据 LOG-8（Pearl, An Introduction to Causal Inference, §2–§4）。
- `content-ledger.ts`｜pt-logic 新增 LOG-7、LOG-8 与一条 confusions，并在 review.findings 补记三条本轮修订。

### P0 关系方向

- `relations.ts`｜`RelationLabel` 增加 `shortOutbound` / `shortInbound`，新增 `relationFacing(kind, reversed)`；地图删掉按 kind 索引、不看方向的短标签表。
- 新增构建期校验：`assertDirectionSemantics`（非对称关系正反必须不同措辞）、`assertNoPrerequisiteCycle`、`assertNoDuplicatePairs`、链条步进不得与 prerequisite 边相反。
- 数据修正 9 处：对称关系里的方向性指代（pt-good-life → pt-african-personhood 的「那一页」）；两条 kind 选错（pt-aesthetic-value → pt-african-method 改 distinction；pt-care → pt-freedom 改为 pt-freedom → pt-care 的 objection）；pt-science-reality → pt-justice 由 case-domain 改 objection；四条 objection 的 why 点名提出反对的是哪一路，不再把多立场页面当成一个论点；`chain-evidence-to-accountability` 把责任移到 AI 之前。

### P1 来源汇总

- 新增 `page-sources.ts`：按 URL 归并整页来源（条目正文、论证地图、跨传统比较、思想实验、概念卡），逐处保留各自的定位、支持论断与核验状态。附构建期校验：同页同一编号不得指向两份材料。
- `research-layer.tsx` 改用整页登记：计数与「来源与核验记录」清单都覆盖全页。
- `comparison.tsx` 的角标池改为 `[...ledgerSources, ...item.sources]`，比较栏可直接复用条目已登记的编号。

### P1 模板按内容类型

- `PhilosophyPosition` 新增 `objectionKind`（反对意见／适用限制／未解难题），非反驳用中性标签样式 `.philosophy-tag--scope`。
- `CoreEntryLedger` 新增 `sectionHeadings.positions` 与 `positionsIntro`。pt-logic 标题改为「三种推理方式与各自的评价标准」，导语移到区块开头。

### P1 导航语境

- 新增 `pager.ts`，按语境给前后页：同一问题域／同一传统的次序，以及推荐路线的前后步；目录页不显示 Prev/Next。删除 `tree.ts` 中按深度优先数组取邻居的 `neighborsOf`。
- `app/learning/page.tsx` 不再整份重复哲学总览的目录，改为问题域与传统的入口卡。

## 验证与证据

- `pnpm check`（lint + typecheck + 迁移回放）通过；`pnpm build` 通过。
- 三条新增构建期校验各自故意破坏一次，确认报错并恢复：链条与 prerequisite 冲突、同页编号指向两份材料、分页器指向自己。
- pt-freedom 研究层：改前「3 条来源，已核验 3」，改后「21 条引用 · 15 份材料，已核验 21」；正文 14 个角标全部能在清单中查到。pt-logic：改前「6 条来源」，改后「12 条引用 · 10 份材料」。
- `/traditions` 上一页原指向「人工智能与未来」，现不显示 Prev/Next；`/freedom`、`/logic` 各显示两组带语境标签的前后页。
- 375 / 768 / 1440px：三处页面横向溢出均为 0。
- 新标签页全新加载 `/logic`、`/traditions`、`/learning`：控制台 error 为 0。
- 概念注解（原生 `<details>`）键盘可聚焦、可开可合，焦点留在触发点；无浮层，故不涉及 Escape 关闭。
- 深链接：跨页带 hash 加载与页内目录点击均正确定位到目标区块。

## 尚待处理

- 搜索未实现。当前哲学空间确实没有搜索；`/mind` 那套是客户端组件且面向另一份数据，旧静态页 `philosophy-tree.html` 的搜索不宜作为入口。新建客户端搜索与 `KNOWLEDGE_BASE.md` 的「零 JS」约束冲突，本轮未擅自突破，留给后续单独决定。
- 关系层仍有 P2 级措辞项未处理：`chain-freedom-to-justice` 第 2 步与 `chain-good-life-to-care-work` 第 1 步踩在 distinction（对称）边上，链条的「往前走一步」与边的「别混为一谈」语义不一致。
- 未做独立复审：来源核验记录仍标「自审（尚未独立复审）」。
- `pnpm check:philosophy-sources` 报 ID-2（academic.oup.com/book/32817）HTTP 403。属出版社 bot 拦截（换浏览器 UA 仍 403），该条已标 `checked: 'pending'`，不是失效链接，但脚本每轮都会红一次。

## 发布前审查（对抗性）

发布前跑了一轮多维审查 + 对抗性复核（21 个 agent，6 个维度，每条发现由独立 agent 尝试证伪）：提出 15 条，证伪驳回 7 条，成立 8 条，**全部在发布前修掉**。其中两条是本轮自己引入的内容错误：

- `relations.ts` pt-history-tech → pt-africana-race 的 why 用了「本页／该页」。why 在正反两个方向原样显示，这两个词在对面那一页整段翻面——正是本轮立项要消灭的那类矛盾，却被我在修别的边时写了进去。
- 同一条 why 点名的三条立场有两条与 data.json 对不上：「非殖民与历史批判」不存在；「非殖民与解放实践」被劈成两半；真实存在的「种族的社会建构」漏掉。

由此新增两样东西：
- `relations.ts` 的 `assertNoDirectionalDeixis`：why 里禁止出现「本页／该页／同一页」。带页名的「自由那一页」不在禁止之列。
- `scripts/check-philosophy-invariants.mjs` + `pnpm test:philosophy`，并挂进 `pnpm check`。

## 一处需要纠正的既有说法

之前把这些数据校验称作「构建期校验」，不成立：`vinext build` 只打包、不 import 应用模块，`[node]/page.tsx` 的 `revalidate = 0` 又让节点路由不产出预渲染产物，CI 也不跑 build。所以它们原本第一次执行的时刻是**生产 Worker 的第一次请求**——数据写坏会是线上 500，不是构建失败。relations.ts 与 `[node]/page.tsx` 里那两处注释已改写成事实，并补上真正的闸门 `pnpm test:philosophy`（0.17s，已故意破坏验证过会拦下）。

## 正式网站发布记录

- 用户明确要求发布。
- `pnpm deploy:only` 发布 Worker Version ID：`29958193-f3ba-4ad5-b713-992a1d281002`（上传 9 个资源，Worker 启动 37ms）。无 D1 迁移，未执行 `pnpm migrate`。
- 发布后线上核对：`/`、`/learning`、`/learning/philosophy`、`/logic`、`/freedom`、`/traditions`、`/map`、`/path`、`/notes` 均 200。
- 逐项确认改动已生效：freedom 研究层由「3 条来源，已核验 3」变为「21 条引用 · 15 份材料，已核验 21」；`/traditions` 不再有分页器链接（原 Prev 指向人工智能专题）；logic 页出现「三种推理方式与各自的评价标准」「适用限制」「未解难题」「反证法（间接证明）」；pt-africana-race 与 pt-history-tech 两页读到同一句且都成立；`/learning` 只剩入口卡，不再重复完整目录。

---

# 历史任务：Notes 文章页移除归档来源模块并深化 AI 阅读评注

状态：已完成并发布正式网站（2026-09-12）。

## 需求

- 删除所有文章页正文末尾的完整归档来源模块，包括 `FROM THE ARCHIVE`、来源说明与原文链接。
- 把 58 篇文章现有的 AI Reading Note 全部逐篇重写为更具体的分析与评价，每则不少于 200 个汉字／字符，不以通用模板代替原文阅读。

## 验收

- 页面和源代码中不再渲染归档来源模块、`FROM THE ARCHIVE`、来源说明或原文链接。
- 58 条 `ai_summary` 均已更新，逐条长度不低于 200，且能对应文章的叙述、结构或主题。
- 新增前滚 D1 迁移并重新生成 `app/lib/static-posts.ts`；迁移回放、Type Check、Lint、Build 通过。
- 本地与线上各抽查一篇文章：归档来源区完全移除、AI Reading Note 可以展开、浏览器控制台无错误。

## 计划

1. 已在文章组件删除完整归档来源模块及其样式。
2. 已用前滚迁移逐篇更新 AI 阅读评注，并生成静态回退数据。
3. 已完成本地工程检查、线上页面复核与 Worker 重新发布；未操作 D1 数据库。

## 本次改动

- `app/notes/[slug]/page.tsx` 不再渲染归档来源模块；原载来源说明与外链一并移除。
- `migrations/0016_deepen_ai_reading_notes.sql` 前滚更新 58 条 `ai_summary`，每条都是针对该篇文章的叙述、主题或结构的分析。
- `app/lib/static-posts.ts` 已由 `pnpm generate:static-posts` 从全部迁移重新生成，供尚未初始化 D1 的部署回退。

## 验证与证据

- 逐条程序检查：58/58 篇均有 AI Reading Note，长度范围为 242—290 字符，平均 268；无低于 200 的条目。
- `pnpm test:migrations`：通过。16 个迁移从 `0001_initial.sql` 重放到 `0016_deepen_ai_reading_notes.sql`，`database_version` 为 16，已发布文章仍为 58 篇。
- `pnpm typecheck`、`pnpm lint`、`pnpm build`：均通过。
- 前一次发布验证：`FROM THE ARCHIVE` 已移除，但来源说明与外链仍在；用户确认期望删除整个模块，故本次继续更正。
- Cloudflare：首次远程迁移曾返回 7403；复查账号与数据库后重试 `pnpm migrate`，`0016_deepen_ai_reading_notes.sql` 已成功应用到 `killua-win-d1`。
- 正式网站：`pnpm deploy:only` 已成功发布 Worker Version ID `9ad38619-0843-4ff0-aab7-992771cf6294`，上传 9 个资源；`/api/database` 现返回版本 16。
- 本次线上复核：正式 URL `/notes/loneliness-is-not-a-misunderstanding` 的正文后直接进入 AI Reading Note；`FROM THE ARCHIVE`、来源说明与“查看原文”外链均不存在，展开评注后为新版 290 字符全文。
- 本次发布：`pnpm typecheck`、`pnpm lint`、`pnpm build` 通过；`pnpm deploy:only` 发布 Worker Version ID `9b158a27-cca0-49d3-8a77-bf81816fec52`。

---

# 历史任务：哲学知识库 V2 —— 知识关系、阅读分层与来源诚信

状态：已完成并发布正式网站（2026-09-11）。

## 需求

把现有「组织良好的哲学文章与问题体系」升级为能帮助用户探索问题、理解概念、看见论证、比较立场、建立知识连接的学习系统。重点是更好的知识结构，不是更多内容。

本轮**不实现**：已读状态、学习百分比、已理解状态、复习状态、用户学习进度、积分／成就／游戏化。学习空间保持无状态。

本轮**不以节点数量为 KPI**：55 个节点不变。

## 验收

按需求文档的验收清单逐项检查，其中硬性的几条：

- 三个学习入口（问题探索／系统学习／哲学传统）清晰，且「FIND THE QUESTION」这条核心设计不被削弱。
- 核心节点之间存在带语义、带理由的结构化关系，不只是「相关文章」；没有虚构关系。
- 正文阅读不被维护信息打断，Research 信息仍可访问，关键来源不被隐藏。
- 适合的主题有论证地图，前提／结论／反对／回应清晰，手机端正常。
- 跨页面概念可复用、定义一致、易混概念得到区分，且页面没有产生链接噪音。
- 思想实验服务于具体哲学分歧，不做人格测试，不给用户贴立场标签。
- 跨传统不强行寻找「东方版 X」，保留各自的问题框架，区分比较关系与历史影响。
- 没有虚构来源、虚构页码、虚假学界共识；不确定内容明确标记。
- 保持原有视觉身份，不变成 Dashboard，不过度 Card 化。
- 375px 正常，无横向溢出，关键交互键盘可达，焦点状态清晰。
- Type Check、Lint、Build 通过；关键页面实际打开验证；无 Console Error；没有破坏原有 URL；没有引入大型依赖。

## 本次改动

节点数不变（55 个）。本轮加的是结构与关系，不是条目。

### 新增数据层（`app/learning/philosophy/`）

| 文件 | 内容 |
| --- | --- |
| `relations.ts` | 105 条带理由的有向关系边（前置理解 14／易混辨析 16／有力反对 11／延伸问题 15／处境应用 8／跨传统比较 19／历史语境 22），加 4 条横向链条。七种关系各带一个 `mustAnswer`，作者写 `why` 时必须回答它；刻意不设「相关」兜底项，父子边不进关系层 |
| `concepts.ts` | 21 个跨条目复用的概念，含 20 项收录标准判断与逐条易混辨析 |
| `argument-maps.ts` | 8 张论证地图、22 个立场分支，每个分支都有 `cost`（接受它要付的理论代价） |
| `thought-experiments.ts` | 7 个改变变量式思想实验，`origin` 区分本站原创／教学重构／文献案例 |
| `comparisons.ts` | 8 个跨传统可比问题，`caution` 与 `pending` 都是必填 |
| `learning-path.ts` | 10 步推荐基础路线，每步的 `prepares` 与下一步的 `why` 逐环接上 |

### 新增组件与路由

- `research-layer.tsx`（折叠的研究层）、`argument-map.tsx`、`thought-experiment.tsx`、`comparison.tsx`、`concept-card.tsx`、`next-steps.tsx`、`prose.tsx`（行内概念注解解析）、`citation.tsx`、`map-view.tsx`。全部是服务端组件，整个哲学空间零客户端 JS。
- `/learning/philosophy/map` —— 哲学知识地图。六个问题域 + 41 个节点，每个节点是原生 `<details>`：点开看到一句话介绍、按语义分组的直接相关节点（带理由）、进入专题的入口。另有横向链条、概念层与传统层。地图页会如实报出还有多少节点没有语义关系（当前为 0）。
- `/learning/philosophy/path` —— 推荐基础学习路径。
- `/learning/philosophy` 改为三个入口（从问题开始／系统学习／从传统进入）。「FIND THE QUESTION」这条核心设计保留，`03 按问题` 分区仍是原来那份核心问题清单，没有削弱。

### 阅读层重排

节点页顺序改为：本页范围 → 页内目录 → 问题为何会出现 → 定义与边界 → 阅读提醒 → 先把问题拆开（概念） → 论证地图 → 主要立场（含论证路径／反对／回应） → 有力反对及回应 → 哲学家怎样改写这个问题 → 思想实验或案例推演 → 容易混淆的地方 → 人物与原典 → 跨传统的可比问题 → 放回历史语境 → 带着问题继续读 → 继续学习 → 折叠的研究层。

阅读层区块从 15 个降到 12–13 个；条目状态、来源核验记录、审查与待办整块收进末尾的 `<details>`。40 个页面自动生成页内目录（共 430 个链接，实测零死锚点）。

### 结构性修复

- **论证路径改为按立场名索引**（`positionArguments`），加构建期校验。22 个条目全部迁完，废弃的 `positionPaths` / `positionSourceIds` 已从类型里删除。修掉六页把论证挂到错误立场名下的错配，其中 `pt-care` 那条全页最有力的制度论证此前因下标取不到而从未上过页面。
- **来源核验三态化**（`'verified' | 'pending' | 'broken'` + `checkedOn`），页面显示真实值。最终 149 条 verified、5 条 pending、1 条 broken。条目状态由来源状态数出来，不再用手写断言。
- **立场新增 `response` 字段**。全库 101 个立场卡现在都有回应，并写明接受这个回应要付的代价；此前全部停在「反对意见」那一行。
- **六个问题域页的 positions 重写**为域内真正对立的争点（此前是分类法元评论或「X 取向重视 X」式同义反复）。
- **17 个条目接入共享概念层**（`conceptRefs`），页内重复定义删除；`功能主义` 从两份页内定义合并为一份共享定义 + 两句「在本页」的角度。
- **「关键检验是：」句壳清零**（此前 66 处 100% 覆盖，其中 14 条根本不是检验）。`scope` 字段的统一模具、`orientation` 的统一起手式也一并打散。
- 行内概念注解上线 25 处，跨 22 个页面，每页 1–3 处且只标第一次出现。

### 无障碍与样式

- 焦点环基础色从 `var(--ink)`（在深色面上 1.04:1，等于不存在）改为 `var(--ember)`。
- 新增 `--meta-on-dark`（5.4:1 / 5.0:1）替换小号元信息上不足 4.5:1 的 `--rock-gray`。
- `.philosophy-coverage-map` 从遗留的浅色卡并入深色语言。
- 触控目标补齐；`being-change` 的五个页内锚点由该页 module.css 按类名接管 `scroll-margin-top`；断点补上 980 一档；新增覆盖 `.philosophy-page *` / `.learning-page *` 的减弱动效兜底；`.sr-only` 改用 `clip-path` 并补 `margin: -1px`。

### 工具与文档

- `scripts/check-philosophy-sources.mjs`（`pnpm check:philosophy-sources`）：抓取库内全部来源 URL，报 404、无法解析的域名，以及返回 200 但内容是 SEP「Not Yet Available」占位页的地址。不进 CI（CI 无网络），每轮内容整改前手动跑。
- `app/learning/philosophy/CONTENT_GAP_REVIEW.md`：277 条审查发现的分级整改清单。
- `KNOWLEDGE_BASE.md` 补写数据架构、来源核验与每轮工作顺序三节；`coverage.ts` 的文案改成描述实际状态（原文案声称「本版范围内无未建来源账条目」「缺口不被伪装成已核验结论」，本轮证明两句都不成立）。
- `docs/architecture.md` 同步路由表与数据边界。

## 关键设计决策

只记会影响后续维护的几条。

### 1. 关系有语义、有理由，且没有「相关」兜底项

`relations.ts` 定义七种关系（前置理解／易混辨析／有力反对／延伸问题／处境应用／跨传统比较／历史语境），每种在 `relationLabels` 里带一个 `mustAnswer`，作者写 `why` 时必须回答它。刻意**不设**「相关 see-also」这一类：一旦留了兜底项，`data.json` 里那 97 条说不出理由的裸边就会原样搬过来。父子边也不进关系层——面包屑和「下一层」已经表达了树结构。

`data.json` 的 `related` 字段因此不再渲染。它暂时留在数据里（有节点还在用它做兜底），但页面上的「继续学习」只来自 `relations.ts`。

### 2. 论证路径按立场名索引，不按数组下标

旧结构 `positionPaths: string[][]` 按下标与 `data.json` 的 `positions` 对齐，没有任何校验。本轮审查查出至少六页把论证挂到了别的立场名下——最严重的是「修身与解脱」（儒家与佛教）下面渲染出当代福祉理论的「客观清单」论证，以及「经验主义＝内部主义」这组错误对照。还有一页写了三条路径而该页只有两个立场，第三条永远取不到。

改成 `positionArguments: Record<立场名, { steps, sourceIds }>`，并在 `study-guides.ts` 末尾加构建期校验：键名不是该节点真实的 `position.name` 就直接抛错。这类错配从此不可能静默通过。

### 3. 来源核验状态是三态，且页面显示真实值

`LedgerSource.checked` 原本的类型是字面量 `true`，「待核验」在类型上无法表达；渲染层又把「已核验」硬编码在 JSX 里，谁都不读这个字段。结果是标着「已核验」的来源里藏着 9 条失效链接、两处凭空写出的章节号（SEP Philosophy of Technology 没有 §6.2，SEP Mohism 没有 §2.1）和一个已不能解析的域名。

现在 `checked` 是 `'verified' | 'pending' | 'broken'`，另有 `checkedOn`，页面显示的就是这个值。`source()` helper 的默认值是 `'pending'`——没有实际打开核对过的来源拿不到印章。本轮开始时把全部既有来源降级为 `pending`，再逐条重新核对。

配套加了 `scripts/check-philosophy-sources.mjs`（`pnpm check:philosophy-sources`）：抓取库内全部来源 URL，报告 404、无法解析的域名，以及返回 200 但内容是 SEP「Not Yet Available」占位页的地址。它**不进 CI**（CI 里没有网络，也不该依赖外网），每轮内容整改前手动跑一次。它只查链接是否活着，不替代人工核对章节定位。

### 4. 维护信息降为二级，但来源角标留在正文

条目状态、来源核验记录、审查与待办整块收进正文之后一个默认折叠的 `<details>`（`research-layer.tsx`）。折叠标题上写清有多少条来源、各是什么状态、什么审查模式——状态不藏成需要点开才知道的秘密。正文里的 `[FRE-1]` 角标仍然直接指向来源本身，不需要先展开折叠区。

### 5. 全部展开交互用原生 `<details>`，零 JS

概念卡、知识地图节点、研究层都是 `<details>`：自带键盘操作和展开语义，手机上是点击而不是 hover，放大后不会有浮层被挤出屏幕。整个哲学空间没有客户端组件，知识地图是服务端渲染的静态结构，没有引入任何 Graph / Canvas 依赖。

一个连带约束：`<details>` 属于 flow content，不能放进 `<p>`。所以带行内概念注解的段落渲染成 `.philosophy-para`（`prose.tsx` 里按是否含注解决定用哪个标签）——直接塞进 `<p>` 会被浏览器解析时提前闭合，后半句掉出段落之外。

### 6. 行内概念注解用五行的正则，不引入 MDX

正文里写 `[[concept-id|显示文本]]`，解析在 `prose.tsx`。不做成更通用的富文本，是因为知识库只需要这一个能力；引入 MDX 或自定义节点树会让每次写内容都要先想数据结构。不认识的 concept id 在构建期直接抛错，不会静默漏渲染。

### 7. 跨传统比较刻意不用表格

`comparison.tsx` 用的是并列的框架卡加一句必填的差异提示。表格的每一行都在暗示「同一个格子对应同一个东西」，而这正是跨传统比较最容易犯的错。

## 验证与证据

以下是实际跑出来的结果，不是预期。

### 工程检查

- `pnpm typecheck`（`tsc --noEmit`）：通过。
- `pnpm lint`（`eslint .`）：通过。
- `pnpm build`：通过。构建路由表包含 `/learning/philosophy/map`、`/learning/philosophy/path` 与 `/learning/philosophy/:node`。
- 构建期数据校验实际生效（本轮新加，靠预渲染 55 个节点页触发）：关系边的节点存在性与去重、概念的 nodeIds／来源非空、论证地图的「主干末步必须是分歧点」与「至少两个分支」、思想实验的人格标签防线、可比问题的 sourceIds 登记检查，以及 `positionArguments` 的键名必须是该节点真实的立场名。

### 路由与 URL

- 59 条路由（55 个节点 + `/learning` + 总览 + `/map` + `/path`）全部返回 200，页面无错误标记。
- `/learning/philosophy-tree` 仍返回 200，canonical 仍指向 `/learning/philosophy`。没有破坏任何既有 URL：本轮没有改动任何节点的 id、title 或 type。
- `sitemap.xml` 共 124 条，其中 learning 相关 58 条，含新增的 `/map` 与 `/path`。

### 响应式（375px）

- 用同源 iframe 逐条量 58 条 learning 路由的 `scrollWidth`：**全部为 375，横向溢出 0**。整改完成后又整轮复测一次，结果相同。
- 同一轮里把每页所有 `<details>`（研究层、概念注解、地图节点）强制展开后再量：仍然全部为 0。
- 桌面 1440px：论证地图分支 3×292px、概念卡 2×438px、跨传统框架 3 列、地图问题域 3×337px、推荐路径 46px 序号列 + 816px 正文列，正文 measure 上限 820px，溢出 0。

### 无障碍

- 焦点环：CSSOM 实测基础规则已是 `a/button/summary:focus-visible { outline: 2px solid var(--ember) }`。修复前是 `var(--ink)`（#080809）落在 #080809–#1a1a1f 的深色面上，对比度约 1.04:1；那条 `:focus-visible { outline-color: var(--ember) }` 补丁因特异度 (0,1,0) 低于 (0,1,1) 一直没有生效。全库现在只剩 skip-link 用 `--ink` 描边，而它的背景是 ember，正确。
- 新增能力的焦点环逐个确认：`.philosophy-gloss > summary`、`.philosophy-research > summary`、`.philosophy-map-node > summary` 都有显式 ember 描边。
- 触控目标：页内目录 32px、地图节点 summary 52px、`being-change` 的 TOC 与练习 summary 44px、面包屑与来源链接补到 26px（WCAG 2.5.8 要求 24px）。
- 页内目录：40 个页面共 430 个链接，用 `getElementById` 逐条校验**零死锚点**。
- 减弱动效：新增一条覆盖 `.philosophy-page *` / `.learning-page *` 的兜底，不再依赖逐个选择器点名。
- 行内概念注解端到端验证：全库 22 个页面共 25 处注解，`document.querySelectorAll('p .philosophy-gloss').length` 在全部 58 条路由上都是 **0**（即 `<details>` 没有落进 `<p>` 被浏览器提前闭合，带注解的段落正确降级为 `.philosophy-para`）；`<summary>` 是真 summary，键盘可达；面板宽度 335px＝正文列宽，展开前后均不溢出；段落高度 117px → 353px 就地展开。

### 来源

- `pnpm check:philosophy-sources`：184 个来源地址，失效数从整改开始时的 **11 降到 1**（唯一一条是 OUP 付费墙落地页对脚本 UA 返回 403，页面本身存在，已如实标 pending）。
- 修掉的 9 条（每条都自己抓过替代页面、读过章节结构再换）：`entries/philosophy-language/` → `entries/meaning/`（Theories of Meaning）；`entries/chinese-phil-language/` → `entries/chinese-logic-language/`；`entries/normative-ethics/` → SEP Consequentialism ＋ Deontological Ethics（IEP 的 `/ethics/` 实测是分类索引页不是文章，没用）；`entries/political-philosophy/` → IEP `polphil`（实际标题是 Political Philosophy: Methodology，label 照实写）；`entries/epistemic-injustice/`（返回 200 但页面 H1 逐字为「Not Yet Available」）→ IEP `epistemic-injustice`；`entries/ancient-greek-roman/` → IEP `ancient-greek-philosophy`；`entries/neo-confucianism/` → IEP `neo-confucian-philosophy`；`iep.utm.edu/vedanta/`（label 写 SEP、网址给 IEP，两处都错）→ IEP `advaita-vedanta`；`entries/jainism/` → `entries/jaina-philosophy/`。另修 `SEP：Social Contract` → `SEP：Contractarianism`（链接有效但 label 与目标不符）。
- 两处虚构章节号按实际抓取结果改准：SEP Philosophy of Technology 顶层章节只到 §3，其后即 Bibliography（原 TEC-1 写「§6.2」）；SEP Mohism 的 §2 没有任何子节（原 TEC-2 写「§2.1」）。改后 TEC-1 的 locator 是「§1 Different Approaches（海德格尔在此）、§3.1、§3.2（§3.2.4 Power and Justice——温纳与哈拉维在此）」，TEC-2 是「§3 及 §3.1 The Concept of Fa (Models)；兼爱与利见 §7 及 §7.1 Inclusive Care」。
- 剩下 2 条如实标注、不假装可用：Fricker《Epistemic Injustice》的 OUP 书页对抓取返回 403（付费墙落地页，无正文无目录）；Singer《All Animals Are Equal》原挂的 `digitalcommons.brockport.edu` 域名已不能解析，SUNY 迁移后的 `soar.suny.edu` 记录页本轮抓取返回 403/500，找不到可确认的全文地址。

## 正式网站发布记录

- Worker Version ID：`a5607b45-d9c0-4369-929c-a38b43f4699b`，对应提交 `f6d9e7e`。
- 用 `pnpm deploy:only` 发布已构建产物；纯前端改动，**未触碰远程数据库**（无 D1 迁移）。
- 上传 10 个新资源（61 个已存在），总计 2240.59 KiB / gzip 776.37 KiB，Worker 启动 32 ms。
- 按用户明确要求跳过了 Codex Sites 测试环境。

### 发布后线上复核（https://www.killua.win/）

- 13 条路由全部 200：`/`、`/learning`、`/learning/philosophy`、`/map`、`/path`、`/freedom`、`/being-change`、`/ethics`、`/learning/philosophy-tree`、`/notes`、`/health`、`/mind`、`/sitemap.xml`。
- `/learning/philosophy` 三个入口就位：从问题开始 / 系统学习 / 从传统进入。
- `/learning/philosophy/map`：41 个节点、4 条横向链条、概念层在位，**没有**触发「还有 N 个节点没有语义关系」的提示（孤岛为 0）。
- `/learning/philosophy/freedom` 区块顺序线上实测：问题为何会出现 → 定义与边界 → 先把问题拆开 → 论证地图 → 主要立场 → 有力反对及回应 → 哲学家怎样改写这个问题 → 思想实验 → 容易混淆的地方 → 人物与原典 → 跨传统的可比问题 → 放回历史线索 → 带着问题继续读 → 继续学习；研究层折叠在最后，摘要行显示「3 条来源，已核验 3 · 自审（尚未独立复审）」。页内目录 14 项、零死锚点、3 条立场回应、「继续学习」6 个语义分组。
- 线上 375px 抽查 8 条路由（含 `/learning`、总览、地图、路径、being-change、三个问题域与核心问题页）：横向溢出 0，把所有 `<details>` 展开后仍为 0，`<p>` 内嵌 `<details>` 为 0，页内目录死锚点为 0。
- 控制台无错误。

## 推送与 CI

- `git push origin main`：`61d8c3b..3190362`，本地与 `origin/main` 已同步（`rev-list --left-right --count` 为 `0 0`）。
- GitHub Actions CI：**success**。CI 只跑 ESLint、TypeScript 与迁移回放，不负责任何环境的部署。

## 未完成事项

不因为想让任务看起来完成而隐藏。

### 结构性缺口（本轮无法补齐）

- **全库中文来源仍为 0。** 184 条来源里，论及儒家、道家、墨家、法家、宋明理学、正理、吠檀多、耆那、顺世、伊斯兰与非洲哲学的条目，依据全部是英文的 SEP／IEP 综述。《论语》《孟子》《荀子》《庄子》《墨子》《韩非子》《中论》一部都没有作为核验来源进入来源账——它们只出现在正文与书目卡里。一个面向中文读者、明确反对「把非西方传统翻译成西方分类」的知识库，其非西方内容的全部依据是英文二手综述，这与它自己的方法论主张不一致。本轮把这个缺口写进了 `coverage.ts`，但没有解决。下一轮应以原典版本核对为主线。
- **来源仍高度集中在单一站点。** 修完死链后 SEP／IEP 之外的来源只增加了少数几条。

### 明确留作待核验的来源（2 条）

- `ID-2` Fricker《Epistemic Injustice》：用浏览工具实际打开，确认是 OUP 付费墙落地页——只有书名与学科分类，无目录、无章节摘要、无正文。已降级为 `pending`，证言不公／解释不公的定义改挂 IEP 条目；「原始区分」这一层仍缺原典依据。
- `SCI-3` 库恩《科学革命的结构》：下载该 PDF 实测为 37 页纯扫描件（无 `/Font`、37 个 JBIG2 位图），无法从文件本身确认对应哪几章，且该书的结构单位是 Chapter 而非 §。已降级为 `pending`，相关论断改挂 SEP Thomas Kuhn。

另有 3 条只确认链接存活、未逐节打开核对，如实留 `pending`。

### 需要新来源才能补的内容（agent 正确地拒绝了伪造）

- `pt-freedom` 的 figures 点名斯宾诺莎，而现有 FRE-1/2/3 都不支撑对他的论证转述——要补人物卡必须先加一条 SEP Spinoza。
- `pt-logic` 的「解释性推断」是全页写得最完整的论证路径，却无来源（现有六条来源都不覆盖溯因／最佳解释推断）。
- `pt-science-reality` 的划界内容无来源角标。
- `pt-language-meaning` 的「解释与权力敏感取向」当代那半句无对口来源。
- `pt-identity-oppression` 的「结构性压迫分析」无对口来源——最对口的是艾丽斯·马里昂·杨（压迫五面相、结构性不义），而本轮实测 SEP Feminist Political Philosophy **不讨论**这两项，该条目关于杨的内容全在 §2.5 与 §2.8（发声条件与协商民主）。
- `pt-good-life` 的「解脱」一路缺论证与来源；该页 ledger 里没有任何佛教来源可挂。
- `pt-identity-oppression` 新增的两条外部反对（统计差异不蕴含结构性不义、可信度调整的统计辩护）本轮找不到可核对的来源，正文按 `kind: '争议性判断'` 标出且刻意不挂 sourceId。

### 已识别但本轮不做（会破坏 URL 或属结构洁癖）

- **「X 取向」这套自造立场命名法仍有 21 处**留在核心问题页（把「制度论」写成「历史与制度取向」、「外在主义」写成「外部主义路线」）。核心问题的 `position.name` 是 `positionArguments` 的索引键，改名必须与两份 study guide 同批改，否则构建期校验直接抛错。本轮明确禁止改名以保证并行安全，因此一律没动。
- **不拆 `pt-legalism`**（一个节点装了墨家、名家、法家三个分属不同问题的学派，slug 却是 `legalism`）、**不重排传统分支的分类轴**（西方按时段、印度按学派、中国时段学派混写、伊斯兰时段加问题）。两项都要改 slug，会破坏现有链接；收益是结构洁癖，不是学习体验。
- **不统一 23 个核心问题的 title 体例**（7 个名词短语、16 个疑问句）。改 title 会牵动面包屑、其他页引用、metadata 与外部链接。
- **`/core` 与 `/traditions` 两页内容与总览重复**，未处理。
- **`pt-history-tech` 把历史与技术两个问题挤在一页**。不拆节点的前提下只能改 `question` 缓解。
- **`pt-being-change` 的 `positions` 与 ledger 正文在页面上不渲染**：该节点走手写的 `being-change-entry.tsx`，正文由手写组件出。本轮已把共享尾部（跨传统比较、历史语境、继续学习、研究层）接上，`question` 的改动也生效，但那三张立场卡与四段 ledger 正文目前是备用数据。`StudyGuide.texts` 是必填字段，删不掉该页已被手写正文吸收的那份 `texts`。

### 既有问题，超出本轮范围

- **全站字体变量链失效**：`--font-barlow` 等由 `next/font` 挂在 `<body>`，而 `--font-body` / `--font-mono` 定义在 `:root`，导致 `var(--font-mono)` 解析不到，全站退回系统中文字体（本轮实测哲学页区块标题的 `font-family` 是 `PingFang SC`，而设计意图是等宽字体）。这会影响全站视觉，属独立改动。
- **`pnpm build` 把 `/learning/philosophy/:node` 归类为 Dynamic**：该路由有 `revalidate = 0`（既有设置，注释说明是为了避免跨部署缓存住旧正文）。本轮未改。

### 部署状态

已按用户明确要求**直接发布正式网站，跳过 Codex Sites 测试环境**（用户在被问到时选择「直接发正式网站」）。这是对 AGENTS.md 里「视觉改动先上测试环境确认」那条规则的一次明确豁免，记在这里以免下次被误读成惯例。

# 历史任务：撤下 AI 编程工作流，保留学习页与哲学页结构

状态：已完成并发布正式网站（2026-09-09）。

## 需求

- 删除 AI 编程工作流相关的全部内容：路由、数据、样式、站点地图条目和文档描述。
- 学习页与哲学页的结构保持当前样子，不回滚到改版前：学习页仍是「一门科目一个分区」，哲学仍是一节里含「按问题」「按传统」两块。

## 验收

- `/learning/ai-workflow` 不再存在于构建路由与 `sitemap.xml`。
- `/learning` 变为 `01` 首屏 → `02` 哲学 → `03` 学习方法；哲学分区内容不变。
- 仓库里没有 `workflow` 相关的死代码或死样式。
- `pnpm check` 与 `pnpm build` 通过。

## 本次改动

1. 删除 `app/learning/ai-workflow/`（`curriculum.ts` 896 行、`page.tsx` 569 行）。
2. `app/learning/subjects.ts`：移除 AI 编程工作流那一条。`liveSubjects` 变回 1 条，`methodSectionNumber` 自动从 `04` 回到 `03`，规划中的科目编号自动变为 02/03/04。
3. `app/learning/page.tsx`：删掉 AI 编程工作流分区与对课程设计数据的全部引用，同步 metadata、首屏说明和学习循环那句话。
4. `app/globals.css`：删除 `.workflow-*` 整块与学习页上的 `.learning-workflow-*` / `.learning-path-*`，以及尾部三个只服务于它的响应式块；保留 `.learning-subject-section`、`.learning-block-heading` / `.learning-block-lede`。文件从 5539 行回到 4650 行。
5. `app/sitemap.ts`：移除 `/learning/ai-workflow` 条目。
6. `eslint.config.mjs`：把 `.claude/**` 加进 `globalIgnores`。代理会在 `.claude/worktrees/` 下建仓库的完整副本，`eslint .` 会连那份 checkout 一起扫，撞上它的 `worker-configuration.d.ts` 报 9 个错——那是另一个 checkout，应由它自己那边检查。
7. `docs/architecture.md`、`docs/decisions/0005-learning-subject-layer.md`：删掉路由条目，注明 AI 编程工作流已撤下；科目层这条长期决定本身与具体科目无关，予以保留。

## 验证与证据

- `pnpm check`：通过（ESLint、TypeScript、迁移回放 15 个迁移 / 58 篇文章）。
- `pnpm build`：通过，构建路由表已无 `/learning/ai-workflow`。
- `grep -c workflow app/globals.css` 为 0；`app/` 下无 `ai-workflow` 引用。
- 本地实测（1440 / 375 两种视口）：`/learning` 分区为 `hero`、`learning-philosophy`、`learning-method`，编号 `01 / 02 / 03`；哲学 23 个核心问题、6 个问题域、5 条传统导航不变；规划中的科目 3 条、编号 02/03/04；无横向溢出、页内锚点全部命中、控制台无错误。
- `/learning/ai-workflow` 本地与线上均返回 404。

## 正式网站发布记录

- Worker Version ID：`e2ae9304-77d7-4303-93d7-7b0ec91cae18`，对应提交 `cb9b966`。
- 用 `pnpm deploy:only` 部署，纯前端改动，未触碰远程数据库。
- 发布后实测：`/`、`/learning`、`/learning/philosophy`、`/notes`、`/health`、`/mind` 均 200；`/learning/ai-workflow` 返回 404；`sitemap.xml` 已无该条目。
- 正式网站 `/learning` 复核：分区 `01` Learning desk、`02` Philosophy、`03` How to use；eyebrow「Subject 01 / 哲学」；两个分区面为 `#0e0e11` 与 `#080809`；页内导航只剩「哲学」「学习方法」；23 个核心问题、6 个问题域、5 条传统导航不变；规划中的科目为 02 心理学 / 03 历史 / 04 科学；无横向溢出、锚点全部命中、控制台无错误。
- 发布后第一次取 `https://www.killua.win/learning` 命中了 Cloudflare 边缘缓存的旧版（仍显示 4 个分区），带查询串和直连 Worker 都是新版；数分钟后边缘缓存自行失效，再取即为新版。`sitemap.xml` 有 `revalidate = 3600`，同样在复核时已刷新。

## 推送与 CI

- `git push origin main`：`4ff4c00..e21d03e`，本地与 `origin/main` 已同步（`rev-list --left-right --count` 为 `0 0`）。
- GitHub Actions CI（run 34261404877）：**success**，38 秒。CI 只跑 ESLint、TypeScript 与迁移回放，不发布任何环境。

## 尚待处理

- `.claude/worktrees/angry-dewdney-26fb1d/` 是另一个会话的 worktree（分支 `claude/angry-dewdney-26fb1d`），本次没有动它。
- 站点字体变量链在 `:root` 上就已失效（`--font-barlow` 等由 `next/font` 挂在 `<body>`，而 `--font-body` / `--font-mono` 定义在 `:root`），正式网站实测同样退回系统中文字体。这是既有问题，本次未改动。

---

# 历史任务：学习空间改为一门科目一个分区，并入 AI 编程工作流课程设计

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
- 第一次发布（工作树状态）：Worker Version ID `17741be9-d6dd-4208-8efd-71781982026e`。
- 改动提交为 `d6c8b63` 后从该提交重新构建并再次发布：**Worker Version ID `70b5ff22-d27a-423e-8fc5-e4dfaf025141`**，这是当前正式网站版本，内容与 `d6c8b63` 一一对应。
- 发布后实测 `https://www.killua.win/`、`/learning`、`/learning/ai-workflow`、`/learning/philosophy`、`/notes` 均返回 HTTP 200。
- 正式网站 `/learning` 复核：分区为 `01` 首屏、`02` Philosophy、`03` AI workflow、`04` How to use；eyebrow 为「Subject 01 / 哲学」「Subject 02 / AI 编程工作流」；三个分区的面依次 `#0e0e11`、`#1a1a1f`、`#080809`；23 个核心问题、5 条传统导航、3 条规划中科目；无横向溢出、控制台无错误。
- 正式网站 `/learning/ai-workflow` 复核：6 个分区、57 章、29 章重点展开，页内锚点全部命中，无横向溢出、控制台无错误。
- `https://www.killua.win/sitemap.xml` 已包含 `/learning/ai-workflow`。
- 第二次发布后重新复核：`/`、`/learning`、`/learning/ai-workflow`、`/learning/philosophy`、`/notes`、`/health`、`/mind` 七条路径全部 HTTP 200；两页的分区、计数、锚点与控制台结果与第一次一致。

## 尚待处理

- 浏览器面板在本次会话中处于隐藏状态，滚动后不绘制，所以本地只有「隐藏其他分区后置顶截图」的证据，没有真实滚动过程的视觉回归；正式网站的复核同样是 DOM 探测加首屏截图。
- 本地 `main` 领先 `origin/main`，`d6c8b63` 尚未推送到远程仓库；推送需要另行确认。
- `app/icon.svg` 的圆点改色由用户自己提交为 `6b66bc1`，不在本次提交范围内。
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
