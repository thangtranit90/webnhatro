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

## GIAI ĐOẠN 3 — bổ sung màn/nghiệp vụ v2 (đang làm)

### ✅ Cụm Deal & Hợp đồng (28/08)
- Cũ: bấm "Deal" mở thẳng **form chốt deal 1 trang** (demo, không lưu). KHÔNG có danh sách.
- Mới: **Danh sách Deal** (bảng: khách/phòng/toà nhà/sale/giá trị/hoa hồng/trạng thái) + KPI (tổng deal, giá trị, hoa hồng, chờ release) + tabs lọc theo trạng thái.
- **Chốt deal mới**: modal gọn (khách/sale/toà nhà/phòng/giá trị/HH/trạng thái).
- **Release hoa hồng**: modal xác nhận → chuyển trạng thái deal sang "đã release".
- Kỹ thuật: bảng D1 `deal` + API `/api/deal` (GET/POST/PATCH/DELETE). Trạng thái: đang cọc → đã chốt → đã release / huỷ.
- **→ Ý nghĩa báo cáo:** hoàn thiện nghiệp vụ lõi "quản lý deal & hoa hồng" nêu trong đề cương — từ tư vấn → cọc → chốt → release hoa hồng.

### ✅ CRM 2-pane (28/08)
- Cũ: kanban full-width, bấm thẻ → modal. Mới: **kanban + panel chi tiết cố định bên phải** (desktop) gồm thông tin khách + **Lịch hẹn của khách** + **Lịch sử tương tác** (timeline) + nút Gọi/Zalo/Đặt lịch/Chuyển bước/Xoá. Mobile giữ modal.
- **→ Ý nghĩa báo cáo:** giao diện CRM chuẩn 2-pane, chăm sóc khách trực quan (xem chi tiết mà không rời danh sách).

### ✅ Mobile Responsive (29/08)
- Audit 13 trang chính ở 375px (iPhone SE): 11 trang vừa khít sẵn; sửa 2 trang tràn ngang — topbar nội bộ (Quản lý toà nhà) cho xuống dòng + ô tìm co lại (fix chung internal.css); biểu đồ Báo cáo co lại + grid item min-width:0. Kết quả: TẤT CẢ vừa khít, không tràn ngang.
- **→ Ý nghĩa báo cáo:** củng cố tuyên bố "responsive/mobile-first" của đề tài — web dùng tốt trên điện thoại, sẵn sàng đóng gói app (Capacitor).

### ✅ So sánh phòng — trang riêng (28/08)
- Cũ: so sánh bằng modal trong Tìm phòng. Mới: **trang riêng `sosanh.html`** — các cột phòng cạnh nhau (ảnh+giá) + bảng so sánh (giá/loại/diện tích/địa chỉ/tiện ích) + nút Xem chi tiết/Đặt lịch. Chọn phòng ở Tìm phòng → "So sánh ngay" điều hướng sang trang.

### ✅ Tài khoản khách chi tiết (29/08)
- Hoàn thiện 6 tab trang Tài khoản (trước 5 tab "đang cập nhật"): Thông tin cá nhân (form lưu localStorage), Phòng đã lưu, Lịch xem phòng, Giao dịch của tôi, Thông báo, Đổi mật khẩu (có validation).

### ✅ Báo cáo — widget dữ liệu thật (28/08)
- Thêm **Pipeline khách hàng** (phễu moi→chốt, đếm thật) + **Cảnh báo & lưu ý** (suy từ deal/khách/toà/lịch hẹn thật).

### ✅ Hệ 2 vai trò Admin/Sale — khu Sale riêng (31/08)
- Sidebar role-aware: Admin thấy đầy đủ + khu QUẢN TRỊ; Sale thấy nav rút gọn "Khách của tôi / Deal của tôi" (không có khu quản trị).
- Phân quyền chặn: Sale không vào được trang admin (Báo cáo/Quỹ/Nhân viên/Phân quyền/Cài đặt) — tự đá về Dashboard.
- Dashboard Sale: lời chào theo tên + KPI cá nhân (Hoa hồng/Deal/Khách/Lịch của tôi, dữ liệu thật).
- Deal & CRM: Sale chỉ thấy deal/khách do mình phụ trách (lọc theo tên sale).
- **→ Ý nghĩa báo cáo:** hoàn thiện "phân quyền theo vai trò" nêu trong đề cương — 2 trải nghiệm khác nhau cho Admin và Sale trên cùng hệ thống.

