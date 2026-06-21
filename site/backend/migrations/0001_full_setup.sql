-- ============================================================
-- FULL SCHEMA + SEED — run this single file with:
-- wrangler d1 execute portfolio-db --remote --file=./migrations/0001_full_setup.sql
-- ============================================================

-- Visitor tracking
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL DEFAULT '/',
  visitor_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_hash ON visitors(visitor_hash);

-- Profile (single row)
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  roles TEXT NOT NULL,
  tech TEXT NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  mark TEXT,
  description TEXT,
  tags TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  src TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  category TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ============================================================
-- SEED DATA — edit these values to match your real content
-- ============================================================

DELETE FROM profile;
INSERT INTO profile (name, roles, tech) VALUES (
  'Sanjaya Kandel',
  '["Software Developer","UI/UX Designer","AI Enthusiast","Creative Coder"]',
  '["HTML","CSS","JavaScript","Node.js","REST APIs","UI/UX","Prompt Engineering"]'
);

DELETE FROM services;
INSERT INTO services (number, title, description, sort_order) VALUES
('01','Full-stack web development','Responsive websites, APIs, dashboards, admin tools, and clean front-end systems.',1),
('02','UI/UX design','Wireframes, user flows, visual systems, and refined interface details for practical products.',2),
('03','AI workflow support','Prompt systems, AI-assisted content workflows, and small productivity tools.',3),
('04','Brand and portfolio design','Personal sites, identity polish, presentation pages, and clear storytelling.',4),
('05','Backend integration','Contact forms, visitor analytics, project data, local storage, and JSON APIs.',5);

DELETE FROM skills;
INSERT INTO skills (name, level, sort_order) VALUES
('HTML/CSS/JS', 92, 1),
('Python', 84, 2),
('UI/UX', 86, 3),
('Backend APIs', 80, 4),
('AI tooling', 78, 5);

DELETE FROM projects;
INSERT INTO projects (title, category, mark, description, tags, sort_order) VALUES
('Developer Portfolio','Web','SK','A detailed portfolio with theme switching, contact API, visitor tracking, and project filtering.','["HTML","CSS","Node"]',1),
('Brand Identity System','Design','ID','Reusable visual language for personal brands, landing pages, and creator portfolios.','["Design","UX"]',2);

DELETE FROM gallery;
INSERT INTO gallery (title, src, type, category, sort_order) VALUES
('Baglung','images/baglung.jpeg','image','Nepal',1),
('Best Portrait','images/best.jpeg','image','Portrait',2),
('Bgl Vibe','images/bgl.jpeg','image','Nepal',3),
('Dhodeni Hills','images/Dhodeni.jpeg','image','Nepal',4),
('Dominar Ride','images/dominar.jpeg','image','Travel',5),
('Home View','images/home.jpeg','image','Personal',6),
('Creative Kid','images/kid.jpeg','image','Portrait',7),
('Old Days','images/old.jpeg','image','Personal',8),
('Professional Me','images/professional.jpeg','image','Portrait',9),
('Sitting Calm','images/sitting.jpeg','image','Portrait',10),
('Sometimes Thinker','images/sometimes.jpeg','image','Nepal',11),
('Upper Mustang 2','images/upper 2.jpeg','image','Travel',12),
('Upper Mustang Ride','images/upper.jpeg','image','Travel',13);
