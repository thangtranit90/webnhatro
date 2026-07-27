// API Lịch hẹn xem phòng — Cloudflare Pages Functions + D1
// GET /api/lich-hen → danh sách · POST → thêm · PATCH → đổi trạng thái
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM lich_hen ORDER BY id DESC').all();
    return json(results);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.khach) return json({ error: 'Thiếu tên khách' }, 400);
    const r = await env.DB.prepare(
      'INSERT INTO lich_hen (khach,sdt,phong,ngay,gio,trang_thai) VALUES (?,?,?,?,?,?)'
    ).bind(b.khach, b.sdt || '', b.phong || '', b.ngay || '', b.gio || '', b.trang_thai || 'cho').run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('UPDATE lich_hen SET trang_thai=? WHERE id=?').bind(b.trang_thai || 'cho', b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM lich_hen WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
