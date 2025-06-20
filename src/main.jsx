import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "flag-icon-css/css/flag-icons.min.css";
import CustomErrorBoundary from "./components/CustomErrorBoundary/CustomErrorBoundary.jsx";
import { PWAInstallProvider } from "./context/InstallPWAContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker enregistré :", registration);
      })
      .catch((error) => {
        console.error("Erreur ServiceWorker :", error);
      });
  });
}

if (process.env.NODE_ENV === "development") {
  root.render(
    <StrictMode>
      <PWAInstallProvider>
        <CustomErrorBoundary>
          <App />
        </CustomErrorBoundary>
      </PWAInstallProvider>
    </StrictMode>
  );
} else {
  root.render(
    <PWAInstallProvider>
      <CustomErrorBoundary>
        <App />
      </CustomErrorBoundary>
    </PWAInstallProvider>
  );
}
