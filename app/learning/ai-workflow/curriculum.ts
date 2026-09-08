/**
 * AI 编程工作流学习指南的课程设计数据。
 *
 * 这里只存放设计本身：断点分析、三条阅读路径、快车道、能力地图、完整目录
 * 和证据约定。正文教材不在本仓库里，所以这一页是一份可以反复回来查的设计说明，
 * 不是课程进度看板 —— 和哲学地图一样，页面本身没有任何"读没读过"的状态。
 */

/** 教材涉及产品当前实现的部分统一以这个日期为准。 */
export const CHECKED_AT = '2026-09-08';

/** 🟢 基础必学 / 🟡 进阶选学 / ⚪ 暂可跳过，站内改用文字标签而不是 emoji。 */
export type Tier = 'base' | 'optional' | 'later';

/** 🚀 上手 / 🛠 主干 / 🔬 深入。 */
export type Track = 'start' | 'main' | 'deep';

export const tierLabel: Record<Tier, string> = {
  base: '基础必学',
  optional: '进阶选学',
  later: '暂可跳过',
};

export const trackLabel: Record<Track, { en: string; zh: string }> = {
  start: { en: 'Start', zh: '上手' },
  main: { en: 'Main', zh: '主干' },
  deep: { en: 'Deep', zh: '深入' },
};

/* ── 一、症状与断点 ───────────────────────────────────────── */

/** 「想法 → 交付」之间反复发生的那条链。 */
export const symptomChain = [
  '想法不完整',
  'AI 不追问',
  'AI 用自己的默认值补空',
  '代码写完了',
  '看起来做完了',
  '范围、体验、边界与工程质量不到位',
  '你不断补指令、返工',
] as const;

export const breakpoints = [
  {
    id: 'input',
    title: '输入没有闭合',
    symptom: '你不知道自己漏了什么。',
    mechanism: '一份缺口清单，让「漏了什么」可以逐条检查。',
    fastLaneStep: '第 1 步的「补三件事」',
  },
  {
    id: 'ownership',
    title: '责任没有划分',
    symptom: 'AI 遇到不确定就自己猜。',
    mechanism: '三分法：可查证的自己查、可逆假设自己定但要声明、不可逆决策必须问。',
    fastLaneStep: '第 1 步末尾那一句自主权边界',
  },
  {
    id: 'done',
    title: '完成没有定义',
    symptom: '「做完了」由 AI 自己判断。',
    mechanism: '一个 AI 自己能跑的检查。',
    fastLaneStep: '第 1 步的「怎么算完成」＋ 第 4 步',
  },
] as const;

/* ── 二、贯穿全书的三原则 ─────────────────────────────────── */

export const principles = [
  {
    id: 'light',
    title: '默认走轻的',
    lede: '默认档位是快车道：五步、约 10 分钟、不产生任何流程文件。',
    body: '一个每次都要写任务单、写计划、来回批注的流程，跑三次就会放弃，然后退回「一句话丢给 AI」。',
    rule: '重的部分不是「应该做但嫌麻烦」，而是「默认不做，被明确信号触发才做」。',
  },
  {
    id: 'trigger',
    title: '升级靠触发器，不靠自觉',
    lede: '「重要的任务要认真做」没用，因为「重要」无法当场判定。',
    body: '触发器必须是看一眼就能回答的问题：要动几个文件、做偏了几次、一个会话做不做得完。',
    rule: '可判定的信号取代意志力，命中任意一条就升级。',
  },
  {
    id: 'budget',
    title: '流程预算 20%',
    lede: '流程开销不得超过任务本身预计时间的 20%，超了就降档。',
    body: '这条规则把「要不要走流程」从一次意志力较量变成一次算术。',
    rule: '30 分钟的任务，流程上限 6 分钟。',
  },
] as const;

/* ── 三、三条阅读路径 ─────────────────────────────────────── */

