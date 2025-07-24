import { axiosInstance } from "./axios";
import { AxiosResponse } from "axios";
import { asyncLocalStorage } from "@/helpers/storage";

export default class APIRequest {
  private handleResponse(response: AxiosResponse) {
    if (typeof response.data === "string") {
      try {
        return JSON.parse(response.data);
      } catch (e) {
        // Not a valid JSON string, return as is
        return response.data;
      }
    }
    return response.data;
  }
  // forget password
  forgetPassword = async (data: { email: string }) => {
    const response = await axiosInstance.post(`/admin-forgot-password`, data);
    return this.handleResponse(response);
  };

  // reset password
  resetPassword = async (data: { newPassword: string; otpCode: string }) => {
    const token = await asyncLocalStorage.getItem<string>("reset_token");
    if (!token) {
      throw new Error(
        "Reset token is missing. Please try the 'forgot password' process again."
      );
    }
    const response = await axiosInstance.post(`/admin-reset-password`, {
      ...data,
      token,
    });
    return this.handleResponse(response);
  };

  // login
  login = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post(`/admin-login`, data);
    return this.handleResponse(response);
  };
}
