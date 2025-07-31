import axios from "axios";

const API_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

// --- Base Client Configuration ---
const baseConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY || "",
  },
  validateStatus: (status: number) => status >= 200 && status < 300,
};

// --- Authenticated Client ---
const axiosInstance = axios.create(baseConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Authenticated Client with JWT ---
const authenticatedClient = axios.create(baseConfig);

authenticatedClient.interceptors.request.use(
  (config) => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('user_token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Unauthenticated Client ---
const unauthenticatedClient = axios.create(baseConfig);

export { axiosInstance, unauthenticatedClient, authenticatedClient };
