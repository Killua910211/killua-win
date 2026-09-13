import { getNodeById, philosophyNodes, type PhilosophyNode } from './tree';

/**
 * 哲学知识关系层。
 *
 * data.json 里的 `related` 是一个无语义的 id 数组：它只说明「这两页有关」，
 * 不说明是前置、是竞争回答、是反驳、是延伸，还是只能并置比较的跨传统问题。
 * 读者因此无法回答「为什么推荐我读这一篇」。
 *
 * 这里补上语义和理由。每条边都是有向的，并且必须带一句 `why`——
 * 说不出理由的边不应该存在，宁可不连。
 *
 * 关系类型固定为七种，且没有「相关」这种兜底项。少到作者每次都记得住，
 * 又足以覆盖现有内容里真实存在的那几类连接。
 */

export type RelationKind =
  /** 前置理解：读本页之前要先弄清对面那一页的某个区分。 */
  | 'prerequisite'
  /** 延伸问题：接受本页的结论之后，立刻会被逼出来的下一个问题。 */
  | 'extension'
  /** 有力反对：对面那一页挑战本页的前提或结论，而且是最难回答的那一种。 */
  | 'objection'
  /** 易混辨析：两页常被当成同一个问题，需要说明为什么会混同、分界在哪。 */
  | 'distinction'
  /** 历史语境：本页的问题实际在哪一段材料和文本网络里被提出。 */
  | 'historical-context'
  /** 跨传统比较：可比较但不可等同。 */
  | 'cross-tradition'
  /** 处境应用：核心问题落到一个具体领域或技术处境里。 */
  | 'case-domain';

export type RelationLabel = {
  /** 从本页出发看这条边时的中文标题。 */
  outbound: string;
  /** 从对面那一页反向看这条边时的中文标题。 */
  inbound: string;
  /**
   * 知识地图上那枚小徽章的文字，同样分方向。
   *
   * 加它的原因是一个真实的方向 bug：地图以前直接用一张按 kind 索引的短标签表，
   * 完全不看这条边是正向还是反向，于是「以本页为前置的问题：道德运气」在地图上
   * 显示成「前置 · 道德运气」——徽章说道德运气是自由意志的前置，而紧挨着的
   * 解释句说的恰恰相反。正反两个方向的措辞现在和标题一起放在这里，
   * 只有一处需要维护。
   */
  shortOutbound: string;
  shortInbound: string;
  /** 这一组关系在页面上排第几。数字小的排前面。 */
  order: number;
  /** 写 why 时必须回答的问题。数据层不校验它，但审查时按它检查。 */
  mustAnswer: string;
};

export const relationLabels: Record<RelationKind, RelationLabel> = {
  prerequisite: {
    outbound: '先读这些（前置理解）',
    inbound: '以本页为前置的问题',
    shortOutbound: '先读',
    shortInbound: '后读',
    order: 1,
    mustAnswer: '对面那一页的哪个区分是本页的前提？',
  },
  distinction: {
    outbound: '常被混为一谈，需要分开',
    inbound: '常被混为一谈，需要分开',
    shortOutbound: '易混',
    shortInbound: '易混',
    order: 2,
    mustAnswer: '为什么会混同，分界在哪？',
  },
  objection: {
    outbound: '对本页构成压力',
    inbound: '本页对它构成压力',
    shortOutbound: '受挑战',
    shortInbound: '挑战它',
    order: 3,
    mustAnswer: '它攻击的是本页哪一条前提？',
  },
  extension: {
    outbound: '接着追问（延伸问题）',
    inbound: '这个问题从哪里来',
    shortOutbound: '延伸',
    shortInbound: '起点',
    order: 4,
    mustAnswer: '本页的哪一步逼出了这个问题？',
  },
  'case-domain': {
    outbound: '落到具体处境',
    inbound: '这个处境背后的核心问题',
    shortOutbound: '处境',
    shortInbound: '母问题',
    order: 5,
    mustAnswer: '这个处境改变了原问题的哪个变量？',
  },
  'cross-tradition': {
    outbound: '跨传统的可比问题',
    inbound: '跨传统的可比问题',
    shortOutbound: '跨传统',
    shortInbound: '跨传统',
    order: 6,
    mustAnswer: '可比较的具体争点是什么，又在哪里不可等同？',
  },
  'historical-context': {
    outbound: '放回历史语境',
    inbound: '在这段历史里被追问的问题',
    shortOutbound: '历史',
    shortInbound: '此期问题',
    order: 7,
    mustAnswer: '是哪一段材料，以及不能从它推出什么？',
  },
};

/** 对称的关系不需要区分方向，反向展示时不改写标题。 */
const symmetricKinds = new Set<RelationKind>(['distinction', 'cross-tradition']);

/**
 * 一条边在某一侧该显示的标题与徽章。
 *
 * 所有渲染方向语义的地方都必须走这里，不要各自再建一张按 kind 索引的表——
 * 地图上那个「前置」徽章与解释句互相矛盾的 bug，就是因为存在第二张表。
 */
export function relationFacing(
  kind: RelationKind,
  reversed: boolean,
): { title: string; short: string } {
  const label = relationLabels[kind];
  return reversed
    ? { title: label.inbound, short: label.shortInbound }
    : { title: label.outbound, short: label.shortOutbound };
}

/**
 * 方向语义的数据不变式。
 *
 * 这些断言写在模块顶层，import 时执行。注意它们**不会**在 `pnpm build` 时跑：
 * vinext 的 build 只打包和做静态分析，从不 import 应用模块，而 `[node]/page.tsx`
 * 的 `revalidate = 0` 又把节点路由标成 Dynamic，没有预渲染产物。也就是说，靠构建
 * 是拦不住写坏的数据的——它会变成线上第一次请求时的 500。
 *
 * 真正的闸门是 `pnpm test:philosophy`（scripts/check-philosophy-invariants.mjs），
 * 它把这些模块打成 bundle 再 import，逼这些断言在提交前跑一遍；`pnpm check` 会调它。
 * 改了这里的断言，记得同步那个脚本里的不变式清单。
 */
/**
 * why 里不得出现没有先行词的方向性指代。
 *
 * `relationGroupsFor` 对正反两个方向都原样透传 `relation.why`——只有分组标题和
 * 徽章会按方向改写。所以 why 里的「本页」在 from 页指 from、在 to 页指 to：
 * 同一句话在两页上说的是相反的事。本轮就栽在这里，`pt-history-tech →
 * pt-africana-race` 那条写成「它攻击的是本页「进步与解放叙事」那一栏」，在非裔
 * 哲学页上读成该页有一栏叫「进步与解放叙事」，而那是对面那一页的立场。
 *
 * 「自由那一页」「历史与技术那一页」这样带页名的说法不在禁止之列：先行词是写死的
 * 页名，翻面也不会改变它指谁。
 */
const directionalDeixis = ['本页', '该页', '同一页'];

