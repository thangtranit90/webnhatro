// API Giao dịch quỹ — Cloudflare Pages Functions + D1
// GET /api/giao-dich → danh sách · POST → thêm phiếu thu/chi
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM giao_dich ORDER BY id DESC').all();
    return json(results);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.loai || !b.noi_dung || b.so_tien == null)
      return json({ error: 'Thiếu loại, nội dung hoặc số tiền' }, 400);
    const soTien = Math.abs(parseInt(b.so_tien, 10) || 0);
    const r = await env.DB.prepare(
      'INSERT INTO giao_dich (loai,noi_dung,so_tien,kenh,ngay) VALUES (?,?,?,?,?)'
    ).bind(b.loai, b.noi_dung, soTien, b.kenh || '', b.ngay || '').run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM giao_dich WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
