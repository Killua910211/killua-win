import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'Learn',
  description: '按问题组织的个人学习空间：从哲学开始，逐步建立跨学科的知识地图。',
  path: '/learning',
});

const futureSubjects = [
  ['02', 'PSYCHOLOGY', '心理学', '理解心智、行为与关系'],
  ['03', 'HISTORY', '历史', '在时间与因果中理解世界'],
  ['04', 'SCIENCE', '科学', '从证据、模型与实验出发'],
] as const;

export default function LearningPage() {
  return (
    <>
      <SiteHeader current="learning" />
      <main id="main" className="learning-page">
        <section className="learning-hero">
          <div className="section-label light" lang="en">
            <span>01 / 04</span>
            <span>Learning atlas</span>
          </div>
          <div>
            <p className="eyebrow">Learn / 学习空间</p>
            <h1 lang="en">
              FIND THE
              <br />
              <span className="outline">QUESTION.</span>
            </h1>
            <p className="learning-hero-intro">
              不把知识堆成收藏夹。先定位问题，再比较立场，最后把不同学科连接成自己的世界。
            </p>
          </div>
          <div className="learning-hero-foot" lang="en">
            <span>Subject 001 · Philosophy</span>
            <span>Growing archive · 2026</span>
          </div>
        </section>

        <section className="learning-shelf" aria-labelledby="learning-shelf-heading">
          <div className="section-label">
            <span>02</span>
            <span>Subject shelf</span>
          </div>
          <div className="learning-shelf-body">
            <p className="eyebrow">Current map / 当前学习地图</p>
            <h2 id="learning-shelf-heading">从哲学开始，学习如何提出一个值得追下去的问题。</h2>

            <Link className="learning-feature" href="/learning/philosophy-tree.html#pt-node=pt-overview">
              <div className="learning-feature-topline" lang="en">
                <span>001 / PHILOSOPHY</span>
                <span>40 NODES · 17 CORE QUESTIONS</span>
              </div>
              <div className="learning-feature-main">
                <div>
                  <h3>从问题开始的<br />哲学体系树</h3>
                  <p>从存在、知识、伦理、审美与政治五个问题域出发，横向比较西方、中国与印度传统。</p>
                </div>
                <span className="learning-feature-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="learning-topic-list">
                <span>存在与自我</span><span>知识与语言</span><span>行动与价值</span><span>共同生活</span>
              </div>
            </Link>

            <div className="learning-future-grid" aria-label="计划中的学科">
              {futureSubjects.map(([index, code, title, description]) => (
                <article key={code}>
                  <div lang="en"><span>{index}</span><span>{code}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <small>IN PLANNING</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="learning-method" aria-labelledby="learning-method-heading">
          <div className="section-label light" lang="en">
            <span>03</span>
            <span>How to use</span>
          </div>
          <div className="learning-method-body">
            <p className="eyebrow">Learning loop / 学习循环</p>
            <h2 id="learning-method-heading">不是先记住答案，<br />而是先看见问题。</h2>
            <ol>
              <li><span>01</span><strong>定位问题</strong><p>知道自己究竟在追问什么。</p></li>
              <li><span>02</span><strong>比较立场</strong><p>同时看见理由、前提和反对意见。</p></li>
              <li><span>03</span><strong>连接生活</strong><p>让抽象思想回应真实经验。</p></li>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
