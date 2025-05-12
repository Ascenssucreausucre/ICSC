import React, { createContext, useState, useContext, useEffect } from "react";
import { useFeedback } from "./FeedbackContext";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(null); // 👈 rôle ajouté ici
  const [isLoading, setIsLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();
  const API_URL = import.meta.env.VITE_API_URL;

  // Vérifier l'authentification et récupérer le rôle
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/admin-auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setAdminRole(data.role); // 👈 on stocke le rôle
        } else {
          setIsAuthenticated(false);
          setAdminRole(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setAdminRole(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoggingIn(true);
    try {
      const response = await fetch(`${API_URL}/admin-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        showFeedback("success", "Logged in successfully");

        // Récupérer le rôle après login
        const meRes = await fetch(`${API_URL}/admin-auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (meRes.ok) {
          const meData = await meRes.json();
          setAdminRole(meData.role);
        }
      } else {
        console.error(data);
        showFeedback("error", data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      showFeedback("error", error.error);
    }
    setLoggingIn(false);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/admin-auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(false);
        setAdminRole(null);
        showFeedback("success", data.message);
        navigate("/admin/login");
      } else {
        showFeedback("error", "Erreur lors de la déconnexion");
      }
    } catch (error) {
      showFeedback("error", "Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        loggingIn,
        adminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
