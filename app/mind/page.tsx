import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import { KnowledgeLibrary } from '@/app/knowledge/knowledge-library';
import { MindExplorer } from './mind-explorer';

export const metadata = buildMetadata({
  title: 'Mind',
  description: '把与 ChatGPT 的心理认知对话，整理成可以预习、复习和回溯的个人认知档案。',
  path: '/mind',
});

export default function MindPage() {
  return (
    <>
      <SiteHeader current="mind" />
      <main id="main" className="mind-page">
        <PageHero
          description="整理关于「我是什么样的人」的对话，留下一张可回看的认知地图。"
          eyebrow="Mind / 心理认知"
          label="Cognitive notebook"
          number="01"
          title={<>UNDERSTAND<br />THE <span className="outline">INNER</span><br />SYSTEM.</>}
          titleId="mind-title"
        />
        <SectionNav
          label="认知页分区"
          items={[
            { href: '#mind-overview', label: '核心地图' },
            { href: '#mind-workspace', label: '主题线索' },
            { href: '#mind-review', label: '自我复习' },
            { href: '#mind-library', label: '对话索引' },
          ]}
        />

        <MindExplorer />
        <KnowledgeLibrary />
      </main>
      <SiteFooter />
    </>
  );
}
