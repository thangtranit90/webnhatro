/* ============================================================
   data.js — NGUỒN DỮ LIỆU DÙNG CHUNG (canonical) cho CẢ hệ thống HT HOME
   ------------------------------------------------------------
   • window.HT_BUILDINGS = { ptro:[...], cc:[...] }  ← danh mục toà nhà (chuẩn)
       Dashboard (dashboard.html) đọc trực tiếp mảng này.
   • window.ROOMS ← view PHẲNG suy ra từ HT_BUILDINGS, cho trang chủ + chi tiết.
       Nhờ vậy public site và khu quản lý hiển thị CÙNG một danh mục phòng.
   • Các helper public: catOf, ADV_GROUPS, DEFAULT_TAGS, TYPE_TAGS, DISTRICTS.

   Khi có dữ liệu thật: chỉ sửa HT_BUILDINGS (một chỗ) → cả public lẫn dashboard cập nhật.
   Lưu ý: bản artifact 1-file mang một BẢN SAO nội tuyến của dữ liệu này để chạy độc lập;
   khi đổi dữ liệu thật hãy đồng bộ cả hai.
   ============================================================ */

// ── DANH MỤC TOÀ NHÀ (chuẩn) ──
window.HT_BUILDINGS = {
  // Phòng trọ / CHDV / KTX
  ptro: [
    {
      bid:'b1', addr:'Huỳnh Khương An, P.8',
      addrFull:'60/18A Huỳnh Khương An, Phường 8, Quận Gò Vấp, TP. Hồ Chí Minh',
      quan:'Gò Vấp', nv:'Nguyễn Hữu Thắng',
      chuNhaSdt:'0909 111 222', zaloNhom:'https://zalo.me/g/example1',
      tiktokUrl:'7380000000000000001', date:'Hôm nay',
      imgs:['#a8c4f0,#6b9fdf','#98bae0,#6090d0','#88aed8,#5080c0'],
      tienich:['Camera 24/7','Bảo vệ','Wifi','Chỗ để xe'],
      rooms:[
        {rid:'b1r1',loai:'Ký túc xá',tags:['Cửa sổ'],noithat:['Giường','Tủ quần áo'],
         m2:'~18',price:'1,4TR',coc:'1 tháng',cocsố:'1.400.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'ktx',note:'Bao gồm tất cả chi phí'},
         soLuong:8,soTrong:3,status:'open'},
        {rid:'b1r2',loai:'Ký túc xá',tags:['Duplex','Gác lửng'],noithat:['Giường','Tủ quần áo','Bàn ghế'],
         m2:'~22',price:'1,8TR',coc:'1 tháng',cocsố:'1.800.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'ktx',note:'Bao gồm tất cả chi phí'},
         soLuong:4,soTrong:0,status:'block'},
      ]
    },
    {
      bid:'b2', addr:'Nguyễn Oanh, P.17',
      addrFull:'45 Nguyễn Oanh, Phường 17, Quận Gò Vấp, TP. Hồ Chí Minh',
      quan:'Gò Vấp', nv:'Nguyễn Hữu Thắng',
      chuNhaSdt:'0918 222 333', zaloNhom:'https://zalo.me/g/example2',
      tiktokUrl:'', date:'Hôm qua',
      imgs:['#b0cef5,#7aaee5','#a0bef0,#6a9ee0'],
      tienich:['Thang máy','Wifi','Máy giặt','Chỗ để xe'],
      rooms:[
        {rid:'b2r1',loai:'Phòng trọ',tags:['Cửa sổ'],noithat:['Máy lạnh','Bàn ghế'],
         m2:'20',price:'2,8TR',coc:'1 tháng',cocsố:'2.800.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'tro',dien:'4.000đ/kWh',nuoc:'100.000đ/người',xe:'150.000đ/xe',dv:'100.000đ/phòng'},
         soLuong:6,soTrong:2,status:'open'},
        {rid:'b2r2',loai:'Phòng trọ',tags:['Ban công','1PN'],noithat:['Máy lạnh','Máy nước nóng','Bàn ghế'],
         m2:'25',price:'3,5TR',coc:'1 tháng',cocsố:'3.500.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'tro',dien:'4.000đ/kWh',nuoc:'100.000đ/người',xe:'150.000đ/xe',dv:'100.000đ/phòng'},
         soLuong:4,soTrong:1,status:'wait'},
      ]
    },
    {
      bid:'b3', addr:'Đinh Tiên Hoàng, P.3',
      addrFull:'128 Đinh Tiên Hoàng, Phường 3, Quận Bình Thạnh, TP. Hồ Chí Minh',
      quan:'Bình Thạnh', nv:'Trần Thị Mai',
      chuNhaSdt:'0933 444 555', zaloNhom:'',
      tiktokUrl:'7380000000000000002', date:'01/07',
      imgs:['#c0d8f8,#90b8e8','#b0c8f0,#80a8e0'],
      tienich:['Camera 24/7','Thang máy','Điều hòa','Wifi'],
      rooms:[
        {rid:'b3r1',loai:'Căn hộ DV',tags:['Studio','Ban công'],noithat:['Máy lạnh','Tủ lạnh','Máy nước nóng','Bàn ghế','Giường'],
         m2:'35',price:'5,2TR',coc:'1 tháng',cocsố:'5.200.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'tro',dien:'4.000đ/kWh',nuoc:'100.000đ/người',xe:'150.000đ/xe',dv:'100.000đ/phòng'},
         soLuong:1,soTrong:1,status:'open'},
      ]
    },
    {
      bid:'b4', addr:'Cách Mạng Tháng 8, P.10',
      addrFull:'310 Cách Mạng Tháng 8, Phường 10, Quận 10, TP. Hồ Chí Minh',
      quan:'Quận 10', nv:'Lê Minh Hùng',
      chuNhaSdt:'0944 888 999', zaloNhom:'https://zalo.me/g/example5',
      tiktokUrl:'7380000000000000003', date:'28/06',
      imgs:['#a0c0f2,#70a0e2','#90b0e8,#6090d8'],
      tienich:['Camera 24/7','Thang máy','Bảo vệ','Wifi'],
      rooms:[
        {rid:'b4r1',loai:'Ký túc xá',tags:['Cửa sổ'],noithat:['Giường','Tủ quần áo','Bàn ghế'],
         m2:'~15',price:'1,2TR',coc:'1 tháng',cocsố:'1.200.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'ktx',note:'Bao gồm tất cả chi phí'},
         soLuong:12,soTrong:5,status:'open'},
        {rid:'b4r2',loai:'Phòng trọ',tags:['Ban công'],noithat:['Máy lạnh','Giường','Bàn ghế'],
         m2:'22',price:'3,2TR',coc:'1 tháng',cocsố:'3.200.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'tro',dien:'4.000đ/kWh',nuoc:'100.000đ/người',xe:'150.000đ/xe',dv:'100.000đ/phòng'},
         soLuong:3,soTrong:0,status:'block'},
      ]
    },
  ],
  // Chung cư / Nhà nguyên căn
  cc: [
    {
      bid:'cc_b1', addr:'Hoàng Diệu, P.Tân Phú',
      addrFull:'18 Hoàng Diệu, Phường Tân Phú, Quận Phú Nhuận, TP. Hồ Chí Minh',
      quan:'Phú Nhuận', nv:'Phạm Thị Lan',
      chuNhaSdt:'0933 456 333', zaloNhom:'', tiktokUrl:'7380000000000000010', date:'01/07',
      imgs:['#c8d8f8,#8ab0e8','#b8caf5,#7aa0e2','#a8baf0,#6a90da'],
      tienich:['Camera 24/7','Wifi','Chỗ để xe ô tô'],
      rooms:[
        {rid:'cc_b1r1',loai:'Nhà nguyên căn',tags:['3PN','Ban công'],
         noithat:['Bếp','Máy lạnh'],m2:'80',price:'8TR',coc:'2 tháng',cocsố:'16.000.000đ',
         hh:'60%–80%',hd:'6T–12T',chiPhi:{loai:'nha',note:'Điện nước theo đơn giá nhà nước'},
         soLuong:1,soTrong:1,status:'open'},
      ]
    },
    {
      bid:'cc_b2', addr:'Masteri Thảo Điền, P.Thảo Điền',
      addrFull:'159 Xa Lộ Hà Nội, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
      quan:'Thủ Đức', nv:'Phạm Thị Lan',
      chuNhaSdt:'0955 123 456', zaloNhom:'https://zalo.me/g/masteri', tiktokUrl:'7380000000000000011', date:'29/06',
      imgs:['#b8d0f5,#7aa8e5','#a8c0ec,#6a98dc','#98b0e4,#5888cc'],
      tienich:['Hồ bơi','Gym','Thang máy','Bảo vệ 24/7','Chỗ để xe ô tô'],
      rooms:[
        {rid:'cc_b2r1',loai:'Chung cư',tags:['2PN','Ban công'],
         noithat:['Đầy đủ nội thất','Máy lạnh','Tủ lạnh'],m2:'65',price:'12TR',coc:'2 tháng',cocsố:'24.000.000đ',
         hh:'50%–80%',hd:'6T–12T',chiPhi:{loai:'cc',note:'Điện nước theo đơn giá nhà nước',xe:'150.000đ/xe',ql:'45.000đ/m²'},
         soLuong:3,soTrong:2,status:'wait'},
        {rid:'cc_b2r2',loai:'Chung cư',tags:['3PN','Penthouse'],
         noithat:['Đầy đủ nội thất','Máy lạnh','Tủ lạnh','Bếp'],m2:'95',price:'22TR',coc:'2 tháng',cocsố:'44.000.000đ',
         hh:'60%–80%',hd:'12T–24T',chiPhi:{loai:'cc',note:'Điện nước theo đơn giá nhà nước',xe:'200.000đ/xe',ql:'45.000đ/m²'},
         soLuong:1,soTrong:0,status:'block'},
      ]
    },
    {
      bid:'cc_b3', addr:'Nguyễn Thị Minh Khai, P.5',
      addrFull:'102 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP. Hồ Chí Minh',
      quan:'Quận 3', nv:'Lê Minh Hùng',
      chuNhaSdt:'0911 789 012', zaloNhom:'https://zalo.me/g/q3building', tiktokUrl:'', date:'25/06',
      imgs:['#d0c8f8,#9890e8','#c0b8f0,#8880d8'],
      tienich:['Thang máy','Camera 24/7','Bảo vệ'],
      rooms:[
        {rid:'cc_b3r1',loai:'Nhà nguyên căn',tags:['4PN','Ban công'],
         noithat:['Bếp','Bàn ghế'],m2:'120',price:'18TR',coc:'2 tháng',cocsố:'36.000.000đ',
         hh:'60%–80%',hd:'12T–24T',chiPhi:{loai:'nha',note:'Điện nước theo đơn giá nhà nước'},
         soLuong:1,soTrong:1,status:'open'},
      ]
    },
  ],
};

