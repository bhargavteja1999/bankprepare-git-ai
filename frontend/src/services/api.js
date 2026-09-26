import axios from "axios";

// VITE_API_URL allows Docker override (http://backend:8000) vs local proxy (/api)
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler: clear token on expiry
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // don't auto-redirect on login page itself
      const isAuthRoute = window.location.hash?.includes("login") || window.location.pathname.includes("login");
      if (!isAuthRoute) {
        localStorage.removeItem("bp_token");
        localStorage.removeItem("bp_user");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
