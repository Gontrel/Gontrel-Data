import { axiosInstance, unauthenticatedClient } from "./axios";
import axios, { AxiosResponse } from "axios";
import { parse } from "cookie";

export default class APIRequest {
  private client;
  private unauthenticatedClient;

  constructor(headers?: any) {

    if (typeof window === "undefined" && headers?.get("cookie")) {
      const cookies = parse(headers.get("cookie"));
      const token = cookies.user_token;

      this.client = axios.create({
        ...axiosInstance.defaults,
        headers: {
          ...axiosInstance.defaults.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      this.client = axiosInstance;
    }

    this.unauthenticatedClient = unauthenticatedClient;
  }

  private handleResponse(response: AxiosResponse) {
    if (typeof response.data === "string") {
      try {
        return JSON.parse(response.data);
      } catch (error) {
        return response.data;
      }
    }
    return response.data;
  }

  private handleError(error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
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
   * @description This class handles API requests related to restaurant.
   *
   */

  // createRestaurant
  createRestaurant = async (data: { email: string; password: string }) => {
    const response = await this.client.post(`/admin-location`, data);
    return this.handleResponse(response);
  };
  // getRestaurants
  getRestaurants = async (data: {
    page: number;
    pageSize: number;
    searchTerm: string | undefined;
  }) => {
    const response = await this.client.get(
      `/admin-locations/`
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
