import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import {
  CHECKED_AT,
  abilities,
  appendices,
  breakpoints,
  budgetRows,
  chapterCount,
  differences,
  evidenceMarks,
  fastLaneNotUsed,
  fastLaneSteps,
  highRiskTriggers,
  keyChapterCount,
  ladder,
  laneComparison,
  laneNames,
  partCount,
  practiceProject,
  principles,
  readingPaths,
  symptomChain,
  syllabus,
  tierLabel,
  trackLabel,
  upgradeTriggers,
  type Chapter,
} from './curriculum';

export const metadata = buildMetadata({
  title: 'AI 编程工作流｜课程设计',
  description: `一份把「想法 → 交付」拆开的学习设计：三条阅读路径、五步快车道、可判定的升级触发器，以及 ${partCount} 个部分、${chapterCount} 章的完整目录。默认档位刻意做轻。`,
  path: '/learning/ai-workflow',
});

/** 章节右侧的层级与路径标记；正文里用文字标签代替原设计的 emoji。 */
function ChapterTags({ chapter }: { chapter: Chapter }) {
  return (
    <p className="workflow-chapter-tags">
      <span className={`workflow-tier workflow-tier--${chapter.tier}`}>{tierLabel[chapter.tier]}</span>
      {chapter.tracks.map((track) => (
        <span className="workflow-track" key={track} lang="en">
          {trackLabel[track].en}
          <span lang="zh-CN"> / {trackLabel[track].zh}</span>
        </span>
      ))}
    </p>
  );
}

