// API Cài đặt — Cloudflare Pages Functions + D1
// GET → { <khoa>: <gia_tri>, ... } (đối tượng phẳng)
// PUT/POST { <khoa>: <gia_tri>, ... } → UPSERT từng khoá
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT khoa, gia_tri FROM cau_hinh').all();
    const out = {};
    for (const r of results) { out[r.khoa] = r.gia_tri; }
    return json(out);
  } catch (e) {
    // Bảng chưa có / lỗi SELECT → trả {} để trang vẫn render được
    return json({});
  }
}

async function upsertAll({ request, env }) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Body phải là object phẳng { khoa: gia_tri }' }, 400);
    }
    const now = new Date().toISOString();
    for (const khoa in body) {
      if (!Object.prototype.hasOwnProperty.call(body, khoa)) continue;
      const giaTri = body[khoa] == null ? '' : String(body[khoa]);
      try {
        await env.DB.prepare(
          'INSERT INTO cau_hinh (khoa,gia_tri,updated_at) VALUES (?,?,?) ' +
          'ON CONFLICT(khoa) DO UPDATE SET gia_tri=excluded.gia_tri, updated_at=excluded.updated_at'
        ).bind(khoa, giaTri, now).run();
      } catch (conflictErr) {
        // Fallback nếu khoa không có UNIQUE constraint: UPDATE trước, INSERT nếu 0 dòng đổi
        const upd = await env.DB.prepare('UPDATE cau_hinh SET gia_tri=?, updated_at=? WHERE khoa=?')
          .bind(giaTri, now, khoa).run();
        const changed = upd && upd.meta ? upd.meta.changes : 0;
        if (!changed) {
          await env.DB.prepare('INSERT INTO cau_hinh (khoa,gia_tri,updated_at) VALUES (?,?,?)')
            .bind(khoa, giaTri, now).run();
        }
      }
    }
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPut(ctx) { return upsertAll(ctx); }
export async function onRequestPost(ctx) { return upsertAll(ctx); }