/* ── Tin do người dùng thêm (lưu localStorage) được gộp vào danh mục ── */
window.HT_loadUserListings = function(){
  try { return JSON.parse(localStorage.getItem('ht_listings') || '[]'); } catch(e){ return []; }
};
(function mergeUserListings(){
  window.HT_loadUserListings().forEach(item => {
    const g = item.group === 'cc' ? 'cc' : 'ptro';
    if(item.building && window.HT_BUILDINGS[g]) window.HT_BUILDINGS[g].unshift(item.building);
  });
})();

/* ── ADAPTER: HT_BUILDINGS → window.ROOMS (view phẳng cho trang public) ──
   Mỗi phòng trong mỗi toà nhà = một tin đăng công khai. Giữ đúng thứ tự để
   detail.html?i=<index> khớp với card ở trang chủ. Gọi lại sau khi thêm tin. */
window.HT_rebuildRooms = function(){
  const LOAI_TO_CAT = { 'Căn hộ DV':'Căn hộ dịch vụ' }; // các loại khác giữ nguyên
  const LOAI_TO_TY = {
    'Phòng trọ':'Nhà trọ, phòng trọ', 'Căn hộ DV':'Căn hộ',
    'Ký túc xá':'Ký túc xá', 'Chung cư':'Chung cư', 'Nhà nguyên căn':'Nhà nguyên căn'
  };
  function priceTrieu(p){ return String(p||'').replace(/\s*TR\s*$/i,' triệu'); }
  function videoUrl(v){
    if(!v) return '';
    if(/^https?:/i.test(v)) return v;               // đã là URL
    return 'https://www.tiktok.com/@ht.home/video/' + v; // chỉ có ID
  }
  const rooms = [];
  const all = [].concat(window.HT_BUILDINGS.ptro, window.HT_BUILDINGS.cc);
  all.forEach(b => {
    (b.rooms || []).forEach(r => {
      const cat = LOAI_TO_CAT[r.loai] || r.loai;
      rooms.push({
        rid: r.rid,
        t: r.loai + ' — ' + b.addr,
        imgs: b.imgs || [],
        p: priceTrieu(r.price),
        ty: LOAI_TO_TY[r.loai] || r.loai,
        a: r.m2 ? (r.m2 + 'm²') : '',
        l: b.addrFull || (b.addr + (b.quan ? ', ' + b.quan : '')),
        r: b.tiktokUrl ? 1 : 0,
        b: [/^(u_|b_new_)/.test(b.bid) ? 'new' : 'hot'],   // 1 nhãn: MỚI cho tin vừa thêm, HOT cho còn lại
        video: videoUrl(b.tiktokUrl),
        phone: (b.chuNhaSdt || '').replace(/\s/g,''),
        zalo: b.zaloNhom || '',
        cat: cat,
        // Gộp cả tiện ích toà nhà (Wifi/Thang máy/Hồ bơi…) để bộ lọc "Tìm nâng cao" khớp
        tags: (r.tags || []).concat(r.noithat || []).concat(b.tienich || []),
        quan: b.quan,
      });
    });
  });
  window.ROOMS = rooms;
  return rooms;
};
window.HT_rebuildRooms();

