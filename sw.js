// ── Enciclopedia Naturista de Chile — Service Worker ──
const CACHE_NAME = 'naturista-v2';

// Only pre-cache truly static assets (fonts, icons from CDN)
const PRECACHE = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install — only pre-cache external fonts
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch strategy:
//   • Same-origin JS/CSS/HTML → network first, cache as fallback (allows live updates)
//   • Same-origin JSON data   → network first, cache as fallback
//   • External CDN assets     → stale-while-revalidate (fonts, icons rarely change)
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // External CDN: stale-while-revalidate
    if (url.origin !== location.origin) {
        e.respondWith(
            caches.match(e.request).then(cached => {
                const fresh = fetch(e.request).then(res => {
                    if (res.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
                    return res;
                }).catch(() => cached);
                return cached || fresh;
            })
        );
        return;
    }

    // Same-origin: network first, fall back to cache
    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
