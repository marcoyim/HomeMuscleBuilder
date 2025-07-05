// Alternative service worker name - redirect to main service worker
// This file exists to prevent 404 errors when browsers look for 'service-worker.js'
importScripts('./sw.js');