/* ── Nạp danh mục toà nhà THẬT từ D1 (chỉ khu nội bộ gọi) ──
   Ghi đè HT_BUILDINGS + dựng lại ROOMS rồi gọi cb. Lỗi mạng → giữ seed tĩnh.
   Trang khách KHÔNG gọi hàm này nên vẫn đọc data.js tĩnh như cũ. */
window.HT_loadBuildings = function(cb){
  fetch('/api/toa-nha').then(function(r){ return r.json(); }).then(function(d){
    if (d && (d.ptro || d.cc)) {
      window.HT_BUILDINGS = { ptro: d.ptro || [], cc: d.cc || [] };
      window.HT_rebuildRooms();
    }
    if (cb) cb();
  }).catch(function(){ if (cb) cb(); });
};

/* CHỈ lưu bền vào localStorage (không đụng vào HT_BUILDINGS đang chạy).
   Dùng cho dashboard — nơi đã tự unshift vào BUILDINGS_DATA in-memory rồi. */
window.HT_saveListing = function(building, group){
  const g = group === 'cc' ? 'cc' : 'ptro';
  const ul = window.HT_loadUserListings();
  ul.unshift({ group:g, building:building });
  try { localStorage.setItem('ht_listings', JSON.stringify(ul)); return true; }
  catch(e){
    // Thường do vượt quota (ảnh base64 quá lớn). Thử lưu lại KHÔNG kèm ảnh để tin không mất.
    try {
      const slim = { group:g, building: Object.assign({}, building, { imgs:['#c8d8ff,#a0b8f0'] }) };
      ul[0] = slim;
      localStorage.setItem('ht_listings', JSON.stringify(ul));
      return 'noimg';   // đã lưu nhưng bỏ ảnh
    } catch(e2){ return false; }
  }
};

