-- Schema D1 cho HT HOME (Khách hàng · Giao dịch quỹ · Lịch hẹn)
CREATE TABLE IF NOT EXISTS khach_hang (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ten TEXT NOT NULL,
  sdt TEXT NOT NULL,
  loai TEXT DEFAULT '',            -- 🎓 SV / 💼 Đi làm / 🌏 Nước ngoài
  nhiet TEXT DEFAULT 'warm',       -- hot | warm | cold
  ngan_sach TEXT DEFAULT '',
  nguon TEXT DEFAULT '',           -- Facebook / TikTok / SEO Google / Referral
  cot TEXT DEFAULT 'moi',          -- moi | tuvan | guiphong | danxem | chot
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS giao_dich (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loai TEXT NOT NULL,              -- thu | chi
  noi_dung TEXT NOT NULL,
  so_tien INTEGER NOT NULL,        -- số dương (dấu suy từ loai)
  kenh TEXT DEFAULT '',            -- Chuyển khoản / Tiền mặt
  ngay TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lich_hen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  khach TEXT NOT NULL,
  sdt TEXT DEFAULT '',
  phong TEXT DEFAULT '',
  ngay TEXT DEFAULT '',
  gio TEXT DEFAULT '',
  trang_thai TEXT DEFAULT 'cho',   -- cho | xacnhan | huy
  created_at TEXT DEFAULT (datetime('now'))
);
