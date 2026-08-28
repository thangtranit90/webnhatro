# Ghi chú chuyển Web → Thiết kế v2 (nhatro_v2.pen)

> File tích luỹ khi soi từng cặp màn. Cập nhật dần. Cuối cùng dùng làm checklist khi thi công.

## 0. TOÀN CỤC (áp cho mọi trang)

### Thương hiệu: GIỮ HT HOME (user chốt 27/08 — logo tạm giữ HT HOME)
- ✅ KHÔNG rebrand Troxin. Giữ nguyên tên/logo/email HT HOME → **không đụng đề cương + repo**.
- Chỉ follow v2 về **thiết kế/bố cục/tính năng** (không đổi thương hiệu).
- Các chỗ v2 ghi "Troxin/hello@troxin.vn" → khi áp vào web giữ "HT HOME/hello@hthome.vn".

### Ngoài thương hiệu (phát hiện thêm khi soi)
- (cập nhật dần bên dưới)

---

## Cặp 1 — Trang chủ  (v2 `Public — Trang chủ` ↔ `index.html`)  ✅ đã soi

**Giống nhau:** header+VN/EN, hero (ảnh tối + ô tìm khu vực/giá/loại + chip phổ biến), Phòng nổi bật, Phòng mới đăng, Duyệt theo khu vực, banner ưu đãi 500k, footer (cùng địa chỉ 262A Nam Kỳ Khởi Nghĩa, giờ 8:00–21:00).

**Cần đổi:**
- [ ] **Dải dưới Hero:** thay dải SỐ LIỆU (500+ tòa/1.200+ phòng/8.500+ khách/4.8★) → **THANH CAM KẾT** (0đ phí môi giới · Ảnh/video thật · ≤24h phản hồi · Hoàn cọc nếu sai mô tả). *(user chọn theo v2)*
- [ ] **Bỏ section "Khách hàng nói gì" (đánh giá khách)** — v2 không có.
- [ ] Thương hiệu/email → Troxin (theo mục 0).

---

## Cặp 2 — Tìm phòng  (v2 `Public — Tìm phòng` ↔ `timphong.html`)  ✅ đã soi

**Giống nhau ~100%:** sidebar lọc trái (Khoảng giá · Loại phòng · Nội thất · Tiện ích · Thiết kế · Áp dụng), lưới thẻ 3 cột, thanh So sánh nổi (nút vàng), breadcrumb + tiêu đề + sắp xếp.

**Cần đổi:** KHÔNG có thay đổi thiết kế. Chỉ dính:
- [ ] Thương hiệu → Troxin (mục 0).
- [ ] (dữ liệu, không phải thiết kế) thẻ v2 có ảnh thật — sẽ có khi up ảnh R2.

## Cặp 3 — Chi tiết phòng  (v2 `Public — Chi tiết phòng` ↔ `detail.html`)  ✅ đã soi

**Giống nhau ~100%:** gallery+thumbnail+video, tiêu đề/giá, 5 ô specs, tiện ích, giới thiệu, chi phí hàng tháng, bản đồ, phòng tương tự, sidebar liên hệ phải.

**Cần đổi:** KHÔNG đổi thiết kế. Chỉ:
- [ ] Thương hiệu → Troxin (mục 0).
- [ ] (tùy chọn nhỏ) nút "Đặt lịch xem" ở sidebar → nền **vàng** cho khớp v2.
- Lưu ý GIỮ các phần web hiện có mà đẹp: Zalo QR, thanh Chia sẻ FB/Zalo/Copy, section "Xung quanh phòng" (tiện ích + trường lân cận).

## Cặp 4 — Đăng ký & Tài khoản  (v2 `s91S10` ↔ `dangky.html`)  ✅ đã soi

**Giống nhau ~100%:** layout 2 cột (form trái + panel đen phải "Đăng ký một lần…" + 4 lợi ích icon vàng).

**Cần đổi:** KHÔNG đổi thiết kế. Chỉ:
- [ ] Thương hiệu → Troxin.
- [ ] (tùy chọn) form đăng ký đặt trên **nền ảnh phòng** như v2.

