/* Service worker HT HOME — cache đơn giản cho PWA (cài như app + chạy mượt) */
var CACHE = 'hthome-v1';
var CORE = [
  './',
  './index.html',
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/js/ht-ui.js',
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

  // HTML: ưu tiên mạng, offline thì lấy cache
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match('./index.html'); }); })
    );
    return;
  }

  // Tài nguyên tĩnh: ưu tiên cache, không có thì tải mạng rồi lưu
  e.respondWith(
    caches.match(req).then(function (m) {
      return m || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
