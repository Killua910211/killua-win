import type { LedgerSource } from './content-ledger';
import { getNodeById } from './tree';

/**
 * 跨条目复用的概念层。
 *
 * 同一个概念会在很多页出现。如果每页各写各的定义，读者会在第三页发现自己
 * 学到的是三个互相矛盾的「决定论」。这里放一份定义，各页引用它。
 *
 * 收录标准很窄，只收同时满足三条的概念：
 *   1. 真的跨条目复用（至少在两页里承担解释工作）；
 *   2. 理解错误会影响后续学习；
 *   3. 有一个稳定到值得写死的一句话定义。
 * 只在一页出现的专业名词不进来——把每个名词都变成可展开的链接只会制造噪音。
 *
 * 同形异义按两条概念处理，不合并：认知正当性与政治正当性共用一个中文词，却是
 * 两个不相干的问题；「人格」在持续条件与共同体中的道德地位两种用法下也是两个
 * 问题。合并它们会让读者以为自己在学同一件事。
 */

export type ConceptDistinction = {
  /** 最容易被读者当成同一件事的那个概念。 */
  from: string;
  /** 它们的差别在哪里。一句话，要能直接用来纠错。 */
  note: string;
};

export type Concept = {
  id: string;
  term: string;
  /** 英文或原文（梵、巴利、阿拉伯、古汉语等）。没有稳定对应就留空，不硬凑。 */
  original?: string;
  /** 一句话定义。这是全站唯一版本，改这里等于改所有引用它的页面。 */
  short: string;
  /** 需要多说两句时的补充；没有就不写，不为了字数扩写。 */
  detail?: string;
  distinctions: ConceptDistinction[];
  /** 相关概念，用 concept id。 */
  seeAlso?: string[];
  /** 在哪些条目里被实际讨论。用于「想继续读，去哪一页」。 */
  nodeIds: string[];
  /** 定义所依据的来源。没有实际核对过的来源不要写进来。 */
  sources: LedgerSource[];
};

