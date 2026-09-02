// API Tin tức — Cloudflare Pages Functions + D1
// GET  /api/tin-tuc                 → danh sách (mặc định chỉ published; ?all=1 lấy tất cả cho CMS)
// GET  /api/tin-tuc?slug=<slug>     → 1 bài theo slug (tăng lượt xem nếu ?view=1)
// GET  /api/tin-tuc?id=<id>         → 1 bài theo id (cho CMS sửa)
// POST /api/tin-tuc                 → tạo bài
// PATCH /api/tin-tuc                → sửa bài (theo id)
// DELETE /api/tin-tuc               → xoá bài (theo id)

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

// Bỏ dấu tiếng Việt + tạo slug
function toSlug(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
    .slice(0, 80) || 'bai-viet';
}

const CATS = ['kinhnghiem', 'thitruong', 'huongdan', 'tincongty'];

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (slug) {
      const row = await env.DB.prepare('SELECT * FROM tin_tuc WHERE slug=?').bind(slug).first();
      if (!row) return json({ error: 'Không tìm thấy bài viết' }, 404);
      if (url.searchParams.get('view') === '1') {
        await env.DB.prepare('UPDATE tin_tuc SET luot_xem=luot_xem+1 WHERE id=?').bind(row.id).run();
        row.luot_xem = (row.luot_xem || 0) + 1;
      }
      return json(row);
    }
    if (id) {
      const row = await env.DB.prepare('SELECT * FROM tin_tuc WHERE id=?').bind(id).first();
      if (!row) return json({ error: 'Không tìm thấy bài viết' }, 404);
      return json(row);
    }

    // Danh sách
    const all = url.searchParams.get('all') === '1';
    const sql = all
      ? 'SELECT * FROM tin_tuc ORDER BY ghim DESC, id DESC'
      : "SELECT * FROM tin_tuc WHERE trang_thai='published' ORDER BY ghim DESC, id DESC";
    const { results } = await env.DB.prepare(sql).all();
    return json(results);
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.tieu_de) return json({ error: 'Thiếu tiêu đề' }, 400);
    let slug = b.slug ? toSlug(b.slug) : toSlug(b.tieu_de);
    // đảm bảo slug duy nhất
    const existed = await env.DB.prepare('SELECT id FROM tin_tuc WHERE slug=?').bind(slug).first();
    if (existed) slug = slug + '-' + Date.now().toString(36).slice(-4);
    const chuyen_muc = CATS.indexOf(b.chuyen_muc) >= 0 ? b.chuyen_muc : 'kinhnghiem';
    const trang_thai = ['published', 'draft', 'hidden'].indexOf(b.trang_thai) >= 0 ? b.trang_thai : 'draft';
    const published_at = trang_thai === 'published' ? (b.published_at || new Date().toISOString().slice(0, 10)) : '';
    const r = await env.DB.prepare(
      'INSERT INTO tin_tuc (tieu_de,slug,sapo,noi_dung,chuyen_muc,tac_gia,anh_bia,trang_thai,ghim,published_at) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ).bind(b.tieu_de, slug, b.sapo || '', b.noi_dung || '', chuyen_muc, b.tac_gia || 'HT HOME', b.anh_bia || '', trang_thai, b.ghim ? 1 : 0, published_at).run();
    return json({ ok: true, id: r.meta.last_row_id, slug: slug });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    const cols = [], vals = [];
    ['tieu_de', 'sapo', 'noi_dung', 'chuyen_muc', 'tac_gia', 'anh_bia', 'trang_thai'].forEach(function (k) {
      if (b[k] !== undefined) { cols.push(k + '=?'); vals.push(b[k]); }
    });
    if (b.ghim !== undefined) { cols.push('ghim=?'); vals.push(b.ghim ? 1 : 0); }
    // Khi chuyển sang published mà chưa có ngày đăng → set ngày
    if (b.trang_thai === 'published') {
      const cur = await env.DB.prepare('SELECT published_at FROM tin_tuc WHERE id=?').bind(b.id).first();
      if (cur && !cur.published_at) { cols.push('published_at=?'); vals.push(new Date().toISOString().slice(0, 10)); }
    }
    if (!cols.length) return json({ error: 'Không có gì để cập nhật' }, 400);
    vals.push(b.id);
    await env.DB.prepare('UPDATE tin_tuc SET ' + cols.join(',') + ' WHERE id=?').bind(...vals).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM tin_tuc WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}
