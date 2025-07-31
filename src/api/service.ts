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
   * @description This class handles API requests related to restaurants.
   *
   */

  // createRestaurant
  createAdminLocation = async (data: any) => {
    const response = await this.client.post(`/admin-location`, data);
    return this.handleResponse(response);
  };

  // getRestaurants
  getRestaurants = async (data: {
    page: number;
    pageSize: number;
    searchTerm: string | undefined;
  }) => {
    const response = await this.client.get(`/admin-locations`);
    return this.handleResponse(response);
  };

  // getARestaurant
  // getARestaurant = async (data: { email: string; password: string }) => {
  //   const response = await axiosInstance.get(`/admin-location`, data);
  //   return this.handleResponse(response);
  // };

  /**
   *
   * @description This class handles API requests related to posts.
   *
   */

  // createPost
  createPost = async (data: any) => {
    const response = await axiosInstance.post(`/admin-post`, data);
    return this.handleResponse(response);
  };
  
  // getAllPosts
  getAllPosts = async () => {
    const response = await axiosInstance.get(`/admin-posts`);
    return this.handleResponse(response);
  };
  
  // getAPost
  getAPost = async (data: { postId: string }) => {
    const response = await axiosInstance.get(
      `/admin-post-by-id?postId=${data.postId}`
    );
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to google map api.
   *
   */

  // placeAutoComplete
  placeAutoComplete = async (data: { query: string; sessionToken: string }) => {
    const response = await this.client.get(
      `/place-auto-complete?query=${data.query}&sessionToken=${data.sessionToken}`
    );
    return this.handleResponse(response);
  };

  // placeDetails
  placeDetails = async (data: { placeId: string; sessionToken: string }) => {
    const response = await this.client.get(
      `/place-details?placeId=${data.placeId}&sessionToken=${data.sessionToken}`
    );
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to tiktok.
   *
   */

  // getTiktokDetails
  getTiktokDetails = async (data: { link: string }) => {
    const response = await this.client.get(
      `/tiktok-link-info?link=${data.link}`
    );
    return this.handleResponse(response);
  };
}
