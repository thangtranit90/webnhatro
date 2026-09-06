# RÀ SOÁT GIAO DIỆN vs THIẾT KẾ v3.6 — bản chốt cùng team

> **CẬP NHẬT 06/09 — sau phản hồi team (đọc phần này trước):**
> - ✅ **Xác nhận nguồn đối chiếu đúng:** dùng `desktop-handoff/index.html` (export của `HT-HOME-thiet-ke.pen`) — đã grep thấy màn `Public — Xác thực SĐT khách (OTP)`. KHÔNG dùng `nhatro_v2.pen`.
> - **Correction từ team (ghi đè các mục liên quan bên dưới):**
>   1. **Giới thiệu + Về chúng tôi**: cả 2 đều có trong thiết kế, GIỮ cả hai (Giới thiệu = trang mở đầu; Về chúng tôi = giới thiệu công ty). Không phải lỗi.
>   2. **index_v2.html**: gỡ khỏi web root — *(đã gỡ khỏi repo: gitignore + git rm --cached)*.
>   3. **Cụm Tin tức/CMS** có design đầy đủ (Public Tin tức, Chi tiết bài, Nội bộ Tin tức, Soạn bài, **Modal Xem trước bài viết**) — không phải build vượt design. Modal Xem trước là gap thật cần build.
>   4. **`nhap-otp.html` CÓ design** (`Public — Xác thực SĐT (OTP) · Đặt lịch/Tra cứu`) — **chức năng cốt lõi, KHÔNG phải orphan.** Orphan thật: `chat.html`, `quynoibo.html`, `khuvuc.html`.
>   5. **`taikhoan.html` + toàn bộ tab con (Giao dịch/Thông báo/Đổi mật khẩu) PHẢI BỎ** — SPEC v3.6: khách không có tài khoản (không đăng ký/đăng nhập/mật khẩu). Thay bằng: **Phòng đã lưu** (trang riêng, localStorage, không cần tài khoản) + **Lịch hẹn của tôi** (trang riêng, vào bằng OTP).
> - **3 khác biệt cấu trúc** (theo DESIGN-INDEX): Tòa nhà = **tab trong Kho phòng** (không phải mục sidebar); Lịch hẹn = gộp trong trang **Khách hàng** (không tách riêng); Thêm phòng = **modal** (không phải trang `themphong.html`).
> - **Quyết định:** Tạo Deal chỉ Admin (chặn server) — ✅ ĐÃ LÀM. Người tìm/dẫn khách chọn từ danh sách NV (gắn `nhan_vien_id`, không gõ tay) — chờ component thiết kế.
> - ⛔ **Cần chốt cách làm OTP** (vì chủ dự án từng nói chưa có brand name SMS): OTP thật (cần dịch vụ SMS) / OTP demo giả lập (mã hiện trên màn, chạy ngay cho đồ án).

---


> Đối chiếu bản build đang chạy (`hthome.thanghost.io.vn`) với `desktop-handoff/` (CHANGELOG.md + BUGS.md + BUGS-NOIBO.md + file thiết kế `.pen`).
> Ngày rà soát: 05/09/2026. Mọi mục dưới đây đã **verify trực tiếp** trên code + dữ liệu API thật (không phỏng đoán).

**Lưu ý quan trọng:** Báo cáo của designer test ngày 05/09 nhưng dev đã deploy các đợt D-1→D-4 ngày 02/09 → designer **dính bản cache cũ**, báo "thiếu" 4 thứ thực ra **đã có** (xem mục ✅). Những cái đó KHÔNG phải lỗi.

Chú thích trạng thái:
- ✅ **Đã xong**
- 🔧 **UI thuần — làm ngay được** (không phụ thuộc quyết định nào)
- ➕ **Bổ sung — cần làm** (chưa nằm trong batch đầu)
- ⛔ **Cần chốt** (ảnh hưởng lớn / mâu thuẫn / kiến trúc)

---

## ✅ ĐÃ XONG

- [x] Xoá file rác upload lên R2 — `BUGS-NOIBO A3`
- [x] Filter Kho phòng: 5 nút giả → dropdown checkbox thật, lọc được (QA 6/6) — *(chỗ team chỉ)*
- [x] Trung tâm thông báo `thongbao.html` + chuông nối — `BUGS-NOIBO T` *(designer báo thiếu — đã kiểm chứng: đã có)*
- [x] Modal Release hoa hồng trong `deal.html` — `BUGS-NOIBO T` *(đã kiểm chứng: đã có)*
- [x] **🔴 BẢO MẬT API nội bộ (A1–A4)** — *(ĐÃ LÀM 05/09, QA 17/17)*
  - Bảng `phien_dang_nhap` (session token) + `cau_hinh`
  - Login cấp cookie **httpOnly `ht_sess`** (24h); middleware `functions/api/_middleware.js` chặn mọi `/api/*` theo vai trò
  - Trước: curl không đăng nhập đọc được hết (200) → nay **401**; ghi/upload cũng **401**; Sale gọi endpoint Admin → **403**
  - Public GET tin tức đã đăng vẫn mở
