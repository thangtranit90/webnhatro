/* Modal "Thêm phòng" dùng chung (theo thiết kế v2 — gọn, bỏ field rườm rà).
   Dùng: HT.roomModal({ bid, onDone }) — bid: chọn sẵn toà (tuỳ chọn); onDone: gọi sau khi lưu.
   Cần: HT.modal, HT.toast (ht-ui.js) + API /api/toa-nha (GET/PATCH) + /api/upload (R2). */
(function () {
  'use strict';
  if (!window.HT) window.HT = {};

  var LOAI = ['Phòng trọ', 'Căn hộ DV', 'Ký túc xá', 'Chung cư', 'Nhà nguyên căn', 'Studio', '1PN', '2PN', '3PN', 'Duplex'];
  var NOITHAT = ['Cơ bản', 'Full', 'Đầy đủ', 'Luxury'];
  var THIETKE = ['Ban công', 'Cửa sổ', 'Giếng trời', 'Sân vườn', 'Tách bếp'];

  function opts(list, sel) {
    return list.map(function (x) { return '<option' + (x === sel ? ' selected' : '') + '>' + x + '</option>'; }).join('');
  }
  function chips(list) {
    return list.map(function (x) {
      return '<button type="button" class="rm-chip" data-v="' + x + '">' + x + '</button>';
    }).join('');
  }

  HT.roomModal = function (o) {
    o = o || {};
    var roomImgs = [];

    // Nạp danh sách toà nhà rồi mở modal
    fetch('/api/toa-nha').then(function (r) { return r.json(); }).then(function (d) {
      var BUILDINGS = [].concat((d && d.ptro) || [], (d && d.cc) || []);
      if (!BUILDINGS.length) { HT.toast('Chưa có toà nhà nào — hãy thêm toà nhà trước', 'danger'); return; }

      var bopts = BUILDINGS.map(function (b) {
        return '<option value="' + b.bid + '"' + (o.bid === b.bid ? ' selected' : '') + '>' +
          (b.addr || b.bid) + (b.quan ? ' · ' + b.quan : '') + '</option>';
      }).join('');

      var body =
        '<div class="mfield"><label class="mfield__label">Toà nhà *</label>' +
          '<select id="rmBuilding">' + bopts + '</select></div>' +
        '<div class="mrow">' +
          '<div class="mfield"><label class="mfield__label">Mã phòng *</label><input id="rmMa" placeholder="P.201"></div>' +
          '<div class="mfield"><label class="mfield__label">Tầng</label><input id="rmTang" placeholder="2"></div>' +
        '</div>' +
        '<div class="mrow">' +
          '<div class="mfield"><label class="mfield__label">Loại phòng</label><select id="rmLoai">' + opts(LOAI, 'Phòng trọ') + '</select></div>' +
          '<div class="mfield"><label class="mfield__label">Nội thất</label><select id="rmNoithat">' + opts(NOITHAT, 'Cơ bản') + '</select></div>' +
        '</div>' +
        '<div class="mrow">' +
          '<div class="mfield"><label class="mfield__label">Diện tích (m²)</label><input id="rmM2" placeholder="28"></div>' +
          '<div class="mfield"><label class="mfield__label">Giá thuê / tháng (đ)</label><input id="rmGia" placeholder="2.800.000"></div>' +
        '</div>' +
        '<div class="mfield"><label class="mfield__label">Thiết kế</label>' +
          '<div class="rm-chips" id="rmThietke">' + chips(THIETKE) + '</div></div>' +
        '<div class="mfield"><label class="mfield__label">Ảnh phòng</label>' +
          '<div class="rm-drop" id="rmDrop">' +
            '<span>Bấm hoặc kéo thả ảnh vào đây</span><span class="rm-drop__s">PNG, JPG tối đa 8MB · tối đa 12 ảnh</span>' +
          '</div>' +
          '<input type="file" id="rmFile" accept="image/*" multiple hidden>' +
          '<div class="rm-grid" id="rmGrid"></div></div>';

      var m = HT.modal({
        title: 'Thêm phòng', sub: 'Phòng sẽ vào Kho phòng ở trạng thái "Còn trống"',
        submitLabel: 'Thêm phòng', wide: true, bodyHTML: body,
        onSubmit: function (el, close) {
          var bid = el.querySelector('#rmBuilding').value;
          var b = BUILDINGS.filter(function (x) { return x.bid === bid; })[0];
          if (!b) { HT.toast('Chọn toà nhà', 'danger'); return false; }
          var ma = (el.querySelector('#rmMa').value || '').trim();
          if (!ma) { HT.toast('Nhập mã phòng', 'danger'); return false; }
          var tags = [];
          el.querySelectorAll('#rmThietke .rm-chip.is-on').forEach(function (c) { tags.push(c.getAttribute('data-v')); });
          var room = {
            rid: bid + '_r' + Date.now(),
            ma: ma, tang: (el.querySelector('#rmTang').value || '').trim(),
            loai: el.querySelector('#rmLoai').value,
            tags: tags,
            noithat: [el.querySelector('#rmNoithat').value],
            m2: (el.querySelector('#rmM2').value || '').trim(),
            price: (el.querySelector('#rmGia').value || '').trim(),
            coc: '1 tháng', cocsố: '', hh: '50%–80%', hd: '6T–12T',
            chiPhi: { loai: 'tro' }, soLuong: 1, soTrong: 1, status: 'open'
          };
          b.rooms = (b.rooms || []).concat([room]);
          if (roomImgs.length) b.imgs = (b.imgs || []).filter(function (x) { return /^https?:|^\/img\//.test(x); }).concat(roomImgs);
          fetch('/api/toa-nha', {
            method: 'PATCH', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ bid: bid, building: b })
          }).then(function (r) { return r.json(); }).then(function (res) {
            if (res && res.error) { HT.toast(res.error, 'danger'); return; }
            close();
            HT.toast('Đã thêm phòng', 'success');
            if (typeof o.onDone === 'function') o.onDone(bid);
          }).catch(function () { HT.toast('Lỗi mạng, chưa lưu được', 'danger'); });
          return false;
        }
      });

      // ---- Wiring sau khi modal mở ----
      var el = m.el;
      // chip thiết kế (toggle nhiều)
      el.querySelector('#rmThietke').addEventListener('click', function (e) {
        var c = e.target.closest('.rm-chip'); if (c) c.classList.toggle('is-on');
      });
      // upload ảnh R2
      var drop = el.querySelector('#rmDrop'), file = el.querySelector('#rmFile'), grid = el.querySelector('#rmGrid');
      function renderGrid() {
        grid.innerHTML = roomImgs.map(function (u, i) {
          return '<div class="rm-thumb"><img src="' + u + '"><button type="button" data-i="' + i + '" aria-label="Xoá">✕</button></div>';
        }).join('');
      }
      function up(files) {
        Array.prototype.slice.call(files).filter(function (f) { return f.type.indexOf('image/') === 0; }).forEach(function (f) {
          if (roomImgs.length >= 12) { HT.toast('Tối đa 12 ảnh', 'warning'); return; }
          fetch('/api/upload', { method: 'POST', headers: { 'content-type': f.type }, body: f })
            .then(function (r) { return r.json(); }).then(function (res) {
              if (res && res.url) { roomImgs.push(res.url); renderGrid(); }
              else HT.toast((res && res.error) || 'Tải ảnh lỗi', 'danger');
            }).catch(function () { HT.toast('Lỗi mạng khi tải ảnh', 'danger'); });
        });
      }
      drop.addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function () { up(file.files); file.value = ''; });
      grid.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-i]'); if (b) { roomImgs.splice(+b.getAttribute('data-i'), 1); renderGrid(); }
      });
      ['dragover', 'dragenter'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-drag'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-drag'); }); });
      drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) up(e.dataTransfer.files); });
    }).catch(function () { HT.toast('Không tải được danh sách toà nhà', 'danger'); });
  };
})();
