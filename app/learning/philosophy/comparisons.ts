import type { LedgerSource } from './content-ledger';
import { getNodeById } from './tree';

/**
 * 跨传统比较。
 *
 * 比较不从「儒家相当于哪一派」开始，而从一个双方真的能对话的问题开始，
 * 例如「在什么意义上，一个行动可以算作属于行动者自己？」。
 *
 * 然后分别说明每个传统在这个问题上关心什么。最后必须明确写出：
 * 它们不一定在回答完全相同的问题，因此不能当作几种竞争理论排成一排。
 *
 * 禁止的写法：儒家＝相容论、佛教＝决定论、道家＝相对主义、
 * 任何「某东方思想＝某西方思想的东方版本」。
 *
 * 每个 framing 的 note 是概括或解释性重构，不是原文；角标指向 item.sources
 * 里那条来源实际核对到的小节。core／remaining 两套研究层不覆盖这里，所以
 * 本文件里每条来源的 checked 与 checkedOn 就是它自己的核验记录。
 */

export type ComparativeFraming = {
  /** 传统或立场名，例如「现代相容论」「佛教传统」。 */
  tradition: string;
  /** 对应的条目。有就填，读者可以直接过去。 */
  nodeId?: string;
  /** 它在这个问题上更关注什么。短语，不写成段落。 */
  caresAbout: string[];
  /** 它是怎么组织这个问题的。 */
  note: string;
  /** 这一栏的判断依据。 */
  sourceIds: string[];
};

export type ComparativeQuestion = {
  id: string;
  /** 可比问题本身。这是整块内容的组织轴。 */
  question: string;
  /** 为什么这个问题能让双方真的对上话。 */
  why: string;
  /** 挂在哪些条目上。 */
  nodeIds: string[];
  framings: ComparativeFraming[];
  /** 差异提示：它们各自在回答什么、为什么不能直接排成竞争理论。必填。 */
  caution: string;
  /** 尚未核对、不敢下判断的部分。宁可留白也不要补齐成完整表格。 */
  pending?: string[];
  sources: LedgerSource[];
};

