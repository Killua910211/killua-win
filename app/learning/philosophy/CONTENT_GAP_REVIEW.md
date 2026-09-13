# 哲学知识库整改清单

本轮（2026-09-11）对 55 个节点、42 份来源账、23 份精读层做了一次系统审查，共记录 277 条问题。审查方式是 17 条并行审查线（6 个问题域、4 条传统线、结构、关系、阅读分层、无障碍、文风、概念一致性、来源真实性），其中来源真实性那一线实际抓取了库内全部 219 条来源 URL 逐条核对。

审查的目的是找问题，不是证明现状可以。下面按严重程度排列，格式统一为：位置 / 问题 / 为什么是问题 / 建议处理 / 依赖 / 是否已解决。

优先级依据：事实错误 > 哲学解释错误 > 容易造成误解 > 核心知识链断裂 > 阅读体验 > 次级内容扩展。

---

## 一、Critical：事实与诚信问题

### C1 来源被伪造为「已核验」

- **位置**：`content-ledger.ts:18`（`LedgerSource.checked` 类型）、`research-layer.tsx`（渲染）
- **问题**：`checked` 的类型是字面量 `true`，写 `checked: false` 会编译失败——「待核验」在类型上无法表达。渲染端根本不读这个字段，直接输出硬编码的「已核验」。全库 131 条 ledger 来源的 checked 值集合实测为 `{true}`。
- **为什么是问题**：`KNOWLEDGE_BASE.md` 明令「未实际核对的内容标为待核验」，`coverage.ts` 明令排除「虚构页码」。这个机制使这两条规则在技术上不可能被遵守，也确实没有被遵守（见 C2–C5）。
- **建议处理**：`checked` 改为 `'verified' | 'pending' | 'broken'` 三态，新增 `checkedOn`；渲染真实值；建立来源时必须显式传入状态。
- **依赖**：无
- **是否已解决**：**是**。类型已改，`sourceCheckLabels` 显示真实状态，`source()` helper 默认 `'pending'`，全部既有来源先降级为 `pending` 再逐条重新核对。

### C2 九条失效的来源链接

- **位置**：`data.json` 的 sources：`:383` `:387` `:424` `:800` `:1242` `:1537` `:1573` `:1663`；`remaining-content-ledgers.ts:16`（WES-1）
- **问题**：实测 HTTP 状态——`entries/philosophy-language/` 404、`entries/chinese-phil-language/` 404、`entries/normative-ethics/` 404（SEP 无此条目）、`entries/political-philosophy/` 404（SEP 无此条目）、`entries/neo-confucianism/` 404、`iep.utm.edu/vedanta/` 404、`entries/jainism/` 404（正确 slug 是 `jaina-philosophy`）、`entries/ancient-greek-roman/` 404（SEP 无此条目）。另有 `entries/epistemic-injustice/` 返回 200 但页面是 SEP 的占位页，H1 逐字为「Not Yet Available」。
- **为什么是问题**：其中 `:424`（pt-ethics）和 `:800`（pt-political）所在节点没有 ledger，死链会直接以「延伸阅读」渲染给读者。WES-1 更严重：它是 pt-western-ancient 唯一的来源，整页每条论断都挂在一个不存在的页面上，且标着「已核验」。
- **建议处理**：逐条换成实际打开确认过的替代，并把 label 的 SEP／IEP 写对。
- **依赖**：需要实际访问网络核对
- **是否已解决**：见下方「本轮处理结果」

### C3 两处凭空写出的章节号

- **位置**：`remaining-content-ledgers.ts:101`（TEC-1、TEC-2）
- **问题**：TEC-1 的 locator 写「导论、§1–§3.2、§6.2」，但 SEP「Philosophy of Technology」的顶层章节只到 §3，抓取结论逐字为「There is no section 4, 5, or 6」——**§6.2 不存在**。TEC-2 的 locator 写「§2.1、§3.1」，而 SEP「Mohism」的 §2 没有子节，抓取结论逐字为「Section 2 contains no subsections」——**§2.1 不存在**。
- **为什么是问题**：这是 `coverage.ts` 里明令排除的「虚构页码」，而它就在库内，还带着「已核验」标记。一处虚构定位会让整份来源账的可信度归零。
- **建议处理**：改为实际存在的章节，或降级为 `pending`。
- **依赖**：无
- **是否已解决**：见下方「本轮处理结果」

### C4 一个已经不存在的域名

- **位置**：`content-ledger.ts:565`（ENV-3）
- **问题**：`digitalcommons.brockport.edu` 已无法解析（`getaddrinfo ENOTFOUND`、`nslookup` 无应答、`curl` 报 Could not resolve host）。SUNY Brockport 的仓储已迁至 `soar.suny.edu`。ENV-3 是 pt-environment-animals 唯一的原典入口，正文的「原文入口」段就挂在它上面。
- **为什么是问题**：标着「原典」「已核验」的条目指向一个不存在的主机。
- **建议处理**：换到迁移后的地址并核对，或降级。
- **依赖**：无
- **是否已解决**：见下方「本轮处理结果」

### C5 论证路径按数组下标错配到别的立场

- **位置**：`study-guides.ts` / `remaining-study-guides.ts` 的 `positionPaths`，与 `data.json` 的 `positions` 按下标配对
- **问题**：至少六页把论证挂到了错误的立场名下。最严重的两处：
  - **pt-good-life**：`data.json` 的三个立场是「幸福与德性／自主与真实／修身与解脱」（传统式三分），论证路径写的是「享乐主义／欲望理论／客观清单」（当代福祉三分）。页面实际渲染成「修身与解脱」（儒家与佛教）标题下挂着客观清单论的论证。
  - **pt-knowledge-sources**：立场是「经验主义／理性主义／批判与多源取向」，论证路径写的是内部主义／外部主义／社会认识论。页面因此教出「经验主义＝内部主义、理性主义＝可靠论外部主义」这组错误对照。
  - 另有 pt-responsibility、pt-art、pt-interpretation、pt-aesthetic-value 各一到两处；pt-care 写了 3 条路径而该页只有 2 个立场，第三条（全页最有力的制度论证）永远取不到，**从未在页面上出现过**。
