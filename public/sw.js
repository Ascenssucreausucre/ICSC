const CACHE_NAME = "icsc-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/images/template128.png",
  "/manifest.json",
];

// SW's installation
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files...");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// SW's activation and deletion of the old versions
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Prendre le contrôle immédiatement
  );
});

// Caching fetch request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();

        if (event.request.method === "GET" && response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }

        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetchFallbackPage(event.request);
        })
      )
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (err) {
      payload = { title: "Notification", body: event.data.text() };
    }
  }

  const {
    title = "Notification",
    body = "",
    icon = "./images/template128.png",
    badge = "./images/default-badge.svg",
    image,
    vibrate,
    tag,
    renotify,
    actions,
    data,
    url = "/",
    ...others
  } = payload;

  const options = {
    body,
    // Only include if defined
    ...(icon?.length > 0 && { icon }),
    ...(badge?.length > 0 && { badge }),
    ...(image?.length > 0 && { image }),
    ...(vibrate && { vibrate }),
    ...(tag && { tag }),
    ...(url && { url }),
    ...(renotify === true || renotify === false ? { renotify } : {}),
    ...(Array.isArray(actions) && actions?.length ? { actions } : {}),
    data: data || {},
    ...others,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// On notification clic
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickData = event.notification.data || {};
  const { url, ...rest } = clickData;

  // Exemples de traitement possible :
  // – open an URL
  // – Send a request to API to track clics
  // – Plug-in BroadcastChannel…

  const promiseChain = (async () => {
    if (rest.clickTrackUrl) {
      // if there's an endpoint for tracking with data.clickTrackUrl
      await fetch(rest.clickTrackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    }

    if (url) {
      return clients.openWindow(url);
    }
  })();

  event.waitUntil(promiseChain);
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});
function syncData() {
  // Logique de synchronisation des données
  return Promise.resolve();
}