function assertNoDirectionalDeixis(relations: PhilosophyRelation[]) {
  for (const relation of relations) {
    for (const word of directionalDeixis) {
      if (relation.why.includes(word)) {
        throw new Error(
          `[relations] ${relation.from} → ${relation.to}：why 里出现了「${word}」。` +
            'why 在正反两个方向上原样显示，这类指代会在对面那一页翻面。请直接写出页名。',
        );
      }
    }
  }
}

function assertDirectionSemantics() {
  for (const kind of Object.keys(relationLabels) as RelationKind[]) {
    const label = relationLabels[kind];
    const symmetric = symmetricKinds.has(kind);
    const titlesSame = label.outbound === label.inbound;
    const shortsSame = label.shortOutbound === label.shortInbound;

    // 非对称关系的两个方向必须给出不同措辞，否则「A 是 B 的前置」和
    // 「B 是 A 的前置」会在页面上长得一模一样。
    if (!symmetric && (titlesSame || shortsSame)) {
      throw new Error(
        `关系「${kind}」不是对称关系，正反两个方向必须用不同措辞：` +
          `outbound=${label.outbound}／inbound=${label.inbound}，` +
          `short=${label.shortOutbound}／${label.shortInbound}`,
      );
    }
    // 对称关系反过来必须完全一样，否则同一条边在两页上会读成两回事。
    if (symmetric && (!titlesSame || !shortsSame)) {
      throw new Error(`关系「${kind}」登记为对称关系，正反措辞却不一致`);
    }
    if (!label.shortOutbound.trim() || !label.shortInbound.trim()) {
      throw new Error(`关系「${kind}」缺少地图徽章文字`);
    }
  }
}

/**
 * 严格前置关系里不能有环。
 *
 * 「教学先后建议」可以随便排，但 prerequisite 声称的是理解上的依赖：
 * 若 A 要求先读 B、B 又要求先读 A，读者无从下手。
 */
function assertNoPrerequisiteCycle(relations: PhilosophyRelation[]) {
  const edges = new Map<string, string[]>();
  for (const relation of relations) {
    if (relation.kind !== 'prerequisite') continue;
    edges.set(relation.from, [...(edges.get(relation.from) ?? []), relation.to]);
  }

  const state = new Map<string, 'visiting' | 'done'>();
  const stack: string[] = [];
  const walk = (node: string) => {
    if (state.get(node) === 'done') return;
    if (state.get(node) === 'visiting') {
      const cycle = [...stack.slice(stack.indexOf(node)), node].join(' → ');
      throw new Error(`前置关系出现循环：${cycle}`);
    }
    state.set(node, 'visiting');
    stack.push(node);
    for (const next of edges.get(node) ?? []) walk(next);
    stack.pop();
    state.set(node, 'done');
  };
  for (const node of edges.keys()) walk(node);
}

/** 同一对节点之间只允许一条边：靠叠加关系类型充数会让「继续学习」变成复读。 */
function assertNoDuplicatePairs(relations: PhilosophyRelation[]) {
  const seen = new Map<string, string>();
  for (const relation of relations) {
    const pair = [relation.from, relation.to].sort().join('|');
    const existing = seen.get(pair);
    if (existing) {
      throw new Error(
        `${relation.from} 与 ${relation.to} 之间有多条边（${existing}、${relation.kind}）；` +
          '一对节点只保留最能说明问题的那一条。',
      );
    }
    seen.set(pair, relation.kind);
  }
}

export type PhilosophyRelation = {
  from: string;
  to: string;
  kind: RelationKind;
  /**
   * 为什么值得从 from 走到 to。写给读者看，不是写给维护者看：
   * 「如果自由不是绝对的，道德责任是否仍然成立？」优于「相关文章」。
   */
  why: string;
};

/**
 * 关系数据。
 *
 * 只写真实存在的关系。判断依据是两页的正文与来源账，不是「看起来应该有关」。
 * 每一条都要能通过这句检验：读者读完 from 之后，why 是不是他真的会问出来的问题。
 *
 * 刻意没有「相关 see-also」这个兜底类型。这是整套词表能生效的前提：一旦留了
 * 兜底项，data.json 里那 97 条没人说得出理由的裸边就会原样搬过来。
 *
 * 父子关系也不进这里。面包屑和「下一层」已经表达了树结构，重复一遍只会
 * 让关系图看起来更满、实际信息更少。
 */
