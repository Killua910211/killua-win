import type { CSSProperties } from 'react';

type SmokingRecoveryRow = {
  system: string;
  recovery: string;
  judgment: string;
  visual: number | null;
};

// 用户确认后的原图文字转录：静态展示，不参与戒烟计时或重新计算。
const SMOKING_RECOVERY_ROWS: SmokingRecoveryRow[] = [
  { system: '尼古丁清除', recovery: '100%', judgment: '很早已经完成', visual: 100 },
  { system: '生理性尼古丁依赖', recovery: '≈99–100%', judgment: '基本解除', visual: 99 },
  { system: '神经系统适应', recovery: '≈97–99%', judgment: '基本稳定', visual: 97 },
  {
    system: '多巴胺/奖赏系统',
    recovery: '≈95–98%',
    judgment: '已高度适应无尼古丁状态',
    visual: 95,
  },
  { system: '戒烟相关睡眠影响', recovery: '≈98–100%', judgment: '基本结束', visual: 98 },
  {
    system: '心率/血压短期影响',
    recovery: '≈95–100%',
    judgment: '吸烟的急性刺激早已消失',
    visual: 95,
  },
  { system: '血液一氧化碳', recovery: '100%', judgment: '戒烟后数天内已正常化', visual: 100 },
  { system: '血管内皮功能', recovery: '≈85–95%', judgment: '仍有长期改善空间', visual: 85 },
  { system: '气道纤毛功能', recovery: '≈90–100%', judgment: '大部分恢复', visual: 90 },
  { system: '气道炎症', recovery: '≈85–95%', judgment: '较吸烟期明显改善', visual: 85 },
  { system: '肺功能可逆部分', recovery: '≈85–95%', judgment: '主要改善已出现', visual: 85 },
  { system: '炎症/免疫状态', recovery: '≈85–95%', judgment: '持续改善', visual: 85 },
  { system: '代谢影响', recovery: '≈90–95%', judgment: '戒烟本身影响已经较小', visual: 90 },
  { system: '皮肤微循环', recovery: '≈90–95%', judgment: '明显优于持续吸烟', visual: 90 },
  { system: '口腔环境', recovery: '≈90–95%', judgment: '持续改善', visual: 90 },
  { system: '心血管长期风险', recovery: '≈60–75%', judgment: '仍需数年', visual: 60 },
  { system: '脑卒中长期风险', recovery: '≈50–70%', judgment: '仍需数年', visual: 50 },
  { system: '肺癌风险逆转', recovery: '≈15–25%', judgment: '需要10年级别', visual: 15 },
  { system: '其他癌症风险逆转', recovery: '≈20–40%', judgment: '按年持续改善', visual: 20 },
  { system: '已形成的结构损伤', recovery: '无法统一百分比', judgment: '部分可能不可逆', visual: null },
];

export function SmokingRecoveryTimeline() {
  return (
    <details className="health-recovery" aria-labelledby="health-recovery-heading">
      <summary className="health-recovery-heading">
        <div>
          <span lang="en">03 / Smoking recovery</span>
          <h3 id="health-recovery-heading">戒烟后的身体变化</h3>
        </div>
        <span className="health-recovery-badge">用户记录</span>
      </summary>
      <div className="health-recovery-table-wrap">
        <table className="health-recovery-table health-smoking-recovery-table">
          <caption className="visually-hidden">戒烟后的身体变化估算记录</caption>
          <thead>
            <tr>
              <th scope="col">系统</th>
              <th scope="col">估算恢复度</th>
              <th scope="col">当前判断</th>
            </tr>
          </thead>
          <tbody>
            {SMOKING_RECOVERY_ROWS.map((row) => (
              <tr key={row.system}>
                <th scope="row">{row.system}</th>
                <td>
                  {row.recovery}
                  <div
                    className={`health-recovery-meter${row.visual === null ? ' is-unavailable' : ''}`}
                    aria-hidden="true"
                  >
                    <span
                      style={
                        row.visual !== null
                          ? ({
                              '--recovery-width': `${row.visual}%`,
                            } as CSSProperties)
                          : undefined
                      }
                    />
                  </div>
                </td>
                <td>{row.judgment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
