import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bp_user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("bp_token") || null);
  const [loading, setLoading] = useState(false);

  const isLogged = !!token && !!user;

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("bp_token", res.access_token);
      localStorage.setItem("bp_user", JSON.stringify(res.user));
      setToken(res.access_token);
      setUser(res.user);
      return res;
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      localStorage.setItem("bp_token", res.access_token);
      localStorage.setItem("bp_user", JSON.stringify(res.user));
      setToken(res.access_token);
      setUser(res.user);
      return res;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("bp_token");
    localStorage.removeItem("bp_user");
    setToken(null);
    setUser(null);
  }, []);

  // verify token on mount
  useEffect(() => {
    if (!token) return;
    authApi.me().catch(() => logout());
  }, []); // run once

  return (
    <AuthContext.Provider value={{ user, token, isLogged, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export default AuthContext;
