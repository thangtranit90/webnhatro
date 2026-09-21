// Middleware bảo vệ MỌI /api/* — chạy trước từng function.
// Chính sách:
//   PUBLIC (không cần đăng nhập): auth-noibo, auth-khach (login); tin-tuc GET (bài đã đăng, không ?all=1)
//   STAFF (bất kỳ nhân viên đã đăng nhập): toa-nha, khach, lich-hen, bang-tin GET + PATCH (like), upload, deal GET/PATCH/DELETE, change-password
//   ADMIN (role_key='admin'): nhan-vien, giao-dich, cau-hinh, tin-tuc (ghi hoặc ?all=1), bang-tin POST/DELETE, deal POST (Tạo deal)
// localStorage phía client CHỈ để hiển thị — quyền do server quyết qua cookie httpOnly ht_sess.

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function cookieVal(request, name) {
  const c = request.headers.get('Cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : '';
}

// Lỗi DB (D1 chập chờn) KHÁC "chưa đăng nhập": ném DB_BUSY để trả 503, không trả 401 (tránh đá người dùng ra).
const DB_BUSY = Symbol('DB_BUSY');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function lookupSession(env, tk) {
  const q = () => env.DB.prepare('SELECT * FROM phien_dang_nhap WHERE token=?').bind(tk).first();
  try { return await q(); }
  catch (_) {
    await sleep(150); // thử lại 1 lần
    try { return await q(); }
    catch (_) { throw DB_BUSY; }
  }
}

async function getUser(request, env) {
  const tk = cookieVal(request, 'ht_sess');
  if (!tk) return null;
  const row = await lookupSession(env, tk); // có thể ném DB_BUSY
  if (!row) return null;
  if (row.het_han && row.het_han < new Date().toISOString()) return null; // hết hạn
  return row;
}

export async function onRequest(context) {
  const { request, env, next, data } = context;
  const url = new URL(request.url);
  const ep = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  const method = request.method;
  const isAll = url.searchParams.get('all') === '1';

  // 1) PUBLIC — login + đổi mật khẩu (auth tự kiểm), tin tức đã đăng, và phòng công khai
  if (ep === 'auth-noibo' || ep === 'auth-khach') return next();
  if (ep === 'tin-tuc' && method === 'GET' && !isAll) return next();
  if (ep === 'phong' && method === 'GET') return next(); // /api/phong: field an toàn cho khách

  // 2) Cần phiên đăng nhập hợp lệ
  let user;
  try { user = await getUser(request, env); }
  catch (e) {
    if (e === DB_BUSY) return json({ error: 'Máy chủ đang bận, vui lòng thử lại.' }, 503);
    throw e;
  }
  if (!user) return json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập.' }, 401);
  if (data) data.user = user;

  // 3) Endpoint chỉ dành cho Admin
  const isAdmin = (user.role_key === 'admin');
  const adminNeeded =
    (ep === 'nhan-vien') ||
    (ep === 'giao-dich') ||
    (ep === 'cau-hinh') ||
    (ep === 'tin-tuc' && (method !== 'GET' || isAll)) ||
    (ep === 'bang-tin' && method !== 'GET' && method !== 'PATCH') ||
    (ep === 'deal' && method === 'POST');
  if (adminNeeded && !isAdmin) return json({ error: 'Chỉ Admin có quyền thực hiện thao tác này.' }, 403);

  return next();
}
