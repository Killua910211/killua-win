import type { CSSProperties } from 'react';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { SmokingStreak } from './smoking-streak';
import { LifeProgress } from './life-progress';
import { SmokingRecoveryTimeline } from './smoking-recovery';
import {
  getHealthLifeProgressSnapshot,
  getHealthWeeklyAverageDisplay,
  HEALTH_COVERAGE_START,
  HEALTH_NUTRITION_COVERAGE,
  HEALTH_SUPPLEMENTS,
  HEALTH_SMOKING_RECORD,
  HEALTH_TRENDS,
  HEALTH_UPDATED_AT,
  HEALTH_WEEKLY_AVERAGES,
  getHealthNutritionReferenceLabel,
  getHealthNutritionReferenceStatus,
  getHealthNutritionUpperLimitStatus,
} from '@/app/lib/health';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'Health',
  description: '从 Apple Health 提取的公开健康快照：活动、睡眠、恢复、体能趋势与每日营养补充记录。',
  path: '/health',
});

function formatValue(value: number, precision: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export default function HealthPage() {
  // 同一次服务端渲染的时间同时作为已存活时间和戒烟计时的首屏基准，
  // 避免客户端接管前出现“计算中…”或两个读数基准不一致。
  const lifeProgressSnapshot = getHealthLifeProgressSnapshot();
  const initialNowMilliseconds = lifeProgressSnapshot.asOfMilliseconds;

  return (
    <>
      <SiteHeader current="health" />

      <main id="main" className="health-page">
        <PageHero
          description={<>记录活动、睡眠、恢复与体能的长期变化。<br />从日常读数里，看见身体的节奏。</>}
          eyebrow="Apple Health / Public view"
          label="Health readout"
          number="01"
          title={<>BODY,<br />IN <span className="outline">MOTION.</span></>}
          titleId="health-title"
          footer={
            <dl className="health-hero-meta" lang="en">
              <div>
                <dt>Coverage</dt>
                <dd>{HEALTH_COVERAGE_START} — now</dd>
              </div>
              <div>
                <dt>Signals</dt>
                <dd>33 metrics</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{HEALTH_UPDATED_AT}</dd>
              </div>
            </dl>
          }
        />

        <SectionNav
          label="健康页分区"
          items={[
            { href: '#health-timeline', label: '时间线' },
            { href: '#health-snapshot', label: '一周均值' },
            { href: '#health-trends', label: '长期趋势' },
            { href: '#health-nutrition', label: '补剂' },
            { href: '#health-notes', label: '数据观察' },
          ]}
        />

        <section id="health-timeline" className="health-smoking-section" aria-label="个人时间线">
          <div className="section-label" lang="en">
            <span>01</span>
            <span>Personal timeline</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">Milestones / 长期变化</p>
            <div className="health-memorial-stack">
              <div className="health-memorial-grid">
                <article className="health-life-card" aria-labelledby="health-life-heading">
                  <div className="health-life-heading">
                    <span className="health-milestone-label" aria-hidden="true">
                      <b>01</b>
                      <span>Life</span>
                    </span>
                    <h2 id="health-life-heading">已存活时间</h2>
                  </div>
                  <LifeProgress snapshot={lifeProgressSnapshot} />
                </article>
                <article className="health-smoking-card" aria-labelledby="health-smoking-heading">
                  <div className="health-smoking-heading">
                    <span className="health-milestone-label" aria-hidden="true">
                      <b>02</b>
                      <span>Quit</span>
                    </span>
                    <h2 id="health-smoking-heading">戒烟记录</h2>
                  </div>
                  <dl className="health-smoking-grid">
                    <div className="health-smoking-streak">
                      <dt>当前连续戒烟</dt>
                      <SmokingStreak
                        lastSmokingAtISO={HEALTH_SMOKING_RECORD.lastSmokingAtISO}
                        initialNowMilliseconds={initialNowMilliseconds}
                      />
                    </div>
                    <div>
                      <dt>最后一支烟</dt>
                      <dd>{HEALTH_SMOKING_RECORD.lastSmokingAt}</dd>
                    </div>
                  </dl>
                </article>
              </div>
              <SmokingRecoveryTimeline />
            </div>
          </div>
        </section>

        <section id="health-snapshot" className="health-snapshot" aria-labelledby="health-snapshot-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Seven-day averages</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">7 日均值</p>
            <h2 id="health-snapshot-heading">身体的日常节奏。</h2>
            <dl className="health-kpi-grid">
              {HEALTH_WEEKLY_AVERAGES.map((item) => {
                const display = getHealthWeeklyAverageDisplay(item);
                return (
                  <div className={`health-kpi is-${item.status}`} key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>
                      <span className="health-kpi-value">
                        {display.value}
                        {display.unit ? <span className="health-kpi-unit">{display.unit}</span> : null}
                      </span>
                    </dd>
                    <p>
                      {item.validDays ?? '—'} / {item.totalDays} {item.sampleUnit}覆盖
                    </p>
                    {display.note ? <p className="health-kpi-note">{display.note}</p> : null}
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        <section id="health-trends" className="health-trends" aria-labelledby="health-trends-heading">
          <div className="section-label light" lang="en">
            <span>03</span>
            <span>Long view</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow health-trends-eyebrow">2021 → 2026</p>
            <h2 id="health-trends-heading">把变化放回几年的时间里。</h2>

            <div className="health-trend-grid">
              {HEALTH_TRENDS.map((trend) => {
                const max = Math.max(...trend.points.map((point) => point.value));
                const chartStyle = {
                  '--trend-count': trend.points.length,
                } as CSSProperties;

                return (
                  <article className="health-trend-card" key={trend.label}>
                    <div className="health-trend-heading">
                      <h3>{trend.label}</h3>
                      <span>{trend.unit}</span>
                    </div>
                    <div className="health-year-chart" style={chartStyle} aria-hidden="true">
                      {trend.points.map((point, index) => {
                        const barStyle = {
                          '--bar-height': `${Math.max(10, (point.value / max) * 100)}%`,
                        } as CSSProperties;

                        return (
                          <div className="health-year-column" key={point.year}>
                            <span className="health-year-value">
                              {formatValue(point.value, trend.precision)}
                            </span>
                            <span className="health-year-rail">
                              <span
                                className={index === trend.points.length - 1 ? 'is-current' : undefined}
                                style={barStyle}
                              />
                            </span>
                            <span className="health-year-label">
                              {point.year}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <dl className="visually-hidden">
                      {trend.points.map((point) => (
                        <div key={point.year}>
                          <dt>{point.year}</dt>
                          <dd>
                            {formatValue(point.value, trend.precision)} {trend.unit}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="health-nutrition" className="health-nutrition" aria-label="补剂方案与每日营养覆盖">
          <div className="section-label" lang="en">
            <span>04</span>
            <span>Supplements</span>
          </div>
          <div className="health-section-body">
            <section className="health-recovery health-nutrition-coverage" aria-labelledby="health-nutrition-heading">
              <div className="health-recovery-heading">
                <div>
                  <h3 id="health-nutrition-heading">补剂的每日营养覆盖</h3>
                </div>
              </div>
              <p className="health-nutrition-footnote">
                仅统计本页列出的补充摄入，不包含基础饮食；达到参考量不等于全天营养充足。
              </p>
              <div className="health-recovery-table-wrap">
                <table className="health-recovery-table">
                  <caption className="visually-hidden">补剂每日营养摄入、参考量与耐容上限量</caption>
                  <thead>
                    <tr>
                      <th scope="col">营养素</th>
                      <th scope="col">当前摄入 / 参考量</th>
                      <th scope="col">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEALTH_NUTRITION_COVERAGE.map((item) => {
                      const referenceStatus = getHealthNutritionReferenceStatus(item);
                      const upperLimitStatus = getHealthNutritionUpperLimitStatus(item);

                      return (
                        <tr key={item.nutrient}>
                          <th scope="row">{item.nutrient}</th>
                          <td>
                            <strong className="health-nutrition-amount">{item.intake.display}</strong>
                            <div className="health-nutrition-detail">
                              {referenceStatus.progress !== null ? (
                                <div className="health-recovery-meter" aria-hidden="true">
                                  <span
                                    style={{ '--recovery-width': `${referenceStatus.progress * 100}%` } as CSSProperties}
                                  />
                                </div>
                              ) : null}
                              <small className="health-nutrition-intake">
                                {getHealthNutritionReferenceLabel(item.reference.type)} {item.reference.display}
                              </small>
                              {upperLimitStatus ? (
                                <small className={`health-nutrition-upper-limit is-${upperLimitStatus.tone}`}>
                                  {upperLimitStatus.label}
                                  {item.upperLimit?.note ? `（${item.upperLimit.note}）` : ''}
                                </small>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <span className="health-nutrition-status">{referenceStatus.label}</span>
                            {item.comparisonNote ? <small>{item.comparisonNote}</small> : null}
                            {upperLimitStatus?.tone === 'warning' ? <small className="is-warning">接近耐容上限</small> : null}
                            {upperLimitStatus?.tone === 'danger' ? <small className="is-danger">超过耐容上限</small> : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="health-supplement-grid">
              {HEALTH_SUPPLEMENTS.map((supplement) => (
                <article className="health-supplement-card" key={supplement.name}>
                  <div className="health-supplement-heading">
                    <h3>{supplement.name}</h3>
                    <span>{supplement.amount}</span>
                  </div>
                  <p className="health-supplement-role">{supplement.role}</p>
                  <dl className="health-supplement-details">
                    {supplement.details.map((detail) => (
                      <div key={detail.label}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.text}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="health-notes" className="health-notes" aria-labelledby="health-notes-heading">
          <div className="section-label" lang="en">
            <span>05</span>
            <span>Data observations</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">Observations / 长期变化</p>
            <h2 id="health-notes-heading">数字之外，也记录主动改变。</h2>
            <div className="health-note-grid">
              <article>
                <span lang="en">01 / Activity</span>
                <h3>2025 年出现活动拐点</h3>
                <p>长期低活动阶段在 2025 年明显结束。</p>
              </article>
              <article>
                <span lang="en">02 / Recovery</span>
                <h3>恢复指标同向变化</h3>
                <p>恢复相关读数在长期尺度上呈现同向改善。</p>
              </article>
              <article>
                <span lang="en">03 / Capacity</span>
                <h3>体能指标缓慢改善</h3>
                <p>体能读数维持缓慢改善趋势。</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
