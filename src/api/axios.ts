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

// --- Unauthenticated Client ---
const unauthenticatedClient = axios.create(baseConfig);

// Helper: safe error log poster (avoid recursion)
const postErrorLogSafely = async (client: typeof axiosInstance, payload: { log: string }) => {
  try {
    if (!client.defaults.baseURL) return;
    const url = "/error-log";
    if (typeof payload?.log === "string" && payload.log.includes(url)) return;

    await client.post(url, payload);
  } catch {
  }
};

// Response error interceptors for both clients
const attachErrorInterceptor = (client: typeof axiosInstance) => {
  client.interceptors.response.use(
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

      // Prepare log payload
      try {
        const parts: string[] = [];
        parts.push(`Error: ${error.message || "Unknown error"}`);
        await postErrorLogSafely(client, { log: parts.join(" | ") });
      } catch {
        // ignore logging errors
      }

      return Promise.reject(error);
    }
  );
};

attachErrorInterceptor(axiosInstance);
attachErrorInterceptor(unauthenticatedClient);

export { axiosInstance, unauthenticatedClient };