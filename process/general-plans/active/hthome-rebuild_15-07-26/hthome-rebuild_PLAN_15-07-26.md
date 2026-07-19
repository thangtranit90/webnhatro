# HT HOME — Kế hoạch dựng lại web theo thiết kế `nhatro.pen`

**Cập nhật lần cuối:** 2026-07-15 (Phase 1–3 xong; tiếp theo Phase 4 auth nội bộ)
**Mục tiêu:** Dựng lại toàn bộ web HT HOME theo thiết kế `nhatro.pen` (~35 màn), giao diện bám 100% thiết kế, chạy dữ liệu thật từ `data.js`. Static no-build, mobile-first, PWA → sẵn sàng đóng gói Capacitor. Deploy Cloudflare Pages (`hthome.thanghost.io.vn`) qua CI/CD GitHub Actions.

## Quyết định đã chốt
- **Mức độ:** giống hình + chạy thật (nối `data.js`; đăng nhập/nghiệp vụ mức demo).
- **Ưu tiên:** trang khách trước → nội bộ/admin sau.
- **Công nghệ:** HTML/CSS/JS thuần, mobile-first, PWA, sau đóng gói Capacitor. KHÔNG framework build.
- **⏳ Chưa chốt — Thương hiệu:** đang dùng "HT HOME" (thiết kế gốc ghi "Troxin").

## Nền tảng dùng chung (đã có)
- `assets/css/tokens.css` · `base.css` · `components.css` — màu Navy+Gold+Inter, component chung.
- `assets/js/ht-ui.js` — tự chèn Header/Footer; `HT.roomCard()`, `HT.icon()`, `HT.esc()`; đăng ký PWA.
- `data.js` — `window.ROOMS` (đã thêm `imgs`), `window.catOf`. Thẻ phòng → `detail.html?i=<index>`.
- PWA: `manifest.json` + `sw.js` + `assets/icons/`.

## Tiến độ các phase

| Phase | Nội dung | Trạng thái |
|---|---|---|
| **1. Nền tảng** | tokens/base/components CSS, ht-ui.js, PWA, deploy assets | ✅ DONE |
| **2. Trang khách cốt lõi** | Trang chủ · Tìm phòng · Chi tiết (So sánh = modal trong Tìm phòng) | ✅ DONE + DEPLOYED |
| **3. Trang khách phụ** | Đăng ký (`dangky.html`) · Tài khoản của tôi (`taikhoan.html`) · Chat (`chat.html`) · Đặt lịch (`datlich.html`) · Về chúng tôi (`vechungtoi.html`) · Điều khoản (`dieukhoan.html`) · Chính sách (`baomat.html`) · 404 (`404.html`) | ✅ DONE |
| **4. Auth nội bộ** | Đăng nhập · Quên mật khẩu · Nhập OTP · Đặt mật khẩu mới | ⬜ TODO |
| **5. Nghiệp vụ sale** | Dashboard · Kho phòng/Giỏ hàng · CRM · Deal & Hợp đồng · Doanh thu | ⬜ TODO |
| **6. Quản lý tòa nhà** | Quản lý tòa nhà · Chi tiết tòa nhà · Lịch hẹn dẫn xem · Wizard thêm phòng | ⬜ TODO |
| **7. Admin** | Báo cáo tổng · Nhân viên · Phân quyền · Cài đặt · Quỹ nội bộ · Bảng tin · Territory Map | ⬜ TODO |
| **8. Hoàn thiện + AI (cho đồ án)** | Self-host font, ảnh/video thật; AI cốt lõi: hỏi đáp thông tin phòng + tìm kiếm thông minh (Cloudflare Functions + Claude API) | ⬜ TODO |

## Ghi chú kỹ thuật
- Node ID thiết kế Phase 3: Đăng ký `s91S10` · Tài khoản của tôi `SMJ6W` · Chat `C1HUsS` · Đặt lịch modal `rvl4x` · 404 `KfClr` · Về chúng tôi `mwPsw` · Điều khoản `M4FRol` · Chính sách `X5ZRmH`.
- Cloudflare tự chuyển `/x.html` → `/x` (308) — link nội bộ dùng `.html` vẫn chạy.
- Pencil MCP: khi mất kết nối → `/mcp` → pencil → Reconnect. Export cần file mở trong app Pencil.
- Screenshot verify: Chrome headless đôi khi treo với iframe (bản đồ/TikTok) nhưng ảnh vẫn được ghi trước khi treo; hoặc dùng Playwright extension mode.

## Việc còn treo (ngoài web)
- **Đề cương tốt nghiệp** (`DeCuong_HTHOME.docx`): chờ user cấp 5 thông tin cá nhân (họ tên+MSSV, thầy HD, số người, thời gian, tên đề tài) để chốt bản cuối.
