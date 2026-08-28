# Record cập nhật cho ĐỒ ÁN (Word) — theo thiết kế v2

> Ghi lại các thay đổi Giai đoạn 1–2 (áp thiết kế v2 vào web) để cập nhật báo cáo/đề cương sau.
> **Giữ thương hiệu HT HOME** (không đổi Troxin). Ngày làm: 27–28/08/2026.

---

## GIAI ĐOẠN 1 — Trang chủ theo thiết kế v2 ✅ (đã deploy)

**Đã đổi ở `index.html`:**
1. **Thay dải số liệu → THANH CAM KẾT.**
   - Cũ: 500+ tòa nhà · 1.200+ phòng · 8.500+ khách · 4.8/5 điểm.
   - Mới (theo v2): **0đ** phí môi giới cho khách · **Ảnh & video thật** (đúng phòng khi đến xem) · **≤24h** phản hồi mọi liên hệ · **Hoàn cọc** nếu phòng sai mô tả.
   - Mỗi mục có icon tròn nền vàng.
2. **Bỏ section "Khách hàng nói gì" (đánh giá khách)** — theo v2 không có.
3. Nav "Liên hệ" trỏ xuống cột Liên hệ ở footer.

**→ Ý nghĩa cho báo cáo:** trang chủ nhấn mạnh **cam kết dịch vụ** thay vì con số marketing → tăng độ tin cậy, minh bạch (phù hợp mục tiêu "minh bạch, uy tín" của đề tài).

---

## GIAI ĐOẠN 2 — Modal-hoá form nhập liệu + bổ sung field ✅ (đã deploy)

Triết lý thiết kế v2: **dùng modal (popup) thay cho mở nguyên trang** cho các thao tác nhập nhanh → mượt hơn, không rời ngữ cảnh; đồng thời **lược bỏ field rườm rà** ở form đơn giản và **bổ sung field** ở form cần chi tiết.

### 1. "Thêm phòng": trang → MODAL
- Cũ: bấm "Thêm phòng" mở **nguyên 1 trang** `themphong.html` (wizard 5 mục + sidebar tóm tắt).
- Mới: mở **modal gọn** (component dùng chung `HT.roomModal`, dùng ở cả Kho phòng và Chi tiết toà nhà).
- **Bỏ field rườm rà** (kế thừa tự động từ toà nhà): Tiền cọc, Kỳ hạn tối thiểu, Ngày trống dự kiến, 4 loại chi phí phụ thu.
- Field giữ lại: Toà nhà, Mã phòng, Tầng, Loại phòng, Nội thất, Thiết kế (chips), Diện tích, Giá thuê, Ảnh (upload R2).

### 2. "Thêm khách" (CRM): bổ sung field theo v2
- Thêm: **Email**, **Sale phụ trách**, **Hạn chuyển bước** (deadline), **toggle "Gửi form đăng ký qua Zalo"**.
- Kỹ thuật: thêm 3 cột `email`, `sale`, `deadline` vào bảng D1 `khach_hang`.

### 3. "Thêm tòa nhà": bổ sung field theo v2
- Thêm: **Số tầng**, **Link Google Maps**, **Tiện ích** (chọn nhiều bằng chips: Thang máy/Camera/Bảo vệ/Wifi/Chỗ để xe/Hồ bơi/Gym/Máy giặt).

**→ Ý nghĩa cho báo cáo:** hệ thống UI dùng **component modal tái sử dụng** (design system), giảm số trang, chuẩn hoá luồng nhập liệu → thể hiện kỹ thuật "hệ thống thành phần dùng chung" đã nêu trong đề cương.

---

## GHI CHÚ KỸ THUẬT (nếu cần cho phần Phương pháp/Kết quả)
- File component modal mới: `assets/js/ht-room-modal.js` (HT.roomModal).
- CSS modal: bổ sung `.rm-chip / .rm-drop / .rm-grid` trong `components.css`.
- D1 mở rộng cột: `khach_hang` + `email, sale, deadline`.
- Cache-busting: bump `ht-ui.js?v=5`, `components.css?v=5`, service worker `CACHE=hthome-v5`.
- Tất cả đã kiểm thử tự động bằng Playwright (mở modal → lưu D1 → verify) và deploy qua CI/CD.

---

## CHƯA LÀM (Giai đoạn 3 — nếu mở rộng báo cáo, để phần "hướng phát triển"):
- Danh sách Deal + Chốt deal (modal) + Release hoa hồng (modal).
- CRM: panel chi tiết + timeline cạnh kanban; trang Chi tiết khách hàng.
- Dashboard Sale + khu vực Sale riêng (Kho phòng/Deal/Khách của tôi).
- So sánh phòng (trang riêng); tài khoản khách chi tiết (Phòng đã lưu/Giao dịch/Thông báo).
- Báo cáo: thêm widget Hiệu suất khu vực / Deal pipeline / Cảnh báo.
- Mobile Responsive (v2 đã thiết kế sẵn 12 màn 375px).
