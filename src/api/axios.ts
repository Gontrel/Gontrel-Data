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
const axiosInstance = axios.create({
  ...baseConfig,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
     console.log("responseresponseresponseresponse", response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("responseresponseresponseresponse", error);
      // if (error.response.status === 200) {
      //   if (typeof window !== "undefined") {
      //     // Redirect to login
      //     window.location.href = "/";
      //   }
      // }
    }

    return Promise.reject(error);
  }
);

// --- Unauthenticated Client ---
const unauthenticatedClient = axios.create(baseConfig);

export { axiosInstance, unauthenticatedClient };
