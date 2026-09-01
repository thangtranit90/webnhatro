// API Tài khoản khách — đăng ký / đăng nhập bằng SĐT + mật khẩu (KHÔNG OTP)
// POST /api/auth-khach  body: { action: 'register'|'login', ho_ten?, sdt, mat_khau, email? }
// Mật khẩu được hash PBKDF2 (Web Crypto) — không lưu plaintext.

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

// ---- Hash mật khẩu bằng PBKDF2-SHA256 ----
const PBKDF2_ITER = 100000;

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
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: iter, hash: 'SHA-256' },
    key, 256
  );
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
    // so sánh hằng thời gian đơn giản
    if (got.length !== expect.length) return false;
    let diff = 0;
    for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expect.charCodeAt(i);
    return diff === 0;
  } catch (_) { return false; }
}

function normPhone(s) { return String(s || '').replace(/\s+/g, '').trim(); }

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    const action = b.action;
    const sdt = normPhone(b.sdt);
    const mat_khau = String(b.mat_khau || '');

    if (!sdt) return json({ error: 'Vui lòng nhập số điện thoại.' }, 400);
    if (!mat_khau) return json({ error: 'Vui lòng nhập mật khẩu.' }, 400);

    if (action === 'register') {
      const ho_ten = String(b.ho_ten || '').trim();
      if (!ho_ten) return json({ error: 'Vui lòng nhập họ và tên.' }, 400);
      if (mat_khau.length < 6) return json({ error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);

      const existed = await env.DB.prepare('SELECT id FROM tai_khoan_khach WHERE sdt=?').bind(sdt).first();
      if (existed) return json({ error: 'Số điện thoại này đã được đăng ký. Vui lòng đăng nhập.' }, 409);

      const hash = await hashPassword(mat_khau);
      const r = await env.DB.prepare(
        'INSERT INTO tai_khoan_khach (ho_ten,sdt,mat_khau,email) VALUES (?,?,?,?)'
      ).bind(ho_ten, sdt, hash, String(b.email || '').trim()).run();
      return json({ ok: true, user: { id: r.meta.last_row_id, name: ho_ten, phone: sdt } });
    }

    if (action === 'login') {
      const row = await env.DB.prepare('SELECT * FROM tai_khoan_khach WHERE sdt=?').bind(sdt).first();
      if (!row) return json({ error: 'Số điện thoại hoặc mật khẩu không đúng.' }, 401);
      const ok = await verifyPassword(mat_khau, row.mat_khau);
      if (!ok) return json({ error: 'Số điện thoại hoặc mật khẩu không đúng.' }, 401);
      return json({ ok: true, user: { id: row.id, name: row.ho_ten, phone: row.sdt, email: row.email || '' } });
    }

    return json({ error: 'Hành động không hợp lệ.' }, 400);
  } catch (e) { return json({ error: String(e) }, 500); }
}
