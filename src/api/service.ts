import { axiosInstance, unauthenticatedClient } from "./axios";
import { AxiosResponse } from "axios";

export default class APIRequest {
  private handleResponse(response: AxiosResponse) {
    if (typeof response.data === "string") {
      try {
        return JSON.parse(response.data);
      } catch {
        // Not a valid JSON string, return as is
        return response.data;
      }
    }
    return response.data;
  }

  /**
   *
   * @description This class handles API requests related to authentication.
   *
   */

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

  /**
   *
   * @description This class handles API requests related to restuarant.
   *
   */

  // createRestuarant
  createRestuarant = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post(`/admin-location`, data);
    return this.handleResponse(response);
  };
  // getRestaurants
  getRestaurants = async (data: {
    page: number;
    pageSize: number;
    searchTerm: string | undefined;
  }) => {
    const response = await axiosInstance.get(
      `/admin-locations?pageNumber=${data.page}&pageSize=${data.pageSize}&searchTerm=${data.searchTerm}`
    );
    return this.handleResponse(response);
  };
  // getARestuarant
  // getARestuarant = async (data: { email: string; password: string }) => {
  //   const response = await axiosInstance.get(`/admin-location`, data);
  //   return this.handleResponse(response);
  // };

  /**
   *
   * @description This class handles API requests related to posts.
   *
   */

  // createPost
  // createPost = async (data: { title: string; content: string }) => {
  //   const response = await axiosInstance.post(`/admin-post`, data);
  //   return this.handleResponse(response);
  // };
  // // getAllPosts
  // getAllPosts = async (data: { email: string; password: string }) => {
  //   const response = await axiosInstance.get(`/admin-posts`, data);
  //   return this.handleResponse(response);
  // };
  // // createPost
  // getAPost = async (data: { email: string; password: string }) => {
  //   const response = await axiosInstance.get(
  //     `/admin-post-by-id?postId=${data.postId}`,
  //     data
  //   );
  //   return this.handleResponse(response);
  // };

  /**
   *
   * @description This class handles API requests related to google map api.
   *
   */

  // placeAutocompletion
  // placeAutocompletion = async (data: { title: string; content: string }) => {
  //   const response = await axiosInstance.get(`/admin-login`, data);
  //   return this.handleResponse(response);
  // };
  // // placeDetails
  // placeDetails = async (data: { email: string; password: string }) => {
  //   const response = await axiosInstance.get(`/admin-login`, data);
  //   return this.handleResponse(response);
  // };

  /**
   *
   * @description This class handles API requests related to tiktok.
   *
   */

  // getTiktokDetails
  // getTiktokDetails = async (data: { title: string; content: string }) => {
  //   const response = await axiosInstance.get(`/admin-login`, data);
  //   return this.handleResponse(response);
  // };
}
