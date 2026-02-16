const CACHE_VERSION = 'ich-trading-v1'
const STATIC_CACHE = 'static-assets-v1'
const API_CACHE = 'api-cache-v1'
const CONTENT_CACHE = 'content-cache-v1'

// 安装：预缓存关键静态资源
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, API_CACHE, CONTENT_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // index.json → Network First
  if (url.pathname.endsWith('/index.json') || url.href.includes('index.json')) {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  // markdown 文件 → Network First
  if (url.href.includes('raw.githubusercontent.com') && url.pathname.endsWith('.md')) {
    event.respondWith(networkFirst(request, CONTENT_CACHE))
    return
  }

  // 静态资源 → Cache First
  if (
    url.origin === self.location.origin &&
    (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font' ||
      request.destination === 'document')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
})

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('离线状态，内容暂不可用', {
      status: 503,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    })
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    return new Response('离线状态，内容暂不可用', {
      status: 503,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    })
  }
}