## HOÀN TẤT — không còn mục nào trong Giai đoạn 3.
_(Trước đây liệt kê chưa làm:)_



---

# ĐỢT A (v3.6) — Token màu + logo mới (01/09/2026)

**Mục tiêu:** Áp bộ nhận diện mới theo SPEC v3.6.

- Đổi màu chủ đạo (gold) từ `#F4B740` → **`#FFDE59`** + 51 biến token mới (nền ấm hơn, semantic, sidebar).
- Xử lý tương phản: chữ/icon vàng trên nền sáng dùng `gold-fg #5C4600` (đọc rõ); nền tối giữ vàng sáng.
- Thay logo chữ "HT HOME" bằng **3 file logo thật**: header (bản sáng), footer + sidebar nội bộ (bản tối), favicon (logo mark).
- Đã deploy + kiểm chứng Playwright trên web thật: trang chủ, dashboard nội bộ, tìm phòng — màu & logo hiển thị đúng.
- **Lưu ý:** dòng chữ nhỏ trong logo đọc là "RENIAL SERVICES" (nghi typo của "RENTAL") — cần designer xác nhận.

# ĐỢT B (v3.6) — Đăng nhập khách bằng mật khẩu, bỏ OTP (01/09/2026)

**Lý do bỏ OTP:** chưa đăng ký brand name SMS nên tạm dùng mật khẩu.

**Backend (Cloudflare D1):**
- Bảng mới `tai_khoan_khach` (họ tên, SĐT duy nhất, mật khẩu **hash PBKDF2** — không lưu plaintext, email).
- API `/api/auth-khach` (Pages Functions): action `register` / `login`, kiểm tra trùng SĐT, xác thực mật khẩu an toàn.

**Frontend:**
- `dangky.html`: bỏ 4 ô OTP → **Mật khẩu + Nhập lại mật khẩu**, đăng ký thật qua API.
- `dangnhap-khach.html` (mới): đăng nhập bằng SĐT + mật khẩu.
- `quenmatkhau.html`: bỏ luồng OTP → hiển thị **hotline/email liên hệ** để reset.
- `taikhoan.html`: chặn truy cập khi chưa đăng nhập (redirect về trang đăng nhập).
- Header nhận biết trạng thái đăng nhập: hiện tên khách khi đã đăng nhập.

**Kiểm thử (Playwright, web thật):** 11/11 pass — đăng ký, header hiện tên, đăng xuất, chặn khi chưa đăng nhập, sai mật khẩu báo lỗi, đăng nhập đúng, trùng SĐT báo lỗi.

## AUDIT Đợt B — vá lỗ hổng + hoàn thiện (02/09/2026)

Sau review độc lập (không có SQL injection/XSS), đã sửa:
- **Đăng ký trùng SĐT (race condition):** INSERT rồi bắt lỗi UNIQUE → trả 409 sạch, không lộ chi tiết lỗi DB ra client.
- **"Đổi mật khẩu" trước đây là GIẢ** (chỉ báo thành công, không đổi gì) → nay có API thật: xác minh mật khẩu cũ → hash mật khẩu mới → cập nhật D1. Đã kiểm chứng: mật khẩu cũ ngừng dùng được, mật khẩu mới đăng nhập được.
- **Chống dò SĐT qua thời gian phản hồi** (timing side-channel): luôn chạy verify với hash giả khi không tìm thấy tài khoản.
- Chuẩn hoá SĐT (bỏ gạch/chấm/ngoặc); giới hạn mật khẩu tối đa 128 ký tự; ẩn thông báo lỗi nội bộ.

**Kiểm thử lại (web thật):** 9/9 pass (4 API edge case + 4 UI đổi mật khẩu + normPhone). Không còn lỗi CAO.

## ĐỢT C (v3.6) — Gộp vai trò + đăng nhập nội bộ email/mật khẩu (02/09/2026)

**Gộp vai trò:** bỏ Sale cấp 1/cấp 2/Manager → chỉ còn **2 vai trò: Admin + Sale** (không cấp bậc, không phân khu vực). Cập nhật: bảng phân quyền (ma trận 2 cột), quản lý nhân viên (bộ lọc/nhãn/badge), bảng xếp hạng + nhật ký dashboard, thẻ doanh thu (bỏ khung "thăng cấp").