/* Thêm một tin mới (từ them-tin.html) → cập nhật danh mục đang chạy + lưu bền + dựng lại ROOMS. */
window.HT_addListing = function(building, group){
  const g = group === 'cc' ? 'cc' : 'ptro';
  window.HT_BUILDINGS[g].unshift(building);
  const res = window.HT_saveListing(building, g);
  window.HT_rebuildRooms();
  return res;   // true | 'noimg' | false
};

/* Danh sách quận/huyện cho khối "Khám phá các quận huyện khác" (số tin = mẫu). */
window.DISTRICTS = {
  'Hồ Chí Minh': [
    ['Bình Thạnh',108],['Quận 7',92],['Tân Bình',87],['Quận 12',70],
    ['Tân Phú',61],['Bình Tân',58],['Quận 10',52],['Phú Nhuận',33],
    ['Thủ Đức',32],['Quận 3',31],['Quận 1',22],['Quận 6',21],
    ['Quận 8',21],['Nhà Bè',19],['Bình Chánh',15],['Quận 4',15],
    ['Quận 11',13],['Quận 5',13],['Hóc Môn',6],['Gò Vấp',44],
  ],
  'Hà Nội': [
    ['Cầu Giấy',95],['Thanh Xuân',80],['Đống Đa',76],['Hai Bà Trưng',60],
    ['Hoàng Mai',55],['Nam Từ Liêm',48],['Bắc Từ Liêm',40],['Hà Đông',38],
  ],
  'Cần Thơ': [ ['Ninh Kiều',40],['Cái Răng',22],['Bình Thủy',15],['Ô Môn',8] ],
};

