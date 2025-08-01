import axios, { AxiosResponse, AxiosInstance } from "axios";
import { axiosInstance, unauthenticatedClient } from "./axios";
import { parse } from "cookie";
import { ResetPasswordResponse, LoginResponse, CreateLocationRequest, GetRestaurantsRequest, UpdateLocationRequest, ResetPasswordRequest, LoginRequest, GetRestaurantByIdRequest, CreatePostRequest, GetPostsRequest, GetPostByIdRequest, GetAnalystLocationsRequest } from "@/interfaces";

export default class APIRequest {
  private client: AxiosInstance;
  private unauthenticatedClient: AxiosInstance;

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

  // forget password
  forgetPassword = async (data: { email: string }) => {
    const response = await unauthenticatedClient.post(
      `/admin-forgot-password`,
      data
    );
    return this.handleResponse(response);
  };

  resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await unauthenticatedClient.post(`/admin-reset-password`, data);
    return this.handleResponse(response);
  };

  login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await unauthenticatedClient.post(`/admin-login`, data);
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to restaurants.
   *
   */

  // createRestaurant
  createRestaurant = async (data: CreateLocationRequest) => {
    const response = await this.client.post(`/admin-location`, data);
    return this.handleResponse(response);
  };
  // getRestaurants
  getRestaurants = async (data: GetRestaurantsRequest) => {
    const response = await this.client.get(`/admin-locations?pageNumber=${data.pageNumber}&quantity=${data.quantity}&status=${data.status}&query=${data.query}&sortOrder=${data.sortOrder}&sortBy=${data.sortBy}&startDate=${data.startDate}&endDate=${data.endDate}&timeFrame=${data.timeFrame}`);
    return this.handleResponse(response);
  };

  getRestaurantById = async (data: GetRestaurantByIdRequest) => {
    const response = await this.client.get(`/admin-location/${data.id}`);
    return this.handleResponse(response);
  };

  updateRestaurant = async (data: UpdateLocationRequest) => {
    const response = await this.client.put(`/admin-location/${data.id}`, data);
    return this.handleResponse(response);
  };

  getAnalystLocations = async (data: GetAnalystLocationsRequest) => {
    const response = await this.client.get(`/admin-analyst-locations?pageNumber=${data.pageNumber}&quantity=${data.quantity}&query=${data.query}&sortOrder=${data.sortOrder}&sortBy=${data.sortBy}&startDate=${data.startDate}&endDate=${data.endDate}&timeFrame=${data.timeFrame}`);
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to posts.
   *
   */

  // createPost
  createPost = async (data: CreatePostRequest) => {
    const response = await this.client.post(`/admin-post`, data);
    return this.handleResponse(response);
  };
  // getPosts
  getPosts = async (data: GetPostsRequest) => {
    const response = await this.client.get(`/admin-posts?pageNumber=${data.pageNumber}&quantity=${data.quantity}&restaurantId=${data.restaurantId}&query=${data.query}&sortOrder=${data.sortOrder}&sortBy=${data.sortBy}&startDate=${data.startDate}&endDate=${data.endDate}&timeFrame=${data.timeFrame}`);
    return this.handleResponse(response);
  };
  // getPostById
  getPostById = async (data: GetPostByIdRequest) => {
    const response = await this.client.get(`/admin-post-by-id?postId=${data.postId}&userId=${data.userId}`);
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

  // getTiktokDetails
  getTiktokDetails = async (data: { link: string }) => {
    const response = await this.client.get(
      `/tiktok-link-info?link=${data.link}`
    );
    return this.handleResponse(response);
  };
}
