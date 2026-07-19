-- Schema D1 mở rộng: Toà nhà + Phòng (JSON) · Nhân viên · Bảng tin
CREATE TABLE IF NOT EXISTS toa_nha (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bid TEXT NOT NULL,               -- mã toà nhà (b1, cc_b1, u_...)
  grp TEXT NOT NULL DEFAULT 'ptro',-- ptro | cc
  data TEXT NOT NULL,              -- JSON đầy đủ 1 toà nhà (gồm mảng rooms)
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nhan_vien (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  av TEXT DEFAULT '',
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  role TEXT DEFAULT 'Sale cấp 2',
  kv TEXT DEFAULT '',              -- khu vực
  deal INTEGER DEFAULT 0,
  hh TEXT DEFAULT '—',             -- hoa hồng (hiển thị)
  st TEXT DEFAULT 'Active',        -- Active | Đã nghỉ
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bang_tin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  av TEXT DEFAULT '',
  author TEXT DEFAULT '',
  role TEXT DEFAULT '',
  time TEXT DEFAULT 'vừa xong',
  pinned INTEGER DEFAULT 0,
  tag_cls TEXT DEFAULT '',
  tag_txt TEXT DEFAULT '',
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  cmt INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
