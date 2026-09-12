import { remainingEntryLedgers } from './remaining-content-ledgers';

/**
 * 研究层：把“文章写了什么”与“为什么能这样写”放在同一处。
 *
 * 这不是书目清单。每个 source 都必须说明实际核对到的定位和它支持的论断；
 * 文字的性质也被显式标出，避免把解释或例子伪装为原文事实。
 */

export type ContentKind = '原文入口' | '概括' | '解释性重构' | '原创例子' | '争议性判断';

/**
 * 一条来源的核验状态。
 *
 * 这个字段以前的类型是字面量 `true`，也就是说「待核验」在类型上根本无法表达；
 * 渲染层又把「已核验」三个字硬编码在 JSX 里，谁都不读这个字段。结果是本轮
 * 审查在标着「已核验」的来源里查出了 8 个 404 链接和一批对不上的章节定位。
 *
 * 现在三种状态都能表达，页面显示的就是这个值：
 *   - verified：本轮实际打开过，标题与定位对得上；
 *   - pending：还没有逐段核对，或定位仍待确认；
 *   - broken：链接已失效或指向的内容与论断不符，正文引用它即为已知缺陷。
 */
export type SourceCheckState = 'verified' | 'pending' | 'broken';

export const sourceCheckLabels: Record<SourceCheckState, string> = {
  verified: '已核验',
  pending: '待核验',
  broken: '链接失效｜待更换',
};

export type LedgerSource = {
  id: string;
  title: string;
  kind: '原典' | '学术综述' | '制度文件';
  url: string;
  locator: string;
  checked: SourceCheckState;
  /** 最近一次实际打开并核对这条来源的日期。pending 的来源可以省略。 */
  checkedOn?: string;
  supports: string;
};

export type LedgerParagraph = {
  kind: ContentKind;
  text: string;
  sourceIds?: string[];
};

export type ReviewFinding = {
  location: string;
  issue: string;
  evidence: string;
  revision: string;
};

export type CoreEntryLedger = {
  status: '核验正文｜自审完成';
  scope: string;
  sectionHeadings?: Partial<{
    origin: string;
    boundaries: string;
    objections: string;
    confusions: string;
    historicalContext: string;
    /** 「主要立场」在方法页上并不合适——那里的三项不是三个互斥阵营。 */
    positions: string;
  }>;
  /**
   * 立场区块的导语。
   *
   * 只有需要先说明「这几项是什么关系」的条目才写。逻辑页是典型：演绎、归纳与
   * 解释性推断不是三选一，而这句纠正原本埋在第三张卡片论证路径的最后一步，
   * 读者要先读完三张编号 01/02/03、各带「反对意见」标签的卡片才可能看到。
   */
  positionsIntro?: string;
  origin: LedgerParagraph[];
  boundaries: LedgerParagraph[];
  objections: LedgerParagraph[];
  confusions: LedgerParagraph[];
  historicalContext: { nodeId: string; label: string; note: string }[];
  sources: LedgerSource[];
  review: {
    mode: '自审（尚未独立复审）';
    checkedOn: string;
    findings: ReviewFinding[];
    remaining: string[];
    adjacentImpact: string;
    nextPriority: string;
  };
};

