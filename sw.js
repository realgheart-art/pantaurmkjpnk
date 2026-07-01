/* ============================================================
   RMK OBSERVER — Service Worker
   PENTING: Naikkan nombor VERSI setiap kali anda kemaskini app
   (cth v1 -> v2). Ini yang mencetuskan notifikasi "Versi baharu".
   ============================================================ */
const VERSI = 'rmk-observer-v1';

const ASET = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png',
  './apple-touch-icon.png', './favicon-32.png'
];

// Pasang: simpan aset teras
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(ASET)).catch(() => {}));
});

// Aktif: buang cache versi lama
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSI).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Terima arahan dari halaman untuk aktif serta-merta
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

// Strategi capaian
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Biar permintaan API (GAS) & sumber luar (CDN) lalu terus ke rangkaian
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // HTML: network-first (sentiasa cuba dapat versi terkini bila online)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const cc = r.clone(); caches.open(VERSI).then(c => c.put(req, cc)); return r; })
        .catch(() => caches.match(req).then(m => m || caches.match('./index.html')))
    );
    return;
  }

  // Aset lain: cache-first
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(r => {
      const cc = r.clone(); caches.open(VERSI).then(c => c.put(req, cc)); return r;
    }))
  );
});
