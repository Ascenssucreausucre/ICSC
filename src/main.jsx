import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "flag-icon-css/css/flag-icons.min.css";
import CustomErrorBoundary from "./components/CustomErrorBoundary/CustomErrorBoundary.jsx";

// Activation de StrictMode uniquement en développement
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

if (process.env.NODE_ENV === "development") {
  root.render(
    <StrictMode>
      <CustomErrorBoundary>
        <App />
      </CustomErrorBoundary>
    </StrictMode>
  );
} else {
  root.render(
    <CustomErrorBoundary>
      <App />
    </CustomErrorBoundary>
  );
}
