const CACHE_NAME = 'fead-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/main.jsx',
  '/App.jsx',
  '/App.css',
  '/style.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})