# HT HOME — Website cho thuê phòng (bản tĩnh, sẵn sàng deploy Cloudflare Pages)

Site **tĩnh, nhiều trang** cho thuê phòng trọ / CHDV / KTX / chung cư / nhà nguyên căn,
kèm khu **quản lý nội bộ (dashboard)** có phân quyền theo vai trò và luồng **thêm tin bằng AI**.

Không cần build. Mở `index.html` (qua HTTP server hoặc Cloudflare Pages) là chạy.

---

## Cấu trúc & luồng

```
Trang chủ (index.html)  ──►  Đăng nhập (login.js, popup)  ──►  Dashboard (dashboard.html)
   │  tìm kiếm/lọc + menu loại                                    │  quản lý theo vai trò
   └► Chi tiết (detail.html?i=N)                                  └► Thêm tin: chon-loai.html → them-tin.html
```

| File | Vai trò |
|---|---|
| `index.html` | Trang chủ: tìm kiếm + lọc nâng cao (tag), các khối phòng theo loại |
| `detail.html` | Chi tiết phòng: gallery + TikTok, giá, Zalo/gọi, bản đồ, phòng gần đó |
| `dashboard.html` | **Khu quản lý sau đăng nhập**: Tổng quan (số liệu thật), Giỏ hàng, Doanh thu, Hoa hồng, Lịch hẹn, Chat, Thêm phòng, Phiếu thu, Quản lý thành viên |
| `chon-loai.html` → `them-tin.html` | Luồng **thêm tin** (chọn loại → form + chat AI đọc ảnh/chữ) |
| `data.js` | **NGUỒN DỮ LIỆU CHUNG**: `HT_BUILDINGS` (danh mục toà nhà) → suy ra `ROOMS` cho trang public. Public và dashboard dùng chung một nguồn. |
| `login.js` | Popup đăng nhập (demo) → lưu phiên `sessionStorage` → vào dashboard theo vai trò |
| `footer.js` | Chân trang dùng chung |
| `ht-home-logo.png` | Logo |
| `_headers`, `_redirects` | Cấu hình Cloudflare Pages |

---

## Đăng nhập (DEMO)

Bấm **Đăng nhập** ở trang chủ, nhập một trong các tên (mật khẩu bất kỳ):

| Tài khoản | Vai trò | Thấy gì |
|---|---|---|
| `admin` | Admin | Toàn quyền: doanh thu team, quản lý thành viên, sửa/xoá |
| `sale2` | Sale Lv2 | Nghiệp vụ đầy đủ, ẩn menu Admin |
| `sale1` | Sale Lv1 | Hạn chế hơn |

Vai trò được truyền qua `?uid=&role=` + `sessionStorage`; dashboard đọc để hiển thị đúng quyền.

---

## Dữ liệu & thêm tin

- Sửa danh mục thật: chỉ cần sửa `window.HT_BUILDINGS` trong `data.js` (một chỗ → cả public lẫn dashboard cập nhật).
- "Thêm tin" (them-tin) và "Thêm phòng" (dashboard) lưu vào `localStorage` (`ht_listings`) → xuất hiện ngay ở trang chủ + giỏ hàng, còn sau khi tải lại. Reset: xoá `localStorage['ht_listings']`.

---

## ⚠️ Giới hạn (đây là bản DEMO tĩnh — cần backend cho production)

1. **Bảo mật/phân quyền là phía client** — có thể bị bỏ qua bằng DevTools. Sản phẩm thật **bắt buộc** xác thực + phân quyền ở backend (Cloudflare Access / Workers + KV/D1).
2. **Dữ liệu lưu `localStorage`** (chỉ trên 1 máy/trình duyệt) — không phải database dùng chung. Thật sự cần D1/KV + API.
3. **AI (them-tin/dashboard)** hiện gọi thẳng `api.anthropic.com` từ trình duyệt → luôn thất bại (thiếu key + CORS) và rơi về parser text nội bộ. Production phải gọi Claude **qua Cloudflare Pages Functions** (`functions/api/ai.js`) với API key để trong Secret. Xem `DEPLOY-cloudflare.md`.
4. Ảnh phòng và ID TikTok hiện là **placeholder** (gradient + ID mẫu) — thay bằng ảnh/ID thật.
5. SEO (meta description, Open Graph, JSON-LD) và một số điểm a11y trang public còn cần bổ sung.

Xem chi tiết cách deploy trong `DEPLOY-cloudflare.md`.
