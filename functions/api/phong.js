// API Phòng CÔNG KHAI (cho trang khách) — Cloudflare Pages Functions + D1
// GET /api/phong → danh sách phòng PHẲNG (shape giống window.ROOMS trong data.js)
// CHỈ trả field an toàn cho khách: KHÔNG SĐT chủ nhà, KHÔNG địa chỉ đầy đủ (số nhà),
// KHÔNG tên sale, KHÔNG hoa hồng. Khách liên hệ qua TỔNG ĐÀI, không lộ số cá nhân.
// (Public — nằm trong allowlist của functions/api/_middleware.js)

const HOTLINE = '0949397595'; // số tổng đài — thay cho SĐT chủ nhà

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // cho phép CDN cache ngắn để nhẹ D1; đổi phòng → tối đa 60s là thấy
      'cache-control': 'public, max-age=60'
    }
  });
}

const LOAI_TO_CAT = { 'Căn hộ DV': 'Căn hộ dịch vụ' };
const LOAI_TO_TY = {
  'Phòng trọ': 'Nhà trọ, phòng trọ', 'Căn hộ DV': 'Căn hộ',
  'Ký túc xá': 'Ký túc xá', 'Chung cư': 'Chung cư', 'Nhà nguyên căn': 'Nhà nguyên căn'
};
// Chuẩn hoá giá về "X,Y triệu" — xử lý cả 2 dạng: "3,6TR" (seed) và "3600000" (form nội bộ)
function priceTrieu(p) {
  var s = String(p || '').trim();
  var digits = s.replace(/\D/g, '');
  if (/tr/i.test(s) || !digits) return s.replace(/\s*TR\s*$/i, ' triệu'); // đã dạng "3,6TR"
  if (digits.length >= 6) {                                              // số đồng thuần (>= 100.000)
    return String(parseInt(digits, 10) / 1e6).replace('.', ',') + ' triệu';
  }
  return s;
}
function videoUrl(v) {
  if (!v) return '';
  if (/^https?:/i.test(v)) return v;
  return 'https://www.tiktok.com/@ht.home/video/' + v;
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT bid,grp,data FROM toa_nha ORDER BY id ASC').all();
    const buildings = [];
    for (const row of results) {
      let obj = null;
      try { obj = JSON.parse(row.data); } catch (_) { obj = null; }
      if (obj) buildings.push(obj);
    }

    const rooms = [];
    buildings.forEach(function (b) {
      (b.rooms || []).forEach(function (r) {
        const cat = LOAI_TO_CAT[r.loai] || r.loai;
        rooms.push({
          rid: r.rid,
          t: r.loai + ' — ' + (b.addr || ''),
          imgs: b.imgs || [],
          p: priceTrieu(r.price),
          ty: LOAI_TO_TY[r.loai] || r.loai,
          a: r.m2 ? (r.m2 + 'm²') : '',
          // Địa chỉ AN TOÀN: tên đường + quận (KHÔNG số nhà / addrFull)
          l: (b.addr || '') + (b.quan ? ', ' + b.quan : ''),
          r: b.tiktokUrl ? 1 : 0,
          b: [/^(u_|b_new_)/.test(b.bid) ? 'new' : 'hot'],
          video: videoUrl(b.tiktokUrl),
          // Liên hệ = tổng đài, KHÔNG lộ SĐT chủ nhà / zalo nhóm cá nhân
          phone: HOTLINE,
          zalo: 'https://zalo.me/' + HOTLINE,
          cat: cat,
          tags: (r.tags || []).concat(r.noithat || []).concat(b.tienich || []),
          quan: b.quan || ''
        });
      });
    });

    return json(rooms);
  } catch (e) {
    // Lỗi → trả rỗng để trang khách tự fallback về data.js tĩnh
    return json([], 200);
  }
}
