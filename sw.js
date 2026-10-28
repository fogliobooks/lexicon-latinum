const VERSION = 'lx-2026-10-28.0253';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'morph.js', 'macrons.js', 'content/core.js', 'content/packs-nouns.js', 'content/packs-verbs.js', 'content/packs-pron.js', 'content/grammar.js', 'content/reader.js', 'content/art.js', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== VERSION + '-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => { const hit = await c.match(e.request); if (hit) return hit; try { const r = await fetch(e.request); if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; } catch (err) { return hit || Response.error(); } }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/data/')) {
    e.respondWith(caches.open(VERSION).then(async c => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }));
  } else {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then(h => h || caches.match('index.html'))));
  }
});
