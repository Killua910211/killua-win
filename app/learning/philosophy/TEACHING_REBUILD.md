# 教学重构整改记录（2026-09-19 轮）

本轮把哲学专区从「知识资料与研究笔记的集合」改成「初学者能循序渐进读下去的课程」。
范围是 `/learning/philosophy` 全部 55 个节点页 + `/map` + `/path`，以及学习空间首页 `/learning`。

本文件分四部分：
1. 中文资料对照记录（术语、译名、原典核对、资料缺口）
2. 全站结构改动
3. 逐页整改清单（页面／路由／来源文件／整改状态／内容复审状态／运行验证状态／未解决问题）
4. 本轮未解决与明确不做的事

逐条的内容问题仍记在各条目的 `review.findings` 里；本文件只记跨页面的部分。

---

## 一、中文资料对照记录

### 1.1 检索方式与限制

本轮按主题簇组织了六条中文资料检索线（形上学与心灵／知识论与语言逻辑／伦理政治美学／中国哲学原典／印度伊斯兰非洲／科学宗教死亡与 AI），要求**实际打开页面读正文**，不得只凭搜索摘要下结论。

**已知限制，如实记录：**

- 本会话的 WebSearch 配额（200 次）在检索过程中用尽，后续核查只能用 WebFetch 直接打开已知 URL。
- **国家教育研究院乐词网（terms.naer.edu.tw）没有「哲学名词」学科词表**，同一个英文词在不同学科词表里译法不同（例如 disinterestedness 在视觉艺术词表作「无关系性」）。因此它只能作跨学科旁证，不能当哲学译名权威。
- **《中国大百科全书》网络版（zgbk.com）本轮全部条目路径失效或在付费墙后**，未能作为对照来源。
- ctext.org 拒绝自动抓取，本轮中文原典改用维基文库；中华书局、上海古籍的校勘本未能核对。要做「校勘级」定位需人工查纸本。
- 若干高质量 PDF（叶少勇《龙树中观哲学中的几个关键概念》、李常井《辛格论动物的道德地位》等）为扫描件或嵌入字体，本环境无法提取文字。

下表中标注「主线已核」的，是我在本轮亲自打开页面、核对过原文的。

### 1.2 主线亲自核对的中文来源

| 来源 | 核对内容 | 结果 |
| --- | --- | --- |
| 维基文库《荀子·儒效篇第八》 | 「道者，非天之道，非地之道，人之所以道也，君子之所道也。」 | **篇名确认为《儒效》**。原文前一句是「君子之所道也」，后一句是「君子之所谓贤者，非能遍能人之所能之谓也」。**并且该句不在荀子答秦昭王那段对话里**——它在那段对话之后的独立论述段。检索线曾报告它紧接在秦昭王问答处，经复核不成立，已按实际情况写入正文。 |
| 维基文库《荀子·性恶篇第二十三》 | 「人之性恶，其善者伪也。」「不可学、不可事而在人者谓之性，可学而能、可事而成之在人者谓之伪。」「凡古今天下之所谓善者，正理平治也；所谓恶者，偏险悖乱也。」 | 三句均确认在篇内。第三句位于「孟子曰：『人之性善。』曰：是不然」之后，是荀子对善恶的明确界定。**要点：荀子的「恶」指偏险悖乱即社会失序，不是「人天生邪恶」；「伪」指人为，不是虚伪。** |
| 中华思想文化术语传播网（外语教学与研究出版社）「无为」条 | 「无为」释义 | 页面原话：「『无为』并不是不作为，而是更智慧的作为方式，通过无为来达到无不为的结果。」三要点为权力自我节制、顺应本性、发挥自主性。引例《老子·二章》「是以圣人处无为之事，行不言之教」、《老子·三十七章》「道常无为而无不为」。 |
| 陈弘毅《对古代法家思想传统的现代反思》 | 法家与法治的关系 | 原话：「法家对于法的认识大致上是符合上述这种『形式的、浅度的』法治观的。」同时列出与实质法治相背离之处：重刑、愚民、压制议论、文化专政、狭隘社会目标、专制王权、片面法律观、偏颇人性论。**结论是分层的**，不能压成「法家是／不是法治」任何一边。 |
| 華文哲學百科《認知證成及其結構》（國立中正大學，李國揚） | justification / internalism / externalism 的中译 | 词条标题即「認知證成」；界定句为「『證成』指的是那些有程度可言、擁有趨真性、促進認知目的、以及合理（法）化信念的性質」。internalism／externalism 作「內在論／外在論」。 |
| 潘磊《物化与排他——关于「证言非正义」的争论及启示》（武汉大学哲学学院，《自然辩证法通讯》2023年第7期） | epistemic / testimonial / hermeneutical injustice 的中译 | 正文用「认知不正义」「证言不正义」「解释不正义」；界定「证言不正义」为「因负面身份偏见而导致的可信度贬损」。注意该文**标题**用的是「证言非正义」，《自然辩证法通讯》的专栏名也是「认知非正义」——同一刊物内部「不正义／非正义」两种写法并存。 |

### 1.3 本轮执行的译名改动

