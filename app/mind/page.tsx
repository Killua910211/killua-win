import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
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
        <section className="mind-hero">
          <div className="section-label light" lang="en">
            <span>01 / 04</span>
            <span>Cognitive notebook</span>
          </div>
          <div>
            <p className="eyebrow">Mind / 心理认知</p>
            <h1>
              UNDERSTAND
              <br />
              THE <span className="outline">INNER</span> SYSTEM.
            </h1>
            <p className="mind-hero-intro">
              把一次关于「我是什么样的人」的对话，整理成可回看的认知地图。
              <br />
              这里记录的是观察与假设，不是诊断，也不是给自己贴标签。
            </p>
          </div>
          <div className="mind-hero-foot" lang="en">
            <span>Source / ChatGPT · 心理认知</span>
            <span>Archive 001 · 2026.08</span>
          </div>
        </section>

        <MindExplorer />
      </main>
      <SiteFooter />
    </>
  );
}
