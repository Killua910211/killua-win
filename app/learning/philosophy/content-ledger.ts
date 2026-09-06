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
    scope: '本条比较“什么存在”“一个东西如何在变化中仍是它自己”“何为基本存在者”三组问题；不把日常分类、物理学模型与形而上学本体论混作彼此的直接结论。',
    origin: [
      { kind: '概括', text: '我们既说河流在流动、身体在代谢，又说“还是同一条河”“还是同一个人”。变化似乎要求前后不同，同一性似乎要求同一；如何同时成立，促成了持续、部分与整体、属性与实体的形而上学分析。', sourceIds: ['BEC-1'] },
      { kind: '解释性重构', text: '问题还会在“何者算最基本”处出现：桌子、生命体、事件、性质、关系或过程，是否都以同一方式存在？此处的“基本”不是指日常更重要，而是问其他事物在解释上依赖什么。' },
    ],
    boundaries: [
      { kind: '概括', text: '数值同一性问甲是否就是乙；质的相似只问两者像不像。忒修斯之船的困难在于：逐块替换后的船与由旧料重组的船，谁同原船数值同一？', sourceIds: ['BEC-2'] },
      { kind: '概括', text: '“空”在龙树语境中不是说一切都不存在，而是拒绝把事物理解为具有独立、不依条件的自性；缘起与空性须一起读。它不能直接替换为西方“没有实体”的任一理论。', sourceIds: ['BEC-3'] },
    ],
    objections: [
      { kind: '概括', text: '把持续物理解为“在每一时刻完整存在”的立场，要解释一个完全存在的物体怎样拥有不同时刻的相反性质；把它理解为由时间部分组成的立场，则要解释我们为何经验为同一对象，以及阶段与整体怎样构成关系。两种方案各有代价，不能由“常识”一语裁决。', sourceIds: ['BEC-1'] },
      { kind: '概括', text: '对自性批判的一项反对是：若任何东西都无自性，因果、语言和解脱似乎也无从成立。中观回应通常不是另立隐藏实体，而是在二谛或约定层次上说明依条件的因果和言说如何仍可运作；不同中观解释并不一致。', sourceIds: ['BEC-3'] },
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
      { id: 'BEC-1', title: 'SEP：Metaphysics', kind: '学术综述', url: 'https://plato.stanford.edu/entries/metaphysics/', locator: '导论、持续与部分相关章节', checked: true, supports: '形而上学中存在、基本性与持续问题的范围。' },
      { id: 'BEC-2', title: 'SEP：Identity Over Time', kind: '学术综述', url: 'https://plato.stanford.edu/entries/identity-time/', locator: '导论、§1–§3', checked: true, supports: '数值同一性、质的相似和持续理论的基本分歧。' },
      { id: 'BEC-3', title: 'SEP：Nāgārjuna', kind: '学术综述', url: 'https://plato.stanford.edu/entries/nagarjuna/', locator: '导论、§2–§3', checked: true, supports: '自性、缘起、空性与虚无论误读的区分。' },
    ],
    review: { mode: '自审（尚未独立复审）', checkedOn: '2026-09-07', findings: [
      { location: '案例推演｜忒修斯之船', issue: '原内容把案例写成可凭直觉选出唯一答案的谜题。', evidence: 'BEC-2 将替换、重组和持续理论分别展开。', revision: '改为区分数值同一性、相似和不同理论的代价。' },
      { location: '跨传统连接｜空性', issue: '原文易把空性译为“万物虚幻”。', evidence: 'BEC-3 将自性批判与缘起、二谛问题相连。', revision: '加入自性边界及对虚无论异议的回应。' },
    ], remaining: ['尚未逐段校勘《中论》中文译本与二谛术语；相关原典只作为后续精读任务。'], adjacentImpact: '与“心灵、身体与我”互链时，不能把人格同一性的答案预设成一般对象持续的唯一答案。', nextPriority: '为古典与佛教历史页补入原典版本、传承与解释史。' },
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
