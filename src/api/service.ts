/* eslint-disable @typescript-eslint/no-explicit-any */
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
  UpdatePostRequest,
  CreateBulkPostRequest,
  GetPostsResponse,
  GetRestaurantsResponse,
  BulkApproveRestaurantStatusRequest,
  BulkApproveRestaurantStatusResponse,
  ApproveRestaurantStatusRequest,
  ApproveRestaurantStatusResponse,
  FetchGroupedPostsRequest,
  GetGroupedPostsResponse,
  FetchUserGroupedPostsRequest,
  FetchGroupedPostsSubmissionsRequest,
  GetGroupedPostsSubmissionsResponse,
  FetchStaffsRequest,
  GetStaffsResponse,
  StaffStats,
  GetAdminProfileResponse,
  FetchStaffSummary,
  GetStaffSummaryResponse,
  FetchStaffActivities,
  GetStaffActivitiesResponse,
  FetchStaffProfile,
  CreateAdminResponse,
  GetUserPostsResponse,
  GetUserResponse,
  GetLocationStatsResponse,
  GetReportedVideosResponse,
} from "@/interfaces";
import {
  BaseQueryRequest,
  CreateAdminRequest,
  CreateCompetitionRequest,
  CreateNotificationRequest,
  ErrorLogRequest,
  FetchCompetitionsRequest,
  FetchNotificationsRequest,
  FetchReportedUsersRequest,
  ToggleFeatureFlagRequest,
  ToggleLocation,
  TogglePost,
  ToggleStaffActive,
} from "@/interfaces/requests";

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
    try {
      if (typeof response.data === "string") {
        try {
          return JSON.parse(response.data);
        } catch {
          return response.data;
        }
      }
      return response.data;
    } catch {}
  }

  /**
   * Utility method to build URL search parameters from an object
   * Automatically handles undefined values, type conversion, and empty filtering
   */
  private buildSearchParams(
    params: Record<string, unknown> | object
  ): URLSearchParams {
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

  // Check if a location already exists by name and address
  checkLocationExist = async (data: { name: string; address: string }) => {
    const params = this.buildSearchParams(data); 
    const response = await this.authenticatedClient.get(
      `/check-location-exist?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  resetPassword = async (
    data: AdminResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    const response = await unauthenticatedClient.post(
      `/admin-reset-password`,
      data
    );
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
  createRestaurant = async (data: CreateLocationRequest) => {
    const response = await this.authenticatedClient.post(
      `/admin-location`,
      data
    );

    return this.handleResponse(response);
  };
  // getRestaurants
  getRestaurants = async (
    data: FetchLocationsRequest
  ): Promise<GetRestaurantsResponse> => {
    const params = this.buildSearchParams(data);

    try {
      const response = await this.authenticatedClient.get(
        `/admin-locations?${params.toString()}`
      );

      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  };

  // getRestaurantById
  getRestaurantById = async (data: FetchLocationByIdRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-location-by-id?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // getAnalystRestaurants
  getAnalystRestaurants = async (
    data: FetchAnalystLocationsRequest
  ): Promise<GetRestaurantsResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-analyst-locations?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // updateRestaurant
  updateRestaurant = async (data: UpdateLocationRequest) => {
    const response = await this.authenticatedClient.put(
      `/admin-location`,
      data
    );
    return this.handleResponse(response);
  };

  // approveRestaurantStatus
  approveRestaurantStatus = async (
    data: ApproveRestaurantStatusRequest
  ): Promise<ApproveRestaurantStatusResponse> => {
    const response = await this.authenticatedClient.put(
      `/admin-approve-location`,
      data
    );
    return this.handleResponse(response);
  };

  // bulkApproveRestaurantStatus
  bulkApproveRestaurantStatus = async (
    data: BulkApproveRestaurantStatusRequest
  ): Promise<BulkApproveRestaurantStatusResponse> => {
    const response = await this.authenticatedClient.put(
      `/admin-bulk-approve-location`,
      data
    );
    return this.handleResponse(response);
  };

  /**
   *
   * @description This class handles API requests related to posts.
   *
   */

  // createPost
  createPost = async (data: CreatePostRequest) => {
    const response = await this.authenticatedClient.post(`/admin-post`, data);
    return this.handleResponse(response);
  };

  createAdmin = async (
    data: CreateAdminRequest
  ): Promise<CreateAdminResponse> => {
    const response = await this.authenticatedClient.post(`/create-admin`, data);
    return this.handleResponse(response);
  };

  createBulkPost = async (data: CreateBulkPostRequest) => {
    try {
      const response = await this.authenticatedClient.post(
        `/admin-bulk-posts`,
        data
      );
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  };
  // getPosts
  getPosts = async (
    data: FetchAdminPostsRequest
  ): Promise<GetPostsResponse> => {
    const params = this.buildSearchParams(data);
    try {
      const response = await this.authenticatedClient.get(
        `/admin-posts?${params.toString()}`
      );
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  };

  getRestaurantStats = async (): Promise<GetLocationStatsResponse> => {
    try {
      const response = await this.authenticatedClient.get(
        `/admin-location-stats`
      );

      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  };

  getPendingUserVideos = async (
    data: FetchAdminPostsRequest
  ): Promise<GetUserPostsResponse> => {
    const params = this.buildSearchParams(data);
    try {
      const response = await this.authenticatedClient.get(
        `/admin-user-grouped-posts-submissions?${params.toString()}`
      );

      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  };

  // getPostById
  getPostById = async (data: FetchPostByIdRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-post-by-id?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // getPostById
  deletePostById = async (data: FetchPostByIdRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.delete(
      `/admin-delete-post?${params.toString()}`
    );
    return this.handleResponse(response);
  };
  // getGroupedPostsSubmissions
  getGroupedPostsSubmissions = async (
    data: FetchGroupedPostsSubmissionsRequest
  ): Promise<GetGroupedPostsSubmissionsResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-grouped-posts-submissions?${params.toString()}`
    );
    return this.handleResponse(response);
  };
  // getGroupedPosts
  getGroupedPosts = async (
    data: FetchGroupedPostsRequest
  ): Promise<GetGroupedPostsResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-grouped-posts?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // getUserGroupedPosts
  getUserGroupedPosts = async (
    data: FetchUserGroupedPostsRequest
  ): Promise<GetGroupedPostsResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-user-grouped-posts?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  toggleLocation = async (data: ToggleLocation) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.patch(
      `/admin-toggle-location-active?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  toggleStaffActive = async (data: ToggleStaffActive) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.patch(
      `/admin-toggle-admin-active?${params?.toString()}`
    );

    return this.handleResponse(response);
  };

  togglePost = async (data: TogglePost) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.patch(
      `/admin-toggle-post-active?${params?.toString()}`
    );

    return this.handleResponse(response);
  };

  // updatePost
  updatePost = async (data: UpdatePostRequest) => {
    const response = await this.authenticatedClient.put(`/admin-post`, data);
    return this.handleResponse(response);
  };

  // GetStaffs
  getStaffs = async (data: FetchStaffsRequest): Promise<GetStaffsResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-staffs?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  //Users
  getUsers = async (data: BaseQueryRequest): Promise<GetUserResponse> => {
    const params = this.buildSearchParams(data);

    const response = await this.authenticatedClient.get(
      `/admin-fetch-users?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getUserById = async (data: { userId: string }) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-fetch-user?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getUserPostsByUser = async (data: BaseQueryRequest & { userId: string }) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-user-posts?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getUserLocationVisits = async (
    data: BaseQueryRequest & { userId: string }
  ) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-user-location-visits?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // Toggle block/unblock user
  toggleUserBlock = async (data: { userId: string; comment?: string }) => {
    const params = this.buildSearchParams({
      userId: data.userId,
      comment: data.comment,
    });
    const response = await this.authenticatedClient.patch(
      `/admin-toggle-block-user?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  // Users - Cards Stats
  getUsersCards = async (): Promise<{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    newUsers: number;
  }> => {
    const response = await this.authenticatedClient.get(`/admin-users-cards`);
    return this.handleResponse(response);
  };

  getStaffsAccountSummary = async (
    data: FetchStaffSummary
  ): Promise<GetStaffSummaryResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-account-summary?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getStaffsActivities = async (
    data: FetchStaffActivities
  ): Promise<GetStaffActivitiesResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-analyst-activities?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getStaffProfile = async (
    data: FetchStaffProfile
  ): Promise<GetAdminProfileResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `admin-fetch-staff?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getStaffsStats = async (): Promise<StaffStats> => {
    const response = await this.authenticatedClient.get(`/admin-staffs-stats`);
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

  // : Promise<GetTiktokDetailsResponse>

  // getTiktokDetails
  getTiktokDetails = async (data: { link: string }) => {
    const response = await this.authenticatedClient.get(
      `/tiktok-link-info?link=${data.link}`
    );

    return this.handleResponse(response);
  };

  validateTiktokUrl = async (data: { link: string }) => {
    const response = await this.authenticatedClient.get(
      `/validate-tiktok-link?link=${data.link?.trim()}`
    );

    return this.handleResponse(response);
  };

  // getReportedVideos
  reported = async (
    data: FetchReportedUsersRequest
  ): Promise<GetReportedVideosResponse> => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-reports?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getNotifications = async (data: FetchNotificationsRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-sent-notifications?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  createNotification = async (data: CreateNotificationRequest) => {
    const response = await this.authenticatedClient.post(
      "/send-notifications",
      data
    );
    return this.handleResponse(response);
  };

  // Competitions
  getCompetitions = async (data: FetchCompetitionsRequest) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-get-competitions?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  getCompetitionById = async (data: { competitionId: string }) => {
    try {
      const params = this.buildSearchParams(data);

      const response = await this.authenticatedClient.get(
        `/admin-get-competition-by-id?${params.toString()}`
      );
      return this.handleResponse(response);
    } catch (err: any) {
      console.error(
        JSON.stringify("Error:", err.response.data.moreInfo.errors[0].message)
      );
    }
  };

  createCompetition = async (data: CreateCompetitionRequest) => {
    try {
      const response = await this.authenticatedClient.post(
        `/admin-create-competition`,
        data
      );

      return this.handleResponse(response);
    } catch (err: any) {
      console.error(
        JSON.stringify("Error:", err.response.data.moreInfo.errors[0].message)
      );
    }
  };

  getCompetitionParticipants = async (data: {
    pageNumber?: number;
    quantity?: number;
  }) => {
    const params = this.buildSearchParams(data);
    const response = await this.authenticatedClient.get(
      `/admin-competition-participants?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  toggleCompetitionActive = async (data: {
    competitionId: string;
    winners: string[];
  }) => {
    try {
      const response = await this.authenticatedClient.patch(
        `/admin-end-competition`,
        data
      );
      return this.handleResponse(response);
    } catch (err: any) {
      console.error(
        JSON.stringify("CompetitionParticipant Error:", err.response)
      );
    }
  };

  // ============================
  // Feature Flags
  // ============================
  getFeatureFlagCards = async () => {
    const response = await this.authenticatedClient.get(
      `/v2/feature-flag-cards`
    );
    return this.handleResponse(response);
  };

  adminListFeatureFlags = async (data: {
    pageNumber?: number;
    quantity?: number;
    searchTerm?: string;
    environment?: string;
    lastTokenId?: string;
  }) => {
    const params = this.buildSearchParams({
      pageNumber: data?.pageNumber,
      quantity: data?.quantity,
      query: data?.searchTerm,
      environment: data?.environment,
      lastTokenId: data?.lastTokenId,
    });
    const response = await this.authenticatedClient.get(
      `/v2/admin-list-feature-flags?${params.toString()}`
    );
    return this.handleResponse(response);
  };

  createFeatureFlag = async (name: string) => {
    const data = {
      name,
      environment: process.env.NODE_ENV || "development",
    };
    const response = await this.authenticatedClient.post(
      `/v2/admin-create-feature-flag`,
      data
    );
    return this.handleResponse(response);
  };

  toggleFeatureFlagActive = async (data: ToggleFeatureFlagRequest) => {
    try {
      const response = await this.authenticatedClient.patch(
        `/v2/toggle-feature-flag-active`,
        { id: data?.featureFlagId }
      );
      return this.handleResponse(response);
    } catch (err: any) {
      console.error(
        JSON.stringify("Error:", err.response.data.moreInfo.errors[0].message)
      );
    }
  };

  createErrorLog = async (data: ErrorLogRequest) => {
    const response = await this.authenticatedClient.post("/error-log", data);
    return this.handleResponse(response);
  };
}
