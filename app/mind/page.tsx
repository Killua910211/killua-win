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
  { label: '01 / MINIMUM DATA', title: '只传完成判断所需的信息。', body: '不上传凭据、密钥、私有文件或完整仓库；涉及敏感信息时先取得明确授权。' },
  { label: '02 / LOCAL EVIDENCE', title: '外部建议必须回到本地核验。', body: '检查源文件、运行测试并确认实际输出，不能把顾问意见写成事实、诊断或验证结果。' },
  { label: '03 / USER AUTHORITY', title: '权限边界由用户决定。', body: '提交、推送、迁移和部署需要单独确认；测试环境与正式网站始终分开说明。' },
];

export default function MindPage() {
  return (
    <>
      <SiteHeader current="mind" />
      <main id="main" className="mind-page">
        <PageHero
          description="这里维护 Codex Skill 与软件使用说明，优先记录可重复、可验证的操作边界。每篇说明都区分怎么用、谁来执行，以及什么需要授权。"
          eyebrow="Usage notes / 使用说明"
          label="Tools & protocols"
          number="01"
          title={<>READ THE<br /><span className="outline">TOOLS</span><br />YOU USE.</>}
          titleId="mind-title"
        />
        <SectionNav
          label="使用说明条目"
          items={[
            { href: '#collaboration-skill-heading', label: '$codex-chatgpt-collaboration' },
            { href: '#security-audit-skill-heading', label: '$security-audit' },
          ]}
        />

        <section className={styles.overview} id="mind-overview" aria-labelledby="mind-overview-heading">
          <div className="section-label">
            <span>02</span>
            <span lang="en">Documentation map</span>
          </div>
          <div className={styles.overviewBody}>
            <p className="eyebrow">A practical index / 可复查的入口</p>
            <h2 id="mind-overview-heading">把工具说明写成下一次可以直接调用的知识。</h2>
            <p className={styles.overviewLead}>
              这里不再记录心理认知主题，而是维护与工作流相关的 Skill 和软件说明。说明以任务为中心，保留调用条件、操作步骤、验证方法和授权边界。
            </p>
            <div className={styles.overviewGrid}>
              <article>
                <span>01 / SKILLS</span>
                <h3>给 Codex 的任务协议。</h3>
                <p>说明什么时候调用某个 Skill、需要准备什么上下文，以及哪些动作仍由用户决定。</p>
              </article>
              <article>
                <span>02 / SOFTWARE</span>
                <h3>给软件的可复查说明。</h3>
                <p>按软件、用途、版本和验证日期整理操作，不把一次性的聊天答案当成长期规则。</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.skills} id="mind-skills" aria-labelledby="mind-skills-heading">
          <div className="section-label light">
            <span>03</span>
            <span lang="en">Skills</span>
          </div>
          <div className={styles.skillsBody}>
            <p className="eyebrow">Current skill / 当前 Skill</p>
            <h2 id="mind-skills-heading">先问第二意见，再把判断带回本地验证。</h2>
            <p className={styles.skillsLead}>
              <code>$codex-chatgpt-collaboration</code> 用来请求 ChatGPT 提供第二意见。它不会替代本地证据，也不会扩大 Codex 已获得的权限。
            </p>
            <article className={styles.skillCard} aria-labelledby="collaboration-skill-heading">
              <div className={styles.skillCardHeader}>
                <span className="mind-card-index">Skill / 01</span>
                <span className="mind-card-index">Second opinion</span>
              </div>
              <h3 id="collaboration-skill-heading">一个安全的跨模型协作流程。</h3>
              <p>明确任务后，先让外部顾问提出独立看法，再由 Codex 在本地检查、实现和验证；最终是否采纳、是否写入仓库、是否发布，仍由用户授权。</p>
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
            </article>
            <article className={styles.skillCard} aria-labelledby="security-audit-skill-heading">
              <div className={styles.skillCardHeader}>
                <span className="mind-card-index">Skill / 02</span>
                <span className="mind-card-index">Cloudflare / Security audit</span>
              </div>
              <h3 id="security-audit-skill-heading">让安全审计先找证据，再输出分级报告。</h3>
              <p>在 Codex 对话中指定代码范围，让 <code>$security-audit</code> 检查安全问题、独立复核证据并生成报告。它默认读取和分析，不会因为发现问题就自动修改代码。</p>
              <pre className={styles.auditCommand}><code>{`$security-audit 对 3.business/user-service 做 quick 安全审计。
重点检查登录认证、接口越权和敏感信息泄露，用中文输出报告。`}</code></pre>
              <div className={styles.auditSection}>
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
              <div className={styles.auditSection}>
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
            </article>
          </div>
        </section>

        <section className={styles.software} id="mind-software" aria-labelledby="mind-software-heading">
          <div className="section-label">
            <span>04</span>
            <span lang="en">Software notes</span>
          </div>
          <div>
            <p className="eyebrow">Growing index / 持续补充</p>
            <h2 id="mind-software-heading">软件说明按用途、版本和验证日期归档。</h2>
            <div className={styles.softwareNote}>
              <span className="mind-card-index">NEXT ENTRIES / 后续条目</span>
              <p>当前先维护协作 Skill。后续新增软件说明时，会沿用同一套结构：适用场景、最短操作路径、常见陷阱、验证证据和需要用户确认的动作。</p>
            </div>
          </div>
        </section>

        <section className={styles.boundary} id="mind-boundary" aria-labelledby="mind-boundary-heading">
          <div className="section-label light">
            <span>05</span>
            <span lang="en">Usage boundary</span>
          </div>
          <div className={styles.boundaryBody}>
            <p className="eyebrow">Keep it accountable / 保持可追责</p>
            <h2 id="mind-boundary-heading">说明文档不扩大权限。</h2>
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