- **为什么是问题**：这是直接教错内容，而且是关于跨传统的错误对照——正好是本知识库自订规则最反对的那一类。
- **建议处理**：改为按立场名索引（`positionArguments`），并在构建期校验键名。
- **依赖**：无
- **是否已解决**：**结构已解决**。`positionArguments: Record<立场名, {steps, sourceIds}>` 已落地，`study-guides.ts` 末尾有构建期校验，键名对不上直接抛错；页面只渲染这个字段。内容迁移见下方结果。

### C6 焦点环在深色面上不可见

- **位置**：`globals.css:1062`（`a:focus-visible` 等）
- **问题**：`outline: 2px solid var(--ink)`，而 `--ink` 是 `#080809`，全站内容面是 `#080809–#1a1a1f`，对比度约 1.04:1。下方那条 `:focus-visible { outline-color: var(--ember) }` 补丁救不回来——它的特异度 (0,1,0) 低于 (0,1,1)，一直没有生效。
- **为什么是问题**：键盘用户在哲学正文和 `/learning` 哲学分区里完全看不到焦点位置。
- **建议处理**：基础色改为信号色。
- **依赖**：无
- **是否已解决**：**是**。`a/button/summary:focus-visible` 与 `.note-row:focus-visible` 的描边改为 `var(--ember)`。

### C7 维护日志被当成正文放在阅读层

- **位置**：`node-content.tsx`（旧的 `philosophy-entry-status` / 来源账 / `review` 三个区块）
- **问题**：每个核心问题页正文第一块是「本条范围与状态」，配全页最抢眼的橙色描边盒；最后一块是编辑内部的「本轮审查与待办」（平均约 400 字，findings 全部以「原内容……」开头）。三者加起来平均占页面 22%，传统页高达 32–48%。真正的哲学问题被推到第二屏之后。
- **为什么是问题**：读者点进「自由意志」，第一屏读到的是维护日志。
- **建议处理**：整块收进正文之后的折叠研究层；正文里的来源角标保留，仍直接指向来源。
- **依赖**：无
- **是否已解决**：**是**。`research-layer.tsx` 承担这一层，默认折叠，摘要行写明有多少条来源、各是什么状态、什么审查模式。阅读层区块从 15 个降到 12 个。

### C8 手写样板页丢弃了自己的精读层

- **位置**：`node-content.tsx` 对 `pt-being-change` 的早退
- **问题**：`NodeBody` 直接 `return <BeingChangeEntry />`，而该组件只读 `ledger` 的 scope/status/sources/review。结果 `studyGuides['pt-being-change']` 整块不渲染（concepts 四条、论证路径三条、texts 四条含龙树《中论》、caseStudy、nextQuestions 全是死数据），`data.json` 的 related 与 ledger 的 historicalContext 也不渲染。全页仅有的两条站内链接写在一个默认折叠的 `<details>` 里。
- **为什么是问题**：全库最强的一页同时是最孤立的一页，读者读完无处可去。
- **建议处理**：手写主线之后接上共享尾部；把 study guide 里没被正文覆盖的内容接进来。
- **依赖**：无
- **是否已解决**：**结构已解决**（手写主线之后现在渲染跨传统比较、历史语境、继续学习、研究层）。内容接入见下方结果。

### C9 「正当性」同名互斥

- **位置**：`study-guides.ts`（pt-knowledge-sources concepts）与 `remaining-study-guides.ts`（pt-legitimacy concepts）
- **问题**：同一个词条键在两个条目里被定义为两个互不相干的概念——一处是信念的理由（epistemic justification），一处是统治的正当（political legitimacy）。pt-legitimacy 同一页内还把 legitimacy 一处叫「正当性」一处叫「合法性」，而中文「合法」字面就是「符合法律」，恰恰是该页要论证的区分。
- **为什么是问题**：读者在第二页会发现自己学到的是两个互相矛盾的定义。
- **建议处理**：拆成两个概念进共享概念层，各自写清易混。
- **依赖**：概念层
- **是否已解决**：见下方结果

### C10 最强立场缺席（虚无主义、契约论、偶因论归属）

- **位置**：pt-death-meaning、pt-environment-animals、pt-islamic-reason-revelation 的 positions
- **问题**：pt-death-meaning 三个立场全部预设生命可以有意义，只在意义来源上分歧，**虚无主义作为立场完全缺席**；对客观价值路线的「反对」是一个内部划界问题，不是外部挑战。pt-environment-animals 三个立场全部已承认非人存在者有道德地位，**否认动物有直接道德地位的最强立场（契约论、康德式间接义务）三层全部缺席**。pt-islamic-reason-revelation 把「否认因果必然联系」直接命名为「偶因论」并归给安萨里，与 SEP al-Ghazālī §7 冲突。
- **为什么是问题**：这是稻草人化的反面版本——不是把对手写弱，而是把对手整个删掉，让页面看起来已有共识。
- **建议处理**：补上外部最强反对；核对安萨里的归属。
- **依赖**：需要来源核对
- **是否已解决**：见下方结果

---

## 二、High：哲学解释错误与知识链断裂

### H1 关系层：152 条内容边里 97 条没有任何理由

- **位置**：`data.json` 全库 `related` 字段
- **问题**：全库 194 条 related 边，剔除 42 条结构性父子边后剩 152 条内容边，其中只有 55 条能在 ledger 的 `historicalContext` 里找到对应说明，**另外 97 条在全仓库任何地方都没有一句话说明它们表达什么关系**。渲染端只输出「类型 + 标题」。
- **建议处理**：建立带语义和理由的关系层，说不出理由的边不要连。
- **是否已解决**：**结构已解决**。`relations.ts` 落地，七种关系（前置理解／易混辨析／有力反对／延伸问题／处境应用／跨传统比较／历史语境），每种都有 `mustAnswer`，每条边必须带 `why`；刻意没有「相关」兜底项，父子边不进关系层。数据见下方结果。