export const philosophyRelations: PhilosophyRelation[] = [
  // ——— 前置理解 ———————————————————————————————————————————————
  {
    from: 'pt-responsibility',
    to: 'pt-freedom',
    kind: 'prerequisite',
    why: '「本可以做别的」和「行动是否出自我的理由」是两个不同的控制条件，自由那一页把它们分开处理。不先分开，道德运气的讨论会一路退回「到底自由不自由」，而运气问题恰恰在两种控制都被承认之后才出现。',
  },
  {
    from: 'pt-logic',
    to: 'pt-language-meaning',
    kind: 'extension',
    // 这条边原来标 prerequisite，声称「读逻辑之前先读语言与意义」。那不成立：
    // 判断有效性用不着先选定一套意义理论，学得会「同一个词不能换着意思用」
    // 就够了，而这条规则本来就在逻辑页内部。它同时和推荐学习路径冲突——
    // 路径把逻辑排第 2 步、语言排第 4 步，并自述「前三步都默认用词是稳定的」。
    // 真实的关系是延伸：逻辑页的那个默认被追问下去，才走到语言页。
    why: '判断一个论证是否有效，默认了同一个词在前提和结论里说的是同一件事；「有效」这个判断正是靠这个默认才落得下来。逻辑页用得上这个默认，却不负责说明它凭什么成立。一旦追问下去——词义由什么固定，语境和说话者意图各起多大作用，同一个词在两处不是同一个意思时该怎么办——就已经走到语言那一页了。',
  },
  {
    from: 'pt-science-reality',
    to: 'pt-logic',
    kind: 'prerequisite',
    why: '说一个解释「更好」用的是解释性推断，不是演绎有效。逻辑那一页把演绎、归纳与最佳解释的评价标准分开；理论的成功究竟支持了什么，要靠这套区分才说得清。',
  },
  {
    from: 'pt-identity-oppression',
    to: 'pt-knowledge-sources',
    kind: 'prerequisite',
    why: '证言不公要立得住，先得承认证言本身是一种可被评价的知识来源。把「别人说的」一律当二手意见，可信度如何分配就只剩礼貌问题，不再是认识问题。',
  },
  {
    from: 'pt-aesthetic-value',
    to: 'pt-interpretation',
    kind: 'prerequisite',
    why: '要说一幅画的哪些地方值得反复看，先得承认「看见什么」依赖对作品背景的解释。解释争议不摊开，双方会以为在争品味，其实在争对象是什么。',
  },
  {
    from: 'pt-art',
    to: 'pt-interpretation',
    kind: 'prerequisite',
    why: '判断一件东西是不是作品，绕不开它的接受史与意图归属，而这两样正是解释那一页里最有争议的部分——椅子搬进美术馆之所以可能成为作品，靠的是展示语境能被读出来。',
  },
  {
    from: 'pt-ai-future',
    to: 'pt-responsibility',
    kind: 'prerequisite',
    why: '责任那一页把三件事分开：这件事是否出自某个人、他能否被要求说明理由、他能否被追究并承担后果；角色责任的条件也在那里给出。缺了这套区分，自动化伤害的讨论只会在「怪算法」和「怪用户」之间摆动。',
  },
  {
    from: 'pt-religion-reason',
    to: 'pt-knowledge-sources',
    kind: 'prerequisite',
    why: '「宗教信念需要什么理由」要往下问，先得有一套关于证据、证言与基本信念的说法。否则要求公共论证的一方，和主张信念不必由中立前提推出的一方，会各说各话。',
  },
  {
    from: 'pt-interpretation',
    to: 'pt-language-meaning',
    kind: 'prerequisite',
    why: '文本能说什么，先受词义、语境与言语行为类型的限制。跳过这层可公开检查的约束，「作者想表达什么」就变成一个无法核对的心理问题。',
  },
  {
    from: 'pt-legalism',
    to: 'pt-language-meaning',
    kind: 'prerequisite',
    why: '法、术、势要能执行，先得说清名与实、职名与标准怎样被固定下来。把「正名」读成一项用字规范，就看不出它为什么是治理问题：职名一旦松动，按职名追究实绩的赏罚也就落不到具体的人身上。',
  },
  {
    from: 'pt-african-personhood',
    to: 'pt-african-method',
    kind: 'prerequisite',
    why: '「通过他人成为人」这类说法要拿来比较，先得说清材料出自谁、经过谁的翻译、谁被算作提出了论证。方法那一页争的正是这个；跳过它，被比较的就是研究者的概括。',
  },
  {
    from: 'pt-african-method',
    to: 'pt-knowledge-sources',
    kind: 'prerequisite',
    why: '口述材料算不算哲学，取决于证言、记录与可反驳性怎样互相约束。先有这套标准，「反对欧洲中心」和「要求论证」才不必被当成二选一。',
  },
  {
    from: 'pt-african-method',
    to: 'pt-interpretation',
    kind: 'prerequisite',
    why: '访谈与格言要作为论证来读，先得处理记录者的选材、翻译与编辑。解释那一页把文本证据和解释者位置的关系摊开，这里正是它的用处。',
  },
  {
    from: 'pt-islamic-translation',
    to: 'pt-interpretation',
    kind: 'prerequisite',
    why: '一个希腊概念进入阿拉伯语后还说不说同一件事，要靠译法、受众与文本证据来判断。没有这套区分，「保存」和「改写」就分不开。',
  },

  // ——— 易混辨析 ———————————————————————————————————————————————
  {
    from: 'pt-legitimacy',
    to: 'pt-law',
    kind: 'distinction',
    why: '「这条法律有效」和「这个权威有权命令我」常被说成一句话。分界在于法律可以在程序上完全有效，而它凭什么要求服从仍待证成；抗命问题只有在两者分开之后才提得清楚。',
  },
  {
    from: 'pt-art',
    to: 'pt-aesthetic-value',
    kind: 'distinction',
    why: '一句「我不觉得这是艺术」把两个问题压在一起。分界在于一边问的是分类与制度承认，另一边问的是能不能说清这件作品哪里值得注意、凭什么——一件被普遍算作艺术的作品仍然可以很差。',
  },
  {
    from: 'pt-being-change',
    to: 'pt-mind-self',
    kind: 'distinction',
    why: '「同一辆自行车」和「同一个人」看起来是一个问题。分界在于人格那边多出记忆、第一人称视角与承诺，而一般对象的持续标准并不处理这些；反过来，物质构成的连续也回答不了失忆后是否仍须守约。',
  },
  {
    from: 'pt-knowledge-sources',
    to: 'pt-logic',
    kind: 'distinction',
    why: '「这个理由好不好」常被当成一个问题问出来。分界在于逻辑评价前提对结论的支持形式，认识论评价前提本身凭什么可信——形式无懈可击的论证完全可以建在一条错误证言上。',
  },
  {
    from: 'pt-right-action',
    to: 'pt-justice',
    kind: 'distinction',
    why: '两页都在问「应该怎么做」，但一边评价行动者的选择，一边评价制度分配的规则。混同的代价是：制度性不义被读成几个人品行不端，或者反过来，个人不必再问自己做了什么。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-death-meaning',
    kind: 'distinction',
    why: '「过得好」和「有意义」在日常里换着用。分界在于一个人可以生活顺利却觉得所做的事无所谓，也可以在痛苦中投入自己认为值得的事；不分开，「死亡是否夺走意义」会滑成「死亡是否让人不快乐」。',
  },
  {
    from: 'pt-responsibility',
    to: 'pt-law',
    kind: 'distinction',
    why: '「有罪」和「该受道德责备」被当成同义。分界在于法律要在程序、举证与公共可执行性的限制下运作，道德归责不受这些限制，也不因判决生效而结束。',
  },
  {
    from: 'pt-islamic-later',
    to: 'pt-western-medieval',
    kind: 'distinction',
    why: '两段材料常被排成同一条线的先后：阿拉伯语世界保存，拉丁世界接手。分界在于 12 世纪之后的评注、教学与本质—存在争论仍在继续，而拉丁中世纪也有自己的语言、制度与法学条件，不是那条线的下一段。',
  },
  {
    from: 'pt-legitimacy',
    to: 'pt-justice',
    kind: 'distinction',
    why: '一个制度可以在程序上有权要求服从，同时分配得很不正义；也可以分配接近正义，却说不出凭什么由它来决定。合成「好制度」之后，就无法解释为什么服从和批评能同时成立。',
  },
  {
    from: 'pt-freedom',
    to: 'pt-mind-self',
    kind: 'distinction',
    why: '「我只是一堆神经元」把两个问题连了起来。分界在于即使物理主义为真，关于控制条件的争论仍要独立进行；二元论也不因为心灵另属一类，就自动提供了自由。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-right-action',
    kind: 'distinction',
    why: '「做个好人」把两件事合并了。分界在于一个人可以生活繁荣却做了错事，也可以做对了事而生活并不好；每种理论都得自己说明这种落差怎么可能。',
  },
  {
    from: 'pt-being-change',
    to: 'pt-science-reality',
    kind: 'distinction',
    why: '「什么更基本」听起来该由科学回答。分界在于跨时间同一性的标准不能从物理学结论直接读出，而科学实在论争的是理论的成功支持哪些不可观察结构，它并不预设某一套实体理论。',
  },
  {
    from: 'pt-confucian',
    to: 'pt-daoism',
    kind: 'distinction',
    why: '「儒道互补」或「儒道对立」都是后世整理出的标签。分界要从具体争论看：礼与学习算不算人为造作，合宜的回应能否离开习得的规范；先给两家各安一种人生态度，就会跳过文本里彼此批评的那些具体地方。',
  },
  {
    from: 'pt-confucian',
    to: 'pt-legalism',
    kind: 'distinction',
    why: '「儒法之争」常被简化成德治对法治。分界在于双方争的是什么能可靠地产生秩序——习得的德性与礼，还是可公开执行的赏罚与职名；两边的文本内部也各有分歧。',
  },
  {
    from: 'pt-legalism',
    to: 'pt-law',
    kind: 'distinction',
    why: '法、术、势与现代法治常被互相翻译。分界在于前者以君主治术和可公开执行的标准为目标，后者关于有效性的讨论已经预设了权利、程序救济与合法性审查；把后者的问题倒灌回去，会读出文本里没有的东西。',
  },
  {
    from: 'pt-mind-self',
    to: 'pt-african-personhood',
    kind: 'distinction',
    why: '中文「人格」在两页指不同的东西：一边问跨时间还是不是同一个人，一边问谁被承认为拥有不可取消的要求。混同之后，「人格在共同体中成就」听起来像在否认记忆连续性。',
  },

  // ——— 有力反对 ———————————————————————————————————————————————
  {
    from: 'pt-science-reality',
    to: 'pt-justice',
    kind: 'objection',
    why: '它攻击的是「预测够用就好」这一步工具主义辩护。一旦模型的分类和误差率决定谁获得资源，「用得上」就不再是中立标准，还要回答误判的负担落在谁身上。这条压力来自分配正义那一路，不是对科学实在论的形而上学反驳。',
  },
  {
    from: 'pt-freedom',
    to: 'pt-care',
    kind: 'objection',
    why: '它攻击的是相容论对「我自己的理由」这个说法的独占权。照护伦理里的关系性自我主张：如果能力与需要本身就在关系中形成，那么「出自我的理由」里的那个「我」是谁，本身要先回答，而不是给控制条件补一句社会背景就算处理过了。',
  },
  {
    from: 'pt-right-action',
    to: 'pt-care',
    kind: 'objection',
    why: '它攻击的是「道德判断的对象是彼此独立的选择者」这一前提。若能力与需要在不对称的依赖关系中形成，后果、义务与德性该如何排序，就不能先于关系问题回答。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-care',
    kind: 'objection',
    why: '它攻击的是「先确定繁荣生活的样子，再补充社会条件」这个顺序。若人在相当长的时间里都处于依赖之中，把自主理解为自足，等于把大部分人生排除在「好」之外。',
  },
  {
    from: 'pt-science-reality',
    to: 'pt-history-tech',
    kind: 'objection',
    why: '它攻击的是「理论的持续成功可以当作它近似抓到真实结构的证据」这一步。提出这条反对的是历史与技术那一页谱系与权力分析那一路：若成功本身由仪器、资助与同行制度共同造出来，成功就不再是独立于这些条件的证据。那一页的进步与解放叙事一路并不作此判断。',
  },
  {
    from: 'pt-justice',
    to: 'pt-africana-race',
    kind: 'objection',
    why: '它攻击的是「正义可以从比较当前份额开始」这一前提。提出这条反对的是非裔哲学里非殖民与解放实践那一路，它把剥夺看作经由法律、土地划分与劳动安排一代代累积成今天的起点；照这个看法，只调整份额等于默认那段历史已经了结。这是非裔哲学三路中的一路，不是那一页的统一结论。',
  },
  {
    from: 'pt-justice',
    to: 'pt-identity-oppression',
    kind: 'objection',
    why: '它攻击的是「份额分配可以与谁被听见分开处理」这一前提。若可信度本身按身份被分配，那么谁有资格提出分配主张，在讨论开始之前就已经被决定了一部分。',
  },
  {
    from: 'pt-legitimacy',
    to: 'pt-africana-race',
    kind: 'objection',
    why: '它攻击的是「正当性可以在既定政治单位内部证成」这一前提。提出这条反对的是非殖民与解放实践那一路：若这个单位的边界由征服划定，同意、参与与公共自我治理都要先回答谁被算作公民。',
  },
  {
    from: 'pt-history-tech',
    to: 'pt-africana-race',
    kind: 'objection',
    why: '它攻击的是历史与技术那一页「进步与解放叙事」一路的前提：历史可以被写成能力逐步扩展。提出这条反对的是非裔哲学里非殖民与解放实践那一路——殖民与奴役不是进步叙事之外的例外，而是同一段时间里被记为进步的那些制度的组成部分。非裔哲学另有种族的社会建构、生活经验与现象学两路，问的不是同一件事。',
  },
  {
    from: 'pt-mind-self',
    to: 'pt-buddhist',
    kind: 'objection',
    why: '无我分析攻击的是「必须先有一个持续的承载者，经验和记忆才有归属」这一前提：若把身心拆成五蕴一类的成分就足以说明连续性，「我」便不再是用来解释连续性的那个东西，自己反倒成了待解释的对象。各部派与大乘对此的论证并不一致。',
  },
  {
    from: 'pt-nyaya',
    to: 'pt-jain-carvaka',
    kind: 'objection',
    why: '顺世论攻击的是「推论可以作为独立的知识手段」这一前提：由烟推出火，先要有「凡有烟处必有火」这条普遍联系；若这条联系本身只能靠过往经验建立，推论就没有超出经验的效力。顺世论的说法大多只经由批评者转述保存下来，重构时要标明证据条件。',
  },
  {
    from: 'pt-interpretation',
    to: 'pt-identity-oppression',
    kind: 'objection',
    why: '它攻击的是「解释是解释者与文本之间的事」这一前提。谁的读法被记录、被引用、被当作有资格的读法，已经由制度分配过一轮。',
  },
  {
    from: 'pt-freedom',
    to: 'pt-identity-oppression',
    kind: 'objection',
    why: '它攻击的是相容论那一步「行动出自我的理由与反思就够了」。若理由、自我评价以及被人相信的能力都在不平等条件下形成，这种控制是否还足以支撑归责，就成了问题。',
  },

  // ——— 延伸问题 ———————————————————————————————————————————————
  {
    from: 'pt-responsibility',
    to: 'pt-justice',
    kind: 'extension',
    why: '控制原则严格执行会让归责过窄，角色责任又容易无限扩张。这一步逼出的问题是：惩罚、补偿与制度改革该按什么标准分配——归责与分配有连接，却不是同一个议题。',
  },
  {
    from: 'pt-law',
    to: 'pt-justice',
    kind: 'extension',
    why: '一旦承认一条程序上有效的法律可以是不正义的，就得说明凭什么判断它不正义。服从与抗命的界限最后落在权利、分配和历史伤害怎样被权衡上。',
  },
  {
    from: 'pt-care',
    to: 'pt-justice',
    kind: 'extension',
    why: '照护实践的品质说不出照护劳动该由谁承担、承担到什么代价。一旦问到时间、金钱与公共支持怎么分，问题就从关系伦理转到制度分配。',
  },
  {
    from: 'pt-religion-reason',
    to: 'pt-death-meaning',
    kind: 'extension',
    why: '若关于神的论证最多只能得到一个很一般的结论，定不下某个传统的全部教义，那么「有限的一生能否不靠永恒保证而有意义」就必须单独回答。',
  },
  {
    from: 'pt-justice',
    to: 'pt-environment-animals',
    kind: 'extension',
    why: '正义要处理任意出身造成的劣势——出生的年代算不算任意？一旦代际与非人的利益进来，被比较的对象和比较的尺度都要重新界定。',
  },
  {
    from: 'pt-knowledge-sources',
    to: 'pt-science-reality',
    kind: 'extension',
    why: '如果工具中介和他人证言的证据不能还原为某个人的「看到」，那么整个共同体的证据凭什么算证据？对来源的清点在这里逼出模型、理论与不可观察对象的问题。',
  },
  {
    from: 'pt-science-reality',
    to: 'pt-ai-future',
    kind: 'extension',
    why: '模型预测得准却对个例常出错，这个区分直接搬到「表现得像理解是不是就是理解」上：稳定的外部成功能支持哪一类关于内部结构的声称？',
  },
  {
    from: 'pt-identity-oppression',
    to: 'pt-ai-future',
    kind: 'extension',
    why: '若可信度和分类在制度里被分配，那么把这些分类交给自动系统会发生什么？证言不公的分析逼出的下一问是：模型的类别从哪里来，误判的负担落在谁身上。',
  },
  {
    from: 'pt-language-meaning',
    to: 'pt-identity-oppression',
    kind: 'extension',
    why: '把一个人称为「难民」还是「非法者」会改变可说与可见的东西。接着要问的是：谁的分类被制度采用，谁的证言因此被降级。',
  },
  {
    from: 'pt-art',
    to: 'pt-history-tech',
    kind: 'extension',
    why: '如果「艺术世界」的承认参与决定分类，那么当复制、平台与生成系统改变谁能发布、谁被看见时，这套承认机制本身就得重新描述。',
  },
  {
    from: 'pt-islamic-translation',
    to: 'pt-islamic-reason-revelation',
    kind: 'extension',
    why: '译名一旦定下来，接着就要问用这套词汇能证明什么。关于存在、第一因与理智的论证正是在这些译语里展开的，术语选择本身就是争论的一部分。',
  },
  {
    from: 'pt-islamic-reason-revelation',
    to: 'pt-islamic-later',
    kind: 'extension',
    why: '本质与存在、因果与理智的争论并没有随某一位哲学家结束。接着追问，就要进入照明哲学与后古典评注传统怎样重新组织这些争点。',
  },
  {
    from: 'pt-islamic-later',
    to: 'pt-history-tech',
    kind: 'extension',
    why: '近现代改革论辩把「传统如何面对现代性」变成教育、法律与媒介的问题。要继续追问，就得离开形而上学史，去看技术与制度怎样改变共同生活。',
  },

  // ——— 处境应用 ———————————————————————————————————————————————
  {
    from: 'pt-mind-self',
    to: 'pt-ai-future',
    kind: 'case-domain',
    why: '这个处境换掉了原问题里被默认给出的那一项：第一人称报告。系统能被追问、能改口、能满足任何事先设定的行为标准，而我们仍无法从这些表现读出有没有体验。',
  },
  {
    from: 'pt-right-action',
    to: 'pt-environment-animals',
    kind: 'case-domain',
    why: '这个处境改变的是谁进入权衡：受影响者不能提出主张、无法同意，其中一部分还是物种或生态整体而不是个体。后果、权利与德性的比较尺度得先说明适用于什么。',
  },
  {
    from: 'pt-history-tech',
    to: 'pt-ai-future',
    kind: 'case-domain',
    why: '这个处境改变的是中介的密度：推荐、评分与自动决策在人和后果之间插进许多层，注意力、可见性与责任分配都由它们重排。「技术只是中性工具吗」这个争论在这里不能停在原则上，必须落到具体的问责链：谁定下了排序目标，谁改得动它，出错时谁必须给出说明。',
  },
  {
    from: 'pt-history-tech',
    to: 'pt-environment-animals',
    kind: 'case-domain',
    why: '这个处境改变的是时间尺度与承担者：基础设施、能源与供应链的后果落在未来世代和非人身上，决定却在当下作出。谁算得上利益相关方，因此不再由当前的政治单位决定。',
  },
  {
    from: 'pt-interpretation',
    to: 'pt-law',
    kind: 'case-domain',
    why: '这个处境给解释加上了强制后果和有权作决定的机构：读法一旦定下就约束他人。「解释者带着自己的问题进入」在这里不再是方法选项，而要说明谁的读法凭什么能约束别人。',
  },
  {
    from: 'pt-freedom',
    to: 'pt-law',
    kind: 'case-domain',
    why: '这个处境把控制问题放进一个必须公开、可举证、按期限结案的制度里。判断不能等形而上学定论，标准还得能被辩护和复核——这正是法律上的故意与哲学上的控制不可互换的地方。',
  },
  {
    from: 'pt-care',
    to: 'pt-history-tech',
    kind: 'case-domain',
    why: '这个处境改变的是照护关系的中介：排班系统、远程监护与平台派单重新分配谁看得见谁、谁承担等待和赶路的时间。注意与回应因此不再只是照护者的个人品质。',
  },

  // ——— 跨传统比较 —————————————————————————————————————————————
  {
    from: 'pt-being-change',
    to: 'pt-buddhist',
    kind: 'cross-tradition',
    why: '可比较的争点是：一个东西是否需要不依赖条件的自性，才能算在时间中持续。不可等同的是，缘起与空性的论证要放在二谛（日常说法与究竟说法分作两层）这类框架里读，也带着修行目标，不是替代实体论的另一套本体论；各中观传统的解释也不一致。',
  },
  {
    from: 'pt-being-change',
    to: 'pt-daoism',
    kind: 'cross-tradition',
    why: '可比较的争点是固定的分类能否稳定地切分不断变化的世界。不可等同的是《庄子》松动分类的目标在行动与视角，不在给出一套跨时间同一性的判断标准。',
  },
  {
    from: 'pt-language-meaning',
    to: 'pt-daoism',
    kind: 'cross-tradition',
    why: '可比较的争点是命名与分类能否稳定地对应世界。不可等同的是《庄子》松动分类是为了调整行动与视角，不是提出一种意义理论；把它读成「语言构造事实」的先声，会连它自己反对的东西一起丢掉。',
  },
  {
    from: 'pt-death-meaning',
    to: 'pt-buddhist',
    kind: 'cross-tradition',
    why: '可比较的争点是：把意义理解为「某个固定的我完成了什么」，是否本身就在制造苦。不可等同的是佛教以苦的止息为目标，这不是存在主义式自我承担的东方版本。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-buddhist',
    kind: 'cross-tradition',
    why: '可比较的争点是好生活是否要求改变对自我的执取。不可等同的是解脱不是福祉清单上的一项：一旦把它并进清单、与其他项目比较取舍，这个目标本身就已经被改写了。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-confucian',
    kind: 'cross-tradition',
    why: '可比较的争点是好生活能否在关系、礼与学习之外被规定。不可等同的是儒家的「成人」以角色义务和习礼为条件，孟子与荀子对人性与养成的说法也不同，读成客观清单理论的一个版本会两头落空。',
  },
  {
    from: 'pt-care',
    to: 'pt-confucian',
    kind: 'cross-tradition',
    why: '可比较的争点是道德要求能否从具体关系的不对称中生出。不可等同的是儒家把这种要求接在礼、孝与角色秩序上，而照护伦理同时要批评性别分工——比较必须带着这层批评一起做。',
  },
  {
    from: 'pt-legitimacy',
    to: 'pt-confucian',
    kind: 'cross-tradition',
    why: '可比较的争点是统治凭什么要求服从：可接受的合作条件与不受任意支配，还是德、礼与教化产生的信任。不可等同的是儒家文本讨论的是君臣、父子一类的角色义务，不以个人授权为计算单位。',
  },
  {
    from: 'pt-mind-self',
    to: 'pt-indian-vedanta',
    kind: 'cross-tradition',
    why: '可比较的争点是意识能否被身体过程穷尽。不可等同的是吠檀多关于 ātman 的讨论同时是经文解释与解脱实践的任务，各分支对梵我关系的说法也显著不同，它不是心身问题的一个理论选项。',
  },
  {
    from: 'pt-indian-vedanta',
    to: 'pt-buddhist',
    kind: 'cross-tradition',
    why: '可比较的争点是解脱要求确认还是取消一个究竟的自我。不可等同的是双方的论证与经文层次不同，读成「有我／无我」的正反两面，会抹掉两边内部的分歧。',
  },
  {
    from: 'pt-religion-reason',
    to: 'pt-indian-vedanta',
    kind: 'cross-tradition',
    why: '可比较的争点是终极实在能否由论证达到，还是要靠经文与实践。不可等同的是吠檀多的「梵」不是有神论论证里那个位格神，把它译成 God，整套解脱论就失去了对象。',
  },
  {
    from: 'pt-knowledge-sources',
    to: 'pt-nyaya',
    kind: 'cross-tradition',
    why: '可比较的争点是有几种独立的知识手段，以及证言算不算一种。不可等同的是 pramāṇa（量，即知识手段）的分类连着一整套辩论规则，还连着一份「看似成立、其实不成立的理由」的清单，套不进经验主义／理性主义的两分。',
  },
  {
    from: 'pt-logic',
    to: 'pt-nyaya',
    kind: 'cross-tradition',
    why: '可比较的争点是一个推论凭什么可靠：遍在关系、反例排除，还是形式。不可等同的是五支论证以在辩论中说服对手为目标，不是三段论的另一种写法。',
  },
  {
    from: 'pt-nyaya',
    to: 'pt-buddhist',
    kind: 'cross-tradition',
    why: '可比较的争点是知觉是否直接给出对象、推论凭什么可靠。这里不只是并置：两个传统长期在同一场论辩里互相回应，但它们的对象理论与真理层次不同，各取一句拼不成共识。',
  },
  {
    from: 'pt-knowledge-sources',
    to: 'pt-jain-carvaka',
    kind: 'cross-tradition',
    why: '可比较的争点是感知、推论、证言与有限视角该怎样排序。不可等同的是耆那的多面性要求说明断言的对象、条件与视角，不是「各种说法都对」；顺世论的立场又大量经批评者转述，重构必须标出证据条件。',
  },
  {
    from: 'pt-right-action',
    to: 'pt-jain-carvaka',
    kind: 'cross-tradition',
    why: '可比较的争点是意图、后果与关系怎样共同决定一个行动。不可等同的是耆那的非暴力连着业与解脱论，不是后果论或义务论的一个变体，也不自动给出职业与政策冲突的答案。',
  },
  {
    from: 'pt-science-reality',
    to: 'pt-islamic-reason-revelation',
    kind: 'cross-tradition',
    why: '可比较的争点是稳定的自然次序是否足以支持因果解释。不可等同的是，偶因论——主张自然中前后相继的事件之间并无必然联系，真正起作用的是神——要回答的是神的自由与创造，它不站在当代实在论—工具主义之争的任何一边。',
  },
  {
    from: 'pt-care',
    to: 'pt-african-personhood',
    kind: 'cross-tradition',
    why: '可比较的争点是：如果一个人的能力与需要本身就在关系中形成，这样理解的自我还能不能与个人权利、退出和批评相容。不可等同的是两者出自不同的道德语言与政治问题，Ubuntu 在不同语言和政治项目里的含义本身就不统一。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-african-personhood',
    kind: 'cross-tradition',
    why: '可比较的争点是个人的好能否离开共同善来说明。不可等同的是「人格」在非洲人格观里指道德成熟的成就或社会承认，而不是福祉的承载者；叠起来会让「人格在共同体中成就」听着像取消个人福祉。',
  },

  // ——— 历史语境 ———————————————————————————————————————————————
  {
    from: 'pt-freedom',
    to: 'pt-western-modern',
    kind: 'historical-context',
    why: '材料是 17—18 世纪欧洲关于因果、意志与道德法则的文本，霍布斯、休谟、斯宾诺莎与康德把它们放进不同框架。不能从这段材料推出自由意志问题只有近代欧洲这一种提法。',
  },
  {
    from: 'pt-knowledge-sources',
    to: 'pt-western-modern',
    kind: 'historical-context',
    why: '材料是近代关于经验、理性、证言与知识限度的争论。不能从「理性主义对经验主义」这条教材线推出近代认识论只有两队人，更推不出同期别处没有认识论争论。',
  },
  {
    from: 'pt-mind-self',
    to: 'pt-western-modern',
    kind: 'historical-context',
    why: '材料是笛卡尔、洛克与休谟关于身心、人格与自我认识的具体文本。不能从它推出今天的心灵哲学分类可以直接盖回这些文本，也不能把记忆理论说成洛克的现代版。',
  },
  {
    from: 'pt-legitimacy',
    to: 'pt-western-modern',
    kind: 'historical-context',
    why: '材料是同一时期关于自然权利、契约与政治权威的争论。不能从它推出同意是正当性的唯一历史来源，也不能把契约论读成对当时政治实践的描述。',
  },
  {
    from: 'pt-science-reality',
    to: 'pt-western-modern',
    kind: 'historical-context',
    why: '材料是近代实验、数学化与认识论如何一起形成问题的那段文本与实践。不能从它推出「科学方法」在这一时期被一次性确定下来。',
  },
  {
    from: 'pt-logic',
    to: 'pt-western-ancient',
    kind: 'historical-context',
    why: '材料是亚里士多德的推论作品与古代论辩、谬误传统。不能把它读成现代符号逻辑的粗略预演——它的目标包括辩论与教学，不只是保真形式。',
  },
  {
    from: 'pt-being-change',
    to: 'pt-western-ancient',
    kind: 'historical-context',
    why: '材料是从巴门尼德、赫拉克利特到亚里士多德的自然与实体讨论。不能从它推出一条「变化问题逐步解决」的线；这些文本的保存与作者归属本身也有限度。',
  },
  {
    from: 'pt-good-life',
    to: 'pt-western-ancient',
    kind: 'historical-context',
    why: '材料是亚里士多德的德性、伊壁鸠鲁的快乐与斯多亚对可控之事的区分。不能把它们合并成一种「古典幸福论」，也不能从「古人重德性」推出他们对好生活有共识。',
  },
  {
    from: 'pt-death-meaning',
    to: 'pt-western-ancient',
    kind: 'historical-context',
    why: '材料是伊壁鸠鲁一系关于死亡为何不是伤害的论证及其快乐论背景。不能从它推出「古人不怕死」，那是把一种论证当成一个时代的心态。',
  },
  {
    from: 'pt-right-action',
    to: 'pt-western-ancient',
    kind: 'historical-context',
    why: '材料是古典关于德性与实践智慧的讨论。不能把它当作现代规则理论的前史：那些文本里伦理、政治与教育并没有按现代学科切开。',
  },
  {
    from: 'pt-religion-reason',
    to: 'pt-western-medieval',
    kind: 'historical-context',
    why: '材料是拉丁、阿拉伯与希伯来语境中自然神学与一神教论辩的相互传译。不能从它推出「理性对宗教」是一场贯穿各处的同一对立，也不能把不同一神教传统合成一种哲学。',
  },
  {
    from: 'pt-western-medieval',
    to: 'pt-islamic-translation',
    kind: 'historical-context',
    why: '材料是 8—10 世纪前后希腊语、叙利亚语与波斯语知识译入阿拉伯语的具体网络。不能把这段活动读成被动保管：选哪些文本、怎样定译名，本身就在造概念。',
  },
  {
    from: 'pt-being-change',
    to: 'pt-islamic-reason-revelation',
    kind: 'historical-context',
    why: '材料是阿拉伯语哲学中关于存在、本质、因果与第一原理的技术传统。不能假定这些术语与亚里士多德原文或近代形而上学同义，译语的选择正是争论的一部分。',
  },
  {
    from: 'pt-religion-reason',
    to: 'pt-islamic-reason-revelation',
    kind: 'historical-context',
    why: '材料是法拉比、伊本·西那、安萨里、伊本·鲁世德关于存在、因果、灵魂与先知知识的论辩。不能从它推出哲学家与神学家是两个固定阵营，也不能把当代「科学对宗教」的框架倒灌进去。',
  },
  {
    from: 'pt-environment-animals',
    to: 'pt-western-contemporary',
    kind: 'historical-context',
    why: '材料是环境伦理作为当代学科形成时，与功利主义、权利论和土地伦理之间的张力。不能从这段争论推出生态整体与个体利益已经有了公认的排序方式。',
  },
  {
    from: 'pt-identity-oppression',
    to: 'pt-western-contemporary',
    kind: 'historical-context',
    why: '材料是女性主义与社会认识论各自的论争史。不能把它们当作一套统一观点——关于本质主义、交叉性与结构概念的分歧，正是这段历史的内容。',
  },
  {
    from: 'pt-ai-future',
    to: 'pt-western-contemporary',
    kind: 'historical-context',
    why: '材料是计算、心灵哲学与社会技术批评在 20 世纪的交叉。不能从它推出当代系统的能力问题在那时已被回答，只能看到这些问题是怎样被提出来的。',
  },
  {
    from: 'pt-history-tech',
    to: 'pt-western-contemporary',
    kind: 'historical-context',
    why: '材料是 19 世纪以来关于技术、劳动与媒介的多条思想线。不能从它推出这些线索有共同结论，它们对进步、异化与权力的判断彼此冲突。',
  },
  {
    from: 'pt-buddhist',
    to: 'pt-chinese-later',
    kind: 'historical-context',
    why: '材料是佛教文献进入汉语世界的翻译、注释、教团与制度过程。不能把它读成原有理论的无损复制，也不能从中推出汉语佛教是某个印度学派的直接延续。',
  },
  {
    from: 'pt-interpretation',
    to: 'pt-chinese-later',
    kind: 'historical-context',
    why: '材料是两汉经学、魏晋玄学、宋明理学与清代考据对同一批经典的不同读法。不能从「同一部经典」推出各时代读出的是同一套主张：注释与教育制度参与决定了它能说什么。',
  },
  {
    from: 'pt-confucian',
    to: 'pt-chinese-later',
    kind: 'historical-context',
    why: '材料是先秦文本在后世被选择、注释并赋予新权威的那段历史。不能从「儒家」这个名称推出各时代读的是同一套主张；今天的读法本身有来历。',
  },
  {
    from: 'pt-identity-oppression',
    to: 'pt-africana-race',
    kind: 'historical-context',
    why: '材料是关于种族分类、殖民与解放的具体论辩，包括法农一系对种族化身体与语言的分析。不能把这些分析从殖民语境里取出来当作通用理论，也不能从中读出一个统一的群体声音。',
  },
];

