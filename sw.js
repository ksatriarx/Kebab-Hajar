// Service Worker Minimalis untuk Syarat PWA
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Biarkan kosong, yang penting ada event 'fetch'
self.addEventListener('fetch', (e) => {
  // Kosong
});
