// API Toà nhà (+ phòng lồng trong JSON) — Cloudflare Pages Functions + D1
// GET → { ptro:[...], cc:[...] } giống window.HT_BUILDINGS
// POST { grp, building } → thêm toà nhà · PATCH { bid, building } → sửa toà nhà / thêm phòng
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT bid,grp,data FROM toa_nha ORDER BY id ASC').all();
    const out = { ptro: [], cc: [] };
    for (const r of results) {
      let obj = null;
      try { obj = JSON.parse(r.data); } catch (e) { obj = null; }
      if (!obj) continue;
      (out[r.grp] || out.ptro).push(obj);
    }
    return json(out);
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    const building = b.building || b;
    const grp = (b.grp === 'cc') ? 'cc' : 'ptro';
    if (!building || !building.bid) return json({ error: 'Thiếu dữ liệu toà nhà' }, 400);
    const r = await env.DB.prepare('INSERT INTO toa_nha (bid,grp,data) VALUES (?,?,?)')
      .bind(building.bid, grp, JSON.stringify(building)).run();
    return json({ ok: true, id: r.meta.last_row_id, bid: building.bid });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    const building = b.building || b;
    const bid = b.bid || (building && building.bid);
    if (!bid) return json({ error: 'Thiếu bid' }, 400);
    await env.DB.prepare('UPDATE toa_nha SET data=? WHERE bid=?')
      .bind(JSON.stringify(building), bid).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    const bid = b.bid || (b.building && b.building.bid);
    if (!bid) return json({ error: 'Thiếu bid' }, 400);
    await env.DB.prepare('DELETE FROM toa_nha WHERE bid=?').bind(bid).run();
    return json({ ok: true });
  } catch (e) { return json({ error: String(e) }, 500); }
}
