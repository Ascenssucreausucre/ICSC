import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "./FeedbackContext";

const API_URL = import.meta.env.VITE_API_URL;

const UserAuthContext = createContext();

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();

  useEffect(() => {
    const checkUserAuth = async () => {
      console.log("Checking user authentication...");
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/user/profile`, {
          withCredentials: true,
        });
        // showFeedback("sucess", response.data.message);
        setIsAuthenticated(true);
        setUserData(response.data.id);
      } catch (error) {
        // console.error(error.response.data.error);
        // showFeedback("error", error.response.data.error);
        setIsAuthenticated(false);
        setUserData({});
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const login = async (email, password) => {
    setLoggingIn(true);
    try {
      const response = await axios.post(
        `${API_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUserData(response.data.id);
      showFeedback("success", response.data?.message || "Login successful");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.message ||
        "Login failed";
      showFeedback("error", message);
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    setLoggingIn(true);
    try {
      const response = await axios.post(`${API_URL}/user/logout`, null, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUserData({});
      showFeedback("success", response.data?.message || "Logout successful");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.message ||
        "Logout failed";
      showFeedback("error", message);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        loggingIn,
        login,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