function assertRelations(relations: PhilosophyRelation[]) {
  const seen = new Set<string>();
  for (const relation of relations) {
    if (!getNodeById(relation.from)) {
      throw new Error(`知识关系的起点节点不存在：${relation.from}`);
    }
    if (!getNodeById(relation.to)) {
      throw new Error(`知识关系的终点节点不存在：${relation.to}`);
    }
    if (relation.from === relation.to) {
      throw new Error(`知识关系不能指向自己：${relation.from}`);
    }
    if (!relation.why.trim()) {
      throw new Error(`知识关系缺少理由：${relation.from} → ${relation.to}`);
    }
    const key = `${relation.from}|${relation.to}|${relation.kind}`;
    if (seen.has(key)) {
      throw new Error(`重复的知识关系：${key}`);
    }
    seen.add(key);
  }
}

assertRelations(philosophyRelations);
assertDirectionSemantics();
assertNoDirectionalDeixis(philosophyRelations);
assertNoPrerequisiteCycle(philosophyRelations);
assertNoDuplicatePairs(philosophyRelations);

/**
 * 横向链条。
 *
 * 问题域之间真实存在的连锁：自由意志的结论会压到道德责任，道德责任会压到
 * 惩罚，惩罚又回到政治正义。这种链条是知识地图最有价值的部分，也最容易被
 * 六个并列的问题域切断。
 *
 * 手写而不是从关系图自动求路径：图上任意两点之间都能找出一条路，能自动
 * 生成的「链条」大多数都不是读者真的会走的那条。
 */