> **NHẬN XÉT CHUNG public (Cặp 1–4):** web hiện tại đã bám sát v2 gần như tuyệt đối. Điểm khác thật sự duy nhất = trang chủ (thanh cam kết thay dải số liệu + bỏ đánh giá) + thương hiệu.

## Cặp 5 — Dashboard nội bộ  (chưa soi)

## Cặp 6 — Kho phòng  (v2 ↔ `khophong.html` + `themphong.html`)  ✅ đã soi — ⭐ CÓ KHÁC BIỆT THẬT

**Màn Kho phòng chính:** giống (filter dropdown + tabs + lưới thẻ).

**⭐ KHÁC LỚN — Thêm phòng:**
- [ ] Web hiện tại: **Thêm phòng = NGUYÊN 1 TRANG** (`themphong.html`, wizard 5 mục + sidebar tóm tắt).
- v2: **Thêm phòng = MODAL gọn** (popup, không rời trang).
- [ ] → **Chuyển `themphong.html` (trang) thành MODAL** (giống các modal Thêm khách/Thêm tòa nhà đã có).
- [ ] **Bỏ bớt field rườm rà** (v2 lược): Tiền cọc, Kỳ hạn tối thiểu, Ngày trống dự kiến, 4 loại chi phí phụ thu → chỉ giữ field cốt lõi.
- [ ] (kiểm tra) Chi tiết phòng: web = trang `phong-noibo.html`; v2 = modal → cân nhắc chuyển sang modal.

> ⭐ ĐÂY là điều designer nói: "nó có modal, bỏ mấy cái không phù hợp". v2 = modal-hoá các form nặng + lược field. CẦN SOI KỸ tiếp các luồng add/edit khác (tòa nhà, khách, deal) xem web đang là trang hay modal.

## Cặp 7 — CRM / Khách hàng  (v2 ↔ `crm.html`)  ✅ đã soi — ⭐ v2 GIÀU HƠN

- [ ] **Layout:** web = kanban full-width (bấm thẻ → modal). v2 = **kanban + panel chi tiết cố định bên phải** (2-pane) có Lịch hẹn + Timeline tương tác. → thêm panel bên phải.
- [ ] **Chi tiết khách:** web = modal → v2 = **trang riêng đầy đủ** (`Chi tiết khách hàng`). → dựng trang mới hoặc panel.
- [ ] **Modal Thêm khách:** v2 thêm field: **Email, Sale phụ trách, Nguồn, Deadline chuyển, toggle gửi form Zalo** (web hiện chỉ 6 field cơ bản).
- Lưu ý: ở CRM v2 **THÊM** field (khác Kho phòng là bỏ bớt) — mỗi màn v2 có lựa chọn UX riêng.

## Cặp 8 — Deal & Hợp đồng  (v2 ↔ `deal.html`)  ✅ đã soi — ⭐ WEB THIẾU

- [ ] **Danh sách Deal:** web CHƯA có (bấm Deal → vào thẳng form Chốt deal). v2 có **bảng danh sách deal** (KPI + tabs + table). → **dựng màn danh sách deal**.
- [ ] **Chốt/Tạo deal:** web = **nguyên 1 trang** (`deal.html`). v2 = **MODAL**. → chuyển thành modal (giống Kho phòng).
- [ ] **Release hoa hồng:** web KHÔNG có. v2 có **modal xác nhận release HH**. → dựng thêm.

## Cặp 9 — Toà nhà  (v2 ↔ `toanha.html` + `toanha-chitiet.html`)  ✅ đã soi

- Danh sách + Chi tiết tòa nhà: **giống** (web đã có bảng + KPI + tabs phòng + Sửa modal).
- [ ] **Modal Thêm tòa nhà:** v2 nhiều field hơn — thêm: **Số tầng, Link Maps, Chi phí&Cọc (điện/nước/dv/xe), Tiện ích chips, Quy định, Hoa hồng** (web hiện đơn giản: tên/địa chỉ/quận/loại/chủ/sđt).
- [ ] Chi tiết tòa nhà: v2 **sidebar phải giàu hơn** (Chủ nhà + Tiện ích + Deal) — web đang chỉ KPI.
- Web đã dùng modal ở đây (đúng hướng v2) — chỉ cần bổ sung field.

