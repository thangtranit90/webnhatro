# Triển khai HT HOME lên Cloudflare Pages

Đây là **site tĩnh** — không cần build, không cần Node. Chỉ upload thư mục này.

- **Build command:** để TRỐNG
- **Build output directory:** `/` (thư mục gốc chứa `index.html`)
- **Framework preset:** None

---

## Cách 1 — Kéo–thả (nhanh nhất, không cần Git)

1. Vào **Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets**.
2. Đặt tên project (vd `ht-home`).
3. Kéo–thả **toàn bộ file trong thư mục này** (hoặc file zip) vào ô upload.
4. Bấm **Deploy**. Sau ~30 giây có URL `https://ht-home.pages.dev`.

> Lưu ý: kéo–thả **nội dung** thư mục (các file `index.html`, `data.js`…), không kéo cả folder cha.

---

## Cách 2 — Git (khuyên dùng cho cập nhật lâu dài)

1. Đẩy thư mục này lên một repo GitHub/GitLab.
2. Cloudflare Pages → **Connect to Git** → chọn repo.
3. Build command: (trống) · Output directory: `/`.
4. **Save and Deploy**. Mỗi lần push là tự deploy lại.

---

## Cách 3 — Wrangler CLI

```bash
npm i -g wrangler
wrangler login
wrangler pages deploy .   --project-name ht-home
```

---

## File cấu hình đã kèm

- **`_redirects`** — 301 các URL quản lý cũ (`/admin.html`…) về `/dashboard.html`.
- **`_headers`** — header bảo mật cơ bản (nosniff, X-Frame-Options, Referrer-Policy) + cache logo.

Cloudflare Pages tự nhận 2 file này, không cần cấu hình thêm.

---

## (Quan trọng cho production) Đưa AI ra backend bằng Pages Functions

Hiện `them-tin.html`/`dashboard.html` gọi thẳng `api.anthropic.com` từ trình duyệt → luôn fail
(thiếu key + CORS) và rơi về parser text nội bộ. Để AI đọc ảnh/chữ chạy thật **mà không lộ key**:

1. Tạo file `functions/api/ai.js` trong project:

```js
export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,     // đặt trong Secret, KHÔNG hardcode
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "content-type": "application/json" }
  });
}
```

2. Cloudflare Pages → Settings → **Environment variables / Secrets** → thêm `ANTHROPIC_API_KEY`.
3. Trong `them-tin.html`/`dashboard.html`, đổi hàm `aiParse()` gọi `fetch('/api/ai', …)` thay vì
   gọi thẳng `api.anthropic.com` (đã tách riêng sẵn để dễ đổi).

---

## Ghi chú hardening (tuỳ chọn)

- Có thể thêm CSP trong `_headers`, nhưng site dùng **nhiều inline script/style** nên CSP chặt sẽ vỡ;
  cần refactor inline JS ra file trước khi bật CSP nghiêm.
- Google Fonts / Google Maps / TikTok embed tải từ CDN ngoài — hoạt động bình thường trên Pages
  (khác môi trường artifact bị chặn CSP).
- Đây vẫn là **demo phía client**: xác thực + lưu dữ liệu thật cần Cloudflare Access / Workers + D1/KV.
