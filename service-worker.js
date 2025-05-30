// Define the cache name
const CACHE_NAME = 'distance-calculator-v1';
// List of URLs to cache
const urlsToCache = [
    './', // Caches the root URL (index.html)
    'index.html', // Explicitly cache the HTML file
    'manifest.json', // Cache the manifest file
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
    // Note: The main script is embedded in index.html, so no separate URL needed for it.
];

// Install event: Caches all the necessary assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to open cache or add URLs:', error);
            })
    );
});

// Fetch event: Serves cached content when available, otherwise fetches from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(error => {
                    console.error('Fetch failed for:', event.request.url, error);
                    // You can return an offline page here if desired
                    // return caches.match('/offline.html');
                });
            })
    );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
