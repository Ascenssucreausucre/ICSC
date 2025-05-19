// Gestion des push
self.addEventListener("push", (event) => {
  let data = {};
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

// Action au clic sur la notif
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
