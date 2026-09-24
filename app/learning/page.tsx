import { philosophyPeople } from './philosophy/people';
import { peopleHistories } from './philosophy/people-history';
import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import {
  liveSubjects,
  methodSectionNumber,
  plannedSubjects,
  subjectNumber,
  subjectSectionId,
  subjectSectionNumber,
  subjectSectionTone,
} from './subjects';
import {
  coreQuestions,
  isCoreQuestion,
  nodeHref,
  orderedChildren,
  philosophyNodes,
  questionDomains,
  traditions,
} from './philosophy/tree';

export const metadata = buildMetadata({
  title: '学习空间｜哲学问题地图',
  description: `按科目组织的个人学习工作台：哲学铺开了 ${questionDomains.length} 个问题域、${coreQuestions.length} 个核心问题与 ${traditions.length} 条传统导航，可以随时回来查；之后还会加别的科目。`,
  path: '/learning',
});

/** 科目分区共用的外壳：编号、标签和深浅面都由科目清单决定。 */
function subjectSectionProps(id: string, label: string) {
  return {
    className: `learning-subject-section learning-subject-section--${subjectSectionTone(id)}`,
    id: subjectSectionId(id),
    number: subjectSectionNumber(id),
    label,
    headingId: `${subjectSectionId(id)}-heading`,
  };
}

const philosophy = subjectSectionProps('philosophy', 'Philosophy');

/**
 * 首页的科目卡只给一句定位。
 *
 * 各节点的 summary 是写给条目页与总览用的完整判定说明；首页重复一遍，读者点
 * 「哲学总览」过去只会再看到同样的文字。这里截到第一个句号。
 */
function firstSentence(text: string): string {
  const end = text.search(/[。？！]/);
  return end < 0 ? text : text.slice(0, end + 1);
}

