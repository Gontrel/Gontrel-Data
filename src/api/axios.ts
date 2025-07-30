import axios from "axios";
import { serialize, parse } from "cookie";

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
    console.log("Request made with ", config.headers);
    const cookieHeader = config?.headers?.cookie ?? "";
    const cookies = parse(
      typeof cookieHeader === "string" ? cookieHeader : String(cookieHeader)
    );
    const token = cookies.user_token;

    if (!token) {
      throw new Error("Auth token is missing or expired");
    }

    console.log("Cookie", token);

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Unauthenticated Client ---
const unauthenticatedClient = axios.create(baseConfig);

export { axiosInstance, unauthenticatedClient };
