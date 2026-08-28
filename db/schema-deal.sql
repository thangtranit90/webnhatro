-- Bảng Deal & Hợp đồng (Giai đoạn 3 — theo thiết kế v2)
CREATE TABLE IF NOT EXISTS deal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  khach TEXT NOT NULL,             -- tên khách
  phong TEXT DEFAULT '',           -- mã/mô tả phòng
  toanha TEXT DEFAULT '',          -- toà nhà
  sale TEXT DEFAULT '',            -- nhân viên sale phụ trách
  gia_tri INTEGER DEFAULT 0,       -- giá trị deal (giá thuê/tháng, đ)
  hh INTEGER DEFAULT 0,            -- hoa hồng (đ)
  trang_thai TEXT DEFAULT 'coc',   -- coc | chot | release | huy
  ngay TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);
