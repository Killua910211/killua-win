-- Apple Health 每日汇总。
--
-- 由 iPhone 快捷指令定时推送到 /api/health/sync 写入（解析规则见
-- app/lib/health-sync.ts），健康页的「7 日均值」和「长期趋势」当年数据从这里实时计算。
-- 只存按日聚合后的数值，不存原始样本、设备或来源信息。
--
-- date：手机本地日期 YYYY-MM-DD；睡眠按醒来那天归属。
-- complete：写入时这一天是否已经结束（北京时间）。当天的读数是半截的，
--   只在之后某次同步覆盖成 complete = 1 后才参与均值。
-- synced_at：写入时刻，Unix 毫秒。
CREATE TABLE IF NOT EXISTS health_daily (
  metric TEXT NOT NULL CHECK (
    metric IN ('steps', 'active_energy', 'distance', 'sleep', 'resting_hr', 'hrv', 'spo2')
  ),
  date TEXT NOT NULL CHECK (length(date) = 10),
  value REAL NOT NULL,
  complete INTEGER NOT NULL DEFAULT 0 CHECK (complete IN (0, 1)),
  synced_at INTEGER NOT NULL,
  PRIMARY KEY (metric, date)
);

INSERT INTO site_settings (key, value)
VALUES ('database_version', '17')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;
