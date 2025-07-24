import { asyncLocalStorage } from "@/helpers/storage";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL, // Set your base URL https://api.bsjsakss/com/api
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  },
});

const resetAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await asyncLocalStorage.getItem("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("unauthorized");

      await asyncLocalStorage.removeItem("user_token");
      window.location.replace("/");
      return;
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, resetAxiosInstance };
