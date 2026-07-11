import { errorToast } from "@/utils/toast";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL =
  (typeof window === "undefined"
    ? process.env.API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";
const API_KEY =
  (typeof window === "undefined"
    ? process.env.API_KEY
    : process.env.NEXT_PUBLIC_API_KEY) || "";

// --- Base Client Configuration ---
const baseConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  timeout: 30000, // Increased from 10s to 30s for slow networks
  withCredentials: true,
  // Retry configuration for transient network failures
  maxRedirects: 0,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY || "",
    Accept: "application/json",
  },
  validateStatus: (status: number) => status >= 200 && status < 300,
};

const axiosInstance = axios.create({
  ...baseConfig,
  withCredentials: true,
});


const unauthenticatedClient = axios.create({
  ...baseConfig,
  withCredentials: true, 
});

// Helper: safe error log poster (avoid recursion)
const postErrorLogSafely = async (
  client: typeof axiosInstance,
  payload: { log: string }
) => {
  try {
    if (!client.defaults.baseURL) return;
    const url = "/error-log";
    if (typeof payload?.log === "string" && payload.log.includes(url)) return;

    await client.post(url, payload);
  } catch {}
};

// Response error interceptors for both clients
const attachErrorInterceptor = (client: typeof axiosInstance) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      // Handle network errors (timeout, CORS, connection refused, etc.)
      if (!error.response) {
        const isTimeout =
          error.code === "ECONNABORTED" || error.message.includes("timeout");
        const isNetworkError =
          error.message === "Network Error" || error.code === "ERR_NETWORK";

        if (isTimeout) {
          errorToast(
            "Request timed out. Please check your connection and try again."
          );
        } else if (isNetworkError) {
          errorToast("Network error. Please check your connection.");
        } else {
          errorToast("Unable to connect to server. Please try again.");
        }

        return Promise.reject({
          ...error,
          isNetworkError: true,
          message: error.message || "Network error occurred",
        });
      }

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
        if (error.response?.status) {
          parts.push(`Status: ${error.response.status}`);
        }
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
