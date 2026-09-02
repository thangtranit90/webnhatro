// API Tài khoản khách — đăng ký / đăng nhập / đổi mật khẩu bằng SĐT + mật khẩu (KHÔNG OTP)
// POST /api/auth-khach  body:
//   { action:'register', ho_ten, sdt, mat_khau, email? }
//   { action:'login',    sdt, mat_khau }
//   { action:'change-password', sdt, mat_khau, mat_khau_moi }
// Mật khẩu được hash PBKDF2 (Web Crypto) — không lưu plaintext.

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

// ---- Hash mật khẩu bằng PBKDF2-SHA256 ----
const PBKDF2_ITER = 100000;
const MAX_PW_LEN = 128;
// Hash giả cố định (mật khẩu ngẫu nhiên) — chạy verify với nó khi không tìm thấy user
// để thời gian phản hồi login giống nhau, tránh dò SĐT qua timing.
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

// Chuẩn hoá SĐT: bỏ khoảng trắng, gạch, chấm, ngoặc → chỉ còn chữ số/ký tự chính
function normPhone(s) { return String(s || '').replace(/[\s\-().]/g, '').trim(); }

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); }
  catch (_) { return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400); }

  try {
    const action = b.action;
    const sdt = normPhone(b.sdt);
    const mat_khau = String(b.mat_khau || '');

    if (!sdt) return json({ error: 'Vui lòng nhập số điện thoại.' }, 400);
    if (!mat_khau) return json({ error: 'Vui lòng nhập mật khẩu.' }, 400);
    if (mat_khau.length > MAX_PW_LEN) return json({ error: 'Mật khẩu quá dài (tối đa ' + MAX_PW_LEN + ' ký tự).' }, 400);

    // ---------- ĐĂNG KÝ ----------
    if (action === 'register') {
      const ho_ten = String(b.ho_ten || '').trim();
      if (!ho_ten) return json({ error: 'Vui lòng nhập họ và tên.' }, 400);
      if (mat_khau.length < 6) return json({ error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);

      const hash = await hashPassword(mat_khau);
      try {
        const r = await env.DB.prepare(
          'INSERT INTO tai_khoan_khach (ho_ten,sdt,mat_khau,email) VALUES (?,?,?,?)'
        ).bind(ho_ten, sdt, hash, String(b.email || '').trim()).run();
        return json({ ok: true, user: { id: r.meta.last_row_id, name: ho_ten, phone: sdt } });
      } catch (e) {
        // UNIQUE constraint (trùng SĐT) — kể cả khi 2 request chạy song song
        if (String(e && e.message).includes('UNIQUE')) {
          return json({ error: 'Số điện thoại này đã được đăng ký. Vui lòng đăng nhập.' }, 409);
        }
        throw e;
      }
    }

    // ---------- ĐĂNG NHẬP ----------
    if (action === 'login') {
      const row = await env.DB.prepare('SELECT * FROM tai_khoan_khach WHERE sdt=?').bind(sdt).first();
      // Luôn chạy verify (kể cả khi không có user) để thời gian phản hồi đồng đều
      const ok = await verifyPassword(mat_khau, row ? row.mat_khau : DUMMY_HASH);
      if (!row || !ok) return json({ error: 'Số điện thoại hoặc mật khẩu không đúng.' }, 401);
      return json({ ok: true, user: { id: row.id, name: row.ho_ten, phone: row.sdt, email: row.email || '' } });
    }

    // ---------- ĐỔI MẬT KHẨU ----------
    if (action === 'change-password') {
      const mat_khau_moi = String(b.mat_khau_moi || '');
      if (mat_khau_moi.length < 6) return json({ error: 'Mật khẩu mới tối thiểu 6 ký tự.' }, 400);
      if (mat_khau_moi.length > MAX_PW_LEN) return json({ error: 'Mật khẩu mới quá dài (tối đa ' + MAX_PW_LEN + ' ký tự).' }, 400);

      const row = await env.DB.prepare('SELECT * FROM tai_khoan_khach WHERE sdt=?').bind(sdt).first();
      const ok = await verifyPassword(mat_khau, row ? row.mat_khau : DUMMY_HASH);
      if (!row || !ok) return json({ error: 'Mật khẩu hiện tại không đúng.' }, 401);

      const newHash = await hashPassword(mat_khau_moi);
      await env.DB.prepare('UPDATE tai_khoan_khach SET mat_khau=? WHERE id=?').bind(newHash, row.id).run();
      return json({ ok: true });
    }

    return json({ error: 'Hành động không hợp lệ.' }, 400);
  } catch (e) {
    // Không lộ chi tiết lỗi nội bộ (tên bảng/cột) ra client
    console.error('auth-khach error:', e && e.message);
    return json({ error: 'Có lỗi xảy ra, vui lòng thử lại.' }, 500);
  }
}
