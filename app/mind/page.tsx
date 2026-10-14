import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import styles from './mind.module.css';

export const metadata = buildMetadata({
  title: 'Usage notes',
  description: '维护 Codex Skill 与软件使用说明，记录可重复、可验证的操作边界。',
  path: '/mind',
});

const collaborationSteps = [
  { label: '01 / FRAME', title: '先把问题说清楚。', body: '准备完成判断所需的目标、背景、边界和验收标准，让第二意见有明确参照。' },
  { label: '02 / CONSULT', title: '让 ChatGPT 提供第二意见。', body: '在任务中调用 Skill；ChatGPT 提供独立视角，不执行本地操作。' },
  { label: '03 / VERIFY', title: '把建议带回本地验证。', body: 'Codex 重新阅读仓库、检查证据并运行相关验证，把外部回答当作待验证的假设。' },
  { label: '04 / AUTHORIZE', title: '把外部写操作留给明确授权。', body: '提交、推送、迁移、部署测试环境或正式网站，都不会因为第二意见自动发生。' },
];

const securityAuditModes = [
  { label: '针对性咨询', body: '一个接口、一段代码或某个具体疑点；按需分析，不默认生成完整审计文件。' },
  { label: 'quick', body: '首次试用、单个模块或快速复查；限定范围，并在报告中说明覆盖不足。' },
  { label: 'standard', body: '常规代码安全审计；默认档位，执行完整的审计与独立复核流程。' },
  { label: 'deep', body: '关键业务或复杂模块；覆盖更细，但耗时和额度也更多。' },
];

const securityAuditOutputs = [
  { file: 'REPORT.md', body: '审计概要、主要结论和覆盖情况。' },
  { file: 'FINDINGS-DETAIL.md', body: '已确认问题的详细证据、影响和修复建议。' },
  { file: 'NEEDS-VALIDATION.md', body: '尚缺证据，以及下一步验证方式。' },
  { file: 'findings.json', body: '便于后续处理的结构化问题记录。' },
];

const boundaryCards = [
  { label: 'DATA / 最小信息', title: '只传完成判断所需的信息。', body: '不上传凭据、密钥、私有文件或完整仓库；涉及敏感信息时先取得明确授权。' },
  { label: 'EVIDENCE / 可核验', title: '外部建议必须回到本地核验。', body: '检查源文件、运行测试并确认实际输出，不能把顾问意见写成事实、诊断或验证结果。' },
  { label: 'AUTHORITY / 用户决定', title: '权限边界由用户决定。', body: '提交、推送、迁移和部署需要单独确认；测试环境与正式网站始终分开说明。' },
];

const collaborationFacts = [
  { label: 'WHEN / 适用', value: '需要第二意见的复杂任务' },
  { label: 'ACTION / 动作', value: '提供建议，不执行本地操作' },
  { label: 'CHECK / 回收', value: '由 Codex 在本地验证' },
];

const securityAuditFacts = [
  { label: 'WHEN / 适用', value: '需要检查代码安全问题' },
  { label: 'MODES / 档位', value: 'quick / standard / deep' },
  { label: 'OUTPUT / 输出', value: '报告与结构化问题记录' },
];

