// API Deal & Hợp đồng — Cloudflare Pages Functions + D1 (v3.6: hoa hồng 40/60, 6 trạng thái, release lock)
// GET → danh sách · POST → tạo deal · PATCH → sửa/đổi trạng thái/release · DELETE
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

var STATUSES = ['checkin', 'coc_du', 'doi_coc_bu', 'da_nhan_hh', 'bo_coc', 'doi_nhan_hh'];

// Gốc công ty = giá thuê 1 tháng × %HH chủ nhà − Offer (không âm)
function tinhGoc(gia_tri, hh_pct, offer) {
  var v = Math.round((Number(gia_tri) || 0) * (Number(hh_pct) || 0) / 100) - (Number(offer) || 0);
  return v > 0 ? v : 0;
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM deal ORDER BY id DESC').all();
    return json(results);
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.khach) return json({ error: 'Thiếu tên khách' }, 400);
    const gia_tri = Math.abs(parseInt(b.gia_tri, 10) || 0);
    const hh_pct = Math.max(0, Number(b.hh_pct) || 0);
    const offer = Math.abs(parseInt(b.offer, 10) || 0);
    const hh = tinhGoc(gia_tri, hh_pct, offer);
    const trang_thai = STATUSES.indexOf(b.trang_thai) >= 0 ? b.trang_thai : 'checkin';
    const r = await env.DB.prepare(
      'INSERT INTO deal (khach,phong,toanha,sale,gia_tri,hh,hh_pct,offer,so_thang,tim_khach,dan_khach,trang_thai,released,anh_hd,ngay) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    ).bind(
      b.khach, b.phong || '', b.toanha || '', b.sale || '',
      gia_tri, hh, hh_pct, offer, Math.abs(parseInt(b.so_thang, 10) || 0),
      b.tim_khach || b.sale || '', b.dan_khach || b.sale || '',
      trang_thai, 0, b.anh_hd || '', b.ngay || ''
    ).run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    const cur = await env.DB.prepare('SELECT * FROM deal WHERE id=?').bind(b.id).first();
    if (!cur) return json({ error: 'Không tìm thấy deal' }, 404);

    // Hành động release: khoá các trường tài chính về sau
    if (b.action === 'release') {
      if (cur.released) return json({ error: 'Deal đã release trước đó' }, 409);
      await env.DB.prepare('UPDATE deal SET released=1, trang_thai=? WHERE id=?').bind('da_nhan_hh', b.id).run();
      return json({ ok: true });
    }
    if (b.action === 'unrelease') {
      await env.DB.prepare('UPDATE deal SET released=0 WHERE id=?').bind(b.id).run();
      return json({ ok: true });
    }

    // Chỉ đổi trạng thái (menu nhanh)
    if (b.trang_thai !== undefined && Object.keys(b).length <= 3) {
      if (STATUSES.indexOf(b.trang_thai) < 0) return json({ error: 'Trạng thái không hợp lệ' }, 400);
      await env.DB.prepare('UPDATE deal SET trang_thai=? WHERE id=?').bind(b.trang_thai, b.id).run();
      return json({ ok: true });
    }

    // Sửa deal đầy đủ
    const cols = [], vals = [];
    ['khach', 'phong', 'toanha', 'sale', 'tim_khach', 'dan_khach', 'anh_hd', 'ngay'].forEach(function (k) {
      if (b[k] !== undefined) { cols.push(k + '=?'); vals.push(b[k]); }
    });
    if (b.trang_thai !== undefined) {
      if (STATUSES.indexOf(b.trang_thai) < 0) return json({ error: 'Trạng thái không hợp lệ' }, 400);
      cols.push('trang_thai=?'); vals.push(b.trang_thai);
    }
    if (b.so_thang !== undefined) { cols.push('so_thang=?'); vals.push(Math.abs(parseInt(b.so_thang, 10) || 0)); }

    // Trường tài chính: chỉ cho sửa khi CHƯA release
    var touchesMoney = b.gia_tri !== undefined || b.hh_pct !== undefined || b.offer !== undefined;
    if (touchesMoney) {
      if (cur.released) return json({ error: 'Hoa hồng đã release — huỷ release trước khi sửa số tiền.' }, 409);
      const gia_tri = b.gia_tri !== undefined ? Math.abs(parseInt(b.gia_tri, 10) || 0) : cur.gia_tri;
      const hh_pct = b.hh_pct !== undefined ? Math.max(0, Number(b.hh_pct) || 0) : cur.hh_pct;
      const offer = b.offer !== undefined ? Math.abs(parseInt(b.offer, 10) || 0) : cur.offer;
      cols.push('gia_tri=?'); vals.push(gia_tri);
      cols.push('hh_pct=?'); vals.push(hh_pct);
      cols.push('offer=?'); vals.push(offer);
      cols.push('hh=?'); vals.push(tinhGoc(gia_tri, hh_pct, offer));
    }

    if (!cols.length) return json({ error: 'Không có gì để cập nhật' }, 400);
    vals.push(b.id);
    await env.DB.prepare('UPDATE deal SET ' + cols.join(',') + ' WHERE id=?').bind(...vals).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM deal WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}