**Đăng nhập nội bộ (D1 thật):**
- Bảng `nhan_vien` thêm cột `mat_khau` (hash PBKDF2) + `role_key` (admin/sale).
- API `/api/auth-noibo`: đăng nhập bằng **email + mật khẩu** + đổi mật khẩu. Case-insensitive email, thông báo lỗi gộp chung, không lộ mật khẩu.
- Trang đăng nhập nội bộ đổi từ SĐT → **email + mật khẩu**, gọi API thật.
- **Admin cấp tài khoản:** khi thêm nhân viên ở trang Nhân viên, Admin nhập mật khẩu + vai trò → nhân viên đăng nhập được ngay.

**Sidebar theo vai trò (v3.6):**
- Sale: Dashboard · Kho phòng · Khách của tôi · Deal của tôi · Lịch hẹn · **Doanh thu của tôi** (không có khu QUẢN TRỊ).
- Admin: đầy đủ + khu QUẢN TRỊ (Báo cáo · Quỹ · Nhân viên · Phân quyền · Cài đặt).
- Sale nay xem được "Doanh thu của tôi" (trước bị chặn).

**Tài khoản demo nội bộ (mật khẩu 123456):** admin@hthome.vn (Admin) · minhtro@hthome.vn, thuha@hthome.vn (Sale).

**Kiểm thử (web thật):** API 6/6 pass · QA vai trò qua trình duyệt 12/12 pass · luồng Admin cấp tài khoản 3/3 pass. Đã dọn tài khoản test.

## ĐỢT D-1 (v3.6) — Tin tức: blog công khai + CMS nội bộ (02/09/2026)

**Backend (D1):** bảng `tin_tuc` + API `/api/tin-tuc` (danh sách/chi tiết theo slug/id, tạo/sửa/xoá, tự sinh slug bỏ dấu tiếng Việt, đếm lượt xem, 4 chuyên mục, 3 trạng thái published/draft/hidden).

**Trang công khai:**
- `tintuc.html`: hero + lọc chuyên mục + 1 bài nổi bật (ghim) + lưới bài.
- `bai-viet.html`: chi tiết (breadcrumb, ảnh bìa, sapo, nội dung, CTA, 3 bài liên quan, +1 lượt xem mỗi lượt đọc).
- Nav công khai gọn còn **4 mục**: Giới thiệu · Trang chủ · Tìm phòng · Tin tức (bỏ Khu vực/Ưu đãi/Liên hệ).