| 旧 | 新 | 理由 |
| --- | --- | --- |
| 认知正当性 | **认知证成**（首现注「也译作辩护、确证」） | 中文学界通行「证成」；本站另有政治哲学的「正当性」（legitimacy），两词在同一站内撞车，而 justification 说的是「有理由、有证据支持」，不是「在道德或法律上站得住」。 |
| 内部主义／外部主义 | **内在论／外在论**（注「大陆文献多作内在主义／外在主义」） | 「内部主义」是按词面直译出来的说法，在实际读到的中文哲学资料里一次都没有出现。 |
| 认识不公 | **认知不正义** | 中文学界一律用「不正义／非正义」，没有一家用「不公」；Fricker 的论证支点正是把它接到正义论传统上，译成「不公」会削掉这层理论负载。 |
| 解释不公 | **解释不正义**（注「另见解释学不正义、解释非正义」） | 同上。 |
| 最佳解释推断 | **最佳解释推理** | 「推断」在中文资料里没有出现。 |
| 工具中立论 | **技术工具论** | 中文文献与「技术实体论」对举。 |
| 责任缺口 | **责任鸿沟** | 「责任缺口」在实际读到的中文文献里没有出现；「责任鸿沟」见东北大学学报（社科版）2024、广西师大学报 2024。 |
| 照护伦理（作为理论名） | **关怀伦理**（「照护」保留给具体的照料活动，并在页面上写明这层分工） | 中文学界通行「关怀伦理（学）」。 |
| 公民抗命（立场名） | **公民不服从** | 大陆学术文献几乎一致用「公民不服从」；「公民抗命」是港台公共讨论用语。改名同步了 `data.json` 的立场名与 `remaining-study-guides.ts` 里 `positionArguments` 的索引键。 |
| 物种主义 | **物种歧视** | 《自然辩证法通讯》2023 动物伦理专题用「物种歧视」。 |
| 制度定义（艺术） | **体制论**（注「又译惯例论」，并说明这组译名分歧对应丹托与迪基之争） | 译名分歧忠实反映实质分歧，不合并。 |

### 1.4 加说明而不改名的几处

- **功利主义**：保留（大陆既定术语），首现说明「此处的『功利』指 utility（效益），不是日常骂人的『功利』；台港多译『效益主义』」。
- **libertarianism 消歧**：政治哲学的「自由至上主义」与自由意志问题的「自由意志论」是同一个英文词、两个不同概念，中文正是靠不同译名区分——两处各写一句。
- **德性／美德／德行**：中文学界有公开争论（陈真《哲学研究》2016 主「美德」，龚群《社会科学辑刊》2017 撰文商榷主「德性」，台湾条目用「德行」）。本站用「德性」，但写明这是有争论的一方。
- **sentience 感受能力**：保留，注「学术文献多写『感受性』」，并交代 pain / suffering 在中文常被一并压成「痛苦」。
- **鉴赏判断**：康德语境下用「鉴赏判断」，泛指仍用「审美判断」。
- **证言**：保留，首现说明「哲学里的证言不限于法庭作证，指一切来自他人言说的信息」——中文「证言」几乎纯法律语感，这是中文读者进入这个概念的第一道障碍。
- **anekāntavāda「多面性」**：保留。检索线建议改作「非一端论」，但该建议的来源页本轮未能打开，只有搜索摘要级证据，不足以据此改名。已在正文补上字面拆解（an-eka-anta ＝非·一·端）并写明中文译名未统一。**中文维基把 syādvāda 译作「相对论」，与物理学撞车，本站不采用。**
- **正理学派人名**（Gautama、Vātsyāyana、Udayana、Gaṅgeśa）：继续使用拉丁转写。本轮查到的中文译名互相冲突（Gaṅgeśa 见「克伽自在」「甘格霞」「恒河自在」三种），补中文译名等于替本库选定一套转写方案，需要来源支持。已在页面上写明这一点。
- 经核查与中文学界一致、**保留不改**的：后果论、义务论、道德运气、正当性、自由至上主义、无利害、原初状态、无知之幕、承认、法律实证主义、双重效应、神义论、恶的问题、不可通约性、可证伪性、范式、悲观归纳、无奇迹论证、剥夺论、证据主义、技术决定论、科学实在论、解释学、健全（soundness）、可靠论、乌班图、缘起、无我、空、量／现量／比量。

### 1.5 中文讲解方式的采纳

以下讲法来自中文资料，本轮写进了正文：

- **「空」必须先定义「自性」再讲**。中文的日常语感（空＝没有）一定会抢跑，所以顺序是：先说「自性」指「不依靠因缘就能生起」，再说「空就是没有自性」。汉语佛学内部对这个误读有现成的标签——**恶取空**，比「空不是虚无主义」这种辩护式说法有力。
- **「无我」与「非我」的差别**用日常句式讲：「张三不是钱」和「张三没有钱」是两回事。
- **荀子「性恶」**用他自己的定义句破题（「所谓恶者，偏险悖乱也」），比任何「不要误解为……」的提醒都省力。
- **「格物」的分歧压在一个字的两训上**（朱熹训「至／穷」，王阳明训「正」），先训字再讲人。
- **「天」每次出现先归类**（自然之天／主宰之天／义理之天／运命之天），而不是给一个统一定义。
- **因明先讲目标差异再讲结构**：因明从「论证前提的真」立论，三段论从「论证形式的有效」立论；先讲结构对照会让读者以为因明是三段论的粗糙版。
- **弗雷格用「启明星／长庚星」**而不是直译的「晨星／暮星」——后者在中文里不是固定搭配，读者要先回译成英文才懂。
- **伽达默尔的 Vorurteil 用「先见」配法官判案的比喻**：译成「成见／偏见」在中文里全是贬义，学生会以为他在提倡带偏见读书。

### 1.6 中英解释不一致、本轮并列写出而不合并的地方