## Cặp 10 — Nhân viên / Báo cáo / Cài đặt  ✅ đã soi
- **Nhân viên** (`nhanvien.html`): giống v2, web đã có CRUD đầy đủ. ✅
- [ ] **Báo cáo** (`baocao.html`): v2 giàu hơn — bổ sung widget **Hiệu suất theo khu vực + Deal pipeline + Cảnh báo & lưu ý**.
- **Cài đặt** (`caidat.html`): gần giống v2 (thông tin công ty, kênh Zalo, support).

---

# 📌 TỔNG KẾT — Web hiện tại vs v2

**Kết luận:** Web đã bám sát v2 ~85%. Public gần như y hệt. Nội bộ đa số khớp, có 4 điểm KHÁC THẬT (đúng ý designer "có modal, bỏ cái không phù hợp"):

### A. Thương hiệu (toàn cục) → Troxin
### B. Trang chủ: thanh cam kết thay dải số liệu + bỏ đánh giá
### C. Modal-hoá các form nặng (v2 dùng modal thay trang):
- [x] ✅ Thêm phòng: `themphong.html` (trang) → **modal** (`ht-room-modal.js`, `HT.roomModal`) + bỏ field rườm rà. Deploy + test OK (2026-08-28). `themphong.html` giữ lại (không xoá) nhưng không còn link tới.
- [ ] Chốt deal: `deal.html` (trang) → **modal**
### D. Bổ sung màn/luồng v2 có mà web thiếu:
- [x] ✅ **Danh sách Deal** (bảng KPI+tabs) + **Chốt deal** (modal) + **Release hoa hồng** (modal). D1 bảng `deal` + `/api/deal`. Deploy+test OK (28/08).
- [ ] **CRM**: panel chi tiết + timeline bên phải kanban; **Chi tiết khách** (trang)
- [ ] **Dashboard Sale** + khu **Sale** riêng (Kho phòng/Deal/Khách của tôi)
- [ ] **So sánh phòng** (trang riêng, thay modal)
- [ ] Tài khoản khách chi tiết (Phòng đã lưu/Giao dịch/Lịch xem/Thông báo)
- [x] Báo cáo: thêm Pipeline khách + Cảnh báo (dữ liệu thật) ✅ 28/08
- [x] ✅ Modal Thêm khách: +Email/Sale phụ trách/Hạn chuyển bước/toggle Zalo (D1 +3 cột). Deploy+test OK (28/08).
- [x] ✅ Modal Thêm tòa nhà: +Số tầng/Link Maps/Tiện ích chips. Deploy+test OK (28/08).

> **GIAI ĐOẠN 2 (modal-hoá) HOÀN TẤT** ✅ — trừ "Chốt deal → modal" (gộp vào cụm Deal ở Giai đoạn 3 vì cần dựng Danh sách Deal trước).
- [ ] Mobile Responsive (v2 có sẵn 12 màn)

---

## MÀN MỚI (v2 có, web CHƯA có) — cân nhắc dựng thêm
- [ ] Nội bộ — **Dashboard (Sale view)**: KPI cá nhân + bảng xếp hạng team + lịch hẹn/HH chờ release.
- [ ] Nội bộ — **Chi tiết khách hàng** (trang đầy đủ, thay cho modal).
- [ ] Public — **So sánh phòng** (trang riêng, thay cho modal).
- [ ] Nội bộ vai trò **Sale** riêng: Kho phòng (Sale) · Deal của tôi · Khách hàng của tôi.
- [ ] Public — tài khoản khách chi tiết: Phòng đã lưu · Giao dịch của tôi · Lịch xem phòng · Thông báo · Đổi mật khẩu.
- [ ] Nội bộ — **Release hoa hồng** (modal) · **Trung tâm thông báo**.
- [ ] **Mobile Responsive** — 12 màn key (375px) đã thiết kế sẵn trong v2.
