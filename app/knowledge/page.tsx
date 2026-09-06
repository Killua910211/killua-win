import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { KnowledgeLibrary } from './knowledge-library';

export const metadata = buildMetadata({
  title: 'Knowledge',
  description: '从 ChatGPT 对话中提炼的知识点、判断框架与可复用方法，按主题整理成个人知识卡片。',
  path: '/knowledge',
});

export default function KnowledgePage() {
  return (
    <>
      <SiteHeader current="knowledge" />
      <main id="main" className="knowledge-page">
        <section className="knowledge-hero">
          <div className="section-label light" lang="en">
            <span>01 / 03</span>
            <span>Conversation knowledge</span>
          </div>
          <div>
            <p className="eyebrow">Knowledge / 对话里的知识点</p>
            <h1>
              KEEP THE
              <br />
              <span className="outline">GOOD</span> PART.
            </h1>
            <p className="knowledge-hero-intro">
              不保存整段聊天，只留下值得反复调用的那一小部分：一个概念、一种判断方式，或一个可以带走的行动提示。
            </p>
          </div>
          <div className="knowledge-hero-foot" lang="en">
            <span>Source / ChatGPT conversations</span>
            <span>Library 001 · living archive</span>
          </div>
        </section>
        <KnowledgeLibrary />
      </main>
      <SiteFooter />
    </>
  );
}
