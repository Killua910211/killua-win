import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { basicPath, resolvePath } from '../learning-path';
import { nodeHref } from '../tree';

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
              {steps.length} 步，每一步都为下一步准备一个区分
            </h2>
            <p className="philosophy-lede">
              这里没有进度、没有完成度、也没有打卡。它是一份可以随时回来查的顺序建议：任何一步都能
              单独打开，读到一半跳去别的问题也不算走错。
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

            <p className="philosophy-path-outro">
              走完这条路线之后，更自然的下一步是打开
              <Link href="/learning/philosophy/map">哲学知识地图</Link>
              ：那里按关系而不是顺序组织同一批问题。
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
