import axios from "axios";

// Works for both: VITE_API_URL=https://api.example.com  OR https://api.example.com/api
const RAW = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
);
export const API_ROOT = RAW;
export const API_BASE = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

const api = axios.create({
  baseURL: API_BASE,
});

// Auto-attach token
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
