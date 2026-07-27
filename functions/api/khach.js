// API Khách hàng (CRM) — chạy trên Cloudflare Pages Functions + D1
// GET /api/khach → danh sách · POST → thêm · PATCH → đổi cột (kanban)
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM khach_hang ORDER BY id DESC').all();
    return json(results);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.ten || !b.sdt) return json({ error: 'Thiếu tên hoặc số điện thoại' }, 400);
    const r = await env.DB.prepare(
      'INSERT INTO khach_hang (ten,sdt,loai,nhiet,ngan_sach,nguon,cot) VALUES (?,?,?,?,?,?,?)'
    ).bind(b.ten, b.sdt, b.loai || '', b.nhiet || 'warm', b.ngan_sach || '', b.nguon || '', b.cot || 'moi').run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('UPDATE khach_hang SET cot=? WHERE id=?').bind(b.cot || 'moi', b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM khach_hang WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
