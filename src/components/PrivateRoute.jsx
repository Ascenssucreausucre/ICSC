import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Composant guard privé pour rediriger si l'utilisateur n'est pas authentifié
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  // Si authentifié, on rend l'outlet de la route protégée
  return <Outlet />;
};

export default PrivateRoute;
