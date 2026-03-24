const CACHE_VERSION = 'v1';
const STATIC_CACHE = `easierbycode-static-${CACHE_VERSION}`;
const PAGES_CACHE = `easierbycode-pages-${CACHE_VERSION}`;
const GAMES_CACHE = `easierbycode-games-${CACHE_VERSION}`;

// Core shell assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/fonts/Orbitron.woff2',
  '/logo-dark.png',
  '/hire-daniel.png',
  '/qrcode.png',
  '/squad-game.png',
  '/games/2019/v1/icons/icon-192.png',
  '/games/2019/v1/icons/icon-512.png',
  '/assets/sprites/evil-invaders-icon.png',
  '/assets/sprites/shmup-party-icon.png',
  '/assets/sprites/headphone-invader-icon.png',
  // evil-invaders local game files
  '/games/evil-invaders/index.html',
  '/games/evil-invaders/index.js',
  '/games/evil-invaders/constants.js',
  '/games/evil-invaders/gameState.js',
  '/games/evil-invaders/hi-score-ui.js',
  '/games/evil-invaders/load-scene.js',
  '/games/evil-invaders/objects-and-scenes.js',
  '/games/evil-invaders/properties.js',
];

// Game route prefixes hosted on this origin
const GAME_ROUTES = [
  '/2019-es7',
  '/evil-invaders',
  '/hellophaser',
  '/squad-game',
  '/evil-invaders-phaser4',
  '/pacman-halloween-2025',
  '/shmup-party-phaser3',
  '/games/',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const validCaches = [STATIC_CACHE, PAGES_CACHE, GAMES_CACHE];
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => !validCaches.includes(name))
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests over http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = request.mode === 'navigate';
  const isGameRoute = GAME_ROUTES.some(route => url.pathname.startsWith(route));

  if (isNavigation) {
    // Network-first for page navigations (keeps content fresh)
    // Falls back to cache when offline
    event.respondWith(networkFirst(request, isGameRoute ? GAMES_CACHE : PAGES_CACHE));
  } else if (isSameOrigin) {
    // Cache-first for same-origin static assets (JS, CSS, images, fonts)
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else {
    // Stale-while-revalidate for cross-origin CDN assets (Phaser, Bootstrap, etc.)
    // Serves cached version instantly while refreshing in background
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});

// Serve from cache; fall back to network and cache the response
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}

// Try network first; fall back to cache if offline
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort: serve the main page shell for navigations
    const shell = await caches.match('/');
    return shell || new Response('<h1>Offline</h1><p>Please connect to the internet and reload.</p>', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Return cached version immediately; update cache in background
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);

  const networkFetch = fetch(request).then(response => {
    // Cache opaque (cross-origin) responses and successful responses
    if (response.type === 'opaque' || response.status === 200) {
      const clone = response.clone();
      caches.open(cacheName).then(cache => cache.put(request, clone));
    }
    return response;
  }).catch(() => null);

  return cached || await networkFetch || new Response('', { status: 503 });
}