export type CrossDomainChain = {
  id: string;
  title: string;
  /** 这条链条在追问什么。 */
  why: string;
  /** 按顺序排列的节点 id。 */
  nodeIds: string[];
};

export const crossDomainChains: CrossDomainChain[] = [
  {
    id: 'chain-freedom-to-justice',
    title: '从「我能不能另作选择」走到「制度该怎样分配」',
    why: '关于控制的结论不会停在心里。它先决定谁该被责备，再决定惩罚与补偿凭什么正当，最后落到一套制度按什么标准对待人。每往前一步都会多出上一页没有的变量：先是运气与角色，然后是程序与强制，最后是权利与份额。',
    nodeIds: ['pt-freedom', 'pt-responsibility', 'pt-law', 'pt-justice'],
  },
  {
    id: 'chain-evidence-to-accountability',
    title: '从「我凭什么相信」走到「模型出错谁负责」',
    why: '一条链上的四页问的是同一件事在不同层次上的样子：一个人的证据、一个共同体的证据、一次错误该归给谁，最后是当出错的是一套自动系统时，这套归责方式还剩下多少可用。责任排在人工智能之前不是随手放的——缺了「是否出自某个人」「能否被要求说明理由」「能否被追究并承担后果」这三层区分，自动化伤害的讨论只会在「怪算法」和「怪用户」之间空转。',
    nodeIds: ['pt-knowledge-sources', 'pt-science-reality', 'pt-responsibility', 'pt-ai-future'],
  },
  {
    id: 'chain-naming-to-redress',
    title: '从一个称呼走到历史补偿',
    why: '换一个词称呼一群人，会改变谁被相信；谁被相信，会改变谁能提出分配主张；分配主张一旦回溯到起点是怎样形成的，问题就不再是当下的份额。这条链让「用词」和「赔偿」之间的每一步都有理由，而不是一步跳到结论。',
    nodeIds: ['pt-language-meaning', 'pt-identity-oppression', 'pt-justice', 'pt-africana-race'],
  },
  {
    id: 'chain-good-life-to-care-work',
    title: '从「什么值得过」走到「照护劳动谁承担」',
    why: '把好生活想成一个人的成就，接着问该怎么行动时就会发现对象是彼此依赖的人；承认依赖之后，照护的时间、金钱和体力又不是靠品格能分配的。这条链把一个看似私人的问题一路推到制度上。',
    nodeIds: ['pt-good-life', 'pt-right-action', 'pt-care', 'pt-justice'],
  },
];