- **荀子的「道」**：SEP 把《儒效》「道者，非天之道」与《天论》的观时序段并列，视为文本内部张力；中文注疏传统则指出《儒效》那句有特定语境，所指是「先王之道／人道」。两种处理并列写出。
- **「二谛」**：英文的 two truths / two levels 框架回到中文常被读成「两个都对，只是层次不同」；依《无畏疏》的定义，世俗谛是「世人不知是颠倒而见诸法生起」，只对世人构成谛理。方向相反，不能合并。
- **asālat al-wujūd（存在的首要性）与萨特的「存在先于本质」**：中文维基《伊斯兰哲学》直接把两者等同并挂到存在主义名下。萨德拉问的是「存在与本质哪个是真实的」，萨特问的是「人有没有被预先规定的本性」——本站沿用「存在的首要性」，并写明这一层。
- **「唯识」**：玄奘把 vijñāna 与 vijñapti 都译作「识」，中文里看不出「唯识」是「只有识」还是「只有了别」。这是中文自身的翻译遗留，不是英文造成的。
- **epistemic injustice 三件套**：中文学界至少四套译法且尚未收敛（2021–2023 年才集中引入），任何选择都要写「另见」。

### 1.7 中文资料确实不足的地方（不因此跳过整改，但如实记录）

- **伊斯兰哲学的中文原典译本几乎空白**。检索线通读了商务印书馆《汉译世界学术名著丛书》650 种书目，与伊斯兰／波斯哲学相关的只有伊本·西那《论灵魂》与昂苏尔·玛阿里《卡布斯教诲录》两种；安萨里《哲学家的矛盾》《圣学复苏》、伊本·鲁世德《矛盾的矛盾》、苏赫拉瓦迪《照明哲学》、穆拉·萨德拉《四次旅程》均不在其中。本站因此无法给中文读者指向可读的原典中译。
- **非洲哲学中文资料极少**。《汉译名著》书目中没有任何非洲条目；系统译介基本只有基姆勒《非洲哲学》（王俊译，人民出版社 2016）一种。门基蒂与盖克耶关于「人格是否获得的」之争在中文里只有转述与编译，没有任何一方的原文中译，也没有中文专题研究。
- **耆那教哲学**的中文公开资料很薄，且现有译名有害（中文维基把 syādvāda 译作「相对论」）。
- **死亡与生命意义**一簇的中文**学术**公开全文最薄，可读材料多为台港科普平台。
- **苏赫拉瓦迪、穆拉·萨德拉的中文译名与生卒年均未定型**（后者有 1571–1636 与 1571–1640 两说），本站只写「17 世纪」。
- **objective list theory（客观清单论）** 没有专门的中文学术讨论，本站译名未能核实。
- **evidentialism（证据主义）** 找不到中文学术全文页，可读的中文来源全部是护教学网站，立场性强，未作依据。
- **defeater、supervene、truth-conditions** 的中文通行译名本轮无页面证据，标为未能核实。

---

## 二、全站结构改动

本轮没有新增节点、没有改路由、没有动数据库。结构改动集中在「读者按什么顺序看到什么」。

### 2.1 条目页新增三层（`CoreEntryLedger` 新字段）

| 字段 | 渲染位置 | 解决的问题 |
| --- | --- | --- |
| `entry: { scene, turn }` | 「问题为何会出现」的最前面 | 每一页原来都从概括开始，而那一段的第一句往往已经在用本页要解释的术语。现在先给一个不含术语的具体情形，再由它逼出问题。 |
| `assumed: { point, recap, nodeId? }[]` | 页首「读这一页之前」 | 关系层的 `prerequisite` 只有十二条、且同一对节点之间只能有一条边，覆盖不到「本页会用到、要到别处才展开」的那些具体区分。每条附一句回顾，不跳转也能继续读。 |
| `takeaway: { question, split, settled, open }` | 页尾、「带着问题继续读」之前 | 读者读完十几个区块后，原来没有任何地方帮他把分歧收拢回来。四问分别是：这一页在问什么、分歧落在哪里、现在可以确定什么、还不能确定什么。 |

41 个有来源账的条目页全部补齐 `entry` 与 `takeaway`；`assumed` 按需要写，19 页有。

### 2.2 区块顺序：概念解释提到「定义与边界」之前

原顺序是 问题为何会出现 → 定义与边界 → 阅读提醒 → **先把问题拆开（概念解释）** → 论证地图 → 主要立场……

问题在于「定义与边界」几乎每一页都已经在用这些概念做推理。自由那一页的第二块就同时出现相容论、不相容论、决定论、宿命论、基本应得和责任的三种意义，而它们的解释要再往下翻一屏才到。

新顺序是 问题为何会出现（含具体入口）→ **先把问题拆开** → 定义与边界 → 阅读提醒 → 论证地图 → 主要立场 → 有力反对及回应 → …… → **回到问题** → 带着问题继续读 → 继续学习。

页内目录、总览页上那张「条目页长什么样」的表、以及各页精读层的承接句都按这个顺序对齐过。

### 2.3 前置理解从页尾移到页首

关系层的 `prerequisite` 边原本只出现在页尾「继续学习」的第一组——读完之后才告诉读者「其实你该先读那一篇」。现在出边那一份提到正文最前面，与来源账的 `assumed` 合并成「读这一页之前」；反向的「以本页为前置的问题」仍留在页尾，那属于读完之后的去处。

### 2.4 导航页补上导语与建议阅读顺序（`PhilosophyNode.guidance`）

十四个导航页（总览、两个目录分组、六个问题域、五条传统导航）原来没有研究层，直接从「主要立场」或子节点清单开始——读者从学习空间点进「1. 存在、世界与人」，第一屏就是「自然连续论」这样一个没有铺垫的名字。

`guidance.lead` 给出这一组问题在追问什么、为什么放在一起；`guidance.order` 给下一级一个建议顺序，并逐条写明它为什么排在这里。构建期校验要求 `order` 与下一级节点一一对应，不重不漏。

顺序调整最大的两处：

