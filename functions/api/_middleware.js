// Middleware bảo vệ MỌI /api/* — chạy trước từng function.
// Chính sách:
//   PUBLIC (không cần đăng nhập): auth-noibo, auth-khach (login); tin-tuc GET (bài đã đăng, không ?all=1)
//   STAFF (bất kỳ nhân viên đã đăng nhập): toa-nha, khach, lich-hen, bang-tin GET, upload, deal GET/PATCH/DELETE, change-password
//   ADMIN (role_key='admin'): nhan-vien, giao-dich, cau-hinh, tin-tuc (ghi hoặc ?all=1), bang-tin ghi, deal POST (Tạo deal)
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

async function getUser(request, env) {
  const tk = cookieVal(request, 'ht_sess');
  if (!tk) return null;
  let row;
  try { row = await env.DB.prepare('SELECT * FROM phien_dang_nhap WHERE token=?').bind(tk).first(); }
  catch (_) { return null; }
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

  // 1) PUBLIC — login + đổi mật khẩu (auth tự kiểm), và tin tức đã đăng
  if (ep === 'auth-noibo' || ep === 'auth-khach') return next();
  if (ep === 'tin-tuc' && method === 'GET' && !isAll) return next();

  // 2) Cần phiên đăng nhập hợp lệ
  const user = await getUser(request, env);
  if (!user) return json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập.' }, 401);
  if (data) data.user = user;

  // 3) Endpoint chỉ dành cho Admin
  const isAdmin = (user.role_key === 'admin');
  const adminNeeded =
    (ep === 'nhan-vien') ||
    (ep === 'giao-dich') ||
    (ep === 'cau-hinh') ||
    (ep === 'tin-tuc' && (method !== 'GET' || isAll)) ||
    (ep === 'bang-tin' && method !== 'GET') ||
    (ep === 'deal' && method === 'POST');
  if (adminNeeded && !isAdmin) return json({ error: 'Chỉ Admin có quyền thực hiện thao tác này.' }, 403);

  return next();
}
