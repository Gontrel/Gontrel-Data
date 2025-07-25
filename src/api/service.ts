import { unauthenticatedClient } from "./axios";
import { AxiosResponse } from "axios";

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
    const response = await unauthenticatedClient.post(
      `/admin-forgot-password`,
      data
    );
    return this.handleResponse(response);
  };

  // reset password
  resetPassword = async (data: {
    newPassword: string;
    otpCode: string;
    token: string;
  }) => {
    const response = await unauthenticatedClient.post(
      `/admin-reset-password`,
      data
    );
    return this.handleResponse(response);
  };

  // login
  login = async (data: { email: string; password: string }) => {
    const response = await unauthenticatedClient.post(`/admin-login`, data);
    return this.handleResponse(response);
  };
}
