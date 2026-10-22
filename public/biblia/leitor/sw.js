const CACHE = 'ad-planalto-biblia-v9';
const FILES = ['./index.html','./style.css','./app.js','./reference.js','./voice-search.js','./bible-search.js','./search-ui.js','./biblia.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon.svg','./install.js','./revisao-ortografica.json'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ad-planalto-biblia-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith('/biblia/leitor/')) return;
 event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