export const readingPaths = [
  {
    id: 'start',
    track: 'start' as Track,
    scale: '8 章',
    cost: '约 2 小时',
    outcome: '当天就用上快车道，解决现有问题里的大部分。',
    chapters: ['0.1', '1.3', '1.4', '2.1', '2.2', '2.3', '3.1', '3.6'],
    note: '读完这 8 章就停下来去用。第 3–5 层是查阅型内容，不要一口气读完。',
  },
  {
    id: 'main',
    track: 'main' as Track,
    scale: '再加 14 章',
    cost: '约 1 周，边做边读',
    outcome: '稳定的日常流程，含标准道与已有项目维护。',
    chapters: ['0.2', '0.3', '1.1', '1.2', '1.5', '1.6', '2.4', '3.2–3.5', '3.7–3.9', '3.12', '3.15', '4.1–4.5', '6.1–6.6'],
    note: '每章开头都写明「什么信号出现时你需要这一章」。',
  },
  {
    id: 'deep',
    track: 'deep' as Track,
    scale: '其余章节',
    cost: '按触发条件回来查',
    outcome: '机制层、规模化、多代理、度量。',
    chapters: ['3.10–3.14', '4.6–4.12', '5.1–5.11'],
    note: '不是读完的内容，是需要时查的内容。',
  },
] as const;

/* ── 四、快车道 ───────────────────────────────────────────── */

export const fastLaneSteps = [
  {
    no: '01',
    title: '说清楚',
    detail: '一句话说要什么，再补三件事：不要做什么 / 怎么算完成 / 不许碰哪里。末尾加一句自主权边界。',
    cost: '2 分钟',
  },
  {
    no: '02',
    title: '先要方案',
    detail: '一条指令：先调查再给方案，明确禁止写代码。两个工具的做法不同，见对照表 D1。',
    cost: '10 秒',
  },
  { no: '03', title: '看方案', detail: '回一个「行」，或者改一句话。', cost: '2 分钟' },
  { no: '04', title: '让它做', detail: '要求它跑一个检查，并把输出贴出来。', cost: '等' },
  { no: '05', title: '收不收', detail: '看 diff ＋ 看检查结果 ＋ 决定。', cost: '3 分钟' },
] as const;

export const fastLaneNotUsed = [
  '任务单',
  'plan.md',
  '批注循环',
  'Skills',
  'Hooks',
  'MCP',
  '子代理',
  'worktree',
  'CI',
] as const;

export const upgradeTriggers = [
  '同一个问题它做偏了两次',
  '要动 3 个以上文件，或你不知道该动哪里',
  '涉及数据结构、对外接口、或用户能看见的行为',
  '一个会话做不完',
] as const;

export const highRiskTriggers =
  '涉及钱、权限、隐私数据、数据迁移，或者改错了要花超过半天恢复。';

export const budgetRows = [
  { estimate: '30 分钟', ceiling: '6 分钟', lane: '快车道' },
  { estimate: '半天', ceiling: '40 分钟', lane: '标准道' },
  { estimate: '一天以上', ceiling: '1.5 小时起', lane: '标准道或高风险道' },
] as const;

export const laneNames = ['快车道', '标准道', '高风险道'] as const;

export const laneComparison = [
  { field: '产出文件', values: ['0 个', '2 个：任务单、计划', '4 个：另加审查记录、回滚方案'] },
  { field: '计划批注循环', values: ['无', '1–2 轮', '按需'] },
  { field: '验证', values: ['1 条检查命令', '自动检查 ＋ 人工验收清单', '另加对抗式审查与回滚演练'] },
  { field: '权限档位', values: ['常规', '常规', '只读起步 ＋ 硬拦截'] },
] as const;

/* ── 五、能力地图 ─────────────────────────────────────────── */

export const ladder = [
  {
    level: 'L0',
    title: '认识层',
    goal: '知道 AI 会怎么失败，知道人要保留什么判断。',
    exam: '看一段 AI 的完成汇报，指出其中未被证据支持的断言至少 2 处。',
  },
  {
    level: 'L1',
    title: '快车道',
    goal: '用 5 步、0 个文件，跑通一次「想法 → 交付」。',
    exam: '用快车道连续完成 3 个任务，全程 0 个流程文件，且没有一次返工超过一轮。',
  },
  {
    level: 'L2',
    title: '标准道',
    goal: '能识别升级触发器，并在触发时补上任务单、计划、审查。',
    exam: '遇到升级触发器时正确升级；完成案例 A，含任务单、计划与验证证据。',
  },
  {
    level: 'L3',
    title: '机制层',
    goal: '按信号引入规则文件、Skills、Hooks、MCP、子代理，并能验证它生效。',
    exam: '项目里有一份被两个工具都正确读取的规则文件，且你有「我如何确认它生效」的记录。',
  },
  {
    level: 'L4',
    title: '规模化',
    goal: '长任务、上下文管理、权限与成本、多代理、流程度量。',
    exam: '完成案例 C：有范围控制、失败处理、回滚方案，事后能给出返工率与审查耗时的粗略数字。',
  },
  {
    level: 'L5',
    title: '个人方法',
    goal: '形成自己的默认流程与排障树，并能砍掉不适合自己的部分。',
    exam: '产出自己的一页纸流程 ＋ 排障树，且砍掉本教材推荐里至少一项，并说明理由。',
  },
] as const;

