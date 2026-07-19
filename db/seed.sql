-- Seed dữ liệu mẫu HT HOME (giữ đúng nội dung như thiết kế nhatro.pen)
-- Chạy 1 lần vào D1 rỗng. cot: moi|tuvan|guiphong|danxem|chot

-- Khách hàng (CRM) — 12 khách theo 5 cột kanban
INSERT INTO khach_hang (ten,sdt,loai,nhiet,ngan_sach,nguon,cot) VALUES
 ('Trần Văn Nam','09xx234567','🎓 SV','cold','2-3 tr','Facebook','moi'),
 ('Lê Thị Mai','08xx891122','💼 Đi làm','warm','4-5 tr','TikTok','moi'),
 ('Hoàng Thị Loan','07xx445566','🎓 SV','cold','2 tr','SEO Google','moi'),
 ('Nguyễn Đức Anh','09xx778899','💼 Đi làm','warm','3-4 tr','SEO Google','tuvan'),
 ('Sarah Johnson','09xx102030','🌏 Nước ngoài','hot','$500','Referral','tuvan'),
 ('Phan Thanh Tú','08xx334455','💼 Đi làm','warm','4 tr','Facebook','tuvan'),
 ('Phạm Quỳnh Anh','09xx556677','🎓 SV','warm','3 tr','TikTok','guiphong'),
 ('Vũ Bảo Trân','07xx889900','💼 Đi làm','hot','5-6 tr','Referral','guiphong'),
 ('Đỗ Minh Khoa','09xx223344','💼 Đi làm','hot','5 tr','SEO Google','danxem'),
 ('Lý Ngọc Ngân','08xx667788','🎓 SV','warm','3-4 tr','Facebook','danxem'),
 ('Trịnh Anh Dũng','09xx990011','💼 Đi làm','hot','6 tr','Referral','chot'),
 ('Kim Oanh','07xx121314','🌏 Nước ngoài','hot','$600','TikTok','chot');

-- Giao dịch quỹ — 6 phiếu thu/chi gần đây
INSERT INTO giao_dich (loai,noi_dung,so_tien,kenh,ngay) VALUES
 ('thu','HH deal #1039 (Sarah Johnson · P.303)',1280000,'Chuyển khoản','2026-07-09'),
 ('thu','HH deal #1041 (Hoàng Minh Trí · P.505)',1630000,'Chuyển khoản','2026-07-08'),
 ('chi','Lương tháng 6 · 14 nhân viên',98400000,'Chuyển khoản','2026-07-05'),
 ('chi','Marketing · Facebook Ads T7',12000000,'Chuyển khoản','2026-07-03'),
 ('thu','HH deal #1035',320000,'Chuyển khoản','2026-07-01'),
 ('chi','Thuê văn phòng T7',15000000,'Chuyển khoản','2026-07-01');

-- Lịch hẹn dẫn xem — 7 lịch trong tuần 13-19/07 (trang_thai: cho|xacnhan|huy)
INSERT INTO lich_hen (khach,sdt,phong,ngay,gio,trang_thai) VALUES
 ('Sarah Johnson','','P.303 Nguyễn Huệ','2026-07-13','10','xacnhan'),
 ('Trần Minh','','P.508 Duplex','2026-07-13','13','cho'),
 ('Hoàng Nam','','P.201 Phan Xích Long','2026-07-14','9','cho'),
 ('Vũ Thảo','','P.107 Cộng Hoà','2026-07-14','16','huy'),
 ('Lê Mai','','P.402 Thảo Điền','2026-07-15','15','xacnhan'),
 ('Đức Anh','','P.610 Vinhomes','2026-07-16','11','cho'),
 ('Quỳnh Anh','','P.305 Nguyễn Trãi','2026-07-17','14','xacnhan');