export const comparativeQuestions: ComparativeQuestion[] = [
  {
    id: 'cq-action-ownership',
    question: '在什么意义上，一个行动可以算作属于行动者自己？',
    why:
      '这几支思想都要在同一个夹缝里做取舍：若一个行动完全由先前条件产生，它凭什么还算「我的」；若它不由任何条件产生，它又凭什么还算「我在做」而不是碰巧发生在我身上。夹缝对每一方都成立，所以它们能在同一句问话下对上话。',
    nodeIds: ['pt-freedom', 'pt-confucian', 'pt-buddhist'],
    framings: [
      {
        tradition: '现代相容论',
        nodeId: 'pt-freedom',
        caresAbout: ['行动是否出自主体自己的意志', '一阶欲望与二阶态度是否吻合', '机制对理由的敏感范围', '是否被强迫或被操纵'],
        note:
          '相容论把「属于我」拆成可以逐项检查的心理结构。层级式的版本要求行动「出自她所想要的那个意志」，即一阶欲望与二阶态度对得上；理由响应式的版本不要求存在另一种可能，只要求行动所出自的意志机制「对一定范围的理由敏感」。两条路都不试图让行动摆脱因果，而是去问因果链条最后一段的形状。',
        sourceIds: ['AG-1'],
      },
      {
        tradition: '源头性要求（不相容论一侧）',
        nodeId: 'pt-freedom',
        caresAbout: ['行动者是否为选择的终极源头', '有无真正开放的替代可能', '决定论下的追溯', '被设计出来的行动者'],
        note:
          '这一侧的关键不是「无原因」，而是源头：自由要求「我们致使某些事发生，而没有任何东西、任何人致使我们去如此致使」。这个要求本身会陷入一个两难——若一切被决定，源头总落在我之外；若引入非决定性，选择又可能只是随机而非受控。操纵与设计案例是这条路线的主要直观支撑，但同一份综述也指出这类论证有循环之嫌：它在前提里就已经假定了，因果一旦追溯到我控制不了的源头就会破坏自由，而这正是它要证明的。',
        sourceIds: ['AG-2'],
      },
      {
        tradition: '康德的自我立法',
        nodeId: 'pt-western-modern',
        caresAbout: ['意志的自律', '准则是否由理性主体自己给出', '把自己看作行动的作者', '自由与道德法则互为条件'],
        note:
          '康德不问「我的选择有没有原因」，而问一个意志在什么条件下算是自己在立法。综述的表述是：自由在于「受某种意义上由自己制定的法则约束」，理性意志必须「在自身自由的理念下」行动，依照「我们是其源头或作者」的普遍法则运作。「属于我自己」在这里是一个关于应当如何的条件——这个意志是不是在服从它自己所立的法则——而不是关于这个行动由什么原因造成的事实。',
        sourceIds: ['AG-3'],
      },
      {
        tradition: '儒家的修养与礼',
        nodeId: 'pt-confucian',
        caresAbout: ['欲望与情感如何被改造', '礼乐对性情的塑造', '学与经典', '德性的成形过程'],
        note:
          '儒家追问的不是某个瞬间的选择是否自发，而是一个人的反应从哪里来、能不能被改造。综述指出礼的「恰当履行是改造欲望、开始养成道德倾向的关键」，礼乐「不只是价值的指示器，也是价值的灌输者」，并引《论语》17.2「习相远也」一语。按这条线索，一个行动更像我自己的，是因为它出自被长期塑造过的性情，而不是因为它摆脱了塑造。',
        sourceIds: ['AG-4'],
      },
      {
        tradition: '佛教的业与相续',
        nodeId: 'pt-buddhist',
        caresAbout: ['意向与造作', '在没有常一之我的前提下，业果如何相续', '执取的作用', '修行改变条件'],
        note:
          '佛教一侧先取消了提问的一个预设。综述的陈述是：业果由行动而非由一个转生的灵魂承载，因而「无转生的再生在逻辑上是可能的」——也就是说，可以有再生而没有一个从这一世搬到下一世的灵魂；前世之人与今世之人「既非同一亦非不同」。归属问题于是从「谁是这个行动的所有者」转成「哪些条件在相续、哪些造作还在起作用」。',
        sourceIds: ['AG-5'],
      },
    ],
    caution:
      '这五栏不是同一道题的五个答案。相容论与源头性要求在争一个概念分析：使行动自由的条件是什么。康德争的是规范条件，这可以在因果问题悬置的情况下成立。儒家的核心问题是养成——怎样使一个人的反应变得可靠，而不是划出自由行动的边界。佛教连「行动有一个持续的所有者」都不接受，它要处理的是苦与解脱。把它们排成一排，最容易生出的正是几条对不上的等式：儒家没有主张「决定论与自由相容」，佛教也没有主张「一切被决定」——缘起讲的是条件相依，不是可预测的必然。',
    pending: [
      '康德一栏只依据综述对 Autonomie 的英文表述；中文「自律／自主」两种译名与康德文本的落差没有核对二手文献。',
      '儒家一栏只用了礼与习惯那一段，孟子性善与荀子化性起伪在「行动归属」上的差别尚未查证。',
      '佛教一栏没有区分部派与大乘对业相续的不同解释；所用综述主要处理早期材料。',
      '本条没有查证把这几支直接对接的比较研究，caution 里的判断是本库的解读，不是引自来源的结论。',
    ],
    sources: [
      {
        id: 'AG-1',
        title: 'SEP：Compatibilism',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/compatibilism/',
        locator: '§4.2 Hierarchical Compatibilism；§4.4 Reasons-Responsive Compatibilism；另见 §1.2 Determinism and Sourcehood',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '层级式相容论把自由说成行动出自「她所想要的那个意志」，即一阶欲望与二阶态度的吻合；理由响应式相容论要求意志机制对一定范围的理由敏感，而不要求替代可能。',
      },
      {
        id: 'AG-2',
        title: 'SEP：Arguments for Incompatibilism',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/incompatibilism-arguments/',
        locator: '§4 Sourcehood Arguments；§3.2 Manipulation and Design Arguments',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '源头性要求的经典表述（我们致使某事发生，而无物致使我们如此致使）；决定论与非决定性两侧的两难；操纵与设计论证的形式及其可能循环的批评。',
      },
      {
        id: 'AG-3',
        title: 'SEP：Kant’s Moral Philosophy',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/kant-moral/',
        locator: '§10 Autonomy（另见 §7 The Autonomy Formula）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '自由被表述为受某种意义上由自己制定的法则约束；理性意志在自身自由的理念下行动，依照「我们是其源头或作者」的普遍法则运作。',
      },
      {
        id: 'AG-4',
        title: 'SEP：Confucius',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/confucius/',
        locator: '§3 Ritual Psychology and Social Values；§4 Virtues and Character Formation',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '礼的恰当履行改造欲望并开始养成道德倾向；礼乐既是价值的指示器也是灌输者；条目引《论语》17.2 以习论人之相远，并把德性养成分为幼时习惯与理性成熟后的实践智慧两段。',
      },
      {
        id: 'AG-5',
        title: 'SEP：Buddha',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/buddha/',
        locator: '§4 Karma and Rebirth（另见 §3 Non-Self）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '业果由行动而非由转生的灵魂承载，故无转生的再生在逻辑上可能；前后世之人「既非同一亦非不同」；人在世俗层面可说而究竟层面为施设。',
      },
    ],
  },
  {
    id: 'cq-what-makes-it-the-same-person',
    question: '当我们说昨天那个人就是今天的我，这个「同一」需要什么来支撑？',
    why:
      '两边都不肯用「因为是同一个人」这种循环回答收场，都要给出使两个时点属于同一人（或同一相续）的条件，而且用的是同类材料：记忆、心理因果、身体连续、构成部分的聚散。分歧发生在同一层面，所以可以对照。',
    nodeIds: ['pt-buddhist', 'pt-mind-self'],
    framings: [
      {
        tradition: '分析形而上学的人格同一性',
        nodeId: 'pt-mind-self',
        caresAbout: ['持续的必要充分条件', '心理连续性与记忆', '裂变案例', '动物论与纯物理连续性'],
        note:
          '这一支把问题定为持续问题：「一个过去或未来的存在者要成为现在的某人，需要什么是必要且充分的」。心理连续论的一个版本说，某个过去或未来的存在者就是你，只要你现在能记起她当时的某个经验，或反之；动物论一侧则主张我们就是有机体，持续靠「纯物理的连续性」。争的是数值同一（前后是不是同一个对象，而不是两个相似的对象）该由什么担保。',
        sourceIds: ['PI-1'],
      },
      {
        tradition: '佛教的无我分析',
        nodeId: 'pt-buddhist',
        caresAbout: ['五蕴的无常', '我是否可被希望改变', '蕴聚之外别无实体', '世俗施设与究竟还原', '心相续如何在无我下成立'],
        note:
          '佛教一侧不为这个「同一」找担保，而是拆掉提问的形式。无常论证是：若有我则我应常，五种身心要素无一是常，故无我；控制论证从「若有我，人绝不会希望它改变」入手。世亲一路的还原分析并不取消「人」的说法——「人」指「蕴的集合」，在世俗层面仍可用，只是究竟层面可还原为刹那的法；相续靠因果关联与业的条件维持，而不靠一个持续的主体。',
        sourceIds: ['PI-2', 'PI-3'],
      },
    ],
    caution:
      '两边表面上都在谈「什么支撑同一」，目标却不同。持续问题要的是一条可判真假的条件：某个未来存在者究竟是不是数值同一意义上的我。佛教的无我分析是一套实践—解脱论断言的一部分，它要说明的是执取一个常一之我如何产生苦，而不是给同一关系补一个更好的判准。所以不能把「无我」读成心理连续论或还原论的东方版本：帕菲特式还原论仍在回答持续问题，佛教则同时主张这个问题在究竟层面上问错了。反方向也要小心：无我并不否认日常人格、记忆或责任，佛教文本在世俗层面照样使用「人」。',
    pending: [
      '帕菲特与佛教还原论的比较是一个专门的当代研究领域，本条只对照了两份综述对佛教材料本身的陈述，没有核对这类比较研究的具体论证。',
      '世俗／究竟二谛框架在不同部派与中观传统中的用法差别很大，本条未加区分。',
      '未核对巴利语与梵语原典段落，佛教一栏全部依据学术综述的转述。',
    ],
    sources: [
      {
        id: 'PI-1',
        title: 'SEP：Personal Identity',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/identity-personal/',
        locator: '§1 The Problems of Personal Identity；§4 Psychological-Continuity Views；§7 Animalism and Brute-Physical Views',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '持续问题的表述（一个过去或未来的存在者要成为现在的某人需要什么）；心理连续论的记忆条件；动物论以纯物理连续性说明持续；§1 明确把人格问题与持续问题列为大体独立的两问。',
      },
      {
        id: 'PI-2',
        title: 'SEP：Buddha',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/buddha/',
        locator: '§3 Non-Self',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '无常论证（若有我则我应常，五种身心要素无一是常，故无我）与控制论证（若有我，人绝不会希望它改变）的具体形式。',
      },
      {
        id: 'PI-3',
        title: 'SEP：Mind in Indian Buddhist Philosophy',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/mind-indian-buddhism/',
        locator: '§1.1 The Not-Self Doctrine；§5.6 Persons: Reductionism and Supervenience',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '否认实体性、独立且持久的自我，人可还原为身心构成；世亲对补特伽罗论者的批评；佛教还原论不等于消解论，「人」在世俗层面指蕴的集合，相续靠因果关联与业的条件而非持续主体。',
      },
    ],
  },
  {
    id: 'cq-who-certifies-a-cognition',
    question: '一个认知的可靠性，是它自己就带来的，还是要另有东西来确立？',
    why:
      '两场争论都从同一个结构性麻烦生出：如果每一次认知都要另一次认知来作保，保证就无穷后退；如果不要保证，又得说明可靠性从哪里来。双方是在这同一个麻烦上分家的。',
    nodeIds: ['pt-nyaya', 'pt-knowledge-sources'],
    framings: [
      {
        tradition: '印度的 svataḥ／parataḥ-prāmāṇya 之争',
        nodeId: 'pt-nyaya',
        caresAbout: ['量性由何确立', '后退威胁', '知是否自知其为真', '来源识别与事后审察'],
        note:
          '争点是一次认知的「量性」（prāmāṇya）从哪里来。量性指一次认知够不够格算作「量」——它是不是由一个可靠的过程生成、算不算真知。弥曼差与吠檀多一方由后退威胁推出知识自我证成（svataḥ prāmāṇya）：一次认知的可靠性由它自身带来，不需要另一次认知去确认。正理一方持外在确立说（parataḥ prāmāṇya），并明确否认「知道 p」就自动「知道自己知道 p」；综述把正理描述为主张知识对自身之为真并不自觉的学派，量性要靠事后的复查与来源辨认一类程序才能确立。',
        sourceIds: ['CR-1'],
      },
      {
        tradition: '当代内在主义／外在主义之争',
        nodeId: 'pt-knowledge-sources',
        caresAbout: ['证成随附于什么', '心理状态说与可通达说', '真值导向性', '新恶魔案例'],
        note:
          '当代这场争论围绕一个「随附」关系展开：说甲随附于乙，意思是乙不变则甲不变——两个人若在乙上完全一样，在甲上也必定一样。内在主义主张证成随附于当事人内部的东西，因此两个内部状况完全相同的人，信念被证成的情况也必定相同；外在主义否认这一点。「内部的东西」有两种理解：心理状态说把它定为当事人心理生活的相关方面，可通达说把它定为当事人一经反思或内省就能知道的条件。支持外在主义的主要理由是真值导向性（证成之所以重要，是因为它使信念更可能为真）与解释力；支持内在主义的主要理由包括证成的规范性，以及「一个被恶魔彻底欺骗的人，其信念与我们同样被证成」这一直观。',
        sourceIds: ['CR-2'],
      },
    ],
    caution:
      '两场争论共用一个后退结构，却不是同一道题。印度这一场的直接问题是「知道自己知道」——正理否认的是「知道 p 就自动知道自己知道 p」，争的是量性如何被确立与认定。当代这一场问的是证成随附于什么，而这里的「内」被定为心理状态，或一经反思即可知道的条件，与「自觉」并不重合。所以「正理＝外在主义」这个对应会误导：在量性问题上持外在确立说，完全可以同时在证成问题上是内在主义者，反过来也一样。要把这个对应落实，必须逐项说明两边的「内／外」各指什么——本条没有做到这一步，只指出两者共用后退难题。',
    pending: [
      '正理内部（Vātsyāyana、Udayana、Gaṅgeśa）对量性确立程序的具体差别未查证，本条只用了综述对学派立场的概述。',
      '弥曼差 svataḥ prāmāṇya 的论证形式（Kumārila 与 Prabhākara 的差别）未核对。',
      '没有核对把这两场争论直接对接的比较文献；caution 里的判断是本库的解读，不是引自来源的结论。',
    ],
    sources: [
      {
        id: 'CR-1',
        title: 'SEP：Epistemology in Classical Indian Philosophy',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/epistemology-india/',
        locator: '§3 Knowing That You Know',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '弥曼差与吠檀多以后退威胁论证知识自我证成（svataḥ prāmāṇya）；正理持外在确立说（parataḥ prāmāṇya），否认 Kp 蕴含 KKp，被描述为主张知识对自身之为真并不自觉的学派。',
      },
      {
        id: 'CR-2',
        title: 'SEP：Internalist vs. Externalist Conceptions of Epistemic Justification',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/justep-intext/',
        locator: '§1 Terms of the Debates；§2 Arguments for Internalism；§3 Arguments for Externalism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '内在主义以「证成随附于内在之物」为核心，心理状态说（mentalism）与可通达说（accessibilism）两种理解；外在主义的真值联系与解释力论证；内在主义的规范性论证与新恶魔反驳。',
      },
    ],
  },
  {
    id: 'cq-crossing-to-the-unobserved',
    question: '从已观察到的关联跨到未观察的情形，凭什么？',
    why:
      '两边都不是笼统地怀疑推理，而是盯住同一个环节：把观察过的关联延伸到没观察过的情形，这一步需要什么支撑。双方举的例子甚至同类——烟与火、往后仍会照旧。',
    nodeIds: ['pt-jain-carvaka', 'pt-logic', 'pt-knowledge-sources'],
    framings: [
      {
        tradition: '顺世论对推理的分级',
        nodeId: 'pt-jain-carvaka',
        caresAbout: ['哪些推理日用上够用', '概然与确定的区别', '结论是否涉及从未被知觉之物', '可用材料本身的残缺'],
        note:
          '顺世论常被简化成「只承认知觉」，可核对的陈述要细一层：他们并不整体拒绝推理，因为「并非所有种类的推理都有问题；为了过日常生活，推理是必要的一步」。他们区分依概然作出的推理与依确定作出的推理，烟从建筑物升起因而屋内很可能有火就是那个常用例子；被拒绝的是「关于从未被知觉之物的推理，即神与来世」。这一栏的证据基础本身很薄：并无现存的顺世论教义文本，《Bṛhaspati Sūtra》只剩残片。',
        sourceIds: ['UO-1'],
      },
      {
        tradition: '休谟的归纳问题',
        nodeId: 'pt-logic',
        caresAbout: ['归纳是否预设自然齐一', '论证式推理与概然推理的两难', '循环', '合理性能否被重建'],
        note:
          '这一支追问的是归纳所预设的齐一原则：「未经验的事例必与已经验者相似，自然的进程始终齐一」。两难的形式是：论证式推理不能确立它，因为自然的进程改变并不自相矛盾，人完全可以清楚地设想已有规律在未观察的情形中不再成立；概然推理也不能，因为一切概然推理都已「预设将来将与过去一致」，用它来证明齐一原则就是「把正待论证之点当作前提」。',
        sourceIds: ['UO-2'],
      },
    ],
    caution:
      '相似之处止于被质疑的那一步。休谟的问题是一个普遍的辩护问题，牵动全部经验科学，那份综述的大半篇幅都在排列各种回应方案；顺世论的动机是特定的——限制形上学与宗教结论，日常推理照用。所以顺世论不是「印度的休谟」，它没有主张全部归纳都缺乏辩护。还有一处不对称落在材料上：休谟的文本完整可读，顺世论的观点主要靠残片与对手转述重构，任何「顺世论主张 X」的说法都得先说清 X 出自哪份材料。',
    pending: [
      '正理一方对遍充（vyāpti）如何被确立的正面论证，以及顺世论者对遍充的具体反驳，本轮没有找到可核对的条目段落。SEP Naturalism in Classical Indian Philosophy §2.3 只讨论 svabhāvavāda 与因果，不涉及推理的量性，因此没有采用。',
      '未核对 Jayarāśi 的《Tattvopaplavasiṃha》相关研究；SEP 另有 Jayarāśi 条目（本轮未打开），若要写顺世论与怀疑论的关系应从那里开始。',
      '耆那教一侧（anekāntavāda 与推理）没有进入本条。pt-jain-carvaka 同时涵盖耆那与顺世，这里只对照了其中一半。',
    ],
    sources: [
      {
        id: 'UO-1',
        title: 'IEP：Lokayata/Carvaka – Indian Materialism',
        kind: '学术综述',
        url: 'https://iep.utm.edu/indmat/',
        locator: '§3 Doctrine → a. Epistemology（材料残缺见同文对 Bṛhaspati Sūtra 残片的说明）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '顺世论不整体拒绝推理，日常生活中推理是必要一步；区分依概然与依确定作出的推理，并以烟示火为概然推理之例；拒绝关于从未被知觉之物（神、来世）的推理；无现存教义文本，《Bṛhaspati Sūtra》仅存残片。',
      },
      {
        id: 'UO-2',
        title: 'SEP：The Problem of Induction',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/induction-problem/',
        locator: '§1 Hume’s Problem；§2 Reconstruction',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '齐一原则的表述；论证式推理不能确立它（自然改道可被清楚设想，不含矛盾）；概然推理不能确立它（一切概然推理均预设将来与过去一致，故循环）。',
      },
    ],
  },
  {
    id: 'cq-foreknowledge-and-contingency',
    question: '若存在对未来行动的确定预知，该行动还能是偶然的（能够不发生）吗？',
    why:
      '中世纪的预知难题与当代自由意志争论共用同一套论证骨架：一条关于过去之事已经固定的前提，加上一条「必然性可以从前件传到后件」的规则，推出行动者现在不能不做某事。差别只在那个已固定的事实是神的信念，还是远古的世界状态加自然律。',
    nodeIds: ['pt-western-medieval', 'pt-freedom'],
    framings: [
      {
        tradition: '中世纪的预知难题',
        nodeId: 'pt-western-medieval',
        caresAbout: ['全知与自由能否同真', '未来偶然事件的地位', '永恒者以何种方式认知', '意志本身是否偶然'],
        note:
          '中世纪几乎所有作者都同时肯定神全知与人自由，问题因此是内部的：若神已知我将如何行动，「它们如何还能是自由的，既然看来我不能有别的意愿或行动」。波爱修不把它当成单纯的逻辑谬误，而提出「凡被认知者，不是按其自身的力量被把握，而是按认知者的能力被把握」，让未来偶然事件在自身层面保持未定，阿奎那沿此路走。奥卡姆与司各脱另走一路，主张神必须偶然地意愿，并因此拒绝把必然性等同于时间上的恒常。阿维森纳与阿威罗伊把神的知识限于普遍者（一般的、可重复的东西，而不是一件件具体事情）以避开难题；迈蒙尼德则诉诸神的不可知，并主张「知道」一词用在神身上与用在人身上并不是同一个意思。',
        sourceIds: ['FK-1'],
      },
      {
        tradition: '神学宿命论论证的当代重构',
        caresAbout: ['论证的分步形式', '过去的必然性', '必然性的传递', '替代可能性原则'],
        note:
          '当代重构把这个推理排成十步：神昔日无误地相信某行动将发生；过去之事仅因其为过去即为必然；故神昔日的信念必然；若神如此相信则该事必发生；必然性可以从前件传到后件（前件必然、且有前件就必有后件，则后件也必然）；故该行动现在必然；必然之事不能不做；故行动者不能不做；无替代可能即无自由；故该行动不自由。排开之后，回应就是逐条挑其中一步：永恒方案否认「昔日相信」适用于神，因为神并无时间中的信念；软事实方案区分纯粹关于过去的硬事实与部分关于未来的软事实，并把神关于未来偶然者的信念归入后者。',
        sourceIds: ['FK-2'],
      },
      {
        tradition: '世俗自由意志争论',
        nodeId: 'pt-freedom',
        caresAbout: ['后果论证', '过去与自然律的固定性', '必然性传递规则', '非决定性是否有帮助'],
        note:
          '把「神的信念」换成「远古的世界状态加自然律」，骨架不变：后果论证由过去的固定性与自然律的固定性出发，经同一条传递规则得出：若决定论为真，则「对任何真命题 p，没有人对 p 是否成立有过任何选择」。这也解释了为什么两边的回应形式相似——或否认必然性可以这样传递，或否认自由需要替代可能。',
        sourceIds: ['FK-3'],
      },
    ],
    caution:
      '骨架相同不等于问题相同。中世纪一侧的约束条件是神学的：结论必须同时保住全知与自由，否则整套教义站不住，所以波爱修—阿奎那那一路花在「神以何种方式认知」上的力气，在世俗版本里没有对应物——自然律不是一个认知者。反过来，世俗版本可以把「没有自由意志」当作结论接受，中世纪那些作者基本不能。而且伊斯兰与犹太传统的处理（限制神知的范围、诉诸语言的歧义）说明这甚至不是一个统一的「中世纪立场」。两个页面之间可以互相参照论证的形式，但形式相通不足以让一方替另一方结束争论。',
    pending: [
      '当代综述用「奥卡姆方案」命名一类硬事实／软事实回应，本条没有核对奥卡姆本人文本，因此不据此陈述奥卡姆的主张，只写他与司各脱主张神偶然地意愿这一点（出自中世纪哲学条目）。',
      '波爱修《哲学的慰藉》第五卷与阿奎那相关问题的具体章节未核对，中世纪一栏全部依据综述。',
      '莫利纳「中间知识」方案在当代综述里的确切小节位置本轮未确认，故未写入。',
      'pt-western-medieval 与 pt-freedom 两页之间目前没有互链；这需要改 data.json 的 related 或 relations.ts，不在本文件范围内。',
    ],
    sources: [
      {
        id: 'FK-1',
        title: 'SEP：Medieval Philosophy',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/medieval-philosophy/',
        locator: '§3.2 Divine Omniscience and Human Freedom: the Problem of Prescience',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '预知与自由难题的表述；波爱修「按认知者的能力被把握」的方案与阿奎那的沿用；奥卡姆与司各脱主张神必须偶然地意愿并拒绝把必然性等同于时间上的恒常；阿维森纳与阿威罗伊限制神知于普遍者，迈蒙尼德诉诸神之不可知与歧义语言。',
      },
      {
        id: 'FK-2',
        title: 'SEP：Foreknowledge and Free Will',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/free-will-foreknowledge/',
        locator: '§1 The argument for theological fatalism；§2.3 The eternity solution；§2.4 God’s forebeliefs as “soft facts” about the past',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '神学宿命论论证的十步重构；永恒方案（神无时间中的信念）与硬事实／软事实区分作为两种回应路线。',
      },
      {
        id: 'FK-3',
        title: 'SEP：Arguments for Incompatibilism',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/incompatibilism-arguments/',
        locator: '§5 Choice and the Consequence Argument',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '后果论证依赖过去与自然律的固定性以及一条必然性传递规则，结论为若决定论为真则无人对任何真命题是否成立有过选择。',
      },
    ],
  },
  {
    id: 'cq-good-life-and-whose-standpoint',
    question: '什么使一个生命过得好，而这个判断由谁的视角作出？',
    why:
      '三个古典学派与当代福祉理论都要回答同一件事的两半：好生活的内容是什么，以及「好」是对谁而言的好。第二半常被跳过，而它恰好是古今差别最大的地方。',
    nodeIds: ['pt-western-ancient', 'pt-good-life'],
    framings: [
      {
        tradition: '亚里士多德的功能论证',
        nodeId: 'pt-western-ancient',
        caresAbout: ['人的善与最高善', '灵魂理性部分的合德性活动', '习惯化与实践智慧', '快乐与外在善是否必要'],
        note:
          '亚里士多德走功能论证：人的卓越在于终身良好地运用理性，幸福在于「灵魂理性部分依德性而进行的活动」。伦理德性不是知识而是由习惯养成的品性——先在幼时养成习惯，理性成熟后再获得实践智慧。这条路不把快乐排除在外，「幸福的生活必须包含快乐」；而完满的友谊需要外在资源与时间，因此也进入幸福的条件。',
        sourceIds: ['GL-1'],
      },
      {
        tradition: '伊壁鸠鲁的宁静',
        nodeId: 'pt-western-ancient',
        caresAbout: ['恐惧的消除', '动态快乐与静态快乐', '痛苦的解除作为快乐的上限', '快乐是否随时间累加'],
        note:
          '伊壁鸠鲁把目标定在心的不受扰动：对死亡等的恐惧一旦消除即是 ataraxia，它与身体无痛一起构成人生目标的一种表述。关键的区分是动态快乐与静态快乐：前者伴随某个正在进行的过程（如闻到宜人的气味、听到悦耳的声音），后者是身心安好这一状态本身所带的快乐。由此得出快乐「不因持续时间而增加」——完全免于身体痛苦就已经是快乐的上限，再久也不会更高。',
        sourceIds: ['GL-2'],
      },
      {
        tradition: '斯多亚的唯德是善',
        nodeId: 'pt-western-ancient',
        caresAbout: ['只有德性是善', '健康财富名声属无关者', '被优选的无关者', '赞同是否在我们能力之内'],
        note:
          '斯多亚把好生活的内容压到一点：唯有德性是善，「唯有德性使人受益」；健康、财富、名声「既不使人受益也不使人受损」，故非善非恶。但主流斯多亚不让所有无关者等价——健康、财富、名声属被优选的一类，合乎自然，选取它们因而是恰当的。综述也指出这产生解释困难：某物既与幸福无关，又值得理性地追求，看来自相矛盾。由于德性只取决于赞同（心里接不接受呈现给它的那个判断），而赞同在我们能力之内，幸福「也将在行动者的能力之内、完全由他决定」。',
        sourceIds: ['GL-3'],
      },
      {
        tradition: '当代福祉理论',
        nodeId: 'pt-good-life',
        caresAbout: ['「对某人好」这一关系概念', '审慎价值与道德价值的区分', '快乐论／欲望论／客观清单论', '福祉与德性的关系'],
        note:
          '当代讨论先把问题切开：福祉是一种「审慎价值」（prudential value，指「对某个人而言是好的」，而不是笼统的好），要与美学价值或道德价值区分开。综述举的对照是，一幅画的美学品质是好的，却不是「对那幅画好」；捐款可能有道德价值并使他人受益，但「我在道德上是好的是否对我好，仍是一个未决问题」。只有切开之后，快乐论、欲望论与客观清单论才是在同一个问题上竞争。',
        sourceIds: ['GL-4'],
      },
    ],
    caution:
      '把德性、宁静、快乐说成「三个答案回答同一道题」走得太快。三个古典学派不只在答案上分歧，在「答案要满足什么」上也分歧：亚里士多德要一个能指导终身活动与教育的人的善；伊壁鸠鲁要一套解除恐惧与欲望的疗法，快乐的上限就在痛苦解除处，因此它不需要一个可以无限累加的量表；斯多亚要一个使幸福完全不受运气支配的方案，代价是把健康与财富逐出「善」的范畴，而这个代价在他们自己的体系里也留下了一处解释困难。当代福祉理论问的又是别的东西——「对我好」这一关系，它明确把道德上的好与对我而言的好分开，而古典方案通常不接受这个切分。所以不能把「德性论」直接读成一种客观清单论。',
    pending: [
      '斯多亚「被优选的无关者」与「善」的关系在综述里被标为存在解释困难，本条只转述这一困难，没有采纳某一种解读。',
      '古代怀疑主义（皮罗与学园两支）对好生活问题的处理没有进入本条；SEP Ancient Skepticism 本轮未打开。',
      'eudaimonia 的中文译名与 well-being／审慎价值的关系没有核对中文二手文献，本条只区分了英文术语。',
      '「快乐」一栏用的是伊壁鸠鲁，未涉及昔勒尼学派；把伊壁鸠鲁当作古典快乐论的唯一代表会遗漏差别。',
    ],
    sources: [
      {
        id: 'GL-1',
        title: 'SEP：Aristotle’s Ethics',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/aristotle-ethics/',
        locator: '§2 The Human Good and the Function Argument；§4 Virtues and Deficiencies, Continence and Incontinence；§8 Pleasure；§9 Friendship',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '功能论证与幸福在于灵魂理性部分依德性的活动；伦理德性由习惯养成，幼时习惯与理性成熟后的实践智慧两段；幸福的生活必须包含快乐；完满友谊需要外在资源与时间。',
      },
      {
        id: 'GL-2',
        title: 'SEP：Epicurus',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/epicurus/',
        locator: '§4 Psychology and Ethics',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '恐惧的消除即 ataraxia，与身体无痛一起构成人生目标的一种表述；动态快乐与静态快乐的区分，静态快乐是状态而非过程；快乐不因持续时间而增加，完全免于身体痛苦即量表顶端。',
      },
      {
        id: 'GL-3',
        title: 'SEP：Stoicism',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/stoicism/',
        locator: '§4.2 Virtue；§4.3 Indifferents',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '唯有德性是善、唯有德性使人受益；健康财富名声既不受益也不受损故为无关者；主流斯多亚区分被优选的无关者并承认其选取是恰当的，条目同时指出这一组合存在解释困难；幸福因只取决于赞同而完全在行动者能力之内。',
      },
      {
        id: 'GL-4',
        title: 'SEP：Well-Being',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/well-being/',
        locator: '§1 The Concept；§4 Theories of Well-being（§4.1 Hedonism、§4.2 Desire Theories、§4.3 Objective List Theories）；§5.2 Well-being and Virtue',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '福祉作为「审慎价值」需与美学价值、道德价值区分；「好」与「对某人好」的区别（画的美与捐款的道德价值两个对照）；我在道德上是好的是否对我好仍属未决；快乐论、欲望论、客观清单论三类理论的分列。',
      },
    ],
  },
  {
    id: 'cq-fa-and-the-rule-of-law',
    question: 'fa（法）要解决的秩序问题，和现代法治要解决的问题是同一个吗？',
    why:
      '两边都主张用一般的、公开的、不因人而异的规范取代因人而异的裁断，给出的理由也相似：靠在位者的个人能力不可靠。既然出发点这么近，差在哪里就值得逐项看——而差别落在这套规范首先约束谁。',
    nodeIds: ['pt-legalism', 'pt-law'],
    framings: [
      {
        tradition: '先秦 fa 传统',
        nodeId: 'pt-legalism',
        caresAbout: ['以非人格标准取代对个人能力的依赖', '官僚的选任、考核与监察', '赏罚', '君主是否应亲自介入'],
        note:
          'fa 指「一整套非人格的规范、法律、条例与制度方案」，被认为「比习惯性地诉诸在位者的个人能力更可靠」，要解决的是国家的治理难题。君主的位置最能看出这套规范朝哪个方向用力：他有权、甚至有责任在情势要求时更改法，同时被极力劝阻不要对现行法作任性干预；综述还指出这一传统的一个悖论——制度被设计成即使君主不贤不智也能运转。同一份综述另外提醒：「Legalist」这个标签会把研究窄化成一个问题——它与西方 rule of law 概念是什么关系；一旦 fa 思想的丰富与复杂被压缩到这一点上，讨论反而起反作用。',
        sourceIds: ['FA-1'],
      },
      {
        tradition: '现代法治理想',
        nodeId: 'pt-law',
        caresAbout: ['法治与「以法而治」的分界', '形式要件与程序要件', '官员是否只能依明确授权行事', '实质要件的争议'],
        note:
          '现代法治的分界线正好落在上一栏留空的地方：「以法而治（rule by law）几乎不对统治者施加任何法律义务」，而法治「要求对法的义务同等地适用于统治者与被统治者」；其典型形态是国家用法来控制公民，却尽力不让法被用来控制国家。形式要件包括一般性、公开性、不溯及既往、可理解、一致、可行、稳定，以及吻合——即官员的实际作为要与公布的规则相符；程序要件包括独立公正的裁判、律师代理、在场与质证、听取裁判理由。还有一处不对称：对普通人，未被明文禁止者即被允许；对国家与官员，则可能采取相反的推定——只能依明确的法律授权行事。是否把人权一类实质内容算入核心要件，本身仍有争议。',
        sourceIds: ['FA-2'],
      },
    ],
    caution:
      '共同点是真的：都用一般规范替代因人而异的裁断，都不信任在位者的个人德性或才干。但被保护的对象不同。fa 传统的规范首先向下和向内运作——约束民与官，使国家可治；君主可以更改法，只是被劝阻不要任性。现代法治的定义性要求恰恰是把义务同等地施加到统治者身上。所以「法家＝早期法治」是错的；但只写这一句否定也不够，因为「以法而治」这个概念恰好说明二者共享的是制度技术，分歧在于法对权力的方向。还要接住综述自己的提醒：一旦只从 rule of law 这一角度看 fa，就会漏掉这套思想对官僚考核、赏罚与君主自我抑制的关切，而那些才是它的主要议题。',
    pending: [
      '《商君书》《韩非子》相关篇目原文未核对，fa 一栏依据综述。',
      '「君主是否受 fa 约束」在综述 §5.2 被写成一种悖论式紧张（君权在理论上无限，实际上被制度设计抑制），本条转述这一紧张，未采纳某种解读。',
      '中国近代以来「法治」译名与 rule of law 的关系（综述提到自梁启超起的讨论）没有核对中文文献。',
      '本条只对照 fa 与法治，没有处理儒家「礼」与二者的三方关系；那需要另立一条可比问题。',
    ],
    sources: [
      {
        id: 'FA-1',
        title: 'SEP：Legalism in Chinese Philosophy',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/chinese-legalism/',
        locator: '§1 Defining the fa Tradition（含对「Legalist」标签与 rule of law 单一视角的警告）；§2.3 The rule by impartial standards and the principle of impartiality；§5.2 Entrapped Sovereign?',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          'fa 指一整套非人格的规范、法律、条例与制度方案，被认为比诉诸在位者个人能力更可靠；君主有权且有责在情势要求时更改法，同时被劝阻不要任性干预现行法；§5.2 的悖论式紧张（制度须能容纳不贤不智之君）；条目对「Legalist」标签与只从 rule of law 角度研究 fa 的警告。',
      },
      {
        id: 'FA-2',
        title: 'SEP：The Rule of Law',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/rule-of-law/',
        locator: '§3.1 Formal Aspects；§3.2 Procedural Aspects；§3.3 Substantive Theories；§6 The Rule of Law versus Rule by Law（含 §6.1、§6.2）；§2.4 The Rules of (English) Constitutionalism',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '「以法而治」几乎不对统治者施加法律义务，而法治要求义务同等适用于统治者与被统治者，并以「国家用法控制公民却不让法控制国家」描述前者；形式要件（一般性、公开性、不溯及既往、可理解、一致、可行、稳定、吻合）与程序要件（独立公正裁判、律师代理、在场与质证、听取理由）；对普通人与对官员的相反推定；实质要件是否属于核心仍有争议。',
      },
    ],
  },
  {
    id: 'cq-personhood-achieved-or-given',
    question: '一个人成为人，是既成事实还是在共同体中达成的？',
    why:
      '「是不是人」在中文里像一道是非题，但两边都发现它至少含两问：某物凭什么算作人格，以及一个人的人格地位能不能有程度、能不能被达成或失去。双方都在这个分叉上明确表态，只是各自处理的是不同的一支。',
    nodeIds: ['pt-african-personhood', 'pt-mind-self', 'pt-right-action'],
    framings: [
      {
        tradition: '非洲共同体主义伦理学',
        nodeId: 'pt-african-personhood',
        caresAbout: ['人格作为需要达成的地位', '品性与习惯性行为', '由身分界定的义务', '义务与权利的次序'],
        note:
          '这一支明确把人格当作成就：「一个个体可以是人类而不是人格」，人格地位要求符合某些基本规范与理想，由习惯性行为养成的品性来决定。该条目卷首所引的一段话取自门基蒂：人格「是必须去达成的那种东西」，经由「履行由自己的身分所界定的各种义务」而达成。条目还提出一个更强的主张：在这种道德里「义务胜过权利，而不是相反」，并把它与西方社会的道德体系对置——这是撰稿人本人的比较判断，不是学界的中立描述。',
        sourceIds: ['PH-1'],
      },
      {
        tradition: '分析形而上学对「人格问题」的处理',
        nodeId: 'pt-mind-self',
        caresAbout: ['人格问题与持续问题的分离', '「人格」一词的定义与适用条件', '我们根本上是什么', '判准而非地位'],
        note:
          '这一支先把问题拆成互相独立的几问，其中两问最相关：人格问题——「成为一个人格、而非非人格，是怎么一回事？我们这些人有什么是非人所缺的？」；持续问题——「一个人格要从一个时刻持续到另一个时刻，需要什么？」条目强调这两问「大体上互相独立」。这里的人格问题要的是「人格」一词的定义与适用条件，不是一个可以做得更好或更差的地位。',
        sourceIds: ['PH-2'],
      },
    ],
    caution:
      '中文的「人格」把两件事压在一起，而这两栏各自谈其中一件。非洲共同体主义伦理学谈的是规范性地位：可以逐步达成，可以做得好或不好，因而对一个人说「还没成人」在这套语汇里是有意义的。分析形而上学谈的是分类与判准：某物是不是人格，通常被当作有或无，不是程度问题。所以「非洲哲学主张人格是渐成的」与「分析哲学主张人格是既成的」不是同一命题的两个答案；把它们对立起来，会让人以为后者在否认德性养成，或前者在否认婴儿是人。真正要接着做的工作是把地位问题与判准问题的关系摆明：一个可被达成的道德地位，是否预设了一个不可被剥夺的分类地位。这一步本条没有完成，所以这里不给结论。',
    pending: [
      'SEP African Ethics 由 Kwame Gyekye 撰写，「人格是达成的」「义务胜过权利」都是他本人的立场陈述。要区分门基蒂的强共同体主义与吉耶凯自己的温和共同体主义，必须核对 Menkiti 1984 与 Gyekye 1997 原文，本轮没有做——因此 pt-african-personhood 页面上的三条立场目前仍缺各自的独立来源，不能用这一条来支撑其中任意一条。',
      '拉莫塞（Mogobe Ramose）对 ubu-ntu 的分析没有进入本条。本轮只在 IEP Hunhu/Ubuntu in Traditional Southern African Thought §3 确认了他对 ubu-／-ntu 的语义区分，不足以支撑一条独立立场的内容。',
      'Ubuntu 在政治与和解实践中的使用（IEP 同一条目 §4 记录了津巴布韦 1987 年团结协议、2008 年全面政治协议与南非真相与和解委员会）本条未展开；这与「人格由谁认定」相关，但需要另立比较轴。',
      '儒家的「成人」是否落在同一个分叉上，本轮未核对文本，不并入本条。',
    ],
    sources: [
      {
        id: 'PH-1',
        title: 'SEP：African Ethics',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/african-ethics/',
        locator: '§4 Moral Personhood；§9 The Ethics of Duty, Not of Rights',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '一个个体可以是人类而不是人格，人格地位需符合基本规范与理想并由品性决定；条目卷首引门基蒂「人格是必须去达成的那种东西」，经由履行身分所界定的义务而达成；§9 主张在这种道德中义务胜过权利，并与西方道德体系对置（撰稿人为 Kwame Gyekye，此为其本人立场）。',
      },
      {
        id: 'PH-2',
        title: 'SEP：Personal Identity',
        kind: '学术综述',
        url: 'https://plato.stanford.edu/entries/identity-personal/',
        locator: '§1 The Problems of Personal Identity（人格问题与持续问题的措辞及二者大体独立的说明）',
        checked: 'verified',
        checkedOn: '2026-09-11',
        supports:
          '§1 列出刻画、人格、持续、证据、数量、人格本体六问；人格问题问「成为一个人格而非非人格是怎么一回事」，持续问题问「一个人格要从一个时刻持续到另一个时刻需要什么」，并说明两问大体独立。',
      },
    ],
  },
];