### H2 自由—责任—法律—正义这条链在数据层是断的

- **位置**：`data.json` 的 pt-freedom、pt-responsibility、pt-justice、pt-law
- **问题**：pt-freedom 的 related 是 `['pt-mind-self','pt-right-action','pt-law']`，**唯独没有 pt-responsibility**——而 pt-responsibility 的标题就是「自由、责任与道德运气」，pt-freedom 自己的 summary 结尾是「并为选择负责？」。pt-responsibility 与 pt-justice 互不相连；pt-justice 也没连 pt-law。
- **是否已解决**：见下方结果（关系层 + 横向链条）

### H3 三个零入度核心问题、两个零入度叶节点

- **位置**：pt-death-meaning、pt-environment-animals、pt-ai-future（`pt-boundaries.related` 只挂了四个兄弟问题域，没挂自己的子节点）；pt-jain-carvaka、pt-islamic-later（合并 related 与 historicalContext 后入度仍为 0）
- **问题**：全库没有任何节点以任何方式指向它们。
- **是否已解决**：见下方结果

### H4 「哲学家怎样改写这个问题」与「人物与原典」在 21/23 页上重复

- **位置**：`study-guides.ts` / `remaining-study-guides.ts` 的 `philosopherViews` 与 `texts`
- **问题**：同一批人、同一批著作、一一对应，内容还互相重述。pt-freedom 两块的作者／著作序列完全相同（休谟《人类理解研究》第八节／康德《道德形而上学奠基》／范·因瓦根《论自由意志》／朱熹《四书集注》）。两块在页面上相邻渲染。
- **是否已解决**：见下方结果

### H5 关键论证整体缺失

- **位置**：pt-freedom、pt-mind-self、pt-knowledge-sources、pt-religion-reason、pt-death-meaning
- **问题**：全库 grep 结果——「法兰克福 / Frankfurt」0 次、「行动者因果」0 次、「因果封闭 / 随附 / 过度决定」0 次。也就是说：
  - pt-freedom 整页三层结构建立在「本可以做别的吗／行动是否出自我／应否谴责」这个拆分上，而给出这个拆分之所以成立的经典理由（法兰克福型案例）不存在；相容论对后果论证的「回应」只是重述立场。
  - pt-mind-self 缺物理主义最有力的论证（物理域因果封闭 + 心理因果真实 + 拒绝系统性过度决定）；二元论一侧从第一人称不对称跳到本体论差异，中间的「据此」隐藏了整个推理。
  - pt-knowledge-sources 的 question 承诺回应怀疑主义，而研究层没有任何一个怀疑论论证的结构（做梦论证、缸中之脑、闭合原则），也没有任何回应；盖梯尔的来源账精确到 Case I、Case II，正文却只有三句同义转述，案例机制一次也没出现。
  - pt-religion-reason 从头到尾没有把恶的问题写成一个论证。
  - pt-death-meaning 只从「死亡是剥夺」一侧论证，威廉斯《马克罗普洛斯事件》一路完全缺席；对称性论证不署名（它是卢克莱修的），且把内格尔式与帕菲特式两条代价完全不同的回应压成一句。
- **是否已解决**：见下方结果

### H6 立场有反对、没有回应

- **位置**：`tree.ts` 的 `PhilosophyPosition` 类型；全库 100 多个立场卡
- **问题**：类型只有 name / text / objection 三个字段，没有回应字段。页面上「反对意见」是每个立场卡的最后一行，之后直接结束。伦理域 13 条反对全部无人回应。pt-art、pt-aesthetic-value、pt-interpretation 三页的 objections 段落也全部只有反对没有回应，收尾一律是「应该怎么做」的程序性要求。
- **是否已解决**：**结构已解决**。`PhilosophyPosition` 新增 `response`，页面渲染「回应」。内容见下方结果。

### H7 「反对意见」槽位被误用

- **位置**：pt-good-life[0]、pt-care[0]、pt-justice[2]、pt-law[2]、pt-political[1]、pt-art[0]、pt-buddhist 三条、pt-being 三条、pt-confucian[1]、pt-daoism[1]
- **问题**：填进去的不是哲学反驳。有的是社会学告诫（「谁的繁荣和哪种德性被视为典范，常受社会地位与时代限制」），有的是道德告诫（「重视关系不能为家长制提供借口」），有的是文本解释学提醒，有的是待办事项或万能免责声明，有的是设问。pt-art[0] 还用「表明」把一个仍有回应余地的论证写成已决结论。
- **是否已解决**：见下方结果

### H8 来源错挂到不相干的条目

- **位置**：BEC-3、LOG-1、LAN-3、CONP-1、RES-1、LIF-1/LIF-2、AFP-1、ID-1、ENV-3、REL-1
- **问题**（每条都实测过）：
  - BEC-3 是 SEP Process Philosophy，被用来支撑空／自性的判断（该判断的来源是 BEC-4 SEP Nāgārjuna）。
  - LOG-1 是 SEP Classical Logic，被用来支撑休谟与归纳问题（该条目既不讨论休谟也不讨论归纳）。
  - LAN-3 是 SEP Logic and Language in Early Chinese Philosophy，定位「导论、§2」（孔子与名的秩序），被用来支撑「命名和分类会分配可见性、资格、资源与责任」这一当代权力敏感立场；同一条还被用来同时对《论语》与《荀子·正名》作断言，而荀子在 §5 不在已核对范围内。
  - CONP-1 是 SEP Phenomenology，是 pt-western-contemporary 唯一的来源，被用来支撑「工业资本主义、殖民、战争、民主化改变了自由、劳动、语言的问题」和「把当代史写成欧洲内部流派竞争会遮蔽女性主义、反殖民、非裔、原住民思想网络」。
  - RES-1 是 SEP Moral Responsibility，被用作《论语》与《孟子》原典卡的唯一来源（该条目通篇不涉及这两部书）。
  - LIF-1/LIF-2 是 SEP Well-Being 与 Value Theory，被挂在「修身与解脱」（儒家与佛教）之下；同页有 LIF-6（SEP Mencius，§2 The Virtues and Their Cultivation）却没被引用。
  - AFP-1 是 SEP African Ethics（Kwame Gyekye 本人撰写），被用来支撑 figures 里点名的门基蒂与拉莫塞的不同理论。
  - ID-1 是 Demarginalizing the Intersection of Race and Sex（1989），被挂在〈边缘的地图〉（1991）那张卡上。
  - ENV-3 的 locator 明写「1974 年文首」（Philosophic Exchange 论文），被挂在《动物解放》（1975 年的书）那张卡上。
  - REL-1 是 SEP Natural Theology，被用作安瑟伦本体论论证的来源——而本体论论证是纯先验论证，不从世界的任何特征出发。
  - 另有 FRE-1/FRE-2 被用来支撑「决定论不同于宿命论」，而针对 FRE-1 的关键词核查结论逐字为「neither 'fatalism' nor 'fatalist' appears anywhere in this entry」。
