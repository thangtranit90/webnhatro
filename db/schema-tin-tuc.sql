-- D-1 (Đợt D): Tin tức / blog công khai + CMS nội bộ
CREATE TABLE IF NOT EXISTS tin_tuc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tieu_de TEXT NOT NULL,
  slug TEXT UNIQUE,
  sapo TEXT DEFAULT '',                 -- tóm tắt / mô tả ngắn
  noi_dung TEXT DEFAULT '',             -- nội dung HTML nhẹ
  chuyen_muc TEXT DEFAULT 'kinhnghiem', -- kinhnghiem | thitruong | huongdan | tincongty
  tac_gia TEXT DEFAULT 'HT HOME',
  anh_bia TEXT DEFAULT '',              -- URL ảnh bìa (/img/... hoặc http)
  trang_thai TEXT DEFAULT 'draft',      -- published | draft | hidden
  ghim INTEGER DEFAULT 0,               -- 1 = bài nổi bật (ghim)
  luot_xem INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  published_at TEXT DEFAULT ''
);
