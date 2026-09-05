import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'AI Workflow',
  description: '从提出想法到发布上线：我的 AI 辅助开发流程。',
  path: '/workflow',
});

const WORKFLOW_STEPS = [
  {
    number: '01',
    owner: 'YOU',
    title: '说出想法',
    description: '用自然语言描述目标、参考，以及现在最不满意的地方。',
    tone: 'user',
  },
  {
    number: '02',
    owner: 'CHATGPT',
    title: '发散与补全',
    description: '讨论可能性、补充背景，把零散想法整理成可讨论的需求。',
    tone: 'chatgpt',
  },
  {
    number: '03',
    owner: 'CLAUDE',
    title: '方案与审阅',
    description: '梳理结构、推演细节，并从第二视角检查方案是否成立。',
    tone: 'claude',
  },
  {
    number: '04',
    owner: 'CODEX',
    title: '读取现状',
    description: '理解项目结构、已有数据、视觉语言与技术约束。',
    tone: 'codex',
  },
  {
    number: '05',
    owner: 'CODEX',
    title: '编码与生成',
    description: '修改代码；需要时生成图片、文案或结构化内容。',
    tone: 'codex',
  },
  {
    number: '06',
    owner: 'SYSTEM',
    title: '本地预览',
    description: '先在真实页面里看第一版，而不是只阅读代码。',
    tone: 'system',
  },
  {
    number: '07',
    owner: 'YOU',
    title: '直接反馈',
    description: '指出哪里不像、哪里多了，以及真正希望保留什么。',
    tone: 'user',
  },
  {
    number: '08',
    owner: 'CODEX + SYSTEM',
    title: '自动检查',
    description: '通过类型、Lint、构建和关键页面响应检查。',
    tone: 'system',
  },
  {
    number: '09',
    owner: 'CODEX',
    title: '发布上线',
    description: '发布验证后的版本，并把线上页面交回给你。',
    tone: 'codex',
  },
] as const;

export default function WorkflowPage() {
  return (
    <>
      <SiteHeader current="workflow" />

      <main id="main" className="workflow-page">
        <section className="workflow-section" aria-labelledby="workflow-heading">
          <div className="section-label" lang="en">
            <span>00</span>
            <span>AI workflow</span>
          </div>

          <div className="workflow-body">
            <header className="workflow-heading">
              <div>
                <p className="eyebrow">How I build with AI / 2026</p>
                <h1 id="workflow-heading">
                  我的 AI
                  <br />
                  开发流程。
                </h1>
              </div>
              <p>
                从一句不完整的想法开始，经过生成、预览和反馈循环，最后变成可以访问的线上版本。
              </p>
            </header>

            <div className="workflow-legend" aria-label="流程角色">
              <span className="is-user">YOU / 决策与反馈</span>
              <span className="is-chatgpt">CHATGPT / 发散与补全</span>
              <span className="is-claude">CLAUDE / 方案与审阅</span>
              <span className="is-codex">CODEX / 项目执行</span>
              <span className="is-system">SYSTEM / 预览与验证</span>
            </div>

            <ol className="workflow-flow" aria-label="AI 辅助开发的九个步骤">
              {WORKFLOW_STEPS.map((step) => (
                <li className={`workflow-step is-${step.tone}`} key={step.number}>
                  <div className="workflow-step-meta" lang="en">
                    <span>{step.number}</span>
                    <span>{step.owner}</span>
                  </div>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>

            <div className="workflow-loop" aria-label="反馈循环">
              <span aria-hidden="true">↖</span>
              <p>
                <strong>反馈不通过：</strong>执行问题回到 05 交给 Codex 继续修改；方向问题回到 03 让 Claude 重新审阅。
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
