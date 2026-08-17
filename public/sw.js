const CACHE = "moi-zveryata-v8";

const PLAYGROUND = [
  "playground/",
  "playground/LICENSE",
  "playground/src/AudioManager.js",
  "playground/src/Background.js",
  "playground/src/CollectionManager.js",
  "playground/src/ColoringScene.js",
  "playground/src/DrawingLayer.js",
  "playground/src/GameLoop.js",
  "playground/src/GoalManager.js",
  "playground/src/InputManager.js",
  "playground/src/KeyLabel.js",
  "playground/src/MusicManager.js",
  "playground/src/MusicScene.js",
  "playground/src/ParticleSystem.js",
  "playground/src/SceneManager.js",
  "playground/src/World.js",
  "playground/src/main.js",
  "playground/src/actors/Actor.js",
  "playground/src/actors/Astronaut.js",
  "playground/src/actors/Ball.js",
  "playground/src/actors/Butterfly.js",
  "playground/src/actors/Car.js",
  "playground/src/actors/Companion.js",
  "playground/src/actors/Fish.js",
  "playground/src/actors/LaunchPad.js",
  "playground/src/actors/Rocket.js",
  "playground/src/actors/Star.js",
  "playground/src/actors/Target.js",
];

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
      `${self.registration.scope}ryzhik-care-1.jpg`,
      `${self.registration.scope}ryzhik-care-2.jpg`,
      `${self.registration.scope}ryzhik-care-3.jpg`,
      `${self.registration.scope}ryzhik-care-4.jpg`,
      `${self.registration.scope}zvezdochka-care-1.jpg`,
      `${self.registration.scope}zvezdochka-care-2.jpg`,
      `${self.registration.scope}zvezdochka-care-3.jpg`,
      `${self.registration.scope}zvezdochka-care-4.jpg`,
      `${self.registration.scope}ryzhik-sleep-1.jpg`,
      `${self.registration.scope}ryzhik-sleep-2.jpg`,
      `${self.registration.scope}ryzhik-sleep-3.jpg`,
      `${self.registration.scope}ryzhik-sleep-4.jpg`,
      `${self.registration.scope}zvezdochka-sleep-1.jpg`,
      `${self.registration.scope}zvezdochka-sleep-2.jpg`,
      `${self.registration.scope}zvezdochka-sleep-3.jpg`,
      `${self.registration.scope}zvezdochka-sleep-4.jpg`,
      ...PLAYGROUND.map((path) => `${self.registration.scope}${path}`),
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
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match(self.registration.scope))),
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
