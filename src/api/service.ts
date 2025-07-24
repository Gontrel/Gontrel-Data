import { axiosInstance } from "./axios";
import { AxiosResponse } from "axios";
import { asyncLocalStorage } from "@/helpers/storage";

export default class APIRequest {
  private async handleResponse(response: AxiosResponse) {
    try {
      return JSON.parse(response.data);
    } catch (error) {
      return response.data; // Return as is if not valid JSON
    }
  }
  // onboarding
  verifyOTP = async (
    data: { otp_contact: string; otp_code: string },
    reference: string
  ) => {
    const response = await axiosInstance.post(
      `/otp/${reference}/validate`,
      data
    );
    return this.handleResponse(response);
  };

  forgetPassword = async (data: { email: string }) => {
    const response = await axiosInstance.post(`/admin-forgot-password`, data);
    return this.handleResponse(response);
  };

  // forgot password
  resetPassword = async (data: { newPassword: string; otpCode: string }) => {
    const token = await asyncLocalStorage.getItem("user_token");
    const response = await axiosInstance.post(`/admin-reset-password`, {
      ...data,
      token,
    });
    return this.handleResponse(response);
  };

  // login
  login = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post(`/admin-login`, data);
    console.log("Login response:", response.data);
    console.log("Logging in with data:", data);
    return this.handleResponse(response);
  };
}
