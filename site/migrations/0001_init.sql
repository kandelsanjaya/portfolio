-- Portfolio database schema (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  visitor_key TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_visits_visitor_key ON visits (visitor_key);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits (created_at);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  read INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);