for (const chain of crossDomainChains) {
  if (chain.nodeIds.length < 3) {
    throw new Error(`横向链条 ${chain.id} 少于三个节点，算不上链条`);
  }
  for (const nodeId of chain.nodeIds) {
    if (!getNodeById(nodeId)) {
      throw new Error(`横向链条 ${chain.id} 指向了不存在的节点：${nodeId}`);
    }
  }
}

/**
 * 构建期校验：链条的步进方向不能和 prerequisite 边打架。
 *
 * `from: A, to: B` 的 prerequisite 意思是「读 A 之前先读 B」。所以链条里
 * 一旦出现 A 紧接着 B 的步进，就等于同一份数据在两处给出相反的阅读顺序：
 * 地图上的链条说「往前走一步到 B」，B 的关系区却说「B 是 A 的前置」。
 * 「从我凭什么相信走到模型出错谁负责」那条链原先正是这样，把责任排在了
 * 人工智能之后。
 */
for (const chain of crossDomainChains) {
  for (let index = 0; index < chain.nodeIds.length - 1; index += 1) {
    const current = chain.nodeIds[index];
    const following = chain.nodeIds[index + 1];
    const conflict = philosophyRelations.find(
      (relation) =>
        relation.kind === 'prerequisite' && relation.from === current && relation.to === following,
    );
    if (conflict) {
      throw new Error(
        `横向链条 ${chain.id} 把 ${following} 排在 ${current} 之后，` +
          `但 relations 里 ${following} 是 ${current} 的前置（先读 ${following}）。两处顺序相反。`,
      );
    }
  }
}

