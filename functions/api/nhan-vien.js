// API Nhân viên — Cloudflare Pages Functions + D1
// GET → danh sách · POST → thêm NV (Admin cấp, kèm mật khẩu để đăng nhập nội bộ) · PATCH → sửa · DELETE
// KHÔNG bao giờ trả cột mat_khau ra client.
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

// ---- Hash mật khẩu PBKDF2 (giống auth-noibo/auth-khach) ----
const PBKDF2_ITER = 100000;
function bufToB64(buf) { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); }
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-256' }, key, 256);
  return 'pbkdf2$' + PBKDF2_ITER + '$' + bufToB64(salt.buffer) + '$' + bufToB64(bits);
}

// Bỏ cột nhạy cảm trước khi trả ra client
function stripSecret(row) { const { mat_khau, ...rest } = row; return rest; }

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM nhan_vien ORDER BY id ASC').all();
    return json(results.map(stripSecret));
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    if (!b.name) return json({ error: 'Thiếu tên nhân viên' }, 400);
    const roleKey = b.role_key === 'admin' ? 'admin' : 'sale';
    const role = b.role || (roleKey === 'admin' ? 'Admin' : 'Sale');
    let hash = '';
    if (b.mat_khau) {
      if (String(b.mat_khau).length < 6) return json({ error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);
      if (String(b.mat_khau).length > 128) return json({ error: 'Mật khẩu quá dài (tối đa 128 ký tự).' }, 400);
      hash = await hashPassword(String(b.mat_khau));
    }
    const r = await env.DB.prepare(
      'INSERT INTO nhan_vien (av,name,email,role,role_key,mat_khau,kv,deal,hh,st) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ).bind(b.av || '', b.name, b.email || '', role, roleKey, hash, b.kv || '', 0, '—', 'Active').run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestPatch({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    // Cập nhật những field được gửi lên (đổi trạng thái HOẶC sửa hồ sơ HOẶC đổi vai trò)
    const cols = [], vals = [];
    ['av', 'name', 'email', 'role', 'kv', 'st', 'role_key'].forEach(function (k) {
      if (b[k] !== undefined) { cols.push(k + '=?'); vals.push(b[k]); }
    });
    // Admin đặt lại mật khẩu cho nhân viên
    if (b.mat_khau) {
      if (String(b.mat_khau).length < 6) return json({ error: 'Mật khẩu tối thiểu 6 ký tự.' }, 400);
      cols.push('mat_khau=?'); vals.push(await hashPassword(String(b.mat_khau)));
    }
    if (!cols.length) return json({ error: 'Không có gì để cập nhật' }, 400);
    vals.push(b.id);
    await env.DB.prepare('UPDATE nhan_vien SET ' + cols.join(',') + ' WHERE id=?').bind(...vals).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}

export async function onRequestDelete({ request, env }) {
  try {
    const b = await request.json();
    if (!b.id) return json({ error: 'Thiếu id' }, 400);
    await env.DB.prepare('DELETE FROM nhan_vien WHERE id=?').bind(b.id).run();
    return json({ ok: true });
  } catch (e) { return json({ error: 'Có lỗi xảy ra.' }, 500); }
}
