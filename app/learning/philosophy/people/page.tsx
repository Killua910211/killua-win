import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { sourceCheckLabels } from '../content-ledger';
import { philosophyPeople, peopleHref, textAnchor, voiceAnchor } from '../people';
import { resolvePerson } from '../people-content';
import { peopleHistories } from '../people-history';
import { getNodeById, nodeHref } from '../tree';
import styles from './people.module.css';

export const metadata = buildMetadata({
  title: '哲学人物与思想史｜传统、时代、学派与问题',
  description: `沿中国、印度与南亚、西方、伊斯兰世界、非洲与非裔五条历史线，阅读 ${philosophyPeople.length} 位人物的时代、学派、关键内容与分歧。`,
  path: '/learning/philosophy/people',
});

function PersonCard({ person }: { person: ReturnType<typeof resolvePerson> }) {
  const first = person.stops[0];
  const { history, profile } = person;
  const start = first?.node ?? person.questionNode!;
  return <article className={styles.person} id={person.id} aria-labelledby={`${person.id}-name`}>
    <header>
      <p className={styles.era}>{history.era}</p>
      <h4 id={`${person.id}-name`}>{person.name}</h4>
      {person.aliases.length > 0 && <p className={styles.aliases}>正文用名：{person.aliases.join('、')}</p>}
      <ul className={styles.tags} aria-label="学派或方法">{history.schools.map((school) => <li key={school}>{school}</li>)}</ul>
      <p><strong>关键内容 · </strong>{history.key}</p>
      <p className={styles.question}>{person.question}</p>
    </header>
    <p className={styles.aliases}>{profile ? '历史概览 · 学术综述导读' : '问题精读 · 已有论证与文本指导'}</p>
    <p><Link className={styles.start} href={nodeHref(start)}>{profile ? '对读问题' : '开始精读'}：{start.title} ↗</Link></p>
    <details className={styles.details}>
      <summary>展开 {person.name} 的理由、分歧与阅读依据</summary>
      <h5>理由与边界</h5>
      {!profile && <p className={styles.aliases}>以下论证语境为“{first.node.title}”；路线与案例均指该问题页。</p>}
      <p><strong>关键理由 · </strong>{profile?.reason ?? first.view.framing}</p>
      <p className={styles.caution}><strong>反对与限度 · </strong>{profile?.boundary ?? first.view.caution}</p>
      <h5>怎样读文本</h5>
      {profile ? <><p><strong>{profile.work}</strong></p><p>{profile.reading}</p><p>上方“对读问题”提供比较语境，不表示目标页已有此人的专门段落。</p></> : <>
        <ol className={styles.route}>{person.stops.map((stop) => <li key={stop.nodeId}>
          <Link href={`${nodeHref(stop.node)}#${voiceAnchor(person)}`}>{stop.node.title}：{stop.view.work} ↗</Link>
          <p>{stop.why}目标页同时保留其他立场及反对意见。</p>
          <Link href={`${nodeHref(stop.node)}#${textAnchor(person)}`}>接读这一问题中的文本指导 ↗</Link>
        </li>)}</ol>
        <p><strong>{first.text.work}</strong> · {first.text.period}</p>
        <p>{first.text.contribution}</p><p><strong>带着问题读 · </strong>{first.text.readingQuestion}</p>
      </>}
      <h5>学派标签怎样理解</h5><p>{history.qualification}</p>
      <h5>历史语境与对照</h5>
      <ul>{person.contexts.map((node) => <li key={node.id}><Link href={nodeHref(node)}>{node.title} ↗</Link></li>)}</ul>
      {profile && <><p>对照阅读（共同问题或不同回答，不表示师承、影响或思想相同）：</p><nav className={styles.index} aria-label={`${person.name}的对照阅读`}>{profile.compare.map((id) => {
        const other = philosophyPeople.find((item) => item.id === id)!;
        return <Link key={id} href={peopleHref(other)}>{other.name}</Link>;
      })}</nav></>}
      <h5>来源与核验范围</h5>
      <p>正文是教学概括，不是原文引语。学派标签包括时代、研究领域、方法及后世归类；不是互斥身份。</p>
      <ul className={styles.sources}>
        <li><a href={history.source.url}>{history.source.title} ↗</a><p>学术综述 · 所列章节已核对 · {history.source.checkedOn}</p><p><strong>定位：</strong>{history.source.locator}</p><p><strong>支持范围：</strong>本卡的时代、研究背景与分类说明{profile ? '，以及上述论证和作品导读；反对与限度含编辑提出的检验问题' : '；具体问题论证另见下列来源账'}。不表示已核对整部原典、所有译本或全部生平。</p></li>
        {!profile && first.sources.map((source) => <li key={source.id}>
          <a href={source.url}>{source.title} ↗</a><p>{source.kind} · {sourceCheckLabels[source.checked]}{source.checkedOn ? ` · ${source.checkedOn}` : ''} · {source.id}</p>
          <p><strong>定位：</strong>{source.locator}</p><p><strong>支持范围：</strong>{source.supports}</p>
        </li>)}
      </ul>
      {!profile && <p>以上来源账对应首个问题；后续问题的依据见各自页面，逐条保留原核验状态。</p>}
    </details>
    <p className={styles.back}><Link href={`#${history.stage}`}>返回本阶段 ↑</Link> · <Link href="#people-title">返回传统目录 ↑</Link></p>
  </article>;
}

