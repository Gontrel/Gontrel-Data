import { PaginatedResponse, ActiveRestaurantType, PendingRestaurantType, PendingVideoType, SubmittedRestaurantType, SubmittedVideoType } from '@/types/restaurant';
import { mockPendingRestaurants, mockPendingVideos, mockSubmittedRestaurants, mockSubmittedVideos, mockActiveRestaurants } from '@/data/mockRestaurants';
import { mockUsers, getCurrentUser } from '@/data/mockUsers';
import { ApprovalStatusEnum, ManagerTableTabsEnum, AnalystTableTabsEnum } from '@/types/enums';

/**
 * Simulate API delay for realistic development experience
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Table-like structure based on user IDs
 */
export type RestaurantTable = {
  id: string;
  name: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Restaurant API service
 */
export class RestaurantApi {
  /**
   * Update restaurant status in mock data
   * @param restaurantId - Restaurant ID to update
   * @param propertyKey - Property to update (address, menu, reservation, or posts)
   * @param newStatus - New status to set
   * @param tableType - Table type for proper data source
   */
  static async updateRestaurantStatus(params: {
    id: string;
    propertyKey?: 'address' | 'menu' | 'reservation' | 'posts';
    newStatus: ApprovalStatusEnum;
    tableType: ManagerTableTabsEnum | AnalystTableTabsEnum;
  }): Promise<{ success: boolean }> {
    await delay(300); // Simulate network delay

    const { id, propertyKey, newStatus, tableType } = params;

    // Helper function to toggle status
    const toggleStatus = (currentStatus: ApprovalStatusEnum, targetStatus: ApprovalStatusEnum): ApprovalStatusEnum => {
      return currentStatus === targetStatus ? ApprovalStatusEnum.PENDING : targetStatus;
    };

    // Update the appropriate mock data based on table type
    switch (tableType) {
      case ManagerTableTabsEnum.PENDING_RESTAURANTS:
        const pendingRestaurant = mockPendingRestaurants.find(r => r.id === id);
        if (pendingRestaurant) {
          if (propertyKey) {
            // Update specific property
            if (propertyKey === 'address') {
              pendingRestaurant.address.status = toggleStatus(pendingRestaurant.address.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'menu') {
              pendingRestaurant.menu.status = toggleStatus(pendingRestaurant.menu.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'reservation') {
              pendingRestaurant.reservation.status = toggleStatus(pendingRestaurant.reservation.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'posts') {
              pendingRestaurant.posts.forEach(post => {
                post.status = toggleStatus(post.status as ApprovalStatusEnum, newStatus);
              });
            }
          } else {
            // Update all properties
            pendingRestaurant.address.status = toggleStatus(pendingRestaurant.address.status as ApprovalStatusEnum, newStatus);
            pendingRestaurant.menu.status = toggleStatus(pendingRestaurant.menu.status as ApprovalStatusEnum, newStatus);
            pendingRestaurant.reservation.status = toggleStatus(pendingRestaurant.reservation.status as ApprovalStatusEnum, newStatus);
            pendingRestaurant.posts.forEach(post => {
              post.status = toggleStatus(post.status as ApprovalStatusEnum, newStatus);
            });
          }
        }
        break;

      case ManagerTableTabsEnum.PENDING_VIDEOS:
        const pendingVideo = mockPendingVideos.find(v => v.id === id);
        if (pendingVideo) {
          pendingVideo.posts.forEach(video => {
            video.status = toggleStatus(video.status as ApprovalStatusEnum, newStatus);
          });
        }
        break;

      case AnalystTableTabsEnum.SUBMITTED_RESTAURANTS:
        const submittedRestaurant = mockSubmittedRestaurants.find(r => r.id === id);
        if (submittedRestaurant) {
          if (propertyKey) {
            // Update specific property
            if (propertyKey === 'address') {
              submittedRestaurant.address.status = toggleStatus(submittedRestaurant.address.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'menu') {
              submittedRestaurant.menu.status = toggleStatus(submittedRestaurant.menu.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'reservation') {
              submittedRestaurant.reservation.status = toggleStatus(submittedRestaurant.reservation.status as ApprovalStatusEnum, newStatus);
            } else if (propertyKey === 'posts') {
              submittedRestaurant.posts.forEach(post => {
                post.status = toggleStatus(post.status as ApprovalStatusEnum, newStatus);
              });
            }
          } else {
            // Update all properties
            submittedRestaurant.address.status = toggleStatus(submittedRestaurant.address.status as ApprovalStatusEnum, newStatus);
            submittedRestaurant.menu.status = toggleStatus(submittedRestaurant.menu.status as ApprovalStatusEnum, newStatus);
            submittedRestaurant.reservation.status = toggleStatus(submittedRestaurant.reservation.status as ApprovalStatusEnum, newStatus);
            submittedRestaurant.posts.forEach(post => {
              post.status = toggleStatus(post.status as ApprovalStatusEnum, newStatus);
            });
          }
        }
        break;

      case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
        const submittedVideo = mockSubmittedVideos.find(v => v.id === id);
        if (submittedVideo) {
          submittedVideo.posts.forEach(post => {
            post.status = toggleStatus(post.status as ApprovalStatusEnum, newStatus);
          });
        }
        break;

      default:
        console.warn(`Unsupported table type for status update: ${tableType}`);
        return { success: false };
    }

    return { success: true };
  }

  /**
   * Get restaurants by table with optional search and pagination
   * @template PendingRestaurant
   * @param {object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.currentUserId] - Current user ID
   * @returns {Promise<PaginatedResponse<PendingRestaurant>>}
   */
  static async getPendingRestaurants(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<PendingRestaurantType>> {
    await delay(300); // Simulate network delay

    const currentUser = params.currentUserId
      ? mockUsers.find((u) => u.id === params.currentUserId)
      : getCurrentUser();

    if (!currentUser) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Type validation for mockPendingRestaurants
    if (!Array.isArray(mockPendingRestaurants)) {
      throw new Error('"mockPendingRestaurants" is not an array');
    }

    let filteredRestaurants = [
      ...mockPendingRestaurants,
    ] as PendingRestaurantType[];

    // Role-based filtering
    if (currentUser.role === "analyst") {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant: PendingRestaurantType) =>
          (typeof restaurant.name === "string" &&
            restaurant.name.toLowerCase().includes(searchTerm)) ||
          (typeof restaurant.address.content === "string" &&
            restaurant.address.content.toLowerCase().includes(searchTerm)) ||
          (typeof restaurant.website === "string" &&
            restaurant.website.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRestaurants = filteredRestaurants.slice(
      startIndex,
      endIndex
    );

    return {
      data: paginatedRestaurants,
      pagination: {
        page,
        limit,
        total: filteredRestaurants.length,
        totalPages: Math.ceil(filteredRestaurants.length / limit),
      },
    };
  }

  /**
   * Get pending videos with optional search and pagination
   * @template PendingVideo
   * @param {object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.currentUserId] - Current user ID
   * @returns {Promise<PaginatedResponse<PendingVideo>>}
   */
  static async getPendingVideos(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<PendingVideoType>> {
    await delay(300); // Simulate network delay

    const currentUser = params.currentUserId
      ? mockUsers.find((u) => u.id === params.currentUserId)
      : getCurrentUser();

    if (!currentUser) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Type validation for mockPendingVideos
    if (!Array.isArray(mockPendingVideos)) {
      throw new Error('"mockPendingVideos" is not an array');
    }

    let filteredPendingVideos = [...mockPendingVideos] as PendingVideoType[];

    // Role-based filtering
    if (currentUser.role === "analyst") {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredPendingVideos = filteredPendingVideos.filter(
        (pendingVideo: PendingVideoType) =>
          pendingVideo.name.toLowerCase().includes(searchTerm) ||
          pendingVideo.restaurantId.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredPendingVideos.slice(startIndex, endIndex);

    return {
      data: paginatedVideos,
      pagination: {
        page,
        limit,
        total: filteredPendingVideos.length,
        totalPages: Math.ceil(filteredPendingVideos.length / limit)
      }
    };
  }

  /**
   * Get submitted restaurants with optional search and pagination
   * @template SubmittedRestaurant
   * @param {object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.currentUserId] - Current user ID
   * @returns {Promise<PaginatedResponse<SubmittedRestaurant>>}
   */
  static async getSubmittedRestaurants(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<SubmittedRestaurantType>> {
      await delay(300); // Simulate network delay

    const currentUser = params.currentUserId
      ? mockUsers.find(u => u.id === params.currentUserId)
      : getCurrentUser();

    if (!currentUser) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

    // Type validation for mockSubmittedRestaurants
    if (!Array.isArray(mockSubmittedRestaurants)) {
      throw new Error('"mockSubmittedRestaurants" is not an array');
    }

    let filteredRestaurants = [...mockSubmittedRestaurants] as SubmittedRestaurantType[];

    // Role-based filtering
    if (currentUser.role === 'analyst') {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter((restaurant: SubmittedRestaurantType) =>
        (typeof restaurant.name === 'string' && restaurant.name.toLowerCase().includes(searchTerm)) ||
        (typeof restaurant.address.content === 'string' && restaurant.address.content.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    return {
      data: paginatedRestaurants,
      pagination: {
        page,
        limit,
        total: filteredRestaurants.length,
        totalPages: Math.ceil(filteredRestaurants.length / limit)
      }
    };
  }

  /**
   * Get submitted videos with optional search and pagination
  /**
   * Get submitted videos with optional search and pagination
   * @template SubmittedVideo
   * @param {object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.currentUserId] - Current user ID
   * @returns {Promise<PaginatedResponse<SubmittedVideo>>}
   */
  static async getSubmittedVideos(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<SubmittedVideoType>> {
    await delay(300); // Simulate network delay

    const currentUser = params.currentUserId
      ? mockUsers.find(u => u.id === params.currentUserId)
      : getCurrentUser();

    if (!currentUser) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

    // Type validation for mockSubmittedVideos
    if (!Array.isArray(mockSubmittedVideos)) {
      throw new Error('"mockSubmittedVideos" is not an array');
    }

    let filteredVideos = [...mockSubmittedVideos] as SubmittedVideoType[];

    // Role-based filtering
    if (currentUser.role === 'analyst') {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredVideos = filteredVideos.filter((video: SubmittedVideoType) =>
        video.name.toLowerCase().includes(searchTerm) || video.restaurantId.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    return {
      data: paginatedVideos,
      pagination: {
        page,
        limit,
        total: filteredVideos.length,
        totalPages: Math.ceil(filteredVideos.length / limit)
      }
    };
  }

  /**
   * Get active restaurants with optional search and pagination
   * @template ActiveRestaurant
   * @param {object} params - Query parameters
   * @param {string} [params.search] - Search term
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.currentUserId] - Current user ID
   * @returns {Promise<PaginatedResponse<ActiveRestaurant>>}
   */
  static async getActiveRestaurants(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<ActiveRestaurantType>> {
    await delay(300); // Simulate network delay

    const currentUser = params.currentUserId
      ? mockUsers.find(u => u.id === params.currentUserId)
      : getCurrentUser();

    if (!currentUser) {
      return {
        data: mockActiveRestaurants,
        pagination: {
          page: 1,
          limit: 10,
          total: mockActiveRestaurants.length,
          totalPages: Math.ceil(mockActiveRestaurants.length / 10)
        }
      };
    }

    // Type validation for mockActiveRestaurants
    if (!Array.isArray(mockActiveRestaurants)) {
      throw new Error('"mockActiveRestaurants" is not an array');
    }

    let filteredRestaurants = [...mockActiveRestaurants] as ActiveRestaurantType[];

    // Role-based filtering
    if (currentUser.role === 'analyst') {
      return {
        data: filteredRestaurants,
        pagination: {
          page: 1,
          limit: 10,
          total: filteredRestaurants.length,
          totalPages: Math.ceil(filteredRestaurants.length / 10)
        }
      };
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter((restaurant: ActiveRestaurantType) =>
        (typeof restaurant.name === 'string' && restaurant.name.toLowerCase().includes(searchTerm)) ||
        (typeof restaurant.address.content === 'string' && restaurant.address.content.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    return {
      data: paginatedRestaurants,
      pagination: {
        page,
        limit,
        total: filteredRestaurants.length,
        totalPages: Math.ceil(filteredRestaurants.length / limit)
      }
    };
  }
}