- **知识域**：原书写顺序是「知识来源 → 逻辑 → 语言」，改为**逻辑 → 知识来源 → 语言**。知识来源那一页要讨论归纳问题与「哪种解释更好」，用的正是逻辑页立起来的区分。
- **美学域**：原顺序「艺术 → 审美判断 → 解释」，改为**解释 → 艺术 → 审美判断**。关系层早就声明了 `pt-art → pt-interpretation` 与 `pt-aesthetic-value → pt-interpretation` 两条前置边，而目录顺序与它相反。
- 伦理域改为「对的行动 → 好生活 → 责任与道德运气 → 关怀」，边界域按「需要多少前面几域的准备」重排。

展示顺序统一走 `orderedChildren()`：目录页、条目页的下一层、学习空间首页、知识地图、页底分页器都用它，避免出现「这一域第 02 篇」与「点下一页却跳到另一篇」的矛盾。

### 2.5 推荐学习路线：主线加一步，另加支线层

- 主线由 10 步增为 **11 步**，在「什么是值得过的生活」与「自由、平等与正义如何协调」之间插入「何种权力与制度是正当的」。原来的路线跳过了正当性直接进入正义，而政治域自己的建议顺序是「正当性 → 正义」，两处不自洽；而且「有力量让你服从」与「有资格要求你服从」这个区分，后面讲守法与抗命时一直要用。
- 新增 `branches` 层：主线之外的 **12 个核心问题**按「你关心什么」分成五组，每条写明**它默认你已经有哪个区分、那个区分在主线第几步给出**。构建期校验要求支线不重不漏地覆盖主线之外的全部核心问题——漏一个，读者走完主线就再也遇不到它。
- 分页器：两个语境（同域次序、路线第 N 步）给出同一对前后页时合并成一行，并把两个语境都写出来。原来这种情况会抛错，而本轮调整顺序后它成了正常情况。

### 2.6 修掉的两个既有渲染缺陷

- **《存在与变化》吞掉具体入口**：`node-content.tsx` 对该页提前 return 到手写组件，而 `entry` 只写在下面的通用模板里。与当年「本页范围」漏在提前 return 之外是同一个毛病。
- **行内概念注解的「展开读」指向不渲染该卡的页面**：`ConceptGloss` 写死取 `nodeIds[0]` 并接 `#concepts` 锚点，但概念卡只从精读层的 `conceptRefs` 渲染。实测五条概念的 `nodeIds[0]` 那一页根本不显示这张卡（`personal-autonomy` 指向自由页而实际渲染它的是好生活页，`pratityasamutpada` 指向佛教页而实际是心灵页，`self-cultivation` 指向儒家页而实际是好生活与解释页，`race-ontology` 指向非裔哲学页而实际是身份与压迫页），点过去锚点落空、页面上也没有那张卡。现在先找真正会渲染它的页；找不到就退回第一个节点并且不带锚点。

### 2.7 新增的构建期校验（`pnpm test:philosophy` 现为 7 模块 17 条）

- 导航页的阅读顺序说明与下一级节点一一对应；
- 来源账「默认已知」条目都写了回顾、不自指、目标节点存在；
- 推荐路线的每一步都指向存在的节点；
- 支线不重不漏地覆盖主线之外的全部核心问题。

---

## 三、逐页整改清单

共 **58 条路由**：55 个节点页（总览住在 `/learning/philosophy` 本身）+ `/map` + `/path`，另加学习空间首页 `/learning`。

- **本轮有内容改动**：55 个节点页全部 + 3 个视图页 = **58 条全部**。
- **具体入口／回到问题**：41 个有来源账的条目页全部补齐。另 14 个导航页没有来源账，改为补「导航导语」（`guidance`）。
- **默认已知**：28 页写了；其余 13 个有来源账的页面经判断不必前置，理由记在各自的 `review.findings` 里。
- 「本轮改动」一栏列的是本轮**实际被编辑过**的内容源；标「仅随全库译名统一」的，是只被那一批词替换扫到、没有别的改动。

列名说明：**具体入口**＝`entry`；**默认已知**＝`assumed`；**回到问题**＝`takeaway`；**导航导语**＝`guidance`。

