// This context provides authenticated user state and helpers (login, logout, etc.)
// to the entire React tree. It powers route protection and conditional UI for
// Admin vs Student roles in a clean, centralized way.

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/client.js";

const AuthContext = createContext(null);

// This hook is the primary way components consume auth data.
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, we call `/auth/me` to restore any existing session from cookies.
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // This helper wraps the login API and stores the resulting user object.
  const login = async (email, password) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    setUser(data.user);
    return data;
  };

  // This helper wraps the register API for Student/Admin accounts.
  const register = async (payload) => {
    const { data } = await apiClient.post("/auth/register", payload);
    setUser(data.user);
    return data;
  };

  // This helper logs out from the backend and clears the user state.
  const logout = async () => {
    await apiClient.post("/auth/logout");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

