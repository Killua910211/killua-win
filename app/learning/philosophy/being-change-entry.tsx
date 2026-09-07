import Link from 'next/link';
import type { PhilosophyNode } from './tree';
import { getCoreEntryLedger, type LedgerSource } from './content-ledger';
import styles from './being-change-entry.module.css';

type CitationProps = { id: string; sources: LedgerSource[] };

function Citation({ id, sources }: CitationProps) {
  const source = sources.find((item) => item.id === id);
  if (!source) return <span className={styles.missingCitation}>[{id}：待核验]</span>;

  return (
    <a
      className="philosophy-citation"
      href={source.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`来源 ${id}：${source.title}（在新标签页打开）`}
    >
      [{id}]
    </a>
  );
}

/**
 * 「存在与变化」是本知识库的入门样板。
 * 它有一条独立的教学主线，避免通用条目模板把来源状态、人物与跨传统材料
 * 插到读者尚未理解“同一辆车为何成问题”的位置。
 */
export function BeingChangeEntry({ node }: { node: PhilosophyNode }) {
  const ledger = getCoreEntryLedger(node.id);
  if (!ledger) return null;
  const sources = ledger.sources;

  return (
    <div className={`${styles.entry} philosophy-body-main`}>
      <nav className={styles.toc} aria-label="本文章节导航">
        <a href="#being-bicycle">从一辆自行车开始</a>
        <a href="#being-standards">判断标准为何冲突</a>
        <a href="#being-voices">哲学家如何改写问题</a>
        <a href="#being-theories">对象怎样跨时间存在</a>
        <a href="#being-practice">迁移练习</a>
      </nav>

      <section className="philosophy-block" id="being-bicycle" aria-labelledby="being-bicycle-title">
        <h2 className="philosophy-block-title" id="being-bicycle-title">先从一辆不断维修的自行车开始</h2>
        <div className={styles.prose}>
          <p>
            你有一辆骑了多年的自行车。先换链条，后来换轮胎、车座和把手；车架裂了，也换掉。每一次维修后，你都把它从车店骑回家，继续叫它“我的那辆车”。多年后，最初的零件一个不剩。它还是原来的那辆吗？
          </p>
          <p>
            事情还没有结束。车店没有丢掉旧零件，而是把它们保存下来，并请人把它们重新装成另一辆可骑的车。现在眼前有两辆：甲车延续了你的使用、维修和交接经历；乙车保留了最初的材料。哪一辆才是原来的那辆？本页用这个<strong>教学性案例</strong>来练习分析；它不是在替任何哲学家复述原话。
          </p>
          <p>
            这个问题不该靠“我更喜欢哪一辆”的投票结束。我们通常愿意说，一辆修好的车还是原车；但原来的材料似乎又同原车有特殊联系。旧零件被重新组装后，两种直觉开始指向不同对象。于是，真正需要回答的不是“大家怎么叫它”，而是：变化中的对象凭什么仍是那个对象？
            <Citation id="BEC-1" sources={sources} />
          </p>
        </div>
      </section>

      <section className="philosophy-block" aria-labelledby="being-distinction-title">
        <h2 className="philosophy-block-title" id="being-distinction-title">先分清：很像，和就是同一个</h2>
        <div className={styles.prose}>
          <p>
            两辆新出厂、型号和颜色完全一样的自行车，可以在许多性质上相同或相似：都能骑、都用同类零件、外观也难分辨。但车锁上的两把钥匙仍分别开各自的锁；它们是两辆车，而不是一辆车出现了两次。哲学里常把这种“在性质上相同或相似”叫作<strong>质的相同／相似</strong>。
          </p>
          <p>
            另一个问题更严格：今天停在楼下的车，是否就是去年那辆，而不是另一辆恰好很像的车？这里问的是<strong>数值同一性</strong>（numerical identity）：说“甲与乙是数值同一的”，是说这里只有一个对象，不是两个对象恰好相似。这个“数值”不表示数量相等；它强调“一个，而非两个”。反过来，同一个对象也可以有不同性质：去年是红色，今天补漆成黑色。
            <Citation id="BEC-1" sources={sources} />
          </p>
          <dl className={styles.concepts}>
            <div>
              <dt>跨时间持续</dt>
              <dd>我们把不同时刻的车当作同一对象，究竟依据什么、又以什么方式理解它一直在场。</dd>
            </div>
            <div>
              <dt>严格同一与日常称呼</dt>
              <dd>维修记录、法律登记或情感归属会影响我们怎么称呼；它们可以提供理由，却不自动等于严格同一性的证明。</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="philosophy-block" id="being-standards" aria-labelledby="being-standards-title">
        <h2 className="philosophy-block-title" id="being-standards-title">三种有吸引力的判断标准，为什么会彼此冲突</h2>
        <p className={styles.sectionIntro}>
          下列是整理直觉的候选标准，不是三大互斥学派，也不是已经证明的充分必要条件。它们回答的是“在什么根据下把前后当作同一辆车”，而非“对象以何种方式跨时间存在”。
        </p>
        <div className={styles.standards}>
          <section>
            <h3>1. 原材料优先：原来的零件最要紧</h3>
            <p>它的吸引力很直观：把一件文物、木船或自行车的原材料全部换掉，似乎失去了某种与原物的物理联系。按这个思路，乙车因由旧零件重组，比甲车更像原车。</p>
            <p>困难随即出现。若“原材料必须一件不动”，那么第一次换掉一根断裂的辐条，原车就已经不在了；这和普通维修实践很不相称。若允许逐步替换，标准又要说明：为什么能换一件、十件，却在某一点忽然不再是原物？</p>
            <p>支持者可回应：材料连续不必是全或无，可以是重要但可被维修历史补强的条件。代价是它不再给出一条机械界线，也可能在旧材料重组时与历史连续性发生冲突。</p>
          </section>
          <section>
            <h3>2. 结构与功能优先：能否仍以同一方式组织和使用</h3>
            <p>甲车保持同一车架布局（在更换前后）、相近用途，并一直服务于同一段骑行生活；这使“它一直是那辆车”的说法很自然。该思路尤其适合解释维修：一辆车不必保存每颗螺丝，也能持续履行作为车的角色。</p>
            <p>但仅凭结构和功能不足以保证严格同一性。两辆按同一图纸造出的车可以结构、功能都一样，却仍是两辆。乙车若修复成功，也能骑；因此，功能相似解释了“为什么它像原车”，还没有解释“为什么它就是原车”。</p>
            <p>回应可以把结构看成连续组织而非静态蓝图：甲车不是复制品，而是每一步都由上一步维修而来。这样一来，真正承担工作的是连续的历史，而不只是当前结构。</p>
          </section>
          <section>
            <h3>3. 因果与历史连续性优先：由哪一段经历延续而来</h3>
            <p>甲车的每次状态都由上一状态的使用、磨损和修理造成；这条连续链没有中断。它能解释为什么换完零件后，车主仍有理由把甲车当成原车，也解释为什么一辆外观完全相同的复制品不会因此成为原物。</p>
            <p>难题是“连续到什么程度才够”。如果车在仓库拆散一年再装回，连续性是否断了？如果两条都看似连续的修复链分叉，严格同一性又不能让两个不同对象都成为同一个原物。</p>
            <p>因此，这个标准很有解释力，却仍需要说明它排除竞争者的规则。它能把选择甲车讲得比“我习惯这么叫”更强，但不保证所有边界案例都有无争议答案。</p>
          </section>
        </div>
      </section>

      <section className="philosophy-block" aria-labelledby="being-walkthrough-title">
        <h2 className="philosophy-block-title" id="being-walkthrough-title">完整走一遍：两辆车不能同时严格是原车</h2>
        <ol className={styles.walkthrough}>
          <li><strong>明确问题。</strong>我们暂时问严格的数值同一性，而不是维修单上该写哪辆、车主对哪辆有感情。</li>
          <li><strong>提出标准。</strong>试着把“因果与历史连续”作为最重要的条件：对象的后来状态应由其先前状态在一条未被替代的历史中发展而来。</li>
          <li><strong>得到判断。</strong>按这个条件，甲车最有资格：它是那段持续使用和逐步维修的延续；乙车与原车材料关系强，却是在另一段重组历史中出现。</li>
          <li><strong>加入反例。</strong>乙车并非普通复制品，它用的正是原来的所有零件。这暴露出材料直觉并没有消失。</li>
          <li><strong>尝试回应。</strong>历史连续说可以承认材料重要，却主张“材料被保存后另行组装”不足以接管先前那条使用历史。</li>
          <li><strong>留下难题。</strong>这仍要解释拆解、停放、分叉等情况的阈值；而且若有人坚持材料优先，他会做出不同判断。分歧是可说清的前提差异，不是“随便选”。</li>
        </ol>
        <div className={styles.prose}>
          <p>
            无论最终选甲还是乙，通常的严格同一性理解都不允许直接说“两个彼此不同的对象都是同一辆原车”。如果甲就是原车，而乙也就是原车，那么甲和乙也应是同一个对象；但它们显然可以并排停放、分别被骑走。这正是旧零件重组让问题变尖锐的地方。日常语境中，我们也许会宽松地把两辆都叫“原车”；那是命名和目的的差异，不能替代前面的严格判断。
            <Citation id="BEC-1" sources={sources} />
          </p>
        </div>
      </section>

      <section className="philosophy-block" id="being-voices" aria-labelledby="being-voices-title">
        <h2 className="philosophy-block-title" id="being-voices-title">哲学家不是在给同一辆车投票：他们先改写了问题</h2>
        <p className={styles.sectionIntro}>
          下面的比较不是一张“谁支持甲车、谁支持乙车”的表。多数人物没有讨论过自行车；这里把他们的论证放在原来的问题中，再说明它会怎样改变我们分析替换与重组案例的方式。因而“可怎样借用”是解释性重构，不是替他们宣判。
        </p>
        <div className={styles.voices}>
          <section>
            <div className={styles.voiceLabel}>约前 5 世纪<br />巴门尼德</div>
            <div>
              <h3>若“变成不是它的东西”不可能，变化本身就成了难题</h3>
              <p>在残存材料及其后世转述所呈现的论证中，巴门尼德把“是”与“不是”之间的张力推到极端：若变化意味着某物从“不是”变成“是”，或从“是”变成“不是”，那么变化似乎不可思议。因材料极少，究竟应把他读作只承认一个存在者，还是只承认一种“是”，仍有争议。</p>
              <p><strong>对自行车案例的提醒：</strong>不要急着问哪辆“保持同一”；先看到这个日常问题预设了真实变化与持续能并存。巴门尼德并没有提供甲、乙二选一的判准，他让这个预设变成必须辩护的对象。<Citation id="BEC-5" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>约前 5 世纪<br />赫拉克利特</div>
            <div>
              <h3>有些东西恰恰靠更替才保持</h3>
              <p>赫拉克利特常被压缩成“万物流变”，但关于河流与对立面的解释并不只有一种。较谨慎的读法指出：某些较高层次的持续，可能正依赖其组成材料不断周转；对立状态也不必被说成同一事物在同一时间、同一方面自相矛盾。</p>
              <p><strong>对自行车案例的提醒：</strong>逐步更换零件不必自动消灭持续性；变化可以是持续的条件。不过，这只能说明“材料更替不必终止一切同一”，还不能决定旧零件重组后哪辆是原车。<Citation id="BEC-6" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>前 4 世纪<br />亚里士多德</div>
            <div>
              <h3>区分承受变化的主体，与使它成为这一类东西的形制</h3>
              <p>亚里士多德以质料、形式及其复合来分析变化：一个主体可以在不同时间取得相反性质；但有些变化是实体性的生成或毁灭，而不只是同一对象的性质改变。形式并不只是外观形状，也与“它是什么”及功能解释相连。何者才算实体、质料与形式怎样定位，本身有复杂的解释争论。</p>
              <p><strong>对自行车案例的提醒：</strong>它促使我们分开问：补漆、换链条是对一辆车的改变，还是已不再构成一辆车？材料堆重新按组织方式构成自行车，是否已产生另一件人工物？亚里士多德没有给现代人工物的重组案留下机械答案。<Citation id="BEC-7" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>17 世纪<br />洛克</div>
            <div>
              <h3>先问“这是什么种类的东西”，再问同一性条件</h3>
              <p>洛克在《人类理解论》第二卷第 27 章中强调，不能用一种“同一实体”概括所有同一性。原子、物质集合、生命体和人有不同的持续条件：物质集合取决于组成粒子，生命体则涉及维持同一生命的组织；人格问题又另有其论证与规范关切。</p>
              <p><strong>对自行车案例的提醒：</strong>“原材料还在”与“同一组织仍延续”本来就在回答不同种类问题。洛克没有明确给出“自行车”这类人工物的判准，但他的做法要求我们先说明所说的“车”是物质集合、功能性人工物，还是登记与使用中的物件。<Citation id="BEC-8" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>18 世纪<br />休谟</div>
            <div>
              <h3>严格同一感，可能来自心灵顺畅地连接一串相关对象</h3>
              <p>休谟考察我们为何会把有间断、又有变化的经验当作同一对象的持续存在。他把这种归属与想象力在相似、连续和因果关联间的顺畅过渡联系起来，并以此质疑我们对严格、持续同一的日常把握。这里是在说明一种信念如何产生，而不只是提出新的材料标准。</p>
              <p><strong>对自行车案例的提醒：</strong>车主沿着使用、损耗和维修记录把甲车叫作“同一辆”，可能有很强的认知与实践基础；这却未必已经证明世界中存在一条独立、严格的同一性事实。休谟的挑战不是“任意叫都行”，因为关联的类型与强弱仍需要说明。<Citation id="BEC-9" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>20 世纪<br />怀特海</div>
            <div>
              <h3>若过程而非持存实体更基本，应先解释稳定模式怎样形成</h3>
              <p>怀特海的过程哲学不把持久实体当作最基本单位，而以事件性的“实际契机”及其关系、生成和模式为核心。这不只是说“事物会变化”，而是在本体论层面重新安排什么更基本；其具体体系也远比“万物都是过程”复杂。</p>
              <p><strong>对自行车案例的提醒：</strong>问题可从“哪个不变的物承受变化”移为“什么样的组织、关系与实践模式足以构成持续的车”。这能启发历史连续性思路，却仍不能单独裁决旧零件重组的分叉案。<Citation id="BEC-3" sources={sources} /></p>
            </div>
          </section>
          <section>
            <div className={styles.voiceLabel}>约 2—3 世纪<br />龙树</div>
            <div>
              <h3>警惕把对象、性质和变化想成彼此独立、自己成立的东西</h3>
              <p>龙树关于运动与变化的论证，针对的是事物具有不依条件、不可变的自性（svabhāva）的设想；其中会分析“动者”与“运动”等概念的相互依赖。中观并不因此滑向“什么都不存在”的虚无论，其目标也和西方对象持续理论不同。</p>
              <p><strong>对自行车案例的提醒：</strong>它会追问：把“原车”当作一个独立不变的核心，是否已经误设了问题？零件、因果、命名和用途的依赖关系怎样参与构成？这是一种对自性预设的批评，不是耐存论、延存论或过程哲学的同义替代。<Citation id="BEC-4" sources={sources} /></p>
            </div>
          </section>
        </div>
        <p className={styles.comparisonNote}>
          <strong>比较后的结论：</strong>人物之间真正不同的，往往不是“替换零件后算不算同一”这一票，而是他们认为要解释什么——变化为何可能、何种组织使对象成为这一类、同一性准则是否随种类而变、同一性感是否为一种心理建构，或独立自性这一预设是否成立。把这些层次拆开，才不会用一个名字替代一段论证。
        </p>
      </section>

      <section className="philosophy-block" id="being-theories" aria-labelledby="being-theories-title">
        <h2 className="philosophy-block-title" id="being-theories-title">再问一层：对象是怎样跨时间存在的？</h2>
        <div className={styles.prose}>
          <p>
            到这里，判断标准还留下一个更深的问题：甲车如果从红变黑、从旧链条变成新链条，它如何既有不同性质，又仍是一个对象？这不是材料、功能或历史连续性的同义改写，而是问对象的<strong>持续方式</strong>。
          </p>
        </div>
        <div className={styles.theories}>
          <section>
            <h3>同一个整体在不同时刻完整存在</h3>
            <p>一种解释说，昨天的整辆车和今天的整辆车都是同一个完整对象；它昨天有“在昨天为红”的性质，今天有“在今天为黑”的性质。时间被写进性质的说明里，变化就不要求同一对象在同一时刻既红又黑。</p>
            <p>这常被称为持续主义／耐存论（endurance）。它贴近日常“整辆车在这里”的说法，却要进一步说明：仅给性质加上时间，是否足以解释所有变化与重合问题？</p>
          </section>
          <section>
            <h3>对象具有不同的时间部分</h3>
            <p>另一种解释把一辆持续多年的车看作跨时间延展的整体：早期的车阶段带有旧链条，后期的车阶段带有新链条。就像道路在不同地点有不同路段，持续的对象在不同时间有不同的时间部分。这常被称为四维主义／延存论（perdurance）。</p>
            <p>照片或电影帧只能帮助想象“不同时间的阶段”，不是对象本身的时间部分；它们是记录。该理论真正主张的是，对象自身以跨时部分构成整体。它也不自动告诉我们两辆车中哪辆是原车：那仍需要前面的同一性判断。
              <Citation id="BEC-2" sources={sources} />
            </p>
          </section>
        </div>
      </section>

      <details className={styles.advanced}>
        <summary>进阶关联：过程、何者更基本，以及中观的自性问题</summary>
        <div className={styles.advancedBody}>
          <p>
            <strong>过程哲学</strong>优先问“在解释世界时，过程、事件和发生是否比稳定的东西更基本”。它当然关心变化，却不是“时间部分理论”的另一个名字；前者主要在争论本体论的解释优先性，后者主要解释对象怎样跨时间存在。把自行车理解为一段维修过程，或许会改变我们看待对象的方式，但还没有选定耐存论或延存论。
            <Citation id="BEC-3" sources={sources} />
          </p>
          <p>
            <strong>“什么存在”与“什么更基本”</strong>也不是同一问题。即使承认自行车存在，仍可问它是否依赖零件、因果关系、使用实践或更基本的物理事实；“依赖”不等于“不真实”或“不重要”。这些问题值得继续读，但不必抢在原车案例之前回答。
          </p>
          <p>
            在<strong>龙树与中观</strong>的语境中，空性讨论的是事物是否有不依条件、由自身成立的自性（svabhāva）。这不等于“什么都不存在”，也不能直接归入西方的耐存论、延存论或过程哲学。有关自性、因果、概念依赖和解脱的论证有自己的目标与文本脉络；本页只把它作为相邻问题的入口。
            <Citation id="BEC-4" sources={sources} />
          </p>
          <p className={styles.relatedLinks}>
            可继续读：<Link href="/learning/philosophy/mind-self">心灵、身体与我</Link>（人格同一性是另一组问题）与 <Link href="/learning/philosophy/buddhist">佛教哲学</Link>（把缘起、无我与空性放回其论证语境）。
          </p>
        </div>
      </details>

      <section className="philosophy-block" id="being-practice" aria-labelledby="being-practice-title">
        <h2 className="philosophy-block-title" id="being-practice-title">迁移练习：换一个情境，也能看出推理在做什么</h2>
        <ol className={styles.exercises}>
          <li>
            <h3>相同版本的书，是同一本书吗？</h3>
            <p>书店里有两本同版、同印次、没有笔记的《红楼梦》。它们在内容、纸张和装帧上几乎没有差异。请问：它们为什么不是同一本“物理书”？如果其中一本换了封面，为什么又仍可能是原来那一本？</p>
            <details>
              <summary>查看参考分析</summary>
              <p>先确定对象：这里讨论的是两本物理载体，不是同一部作品或同一段文字。两本书可以质地和内容高度相似，却能同时放在不同位置、被不同人借走，因此不是数值同一。把其中一本换封面，是同一物理书发生性质或部分变化；是否仍是原书，可考察它与先前那本的连续历史，而不能只看它是否像另一册。</p>
            </details>
          </li>
          <li>
            <h3>搬家后的植物：该优先看什么？</h3>
            <p>一盆薄荷被移到新花盆；土换了，枝叶被修剪，后来还扦插出一盆新薄荷。哪一盆是原来的那盆？请先选一个你认为重要的标准，再说明一个它会遇到的困难。</p>
            <details>
              <summary>查看参考分析</summary>
              <p>若重视连续的生长过程和同一株根系，移栽后的原株最有资格；扦插盆来自它，却开始了另一条生长链。这个答案解释了为什么换土、修剪不必终止同一性。难处在于：如果原株完全枯死，而扦插苗延续了其遗传和照料关系，材料或生物连续性的支持者会怎样划界？练习的关键不是选出唯一答案，而是让选择依赖的条件和反例都被说出来。</p>
            </details>
          </li>
        </ol>
        <p className={styles.closing}>
          现在你已经有了一套可迁移的方法：先指明讨论的对象；区分“像不像”与“是不是同一个”；说明自己采用的判断标准；再用替换、复制或分叉的反例检验它。答案仍可能有分歧，但分歧不再只是直觉对撞。
        </p>
      </section>

      <details className={styles.evidence}>
        <summary>来源、范围与本轮编辑记录</summary>
        <div className={styles.evidenceBody}>
          <p><strong>范围：</strong>{ledger.scope}</p>
          <p><strong>状态：</strong>{ledger.status}；本页完成的是自审，不是独立同行评审。</p>
          <ol className="philosophy-source-records">
            {sources.map((source) => (
              <li key={source.id}>
                <p className="philosophy-source-id">{source.id} · {source.kind} · 已核验</p>
                <a href={source.url} target="_blank" rel="noreferrer">{source.title}<span aria-hidden="true"> ↗</span></a>
                <p><strong>定位：</strong>{source.locator}</p>
                <p><strong>用于：</strong>{source.supports}</p>
              </li>
            ))}
          </ol>
          <h3>本轮自审</h3>
          <ol className="philosophy-review-findings">
            {ledger.review.findings.map((finding) => (
              <li key={finding.location}>
                <h4>{finding.location}</h4>
                <p><strong>发现：</strong>{finding.issue}</p>
                <p><strong>依据：</strong>{finding.evidence}</p>
                <p><strong>修订：</strong>{finding.revision}</p>
              </li>
            ))}
          </ol>
          <p><strong>相邻条目影响：</strong>{ledger.review.adjacentImpact}</p>
          <p><strong>尚待核验：</strong>{ledger.review.remaining.join('；')}</p>
        </div>
      </details>
    </div>
  );
}
