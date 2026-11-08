// キャッシュ名は index.html の APP_VERSION（登録時の ?v=）から決まる
const APP_VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE_NAME = `umagame-${APP_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './assets/icon.jpeg',
  './assets/stable.png',
  './assets/horse.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ネットワーク優先：オンラインなら常に最新を取得し、オフライン時だけキャッシュを使う
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
