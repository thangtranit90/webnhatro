-- Đợt C: Đăng nhập nội bộ bằng EMAIL + mật khẩu (hash PBKDF2), gộp vai trò về Admin/Sale.
-- Thêm cột mật khẩu + role_key vào bảng nhan_vien có sẵn.
-- (SQLite: ALTER TABLE ADD COLUMN idempotent-safe qua kiểm tra ở tầng ứng dụng; chạy 1 lần.)
ALTER TABLE nhan_vien ADD COLUMN mat_khau TEXT DEFAULT '';
ALTER TABLE nhan_vien ADD COLUMN role_key TEXT DEFAULT 'sale';   -- admin | sale