export default function PhilosophyPeoplePage() {
  const people = philosophyPeople.map(resolvePerson);
  return <><SiteHeader current="learning" /><main className="learning-page philosophy-page" id="main">
    <section aria-labelledby="people-title" className="philosophy-hero">
      <div className="section-label light" lang="en"><span>01</span><span>Thinkers / Histories</span></div>
      <div className="philosophy-hero-body">
        <nav aria-label="面包屑" className="philosophy-breadcrumb"><Link href="/learning">学习空间</Link><span aria-hidden="true">/</span><Link href="/learning/philosophy">哲学</Link><span aria-hidden="true">/</span><span aria-current="page">人物与思想史</span></nav>
        <p className="eyebrow">传统 → 时代 → 人物 → 学派与问题</p>
        <h1 id="people-title">把人物放回时代，<br />看见问题如何展开。</h1>
        <p className="philosophy-question">先选一条传统，沿历史阶段阅读人物；再展开他的理由、分歧与文本。也可以直接按姓名查找。</p>
        <p className="philosophy-summary">{people.length} 位人物，五条历史线。东方／西方是辅助导航，不是文明本质；各传统分别分期，伊斯兰与非洲思想独立呈现。阶段内按生年约数或可考活动、作品时期排序，不表示影响链或进步阶梯。</p>
        <nav aria-label="传统历史导航" className={styles.groupNav}>{peopleHistories.map((group) => <Link href={`#history-${group.id}`} key={group.id}><strong>{group.title}</strong><span>{people.filter((p) => group.stages.some((s) => s.id === p.history.stage)).length} 位人物 · 查看历史阶段 ↗</span></Link>)}</nav>
        <details className={styles.nameIndex}><summary>已知姓名？展开 {people.length} 人查找索引</summary><nav aria-label="姓名跳转" className={styles.index}>{[...people].sort((a,b) => a.name.localeCompare(b.name,'zh-CN')).map((p) => <Link key={p.id} href={`#${p.id}`}>{p.name}</Link>)}</nav></details>
        <p className={styles.note}>人物入口有两种深度：已有问题精读，或附来源的历史概览。尚无人物的时期也保留在目录中，明确展示材料缺口。<Link href="#coverage">查看收录边界 ↘</Link></p>
      </div>
    </section>
    {peopleHistories.map((group, index) => <section className={`philosophy-section ${styles.history}`} key={group.id} id={`history-${group.id}`} aria-labelledby={`${group.id}-title`}>
      <div className="section-label" lang="en"><span>{String(index+2).padStart(2,'0')}</span><span>History</span></div>
      <div className="philosophy-section-body">
        <h2 className="philosophy-section-heading" id={`${group.id}-title`}>{group.title}</h2><p className="philosophy-lede">{group.intro}</p>
        <nav className={styles.stageNav} aria-label={`${group.title}历史阶段`}>{group.stages.map((stage) => <Link key={stage.id} href={`#${stage.id}`}>{stage.title}</Link>)}</nav>
        <div className={styles.people}>{group.stages.map((stage) => {
          const members=people.filter((p) => p.history.stage === stage.id).sort((a,b) => a.history.order-b.history.order);
          return <section key={stage.id} id={stage.id} className={styles.stage} aria-labelledby={`${stage.id}-title`}>
            <header className={styles.stageHeader}><p className="eyebrow">{members.length ? `${members.length} 位人物` : '材料缺口 · 暂无人物卡'}</p><h3 id={`${stage.id}-title`}>{stage.title}</h3><p>{stage.intro}</p><Link href={nodeHref(getNodeById(stage.nodeId)!)}>阅读这一阶段的传统背景 ↗</Link></header>
            {members.map((person) => <PersonCard person={person} key={person.id}/>)}
            {stage.gap && <p className={styles.gap}><strong>仍需补充 · </strong>{stage.gap}</p>}
          </section>;
        })}</div>
      </div>
    </section>)}
    <section className="philosophy-section" id="coverage" aria-labelledby="coverage-title"><div className="section-label"><span>07</span><span>Coverage</span></div><div className="philosophy-section-body"><div className={styles.coverage}>
      <h2 id="coverage-title">这是可继续补全的历史地图</h2>
      <p>当前 {people.filter(p=>!p.profile).length} 人连接既有问题精读，{people.filter(p=>p.profile).length} 人提供历史概览与学术综述导读。五条线的覆盖并不均衡；空段不表示该时期没有哲学，也不把待研究人物计入可读人数。</p>
      <p>优先补充目录中标出的历史断层，再增加实质论争与可定位文本。新增人物须有具体问题、理由、反对或边界，以及可追溯来源；原典版本、作者归属和争议不能省略。</p>
      <p>同一人物只保留一个主锚点，跨传统比较以对读链接表达。印度不代表所有亚洲，中国不代表整个东亚；日本、韩国、其他南亚及更多地区仍待建设。</p>
      <p><Link href="/learning/philosophy/path">从问题主线入门 ↗</Link> · <Link href="/learning/philosophy">回到哲学总览 ↗</Link> · <Link href="#people-title">返回人物目录 ↑</Link></p>
    </div></div></section>
  </main><SiteFooter/></>;
}