export type RelatedEntry = {
  node: PhilosophyNode;
  kind: RelationKind;
  why: string;
  /** true 表示这条边是别人指向本页的，展示时用 inbound 标题。 */
  reversed: boolean;
};

export type RelationGroup = {
  kind: RelationKind;
  title: string;
  entries: RelatedEntry[];
};

const outboundByNode = new Map<string, PhilosophyRelation[]>();
const inboundByNode = new Map<string, PhilosophyRelation[]>();

for (const relation of philosophyRelations) {
  const out = outboundByNode.get(relation.from) ?? [];
  out.push(relation);
  outboundByNode.set(relation.from, out);

  const into = inboundByNode.get(relation.to) ?? [];
  into.push(relation);
  inboundByNode.set(relation.to, into);
}

/**
 * 本页的全部关系，按语义分组。
 *
 * 反向边一起并进来：A 以 B 为前置时，B 的页面上也应看到「以本页为前置的问题：A」。
 * 对称关系（易混辨析、跨传统可比）合并进同一组，不重复成两块。
 */
export function relationGroupsFor(nodeId: string): RelationGroup[] {
  const entries: RelatedEntry[] = [];

  for (const relation of outboundByNode.get(nodeId) ?? []) {
    const node = getNodeById(relation.to);
    if (node) entries.push({ node, kind: relation.kind, why: relation.why, reversed: false });
  }
  for (const relation of inboundByNode.get(nodeId) ?? []) {
    const node = getNodeById(relation.from);
    if (node) {
      entries.push({
        node,
        kind: relation.kind,
        why: relation.why,
        reversed: !symmetricKinds.has(relation.kind),
      });
    }
  }

  const groups = new Map<string, RelationGroup>();
  // 对称关系两个方向都写了的时候，同一个节点会进来两次；按节点去重，
  // 保留先出现的那条理由。
  const seen = new Set<string>();
  for (const entry of entries) {
    // 方向措辞只有 relationFacing 一处实现，文章页和地图页都走它。
    const { title } = relationFacing(entry.kind, entry.reversed);
    const key = `${entry.kind}|${title}`;
    const entryKey = `${key}|${entry.node.id}`;
    if (seen.has(entryKey)) continue;
    seen.add(entryKey);
    const group = groups.get(key) ?? { kind: entry.kind, title, entries: [] };
    group.entries.push(entry);
    groups.set(key, group);
  }

  return [...groups.values()].sort(
    (a, b) => relationLabels[a.kind].order - relationLabels[b.kind].order,
  );
}

/** 本页直接连到的全部节点（含反向），供知识地图统计与孤立节点检查使用。 */
export function degreeOf(nodeId: string): number {
  return (outboundByNode.get(nodeId)?.length ?? 0) + (inboundByNode.get(nodeId)?.length ?? 0);
}

/** 没有任何语义关系的节点。地图页用它自审，不把孤岛藏起来。 */
export function isolatedNodeIds(): string[] {
  return philosophyNodes
    .filter((node) => (node.children ?? []).length === 0 && degreeOf(node.id) === 0)
    .map((node) => node.id);
}
