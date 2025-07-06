// Service Worker for Home Muscle Builder PWA
const CACHE_NAME = 'home-muscle-builder-v1.0';
const APP_SHELL_CACHE = 'app-shell-v1.0';
const DATA_CACHE = 'data-cache-v1.0';

// App Shell files (core files needed for app to work offline)
const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/app.js',
    '/manifest.json',
    // Add icon files when they're created
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    
    event.waitUntil(
        caches.open(APP_SHELL_CACHE)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(APP_SHELL_FILES);
            })
            .catch((error) => {
                console.error('[ServiceWorker] Failed to cache app shell:', error);
            })
    );
    
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== APP_SHELL_CACHE && 
                        cacheName !== DATA_CACHE && 
                        cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Claim clients immediately
    return self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle API requests (for future backend integration)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE)
                .then((cache) => {
                    return fetch(request)
                        .then((response) => {
                            // If request is successful, clone and cache it
                            if (response.status === 200) {
                                cache.put(request.url, response.clone());
                            }
                            return response;
                        })
                        .catch(() => {
                            // If network fails, try to get from cache
                            return cache.match(request);
                        });
                })
        );
        return;
    }
    
    // Handle app shell requests
    if (APP_SHELL_FILES.includes(url.pathname) || url.pathname === '/') {
        event.respondWith(
            caches.open(APP_SHELL_CACHE)
                .then((cache) => {
                    return cache.match(request)
                        .then((response) => {
                            if (response) {
                                return response;
                            }
                            // If not in cache, try network
                            return fetch(request)
                                .then((networkResponse) => {
                                    cache.put(request, networkResponse.clone());
                                    return networkResponse;
                                });
                        });
                })
        );
        return;
    }
    
    // Handle other requests (images, etc.)
    event.respondWith(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match(request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        
                        return fetch(request)
                            .then((networkResponse) => {
                                // Cache successful responses
                                if (networkResponse.status === 200) {
                                    cache.put(request, networkResponse.clone());
                                }
                                return networkResponse;
                            })
                            .catch(() => {
                                // Return offline fallback for navigation requests
                                if (request.mode === 'navigate') {
                                    return caches.match('/index.html');
                                }
                                
                                // Return a basic offline response for other requests
                                return new Response('Offline', {
                                    status: 408,
                                    statusText: 'Offline'
                                });
                            });
                    });
            })
    );
});

// Background sync for future data synchronization
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'workout-sync') {
        event.waitUntil(syncWorkouts());
    }
});

// Push notification handling (for Phase 2)
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push Received.');
    
    let notificationData = {
        title: 'Time to Train! 💪',
        body: 'Your muscles are waiting for today\'s workout!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
            url: '/?action=workout'
        },
        actions: [
            {
                action: 'start-workout',
                title: 'Start Workout'
            },
            {
                action: 'dismiss',
                title: 'Maybe Later'
            }
        ],
        requireInteraction: true,
        tag: 'workout-reminder'
    };
    
    // Parse push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (e) {
            console.error('Error parsing push data:', e);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click Received.');
    
    event.notification.close();
    
    if (event.action === 'start-workout') {
        // Open app and navigate to workout
        event.waitUntil(
            clients.openWindow('/?action=workout')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow(event.notification.data?.url || '/')
        );
    }
});

// Helper function for future workout synchronization
async function syncWorkouts() {
    try {
        // This will be implemented in Phase 2 when backend is available
        console.log('[ServiceWorker] Syncing workouts...');
        
        // Get stored workouts from IndexedDB or localStorage
        // Send to backend API
        // Handle response and update local storage
        
        console.log('[ServiceWorker] Workout sync completed');
    } catch (error) {
        console.error('[ServiceWorker] Workout sync failed:', error);
        throw error; // This will retry the sync later
    }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_EXERCISE_DATA') {
        // Cache exercise data for offline use
        caches.open(DATA_CACHE)
            .then((cache) => {
                const response = new Response(JSON.stringify(event.data.exercises));
                cache.put('/exercise-data', response);
            });
    }
});

// Periodic background sync (when supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'workout-reminder') {
        event.waitUntil(scheduleWorkoutReminder());
    }
});

async function scheduleWorkoutReminder() {
    // This would check if user has enabled reminders
    // and show a notification if it's time for a workout
    console.log('[ServiceWorker] Checking for workout reminder...');
}

// Handle service worker updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: '1.0' });
    }
});

console.log('[ServiceWorker] Service Worker loaded');
