/* Chân trang dùng chung cho mọi trang.
   Cách dùng: đặt <div id="site-footer"></div> ở cuối <body> rồi <script src="footer.js"></script>.
   Sửa thông tin doanh nghiệp ở object FOOTER bên dưới. */
(function () {
  const FOOTER = {
    logo: 'ht-home-logo.png',
    intro: 'HT HOME – Dịch vụ cho thuê phòng trọ, nhà nguyên căn, căn hộ nhanh chóng và uy tín tại TP. Hồ Chí Minh.',
    hotline: '0332 661 579',
    address: '107 Trần Nguyễn Đán, P. Gia Định, TP. Hồ Chí Minh',
    email: 'info@hthome.vn',
    zalo: '0332661579',                          // số Zalo -> tạo link zalo.me
    facebook: 'https://facebook.com/hthome',     // link trang Facebook
    facebookName: 'HT HOME',
    taxCode: '0312345678',                        // Mã số doanh nghiệp
    company: 'CÔNG TY TNHH HT HOME',
  };

  const zaloDigits = FOOTER.zalo.replace(/[^\d+]/g, '');
  const telDigits = FOOTER.hotline.replace(/[^\d+]/g, '');

  const css = `
  .site-footer{background:#fff;border-top:1px solid #e4e8f0;margin-top:40px;font-family:inherit}
  .site-footer .ft-wrap{max-width:1160px;margin:0 auto;padding:40px 24px 28px;display:grid;grid-template-columns:1.2fr 1fr;gap:40px}
  .site-footer .ft-logo img{height:46px;width:auto;margin-bottom:14px}
  .site-footer .ft-intro{color:#6b7488;font-size:14px;line-height:1.6;max-width:420px}
  .site-footer .ft-tax{margin-top:14px;color:#6b7488;font-size:13px}
  .site-footer .ft-tax b{color:#1f2a44}
  .site-footer .ft-contact h4{font-size:14px;font-weight:700;color:#132a5e;text-transform:uppercase;letter-spacing:.4px;margin:0 0 16px}
  .site-footer .ft-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;color:#31394f;font-size:14px}
  .site-footer .ft-row svg{width:18px;height:18px;color:#1f5fd6;flex-shrink:0;margin-top:1px}
  .site-footer .ft-row a{color:#31394f;text-decoration:none}
  .site-footer .ft-row a:hover{color:#1f5fd6}
  .site-footer .ft-social{display:flex;gap:12px;margin-top:16px}
  .site-footer .ft-social a{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#31394f;text-decoration:none;padding:7px 12px;border:1px solid #e4e8f0;border-radius:8px}
  .site-footer .ft-social a:hover{border-color:#1f5fd6;color:#1f5fd6}
  .site-footer .ft-social svg{width:16px;height:16px}
  .site-footer .ft-copy{background:#1f5fd6;color:#fff;text-align:center;font-size:13px;padding:12px}
  @media(max-width:760px){ .site-footer .ft-wrap{grid-template-columns:1fr;gap:26px} }
  `;

  const html = `
  <footer class="site-footer">
    <div class="ft-wrap">
      <div class="ft-brand">
        <div class="ft-logo"><img src="${FOOTER.logo}" alt="HT HOME"></div>
        <p class="ft-intro">${FOOTER.intro}</p>
        <div class="ft-tax">Mã số doanh nghiệp: <b>${FOOTER.taxCode}</b><br>${FOOTER.company}</div>
      </div>
      <div class="ft-contact">
        <h4>Kết nối với chúng tôi</h4>
        <div class="ft-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>
          <span>Hotline: <a href="tel:${telDigits}">${FOOTER.hotline}</a></span>
        </div>
        <div class="ft-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>
          <span>${FOOTER.address}</span>
        </div>
        <div class="ft-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          <span><a href="mailto:${FOOTER.email}">${FOOTER.email}</a></span>
        </div>
        <div class="ft-social">
          <a href="https://zalo.me/${zaloDigits}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
            Zalo
          </a>
          <a href="${FOOTER.facebook}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
            ${FOOTER.facebookName}
          </a>
        </div>
      </div>
    </div>
    <div class="ft-copy">© 2015 - ${new Date().getFullYear()} HT HOME. Bảo lưu mọi quyền.</div>
  </footer>`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const mount = document.getElementById('site-footer');
  if (mount) mount.outerHTML = html;
  else document.body.insertAdjacentHTML('beforeend', html);
})();