export const abilities = [
  {
    no: '01',
    title: '判断任务适不适合交给 AI、交到什么程度',
    levels: 'L0 → L1',
    chapters: '1.3、1.6、2.3',
    check: '给 10 个任务描述，10 分钟内分入「快车道 / 标准道 / 高风险道 / 不交给 AI」四档，每档说出至少一条判定依据；与参考答案分歧不超过 2 项。',
  },
  {
    no: '02',
    title: '把不完整的想法变成目标、范围、约束、验收与计划',
    levels: 'L1 → L2',
    chapters: '3.1、3.3、3.4',
    check: '快车道级：3 分钟内写出「要什么 ＋ 三件事 ＋ 自主权边界」四行。标准道级：20 分钟内产出任务单，非目标至少 2 条，验收标准中至少 3 条是可执行命令或可观察的页面行为。',
  },
  {
    no: '03',
    title: '让 AI 先调查，并区分事实、可逆假设与人决定',
    levels: 'L2',
    chapters: '3.2',
    check: '调查回复里事实项带文件路径与行号、假设项带改动成本、问题不超过 5 个且按影响排序；你能指出其中至少一个被错分类的项。',
  },
  {
    no: '04',
    title: '新项目与已有项目的不同启动方式',
    levels: 'L1 → L2',
    chapters: '2.1、3.12、4.4',
    check: '两份启动清单各执行一次；已有项目那份必须含「先建立可运行基线与最小回归网」，并能说明新项目为何不需要。',
  },
  {
    no: '05',
    title: '控制上下文、任务规模、修改范围与会话交接',
    levels: 'L2 → L4',
    chapters: '1.2、3.5、3.14、5.1',
    check: '完成一次跨两个会话的任务，第二个会话不重述背景即可继续；并能指出这次哪一步该切分而没切。',
  },
  {
    no: '06',
    title: '用测试、运行、页面检查与审查判断真的完成',
    levels: 'L1 → L2',
    chapters: '3.6、3.7、3.8',
    check: '交付时拿出四类证据中至少三类；并能指出 AI 声称完成但证据缺失的地方。',
  },
  {
    no: '07',
    title: '按需引入规则文件、Skills、Hooks、MCP、子代理与 CI',
    levels: 'L3',
    chapters: '4.1–4.12',
    check: '对每种机制能回答同一组五问；实际验证过至少三种机制确实生效，并留有记录。',
  },
  {
    no: '08',
    title: '处理返工、卡住、错误实现、错误测试、上下文丢失与多代理冲突',
    levels: 'L2 → L4',
    chapters: '3.7、5.4、5.6、6.3',
    check: '8 个故障场景能在排障树上定位并给出下一步；「AI 改测试迁就代码」和「上下文丢失后自信执行」两个必须答对。',
  },
  {
    no: '09',
    title: '管理权限、敏感信息、发布、回滚与成本',
    levels: 'L1 → L4',
    chapters: '2.1、5.2、5.3、5.9',
    check: '写出你的三层权限基线，并在两个工具里都实际配置生效；能对一次任务给出停止条件。',
  },
  {
    no: '10',
    title: '借鉴企业与开发者实践，并判断适用性',
    levels: 'L4 → L5',
    chapters: '5.10、附录 A',
    check: '对每个收录案例，说出它成立的前提中你不具备的那一条，以及你要借鉴的部分改编成什么样。',
  },
] as const;

/* ── 六、完整目录 ─────────────────────────────────────────── */

