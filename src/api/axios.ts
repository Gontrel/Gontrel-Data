import { errorToast } from "@/utils/toast";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

// --- Base Client Configuration ---
const baseConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY || "",
  },
  validateStatus: (status: number) => status >= 200 && status < 300,
};

const axiosInstance = axios.create({
  ...baseConfig,
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        errorToast("Session expired. Please login again.");

        localStorage.removeItem("authState");
        sessionStorage.removeItem("authState");

        window.location.href = "/";
      }

      return Promise.reject({
        ...error,
        isUnauthorized: true,
        message: "Authentication required",
      });
    }

    return Promise.reject(error);
  }
);

// --- Unauthenticated Client ---
const unauthenticatedClient = axios.create(baseConfig);

export { axiosInstance, unauthenticatedClient };
