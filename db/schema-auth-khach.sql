-- Schema D1: Tài khoản khách (đăng ký/đăng nhập bằng SĐT + mật khẩu, KHÔNG dùng OTP)
-- Mật khẩu lưu dạng hash PBKDF2 (pbkdf2$<iter>$<salt_b64>$<hash_b64>), không lưu plaintext.
CREATE TABLE IF NOT EXISTS tai_khoan_khach (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ho_ten TEXT NOT NULL,
  sdt TEXT NOT NULL UNIQUE,        -- dùng làm tên đăng nhập
  mat_khau TEXT NOT NULL,          -- hash PBKDF2 (không phải plaintext)
  email TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);
