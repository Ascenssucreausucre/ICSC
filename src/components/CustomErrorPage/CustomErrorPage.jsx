import { useRouteError } from "react-router-dom";
import "./CustomErrorPage.css";

export default function CustomErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <div className="error-card card">
        <h1>Oops! An error has occured.</h1>
        <p>{error?.message || "Erreur inconnue."}</p>
      </div>
    </div>
  );
}
