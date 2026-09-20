import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// API call logger to detect repeated requests
const apiCallLog = {};
const MAX_LOGS = 100;

// Attach token from localStorage as Authorization header if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("customerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log API calls for debugging
  const key = `${config.method?.toUpperCase()} ${config.url}`;
  const timestamp = new Date().toLocaleTimeString();
  
  if (!apiCallLog[key]) {
    apiCallLog[key] = [];
  }
  apiCallLog[key].push(timestamp);
  
  // Keep only recent logs
  if (apiCallLog[key].length > 10) {
    apiCallLog[key] = apiCallLog[key].slice(-10);
  }
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${key} (Call #${apiCallLog[key].length})`);
  }
  
  return config;
});

// Expose logs globally for debugging
if (import.meta.env.DEV) {
  window.__apiLogs = apiCallLog;
  console.log("💡 Tip: Use window.__apiLogs in console to see API call history");
}

export default api;