| # | 路由 | 类型 | 页面 | 内容源 | 具体入口 | 默认已知 | 回到问题 | 导航导语 | 本轮改动 |
| --: | --- | --- | --- | --- | :-: | :-: | :-: | :-: | --- |
| 1 | `/learning/philosophy` | 总览 | 哲学体系树总览 | data.json | — | — | — | 有 | data.json |
| 2 | `/learning/philosophy/core` | 目录分组 | 核心问题｜主学习路径 | data.json | — | — | — | 有 | data.json |
| 3 | `/learning/philosophy/being` | 问题领域 | 1. 存在、世界与人 | data.json | — | — | — | 有 | data.json |
| 4 | `/learning/philosophy/being-change` | 核心问题 | 存在与变化 | data.json<br>content-ledger.ts<br>study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts<br>being-change-entry.tsx | 有 | 无 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts<br>being-change-entry.tsx |
| 5 | `/learning/philosophy/mind-self` | 核心问题 | 心灵、身体与「我」 | data.json<br>content-ledger.ts<br>study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 6 | `/learning/philosophy/freedom` | 核心问题 | 因果、自由与责任 | data.json<br>content-ledger.ts<br>study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 7 | `/learning/philosophy/knowledge` | 问题领域 | 2. 知识、理由与语言 | data.json | — | — | — | 有 | data.json |
| 8 | `/learning/philosophy/knowledge-sources` | 核心问题 | 知识从哪里来，边界又在哪里？ | data.json<br>content-ledger.ts<br>study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 9 | `/learning/philosophy/logic` | 核心问题 | 什么是好推理与有效论证？ | data.json<br>content-ledger.ts<br>study-guides.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 10 | `/learning/philosophy/language-meaning` | 核心问题 | 语言如何承载意义与真理？ | data.json<br>content-ledger.ts<br>study-guides.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 11 | `/learning/philosophy/ethics` | 问题领域 | 3. 行动、价值与伦理 | data.json | — | — | — | 有 | data.json |
| 12 | `/learning/philosophy/good-life` | 核心问题 | 什么是值得过的生活？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 13 | `/learning/philosophy/right-action` | 核心问题 | 什么使行动成为对、错、善或恶？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 14 | `/learning/philosophy/responsibility` | 核心问题 | 自由、责任与道德运气 | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts<br>argument-maps.ts<br>thought-experiments.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 15 | `/learning/philosophy/care` | 核心问题 | 关系、照护与依赖 | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 16 | `/learning/philosophy/aesthetics` | 问题领域 | 4. 美、艺术与理解 | data.json | — | — | — | 有 | data.json |
| 17 | `/learning/philosophy/art` | 核心问题 | 什么是艺术？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 18 | `/learning/philosophy/aesthetic-value` | 核心问题 | 审美判断能否说明理由？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 19 | `/learning/philosophy/interpretation` | 核心问题 | 我们如何理解文本、传统与他人？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 20 | `/learning/philosophy/political` | 问题领域 | 5. 共同生活、权力与历史 | data.json | — | — | — | 有 | data.json |
| 21 | `/learning/philosophy/legitimacy` | 核心问题 | 何种权力与制度是正当的？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 22 | `/learning/philosophy/justice` | 核心问题 | 自由、平等与正义如何协调？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 23 | `/learning/philosophy/law` | 核心问题 | 法律、守法义务与公民不服从 | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts<br>argument-maps.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 24 | `/learning/philosophy/history-tech` | 核心问题 | 历史、文化与技术怎样塑造共同生活？ | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts<br>remaining-study-guides.ts |
| 25 | `/learning/philosophy/boundaries` | 问题领域 | 6. 边界、处境与未来 | data.json | — | — | — | 有 | data.json |
| 26 | `/learning/philosophy/religion-reason` | 核心问题 | 信仰、理性与恶的问题 | data.json<br>content-ledger.ts<br>study-guides.ts<br>argument-maps.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 27 | `/learning/philosophy/death-meaning` | 核心问题 | 死亡会使生命失去还是获得意义？ | data.json<br>content-ledger.ts<br>study-guides.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 28 | `/learning/philosophy/science-reality` | 核心问题 | 科学如何解释世界，又有什么边界？ | data.json<br>content-ledger.ts<br>study-guides.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 29 | `/learning/philosophy/environment-animals` | 核心问题 | 道德共同体应包括动物与自然吗？ | data.json<br>content-ledger.ts<br>study-guides.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 30 | `/learning/philosophy/identity-oppression` | 核心问题 | 身份、压迫与认知不正义如何形成？ | data.json<br>content-ledger.ts<br>study-guides.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 31 | `/learning/philosophy/ai-future` | 核心问题 | 人工智能能否行动、负责或拥有道德地位？ | data.json<br>content-ledger.ts<br>study-guides.ts<br>thought-experiments.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts<br>study-guides.ts |
| 32 | `/learning/philosophy/traditions` | 目录分组 | 传统地图｜平行历史导航 | data.json | — | — | — | 有 | data.json |
| 33 | `/learning/philosophy/western` | 传统导航 | 西方哲学｜历史导航 | data.json | — | — | — | 有 | data.json |
| 34 | `/learning/philosophy/western-ancient` | 历史时段 | 古典与希腊化时期 | data.json<br>remaining-content-ledgers.ts<br>comparisons.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 35 | `/learning/philosophy/western-medieval` | 历史时段 | 中世纪与跨文化传译 | data.json<br>remaining-content-ledgers.ts<br>comparisons.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 36 | `/learning/philosophy/western-modern` | 历史时段 | 近代：知识、科学与政治秩序 | data.json<br>content-ledger.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts |
| 37 | `/learning/philosophy/western-contemporary` | 历史时段 | 19世纪至当代的多条线索 | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 38 | `/learning/philosophy/chinese` | 传统导航 | 中国哲学｜历史导航 | data.json | — | — | — | 有 | data.json |
| 39 | `/learning/philosophy/confucian` | 传统线索 | 先秦：儒家及其伦理—政治问题 | data.json<br>content-ledger.ts<br>comparisons.ts | 有 | 无 | 有 | — | data.json<br>content-ledger.ts |
| 40 | `/learning/philosophy/daoism` | 传统线索 | 先秦：道家与自然、行动问题 | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 41 | `/learning/philosophy/legalism` | 传统线索 | 先秦：墨家、名家、法家等论辩线索 | data.json<br>remaining-content-ledgers.ts<br>comparisons.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 42 | `/learning/philosophy/chinese-later` | 历史时段 | 两汉至近现代：传承、佛教与重构 | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 43 | `/learning/philosophy/indian` | 传统导航 | 印度哲学｜历史导航 | data.json | — | — | — | 有 | data.json |
| 44 | `/learning/philosophy/indian-vedanta` | 传统线索 | 奥义书与吠檀多等传统 | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 45 | `/learning/philosophy/buddhist` | 传统线索 | 佛教哲学：苦、无我、缘起与认识 | data.json<br>content-ledger.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts |
| 46 | `/learning/philosophy/nyaya` | 传统线索 | 正理、胜论及认识—论辩传统 | data.json<br>content-ledger.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>content-ledger.ts |
| 47 | `/learning/philosophy/jain-carvaka` | 传统线索 | 耆那教、顺世论与多元论辩 | data.json<br>remaining-content-ledgers.ts<br>comparisons.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 48 | `/learning/philosophy/islamic` | 传统导航 | 伊斯兰哲学｜历史导航 | data.json | — | — | — | 有 | data.json |
| 49 | `/learning/philosophy/islamic-translation` | 历史时段 | 翻译运动与哲学学科的形成 | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 50 | `/learning/philosophy/islamic-reason-revelation` | 传统线索 | 存在、理智与启示的古典论辩 | data.json<br>remaining-content-ledgers.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 51 | `/learning/philosophy/islamic-later` | 历史时段 | 后古典传统、现代性与改革 | data.json<br>remaining-content-ledgers.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 52 | `/learning/philosophy/african` | 传统导航 | 非洲与非裔哲学｜问题导航 | data.json | — | — | — | 有 | data.json |
| 53 | `/learning/philosophy/african-method` | 方法论争论 | 什么算作非洲哲学？ | data.json<br>remaining-content-ledgers.ts | 有 | 无 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 54 | `/learning/philosophy/african-personhood` | 传统线索 | 人格、共同体与 Ubuntu | data.json<br>remaining-content-ledgers.ts<br>comparisons.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 55 | `/learning/philosophy/africana-race` | 传统线索 | 种族、殖民与解放 | data.json<br>remaining-content-ledgers.ts | 有 | 有 | 有 | — | data.json<br>remaining-content-ledgers.ts |
| 56 | `/learning/philosophy/map` | 视图 | 哲学知识地图 | map-view.tsx<br>relations.ts<br>concepts.ts | — | — | — | — | relations.ts<br>concepts.ts<br>map-view.tsx |
| 57 | `/learning/philosophy/path` | 视图 | 推荐基础学习路径 | learning-path.ts<br>path/page.tsx | — | — | — | — | learning-path.ts<br>path/page.tsx |
| 58 | `/learning` | 视图 | 学习空间首页 | app/learning/page.tsx<br>subjects.ts | — | — | — | — | app/learning/page.tsx |
节点 55｜有来源账 41｜具体入口 41｜回到问题 41｜默认已知 28｜导航导语 14｜本轮有内容改动的节点 55


