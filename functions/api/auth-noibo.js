// API Đăng nhập nội bộ — nhân viên đăng nhập bằng EMAIL + mật khẩu (hash PBKDF2, KHÔNG OTP)
// POST /api/auth-noibo  body:
//   { action:'login', email, mat_khau }
//   { action:'change-password', email, mat_khau, mat_khau_moi }
// Tài khoản do Admin cấp (lưu ở bảng nhan_vien, cột mat_khau + role_key).

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

const PBKDF2_ITER = 100000;
const MAX_PW_LEN = 128;
const DUMMY_HASH = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$Ymd1c2FtZXRpbWluZ2R1bW15aGFzaHZhbHVlMDAwMDAwMD0=';

function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBuf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function derive(password, saltBytes, iter) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: iter, hash: 'SHA-256' }, key, 256);
  return bufToB64(bits);
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, PBKDF2_ITER);
  return 'pbkdf2$' + PBKDF2_ITER + '$' + bufToB64(salt.buffer) + '$' + hash;
}
async function verifyPassword(password, stored) {
  try {
    const parts = String(stored).split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
    const iter = parseInt(parts[1], 10);
    const salt = b64ToBuf(parts[2]);
    const expect = parts[3];
    const got = await derive(password, salt, iter);
    if (got.length !== expect.length) return false;
    let diff = 0;
    for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expect.charCodeAt(i);
    return diff === 0;
  } catch (_) { return false; }
}

function normEmail(s) { return String(s || '').trim().toLowerCase(); }

// Viết tắt tên -> initials (khi row không có sẵn av)
function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/);
  if (!parts.length) return 'NV';
  const last = parts[parts.length - 1][0] || '';
  const first = parts.length > 1 ? parts[parts.length - 2][0] : (parts[0][1] || '');
  return (first + last).toUpperCase();
}

function userPayload(row) {
  return {
    name: row.name,
    email: row.email,
    role: row.role,
    roleKey: row.role_key || 'sale',
    initials: row.av || initialsOf(row.name)
  };
}

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); }
  catch (_) { return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400); }

  try {
    const action = b.action;
    const email = normEmail(b.email);
    const mat_khau = String(b.mat_khau || '');

    if (!email) return json({ error: 'Vui lòng nhập email.' }, 400);
    if (!mat_khau) return json({ error: 'Vui lòng nhập mật khẩu.' }, 400);
    if (mat_khau.length > MAX_PW_LEN) return json({ error: 'Mật khẩu quá dài (tối đa ' + MAX_PW_LEN + ' ký tự).' }, 400);

    // ---------- ĐĂNG NHẬP ----------
    if (action === 'login') {
      const row = await env.DB.prepare('SELECT * FROM nhan_vien WHERE lower(email)=? AND st=?').bind(email, 'Active').first();
      const ok = await verifyPassword(mat_khau, (row && row.mat_khau) ? row.mat_khau : DUMMY_HASH);
      // Tài khoản chưa được cấp mật khẩu (mat_khau rỗng) cũng coi như đăng nhập sai
      if (!row || !row.mat_khau || !ok) return json({ error: 'Email hoặc mật khẩu không đúng.' }, 401);
      return json({ ok: true, user: userPayload(row) });
    }

    // ---------- ĐỔI MẬT KHẨU ----------
    if (action === 'change-password') {
      const mat_khau_moi = String(b.mat_khau_moi || '');
      if (mat_khau_moi.length < 6) return json({ error: 'Mật khẩu mới tối thiểu 6 ký tự.' }, 400);
      if (mat_khau_moi.length > MAX_PW_LEN) return json({ error: 'Mật khẩu mới quá dài (tối đa ' + MAX_PW_LEN + ' ký tự).' }, 400);

      const row = await env.DB.prepare('SELECT * FROM nhan_vien WHERE lower(email)=?').bind(email).first();
      const ok = await verifyPassword(mat_khau, (row && row.mat_khau) ? row.mat_khau : DUMMY_HASH);
      if (!row || !row.mat_khau || !ok) return json({ error: 'Mật khẩu hiện tại không đúng.' }, 401);

      const newHash = await hashPassword(mat_khau_moi);
      await env.DB.prepare('UPDATE nhan_vien SET mat_khau=? WHERE id=?').bind(newHash, row.id).run();
      return json({ ok: true });
    }

    return json({ error: 'Hành động không hợp lệ.' }, 400);
  } catch (e) {
    console.error('auth-noibo error:', e && e.message);
    return json({ error: 'Có lỗi xảy ra, vui lòng thử lại.' }, 500);
  }
}
