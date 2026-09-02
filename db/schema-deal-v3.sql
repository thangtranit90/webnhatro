-- D-3 (Đợt D): Deal theo v3.6 — luật hoa hồng 40/60 + 6 trạng thái + release lock + ảnh HĐ
-- Thêm cột (chạy 1 lần; ALTER ADD COLUMN idempotent-safe qua kiểm tra tầng ứng dụng)
ALTER TABLE deal ADD COLUMN hh_pct REAL DEFAULT 50;         -- %HH chủ nhà
ALTER TABLE deal ADD COLUMN offer INTEGER DEFAULT 0;         -- tiền offer trừ vào gốc
ALTER TABLE deal ADD COLUMN so_thang INTEGER DEFAULT 6;      -- số tháng hợp đồng
ALTER TABLE deal ADD COLUMN tim_khach TEXT DEFAULT '';       -- người tìm khách (1 người, 30%)
ALTER TABLE deal ADD COLUMN dan_khach TEXT DEFAULT '';       -- người dẫn khách (nhiều, chia đều 30%)
ALTER TABLE deal ADD COLUMN released INTEGER DEFAULT 0;      -- 1 = đã release HH (khoá sửa)
ALTER TABLE deal ADD COLUMN anh_hd TEXT DEFAULT '';          -- ảnh hợp đồng (JSON mảng URL)

-- 6 trạng thái mới: checkin | coc_du | doi_coc_bu | da_nhan_hh | bo_coc | doi_nhan_hh
-- Di trú giá trị cũ (coc/chot/release/huy) sang bộ mới:
UPDATE deal SET trang_thai='checkin'    WHERE trang_thai='coc';
UPDATE deal SET trang_thai='coc_du'     WHERE trang_thai='chot';
UPDATE deal SET trang_thai='da_nhan_hh', released=1 WHERE trang_thai='release';
UPDATE deal SET trang_thai='bo_coc'     WHERE trang_thai='huy';
-- Điền người tìm/dẫn khách mặc định = sale phụ trách cho dữ liệu cũ
UPDATE deal SET tim_khach=sale WHERE tim_khach='' AND sale<>'';
UPDATE deal SET dan_khach=sale WHERE dan_khach='' AND sale<>'';