### 运行验证状态（全部 58 条路由一次性检查，见第四节的证据）

| 检查 | 范围 | 结果 |
| --- | --- | --- |
| HTTP 状态 | 58 条路由 | 全部 200，0 失败 |
| 未解析的 `[[concept-id\|…]]` 标记 | 58 条路由的可见文本 | 0 |
| `undefined` / `NaN` | 58 条路由的可见文本 | 0 |
| 页内目录死锚点 | 58 条路由 | 0 |
| 任意站内锚点死链 | 58 条路由 | 0 |
| 页内目录顺序与正文区块顺序一致 | 抽查核心问题页 | 一致 |
| 概念卡「也在这些条目里被讨论」自指 | 58 条路由 | 0（本轮修掉 25 条） |
| 具体入口里出现哲学行话 | 41 个条目页 | 0 |
| 浏览器控制台错误 | 抽查 `/responsibility`、`/path`、`/map` | 无 |
| 375px 无横向溢出 | 抽查 `/freedom`、`/responsibility`、`/knowledge`、`/path`、`/legalism`、`/mind-self` | 无溢出 |

---

## 四、自我复审：发现了什么、怎么修的、复验结果

### 4.1 复审方式

改写完成后跑了**四条零基础阅读复审线**，覆盖全部 58 条路由，每条线都按页面实际渲染顺序逐段读（读的是 `curl` 下来的渲染文本，不是源码——源码里有大量不渲染的字段，读源码会误判）。复审口径分四块：零基础阅读（前提是否先出现、有没有用陌生术语解释陌生术语、结论有没有跳步）、哲学内容（是否为通俗而失真、反对与回应是否名实相符）、跨页一致（术语、顺序、指路）、渲染（空块、死锚点、未解析标记）。

另有一份机器辅助扫描，只查机器能判定的部分：未解析标记、`undefined`、禁用例子、具体入口里的行话、跨页重复句、超长句、跳步连接词候选。它不能代替逐页阅读，误报率高的模式（如「是被……」）已经剔除。

### 4.2 复审抓到的问题类型与处理

复审共报告约 130 条，按四类处理：

**第一类：本轮译名统一自己留下的残骸（8 处，全部修）**
这是最要紧的一类，因为页面上呈现为**明显的自相矛盾**，读者一眼就能看出，对整库可信度的损伤比一个没解释的术语大得多。例如：
- `/knowledge` 两个立场卡写着「这一侧现在多称内在论，大陆文献也作内部主义，**本栏标题用的是后一个译名**」——而栏标题写的是「内在论」；同一句括号里又说「本站统一写内在论」，自我否定。
- `/identity-oppression` 的概念卡写「本站**此前**把它译作「认知不正义」……仍沿用**旧译**」——而本页标题、卡片名、正文、书名全部都是「认知不正义」，说反了。
- `/legitimacy` 指着卡说它「**仍写作**「认知正当性」」，而卡上写的是「认知证成」。
- `/history-tech` 两处指路让读者去卡上找已经不存在的「工具中立论」，而卡上写的是「技术工具论」。
- `/logic`、`/knowledge-sources` 的概念角度句把本站明令废弃的「正当性」列为该词的正式译名，与同一张卡的辨析栏互相取消。

