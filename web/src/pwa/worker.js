const cacheName = "app-cache"
const assets = [
  "/",
  "/index.html",
]
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    this.navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(res => console.log('service worker registered'))
      .catch(err => console.err('service worker not registered', err))
  })
}
