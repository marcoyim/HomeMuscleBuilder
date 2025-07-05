// Service Worker for HomeMuscleBuilder PWA
const CACHE_NAME = 'home-muscle-builder-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/css/reset.css',
  '/src/css/variables.css',
  '/src/css/base.css',
  '/src/css/components.css',
  '/src/css/layouts.css',
  '/src/css/animations.css',
  '/src/js/app.js',
  '/src/js/router.js',
  '/src/js/modules/userProfile.js',
  '/src/js/modules/exerciseLibrary.js',
  '/src/js/modules/workoutLog.js',
  '/src/js/modules/pwaManager.js',
  '/src/js/modules/notificationManager.js',
  '/src/js/modules/uiManager.js',
  '/src/js/pages/homePage.js',
  '/src/js/pages/onboardingPage.js',
  '/src/js/pages/exercisesPage.js',
  '/src/js/pages/workoutPage.js',
  '/src/js/pages/profilePage.js',
  '/manifest.json',
  '/src/images/icons/icon-144x144.png',
  '/src/images/icons/icon-192x192.png',
  '/src/images/icons/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('[SW] Cache addAll failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }
        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.log('[SW] Fetch failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
