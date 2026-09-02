import type { CSSProperties } from 'react';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SmokingStreak } from './smoking-streak';
import { LifeProgress } from './life-progress';
import { SmokingRecoveryTimeline } from './smoking-recovery';
import {
  getHealthLifeProgressSnapshot,
  HEALTH_COVERAGE_START,
  HEALTH_NUTRITION_COVERAGE,
  HEALTH_SUPPLEMENTS,
  HEALTH_SMOKING_RECORD,
  HEALTH_TRENDS,
  HEALTH_UPDATED_AT,
  HEALTH_WEEKLY_AVERAGES,
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
  const lifeProgressSnapshot = getHealthLifeProgressSnapshot();

  return (
    <>
      <SiteHeader current="health" />

      <main id="main" className="health-page">
        <section className="notes-hero health-hero">
          <div className="section-label light" lang="en">
            <span>04</span>
            <span>Health readout</span>
          </div>
          <div>
            <p className="eyebrow">Apple Health / Public view</p>
            <h1 lang="en">
              BODY,
              <br />
              IN <span className="outline">MOTION.</span>
            </h1>
            <p className="notes-intro health-intro">
              记录活动、睡眠、恢复与体能的长期变化。
              <br />
              从日常读数里，看见身体的节奏。
            </p>
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
          </div>
        </section>

        <section className="health-smoking-section" aria-label="个人时间线">
          <div className="section-label" lang="en">
            <span>01</span>
            <span>Personal timeline</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">Milestones / 长期变化</p>
            <article className="health-life-card" aria-labelledby="health-life-heading">
              <div className="health-life-heading">
                <div>
                  <span lang="en">01 / Life progress</span>
                  <h2 id="health-life-heading">已存活时间</h2>
                </div>
              </div>
              <LifeProgress snapshot={lifeProgressSnapshot} />
            </article>
            <article className="health-smoking-card" aria-labelledby="health-smoking-heading">
              <div className="health-smoking-heading">
                <div>
                  <span lang="en">02 / Smoking cessation</span>
                  <h2 id="health-smoking-heading">戒烟记录</h2>
                </div>
                <span className="health-smoking-status">{HEALTH_SMOKING_RECORD.confirmation}</span>
              </div>
              <dl className="health-smoking-grid">
                <div>
                  <dt>最后一支烟</dt>
                  <dd>{HEALTH_SMOKING_RECORD.lastSmokingAt}</dd>
                </div>
                <div>
                  <dt>时区</dt>
                  <dd>{HEALTH_SMOKING_RECORD.timeZone}</dd>
                </div>
                <div>
                  <dt>吸烟史</dt>
                  <dd>{HEALTH_SMOKING_RECORD.smokingHistory}</dd>
                </div>
                <div>
                  <dt>戒烟前日均</dt>
                  <dd>{HEALTH_SMOKING_RECORD.dailyCigarettes}</dd>
                </div>
                <div className="health-smoking-streak">
                  <dt>当前连续戒烟</dt>
                  <SmokingStreak lastSmokingAtISO={HEALTH_SMOKING_RECORD.lastSmokingAtISO} />
                </div>
              </dl>
            </article>
            <SmokingRecoveryTimeline />
          </div>
        </section>

        <section className="health-snapshot" aria-labelledby="health-snapshot-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Seven-day average</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">7 日均值</p>
            <h2 id="health-snapshot-heading">最近一周，身体的平均状态。</h2>
            <p className="health-section-lede">
              以下读数来自最近一个完整七日窗口，帮助你看到一周的整体节奏。
            </p>

            <dl className="health-kpi-grid">
              {HEALTH_WEEKLY_AVERAGES.map((item) => (
                <div className="health-kpi" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.value}
                    {item.unit ? <span>{item.unit}</span> : null}
                  </dd>
                  <p lang="en">{item.coverage}</p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="health-trends" aria-labelledby="health-trends-heading">
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

        <section className="health-nutrition" aria-label="补剂方案与每日营养覆盖">
          <div className="section-label" lang="en">
            <span>04</span>
            <span>Supplements</span>
          </div>
          <div className="health-section-body">
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

            <section className="health-recovery health-nutrition-coverage" aria-labelledby="health-nutrition-heading">
              <div className="health-recovery-heading">
                <div>
                  <span lang="en">Supplement coverage</span>
                  <h3 id="health-nutrition-heading">补剂的每日营养覆盖</h3>
                </div>
                <span className="health-recovery-badge">当前估算</span>
              </div>
              <div className="health-recovery-table-wrap">
                <table className="health-recovery-table">
                  <caption className="visually-hidden">一天的营养摄入与参考值覆盖度估算</caption>
                  <thead>
                    <tr>
                      <th scope="col">营养素</th>
                      <th scope="col">估算摄入 / 参考值</th>
                      <th scope="col">当前判断</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEALTH_NUTRITION_COVERAGE.map((item) => (
                      <tr key={item.nutrient}>
                        <th scope="row">{item.nutrient}</th>
                        <td>
                          {item.coverage}
                          <div
                            className={`health-recovery-meter${item.visual === null ? ' is-unavailable' : ''}`}
                            aria-hidden="true"
                          >
                            <span
                              style={
                                item.visual !== null
                                  ? ({ '--recovery-width': `${item.visual}%` } as CSSProperties)
                                  : undefined
                              }
                            />
                          </div>
                          <small className="health-nutrition-intake">{item.intake} · 参考 {item.reference}</small>
                        </td>
                        <td>{item.judgment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="health-nutrition-reference">
              当前覆盖度仅统计页面列出的 6 项补充方案，不包括基础饮食；参考值按常用成人每日参考值估算。超过 100% 的项目进度条封顶，具体数值会随产品版本与个人需求变化。
            </div>

            <p className="health-nutrition-footnote">
              这是个人记录，不是医疗诊断或治疗建议；如有肾功能问题、正在用药或其他特殊情况，补充前先咨询医生或药师。钙镁与药物的间隔按医嘱或产品说明执行。
            </p>
          </div>
        </section>

        <section className="health-notes" aria-labelledby="health-notes-heading">
          <div className="section-label" lang="en">
            <span>05</span>
            <span>Reading notes</span>
          </div>
          <div className="health-section-body">
            <p className="eyebrow">Milestones / 长期变化</p>
            <h2 id="health-notes-heading">数字之外，也记录主动改变。</h2>
            <div className="health-note-grid">
              <article>
                <span lang="en">01 / Activity</span>
                <h3>2025 年出现活动拐点</h3>
                <p>日均步数从 2024 年的 1,566 上升至 2025 年的 6,123。</p>
              </article>
              <article>
                <span lang="en">02 / Recovery</span>
                <h3>恢复指标同向变化</h3>
                <p>年度日均静息心率下降，HRV 上升；两项只描述趋势，不构成诊断。</p>
              </article>
              <article>
                <span lang="en">03 / Capacity</span>
                <h3>体能指标缓慢改善</h3>
                <p>VO₂ Max 年度日均从 32.8 上升至 36.3，近期单次记录为 37.19。</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