- **是否已解决**：见下方结果

### H9 21% 的来源定位无法定位

- **位置**：131 条 ledger 来源中 28 条
- **问题**：locator 用的是「相关章节／相关段落／各节／全文」这类表述。例如 VED-1「吠檀多与自我相关章节」、ISL-1 与 ISL-2 都是「导论及翻译运动相关章节」、ACT-5「功利主义、高低快乐和自由相关章节」。而同一批文件里 BEC-6「§3.1 Flux、§3.2 The Unity of Opposites」、LIF-6「§2 The Virtues and Their Cultivation」精确到小节且核实无误——说明这不是能力问题。
- **是否已解决**：见下方结果

### H10 来源结构：93.6% 出自单一网站，中文来源为零

- **位置**：全库 219 条来源
- **问题**：ledger 131 条中 `plato.stanford.edu` 占 120 条（91.6%），data.json 88 条中占 85 条。合计 205/219（93.6%）出自 SEP。更关键的是构成：`kind` 为「原典」的 9 条**全部是西方文本**；论及儒家、道家、墨家、法家、宋明理学、正理、吠檀多、耆那、顺世、伊斯兰哲学、非洲哲学的全部条目，无一例外只引英文 SEP 综述。**全库中文来源数为 0**——《论语》《孟子》《庄子》《墨子》《韩非子》一部都没有作为来源出现，它们只出现在书目卡里，不进核验记录。
- **为什么是问题**：一个面向中文读者、明确反对「把非西方传统翻译成西方分类」的知识库，其非西方内容的全部依据是英文二手综述。这与它自己的方法论主张不一致。
- **建议处理**：这是本轮无法补齐的结构性缺口。至少要在 `coverage.ts` 里如实写明，并把原典核对列为下一轮首要工作。
- **是否已解决**：**部分**。`coverage.ts` 已如实写明这个缺口，不再声称「无未建来源账条目」。原典核对未完成。

### H11 节点职责重叠与标题冲突

- **位置**：pt-freedom / pt-responsibility；pt-being-change
- **问题**：pt-freedom「因果、自由与责任」与 pt-responsibility「自由、责任与道德运气」标题互相包含对方的关键词，两者 sources 都含 SEP Moral Responsibility，positions 也各有一条讲控制，分工不可见。pt-being-change 同时有三个标题：`data.json` 的 title 是「存在与变化」，question 是「存在与变化：理解跨时间的同一性」（不是疑问句，而其余 22 个核心问题的 question 全是疑问句），`[node]/page.tsx` 里又硬编码了 `displayTitle = '零件都换过了，还是原来的那辆车吗？'`——而 `generateMetadata` 用的是 `node.title`，所以标签页标题和 h1 不一致。
- **是否已解决**：见下方结果

### H12 figures 与 example 是死内容

- **位置**：`node-content.tsx` 的渲染条件；23 个有 study guide 的核心问题
- **问题**：`figures` 的条件是 `!guide && figures.length > 0`，`example` 被 `guide ? caseStudy : example` 三元优先，所以有精读层的 23 页里这两个字段永不渲染。净损失的例子：pt-freedom 的 figures 提到斯宾诺莎，而斯宾诺莎在 philosopherViews 和 texts 里都没有；pt-ai-future 的 example 最后半句「把一切归给『算法』反而遮蔽了可问责的人」是全域写得最好的一句概念澄清，网页上看不到；pt-interpretation 的 figures 有海德格尔，页面上没有。
- **是否已解决**：见下方结果

### H13 figures 退化成人名清单

- **位置**：pt-western-ancient、pt-western-medieval、pt-western-modern、pt-western-contemporary、pt-boundaries、pt-chinese-later
- **问题**：这些节点的「相关人物与文本」整节只有一句话，句式固定为「A、B、C、D 等 + 一句免责声明」，谓语是同义反复。原文：「笛卡尔、斯宾诺莎、洛克、休谟、康德、卢梭等围绕不同问题提出分歧答案。」——这句话对任何一组哲学家都成立。这违反 `KNOWLEDGE_BASE.md` 自订的「不能用人物名单替代正文」。更矛盾的是 pt-western-ancient 的 ledger 说「不能把苏格拉底—柏拉图—亚里士多德写成唯一主线，会遮蔽前苏格拉底、医学、修辞、女性哲学家、希腊化学派和罗马接受」，而同页 figures 只有「苏格拉底、柏拉图、亚里士多德、伊壁鸠鲁、芝诺等」。
- **是否已解决**：见下方结果

### H14 传统导航节点内容缺失且不对等

- **位置**：pt-western、pt-chinese、pt-indian
- **问题**：这三个「传统导航」节点既没有 related 也没有 sources；pt-chinese 连 notes 都没有，整个节点只有 id / title / type / summary / children 五个字段。而同级的 pt-islamic 和 pt-african 都有 related（各 4 条）和 sources（各 2 条）。结果 `/learning/philosophy/western` 这一页只有两句 summary、一条 notes 和四个子节点链接。西方线因此成为唯一不必为自身范畴给理由的传统。
- **是否已解决**：见下方结果

### H15 总览的范围声明与实际结构不符

