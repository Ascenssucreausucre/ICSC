// utils/pushNotifications.js
// J'adapte légèrement ce fichier pour qu'il soit plus modulaire et utilisable dans différents contextes

// Conversion de la clé VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// Demande la permission de notifications et retourne le statut
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("Erreur lors de la demande de permission:", err);
    return "denied";
  }
};

// Vérifie l'état actuel des permissions de notification
export const getNotificationPermissionStatus = () => {
  return Notification.permission;
};

// S'abonne aux notifications push
export const subscribeUserToPush = async (vapidPublicKey, apiUrl) => {
  if (!vapidPublicKey) {
    console.error("Clé VAPID manquante");
    return null;
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    console.warn("Permission de notification refusée");
    return null;
  }

  try {
    // Vérifie si le service worker est disponible
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker non pris en charge");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Si un URL d'API est fourni, envoie la subscription au serveur
    if (apiUrl) {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Subscription aux notifications a échoué.");
      }
    }

    return subscription;
  } catch (error) {
    console.error("Erreur lors de l'abonnement aux notifications:", error);
    return null;
  }
};

// Vérifie si l'utilisateur est déjà abonné aux notifications push
export const checkPushSubscription = async () => {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'abonnement:", error);
    return null;
  }
};

// Exporte les fonctions principales et l'utilitaire
export default {
  subscribeUserToPush,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  checkPushSubscription,
  urlBase64ToUint8Array,
};