export const concepts: Concept[] = [
  {
    id: 'determinism',
    term: '决定论',
    original: 'causal determinism',
    short: '在过去的全部事实与自然规律给定时，未来只有一种可能的展开。',
    detail:
      '这是一个关于世界结构的命题，不是关于我们能算出什么的命题。决定论的世界可以完全无法预测：初始条件测不准，混沌会把微小误差放大到不可用；反过来，含有随机环节的世界也可以在统计上高度可预测。哲学史上最常见的两种混淆，就是把它与可预测性混为一谈，或者把它读成宿命论。',
    distinctions: [
      {
        from: '宿命论',
        note: '说的是无论你做什么，某些事都照样发生；决定论只说结果由前因固定，而你的选择本身就在这些前因之内。从决定论走到宿命论需要另加论证。',
      },
      {
        from: '可预测性',
        note: '是认知能力的问题——谁能测量、能算多久；决定论问的是世界是否只有一条路。二者可以各自成立或不成立。',
      },
      {
        from: '因果性',
        note: '承认某些事有原因，不等于承认每一个事件都被过去与规律完整固定；后者才是决定论要求的强度。',
      },
    ],
    seeAlso: ['fatalism', 'technological-determinism', 'basic-desert', 'personal-autonomy'],
    nodeIds: ['pt-freedom', 'pt-responsibility', 'pt-history-tech'],
    sources: [
      {
        id: 'CPT-DET-1',
        title: 'Causal Determinism（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/determinism-causal/',
        locator: '§1 Introduction，区分 determinism 与 predictability、fate 的段落',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节明言哲学史上一直有把 determinism 与 predictability、fate 两个相关观念混同的倾向，并说明 fatalism 是「不论我们做什么，事件都注定发生」，以及预测与决定论如何被拉普拉斯式的表述缠在一起。',
      },
    ],
  },
  {
    id: 'fatalism',
    term: '宿命论',
    original: 'fatalism',
    short: '我们对将要发生的事无能为力：不论怎样行动，都不可能做出与实际所为不同的事。',
    detail:
      '哲学讨论里它的论证通常不走物理因果，而走逻辑或神学：未来命题现在已有真值，或全知者早已知道结果。因果决定论只是通向它的三条路线之一，不是同一个主张。中文「宿命」在日常语言里还常指一种认命的情绪，这与上面那个可被论证也可被反驳的命题是两件事。',
    distinctions: [
      {
        from: '决定论',
        note: '只主张未来由前因固定，而选择在前因之内；宿命论主张选择改不了结局。混用二者会让「反正都定了」冒充结论。',
      },
      {
        from: '认命的态度',
        note: '是面对未来的一种心情；宿命论是一个有前提、有反驳的命题，判断它对不对要看论证而不是看语气。',
      },
    ],
    seeAlso: ['determinism', 'technological-determinism'],
    nodeIds: ['pt-freedom', 'pt-responsibility', 'pt-history-tech'],
    sources: [
      {
        id: 'CPT-FAT-1',
        title: 'Fatalism（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/fatalism/',
        locator: '开篇导言段（"Though the word ... powerless to do anything other than what we actually do"）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该段区分日常用法（面对不可避免之事的认命态度）与哲学用法（我们无力做出与实际所为不同的事），并列出三条论证路线：逻辑与形而上学必然性、神的存在与性质、因果决定论。',
      },
    ],
  },
  {
    id: 'technological-determinism',
    term: '技术决定论',
    original: 'technological determinism',
    short: '把技术当作自足、自行发展且不可逆转的现象，社会变化因此主要由技术自身决定。',
    detail:
      '二十世纪的技术伦理多半是在离开这个假设之后展开的：它转而强调技术的发展是人的选择造成的结果，尽管未必是任何人原本打算的结果。这样说并不等于技术无关紧要，而是要求把设计、劳动、资本、制度与使用实践都写进解释。',
    distinctions: [
      {
        from: '决定论（因果决定论）',
        note: '问的是全部事件是否被过去与规律固定；技术决定论只问社会变化的主导原因是什么。二者互不蕴含。',
      },
      {
        from: '工具中立论',
        note: '主张技术只是中性工具、好坏取决于使用者。它与技术决定论方向相反：一个说技术自行推动社会变化，一个说技术本身什么也不决定，两者不能同时成立——先说「技术改变了一切」、再说「技术只是工具，看人怎么用」，等于前后各站一边。二十世纪的技术哲学对两者都提出了批评：一条走向是不再把技术发展看作自主过程，而看作人的选择造成的结果；中立论题也在同一时期受到批评。',
      },
      {
        from: '「技术无关紧要」',
        note: '否认技术自行决定历史，不等于认为技术不重塑能力、注意、风险与权力的分配。',
      },
    ],
    seeAlso: ['determinism', 'fatalism', 'responsibility-faces'],
    nodeIds: ['pt-history-tech', 'pt-ai-future'],
    sources: [
      {
        id: 'CPT-TEC-1',
        title: 'Philosophy of Technology（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/technology/',
        locator: '§3.1 Ethics of Technology，论述二十世纪技术伦理两条走向的段落',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节把 technological determinism 定义为「技术是一个自足现象、自主且不可逆地发展」这一假设，并说明技术伦理的一条走向是离开它、转向把技术发展看作人的选择的结果（未必是所欲的结果）；同节也指出工具观导出的中立论题在二十世纪受到批评。',
      },
    ],
  },
  {
    id: 'epistemic-justification',
    term: '认知正当性（信念的理由）',
    original: 'epistemic justification',
    short: '一个信念在认识上被恰当支持的状态：不是碰巧这样相信，而是有理由这样相信。',
    detail:
      '它与政治哲学里的「正当性」共用一个中文译名，问的却是两件不相干的事，本库因此把两者分列。英文 justification 的日常义是「已经为它作过辩护」，但认识论上的这个条件并不要求持信念的人事先给出过一套辩护；它问的是这个信念在它所处的情形里是否被恰当支持。它通常被列为知识的三个条件之一（信念为真、当事人相信它、这个信念有正当性），但三条合起来是否已经够用，正是盖梯尔问题要追问的——所以不能反过来把「有正当性」直接定义成「够得上知识」。至于「恰当支持」要不要落在当事人这一侧，则是内在论与外在论的分歧：内在论主张它取决于当事人的心理状态，或取决于他一经反思就能知道的条件；外在论否认这一点。',
    distinctions: [
      {
        from: '政治正当性',
        note: '问的是权力与制度凭什么可以强制、可以要求服从，与一个信念有没有理由不是同一个问题。',
      },
      {
        from: '主观确信',
        note: '一个人有多大把握是心理事实；信念是否被理由支持是另一回事，两者可以完全脱节。',
      },
      {
        from: '为真',
        note: '有理由的信念可以是假的，碰巧为真的信念也可以毫无理由。把二者绑在一起，就看不出盖梯尔问题难在哪里。',
      },
      {
        from: '「已经作过辩护」',
        note: '这个条件不要求当事人先完成一次论证；按日常语感读会把绝大多数知觉知识排除在外。',
      },
    ],
    seeAlso: ['political-legitimacy', 'epistemic-luck', 'testimony', 'pramana'],
    nodeIds: ['pt-knowledge-sources', 'pt-logic', 'pt-identity-oppression'],
    sources: [
      {
        id: 'CPT-JUS-1',
        title: 'The Analysis of Knowledge（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/knowledge-analysis/',
        locator:
          '§1.3 The "Justification" Condition，含 §1.3.1 The "Justification" Label 与 §1.3.2 Internalism and Externalism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1.3.1 明确指出 justification 这个标签是二十世纪才通行的叫法，容易误导：按日常义「被辩护」意味着已经完成一次成功的辩护工作，而主张知识有正当性条件的认识论者通常不作此解。§1.3.2 是内在论／外在论之分的出处。',
      },
    ],
  },
  {
    id: 'political-legitimacy',
    term: '政治正当性',
    original: 'political legitimacy',
    short: '一个政治权威凭什么有权统治——它的强制与命令能否被正当化，而不只是事实上被接受或被写进法律。',
    detail:
      '一个词遮住了至少三个问题：人们事实上是否信从这个秩序（韦伯意义上的描述性问题）；强制性权力是否可被正当化；以及公民是否因此负有服从义务。它们的答案彼此不决定——有立场认为权威正当而服从义务仍未成立。中文译名要统一：本库一律写「正当性」，不写「合法性」。',
    distinctions: [
      {
        from: '合法性（符合法律）',
        note: '中文「合法」字面就是合于现行法律；而一个政权是否有权立这条法，正是这里要问的。译成「合法性」会把待证的结论塞进问题里。',
      },
      {
        from: '认知正当性',
        note: '那是一个信念有何理由的问题，与统治的资格无关。两者在中文里同形，在英文里也不是同一个词的同一用法。',
      },
      {
        from: '有效统治',
        note: '稳定、被服从、能执行命令的权力是事实上的（de facto）权威；它可以完全不具备统治的权利。',
      },
      {
        from: '服从义务',
        note: '「这个政权正当」与「我因此必须守法」是两个判断；有立场认为前者成立而后者仍需另作论证。',
      },
    ],
    seeAlso: ['epistemic-justification', 'basic-desert'],
    nodeIds: ['pt-legitimacy', 'pt-law', 'pt-justice'],
    sources: [
      {
        id: 'CPT-LEG-1',
        title: 'Political Legitimacy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/legitimacy/',
        locator:
          '§1 Descriptive and Normative Concepts of Political Legitimacy；§2.1 Legitimacy and the Justification of Political Authority；§2.3 Political Legitimacy and Political Obligations',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1 以韦伯的三种正当性来源（传统、卡里斯玛、对法律理性的信赖）说明描述性概念，并与规范性概念对照。§2.1 明说政治体可以是有效的、事实上的（de facto）权威而不正当，正当权威与之区别在于真正拥有统治的权利。§2.3 记录了「即使权威正当也未必产生政治义务」的立场。',
      },
    ],
  },
  {
    id: 'personal-autonomy',
    term: '自主（个人自主）',
    original: 'personal autonomy',
    short: '一个人对自己生活的某个范围拥有决定权：在这个范围里，除非经她授权，任何对她的支配都不算正当。',
    detail:
      '至于什么使一个决定真的算「她自己作出的」，各家说明并不一致。有一路说明（综述归为融贯论一路）要求行动出于与她自己的立场相协调的动机，而「她自己的立场」由什么构成，这一路内部又有分歧：有的用高阶欲望（我希望哪一个欲望推动我行动），有的用评价判断（哪些行动最值得做），还有的要求两者之间也协调。它们的共同点是：仅仅有一个当下最强的欲望，还不足以让行动成为自主的。这个词在政治语境里指一个群体自我治理，与个人对自己生活的权威只是类比。',
    distinctions: [
      {
        from: '随机或无因的选择',
        note: '自主要求动机与我的立场一致；随机插进来的动机反而更不像是我的，不会让行动更自主。',
      },
      {
        from: '关系自主',
        note: '不是这个概念的反面，而是对同一能力提出的另一种说明，争点在条件应放在个体内部还是也放在关系里。',
      },
      {
        from: '自足',
        note: '能自行决定不等于不依赖他人；把自主读成不需要任何人，会直接抹掉照护与依赖的问题。',
      },
      {
        from: '民族自治',
        note: '同一个词的政治用法，指一个群体有权自我治理；与个人自主是类比，不能互相推论。',
      },
    ],
    seeAlso: ['relational-autonomy', 'determinism', 'personhood-community'],
    nodeIds: ['pt-freedom', 'pt-good-life', 'pt-care', 'pt-ai-future'],
    sources: [
      {
        id: 'CPT-AUT-1',
        title: 'Personal Autonomy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/personal-autonomy/',
        locator: '§1 Introduction；§2 Four More or Less Overlapping Accounts of Personal Autonomy',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1 以群体要求自治与个人对自己某一生活领域的权威作类比，说明自主主张的是「除我授权外，任何对该活动的权力行使都不正当」。§2 列出 coherentist 一类说明：行动出于与某个代表她观点的心理状态相协调的动机，其中一种以高阶欲望构成她的观点（Frankfurt），另一种以评价判断构成（Watson），还有说明要求两者之间也协调。',
      },
    ],
  },
  {
    id: 'relational-autonomy',
    term: '关系自主',
    original: 'relational autonomy',
    short: '自主能力本身由社会关系、承认与可得资源塑造，因此判断一个选择是否自主不能只看当事人内部的动机结构。',
    detail:
      '推动它的是女性主义哲学整理出的一批难例：自我抑制、在压迫条件下形成的适应性偏好、以及把压迫内化的实践。这些案例是否算自主受损，理论之间并无共识——一种回应是采用「薄」的最低条件说明，只要人没有陷入疼痛、恐惧、焦虑、抑郁一类障碍，其偏好就算她自己的；另一些则提出程序性、规范能力、对话或实质性与社会—关系性的更强条件。选哪一边都要付代价：条件太薄，压迫下形成的偏好一律算自主；条件太强，理论会替当事人决定什么才算她真正想要的。',
    distinctions: [
      {
        from: '个人自主',
        note: '关系自主不否认自我治理，它质疑的是把全部条件都放进个体内部的做法。',
      },
      {
        from: '「受关系影响就不自主」',
        note: '若凡被关系塑造的选择都不算自主，就没有选择算自主；难处恰在区分哪些塑造是支持性的、哪些是损害性的。',
      },
      {
        from: '依赖',
        note: '需要他人照护是处境，不是自主的丧失；把二者等同会使被照护者自动失去决定权。',
      },
    ],
    seeAlso: ['personal-autonomy', 'personhood-community'],
    nodeIds: ['pt-care', 'pt-identity-oppression', 'pt-freedom'],
    sources: [
      {
        id: 'CPT-REL-1',
        title: 'Feminist Perspectives on Autonomy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/feminism-autonomy/',
        locator: '§2 Feminist "Hard Cases"（2.1 自我抑制、2.2 适应性偏好、2.3 压迫实践）；§3 Relational Autonomy',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§3 开头即指出理论家之间对这些难例是否属于自主受损存在分歧，并把「薄」／最低条件说明（引 Buss 2005：关键在健康的人与受某种身心「病苦」影响的人之别）作为一种解决方式提出，随后依次给出程序性、规范能力、情感与自我态度、对话，以及强实质性与社会—关系性等构想。',
      },
    ],
  },
  {
    id: 'personal-identity',
    term: '人格同一性',
    original: 'personal identity',
    short: '在什么条件下，将来或过去的某个人就是现在的这一个人。',
    detail:
      '「人格同一性」这个名目下不是一个问题，而是一组彼此松散相连、且常不被分开的问题。哲学之外，它常指那些「使我成为我这种人」的特征，也就是刻画问题；哲学讨论多数针对持续问题。两者的答案互不决定：弄清了什么使我成为这种人，并没有回答未来那个人凭什么还是我。',
    distinctions: [
      {
        from: '身份认同（性别、族群、国族）',
        note: '指一个人被归入哪些群体、以什么自我理解生活；与持续条件是不同问题，SEP 明确把它与人格同一性对照。',
      },
      {
        from: '共同体中的人格',
        note: '非洲伦理学讨论的 personhood 问的是一个人在共同体中取得什么样的道德地位，不是跨时间的持续条件。',
      },
      {
        from: '自我感',
        note: '觉得自己还是同一个人是心理事实，不是同一性的判准；失忆与错误记忆的案例正是靠这一区分才问得清楚。',
      },
    ],
    seeAlso: ['personhood-community', 'pratityasamutpada'],
    nodeIds: ['pt-mind-self', 'pt-being-change', 'pt-buddhist', 'pt-ai-future'],
    sources: [
      {
        id: 'CPT-PID-1',
        title: 'Personal Identity（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/identity-personal/',
        locator: '§1 The Problems of Personal Identity（Characterization 与 Persistence 的区分）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节开篇即说没有单一的人格同一性问题，而是一组至多松散相连、且并非总被分开的问题；并把日常义（那些「定义我这个人」的特征、身份危机）标为 Characterization 问题，指出它与性别、族群、国族身份对照，与持续问题不同。',
      },
    ],
  },
  {
    id: 'personhood-community',
    term: '人格（共同体中的道德地位）',
    original: 'moral personhood',
    short: '一批非洲伦理学论述在「是不是生物学意义上的人类」之外另立一问：一个人在共同体中算不算一个「人」。这是一种道德地位，而它是与生俱来还是要靠达成，正是争论所在。',
    detail:
      '最常被引用的是门基蒂的表述：传统非洲的各个社会通常接受人格必须被获得，且其获得程度与一个人通过履行其位置所规定的各项义务而参与共同生活的程度成正比——从幼年那种缺乏道德功能的「它」的地位，转为后来那种具备成熟伦理感的「人」的地位。这是其中一家的主张，不是整个传统的共识：把人格说成有程度的成就，会被追问它是否削弱了每个人不可取消的地位、能否与个人权利和批判能力相容；本库《人格、共同体与 Ubuntu》一页记录了反对这种渐进说法的立场。',
    distinctions: [
      {
        from: '人格同一性',
        note: '问的是同一个人跨时间的持续条件；这里问的是一个人在道德上取得了什么地位。两页从来不在回答同一个问题。',
      },
      {
        from: '「集体高于个人」的标签',
        note: '说人格在关系中达成，不等于说共同体可以取消个人，也不等于任何一种现成的西方共同体主义。',
      },
      {
        from: 'Ubuntu 作为口号',
        note: '把「因他人而成为人」当作已经成立的结论，会跳过它究竟主张什么、由谁主张、遭到哪些反对。',
      },
    ],
    seeAlso: ['personal-identity', 'relational-autonomy', 'personal-autonomy'],
    nodeIds: ['pt-african-personhood', 'pt-african-method', 'pt-care'],
    sources: [
      {
        id: 'CPT-PER-1',
        title: 'African Ethics（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/african-ethics/',
        locator: '§4 Moral Personhood，开篇所引 Ifeanyi Menkiti（1984: 176）一段及随后的分析',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节以门基蒂的原话开篇：人格是必须被获得的东西，其获得程度与一个人通过履行其位置所规定的义务而参与共同生活的程度成正比，并把这一过程描述为从幼年「它」的地位转为具备成熟伦理感的「人」的地位。',
      },
    ],
  },
  {
    id: 'scientific-realism',
    term: '科学实在论',
    original: 'scientific realism',
    short: '我们最好的科学理论对世界的描述大致为真，它所设定的东西也确实存在——包括电子、场这类无法直接观察的设定。',
    detail:
      '「实在论」本身只是「主张某类东西真实存在」的通名：可以对感觉材料、对桌椅、对数与集合分别做实在论者。科学实在论是其中一种，争点在于把承诺推进到电子、场、基因这类不可观察的理论设定。它的承诺可分三个方向：形而上学上有一个不依赖心灵的实在、语义上按字面读理论、认识上把理论当作关于可观察者与不可观察者的知识；反实在论只需在其中一个方向上反对。',
    distinctions: [
      {
        from: '常识',
        note: '相信桌椅存在是对外部世界的实在论；反实在论中最重要的一支是经验主义，它反对的是关于不可观察者的知识，而不是桌椅。',
      },
      {
        from: '佛教语境中的「实在」',
        note: '中观论辩里被否定的是自性——独立自立、不依赖他者的本性，与科学理论的真值不是同一个争点。',
      },
      {
        from: '关于种族的实在论',
        note: '那里问一个社会分类范畴指称什么样的东西，与不可观察的理论设定是不同问题。',
      },
    ],
    seeAlso: ['pratityasamutpada', 'race-ontology', 'relativism'],
    nodeIds: ['pt-science-reality', 'pt-being-change'],
    sources: [
      {
        id: 'CPT-SR-1',
        title: 'Scientific Realism（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/scientific-realism/',
        locator: '§1.2 The Three Dimensions of Realist Commitment；§4.1 Empiricism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1.2 说明「实在论」泛指任何主张某物真实存在的立场（感觉材料实在论、外部世界实在论、数学实在论等），科学实在论是关于最好科学理论所描述之物的实在论，并列出形而上学、语义、认识三个承诺方向。§4.1 说明反实在论只需在这三个方向之一上反对，而历史上最重要的反实在论支脉是各种经验主义，其反对的正是关于不可观察者的知识。',
      },
    ],
  },
  {
    id: 'race-ontology',
    term: '种族范畴的实在性',
    original: 'the ontological status of race',
    short: '争论的不是有没有人被当作某个种族，而是「种族」这个词指称什么样的东西——如果它指称任何东西的话。',
    detail:
      '已经被放弃的一种主张是种族自然主义：把种族看作可遗传的生物—行为本质，既为一个种族的全体成员所共有、又能解释其行为与文化倾向。哲学家与科学家在反对它上已形成共识，分歧从这里才开始：种族怀疑论认为既然生物本质不存在，任何意义上的种族都不存在；另一些立场主张种族是被建构出来的实在类别，或可用人群遗传学重新界定。与本体问题并列的还有规范问题——应当取消这个范畴，还是保留它。',
    distinctions: [
      {
        from: '科学实在论',
        note: '那里问不可观察的理论设定是否为真，这里问一个社会分类范畴的所指；共用「实在论」三个字并不共用问题。',
      },
      {
        from: '「社会建构因此不真实」',
        note: '建构论恰恰是主张种族存在的一种立场；被建构的类别可以有稳定的效力与可检验的后果。',
      },
      {
        from: '族群（ethnicity）',
        note: '在这一讨论里被单独处理：族群以文化归属、语言遗产、宗教或声称的亲缘为核心，与被视为固有的体貌特征不同。',
      },
    ],
    seeAlso: ['scientific-realism', 'personhood-community'],
    nodeIds: ['pt-africana-race', 'pt-identity-oppression'],
    sources: [
      {
        id: 'CPT-RACE-1',
        title: 'Race（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/race/',
        locator: '§2 Do Races Exist? Contemporary Philosophical Debates；§3 Race versus Ethnicity',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§2 以 Mallon 的整理列出被放弃的 racial naturalism（生物—行为本质及其三项条件）与仍在竞争的三个形而上学阵营（racial skepticism、racial constructivism、racial population naturalism）及两个规范阵营（eliminativism、conservationism），并说明反对 racial naturalism 已是共识而本体地位仍有分歧。§3 引 Cornell 与 Hartmann 对种族与族群的界定差别。',
      },
    ],
  },
  {
    id: 'pratityasamutpada',
    term: '缘起',
    original: 'pratītyasamutpāda',
    short: '任何现象都依条件而生起、依条件而存续；离开条件，没有哪一件事能够自己成立。',
    detail:
      '同一个词在不同阶段承担的分量不同。早期教说里它的形态较朴素，四圣谛第二条就是一例：苦的生起有其原因与条件。中观把它推到最强：龙树据此否认 svabhāva（自性）——说某物「以自性存在」，意思是它是世界的基本构件，不依赖任何别的存在者，是一连串依赖关系追到底之后的终点；龙树论证没有这样的终点。同时他并不因此宣称因果不成立，而是说我们对因果的理解建立在一个错误前提上：以为因与果各自以自性存在、彼此独立，也独立于认知它们的心。',
    distinctions: [
      {
        from: '「一切皆幻」',
        note: '否认自性不是否认因果、日常对象与言说；龙树对因果的结论是我们的理解有错误前提，不是因果不存在。',
      },
      {
        from: '决定论',
        note: '缘起讲的是条件依赖，不是「未来只有一条路」；把二者叠在一起会得出佛教主张决定论这种没有依据的结论。',
      },
      {
        from: '「万物互联」式的笼统说法',
        note: '缘起在中观里是用来做否证论证的分析工具，不是一句关于整体和谐的断语。',
      },
    ],
    seeAlso: ['scientific-realism', 'personal-identity'],
    nodeIds: ['pt-buddhist', 'pt-being-change', 'pt-mind-self', 'pt-chinese-later'],
    sources: [
      {
        id: 'CPT-PS-1',
        title: 'Nāgārjuna（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/nagarjuna/',
        locator: '§2 Emptiness and svabhāva；§3.1 Causation',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§2 说明空是「空掉 svabhāva」，并把「以 svabhāva 存在」解为：某物是世界的基本构件，独立于其他一切存在者，是本体依赖链的终点；龙树论证没有这样的终点。§3.1 说明他考察因果的各种可能关系后并不结论因果不可能，而是我们的因果理解基于一个错误前提——因与果以各自的 svabhāva 存在、彼此独立且独立于认知的心。',
      },
      {
        id: 'CPT-PS-2',
        title: 'Buddha（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/buddha/',
        locator: '§2 Core Teachings，四圣谛第二条的解释段',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节把四圣谛第二条读作一个朴素的主张：苦的生起有其原因与条件；并指出实质性的哲学争论正从这一条的展开与细化开始。',
      },
    ],
  },
  {
    id: 'self-cultivation',
    term: '修养（工夫、修身）',
    original: '修身／修養／工夫',
    short: '通过学习、习惯、礼、反省与具体事务上的训练，逐步改变一个人的感受、判断与行动倾向。',
    detail:
      '本库对同一件事出现过三种叫法（修养、工夫、修身），侧重不同而所指相连，本条不加区分。朱熹的人性论解释了为什么同一条路径对不同人难度不同：每个人的基本倾向受其气质禀赋、家庭与社会环境等条件制约，由此形成各不相同的性情、才智与修养资质。王阳明一路则把知与行合为一事，认为理不在心外，因而伦理学的理论研究并非实践的前提——这条批评针对的是把学理当作入门条件，不是取消工夫。',
    distinctions: [
      {
        from: '相容论',
        note: '把修养论直接归入自由意志争论的某一方，等于把它没有提出的问题塞给它：相容论要判定的是行动在决定论下还算不算自由，修养论要问的是一个人的性情能不能被改造、怎样改造。',
      },
      {
        from: '自我提升技巧',
        note: '修养论把个人训练与家庭、礼制和治理连在一起，不是一套单人可执行的方法。',
      },
      {
        from: '「靠悟不靠学」',
        note: '王阳明反对的是把理论研究当作实践前提，不是反对训练本身；把他读成反对用功，会漏掉「知行合一」要求什么。',
      },
    ],
    seeAlso: ['personal-autonomy', 'basic-desert'],
    nodeIds: ['pt-confucian', 'pt-chinese-later', 'pt-freedom', 'pt-good-life', 'pt-interpretation'],
    sources: [
      {
        id: 'CPT-CUL-1',
        title: 'Zhu Xi（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/zhu-xi/',
        locator: '§2 Philosophy of Human Nature and Approach to Self-Cultivation',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节说明朱熹在承接孟子性善的同时，以气质禀赋、家庭与社会环境等条件解释每个人的经验性情、才智与修养资质的实际差异，因而修养被放在具体条件之中而不是抽象意志之中。',
      },
      {
        id: 'CPT-CUL-2',
        title: 'Wang Yangming（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/wang-yangming/',
        locator: '§3 Unity of Knowing and Acting',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节引王阳明「心即理」的问句（心外岂有事、心外岂有理），据此说明伦理学的理论研究并非必需，并指出中国伦理学尤其儒学的重心在应用性的伦理修养，而不在元伦理与规范理论。',
      },
    ],
  },
  {
    id: 'pramana',
    term: '认识手段（pramāṇa）',
    original: 'pramāṇa',
    short: '古典印度哲学中能生成真认知的合格来源；哪些来源算得上，各学派长期争论。',
    detail:
      '常被列入的候选是知觉、推理、类比与证言，另有「假定」（arthāpatti）、「非认知」（anupalabdhi）等更有争议的候选。分歧不是术语之争：胜论与佛教诸家否认证言是独立的认识手段，理由是转述之所以可靠，最终仍要回到最初那个人的知觉或推理。翻译上还有一层麻烦——jñāna 常被译作 knowledge，但梵语用法允许「假的 jñāna」，英文 knowledge 不允许，所以译作「认知」更稳。',
    distinctions: [
      {
        from: '三段论',
        note: '印度的五支论证（一种分五步走的论证格式）与认识手段的分析自成一套：它要回答的问题、评判好坏的标准都与欧洲逻辑不同，不是同一套东西换了名词。',
      },
      {
        from: '「信息来源」清单',
        note: 'pramāṇa 问的是何种过程生成真认知，不是列举可信渠道；一个渠道可靠与它是否构成独立的认识手段是两件事。',
      },
      {
        from: '认知正当性',
        note: '两套讨论可以对照，但古典印度认识论是否处理同一个「有理由的真信念」问题，在当代研究中本身有争论。',
      },
    ],
    seeAlso: ['testimony', 'epistemic-luck', 'epistemic-justification'],
    nodeIds: ['pt-knowledge-sources', 'pt-nyaya', 'pt-logic'],
    sources: [
      {
        id: 'CPT-PRA-1',
        title: 'Epistemology in Classical Indian Philosophy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/epistemology-india/',
        locator:
          '§1.1 Knowledge and Knowledge Sources；§6 Testimony；§7 Analogy and Other Candidate Sources；§9.1 Epistemic Luck',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1.1 指出 jñāna 通常被译作 knowledge，但梵语允许「假的 jñāna」，因此宜作有真有假的「认知」。§6 记载胜论与佛教诸家否认证言是独立的 pramāṇa，并说明证言的真值最终依赖原初证言者以知觉或推理而知。§7 列出类比、arthāpatti、anupalabdhi 等其余候选。§9.1 说明当代讨论中「古典印度认识论是否处理有理由的真信念」本身有争议（Potter 1984 的立场）。',
      },
    ],
  },
  {
    id: 'testimony',
    term: '证言',
    original: 'testimony',
    short: '以他人的陈述为根据形成信念或知识；争论在于这种信念的理由能否还原为听者自己的知觉、记忆与推理。',
    detail:
      '同一件事的两个版本就能看出难处：告诉你比赛结果的若是你已知高度可靠的体育记者，你的信念显然有理由；若是一个素不相识的人，而你既不知他是否常说真话、也没有理由怀疑他，你的信念是否有理由就不清楚了。还原论要求听者另有独立理由支持说话者可靠，非还原论主张在没有反面理由时接受他人所说本身即为正当。此外还有两个方向：证言是只把已有的知识从说话者传给听者，还是本身也能生成新知识；以及判断听者的信念有没有理由时，能不能只看听者这一侧的状态。',
    distinctions: [
      {
        from: '专家意见',
        note: '证言问题涵盖一切以他人陈述为根据的信念，不限于专家；缩小到专家就漏掉了日常绝大多数知识的来源。',
      },
      {
        from: '「二手所以更弱」',
        note: '是否需要为接受他人所说另找理由，正是还原论与非还原论的争点，不是可以先假定的结论。',
      },
      {
        from: '法庭证词',
        note: '哲学讨论不以宣誓、程序或身份为界；制度化的作证只是其中一种情形。',
      },
    ],
    seeAlso: ['pramana', 'epistemic-justification', 'epistemic-luck'],
    nodeIds: ['pt-knowledge-sources', 'pt-identity-oppression', 'pt-nyaya'],
    sources: [
      {
        id: 'CPT-TES-1',
        title: 'Epistemological Problems of Testimony（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/testimony-episprob/',
        locator:
          '§1 Reductionism and Non-Reductionism，开篇的记者／陌生人两版事例；另据节题 §2 Knowledge Transmission and Generation、§4 Individualism and Anti-Individualism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节以同一命题的两个情形对照：来自已知高度可靠的记者朋友时，信念显然正当；来自素不相识者、既无关于其可靠性的知识又无怀疑理由时，是否正当就不清楚。由此引出还原论与非还原论之分。传递／生成之别与个人主义／反个人主义之争见 §2、§4 的节题与子节题（本轮只核对到节题层）。',
      },
      {
        id: 'CPT-TES-2',
        title: 'Epistemology in Classical Indian Philosophy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/epistemology-india/',
        locator: '§6 Testimony',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节说明胜论与佛教诸家为何否认证言是独立的认识手段，并把证言的真值追溯到原初证言者的知觉或推理，构成与欧洲还原论争论可对照但不等同的问题结构。',
      },
    ],
  },
  {
    id: 'basic-desert',
    term: '基本应得',
    original: 'basic desert',
    short: '行动者仅仅因为这个行动是她做的、并且她明白它在道德上是错的，就配得谴责；这种「配得」不依赖谴责能带来的任何好处。',
    detail:
      '佩雷布姆给出的定义是：一个行动在这种意义上属于她，以致她若明白它道德上错就应得谴责、若明白它值得称许就应得称许；这里的「应得」是基本的，即不以后果论或契约论的进一步理由为条件。责任怀疑论针对的正是这一种责任，而不是全部责任实践——他本人拒绝以应得为基础的责备，却主张若干常规责备实践可以建立在「不诉诸应得的道德考量」上，例如保护潜在受害者、修复人际与道德共同体中的关系、以及道德养成。',
    distinctions: [
      {
        from: '一切谴责与惩罚',
        note: '为预防、保护、教育或修复而施加的限制不以基本应得为前提；放弃基本应得不等于放弃全部责任实践。',
      },
      {
        from: '法律责任',
        note: '法律上的可归责有自己的条件与目的，不是这个概念的应用题；把二者对齐会让形而上学结论直接变成刑罚结论。',
      },
      {
        from: '报应情绪',
        note: '想让人受苦是一种反应；配得受责是一个规范主张，需要理由支持。',
      },
    ],
    seeAlso: ['responsibility-faces', 'moral-luck', 'determinism'],
    nodeIds: ['pt-freedom', 'pt-responsibility', 'pt-justice'],
    sources: [
      {
        id: 'CPT-BD-1',
        title: 'Skepticism About Moral Responsibility（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/skepticism-moral-responsibility/',
        locator: '§1 Moral Responsibility Skepticism and Basic Desert，佩雷布姆的定义引文',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节引佩雷布姆对 basic desert moral responsibility 的定义：行动以某种方式属于她，以致她若理解其道德错误便应得谴责、若理解其道德可嘉便应得称许；其中的应得是「基本的」，不以进一步理由为条件。',
      },
      {
        id: 'CPT-BD-2',
        title: 'Moral Responsibility（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/moral-responsibility/',
        locator: '§2.1 Forward-Looking Accounts；§3.6 Skepticism about Responsibility',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§2.1 记载佩雷布姆在拒绝以应得为基础的责备的同时，主张常规责备实践可建立在「不诉诸应得的道德考量」上，并举出保护潜在受害者、关系修复与道德养成。§3.6 说明当代怀疑论多走硬不相容论路线，针对的是以应得为基础（相对于前瞻性）的道德责任。',
      },
    ],
  },
  {
    id: 'moral-luck',
    term: '道德运气',
    original: 'moral luck',
    short: '被评价的事情有一大块不由行动者控制，而针对它的道德评价仍然成立——重点在「仍然成立」：谁都承认运气会影响我们实际怎么评价，争的是这样的评价对不对。',
    detail:
      '问题的一个常见起点是康德式直觉：善良意志的价值不在于它成就了什么，即使命运不佑、它竭尽全力仍一无所成，它也像宝石那样自身发光。日常评价却确实随结果、处境、性格与因果史而变。两边都要付代价：严格坚持控制原则（只就一个人能控制的事去评价他），会使大量日常归责失效；接受运气可以改变责备，则要解释这在什么意义上还算公平。',
    distinctions: [
      {
        from: '认知运气',
        note: '共用「运气」二字而问题不同：那里问一个真信念是否只是碰巧为真、够不够称为知识，不问评价一个人是否公平。',
      },
      {
        from: '结果责任',
        note: '因结果而应当赔偿或修复，与因结果而更可谴责，是两个判断；不加区分会让讨论在赔偿与谴责之间来回滑动。',
      },
      {
        from: '「运气无处不在所以无人可责」',
        note: '这是从内格尔式论证推到极端的一种立场（列维的「硬运气」观），并非该论证的唯一去处；内格尔本人未完全接受怀疑论结论。',
      },
    ],
    seeAlso: ['epistemic-luck', 'basic-desert', 'responsibility-faces'],
    nodeIds: ['pt-responsibility', 'pt-freedom', 'pt-good-life'],
    sources: [
      {
        id: 'CPT-ML-1',
        title: 'Moral Luck（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/moral-luck/',
        locator: '§1 Generating the Problem of Moral Luck：所引康德《奠基》段落，以及该节给出的 (ML) 界定',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节以康德的引文起头：善良意志之为善不在于它所促成或达成之事，即使因命运不佑而一无所成，它仍像宝石那样自身发光，有用或无用都不增减其价值——道德免于运气的想法由此获得启发。同节给出的界定 (ML) 写明：道德运气发生在一个行动者「可以被正确地」当作道德判断的对象、而他被评价的事情有重要一面超出他控制之时；「正确」这一半是本条 short 的依据。',
      },
      {
        id: 'CPT-ML-2',
        title: 'Moral Responsibility（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/moral-responsibility/',
        locator: '§3.7 Moral Luck and Responsibility',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节指出内格尔并未完全接受由此而来的责任怀疑结论，而列维的「硬运气」观主张运气的普遍性意味着行动者之间不存在能蕴含应得的差别——性格与行为后果的差别仍在，但不足以作为区别对待赞责的根据。',
      },
    ],
  },
  {
    id: 'epistemic-luck',
    term: '认知运气',
    original: 'epistemic luck',
    short: '一个信念之为真出于运气，而不是出于它所依据的理由；盖梯尔案例里，真的、有理由的信念因此仍不算知识。',
    detail:
      '盖梯尔的论证针对的正是这一点：有理由的真信念即使是知识的必要条件，也不是充分条件。一条自然的回应是给分析加上明确的「反运气」条件，但这类条件会改动整个分析的结构——只要要求「信念之为真并非仅出于运气」，这一条就已蕴含信念为真与相信本身，原有的三条件不再各自独立。',
    distinctions: [
      {
        from: '道德运气',
        note: '那里的问题是评价一个人是否公平；这里的问题是一个信念够不够称为知识。共用「运气」二字，检验完全不同。',
      },
      {
        from: '瞎猜对了',
        note: '认知运气的难处在于当事人确实有理由却仍不算知道；毫无理由的猜中根本进不了这个问题。',
      },
      {
        from: '怀疑论',
        note: '指出某个信念只是碰巧为真，不等于主张我们什么都不知道；这是对知识条件的分析，不是对知识范围的否定。',
      },
    ],
    seeAlso: ['moral-luck', 'epistemic-justification', 'pramana'],
    nodeIds: ['pt-knowledge-sources', 'pt-nyaya'],
    sources: [
      {
        id: 'CPT-EL-1',
        title: 'The Analysis of Knowledge（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/knowledge-analysis/',
        locator: '§8 Epistemic Luck，含 Unger 1968 式的反运气条件及其「冗余」问题',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节把盖梯尔案例的问题表述为：三条件与加强版分析仍与某种程度的、与知识不相容的认知运气兼容；并给出加入「S 的信念并非仅因运气而为真」这一条的分析，指出该条件蕴含前两条，因而这种分析实为对原分析的重大改动。',
      },
      {
        id: 'CPT-EL-2',
        title: 'Epistemology in Classical Indian Philosophy（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/epistemology-india/',
        locator: '§9.1 Epistemic Luck',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '该节说明自 Potter（1984）以来，古典印度对 jñāna 与 pramā 的处理如何与分析哲学的知识分析、认知运气相关一直有争论，Potter 本人主张古典印度哲学并不以有理由的真信念为课题。',
      },
    ],
  },
  {
    id: 'responsibility-faces',
    term: '责任的三种意义',
    original: 'attributability / answerability / accountability',
    short: '说一个人「有责任」，至少可以指三件不同的事：这件事出自她（可归属性）、她可以被要求说明理由（可要求说明）、她可以被追究并承担后果（可追究性）。',
    detail:
      '这一分法起于沃尔夫与沃森之争。在「真我」理论里，一个人对可归属于其真我的行为负责，而所谓可归属于真我，是说她既能依自己的意志支配行为、又能依自己的评价系统支配意志——因此负责的行动者不是被最强的欲望推动的，而是被她所认可的欲望推动的。名称在不同作者笔下并不指同一件事：肖梅克把可归属性对应品格、可追究性对应对他人的顾念、可要求说明对应评价判断；史密斯与希罗尼米用「可要求说明」指更接近归属论的立场；佩雷布姆用它指一种更容纳责任怀疑论的责任。本库统一采用上面三个中文译名，遇到具体作者时再说明其用法。',
    distinctions: [
      {
        from: '因果上的原因',
        note: '造成了某个结果与可被追究不是一回事；把两者对齐会让「谁碰到的谁负责」冒充论证。',
      },
      {
        from: '制度职责',
        note: '岗位与角色规定的义务不必先解决可归属性问题；追问「谁本该做这件事」与追问「这件事出自谁」是不同问题。',
      },
      {
        from: '修复责任',
        note: '即使不配受谴责，也可能因角色、能力或关系而应当补救；把修复挂在谴责之下会漏掉大量应做的事。',
      },
    ],
    seeAlso: ['basic-desert', 'moral-luck', 'technological-determinism'],
    nodeIds: ['pt-responsibility', 'pt-freedom', 'pt-ai-future', 'pt-law'],
    sources: [
      {
        id: 'CPT-RF-1',
        title: 'Moral Responsibility（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/moral-responsibility/',
        locator:
          '§3.1 The "Faces" of Responsibility，含 §3.1.1 Attributability versus Accountability 与 §3.1.3 Answerability',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§3.1.1 把这一分法追到沃尔夫（1990）与沃森之争，并引其对「真我」理论的表述：行为可归属于真我，即她既能依自己的意志支配行为、又能依自己的评价系统支配意志，因此负责的行动者不是被最强欲望推动、而是被她所认可的欲望推动。§3.1.3 记载 answerability 由肖梅克（2011、2015）作为第三种责任提出（可归属性对应品格、可追究性对应对他人的顾念、可要求说明对应评价判断），并指出 A. Smith（2015）、Hieronymi（2008、2014）与 Pereboom（2014）对同一术语的用法各不相同。',
      },
    ],
  },
  {
    id: 'relativism',
    term: '相对主义',
    original: 'relativism',
    short: '在某个领域里，真理或价值只有相对于某个参数（文化、概念框架、语言、评价者）才成立，没有一个超出全部参数的绝对标准。',
    detail:
      '标准的定义方式是共变：某个现象 x（价值、认识或伦理规范、判断，甚至世界）依赖并随某个独立变量 y（范式、文化、概念框架、信念系统、语言）而变。用否定的方式说更清楚：它反对绝对主义（至少某些真理或价值适用于一切时地）、客观主义（真独立于特定时地的判断与信念）、一元论（同一争议上不能有多于一个正确判断），以及把真理的客观性与唯一性合在一起的实在论。各版本的分歧在于相对化的参数是什么、范围有多大（全局还是局部、强还是弱）。',
    distinctions: [
      {
        from: '主观主义',
        note: '把真或正当相对于每一个个人；一般所说的相对主义相对于群体。代价不同：退到个人参数会同时放弃互主观性，而互主观性正是许多相对主义者看重的长处。',
      },
      {
        from: '描述性的文化差异',
        note: '各地道德信念事实上不同，是一个可由人类学支持的观察；由它推出真或正当只相对于群体，还需要另加论证。',
      },
      {
        from: '「什么都说不清」',
        note: '相对主义主张真值相对于参数，不是主张无法判断；参数一旦给定，判断仍可以有对错。',
      },
    ],
    seeAlso: ['scientific-realism', 'race-ontology', 'epistemic-justification'],
    nodeIds: ['pt-interpretation', 'pt-aesthetic-value', 'pt-science-reality', 'pt-jain-carvaka'],
    sources: [
      {
        id: 'CPT-RV-1',
        title: 'Relativism（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/relativism/',
        locator: '§1.1 The co-variance definition；§1.2 Relativism by contrast',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1.1 给出共变定义：现象 x 依赖并随独立变量 y 共变，并以「正义相对于地方规范」「真相对于语言游戏」「温度测量相对于所用刻度」为例说明哪些依赖关系才算相对主义。§1.2 以相对主义所否认者为线索，列出绝对主义、客观主义、一元论与（在蕴含真的客观性与唯一性的意义上的）实在论四个对照项。',
      },
      {
        id: 'CPT-RV-2',
        title: 'Moral Relativism（SEP）',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/moral-relativism/',
        locator: '§2 Forms and Arguments（主观主义与相对主义之分）；§4 Descriptive Moral Relativism；§6 Metaethical Moral Relativism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§2 明说：道德判断的真或正当可相对于个人也可相对于群体，前者常称主观主义、后者称相对主义。§6 指出退向主观主义会放弃互主观性，而互主观性是许多元伦理相对主义者所重的长处。§4 指出描述性道德相对主义不足以确立元伦理相对主义，尽管后者最常见的理据会因前者不成立而落空。',
      },
    ],
  },
  {
    id: 'functionalism',
    term: '功能主义',
    original: 'functionalism',
    short:
      '把心理状态按它在心理学理论中承担的角色来刻画——输入、其他内部状态与行为之间的因果位置——因此同一状态可以由不同材料实现。',
    detail:
      '多重实现（同一种心理状态可以由不同的物理结构实现）正是它的主要动因：它给出一种「更具包容性、不以物种为中心」而又与物理主义相容的心灵理论。它面对的经典反对是缺失感受质——感受质指体验本身的那种质地，疼是什么滋味、看到红是什么样子；这条反对说，似乎可能存在一种与常人功能完全等价、却没有任何这类质地的存在者。',
    distinctions: [
      { from: '类型同一论', note: '类型同一论把某类心理状态等同于某类物理状态，因此排除了不同材料实现同一状态；功能主义正是为绕开这一点提出的。' },
      { from: '行为主义', note: '功能角色包含与其他内部状态的关系，不只是刺激与反应的配对，所以它不像行为主义那样把内部状态排除在解释之外。' },
      { from: '「能通过测试就有心灵」', note: '功能等价是关于因果组织的主张，不是关于外部表现相似的主张；读成后者会直接跳过缺失感受质那条反对。' },
    ],
    nodeIds: ['pt-mind-self', 'pt-ai-future'],
    sources: [
      {
        id: 'FUN-1',
        title: 'SEP：Functionalism',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/functionalism/',
        locator: '§1 What is Functionalism?（定义与多重实现动因）、§5.5.1（缺失感受质反对）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '心理状态按其在心理学理论中的角色刻画；多重实现被视为提供一种「更具包容性、不以物种为中心」且与物理主义相容的理论；以及「可能存在与常人功能等价而其心理状态完全没有质的特征的存在者」这条反对。',
      },
    ],
  },
];