- **位置**：`data.json` 的 pt-overview summary 与 notes[1]
- **问题**：notes[1] 写「并不试图穷尽伊斯兰、非洲、美洲原住民、日本、韩国或其他丰富传统」，summary 写「西方、中国与印度传统另设为平行的历史导航」。但树里 pt-islamic 和 pt-african 各有 3 个节点，都是与西方／中国／印度并列的一级传统导航。
- **是否已解决**：见下方结果

### H16 无障碍：TOC 锚点被遮挡、触控目标过小、元信息对比度不足

- **位置**：`being-change-entry.tsx` 的 5 个页内锚点；`.philosophy-breadcrumb a`、`.philosophy-history-links a`、`.philosophy-source-records a`、`.toc a`、`.exercises details > summary`；`.philosophy-children-type` 等四处 `--rock-gray` 文本
- **问题**：`globals.css` 有一份逐个 id 列出 `scroll-margin-top` 的名单，`#being-bicycle` 等五个锚点不在其中，点击后被吸顶 header 遮住。触控目标：项目已有 44px 约定（`.notes-categories a`、`.philosophy-related li a`、`.learning-question-link`），但面包屑（11px 内联）、历史链接、来源链接、TOC、练习区 summary 都低于 24px。`--rock-gray` (#6a6560) 在 `#0e0e11` 上是 3.35:1，在 `.philosophy-pager-link` 的 `#1a1a1f` 一端降到 3.01:1，而这些标签是 10–12px。
- **是否已解决**：**是**。五个锚点已登记 `scroll-margin-top`；上述链接补到 26px 最小高度；新增 `--meta-on-dark` (#8f8880)，在两种面上分别是 5.4:1 和 5.0:1，同时仍比正文暗。`being-change-entry.module.css` 内的两处由该文件负责。

### H17 断点之间有一条挤压带

- **位置**：`globals.css` 的媒体查询
- **问题**：哲学页实际生效的断点只有 980 和 760/761 两个数值。外层栅格（`.learning-question-groups`、`.philosophy-tradition-grid`、`.philosophy-children`）在 980 折行，而后加的研究／精读层栅格（`.philosophy-concept-grid`、`.philosophy-texts`、`.philosophy-source-records`）只写了 760。761–979 之间两列内容被塞进一条已经变窄的正文列。
- **是否已解决**：**是**。上述栅格补齐 980 断点。

### H18 浅色卡遗留在深色页面中间

- **位置**：`globals.css` 的 `.philosophy-coverage-map`
- **问题**：`> div` 背景 `#e8e5db`、dt `#19191b`、dd `#47433c`——这是浅面配色，写在全站深色化那一段之后，没有被任何深色规则覆盖。实测确认：这五张卡是 `rgb(232,229,219)`，而同页每个兄弟区块（如 `.philosophy-positions li`）都是 `linear-gradient(135deg, rgb(26,26,31), rgb(14,14,17))`。
- **是否已解决**：**是**。并入同一套深色语言。

### H19 UI 标题承诺「论证路径」，内容是「结论—标签—反问」

- **位置**：全库 51 个 positionPaths 三元组
- **问题**：实际形状是「一句直觉陈述 → 给这句直觉贴一个学派名 → 一个反问」，中间那一步没有推理只是命名。最短的例子：前项「审美体验有第一人称感受，似乎不能由规则强制」，中项「主观主义强调个人反应与偏好」（14 字，是词典释义）。pt-legitimacy / pt-justice / pt-law / pt-history-tech 四页每条都是这个形状，读者无法重建任何一条前提→推理→结论。
- **是否已解决**：见下方结果

---

## 三、Medium：容易造成误解、模板化、阅读体验

按主题归并（共 125 条，此处列主要类别）：

| 主题 | 位置举例 | 问题 | 是否已解决 |
| --- | --- | --- | --- |
| `historicalContext` 被误用 | 全库 105 条中 52 条 | 指向的是 type 为「核心问题」的节点而不是历史时段，却渲染在「放回历史线索」标题下 | 渲染层与关系层已就位，数据迁移见下方结果 |
| 13 处链接文字与目标标题不符 | 4 页把 pt-being-change 写成「什么存在？变化与同一性如何可能」 | 渲染用的是手写 label 副本 | **是**。渲染层改为取节点当前标题，label 仅作节点缺失时的兜底 |
| 「关键检验是：」100% 饱和 | 66 处 positionPaths 第三步 | 无一例外，其中 14 条根本不是检验而是被塞进句壳的断言或禁令 | 见下方结果 |
| `scope` 字段 36/36 同一模具 | 全部 ledger | 都以「本条」开头，28/36 用完全相同的「不把 X……，也不 Y……」双重否定句 | 见下方结果 |
| `orientation` 17 条中 12 条同一起手式 | 全部 study guide | 都是「先分开／先区分 N 件事」 | 见下方结果 |
| 「X 取向」自造立场命名法 | 102 个立场名中 25 个 | 用来替代真实理论名（制度论→「历史与制度取向」，外在主义→「外部主义路线」），造成立场名与内容同义反复（「形式取向重视形式」），并把不同强度的东西用同一后缀抹平 | 部分（问题域页已重写，核心问题页的立场名本轮不动以避免破坏引用） |
| 概念混淆未处理 | 「决定论≠宿命论」在全库只出现一次且从未解释宿命论；「因果≠可预测性」不在 pt-science-reality 的 confusions 里，而该页案例正是「预测很准但解释不清的模型」 | 任务文档点名的九组易混概念大部分没有落点 | 见下方结果 |
| 承重术语从未定义 | 缘起（跨 7 条目）、修养／工夫（跨 8 条目、三种叫法）、基本应得、pramāṇa、宿命论、同一论／还原论／功能主义 | 读者遇到裸词 | 见下方结果 |
| 同一术语多义未辨析 | 自主（4 个条目 4 个概念，只定义了 1 个）、人格（2 义）、实在论（3 义，只定义 1 义）、决定论（技术决定论未区分）、道德运气 vs 认知运气 | | 见下方结果 |
| 案例推演没有分析层 | 23 个核心页全部 | setup 写得具体，但 prompts 一律是三个开放问句，读者的答案永远不会暴露他在依据什么原则 | 见下方结果 |
| 人行桥案例机制没写清 | pt-right-action 的 caseStudy | 「有人」「该人」指代不清，方案一根本没交代它怎样阻止车辆而不使用那个人；而该案例的全部力量来自「转向（伤害是副效应）」与「把人当作阻挡物（伤害是手段）」的对照 | 见下方结果 |
| 归档版与活链混用 | BUD-2、MS-3、SCI-1 用 spr2017 等归档地址，同一条目的 data.json 用活链 | 没有任何地方说明为什么这几条用归档、其余一百多条用活链 | 见下方结果 |
| `source()` helper 写死 kind | 67 条来源一律标「学术综述」 | 托尔斯泰《What Is Art?》古登堡全文（不折不扣的原典）在页面上显示为「学术综述·已核验」 | **是**（kind 与 checked 都改为可显式传入） |
| 传统分支混用三条分类轴 | 西方 4 个全是时段、印度 4 个全是学派、中国 3 个时段+学派混写、伊斯兰 2 时段+1 问题 | | 未处理（改动会牵连 URL，本轮不做） |
| pt-legalism 一节装三个学派 | 「先秦：墨家、名家、法家等论辩线索」 | 三个在伦理学、语言哲学、政治哲学上分属不同问题的学派挤在一页，related 被摊成四个方向；slug 是 `legalism`（法家）与实际范围不符 | 未处理（拆分会破坏现有 URL） |
| `/core` 与 `/traditions` 两页内容重复 | `generateStaticParams` 为它们建页 | 全部内容就是 summary + notes，而这两段在总览页已原样渲染 | 未处理 |

---

## 四、Low（39 条，此处列代表）

- 23 个核心问题的 title 体例混用：7 个名词短语、16 个疑问句，在同一份目录里交替出现。
- `.sr-only` 与 `.visually-hidden` 两个功能相同的工具类并存，前者用已废弃的 `clip` 且缺 `margin: -1px`。**已解决**（`.sr-only` 改为 `clip-path` 并补 `margin`）。
- 同一条阅读列上并存 8 个不同的 `max-width`（700/720/760/780/800/820/830/880）。
- pt-being 与 pt-being-change 的 positions 高度重复（后者是前者加第三条），同一组河流思想实验在库内出现三次。
- pt-identity-oppression 与 pt-africana-race 的 positions 结构与内容高度平行，figures 都点名杜波依斯与法农。
- 同一位哲学家两种译名（`figures` 写「阿维森纳」，ledger 写「伊本·西那」）。
- 犹太哲学在整张传统地图上没有位置，迈蒙尼德只以人名出现在中世纪的 figures 里，也没有任何节点说明为什么不设。
- 四个 `prefers-reduced-motion` 块各自点名少数选择器，新组件必然漏网。**已解决**（补了一条覆盖 `.philosophy-page` / `.learning-page` 的兜底）。

---

## 五、明确不做（会造成过度设计或破坏现有 URL）

- **不拆 pt-legalism、不重排传统分支的分类轴**：这两项都需要改 slug，会破坏现有链接；收益是结构洁癖，不是学习体验。任务文档也明确要求「不要为了结构洁癖大量改 URL」。
- **不新增节点**：本轮不以「55 → 80」为 KPI。只有 Review 明确发现某个缺失节点造成知识链断裂才新增，本轮没有发现这种情况——发现的是既有节点之间的连接断裂，那属于关系层。
- **不统一 23 个核心问题的 title 体例**：改 title 会牵动面包屑、其他页的引用、metadata 和外部链接，收益不足。
- **不引入图数据库或 Graph 引擎**：知识地图用服务端渲染的 `<details>` 加 CSS 栅格实现，零 JS。
- **不修全站字体变量链**：`--font-barlow` 等由 `next/font` 挂在 `<body>`，而 `--font-body` / `--font-mono` 定义在 `:root`，导致全站退回系统字体。这是既有问题，影响全站视觉，超出本轮范围（已记录在 `docs/tasks/current-task.md`）。

---

## 六、本轮处理结果

改动清单与实测证据见 `docs/tasks/current-task.md` 的「本次改动」「验证与证据」「未完成事项」三节。这里只记每条的结论。

### 已解决

| 编号 | 结论 |
| --- | --- |
| C1 | `checked` 三态化 + `checkedOn`，页面显示真实值；`source()` helper 默认 `pending`。条目状态改为由来源状态数出来，不再用手写断言 |
| C2 | 9 条坏链接全部替换，每条都实际打开替代页面、读过章节结构再换，SEP／IEP 的 label 一并改正 |
| C3 | 两处虚构章节号改准（SEP Philosophy of Technology 无 §6.2、SEP Mohism 无 §2.1）。**审查之后又查出第三处**：`AES-2` 指向 SEP The Concept of the Aesthetic 的 §1–§3，而该条目只有 §1 与 §2 |
| C4 | `ENV-3` 死主机改址到 SUNY SOAR，经 DSpace REST 接口核对元数据 |
| C5 | 论证路径改为按立场名索引 + 构建期校验；22 个条目全部迁完，错配逐页按语义重挂 |
| C6 | 焦点环基础色改为 `var(--ember)`，CSSOM 实测生效 |
| C7 | 维护信息整块收进折叠的研究层；阅读层区块 15 → 12–13 个；新增页内目录 |
| C8 | 手写页之后接上共享尾部（跨传统比较、历史语境、继续学习、研究层）；`texts` 与概念已被手写正文吸收 |
| C9 | 「正当性」拆为 `epistemic-justification` 与 `political-legitimacy` 两张卡，各自写清易混；`pt-legitimacy` 全页术语统一 |
| C10 | `pt-environment-animals` 补上契约论与康德式间接义务（此前三层全缺）；`pt-death-meaning` 补虚无主义与威廉斯一路；安萨里不再被直接归为偶因论（据 SEP al-Ghazālī §7，他终生维持未决） |
| H1 / H2 / H3 | 关系层落地 105 条带理由的边 + 4 条横向链条；自由→责任→法律→正义链接通；41 个叶节点全部有边，孤岛为 0 |
| H4 | 两块的分工重写：philosopherViews 讲改写了什么问题，texts 讲从哪一部分读起 |
| H5 | 缺失论证补上：后果论证、法兰克福案例、行动者因果、因果排除论证、闭合原则怀疑论、盖梯尔案例机制、恶的问题的论证形式、卢克莱修对称性 |
| H6 / H7 | 立场新增 `response`，101/101 全部有回应；被误用的「反对意见」槽位逐条改写 |
| H8 | 错挂逐条修掉（BEC-3、LOG-1、LAN-3、CONP-1、RES-1、LIF-1/2、AFP-1、ID-1、ENV-3、NYA-1、REL-1/2、SCI-1/2、ART-3、JUS-5）。其中 `REL-1` 经复核**不是**错挂——SEP Natural Theology 的 §2 就是 A priori arguments、§2.1.1 有本体论论证，原 locator 指向的宗教经验论证才是问题；顺带查出「自然神学」这张概念卡的定义本身写错了 |
| H9 | 无法定位的 locator 全部改准；另新发现 LEG-2、LAW-2、LIF-1、INT-2、LAW-3、JUS-3、ACT-5/6 的定位不覆盖实际论断，一并处理 |
| H11 | `pt-being-change` 的三个标题收敛为一个：`title` 作短名，`question` 改成真正的疑问句并承载自行车提法，`[node]/page.tsx` 的硬编码删除 |
| H13 | 6 个人名清单式 figures 全部改写成有内容的对照（每人在哪个具体分歧上站在哪里） |
| H14 / H15 | 三个传统导航补齐 notes／sources／related；总览的范围声明改为与实际结构一致，并把缺口写成缺口 |
| H16 / H17 / H18 | 锚点、触控目标、元信息对比度、980 断点、深色化遗漏、减弱动效兜底、`.sr-only` 全部处理 |
| H19 | 「关键检验是：」句壳清零（此前 66 处 100% 覆盖）；三步式改为四段式，中间步是真正的推理步骤 |
| Medium 类 | `historicalContext` 的误用条目删除（语义关系已进关系层）、链接文字改用节点真实标题、`scope` 与 `orientation` 的统一模具打散、`source()` 的 kind 不再写死、九组点名易混全部覆盖、案例推演补上分析层 |

### 未解决

H10（中文来源为零、来源集中在单一站点）、`SCI-3` 与 `ID-2` 两条如实留 `pending`、若干内容需要新来源才能补、「X 取向」命名法与节点拆分／标题体例等会破坏 URL 的项目。逐条理由见 `docs/tasks/current-task.md` 的「未完成事项」。

### 审查方法本身的一个结论

本轮 277 条发现里，有一条（H8 关于 `REL-1`）在实际打开来源后被证明是审查自己判断错了。这说明「审查发现」同样需要核验，不能直接当作待修清单执行。后续几轮的整改 agent 都被要求先自己打开来源确认，再决定改不改——这个要求救回了这一条，也顺带查出了审查没发现的第三处虚构章节号。

---

# 2026-09-13 内容整改轮：定义、标签与答非所问

本轮不新增节点、不改视觉、不扩充篇数。范围是 `/learning/philosophy` 及其全部子页面——从真实内容源枚举为 **57 条路由**（55 个节点，总览住在基础路径；另加 `/map` 与 `/path`）。先修《存在与变化》，再按同一标准用 8 条并行审查线逐页处理其余内容；各线按文件划分，互不写同一个文件。

## 本轮抓的四类问题

### 1. 把某一派的主张写成了通用定义

这是本轮最主要的一类。定义只能写定义；某个流派的额外条件、作者的教学重构、有争议的解释，必须标明是谁的主张。

最严重的两处都在跨条目复用的 `concepts.ts` 里——一份定义错了，引用它的每一页跟着错：

- `epistemic-justification` 原作「使它够得上称为知识的那种理由」。若正当性按定义就使信念够得上知识，**盖梯尔问题在本库里根本无法成立**，而同库的 `epistemic-luck` 卡与 pt-knowledge-sources 正文都明写「真且有理由却仍不算知识」。已改为「在认识上被恰当支持的状态」，并说明它只是知识的条件之一。
- `personhood-community` 原作「人格是通过参与共同生活逐步达成的道德地位，不是出生即完备的属性」——这是门基蒂一路的答案，而它所服务的 pt-african-personhood 页面正文明写「吉耶凯反对这种渐进观」。定义与它要服务的页面正面冲突。已改为只写「一个人在共同体中算不算一个『人』」这一问，把渐进观标明为其中一家的主张。

同类还有：`personal-autonomy`（融贯论一路的条件被写成词义）、`pratityasamutpada`（中观的结论被写进缘起的通用定义）、`pt-science-reality` 的「经验充分性」（范弗拉森的规范主张与词义合并）、`pt-aesthetic-value` 的「品味判断」（康德的「要求同意」被写成词义，而该页第一个立场恰恰否认它）、`pt-knowledge-sources` 的「证言」（反还原论的结论被写成证言的通用刻画）。

### 2. 标签名实不符

标签本身在传达信息。本轮确立两条区分：

- **提出竞争理由 ≠ 反例。** 只有确实构造了使某主张在该情形下明显不成立的具体情形，才叫反例；只追问「为什么 A 比 B 更重要」的，是**异议**——它做的是把举证责任交回去。《存在与变化》六步走查的第 4 步据此从「反例」改为「异议」。
- **`前提` ≠ `推论`。** 标成推论的必须只由前面几步推出。`pt-freedom` 的后果论证把传递规则（Beta）标成「推论」，而它是另外提出、也正是被 McKay–Johnson 攻击的那条主张——论证的重量大半压在它上面。已改标「前提」，并另补一步做真正的合成。`pt-right-action` 的手段／副效应候选解释同样由「推论」改为「前提」。

`data.json` 的 `objectionKind` 新增 12 条「适用限制」（全库 3 → 15）：这些 objection 说的是该立场管不到哪里，回应也都以「它并不打算……」开头，却顶着和真正反驳一样的红色标签。反向也有一处：`pt-logic`「解释性推断」原标「适用限制」，但它质疑的是这种推断本身给不给得出裁决、回应也在实质上作答，已回到默认的「反对意见」。

### 3. 回应答非所问

全库共 11 处：反对攻击的是 A，回应答的是 B，靠着「回应」两个字凑成闭环。

`ArgumentBranch` 的 `objection` / `response` 因此新增可选 `label`（沿用 `tree.ts` 里 `objectionKind` 的既有做法，默认仍是「反对」「回应」）。改法统一为：改标签说清它实际是什么，并写明原反对留下什么仍然空着。**不为了凑齐「观点—反对—回应」而拼接不直接对应的材料。**

- `pt-being-change`「构成论」：泥块与雕像论证支持的是「构成不等于同一」，即该立场的第一步，并没有回答「忒修斯之船是不对称分叉，凭什么结构与功能那条线索承载同一性」。改标「支持构成论的一条理由（不直接回答上面那条反对）」。
- `pt-law` 实证主义：反对来自德沃金，回应处理的却是菲尼斯与富勒——而那两点回答都以德沃金所否认的那个分工为前提。
- `pt-knowledge-sources` 追踪论与否认 CP2 两处：反对是柠檬水／万圣节派对反例，回应讲的是对称性论证。
- `pt-religion-reason` 两处、`pt-mind-self` 实体二元论、`pt-responsibility`、`pt-right-action` 三处、`pt-legalism`、`pt-western-ancient`、`pt-knowledge-sources` 证言一段，同类处理。

其中 `pt-western-ancient` 与 `pt-legalism` 两处**找不到有力回应，就如实写没有**，不编造闭环。

### 4. 术语用未解释的术语解释

约 70 处。原则：必要术语保留、让读者逐步学会，但在它被用于后续推理之前，必须说清是什么意思、为什么这里需要它、与什么容易混。

《存在与变化》的四维主义段是样板：原文直接抛出「无限制融合」，没说为什么需要它。现补齐五个环节——引入了什么概念、为什么需要（要保证「主干加替换分支」真算一个对象）、额外接受了什么前提、怎样得到结论、**哪一步仍有争议**（无限制融合本身就是争得最凶的原则之一）。折叠或标「进阶」不等于可以不解释。

同类重点：`随附`（先给定义再使用，共 3 处）、`模态属性`、`真部分`、`算子`、`传递规则`、`可归属性／可追究性／可要求说明`、`基本应得`、`行动者因果`、`量性（prāmāṇya）`、`遍在关系`、`五蕴／补特伽罗／二谛／三性`、`法术势`、`偶因论`、`可多重实现`、`交叉性`。

## 一处事实性纠错

`pt-indian-vedanta` 的来源标签写「吉祥不二论 Viśiṣṭādvaita」。*Viśiṣṭa* 是「限定／殊胜」，「吉祥」对应的是 *Śrī*（罗摩努阇所属的室利派）——把学派名与教派归属混为一谈。已改为「限定不二论」，与 `remaining-content-ledgers.ts` 既有的「限定不二」统一。

## 关系层的两处结构改动

- `pt-logic → pt-language-meaning` 原标 `prerequisite`。该类型声称的是**理解上的依赖**，而判断有效性用不着先选定一套意义理论；它还与推荐学习路径冲突（逻辑第 2 步、语言第 4 步，且路径自述「前三步都默认用词是稳定的」）。改为 `extension`：逻辑页默认同一个词前后同义却不负责说明它凭什么成立，追问下去才走到语言页。
- 删除 `pt-aesthetic-value ↔ pt-african-method`。`distinction` 要求两页确实常被混同，而没有人会把「审美判断能否说明理由」和「什么算作非洲哲学」当成同一个问题——这条边是为填模板而造的。按「说不出理由的边不要连」删除；两端各自仍有其他边。

## 三条「审查发现」经核对是误报

沿用上一轮的结论：审查发现本身也要核验。本轮有三条按报告执行就会改错：

1. **「孤儿来源」LEG-5 / JUS-3 / JUS-5 / JUS-6**——报称正文无一引用。实际各被引用 3–4 次，引用方在 `remaining-study-guides.ts`，与 ledger 渲染在同一页。该检查是文件内的，不是页面级的。
2. **安萨里年代「不一致」**（philosopherViews 作 11–12 世纪、texts 作 11 世纪）——两个字段描述的不是同一件事：前者是人的年代（1058–1111），后者是著作年代（《哲学家的矛盾》约 1095）。两者都对。波普尔同理。
3. **邓椿「九朽一罢」出现在张彦远卡内**——卡片原文已写明是「邓椿记下的」，归属没有错。真正的问题在别处：它与传为王羲之的书论、张彦远的画史被并称「同一系脉」，而三者相隔数百年又分属书画两种文体。已改为分别交代出处，并写明可以对照着读、但不构成连续的师承线索。

## 遗留

- 本轮无网络核验，**没有把任何 `pending` 改成 `verified`**，也没有改动任何 `checked` / `checkedOn` / `url` / `locator`。
- `pt-history-tech` 谱系路径里受福柯影响的一段，TEC-1 那一节只展开到温纳与哈拉维。已在正文就地标为解释性重构并写明来源缺口，**未据此声称有来源**。
- 各线报告中另有约 20 条「需开外部页面才能确认」的存疑点（篇幅估计、若干章节号与年份、「责任缺口」的首创归属、荀子一句的校勘定位、紧缩论在 LAN-2 定位外），逐条记在 `docs/tasks/current-task.md`，未据此改动来源账。
- 三个把两条路线压成一个名字的立场名（`pt-law`「公民抗命与修复性视角」、`pt-right-action`「德性与照护取向」、`pt-good-life`「修身与解脱」）本轮只在正文写明缺口；改名会动 `data.json` 的立场名，进而影响按名索引的论证路径，留待专门处理。