export default function LearningPage() {
  return (
    <>
      <SiteHeader current="learning" />
      <main id="main" className="learning-page">
        <PageHero
          description={
            <>
              先定位问题，再比较立场。第一门铺开的科目是哲学，铺到 {philosophyNodes.length} 个节点；
              之后还会加别的科目。
            </>
          }
          eyebrow="Learn / 学习空间"
          label="Learning desk"
          number="01"
          title={<>FIND THE<br />RIGHT<br /><span className="outline">QUESTION.</span></>}
          titleId="learning-title"
        />

        <SectionNav
          label="学习页分区"
          items={[
            ...liveSubjects.map((subject) => ({
              href: `#${subjectSectionId(subject.id)}`,
              label: subject.title,
            })),
            { href: '#learning-method', label: '学习方法' },
          ]}
        />

        {/* 科目 01 · 哲学。「按问题」「按传统」「按人物」三个入口收进同一个分区。 */}
        <section className={philosophy.className} id={philosophy.id} aria-labelledby={philosophy.headingId}>
          <div className="section-label" lang="en">
            <span>{philosophy.number}</span>
            <span>{philosophy.label}</span>
          </div>
          <div className="learning-section-body">
            <p className="eyebrow">Subject {subjectNumber('philosophy')} / 哲学</p>
            <h2 id={philosophy.headingId}>
              {coreQuestions.length} 个核心问题，<br />每一个都可以单独读完。
            </h2>
            <p className="learning-section-lede">
              可以按问题、传统或人物进入同一批讨论：问题带你比较理由，传统补充历史语境，人物连接具体论证与文本。
              没读过哲学也能从第一个链接直接开始：那条路线从一辆换光零件的自行车起步，每一步都说明它为下一步准备了什么。
            </p>
            <p className="learning-section-actions">
              <Link className="learning-inline-link" href="/learning/philosophy/path">
                从推荐路线开始 <span aria-hidden="true">↗</span>
              </Link>
              <Link className="learning-inline-link" href="/learning/philosophy">
                哲学总览 <span aria-hidden="true">↗</span>
              </Link>
              <Link className="learning-inline-link" href="/learning/philosophy/map">
                知识地图 <span aria-hidden="true">↗</span>
              </Link>
            </p>

            {/*
              这里只给入口，不再把哲学总览那份目录整份抄一遍。
              以前这一段渲染的是完整的 CoreQuestionGroups（6 个问题域 + 23 个核心问题
              全部展开）和把每条线索都列出来的传统网格——和 /learning/philosophy 上
              的那份一模一样。于是「哲学总览 ↗」这个链接跳过去只是再看一次同样的东西。
              首页负责的是「有哪些科目、从哪里进去」，完整索引留给总览。
            */}
            <h3 className="learning-block-heading" id="learning-philosophy-questions">
              按问题 / Main path
            </h3>
            <p className="learning-block-lede">
              分成 {questionDomains.length} 个问题域；完整索引在哲学总览里。
            </p>
            {/*
              这里只给标题、题数和一句定位。
              复审实测：这一节原来把 domain.summary / tradition.summary 整段印出来，
              与 /learning/philosophy 上的那 11 段逐字相同——链接早就不重复了，
              最长的那部分文字还在重复。完整判定说明留给总览。
            */}
            <ul className="learning-entry-grid">
              {questionDomains.map((domain) => (
                <li key={domain.id}>
                  <Link href={nodeHref(domain)}>
                    <span className="learning-entry-count" lang="en">
                      {orderedChildren(domain).filter(isCoreQuestion).length} questions
                    </span>
                    <strong>{domain.title}</strong>
                  </Link>
                  <p>{firstSentence(domain.summary)}</p>
                </li>
              ))}
            </ul>

            <h3 className="learning-block-heading" id="learning-philosophy-traditions">
              按传统 / Parallel history
            </h3>
            <p className="learning-block-lede">
              同一批问题，在不同传统里怎么被追问 —— 把它们放回文本、语言、制度与论辩史中。
            </p>
            <ul className="learning-entry-grid">
              {traditions.map((tradition) => (
                <li key={tradition.id}>
                  <Link href={nodeHref(tradition)}>
                    <span className="learning-entry-count" lang="en">
                      {orderedChildren(tradition).length} threads
                    </span>
                    <strong>{tradition.title}</strong>
                  </Link>
                  <p>{firstSentence(tradition.summary)}</p>
                </li>
              ))}
            </ul>
            <h3 className="learning-block-heading" id="learning-philosophy-people">按人物 / Thinkers & histories</h3>
            <p className="learning-block-lede">沿传统与时代认识 {philosophyPeople.length} 位人物：先看历史语境，再读学派、关键内容与分歧。各传统分别分期，缺失阶段明确标注。</p>
            <ul className="learning-entry-grid">
              {peopleHistories.map((group) => <li key={group.id}>
                <Link href={`/learning/philosophy/people#history-${group.id}`}><span className="learning-entry-count">传统 → 时代 → 人物</span><strong>{group.title}</strong></Link>
                <p>{group.intro}</p>
              </li>)}
            </ul>
            <p className="learning-section-actions"><Link className="learning-inline-link" href="/learning/philosophy/people">全部人物、历史阶段与收录范围 <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>

        {/* 学习方法永远排在科目后面，编号随科目数量顺延。 */}
        <section className="learning-method" id="learning-method" aria-labelledby="learning-method-heading">
          <div className="section-label light" lang="en">
            <span>{methodSectionNumber}</span>
            <span>How to use</span>
          </div>
          <div className="learning-method-body">
            <p className="eyebrow">Learning loop / 学习循环</p>
            <h2 id="learning-method-heading">
              不是先记住答案，<br />而是先看见问题。
            </h2>
            <p className="learning-section-lede">
              这条循环对每门科目都一样，在哲学里对应的是立场与理由。
            </p>
            <ol className="learning-loop">
              <li>
                <span lang="en">01</span>
                <strong>定位问题</strong>
                <p>知道自己究竟在追问什么。</p>
              </li>
              <li>
                <span lang="en">02</span>
                <strong>比较立场</strong>
                <p>同时看见理由、前提和反对意见。</p>
              </li>
              <li>
                <span lang="en">03</span>
                <strong>连接生活</strong>
                <p>让抽象思想回应真实经验。</p>
              </li>
            </ol>

            <h3 className="learning-roadmap-heading" id="learning-roadmap-heading">
              之后的科目（规划中）
            </h3>
            <ul className="learning-roadmap" aria-labelledby="learning-roadmap-heading">
              {plannedSubjects.map((subject) => (
                <li key={subject.id}>
                  <span className="learning-roadmap-index" lang="en">
                    {subjectNumber(subject.id)}
                  </span>
                  <span className="learning-roadmap-title">
                    {subject.title}
                    <span className="learning-roadmap-code" lang="en">
                      {subject.code}
                    </span>
                  </span>
                  <span className="learning-roadmap-note">{subject.note}</span>
                  <span className="learning-roadmap-state" lang="en">
                    IN PLANNING
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
