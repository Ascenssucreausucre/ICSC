import { useEffect, useState } from "react";

export default function InstallPWAModule({ renderButton = true }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsFirefox(userAgent.includes("firefox"));

    // Vérifie si la PWA est déjà installée (en standalone)
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkStandalone();
    window.addEventListener("visibilitychange", checkStandalone);

    // Écoute l'événement pour installation possible
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // On bloque l'invite native
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Écoute installation effective
    const handleAppInstalled = () => {
      console.log("✅ PWA installée !");
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("visibilitychange", checkStandalone);
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

    setDeferredPrompt(null); // L’événement ne peut être utilisé qu’une fois
  };

  return {
    deferredPrompt,
    isInstalled,
    isFirefox,
    handleInstallClick,
    button:
      renderButton && deferredPrompt && !isInstalled ? (
        <button onClick={handleInstallClick} className="cta-button">
          📱 Installer l'application
        </button>
      ) : null,
  };
}