const conceptById = new Map<string, Concept>();

for (const concept of concepts) {
  if (conceptById.has(concept.id)) {
    throw new Error(`重复的概念 ID：${concept.id}`);
  }
  if (concept.nodeIds.length === 0) {
    throw new Error(`概念 ${concept.id} 没有挂到任何条目上；没有母页的概念卡无处可去`);
  }
  for (const nodeId of concept.nodeIds) {
    if (!getNodeById(nodeId)) {
      throw new Error(`概念 ${concept.id} 指向了不存在的节点：${nodeId}`);
    }
  }
  if (concept.sources.length === 0) {
    throw new Error(`概念 ${concept.id} 没有来源`);
  }
  conceptById.set(concept.id, concept);
}

for (const concept of concepts) {
  for (const relatedId of concept.seeAlso ?? []) {
    if (!conceptById.has(relatedId)) {
      throw new Error(`概念 ${concept.id} 的 seeAlso 指向了不存在的概念：${relatedId}`);
    }
  }
}

export function getConcept(id: string): Concept | undefined {
  return conceptById.get(id);
}

/** 取到概念，取不到就抛错。正文里的行内注解用它，避免静默漏渲染。 */
export function requireConcept(id: string): Concept {
  const concept = conceptById.get(id);
  if (!concept) {
    throw new Error(`正文引用了未定义的概念：${id}`);
  }
  return concept;
}

/** 本条目会用到的概念，按 concepts 数组的顺序返回。 */
export function conceptsForNode(nodeId: string): Concept[] {
  return concepts.filter((concept) => concept.nodeIds.includes(nodeId));
}