- [x] **Tạo Deal chỉ Admin** — chặn ở server (Sale POST /deal → 403) + ẩn nút với Sale

> ⚠️ **Tooltip sidebar (S3): team đúng — CHƯA chạy.** CSS `[data-tip]::after` CÓ trong `internal.css` nhưng bị `.sidebar__nav{overflow-y:auto}` cắt mất → rê chuột không hiện. **Chuyển xuống danh sách cần sửa** (dùng tooltip JS thoát vùng clip).

---

## 🔧 UI THUẦN — LÀM NGAY ĐƯỢC — không cần chốt gì

- [ ] **Tooltip sidebar thu gọn (S3)**: fix bằng tooltip JS (CSS đang bị overflow cắt) — rê chuột icon phải hiện tên
- [ ] **Sidebar icon** (S1): Báo cáo `file-text` → `chart-column`; Tin tức `megaphone` → `newspaper` *(2 cặp icon đang trùng nhau)*
- [ ] **Sidebar Sale** (S2): thêm badge (3 khách · 1 deal); nhãn "Khách/Deal của tôi" → theo thiết kế "Khách hàng" / "Deal & Hợp đồng"
- [ ] **Nút ❤ Lưu** (BUGS A2): chết ở Trang chủ + Tìm phòng → thêm handler lưu localStorage (thiết kế: không cần tài khoản)
- [ ] **Search hero Trang chủ** (BUGS A1): đang là chữ cứng "Gò Vấp" → làm form thật, submit ra `timphong.html?quan=…&gia=…&loai=…`
- [ ] **Ma trận hoa hồng** ở Cài đặt (Q2 / B1): xoá khối `tiers` 6/9/12 tháng — **đang mâu thuẫn** công thức 40/30/30 ở `deal.html` *(verify: vẫn còn)*
- [ ] **Nút Chat** ở Chi tiết phòng (Q4 / BUGS D): "Chat với sale" → thay bằng **Gọi** + **Đặt lịch xem** *(verify: vẫn còn `#btnChat`)*
- [ ] **Video TikTok khối đen** (BUGS C): ID giả → hiện khối đen ~600px giữa trang → ẩn videobox khi ID không hợp lệ
- [ ] **Nút Xuất Excel giả** (BUGS-NOIBO C): `alert demo` ở Doanh thu + Báo cáo → ẩn hoặc xuất CSV thật

---

## ➕ BỔ SUNG — CẦN LÀM (chưa nằm trong batch đầu)

### Dọn dữ liệu (nhanh, rõ ràng)
- [ ] Xoá vai trò **Manager** trong DB (Q3 / B2) — *verify: còn 1 nhân viên + 2 bài bảng tin* → đổi sang Admin/Sale
- [ ] Bỏ trường **Khu vực (kv)** của nhân viên (Q3 / B3) — *verify: còn trên 14 nhân viên + form `fKv`/`eKv`/hiển thị `e.kv`*
  > ⚠️ Phân biệt: mục sidebar **"Khu vực" (bản đồ kho phòng) GIỮ**; cái bỏ là trường khu vực **gán cho nhân viên**.

### Footer (Q5 + checklist pháp lý)
- [ ] Cột "Khám phá": bỏ **"Ưu đãi thành viên"**, thêm **"Tin tức"** + **"Bảng giá khu vực"** *(verify: còn "Ưu đãi", thiếu 2 mục)*
- [ ] Thêm **MST 0319411244** vào dòng bản quyền *(bắt buộc pháp lý)*
- [ ] Thêm **"Vận hành bởi Công ty Cổ phần Bất động sản HTHOME"** vào mô tả footer
- [ ] Sửa **link chết** cột Khám phá (`khamHref` trỏ sai) — BUGS E

### Chi tiết phòng (detail)
- [ ] Xoá **rating giả "4.9 · 42 đánh giá"** + 5 sao cho sale (BUGS D) — *không có trong thiết kế*
- [ ] Sửa **SĐT/Zalo/QR giả** (BUGS C): tel `0909111222` mâu thuẫn hotline footer `0949 397 595`; QR không phải mã thật *(một phần sẽ hết khi import dữ liệu thật)*

### Màn/Modal còn thiếu so với thiết kế (BUGS-NOIBO T + S4)
- [ ] Màn **403 Không có quyền** — hiện Sale vào nhầm trang admin bị đá về Dashboard im lặng
- [ ] **Modal Thông tin cá nhân (Sale)** + **Modal Đổi mật khẩu (Sale)** + nút ⋮ trên thẻ user (S4) — Sale chưa tự đổi được mật khẩu
- [ ] **Chi tiết khách hàng** + **Chi tiết toà nhà** (2 màn)
- [ ] **Modal Xem trước bài viết** (CMS Tin tức)
- [ ] **Trang Phòng đã lưu** (đi kèm nút ❤ localStorage)

