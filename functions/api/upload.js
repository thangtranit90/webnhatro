// API Upload ảnh → Cloudflare R2 (binding IMAGES). Trả về URL /img/<key>.
// Gửi: POST /api/upload, header content-type = image/*, body = file (raw bytes).
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX = 8 * 1024 * 1024; // 8MB / ảnh

export async function onRequestPost({ request, env }) {
  try {
    const ct = (request.headers.get('content-type') || '').split(';')[0].trim();
    const ext = ALLOWED[ct];
    if (!ext) return json({ error: 'Chỉ nhận ảnh JPG/PNG/WebP/GIF' }, 400);
    const buf = await request.arrayBuffer();
    if (!buf.byteLength) return json({ error: 'File rỗng' }, 400);
    if (buf.byteLength > MAX) return json({ error: 'Ảnh quá lớn (tối đa 8MB)' }, 400);
    const key = 'up/' + crypto.randomUUID() + '.' + ext;
    await env.IMAGES.put(key, buf, { httpMetadata: { contentType: ct } });
    return json({ ok: true, url: '/img/' + key });
  } catch (e) { return json({ error: String(e) }, 500); }
}
