// API Deal & Hợp đồng — Cloudflare Pages Functions + D1
// GET → danh sách · POST → tạo deal · PATCH → đổi trạng thái · DELETE
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM deal ORDER BY id DESC').all();
    return json(results);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.khach) return json({ error: 'Thiếu tên khách' }, 400);
    const r = await env.DB.prepare(
      'INSERT INTO deal (khach,phong,toanha,sale,gia_tri,hh,trang_thai,ngay) VALUES (?,?,?,?,?,?,?,?)'
    ).bind(
      b.khach, b.phong || '', b.toanha || '', b.sale || '',
      Math.abs(parseInt(b.gia_tri, 10) || 0), Math.abs(parseInt(b.hh, 10) || 0),
      b.trang_thai || 'coc', b.ngay || ''
    ).run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('UPDATE deal SET trang_thai=? WHERE id=?').bind(b.trang_thai || 'coc', b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM deal WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
