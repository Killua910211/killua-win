-- health_daily 新增「锻炼分钟数」（exercise）与「站立小时」（stand）。
--
-- SQLite 不能修改 CHECK 约束，所以按「建新表 → 拷数据 → 删旧表 → 改名」重建。
-- 新表不再在库里枚举指标名：可写入的指标由 app/lib/health-sync.ts 的白名单决定，
-- 以后加指标不必再重建表。其余列、约束与主键不变。
CREATE TABLE health_daily_next (
  metric TEXT NOT NULL CHECK (length(metric) BETWEEN 1 AND 32),
  date TEXT NOT NULL CHECK (length(date) = 10),
  value REAL NOT NULL,
  complete INTEGER NOT NULL DEFAULT 0 CHECK (complete IN (0, 1)),
  synced_at INTEGER NOT NULL,
  PRIMARY KEY (metric, date)
);

INSERT INTO health_daily_next (metric, date, value, complete, synced_at)
SELECT metric, date, value, complete, synced_at FROM health_daily;

DROP TABLE health_daily;

ALTER TABLE health_daily_next RENAME TO health_daily;

INSERT INTO site_settings (key, value)
VALUES ('database_version', '18')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;