export type Chapter = {
  no: string;
  title: string;
  goal: string;
  tier: Tier;
  tracks: Track[];
  /** ★ 重点展开：含错误示范、可复制模板、练习与验收。 */
  key?: boolean;
  /** 触发信号或「什么时候再回来」。 */
  signal?: string;
};

export type Layer = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  lede?: string;
  chapters: Chapter[];
};

export const syllabus: Layer[] = [
  {
    id: 'part-0',
    index: '00',
    title: '怎么用这套教材',
    subtitle: 'How to read',
    chapters: [
      {
        no: '0.1',
        title: '三条阅读路径与快车道三原则',
        goal: '知道自己现在该读哪 8 章；记住默认走轻的、升级靠触发器、流程预算 20% 三条原则。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '0.2',
        title: '术语最小集',
        goal: '用一段白话说清模型、会话、编程代理、工具、工作区、上下文、权限这七个词的关系。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '0.3',
        title: '证据标注约定',
        goal: '读到任何结论都知道它的证据强度：官方文档、团队自述、作者经验、受控研究、我的建议。',
        tier: 'base',
        tracks: ['main'],
      },
    ],
  },
  {
    id: 'layer-1',
    index: '01',
    title: '建立正确认识',
    subtitle: 'Calibration',
    chapters: [
      {
        no: '1.1',
        title: '一次代理循环里发生了什么',
        goal: '画出「提示 → 模型 → 工具调用 → 结果回灌 → 停止判断」，并指出每一步人能在哪里介入。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '1.2',
        title: '上下文窗口是第一约束',
        goal: '说出按下第一个回车前上下文里已经有什么；解释长会话为何质量下降；压缩后什么会丢。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '1.3',
        title: '「能写代码」和「能可靠交付」差的六样东西',
        goal: '需求完整性、可验证性、范围控制、边界情况、工程质量、可回退性，每样给出补齐手段。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '1.4',
        title: 'AI 的 9 种失败模式',
        goal: '乐观完成、需求自动补空、改测试迁就代码、范围蔓延、幻觉 API、沉默降级、上下文丢失后自信执行、过度工程、错误方向坚持，每种带一句话识别信号。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '1.5',
        title: 'Codex 与 Claude Code 的形态对照',
        goal: '掌握 9 个维度的差异，重点是 4 处会真正影响操作的差异；其中计划模式的差异直接关系到快车道第 2 步的安全性。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '1.6',
        title: '人必须保留的三类判断：产品、架构、风险',
        goal: '对一个具体任务列出这三类里哪几个点必须你定。',
        tier: 'base',
        tracks: ['main'],
      },
    ],
  },
  {
    id: 'layer-2',
    index: '02',
    title: '第一次跑通',
    subtitle: 'First run',
    chapters: [
      {
        no: '2.1',
        title: '十分钟把工作区变安全',
        goal: '分支、基线、可运行、一条检查命令、三层权限基线，两个工具各给一份配置。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '2.2',
        title: '快车道：五步跑通第一个任务',
        goal: '本教材的主干章。用最小工具集走完想法 → 方案 → 确认 → 实现 → 验收，全程 0 个流程文件。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '2.3',
        title: '什么时候必须升级流程',
        goal: '记住 4 条升级触发器和流程预算 20% 规则，能对一个具体任务算出该走哪档。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '2.4',
        title: '第一次常见的五种翻车与现场纠正',
        goal: '改了不该改的文件、测试是假的、范围偷偷变大、提交信息掩盖真实改动、无法回滚。',
        tier: 'base',
        tracks: ['main'],
      },
    ],
  },
  {
    id: 'layer-3',
    index: '03',
    title: '日常工作流',
    subtitle: 'Daily loop',
    lede: '每章分快车道版与标准道版，并写明什么信号出现时才需要标准道版；每章明确谁负责、输入、产出物、进入下一步的门槛。',
    chapters: [
      {
        no: '3.1',
        title: '需求不完整时怎样与 AI 协作补齐',
        goal: '快车道版是三句话补全法，2 分钟学会；标准道版是五个缺口 ＋ 三分法 ＋ 问题预算 ＋ 任务单。含「我也没想清楚」和「AI 做错方向」两种局面的话术。',
        tier: 'base',
        tracks: ['start', 'main'],
        key: true,
      },
      {
        no: '3.2',
        title: '让 AI 先调查：事实 / 可逆假设 / 人决定',
        goal: '写出调查指令；审查调查报告并指出错误分类。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '3.3',
        title: '从三句话到任务单：什么时候才需要文件',
        goal: '判断何时口头够用、何时必须落成文件；给出任务单模板。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '3.4',
        title: '计划与批注',
        goal: '「生成计划 → 本地批注 → 回灌 → 显式禁止实现」的循环；两个工具的计划模式差异；什么时候跳过计划。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '3.5',
        title: '小步实现与切片',
        goal: '把计划切成可独立验证、可独立回滚的片；识别切片过大的三个信号。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '3.6',
        title: '验证与证据',
        goal: '为一次改动设计「AI 自己能跑的检查」；区分「跑过了」和「证明了」；四类证据。',
        tier: 'base',
        tracks: ['start'],
        key: true,
      },
      {
        no: '3.7',
        title: '调试：从症状到根因，禁止绕过错误',
        goal: '先复现、再定位、后修复；识别并阻止 AI 吞错误、放宽断言、跳过测试。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '3.8',
        title: '代码审查：人审什么、AI 审什么、对抗式审查',
        goal: '人必审清单；用独立会话做对抗审查，并处理「审查者硬找问题导致过度工程」的副作用。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '3.9',
        title: '交付与回滚',
        goal: '写出回滚方案并演练一次。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '3.10',
        title: 'UI 迭代循环',
        goal: '截图、浏览器检查、设计对照。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你开始靠肉眼反复看页面判断对错。',
      },
      {
        no: '3.11',
        title: '接口与数据库：契约先行与迁移安全',
        goal: '把契约写在前面，让迁移可回滚。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '任务涉及对外接口或数据库迁移。',
      },
      {
        no: '3.12',
        title: '已有项目维护：先建安全网再动手',
        goal: '对没有测试的旧模块，动手前建立最小回归保护。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '3.13',
        title: '需求中途变化：改规格而不是改记忆',
        goal: '把新的约束写回规格，而不是靠对话记忆续接。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '做到一半你改主意了。',
      },
      {
        no: '3.14',
        title: '会话交接与续命文档',
        goal: '让下一个会话不重述背景就能接着做。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '一个任务一个会话做不完。',
      },
      {
        no: '3.15',
        title: '责任表（一页）',
        goal: '每一步的输入、产出物、进入下一步的门槛。',
        tier: 'base',
        tracks: ['main'],
      },
    ],
  },
  {
    id: 'layer-4',
    index: '04',
    title: '上下文与工具机制',
    subtitle: 'Mechanisms',
    lede: '本层的核心结论先说：头两周你只需要三样东西 —— 一个规则文件、一个验收习惯、一条能跑的检查命令。其余机制全部附「什么信号出现时才装」，并统一回答同一组五问。',
    chapters: [
      {
        no: '4.1',
        title: '机制决策树，以及「现在你只需要三样东西」',
        goal: '面对一个诉求，30 秒选出该用哪种机制，并说出为什么不用另外两种；以及为什么现在多数机制你都不该装。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '4.2',
        title: '规则文件双工具配置：CLAUDE.md 与 AGENTS.md',
        goal: '本层最重要的一章。两边都用就必须处理规则文件读取范围的差异，给出具体做法与验证方法，附 Cursor / Copilot 对照。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '4.3',
        title: '文档类产物：规格 / 任务单 / 计划 / 决策记录 / 交接记录',
        goal: '五种文档各自的读者、寿命、存放位置，以及与规则文件的分工。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '4.4',
        title: '最小项目目录与关键文件全示例',
        goal: '一份可直接复制的目录结构 ＋ 每个文件的真实内容，同时被两个工具正确读取。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '4.5',
        title: '逐机制的「它真的生效了吗」验证清单',
        goal: '每种机制至少一种验证手段；诊断「我写了规则但 AI 不遵守」的三种原因。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '4.6',
        title: 'Skills：两套路径与预算差异',
        goal: '把重复贴进对话的流程固化下来。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '同一段流程你贴进对话第三遍了。',
      },
      {
        no: '4.7',
        title: 'Hooks：把「必须每次发生」变成确定性护栏',
        goal: '用确定性机制替代反复叮嘱。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你反复叮嘱同一件事而它反复漏做。',
      },
      {
        no: '4.8',
        title: 'MCP：收益与代价',
        goal: '判断一个外部数据源值不值得接进来。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你在反复从某个浏览器标签页往对话里复制数据。',
      },
      {
        no: '4.9',
        title: '子代理与上下文隔离',
        goal: '把大调研挪出主会话。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '一次调研把你的会话冲垮了。',
      },
      {
        no: '4.10',
        title: '路径作用域规则与大仓库',
        goal: '让规则按目录生效，而不是堆在一个文件里。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '规则文件超过 200 行。',
      },
      {
        no: '4.11',
        title: 'Git worktree 与并行会话',
        goal: '让两件事同时推进而不互相踩脚。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你想同时推进两件事而它们互相踩脚。',
      },
      {
        no: '4.12',
        title: 'CI 与自动化验证',
        goal: '把手动检查搬到流水线上。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你开始忘记手动跑检查。',
      },
    ],
  },
  {
    id: 'layer-5',
    index: '05',
    title: '深入实践与规模化',
    subtitle: 'At scale',
    chapters: [
      {
        no: '5.1',
        title: '长任务：上下文压缩、重启、持久化进度',
        goal: '让跨越多次压缩的任务不丢关键信息；说出压缩后什么会自动回来、什么不会。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.2',
        title: '停止条件与预算：什么时候必须叫停',
        goal: '为每类任务预设停止条件（轮次、时间、花费、连续失败次数）；识别「它已经在原地打转」。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.3',
        title: '权限、密钥与沙箱',
        goal: '配一套「跑得开但跑不出去」的环境；知道哪些操作任何模式都不该自动放行。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.4',
        title: '工具失败与降级路径',
        goal: '让工具失败变成可见的停止，而不是编造。',
        tier: 'optional',
        tracks: ['deep'],
        signal: 'MCP 断连或命令超时后它开始编造。',
      },
      {
        no: '5.5',
        title: '一个代理够不够：多代理的价值与代价',
        goal: '判断第二个会话值不值得开。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你在考虑开第二个会话。',
      },
      {
        no: '5.6',
        title: '多代理的任务归属、依赖、集成与冲突',
        goal: '让并行的会话不互相覆盖。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你已经在跑两个以上会话。',
      },
      {
        no: '5.7',
        title: '模型能力 vs 执行环境 vs 反馈机制',
        goal: '面对「效果不好」，能定位是三者中哪一个的问题，而不是直接换模型。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.8',
        title: '用什么指标评估你的流程',
        goal: '建立四个可记录指标：一次通过率、返工轮次、漏出缺陷、人工审查耗时；说明「生成了多少代码」为何是坏指标。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.9',
        title: '成本管理',
        goal: '让花费可预期。',
        tier: 'optional',
        tracks: ['deep'],
        signal: '你开始在意账单。',
      },
      {
        no: '5.10',
        title: '企业与开发者实践的适用条件分析',
        goal: '对每个收录案例，指出它成立的前提、你缺哪一条、可借鉴的是哪部分。',
        tier: 'base',
        tracks: ['deep'],
        key: true,
      },
      {
        no: '5.11',
        title: '组织层做法：平台团队与批量改造机队',
        goal: '了解个人流程之上的一层。',
        tier: 'later',
        tracks: ['deep'],
        signal: '你开始带团队，或需要跨仓库批量改造。',
      },
    ],
  },
  {
    id: 'layer-6',
    index: '06',
    title: '形成自己的方法',
    subtitle: 'Your own loop',
    chapters: [
      {
        no: '6.1',
        title: '一页纸默认流程',
        goal: '可贴在显示器旁的流程卡，含三档路径。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '6.2',
        title: '模板库（刻意做小）',
        goal: '只给 6 个模板：三句话补全、调查指令、任务单、计划批注、审查提示、交接记录。不给大而全的提示词合集。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '6.3',
        title: '排障决策树',
        goal: '从症状出发三步定位到动作。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '6.4',
        title: '练习路径：第 1 天 / 第 1 周 / 第 1 个月',
        goal: '每阶段有明确练习、验收标准与参考解答；第 1 天的练习必须当天能做完。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
      {
        no: '6.5',
        title: '现在必须掌握 / 以后再学 / 暂时不用',
        goal: '一张分类表，避免你现在就去堆工具。',
        tier: 'base',
        tracks: ['main'],
      },
      {
        no: '6.6',
        title: '怎么判断你的流程太重了，以及怎么砍',
        goal: '三个可判定信号：任务单比代码长、连续 3 次在同一步走过场、为走流程而推迟开始。附「砍流程」的操作步骤。',
        tier: 'base',
        tracks: ['main'],
        key: true,
      },
    ],
  },
];

export const appendices = [
  {
    id: 'A',
    title: '三个案例的完整档案',
    detail:
      '案例 A 知识库加搜索（从模糊想法开始）、案例 B 已有项目定位 Bug 到回归测试、案例 C 跨文件重构与批量迁移。每个都展示原始需求 → 遗漏分析 → 关键澄清对话 → 任务单 → 计划及批注 → 实施切片 → 验证 → 审查 → 交付 → 复盘，并附「换成你自己的项目怎么做」。',
    caveat: '三个案例是教学设计案例，不是真实交付记录，正文开头显著标注。',
  },
  {
    id: 'B',
    title: '提示词与模板全集',
    detail: '6 个核心模板，中英对照，刻意做小。',
  },
  {
    id: 'C',
    title: '来源清单与核对方法',
    detail: '每条含标题、作者或机构、发布时间、访问日期、链接与证据类型。',
    caveat: '其中 11 个证据缺口保持列出而不填平：用搜索摘要补细节会违反本书的证据规则。',
  },
  {
    id: 'D',
    title: '双工具能力对照表',
    detail: 'Codex 与 Claude Code 在 9 个维度的对照，附 Cursor / Copilot 参考列，以及「以官方文档为准」的复核入口。',
  },
] as const;

/* ── 七、方法与证据 ───────────────────────────────────────── */

export const differences = [
  {
    no: '01',
    title: '默认档位是轻的',
    body: '多数教程给你一套完整流程然后说「按需简化」，但没人会简化。这里反过来：默认最轻，重的部分靠可判定的触发器启动。',
  },
  {
    no: '02',
    title: '每个机制都要回答「怎么验证它生效」',
    body: '你配了规则文件但 AI 不遵守，多数教程不告诉你怎么诊断。这里每种机制都必须给出验证手段。',
  },
  {
    no: '03',
    title: '收录反面证据',
    body: '有受控研究显示 AI 工具在特定条件下让资深开发者变慢，也有大样本调研显示 AI 会放大组织既有的强项和缺陷。用来校准期待和度量方式，不是唱反调。',
  },
  {
    no: '04',
    title: '区分「官方文档说的」和「我建议的」',
    body: '所有把企业做法改编成个人做法的地方都分开写，不混在一起。',
  },
] as const;

export const evidenceMarks = [
  { mark: '官方文档', meaning: '产品方发布的当前文档', use: '可以照做，但注意核对日期，这类内容变化最快。' },
  { mark: '团队自述', meaning: '企业工程博客的自我描述', use: '说明「他们怎么做」，不能当作「这么做有效」的独立证明。' },
  { mark: '受控研究', meaning: '随机对照实验、大样本调研', use: '用于校准期待，必须看清适用范围和测量口径。' },
  { mark: '作者经验', meaning: '个人开发者的公开文章', use: '一种可行做法，样本为一，别当普适规律。' },
  { mark: '我的建议', meaning: '教材作者的综合判断与改编', use: '会尽量说明理由，但可能错，你自己判断。' },
] as const;

export const practiceProject = {
  name: 'mynotes',
  detail: '一个 Markdown 个人知识库站点，第 2.1 章给出从零搭建步骤，约 15 分钟。三个案例都在它上面做。',
  caveat: '方法不绑定这套技术栈。出现具体框架只是为了让命令能真的跑起来；换成别的服务端框架，流程一模一样。',
} as const;

/* 目录统计由数据本身推出，避免正文里写死一个会过期的数字。
   partCount 是「导读 ＋ 六层」这七个部分，不是六层本身。 */
export const chapterCount = syllabus.reduce((total, layer) => total + layer.chapters.length, 0);
export const partCount = syllabus.length;
export const keyChapterCount = syllabus.reduce(
  (total, layer) => total + layer.chapters.filter((chapter) => chapter.key).length,
  0,
);
