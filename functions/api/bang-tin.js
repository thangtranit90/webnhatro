// API Bảng tin — Cloudflare Pages Functions + D1
// GET → danh sách (ghim lên đầu) · POST → đăng bài
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM bang_tin ORDER BY pinned DESC, id DESC').all();
    const rows = results.map(function (r) {
      return {
        id: r.id, av: r.av, author: r.author, role: r.role, time: r.time,
        pinned: !!r.pinned, tagCls: r.tag_cls, tagTxt: r.tag_txt,
        title: r.title, body: r.body, like: r.likes, cmt: r.cmt
      };
    });
    return json(rows);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.title) return json({ error: 'Thiếu tiêu đề' }, 400);
    const r = await env.DB.prepare(
      'INSERT INTO bang_tin (av,author,role,time,pinned,tag_cls,tag_txt,title,body,likes,cmt) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    ).bind(
      b.av || 'B', b.author || 'Bạn', b.role || 'Sale', b.time || 'vừa xong',
      b.pinned ? 1 : 0, b.tagCls || '', b.tagTxt || '', b.title, b.body || '', 0, 0
    ).run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM bang_tin WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
