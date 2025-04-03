import React, { createContext, useState, useContext, useEffect } from "react";
import { useFeedback } from "./FeedbackContext";

// Créer le context
const AuthContext = createContext();

// Custom hook pour utiliser l'authentification
const useAuth = () => {
  return useContext(AuthContext);
};
export { useAuth };
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const { showFeedback } = useFeedback();
  const API_URL = import.meta.env.VITE_API_URL;

  // Vérifier la présence du cookie token à chaque montage
  useEffect(() => {
    // Vérifier si le cookie est présent
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/Admin-auth/check-auth`, {
          method: "GET",
          credentials: "include", // Envoie le cookie avec la requête
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoggingIn(true);
    try {
      const response = await fetch(`${API_URL}/Admin-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Envoie le cookie lors de la connexion
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        showFeedback("success", data.message);
      } else {
        showFeedback("error", data.message);
        console.error(data);
      }
    } catch (error) {
      showFeedback("error", "Connexion error");
      console.error("Login error:", error);
    }
    setLoggingIn(false);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/Admin-auth/logout`, {
        method: "POST",
        credentials: "include", // Envoie le cookie lors de la déconnexion
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(false);
        showFeedback("success", data.message);
      } else {
        showFeedback("error", "Erreur lors de la déconnexion");
      }
    } catch (error) {
      showFeedback("error", "Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