/* ===== Dùng chung cho cả trang chủ và trang chi tiết ===== */

// Bộ tag "Tìm nâng cao" (trang chủ lọc + trang chi tiết hiển thị đặc điểm phòng)
window.ADV_GROUPS = {
  'Nội thất': ['Full','Cao cấp','Cơ bản','Máy lạnh','Tủ lạnh','Bàn ghế','Giường'],
  'Thiết kế': ['Ban công','Cửa sổ','Studio','Duplex','Gác lửng','1PN','2PN','3PN','Penthouse'],
  'Tiện ích': ['Thang máy','Camera 24/7','Bảo vệ','Wifi','Chỗ để xe','Máy giặt','Điều hòa','Hồ bơi','Gym'],
};

// Tag mặc định khi phòng chưa gắn trường tags.
window.DEFAULT_TAGS = ['Cơ bản','Cửa sổ','Bãi xe'];

// Nhãn loại phòng DÙNG CHUNG. Ưu tiên r.cat; nếu không có thì suy từ r.ty.
window.catOf = function (r) {
  if (r && r.cat) return r.cat;
  const ty = (r && r.ty) || '';
  if (ty === 'Căn hộ') return 'Căn hộ dịch vụ';
  if (ty === 'Ký túc xá') return 'Ký túc xá';
  if (ty === 'Nhà nguyên căn') return 'Nhà nguyên căn';
  if (ty === 'Chung cư') return 'Chung cư';
  return 'Phòng trọ';
};

// Bộ tag/đặc điểm RIÊNG theo từng loại (luồng "Thêm tin bằng AI").
window.TYPE_TAGS = {
  'Phòng trọ': {
    'Nội thất': ['Full','Cao cấp','Cơ bản','Trống'],
    'Thiết kế': ['Gác lửng','Ban công','Cửa sổ','Khép kín'],
    'Tiện ích': ['Máy lạnh','Máy giặt chung','Bãi xe','Camera','Giờ giấc tự do','Bếp riêng'],
  },
  'Căn hộ dịch vụ': {
    'Nội thất': ['Full nội thất','Cao cấp'],
    'Phòng': ['Studio','1PN','2PN'],
    'Dịch vụ': ['Dọn phòng','Lễ tân','Bảo vệ 24/7','Thang máy','Hồ bơi','GYM'],
  },
  'Ký túc xá': {
    'Loại phòng': ['4 người','6 người','8 người','Ghép nam','Ghép nữ'],
    'Tiện ích': ['Máy lạnh','Quạt','Máy giặt chung','Wifi','Kệ bếp chung','Giờ giấc tự do'],
  },
  'Chung cư': {
    'Số phòng ngủ': ['Studio','1PN','2PN','3PN','Duplex'],
    'Nội thất': ['Full','Cơ bản','Trống'],
    'Tiện ích tòa nhà': ['Thang máy','Hồ bơi','GYM','Bãi ô tô','An ninh 24/7','Công viên'],
  },
  'Nhà nguyên căn': {
    'Cấu trúc': ['1 tầng','2 tầng','3 tầng','Có gác','Có sân'],
    'Số phòng ngủ': ['1PN','2PN','3PN','4PN+'],
    'Nội thất': ['Full','Cơ bản','Trống'],
    'Tiện ích': ['Chỗ để ô tô','Sân thượng','Sân vườn','Ban công'],
  },
};