### Tương tác chết (BUGS-NOIBO C)
- [ ] Trang **Khu vực** (`khuvuc.html`): 0 event listener — bản đồ hoàn toàn tĩnh
- [ ] **Thẻ số liệu Dashboard**: không bấm được, không dẫn đi đâu

### Cần đối chiếu (đã build nhưng chưa chắc khớp thiết kế)
- [ ] **So sánh phòng** (`sosanh.html`): đã có — cần so lại với màn thiết kế
- [ ] Data placeholder toàn site: ảnh gradient xanh, map rỗng → thay khi import dữ liệu thật (ảnh phòng đã có trong `desktop-handoff/img/`)

---

## ⛔ CẦN CHỐT TRƯỚC KHI LÀM (4 nhóm lớn)

### 1. Auth khách: OTP hay Mật khẩu? — **MÂU THUẪN cần team quyết**
- **Designer (CHANGELOG Q1):** khách KHÔNG có tài khoản → dùng **OTP SĐT**. Xoá `dangky.html`, `dangnhap-khach.html`, `quenmatkhau.html`, nút Đăng nhập/Đăng ký header, `/api/auth-khach`. Build luồng OTP (Đặt lịch + Tra cứu).
- **Nhưng chủ dự án (quyết định Đợt B):** *"tạm bỏ OTP vì chưa đăng ký brand name SMS → dùng mật khẩu"*. Dev đã build hệ mật khẩu theo lệnh này.
- **Verify:** `dangky.html`, `dangnhap-khach.html`, `quenmatkhau.html`, `phanquyen.html` đều **còn**; header còn nút Đăng nhập/Đăng ký; `detail.html` nút Đặt lịch đang **mở Zalo** (chưa có modal OTP).
- **→ Cần chốt:** giữ mật khẩu (đã chạy được) / OTP giả lập demo / OTP thật (cần dịch vụ SMS).

### 2. Bảo mật API nội bộ (BUGS-NOIBO A1–A4) — **nghiêm trọng**
- Toàn bộ `/api/*` nội bộ **không xác thực**: ai mở URL cũng đọc được SĐT khách + số liệu tài chính; ghi/xoá cũng không chặn. Phân quyền chỉ ở localStorage (mở DevTools là thành Admin).
- **Cách sửa:** đăng nhập cấp session token/cookie; mọi API kiểm token + vai trò ở server.
- **→ Cần chốt:** làm ngay (việc lớn, ~11 API + login) / tạm hoãn cho đồ án + ghi vào phần hạn chế.

### 3. Sidebar Admin 15 mục → 8 mục (BUGS-NOIBO S1 + T)
- Thiết kế Admin chỉ 8 mục: Dashboard · Kho phòng · Khách hàng · Deal · Báo cáo · —QUẢN TRỊ— Tin tức · Nhân viên · Cài đặt.
- Build đang 15 mục — designer muốn **bỏ 7 mục** khỏi sidebar: Tòa nhà, Lịch hẹn, Doanh thu, Bảng tin, Khu vực, Quỹ, Phân quyền *(các trang này đang chạy thật)*.
- Thiết kế gộp: Tòa nhà = tab trong Kho phòng; Lịch hẹn = trong "Khách hàng & Lịch hẹn"; Thêm phòng = modal (không phải trang riêng).
- **→ Cần chốt:** bỏ đúng 7 mục theo thiết kế / giữ vì đang có chức năng thật.

### 4. Phân quyền + Cài đặt lưu localStorage (BUGS-NOIBO B4/B5)
- Hiện lưu trên máy đang dùng, xoá cache là mất, máy khác không thấy → chưa phải phân quyền/cài đặt thật.
- **→ Gắn với quyết định #2 (bảo mật/server).**

---

## ĐỀ XUẤT THỨ TỰ (dev gợi ý)

1. **Đợt 1 — làm ngay** (không chờ chốt): 🔧 8 mục UI + dọn data (Manager, kv, footer). Deploy + QA từng cái.
2. **Đợt 2 — sau khi chốt #1 (OTP/mật khẩu):** xử lý dangky/booking/OTP theo hướng đã chốt.
3. **Đợt 3 — sau khi chốt #3 (sidebar):** dọn sidebar + các màn/modal còn thiếu (403, Chi tiết khách/toà, Modal Sale, Xem trước bài).
4. **Đợt 4 — nếu chốt làm #2 (bảo mật):** token server-side + phân quyền/cài đặt lưu server.

---

*File này do dev tạo để team đối chiếu & chốt. Tick vào ô khi đã quyết/đã làm.*