export default function AiWorkflowPage() {
  return (
    <>
      <SiteHeader current="learning" />
      <main id="main" className="learning-page workflow-page">
        <PageHero
          description={
            <>
              一套 AI 编程工作流的课程设计：默认档位刻意做轻，重的部分只在可判定的信号出现时才启动。
              导读加六层，共 {chapterCount} 章，其中 {keyChapterCount} 章重点展开。
            </>
          }
          eyebrow="Learn / AI 编程工作流"
          label="AI workflow"
          number="01"
          title={
            <>
              KEEP THE<br />PROCESS<br /><span className="outline">LIGHT.</span>
            </>
          }
          titleId="workflow-title"
        />

        <SectionNav
          label="AI 编程工作流分区"
          items={[
            { href: '#workflow-diagnosis', label: '断在哪' },
            { href: '#workflow-paths', label: '阅读路径' },
            { href: '#workflow-fastlane', label: '快车道' },
            { href: '#workflow-ladder', label: '能力地图' },
            { href: '#workflow-syllabus', label: '目录' },
            { href: '#workflow-method', label: '方法与证据' },
          ]}
        />

        {/* 02 · 断点分析 */}
        <section
          className="workflow-section workflow-diagnosis"
          id="workflow-diagnosis"
          aria-labelledby="workflow-diagnosis-heading"
        >
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Diagnosis</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Where it breaks / 断在哪</p>
            <h2 id="workflow-diagnosis-heading">
              问题不在提示词，<br />在输入、责任和完成的定义。
            </h2>
            <p className="workflow-lede">
              「想法 → 交付」之间那条链每次都在同样的地方断开。断点有三个，没有一个是「提示词写得好不好」。
            </p>

            <ol className="workflow-chain" aria-label="从想法到返工的链条">
              {symptomChain.map((node, index) => (
                <li key={node}>
                  <span className="workflow-chain-index" lang="en" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="workflow-chain-node">{node}</span>
                </li>
              ))}
            </ol>

            <div className="workflow-breakpoints">
              {breakpoints.map((breakpoint, index) => (
                <article className="workflow-breakpoint" key={breakpoint.id}>
                  <span className="workflow-breakpoint-index" lang="en" aria-hidden="true">
                    B{index + 1}
                  </span>
                  <h3>{breakpoint.title}</h3>
                  <p className="workflow-breakpoint-symptom">{breakpoint.symptom}</p>
                  <dl className="workflow-breakpoint-meta">
                    <div>
                      <dt>需要的机制</dt>
                      <dd>{breakpoint.mechanism}</dd>
                    </div>
                    <div>
                      <dt>落在快车道哪一步</dt>
                      <dd>{breakpoint.fastLaneStep}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <h3 className="workflow-subheading" id="workflow-principles-heading">
              贯穿全书的三原则
            </h3>
            <p className="workflow-lede workflow-lede--tight">
              第二个问题比第一个更致命：怕流程太重，所以流程永远建不起来。下面三条是对这件事的直接回应。
            </p>
            <ol className="workflow-principles" aria-labelledby="workflow-principles-heading">
              {principles.map((principle, index) => (
                <li key={principle.id}>
                  <span className="workflow-principle-index" lang="en" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4>{principle.title}</h4>
                  <p className="workflow-principle-lede">{principle.lede}</p>
                  <p className="workflow-principle-body">{principle.body}</p>
                  <p className="workflow-principle-rule">{principle.rule}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 03 · 三条阅读路径 */}
        <section
          className="workflow-section workflow-paths"
          id="workflow-paths"
          aria-labelledby="workflow-paths-heading"
        >
          <div className="section-label light" lang="en">
            <span>03</span>
            <span>Reading paths</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Three paths / 三条阅读路径</p>
            <h2 id="workflow-paths-heading">
              不要从头读到尾，<br />先读能当天用上的那 8 章。
            </h2>
            <p className="workflow-lede">
              教材按三条路径组织，每章开头都写明「什么信号出现时你需要这一章」。第 3–5 层是查阅型内容，不是一口气读完的内容。
            </p>

            <div className="workflow-path-grid">
              {readingPaths.map((path) => (
                <article className={`workflow-path workflow-path--${path.id}`} key={path.id}>
                  <p className="workflow-path-tag" lang="en">
                    {trackLabel[path.track].en}
                    <span lang="zh-CN"> / {trackLabel[path.track].zh}</span>
                  </p>
                  <dl className="workflow-path-figures">
                    <div>
                      <dt>规模</dt>
                      <dd>{path.scale}</dd>
                    </div>
                    <div>
                      <dt>投入</dt>
                      <dd>{path.cost}</dd>
                    </div>
                  </dl>
                  <p className="workflow-path-outcome">{path.outcome}</p>
                  <ul className="workflow-path-chapters" lang="en" aria-label="包含的章节">
                    {path.chapters.map((chapter) => (
                      <li key={chapter}>{chapter}</li>
                    ))}
                  </ul>
                  <p className="workflow-path-note">{path.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04 · 快车道 */}
        <section
          className="workflow-section workflow-fastlane"
          id="workflow-fastlane"
          aria-labelledby="workflow-fastlane-heading"
        >
          <div className="section-label" lang="en">
            <span>04</span>
            <span>Fast lane</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Default gear / 默认档位</p>
            <h2 id="workflow-fastlane-heading">
              五步、约十分钟，<br />全程不产生任何文件。
            </h2>
            <p className="workflow-lede">
              这是整套教材的默认档位，也是判断这份设计对不对的地方 —— 你得先看到它有多轻。第一次约 10 分钟，熟练后 3 分钟。
            </p>

            <ol className="workflow-steps" aria-label="快车道五步">
              {fastLaneSteps.map((step) => (
                <li key={step.no}>
                  <span className="workflow-step-index" lang="en" aria-hidden="true">
                    {step.no}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                  <p className="workflow-step-cost">{step.cost}</p>
                </li>
              ))}
            </ol>

            <div className="workflow-notused">
              <p className="workflow-notused-label">这一档不用</p>
              <ul lang="en">
                {fastLaneNotUsed.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="workflow-escalation">
              <article className="workflow-triggers">
                <h3 id="workflow-triggers-heading">升级触发器</h3>
                <p className="workflow-triggers-lede">命中任意一条就升到标准道。每一条都是看一眼就能回答的问题。</p>
                <ul aria-labelledby="workflow-triggers-heading">
                  {upgradeTriggers.map((trigger) => (
                    <li key={trigger}>{trigger}</li>
                  ))}
                </ul>
                <p className="workflow-triggers-high">
                  <span>再往上 · 高风险道</span>
                  {highRiskTriggers}
                </p>
              </article>

              <article className="workflow-budget">
                <h3 id="workflow-budget-heading">流程预算 20%</h3>
                <p className="workflow-budget-rule">流程开销不得超过任务本身预计时间的 20%。超了就降档。</p>
                <table aria-labelledby="workflow-budget-heading">
                  <thead>
                    <tr>
                      <th scope="col">任务预计</th>
                      <th scope="col">流程上限</th>
                      <th scope="col">只能走</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetRows.map((row) => (
                      <tr key={row.estimate}>
                        <th scope="row">{row.estimate}</th>
                        <td>{row.ceiling}</td>
                        <td>{row.lane}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </div>

            <h3 className="workflow-subheading" id="workflow-lanes-heading">
              三档产出物对照
            </h3>
            <div className="workflow-table-scroll">
              <table className="workflow-lane-table" aria-labelledby="workflow-lanes-heading">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="visually-hidden">对照项</span>
                    </th>
                    {laneNames.map((lane) => (
                      <th scope="col" key={lane}>
                        {lane}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {laneComparison.map((row) => (
                    <tr key={row.field}>
                      <th scope="row">{row.field}</th>
                      {row.values.map((value, index) => (
                        <td key={laneNames[index]}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 05 · 能力地图 */}
        <section
          className="workflow-section workflow-ladder-section"
          id="workflow-ladder"
          aria-labelledby="workflow-ladder-heading"
        >
          <div className="section-label light" lang="en">
            <span>05</span>
            <span>Capability map</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Six levels / 能力地图</p>
            <h2 id="workflow-ladder-heading">
              每一级的成果<br />都必须可以检查。
            </h2>
            <p className="workflow-lede">
              不用「理解了」「熟悉了」这类无法判定的词。六级阶梯，每一级配一条做得到才算过的结业检验。
            </p>

            <ol className="workflow-ladder" aria-label="六级能力阶梯">
              {ladder.map((rung) => (
                <li key={rung.level}>
                  <span className="workflow-ladder-level" lang="en">
                    {rung.level}
                  </span>
                  <div className="workflow-ladder-body">
                    <h3>{rung.title}</h3>
                    <p className="workflow-ladder-goal">{rung.goal}</p>
                    <p className="workflow-ladder-exam">
                      <span>结业检验</span>
                      {rung.exam}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="workflow-subheading" id="workflow-abilities-heading">
              十项能力的落点与检查标准
            </h3>
            <ul className="workflow-abilities" aria-labelledby="workflow-abilities-heading">
              {abilities.map((ability) => (
                <li key={ability.no}>
                  <div className="workflow-ability-head">
                    <span className="workflow-ability-index" lang="en" aria-hidden="true">
                      {ability.no}
                    </span>
                    <h4>{ability.title}</h4>
                    <p className="workflow-ability-meta">
                      <span lang="en">{ability.levels}</span>
                      <span>{ability.chapters}</span>
                    </p>
                  </div>
                  <p className="workflow-ability-check">{ability.check}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 06 · 完整目录 */}
        <section
          className="workflow-section workflow-syllabus"
          id="workflow-syllabus"
          aria-labelledby="workflow-syllabus-heading"
        >
          <div className="section-label" lang="en">
            <span>06</span>
            <span>Syllabus</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Full outline / 完整目录</p>
            <h2 id="workflow-syllabus-heading">
              {chapterCount} 章，<br />每章都标好该不该现在读。
            </h2>
            <p className="workflow-lede">
              导读加六层，一共 {partCount} 个部分。层级标记回答「必不必学」，路径标记回答「什么时候读」。标了进阶或暂缓的章节都附一条触发信号 —— 信号没出现就不必看。
            </p>

            <div className="workflow-legend" aria-label="标记图例">
              <p>
                <span className="workflow-tier workflow-tier--base">基础必学</span>
                进入下一层前要读完
              </p>
              <p>
                <span className="workflow-tier workflow-tier--optional">进阶选学</span>
                触发信号出现时再读
              </p>
              <p>
                <span className="workflow-tier workflow-tier--later">暂可跳过</span>
                条件变了再回来
              </p>
            </div>

            <div className="workflow-layers">
              {syllabus.map((layer) => (
                <section className="workflow-layer" key={layer.id} aria-labelledby={`${layer.id}-heading`}>
                  <div className="workflow-layer-head">
                    <span className="workflow-layer-index" lang="en" aria-hidden="true">
                      {layer.index}
                    </span>
                    <h3 id={`${layer.id}-heading`}>{layer.title}</h3>
                    <p className="workflow-layer-subtitle" lang="en">
                      {layer.subtitle}
                    </p>
                    <p className="workflow-layer-count">{layer.chapters.length} 章</p>
                  </div>
                  {layer.lede && <p className="workflow-layer-lede">{layer.lede}</p>}
                  <ul className="workflow-chapters">
                    {layer.chapters.map((chapter) => (
                      <li className={chapter.key ? 'workflow-chapter is-key' : 'workflow-chapter'} key={chapter.no}>
                        <p className="workflow-chapter-no" lang="en">
                          {chapter.no}
                          {chapter.key && (
                            <span className="workflow-chapter-key">
                              <span className="visually-hidden">重点展开</span>
                              <span aria-hidden="true">★</span>
                            </span>
                          )}
                        </p>
                        <div className="workflow-chapter-body">
                          <h4>{chapter.title}</h4>
                          <p className="workflow-chapter-goal">{chapter.goal}</p>
                          {chapter.signal && (
                            <p className="workflow-chapter-signal">
                              <span>触发信号</span>
                              {chapter.signal}
                            </p>
                          )}
                        </div>
                        <ChapterTags chapter={chapter} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <h3 className="workflow-subheading" id="workflow-appendices-heading">
              附录
            </h3>
            <ul className="workflow-appendices" aria-labelledby="workflow-appendices-heading">
              {appendices.map((appendix) => (
                <li key={appendix.id}>
                  <span className="workflow-appendix-id" lang="en" aria-hidden="true">
                    {appendix.id}
                  </span>
                  <div>
                    <h4>{appendix.title}</h4>
                    <p>{appendix.detail}</p>
                    {'caveat' in appendix && appendix.caveat && (
                      <p className="workflow-appendix-caveat">{appendix.caveat}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 07 · 方法与证据 */}
        <section
          className="workflow-section workflow-method"
          id="workflow-method"
          aria-labelledby="workflow-method-heading"
        >
          <div className="section-label light" lang="en">
            <span>07</span>
            <span>Method</span>
          </div>
          <div className="workflow-section-body">
            <p className="eyebrow">Evidence / 方法与证据</p>
            <h2 id="workflow-method-heading">
              先说清楚一条结论<br />凭什么该被相信。
            </h2>

            <ol className="workflow-differences" aria-label="与常见教程的四个不同">
              {differences.map((item) => (
                <li key={item.no}>
                  <span className="workflow-difference-index" lang="en" aria-hidden="true">
                    {item.no}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>

            <h3 className="workflow-subheading" id="workflow-evidence-heading">
              五种证据标记
            </h3>
            <div className="workflow-table-scroll">
              <table className="workflow-evidence-table" aria-labelledby="workflow-evidence-heading">
                <thead>
                  <tr>
                    <th scope="col">标记</th>
                    <th scope="col">含义</th>
                    <th scope="col">该怎么对待</th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceMarks.map((item) => (
                    <tr key={item.mark}>
                      <th scope="row">{item.mark}</th>
                      <td>{item.meaning}</td>
                      <td>{item.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="workflow-footnotes">
              <article>
                <h3>贯穿全书的练习项目</h3>
                <p>
                  <strong lang="en">{practiceProject.name}</strong>
                  {practiceProject.detail}
                </p>
                <p className="workflow-footnote-caveat">{practiceProject.caveat}</p>
              </article>
              <article>
                <h3>核对日期与模拟标注</h3>
                <p>
                  所有涉及产品当前实现的描述都注明核对日期 <span lang="en">{CHECKED_AT}</span> 与官方文档链接；实现会变，以你阅读时的官方文档为准。
                </p>
                <p className="workflow-footnote-caveat">
                  所有教学对话、命令输出与测试结果均为设计的示例并标注为模拟，不把未执行的内容写成执行记录。
                </p>
              </article>
            </div>

            <p className="workflow-back">
              <Link className="learning-inline-link" href="/learning">
                回到学习空间 <span aria-hidden="true">↗</span>
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