**第二类：读者读不出来的字母串（约 25 处，全部修）**
- 论证地图里的西方人名全部没译（`van Inwagen`、`Lewis`、`Pereboom`、`Hart`、`Dworkin`、`Kuhn`……），而同一页正文用的是中文译名——读者不会把 `Lewis` 和「刘易斯」认成一个人；`Adams 1985` 这类裸年份书目更是完全读不出是什么。
- `falsafa`、`kalām`、`faylasūf` 在伊斯兰三页里出现七次，页面说「按原音写出」，但对中文读者恰恰没有做到原音。已改为「法尔萨法（falsafa）」「凯拉姆（kalām）」，并保留「本页不译成哲学、神学」的理由；`faylasūf` 整个删掉（它是用 `falsafa` 解释 `falsafa` 的派生词，对论证没有贡献）。
- `māyā`、`ātman` 在讲了整页「幻」「我」之后突然改用拉丁；`brahman`、`karman` 夹在中文句子里；先秦的「法」写作 `fa`，与同页的「法、术、势」自己不一致。
- **伊本·西那与阿维森纳在同一页上被当成两个人**（`/islamic-later`、`/western-medieval`），而它们是同一个人的阿拉伯语名与拉丁化名。

**第三类：教学结构上的实质缺陷（约 30 处，全部修）**
- `/responsibility` 写「这**三条**反对」，而该栏实际只有两条。
- `/justice` 的 `orientation` 许诺「后面的边界、立场与**论证地图**」，而本页根本没有论证地图。
- `/justice` 页尾把分歧放在开篇明确叫读者**不要**放的那一层（开篇：「正义的争论很少真的发生在『要不要平等』这一层」；收尾：「分歧落在『平等本身有没有价值』这一步」）。
- **页尾「回到问题」的分歧一栏换了一套分类**，读者刚读完的立场在总结里消失——`/good-life` 的「修养取向」、`/legitimacy` 的「共和」与「德治」、`/aesthetic-value` 给标题下否定回答的那一条，都被系统性地排除在页面总结之外。五页已改为先用本页立场名收一遍再讲分歧。
- `/history-tech` 的页尾四问从头到尾只谈技术，而页面标题的前一半是「历史」，立场 01 整条在争历史有没有方向。
- `/art` 的「布里洛盒子」是整条路线的全部证据，却从头到尾没说它是什么。
- `/interpretation` 明说「那本笔记上的麻烦**有一个专门的名字**」，然后不给名字（名字要到三十行后的概念卡才出现）。
- `/chinese-later` 的开篇说「同一句话，**八个字**，两千年里一直被引」，而这八个字整页不揭晓，后面四次引用因此全部落空。
- `/legalism` 的墨家与名家两段连用「三表」「墨辩」「类、比、援、推」，一个都不解释——这是本页三条线索里两条的全部实质内容。
- `/indian-vedanta` 的「梵」与「解脱」是全页的中心词和全部动机，却都只有限定、没有正面说明（现代汉语里「解脱」就是「松一口气」，读者看不出为什么需要一整套理论）。
- `/africana-race` 对 `Africana` 的「定义」用了「三阶的、元哲学的伞概念、组织性统览」四个术语——全库唯一一处**解释句本身比被解释的词更难**。
- 精读层 7 页的「本页先解释的 N 个词」数目与实际渲染的卡片数不符，「第一个／前两个」指向的也不是那几张卡；`/history-tech` 因此把「最常见、最容易不自觉接受的那一层」按到了技术决定论头上，而这句话描述的是排第二的技术工具论——整页的坐标系从第一步就装反了。已全部改为不依赖位置的按名点法。

**第四类：组件层缺陷（6 处，全部修）**
见第 2.6 节与下表。

### 4.3 复审抓到、经复核判定**不改**的

- **`moral-luck` 概念卡的 `short`**：复审指出「定义里塞进了争论本身」。复核后发现该条来源的 `supports` 明写「『正确』这一半是本条 short 的依据」——SEP 的界定里 *correctly* 就是定义的一部分。按复审给的替换句会删掉这个限定。改法改为把断定留在定义里、把争点指名，矛盾消掉而限定保住。
- **`/confucian` 把「恶」训偏险悖乱、「伪」训人为讲了四遍**（复审列为「可选」）。这三处分别由本轮既有的定向修复加上去，`takeaway.settled` 又是「收拢已定下的区分」这一栏的本职；删其中任何一半都会回退上一轮的修复。
- **约 20 处「来源编号当句子主语」**（`LEG-1`、`ART-1`、`AES-1` 之类）。只改了复审点名的五处；全文件扫一遍属于本轮未分派的范围，且每处都要配一条审查记录，会把记录冲淡。留给下一轮。
- **`anekāntavāda` 改译「非一端论」**：建议本身有道理，但其来源页本轮未能打开，只有搜索摘要级证据。保留「多面性」并补上字面拆解与「中文译名未统一」的说明。

### 4.4 修复之后的复验

修复完成后重跑了一遍机器扫描与全路由检查（结果见第三节末尾那张表），并另外做了两件事：

1. **译名残留全库扫描**：`认知正当性`／`内部主义`／`外部主义`／`认识不公`／`解释不公`／`证言不公`／`最佳解释推断`／`工具中立论`／`责任缺口`／`照护伦理`／`公民抗命`／`物种主义`／`耐存论`／`延存论`／`法兰克福型`／`莱布尼茨律`／`认知条件` 在**读者正文**里只剩 10 处，逐条核对全部是「也译作／旧译／另一种写法」这类**有意保留的异译说明**；其余出现位置都在折叠的审查记录里引述旧名。
2. **来源账未被非授权触碰的核对**：脚本把本轮全部译名替换先抵消掉，再比对 `url` / `locator` / `supports` / `checked` / `checkedOn` 的改动。结果：URL 集合与核验状态计数与 HEAD **完全一致**，没有任何 `pending` 被改成 `verified`，没有新增来源、引文、页码或章节号。唯一改动过的来源字段是下面这一批**点名授权的译名替换**（都渲染给读者、且都只替换一个词）：

