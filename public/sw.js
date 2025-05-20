// Nom du cache et ressources à mettre en cache initialement
const CACHE_NAME = "icsc-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/images/template128.png",
  "/manifest.json",
];

// Installation du service worker et mise en cache des ressources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files...");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force l'activation sans attendre la fermeture des onglets
  );
});

// Activation du service worker et suppression des anciens caches
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

// Stratégie de récupération des ressources : Cache First, puis réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();

        // Cache seulement les requêtes GET réussies
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

// Optionnel : fonction de fallback
function fetchFallbackPage(request) {
  if (request.destination === "document") {
    return caches.match("/offline.html"); // si tu en as une
  }
  return Response.error(); // ou rien
}

// Gestion des push notifications
self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (err) {
      // Si ce n'est pas du JSON, le traiter comme du texte simple
      payload = { title: "Notification", body: event.data.text() };
    }
  }

  const {
    title = "Notification",
    body = "",
    icon = "./images/template128.png",
    badge = "./images/template128.png",
    image,
    vibrate,
    tag,
    renotify,
    actions,
    data,
    ...others
  } = payload;

  const options = {
    body,
    // Only include if defined
    ...(icon && { icon }),
    ...(badge && { badge }),
    ...(image && { image }),
    ...(vibrate && { vibrate }),
    ...(tag && { tag }),
    ...(renotify === true || renotify === false ? { renotify } : {}),
    ...(Array.isArray(actions) && actions.length ? { actions } : {}),
    data: data || {}, // tu récupères tout ce que tu as passé côté API
    ...others, // propagation de tout nouveau champ non listé
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Action au clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickData = event.notification.data || {};
  const { url, ...rest } = clickData;

  // Exemples de traitement possible :
  // – Ouvrir une URL
  // – Envoyer un fetch vers ton API pour tracker le clic
  // – Brancher un BroadcastChannel…

  const promiseChain = (async () => {
    if (rest.clickTrackUrl) {
      // si tu passes un endpoint pour le tracking dans data.clickTrackUrl
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

// Gestion des synchronisations en arrière-plan (existant)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});
function syncData() {
  // Logique de synchronisation des données
  return Promise.resolve();
}
