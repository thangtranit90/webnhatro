/* ============================================================
   ht-internal.js — Sidebar dùng chung cho khu nội bộ (Phase 5–7)
   Dùng: <div class="app">
           <div class="app-sidebar" id="ht-sidebar" data-active="dashboard"></div>
           <main class="app-main"> ...topbar + nội dung... </main>
         </div>
   Nút mở sidebar trên mobile: <button class="btn-sidebar">…</button>
   ============================================================ */
(function () {
  'use strict';

  var IC = {
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    'calendar-days': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    map: '<path d="M14.1 5.6a2 2 0 0 0 1.8 0l3.7-1.8A1 1 0 0 1 21 4.6v12.8a1 1 0 0 1-.6.9l-4.5 2.3a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.7 1.8A1 1 0 0 1 3 19.4V6.6a1 1 0 0 1 .6-.9l4.5-2.3a2 2 0 0 1 1.8 0z"/><path d="M15 5.8v15"/><path d="M9 3.2v15"/>',
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/>',
    'user-cog': '<circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C10.5 3.8 13 5 15 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'chevrons-up-down': '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };
  function ic(name, size) {
    size = size || 18;
    return '<svg class="ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[name] || '') + '</svg>';
  }

  var NAV_MAIN = [
    { k: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'layout-dashboard' },
    { k: 'khophong', label: 'Giỏ hàng / Kho phòng', href: 'khophong.html', icon: 'package', badge: '12' },
    { k: 'toanha', label: 'Tòa nhà', href: 'toanha.html', icon: 'building' },
    { k: 'crm', label: 'Khách hàng (CRM)', href: 'crm.html', icon: 'users' },
    { k: 'deal', label: 'Deal & Hợp đồng', href: 'deal.html', icon: 'file-text', badge: '3' },
    { k: 'doanhthu', label: 'Doanh thu', href: 'doanhthu.html', icon: 'wallet' },
    { k: 'lichhen', label: 'Lịch hẹn', href: 'lichhen.html', icon: 'calendar-days' },
    { k: 'bangtin', label: 'Bảng tin', href: 'bangtin.html', icon: 'megaphone' },
    { k: 'khuvuc', label: 'Khu vực', href: 'khuvuc.html', icon: 'map' }
  ];
  var NAV_ADMIN = [
    { k: 'baocao', label: 'Báo cáo tổng', href: 'baocao.html', icon: 'file-text' },
    { k: 'quy', label: 'Quỹ nội bộ', href: 'quynoibo.html', icon: 'banknote' },
    { k: 'nhanvien', label: 'Nhân viên', href: 'nhanvien.html', icon: 'user-cog' },
    { k: 'phanquyen', label: 'Phân quyền', href: 'phanquyen.html', icon: 'shield-check' },
    { k: 'caidat', label: 'Cài đặt', href: 'caidat.html', icon: 'settings' }
  ];

  function item(n, active) {
    var badge = n.badge;
    if (n.k === 'khophong' && window.ROOMS) badge = String(window.ROOMS.length); // đồng bộ số phòng thật
    return '<a class="sidebar__item' + (n.k === active ? ' is-active' : '') + '" href="' + n.href + '">' +
      ic(n.icon, 18) + '<span class="sidebar__item-label">' + n.label + '</span>' +
      (badge ? '<span class="sidebar__badge">' + badge + '</span>' : '') + '</a>';
  }

  /* Tìm kiếm toàn cục (⌘K / bấm ô tìm kiếm) — tìm phòng + tòa nhà thật */
  function globalSearch() {
    if (!window.HT || !HT.modal) return;
    var m = HT.modal({
      title: 'Tìm kiếm nhanh', sub: 'Tìm phòng và tòa nhà theo tên hoặc địa chỉ', submitLabel: null,
      bodyHTML: '<div class="mfield"><input id="gsq" type="text" placeholder="Nhập từ khóa…" autocomplete="off"></div>' +
        '<div id="gsres" style="display:flex;flex-direction:column;gap:2px;max-height:340px;overflow:auto"></div>'
    });
    var q = m.el.querySelector('#gsq'), res = m.el.querySelector('#gsres');
    function render(kw) {
      kw = (kw || '').trim().toLowerCase();
      if (!kw) { res.innerHTML = '<div class="empty-state" style="padding:16px"><div class="empty-state__s">Gõ để tìm phòng & tòa nhà…</div></div>'; return; }
      var out = [];
      (window.ROOMS || []).forEach(function (r, i) {
        if (out.length >= 8) return;
        var hay = ((r.t || '') + ' ' + (r.l || '') + ' ' + (r.quan || '')).toLowerCase();
        if (hay.indexOf(kw) >= 0) out.push('<a class="search-result" href="detail.html?i=' + i + '"><span class="search-result__ic">' + ic('package', 16) + '</span><span><span class="search-result__t" style="display:block">' + HT.esc(r.t || '') + '</span><span class="search-result__s">' + HT.esc(r.p || '') + ' · ' + HT.esc(r.quan || '') + '</span></span></a>');
      });
      var bd = [].concat((window.HT_BUILDINGS && HT_BUILDINGS.ptro) || [], (window.HT_BUILDINGS && HT_BUILDINGS.cc) || []);
      bd.forEach(function (b) {
        if (out.length >= 12) return;
        var hay = ((b.addr || '') + ' ' + (b.addrFull || '')).toLowerCase();
        if (hay.indexOf(kw) >= 0) out.push('<a class="search-result" href="toanha-chitiet.html?bid=' + encodeURIComponent(b.bid) + '"><span class="search-result__ic">' + ic('building', 16) + '</span><span><span class="search-result__t" style="display:block">' + HT.esc(b.addr || '') + '</span><span class="search-result__s">Tòa nhà · ' + HT.esc(b.quan || '') + '</span></span></a>');
      });
      res.innerHTML = out.length ? out.join('') : '<div class="empty-state" style="padding:16px"><div class="empty-state__s">Không tìm thấy kết quả.</div></div>';
    }
    render('');
    q.addEventListener('input', function () { render(q.value); });
  }
  window.HTI = window.HTI || {};
  window.HTI.globalSearch = globalSearch;

  function staff() {
    try { return JSON.parse(localStorage.getItem('ht_staff')) || null; } catch (e) { return null; }
  }

  function sidebarHTML(active) {
    var s = staff() || { name: 'Minh Trọ', role: 'Sale cấp 2', initials: 'MT', roleKey: 'sale2' };
    var roleLabel = (s.roleKey === 'admin' ? '👑 ' : '⭐ ') + s.role;
    return '' +
      '<aside class="sidebar">' +
        '<div class="sidebar__brand">' +
          '<span class="sidebar__brand-logo">HT</span>' +
          '<span class="sidebar__brand-name">HT HOME</span>' + ic('chevrons-up-down', 16) +
        '</div>' +
        '<div class="sidebar__search" id="ht-gsearch" style="cursor:pointer">' + ic('search', 15) + '<span>Tìm kiếm nhanh</span><span class="kbd">⌘K</span></div>' +
        '<nav class="sidebar__nav">' + NAV_MAIN.map(function (n) { return item(n, active); }).join('') + '</nav>' +
        '<div class="sidebar__divider"></div>' +
        '<div class="sidebar__cap">QUẢN TRỊ</div>' +
        '<nav class="sidebar__nav">' + NAV_ADMIN.map(function (n) { return item(n, active); }).join('') + '</nav>' +
        '<div class="sidebar__spacer"></div>' +
        '<div class="sidebar__profile">' +
          '<div class="sidebar__level">' +
            '<div class="sidebar__level-top">' +
              '<span class="avatar">' + s.initials + '</span>' +
              '<span style="flex:1"><span class="sidebar__level-name" style="display:block">' + s.name + '</span><span class="sidebar__level-role">' + roleLabel + '</span></span>' +
            '</div>' +
            '<div class="sidebar__bar-label"><span>Tiến độ lên Sale 1</span><span>68%</span></div>' +
            '<div class="sidebar__bar"><span class="sidebar__bar-fill" style="width:68%"></span></div>' +
            '<a class="sidebar__logout" id="htLogout" href="dangnhap-noibo.html">' + ic('log-out', 15) + 'Đăng xuất</a>' +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  function mount() {
    var host = document.getElementById('ht-sidebar');
    if (!host) return;
    // Bắt buộc đăng nhập mới vào được khu nội bộ
    if (!staff()) { location.replace('dangnhap-noibo.html'); return; }
    host.innerHTML = sidebarHTML(host.getAttribute('data-active') || '');

    var lo = document.getElementById('htLogout');
    if (lo) lo.addEventListener('click', function () { try { localStorage.removeItem('ht_staff'); } catch (e) {} });

    // Tìm kiếm nhanh: bấm ô hoặc ⌘K / Ctrl+K
    var gs = document.getElementById('ht-gsearch');
    if (gs) gs.addEventListener('click', globalSearch);
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); globalSearch(); }
    });

    // Backdrop cho mobile
    var backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    function toggle(open) {
      host.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
    }
    backdrop.addEventListener('click', function () { toggle(false); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.btn-sidebar');
      if (b) { toggle(!host.classList.contains('is-open')); }
    });
  }

  window.HTI = { icon: ic, sidebarHTML: sidebarHTML, mount: mount, globalSearch: globalSearch };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