| 位置 | 字段 | 改动 |
| --- | --- | --- |
| `pt-identity-oppression` ID-2 / ID-3 | `supports` | 证言不公 → 证言不正义 |
| `pt-language-meaning` LAN-7 | `supports` | 证言不公 → 证言不正义 |
| `pt-confucian` CON-3 | `supports` | `wei` → 「伪」 |
| `pt-confucian` CON-4 | `locator` / `supports` | `xing` → 「性」（locator 里写成「§2（人性，即「性」）」，因为机械替换会得到「§2（人性 性）」） |
| `pt-religion-reason` REL-4 | `locator` | 《不融贯》→《哲学家的矛盾》（同页哲学家卡片用的就是后者，同一本书两个中文名） |
| `pt-religion-reason` REL-1 | `supports` | 「吠檀多的 brahman」→「吠檀多的「梵」」 |
| `pt-legalism` LEGZ-1 / LEGZ-3 | `supports` | 中文说明里的 `fa` → 「法」（`locator` 里的英文小节标题原样保留） |
| 各条目多处 | `locator` / `supports` 里本站自己写的中文释义 | 随全库译名统一替换（耐存论→持续论、认识不公→认知不正义、法兰克福型案例→法兰克福式案例、莱布尼茨律→莱布尼茨定律等）。英文小节标题一字未动，所声称的定位范围与支持的论断没有变化。 |

---

## 五、本轮未完成、未核实、或明确不做的事

### 5.1 明确不做（不是遗漏）

- **来源核验**：本轮一次都没做。没有把任何 `pending` 改成 `verified`，没有打开任何外部页面去核对既有来源的定位。上一轮记下的存疑点（各原典篇幅估计、七处定位是否覆盖相应论断、`pt-history-tech` 受福柯影响那一段的来源缺口等）原样留着。
- **不新增节点**。本轮发现的知识断层全部靠重排、补桥梁解释与调整层级解决。
- **不改路由、不动 D1 与 `migrations/`**。

### 5.2 本轮引用了中文材料、但**尚未登记为来源**的地方

下面这些中文材料被用来改正正文表述，按本库规则**没有**写进 `sources` 数组（写进去等于声称本轮做了来源核验）。各条目的 `review.remaining` 里都写了「建议补录」：

| 页面 | 用到的中文材料 | 用途 |
| --- | --- | --- |
| `/daoism` | 中华思想文化术语传播网「无为」「自然」条；《老子》二章、三十七章、二十五章 | 「无为」的正面三要点、两处用例、`non-action` 回译的失真、「道法自然」不是「效法大自然」 |
| `/confucian` | 维基文库《荀子·儒效》《荀子·性恶》 | 「道者，非天之道」的篇名；「恶」训偏险悖乱、「伪」训人为 |
| `/legalism` | 陈弘毅《对古代法家思想传统的现代反思》；《公孙龙子·白马论》；《墨子·非命上》《墨经·小取》通行读法 | 法治／以法而治的分层结论；白马非马与「非」训「异」；三表、墨辩与类比援推的白话解释 |
| 全库术语 | 華文哲學百科《認知證成及其結構》；潘磊《物化与排他》 | 认知证成、内在论／外在论、认知不正义一族的改名依据 |

### 5.3 中文资料确实不足、本轮无法补齐的

见第 1.7 节。最要紧的两处：**伊斯兰哲学几乎没有可指给中文读者的原典中译**（《汉译世界学术名著丛书》650 种里只有伊本·西那《论灵魂》与昂苏尔·玛阿里《卡布斯教诲录》两种）；**非洲哲学的中文系统译介基本只有一种**，门基蒂与盖克耶之争在中文里只有转述与编译，没有任何一方的原文中译。

### 5.4 本轮未执行的检查

- **没有真实用户测试，也没有独立专家审校。** 本文件里所有「复审」都是自审（包括并行的复审线，它们与改写线是同一套工具、同一份标准下的不同实例，不构成独立复审）。KNOWLEDGE_BASE 的规定是：未做独立审查时只能标为自审——各条目的 `review.mode` 仍为「自审（尚未独立复审）」。
- **本轮 WebSearch 配额（200 次）在中文资料检索阶段用尽**，后续核查只能用直接打开已知 URL 的方式进行。第 1.7 节里若干「未能核实」的条目是这个限制的直接结果。
- **没有发布到正式网站。** 本文件记录的是工作树状态；`pnpm build` 通过，但未执行 `pnpm deploy:only`，也未连接远程数据库。

### 5.5 已知仍然存在、留给下一轮的

1. **`data.json` 里 23 个核心问题页的 `example` 与 `figures` 写了却不渲染**（被精读层的案例推演与原典路径取代）。本轮选择保留并记明，没有删。
2. **约 20 处「来源编号当句子主语」**（`LEG-1`、`ART-1`、`AES-1` 等），读者在正文里撞上一个要滚到页底才能查的符号。本轮只改了复审点名的五处。
3. **`/learning/philosophy/core` 与总览的「按问题」各缺一半**：core 有每个域「为什么排在这里」而没有 23 条题目链接，总览有链接而没有理由。本轮只在 core 上补了通往推荐路线的入口。
4. **`pt-being-change` 的研究层四段（问题起点／定义与边界／有力反对及回应／容易混淆）在该页不渲染**（手写主线覆盖）。本轮对它们的修订读者看不到；该条 `review.remaining` 已写明。
5. **`pt-legalism` 仍是唯一没有 `question` 字段的传统线索节点。**
6. **`concepts.ts` 的 `personhood-community` 目前在任何页面都不渲染概念卡**，只靠行内注解露面。要让它露面得先给相关页面建精读层。
7. **超长句**：读者正文里仍有约 148 句超过 110 字（多为分号并列的枚举句，本轮修掉了最长的两条）。这一项是持续工作，不是本轮的验收门槛。