**CMS nội bộ (chỉ Admin):**
- `tintuc-noibo.html`: 4 KPI + tab (Tất cả/Đã đăng/Nháp/Đã ẩn) + bảng bài viết + xuất bản/ẩn/xoá.
- `soanbai.html`: soạn bài với toolbar định dạng (đậm/nghiêng/H2/danh sách/trích dẫn/liên kết/**chèn ảnh lên R2**), ảnh bìa, chọn chuyên mục, ghim, lưu nháp/xuất bản, hiện "Đã tự lưu lúc HH:MM".
- Sale bị chặn vào CMS (đá về dashboard).

**Kiểm thử (web thật):** API 7/7 · duyệt công khai + CMS 14/14 · soạn+xuất bản qua UI 4/4 → **25 test pass**. Đã dọn dữ liệu test.

## ĐỢT D-2 (v3.6) — Trang Giới thiệu (landing mở đầu) (02/09/2026)

Trang `gioithieu.html` — trang giới thiệu/marketing mở đầu (khác "Về chúng tôi" là trang câu chuyện công ty). Gồm: hero (khẩu hiệu + CTA), 4 chỉ số, "Vì sao chọn HT HOME" (4 thẻ), "Cách hoạt động" (4 bước), 6 loại phòng (link sang Tìm phòng có lọc sẵn), khối "Tin tức mới nhất" (kéo 3 bài từ API), CTA cuối.
- Nav "Giới thiệu" trỏ tới trang này; "Về chúng tôi" giữ ở footer.
- **Kiểm thử (web thật):** 9/9 pass (nav, đủ khối, link loại phòng/tin tức hoạt động).

## ĐỢT D-3 (v3.6) — Deal: luật hoa hồng 40/60 + 6 trạng thái + modal chi tiết/sửa (02/09/2026)

**Luật hoa hồng DUY NHẤT (theo spec):**
- Gốc công ty = Giá thuê 1 tháng × %HH chủ nhà − Offer.
- Quy về 100%, chia: **40% Công ty** · **60% Sale** (Tìm khách 30% = 1 người · Dẫn khách 30% = nhiều người chia đều).
- %HH và số tháng do người tạo deal tự nhập (không ma trận/bậc).

**6 trạng thái:** Đã checkin · Đã cọc đủ · Đợi cọc bù · Đã nhận HH · Bỏ cọc · Đợi nhận HH.

**Chức năng:**
- Bảng Deal: thêm cột **HĐ** (số ảnh / "Chưa có"), tab lọc theo 6 trạng thái, bấm dòng mở chi tiết.
- **Sale che số hoa hồng** sau 👁 (bấm phụ đề hiện/ẩn); Admin thấy trực tiếp.
- Modal **Tạo deal** + **Sửa deal**: xem trước phân chia hoa hồng 40/60 cập nhật ngay khi nhập.
- Modal **Chi tiết** (VIEW) → nút "Chỉnh sửa deal" → modal **Sửa** (EDIT).
- **Release HH** = không hoàn tác (modal xác nhận). Sau release, các trường Giá thuê/%HH/Offer bị **khoá** (cảnh báo vàng); sửa số tiền khi đã release bị chặn (409).
- Upload ảnh hợp đồng lên R2 trong modal sửa.

**Backend (D1):** bảng deal thêm hh_pct/offer/so_thang/tim_khach/dan_khach/released/anh_hd; API tính gốc server-side, khoá tài chính sau release.

**Kiểm thử (web thật):** engine hoa hồng + release lock 6/6 API · UI (bảng/modal/che số) 9/9 → **15 test pass**. Đã dọn dữ liệu test.

## ĐỢT D-4 (v3.6) — Trung tâm thông báo + Sidebar thu gọn (02/09/2026)

**Sidebar thu gọn 264 ↔ 72px:** nút chevron cạnh logo, lưu localStorage `sidebar-collapsed`. Khi thu gọn: chỉ icon + tooltip khi hover, đổi logo lockup → logo-mark. Tự thu gọn ở 1024–1279px, giữ lựa chọn ở ≥1280px, thành drawer <1024px. (Đã sửa bug: khi thu gọn vẫn giữ nút toggle để mở rộng lại.)

**Trung tâm thông báo** (`thongbao.html`): tổng hợp lịch hẹn + deal chưa có ảnh HĐ + khách hot (dữ liệu thật) + thông báo hệ thống. Lọc Tất cả/Chưa đọc/Lịch hẹn/Deal/Khách hàng/Hệ thống. Đánh dấu đã đọc từng cái hoặc tất cả (lưu localStorage, giữ sau khi tải lại). Chuông ở dashboard → mở trang này. Sale chỉ thấy thông báo của mình.

**Kiểm thử (web thật):** 12/12 pass (thu gọn/mở rộng/lưu trạng thái/tự thu gọn theo màn hình · thông báo tổng hợp/lọc/đánh dấu đã đọc/giữ trạng thái).

---

# ✅ HOÀN TẤT TOÀN BỘ SPEC v3.6 (Đợt A → D)
- **Đợt A:** token màu #FFDE59 + 3 logo thật
- **Đợt B:** đăng nhập khách bằng mật khẩu (bỏ OTP) + đổi mật khẩu thật
- **Đợt C:** gộp vai trò Admin/Sale + đăng nhập nội bộ email/mật khẩu (D1) + sidebar theo vai trò
- **Đợt D:** Tin tức (blog + CMS), Trang Giới thiệu, Deal hoa hồng 40/60 + 6 trạng thái, Trung tâm thông báo + Sidebar thu gọn

## AUDIT TỔNG THỂ v3.6 (03/09/2026)
- **Cache nhất quán:** main v13, internal.css v8, sw v16 — OK.
- **Tải trang (Playwright):** 38/38 trang sạch, 0 lỗi console (13 công khai + 16 admin + 9 sale).
- **API sweep:** 8 GET đều 200, KHÔNG lộ mật khẩu; auth endpoints chặn GET (404); JSON hỏng không lộ lỗi nội bộ.
- **QA login thật:** 16/16 — chưa đăng nhập bị chặn · Sale bị chặn khỏi 8 trang admin-only · khách đăng ký→đổi MK→đăng nhập lại OK.
- **Code review:** công thức hoa hồng server=client khớp · XSS: mọi field động qua esc(), confirm message escaped · release lock (409) đúng.
- **1 điểm lưu ý (chấp nhận cho demo):** API ghi nội bộ chỉ có guard phía client. Riêng tin-tuc render HTML thô công khai → nếu lên production cần auth token server-side hoặc sanitize nội dung.
**Kết luận: v3.6 đạt, sẵn sàng nghiệm thu demo.**