export default function MindPage() {
  return (
    <>
      <SiteHeader current="mind" />
      <main id="main" className="mind-page">
        <PageHero
          description="记录我实际使用的 Skill 和软件：为什么用、怎么调用、输出什么，以及哪些动作必须由我确认。"
          eyebrow="Tool memo / 工具备忘录"
          label="Personal tools"
          number="01"
          title={<>TOOLS I<br /><span className="outline">KEEP</span><br />CLOSE.</>}
          titleId="mind-title"
        />
        <SectionNav
          label="工具备忘录条目"
          items={[
            { href: '#collaboration-skill-heading', label: '$codex-chatgpt-collaboration' },
            { href: '#security-audit-skill-heading', label: '$security-audit' },
          ]}
        />

        <section className={styles.memos} id="mind-memos" aria-labelledby="mind-memos-heading">
          <div className="section-label light">
            <span>02</span>
            <span lang="en">Tool memos</span>
          </div>
          <div className={styles.memosBody}>
            <div className={styles.memosIntro}>
              <p className="eyebrow">Working index / 当前使用</p>
              <h2 id="mind-memos-heading">把真正用过的工具，记成下一次能直接复用的步骤。</h2>
              <p className={styles.memosLead}>每个条目先给最短路径，再收起保存完整流程、输出文件和边界。新增软件时，直接增加一张同结构的备忘录卡片。</p>
            </div>

            <article className={styles.memoCard} aria-labelledby="collaboration-skill-heading">
              <header className={styles.memoHeader}>
                <div className={styles.memoHeaderMeta}>
                  <span>Skill / 01</span>
                  <span>协作</span>
                </div>
                <span className={styles.memoStatus}>READY TO USE</span>
              </header>
              <div className={styles.memoTitle}>
                <p className="eyebrow">Codex Skill / 第二意见</p>
                <h3 id="collaboration-skill-heading"><code>$codex-chatgpt-collaboration</code></h3>
                <p>让 ChatGPT 提供独立视角，再由 Codex 把建议带回本地检查、实现和验证。</p>
              </div>
              <div className={styles.memoFacts}>
                {collaborationFacts.map((fact) => (
                  <div key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.quickStart}>
                <span>QUICK START / 最短调用</span>
                <pre><code>$codex-chatgpt-collaboration 先给我一个独立的实现建议。</code></pre>
              </div>
              <details className={styles.memoDetails}>
                <summary>查看完整协作流程</summary>
                <ol className={styles.stepList}>
                  {collaborationSteps.map((step) => (
                    <li key={step.label}>
                      <span>{step.label}</span>
                      <div>
                        <h4>{step.title}</h4>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            </article>

            <article className={styles.memoCard} aria-labelledby="security-audit-skill-heading">
              <header className={styles.memoHeader}>
                <div className={styles.memoHeaderMeta}>
                  <span>Skill / 02</span>
                  <span>安全审计</span>
                </div>
                <span className={styles.memoStatus}>READ ONLY BY DEFAULT</span>
              </header>
              <div className={styles.memoTitle}>
                <p className="eyebrow">Cloudflare Skill / 安全</p>
                <h3 id="security-audit-skill-heading"><code>$security-audit</code></h3>
                <p>指定代码范围，先找证据、独立复核，再输出分级安全报告；默认只读分析，不自动修改代码。</p>
              </div>
              <div className={styles.memoFacts}>
                {securityAuditFacts.map((fact) => (
                  <div key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.quickStart}>
                <span>QUICK START / 最短调用</span>
                <pre><code>{`$security-audit 对 3.business/user-service 做 quick 安全审计。`}</code></pre>
              </div>
              <details className={styles.memoDetails}>
                <summary>查看审计档位与结果文件</summary>
                <div className={styles.detailSection}>
                  <span className="mind-card-index">MODES / 检查方式</span>
                  <div className={styles.auditModeGrid}>
                    {securityAuditModes.map((mode) => (
                      <div key={mode.label}>
                        <strong>{mode.label}</strong>
                        <p>{mode.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.detailSection}>
                  <span className="mind-card-index">OUTPUT / 结果文件</span>
                  <div className={styles.auditOutputGrid}>
                    {securityAuditOutputs.map((output) => (
                      <div key={output.file}>
                        <code>{output.file}</code>
                        <p>{output.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className={styles.auditBoundary}><strong>阅读报告时：</strong> <code>confirmed</code> 代表已确认，<code>needs_validation</code> 代表待验证，<code>rejected</code> 代表已证伪。动态验证只能在满足隔离要求的本地沙盒中执行；一次审计不代表查完所有漏洞。</p>
              </details>
            </article>
          </div>
        </section>

        <section className={styles.boundary} id="mind-boundary" aria-labelledby="mind-boundary-heading">
          <div className="section-label light">
            <span>03</span>
            <span lang="en">Usage boundary</span>
          </div>
          <div className={styles.boundaryBody}>
            <p className="eyebrow">Keep it accountable / 保持可追责</p>
            <h2 id="mind-boundary-heading">工具备忘录只帮我记住怎么用，不替我做决定。</h2>
            <div className={styles.boundaryGrid}>
              {boundaryCards.map((card) => (
                <article key={card.label}>
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
