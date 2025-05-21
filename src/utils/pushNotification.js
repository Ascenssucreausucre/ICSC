// utils/pushNotifications.js

// Vérifie si les push notifications sont supportées par le navigateur
export const isPushNotificationSupported = () => {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

// Vérifie si l'appareil est un appareil Apple (iOS ou macOS avec écran tactile)
export const isAppleDevice = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && "ontouchend" in document)
  );
};

// Conversion de la clé VAPID
function urlBase64ToUint8Array(base64String) {
  try {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  } catch (e) {
    console.error("Erreur de décodage Base64:", e);
    return new Uint8Array();
  }
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

  if (!isPushNotificationSupported()) {
    console.warn("Notifications push non supportées par ce navigateur.");
    return null;
  }

  if (isAppleDevice() && !isRunningAsPWA()) {
    console.warn(
      "Les notifications push ne sont disponibles sur iOS que pour les PWA installées."
    );
    return null;
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    console.warn("Permission de notification refusée");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    if (apiUrl) {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error(
          "Échec de l'enregistrement de la subscription sur le serveur."
        );
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
  if (!isPushNotificationSupported()) {
    console.warn("Push non supporté.");
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

export const isRunningAsPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

// Exporte les fonctions principales et l'utilitaire
export default {
  subscribeUserToPush,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  checkPushSubscription,
  urlBase64ToUint8Array,
  isPushNotificationSupported,
  isAppleDevice,
  isRunningAsPWA,
};
