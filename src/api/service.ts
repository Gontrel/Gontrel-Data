import { unauthenticatedClient, authenticatedClient } from "./axios";
import { AxiosResponse } from "axios";
import * as Requests from "../types/requests";
import * as Responses from "../types/responses";

export default class APIRequest {
  private handleResponse<T>(response: AxiosResponse<T>): T {
    if (typeof response.data === "string") {
      try {
        return JSON.parse(response.data);
      } catch {
        return response.data as T;
      }
    }
    return response.data;
  }

  private getAuthenticatedClient() {
    return authenticatedClient;
  }

  // Authentication
  forgetPassword = async (data: Requests.ForgotPasswordRequest): Promise<Responses.ForgotPasswordResponse> => {
    const response = await unauthenticatedClient.post(`/admin-forgot-password`, data);
    return this.handleResponse(response);
  };

  resetPassword = async (data: Requests.ResetPasswordRequest): Promise<Responses.ResetPasswordResponse> => {
    const response = await unauthenticatedClient.post(`/admin-reset-password`, data);
    return this.handleResponse(response);
  };

  login = async (data: Requests.LoginRequest): Promise<Responses.LoginResponse> => {
    const response = await unauthenticatedClient.post(`/admin-login`, data);
    return this.handleResponse(response);
  };

  // Admin management
  createAdmin = async (data: Requests.CreateAdminRequest): Promise<Responses.CreateAdminResponse> => {
    const response = await unauthenticatedClient.post(`/create-admin`, data);
    return this.handleResponse(response);
  };

  getAdminProfile = async (): Promise<Responses.GetAdminProfileResponse> => {
    const response = await this.getAuthenticatedClient().get(`/get-admin-profile`);
    return this.handleResponse(response);
  };

  // Location management
  getRestaurants = async (params: Requests.GetRestaurantsParams): Promise<Responses.GetRestaurantsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-locations`, { params });
    return this.handleResponse(response);
  };

  getRestaurantById = async (id: string): Promise<Responses.GetRestaurantByIdResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-location-by-id`, {
      params: { locationId: id },
    });
    return this.handleResponse(response);
  };

  createRestaurant = async (data: Requests.CreateLocationRequest): Promise<Responses.CreateLocationResponse> => {
    const response = await this.getAuthenticatedClient().post(`/admin-location`, data);
    return this.handleResponse(response);
  };

  updateRestaurant = async (data: Requests.UpdateLocationRequest): Promise<Responses.UpdateLocationResponse> => {
    const response = await this.getAuthenticatedClient().put(`/admin-location`, data);
    return this.handleResponse(response);
  };

  deleteRestaurant = async (id: string): Promise<Responses.DeleteLocationResponse> => {
    const response = await this.getAuthenticatedClient().delete(`/admin-delete-location`, {
      params: { locationId: id },
    });
    return this.handleResponse(response);
  };

  getRestaurantStats = async (): Promise<Responses.GetLocationStatsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-location-stats`);
    return this.handleResponse(response);
  };

  getAnalystLocations = async (params: Requests.GetAnalystLocationsParams): Promise<Responses.GetRestaurantsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-analyst-locations`, { params });
    return this.handleResponse(response);
  };

  approveLocation = async (data: Requests.LocationApprovalRequest): Promise<Responses.ApproveLocationResponse> => {
    const response = await this.getAuthenticatedClient().put(`/admin-approve-location`, data);
    return this.handleResponse(response);
  };

  // Post management
  getPosts = async (params: Requests.GetPostsParams): Promise<Responses.GetPostsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-posts`, { params });
    return this.handleResponse(response);
  };

  getPostById = async (id: string): Promise<Responses.GetPostByIdResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-post-by-id`, {
      params: { postId: id },
    });
    return this.handleResponse(response);
  };

  createPost = async (data: Requests.CreatePostRequest): Promise<Responses.CreatePostResponse> => {
    const response = await this.getAuthenticatedClient().post(`/admin-post`, data);
    return this.handleResponse(response);
  };

  updatePost = async (data: Requests.UpdatePostRequest): Promise<Responses.UpdatePostResponse> => {
    const response = await this.getAuthenticatedClient().put(`/admin-post`, data);
    return this.handleResponse(response);
  };

  deletePost = async (id: string): Promise<Responses.DeletePostResponse> => {
    const response = await this.getAuthenticatedClient().delete(`/admin-delete-post`, {
      params: { postId: id },
    });
    return this.handleResponse(response);
  };

  // Staff management
  getStaffs = async (params: Requests.GetStaffsParams): Promise<Responses.GetStaffsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-staffs`, { params });
    return this.handleResponse(response);
  };

  getStaffStats = async (): Promise<Responses.GetStaffStatsResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-staffs-stats`);
    return this.handleResponse(response);
  };

  // Dashboard
  getDashboardData = async (): Promise<Responses.GetDashboardDataResponse> => {
    const response = await this.getAuthenticatedClient().get(`/admin-dashboard-cards`);
    return this.handleResponse(response);
  };

  // External services
  getTiktokLinkInfo = async (params: Requests.TiktokLinkInfoParams): Promise<Responses.TiktokLinkInfoResponse> => {
    const response = await unauthenticatedClient.get(`/tiktok-link-info`, { params });
    return this.handleResponse(response);
  };

  getPlaceAutocomplete = async (params: Requests.PlaceAutocompleteParams): Promise<Responses.PlaceAutocompleteResponse> => {
    const response = await unauthenticatedClient.get(`/place-auto-complete`, { params });
    return this.handleResponse(response);
  };

  getPlaceDetails = async (params: Requests.PlaceDetailsParams): Promise<Responses.PlaceDetailsResponse> => {
    const response = await unauthenticatedClient.get(`/place-details`, { params });
    return this.handleResponse(response);
  };
}
