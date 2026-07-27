// API Nhân viên — Cloudflare Pages Functions + D1
// GET → danh sách · POST → thêm NV · PATCH → đổi trạng thái (Active / Đã nghỉ)
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM nhan_vien ORDER BY id ASC').all();
    return json(results);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.name) return json({ error: 'Thiếu tên nhân viên' }, 400);
    const r = await env.DB.prepare(
      'INSERT INTO nhan_vien (av,name,email,role,kv,deal,hh,st) VALUES (?,?,?,?,?,?,?,?)'
    ).bind(b.av || '', b.name, b.email || '', b.role || 'Sale cấp 2', b.kv || '', 0, '—', 'Active').run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    // Cập nhật những field được gửi lên (đổi trạng thái HOẶC sửa hồ sơ)
    const cols = [], vals = [];
    ['av', 'name', 'email', 'role', 'kv', 'st'].forEach(function (k) {
      if (b[k] !== undefined) { cols.push(k + '=?'); vals.push(b[k]); }
    });
    if (!cols.length) return json({ error: 'Không có gì để cập nhật' }, 400);
    vals.push(b.id);
    await env.DB.prepare('UPDATE nhan_vien SET ' + cols.join(',') + ' WHERE id=?').bind(...vals).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM nhan_vien WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
