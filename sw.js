const CACHE_NAME = 'archive-47-v2';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './README.md'
];

// Установка: кешируем ресурсы и пропускаем ожидание
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// Активация: чистим старый кеш и берем управление клиентами
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => {
        return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
      })
    ])
  );
});

// Запросы: Стратегия "Cache First, then Network"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
