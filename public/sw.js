const CACHE = "moi-zveryata-v6";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      self.registration.scope,
      `${self.registration.scope}manifest.webmanifest`,
      `${self.registration.scope}icon-192.png`,
      `${self.registration.scope}icon-512.png`,
      `${self.registration.scope}ryzhik-scene-v2.jpg`,
      `${self.registration.scope}zvezdochka-scene-v2.jpg`,
      `${self.registration.scope}ryzhik-eat-1.jpg`,
      `${self.registration.scope}ryzhik-eat-2.jpg`,
      `${self.registration.scope}ryzhik-eat-3.jpg`,
      `${self.registration.scope}ryzhik-eat-4.jpg`,
      `${self.registration.scope}zvezdochka-eat-1.jpg`,
      `${self.registration.scope}zvezdochka-eat-2.jpg`,
      `${self.registration.scope}zvezdochka-eat-3.jpg`,
      `${self.registration.scope}zvezdochka-eat-4.jpg`,
    ])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(self.registration.scope, copy));
        }
        return response;
      }).catch(() => caches.match(self.registration.scope)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(self.registration.scope))),
  );
});
