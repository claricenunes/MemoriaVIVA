// ─── Cache names — bump CACHE_STATIC version on each deploy ──────────────────
const CACHE_STATIC = 'mv-static-v3'
const CACHE_PAGES  = 'mv-pages-v2'
const CACHE_FONTS  = 'mv-fonts-v2'
const ALL_CACHES   = [CACHE_STATIC, CACHE_PAGES, CACHE_FONTS]

// Assets that must be available offline from the first load
const PRECACHE = [
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

// ─── Install: precache shell ──────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_STATIC).then((c) =>
      // Individual adds so one failure doesn't abort the whole precache
      Promise.allSettled(PRECACHE.map((url) => c.add(url)))
    )
  )
  self.skipWaiting()
})

// ─── Activate: purge old caches, enable navigation preload ───────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => !ALL_CACHES.includes(k))
            .map((k) => caches.delete(k))
        )
      ),
      // Navigation preload speeds up page loads when SW is installed
      self.registration.navigationPreload?.enable?.(),
    ])
  )
  self.clients.claim()
})

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Pass through: Next.js internals, Supabase, HMR, API routes
  // /_next/static/ is intentionally NOT cached by the SW — in production these
  // files are content-addressed and handled by the browser HTTP cache; in dev
  // they have no hash so SW caching causes stale-chunk 404s after rebuilds.
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/')
  ) return

  // Google Fonts CSS → stale-while-revalidate (fast render + stays fresh)
  if (url.hostname === 'fonts.googleapis.com') {
    e.respondWith(staleWhileRevalidate(e.request, CACHE_FONTS))
    return
  }

  // Font files & icon CDN → cache-first (content-addressed, safe to cache forever)
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(cacheFirst(e.request, CACHE_FONTS))
    return
  }

  // Public images & icons from this origin → cache-first
  if (/\.(png|svg|webp|ico|jpg|jpeg)$/.test(url.pathname)) {
    e.respondWith(cacheFirst(e.request, CACHE_STATIC))
    return
  }

  // Navigation requests → network-first with offline fallback page
  if (e.request.mode === 'navigate') {
    e.respondWith(navigationHandler(e))
    return
  }

  // Everything else → network-first, cache as fallback
  e.respondWith(networkFirst(e.request, CACHE_PAGES))
})

// ─── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) (await caches.open(cacheName)).put(request, response.clone())
    return response
  } catch {
    return new Response('Recurso indisponível offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache    = await caches.open(cacheName)
  const cached   = await cache.match(request)
  const networkP = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone())
    return res
  }).catch(() => null)
  return cached ?? (await networkP) ?? new Response('Offline', { status: 503 })
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) (await caches.open(cacheName)).put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request)
    return cached ?? new Response('Offline', { status: 503 })
  }
}

async function navigationHandler(event) {
  try {
    // Use navigation preload response if the browser supports it
    const preloaded = await event.preloadResponse
    if (preloaded) {
      ;(await caches.open(CACHE_PAGES)).put(event.request, preloaded.clone())
      return preloaded
    }

    const response = await fetch(event.request)
    if (response.ok) (await caches.open(CACHE_PAGES)).put(event.request, response.clone())
    return response
  } catch {
    // Try the cache for this exact URL first
    const cached = await caches.match(event.request)
    if (cached) return cached

    // Then try the generic offline page
    const offline = await caches.match('/offline.html')
    return offline ?? new Response(
      '<!DOCTYPE html><html lang="pt-BR"><body style="font-family:system-ui;padding:40px;text-align:center"><h1>Sem conexão</h1><p>Você está offline.</p><button onclick="location.reload()">Tentar novamente</button></body></html>',
      { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
    )
  }
}
