export const SCHEMA_SQL = /* sql */ `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);

-- category: supplement | package | device
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  unit TEXT NOT NULL DEFAULT 'Hộp',
  pack_size TEXT,
  image TEXT,
  gallery TEXT NOT NULL DEFAULT '[]',
  variants TEXT NOT NULL DEFAULT '[]',
  badges TEXT NOT NULL DEFAULT '[]',
  has_gift INTEGER NOT NULL DEFAULT 0,
  origin TEXT NOT NULL DEFAULT 'Việt Nam',
  rating REAL NOT NULL DEFAULT 5,
  review_count INTEGER NOT NULL DEFAULT 0,
  short_description TEXT,
  description TEXT,
  ingredients TEXT,
  usage TEXT,
  stock INTEGER NOT NULL DEFAULT 100,
  sold_count INTEGER NOT NULL DEFAULT 0,
  flash_sale INTEGER NOT NULL DEFAULT 0,
  flash_limit INTEGER NOT NULL DEFAULT 0,
  flash_sold INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 1,
  commission_rate REAL NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'active',
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  topic_label TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  image TEXT,
  hero_kicker TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  body TEXT,
  author TEXT,
  reviewer TEXT,
  read_minutes INTEGER NOT NULL DEFAULT 5,
  key_points TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published',
  published_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  tag TEXT,
  overlay_title TEXT,
  overlay_subtitle TEXT,
  image TEXT,
  url TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);

-- Affiliate partners. tier: bronze|silver|gold|diamond ; status: active|pending|suspended
CREATE TABLE IF NOT EXISTS partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  handle TEXT,
  email TEXT,
  phone TEXT,
  channel TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze',
  status TEXT NOT NULL DEFAULT 'pending',
  commission_rate REAL NOT NULL DEFAULT 10,
  bank_name TEXT,
  bank_account TEXT,
  region TEXT,
  type TEXT NOT NULL DEFAULT 'affiliate',
  owner TEXT,
  province TEXT,
  joined_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  province TEXT,
  partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
  segment TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- status: pending|confirmed|shipping|completed|cancelled|returned
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'commission_boost',
  description TEXT,
  bonus_rate REAL NOT NULL DEFAULT 0,
  budget INTEGER NOT NULL DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  utm_code TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT,
  province TEXT,
  partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'website',
  subtotal INTEGER NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_partner ON orders(partner_id);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  variant TEXT,
  image TEXT,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

-- status: pending|approved|paid|rejected
CREATE TABLE IF NOT EXISTS commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  partner_id INTEGER NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  base_amount INTEGER NOT NULL,
  rate REAL NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  adjustment INTEGER NOT NULL DEFAULT 0,
  approved_by TEXT,
  payout_id INTEGER REFERENCES payouts(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status: pending|processing|paid|failed
CREATE TABLE IF NOT EXISTS payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  partner_id INTEGER NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  amount INTEGER NOT NULL,
  tax INTEGER NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT 'bank_transfer',
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  batch TEXT,
  created_by TEXT,
  approved_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT
);

-- type: general|afib ; risk: low|moderate|high
CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  score REAL NOT NULL,
  risk_level TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS trainings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'basic',
  format TEXT NOT NULL DEFAULT 'video',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  lessons INTEGER NOT NULL DEFAULT 1,
  enrolled INTEGER NOT NULL DEFAULT 0,
  completion_rate REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;
