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
  private static instance: APIRequest | null = null;

  private constructor() {
    // Initialize with default authenticated client (no token)
    this.authenticatedClient = axiosInstance;
    this.unauthenticatedClient = unauthenticatedClient;
  }

  /**
   * Get the singleton instance of APIRequest
   */
  public static getInstance(): APIRequest {
    if (!APIRequest.instance) {
      APIRequest.instance = new APIRequest();
    }
    return APIRequest.instance;
  }

  /**
   * Configure the authenticated client with headers (for server-side requests)
   * This updates the authenticated client to use the token from cookies
   */
  public configure(headers?: Headers): void {
    if (typeof window === "undefined" && headers?.get("cookie")) {
      const cookieHeader = headers.get("cookie");
      if (cookieHeader) {
        const cookies = parse(cookieHeader);
        const token = cookies.user_token;

        if (token) {
          // Update authenticated client with token from headers
          this.authenticatedClient = axios.create({
            ...axiosInstance.defaults,
            headers: {
              ...axiosInstance.defaults.headers,
              Authorization: `Bearer ${token}`,
            },
          });
          return;
        }
      }
    }
    // Fallback to default authenticated client
    this.authenticatedClient = axiosInstance;
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
    try {
      const response = await unauthenticatedClient.post(`/admin-login`, data, {
        timeout: 10000, // 10 second timeout for login (fail fast)
      });

      const responseData = this.handleResponse(response);

      // Check if response contains an error even with 200 status
      if (responseData && typeof responseData === "object") {
        const hasToken = "token" in responseData && responseData.token;
        const hasError =
          "error" in responseData || ("message" in responseData && !hasToken);

        if (hasError) {
          const errorMsg =
            (responseData as any).error ||
            (responseData as any).message ||
            "Login failed";

          throw new Error(errorMsg);
        }

        if (!hasToken) {
          const errorMsg =
            (responseData as any).message ||
            (responseData as any).error ||
            "Login failed. Invalid credentials.";
          throw new Error(errorMsg);
        }
      }

      return responseData;
    } catch (error: any) {
      // Handle timeout errors
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        throw new Error("Request timed out. Please check your connection.");
      }

      // Handle network errors
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        if (
          error.message?.includes("CORS") ||
          error.message?.includes("cross-origin")
        ) {
          throw new Error(
            "CORS error. Please check your browser settings or contact support."
          );
        }
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }

      // Handle browser blocking
      if (error.code === "ERR_BLOCKED_BY_CLIENT") {
        throw new Error(
          "Request blocked by browser extension. Please disable ad blockers and try again."
        );
      }

      // Handle response errors (400, 401, 500, etc.)
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = "Login failed. Please try again.";

        // Extract error message from response data
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData && typeof errorData === "object") {
          // Try multiple possible message fields
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.msg ||
            (errorData.data &&
              (errorData.data.message || errorData.data.error)) ||
            "Login failed. Please try again.";
        }

        // Create a proper Error object with the extracted message
        const loginError = new Error(errorMessage);
        // Attach status code for better error handling
        (loginError as any).status = error.response.status;
        (loginError as any).response = error.response;

        throw loginError;
      }

      // Fallback for unknown errors
      const errorMessage =
        error.message || "Login failed. Please try again or contact support.";
      throw new Error(errorMessage);
    }
  };

  /**
   * Upload a video file to the server
   * @param file - The video file to upload
   * @returns Object containing the uploaded video URL, thumbnail URL, HLS URL and first frame URL
   */
  uploadVideo = async (
    file: File,
    userId?: string,
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
  ): Promise<{
    videoUrl: string;
    thumbUrl: string;
    hlsUrl?: string;
    firstFrameUrl?: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (userId) {
      formData.append("userId", userId);
    }

    // Upload through Next.js server-side proxy to keep API_BASE_URL server-side
    const uploadClient = axios.create({
      baseURL: "",
      timeout: 3600000,
    });

    // eslint-disable-next-line no-console
    console.log("[uploadVideo] Request:", {
      url: "/upload-file",
      method: "POST",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      userId: userId || "not set",
      baseURL: uploadClient.defaults.baseURL,
    });

    try {
      const response = await uploadClient.post(`/upload-file`, formData, {
        onUploadProgress,
      });

      // eslint-disable-next-line no-console
      console.log("[uploadVideo] Response:", response.status, response.data);
      return this.handleResponse(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[uploadVideo] Error:", error);
      throw error;
    }
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

  changeRole = async (data: { adminId: string; role: string }) => {
    try {
      const response = await this.authenticatedClient.patch(
        `/admin-change-role`,
        {
          adminId: data.adminId,
          role: data.role,
        }
      );

      return this.handleResponse(response);
    } catch (error: any) {
      throw error;
    }
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
