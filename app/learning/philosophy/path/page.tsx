import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { basicPath, resolvePath } from '../learning-path';
import { coreQuestions, getNodeById, nodeHref } from '../tree';

export const metadata = buildMetadata({
  title: '推荐基础学习路径 · 哲学',
  description: `${basicPath.steps.length} 步的推荐入门路线，用于回答「我什么都不知道，该从哪里开始」。哲学没有唯一正确的学习顺序，这只是一条帮助建立基本问题框架的路线。`,
  path: '/learning/philosophy/path',
});

export default function PhilosophyPathPage() {
  const steps = resolvePath(basicPath);

  return (
    <>
      <SiteHeader current="learning" />

      <main className="learning-page philosophy-page" id="main">
        <section aria-labelledby="path-title" className="philosophy-hero">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Study path</span>
          </div>
          <div className="philosophy-hero-body">
            <nav aria-label="面包屑" className="philosophy-breadcrumb">
              <Link href="/learning">学习空间</Link>
              <span aria-hidden="true">/</span>
              <Link href="/learning/philosophy">哲学</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">推荐基础学习路径</span>
            </nav>
            <p className="eyebrow">Systematic / 系统学习</p>
            <h1 id="path-title">{basicPath.title}</h1>
            <p className="philosophy-question">{basicPath.intro}</p>
            <p className="philosophy-summary">{basicPath.disclaimer}</p>
          </div>
        </section>

        <section aria-labelledby="path-steps-heading" className="philosophy-section">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>The route</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Route / 路线</p>
            <h2 className="philosophy-section-heading" id="path-steps-heading">
              {steps.length} 步，以及每一步排在这里的理由
            </h2>
            <p className="philosophy-lede">
              这里没有进度条、完成度或打卡：页面不记录你读到哪一步，回来时看到的还是同一份顺序建议。
            </p>

            <ol className="philosophy-path">
              {steps.map((step) => (
                <li key={step.nodeId}>
                  <p className="philosophy-path-index" lang="en">
                    {String(step.order).padStart(2, '0')}
                  </p>
                  <h3 className="philosophy-path-title">
                    <Link href={nodeHref(step.node)}>
                      {step.node.title}
                      <span aria-hidden="true"> ↗</span>
                    </Link>
                  </h3>
                  <p className="philosophy-path-why">{step.why}</p>
                  <dl className="philosophy-path-detail">
                    <div>
                      <dt>读完带走</dt>
                      <dd>{step.brings}</dd>
                    </div>
                    <div>
                      <dt>为下一步准备</dt>
                      <dd>{step.prepares}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>

            <h3 className="philosophy-block-title philosophy-branch-heading" id="path-branches">
              主线之外的 {basicPath.branches.reduce((total, branch) => total + branch.entries.length, 0)} 篇
            </h3>
            <p className="philosophy-lede">
              主线只走 {basicPath.steps.length} 步，核心问题有 {coreQuestions.length} 个。剩下的按「你关心什么」分在下面，
              每一条都写明它默认你已经有哪个区分——所以它不是第二条主线，也不是把目录再抄一遍。
            </p>

            {basicPath.branches.map((branch) => (
              <section className="philosophy-branch" key={branch.label}>
                <h4 className="philosophy-branch-label">{branch.label}</h4>
                <p className="philosophy-branch-intro">{branch.intro}</p>
                <ul className="philosophy-branch-list">
                  {branch.entries.map((entry) => {
                    const node = getNodeById(entry.nodeId)!;
                    return (
                      <li key={entry.nodeId}>
                        <h5>
                          <Link href={nodeHref(node)}>
                            {node.title}
                            <span aria-hidden="true"> ↗</span>
                          </Link>
                        </h5>
                        <p className="philosophy-branch-for">{entry.forWho}</p>
                        <p className="philosophy-branch-needs">
                          <span>它默认你已经有</span>
                          {entry.needs}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            <p className="philosophy-path-outro">
              不按顺序走也可以：打开
              <Link href="/learning/philosophy/map">哲学知识地图</Link>
              ，那里按关系而不是顺序组织同一批问题，每条连接都写明了它是前置、反驳、延伸还是只能并置的跨传统比较。
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