export const coreEntryLedgers: Record<string, CoreEntryLedger> = {
  ...remainingEntryLedgers,
  'pt-freedom': {
    status: '核验正文｜自审完成',
    scope: '行为受原因、性格与制度条件影响时，何种控制才够得上谈自由与归责——这是本页的主线。刑事责任、心理治疗和宗教修行在此分开处理，因为它们要求的控制条件未必相同。“自由”在这里也不预设为完全无因的选择。',
    origin: [
      { kind: '概括', text: '自由意志问题在两种直觉的冲突中产生：行动似乎是由过去与规律、性格和处境造成的；谴责、赞许与惩罚又似乎要求行动以某种方式“取决于”行动者。争论因此同时涉及因果、控制和道德实践。', sourceIds: ['FRE-1', 'FRE-2'] },
      { kind: '解释性重构', text: '将问题分为“本可以做别的吗”“行动是否出自我”“应否赞许、谴责或修复”，可以避免把形而上学结论直接换成政策结论。即使不同意基本应得，也仍须安排预防、保护、解释和补偿。' },
    ],
    boundaries: [
      { kind: '概括', text: '决定论指在既定过去和自然规律下，未来只有一种展开方式；它不同于宿命论，也不等于“原因已经被科学完全发现”。相容论问这样的决定论是否仍允许相关的行动控制；不相容论则认为关键自由不能与之共存。', sourceIds: ['FRE-1', 'FRE-2'] },
      { kind: '概括', text: '道德责任至少可区分为可归属性、可追究性与可要求说明；它们许可的反应和所需控制条件未必相同。把一次错误都直接推到“此人应受惩罚”会跳过这些区分。', sourceIds: ['FRE-2'] },
    ],
    objections: [
      { kind: '概括', text: '不相容论一侧最有力的论证不是一句“反正都被决定了”，而是可以逐步检查的后果论证：若决定论为真，我们的行为是自然规律与远古事件的后果；我们无从左右出生之前发生了什么，也无从左右自然规律是什么；因此这些东西的后果——包括当下的行为——也不取决于我们。', sourceIds: ['FRE-2'] },
      { kind: '概括', text: '相容论的回应要落在具体步骤上，才不只是把立场重述一遍。一条路线攻击推论本身：刘易斯主张该论证在“规律不取决于我们”这句话里混用了两种不同意思，从其中一种推不出结论。另一条路线攻击“不能做别的”的解释：条件分析主张“本可以做别的”意思是“若他曾作别的选择，就会那样做”，而这在决定论下仍可为真。这条路线有一个公认的反例——一个受压倒性强迫支配的人也满足这个条件式，却看起来恰恰缺少那种能力。分歧因此收拢到“取决于我”要求何种控制，而不是谁更喜欢哪个结论。', sourceIds: ['FRE-2'] },
      { kind: '概括', text: '把“本可以做别的吗”和“行动是否出自我”分成两问，有一个经典理由：法兰克福型案例。设一位神经外科医生在琼斯脑中植入了监控与控制装置，只在琼斯将要另作选择时才启动；实际上琼斯自己就选了那件事，装置始终没有动。他没有另作的可能，直觉上却仍应负责。若这类案例成立，责任所需的就不是备选可能而是行动的来源性；不相容论者可以反过来质疑案例是否真的封死了全部备选可能，这一争论至今未定。', sourceIds: ['FRE-1', 'FRE-2'] },
      { kind: '概括', text: '若为摆脱决定论而把行动归于随机事件，随机性不会自动给行动者更多控制。相关的运气与“回卷”论证正是主张：非决定的选择要么使行动者失去控制，要么无法被充分解释。自由意志论因此还须说明一个非决定的行动怎样仍可被行动者恰当地作为源头。', sourceIds: ['FRE-1'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '解释一个行为的成因，不等于为它开脱；但它可能改变我们应使用的回应，例如治疗、约束、修复或谴责。' },
      { kind: '解释性重构', text: '没有外在胁迫只是相容论的一类必要资源，不等于已经解决行动为何“属于我”的全部问题。' },
      { kind: '争议性判断', text: '把儒家或佛教修养直接贴为相容论或不相容论会错过其自身关于习气、关系、觉知和解脱的目标；这里最多作问题上的并置。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '霍布斯、休谟、斯宾诺莎与康德把因果、选择和道德法则放进不同近代框架。' },
      { nodeId: 'pt-confucian', label: '先秦：儒家及其伦理—政治问题', note: '从习礼、学习与德性养成进入“在条件中变得更能负责”的不同问题结构。' },
    ],
    sources: [
      { id: 'FRE-1', title: 'SEP：Free Will', kind: '学术综述', url: 'https://plato.stanford.edu/entries/freewill/', locator: '§1.1–§1.2、§2.1–§2.5、§3.1', checked: 'verified', checkedOn: '2026-09-11', supports: '控制、另作可能、源头性与相容／不相容论的分工（§2.2–§2.5）；§2.3 给出法兰克福型案例（Black 与 Jones）；§3.1 给出针对自由意志论的运气与“回卷”论证。' },
      { id: 'FRE-2', title: 'SEP：Moral Responsibility', kind: '学术综述', url: 'https://plato.stanford.edu/entries/moral-responsibility/', locator: '§1（决定论、后果论证、条件分析与法兰克福型案例）、§3.1.1、§3.1.3', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 给出范·因瓦根式后果论证的措辞、刘易斯对该论证混用“规律不取决于我们”两义的反驳、条件分析及其强迫反例，以及法兰克福型案例要证明什么；§3.1.1、§3.1.3 给出可归属性／可追究性／可要求说明的三分。' },
      { id: 'FRE-3', title: 'SEP：Zhu Xi', kind: '学术综述', url: 'https://plato.stanford.edu/entries/zhu-xi/', locator: '§1（生平与著述，含四书编定）、§2（人性与修养进路）、§3.1、§4.1（格物）', checked: 'verified', checkedOn: '2026-09-11', supports: '朱熹的经典编定、格物在伦理与自然两侧的用法、修养进路；仅支持与自由意志问题的谨慎并置，不支持任何相容／不相容论归类。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜相容论', issue: '原内容把相容论缩为“想做什么就做什么”。', evidence: 'FRE-1、FRE-2 都将理由响应、源头性和责任类型列为未决争论。', revision: '改为控制条件的竞争性说明，并加入胁迫与理由的区分。' },
      { location: '案例推演｜愤怒消息', issue: '原案例暗示理解原因只会削弱责任。', evidence: 'FRE-1 区分自由与不同责任实践。', revision: '改问不同回应的依据，避免把解释与免责等同。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单把休谟、康德、范·因瓦根与修养传统排成同一类“自由定义”。', evidence: 'FRE-1、FRE-2 分别给出相容、控制与后果论证的争点；FRE-3 将朱熹放在经释、修养和实践脉络。', revision: '新增四个比较单元，分别说明它们怎样处理深夜信息案例，以及不能从并置推出的结论。' },
      { location: '有力反对及回应', issue: '原相容论回应只是把立场重述一次（“控制不要求控制过去和规律，而要求行动出自自己的理由”），没有针对后果论证的任何一步。', evidence: 'FRE-2 §1 记录了两条针对具体步骤的反驳：刘易斯认为论证混用了两种“规律不取决于我们”；条件分析改写“本可以做别的”，并附有强迫症反例。', revision: '把后果论证的前提逐条写出，再分别给出攻击推论与攻击“能做别的”解释的两条回应，并说明各自代价。' },
      { location: '有力反对及回应｜新增法兰克福型案例', issue: '全库此前没有法兰克福型案例，而本页三层拆分（本可以做别的／是否出自我／应否谴责）正建立在它给出的理由上。', evidence: 'FRE-1 §2.3 给出 Black 在 Jones 脑中植入装置的代表性案例；FRE-2 §1 说明这类案例意在表明“行动者即使不能做别的也可能负道德责任”。', revision: '新增一段写出案例结构、它支持的结论（来源性而非备选可能），以及不相容论者可攻击的点。' },
      { location: '定义与边界｜责任三分', issue: '可归属性／可追究性／可要求说明三分原挂在 FRE-1（SEP：Free Will）名下，该条目并不以这三者组织讨论。', evidence: '三分出自 FRE-2 §3.1.1 与 §3.1.3。', revision: '改挂 FRE-2，并把 FRE-2 的定位扩到 §3.1。' },
      { location: '容易混淆的地方｜跨传统并置', issue: '“把儒家或佛教修养贴为相容论”一句原挂 FRE-1，该条目未讨论儒家或佛教修养。', evidence: 'FRE-1 的历史部分只覆盖古代—中世纪与近代—二十世纪的欧洲脉络。', revision: '去掉该来源标注，保留为争议性判断。' },
    ], remaining: ['尚未逐一核验中文译本中“自由意志”“自发”“自主”等术语的使用差异。', '刘易斯 1981 的原文（“Are We Free to Break the Laws?”）本轮只在 FRE-2 §1 的转述中核对，未读原文；若要在正文中细述他区分的两种意思，须另建原典来源。'], adjacentImpact: '“责任”页不得从决定论直接推出废除一切归责；“儒家”页不得用当代自由意志标签覆盖修养语境。原挂在本条历史语境里的 pt-responsibility 已删除（见 review.remaining 与本轮报告），应由关系层收录。', nextPriority: '补写道德运气、刑罚正当性与中国、印度自由问题的独立来源账。' },
  },
  'pt-logic': {
    status: '核验正文｜自审完成',
    // 这一页的三项不是三个互斥阵营，套「主要立场」会把方法读成站队。
    sectionHeadings: { positions: '三种推理方式与各自的评价标准' },
    positionsIntro:
      '下面三项不是三选一的立场，而是三种推理方式：它们评价的东西不同，适用的地方也不同，同一段论证常常需要不止一种。因此每一项后面写的多半不是「反驳」，而是这种方式管不到哪里、它的评价标准在什么地方还没有定论——适用限制不等于对这种方法的反驳。',
    scope: '演绎有效、归纳支持和解释性推断各按什么标准评价理由，是这一页要分开的三件事。形式逻辑在此不充当所有好判断的裁判；但真实论证再复杂，前提、歧义和反例仍要一条条查。',
    origin: [
      { kind: '概括', text: '人们不仅会争论结论，也会争论结论是否由给出的理由支持。逻辑把这种支持的结构显明：在经典演绎中，有效意味着不存在前提全真而结论假的解释；这只评价保真形式，不保证前提真实。', sourceIds: ['LOG-1'] },
      { kind: '概括', text: '日常论证还要处理含混语境、概率、因果和对话目标。非形式谬误研究因此不只把句子符号化，而要说明一种论证为何看似有力、在哪个语境和标准下失败。', sourceIds: ['LOG-2'] },
    ],
    boundaries: [
      { kind: '概括', text: '有效（valid）与健全（sound）不同：前者关乎形式上保真，后者还要求前提为真。可推导性是某一演算中能否推出，语义有效性则以解释或模型刻画；二者的关系属于元逻辑问题。', sourceIds: ['LOG-1'] },
      { kind: '解释性重构', text: '归纳和最佳解释推断不承诺结论必然为真，而比较样本、替代假设、反例、预测和背景知识给予的支持力度。它们不能由一张“形式有效／无效”表格代替。' },
    ],
    objections: [
      { kind: '概括', text: '把经典逻辑视为唯一正确逻辑会忽略直觉主义、相关逻辑等针对不同语言、推理目标或悖论的方案；反过来，存在多种逻辑也不意味着可随意选规则。需要说明对象语言、语义、推理任务和代价。', sourceIds: ['LOG-1'] },
      { kind: '概括', text: '“谬误”并非每种情形都有机械定义；它通常是看起来比实际更好的论证。歧义、语境和对话目的会影响评价，故背名称不能代替重建前提、结论和隐含跳步。', sourceIds: ['LOG-2'] },
      { kind: '概括', text: '归纳还有一个比“支持强弱”更硬的问题。休谟的两难是：为归纳作辩护的论证只能是论证性的或概率性的。论证性推理无法从“过去如此”必然推出“将来如此”，因为反面并不自相矛盾；概率性推理则要预设自然齐一，而这条预设本身只能由归纳支持，于是循环。后续回应分别攻击两支：有的主张齐一性或某种解释原则可作先天／可辩护的前提，有的接受规则循环式的自我支持，有的干脆改换“正当”的标准，用长程收敛或形式学习理论的最优性来交代。哪一支成功仍是未决问题——这也是把归纳压成一句“关键检验”最容易失手的地方。', sourceIds: ['LOG-6'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '前提假而论证有效并不矛盾；它只说明若前提为真，结论不能为假。' },
      { kind: '解释性重构', text: '相关性不是因果性，统计关联也不自动消除混杂、选择偏差和替代解释。' },
      { kind: '概括', text: '但「相关不等于因果」也不推出「只有实验才能研究因果、观察数据没有帮助」。推不出因果的是单凭统计关联这件事本身——任何因果结论都得依赖某个同样是因果性的前提。一旦把这些前提写明，并说明要估的量在这套前提下能由现有数据算出来，观察数据同样可以给出无偏的因果估计。缺的始终是可辩护的因果假设，不是样本量；而实验也不是无条件保证。', sourceIds: ['LOG-8'] },
      { kind: '解释性重构', text: '形式化是澄清工具，也是模型；它会忽略语气、语境、权力关系或事实调查，须说明它保留了什么。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从亚里士多德三段论、论辩与谬误传统进入，不把古典逻辑当作现代符号系统的粗略预演。' },
      { nodeId: 'pt-nyaya', label: '正理、胜论及认识—论辩传统', note: '比较推理、反例和论辩目的时，保留 pramāṇa 与五支论证的自身语境。' },
    ],
    sources: [
      { id: 'LOG-1', title: 'SEP：Classical Logic', kind: '学术综述', url: 'https://plato.stanford.edu/entries/logic-classical/', locator: '§1、§3（推导）、§4（语义）、§5（元理论）、§6.1–§6.3', checked: 'verified', checkedOn: '2026-09-11', supports: '§4 把语义有效性定义为“不存在满足全部前提而不满足结论的解释”；§5 以定理形式给出可推导性与语义有效性的关系及健全性、完备性；§6 标题即“唯一正确的逻辑？”，§6.3 处理直觉主义竞争者。该条目不讨论休谟，也不讨论归纳问题。' },
      { id: 'LOG-2', title: 'SEP：Fallacies', kind: '学术综述', url: 'https://plato.stanford.edu/entries/fallacies/', locator: '§1；§3.2、§3.6；§4.1–§4.2', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 把谬误刻画为“看起来比实际更好的论证”；§4.2 专论“似是”条件；§3.6 从对话／语用辩证进路说明评价随论辩语境变化；§3.2–§3.6 呈现互相竞争的分类框架。' },
      { id: 'LOG-3', title: 'SEP：Aristotle’s Logic', kind: '学术综述', url: 'https://plato.stanford.edu/entries/aristotle-logic/', locator: '§1–§2（《工具论》著作群）、§3.1–§3.2、§4、§5.1–§5.3', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 列出亚里士多德的逻辑著作；§3.1 区分推论与归纳；§3.2 明确亚里士多德式推演与现代有效论证不是一回事；§4–§5 给出前提结构、格与反例式反驳。' },
      { id: 'LOG-4', title: 'SEP：Gottlob Frege', kind: '学术综述', url: 'https://plato.stanford.edu/entries/frege/', locator: '§1、§2.1–§2.2、§2.7、§3', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.1–§2.2 给出弗雷格的词项逻辑、谓词演算与复合语句、一般性（量化）；§2.7 给出他对逻辑本身的构想；§3 是他的语言哲学。' },
      { id: 'LOG-5', title: 'SEP：Epistemology in Classical Indian Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology-india/', locator: '§1.1（知识与知识来源）、§2（怀疑论，含 hetv-ābhāsa 的引入）、§5（推理）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1 以 pramāṇa 组织“知识来源”；§2 说明佛教与正理都把 Cārvāka 的归纳质疑转成关于推理的可错论，并引入 hetv-ābhāsa（似是而非的“理由”）；§5 专论推理。' },
      { id: 'LOG-6', title: 'SEP：The Problem of Induction', kind: '学术综述', url: 'https://plato.stanford.edu/entries/induction-problem/', locator: '§1–§2（休谟两难的重构）、§3.1–§3.5、§4.1–§4.2、§5.2–§5.4', checked: 'verified', checkedOn: '2026-09-11', supports: '§1–§2 给出论证性／概率性推理两支与齐一性原则的循环；§3 收录先天综合、解释性、贝叶斯、部分解与组合论进路；§4 收录规则循环式辩护与“无规则”回应；§5 收录改换正当性标准的方案（日常语言消解、实用主义辩护、形式学习理论）。' },
      { id: 'LOG-7', title: 'IEP：Reductio ad Absurdum', kind: '学术综述', url: 'https://iep.utm.edu/reductio/', locator: '§1 Basic Ideas、§2 The Logic of Strict Propositional Reductio: Indirect Proof、§3 A Classical Example of Reductio Argumentation', checked: 'verified', checkedOn: '2026-09-12', supports: '§2 把间接证明写成三步：“(1) Assume not-p; (2) Provide argumentation that derives p from this assumption; (3) Maintain p on this basis.”——被假设的那一步是暂时引入、随后由 modus tollens 撤销的；§3 的通约性例子明确说“that initial commensurability assumption engendered a contradiction”。这两处一起支持：从一个被认为为假的前提出发的有效推理不是无用的，它正是间接证明的工作方式。' },
      { id: 'LOG-8', title: 'Judea Pearl, An Introduction to Causal Inference', kind: '学术综述', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2836213/', locator: '§2 From Association to Causation、§3 Structural Models, Diagrams, Causal Effects, and Counterfactuals、§4 Methodological Principles of Causal Inference（The International Journal of Biostatistics, 2010）', checked: 'verified', checkedOn: '2026-09-12', supports: '一方面：“Every claim invoking causal concepts must rely on some premises that invoke such concepts; it cannot be inferred from … statistical associations alone.”——单凭统计关联推不出因果。另一方面：在识别条件满足时“the causal effect can likewise be estimated from such data without bias”，识别问题即“Can the controlled (post-intervention) distribution … be estimated from data governed by the pre-intervention distribution?”。两句合起来支持：观察数据不是无条件无效，缺的是可辩护的因果假设，而不是样本量。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜演绎有效性', issue: '原文将有效性说成“结论为真”。', evidence: 'LOG-1 将有效性界定为没有前提全真而结论假的解释。', revision: '增加有效／健全、前提／形式的分工。' },
      { location: '案例推演｜带伞下雨', issue: '原例只贴“相关不等于因果”标签。', evidence: 'LOG-2 要求重建论证与其失败条件。', revision: '要求列出混杂变量、反事实和替代解释，而非背诵谬误名。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单没有说明三段论、量词形式、归纳怀疑与正理论辩是在处理不同的推理任务。', evidence: 'LOG-3 区分推论与归纳，LOG-4 说明现代形式工具的变化，LOG-5 将正理放进 pramāṇa 与似是理由的争论。', revision: '新增四个比较单元，并把“带伞”案例拆为形式、因果支持和反例排除。' },
      { location: '来源账｜LOG-1 的错挂', issue: '本轮审查指出休谟卡、休谟阅读卡与“归纳”那条论证路径都挂 LOG-1，而 LOG-1 是 SEP：Classical Logic，其定位既不讨论休谟也不讨论归纳。', evidence: '本轮实际打开 LOG-1 全文核对目录与内容：§1 导论、§2 语言、§3 推导、§4 语义、§5 元理论、§6 唯一正确的逻辑，全文不出现休谟，也不出现归纳问题。', revision: '为归纳问题另建 LOG-6（SEP：The Problem of Induction），在“有力反对及回应”写出两难的两支与各类回应，并在 LOG-1 的 supports 里明确写出它不覆盖休谟与归纳，以免再被误挂。精读层挂 LOG-1 的休谟条目须改挂 LOG-6，这部分不在本文件内。' },
      { location: '容易混淆的地方｜形式化', issue: '“形式化会忽略语气、语境、权力关系或事实调查”一句原挂 LOG-1。', evidence: 'LOG-1 §2.4 只讨论句法特征，不作此类论断。', revision: '去掉来源标注，保留为解释性重构。' },
      { location: '先把问题拆开｜健全性', issue: '原文写「反过来，从假前提出发的有效论证毫无用处」。「不健全」只说明不能据此断定结论为真，推不出「毫无用处」；同一页的论证路径第 3 步已正确写着「有效不等于健全」，两处自相矛盾。', evidence: 'LOG-7（IEP：Reductio ad Absurdum）§1 与 §2 说明间接证明正是先假设一个待否定的命题、推出矛盾、再撤销该假设——从假前提出发的有效推理是标准证明手段。', revision: '改写为说明「不健全」的确切代价，并新增「反证法（间接证明）」概念卡；同时不走向反面——有效性与假前提都不担保结论为真。' },
      { location: '案例推演｜带伞下雨（第 3、4 问）', issue: '原文把「单凭相关性不能确立因果」扩展成「需要的是干预而不是更多观察」，并把「再多观察也没用」判为三句里最有指导性的一句。这条方法论主张此前在来源账里没有任何对应条目，而本条的待办明确写着 LOG-6 不覆盖因果推断方法。', evidence: 'LOG-8（Pearl, An Introduction to Causal Inference, 2010）§2 说明单凭统计关联推不出因果，§3–§4 同时说明在因果假设与识别条件明确时，观察数据也能无偏估计因果效应。本例的混杂变量「天气预报」本身可观测，正属于可由观察设计解决的情形。', revision: '改写第 3、4 问：分界在有没有可辩护、可被反驳的因果假设，而不在「实验对观察」；同类样本再多不解决混杂，换一种观察设计或做干预都是办法；并补上实验自身的代价（依从性、失访、外推）。新增 LOG-8 与一条 confusions。' },
      { location: '主要立场｜区块模板', issue: '演绎、归纳与解释性推断被套进「主要立场—反对—回应」模板，读起来像三个互斥阵营。三条「反对意见」里有两条其实是适用限制——第一条的回应第一句就写着「这不是对演绎的反驳」，却顶着与真正反驳相同的标签；唯一一句纠正误读的话埋在第三张卡片论证路径的最后一步。', evidence: '本页 data.json 的 positions 与 study-guides 的 positionArguments 自身即证据：objection 与紧随其后的 response 在这一页互相矛盾。', revision: '区块标题改为「三种推理方式与各自的评价标准」，在区块开头加导语说明三者不是三选一；为立场卡新增 objectionKind，把两条适用限制与一条未解难题与真正的反驳区分开。模板本身保留，只按内容类型配置。' },
    ], remaining: ['贝叶斯尚无独立的原典阅读卡；LOG-6 只覆盖归纳的正当性问题，因果推断方法现由 LOG-8 覆盖，但只核对到 §2–§4。', '墨辩原典（《墨经》《小取》）仍无可核定位。'], adjacentImpact: '“语言意义”页须提醒论证可因歧义失效；“正理”页不能被降格为欧洲逻辑的附录。精读层与人物卡若还把休谟挂在 LOG-1，须改挂 LOG-6。原挂在本条历史语境里的 pt-knowledge-sources 已删除，应由关系层收录。', nextPriority: '正理、墨辩的原典材料仍待对接；反证法目前只有 IEP 一条来源，宜再补一条独立材料。' },
  },
  'pt-language-meaning': {
    status: '核验正文｜自审完成',
    scope: '词语、句子、说话者、使用场景和社会实践怎样分担意义与真理要求，是这一页的问题。命名在此不是贴标签的技术活；反过来，语言塑造经验也推不出“没有独立事实”。',
    origin: [
      { kind: '概括', text: '语言问题从一个日常事实出现：同一句话可以指向世界、传递意图、承诺行动、造成伤害或误导。词义研究、句子组合、语境与真理的理论各抓住其中不同层面，不能由“意义来自使用”一语合并。', sourceIds: ['LAN-1', 'LAN-2'] },
      { kind: '概括', text: '早期中国的名（ming）与实（shi）讨论将正确用名连接到行动、礼、秩序与论辩。它不是现代语言学或指称理论的原样前身，却提供了语言具有规范和实践作用的不同问题框架。', sourceIds: ['LAN-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '词的意义、句子的真值条件、说话者意图和话语效果不是同一个对象。一个词可有稳定用法而在语境中指不同对象；一句事实正确的话也可能在特定语境中误导。', sourceIds: ['LAN-1', 'LAN-2'] },
      { kind: '概括', text: '真理承担者可能被理解为信念、命题、句子或话语；选择何者会影响对应、紧缩和语义理论的表达。语言与真理密切相关，却不能把所有有意义的言语行为都缩为断言事实。', sourceIds: ['LAN-2'] },
    ],
    objections: [
      { kind: '概括', text: '纯指称取向难说明虚构、抽象词、隐喻与规范性语言；纯使用取向则须说明误用、跨语境批评和真理为何不只是群体习惯。较好的比较应问各理论解释了什么，并说明其余现象的代价。', sourceIds: ['LAN-1', 'LAN-2'] },
      { kind: '概括', text: '把名实或正名直接等同于专制规定用语是有力但过快的批评：它忽略文本中正确使用、可行动性和社会秩序的连结，也忽略谁有资格定名本身可被追问。历史语境不自动使规范免受批评。', sourceIds: ['LAN-3'] },
      { kind: '概括', text: '“命名与分类会分配可见性、资格与责任”若要成为一条立场，需要给出机制而不是修辞。一条可核的路线来自认识不公研究：证言不公指听者因身份偏见，给说话者低于其证据所应得的可信度；解释不公指集体解释资源本身存在结构性缺口，使某个群体难以表述和理解自己的处境。二者说明分类与可信度分配确实造成可追踪的认识损害，而且这种损害的性质是认识性的，不只是道德上的不公。从这里推不出“任何分类都是权力操作”，也推不出被边缘化的说法自动为真：社会位置带来的认识优势本身仍是须在具体领域检验的假设。', sourceIds: ['LAN-7'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“语言影响我们看见什么”不等于事实随意由语言制造；它要求区分分类、注意、制度后果和经验对象。' },
      { kind: '解释性重构', text: '“同一词有不同含义”不自动构成谬误，只有论证在关键处偷换含义才会断裂。' },
      { kind: '解释性重构', text: '“正名”不等于把词典固定；其翻译、文本目的和社会规范含义都是争论对象。', sourceIds: ['LAN-3'] },
    ],
    historicalContext: [
      { nodeId: 'pt-legalism', label: '先秦：墨家、名家、法家等论辩线索', note: '名实、辩与规范治理需与墨辩、名家和法家材料对读，不能只围绕儒家。' },
      { nodeId: 'pt-confucian', label: '先秦：儒家及其伦理—政治问题', note: '名的正确使用与礼、行动和角色关系相连，但不应被简化成词汇政策。' },
    ],
    sources: [
      { id: 'LAN-1', title: 'SEP：Word Meaning', kind: '学术综述', url: 'https://plato.stanford.edu/entries/word-meaning/', locator: '导论、§1.1–§1.2、§3.3（外在主义转向）、§3.4（内在主义）、§3.5（语境主义与最小主义）', checked: 'verified', checkedOn: '2026-09-11', supports: '导论说明早期当代语言哲学更关注词如何组合成句（组合性）而非单词意义；§1.2 分列各类词义理论；§3.3–§3.5 给出外在主义、内在主义与语境主义之争，含“冰箱里有牛奶”式真值条件争论。' },
      { id: 'LAN-2', title: 'SEP：Truth', kind: '学术综述', url: 'https://plato.stanford.edu/entries/truth/', locator: '§1.1（对应论）、§6.1（真理承担者）、§6.2（真理与真值条件）', checked: 'verified', checkedOn: '2026-09-11', supports: '§6.1 专论真理承担者可被理解为句子、命题还是信念；§6.2 给出真理与真值条件、与意义理论的关系；§1.1 给出对应论及其来源。' },
      { id: 'LAN-3', title: 'SEP：Logic and Language in Early Chinese Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/chinese-logic-language/', locator: '§1、§2（孔子与名的秩序，含 cheng ming 应译“ordering”还是“rectification”之争）、§5（荀子《正名》与对墨家逻辑的吸收）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 以《论语》13.3 说明正确用名与行动、礼、秩序相连，并记录 Hall 与 Ames 反对“rectification”译法的理由；§5 引《荀子》第二十二篇“正名”原文，说明荀子把墨家的语言与逻辑洞见吸收进儒家伦理。该条目不讨论当代关于分类、制度权力与认识不公的论证。' },
      { id: 'LAN-4', title: 'SEP：Gottlob Frege', kind: '学术综述', url: 'https://plato.stanford.edu/entries/frege/', locator: '§3.1（弗雷格之谜）、§3.2（涵义与指称）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3.1–§3.2 给出同一性陈述的认知价值之谜与涵义／指称的区分。' },
      { id: 'LAN-5', title: 'SEP：Ludwig Wittgenstein', kind: '学术综述', url: 'https://plato.stanford.edu/entries/wittgenstein/', locator: '§2.1（《逻辑哲学论》）、§3.1–§3.3（转变、《哲学研究》、意义即使用）、§3.5（遵守规则与私人语言）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 与 §3 分列前后两期；§3.3 给出“意义即使用”，§3.5 给出遵守规则问题，说明“使用”不等于“群体一致即正确”。' },
      { id: 'LAN-6', title: 'SEP：John Langshaw Austin', kind: '学术综述', url: 'https://plato.stanford.edu/entries/austin-jl/', locator: '§2.1（语言与哲学）、§2.2（语言与真理）、§2.3（言语行为与真理）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.1–§2.3 给出奥斯汀的普通语言方法、对真值／准确性标准的处理，以及言语行为与断言真假的关系。§4 讨论行动、借口与自由，与本条论断无关，已从定位中移除。' },
      { id: 'LAN-7', title: 'SEP：Feminist Social Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/feminist-social-epistemology/', locator: '§2.1（差异化认知者与立场理论）、§4.1（认识不公）', checked: 'verified', checkedOn: '2026-09-11', supports: '§4.1 转述 Fricker 2007 对证言不公（因身份偏见造成可信度赤字）与解释不公（“集体解释资源经济中的结构性偏见”）的区分，并强调这种伤害的性质是认识性的；§2.1 记录立场理论的论证与它成为最受争议领域之一的事实。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜使用与实践', issue: '原内容把“使用”写成只要大家同意就正确。', evidence: 'LAN-1 区分词义、语境和多种理论；LAN-2 保留真理问题。', revision: '加入误用、批评与真理要求的难题。' },
      { location: '跨传统连接｜名实', issue: '原文把名实当作现代语言哲学的提前版本。', evidence: 'LAN-3 将其放入行动、秩序与早期中国论辩。', revision: '改为并置问题，并提示翻译与历史边界。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单只列人物，无法看出语义、使用、言语行为与名实是不同层次。', evidence: 'LAN-4 处理涵义／指称，LAN-5 处理规则与实践，LAN-6 处理言语的行动条件，LAN-3 处理早期中国名实语境。', revision: '新增四个比较单元，并要求在政策称呼案例中分开指称、使用、资格与制度后果。' },
      { location: '主要立场｜“解释与权力敏感取向”的来源账', issue: '该立场（命名与分类会分配可见性、资格、资源与责任）此前唯一的核对来源是 LAN-3，而 LAN-3 是早期中国的名实与逻辑条目，其定位“§2 孔子与名的秩序”不涉及当代关于分类、制度权力与认识不公的论证。', evidence: '本轮实际打开 LAN-3 全文：全部章节为背景、孔子、墨家、道家、荀子、结语，无任何当代分类政治或认识不公内容。', revision: '新增 LAN-7（SEP：Feminist Social Epistemology §4.1、§2.1），并在“有力反对及回应”写出证言不公与解释不公的机制，同时写明推不出什么。该立场自造的“取向”式命名仍需改为真实理论名（认识不公／社会构成论），这属于 data.json 的立场名称，不在本文件内。' },
      { location: '来源账｜LAN-3 的定位与荀子', issue: 'LAN-3 原定位只写“导论、§2”，却同时被用来对《论语》与《荀子·正名》作断言，而荀子在该条目位于 §5，不在已核对范围内。', evidence: '本轮核对 LAN-3 目录：§2 为“Confucius and the Ordering of Names”，§5 为“Xunzi’s Confucian Appropriation of Mohist Logic”，后者引《荀子》第二十二篇原文。', revision: '定位扩为 §1、§2、§5，并在 supports 中分别写明两处支持的内容。' },
    ], remaining: ['尚未逐节核验《论语》《墨经》《荀子·正名》的中文校勘版本。', 'Haslanger 一路关于分类的社会构成论证尚未建立来源账；LAN-7 只覆盖认识不公一侧，不覆盖“分类如何因果地塑造人类种类”。'], adjacentImpact: '“解释”页须区分文本意义与作者意图；“身份与压迫”页应说明命名的制度后果而非只作修辞批评，并与本条 LAN-7 共用同一条目的不同定位。原挂在本条历史语境里的 pt-logic 已删除，应由关系层收录。', nextPriority: '补写言语行为、翻译和中国名实论辩的原典阅读路径，并为社会构成论建立独立来源账。' },
  },
  'pt-western-modern': {
    status: '核验正文｜自审完成',
    scope: '17—18 世纪的欧洲哲学在这里按四条线索铺开：知识、自然、心灵、政治权威。要提防的读法是把它读成“理性主义战胜经验主义”的单线进步史——那条叙事本身就是后来加上去的分类。同一时期中国、印度、伊斯兰世界的近世哲学各有自己的分期，这一页代表不了它们。',
    sectionHeadings: { origin: '历史起点与问题结构', boundaries: '时段、标签与材料边界', objections: '史学分类的争议', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '近代欧洲哲学中的知识问题与科学、宗教、国家和教育并不分离：新的自然解释、怀疑论压力和政治冲突，使人们重新问理性、感官、方法、权威与自由的界限。人物之间并非在同一议题上排队接力。', sourceIds: ['MOD-1'] },
      { kind: '解释性重构', text: '从笛卡尔的确定性诉求、洛克和休谟对经验与观念的分析，到康德对认识条件的重构，可以得到一条教学路线；但这只是一条进入路径，不是时代的全部内容。' },
    ],
    boundaries: [
      { kind: '概括', text: '“理性主义／经验主义”原本是围绕知识来源、先天观念、直觉与感官经验的相对限定区分。相关论题（直觉／演绎、先天知识、先天概念）本身就是按“某一主题领域 S”来表述的，所以一个哲学家可在某领域重理性、在另一领域重经验；这两个标签也不穷尽知识来源——例如诉诸启示或洞见的主张就落在二者之外。', sourceIds: ['MOD-1'] },
      { kind: '概括', text: '把近代只限定为几位男性形而上学家的谱系，会掩盖情感、教育、政治、宗教宽容等论争及大量未被经典叙事收纳的人物。这不是外部指责：晚近的研究把阿莫、卡文迪什、康韦等人一并放进“理性主义”的讨论，正是要检验这个标签的范围与准确性；也有人主张干脆改用作者自称的名目，或只谈具体的历史联系。标签本身塑造了教学正典。', sourceIds: ['MOD-2'] },
    ],
    objections: [
      { kind: '概括', text: '“大陆理性主义对英国经验主义”的讲法易于教学，却会误导：这条叙事把笛卡尔、斯宾诺莎、莱布尼茨排在前，把洛克、休谟、里德讲成逐步抛弃前者形而上学主张的接力，而这被认为是误读。回应不是取消比较，而是每次说明比较的领域和限度。', sourceIds: ['MOD-1', 'MOD-2'] },
      { kind: '解释性重构', text: '将科学革命解释为理性取代传统，也会忽略实验、仪器、制度、殖民与宗教争论。思想史不是背景装饰，而会改变“知识”“自然”和“政治”的含义。' },
    ],
    confusions: [
      { kind: '解释性重构', text: '“近代”不是普遍世界时间标签；此页是欧洲历史线索，不应用来给中国、印度或伊斯兰哲学划分时期。' },
      { kind: '解释性重构', text: '经验主义不等于“只相信眼睛”，理性主义也不等于“反对经验”。', sourceIds: ['MOD-1'] },
      { kind: '解释性重构', text: '康德不是二分法的简单终点；将他只写成综合者会遮蔽批判哲学的多重问题。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-medieval', label: '中世纪与跨文化传译', note: '近代的怀疑论压力、自然神学与经院术语都是从这条线上接过来的，先看它再看“断裂”说得有多准。' },
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '近代提出的知识、心灵与政治权威问题在这条线上被重述，不要把 18 世纪的结论当成终点。' },
    ],
    sources: [
      { id: 'MOD-1', title: 'SEP：Rationalism vs. Empiricism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/rationalism-empiricism/', locator: '§1、§1.1–§1.2（含“该二分并不穷尽知识来源”与传统叙事被误读的段落）、§2–§4（三条论题的领域相对化表述）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 明确该二分“并不穷尽可能的知识来源”，并指出把洛克、休谟、里德讲成逐步抛弃前人形而上学主张属误读；§2–§4 把直觉／演绎、先天知识、先天概念三论题都表述为“某一主题领域 S 中的命题”，从而支持按领域相对化的读法。该条目只有四节，原定位所说的“§4 关于分类局限的段落”实为“先天概念论题”，与论断不符。' },
      { id: 'MOD-2', title: 'SEP：Early Modern Rationalism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/rationalism-early-modern/', locator: '§1、§1.1（工具主义式处理）、§2（传统叙事）、§3（阿莫、卡文迪什、康韦）、§4', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 说明“理性主义”的判准被认为不准确或过窄，本条目因而采取工具主义式处理，并把该标签的变动类比为科学中的概念碎裂；§1 与 §3 把阿莫、卡文迪什、康韦与笛卡尔、斯宾诺莎、莱布尼茨并置，§1 记录“为把历来被低估的人物纳入正典而施加的压力”以及改用作者自称名目的替代方案。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '摘要｜理性主义／经验主义', issue: '原文将二分法当作该时段的组织事实。', evidence: 'MOD-1 明确指出人物可跨领域，且分类会遮蔽丰富性。', revision: '改为带边界的教学路径，并列出被遗漏问题。' },
      { location: '人物列表', issue: '原内容只堆名字，未显示问题之间的连接。', evidence: 'MOD-1 以知识来源为一条线，且提醒不可外推成共同纲领。', revision: '新增知识、自然、心灵与政治的结构性入口。' },
      { location: '来源账｜MOD-2 由孤挂改为承重', issue: 'MOD-2 此前只出现在自己的定义行，全文件没有任何段落引用它，等于一条无用的书目。', evidence: '本轮实际打开 MOD-2：§1 给出工具主义式处理与“概念碎裂”的类比，§3 把阿莫、卡文迪什、康韦纳入讨论，正是“正典被标签塑造”这一论断的直接材料。', revision: '把“定义与边界”第二段与“史学分类的争议”第一段改挂 MOD-2（后者与 MOD-1 并挂），并按实际章节改准定位。' },
      { location: '来源账｜MOD-1 的定位', issue: '原定位写“导论、§1、§4，尤其关于分类局限的段落”，但该条目只有四节，§4 是“先天概念论题”，不讨论分类局限；“导论”与“§1”是同一处。', evidence: '本轮核对 MOD-1 目录：§1 导论（含 §1.1 理性主义、§1.2 经验主义）、§2 直觉／演绎论题、§3 先天知识论题、§4 先天概念论题；“并不穷尽知识来源”一句位于 §1。', revision: '定位改为 §1、§1.1–§1.2、§2–§4，并在 supports 中写明原定位与实际章节不符。' },
    ], remaining: ['尚未逐篇核对女性哲学家、殖民知识史和科学实践的专门史料；MOD-2 §3 只给出阿莫、卡文迪什、康韦三人的理性主义论题，不能当作近代正典重估的完整史料。'], adjacentImpact: '核心问题页应把近代作为一种历史语境而非普遍哲学基准；“中国／印度／伊斯兰”页须保留各自时段。原挂在本条历史语境里的 pt-knowledge-sources、pt-mind-self、pt-legitimacy 三条均为核心问题节点，已全部删除，应由关系层收录；此处改列中世纪与 19 世纪以后两条真实的时段线索。', nextPriority: '补写科学革命、自然法与近代政治的原典／史学阅读路径。' },
  },
  'pt-confucian': {
    status: '核验正文｜自审完成',
    scope: '本页只走先秦这一段，主要比较孔子相关文本、孟子与荀子在修养和人性上的分歧。“儒家”一词跨两千年，指过学派、经学、教育制度也指过国家意识形态，读的时候要随时问它在哪一层上说话。礼、孝、性善这些词在原文里各有论证支撑，压成“服从”“乐观”一类标签就没什么可读的了。',
    sectionHeadings: { origin: '历史起点与问题结构', boundaries: '文本、术语与传承边界', objections: '内部论辩与当代质问', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '早期儒家将德性、礼、学习、家庭角色和治理相互连结：问题不只是“遵守哪条规则”，而是人在关系和制度中如何形成能辨别、关怀并承担角色的人。孔子相关思想又在后世被多种文本和解释传统重构。', sourceIds: ['CON-1'] },
      { kind: '概括', text: '孟子把恻隐等道德端绪与涵养相连；荀子则把欲望、学习、礼与有意识的塑造置于核心。两者分歧不是简单的“乐观／悲观”，而关系到道德能力、习得和制度的不同解释。', sourceIds: ['CON-2', 'CON-3'] },
    ],
    boundaries: [
      { kind: '概括', text: 'Ru（儒）早于孔子而与礼乐、经典专家相关；“Confucian”既可指早期文本，也可指后来的哲学、教育和制度传统。阅读时须标出在说哪一层，而不是把两千年实践倒灌进《论语》。', sourceIds: ['CON-1'] },
      { kind: '概括', text: '礼不是一套可脱离关系和情境的外在仪式；但它也不只是个人感受。它涉及身体习惯、角色期待、情感养成和政治秩序，故既可能支持相互尊重，也可能被用来固化不平等——儒家与性别的关系正是当代研究中一个独立的争论题目。', sourceIds: ['CON-1', 'CON-3'] },
    ],
    objections: [
      { kind: '概括', text: '对孟子式道德端绪的质问是：恶行、贫困、暴力和偏私如何进入理论？相关回应会强调端绪是可扩展亦可遮蔽的能力，而非自动完成的善。评价仍须说明教育与物质条件为何能支持或损坏养成。', sourceIds: ['CON-2'] },
      { kind: '概括', text: '荀子把自然欲望、有意的努力（wei）、师法与礼联系起来，能解释为何德性需要学习：冲动本身并不可鄙，问题出在不经反省的发作会造成伤害，礼与乐提供了可用的出口。批评者则问这种秩序如何避免把既有权威定为标准——而“道”究竟是圣人发现的还是构造的，正是荀子研究里未定的争论，一段文本说“道非天之道，乃人之所以道也”，另一些段落又强调观察时序规律。不能用“性恶”推成人人天生邪恶，也不能把礼的历史形式免于批评。', sourceIds: ['CON-3', 'CON-4'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '性善不等于人总会做好事；性恶也不等于每个人道德上不可救药。荀子与孟子的分歧主要在“性”指什么——荀子用它指人生而具有的基本官能、能力与欲望——而不在人能否变好：两人都认为所有人都有变好的能力，区别是有人把它发展出来、有人没有。', sourceIds: ['CON-2', 'CON-3', 'CON-4'] },
      { kind: '解释性重构', text: '孝与礼不是自动压倒所有关系中的不平等、伤害或异议；如何批判坏的角色期待是仍待论证的问题。' },
      { kind: '解释性重构', text: '把孔子等同于一个固定“传统文化符号”会掩盖经典、注释和现代政治中的多重重读。', sourceIds: ['CON-1'] },
    ],
    historicalContext: [
      { nodeId: 'pt-daoism', label: '先秦：道家与自然、行动问题', note: '比较自然、行动和规范时，先看相互批评和文本差异，而不制作儒道二元标签。' },
      { nodeId: 'pt-legalism', label: '先秦：墨家、名家、法家等论辩线索', note: '礼、法、兼爱、名实和治理在竞争性方案中展开。' },
    ],
    sources: [
      { id: 'CON-1', title: 'SEP：Confucius', kind: '学术综述', url: 'https://plato.stanford.edu/entries/confucius/', locator: '§1（作为哲学家与传统文化符号的孔子）、§2（生平与思想的文献来源）、§3（礼仪心理与社会价值）、§4（德性与品格养成）、§5（家与国）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 处理文本来源的不确定性；§3 处理礼仪心理；§4 处理德性；§5 处理家国关系；§1 处理孔子在后世被反复重新定位的问题。原定位“导论、§2 及后世接受相关段落”与实际章节对不上：后世接受在 §1，礼与德性在 §3–§4。' },
      { id: 'CON-2', title: 'SEP：Mencius', kind: '学术综述', url: 'https://plato.stanford.edu/entries/mencius/', locator: '§1（生平与儒家背景）、§2（德性及其涵养）、§3（人性之善）、§4（孟子与其哲学对手）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 处理德性的涵养，§3 处理人性之善，§4 处理与告子等人的论辩。该条目没有独立的政治哲学章节，原定位所写的“政治哲学相关章节”不存在，已移除。' },
      { id: 'CON-3', title: 'SEP：Chinese Ethics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-chinese/', locator: '§2.2（礼的中心地位）、§2.6（荀子与孟子论人性及道德的起源）、§2.10（儒家与性别）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.6 引《性恶》篇，说明荀子明确以自己的人性论对立于孟子，并给出 wei（有意的努力）、师法与礼、义如何转化自然情欲的说明（以曲木受蒸而直为喻）；§2.2 处理礼；§2.10 是儒家与性别的独立争论。原条目把本条与 SEP：Xunzi 混成一条“Chinese Ethics / Xunzi”，现已拆开。' },
      { id: 'CON-4', title: 'SEP：Xunzi', kind: '学术综述', url: 'https://plato.stanford.edu/entries/xunzi/', locator: '§2（人性 xing）、§3（礼与乐两种修养方式）、§5（道是被发现的还是被构造的）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 说明 xing 指生而具有的官能、能力与欲望，并指出荀子与孟子都认为人人都有变好的能力；§3 说明冲动本身不可鄙、不经反省的发作才造成伤害，礼与乐（尤其《诗》）提供表达的出口；§5 记录“道非天之道”一段与强调观察时序的段落之间的解释争论。该条目未实质讨论圣人的权威是否依赖这一问题。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜性善／性恶', issue: '原内容将分歧压缩成两种性格判断。', evidence: 'CON-2、CON-3 分别将端绪、欲望、学习、礼和实践置于论证中。', revision: '重写为道德能力与养成条件的争论。' },
      { location: '人物与传统', issue: '原内容默认孔子思想与后世儒家制度同义。', evidence: 'CON-1 指出文本来源、经典化和现代再定位的多层历史。', revision: '新增文本、术语与传承边界。' },
      { location: '来源账｜CON-3 混了两个条目', issue: '原 CON-3 记为“SEP：Chinese Ethics / Xunzi”一条，url 指向 ethics-chinese，locator 却写“§2.6；并参见 Xunzi §2–§5”，把两个不同条目的定位塞进一条来源。', evidence: '本轮分别打开两个条目：ethics-chinese 的 §2.6 是“Xunzi versus Mencius on human nature and the origins of morality”；SEP：Xunzi 是独立条目，§2 人性、§3 礼与乐、§5 道是被发现还是被构造。', revision: '拆成 CON-3（ethics-chinese）与 CON-4（Xunzi），各自按实际章节写定位，并把“荀子”一段与“性善／性恶”一段改挂两条。' },
      { location: '来源账｜CON-1、CON-2 的定位', issue: 'CON-1 的定位与实际章节对不上（后世接受在 §1 而非“§2 及后世接受相关段落”）；CON-2 的定位声称有“政治哲学相关章节”，该条目并无此节。', evidence: '本轮核对两条目目录，见各自 supports。', revision: '两条定位均按实际章节改写，并在 supports 中记下原定位错在哪里。' },
    ], remaining: ['尚未逐段核对《论语》《孟子》《荀子》的中文校勘本与早期注本。', '“礼可能被用来固化不平等”这一判断，目前只由 CON-3 §2.10（儒家与性别）作为一个独立争论题目支持，未核对该节内部各方论证。'], adjacentImpact: '“照护”“自由”“正当性”页可在此互链，但不能把儒家关系性直接当作当代规范结论。原挂在本条历史语境里的 pt-care 是核心问题节点，已删除，应由关系层收录。', nextPriority: '补写墨家、道家、法家与宋明重构，以呈现儒家之外和儒家内部的连续论辩。' },
  },
  'pt-buddhist': {
    status: '核验正文｜自审完成',
    scope: '苦、无我、缘起、空性与认识论——这一页追的是这几个问题怎样在不同文本和学派手里被反复重提、重解。它们在原文里是论证，不是安慰剂，把它们读成一套“东方心灵疗法”会先丢掉论证。教团史、宗教实践、各语种原典的校读，都要回到各自的专门研究。',
    sectionHeadings: { origin: '历史起点与问题线索', boundaries: '文本层次与概念边界', objections: '内部论辩与解释争议', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '早期佛教以苦及其止息为实践取向，同时以无常、苦、无我分析经验与执取；这不是先完成一套抽象形而上学再附带伦理，而是让关于人、因果和认识的论证服务于解脱问题。', sourceIds: ['BUD-1'] },
      { kind: '概括', text: '后来的论师并未只重复同一套口号：部派阿毗达磨、以龙树为代表的中观、瑜伽行及佛教逻辑认识论，分别就法、空性、心识、推理与语言发展争论。用“佛教认为”抹平它们，会先损失争论本身。', sourceIds: ['BUD-2', 'BUD-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '无我针对的是可被执为恒常、独立、主宰的自我，不是取消日常的人称、记忆、因果连续或伦理训练。不同传统对人格、心识和业的解释并不相同。', sourceIds: ['BUD-1', 'BUD-2'] },
      { kind: '概括', text: '中观的空性以缘起反对自性：事物不是靠自身、脱离条件而成立。它需要与二谛、论辩对象和后世注释传统一起理解，不能直译成“世界不存在”或近代哲学中的单一反实在论。', sourceIds: ['BUD-3'] },
    ],
    objections: [
      { kind: '概括', text: '无我面对一个真正困难：若没有不变主体，记忆归属、业报和修行进展凭什么连接？印度佛教文本给出的不是一个答案而是一组竞争方案：以心与因果的关系说明刹那间的相续；以“有分心”说明一段生命过程的延续；以心流中的“摄取”与“种子”说明业如何被携带；以藏识作更强的载体假设；以还原与随附来处理“人”的地位。它们互相竞争，没有一个被全体接受。', sourceIds: ['BUD-2'] },
      { kind: '概括', text: '空性也被批评为削弱因果与规范。中观回应以约定层次保留因果、语言和修行，但“约定”如何有规范约束力，以及二谛关系如何理解，仍是内部解释争议。', sourceIds: ['BUD-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“无我”不等于否认痛苦、责任或他人，也不自动等于现代心理学的“自我只是幻觉”。' },
      { kind: '解释性重构', text: '“空”不等于“虚无”；“缘起”也不等于任何相关性都构成因果解释。', sourceIds: ['BUD-3'] },
      { kind: '解释性重构', text: '把瑜伽行简称为“唯心主义”会掩盖其围绕表象、认识错误和修行的具体争论。', sourceIds: ['BUD-2'] },
    ],
    historicalContext: [
      { nodeId: 'pt-indian-vedanta', label: '奥义书与吠檀多等传统', note: '比较 ātman、brahman 与佛教无我时，先核对各传统自身的论证和文本层次。' },
      { nodeId: 'pt-chinese-later', label: '两汉至近现代：传承、佛教与重构', note: '佛教进入汉语世界涉及翻译、注释、制度与新问题，不能被看作原理论的无损复制。' },
    ],
    sources: [
      { id: 'BUD-1', title: 'SEP：Buddha', kind: '学术综述', url: 'https://plato.stanford.edu/entries/buddha/', locator: '§1（佛陀作为哲学家）、§2（核心教义）、§3（无我）、§4（业与再生）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 给出四圣谛与无常、苦的分析；§3 专论无我；§4 处理业与再生如何在无我前提下被说明；§5（对理性的态度）说明这些论证的实践取向。' },
      { id: 'BUD-2', title: 'SEP：Mind in Indian Buddhist Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/mind-indian-buddhism/', locator: '§1.1（无我教义）、§1.2（无我的解脱论维度）、§5.1（心与因果）、§5.2（有分心）、§5.3（心流中的摄取）、§5.4（心流中的种子）、§5.5（藏识）、§5.6（人：还原与随附）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1–§1.2 给出无我针对的是被执为恒常主宰的自我，及其解脱论目的；§5.1–§5.6 逐节列出连续性问题的各种竞争方案（因果相续、有分心、摄取、种子、藏识、还原与随附）。原来引用的是 2017 春季归档版；本轮核对当前版本的章节结构与该归档版一致，已改为当前版本 URL。' },
      { id: 'BUD-3', title: 'SEP：Nāgārjuna', kind: '学术综述', url: 'https://plato.stanford.edu/entries/nagarjuna/', locator: '§2（空性与 svabhāva）、§3.1–§3.5（针对自性的各组论证：因果、变化、人格同一、认识、语言与真理）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 界定空性与自性的关系；§3 各节给出反自性论证的具体形式，并处理把空性读成虚无论的误解。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '摘要与人物', issue: '原页面将无我、空性、心识并列，却没有文本层次与学派差异。', evidence: 'BUD-1、BUD-2、BUD-3 分别处理早期佛教、印度佛教心识与中观。', revision: '新增历史起点、概念边界与内部论辩，避免单一“佛教观点”。' },
      { location: '例子｜失败者标签', issue: '原例子容易将无我心理治疗化。', evidence: 'BUD-1 将相关分析置于苦与止息；BUD-2 讨论理论分歧。', revision: '保留例子为入门，不把它当作无我论证或修行建议。' },
    ], remaining: ['尚未逐段核对《阿含》《中论》及瑜伽行论书的汉译版本和梵／藏文本；不可把本页当作原典释读。'], adjacentImpact: '“心灵与自我”“存在与变化”“解释与传统”三页均须链接到此处，并保留跨传统不可直接对译的提醒。', nextPriority: '补写中国佛教的翻译、注释与宗派形成，避免印度佛教代表全部佛教历史。' },
  },
  'pt-nyaya': {
    status: '核验正文｜自审完成',
    scope: '正理与胜论把“怎样获得真知”和“怎样在论辩中给出能被对手检查的理由”当成同一个问题的两面，这一页就沿认识手段（pramāṇa）、推理、证言与反驳这四条线走。请把它当作一套自有目标的认识论来读，它要解决的不是符号化问题；作者年代、文本归属和新正理的技术语言，这里只交代到能读下去的程度。',
    sectionHeadings: { origin: '历史起点与论辩任务', boundaries: '认识手段与推理边界', objections: '争论与方法难题', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '正理传统把获得真知、排除错误和在论辩中给出理由作为相连任务。它以 [[pramana|pramāṇa（认识手段）]] 讨论知觉、推理、比喻与证言等方式，又为推理单列一套失效类型（hetv-ābhāsa，“似是而非的理由”）；这说明认识论与论辩规范在此不可分开。', sourceIds: ['NYA-1', 'NYA-3'] },
      { kind: '概括', text: '印度认识论并无单一清单：正理与其他学派对有效认识手段的数量、证言地位、对象和错误理论有不同答案。把 pramāṇa 简单译为“证据”会遗漏它关于认识成功条件的技术含义——它说的是“把认知造成为知识的那种来源”，而不是摆在人面前的材料。', sourceIds: ['NYA-1'] },
    ],
    boundaries: [
      { kind: '概括', text: '从烟推知火不是“看到烟就猜火”：推理需要被推论项与理由项之间的遍在／伴随关系，并须面对反例、观察条件和推理用途。五支论证（命题、理由、例证、应用、结论）也不是给内心推理多加三步：按正理自己的说明，这种成型的证式是要在教学与论辩场合把内在推理展示出来，供他人逐支检查。', sourceIds: ['NYA-1', 'NYA-3'] },
      { kind: '概括', text: '证言在正理传统中可成为知识来源，却不等于服从权威；说话者的可信性、话语理解、意向和对象条件都进入评价。', sourceIds: ['NYA-1'] },
    ],
    objections: [
      { kind: '概括', text: '对推理的难题是：遍在关系如何确立而不循环？仅见到许多烟火同现并不能自动排除隐藏条件。正理回应会引入正反例、排除阻碍条件等分析，并把“未能排除”的各种情形整理成可点名的失效类型；但这套分析是否够用，正是后续论辩的内容。', sourceIds: ['NYA-1', 'NYA-3'] },
      { kind: '概括', text: '这个难题在新正理手上并没有被宣布解决，而是被逼到定义层面：伽格舍在《真知宝》里逐一否决了此前二十一种关于遍在关系的定义，才提出自己的“定说之定义”。这说明该传统把“反例排除”当作一个技术上仍未收口的问题，而不是一句方法论口号。', sourceIds: ['NYA-2'] },
      { kind: '概括', text: '不同学派会争论证言是否独立于推理、语言是否能可靠指称、知觉是否带概念。因而“正理承认证言”不是终点，而是要进一步追问可信性的规范来自何处。', sourceIds: ['NYA-1'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“五支论证”不等于现代形式逻辑的失败版本；它有不同的交流目的、语义资源和论辩情境。', sourceIds: ['NYA-3'] },
      { kind: '解释性重构', text: '承认证言不等于取消检验；问题转为可靠说话者、理解、传递和反驳如何组织。' },
      { kind: '解释性重构', text: '“印度哲学重直觉、不重论证”与正理传统的材料直接冲突。' },
    ],
    historicalContext: [
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '佛教认识论与正理传统既共享论辩空间，也在知觉、推理和对象上激烈分歧。' },
    ],
    sources: [
      { id: 'NYA-1', title: 'SEP：Epistemology in Classical Indian Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology-india/', locator: '§1.1（Knowledge and Knowledge Sources）、§2（Skepticism，含 hetv-ābhāsa 的引入）、§4（Perception）、§5（Inference）、§6（Testimony）、§7.1–§7.4（比喻、arthāpatti、anupalabdhi 等候选来源）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1 把 pramāṇa 定义为“以正确方式造成认知”的知识来源；§4、§5、§6 分别专论知觉、推理与证言；§7 逐条列出各学派承认或否决的候选认识手段，即“清单不唯一”的依据。原定位“导论、§1–§2”把知觉、推理、证言都算在 §1–§2 内，与实际章节不符；该条目也不讨论五支论证，那部分已改挂 NYA-3。' },
      { id: 'NYA-2', title: 'SEP：Analytic Philosophy in Early Modern India', kind: '学术综述', url: 'https://plato.stanford.edu/entries/early-modern-india/', locator: '§8.1–§8.4（逻辑理论与伽格舍对遍在关系 vyāpti 的分析，含“无反例”定义与 siddhānta-lakṣaṇa）、§7.3（伽格舍对知觉定义的批评与新定义）', checked: 'verified', checkedOn: '2026-09-11', supports: '§8 记录伽格舍《真知宝》否决二十一种 vyāpti 定义后另立“定说之定义”，§7.3 记录他对既有知觉定义的三点批评；两处共同支持“新正理是技术推进而非古代余响”。原定位“导论、§2”指向的是 §2 Physical Substance（胜论的物质实体），与本条论断无关。' },
      { id: 'NYA-3', title: 'IEP：Nyāya（Matthew R. Dasti）', kind: '学术综述', url: 'https://iep.utm.edu/nyaya/', locator: '§1.b.ii（The Structure of Inference）、§1.b.iii（Inferential Defeaters or Fallacies）、§1.d（Testimony, śabda）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.b.ii 处理五支证式（pratijñā、hetu、udāharaṇa、upanaya、nigamana），并明说“成型的证式意在映现内心进行的那种推理，用于教学或论辩目的”，这是“五支不是多三步的演绎”的直接依据；§1.b.iii 给出失效理由（hetvābhāsa）的分类。本条同时是本页唯一非 SEP 的综述来源。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '例子｜烟与火', issue: '原例子只把正理写成“看到烟所以有火”的直觉。', evidence: 'NYA-1 §5 将推理置于遍在关系、反例和认识手段之中。', revision: '补入推理条件、反例和公共展示的功能。' },
      { location: '人物列表', issue: '原文罗列作者，未说明该传统解决什么知识问题。', evidence: 'NYA-1 的组织中心是 pramāṇa 与知识条件。', revision: '以认识、推理和证言的争论重写历史入口。' },
      { location: '来源账｜NYA-1 的定位', issue: '原定位写“导论、§1–§2”，supports 却声称覆盖 pramāṇa、知觉、推理、证言与学派争论。', evidence: '本轮实际打开该条目核对目录：§1 各学派的共同预设（§1.1 知识与知识来源）、§2 怀疑论、§3 知道自己知道、§4 知觉、§5 推理、§6 证言、§7 比喻及其他候选来源、§8 tarka、§9 当代讨论。知觉在 §4、推理在 §5、证言在 §6，都不在原定位内。', revision: '定位逐节改准，并在 supports 中写明原定位错在哪里。' },
      { location: '定义与边界｜五支论证', issue: '“五支论证不是任意比演绎多三步，而服务于公共论辩中的展示”原挂 NYA-1，而该条目不讨论五支证式。', evidence: '本轮核对 NYA-1 全部章节，无 pañcāvayava／五支的讨论；IEP：Nyāya §1.b.ii 有该内容并给出“for didactic or polemical purposes”的措辞。', revision: '新建 NYA-3（IEP：Nyāya），把该断言改挂过去，并把五支的五个名目补写出来。' },
      { location: '来源账｜NYA-2 由孤挂改为承重', issue: 'NYA-2 此前只出现在自己的定义行，没有任何段落引用它；其定位“导论、§2”指向的是胜论的物质实体一节，与它自称支持的“新正理的延续”无关。', evidence: '本轮打开该条目：§8 是逻辑理论与伽格舍对遍在关系的分析，§8.4 即 siddhānta-lakṣaṇa。', revision: '定位改为 §8.1–§8.4、§7.3，并在“争论与方法难题”新增一段，让它真的支撑“反例排除仍是技术未收口的问题”。' },
      { location: '放回历史语境', issue: '原 historicalContext 三条里有两条（pt-knowledge-sources、pt-logic）是 type 为“核心问题”的节点，却渲染在历史语境标题下。', evidence: 'data.json 中两者的 type 均为“核心问题”；relations.ts 已收录本条与它们的语义边。', revision: '删除这两条，只留 pt-buddhist（传统线索）。' },
    ], remaining: ['尚未逐一核对《正理经》、注释与新正理论书的中文／英译及作者年代；本页对五支证式的说明仍只依据英文综述，未核对原典条文。', 'NYA-3 的 §1.f（一般知识论）与 §2（形而上学）本轮未核对，不能据本页对胜论范畴论作断言。'], adjacentImpact: '“知识来源”和“逻辑”页应回链到本条；不可把正理只当作西方逻辑史之外的旁注。原挂在本条历史语境里的 pt-knowledge-sources、pt-logic 两条已删除，由 relations.ts 收录。', nextPriority: '补写胜论的范畴论与正理—佛教论辩的原典阅读路径。' },
  },
  'pt-being-change': {
    status: '核验正文｜自审完成',
    scope: '主线只跟一个人工物走：零件被逐步换掉之后，它凭什么还是原来那一个对象。会用到的工具是数值同一性、几条候选判断标准，以及“对象如何跨时间持续”的几种理论。过程哲学与中观的自性批判排在进阶关联里，它们和主线问的不是同一个问题。人格同一性、物理学的时空结论要另页处理。',
    origin: [
      { kind: '概括', text: '跨时间同一性的问题从一个张力出现：对象真的变化时，前后状态有不同性质；但若完全不是同一个对象，又似乎没有任何对象经历变化。数值同一性与质的相同的区分使这个张力可被具体分析。', sourceIds: ['BEC-1'] },
      { kind: '原创例子', text: '本页以逐步维修、旧零件重组为自行车案例，循序比较材料、结构／功能和因果历史连续性；案例是教学性重构，不是哲学家的原话。' },
    ],
    boundaries: [
      { kind: '概括', text: '数值同一性问甲与乙是否为一个对象而非两个；质的相同或相似问两个对象共享哪些性质。改变后的同一对象可在不同时刻有不同性质。', sourceIds: ['BEC-1'] },
      { kind: '概括', text: '耐存论与延存论／四维主义是在解释对象如何持续；它们不等于材料、结构或历史连续的候选判断标准，也不自动裁决忒修斯之船式案例。', sourceIds: ['BEC-2'] },
    ],
    objections: [
      { kind: '概括', text: '材料连续性说明了原料直觉，却要面对逐步替换的界线；结构与功能说明了维修后的可用性，却难以排除复制品；因果历史连续性可以区分复制与延续，却仍要处理拆解、停放和分叉。它们是竞争性理由，不是已获证明的唯一判准。', sourceIds: ['BEC-1'] },
      { kind: '概括', text: '时间部分理论借不同时间部分解释对象怎样具有不同时间的性质；耐存论则把对象看作在每一存在时刻完整在场。双方都需要回应直觉、重合与变化的难题，且讨论中还存在混合或非标准立场。', sourceIds: ['BEC-2'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“同一”不等于“毫无变化”；一个对象可因持续的组织、关系或过程而同一，却不保有每一部分和性质。' },
      { kind: '解释性重构', text: '“空”不等于“虚无”或“什么说法都对”；它首先针对以独立自性解释事物的方式。', sourceIds: ['BEC-4'] },
      { kind: '解释性重构', text: '本体论的“存在”不等于“肉眼可见”：数字、制度、事件与理论实体的存在方式是仍待论证的问题。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从巴门尼德、赫拉克利特到亚里士多德，变化与实体已形成不同问题线。' },
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '缘起、无我与空性必须放在具体论证和修行目标中，不可只译为抽象本体论。' },
    ],
    sources: [
      { id: 'BEC-1', title: 'SEP：Identity Over Time', kind: '学术综述', url: 'https://plato.stanford.edu/entries/identity-time/', locator: '§1（导论：数值同一与质的相同之分）、§2.1–§2.4（共时／历时同一、莱布尼茨律与“暂时内在性质”难题、候选解法）、§4.3（Identity: ‘Strict’ and ‘Loose’）、§4.5（Four Dimensionalism）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 给出“质的同一是完全相似，数值同一是一个而非两个”的措辞；§2.3 以莱布尼茨律构造变化难题（前后有不同性质却是同一物）；§4 导论与 §4.3 处理忒修斯之船式重组与严格／宽松同一性；§4.5 处理四维主义。' },
      { id: 'BEC-2', title: 'SEP：Temporal Parts', kind: '学术综述', url: 'https://plato.stanford.edu/entries/temporal-parts/', locator: '§1（导论）、§2（What are temporal parts…：耐存论与延存论的界定）、§3（Change and Temporal Parts）、§4.1–§4.2（暂时重合与永久重合，含泥像与 Tibbles）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 给出“持续的两种最流行说法是延存论与耐存论”并逐一界定；§3 说明时间部分怎样解释同一对象在不同时刻具有不同性质；§4 是重合难题（忒修斯之船一类案例的当代形态）所在。原来引用 2024 春季归档地址；本轮核对活链与该归档版章节完全一致（两版都标注 2020-05-05 最后实质修订），已统一为活链，与 data.json 一致。' },
      { id: 'BEC-3', title: 'SEP：Process Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/process-philosophy/', locator: '§1（Historical contributions，怀特海“实际契机”与“合生”／“摄受”的段落）、§2（Three tasks of process philosophy）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 写出怀特海系统里“实在的基本单位是一个事件式的实体，即‘实际契机’，它是数据传递过程（‘摄受’）整合、‘合生’为新数据的统一体”；§2 给出过程哲学自设的任务，即本条只把它当作与主线不同的问题而非竞争判准的依据。原定位“导论及关于怀特海‘实际契机’的段落”无法定位，已改为章节号；原来引用 2023 夏季归档地址，本轮核对活链章节一致（同为 2022-05-26 实质修订），已统一为活链。' },
      { id: 'BEC-4', title: 'SEP：Nāgārjuna', kind: '学术综述', url: 'https://plato.stanford.edu/entries/nagarjuna/', locator: '§2（Emptiness and svabhāva）、§3.1（Causation）、§3.2（Change）、§3.5（Language and truth）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 界定空性与自性的关系；§3.1、§3.2 是针对因果与变化的反自性论证，与本页的持续问题相邻但问题不同；§2 同时记录“中观其实是主张无物存在的虚无论”这一读法有较长历史但有系统与历史两方面的有力反证，中观自身明说其立场避开两种极端——这是“空不等于虚无”的直接依据。《中论》在 §1 被定位为其最重要著作、四百五十颂。' },
      { id: 'BEC-5', title: 'SEP：Plato’s Middle Period Metaphysics and Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/plato-metaphysics/', locator: '§1（The Background to Plato’s Metaphysics）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 给出巴门尼德式论证的转述（“变化意味着某物成为它此前不是的东西”，因而无物能变化），并明言残存的巴门尼德文本太少，无法判定他主张的是严格的数值一元论还是“只有一类东西”，解释争议由此而来。' },
      { id: 'BEC-6', title: 'SEP：Heraclitus', kind: '学术综述', url: 'https://plato.stanford.edu/entries/heraclitus/', locator: '§3.1（Flux）、§3.2（The Unity of Opposites）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3.1 明确“有些东西恰恰靠变化才保持同一”，并以河流为“靠更换所含之物而保持其所是”的存在物，还指出流变对常驻并非破坏性、反而在某些情形下是常驻的必要条件——这正是本页“靠更替而持续”的谨慎读法；§3.2 处理对立面的关联。' },
      { id: 'BEC-7', title: 'SEP：Aristotle’s Metaphysics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/aristotle-metaphysics/', locator: '§6（Substance, Matter, and Subject）、§8（Substances as Hylomorphic Compounds）', checked: 'verified', checkedOn: '2026-09-11', supports: '§6 从《物理学》一侧把个别实体分析为“述谓复合体”，并处理变化即质料取得或失去形式；§8 处理质料与形式在生成中的分工、以形式而非质料为本质。该条目同时指出“实体形式是普遍者还是个别者”是《形而上学》解释中最大且争议最多的单一问题。' },
      { id: 'BEC-8', title: 'SEP：Locke on Personal Identity（兼论《人类理解论》II.xxvii）', kind: '学术综述', url: 'https://plato.stanford.edu/entries/locke-personal-identity/', locator: '§1（Locke on Persons and Personal Identity: The Basics），尤其其中对 II.xxvii.7 与 II.xxvii.9 的引用', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 引洛克“并非实体的统一性涵盖一切种类的同一性……我们必须考虑该词所代表的观念”（L-N 2.27.7），据此说明须先定下种类的名义本质再问持续条件，并逐一区分原子、物质集合、植物、动物、人与人格各有不同的同一性条件。原定位写“II.xxvii.1、.7–.9”，该节实际引用的是 2.27.1、.7、.9 等条，其中并无 .8，已改准。' },
      { id: 'BEC-9', title: '休谟《人性论》I.4.2（English Philosophical Texts Online）', kind: '原典', url: 'https://englishphilosophy.org/hume/thn/1/4/2', locator: 'I.4.2 “Of scepticism with regard to the senses”，第 .29–.35 段与第 .44–.47 段（该站以 [Hume.THN.1.4.2.n] 形式逐段编号）', checked: 'verified', checkedOn: '2026-09-11', supports: '第 .29–.35 段给出想象力如何把相关知觉的序列滑成同一对象（“思想沿这一相继系列滑行时如此顺畅，仿佛只在考虑一个对象，因而把相继混同为同一”，第 .34 段）；第 .44–.47 段给出压眼成双像一类经验对独立存在信念的削弱，以及“哲学体系”只是从俗常体系借力。据此不把休谟简化为任意命名论。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主文前半｜问题层级', issue: '原模板把存在论、对象持续、基本性和空性并列呈现，零基础读者难以知道先解决什么。', evidence: 'BEC-1、BEC-2 分别以同一性／持续问题组织讨论；BEC-3、BEC-4 的问题范围不同。', revision: '主文只围绕逐步替换与重组案例；过程哲学、基本性和中观移入默认折叠的进阶关联。' },
      { location: '候选标准与练习', issue: '旧页面给出结论与问题列表，却没有走完理由、反例、回应和剩余困难。', evidence: 'BEC-1 讨论重组、严格／宽松同一性；BEC-2 说明持续理论并非身份判准的同义替换。', revision: '补写材料、结构／功能、因果历史连续的推演，并给出两道含参考分析的迁移练习。' },
      { location: '进阶关联｜中观', issue: '将空性与西方持续理论放在同一立场列表，易被读成“万物不存在”或同义学说。', evidence: 'BEC-4 §2–§3 区分自性、空性和依赖；BEC-3 的问题是过程在本体论解释中的地位。', revision: '明确它们各自的问题对象、范围与不可直接等同的边界。' },
      { location: '人物比较｜历史立场', issue: '页面只有理论名称，读者无法判断人物是在回答同一性准则、变化的可能性，还是本体论的基本单位。', evidence: 'BEC-5–BEC-9 分别将巴门尼德、赫拉克利特、亚里士多德、洛克与休谟放在不同问题中；BEC-3 的过程哲学与 BEC-4 的中观论证另有各自语境。', revision: '新增逐人比较：每项说明原问题、可怎样启发自行车案例，以及不能由此推出什么。' },
      { location: '容易混淆的地方｜“空”不等于“虚无”', issue: '“‘空’不等于‘虚无’或‘什么说法都对’；它首先针对以独立自性解释事物的方式”一句原挂 BEC-3，而 BEC-3 是 SEP：Process Philosophy。', evidence: '本轮实际打开 BEC-3：全部七节均为过程哲学的历史贡献、任务、与科学的关系等，无空性或自性内容；该判断的材料在 BEC-4（SEP：Nāgārjuna）§2，那里明说中观自身避开两种极端、并反驳“无物存在”的读法。', revision: 'sourceIds 由 BEC-3 改为 BEC-4。' },
      { location: '来源账｜九条定位与归档／活链混用', issue: '九条来源全部标 pending，其中 BEC-3 的定位是“导论及关于怀特海‘实际契机’的段落”这类无法定位的表述；BEC-2、BEC-3 用归档地址而 data.json 用活链，文件里没有一处说明为什么。', evidence: '本轮逐条实际打开核对目录：BEC-2 活链与 spr2024 归档版章节一致（均标 2020-05-05 实质修订），BEC-3 活链与 sum2023 归档版一致（均标 2022-05-26），两条归档地址没有任何必须保留的理由。', revision: '九条定位全部改为实际章节号并附小节标题，BEC-2、BEC-3 改为活链；BEC-8 删去实际不存在的 II.xxvii.8。' },
    ], remaining: ['尚未逐段校勘《中论》汉译与相关注释传统；未逐章核对怀特海《过程与实在》的可靠中译本与二手研究分歧。本页不把这些材料当作原典释读或学界定论。', 'BEC-9 的核对只到该网站转录本的段落编号一级，未与 Selby-Bigge／Norton 校勘本逐段对照，段号与纸本版本的对应仍待确认。', '本条的手写主文由 being-change-entry.tsx 承担，它只读本账的 sources／scope／status／review；ledger 的 origin、boundaries、objections、confusions 四段在本页不渲染。本轮已按数据正确性修好其中的错挂，但要让这些段落真的到达读者，须由渲染层或精读层另作安排（不在本文件内）。'], adjacentImpact: '“心灵、身体与我”页仍须把人格同一性同一般对象持续分开；“佛教哲学”页须保留缘起、无我与空性的自身论证语境。', nextPriority: '在独立审查中逐段核对主文与 BEC-1／BEC-2 的对应，并补充《中论》可靠汉译版本与章段。' },
  },
  'pt-knowledge-sources': {
    status: '核验正文｜自审完成',
    scope: '这一页问的是：一个信念凭什么算有理由、知识怎样取得、以及在哪里到头。“知识”在这里不是可被考核的信息量。经验、推理、证言与修行实践在不同传统中各占什么位置，是页内要比较的问题，不是页首就定下的前提。',
    origin: [
      { kind: '概括', text: '我们会发现自己相信某事，却仍要问：它是真的、理由足够，还是只是碰巧猜对？感知、记忆、内省、推理和他人证言都能带来信念，也都可能出错；认识论因此既问来源，也问[[epistemic-justification|正当性（信念的理由）]]、纠错与边界。', sourceIds: ['KNO-1'] },
      { kind: '概括', text: '古典印度认识论以 [[pramana|pramāṇa（有效认识手段）]] 为组织线索，围绕知觉、推理与证言等来源展开分歧。不同学派所承认的来源及其条件不同，不能把它们粗译为西方经验主义／理性主义。', sourceIds: ['KNO-2'] },
    ],
    boundaries: [
      { kind: '概括', text: '“有真信念”不等于“有知识”，而盖梯尔的第二个案例把这句话做成了一条可以逐步检查的机制。史密斯有强证据支持“琼斯有一辆福特车”，于是从它演绎出“要么琼斯有一辆福特车，要么布朗在巴塞罗那”；析取式由第一支蕴含，所以他相信析取式也是有正当理由的。可是琼斯开的其实是租来的车，而布朗恰好就在巴塞罗那。于是三条件同时成立——析取式为真、他相信它、他的相信有正当理由——他却不知道它。要点不在“运气”这个词，而在正当性的来路：它经演绎从一个有正当理由的假信念传到了一个恰好为真的结论，使结论为真的那件事与他的理由毫无关系。此后的理论正是在补这个缺口：可靠过程、反事实安全性、认知能力或社会实践。', sourceIds: ['KNO-1', 'KNO-3'] },
      { kind: '解释性重构', text: '[[testimony|证言]]不是“未经验证的传闻”的同义词。依赖专家、历史档案和他人报告是认识生活的常态；关键是来源能力、利益冲突、传递链和可纠错机制，而不是要求每个人亲自重做一切证据。' },
    ],
    objections: [
      { kind: '概括', text: '经验主义若把一切知识压到感觉输入，会难以说明逻辑、数学、概念和证言的作用；理性主义若把可靠性主要交给先天结构，又须解释它如何接触具体世界。较成熟的理论通常承认多种来源，却要说明它们冲突时的权重。', sourceIds: ['KNO-1'] },
      { kind: '概括', text: '把证言列为独立认识手段会面临“为什么不都还原为个人推理”的质疑；印度传统的争论正要求说明说话者可靠性、语句理解与缺席对象的知识如何成立，而不是只给权威贴标签。', sourceIds: ['KNO-2'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '怀疑论不是“什么都不知道”的口头姿态；它要求指出何种理由不能排除错误、幻觉或运气，并且通常是靠一条看起来无害的原则推进的——例如“知识在已知推论下封闭”。要挡住它，就得说明是哪一步不成立。', sourceIds: ['KNO-1'] },
      { kind: '解释性重构', text: '证据不是孤立数据点，而是与测量、背景假设、推理和可追问来源共同构成。' },
      { kind: '解释性重构', text: '“相信专家”并非放弃批判；应从可解释性、独立核查、专业共同体和利益结构评价证言。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '理性主义／经验主义是重要教学线索，但不能覆盖全部近代认识论。' },
      { nodeId: 'pt-nyaya', label: '正理、胜论及认识—论辩传统', note: '从 pramāṇa、推理和证言的细致分歧进入印度认识论。' },
    ],
    sources: [
      { id: 'KNO-1', title: 'SEP：Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology/', locator: '§2.3（Knowing Facts，含 JTB 与盖梯尔）、§3.1–§3.3（正当性：义务论与非义务论、什么使信念正当、内在／外在）、§5.1–§5.5（知觉、内省、记忆、理性、证言）、§6.1–§6.2（普遍与选择性怀疑论、对闭合论证的各种回应）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.3 明说“如盖梯尔所示，有些正当真信念并不是知识”；§3 是正当性理论；§5 逐节给出五类认识来源；§6.1 区分普遍与选择性怀疑论，§6.2 专列对闭合论证的回应。原定位“导论、§1–§3”不覆盖认识来源（§5）与怀疑论（§6），已改准。' },
      { id: 'KNO-2', title: 'SEP：Epistemology in Classical Indian Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology-india/', locator: '§1.1（Knowledge and Knowledge Sources）、§4（Perception）、§5（Inference）、§6（Testimony）、§7.1–§7.4（各学派承认或否决的候选来源）、§9.1（Epistemic Luck）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1 把 pramāṇa 定义为“以正确方式造成认知”的知识来源；§4–§6 分别专论知觉、推理、证言；§7 逐条处理比喻、arthāpatti、anupalabdhi 等候选来源，即“各学派清单不同”的依据；§9.1 是印度材料与当代认知运气讨论的接口。原定位“导论、§1–§2”把知觉、推理、证言都算进 §1–§2，与实际章节不符。' },
      { id: 'KNO-3', title: 'Edmund L. Gettier, Is Justified True Belief Knowledge?', kind: '原典', url: 'https://www.ditext.com/gettier/gettier.html', locator: '开篇的三条件表述；Case I；Case II 中命题 (f)–(i) 那一段（ditext 在线全文转录）', checked: 'verified', checkedOn: '2026-09-11', supports: 'Case II 给出命题 (h)“要么琼斯有一辆福特车，要么布朗在巴塞罗那”，写明史密斯“在 (f) 的基础上接受 (g)、(h)、(i)”“因此对这三个命题的相信都是完全正当的”，并以“史密斯并不知道 (h) 为真，尽管 (i) (h) 为真、(ii) 史密斯相信 (h) 为真、(iii) 史密斯有正当理由相信 (h) 为真”收束。这是本页所写机制（正当性经演绎从一个有正当理由的假信念传到恰好为真的析取式）的逐字依据。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜经验与理性', issue: '原文把它们写成穷尽的二选一。', evidence: 'KNO-1 §5 将证言、记忆、内省和推理也列为认识来源。', revision: '改为多来源结构，并提出冲突权重问题。' },
      { location: '传统连接｜印度哲学', issue: '原文只把正理作为“印度的逻辑”。', evidence: 'KNO-2 §1.1 以 pramāṇa 组织知觉、推理和证言的争论。', revision: '新增认识手段、证言与不可直接翻译的边界。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单没有区分确定性诉求、归纳问题、认识手段和认知运气。', evidence: 'KNO-1 区分知识、正当化和多种来源；KNO-2 将正理放入 pramāṇa 的竞争理论；KNO-3 给出正当真信念不足的两个反例。', revision: '新增四个比较单元，逐一套用到公共卫生转述链，并明确盖梯尔未提供公认的最终定义。' },
      { location: '定义与边界｜盖梯尔案例', issue: '来源账精确到 Case I、Case II，正文却只有三句同义转述（“看似好理由却因运气而真”），案例的机制一次也没出现。读者读完不知道盖梯尔到底做了什么。', evidence: 'KNO-3 的 Case II 是可逐步复述的：从一个有强证据的假信念 (f) 演绎出析取式 (h)，正当性随演绎传递，而 (h) 之为真靠的是另一支。', revision: '把这一段重写成机制说明：命题、演绎、正当性的来路、以及为什么“使它为真的事与他的理由无关”才是要点；并说明后续理论补的是这个缺口。' },
      { location: '容易混淆的地方｜怀疑论', issue: '原文只说怀疑论“要求指出何种理由不能排除错误”，没有提它靠什么推进。', evidence: 'KNO-1 §6.2 专列对闭合论证的各种回应，说明当代怀疑论争论的形状是“哪一步不成立”。', revision: '补入闭合原则，并把 sourceId 挂到 KNO-1。' },
    ], remaining: ['尚未完成中文 pramāṇa 译名和正理原典版本的对勘。', '做梦论证与缸中之脑的具体重构本轮未写进本账；论证骨架现由 argument-maps.ts 承担，本账只交代闭合原则这一步。若要在研究层细述，须另核 KNO-1 §6.3–§6.5。'], adjacentImpact: '与“科学与实在”连接时，不能把科学证据降为单一感官经验；与“身份与压迫”连接时，应另说明证言不公与一般证言理论的关系。', nextPriority: '补写正理历史线索的阅读路径，并校对中文原典选本。' },
  },
  'pt-religion-reason': {
    status: '核验正文｜自审完成',
    scope:
      '这一页比较的是几类论证怎样被评价：从宇宙、经验、道德或启示出发的理由各要求什么标准，一个要解释苦难的世界观要付出什么代价。它不判定任何传统为真或为假，“神”在这里也不是一个已经定好的有神论概念。儒家、佛教、印度与伊斯兰传统的具体问题另有历史条目和原典入口。',
    origin: [
      {
        kind: '概括',
        text:
          '问题不是简单地问“信不信”，而是问：宇宙、经验、道德或启示能否构成理由；不同理由要求的证据标准是否相同；一个解释苦难的世界观要付出什么代价。自然神学以通常的人类认知能力——理性、感知、内省——考察宗教问题，因而和诉诸神迹、经文等特殊启示的神学不同。',
        sourceIds: ['REL-1', 'REL-2'],
      },
      {
        kind: '概括',
        text:
          '恶之所以构成一个论证而不只是一种情绪，可以摆出来逐句看：一个全能者有能力阻止任何一件恶；一个全知者知道每一件恶正在发生；一个全善者不会毫无理由地容许恶——而世上确有恶，其中有些既严重又看不出对任何人有什么用处。这几句话难以同时轻松成立，压力就从这里来。压力到底有多强、要多强的回应才算够，是下一节和本页论证地图要分的事。',
        sourceIds: ['REL-2'],
      },
      {
        kind: '解释性重构',
        text:
          '把讨论拆成“是否有理由相信”“理由能否说服异议者”“这种信念能否正当地指导实践”，能避免把私人承诺、公共论证与形而上学结论混为一件事。后三者彼此相关，却没有谁自动推出另一个。',
      },
    ],
    boundaries: [
      {
        kind: '概括',
        text:
          '“恶的问题”至少有两种：逻辑版本试图证明某类神的属性与任何恶不相容；证据（归纳）版本则认为特定、严重或看似无意义的苦难降低该神存在的合理性。两种版本所需的反驳强度不同——挡下前者只要给出一个逻辑上可能且大体可信的故事（辩护），挡下后者却要在证据层面比较苦难的规模与分布。',
        sourceIds: ['REL-2'],
      },
      {
        kind: '概括',
        text:
          '自然神学内部的论证也不是同一种。从世界的某个特征出发的属于后验一路：宇宙有起因、自然有秩序与精细调节、有人报告宗教经验。本体论论证则被划在先验一侧——它自称只用分析的、先验而必然的前提，不从对世界的观察取材。这个区别决定反驳的着力点：后验论证可以被追问“这个特征还有别的解释吗”，先验论证只能在概念与推论本身上被拦下。',
        sourceIds: ['REL-1'],
      },
      {
        kind: '争议性判断',
        text:
          '用“宗教／理性”二分会遮蔽内部差异：同一传统中可以同时有论证、经验、诠释与实践；不同传统的终极实在也未必可直接替换。这里的比较只是方法上的并置，不是等同。',
        sourceIds: ['REL-1'],
      },
    ],
    objections: [
      {
        kind: '概括',
        text:
          '对自由意志回应的有力质疑是：它最多直接解释某些人为伤害，不能单独说明疾病、动物痛苦或自然灾害。回应者可以再提出灵魂成长、自然律必须稳定或人的认知有限等理由，但每一种都要付各自的代价：灵魂成长要说明为什么恰好需要这么多、这样分布的苦难；自然律一路要说明为什么这套律法不能略作调整；认知有限一路则把“我们看不出用处”解释成我们看不出，这同时也削弱了从世界推到神的那些后验论证的效力。',
        sourceIds: ['REL-2'],
      },
      {
        kind: '原文入口',
        text:
          '休谟《自然宗教对话录》不是一段“反宗教名言”，而是让不同人物争论从世界秩序能否推到神的性质。第 2–5 部是设计论证的辩论；第 10 部由斐洛把伊壁鸠鲁的老问题重新摆出（愿意阻止恶而不能，则无能；能而不愿，则不善；既能又愿，恶从何来），第 11 部转向“无限”这类神学措辞本身。读的时候要区分人物发言与作者最终立场。',
        sourceIds: ['REL-3'],
      },
    ],
    confusions: [
      { kind: '解释性重构', text: '“无神论”并不自动等于“认为人生没有意义”；“自然主义”也不等于“只有实验科学能给理由”。' },
      { kind: '解释性重构', text: '一项论证未能证明某一具体传统，不等于它对“是否存在终极解释”没有任何讨论价值。' },
      { kind: '解释性重构', text: '“辩护”只需给出一个大体可信、说明某种恶与神并非不相容的故事；“神义论”还要指出足以使全能者容许一切恶的理由。二者的举证责任不同，不能互换。', sourceIds: ['REL-2'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-medieval', label: '中世纪与跨文化传译', note: '查看自然神学、古典哲学与一神教论辩如何相互翻译。' },
      { nodeId: 'pt-islamic-reason-revelation', label: '存在、理智与启示的古典论辩', note: '避免把“理性与宗教”只写成近代欧洲式对立。' },
    ],
    sources: [
      { id: 'REL-1', title: 'SEP：Natural Theology and Natural Religion', kind: '学术综述', url: 'https://plato.stanford.edu/entries/natural-theology/', locator: '导论（自然神学的界定）、§1.1（Religious language and concepts）、§2（A priori arguments）尤其 §2.1 Ontological arguments 与 §2.1.1 Saint Anselm of Canterbury、§3（A posteriori arguments）尤其 §3.1 cosmological、§3.2 teleological、§3.3 Arguments from religious experience', checked: 'verified', checkedOn: '2026-09-11', supports: '导论把自然神学界定为“运用对人而言‘自然’的认知能力——理性、感官知觉、内省——考察宗教或神学问题”，并与“明确诉诸神迹、经文等特殊启示”的启示神学相对；§1.1 并列 YHWH、新柏拉图主义的“一”、吠檀多的 brahman、摩尔门教的天父，是“不同传统的终极实在未必可直接替换”的依据；§2 与 §3 的顶层分法（先验／后验）支持本页对本体论论证与设计、宇宙、宗教经验诸论证的区分，§2.1.1 是安瑟伦的定位。原定位只写“导论、§3.3”，而 §3.3 是宗教经验论证，既不给出自然／启示的边界，也不覆盖本体论论证。' },
      { id: 'REL-2', title: 'SEP：The Problem of Evil', kind: '学术综述', url: 'https://plato.stanford.edu/entries/evil/', locator: '§1.1（Relevant Concepts of God）、§1.2（Incompatibility Formulations versus Inductive Formulations）、§2、§3.1（归纳版本的论证）、§4（Responses…: Refutations, Theodicies, and Defenses）、§5.1（Human Epistemological Limitations）、§7.1（A Soul-Making Theodicy）、§7.2–§7.3（Free Will / The Freedom to Do Great Evil）、§7.4（The Need for Natural Laws）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1–§1.2 与 §2 给出相关的神概念与“不相容表述／归纳表述”之分；§4 给出辩护与神义论的举证责任差别（辩护是“一个可能为真的故事”，神义论须“指明足以使全能者容许一切恶的理由”）；§7.2–§7.3 是自由意志回应，§7.4 处理自然律，§7.1 是灵魂成长神义论，§5.1 是认知有限一路。原定位“导论、§2–§4、§6”把自由意志、灵魂成长、自然律这三条本页实际使用的回应全部落在 §7 之外，且 §6 是“Attempted Defenses”而非本页所述内容。' },
      { id: 'REL-3', title: 'David Hume, Dialogues Concerning Natural Religion（Project Gutenberg eBook #4583）', kind: '原典', url: 'https://www.gutenberg.org/cache/epub/4583/pg4583-images.html', locator: 'PART 2–PART 5（设计论证的辩论）、PART 10–PART 11（苦难与神的属性）。注意该古登堡版以阿拉伯数字标 PART 1–PART 12，纸本常用的罗马数字 Part II、Part X 在此页面上不出现', checked: 'verified', checkedOn: '2026-09-11', supports: '全篇由潘费卢斯转述克里安提斯、斐洛、第美亚的对话；PART 2–5 是设计论证的往复；PART 10 内含“EPICURUS 的老问题至今无解。他愿意阻止恶而不能吗？那他就是无能。他能而不愿吗？那他就是恶意。他既能又愿吗？那恶从何而来？”；PART 11 以克里安提斯对神学著作滥用“无限”一词的怀疑开篇。据此可以按部定位，而不需要“相关章节”式的说法。' },
      { id: 'REL-4', title: 'SEP：al-Ghazālī', kind: '学术综述', url: 'https://plato.stanford.edu/entries/al-ghazali/', locator: '§2（Al-Ghazālī’s Reports of the falāsifa’s Teachings）、§3（Al-Ghazālī’s “Refutations” of falsafa and Ismāʿīlism）、§4（The Place of Falsafa in Islam）、§7.1–§7.4（偶因论与次级因果，含《不融贯》第十七讨论）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2–§4 显示安萨里接受亚里士多德式论证（apodeixis）并把它引入神学，甚至写下“一个有效的理性论证绝不会错”，因此不能被写成简单的反理性形象；§7 明说他“并不否认因与果之间存在联系，他否认的是这种联系的必然性”，并把偶因论与次级因果并列为对神之创造活动的“可并存”解释。原定位“导论、§3、§7”未分小节，且把 §2、§4 的吸收材料算进导论。' },
    ],
    review: {
      mode: '自审（尚未独立复审）', checkedOn: '2026-09-11',
      findings: [
        { location: '主要立场｜自然神学与证据主义', issue: '原文把“自然神学”误写成只从自然科学出发。', evidence: 'REL-1 导论将其范围扩展到理性、感知与内省。', revision: '在定义与边界中改为“通常认知能力”，并与启示神学区分。' },
        { location: '案例推演｜灾难之后', issue: '原案例把恶的问题处理为单一反驳。', evidence: 'REL-2 §1.2、§2 区分不相容表述与归纳表述，§4 区分辩护与神义论。', revision: '改以两种论证强度和不同回应的代价提问。' },
        { location: '新增｜哲学家怎样改写这个问题', issue: '原书单只列思想家，混淆了概念论证、宇宙论证、对话式批评和伊斯兰神学内部的证明标准争议。', evidence: 'REL-1 §2.1.1 定位安瑟伦，§3.1 定位阿奎那一路；REL-3 的角色对话限制对休谟的归因；REL-4 §2–§4 显示安萨里不是简单反理性的形象。', revision: '新增四个比较单元，分别写明其论证对象、灾难案例中的用途和不能推出的结论。' },
        { location: '问题起点｜恶为什么构成一个问题', issue: '本条从头到尾没有把恶的问题写成一个论证：origin 讲的是“宗教信念怎样被评价”，读者读完不知道那几个属性和世上的恶之间为什么互相顶住。', evidence: 'REL-2 §1.1 给出相关的神概念，§1.2 给出两类表述；论证的逐前提骨架现由 argument-maps.ts 承担。', revision: '在 origin 新增一段，把全能、全知、全善与“确有严重且看不出用处的恶”四句摆出来说明压力从哪里来，并明确说这里只交代问题为何出现，强度之分留给下一节与论证地图，避免与地图重复。' },
        { location: '定义与边界｜先验与后验的分线', issue: '安瑟伦的本体论论证在精读层挂 REL-1，而 REL-1 原定位（导论、§3.3）是宗教经验论证；本体论论证是纯先验论证，不从世界的任何特征出发，原定位根本不覆盖它。', evidence: '本轮实际打开 REL-1 核对目录：§2 是 A priori arguments，§2.1 Ontological arguments，§2.1.1 即安瑟伦；§3 才是 A posteriori arguments，§3.3 是宗教经验。', revision: 'REL-1 定位扩为导论、§1.1、§2–§2.1.1、§3.1–§3.3，并在“定义与边界”新增一段写出先验／后验的分线及各自可被追问的地方，使这条来源真的承重。精读层若仍把安瑟伦挂在“导论、§3.3”上，须改引 §2.1.1——那部分不在本文件内。' },
        { location: '来源账｜REL-2 的定位与自由意志回应', issue: '“有力反对及回应”整段谈自由意志、灵魂成长、自然律、认知有限四条回应，而 REL-2 原定位是“导论、§2–§4、§6”，这四条中有三条在 §7、一条在 §5.1，全都在定位之外。', evidence: '本轮核对 REL-2 目录：§5.1 Human Epistemological Limitations、§7.1 A Soul-Making Theodicy、§7.2 Free Will、§7.3 The Freedom to Do Great Evil、§7.4 The Need for Natural Laws。', revision: '定位逐节改准；同时把原来压成一句的“回应者可以再提出……”展开为三条各自的理论代价，并写出认知有限一路会反过来削弱后验论证。' },
        { location: '来源账｜REL-3 的部次与 REL-4 的标题', issue: 'REL-3 的定位写“Part II–V, X–XI”，但该古登堡版页面通篇用阿拉伯数字 PART 1–PART 12，读者按罗马数字在页面上搜不到；REL-4 的标题写作“al-Ghazali”，与条目实际标题的转写不一致。', evidence: '本轮抓取 REL-3 页面全文，标题串实测为 PART 1…PART 12；PART 10 内含伊壁鸠鲁四问，PART 11 以“无限”一词开篇。REL-4 条目标题为 al-Ghazālī。', revision: 'REL-3 定位改为 PART 编号并注明与罗马数字的差异，同时在正文里点出第 10 部与第 11 部各自在争什么；REL-4 标题改为 al-Ghazālī。' },
      ],
      remaining: ['尚未逐版本核对阿奎那、安萨里中文译本；原典卡片只作为阅读入口。', 'REL-2 §3.2–§3.5（直接归纳、间接归纳、贝叶斯式版本）本轮只核对到标题一级，未逐段读；本页因此不对证据版本的具体概率构造作任何断言。', 'REL-4 §7 关于“安萨里否认的是因果联系的必然性、而非联系本身”这一点，与 pt-islamic-reason-revelation 把“否认因果必然联系”直接命名为“偶因论”并归给安萨里的写法冲突（该条目把偶因论与次级因果列为可并存的两种解释）。该修正须由 remaining-content-ledgers.ts 与 data.json 的负责人处理，不在本文件内。'],
      adjacentImpact: '与“知识从哪里来”相连时，须保留宗教经验的认识论问题；不得把它直接归为非理性。精读层的安瑟伦卡片须改引 REL-1 §2.1.1。',
      nextPriority: '核对伊斯兰与印度传统原典版本后，补一段可比性与不可比性的说明。',
    },
  },
  'pt-death-meaning': {
    status: '核验正文｜自审完成',
    scope: '这里有三个各自独立的问题，页面把它们分开处理：死亡是否伤害死者、有限的生命是否还能有意义、以及一个人怎样面对世界不提供终极说明这件事。哪一种生活值得过，这一页给不出普遍答案；它也不是心理危机的帮助渠道，如果你正需要这类帮助，请找专业的人。',
    origin: [
      { kind: '概括', text: '死亡问题之所以难，不是因为人必然恐惧，而是因为“伤害”通常要求有一个被伤害者和比较基准：死亡发生后主体不再经验，为什么仍可能使其更糟？伊壁鸠鲁的挑战与当代“剥夺论”正围绕这个缺口展开。', sourceIds: ['DEA-1', 'DEA-2'] },
      { kind: '解释性重构', text: '“我怎样活得有意义”又不是同一个问题。它可以问主观投入、值得投入的对象、人生叙事或终极根据；把它直接化为“快乐多不多”或“死后有人记得吗”会丢掉争论。', sourceIds: ['DEA-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '伊壁鸠鲁以善恶与感觉相关来论证：在世时死亡不在，死亡来到时我们不在。剥夺论并不说死者继续感到痛苦，而是用“本可拥有的善被截断”作比较。', sourceIds: ['DEA-1', 'DEA-2'] },
      { kind: '争议性判断', text: '“意义”不应被用来评判一个受疾病、贫困或压迫限制的人生较不值得。若理论把可选择项目当作唯一来源，它必须说明结构性限制如何进入评价。', sourceIds: ['DEA-3'] },
      { kind: '概括', text: '把“意义”当成已经确定存在、只在来源上有分歧的东西，会漏掉一个仍被认真辩护的立场：虚无主义主张没有哪个人生是有意义的。它的当代版本多数并不依赖有神论或灵魂，反倒常从“意义要求某种我们没有的东西”一类前提出发。', sourceIds: ['DEA-3'] },
    ],
    objections: [
      { kind: '概括', text: '剥夺论要过两道关。第一道是“何时受害”：如果死亡使某人更糟，那是在哪个时刻更糟？可选的答案是与死亡同时、在死亡之前、在死亡之后、或者根本不在任何时刻（死亡对死者是坏的，但不在某个时间上坏）。四条路各有代价，最后一条要放弃“坏事必须发生在某个时刻”这条通常不会被质疑的要求。第二道关是对称性，这条论证出自卢克莱修：回头看出生之前那段同样漫长的不存在，我们并不为它难过；若死后的不存在与它是同一回事，为什么要为死亡难过？', sourceIds: ['DEA-2'] },
      { kind: '概括', text: '对对称性论证的两条回应付的是完全不同的代价，压成一句“诉诸我们实际拥有的生命”就看不出来了。一路（内格尔）主张一个人在形而上学上不可能早很多出生——起源的时间对这个人是本质的——而多活一段却是可能的；代价是要背上一套关于人的本质属性的主张，内格尔本人也承认这些预设可疑。另一路（帕菲特）不谈本质，而指出我们对好东西有一种深广的时间偏倚：希望任何好事落在未来、任何坏事已经过去；代价是它把不对称解释成我们实际的偏好结构，因而必须接着回答“这种偏倚本身是理性的吗”，否则它只描述了不对称而没有为它辩护。', sourceIds: ['DEA-2'] },
      { kind: '概括', text: '剥夺论还有一个不来自伊壁鸠鲁的对手。如果死亡之所以坏，在于它截断了本可拥有的善，那么生命越长应当越好。威廉斯借《马克罗普洛斯事件》主张不会：支撑一个人愿意继续活下去的是范畴性欲望——那些不以“我将继续存在”为条件的欲望——而在足够长的时间里这些欲望会被用尽，剩下压倒性的厌倦，纵然身体始终健康。这条论证若成立，剥夺论就得交代它所说的“本可拥有的善”为什么不会自行耗尽；若不成立，反对者就得说明范畴性欲望凭什么可以无限续接。注意它挑战的是“越长越好”，不是“死亡对死者无关紧要”——它并不站在伊壁鸠鲁那一边。', sourceIds: ['DEA-2'] },
      { kind: '概括', text: '只靠主观满意容易把空洞或有害的投入也算作意义；只靠客观价值又可能无视个人认同。沃尔夫式混合观点因而要求“主观吸引与客观值得相遇”，但“什么算值得”并没有因此被消除。', sourceIds: ['DEA-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '害怕死亡、认为死亡对死者有害、哀悼他人，分别是情绪、价值判断和关系实践，不能互相推出。' },
      { kind: '解释性重构', text: '“荒诞”不是“什么都无所谓”；它描述的是人对终极说明的需求与世界未必提供该说明的张力。' },
      { kind: '解释性重构', text: '人生意义不同于道德正确，也不同于幸福：一项有意义的项目可以艰难，快乐的消遣也未必构成整个人生的意义。', sourceIds: ['DEA-3'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从伊壁鸠鲁的快乐论和死亡论证进入，不把“古人不怕死”当结论。' },
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '比较无常、苦与无我的问题框架时，避免将其简化成西方存在主义。' },
    ],
    sources: [
      { id: 'DEA-1', title: 'Epicurus, Letter to Menoeceus（Internet Classics Archive，Robert Drew Hicks 英译）', kind: '原典', url: 'https://classics.mit.edu/Epicurus/menoec.html', locator: '“Accustom thyself to believe that death is nothing to us”起，至“when we are, death is not come, and, when death is come, we are not”一段。该译本为连续散文，无编号章节，只能按语句定位', checked: 'verified', checkedOn: '2026-09-11', supports: '该段写出“善与恶都以觉知为前提，而死亡是一切觉知的丧失”，以及“死亡对我们无关紧要：我们在时死亡未至，死亡至时我们已不在”。这是本页伊壁鸠鲁论证两个前提的原文入口。' },
      { id: 'DEA-2', title: 'SEP：Death', kind: '学术综述', url: 'https://plato.stanford.edu/entries/death/', locator: '§3.1（The Epicurean Case）、§3.2（The Deprivationist Defense）、§4.1–§4.5（时间难题：Concurrentism / Priorism / Subsequentism / Indefinitism / Atemporalism）、§5.2（The Symmetry Argument）、§7.1–§7.2（Never Dying Would be Good / Would be a Misfortune）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3.1 重构伊壁鸠鲁“一切善恶在于感觉”；§3.2 给出剥夺论“死亡之坏在于它剥夺的善，而非它本身带来的内在恶”；§4 逐条列出“何时受害”的五种答案，含无时论“死亡对死者是坏的，但不在任何时刻”；§5.2 把对称性论证归给卢克莱修并引其诘问，同时分列内格尔的“起源时间是本质的”回应（该条目注明它依赖可疑的本质属性预设）、考夫曼对人／有机体的区分，以及帕菲特的“对一般好事的深广时间偏倚”；§7.2 给出威廉斯《马克罗普洛斯事件》的范畴性欲望与厌倦论证，§7.1 给出内格尔一侧“无论何时死都对死者是坏的”。原定位“§3.1–§3.2、导论”不覆盖时间难题、对称性与不朽问题。' },
      { id: 'DEA-3', title: 'SEP：The Meaning of Life', kind: '学术综述', url: 'https://plato.stanford.edu/entries/life-meaning/', locator: '§3.1（Subjectivism）、§3.2（Objectivism，含沃尔夫的混合观点）、§3.3（Rejecting God and a Soul，含威廉斯式“不朽会变得无聊”的论证）、§4（Nihilism）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3.2 逐字给出沃尔夫的口号“Meaning arises when subjective attraction meets objective attractiveness”（Wolf 2015: 112）；§3.1 与 §3.2 是主观主义与客观主义之争；§4 是虚无主义作为独立立场，§3.3 说明“如今为虚无主义提出的理由多数并不诉诸超自然主义”。原定位只写 §3.2，不覆盖主观主义与虚无主义。' },
      { id: 'DEA-4', title: 'SEP：Albert Camus', kind: '学术综述', url: 'https://plato.stanford.edu/entries/camus/', locator: '§1（The Paradoxes of Camus’s Absurdist Philosophy）、§3（Suicide, Absurdity and Happiness: The Myth of Sisyphus）尤其 §3.1、§3.2 与 §3.3（Criticism of Existentialists）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3 及其小节是《西西弗神话》的荒诞问题、自杀作为回应与理性的限度；§1 说明加缪对系统哲学的排拒，§3.3 说明他明确写作反对存在主义者——这是“不要把加缪直接归入存在主义”的依据。原定位“导论、§2–§3”把 §2（《婚礼集》与起点）当作主要材料，与本页论断不符。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '先把问题拆开｜首段', issue: '原文把意义、死亡之害与荒诞并列但未说明它们的逻辑关系。', evidence: 'DEA-2 与 DEA-3 分别讨论不同问题。', revision: '新增问题起点，明确三种问题不能相互替代。' },
      { location: '人物与原典｜伊壁鸠鲁／内格尔', issue: '原卡片容易让读者以为二人只是在表达不同感受。', evidence: 'DEA-2 §3.1–§3.2 展示的是感觉论与比较性损失的论证分歧。', revision: '在定义、反对与回应中呈现前提与对称性难题。' },
      { location: '有力反对及回应｜“何时受害”从未解释', issue: '原文点名了“何时受害”，随后一句话都没有解释它难在哪里，读者只见到一个术语。', evidence: 'DEA-2 §4 把它拆成五个可比较的答案（同时、之前、之后、不定、无时），并指出无时论要放弃“坏事发生在某时刻”这条要求。', revision: '把四条主要答案与它们各自的代价写进正文。' },
      { location: '有力反对及回应｜对称性论证的署名与两条回应', issue: '对称性论证在原文里没有作者，回应则被压成一句“通常诉诸我们实际拥有的、会被未来截断的生命”，把两条代价完全不同的路线合并了。', evidence: 'DEA-2 §5.2 把该论证归给卢克莱修，并分列内格尔（起源时间是本质属性，条目注明其预设可疑）与帕菲特（对未来之善的理性偏倚）两条回应。', revision: '署名卢克莱修，并把两条回应分开写，各自点明要背什么代价。' },
      { location: '有力反对及回应｜新增威廉斯一路', issue: '本页原先只从“死亡是剥夺”一侧论证，威廉斯《马克罗普洛斯事件》在 positions、objections、texts、philosopherViews、sources 中一次都没有出现——而它恰好是从剥夺论内部逼出的最强反对。', evidence: 'DEA-2 §7.2 给出威廉斯的论证：范畴性欲望终将耗尽，剩下压倒性的厌倦，纵使身体健康也如此。', revision: '新增一段写出该论证及双方各自的举证责任，并说明它挑战的是“越长越好”而不是伊壁鸠鲁那一侧。' },
      { location: '定义与边界｜虚无主义缺席', issue: '本页三个立场都预设生命可以有意义，只在来源上分歧；虚无主义作为一个仍被认真辩护的立场完全没有出现。', evidence: 'DEA-3 §4 以 Nihilism 独立成节，§3.3 说明其当代理由多数不诉诸超自然主义。', revision: '在“定义与边界”补一段点出这个立场及其当代形态。立场卡本身（data.json 的 positions）仍缺虚无主义，须由该文件负责人补。' },
    ], remaining: ['尚未核对加缪中文译本及“荒诞”术语的版本差异。', '威廉斯 1973《马克罗普洛斯事件》与内格尔 1970《死亡》的原文本轮均未读，只核对了 DEA-2 §5.2、§7.2 的转述；若要在正文中细述威廉斯对“范畴性欲望”的界定或内格尔的本质属性论证，须另建原典来源。', 'DEA-1 的英译本无章节编号，本条只能按语句定位；尚未核对希腊文本与其他英译（如 Inwood & Gerson）的段落划分。'], adjacentImpact: '与“什么是值得过的生活”互链时，应注明意义不等同于幸福或德性。data.json 的 positions 仍缺虚无主义这一立场，本条已在“定义与边界”把它点出，但立场卡的补写不在本文件内。', nextPriority: '补充儒家、佛教和非洲哲学关于死亡与关系的原典阅读路径。' },
  },
  'pt-science-reality': {
    status: '核验正文｜自审完成',
    scope: '这一页问的是：科学的解释与预测为什么成功、这种成功能支持多强的真理声称、以及理论被替换的历史该怎么算进来。“科学”在这里不是一套单一方法。某项具体研究的结论是真是假，要靠该领域自己的证据，不在这一页解决。',
    origin: [
      { kind: '概括', text: '科学能预测、干预和统一现象，因而诱发一个形而上学追问：这些成功是否最好由理论所说的不可观察实体和结构大体真实来解释？这就是[[scientific-realism|科学实在论]]的“无奇迹”直觉。', sourceIds: ['SCI-1'] },
      { kind: '概括', text: '历史又不断呈现被替换的成功理论。悲观归纳由此质问：过去成功而后来被弃的理论很多，为什么今天的成功足以保证真实？这个质问要有力，就得点出具体案例——燃素（十八世纪末以前化学中占主导的燃烧理论）、热质、以太都曾是成熟且有新预测成功的理论，如今没有人认为它们所说的东西存在。', sourceIds: ['SCI-1', 'SCI-4'] },
    ],
    boundaries: [
      { kind: '解释性重构', text: '预测准确、提供因果机制、给出统一解释、指导干预、在新情境保持稳健，是不同的认识成就；一个模型可以在其中某些方面强而在另一些方面弱。不能把“有用”直接换成“真”。' },
      { kind: '概括', text: '实在论并非必然主张每一个理论词都逐字对应真实对象；回应理论更替的一类策略是只承诺成熟理论中保留下来的部分。要点在于说清保留的是什么：结构实在论的经典例子是菲涅耳的光学以太被麦克斯韦的场取代，实体层面的说法完全不同，而菲涅耳那套数学关系被保留下来——按这条读法，跨理论更替中积累的是形式或结构，不是内容。', sourceIds: ['SCI-1', 'SCI-4'] },
    ],
    objections: [
      { kind: '概括', text: '对无奇迹论证的反对不是否认科学成功，而是质疑“真实”是否是唯一最佳解释，以及是否存在当时未被设想的替代理论。实在论者则要求反对者说明预测与干预的成功如何不诉诸某种世界结构。', sourceIds: ['SCI-1'] },
      { kind: '概括', text: '库恩讨论“革命”时关注规则、范式和共同体实践的改变：一门科学的发展不是匀速的，而在常规期与革命期之间交替，常规科学的形态是解谜。这提示科学史不能只列发现。但从“实践有历史性”推不出“自然事实由共同体投票决定”——库恩自己给出的分界是：否认某个认知过程出自应用理性规则，并不等于说它是非理性的过程。', sourceIds: ['SCI-5'] },
      { kind: '原文入口', text: '《科学革命的结构》本身是这条线的原典入口。要引用它必须按章（Chapter）定位，本页目前只有一份没有文字层的扫描节选，因此正文不从它直接引任何论断。', sourceIds: ['SCI-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“理论是模型”不等于“模型可以任意编造”；模型仍受数据、测量、适用范围和反事实检验约束。' },
      { kind: '解释性重构', text: '预测得准不等于解释得清，两者可以分开。同一批定律既能从旗杆高度和日照角推出影长，也能从影长和角度反推旗杆高度；两次推导同样有效、同样可用于预测，但只有前一次像是解释。所以“这个模型预测很准”与“这个模型说清了因果”是两句话，一个适合干预的模型还要再多一项要求。', sourceIds: ['SCI-2'] },
      { kind: '解释性重构', text: '可证伪性是重要的划界思路之一，不是所有科学实践的充分定义，也不等于一次失败就必须放弃理论。' },
      { kind: '解释性重构', text: '承认价值、仪器和制度影响研究，并不等于否认证据可纠错或世界会反过来限制解释。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '查看实验、数学化与近代认识论如何共同形成问题。' },
    ],
    sources: [
      { id: 'SCI-1', title: 'SEP：Scientific Realism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/scientific-realism/', locator: '§1.2（实在论承诺的三个维度）、§2.1（The Miracle Argument）、§2.3（Selective Optimism/Skepticism）、§3.1（The Underdetermination of Theory by Data，含未被设想的替代方案）、§3.3（The Pessimistic Induction）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.1 是无奇迹论证；§2.3 是选择性实在论（含只承诺“产生过去理论之成功的那些理论定律与机制”这一版本）；§3.1 是欠决定与未被设想的替代方案；§3.3 是悲观归纳。须注意 §3.3 只给出“多数过去理论必须视为假”这类一般表述，并不点名燃素、热质或以太，因此具体案例改挂 SCI-4。原来引用 2017 春季归档地址，与 data.json 的活链不一致，也与本条实际使用的章节号对不上；本轮改为活链并逐节核对。' },
      { id: 'SCI-2', title: 'SEP：20th Century Theories of Scientific Explanation', kind: '学术综述', url: 'https://plato.stanford.edu/entries/scientific-explanation-20th/', locator: '§2.5（Explanatory Understanding and Nomic Expectability: Counterexamples to Sufficiency，其中“Explanatory Asymmetries”一小节给出旗杆与影长的例子）、§4（The Causal Mechanical Model）、§7.1（The Role of Causation）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.5 给出旗杆／影长的双向推导：两次推导都满足 DN 标准，只有一次像是解释，条目据此说“这类例子表明至少有些解释具有方向性或不对称的特征，而 DN 模型对此不敏感”——这是本页“预测准确不等于因果解释充分”的依据；§4 与 §7.1 处理因果在解释中的地位。原来的 url 指向 entries/scientific-explanation/，该条目已退役，页面现在只显示“已改题重刊为《20th Century Theories of Scientific Explanation》”，原定位“导论与解释模型各节”也无法定位。' },
      { id: 'SCI-3', title: 'Thomas S. Kuhn, The Structure of Scientific Revolutions（哥伦比亚大学托管的扫描节选）', kind: '原典', url: 'https://www.columbia.edu/cu/tract/projects/complexity-theory/kuhn-the-structure-of-scien.pdf', locator: '本轮只能确认：该文件是 37 页扫描件，无文字层（无 /Font，37 个图像对象），因此无法从文件本身确认它对应原书的哪几章。原定位“§IX–X（在线节选）”既用错了结构单位（该书按 Chapter 分章，无 §），也无法核对', checked: 'pending', supports: '仅作为《科学革命的结构》的扫描阅读入口。本条不支持任何具体论断：正文中关于范式、常规科学与规则的说明已改挂 SCI-5，等到取得可按章定位的版本后再回填。' },
      { id: 'SCI-4', title: 'SEP：Structural Realism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/structural-realism/', locator: '§1（Introduction）、§2（The Best of Both Worlds?）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 逐一点名悲观归纳所用的具体案例：“光的以太理论与热的热质理论”曾是有新预测成功的成熟理论，以及“十八世纪末以前化学中占主导的、把燃烧解释为放出燃素的理论”；同节以菲涅耳的以太与麦克斯韦的场为例说明“理论可以彼此相反，却在现象中表示同一结构”；§1 引沃勒尔 1989“这一转变中有连续性或积累，但连续的是形式或结构，不是内容”。这是本页“具体案例”与“保留下来的是什么”两处的依据。' },
      { id: 'SCI-5', title: 'SEP：Thomas Kuhn', kind: '学术综述', url: 'https://plato.stanford.edu/entries/thomas-kuhn/', locator: '§2（The Development of Science）、§3（The Concept of a Paradigm）、§4.1–§4.4（不可通约性）、§7.1（Criticism and Influence: Scientific Change）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 给出“按库恩的看法，一门科学的发展不是匀速的，而有交替的常规期与革命期”；§3 把常规科学刻画为“解谜”（引 1962/1970a: 35–42），并给出库恩自己的分界“否认某个认知过程是应用理性规则的结果，并不意味着它是一个非理性的过程”——这正是“实践有历史性推不出事实由投票决定”的依据；§4 是不可通约性，§7.1 是相对主义指控的接收史。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜历史与实践取向', issue: '原异议可能被读成“社会条件＝事实任意”。', evidence: 'SCI-5 §3 给出库恩自己对“非理性”的划界；SCI-1 的争论仍以经验成功为约束。', revision: '加入不推出相对主义的限制，并改挂到真正支持这一点的来源。' },
      { location: '案例推演｜流行病模型', issue: '原案例没有区分预测、解释与干预。', evidence: 'SCI-2 §2.5 的旗杆／影长不对称显示预测性推导不自动是解释。', revision: '将三种成就分开，要求标出适用范围。' },
      { location: '容易混淆的地方｜新增“因果≠可预测性”', issue: '本页案例正是“一个预测很准但解释不清的模型”，prompts 第一问就是“预测准确、因果解释充分、适合干预是同一件事吗”，而三条易混里恰好没有这一条。', evidence: 'SCI-2 §2.5 的“Explanatory Asymmetries”给出可复述的反例：同一批定律双向推导，只有一个方向像解释。', revision: '新增一条易混，用旗杆与影长把这三件事分开。' },
      { location: '问题起点与定义边界｜悲观归纳的具体案例', issue: '悲观归纳原先没有任何历史案例，“被保留下来的部分”也没说明在哪个案例里保留了什么，两处都停在口号层面。', evidence: 'SCI-1 §3.3 只作一般表述、不点名案例；SCI-4 §2 明确点名以太、热质、燃素，并以菲涅耳—麦克斯韦为“保留的是结构而非内容”的例子。', revision: '新建 SCI-4（SEP：Structural Realism），把燃素、热质、以太写进 origin，把菲涅耳的方程在麦克斯韦理论中被保留写进 boundaries。' },
      { location: '来源账｜SCI-2 的条目已退役', issue: 'SCI-2 的 url 指向 entries/scientific-explanation/，该页面现在只是一条改题通知，原定位“导论与解释模型各节”也无法定位。', evidence: '本轮打开该 url，页面正文为“标题为 Scientific Explanation 的条目已修订并以新标题《20th Century Theories of Scientific Explanation》重刊”。', revision: '标题与 url 改为新条目，定位改为 §2.5、§4、§7.1。' },
      { location: '来源账｜SCI-3 的定位无法核对', issue: 'SCI-3 标 kind “原典”、locator “§IX–X（在线节选）”，但《科学革命的结构》的结构单位是 Chapter 而非 §，而该 PDF 是 37 页纯扫描件，无法从文件本身确认它是哪几章。', evidence: '本轮下载该 PDF 实测：37 个 /Type /Page，无 /Font，37 个 /Subtype /Image，即无文字层。', revision: '降级为 pending，locator 改写为对文件本身的如实描述；把原先挂在它上面的“范式与规则”论断改挂新建的 SCI-5（SEP：Thomas Kuhn），正文另加一句说明为什么不从这份扫描件直接引用。' },
      { location: '放回历史语境', issue: 'historicalContext 里的 pt-history-tech 是 type 为“核心问题”的节点，却渲染在历史语境标题下。', evidence: 'data.json 中 pt-history-tech 的 type 为“核心问题”；relations.ts 已收录本条与它的语义边。', revision: '删除该条，只留 pt-western-modern。' },
    ], remaining: ['SCI-3 仍是 pending：需要一份可按章定位的《科学革命的结构》（有文字层的版本或纸本页码），才能把库恩的原文论断写回正文。在此之前本页不引用该扫描件的任何具体内容。', 'SCI-4 §3–§5（认识论结构实在论、本体论结构实在论及其反对）本轮未核对；本页只用到 §1–§2，不对结构实在论的内部版本作断言。', 'SCI-2 是关于二十世纪解释理论的条目，它自己声明只覆盖到二十世纪末，并指向另一条“因果进路”条目；伍德沃德式干预主义在本页仍无独立来源账。'], adjacentImpact: '与“知识从哪里来”相连时，要把“证据”保留为实践、模型和推理的组合，而非裸数据。原挂在本条历史语境里的 pt-history-tech 已删除，由 relations.ts 收录。', nextPriority: '补充贝叶斯、机制解释与非西方科学史的独立阅读路径，并为干预主义因果解释另建来源账。' },
  },
  'pt-environment-animals': {
    status: '核验正文｜自审完成',
    scope: '动物伦理与环境伦理在这一页交界：前者问哪些个体应被直接考虑，后者问物种、群落与未来世代算不算。“自然”在这里不是一个自带价值的褒词。个体利益与生态整体能否用同一把尺子排序，是页内要争的问题，不是页首的前提。',
    origin: [
      { kind: '概括', text: '动物伦理追问能受苦、拥有利益或能行动的个体为何应被直接考虑；环境伦理进一步追问物种、群落、生态系统和未来世代是否也有不能仅用人类利益说明的价值。二者重叠但对象不同。', sourceIds: ['ENV-1', 'ENV-2'] },
      { kind: '原文入口', text: '辛格以平等考虑利益为起点批评仅按物种归属忽视痛苦；这是一条以个体感受和利益为中心的路线，不等于完整的生态整体论。', sourceIds: ['ENV-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '“有道德地位”只说明一个存在者能提出应被考虑的道德要求，并不自动给出具体做法或在冲突中的优先级；还要问它有什么利益、权利或关系，以及如何权衡。', sourceIds: ['ENV-2'] },
      { kind: '概括', text: '动物解放、动物权利和生命中心论大多以个体为关切对象；生态整体论则关注物种、种群与生物共同体。保护脆弱栖息地有时会与减少某些个体痛苦冲突。', sourceIds: ['ENV-1'] },
    ],
    objections: [
      { kind: '概括', text: '本页三条路线都已经承认非人存在者有道德地位，所以最强的外部反对不在它们之间，而在它们的共同前提上：否认动物有直接道德地位。这条路线有两个互相支撑的版本。契约论版本说，道德义务产生于能相互提出要求、能进入契约的主体之间；在原初状态里立约的人虽然不知道自己是谁，却知道自己不是动物，因此他们会订出保护理性个体的规则，动物落在规则之外。康德式版本说，只有人能从自己的欲望后退一步、选择怎样行动，动物缺这个能力，因此我们对动物只有间接义务——之所以不该虐待狗，是因为“对动物残忍的人，对人也会变得冷硬”，损坏的是行为者的品性和他对人的义务。', sourceIds: ['ENV-5', 'ENV-1'] },
      { kind: '概括', text: '这条路线最有力的反驳是边缘案例论证：如果道德地位靠理性、自主或立约能力，那么婴儿、重度认知障碍者和失去这些能力的人也会落在道德共同体之外；若为了保住他们而把门槛降到“属于人类这个物种”，那被诉诸的就不再是能力而是物种归属，而这正是要被质疑的东西。间接义务一路还要另答一问：它使“虐待动物之所以错”与动物本身的痛苦无关，于是无人观看、不影响任何人品性的虐待就不再是错的——这个结论多数人不愿接受。契约论者可以回应说，立约者出于对亲属和自身情感的考虑仍会为动物订下保护规则，但那样的保护是可撤销的、取决于人的偏好，与“动物自己提出了道德要求”仍不是一回事。', sourceIds: ['ENV-5'] },
      { kind: '概括', text: '在承认道德地位的三条路线内部，难题分布不同：感受能力路线的强项是直面痛苦，难题是如何说明植物、物种和生态整体；权利路线能限制“为了总量牺牲个体”，难题是权利门槛和冲突解决；整体路线能说明保护，却须防止把具体动物仅当作生态工具——为维护生态系统的完整而扑杀野化动物，正是这类冲突的标准形态。', sourceIds: ['ENV-1', 'ENV-2'] },
      { kind: '原创例子', text: '一座岛为保护濒危鸟类而计划控制入侵猫。问题不是“爱鸟还是爱猫”，而是：哪类伤害、何种替代方案、谁承担干预后果、以及整体目标能否设下不必要伤害的限制。' },
    ],
    confusions: [
      { kind: '解释性重构', text: '反对物种歧视不是说每个物种或个体在所有情境中应得到同样待遇，而是要求差别待遇给出与利益相关的理由。', sourceIds: ['ENV-3'] },
      { kind: '解释性重构', text: '“内在价值”不是“人类从未使用”；它反对的是价值完全取决于外部用途。' },
      { kind: '解释性重构', text: '地方性、原住民与关系性知识不能被当作给既有西方理论点缀的“案例”，应分别核对其概念与政治语境。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '环境伦理作为当代学科的形成，与既有功利主义、权利论和土地伦理的张力。' },
    ],
    sources: [
      { id: 'ENV-1', title: 'SEP：Environmental Ethics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-environmental/', locator: '§1（Introduction: The Challenge of Environmental Ethics）、§4（Traditional Ethical Theories and Contemporary Environment Ethics）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 说明环境伦理是“通过对传统人类中心主义提出挑战”而形成的领域，并转述康德的间接义务（对狗残忍会使人的品性对人的残忍脱敏，因而虐待动物是工具性地错而非内在地错）；§4 明说“动物解放或动物权利与生命中心论都是个体主义的”，而物种、群落这些集合体“既非有感受者、也非生命主体、也非目的中心”，并给出冲突的标准形态——“维护一个生态系统的完整可能需要扑杀野化动物”。原定位“导论、§4 的个体／整体讨论”不算错，但未标明章节标题，也没有交代 §1 里的康德材料。' },
      { id: 'ENV-2', title: 'SEP：The Moral Status of Animals', kind: '学术综述', url: 'https://plato.stanford.edu/entries/moral-animal/', locator: '§1.1（Speciesism）、§1.3.1（Rational Persons，含边缘案例问题与康德式间接义务）、§1.4（Sentience）、§1.5（Agency）、§2.1–§2.2（动物有哪些利益、如何计入）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.4 与 §1.5 分别给出感受能力与行动能力两条判准；§2.1–§2.2 处理利益与权衡；§1.3.1 写出“我们对动物有间接义务，这些义务不是朝向它们的，而是在涉及它们时对人的义务的延伸”，并引康德“对动物残忍的人，在与人交往时也会变得冷硬”，同一节即“边缘案例问题”所在。须注意该条目通篇不讨论契约论（罗尔斯、纳维森、卡拉瑟斯均未出现），契约论一路已改挂 ENV-5。' },
      { id: 'ENV-3', title: 'Peter Singer, All Animals Are Equal（Philosophic Exchange 5:1, 1974, art. 6；SUNY SOAR 仓储）', kind: '原典', url: 'https://soar.suny.edu/handle/20.500.12648/3306', locator: '开篇“解放运动要求扩展我们的道德视野”一段，至引述边沁并以“the capacity for suffering”为关键特征、提出平等考虑利益原则处（SOAR 提供全文 PDF，另有文字层可检索）', checked: 'verified', checkedOn: '2026-09-11', supports: '文首把动物问题接在黑人解放、女性解放之后，提出“把我们对本物种全体成员承认的平等原则扩展到其他物种”；随后指出平等要求的是平等的考虑而非同等待遇，并循边沁把“受苦的能力”定为赋予一个存在者平等考虑之权的特征。这是本页“以利益与痛苦为中心”的原文入口。原 url 的主机 digitalcommons.brockport.edu 已无法解析（本轮 curl 实测返回码 000），SUNY Brockport 的仓储已迁至 soar.suny.edu；本轮经 DSpace 接口核对该条目元数据（标题 All Animals Are Equal、作者 Singer, Peter、1974）与全文 PDF 后改址。' },
      { id: 'ENV-4', title: 'SEP：Feminist Environmental Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/feminism-environmental/', locator: '§1.3（Three Kinds of Positions in Feminist Environmental Philosophy）、§3.2（Oppressive Conceptual Frameworks，价值二元论）、§3.5（Socioeconomic Perspectives，性别化的环境劳动分工）、§3.6（Epistemological Perspectives，含奇普克运动与地方林业知识）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.3 给出该领域三类立场的分法，即“不是一套统一观点”的依据；§3.2 处理“对立而非互补、互相排斥的价值二元论”；§3.5 处理男女在文化与自然之间的不对等中介与劳动分工；§3.6 以奇普克运动说明“农村妇女才是如何使用本地森林的专家”。原定位“§2–§3.6，特别是知识与劳动的讨论”把 §2（第一类立场）整块算进来，且“特别是……的讨论”无法定位。' },
      { id: 'ENV-5', title: 'IEP：Animals and Ethics（Scott D. Wilson）', kind: '学术综述', url: 'https://iep.utm.edu/anim-eth/', locator: '§1.b（Kantian Theories）、§1.d（Contractualist Theories）、§1.f.i（The Argument From Marginal Cases）、§1.f.ii（Problems with Indirect Duties to Animals）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 整节即“间接理论”，也就是否认动物有直接道德地位的各版本；§1.d 写出契约论的关键一步——“立约者出于自利但不知道自己是谁，因此会接受保护理性个体的规则；然而他们对自己知道得足够多，知道自己不是动物”；§1.b 给出康德式理由“只有人能从自己的欲望后退一步并选择行动方式……动物缺此能力，故无意志，因而不自主”；§1.f.i、§1.f.ii 是针对整个间接理论家族的两条标准反驳（边缘案例；间接义务使虐待之错与动物的痛苦无关）。本条是本页第二条非 SEP 来源。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜生态中心与关系伦理', issue: '原文把整体价值写得像能自动压过个体。', evidence: 'ENV-1 §4 明确记录个体动物与生态完整性会冲突，并以扑杀野化动物为例。', revision: '增加冲突不是口号可解决、必须交代权衡规则，并把该例子写进正文。' },
      { location: '人物与原典｜辛格', issue: '原文把辛格、雷根、利奥波德列在一起但没有显示对象差异。', evidence: 'ENV-1/ENV-2 分别讨论个体与生态整体。', revision: '将三条路线的价值承载者和难题显式列出。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原文本没有呈现辛格、雷根、利奥波德与普拉姆伍德的分歧会如何改变同一个生态修复决策。', evidence: 'ENV-2 区分道德可考虑性和权衡；ENV-1 处理环境伦理的整体性与政治维度；ENV-4 追问性别、劳动与知识。', revision: '新增四个比较单元，分别标出价值承载者、岛屿案例用途与不得省略的冲突。' },
      { location: '有力反对及回应｜否认动物有直接道德地位的立场三层全部缺席', issue: '本页三个立场都已承认非人存在者有道德地位，只在“哪些、凭什么、怎样权衡”上分歧。最强的外部反对——契约论与康德式间接义务——在立场、反对、回应三层里都不存在，页面因此看起来像已有共识。', evidence: 'ENV-5 §1.d 给出契约论的立约者论证并明说“他们知道自己不是动物”；§1.b 给出康德式的自主性理由；§1.f.i、§1.f.ii 给出边缘案例与“间接义务使虐待之错与动物痛苦无关”两条反驳。ENV-1 §1 与 ENV-2 §1.3.1 各自转述康德的间接义务原文。', revision: '在“有力反对及回应”新增两段：第一段把这条路线以最有力的形式写出（两个版本各自的理由），第二段写出针对它的反驳以及它还能怎样回应、回应到什么程度仍不够。同时新建 ENV-5（IEP：Animals and Ethics）作为契约论一路的来源——ENV-2 通篇不涉及契约论。' },
      { location: '来源账｜ENV-3 的主机已消失', issue: 'ENV-3 的 url 指向 digitalcommons.brockport.edu，该域名已无法解析，而它是本页唯一的原典入口，正文“原文入口”一段就挂在它上面。', evidence: '本轮 curl 实测该 url 返回码 000（无法解析主机）；SUNY Brockport 的仓储已迁至 soar.suny.edu，经 DSpace 接口核对到同一条目（handle 20.500.12648/3306）并取得全文 PDF 与文字层。', revision: '改址到 soar.suny.edu，标题补上期刊、卷期与文章号，locator 改为按论证节点定位（开篇至边沁与“受苦的能力”一段）。' },
      { location: '放回历史语境', issue: 'historicalContext 里的 pt-history-tech 是 type 为“核心问题”的节点，却渲染在历史语境标题下。', evidence: 'data.json 中 pt-history-tech 的 type 为“核心问题”；relations.ts 已收录本条与它的语义边。', revision: '删除该条，只留 pt-western-contemporary。' },
    ], remaining: ['原住民哲学的具体材料尚未独立核验，不能在此以泛称代表。', 'ENV-3 的 locator 明写“1974 年《Philosophic Exchange》那篇论文文首的平等考虑论证”，而 study-guides.ts 把它挂在《动物解放》（1975 年的书）那张 texts 卡上——这两者是不同的文本。该错挂在 study-guides.ts 内，不在本文件内，须由该文件负责人拆开（或为《动物解放》另建来源）。', '契约论一路目前只有 IEP 综述作依据；罗尔斯《正义论》相关段落、纳维森与卡拉瑟斯的原文本轮均未读，不能据本页对他们各自的论证细节作断言。', 'ENV-2 §3（Alternative Perspectives）与 ENV-4 §2、§4 本轮未核对。'], adjacentImpact: '与“正义”“照护”互链时，须把环境负担的分配与对非人者的直接义务区分开。新增的间接义务一路与 pt-right-action 的义务论讨论相邻，两处不要各自另造一套“间接义务”的定义。原挂在本条历史语境里的 pt-history-tech 已删除，由 relations.ts 收录。', nextPriority: '选择一项气候正义与一项土地关系原典，另建不被动物伦理吞没的扩展条目；并为契约论一路补一条原典来源。' },
  },
  'pt-identity-oppression': {
    status: '核验正文｜自审完成',
    scope: '身份、权力与知识实践怎样互相牵动，是这一页的问题。群体经验在这里不被当作固定的本性，“身份”也不是能解释一切的那个变量——它究竟在哪一步起作用、起的是什么作用，每次都要具体指出来。',
    origin: [
      { kind: '原文入口', text: '克伦肖在反歧视法与女性主义／反种族主义政治的交叉处提出问题：若制度只识别单一轴线的伤害，处在多重位置的人可能在每个框架里都被边缘化。', sourceIds: ['ID-1'] },
      { kind: '概括', text: '认识不公则追问知识如何被生产和接收：身份偏见会造成不应有的可信度缺口，使一个人的[[testimony|证言]]得到低于其证据所应得的信任；群体被排除在解释资源的形成之外，会使某些经验难以被理解或表达。', sourceIds: ['ID-3'] },
    ],
    boundaries: [
      { kind: '解释性重构', text: '身份可以是自我认同、他人分类、法律类别、共同政治行动或历史位置；同一个词指向不同机制。讨论压迫时，必须具体到规则、分工、证言、空间或资源如何造成可追踪的劣势。' },
      { kind: '概括', text: '社会位置可能带来对某些关系的认识优势，也可能受到内化压迫影响——例如有研究指出，许多因遭到侵害而自责的女性，内化的是关于自己责任的错误信念。因此“来自边缘”既不是自动无误，也不是可以被多数轻易取消的证言；同一处争论还有一个未解的技术难题：如何在承认女性处境各异的同时，说明“一个女性主义立场”仍是连贯的。何时具有优势，仍须在具体领域检验。', sourceIds: ['ID-3'] },
    ],
    objections: [
      { kind: '概括', text: '先说框架内部的两条修正。交叉性不等于给人贴越来越多标签：它首先质疑只用单一类别处理制度伤害的框架，若分析不能指出相互作用的机制和可改变的制度，它就会退化为身份清单。', sourceIds: ['ID-1'] },
      { kind: '概括', text: '立场理论也面临两项内部担心：把群体经验写成统一声音，以及忽略内化压迫。回应不是放弃位置问题，而是把认识优势视为需经共同研究、批评和具体证据检验的可能性。', sourceIds: ['ID-3'] },
      { kind: '争议性判断', text: '来自框架外部的反对是另一回事，而它们更难答。第一条针对推论本身：观察到某个群体在结果上系统性地更差，还不蕴含存在结构性不义——差异也可能来自不同的偏好分布、地域与产业结构，或来自已经终止的历史原因。要从差异走到不义，必须指出是哪条规则、哪种分工、哪套程序在此刻仍持续产生这个结果。这条反对不否认结构性不义存在，它否认的是从统计差异直接读出不义；接受它的代价是每一项主张都要背上机制说明的举证责任。' },
      { kind: '概括', text: '第二条针对责任的承担者。如果只有个体才作道德选择，那么“结构”“制度”“群体”就不该是被谴责的对象。这条反对有它自己的经典表述：价值属于个体，唯有个体是道德责任的承担者，除非某人自己认为某行为是错的，否则他没有道德过错；为一个人并未打算造成的结果责备他是不公平的；集合体不作道德选择，因而不能被恰当地归以道德责任。要挡住它，就得说明集体或结构性责任如何落到具体的人、岗位与决策上，而不是停在“制度有责任”这句话。值得注意的是，这场争论的现有材料主要围绕有组织的群体行动与集体意图展开，对“无人意图的累积后果”本身谈得很少——也就是说，结构性不义要的那种责任概念，恰好落在这场争论覆盖较弱的地带。', sourceIds: ['ID-6'] },
      { kind: '争议性判断', text: '第三条针对可信度调整。如果某类说话者在某个领域的报告确实更常出错，那么给他们的话打折就是在使用统计信息，而不是偏见在起作用。这条反对要求认识不公理论给出可操作的分界：“不应有的可信度赤字”与“有依据的可信度调整”靠什么区分？如果分界只能事后按结论划出，诊断就无法被反驳。可以走的回应方向是把偏见定位在证据处理的方式上（哪些证据被采集、被听见、被要求补强），而不是定位在最终的可信度数值上；但这条回应要成立，需要具体领域的经验材料，本条目前没有。' },
    ],
    confusions: [
      { kind: '解释性重构', text: '证言不公不是“不同意某人”本身，而是因身份偏见给出低于证据所应得的可信度。', sourceIds: ['ID-3'] },
      { kind: '解释性重构', text: '解释资源不足不等于某个个体词汇量不够；它是群体参与意义生产被结构性限制的问题。', sourceIds: ['ID-3'] },
      { kind: '解释性重构', text: '反本质主义不是否认群体能组织行动；它要求说明在不假定固定本性的条件下，团结与责任如何形成。' },
    ],
    historicalContext: [
      { nodeId: 'pt-africana-race', label: '种族、殖民与解放', note: '将身份与殖民历史、种族化和解放思想并读。' },
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '把女性主义与社会认识论放回其论争史，而非当作一套统一观点。' },
    ],
    sources: [
      { id: 'ID-1', title: 'Kimberlé Crenshaw, Demarginalizing the Intersection of Race and Sex: A Black Feminist Critique of Antidiscrimination Doctrine, Feminist Theory and Antiracist Politics', kind: '原典', url: 'https://chicagounbound.uchicago.edu/uclf/vol1989/iss1/8/', locator: '《University of Chicago Legal Forum》1989 年卷第 1 期 Article 8（Chicago Unbound 提供全文 PDF，约 1.9 MB）', checked: 'verified', checkedOn: '2026-09-11', supports: '本轮打开该落地页核对到完整标题、作者、卷期与文章号，并确认全文 PDF 可下载。这是 1989 年那篇论文，与 1991 年的〈Mapping the Margins〉是两篇不同的文章。' },
      { id: 'ID-2', title: 'Miranda Fricker, Epistemic Injustice: Power and the Ethics of Knowing（Oxford Academic 图书落地页）', kind: '原典', url: 'https://academic.oup.com/book/32817', locator: '本轮打开后只能确认该页给出书名与学科分类；页面无目录、无章节摘要、无正文，正文在付费墙后。因此本条不指向任何章节', checked: 'pending', supports: '仅作为该书的书目指针。证言不公与解释不公的区分本轮改由 ID-3 §4.1 支持（该节转述 Fricker 2007 并给出两者的定义措辞）；原 locator“导论；第 1、7 章书目说明”既无法核对，“书目说明”也不是章节内容。' },
      { id: 'ID-3', title: 'SEP：Feminist Social Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/feminist-social-epistemology/', locator: '§2.1（Differentiated Knowers and Standpoint Theory）、§4.1（Epistemic Injustice）', checked: 'verified', checkedOn: '2026-09-11', supports: '§4.1 给出证言不公（“说话者因听者持有的身份偏见而得到低于其应得的可信度”）与解释不公（“一个群体理解并表达其社会经验重要面向所需的集体解释资源之匮乏”）的定义措辞；§2.1 给出立场理论的争论，包括内化压迫（“许多因遭到侵害而自责的女性内化了关于自身责任的有害错误信念”）与“如何在承认女性处境各异的同时说明女性主义立场的连贯性”这一难题。原定位写“§3、§4.1”，而 §3 是“社会性的知识与客观性模型”（强客观性、客观性作为社会过程），并不讨论内化压迫；立场理论的争论在 §2.1。' },
      { id: 'ID-4', title: 'SEP：Simone de Beauvoir', kind: '学术综述', url: 'https://plato.stanford.edu/entries/beauvoir/', locator: '§7（The Second Sex: Woman As Other）', checked: 'verified', checkedOn: '2026-09-11', supports: '§7 是《第二性》一节，给出“女人是他者，男人是本质的存在”的结构，并把“成为女人”解释为“以某种特定方式活出或经验自己的身体”，即具身处境的分析。该条目只有顶层十四节、无小节编号，原定位所写的“特别是 Woman as Other 与处境分析”并非独立小节，已并入 §7。' },
      { id: 'ID-5', title: 'SEP：W. E. B. Du Bois', kind: '学术综述', url: 'https://plato.stanford.edu/entries/dubois/', locator: '§2.1.2（The Negro Problem Subjectively Considered）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.1.2 明说“黑人问题是一种在主观上被活过、被感受到的社会状况，而不只是社会科学探究的对象”，并给出双重意识的原句“总是透过他人的眼睛看自己，用一个带着轻蔑与怜悯旁观的世界的尺子量自己的灵魂”。据此把双重意识读作被种族化者的处境，而不是抽象的双身份比喻。' },
      { id: 'ID-6', title: 'SEP：Collective Responsibility', kind: '学术综述', url: 'https://plato.stanford.edu/entries/collective-responsibility/', locator: '§1（Collective Responsibility: the Controversies）、§2（Making Sense of Collective Responsibility: Actions, Intentions, and Group Solidarity）、§4（Can Collective Responsibility be Distributed?）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1–§2 集中给出个体主义一侧的经典表述：H. D. Lewis“价值属于个体，唯有个体是道德责任的承担者。除非某人自己认为某行为是错的，他就没有道德过错”（1948）；Sverdlik“为一个人并未打算造成的结果责备他是不公平的”（1987: 68）；R. S. Downie“集合体没有道德过失，因为它们不作道德选择，因而不能被恰当地归以道德责任”（1969: 67）。§4 处理集体责任能否分配到个体。本轮同时确认：该条目围绕集体意图与有组织的群体行动展开，对“纯属无人意图的累积后果能否奠定责任”几乎不作实质讨论——这一点已如实写进正文，不能被当作对结构性不义的支持。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜交叉性取向', issue: '原文把交叉性写成多个维度的简单相加。', evidence: 'ID-1 的问题是单轴制度框架造成的边缘化。', revision: '改为要求交代相互作用的制度机制。' },
      { location: '概念｜受压迫经验', issue: '原文可能暗示经验天然拥有无误认识权威。', evidence: 'ID-3 §2.1 讨论内化压迫与立场理论的局限。', revision: '补入条件性、领域性和共同检验，并把内化压迫的具体例子与“统一声音”难题写出来。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单让波伏瓦、杜波依斯、克伦肖与弗里克成为可替换的身份理论标签。', evidence: 'ID-4 §7 处理“他者”与具身处境；ID-5 §2.1.2 处理特定历史中的双重意识；ID-1 处理单轴制度框架；ID-3 §4.1 处理认识伤害。', revision: '新增四个比较单元，连到听证会案例，同时保留历史范围、证据要求和非本质化限制。' },
      { location: '有力反对及回应｜两条反对都来自框架内部', issue: '原有两条“反对”（交叉性会退化为身份清单、立场理论会写成统一声音）都是框架内部的友好修正，没有一条来自外部。读者读完会以为这套分析只需要微调。', evidence: 'ID-6 §1–§2 给出个体主义一侧三条可引用的经典表述；“统计差异不蕴含结构性不义”与“可信度调整的统计辩护”则是这场争论中常见的外部反对。', revision: '新增三段外部反对，并逐条写出接受它要付什么代价、可以怎样回应。其中“只有个体能承担责任”一条改挂新建的 ID-6；另两条本轮找不到可核对的来源，如实标为“争议性判断”且不挂 sourceId，并写进 remaining。' },
      { location: '来源账｜ID-2 是付费墙落地页', issue: 'ID-2 标 kind “原典”、locator “导论；第 1、7 章书目说明”，而该 url 是 Oxford Academic 的图书落地页：无目录、无章节摘要、无正文；“书目说明”本身也不是章节内容。而正文两段（证言不公、解释不公）此前都挂在它上面。', evidence: '本轮实际打开该页面：可见内容只有书名与学科分类，正文需机构登录或购买。', revision: '保留为书目指针并降级为 pending，locator 改为对页面实际可见内容的如实描述；把证言不公与解释不公两处论断改挂 ID-3 §4.1（该节有两者的定义措辞）。' },
      { location: '来源账｜ID-3 的定位', issue: '原定位“§3、§4.1”把立场理论的内部担心算在 §3，而 §3 讨论的是强客观性与客观性作为社会过程。', evidence: '本轮核对该条目目录：§2.1 Differentiated Knowers and Standpoint Theory、§2.2、§2.3；§3.1 Strong Objectivity、§3.2 Objectivity as a Social Process；§4.1 Epistemic Injustice。', revision: '定位改为 §2.1、§4.1。' },
    ], remaining: ['残障哲学和非殖民传统的原典尚未逐篇核验，不能用本条替代。', 'ID-2 仍是 pending：需要一份可按章定位的 Fricker《Epistemic Injustice》（纸本或有目录的电子版），才能把“原始区分”写回原典层；在此之前该书只作书目指针。', '外部反对中的“统计差异不蕴含结构性不义”与“可信度调整的统计辩护”本轮未能找到可核对的来源，正文按“争议性判断”标出且不挂 sourceId。下一轮须为这两条各建一条真实来源（前者可从结构性不义与歧视理论一路找，后者涉及可信度调整的规范性争论）。', 'ID-1 的 locator 指向 1989 年那篇论文，而 study-guides.ts 把它挂在〈边缘的地图〉（Mapping the Margins, 1991）那张 texts 卡上——这是两篇不同的文章。该错挂在 study-guides.ts 内，不在本文件内，须由该文件负责人拆开或为 1991 年那篇另建来源。'], adjacentImpact: '与“知识从哪里来”“正义”互链时，应把认知伤害与资源／权利分配分别说明，再讨论交集。本条与 pt-language-meaning 共用 SEP：Feminist Social Epistemology 的不同定位（那一页用 §4.1、§2.1 支撑权力敏感立场），两页对“证言不公”的定义须保持一致。新增的 ID-6 与 pt-responsibility 的责任三分相邻，两处不要各自另造一套“集体责任”的定义。', nextPriority: '建立残障正义与殖民性知识生产的独立历史条目及来源账，并为上述两条外部反对补来源。' },
  },
  'pt-mind-self': {
    status: '核验正文｜自审完成',
    scope: '这一页把三件常被混着说的事放在一起比较：心灵在本体论上是什么、一个人凭什么跨时间还是同一个人、以及佛教诸派的无我分析在质疑什么。临床诊断、法律上的身份认定和宗教修行各有自己的问题和标准，本页不替它们作答，也不拿它们的结论当哲学答案。',
    origin: [
      { kind: '概括', text: '心灵问题从主观体验、思考与身体活动的关系产生；[[personal-identity|人格同一性]]则问人何时跨时间持续存在。两类问题常共用“自我”一词，却不必有同一答案——“self”有时就是“人格”的同义词，有时却指一个不变的意识主体。', sourceIds: ['MS-1', 'MS-2'] },
      { kind: '概括', text: '印度佛教的无我分析并不把心灵简单删去，而是反对把心理和身体过程误认成一个独立、恒常的主宰。', sourceIds: ['MS-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '个人同一性、作为道德行动者的身份、作为活物的连续性和对自身的心理依恋是不同概念；“self”本身也可能指人格或不可变意识主体。', sourceIds: ['MS-2'] },
      { kind: '概括', text: '“同一论”“还原论”“功能主义”不是三个语气不同的同义词，读到它们时要能分开。同一论（心脑同一论）主张心理状态与过程就是脑的状态与过程，不只是与之相关；它有两种强度——类型同一论把某一类心理状态整体等同于某一类脑状态，个例同一论只主张“这一次的这个疼痛”与“这一次的这个脑过程”是同一件事。还原论一般指把某一层次的现象最终由更基础的层次说清、从而不必再当作独立的解释单位；类型同一论是它在心灵问题上的一个版本。功能主义换了个提法：使某个东西成为一个思想、欲望或疼痛的，不是它内部由什么构成，而只是它在所属认知系统中起的作用——由它与感官刺激、其他心理状态和行为的因果关系来界定。因此功能主义与类型同一论冲突（同一个功能状态可以由碳基脑实现，也可以由硅基脑实现），却可以与个例同一论并存。', sourceIds: ['MS-4', 'MS-5'] },
      { kind: '解释性重构', text: '神经对应证实心理活动与身体深度相关，却没有单独在上面三者之间作出选择；哲学问题在于何种解释算足够。' },
    ],
    objections: [
      { kind: '概括', text: '二元论须说明异质实体如何交互；物理主义则须说明从相关到解释体验的推理。两边都不能把对方的问题重述一次就当作反驳。', sourceIds: ['MS-1'] },
      { kind: '概括', text: '无我立场面对责任与再生等连续性难题；佛教理论在不同学派中对此有不同处理，不能用“佛教认为没有人”概括。', sourceIds: ['MS-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“没有不变实体自我”不等于“没有人、经验或责任”。' },
      { kind: '解释性重构', text: '心理连续性不是记忆完全保留；记忆常被拿来解释同一性，也会产生虚假记忆和循环问题。', sourceIds: ['MS-2'] },
      { kind: '解释性重构', text: '二元论、心灵独立于身体和宗教灵魂观有重叠但不必完全同义。', sourceIds: ['MS-1'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '笛卡尔、洛克与休谟的争论构成现代心灵与人格问题的重要语境。' },
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '无我必须在缘起、修行与不同部派／大乘论辩中理解。' },
    ],
    sources: [
      { id: 'MS-1', title: 'SEP：Dualism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/dualism/', locator: '§1（Dualism and the Mind-Body Problem）、§2.1–§2.4（印度哲学、希腊哲学、亚伯拉罕世界、与机械论科学中的二元论）、§3.1–§3.6（实体二元论、属性二元论、交互论、副现象论、平行论、形质论式二元论）、§5.1–§5.2（心的怪异性、心的统一性）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.1–§2.4 是二元论的历史范围与不同传统（含 §2.3 说明亚伯拉罕诸教的扩张如何塑造相关哲学发展，即“二元论与宗教灵魂观有重叠”的依据）；§3.3 是交互论，即异质实体如何相互作用的难题所在；§3.1–§3.6 六种变体并列，说明二元论、心灵独立于身体、宗教灵魂观三者不必同义。原定位“§2 及心身问题各节”无法定位。' },
      { id: 'MS-2', title: 'SEP：Personal Identity', kind: '学术综述', url: 'https://plato.stanford.edu/entries/identity-personal/', locator: '§1（The Problems of Personal Identity，含 self 一词的歧义）、§2（Understanding the Persistence Question）、§4（Psychological-Continuity Views）、§5（Fission）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 开篇即“并不存在单一的人格同一性问题，而是一系列彼此至多松散相连、且常未被区分的问题”，并说明“self”一词有时与“人格”同义、有时指“一种不变的、非物质的意识主体”，该条目因此避开这个词；§4 是心理连续性观点及记忆标准的难题（“能记起的似乎只能是自己的经验”这一循环，以及学生—律师—老妇例显示记忆连续性不具传递性）；§5 是分裂案例。原定位“导论与同一性问题各节”无法定位。' },
      { id: 'MS-3', title: 'SEP：Mind in Indian Buddhist Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/mind-indian-buddhism/', locator: '§1.1（The Not-Self Doctrine）、§1.2（The Soteriological Dimension of the Not-Self Doctrine）、§2.3（The Five Aggregates）、§5.6（Persons: Reductionism and Supervenience）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1.1–§1.2 给出无我所针对的对象与其解脱论目的；§2.3 是五蕴；§5.6 给出以还原与随附处理“人”的地位，即“各学派对连续性有不同处理”的依据。原来引用的是 2017 春季归档地址（archives/spr2017/），而 data.json 的同一条目用活链，文件里没有一处说明为什么。本轮核对活链目录：§1.1、§1.2、§5.6 的标题与归档版完全一致，页面标注“首次发表 2009-12-03，实质修订 2012-10-12”——该条目自 2012 年后未再实质修订，归档版与活链内容相同。因此改用活链，与 data.json 及本文件 BUD-2 统一。' },
      { id: 'MS-4', title: 'SEP：The Mind/Brain Identity Theory', kind: '学术综述', url: 'https://plato.stanford.edu/entries/mind-identity/', locator: '§2（The Nature of the Identity Theory）、§5（Functionalism and Identity Theory）、§6（Type and Token Identity Theories）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2 开篇即“心的状态与过程与脑的状态与过程是同一的”，而不只是与之相关；§6 给出个例同一论的措辞“依个例同一论，一个特定的疼痛（更确切说，一次疼痛的发生）与一个特定的脑过程是同一的”，并给出多重可实现性——“一个功能状态可以由很不相同的脑状态实现：某个功能状态既可由硅基脑实现，也可由碳基脑实现”，因此功能论者拒绝类型同一而可能接受个例同一；§5 处理功能主义与同一论的关系。' },
      { id: 'MS-5', title: 'SEP：Functionalism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/functionalism/', locator: '§1（What is Functionalism?）、§3.5（Role-functionalism and Realizer-functionalism）、§5.5.1（Inverted and Absent Qualia）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 给出定义原句：“功能主义是这样一种学说——使某个东西成为一个思想、欲望、疼痛（或任何其他类型的心理状态）的，不在于它的内部构成，而仅在于它的功能，即它在其所属认知系统中所起的作用”，并说明心理状态的身份由“与感官刺激、其他心理状态和行为的因果关系”决定；§5.5.1 是缺失感受质与布洛克“中国人口”思想实验，即功能主义仍要回答“为什么这样的功能组织会有感受”。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜无我或非实体自我', issue: '原文可能被读成“佛教否认人格和责任”。', evidence: 'MS-3 §1.1 与 §5.6 区分对恒常自我的批判与心理—因果过程。', revision: '明确无我不是虚无论，并给出连续性难题。' },
      { location: '人物与文本', issue: '原内容只有人物名单，缺少文本各自在争论中解决什么。', evidence: 'MS-1、MS-2、MS-3 的问题范围不同。', revision: '新增四个原典入口与各自的阅读问题。' },
      { location: '新增｜哲学家怎样改写这个问题', issue: '原书单把笛卡尔、洛克、休谟与早期佛教都压成“自我观点”。', evidence: 'MS-1 §3 处理心身不同属性及交互难题，MS-2 §4 区分人格持续的多种候选，MS-3 将无我放进五蕴、无常与解脱的争论。', revision: '新增四个比较单元，以失忆承诺为共同压力测试，同时保留不可直接等同的界限。' },
      { location: '定义与边界｜三个专名没有定义', issue: '原文一句话抛出“同一论、还原论、功能主义”三个专名，三个都没有解释。而“功能主义”全库唯一的定义卡在 pt-ai-future，本页读者看不到；结果这一句在本页只起了列举术语的作用。', evidence: 'MS-4 §2 给出同一论的界定、§6 给出类型／个例之分与多重可实现性；MS-5 §1 给出功能主义的定义原句。', revision: '把原句拆成两段：新增一段逐个界定三者，并写出它们之间的实际关系（功能主义与类型同一论冲突、与个例同一论可并存）；原句只保留“神经对应不能替你在三者间选择”这一点。为此新建 MS-4、MS-5 两条来源。' },
      { location: '来源账｜三条定位与归档链', issue: 'MS-1“§2 及心身问题各节”、MS-2“导论与同一性问题各节”都属于无法定位的表述；MS-3 用 2017 春季归档地址，而 data.json 的同一条目用活链，文件里没有说明为什么。', evidence: '本轮逐条实际打开核对目录（见各条 supports）。MS-3 活链标注“实质修订 2012-10-12”，§1.1、§1.2、§5.6 与归档版标题一致。', revision: '三条定位改为实际章节号并附小节标题；MS-3 改用活链，并在 supports 中写明为什么两个地址内容相同。' },
    ], remaining: ['尚未完成《相应部》与阿毗达磨中文译本的版本校勘。', 'MS-4 §3（现象属性与主题中立分析）、§7（意识）与 MS-5 §5.5.2–§5.5.3（僵尸论证、知识论证）本轮未核对；本页对感受质一路的反对不作断言，那条论证线由 argument-maps.ts 的“心理因果与排除论证”承担，本账刻意不复述它的骨架。', 'MS-3 §5.1–§5.5（心与因果、有分心、摄取、种子、藏识）在 pt-buddhist 的 BUD-2 下已逐节核对；本页只用到 §1.1、§1.2、§2.3、§5.6，两处引用的是同一条目的不同定位，不要在两页各自另写一套连续性方案。'], adjacentImpact: '“自由与责任”不得把人格同一性的一个理论当作其唯一前提；“佛教哲学”需保留学派差异。新增的功能主义定义与 pt-ai-future 的功能主义卡片须保持一致——那一页此前是全库唯一的定义处。', nextPriority: '补写“存在与变化”及佛教历史条目的同级来源账。' },
  },
  'pt-ai-future': {
    status: '核验正文｜自审完成',
    scope: '这一页要分开三层：机器有没有心灵（心灵哲学）、我们对机器是否负有直接义务（道德地位）、以及系统出问题时由谁负责（部署责任）。它不给任何现有系统下“有意识”或“无意识”的诊断，也不拿治理措施冒充关于机器心灵的证明——这两件事的证据标准根本不同。',
    origin: [
      { kind: '原文入口', text: '图灵没有先给“思维”下一个终极定义，而以模仿游戏替换问题，考察机器能否在文字交互中完成某种可观察的表现。这个转向提供评价线索，却不自动规定智能、理解或意识的充分条件。', sourceIds: ['AI-1', 'AI-3'] },
      { kind: '概括', text: '当系统参与医疗、招聘、司法或平台分配时，问题又从“它有没有心灵”延伸到“谁应预测、解释、停止和赔偿伤害”——也就是[[responsibility-faces|责任的不同意义]]在这里各自要求什么。这两类问题相互影响，却不能互相代替。', sourceIds: ['AI-4', 'AI-5'] },
    ],
    boundaries: [
      { kind: '概括', text: '中文房间论证针对的是“仅运行适当程序就有理解”的强人工智能主张：按语法操纵符号、表现得像懂中文，与真正理解之间是否有缺口。它不等于证明任何机器都不能思考，也不等于只要会对话就已有意识。', sourceIds: ['AI-2'] },
      { kind: '概括', text: '道德患者是我们对其负有直接义务的对象；道德行动者则要满足知识、控制、按理由行动等更强条件。法律人格、因果影响与道德责任也必须分别讨论。', sourceIds: ['AI-4'] },
    ],
    objections: [
      { kind: '概括', text: '对中文房间的“系统回应”指出：房内的人不懂，不表示由人、规则、记忆和输入组成的整体不懂。塞尔对这一步有一个具体的再反驳，值得原样复述：原则上房内的人可以把整个系统内化——把全部指令和数据库都背下来，全部运算都在头脑里完成；这样他就可以走出房间，在户外四处走动，甚至用中文交谈，而此时系统与他已经重合，不再有“整体”能与他分开。可他仍然“无法把任何意义附着到那些形式符号上”。这个再反驳把担子推回给系统回应：要么指出内化之后系统与人其实并未重合（例如运算的实现方式仍构成一个不同的层次），要么承认理解的承担者可以是一个人所实现的系统而不是那个人本身——后一条路就是“虚拟心灵回应”。', sourceIds: ['AI-2'] },
      { kind: '概括', text: '“他心回应”走的是另一条路：我们归因他人理解，同样主要凭行为，若那对人足够，凭什么对机器不够。塞尔一侧会说这混淆了两个问题——认识论上我们怎么知道某物有心灵，与本体论上有心灵是怎么一回事。分歧因此落在两处：理解的承担者是谁，以及什么样的证据算足够。', sourceIds: ['AI-2'] },
      { kind: '概括', text: '把当前系统叫作“行动者”可以是技术上的薄意义——它造成或调节后果；这不等于它是可责备的道德行动者。部署责任不能因系统复杂就被机构分散到无人承担。', sourceIds: ['AI-4', 'AI-5'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '任务能力、语言理解、主观体验、道德地位、法律责任是五个不同问题；任一项的肯定都不自动推出其余四项。' },
      { kind: '解释性重构', text: '“拟人化”不是机器有人的证据；它首先是会改变使用者信任、依赖和责任判断的界面事实。' },
      { kind: '解释性重构', text: '风险管理不是心灵哲学的答案；它处理的是在不确定状态下谁应记录、监督、申诉和停止系统。', sourceIds: ['AI-5'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '从计算、心灵哲学与社会技术批评的交叉读起。' },
    ],
    sources: [
      { id: 'AI-1', title: 'Alan M. Turing, Computing Machinery and Intelligence（Mind 59 (1950): 433–460，SFU 转录）', kind: '原典', url: 'https://www.cs.sfu.ca/~vaughan/teaching/889/papers/turing1950.html', locator: '§1（The Imitation Game）、§6（Contrary Views on the Main Question，其下依次为神学的、“把头埋进沙里”的、数学的、来自意识的、来自各种能力缺失的、洛夫莱斯夫人的、神经系统连续性的、行为非形式性的、超感官知觉的九条反对）', checked: 'verified', checkedOn: '2026-09-11', supports: '§1 以模仿游戏替换“机器能思考吗”这个原问题；§6 是图灵自己列出并逐条回应的九条反对。该转录本保留论文原有的九节编号与标题，可按节定位。' },
      { id: 'AI-2', title: 'SEP：The Chinese Room Argument', kind: '学术综述', url: 'https://plato.stanford.edu/entries/chinese-room/', locator: '§3（The Chinese Room Argument，含强／弱 AI 的界定）、§4.1（The Systems Reply）及其下 §4.1.1（The Virtual Mind Reply）、§4.4（The Other Minds Reply）、§5.1（Syntax and Semantics）', checked: 'verified', checkedOn: '2026-09-11', supports: '§3 给出强 AI（“经适当编程的计算机——或程序本身——能理解自然语言，并真正具有与其所模仿的人类相似的其他心理能力”）与弱 AI 的界定；§4.1 载有塞尔对系统回应的再反驳原句：“原则上他可以把整个系统内化，记住全部指令和数据库，并在头脑中完成全部运算。然后他可以离开房间到户外走动，甚至可能用中文交谈。但他仍然无法把任何意义附着到那些形式符号上”，紧接的 §4.1.1 是虚拟心灵回应；§4.4 是他心回应。原定位“§3、§4.1–§4.4、§5”未点出 §4.1 内的再反驳，正文因此只写了“塞尔与这些回应有分歧”。' },
      { id: 'AI-3', title: 'SEP：The Turing Test', kind: '学术综述', url: 'https://plato.stanford.edu/entries/turing-test/', locator: '§1（Turing (1950) and the Imitation Game）、§4.1（(Logically) Necessary and Sufficient Conditions）、§4.2（Logically Sufficient Conditions）、§4.3（Criteria）、§4.4（Probabilistic Support）', checked: 'verified', checkedOn: '2026-09-11', supports: '§4.1–§4.4 逐节处理“通过测试”是逻辑上充分、是必要、是判准、还是只提供可被新证据推翻的概率性支持；条目分别给出“缺乏智能的东西通过图灵测试是逻辑上不可能的”“显然逻辑上可能存在颇有智能却无法通过图灵测试的东西”“图灵测试中收集到的归纳证据可以被新证据抵过”三种立场的措辞。原定位含 §6，而 §6 是“The Chinese Room”，与本条论断（归因证据的强度）无关，已移除。' },
      { id: 'AI-4', title: 'SEP：Ethics of Artificial Intelligence and Robotics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-ai/', locator: '§2.7.1（Moral Status）、§2.7.2（Agency）、§2.7.3（Machine Ethics，含法律人格）、§2.7.4（Responsibility，含“责任缺口”）', checked: 'verified', checkedOn: '2026-09-11', supports: '§2.7.1 给出“一个实体是道德行动者当且仅当它有义务，是道德患者当且仅当道德行动者对它有义务”；§2.7.2 区分厚的行动性（要求认识、控制、规范与现象条件）与薄的行动性（“一个做事的东西”）；§2.7.3 处理机器伦理与法律人格；§2.7.4 处理技术—社会系统中的责任分配与“责任缺口”。原定位到 §2.7.3 为止，而本条“部署责任不能被机构分散到无人承担”一句实际对应的是 §2.7.4，已补入。' },
      { id: 'AI-5', title: 'NIST AI RMF 1.0，第 5 节 AI RMF Core', kind: '制度文件', url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/', locator: '§5.1 Govern（GOVERN 2.1：角色、职责与沟通线）、§5.2 Map（MAP 3.5：人类监督流程的界定、评估与文档）、§5.4 Manage（MANAGE 2.4：停用、脱离或替换机制；MANAGE 4.1：部署后监测计划，含申诉与推翻、退役、事件响应、恢复与变更管理）', checked: 'verified', checkedOn: '2026-09-11', supports: '该页是 AI RMF 1.0 的 Core 一节，下辖 Govern／Map／Measure／Manage 四项职能。GOVERN 2.1 要求“与映射、度量、管理 AI 风险相关的角色、职责与沟通线被文档化，并对组织内的个人与团队清晰可辨”；MAP 3.5 要求“人类监督的流程按组织政策被界定、评估并文档化”；MANAGE 2.4 要求“已建立并实施机制、且职责已被分配和理解，以替换、脱离或停用表现或结果与预期用途不一致的 AI 系统”；MANAGE 4.1 要求部署后监测计划包含“申诉与推翻、退役、事件响应、恢复与变更管理”的机制。原定位“§5.1–§5.4，尤其 GOVERN 2、MAP 3、MANAGE 4”未落到具体条款号，现改为可逐条对照的条款。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-11', findings: [
      { location: '主要立场｜功能与行为标准', issue: '原文把图灵式表现标准写成理解的充分证明。', evidence: 'AI-1 §1 只是替换问题；AI-3 §4.1–§4.4 区分充分、必要、判准和概率性支持。', revision: '改为“评价线索／证据问题”，不从对话表现直接推出意识。' },
      { location: '案例推演｜医疗系统', issue: '原文只列可能负责者，没有责任如何落实的准则。', evidence: 'AI-5 的 GOVERN 2.1、MAP 3.5、MANAGE 2.4、MANAGE 4.1 分别给出角色文档、人类监督、停用机制与申诉／退役要求。', revision: '将案例问题改为控制、知情、补救与可追踪制度责任。' },
      { location: '有力反对及回应｜塞尔的再反驳缺席', issue: '原文只报告“塞尔的反驳与这些回应的分歧，正落在理解的承担者是谁、什么证据足够”，从未说出塞尔到底反驳了什么。读者因此看不到这场争论的关键一步。', evidence: 'AI-2 §4.1 载有塞尔的内化回应原句（把全部指令与数据库背下来、在头脑中运算、走出房间用中文交谈，而“仍然无法把任何意义附着到那些形式符号上”），§4.1.1 的虚拟心灵回应正是针对它的下一步。', revision: '把系统回应与他心回应拆成两段，并在第一段写出塞尔的内化再反驳、以及它把担子推回给对方的两条出路。' },
      { location: '来源账｜五条定位', issue: '五条来源全部标 pending；AI-3 的定位含 §6，而 §6 是“The Chinese Room”，与它自称支持的归因证据强度无关；AI-4 的定位到 §2.7.3 为止，漏掉正文实际使用的 §2.7.4；AI-5 的定位只写到 GOVERN 2、MAP 3、MANAGE 4 这一级，没有落到条款。', evidence: '本轮逐条实际打开核对目录与条款（见各条 supports）。', revision: '五条定位全部改准：AI-3 去掉 §6 并细到 §4.1–§4.4，AI-4 补入 §2.7.4，AI-5 改为 GOVERN 2.1／MAP 3.5／MANAGE 2.4／MANAGE 4.1 四条可逐句对照的条款，AI-1 补出 §6 的九条反对名目。' },
      { location: '放回历史语境', issue: 'historicalContext 里的 pt-history-tech 是 type 为“核心问题”的节点，却渲染在历史语境标题下。', evidence: 'data.json 中 pt-history-tech 的 type 为“核心问题”；relations.ts 已收录本条与它的语义边。', revision: '删除该条，只留 pt-western-contemporary。' },
    ], remaining: ['机器意识的经验指标与非西方技术哲学尚未进入本条；不能由现有论证断言任何现存模型有或无感受。', 'AI-5 是会随版本变动的制度文件，本轮核对的是 AI RMF 1.0 的 Core 页面。条款号一旦随新版调整，本条的定位就会失效，须定期回查。', 'AI-2 §4.2（机器人回应）、§4.3（脑模拟器回应）、§4.5、§4.6 与 §5.2–§5.4 本轮未核对；本页只用到系统回应、虚拟心灵回应与他心回应三支。'], adjacentImpact: '与“心灵、身体与我”互链时，必须区分行为归因与意识本体论；与“责任”互链时，必须区分归责、赔偿与风险治理。本页的功能主义说法须与 pt-mind-self 新增的定义保持一致——本轮已把功能主义的定义补进那一页，本页不再是全库唯一的定义处。原挂在本条历史语境里的 pt-history-tech 已删除，由 relations.ts 收录。', nextPriority: '补充技术哲学、数据劳动与东亚思想资源；另建 AI 治理的时效性法规页并定期核验。' },
  },
};

export function getCoreEntryLedger(nodeId: string): CoreEntryLedger | undefined {
  return coreEntryLedgers[nodeId];
}
