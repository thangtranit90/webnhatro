/* Service worker HT HOME — cache đơn giản cho PWA (cài như app + chạy mượt) */
var CACHE = 'hthome-v4';
var CORE = [
  './',
  './index.html',
  './assets/css/tokens.css?v=4',
  './assets/css/base.css?v=4',
  './assets/css/components.css?v=4',
  './assets/js/ht-ui.js?v=4',
  './data.js',
  './ht-home-logo.png',
  './manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Chỉ xử lý tài nguyên cùng nguồn; bỏ qua CDN/ảnh ngoài (fonts, unsplash…)
  if (url.origin !== self.location.origin) return;

  // Ảnh & font (ít đổi): cache-first cho nhanh
  if (/\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(function (m) {
        return m || fetch(req).then(function (res) {
          var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  // HTML / JS / CSS / JSON (code của app): NETWORK-FIRST để bản deploy mới luôn được dùng;
  // mất mạng mới lấy cache (offline vẫn chạy).
  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (m) { return m || caches.match('./index.html'); });
    })
  );
});
