// utils/pushNotifications.js

export const isPushNotificationSupported = () => {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

export const isAppleDevice = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && "ontouchend" in document)
  );
};

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
export const subscribeUserToPush = async (vapidPublicKey, apiUrl) => {
  if (!vapidPublicKey) {
    console.error("No VAPID key.");
    return null;
  }

  if (!isPushNotificationSupported()) {
    console.warn("Push notifications are not supported by this browser.");
    return null;
  }

  if (isAppleDevice() && !isRunningAsPWA()) {
    console.warn(
      "Push notifications on iOS are only available for installed PWAs."
    );
    return null;
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    console.warn("Notification permission denied.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Try to register on the server
    if (apiUrl) {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to register subscription on the server.");
          await subscription.unsubscribe(); // Cleanup
          return null;
        }
      } catch (err) {
        console.error("Network error while registering subscription:", err);
        await subscription.unsubscribe(); // Cleanup
        return null;
      }
    }

    return subscription;
  } catch (error) {
    console.error("Error during push subscription:", error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("Error while asking permission:", err);
    return "denied";
  }
};

export const getNotificationPermissionStatus = () => {
  return typeof Notification !== "undefined"
    ? Notification.permission
    : "unsupported";
};

export const checkPushSubscription = async () => {
  if (!isPushNotificationSupported()) {
    console.warn("Push are unsupported for your device.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Error while verifying subscription:", error);
    return null;
  }
};

export const syncPushSubscriptionWithServer = async () => {
  const localSub = await checkPushSubscription();

  console.log("Local subscription :", localSub);

  if (!localSub) return null;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications/status`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    console.log("Online subscription :", data);

    if (!data.subscribed) {
      await localSub.unsubscribe();
      return null;
    }

    return localSub;
  } catch (err) {
    console.error("Failed to sync subscription with server:", err);
    return localSub; // Fallback to local if server fails
  }
};

export const isRunningAsPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

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
