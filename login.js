/* Popup đăng nhập dùng chung.
   Cách dùng: thêm <script src="login.js"></script> vào trang, và cho nút mở popup id="openLogin"
   (hoặc thuộc tính data-open-login). Bấm nút ở bất kỳ trang nào cũng mở popup. */
(function () {
  const css = `
  .modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(15,23,42,.55);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:20px;font-family:inherit}
  .modal-overlay.open{display:flex;animation:ovIn .18s ease}
  @keyframes ovIn{from{opacity:0}to{opacity:1}}
  .modal{position:relative;background:#fff;border-radius:18px;width:100%;max-width:430px;padding:40px 34px 34px;box-shadow:0 30px 70px rgba(0,0,0,.3);animation:mdIn .2s ease}
  @keyframes mdIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
  .modal-close{position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:50%;border:1px solid #e4e8f0;background:#fff;color:#6b7488;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s}
  .modal-close svg{width:18px;height:18px}
  .modal-close:hover{background:#f3f5f9;color:#1f2a44}
  .modal-logo{display:flex;justify-content:center;margin-bottom:16px}
  .modal-logo svg{width:56px;height:56px}
  .modal-title{text-align:center;font-size:20px;font-weight:700;color:#1f2a44;margin-bottom:26px}
  .modal-field{position:relative;margin-bottom:16px}
  .modal-field input{width:100%;height:52px;border:1px solid #e4e8f0;border-radius:10px;padding:0 46px 0 16px;font-family:inherit;font-size:15px;color:#1f2a44;outline:none;transition:border-color .15s}
  .modal-field input:focus{border-color:#1f5fd6}
  .pw-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#6b7488;cursor:pointer;padding:6px;display:flex}
  .pw-toggle svg{width:20px;height:20px}
  .pw-toggle:hover{color:#1f2a44}
  .modal-submit{width:100%;height:52px;margin-top:8px;background:#ff6a00;color:#fff;border:none;border-radius:10px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:.15s}
  .modal-submit:hover{background:#e85f00}
  .modal-hint{margin-top:14px;text-align:center;font-size:12.5px;color:#6b7488;line-height:1.5}
  .modal-hint b{color:#1f5fd6}
  `;

  const html = `
  <div class="modal-overlay" id="loginModal" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
      <button class="modal-close" id="closeLogin" aria-label="Đóng">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <div class="modal-logo">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M24 7 7 21v20h12V31h10v10h12V21L24 7Z" fill="#2b7fff"/>
          <path d="M24 7 7 21v20h12V31h10v10h12V21L24 7Z" stroke="#164bad" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="modal-title" id="loginTitle">Chào Mừng Bạn Đến Với HT HOME</h2>
      <div class="modal-field">
        <input type="text" id="loginId" placeholder="Email hoặc Số điện thoại" autocomplete="username">
      </div>
      <div class="modal-field">
        <input type="password" id="loginPass" placeholder="Mật khẩu" autocomplete="current-password">
        <button class="pw-toggle" id="pwToggle" type="button" aria-label="Hiện mật khẩu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <button class="modal-submit" id="loginSubmit">Đăng nhập</button>
      <div class="modal-hint">Demo — đăng nhập bằng: <b>admin</b> · <b>sale2</b> · <b>sale1</b> (mật khẩu bất kỳ)</div>
    </div>
  </div>`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', html);

  const modal = document.getElementById('loginModal');
  const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

  // Nút mở: id="openLogin" hoặc [data-open-login]
  document.querySelectorAll('#openLogin, [data-open-login]').forEach(btn => btn.addEventListener('click', open));
  document.getElementById('closeLogin').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

  const pass = document.getElementById('loginPass');
  document.getElementById('pwToggle').addEventListener('click', () => { pass.type = pass.type === 'password' ? 'text' : 'password'; });

  // ⚠ DEMO ONLY — production BẮT BUỘC xác thực + phân quyền ở backend, không tin client.
  // Map tài khoản nhập vào → danh tính + vai trò dùng chung với dashboard (MEMBERS_DATA).
  function resolveAccount(id) {
    const s = id.toLowerCase();
    if (/admin|@hthome|noibo/.test(s))        return { uid: 'm_admin', role: 'Admin',    roleKey: 'admin', name: 'Admin HT HOME' };
    if (/sale ?2|lv ?2|level ?2/.test(s))     return { uid: 'm1',      role: 'Sale Lv2', roleKey: 'sale2', name: 'Nguyễn Hữu Thắng' };
    if (/sale ?1|lv ?1|level ?1/.test(s))     return { uid: 'm2',      role: 'Sale Lv1', roleKey: 'sale1', name: 'Trần Thị Mai' };
    return null; // không khớp tài khoản nội bộ → coi là khách
  }
  function doLogin() {
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPass').value;
    if (!id) { alert('Vui lòng nhập Email hoặc Số điện thoại.'); return; }
    if (!pw) { alert('Vui lòng nhập mật khẩu.'); return; }
    const acc = resolveAccount(id);
    if (acc) {
      // Lưu phiên (dashboard đọc lại uid/role) rồi vào thẳng khu quản lý với đúng vai trò.
      try { sessionStorage.setItem('ht_session', JSON.stringify({ uid: acc.uid, role: acc.role, roleKey: acc.roleKey, name: acc.name })); } catch (e) {}
      location.href = 'dashboard.html?uid=' + encodeURIComponent(acc.uid) + '&role=' + encodeURIComponent(acc.role);
      return;
    }
    alert('Đăng nhập tài khoản khách (demo): ' + id + '\nĐể vào khu quản lý, dùng tên đăng nhập chứa "admin", "sale2" hoặc "sale1".');
  }
  document.getElementById('loginSubmit').addEventListener('click', doLogin);
  document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('loginId').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  // Mở tự động nếu điều hướng tới #login (vd từ trang khác)
  if (location.hash === '#login') open();
})();
