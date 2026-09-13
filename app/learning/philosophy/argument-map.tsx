import type { LedgerSource } from './content-ledger';
import type { ArgumentMap as ArgumentMapData } from './argument-maps';
import { Citations } from './citation';

/**
 * 论证地图。
 *
 * 只用 HTML 和 CSS：一条纵向的推理主干，走到分歧点后分出各立场，每个立场
 * 下面挂它面对的反对、回应和理论代价。
 *
 * 几条硬约束：
 *   - 方向由「前提／推论／分歧点」这些文字标签和有序列表承担，不靠颜色，也不靠
 *     箭头图形。步骤之间那个 ↓ 是 CSS 伪元素，纯装饰，读屏不会读出一串向下箭头。
 *   - 不横向展开。手机上是一列，桌面上分支并排，但分支内部永远是一列，
 *     所以再深的论证也不会产生横向滚动。
 *   - 关键信息不藏在 hover 里。
 *   - 「反对／回应」两个标签可以被数据覆写（objection.label / response.label）。
 *     硬编码的「回应」曾经把一条只支持该立场自身第一步、并不回答上面那条反对的
 *     论证，呈现成已经答掉了那条反对。标签本身在传达信息，名实必须相符。
 */

export function ArgumentMap({
  map,
  sources,
}: {
  map: ArgumentMapData;
  /** 条目来源账；论证地图自带的来源会并进来。 */
  sources: LedgerSource[];
}) {
  const allSources = [...sources, ...(map.sources ?? [])];

  return (
    <div className="philosophy-argmap">
      <p className="philosophy-argmap-intro">{map.intro}</p>

      <ol className="philosophy-argmap-spine">
        {map.spine.map((step, index) => (
          <li
            className={
              step.kind === '分歧点'
                ? 'philosophy-argmap-step philosophy-argmap-step--fork'
                : 'philosophy-argmap-step'
            }
            key={`${step.kind}-${index}`}
          >
            <p className="philosophy-argmap-kind">
              {step.kind}
              {step.kind !== '分歧点' && (
                <span className="philosophy-argmap-number" lang="en">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </p>
            <p className="philosophy-argmap-text">
              {step.text}
              <Citations ids={step.sourceIds} sources={allSources} />
            </p>
            {step.note && <p className="philosophy-argmap-note">{step.note}</p>}
          </li>
        ))}
      </ol>

      <div className="philosophy-argmap-branches">
        {map.branches.map((branch) => (
          <article className="philosophy-argmap-branch" key={branch.name}>
            <h4 className="philosophy-argmap-branch-name">{branch.name}</h4>
            <p className="philosophy-argmap-stance">{branch.stance}</p>

            <ol className="philosophy-argmap-branch-steps">
              {branch.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <div className="philosophy-argmap-exchange">
              <p className="philosophy-argmap-objection">
                <span className="philosophy-argmap-label">{branch.objection.label ?? '反对'}</span>
                {branch.objection.text}
                <Citations ids={branch.objection.sourceIds} sources={allSources} />
              </p>
              <p className="philosophy-argmap-response">
                <span className="philosophy-argmap-label">{branch.response.label ?? '回应'}</span>
                {branch.response.text}
                <Citations ids={branch.response.sourceIds} sources={allSources} />
              </p>
            </div>

            <p className="philosophy-argmap-cost">
              <span className="philosophy-argmap-label">接受它要付的代价</span>
              {branch.cost}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
