/* ============================================================
   ht-ui.js — Thành phần dùng chung, tự chèn vào trang (không cần build)
   Cách dùng trong mỗi trang:
     <div id="ht-header" data-active="home"></div>   ... nội dung ...   <div id="ht-footer"></div>
     <script src="assets/js/ht-ui.js"></script>
   Cung cấp: window.HT.icon(), HT.roomCard(), tự dựng Header + Footer.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Bộ icon (lucide, vẽ nét) ---- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    bed: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 18h20"/><path d="M12 4v6"/>',
    bath: '<path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.62 3.62A2.12 2.12 0 0 0 4 5v7"/><path d="M20 12v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3"/>',
    area: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C10.5 3.8 13 5 15 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
    'graduation-cap': '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    landmark: '<path d="M10 18v-7"/><path d="M11.12 2.2a2 2 0 0 1 1.76 0l7.87 3.85c.47.23.3.95-.22.95H3.47c-.53 0-.7-.72-.22-.95z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  };
  var FILLED = { play: 1, facebook: 1, star: 1 };

  function icon(name, size, cls) {
    size = size || 16;
    var body = ICONS[name] || '';
    var style = FILLED[name]
      ? 'fill="currentColor" stroke="none"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" ' + style + ' aria-hidden="true">' + body + '</svg>';
  }

  /* ---- Chống XSS khi nhét nội dung động ---- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- Danh sách menu ---- */
  var NAV = [
    { k: 'home', label: 'Trang chủ', href: 'index.html' },
    { k: 'search', label: 'Tìm phòng', href: 'timphong.html' },
    { k: 'area', label: 'Khu vực', href: 'index.html#khu-vuc' },
    { k: 'offer', label: 'Ưu đãi', href: 'index.html#uu-dai' },
    { k: 'contact', label: 'Liên hệ', href: 'index.html#lien-he' }
  ];

  /* ---- HEADER ---- */
  function headerHTML(active) {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-k="' + n.k + '"' + (n.k === active ? ' class="is-active"' : '') + '>' + n.label + '</a>';
    }).join('');
    var mlinks = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-k="' + n.k + '"' + (n.k === active ? ' class="is-active"' : '') + '>' + n.label + '</a>';
    }).join('');
    return '' +
      '<header class="site-header">' +
        '<div class="site-header__inner container">' +
          '<div class="site-header__left">' +
            '<a class="brand" href="index.html">' +
              '<img class="brand__logo" src="ht-home-logo.png" alt="HT HOME"/>' +
              '<span class="brand__name">HT HOME</span>' +
            '</a>' +
            '<nav class="nav">' + links + '</nav>' +
          '</div>' +
          '<div class="header-actions">' +
            '<div class="lang-toggle"><button class="is-active">VN</button><button>EN</button></div>' +
            '<a class="link-login" href="dangky.html">Đăng nhập</a>' +
            '<a class="btn btn--primary btn--sm" href="dangky.html">Đăng ký</a>' +
            '<a class="btn btn--ghost btn--staff" href="dangnhap-noibo.html">' + icon('lock', 13) + 'Nội bộ</a>' +
            '<button class="btn-hamburger" aria-label="Mở menu" aria-expanded="false">' + icon('menu', 22) + '</button>' +
          '</div>' +
        '</div>' +
        '<nav class="mobile-nav">' + mlinks +
          '<div class="mobile-nav__actions">' +
            '<a class="btn btn--ghost btn--sm" href="dangky.html">Đăng nhập</a>' +
            '<a class="btn btn--primary btn--sm" href="dangky.html">Đăng ký</a>' +
          '</div>' +
        '</nav>' +
      '</header>';
  }

  /* ---- FOOTER ---- */
  function footerHTML() {
    var kham = ['Tìm phòng', 'Phòng nổi bật', 'Phòng mới đăng', 'Ưu đãi thành viên', 'Câu hỏi thường gặp'];
    var khu = ['Gò Vấp', 'Bình Thạnh', 'Thủ Đức', 'Tân Phú', 'Quận 8', 'Quận 11'];
    var khamHref = { 'Tìm phòng': 'timphong.html', 'Phòng nổi bật': 'index.html', 'Phòng mới đăng': 'index.html', 'Ưu đãi thành viên': 'dangky.html', 'Câu hỏi thường gặp': '#' };
    var link = function (t) { return '<a href="' + (khamHref[t] || '#') + '">' + t + '</a>'; };
    var row = function (ic, t) { return '<div class="footer-col__row">' + icon(ic, 14) + '<span>' + t + '</span></div>'; };
    return '' +
      '<footer class="site-footer">' +
        '<div class="site-footer__inner container">' +
          '<div class="footer-cols">' +
            '<div class="footer-brand">' +
              '<img class="footer-brand__logo" src="ht-home-logo.png" alt="HT HOME"/>' +
              '<p class="footer-brand__desc">Nền tảng tìm thuê phòng trọ, căn hộ dịch vụ &amp; ký túc xá tại TP.HCM. Minh bạch, uy tín, tận tâm.</p>' +
              '<a class="footer-social" href="#">' + icon('facebook', 15) + 'Fanpage HT HOME</a>' +
            '</div>' +
            '<div class="footer-col"><div class="footer-col__title">Khám phá</div>' + kham.map(link).join('') + '</div>' +
            '<div class="footer-col"><div class="footer-col__title">Khu vực</div>' + khu.map(link).join('') + '</div>' +
            '<div class="footer-col"><div class="footer-col__title">Liên hệ</div>' +
              row('map-pin', '262A Nam Kỳ Khởi Nghĩa, P. Xuân Hòa, TP.HCM') +
              row('phone', '0949 397 595') +
              row('mail', 'hello@hthome.vn') +
              row('clock', '8:00 – 21:00 (T2 – CN)') +
            '</div>' +
          '</div>' +
          '<div class="footer-divider"></div>' +
          '<div class="footer-bottom">' +
            '<div>© 2026 HT HOME Real Estate JSC · Toàn bộ nội dung được bảo hộ.</div>' +
            '<div class="footer-legal">' +
              '<a href="vechungtoi.html">Về chúng tôi</a><a href="dieukhoan.html">Điều khoản</a><a href="baomat.html">Chính sách bảo mật</a><a href="dieukhoan.html">Quy chế hoạt động</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---- THẺ PHÒNG ----
     Nhận 1 object đã chuẩn hoá:
     { href, img, price, type, title, addr, area, beds, baths, status, statusKey, video, fav } */
  // Ảnh thẻ: URL http → thẻ img; chuỗi màu "#aaa,#bbb" → nền gradient; rỗng → nền xám
  function mediaFill(img, alt) {
    if (!img) return '';
    if (/^(https?:|\/)/i.test(img)) return '<img src="' + esc(img) + '" alt="' + esc(alt || '') + '" loading="lazy"/>';
    if (img.charAt(0) === '#') {
      var cols = img.split(',').map(function (s) { return s.trim(); });
      var bg = cols.length > 1 ? 'linear-gradient(135deg,' + cols.join(',') + ')' : cols[0];
      return '<span class="room-card__grad" style="background:' + bg + '"></span>';
    }
    return '';
  }

  function roomCard(r) {
    r = r || {};
    var statusKey = r.statusKey || 'success';
    var media =
      '<div class="room-card__media">' +
        mediaFill(r.img, r.title) +
        '<span class="badge badge--overlay room-card__badge"><span class="badge__dot" style="background:var(--' + esc(statusKey) + ')"></span>' + esc(r.status || 'Còn trống') + '</span>' +
        '<button class="room-card__fav' + (r.fav ? ' is-active' : '') + '" aria-label="Lưu">' + icon('heart', 15) + '</button>' +
        (r.video ? '<span class="room-card__video">' + icon('play', 11) + 'Video</span>' : '') +
      '</div>';
    var specs = '<div class="room-card__specs">' +
        (r.area ? '<span class="room-card__spec">' + icon('area', 14) + esc(r.area) + '</span>' : '') +
        (r.beds ? '<span class="room-card__spec">' + icon('bed', 14) + esc(r.beds) + '</span>' : '') +
        (r.baths ? '<span class="room-card__spec">' + icon('bath', 14) + esc(r.baths) + '</span>' : '') +
      '</div>';
    var body =
      '<div class="room-card__body">' +
        '<div class="room-card__price-row">' +
          '<div class="room-card__price">' + esc(r.price || '') + '</div>' +
          (r.type ? '<span class="type-tag">' + esc(r.type) + '</span>' : '') +
        '</div>' +
        '<div class="room-card__title">' + esc(r.title || '') + '</div>' +
        '<div class="room-card__addr">' + icon('map-pin', 13) + '<span>' + esc(r.addr || '') + '</span></div>' +
        specs +
      '</div>';
    var tag = r.href ? 'a' : 'div';
    var href = r.href ? ' href="' + esc(r.href) + '"' : '';
    return '<' + tag + ' class="room-card"' + href + '>' + media + body + '</' + tag + '>';
  }

  /* ---- Gắn sự kiện cho menu mobile ---- */
  function wireHeader(root) {
    var btn = root.querySelector('.btn-hamburger');
    var menu = root.querySelector('.mobile-nav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.innerHTML = open ? icon('x', 22) : icon('menu', 22);
    });
  }

  /* ---- Tự chèn Header/Footer vào chỗ có placeholder ---- */
  function mount() {
    var h = document.getElementById('ht-header');
    if (h) { h.innerHTML = headerHTML(h.getAttribute('data-active') || ''); wireHeader(h); }
    var f = document.getElementById('ht-footer');
    if (f) { f.innerHTML = footerHTML(); }
  }

  /* ---- MODAL dùng chung ---- */
  function modal(opts) {
    opts = opts || {};
    var bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    var foot = opts.submitLabel === null ? '' :
      '<div class="modal__foot"><button class="btn btn--ghost" data-mclose>' + esc(opts.cancelLabel || 'Hủy') + '</button>' +
      '<button class="btn ' + (opts.danger ? 'btn--primary' : 'btn--primary') + '" data-msubmit style="' + (opts.danger ? 'background:var(--danger)' : '') + '">' + esc(opts.submitLabel || 'Lưu') + '</button></div>';
    bd.innerHTML = '<div class="modal' + (opts.wide ? ' modal--wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal__head"><div><div class="modal__title">' + esc(opts.title || '') + '</div>' +
      (opts.sub ? '<div class="modal__sub">' + esc(opts.sub) + '</div>' : '') + '</div>' +
      '<button class="modal__close" aria-label="Đóng">' + icon('x', 18) + '</button></div>' +
      '<div class="modal__body">' + (opts.bodyHTML || '') + '</div>' + foot + '</div>';
    document.body.appendChild(bd);
    function close() { bd.classList.remove('is-open'); setTimeout(function () { if (bd.parentNode) bd.remove(); }, 170); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    requestAnimationFrame(function () { bd.classList.add('is-open'); });
    bd.querySelector('.modal__close').addEventListener('click', close);
    bd.addEventListener('click', function (e) { if (e.target === bd) close(); });
    var c = bd.querySelector('[data-mclose]'); if (c) c.addEventListener('click', close);
    var s = bd.querySelector('[data-msubmit]');
    if (s) s.addEventListener('click', function () { var r = opts.onSubmit ? opts.onSubmit(bd, close) : true; if (r !== false) close(); });
    document.addEventListener('keydown', onKey);
    var first = bd.querySelector('input,select,textarea'); if (first) try { first.focus(); } catch (e) {}
    return { el: bd, close: close };
  }
  function confirmModal(opts) {
    opts = opts || {};
    return modal({
      title: opts.title || 'Xác nhận', sub: opts.message || '', danger: opts.danger,
      submitLabel: opts.confirmLabel || 'Xác nhận', cancelLabel: opts.cancelLabel || 'Hủy', bodyHTML: '',
      onSubmit: function () { if (opts.onConfirm) opts.onConfirm(); return true; }
    });
  }
  function toast(msg, type) {
    var w = document.getElementById('ht-toast-wrap');
    if (!w) { w = document.createElement('div'); w.id = 'ht-toast-wrap'; w.className = 'toast-wrap'; document.body.appendChild(w); }
    var t = document.createElement('div'); t.className = 'toast' + (type ? ' toast--' + type : ''); t.textContent = msg;
    w.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(function () { if (t.parentNode) t.remove(); }, 300); }, 2600);
  }

  window.HT = window.HT || {};
  window.HT.icon = icon;
  window.HT.esc = esc;
  window.HT.modal = modal;
  window.HT.confirm = confirmModal;
  window.HT.toast = toast;
  window.HT.roomCard = roomCard;
  window.HT.headerHTML = headerHTML;
  window.HT.footerHTML = footerHTML;
  window.HT.mount = mount;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* PWA: chèn manifest + theme-color và đăng ký service worker (cài như app) */
  (function pwa() {
    if (!document.querySelector('link[rel="manifest"]')) {
      var l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.json'; document.head.appendChild(l);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      var m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#000000'; document.head.appendChild(m);
    }
    // Favicon = logo HT HOME (tránh 404 /favicon.ico + hiện icon ở tab trình duyệt)
    if (!document.querySelector('link[rel="icon"]')) {
      var fav = document.createElement('link'); fav.rel = 'icon'; fav.type = 'image/png'; fav.href = 'ht-home-logo.png'; document.head.appendChild(fav);
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function (reg) {
          reg.update(); // mỗi lần vào trang: kiểm tra bản SW mới
        }).catch(function () {});
        // Nếu đang có SW cũ điều khiển và bị SW mới thay → tự tải lại 1 lần để chạy code mới
        if (navigator.serviceWorker.controller) {
          var reloaded = false;
          navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (reloaded) return;
            reloaded = true;
            window.location.reload();
          });
        }
      });
    }
  })();
})();
