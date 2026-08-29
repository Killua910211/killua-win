ALTER TABLE posts ADD COLUMN source TEXT NOT NULL DEFAULT 'original';
ALTER TABLE posts ADD COLUMN source_url TEXT;

UPDATE site_settings
SET value = '2', updated_at = CURRENT_TIMESTAMP
WHERE key = 'database_version';
