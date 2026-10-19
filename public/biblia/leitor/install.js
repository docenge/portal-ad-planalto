if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
 navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(async () => {
  const cache = await caches.open('ad-planalto-biblia-v1');
  if (await cache.match(new URL('./biblia.json', location.href).href)) {
   const note = document.createElement('p'); note.textContent = 'Bíblia disponível neste aparelho para leitura sem internet.'; note.style.cssText = 'font-size:12px;color:var(--muted)'; document.querySelector('footer')?.append(note);
  }
 }).catch(() => {});
}
