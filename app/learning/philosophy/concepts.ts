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
 * 同形异义按两条概念处理，不合并：「人格」在持续条件与共同体中的道德地位两种
 * 用法下是两个问题，合并它们会让读者以为自己在学同一件事。
 *
 * 译名撞车按同一条原则处理。epistemic justification 本站曾译「认知证成」，
 * 与「政治正当性」共用一个中文词；2026-09-19 起改用「认知证成」（依華文哲學
 * 百科《認知證成及其結構》的译名），对应的内部主义／外在论也改称内在论／
 * 外在论。撞词消掉，读者才不会以为两页在讲同一件事。
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
    short: '把过去已经发生的全部事实和自然规律放在一起，未来就只剩一种走法：接下来每件事会怎样发生，都已经被它们固定住了。',
    detail:
      '它说的是世界长什么样，不是我们能算出什么。一个被决定的世界完全可以无法预测：起始条件测不准，微小的误差又会被一路放大到不能用；反过来，一个含有随机环节的世界，统计上照样可以算得很准。所以「算不算得出来」这件事，判定不了决定论的真假。',
    distinctions: [
      {
        from: '宿命论',
        note: '两句话听起来都像「已经定了」，分界在你自己算不算数。宿命论说不管你怎么做，某些事照样发生；决定论说结果由前因固定，而你的选择本身就是这些前因里起作用的一环——换一个选择，后面确实会不一样。从决定论走到「反正都一样」，中间还缺一整段论证。',
      },
      {
        from: '可预测性',
        note: '容易混，是因为「算得出」听起来就像「早已定好」。但那是认知能力的问题——谁能测量、能算多久；决定论问的是世界有没有第二条路。算不出来，不等于路不止一条。',
      },
      {
        from: '因果性',
        note: '两边都在说「有原因」，强度却差得远。日常说的「凡事有因」只要求某些事有原因；决定论要求每一个事件、连同它发生的具体样子，都被过去与规律完整固定。同意前一句，离同意后一句还很远。',
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
    short: '不论怎么做，我们最后做出的都只能是实际做出的那一件事；对于将要发生的事，人使不上力。',
    detail:
      '哲学里支持它的论证多半不走物理因果，而走逻辑或神学：关于未来的句子现在就已经有真有假（「你明天会辞职」这句话今天就已经或真或假，而真的就改不了），或者一个全知者早就知道结果。因果决定论只是通向它的三条路线之一，不是同一个主张。',
    distinctions: [
      {
        from: '决定论',
        note: '分界在你的选择还算不算数：决定论承认你的选择是原因链里起作用的一环，换一个选择后面就不一样；宿命论说的是换了也没用。混用二者最常见的后果，是让一句「反正都定了」冒充结论。',
      },
      {
        from: '认命的态度',
        note: '日常说「认命吧」，说的是面对未来的一种心情；宿命论是一个有前提、有反驳的命题。判断它对不对要看论证，不看语气——一个人可以完全不认命，同时认为宿命论为真。',
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
    short: '把技术看成一股自己往前走的力量：它按自己的路线发展，谁也拦不住、退不回去，社会怎么变因此主要由技术决定。',
    detail:
      '二十世纪的技术伦理大多是在放下这个假设之后才展开的：它转而强调技术走成今天这样是人一步步选出来的结果，尽管未必是任何人当初想要的结果。因此要解释一项技术带来了什么，就得把设计、劳动、资本、制度和使用习惯一并算进去，而不是说一句「技术发展到这一步了」就完事。',
    distinctions: [
      {
        from: '决定论（因果决定论）',
        note: '共用「决定论」三个字，问的事情大小差得远：那边问世界上全部事件是否都被过去与规律固定，这边只问社会变化的主导原因是什么。承认其中一个，不会自动承认另一个。',
      },
      {
        from: '技术工具论',
        note: '它主张技术本身只是工具，好坏全看谁在用、用来做什么。它与技术决定论方向正好相反：一个说技术自己推着社会走，一个说技术本身什么也不决定。先讲「技术改变了一切」、再讲「技术只是工具，看人怎么用」，等于在两个不能并存的说法之间来回站队。二十世纪的技术哲学对这两个说法都提出过批评。',
      },
      {
        from: '「技术无关紧要」',
        note: '反对技术决定论的人常被听成这个意思，其实差得远。否认技术自行决定历史，不等于认为技术没有改变什么：它照样重塑人能做到什么、注意力落在哪里、风险由谁承担、权力怎么分配。被否认的只有「这些变化由技术自己定」这一句。',
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
    term: '认知证成（信念有没有理由）',
    original: 'epistemic justification',
    short:
      '你相信一件事，而且拿得出支持它的理由或证据——不是碰巧信对了，也不是因为想信才信。「证成」是 justification 的译名，也译作辩护、确证。',
    detail:
      '它要解决的问题是：相信一件事而且碰巧信对了，还算不上知道；知识另外要求这个信念是被理由撑住的。通行做法把知识拆成三条——事情是真的、当事人确实相信它、这个信念有理由支持。三条合起来够不够用，正是盖梯尔问题要追问的：有理由的真信念仍可能只是碰巧撞对，所以不能反过来把「有理由」直接定义成「够得上知识」。另一处分歧是理由摆在哪里：内在论要求它落在当事人这一侧——取决于他的心理状态，或取决于他一经反思就能知道的东西；外在论不这样要求，信念的来源在事实上可靠就够了。（这两派大陆文献多作内在主义／外在主义。）',
    distinctions: [
      {
        from: '政治正当性',
        note: '这两条本站此前共用「正当性」三个字，问的却完全不是一件事：政治正当性问权力与制度凭什么可以强制、可以要求服从；这里问的是一个信念有没有证据撑着，与它在道德或法律上站不站得住无关。为了不让读者以为两页在讲同一件事，本站把这一条从旧译「认知正当性」改成「认知证成」。',
      },
      {
        from: '主观确信',
        note: '「我很确定」说的是一个人心里的把握有多大，那是关于他的心理事实；证据够不够是另一回事。极有把握而毫无根据、将信将疑却证据充分，两种人都不少见。',
      },
      {
        from: '为真',
        note: '有理由的信念可以是假的——证据齐备，事情偏偏不是那样；碰巧为真的信念也可以毫无理由。把这两件事绑在一起，就看不出盖梯尔问题难在哪里。',
      },
      {
        from: '「已经当众辩护过一回」',
        note: '中文里「辩护」「证成」都像是说当事人已经论证过一轮，这个条件不作此要求。按日常语感读，你抬头看见桌上有杯子因而相信有杯子，就会因为「没辩护过」被排除在知识之外——绝大多数靠眼睛耳朵得来的知识都会跟着出局。',
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
    short: '一个政治权威凭什么有资格统治：它的强制和命令能不能讲出道理来，而不只是事实上没人反抗、或者已经写进了法律。',
    detail:
      '一个中文词底下压着至少三个问题：人们事实上认不认这个秩序（韦伯问的那种描述性问题）；它的强制权力讲不讲得出道理；公民是不是因此负有服从的义务。三问的答案互不决定——可以人人服从而讲不出道理，也可以讲得出道理而公民仍不欠这份义务。不分开问，一句「这个政权有没有正当性」就会同时被当成三个判断在用。',
    distinctions: [
      {
        from: '合法性（符合法律）',
        note: '中文「合法」字面就是合于现行法律；而一个政权有没有资格立这条法，正是这里要问的。译成「合法性」，等于把待证的结论先塞进问题里。',
      },
      {
        from: '认知证成',
        note: '「证成」与「正当性」在中文里像同一路词，问的却是两件事：认知证成问一个信念有没有理由、有没有证据撑着（本站为此把它从旧译「认知正当性」改了名）；这里问的是统治的资格。一边成不成立，对另一边毫无影响。',
      },
      {
        from: '有效统治',
        note: '一个稳定、被服从、命令下得动的政权，是事实上的（de facto）权威。它可以完全不具备统治的资格——「管得住」和「有权管」是两回事，而前者常被当成后者的证据。',
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
    short: '在自己生活的某一片范围里，由这个人自己说了算：别人要插手，得先经她同意，否则就不算正当。',
    detail:
      '难处在于什么样的决定才真算「她自己作出的」，各家说明并不一致。有一路要求协调：行动所出自的那个动机，要与她自己的立场对得上。至于「她自己的立场」由什么构成，这一路内部又分几家——有的看高阶欲望（我希望自己被哪一个欲望推动去行动），有的看评价判断（我认为哪些事最值得做），还有的要求这两者之间也对得上。它们的共同点是：当下最强的那个欲望推着你走，还不足以让这个行动算是自主的。',
    distinctions: [
      {
        from: '随机或无来由的选择',
        note: '因为自主常被说成「不受决定」，随机看起来像是它的极致。其实反了：自主要求动机与我的立场对得上，而凭空插进来的动机更不像是我的，只会让行动更不自主。',
      },
      {
        from: '关系自主',
        note: '不是这个概念的反面，而是对同一种能力提出的另一种说明；争点在于检验的条件只放在个体内部，还是也要放进她所处的关系里。',
      },
      {
        from: '自足',
        note: '中文里「自主」听着就像「不用靠别人」。能自己作决定与不依赖他人是两件事：把自主读成不需要任何人，照护与依赖的问题就被直接抹掉了。',
      },
      {
        from: '民族自治',
        note: '同一个词的政治用法，指一个群体有权自我治理。两者是类比关系，用来互相说明可以，用来互相推论不行：群体有权自治推不出其中每个人有多大决定权，反过来也一样。',
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
    short:
      '一个人有没有能力自己作主，本身就是被她所处的关系、别人对她的承认、她够得着的资源养出来的；所以判断一个选择是不是她自己作主，不能只看她心里的动机怎么排。',
    detail:
      '推动它的是女性主义哲学整理出的一批难例：习惯性地压低自己的需要；在长期受限的处境里，把够不着的东西说成自己本来就不想要（适应性偏好）；以及把压迫当成理所当然的日常做法。这些情况算不算自主受损，理论之间没有共识。一种回应把条件定得很低：只要人没有陷进疼痛、恐惧、焦虑、抑郁一类障碍，她的偏好就算她自己的；另一些则要求更多——程序上的、或她得具备某些规范能力、或经得起对话检验、或对内容本身提出实质要求。两边都要付代价：条件定得太低，压迫下形成的偏好一律算自主；条件定得太高，理论就替当事人决定了什么才算她真正想要的。',
    distinctions: [
      {
        from: '个人自主',
        note: '关系自主不否认一个人应当自己治理自己，分歧在这项条件该在哪里检验：一边只看动机与她自己的立场协调不协调，另一边主张她得到的承认、够得着的资源与她所处的关系也得算进这次检验。',
      },
      {
        from: '「受关系影响就不自主」',
        note: '这是把这个概念读反了最常见的一次。若凡是被关系塑造过的选择都不算自主，就没有哪个选择算自主了——人的偏好没有一条不是被养出来的。难处恰恰在于分辨：哪些塑造是撑着她的，哪些是把她压下去的。',
      },
      {
        from: '依赖',
        note: '需要他人照护是一种处境，不是自主的丧失。把两者等同，被照护的人就自动失去了决定权——而这正是关怀伦理要挡住的那一步。',
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
    short: '凭什么说过去或将来的某个人，就是现在的这一个人——要满足什么条件，才算同一个人。',
    detail:
      '「人格同一性」这个名目下不是一个问题，而是一组彼此松散相连、还常常不被分开的问题。日常说这个词，多半指那些「让我成为我这种人」的特征（哲学里叫刻画问题）；哲学讨论多数针对的却是持续问题：一个人凭什么跨过时间还算同一个人。两者的答案互不决定——弄清了什么让我成为这种人，并没有回答将来那个人凭什么还是我。',
    distinctions: [
      {
        from: '身份认同（性别、族群、国族）',
        note: '中文都说「身份」，所以最容易撞在一起。它问的是一个人被归入哪些群体、用什么自我理解过日子；持续问题问的是跨过时间还是不是同一个人。一个人改换了自我认同，并没有因此变成另一个人。',
      },
      {
        from: '共同体中的人格',
        note: '非洲伦理学里的「人格」问的是一个人在共同体中取得了什么样的道德地位：那是有程度的，可以被承认也可以被拒绝承认。这里问的是跨过时间还算不算同一个人，与地位高低无关。',
      },
      {
        from: '自我感',
        note: '「我觉得我还是我」是一个心理事实，不是判准。失忆的人可能没有这种感觉，却仍是同一个人；记错了的人可能感觉连贯，记忆本身却是假的。失忆与错误记忆的案例正是靠这一区分才问得清楚。',
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
    short: '一批非洲伦理学论述在「是不是生物学意义上的人类」之外另问一句：这个人在共同体里算不算一个「人」。这问的是一种道德地位——而它是生来就有，还是要一步步挣得，正是争论所在。',
    detail:
      '最常被引用的是门基蒂（Ifeanyi Menkiti）的表述：传统非洲的各个社会通常认为人格要靠获得。一个人越切实地履行自己位置上的那些义务、越深地参与共同生活，获得的人格就越多；起点是幼年那种还没有道德功能的「它」，终点是具备成熟伦理感的「人」。这是其中一家的主张，不是整个传统的共识：把人格说成有程度的成就，会被追问它是不是削弱了每个人不可取消的地位、能不能与个人权利和批判的余地相容。《人格、共同体与 Ubuntu》一页记录了反对这种渐进说法的立场。',
    distinctions: [
      {
        from: '人格同一性',
        note: '中文都叫「人格」，问的是两回事。那边问同一个人跨过时间的持续条件，答案对「谁算共同体的完整成员」不起作用；反过来，一个人在道德上取得了什么地位，也定不了他失忆之后还是不是原来那个人。',
      },
      {
        from: '「集体高于个人」的标签',
        note: '说人格在关系中达成，不等于说共同体可以取消个人，也不等于任何一种现成的西方共同体主义。贴上这个标签，等于跳过了「达成」到底要求什么这个真正的争点。',
      },
      {
        from: 'Ubuntu 作为口号',
        note: 'Ubuntu 是南部非洲语言里的一个词，常被转述成「人因他人而成为人」。把这句话当成已经成立的结论来引用，就会跳过它究竟主张什么、由谁主张、遭到哪些反对——而这几问正是这一条要处理的。',
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
    short: '我们最好的科学理论对世界的描述大致是对的，它讲到的那些东西也真的存在——包括电子、场这类谁也没法直接看见的东西。',
    detail:
      '「实在论」三个字本身只是「主张某类东西真的存在」的通用叫法：对感觉、对桌椅、对数与集合，都可以各做一个实在论者。科学实在论特别的地方在于，它把这份主张一路推到电子、场、基因这些看不见的东西上——争论就集中在这一步。它其实同时主张三件事：世界不依赖人心而在；理论的句子按字面读，说「有电子」就是在说真有电子这种东西；理论告诉我们的内容算得上知识，看得见的部分与看不见的部分都算。反实在论只要在其中一件上反对，就已经是反实在论了。',
    distinctions: [
      {
        from: '常识',
        note: '相信桌椅存在也叫实在论（对外部世界的实在论），所以两者常被当成一件事。反实在论里最重要的一支是经验主义，它反对的是关于看不见之物的知识，从来没有反对过桌椅。',
      },
      {
        from: '佛教语境中的「实在」',
        note: '中观论辩里被否定的是自性——不依赖别的东西、自己就能站住的那种本性；科学实在论争的是理论说的对不对。两处的「实在」不是同一个争点，不能拿一边的结论去判另一边。',
      },
      {
        from: '关于种族的实在论',
        note: '那里争的是「种族」这个社会分类指着什么，判断它要用的证据与科学理论预测得准不准无关。把两处的「实在论」当成同一个立场，就会以为反对其中一个就得反对另一个。',
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
    short: '争的不是有没有人被当作某个种族看待，而是「种族」这个词到底指着什么东西——如果它确实指着什么的话。',
    detail:
      '已经被放弃的一种主张是种族自然主义：认为每个种族的成员共有一套遗传下来的内在特征，这套特征还能解释他们的行为与文化倾向。反对它，今天在哲学界与科学界都已是共识；分歧从这里才开始。种族怀疑论说：既然那样的生物本质不存在，任何意义上的种族也就不存在；另一些立场主张种族是被社会建构出来的真实类别，或者主张可以用人群遗传学重新界定它。与「它是什么」并排的还有一个「该怎么办」的问题：应当取消这个范畴，还是保留它。',
    distinctions: [
      {
        from: '科学实在论',
        note: '共用「实在论」三个字，问题不一样：那里问看不见的理论设定是不是真的存在，这里问一个社会分类指着什么。两处各有各的证据，不能互相接管结论。',
      },
      {
        from: '「社会建构因此不真实」',
        note: '中文里「建构出来的」听着就像「假的」。而建构论恰恰是主张种族存在的一种立场：被建构出来的类别照样可以有稳定的效力与可检验的后果——货币也是建构出来的，没人因此认为它不起作用。',
      },
      {
        from: '族群（ethnicity）',
        note: '日常常被混用，这一讨论里却分开处理：族群以文化归属、语言遗产、宗教或声称的共同祖先为核心，种族则被挂在那些被当成天生的体貌特征上。',
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
    short: '任何事情都要靠一堆条件凑在一起才出现、才继续在；条件散了，它也就不在了。没有哪一件事是不依赖别的东西、自己就能成立的。',
    detail:
      '同一个词在不同阶段承担的分量不同。早期教说里它的形态较朴素，四圣谛第二条就是一例：苦的生起有它的原因和条件。中观（龙树一系）把它推到最强，用它否认「自性」（svabhāva）——说某物「以自性存在」，意思是它自己就是世界的一块基本构件，不依赖任何别的东西，是一连串依赖关系一路追到底之后的终点；龙树论证的是根本没有这样的终点。这就是中观所说的「空」。中文里「空」最容易被读成「没有、不存在」，而这里要空掉的只是自性：桌子、疼痛、因果关系都照样在，只是没有一样能离开条件自己站住。龙树也并不因此宣称因果不成立，他说的是我们对因果的理解建立在一个错误前提上——以为因和果各自以自性存在，彼此独立，也独立于认识它们的心。',
    distinctions: [
      {
        from: '「一切皆幻」',
        note: '这是中文教学里最常见的一次误读，多半来自把「空」读成「没有」。否认自性不是否认因果，也不是说日常事物与日常说话都不作数；被拒绝的只有一点：这些东西由自身成立、不依赖条件。',
      },
      {
        from: '决定论',
        note: '「一切都由条件决定」听起来就像「未来只有一条路」。缘起讲的是依赖关系——离开条件它就不成立，而不是讲「接下来只可能发生这一种事」。把两者叠在一起，就会得出「佛教主张决定论」这种没有依据的结论。',
      },
      {
        from: '「万物互联」式的笼统说法',
        note: '缘起在中观里是一件用来做否定论证的分析工具：拿它去拆「某物自己就能成立」这个假设。它不是一句关于整体和谐的感叹，用成感叹，后面的论证就全落空了。',
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
    short:
      '一个人的感受方式、判断和行动倾向，可以靠读书、养成习惯、依礼而行（礼是一套关于待人接物该怎么做的规矩与仪节）、反省自己，以及在具体事务上反复练，一点一点改造过来。修养讲的就是这件事：改什么，靠什么改。',
    detail:
      '修养、工夫、修身是同一件事的三种叫法，侧重不同而所指相连，这里不加区分。它要回答的不是「人该做什么」，而是「一个人怎样才会变得做得到」。朱熹的人性论解释了同一条路径为什么对不同人难度不同：每个人的基本倾向受气质禀赋、家庭与社会环境等条件制约，由此形成各不相同的性情、才智与修养资质。王阳明一路则把知与行看成一件事，认为理不在心外，因而先把伦理学的道理研究明白，并不是动手去做的前提。',
    distinctions: [
      {
        from: '相容论',
        note: '把修养论直接归进自由意志争论的某一方，等于把它没有提出的问题塞给它：相容论要判定的是行动在决定论下还算不算自由，修养论要问的是一个人的性情能不能被改造、怎样改造。两个问题的答案互不决定。',
      },
      {
        from: '自我提升技巧',
        note: '两边都在说「把自己变好」，范围不同。修养论把个人训练与家庭、礼制和治理连在一起，不是一套一个人关起门来就能执行的方法——离开这些关系，它要求的很多事根本无从练起。',
      },
      {
        from: '「靠悟不靠学」',
        note: '王阳明说理不在心外，很容易被读成不必用功。他反对的是把理论研究当作动手的前提，不是反对训练本身；读成反对用功，就会漏掉「知行合一」到底要求什么。',
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
    term: '认识手段',
    original: 'pramāṇa',
    short:
      '古典印度哲学用它指一件事：能让人真正认识到某个东西的合格途径。知觉算一种；类比、「听别人说」这些算不算，各学派争了上千年。汉译佛典把这个词译作「量」——知觉叫现量，推理叫比量。',
    detail:
      '常被列入的候选是知觉、推理、类比与证言（凡是以别人的话为根据得到的认识），另有「假定」（arthāpatti）、「非认知」（anupalabdhi）等更有争议的候选。分歧不是术语之争：胜论与佛教诸家否认证言是独立的一种，理由是转述之所以可靠，最终仍要回到最初那个人的知觉或推理。翻译上还有一层麻烦——jñāna 常被译作 knowledge，但梵语允许说「假的 jñāna」，英文 knowledge 不允许这样说，所以译作「认知」更稳。',
    distinctions: [
      {
        from: '三段论',
        note: '印度的五支论证（一种分五步走的论证格式）看起来像换了名字的三段论，其实连着一整套关于认识途径的分析：它要回答的问题、评判论证好坏的标准，都与欧洲逻辑不同。',
      },
      {
        from: '「可信信息来源」清单',
        note: '它问的是哪一类过程能生成真认知，不是在列举哪些渠道靠得住。一个渠道可靠，与它是否算一种独立的认识途径，是两件事——证言之争争的正是后一件。',
      },
      {
        from: '认知证成',
        note: '两套讨论可以对照，重心却不同：证成问一个信念被什么撑着，量问的是哪一类过程能生成真认知。而且古典印度认识论是不是在处理同一个「有理由的真信念」问题，在当代研究中本身就有争论。',
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
    short:
      '因为别人说了，你就相信、就知道了。哲学里的「证言」不限于法庭上宣誓作证——路人指的方向、课本上的一句话、朋友转述的消息，全都算；争论在于这种信念的理由，能不能还原成听者自己的知觉、记忆与推理。',
    detail:
      '同一件事的两个版本就能看出难处：告诉你比赛结果的若是你早就知道很靠谱的体育记者，你的信念显然有理由；若是一个素不相识的人，你既不知道他是不是常说真话，也没有理由怀疑他，那你的信念有没有理由就不清楚了。还原论要求听者另外拿得出理由支持说话者可靠；非还原论主张只要没有反面线索，接受别人所说本身就已经正当。除这一条争线外还有两条：证言只是把已有的知识从说话者搬到听者那里，还是本身也能生成新知识；判断听者的信念有没有理由，能不能只看听者这一侧的情况。',
    distinctions: [
      {
        from: '专家意见',
        note: '「听别人的」容易让人只想到专家。证言问题涵盖一切以他人陈述为根据的信念：问路、看课表、读新闻都在内。只盯着专家，日常绝大多数知识的来源就被漏掉了。',
      },
      {
        from: '「二手的所以更弱」',
        note: '这是听起来最像常识的一句话，却正是争点本身：需不需要为接受别人所说另找理由，还原论说要、非还原论说不要。先把它当结论，整场争论就没有了。',
      },
      {
        from: '法庭证言',
        note: '中文「证言」几乎只在法律场合出现，这是中文读者进入这个概念的第一道坎。哲学讨论不以宣誓、程序或身份为界：制度化的作证只是其中一种情形，而且远不是最常见的那种。',
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
    short: '一个人做了某件事，而且她自己明白那在道德上是错的——单凭这两点，她就该受谴责；这个「该」不靠谴责她能带来什么好处来支撑。',
    detail:
      '这个界定出自佩雷布姆，「基本」二字是用来排除东西的：不只排除「谴责有用」这类看后果的理由，也排除靠事先约定或相互协议撑起来的理由——这种「该」不以任何进一步的理由为条件。责任怀疑论针对的正是这一种责任，而不是全部责任实践。佩雷布姆本人拒绝以应得为基础的责备，却主张若干常规的责备做法可以另找依据：保护潜在受害者、修复人际与道德共同体中的关系，以及道德养成。',
    distinctions: [
      {
        from: '一切谴责与惩罚',
        note: '为预防、保护、教育或修复而施加的限制，不需要先证明当事人「本来就该」受苦。因此放弃基本应得，并不等于放弃全部责任实践——这是读懂责任怀疑论的关键一步。',
      },
      {
        from: '法律责任',
        note: '法律上的可归责有自己的条件与目的（举证、时效、政策考量），不是这个概念的应用题。把两者对齐，一个形而上学结论就会被直接读成刑罚主张。',
      },
      {
        from: '报应情绪',
        note: '想让做错事的人吃点苦头，是一种反应；「她配得受责」是一个需要理由支持的主张。反应真实存在，不等于主张已经成立。',
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
    short:
      '道德运气指这样一种情形：一个人被评价的那件事，有很大一块不是他能控制的（结果如何、碰上什么处境、生成什么性情），而把功过算在他头上仍然是正当的。定义里的「仍然是正当的」这半句正是争点：运气会改变我们实际怎么评价，谁都承认；争的是这样评价站不站得住——也就是究竟有没有道德运气这回事。',
    detail:
      '问题的一个常见起点是康德式直觉：善良意志的价值不在于它做成了什么，即使命运不佑、竭尽全力仍一无所成，它也像宝石那样自身发光。日常评价却确实随结果、处境、性格与因果经历而变——同样是酒后开车，撞到人和没撞到人，受到的责备相差很远，而司机能控制的部分是一样的。两边都要付代价：严格守住控制原则（只就一个人能控制的事去评价他），大量日常归责会一起失效；承认运气可以改变责备，就得解释这在什么意义上还算公平。',
    distinctions: [
      {
        from: '认知运气',
        note: '共用「运气」二字，问的事情不同：那边问一个真信念是不是只是碰巧为真、够不够称为知识，不问评价一个人公不公平。混起来，就会拿归责的直觉去判知识的条件。',
      },
      {
        from: '结果责任',
        note: '「你得为这个结果负责」可以指该赔、该修补，也可以指该受更多谴责。两个判断不一样：撞坏了东西要赔，与撞坏了东西因此人品更差，不能互相推出。不分开，讨论就会在赔偿与谴责之间来回滑动。',
      },
      {
        from: '「运气无处不在所以无人可责」',
        note: '这是把内格尔式论证一路推到底得到的一种立场（列维的「硬运气」观：运气既然无处不在，人与人之间就不存在足以支撑应得的差别）。它是那条论证可能的去处之一，不是论证本身的结论——内格尔本人并未完全接受这个怀疑论结论。把它当成「道德运气」这个词的意思，就会以为承认运气有影响等于取消全部责备。',
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
    short: '一个信念之所以是真的，靠的是运气，而不是靠它所依据的那些理由。盖梯尔案例就是这样：信念是真的，也有理由支持，却仍然不算「知道」。',
    detail:
      '盖梯尔由此得出一个结论：有理由的真信念即使是知识的必要条件，也不够成为充分条件——三条都满足了，仍可能不算知道。一条自然的回应是给分析补上一条「不许靠运气」的条件，但这一补会把整个分析的结构改掉：一旦写进「这个信念不是仅仅碰巧才为真」，这句话里已经含着「它是真的」和「他确实相信它」，原来那三条就不再各自独立了。',
    distinctions: [
      {
        from: '道德运气',
        note: '那边问的是运气之下评价一个人还算不算公平，这边问的是一个信念够不够称为知识。把两者当成同一个「运气问题」，就会拿归责的直觉去判断知识的条件。',
      },
      {
        from: '瞎猜对了',
        note: '两种情况都是「碰巧说对」，难处却只在前一种：认知运气麻烦在当事人确实有理由、做得也没错，却仍不算知道。毫无理由的猜中根本进不了这个问题——没人认为它是知识。',
      },
      {
        from: '怀疑论',
        note: '指出某个信念只是碰巧为真，不等于主张我们什么都不知道。这是在分析「算不算知识」的条件，不是在否认知识的范围；两者的结论强度差得远。',
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
    short: '说一个人「要负责」，至少可以是在说三件不同的事：这件事出自她（可归属性）、她可以被要求讲出理由（可要求说明）、她可以被追究并承担后果（可追究性）。',
    detail:
      '分开它们，是为了让争论不至于各说各话：同一个人完全可能在「这事确实出自她」的意义上要负责，而在「该不该罚她」的意义上不必负责。这一分法起于沃尔夫与沃森之争，争的首先是三者里的第一个：一件事凭什么算「出自她」。一种回答是：条件在于她不只按当下最强的那个欲望行动，而是按她自己认可的那些欲望行动——她既能依自己的意志支配行为，又能依自己的评价系统支配意志。文献里把一个人认可的那一套叫作她的「真我」，这种回答因此叫作「真我」理论。要当心的是这三个名称在不同作者笔下并不指同一件事：肖梅克把可归属性对应品格、可追究性对应对他人的顾念、可要求说明对应评价判断；史密斯与希罗尼米用「可要求说明」指更接近可归属性的立场；佩雷布姆用它指一种更容纳责任怀疑论的责任。本站统一采用这三个中文译名，遇到具体作者时再说明他自己的用法。',
    distinctions: [
      {
        from: '因果上的原因',
        note: '中文「是他造成的」和「该他负责」几乎连着说，所以最容易并成一句。造成了某个结果与可以被追究不是一回事；把两者对齐，「谁碰到的谁负责」就会冒充论证。',
      },
      {
        from: '制度职责',
        note: '岗位与角色规定的义务，不必先解决「这件事出自谁」。追问「谁本该做这件事」与追问「这件事出自谁」是两个问题：值班的人没做，未必是他动的手；他动了手，也未必归他管。',
      },
      {
        from: '修复责任',
        note: '一个人即使不配受谴责，也可能因为角色、能力或关系而应当出面补救。把修复挂在谴责底下，只要断定「不怪他」，大量本该做的事就会一起消失。',
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
    short:
      '一句话是真是假、一件事是好是坏，要先问「相对于什么」才定得下来——相对于某个文化、某套语言、某个评价者。在它所主张的那个领域里，没有一个超出全部参照、对谁都成立的标准。',
    detail:
      '标准的定义方式是共变：某样东西 x（价值、认识或伦理规范、判断，甚至世界本身）依赖另一样东西 y（文化、语言、一套概念、一套信念）并随它而变，y 换了 x 也跟着换。用它反对什么来说更清楚：它反对绝对主义（至少某些真理或价值适用于一切时代与地方）、客观主义（一句话真不真，与谁在何时何地作判断无关）、一元论（同一个争议上不可能有一个以上的正确判断），以及把「真是客观的」与「正确答案只有一个」合在一起的实在论。各版本的分歧在于：相对于什么而变，以及范围有多大——是全部领域还是某一个领域，强到什么程度。',
    distinctions: [
      {
        from: '主观主义',
        note: '两者的差别只在相对于谁：主观主义把真或正当相对到每一个个人，一般所说的相对主义相对到群体。代价因此不同——退到个人这个参照，判断就不再能在人与人之间互相校对，而这种「至少同一群人还能对账」的性质，正是许多相对主义者看重的长处。',
      },
      {
        from: '描述性的文化差异',
        note: '各地的道德信念事实上不一样，这是人类学能支持的观察；「所以真或正当只相对于群体」是一个哲学主张。从前者走到后者需要另一段论证，而这一步常被跳过。',
      },
      {
        from: '「什么都说不清」',
        note: '相对主义主张真值相对于某个参照，不是主张无从判断。参照一旦给定，判断照样有对错——这也是它与「怎么说都行」最要紧的分界。',
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
      '使某个东西成为某一种心理状态的，不是它由什么材料做成，而是这个状态在因果网络里占的位置——什么引起它，它又引起哪些别的心理状态和哪些行为。位置对上了就算同一种状态，所以同一种状态可以由不同材料实现。',
    detail:
      '把位置而不是材料当判准，主要动因是多重实现：只有这样，才可能有一种「更具包容性、不以自己这个物种为中心」而又与物理主义相容的心灵理论——章鱼、外星生物乃至机器，材料不同也可以处在同一种心理状态。它面对的经典反对是缺失感受质：感受质指体验本身的那种质地，疼是什么滋味、看到红是什么样子。这条反对说，似乎可能存在一种与常人功能完全一样、内部却没有任何这类质地的存在者；如果这真有可能，那么把因果位置说清，就还没有把心理状态说尽。',
    distinctions: [
      {
        from: '类型同一论',
        note: '两者出发点相同——都把心理状态当作自然界里的东西，分歧在定在哪一层：类型同一论把某类心理状态直接等同于某类物理状态（例如疼就是某种神经活动），因此只要另一种材料也实现了同一状态，它就被推翻。功能主义正是从这一步走开的。',
      },
      {
        from: '个例同一论',
        note: '这一条容易被漏掉，漏掉就会以为「同一论、功能主义、还原论」排成一条由强到弱的直线。功能主义与类型同一论冲突——准确说，是与那种不作物种相对化的类型同一论冲突（把疼整类地、对一切存在者等同于某一类神经活动，正是多重实现要挡的）；若把类型相对到物种或结构，同一论仍可与功能主义并存。它与个例同一论则不冲突——否认「某一类心理状态整体对应某一类脑状态」，不等于否认「这一次的这个疼就是这一段具体的物理过程」。所以接受功能主义的人，仍然可以在个例这一层上是同一论者。',
      },
      {
        from: '行为主义',
        note: '两者都不从内省出发，容易被看成一路。差别在于功能角色还包括这个状态与其他内部状态的关系，不只是刺激与反应的配对，所以它没有像行为主义那样把内部状态排除在解释之外。',
      },
      {
        from: '「能通过测试就有心灵」',
        note: '功能等价说的是内部因果组织相同，不是外部表现看起来像。读成后者，就会把「它答得像人」当成结论，直接跳过缺失感受质那条反对。',
      },
      {
        from: '社会学的结构功能主义',
        note: '中文里最容易撞上的一个同名词。中文工具书查「功能主义」，给出的多半是孔德、涂尔干、帕森斯那一路关于社会制度各自承担什么功能的理论，与心灵哲学这一条没有关系。这里说的功能，指的是一个状态在因果链条里占的位置。',
      },
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
