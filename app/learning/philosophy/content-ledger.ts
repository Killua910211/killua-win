import { remainingEntryLedgers } from './remaining-content-ledgers';

/**
 * 研究层：把“文章写了什么”与“为什么能这样写”放在同一处。
 *
 * 这不是书目清单。每个 source 都必须说明实际核对到的定位和它支持的论断；
 * 文字的性质也被显式标出，避免把解释或例子伪装为原文事实。
 */

export type ContentKind = '原文入口' | '概括' | '解释性重构' | '原创例子' | '争议性判断';

export type LedgerSource = {
  id: string;
  title: string;
  kind: '原典' | '学术综述' | '制度文件';
  url: string;
  locator: string;
  checked: true;
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
  }>;
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
    scope: '本条讨论行为受原因、性格与制度条件影响时，何种控制足以谈自由与归责；不把刑事责任、心理治疗和宗教修行直接化约为同一判断，也不预设“自由”必然是完全无因的选择。',
    origin: [
      { kind: '概括', text: '自由意志问题在两种直觉的冲突中产生：行动似乎是由过去与规律、性格和处境造成的；谴责、赞许与惩罚又似乎要求行动以某种方式“取决于”行动者。争论因此同时涉及因果、控制和道德实践。', sourceIds: ['FRE-1', 'FRE-2'] },
      { kind: '解释性重构', text: '将问题分为“本可以做别的吗”“行动是否出自我”“应否赞许、谴责或修复”，可以避免把形而上学结论直接换成政策结论。即使不同意基本应得，也仍须安排预防、保护、解释和补偿。' },
    ],
    boundaries: [
      { kind: '概括', text: '决定论指在既定过去和自然规律下，未来只有一种展开方式；它不同于宿命论，也不等于“原因已经被科学完全发现”。相容论问这样的决定论是否仍允许相关的行动控制；不相容论则认为关键自由不能与之共存。', sourceIds: ['FRE-1', 'FRE-2'] },
      { kind: '概括', text: '道德责任至少可区分为可归属性、可要求说明与可追究性；它们许可的反应和所需控制条件未必相同。把一次错误都直接推到“此人应受惩罚”会跳过这些区分。', sourceIds: ['FRE-1'] },
    ],
    objections: [
      { kind: '概括', text: '不相容论的有力论证是：若行为是自己不能控制的过去与规律的必然结果，它就并非真正由自己决定。相容论者回应，相关控制不要求控制过去和规律，而要求行动出自自己的理由、反思或对理由的响应，并且未受胁迫等妨碍。双方分歧正在“取决于我”需要何种控制。', sourceIds: ['FRE-2'] },
      { kind: '概括', text: '若为摆脱决定论而把行动归于随机事件，随机性不会自动给行动者更多控制。自由意志论因此还须说明一个非决定的行动怎样仍可被行动者恰当地作为源头。', sourceIds: ['FRE-1'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '解释一个行为的成因，不等于为它开脱；但它可能改变我们应使用的回应，例如治疗、约束、修复或谴责。' },
      { kind: '解释性重构', text: '没有外在胁迫只是相容论的一类必要资源，不等于已经解决行动为何“属于我”的全部问题。' },
      { kind: '争议性判断', text: '把儒家或佛教修养直接贴为相容论或不相容论会错过其自身关于习气、关系、觉知和解脱的目标；这里最多作问题上的并置。', sourceIds: ['FRE-1'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '霍布斯、休谟、斯宾诺莎与康德把因果、选择和道德法则放进不同近代框架。' },
      { nodeId: 'pt-confucian', label: '先秦：儒家及其伦理—政治问题', note: '从习礼、学习与德性养成进入“在条件中变得更能负责”的不同问题结构。' },
      { nodeId: 'pt-responsibility', label: '自由、责任与道德运气', note: '继续讨论归责、运气和制度回应，避免用一条自由理论包办所有问题。' },
    ],
    sources: [
      { id: 'FRE-1', title: 'SEP：Free Will', kind: '学术综述', url: 'https://plato.stanford.edu/entries/freewill/', locator: '导论、§1–§3，尤其 §2.1–§2.5', checked: true, supports: '控制、另作可能、源头性、相容／不相容论与责任的联系。' },
      { id: 'FRE-2', title: 'SEP：Moral Responsibility', kind: '学术综述', url: 'https://plato.stanford.edu/entries/moral-responsibility/', locator: '§1，尤其关于决定论、后果论证与相容论的段落', checked: true, supports: '决定论的界定、后果论证及相容论对控制的回应。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜相容论', issue: '原内容把相容论缩为“想做什么就做什么”。', evidence: 'FRE-1、FRE-2 都将理由响应、源头性和责任类型列为未决争论。', revision: '改为控制条件的竞争性说明，并加入胁迫与理由的区分。' },
      { location: '案例推演｜愤怒消息', issue: '原案例暗示理解原因只会削弱责任。', evidence: 'FRE-1 区分自由与不同责任实践。', revision: '改问不同回应的依据，避免把解释与免责等同。' },
    ], remaining: ['尚未逐一核验中文译本中“自由意志”“自发”“自主”等术语的使用差异。'], adjacentImpact: '“责任”页不得从决定论直接推出废除一切归责；“儒家”页不得用当代自由意志标签覆盖修养语境。', nextPriority: '补写道德运气、刑罚正当性与中国、印度自由问题的独立来源账。' },
  },
  'pt-logic': {
    status: '核验正文｜自审完成',
    scope: '本条介绍演绎有效、归纳支持和解释性推断如何分别评价理由；不把形式逻辑当成所有好判断的自动裁判，也不因真实生活复杂而放弃检查前提、歧义和反例。',
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
    ],
    confusions: [
      { kind: '解释性重构', text: '前提假而论证有效并不矛盾；它只说明若前提为真，结论不能为假。' },
      { kind: '解释性重构', text: '相关性不是因果性，统计关联也不自动消除混杂、选择偏差和替代解释。' },
      { kind: '解释性重构', text: '形式化是澄清工具，也是模型；它会忽略语气、语境、权力关系或事实调查，须说明它保留了什么。', sourceIds: ['LOG-1'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从亚里士多德三段论、论辩与谬误传统进入，不把古典逻辑当作现代符号系统的粗略预演。' },
      { nodeId: 'pt-nyaya', label: '正理、胜论及认识—论辩传统', note: '比较推理、反例和论辩目的时，保留 pramāṇa 与五支论证的自身语境。' },
      { nodeId: 'pt-knowledge-sources', label: '知识从哪里来，边界又在哪里？', note: '好推理仍须与证据、证言和可纠错实践结合。' },
    ],
    sources: [
      { id: 'LOG-1', title: 'SEP：Classical Logic', kind: '学术综述', url: 'https://plato.stanford.edu/entries/logic-classical/', locator: '导论、§2–§6', checked: true, supports: '论证、有效性、推导、语义、健全性／完备性和“唯一正确逻辑”问题。' },
      { id: 'LOG-2', title: 'SEP：Fallacies', kind: '学术综述', url: 'https://plato.stanford.edu/entries/fallacies/', locator: '导论、§1、§3–§4', checked: true, supports: '非形式谬误的语境性、似是而非条件及分类争议。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜演绎有效性', issue: '原文将有效性说成“结论为真”。', evidence: 'LOG-1 将有效性界定为没有前提全真而结论假的解释。', revision: '增加有效／健全、前提／形式的分工。' },
      { location: '案例推演｜带伞下雨', issue: '原例只贴“相关不等于因果”标签。', evidence: 'LOG-2 要求重建论证与其失败条件。', revision: '要求列出混杂变量、反事实和替代解释，而非背诵谬误名。' },
    ], remaining: ['归纳、贝叶斯和因果推断尚未建立各自独立的原典阅读卡。'], adjacentImpact: '“语言意义”页须提醒论证可因歧义失效；“正理”页不能被降格为欧洲逻辑的附录。', nextPriority: '补写归纳、因果与解释推断，并对接正理、墨辩的原典材料。' },
  },
  'pt-language-meaning': {
    status: '核验正文｜自审完成',
    scope: '本条讨论词语、句子、说话者、使用场景和社会实践怎样共同承担意义与真理要求；不把命名当作贴标签的纯技术，也不从语言塑造经验直接推出“没有独立事实”。',
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
    ],
    confusions: [
      { kind: '解释性重构', text: '“语言影响我们看见什么”不等于事实随意由语言制造；它要求区分分类、注意、制度后果和经验对象。' },
      { kind: '解释性重构', text: '“同一词有不同含义”不自动构成谬误，只有论证在关键处偷换含义才会断裂。' },
      { kind: '解释性重构', text: '“正名”不等于把词典固定；其翻译、文本目的和社会规范含义都是争论对象。', sourceIds: ['LAN-3'] },
    ],
    historicalContext: [
      { nodeId: 'pt-legalism', label: '先秦：墨家、名家、法家等论辩线索', note: '名实、辩与规范治理需与墨辩、名家和法家材料对读，不能只围绕儒家。' },
      { nodeId: 'pt-confucian', label: '先秦：儒家及其伦理—政治问题', note: '名的正确使用与礼、行动和角色关系相连，但不应被简化成词汇政策。' },
      { nodeId: 'pt-logic', label: '什么是好推理与有效论证？', note: '歧义、语境与隐含前提会改变论证是否真的支持结论。' },
    ],
    sources: [
      { id: 'LAN-1', title: 'SEP：Word Meaning', kind: '学术综述', url: 'https://plato.stanford.edu/entries/word-meaning/', locator: '导论、§1、§3', checked: true, supports: '词义、组合性、外在主义／内在主义和语境主义的不同问题。' },
      { id: 'LAN-2', title: 'SEP：Truth', kind: '学术综述', url: 'https://plato.stanford.edu/entries/truth/', locator: '§1、§6', checked: true, supports: '真理承担者和真理—语言关系。' },
      { id: 'LAN-3', title: 'SEP：Logic and Language in Early Chinese Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/chinese-logic-language/', locator: '导论、§2', checked: true, supports: '名、正名的实践／规范维度及其非纯描述性功能。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜使用与实践', issue: '原内容把“使用”写成只要大家同意就正确。', evidence: 'LAN-1 区分词义、语境和多种理论；LAN-2 保留真理问题。', revision: '加入误用、批评与真理要求的难题。' },
      { location: '跨传统连接｜名实', issue: '原文把名实当作现代语言哲学的提前版本。', evidence: 'LAN-3 将其放入行动、秩序与早期中国论辩。', revision: '改为并置问题，并提示翻译与历史边界。' },
    ], remaining: ['尚未逐节核验《论语》《墨经》《荀子·正名》的中文校勘版本。'], adjacentImpact: '“解释”页须区分文本意义与作者意图；“身份与压迫”页应说明命名的制度后果而非只作修辞批评。', nextPriority: '补写言语行为、翻译和中国名实论辩的原典阅读路径。' },
  },
  'pt-western-modern': {
    status: '核验正文｜自审完成',
    scope: '本条提供 17—18 世纪欧洲哲学的首版问题地图，串联知识、自然、心灵与政治权威；不把它写成“理性主义战胜经验主义”的单线进步史，也不以此替代跨区域的近世哲学史。',
    sectionHeadings: { origin: '历史起点与问题结构', boundaries: '时段、标签与材料边界', objections: '史学分类的争议', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '近代欧洲哲学中的知识问题与科学、宗教、国家和教育并不分离：新的自然解释、怀疑论压力和政治冲突，使人们重新问理性、感官、方法、权威与自由的界限。人物之间并非在同一议题上排队接力。', sourceIds: ['MOD-1'] },
      { kind: '解释性重构', text: '从笛卡尔的确定性诉求、洛克和休谟对经验与观念的分析，到康德对认识条件的重构，可以得到一条教学路线；但这只是一条进入路径，不是时代的全部内容。' },
    ],
    boundaries: [
      { kind: '概括', text: '“理性主义／经验主义”原本是围绕知识来源、先天观念、直觉与感官经验的相对限定区分。一个哲学家可在某个领域重理性、在另一个领域重经验，故这两个标签既不穷尽人物，也不能替代具体文本。', sourceIds: ['MOD-1'] },
      { kind: '概括', text: '把近代只限定为几位男性形而上学家的谱系，会掩盖情感、教育、政治、宗教宽容等论争及大量未被经典叙事收纳的人物。标签本身也塑造了教学正典。', sourceIds: ['MOD-1'] },
    ],
    objections: [
      { kind: '概括', text: '“大陆理性主义对英国经验主义”的讲法易于教学，却会误导：笛卡尔有经验研究取向，洛克在道德和推理问题上也赋予理性重要角色，霍布斯、伊丽莎白·波希米亚等更难被放入二分。回应不是取消比较，而是每次说明比较的领域和限度。', sourceIds: ['MOD-1'] },
      { kind: '解释性重构', text: '将科学革命解释为理性取代传统，也会忽略实验、仪器、制度、殖民与宗教争论。思想史不是背景装饰，而会改变“知识”“自然”和“政治”的含义。' },
    ],
    confusions: [
      { kind: '解释性重构', text: '“近代”不是普遍世界时间标签；此页是欧洲历史线索，不应用来给中国、印度或伊斯兰哲学划分时期。' },
      { kind: '解释性重构', text: '经验主义不等于“只相信眼睛”，理性主义也不等于“反对经验”。', sourceIds: ['MOD-1'] },
      { kind: '解释性重构', text: '康德不是二分法的简单终点；将他只写成综合者会遮蔽批判哲学的多重问题。' },
    ],
    historicalContext: [
      { nodeId: 'pt-knowledge-sources', label: '知识从哪里来，边界又在哪里？', note: '把经验、理性、证言和知识限度拆开，而非只把人物放队。' },
      { nodeId: 'pt-mind-self', label: '心灵、身体与“我”', note: '身心、人格与自我认识的近代争论要回到具体文本。' },
      { nodeId: 'pt-legitimacy', label: '何种权力与制度是正当的？', note: '自然权利、契约、服从和政治权威是同一时期另一组重要问题。' },
    ],
    sources: [
      { id: 'MOD-1', title: 'SEP：Rationalism vs. Empiricism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/rationalism-empiricism/', locator: '导论、§1、§4，尤其关于分类局限的段落', checked: true, supports: '理性主义／经验主义的限定含义、非穷尽性及历史正典问题。' },
      { id: 'MOD-2', title: 'SEP：Early Modern Rationalism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/rationalism-early-modern/', locator: '导论、§1', checked: true, supports: '“早期近代理性主义”作为史学范畴和教学简化的局限。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '摘要｜理性主义／经验主义', issue: '原文将二分法当作该时段的组织事实。', evidence: 'MOD-1 明确指出人物可跨领域，且分类会遮蔽丰富性。', revision: '改为带边界的教学路径，并列出被遗漏问题。' },
      { location: '人物列表', issue: '原内容只堆名字，未显示问题之间的连接。', evidence: 'MOD-1 以知识来源为一条线，且提醒不可外推成共同纲领。', revision: '新增知识、自然、心灵与政治的结构性入口。' },
    ], remaining: ['尚未逐篇核对女性哲学家、殖民知识史和科学实践的专门史料。'], adjacentImpact: '核心问题页应把近代作为一种历史语境而非普遍哲学基准；“中国／印度／伊斯兰”页须保留各自时段。', nextPriority: '补写科学革命、自然法与近代政治的原典／史学阅读路径。' },
  },
  'pt-confucian': {
    status: '核验正文｜自审完成',
    scope: '本条是先秦儒家伦理—政治问题的首版入口，比较孔子相关文本、孟子与荀子的修养和人性论；不把“儒家”当作固定的国家意识形态，也不把礼、孝或性善简化为服从口号。',
    sectionHeadings: { origin: '历史起点与问题结构', boundaries: '文本、术语与传承边界', objections: '内部论辩与当代质问', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '早期儒家将德性、礼、学习、家庭角色和治理相互连结：问题不只是“遵守哪条规则”，而是人在关系和制度中如何形成能辨别、关怀并承担角色的人。孔子相关思想又在后世被多种文本和解释传统重构。', sourceIds: ['CON-1'] },
      { kind: '概括', text: '孟子把恻隐等道德端绪与涵养相连；荀子则把欲望、学习、礼与有意识的塑造置于核心。两者分歧不是简单的“乐观／悲观”，而关系到道德能力、习得和制度的不同解释。', sourceIds: ['CON-2', 'CON-3'] },
    ],
    boundaries: [
      { kind: '概括', text: 'Ru（儒）早于孔子而与礼乐、经典专家相关；“Confucian”既可指早期文本，也可指后来的哲学、教育和制度传统。阅读时须标出在说哪一层，而不是把两千年实践倒灌进《论语》。', sourceIds: ['CON-1'] },
      { kind: '概括', text: '礼不是一套可脱离关系和情境的外在仪式；但它也不只是个人感受。它涉及身体习惯、角色期待、情感养成和政治秩序，故既可能支持相互尊重，也可能被用来固化不平等。', sourceIds: ['CON-1', 'CON-3'] },
    ],
    objections: [
      { kind: '概括', text: '对孟子式道德端绪的质问是：恶行、贫困、暴力和偏私如何进入理论？相关回应会强调端绪是可扩展亦可遮蔽的能力，而非自动完成的善。评价仍须说明教育与物质条件为何能支持或损坏养成。', sourceIds: ['CON-2'] },
      { kind: '概括', text: '荀子将自然欲望、审慎努力、师法与礼联系起来，能解释为何德性需要学习；批评者则问这种秩序如何避免把既有权威定为标准。不能用“性恶”推成人人天生邪恶，也不能把礼的历史形式免于批评。', sourceIds: ['CON-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '性善不等于人总会做好事；性恶也不等于每个人道德上不可救药。两者都须放回性、情、习和修养的论证。', sourceIds: ['CON-2', 'CON-3'] },
      { kind: '解释性重构', text: '孝与礼不是自动压倒所有关系中的不平等、伤害或异议；如何批判坏的角色期待是仍待论证的问题。' },
      { kind: '解释性重构', text: '把孔子等同于一个固定“传统文化符号”会掩盖经典、注释和现代政治中的多重重读。', sourceIds: ['CON-1'] },
    ],
    historicalContext: [
      { nodeId: 'pt-daoism', label: '先秦：道家与自然、行动问题', note: '比较自然、行动和规范时，先看相互批评和文本差异，而不制作儒道二元标签。' },
      { nodeId: 'pt-legalism', label: '先秦：墨家、名家、法家等论辩线索', note: '礼、法、兼爱、名实和治理在竞争性方案中展开。' },
      { nodeId: 'pt-care', label: '关系、照护与依赖', note: '关系性伦理可从儒家获得资源，却也需面对性别、代际与权力的批评。' },
    ],
    sources: [
      { id: 'CON-1', title: 'SEP：Confucius', kind: '学术综述', url: 'https://plato.stanford.edu/entries/confucius/', locator: '导论、§2 及后世接受相关段落', checked: true, supports: '文本来源不确定性、礼仪心理、德性、社会政治及后世多重定位。' },
      { id: 'CON-2', title: 'SEP：Mencius', kind: '学术综述', url: 'https://plato.stanford.edu/entries/mencius/', locator: '导论及人性、修养、政治哲学相关章节', checked: true, supports: '孟子的人性、道德端绪、修养与经验条件的复杂结构。' },
      { id: 'CON-3', title: 'SEP：Chinese Ethics / Xunzi', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-chinese/', locator: '§2.6；并参见 Xunzi §2–§5', checked: true, supports: '荀子对性、欲望、礼、师法和有意识努力的分析。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜性善／性恶', issue: '原内容将分歧压缩成两种性格判断。', evidence: 'CON-2、CON-3 分别将端绪、欲望、学习、礼和实践置于论证中。', revision: '重写为道德能力与养成条件的争论。' },
      { location: '人物与传统', issue: '原内容默认孔子思想与后世儒家制度同义。', evidence: 'CON-1 指出文本来源、经典化和现代再定位的多层历史。', revision: '新增文本、术语与传承边界。' },
    ], remaining: ['尚未逐段核对《论语》《孟子》《荀子》的中文校勘本与早期注本。'], adjacentImpact: '“照护”“自由”“正当性”页可在此互链，但不能把儒家关系性直接当作当代规范结论。', nextPriority: '补写墨家、道家、法家与宋明重构，以呈现儒家之外和儒家内部的连续论辩。' },
  },
  'pt-buddhist': {
    status: '核验正文｜自审完成',
    scope: '本条是佛教哲学的首版历史入口：说明苦、无我、缘起、空性与认识论如何在不同文本与学派中形成问题；不把它归结为一种“东方心灵疗法”，也不代替佛教史、宗教实践或各语种原典的专题研究。',
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
      { kind: '概括', text: '无我面对一个真正困难：若没有不变主体，记忆归属、业报和修行进展凭什么连接？不同佛教理论诉诸因果连续、五蕴分析、相续或其他资源来回答；这些不是一个被全体接受的简单答案。', sourceIds: ['BUD-2'] },
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
      { nodeId: 'pt-mind-self', label: '心灵、身体与“我”', note: '以无我分析挑战固定自我，但不把它预设为当代人格同一性的直接答案。' },
    ],
    sources: [
      { id: 'BUD-1', title: 'SEP：Buddha', kind: '学术综述', url: 'https://plato.stanford.edu/entries/buddha/', locator: '导论、§2–§4', checked: true, supports: '早期佛教的苦、无常、无我、缘起与实践目标。' },
      { id: 'BUD-2', title: 'SEP：Mind in Indian Buddhist Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/archives/spr2017/entries/mind-indian-buddhism/', locator: '导论、§1.1、§5.6', checked: true, supports: '无我、心识理论和不同佛教路径的不可化约性。' },
      { id: 'BUD-3', title: 'SEP：Nāgārjuna', kind: '学术综述', url: 'https://plato.stanford.edu/entries/nagarjuna/', locator: '导论、§2–§3', checked: true, supports: '自性、缘起、空性、二谛与虚无论误读。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '摘要与人物', issue: '原页面将无我、空性、心识并列，却没有文本层次与学派差异。', evidence: 'BUD-1、BUD-2、BUD-3 分别处理早期佛教、印度佛教心识与中观。', revision: '新增历史起点、概念边界与内部论辩，避免单一“佛教观点”。' },
      { location: '例子｜失败者标签', issue: '原例子容易将无我心理治疗化。', evidence: 'BUD-1 将相关分析置于苦与止息；BUD-2 讨论理论分歧。', revision: '保留例子为入门，不把它当作无我论证或修行建议。' },
    ], remaining: ['尚未逐段核对《阿含》《中论》及瑜伽行论书的汉译版本和梵／藏文本；不可把本页当作原典释读。'], adjacentImpact: '“心灵与自我”“存在与变化”“解释与传统”三页均须链接到此处，并保留跨传统不可直接对译的提醒。', nextPriority: '补写中国佛教的翻译、注释与宗派形成，避免印度佛教代表全部佛教历史。' },
  },
  'pt-nyaya': {
    status: '核验正文｜自审完成',
    scope: '本条介绍正理（Nyāya）及其与胜论关联的认识—论辩传统，重点是 pramāṇa、推理、证言与反驳；不把它化为“印度版形式逻辑”，也不在本页解决各时期作者、文本归属和新正理技术语言的全部问题。',
    sectionHeadings: { origin: '历史起点与论辩任务', boundaries: '认识手段与推理边界', objections: '争论与方法难题', confusions: '常见误读', historicalContext: '相邻传统与问题' },
    origin: [
      { kind: '概括', text: '正理传统把获得真知、排除错误和在论辩中给出理由作为相连任务。它以 pramāṇa 讨论知觉、推理、比喻与证言等方式，并细分命题、理由、例证、反例和谬误；这说明认识论与辩论规范在此不可分开。', sourceIds: ['NYA-1'] },
      { kind: '概括', text: '印度认识论并无单一清单：正理与其他学派对有效认识手段的数量、证言地位、对象和错误理论有不同答案。把 pramāṇa 简单译为“证据”会遗漏它关于认识成功条件的技术含义。', sourceIds: ['NYA-1'] },
    ],
    boundaries: [
      { kind: '概括', text: '从烟推知火不是“看到烟就猜火”：推理需要被推论项与理由项之间的遍在／伴随关系，并须面对反例、观察条件和推理用途。正理的五支论证也不是任意比演绎多三步，而服务于公共论辩中的展示。', sourceIds: ['NYA-1'] },
      { kind: '概括', text: '证言在正理传统中可成为知识来源，却不等于服从权威；说话者的可信性、话语理解、意向和对象条件都进入评价。', sourceIds: ['NYA-1'] },
    ],
    objections: [
      { kind: '概括', text: '对推理的难题是：遍在关系如何确立而不循环？仅见到许多烟火同现并不能自动排除隐藏条件。正理回应会引入正反例、排除阻碍条件等分析，但其成功与否正是后续论辩的一部分。', sourceIds: ['NYA-1'] },
      { kind: '概括', text: '不同学派会争论证言是否独立于推理、语言是否能可靠指称、知觉是否带概念。因而“正理承认证言”不是终点，而是要进一步追问可信性的规范来自何处。', sourceIds: ['NYA-1'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“五支论证”不等于现代形式逻辑的失败版本；它有不同的交流目的、语义资源和论辩情境。' },
      { kind: '解释性重构', text: '承认证言不等于取消检验；问题转为可靠说话者、理解、传递和反驳如何组织。' },
      { kind: '解释性重构', text: '“印度哲学重直觉、不重论证”与正理传统的材料直接冲突。' },
    ],
    historicalContext: [
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '佛教认识论与正理传统既共享论辩空间，也在知觉、推理和对象上激烈分歧。' },
      { nodeId: 'pt-knowledge-sources', label: '知识从哪里来，边界又在哪里？', note: '把感知、推理和证言作为可争论的认识手段，而非只套进经验主义／理性主义。' },
      { nodeId: 'pt-logic', label: '什么是好推理与有效论证？', note: '比较论证形式时要先说明目的、语言与谬误理论，不能只寻找一一对应符号。' },
    ],
    sources: [
      { id: 'NYA-1', title: 'SEP：Epistemology in Classical Indian Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology-india/', locator: '导论、§1–§2', checked: true, supports: 'pramāṇa、知觉、推理、证言和印度学派间的认识论争论。' },
      { id: 'NYA-2', title: 'SEP：Analytic Philosophy in Early Modern India', kind: '学术综述', url: 'https://plato.stanford.edu/entries/early-modern-india/', locator: '导论、§2', checked: true, supports: '新正理及早期近世印度论证传统的延续，反对把其视为古代余响。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '例子｜烟与火', issue: '原例子只把正理写成“看到烟所以有火”的直觉。', evidence: 'NYA-1 将推理置于遍在关系、反例和认识手段之中。', revision: '补入推理条件、反例和公共展示的功能。' },
      { location: '人物列表', issue: '原文罗列作者，未说明该传统解决什么知识问题。', evidence: 'NYA-1 的组织中心是 pramāṇa 与知识条件。', revision: '以认识、推理和证言的争论重写历史入口。' },
    ], remaining: ['尚未逐一核对《正理经》、注释与新正理论书的中文／英译及作者年代。'], adjacentImpact: '“知识来源”和“逻辑”页应回链到本条；不可把正理只当作西方逻辑史之外的旁注。', nextPriority: '补写胜论的范畴论与正理—佛教论辩的原典阅读路径。' },
  },
  'pt-being-change': {
    status: '核验正文｜自审完成',
    scope: '本条主线只讨论一个人工物在变化中为何仍可能是原来的对象：数值同一性、候选判断标准与跨时间持续。过程哲学、基本存在者与中观自性仅作进阶关联；不从本页直接推出人格同一性、物理学结论或跨传统理论等同。',
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
      { kind: '解释性重构', text: '“空”不等于“虚无”或“什么说法都对”；它首先针对以独立自性解释事物的方式。', sourceIds: ['BEC-3'] },
      { kind: '解释性重构', text: '本体论的“存在”不等于“肉眼可见”：数字、制度、事件与理论实体的存在方式是仍待论证的问题。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从巴门尼德、赫拉克利特到亚里士多德，变化与实体已形成不同问题线。' },
      { nodeId: 'pt-buddhist', label: '佛教哲学：苦、无我、缘起与认识', note: '缘起、无我与空性必须放在具体论证和修行目标中，不可只译为抽象本体论。' },
    ],
    sources: [
      { id: 'BEC-1', title: 'SEP：Identity Over Time', kind: '学术综述', url: 'https://plato.stanford.edu/entries/identity-time/', locator: '导论、§2.1–§2.4、§4.3–§4.5', checked: true, supports: '数值／质的同一、变化难题、严格与宽松同一性、重组和四维主义。' },
      { id: 'BEC-2', title: 'SEP：Temporal Parts（2024 春季归档版）', kind: '学术综述', url: 'https://plato.stanford.edu/archives/spr2024/entries/temporal-parts/', locator: '导论、§1–§3', checked: true, supports: '耐存论、延存论／四维主义、时间部分及其与忒修斯之船问题的关系。' },
      { id: 'BEC-3', title: 'SEP：Process Philosophy（2011 夏季归档版）', kind: '学术综述', url: 'https://plato.stanford.edu/archives/sum2011/entries/process-philosophy/', locator: '导论、§1–§2', checked: true, supports: '过程哲学关于过程、变化和解释优先性的范围，及其不同于单一持续理论的提问。' },
      { id: 'BEC-4', title: 'SEP：Nāgārjuna', kind: '学术综述', url: 'https://plato.stanford.edu/entries/nagarjuna/', locator: '§2、§3.1–§3.2、§3.5', checked: true, supports: '自性、空性、依赖与对虚无论误读的区分，以及《中论》的文本位置。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主文前半｜问题层级', issue: '原模板把存在论、对象持续、基本性和空性并列呈现，零基础读者难以知道先解决什么。', evidence: 'BEC-1、BEC-2 分别以同一性／持续问题组织讨论；BEC-3、BEC-4 的问题范围不同。', revision: '主文只围绕逐步替换与重组案例；过程哲学、基本性和中观移入默认折叠的进阶关联。' },
      { location: '候选标准与练习', issue: '旧页面给出结论与问题列表，却没有走完理由、反例、回应和剩余困难。', evidence: 'BEC-1 讨论重组、严格／宽松同一性；BEC-2 说明持续理论并非身份判准的同义替换。', revision: '补写材料、结构／功能、因果历史连续的推演，并给出两道含参考分析的迁移练习。' },
      { location: '进阶关联｜中观', issue: '将空性与西方持续理论放在同一立场列表，易被读成“万物不存在”或同义学说。', evidence: 'BEC-4 §2–§3 区分自性、空性和依赖；BEC-3 的问题是过程在本体论解释中的地位。', revision: '明确它们各自的问题对象、范围与不可直接等同的边界。' },
    ], remaining: ['尚未逐段校勘《中论》汉译与相关注释传统；未核对过程哲学近年版条目的修订状态。本页不把这些材料当作原典释读或学界定论。'], adjacentImpact: '“心灵、身体与我”页仍须把人格同一性同一般对象持续分开；“佛教哲学”页须保留缘起、无我与空性的自身论证语境。', nextPriority: '在独立审查中逐段核对主文与 BEC-1／BEC-2 的对应，并补充《中论》可靠汉译版本与章段。' },
  },
  'pt-knowledge-sources': {
    status: '核验正文｜自审完成',
    scope: '本条讨论信念何以正当、知识如何取得及其限度；不把“知识”简化为考试信息，也不预设经验、推理、证言和修行实践在所有传统中有同一地位。',
    origin: [
      { kind: '概括', text: '我们会发现自己相信某事，却仍要问：它是真的、理由足够，还是只是碰巧猜对？感知、记忆、内省、推理和他人证言都能带来信念，也都可能出错；认识论因此既问来源，也问纠错与边界。', sourceIds: ['KNO-1'] },
      { kind: '概括', text: '古典印度认识论以 pramāṇa（有效认识手段）为组织线索，围绕知觉、推理与证言等来源展开分歧。不同学派所承认的来源及其条件不同，不能把它们粗译为西方经验主义／理性主义。', sourceIds: ['KNO-2'] },
    ],
    boundaries: [
      { kind: '概括', text: '“有真信念”不等于“有知识”：盖梯尔式案例提示，一个信念可以有看似好理由却因运气而真。此后理论会讨论可靠过程、反事实安全性、认知能力或社会实践等补充条件。', sourceIds: ['KNO-1'] },
      { kind: '解释性重构', text: '证言不是“未经验证的传闻”的同义词。依赖专家、历史档案和他人报告是认识生活的常态；关键是来源能力、利益冲突、传递链和可纠错机制，而不是要求每个人亲自重做一切证据。' },
    ],
    objections: [
      { kind: '概括', text: '经验主义若把一切知识压到感觉输入，会难以说明逻辑、数学、概念和证言的作用；理性主义若把可靠性主要交给先天结构，又须解释它如何接触具体世界。较成熟的理论通常承认多种来源，却要说明它们冲突时的权重。', sourceIds: ['KNO-1'] },
      { kind: '概括', text: '把证言列为独立认识手段会面临“为什么不都还原为个人推理”的质疑；印度传统的争论正要求说明说话者可靠性、语句理解与缺席对象的知识如何成立，而不是只给权威贴标签。', sourceIds: ['KNO-2'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '怀疑论不是“什么都不知道”的口头姿态；它要求指出何种理由不能排除错误、幻觉或运气。' },
      { kind: '解释性重构', text: '证据不是孤立数据点，而是与测量、背景假设、推理和可追问来源共同构成。' },
      { kind: '解释性重构', text: '“相信专家”并非放弃批判；应从可解释性、独立核查、专业共同体和利益结构评价证言。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '理性主义／经验主义是重要教学线索，但不能覆盖全部近代认识论。' },
      { nodeId: 'pt-nyaya', label: '正理、胜论及认识—论辩传统', note: '从 pramāṇa、推理和证言的细致分歧进入印度认识论。' },
    ],
    sources: [
      { id: 'KNO-1', title: 'SEP：Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology/', locator: '导论、§1–§3', checked: true, supports: '知识、正当性、怀疑论以及感知、记忆、推理、证言等认识来源。' },
      { id: 'KNO-2', title: 'SEP：Epistemology in Classical Indian Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/entries/epistemology-india/', locator: '导论、§1–§2', checked: true, supports: 'pramāṇa、知觉、推理、证言与学派间的差异。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜经验与理性', issue: '原文把它们写成穷尽的二选一。', evidence: 'KNO-1 将证言、记忆、内省和推理也列为认识论问题。', revision: '改为多来源结构，并提出冲突权重问题。' },
      { location: '传统连接｜印度哲学', issue: '原文只把正理作为“印度的逻辑”。', evidence: 'KNO-2 以 pramāṇa 组织知觉、推理和证言的争论。', revision: '新增认识手段、证言与不可直接翻译的边界。' },
    ], remaining: ['尚未完成中文 pramāṇa 译名和正理原典版本的对勘。'], adjacentImpact: '与“科学与实在”连接时，不能把科学证据降为单一感官经验；与“身份与压迫”连接时，应另说明证言不公与一般证言理论的关系。', nextPriority: '补写正理历史线索的阅读路径，并校对中文原典选本。' },
  },
  'pt-religion-reason': {
    status: '核验正文｜自审完成',
    scope:
      '本条只比较“宗教信念怎样被评价”的几类论证；不裁决任何传统的真伪，也不把“神”预设成单一的有神论概念。有关儒家、佛教、印度与伊斯兰传统的具体问题，须回到各自历史条目和原典。',
    origin: [
      {
        kind: '概括',
        text:
          '问题不是简单地问“信不信”，而是问：宇宙、经验、道德或启示能否构成理由；不同理由要求的证据标准是否相同；一个解释苦难的世界观要付出什么代价。自然神学以通常的人类认知能力考察宗教问题，因而和诉诸经文或启示的神学不同。',
        sourceIds: ['REL-1', 'REL-2'],
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
          '“恶的问题”至少有两种：逻辑版本试图证明某类神的属性与任何恶不相容；证据版本则认为特定、严重或看似无意义的苦难降低该神存在的合理性。两种版本所需的反驳强度不同。',
        sourceIds: ['REL-2'],
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
          '对自由意志回应的有力质疑是：它最多直接解释某些人为伤害，不能单独说明疾病、动物痛苦或自然灾害。回应者可以再提出灵魂成长、自然律稳定或认知有限等理由，但每一种都必须面对具体苦难的规模、分布与道德代价，而非只证明逻辑可能。',
        sourceIds: ['REL-2'],
      },
      {
        kind: '原文入口',
        text:
          '休谟《自然宗教对话录》不是一段“反宗教名言”，而是让不同人物争论从世界秩序能否推到神的性质；读第 II–V、X–XI 部时，要区分人物发言与作者最终立场。',
        sourceIds: ['REL-3'],
      },
    ],
    confusions: [
      { kind: '解释性重构', text: '“无神论”并不自动等于“认为人生没有意义”；“自然主义”也不等于“只有实验科学能给理由”。' },
      { kind: '解释性重构', text: '一项论证未能证明某一具体传统，不等于它对“是否存在终极解释”没有任何讨论价值。' },
      { kind: '解释性重构', text: '“辩护”只需说明某种恶与神并非逻辑矛盾；“神义论”还要给出为何允许它的较完整解释，二者不能互换。', sourceIds: ['REL-2'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-medieval', label: '中世纪与跨文化传译', note: '查看自然神学、古典哲学与一神教论辩如何相互翻译。' },
      { nodeId: 'pt-islamic-reason-revelation', label: '存在、理智与启示', note: '避免把“理性与宗教”只写成近代欧洲式对立。' },
    ],
    sources: [
      { id: 'REL-1', title: 'SEP：Natural Theology and Natural Religion', kind: '学术综述', url: 'https://plato.stanford.edu/entries/natural-theology/', locator: '导论、§3.3', checked: true, supports: '自然神学与启示神学的边界，以及不同传统内部的差异。' },
      { id: 'REL-2', title: 'SEP：The Problem of Evil', kind: '学术综述', url: 'https://plato.stanford.edu/entries/evil/', locator: '导论、§2–§4、§6', checked: true, supports: '逻辑／证据版本、辩护／神义论区别及宗教经验的可反驳性。' },
      { id: 'REL-3', title: 'David Hume, Dialogues Concerning Natural Religion', kind: '原典', url: 'https://www.gutenberg.org/cache/epub/4583/pg4583-images.html', locator: 'Part II–V, X–XI', checked: true, supports: '设计论证、恶与神属性的对话式争论；不把某位人物与休谟直接等同。' },
    ],
    review: {
      mode: '自审（尚未独立复审）', checkedOn: '2026-09-07',
      findings: [
        { location: '主要立场｜自然神学与证据主义', issue: '原文把“自然神学”误写成只从自然科学出发。', evidence: 'REL-1 导论将其范围扩展到理性、感知与内省。', revision: '在定义与边界中改为“通常认知能力”，并与启示神学区分。' },
        { location: '案例推演｜灾难之后', issue: '原案例把恶的问题处理为单一反驳。', evidence: 'REL-2 区分演绎与证据性论证，以及辩护与神义论。', revision: '改以两种论证强度和不同回应的代价提问。' },
      ],
      remaining: ['尚未逐版本核对阿奎那、安萨里中文译本；原典卡片只作为阅读入口。'],
      adjacentImpact: '与“知识从哪里来”相连时，须保留宗教经验的认识论问题；不得把它直接归为非理性。',
      nextPriority: '核对伊斯兰与印度传统原典版本后，补一段可比性与不可比性的说明。',
    },
  },
  'pt-death-meaning': {
    status: '核验正文｜自审完成',
    scope: '本条分开讨论死亡是否伤害死者、有限生命是否可有意义、以及个人如何面对荒诞；不提供心理危机干预或把某种生活方案宣布为普遍答案。',
    origin: [
      { kind: '概括', text: '死亡问题之所以难，不是因为人必然恐惧，而是因为“伤害”通常要求有一个被伤害者和比较基准：死亡发生后主体不再经验，为什么仍可能使其更糟？伊壁鸠鲁的挑战与当代“剥夺论”正围绕这个缺口展开。', sourceIds: ['DEA-1', 'DEA-2'] },
      { kind: '解释性重构', text: '“我怎样活得有意义”又不是同一个问题。它可以问主观投入、值得投入的对象、人生叙事或终极根据；把它直接化为“快乐多不多”或“死后有人记得吗”会丢掉争论。', sourceIds: ['DEA-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '伊壁鸠鲁以善恶与感觉相关来论证：在世时死亡不在，死亡来到时我们不在。剥夺论并不说死者继续感到痛苦，而是用“本可拥有的善被截断”作比较。', sourceIds: ['DEA-1', 'DEA-2'] },
      { kind: '争议性判断', text: '“意义”不应被用来评判一个受疾病、贫困或压迫限制的人生较不值得。若理论把可选择项目当作唯一来源，它必须说明结构性限制如何进入评价。', sourceIds: ['DEA-3'] },
    ],
    objections: [
      { kind: '概括', text: '剥夺论的难点不只是“何时受害”，还有对称性：若晚出生少活一些不是损失，为什么早死就一定是？回应通常诉诸我们实际拥有的、会被未来截断的生命，而这种回应本身仍受争议。', sourceIds: ['DEA-2'] },
      { kind: '概括', text: '只靠主观满意容易把空洞或有害的投入也算作意义；只靠客观价值又可能无视个人认同。沃尔夫式混合观点因而要求投入与值得投入的对象相遇，但“什么算值得”并没有因此被消除。', sourceIds: ['DEA-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '害怕死亡、认为死亡对死者有害、哀悼他人，分别是情绪、价值判断和关系实践，不能互相推出。' },
      { kind: '解释性重构', text: '“荒诞”不是“什么都无所谓”；它描述的是人对终极说明的需求与世界未必提供该说明的张力。' },
      { kind: '解释性重构', text: '人生意义不同于道德正确，也不同于幸福：一项有意义的项目可以艰难，快乐的消遣也未必构成整个人生的意义。', sourceIds: ['DEA-3'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-ancient', label: '古典与希腊化时期', note: '从伊壁鸠鲁的快乐论和死亡论证进入，不把“古人不怕死”当结论。' },
      { nodeId: 'pt-buddhist', label: '佛教哲学', note: '比较无常、苦与无我的问题框架时，避免将其简化成西方存在主义。' },
    ],
    sources: [
      { id: 'DEA-1', title: 'Epicurus, Letter to Menoeceus', kind: '原典', url: 'https://classics.mit.edu/Epicurus/menoec.html', locator: '死亡与感觉的段落（英译 Robert Drew Hicks）', checked: true, supports: '伊壁鸠鲁将善恶与感觉相连、反对以死亡为害的论证入口。' },
      { id: 'DEA-2', title: 'SEP：Death', kind: '学术综述', url: 'https://plato.stanford.edu/entries/death/', locator: '§3.1–§3.2、导论', checked: true, supports: '伊壁鸠鲁论证、剥夺论、时间与对称性异议。' },
      { id: 'DEA-3', title: 'SEP：The Meaning of Life', kind: '学术综述', url: 'https://plato.stanford.edu/entries/life-meaning/', locator: '§3.2', checked: true, supports: '客观主义与沃尔夫的主观吸引／客观值得混合观点。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '先把问题拆开｜首段', issue: '原文把意义、死亡之害与荒诞并列但未说明它们的逻辑关系。', evidence: 'DEA-2 与 DEA-3 分别讨论不同问题。', revision: '新增问题起点，明确三种问题不能相互替代。' },
      { location: '人物与原典｜伊壁鸠鲁／内格尔', issue: '原卡片容易让读者以为二人只是在表达不同感受。', evidence: 'DEA-2 §3.1–§3.2 展示的是感觉论与比较性损失的论证分歧。', revision: '在定义、反对与回应中呈现前提与对称性难题。' },
    ], remaining: ['尚未核对加缪中文译本及“荒诞”术语的版本差异。'], adjacentImpact: '与“什么是值得过的生活”互链时，应注明意义不等同于幸福或德性。', nextPriority: '补充儒家、佛教和非洲哲学关于死亡与关系的原典阅读路径。' },
  },
  'pt-science-reality': {
    status: '核验正文｜自审完成',
    scope: '本条讨论科学理论的解释成功、真理声称与历史变化；不把“科学”当作单一方法，也不在此裁决某一具体研究的经验真伪。',
    origin: [
      { kind: '概括', text: '科学能预测、干预和统一现象，因而诱发一个形而上学追问：这些成功是否最好由理论所说的不可观察实体和结构大体真实来解释？这就是实在论的“无奇迹”直觉。', sourceIds: ['SCI-1'] },
      { kind: '概括', text: '历史又不断呈现被替换的成功理论。悲观归纳由此质问：过去成功而后来被弃的理论很多，为什么今天的成功足以保证真实？', sourceIds: ['SCI-1', 'SCI-3'] },
    ],
    boundaries: [
      { kind: '解释性重构', text: '预测准确、提供因果机制、给出统一解释、指导干预、在新情境保持稳健，是不同的认识成就；一个模型可以在其中某些方面强而在另一些方面弱。不能把“有用”直接换成“真”。' },
      { kind: '概括', text: '实在论并非必然主张每一个理论词都逐字对应真实对象；回应理论更替的一类策略是只承诺成熟理论中保留下来的结构、实体或解释性部分。', sourceIds: ['SCI-1'] },
    ],
    objections: [
      { kind: '概括', text: '对无奇迹论证的反对不是否认科学成功，而是质疑“真实”是否是唯一最佳解释，以及是否存在当时未被设想的替代理论。实在论者则要求反对者说明预测与干预的成功如何不诉诸某种世界结构。', sourceIds: ['SCI-1'] },
      { kind: '原文入口', text: '库恩讨论“革命”时关注规则、范式和共同体实践的改变；这提示科学史不能只列发现。但从实践有历史性，不能直接推出自然事实由共同体投票决定。', sourceIds: ['SCI-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '“理论是模型”不等于“模型可以任意编造”；模型仍受数据、测量、适用范围和反事实检验约束。' },
      { kind: '解释性重构', text: '可证伪性是重要的划界思路之一，不是所有科学实践的充分定义，也不等于一次失败就必须放弃理论。' },
      { kind: '解释性重构', text: '承认价值、仪器和制度影响研究，并不等于否认证据可纠错或世界会反过来限制解释。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-modern', label: '近代：知识、科学与政治秩序', note: '查看实验、数学化与近代认识论如何共同形成问题。' },
      { nodeId: 'pt-history-tech', label: '历史、文化与技术', note: '把仪器、制度和社会价值放回知识生产，而不把它们当作反科学口号。' },
    ],
    sources: [
      { id: 'SCI-1', title: 'SEP：Scientific Realism', kind: '学术综述', url: 'https://plato.stanford.edu/archives/spr2017/entries/scientific-realism/', locator: '§2.1、§2.2–§2.3', checked: true, supports: '无奇迹论证、悲观归纳与选择性实在论回应。' },
      { id: 'SCI-2', title: 'SEP：Scientific Explanation', kind: '学术综述', url: 'https://plato.stanford.edu/entries/scientific-explanation/', locator: '导论与解释模型各节', checked: true, supports: '解释、预测和机制不是可无差别替换的科学成就。' },
      { id: 'SCI-3', title: 'Thomas S. Kuhn, The Structure of Scientific Revolutions', kind: '原典', url: 'https://www.columbia.edu/cu/tract/projects/complexity-theory/kuhn-the-structure-of-scien.pdf', locator: '§IX–X（在线节选）', checked: true, supports: '科学革命与规则变化的原典入口；不将其外推为相对主义结论。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜历史与实践取向', issue: '原异议可能被读成“社会条件＝事实任意”。', evidence: 'SCI-3 讨论范式转变；SCI-1 的争论仍以经验成功为约束。', revision: '加入不推出相对主义的限制。' },
      { location: '案例推演｜流行病模型', issue: '原案例没有区分预测、解释与干预。', evidence: 'SCI-2 对解释的不同模型显示这些并非同一评价维度。', revision: '将三种成就分开，要求标出适用范围。' },
    ], remaining: ['科学解释条目的章节定位已核对目录，尚未完成其全部原典书目比对。'], adjacentImpact: '与“知识从哪里来”相连时，要把“证据”保留为实践、模型和推理的组合，而非裸数据。', nextPriority: '补充贝叶斯、机制解释与非西方科学史的独立阅读路径。' },
  },
  'pt-environment-animals': {
    status: '核验正文｜自审完成',
    scope: '本条同时处理动物伦理与环境伦理的交界；不把“自然”浪漫化，也不预设个体利益与生态整体必然可用同一尺度排序。',
    origin: [
      { kind: '概括', text: '动物伦理追问能受苦、拥有利益或能行动的个体为何应被直接考虑；环境伦理进一步追问物种、群落、生态系统和未来世代是否也有不能仅用人类利益说明的价值。二者重叠但对象不同。', sourceIds: ['ENV-1', 'ENV-2'] },
      { kind: '原文入口', text: '辛格以平等考虑利益为起点批评仅按物种归属忽视痛苦；这是一条以个体感受和利益为中心的路线，不等于完整的生态整体论。', sourceIds: ['ENV-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '“有道德地位”只说明一个存在者能提出应被考虑的道德要求，并不自动给出具体做法或在冲突中的优先级；还要问它有什么利益、权利或关系，以及如何权衡。', sourceIds: ['ENV-2'] },
      { kind: '概括', text: '动物解放、动物权利和生命中心论大多以个体为关切对象；生态整体论则关注物种、种群与生物共同体。保护脆弱栖息地有时会与减少某些个体痛苦冲突。', sourceIds: ['ENV-1'] },
    ],
    objections: [
      { kind: '概括', text: '感受能力路线的强项是直面痛苦，难题是如何说明植物、物种和生态整体；权利路线能限制“为了总量牺牲个体”，难题是权利门槛和冲突解决；整体路线能说明保护，却须防止把具体动物仅当作生态工具。', sourceIds: ['ENV-1', 'ENV-2'] },
      { kind: '原创例子', text: '一座岛为保护濒危鸟类而计划控制入侵猫。问题不是“爱鸟还是爱猫”，而是：哪类伤害、何种替代方案、谁承担干预后果、以及整体目标能否设下不必要伤害的限制。' },
    ],
    confusions: [
      { kind: '解释性重构', text: '反对物种歧视不是说每个物种或个体在所有情境中应得到同样待遇，而是要求差别待遇给出与利益相关的理由。', sourceIds: ['ENV-3'] },
      { kind: '解释性重构', text: '“内在价值”不是“人类从未使用”；它反对的是价值完全取决于外部用途。' },
      { kind: '解释性重构', text: '地方性、原住民与关系性知识不能被当作给既有西方理论点缀的“案例”，应分别核对其概念与政治语境。' },
    ],
    historicalContext: [
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '环境伦理作为当代学科的形成，与既有功利主义、权利论和土地伦理的张力。' },
      { nodeId: 'pt-history-tech', label: '历史、文化与技术', note: '生态危机与技术、殖民和资源制度问题需在这里继续展开。' },
    ],
    sources: [
      { id: 'ENV-1', title: 'SEP：Environmental Ethics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-environmental/', locator: '导论、§4 的个体／整体讨论', checked: true, supports: '人类中心主义挑战、个体伦理与生态整体的冲突。' },
      { id: 'ENV-2', title: 'SEP：The Moral Status of Animals', kind: '学术综述', url: 'https://plato.stanford.edu/entries/moral-animal/', locator: '§1.5、§2', checked: true, supports: '道德可考虑性、感受能力／行动能力与权衡问题。' },
      { id: 'ENV-3', title: 'Peter Singer, All Animals Are Equal', kind: '原典', url: 'https://digitalcommons.brockport.edu/cgi/viewcontent.cgi?article=1179&context=phil_ex', locator: '1974 年文首的平等考虑论证', checked: true, supports: '以利益与痛苦为中心的动物解放论证入口。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜生态中心与关系伦理', issue: '原文把整体价值写得像能自动压过个体。', evidence: 'ENV-1 明确记录个体动物与生态完整性会冲突。', revision: '增加冲突不是口号可解决、必须交代权衡规则。' },
      { location: '人物与原典｜辛格', issue: '原文把辛格、雷根、利奥波德列在一起但没有显示对象差异。', evidence: 'ENV-1/ENV-2 分别讨论个体与生态整体。', revision: '将三条路线的价值承载者和难题显式列出。' },
    ], remaining: ['原住民哲学的具体材料尚未独立核验，不能在此以泛称代表。'], adjacentImpact: '与“正义”“照护”互链时，须把环境负担的分配与对非人者的直接义务区分开。', nextPriority: '选择一项气候正义与一项土地关系原典，另建不被动物伦理吞没的扩展条目。' },
  },
  'pt-identity-oppression': {
    status: '核验正文｜自审完成',
    scope: '本条讨论身份、权力与知识实践的关系；不把任何群体经验本质化，也不把“身份”误作解释一切的单一变量。',
    origin: [
      { kind: '原文入口', text: '克伦肖在反歧视法与女性主义／反种族主义政治的交叉处提出问题：若制度只识别单一轴线的伤害，处在多重位置的人可能在每个框架里都被边缘化。', sourceIds: ['ID-1'] },
      { kind: '概括', text: '认识不公则追问知识如何被生产和接收：身份偏见会造成不应有的可信度缺口；群体被排除在解释资源的形成之外，会使某些经验难以被理解或表达。', sourceIds: ['ID-2', 'ID-3'] },
    ],
    boundaries: [
      { kind: '解释性重构', text: '身份可以是自我认同、他人分类、法律类别、共同政治行动或历史位置；同一个词指向不同机制。讨论压迫时，必须具体到规则、分工、证言、空间或资源如何造成可追踪的劣势。' },
      { kind: '概括', text: '社会位置可能带来对某些关系的认识优势，也可能受到内化压迫影响；因此“来自边缘”既不是自动无误，也不是可以被多数轻易取消的证言。何时具有优势仍须在具体领域检验。', sourceIds: ['ID-3'] },
    ],
    objections: [
      { kind: '概括', text: '交叉性不等于给人贴越来越多标签。它首先质疑只用单一类别处理制度伤害的框架；若分析不能指出相互作用的机制和可改变的制度，它就会退化为身份清单。', sourceIds: ['ID-1'] },
      { kind: '概括', text: '立场理论面临两项有力担心：把群体经验写成统一声音，以及忽略内化压迫。回应不是放弃位置问题，而是把认识优势视为需经共同研究、批评和具体证据检验的可能性。', sourceIds: ['ID-3'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '证言不公不是“不同意某人”本身，而是因身份偏见给出低于证据所应得的可信度。', sourceIds: ['ID-2'] },
      { kind: '解释性重构', text: '解释资源不足不等于某个个体词汇量不够；它是群体参与意义生产被结构性限制的问题。', sourceIds: ['ID-2', 'ID-3'] },
      { kind: '解释性重构', text: '反本质主义不是否认群体能组织行动；它要求说明在不假定固定本性的条件下，团结与责任如何形成。' },
    ],
    historicalContext: [
      { nodeId: 'pt-africana-race', label: '种族、殖民与解放', note: '将身份与殖民历史、种族化和解放思想并读。' },
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '把女性主义与社会认识论放回其论争史，而非当作一套统一观点。' },
    ],
    sources: [
      { id: 'ID-1', title: 'Kimberlé Crenshaw, Demarginalizing the Intersection of Race and Sex', kind: '原典', url: 'https://chicagounbound.uchicago.edu/uclf/vol1989/iss1/8/', locator: '1989 年《University of Chicago Legal Forum》Article 8', checked: true, supports: '交叉性在反歧视法、女性主义与反种族主义政治中的问题起点。' },
      { id: 'ID-2', title: 'Miranda Fricker, Epistemic Injustice', kind: '原典', url: 'https://academic.oup.com/book/32817', locator: '导论；第 1、7 章书目说明', checked: true, supports: '证言不公与解释不公的原始区分及其术语范围。' },
      { id: 'ID-3', title: 'SEP：Feminist Social Epistemology', kind: '学术综述', url: 'https://plato.stanford.edu/entries/feminist-social-epistemology/', locator: '§3、§4.1', checked: true, supports: '立场理论的争议、社会位置的条件性与认识不公的讨论。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜交叉性取向', issue: '原文把交叉性写成多个维度的简单相加。', evidence: 'ID-1 的问题是单轴制度框架造成的边缘化。', revision: '改为要求交代相互作用的制度机制。' },
      { location: '概念｜受压迫经验', issue: '原文可能暗示经验天然拥有无误认识权威。', evidence: 'ID-3 §3 讨论内化压迫与立场理论的局限。', revision: '补入条件性、领域性和共同检验。' },
    ], remaining: ['残障哲学和非殖民传统的原典尚未逐篇核验，不能用本条替代。'], adjacentImpact: '与“知识从哪里来”“正义”互链时，应把认知伤害与资源／权利分配分别说明，再讨论交集。', nextPriority: '建立残障正义与殖民性知识生产的独立历史条目及来源账。' },
  },
  'pt-mind-self': {
    status: '核验正文｜自审完成',
    scope: '本条比较心灵的本体论、人格跨时间的同一性与无我分析；不把临床诊断、法律身份或宗教实践当作同一个问题的现成答案。',
    origin: [
      { kind: '概括', text: '心灵问题从主观体验、思考与身体活动的关系产生；人格同一性则问人何时跨时间持续存在。两类问题常共用“自我”一词，却不必有同一答案。', sourceIds: ['MS-1', 'MS-2'] },
      { kind: '概括', text: '印度佛教的无我分析并不把心灵简单删去，而是反对把心理和身体过程误认成一个独立、恒常的主宰。', sourceIds: ['MS-3'] },
    ],
    boundaries: [
      { kind: '概括', text: '个人同一性、作为道德行动者的身份、作为活物的连续性和对自身的心理依恋是不同概念；“self”本身也可能指人格或不可变意识主体。', sourceIds: ['MS-2'] },
      { kind: '解释性重构', text: '神经对应证实心理活动与身体深度相关，却没有单独决定应选择同一论、还原论还是功能主义；哲学问题在于何种解释算足够。' },
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
      { id: 'MS-1', title: 'SEP：Dualism', kind: '学术综述', url: 'https://plato.stanford.edu/entries/dualism/', locator: '§2 及心身问题各节', checked: true, supports: '二元论的历史范围、不同传统与交互难题。' },
      { id: 'MS-2', title: 'SEP：Personal Identity', kind: '学术综述', url: 'https://plato.stanford.edu/entries/identity-personal/', locator: '导论与同一性问题各节', checked: true, supports: '人格同一性不是单一问题，以及 self 一词的歧义。' },
      { id: 'MS-3', title: 'SEP：Mind in Indian Buddhist Philosophy', kind: '学术综述', url: 'https://plato.stanford.edu/archives/spr2017/entries/mind-indian-buddhism/', locator: '导论、§1.1、§5.6', checked: true, supports: '无我、心理—身体过程和解释分歧。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜无我或非实体自我', issue: '原文可能被读成“佛教否认人格和责任”。', evidence: 'MS-3 区分对恒常自我的批判与心理—因果过程。', revision: '明确无我不是虚无论，并给出连续性难题。' },
      { location: '人物与文本', issue: '原内容只有人物名单，缺少文本各自在争论中解决什么。', evidence: 'MS-1、MS-2、MS-3 的问题范围不同。', revision: '新增四个原典入口与各自的阅读问题。' },
    ], remaining: ['尚未完成《相应部》与阿毗达磨中文译本的版本校勘。'], adjacentImpact: '“自由与责任”不得把人格同一性的一个理论当作其唯一前提；“佛教哲学”需保留学派差异。', nextPriority: '补写“存在与变化”及佛教历史条目的同级来源账。' },
  },
  'pt-ai-future': {
    status: '核验正文｜自审完成',
    scope: '本条区分心灵哲学、道德地位与部署责任；不把现有系统直接诊断为有意识，也不把治理建议伪装成关于机器心灵的证明。',
    origin: [
      { kind: '原文入口', text: '图灵没有先给“思维”下一个终极定义，而以模仿游戏替换问题，考察机器能否在文字交互中完成某种可观察的表现。这个转向提供评价线索，却不自动规定智能、理解或意识的充分条件。', sourceIds: ['AI-1', 'AI-3'] },
      { kind: '概括', text: '当系统参与医疗、招聘、司法或平台分配时，问题又从“它有没有心灵”延伸到“谁应预测、解释、停止和赔偿伤害”。这两类问题相互影响，却不能互相代替。', sourceIds: ['AI-4', 'AI-5'] },
    ],
    boundaries: [
      { kind: '概括', text: '中文房间论证针对的是“仅运行适当程序就有理解”的强人工智能主张：按语法操纵符号、表现得像懂中文，与真正理解之间是否有缺口。它不等于证明任何机器都不能思考，也不等于只要会对话就已有意识。', sourceIds: ['AI-2'] },
      { kind: '概括', text: '道德患者是我们对其负有直接义务的对象；道德行动者则要满足知识、控制、按理由行动等更强条件。法律人格、因果影响与道德责任也必须分别讨论。', sourceIds: ['AI-4'] },
    ],
    objections: [
      { kind: '概括', text: '对中文房间的“系统回应”指出：房内的人不懂，不表示由人、规则、记忆和输入组成的整体不懂；“他心回应”则追问，我们归因他人理解同样主要凭行为。塞尔的反驳与这些回应的分歧，正落在理解的承担者是谁、什么证据足够。', sourceIds: ['AI-2'] },
      { kind: '概括', text: '把当前系统叫作“行动者”可以是技术上的薄意义——它造成或调节后果；这不等于它是可责备的道德行动者。部署责任不能因系统复杂就被机构分散到无人承担。', sourceIds: ['AI-4', 'AI-5'] },
    ],
    confusions: [
      { kind: '解释性重构', text: '任务能力、语言理解、主观体验、道德地位、法律责任是五个不同问题；任一项的肯定都不自动推出其余四项。' },
      { kind: '解释性重构', text: '“拟人化”不是机器有人的证据；它首先是会改变使用者信任、依赖和责任判断的界面事实。' },
      { kind: '解释性重构', text: '风险管理不是心灵哲学的答案；它处理的是在不确定状态下谁应记录、监督、申诉和停止系统。', sourceIds: ['AI-5'] },
    ],
    historicalContext: [
      { nodeId: 'pt-western-contemporary', label: '19世纪至当代的多条线索', note: '从计算、心灵哲学与社会技术批评的交叉读起。' },
      { nodeId: 'pt-history-tech', label: '历史、文化与技术', note: '把自动化放进劳动、制度、媒介和共同生活的历史问题。' },
    ],
    sources: [
      { id: 'AI-1', title: 'Alan M. Turing, Computing Machinery and Intelligence', kind: '原典', url: 'https://www.cs.sfu.ca/~vaughan/teaching/889/papers/turing1950.html', locator: '§1、§6', checked: true, supports: '以模仿游戏替换原问题，以及图灵自己列出的反对意见。' },
      { id: 'AI-2', title: 'SEP：The Chinese Room Argument', kind: '学术综述', url: 'https://plato.stanford.edu/entries/chinese-room/', locator: '§3、§4.1–§4.4、§5', checked: true, supports: '强／弱 AI 的范围、论证重构与系统／他心回应。' },
      { id: 'AI-3', title: 'SEP：The Turing Test', kind: '学术综述', url: 'https://plato.stanford.edu/entries/turing-test/', locator: '§1、§4、§6', checked: true, supports: '测试是必要、充分还是可撤销的归因证据这一争论。' },
      { id: 'AI-4', title: 'SEP：Ethics of Artificial Intelligence and Robotics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/ethics-ai/', locator: '§2.7.1–§2.7.3', checked: true, supports: '道德患者、厚／薄行动者、法律人格与机器伦理的区分。' },
      { id: 'AI-5', title: 'NIST AI RMF 1.0 Core', kind: '制度文件', url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/', locator: '§5.1–§5.4，尤其 GOVERN 2、MAP 3、MANAGE 4', checked: true, supports: '部署中角色、记录、监督、申诉、停止与持续治理的可操作要求。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '主要立场｜功能与行为标准', issue: '原文把图灵式表现标准写成理解的充分证明。', evidence: 'AI-1 只是替换问题；AI-3 §4 区分充分、必要和可撤销的归因条件。', revision: '改为“评价线索／证据问题”，不从对话表现直接推出意识。' },
      { location: '案例推演｜医疗系统', issue: '原文只列可能负责者，没有责任如何落实的准则。', evidence: 'AI-5 对角色、文档、监督、申诉和停用给出生命周期要求。', revision: '将案例问题改为控制、知情、补救与可追踪制度责任。' },
    ], remaining: ['机器意识的经验指标与非西方技术哲学尚未进入本条；不能由现有论证断言任何现存模型有或无感受。'], adjacentImpact: '与“心灵、身体与我”互链时，必须区分行为归因与意识本体论；与“责任”互链时，必须区分归责、赔偿与风险治理。', nextPriority: '补充技术哲学、数据劳动与东亚思想资源；另建 AI 治理的时效性法规页并定期核验。' },
  },
};

export function getCoreEntryLedger(nodeId: string): CoreEntryLedger | undefined {
  return coreEntryLedgers[nodeId];
}
