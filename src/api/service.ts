import axios, { AxiosResponse, AxiosInstance } from "axios";
import { axiosInstance, unauthenticatedClient } from "./axios";
import { parse } from "cookie";
import {
  ResetPasswordResponse,
  LoginResponse,
  CreateLocationRequest,
  FetchLocationsRequest,
  UpdateLocationRequest,
  AdminResetPasswordRequest,
  AdminLoginRequest,
  FetchLocationByIdRequest,
  CreatePostRequest,
  FetchAdminPostsRequest,
  FetchPostByIdRequest,
  FetchAnalystLocationsRequest,
  UpdatePostRequest
} from "@/interfaces";

export default class APIRequest {
  private authenticatedClient: AxiosInstance;
  private unauthenticatedClient: AxiosInstance;

  constructor(headers?: Headers) {
    if (typeof window === "undefined" && headers?.get("cookie")) {
      const cookieHeader = headers.get("cookie");
      if (cookieHeader) {
        const cookies = parse(cookieHeader);
        const token = cookies.user_token;

      this.authenticatedClient = axios.create({
        ...axiosInstance.defaults,
        headers: {
          ...axiosInstance.defaults.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      } else {
        this.authenticatedClient = axiosInstance;
      }
    } else {
      this.authenticatedClient = axiosInstance;
    }

    this.unauthenticatedClient = unauthenticatedClient;
  }

  private handleResponse(response: AxiosResponse) {
    if (typeof response.data === "string") {
      try {
        return JSON.parse(response.data);
      } catch {
        return response.data;
      }
    }
    return response.data;
  }

  /**
   * Utility method to build URL search parameters from an object
   * Automatically handles undefined values, type conversion, and empty filtering
   */
  private buildSearchParams(params: Record<string, unknown> | object): URLSearchParams {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams;
  }

  // forget password
  forgetPassword = async (data: { email: string }) => {
    const response = await unauthenticatedClient.post(
      `/admin-forgot-password`,
      data
    );
    return this.handleResponse(response);
  };

  resetPassword = async (data: AdminResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await unauthenticatedClient.post(`/admin-reset-password`, data);
    return this.handleResponse(response);
  };

  login = async (data: AdminLoginRequest): Promise<LoginResponse> => {
    const response = await unauthenticatedClient.post(`/admin-login`, data);
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to restaurants.
   *
   */

  // createRestaurant
<<<<<<< HEAD
  createRestaurant = async (data: CreateLocationRequest) => {
    const response = await this.authenticatedClient.post(`/admin-location`, data);
    return this.handleResponse(response);
  };
=======
  createAdminLocation = async (data: any) => {
    const response = await this.client.post(`/admin-location`, data);
    return this.handleResponse(response);
  };

>>>>>>> 3e1d6a2f3280ed9750c9a1965f56ff9a1efbfbaf
  // getRestaurants
  getRestaurants = async (data: FetchLocationsRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(`/admin-locations?${params.toString()}`);
    return this.handleResponse(response);
  };

  getRestaurantById = async (data: FetchLocationByIdRequest) => {
    const response = await this.authenticatedClient.get(`/admin-location/${data.locationId}`);
    return this.handleResponse(response);
  };

  updateRestaurant = async (data: UpdateLocationRequest) => {
    const response = await this.authenticatedClient.put(`/admin-location/${data.locationId}`, data);
    return this.handleResponse(response);
  };

  getAnalystLocations = async (data: FetchAnalystLocationsRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(`/admin-analyst-locations?${params.toString()}`);
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to posts.
   *
   */

  // createPost
<<<<<<< HEAD
  createPost = async (data: CreatePostRequest) => {
    const response = await this.authenticatedClient.post(`/admin-post`, data);
    return this.handleResponse(response);
  };
  // getPosts
  getPosts = async (data: FetchAdminPostsRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(`/admin-posts?${params.toString()}`);
    return this.handleResponse(response);
  };
  // getPostById
  getPostById = async (data: FetchPostByIdRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(`/admin-post-by-id?${params.toString()}`);
    return this.handleResponse(response);
  };

  // updatePost
  updatePost = async (data: UpdatePostRequest) => {
    const response = await this.authenticatedClient.put(`/admin-post`, data);
=======
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
>>>>>>> 3e1d6a2f3280ed9750c9a1965f56ff9a1efbfbaf
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to google map api.
   *
   */

  // placeAutoComplete
  placeAutoComplete = async (data: { query: string; sessionToken: string }) => {
    const response = await this.authenticatedClient.get(
      `/place-auto-complete?query=${data.query}&sessionToken=${data.sessionToken}`
    );
    return this.handleResponse(response);
  };

  // placeDetails
  placeDetails = async (data: { placeId: string; sessionToken: string }) => {
    const response = await this.authenticatedClient.get(
      `/place-details?placeId=${data.placeId}&sessionToken=${data.sessionToken}`
    );
    return this.handleResponse(response);
  };

  // getTiktokDetails
  getTiktokDetails = async (data: { link: string }) => {
    const response = await this.authenticatedClient.get(
      `/tiktok-link-info?link=${data.link}`
    );
    return this.handleResponse(response);
  };
}