const seenIds = new Set<string>();

for (const item of comparativeQuestions) {
  if (seenIds.has(item.id)) {
    throw new Error(`重复的可比问题 ID：${item.id}`);
  }
  seenIds.add(item.id);
  if (item.nodeIds.length === 0) {
    throw new Error(`可比问题 ${item.id} 没有挂到任何条目上`);
  }
  for (const nodeId of item.nodeIds) {
    if (!getNodeById(nodeId)) {
      throw new Error(`可比问题 ${item.id} 指向了不存在的节点：${nodeId}`);
    }
  }
  if (item.framings.length < 2) {
    throw new Error(`可比问题 ${item.id} 至少要有两个传统的框架，否则没有比较`);
  }
  const seenTraditions = new Set<string>();
  for (const framing of item.framings) {
    if (seenTraditions.has(framing.tradition)) {
      throw new Error(`可比问题 ${item.id} 里「${framing.tradition}」出现了两次；渲染层以它作为 key`);
    }
    seenTraditions.add(framing.tradition);
    if (framing.nodeId && !getNodeById(framing.nodeId)) {
      throw new Error(`可比问题 ${item.id} 的「${framing.tradition}」指向了不存在的节点`);
    }
    for (const sourceId of framing.sourceIds) {
      if (!item.sources.some((source) => source.id === sourceId)) {
        throw new Error(`可比问题 ${item.id} 的「${framing.tradition}」引用了未登记的来源：${sourceId}`);
      }
    }
  }
  const citedSourceIds = new Set(item.framings.flatMap((framing) => framing.sourceIds));
  for (const source of item.sources) {
    if (!citedSourceIds.has(source.id)) {
      throw new Error(`可比问题 ${item.id} 登记了没有任何栏位引用的来源：${source.id}；它不会被渲染`);
    }
    if (source.checked === 'verified' && !source.checkedOn) {
      throw new Error(`可比问题 ${item.id} 的来源 ${source.id} 标为已核验但没有写核验日期`);
    }
  }
  if (!item.caution.trim()) {
    throw new Error(`可比问题 ${item.id} 缺少差异提示`);
  }
}

export function comparisonsForNode(nodeId: string): ComparativeQuestion[] {
  return comparativeQuestions.filter((item) => item.nodeIds.includes(nodeId));
}
