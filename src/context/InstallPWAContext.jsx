import { createContext, useContext, useEffect, useState } from "react";

const PWAInstallContext = createContext();

export function PWAInstallProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkStandalone();
    window.addEventListener("visibilitychange", checkStandalone);

    const handleBeforeInstallPrompt = (e) => {
      console.log("📦 beforeinstallprompt triggered");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log("✅ PWA installée !");
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    console.log(
      "🧪 InstallPWAContext mounted, waiting for beforeinstallprompt"
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("visibilitychange", checkStandalone);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ Installation acceptée");
    } else {
      console.log("❌ Installation refusée");
    }

    setDeferredPrompt(null);
  };

  return (
    <PWAInstallContext.Provider
      value={{ deferredPrompt, isInstalled, handleInstallClick }}
    >
      {children}
    </PWAInstallContext.Provider>
  );
}

export function usePWAInstall() {
  return useContext(PWAInstallContext);
}
