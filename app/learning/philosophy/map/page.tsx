import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { buildMetadata } from '@/app/lib/metadata';
import {
  MapChains,
  MapConcepts,
  MapDomains,
  MapLegend,
  MapTraditions,
} from '../map-view';
import { concepts } from '../concepts';
import { crossDomainChains, isolatedNodeIds, philosophyRelations } from '../relations';
import { coreQuestions, getNodeById, questionDomains, traditions } from '../tree';

export const metadata = buildMetadata({
  title: '哲学知识地图',
  description: `${questionDomains.length} 个问题域、${coreQuestions.length} 个核心问题与 ${traditions.length} 条传统导航之间的语义关系：前置理解、易混辨析、有力反对、延伸问题、处境应用、跨传统比较与历史语境。`,
  path: '/learning/philosophy/map',
});

const isolated = isolatedNodeIds();
// 只列前几个标题：id 对读者没有意义，一长串也读不动。缺口本身仍然如实报数。
const isolatedTitles = isolated
  .slice(0, 6)
  .map((id) => getNodeById(id)?.title)
  .filter((title): title is string => Boolean(title));

export default function PhilosophyMapPage() {
  // 分区编号连续：横向链条和概念层没有数据时不渲染，后面的编号要跟着往前挪，
  // 不能出现 03 之后直接跳到 06。先算出实际存在的分区，再取下标。
  const sections = [
    'hero',
    'legend',
    'domains',
    ...(crossDomainChains.length > 0 ? ['chains'] : []),
    ...(concepts.length > 0 ? ['concepts'] : []),
    'traditions',
  ];
  const numberOf = (id: string) => String(sections.indexOf(id) + 1).padStart(2, '0');

  return (
    <>
      <SiteHeader current="learning" />

      <main className="learning-page philosophy-page" id="main">
        <section aria-labelledby="map-title" className="philosophy-hero">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Philosophy map</span>
          </div>
          <div className="philosophy-hero-body">
            <nav aria-label="面包屑" className="philosophy-breadcrumb">
              <Link href="/learning">学习空间</Link>
              <span aria-hidden="true">/</span>
              <Link href="/learning/philosophy">哲学</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">知识地图</span>
            </nav>
            <p className="eyebrow">Map / 知识地图</p>
            <h1 id="map-title">哲学知识地图</h1>
            <p className="philosophy-question">
              问题之间有哪些真实关系？哪些必须先读，哪些在互相反驳，哪些只能并置比较？
            </p>
            <p className="philosophy-summary">
              这张地图不按国别或年代排列，而按问题之间的关系排列。核心问题和传统线索都在原地展开，
              不必先跳进专题页才知道它连着谁。目前登记了 {philosophyRelations.length} 条带理由的关系。
            </p>
          </div>
        </section>

        {/* 横向链条和概念层是有数据才渲染的分区，导航项跟着走，不留死锚点。 */}
        <SectionNav
          items={[
            { href: '#map-legend', label: '怎么读' },
            { href: '#map-domains', label: '问题域' },
            ...(crossDomainChains.length > 0 ? [{ href: '#map-chains', label: '横向链条' }] : []),
            ...(concepts.length > 0 ? [{ href: '#map-concepts', label: '概念层' }] : []),
            { href: '#map-traditions', label: '传统与历史' },
          ]}
          label="知识地图分区"
        />

        <section aria-labelledby="map-legend-heading" className="philosophy-section" id="map-legend">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>How to read</span>
          </div>
          <div className="philosophy-section-body">
            <p className="eyebrow">Legend / 关系语义</p>
            <h2 className="philosophy-section-heading" id="map-legend-heading">
              七种关系，七个不同的理由
            </h2>
            <p className="philosophy-lede">
              「相关」不算一种关系：说不出理由的边就不连。一条边属于下面哪一种，决定了读者为什么
              该走过去，也决定了它在两端的页面上各自怎么显示。
            </p>
            <MapLegend />
            {isolated.length > 0 && (
              <p className="philosophy-map-isolated">
                目前还有 {isolated.length} 个节点没有建立语义关系
                {isolatedTitles.length > 0 && <>（{isolatedTitles.join('、')}{isolated.length > isolatedTitles.length && ' 等'}）</>}
                。在这张地图上它们暂时是孤立的，但仍然可以从问题域和传统导航进入。
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="map-domains-heading" className="philosophy-section" id="map-domains">
          <div className="section-label" lang="en">
            <span>03</span>
            <span>Question domains</span>
          </div>
          <div className="philosophy-section-body philosophy-section-body--wide">
            <p className="eyebrow">Layer 1 / 问题域</p>
            <h2 className="philosophy-section-heading" id="map-domains-heading">
              {questionDomains.length} 个问题域，{coreQuestions.length} 个核心问题
            </h2>
            <p className="philosophy-lede">
              问题域只是第一层归拢，真正的连接长在问题与问题之间。展开任一个问题，就能看到它已经
              连上了谁。
            </p>
            <MapDomains />
          </div>
        </section>

        {crossDomainChains.length > 0 && (
          <section aria-labelledby="map-chains-heading" className="philosophy-section" id="map-chains">
            <div className="section-label" lang="en">
              <span>{numberOf('chains')}</span>
              <span>Chains</span>
            </div>
            <div className="philosophy-section-body">
              <p className="eyebrow">Across domains / 横向链条</p>
              <h2 className="philosophy-section-heading" id="map-chains-heading">
                一个问题的答案会压到下一个问题
              </h2>
              <p className="philosophy-lede">
                真实的追问会横穿并列的问题域。这几条链条串起来的，正是被目录结构切断得最彻底的
                那些连接。
              </p>
              <MapChains />
            </div>
          </section>
        )}

        {concepts.length > 0 && (
          <section aria-labelledby="map-concepts-heading" className="philosophy-section" id="map-concepts">
            <div className="section-label" lang="en">
              <span>{numberOf('concepts')}</span>
              <span>Concepts</span>
            </div>
            <div className="philosophy-section-body">
              <p className="eyebrow">Shared terms / 概念层</p>
              <h2 className="philosophy-section-heading" id="map-concepts-heading">
                横穿多个问题的 {concepts.length} 个概念
              </h2>
              <p className="philosophy-lede">
                这些概念在多页里反复出现，定义只写一份。理解错一个，后面几页都会跟着错。
              </p>
              <MapConcepts />
            </div>
          </section>
        )}

        <section
          aria-labelledby="map-traditions-heading"
          className="philosophy-section"
          id="map-traditions"
        >
          <div className="section-label" lang="en">
            <span>{numberOf('traditions')}</span>
            <span>Traditions</span>
          </div>
          <div className="philosophy-section-body philosophy-section-body--wide">
            <p className="eyebrow">Parallel history / 传统与历史</p>
            <h2 className="philosophy-section-heading" id="map-traditions-heading">
              {traditions.length} 条平行的历史导航
            </h2>
            <p className="philosophy-lede">
              传统不是核心问题的地区版本。它们各自有自己的问题框架、文本和论辩史，在这张地图上
              是平行的一层。
            </p>
            <MapTraditions />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
