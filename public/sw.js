// Nom du cache et ressources à mettre en cache initialement
const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/scripts/main.js",
  "/images/template128.png",
  // Ajoutez ici toutes les ressources importantes pour votre application
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
    caches.match(event.request).then((response) => {
      // Cache hit - retourne la réponse du cache
      if (response) {
        return response;
      }

      // Faire une copie de la requête car elle ne peut être utilisée qu'une fois
      return fetch(event.request.clone())
        .then((response) => {
          // Vérifie si nous avons reçu une réponse valide
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Mettre en cache la nouvelle ressource
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Fallback pour les ressources qui ne peuvent pas être récupérées
          // Vous pouvez retourner une page offline.html par exemple
        });
    })
  );
});

// Gestion des push notifications
self.addEventListener("push", (event) => {
  let data = {};
  console.log(event.data);
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body || "Tu as un nouveau message.",
    icon: "./images/template128.png",
    badge: "./images/template128.png",
    data: {
      url: data.url || "/", // URL à ouvrir en cliquant
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Action au clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});

// Gestion des synchronisations en arrière-plan
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

// Fonction pour synchroniser les données en arrière-plan
function syncData() {
  // Logique de synchronisation des données
  return Promise.resolve();
}
