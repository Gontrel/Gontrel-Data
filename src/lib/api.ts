import { PaginatedResponse, ActiveRestaurantType, RestaurantTypes, PendingRestaurantType, PendingVideoType } from '../types/restaurant';
import { mockPendingRestaurants, mockPendingVideos, mockActiveRestaurants } from '../data/mockRestaurants';
import { mockUsers, getCurrentUser } from '../data/mockUsers';
import { AnalystTableTabs, ManagerTableTabs } from '@/constant/table';

/**
 * Simulate API delay for realistic development experience
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
 * Table management API service
 */
export class TableApi {
  /**
   * Get table (based on unique users who have added restaurants)
   */
  static async getTable(tableId: ManagerTableTabs | AnalystTableTabs, currentUserId?: string): Promise<RestaurantTypes[]> {
    await delay(200);

    const currentUser = currentUserId ? mockUsers.find(u => u.id === currentUserId) : getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // If user is analyst, only show their own table
    if (currentUser.role === 'analyst') {
      if (tableId === AnalystTableTabs.ACTIVE_RESTAURANTS) {
        return mockActiveRestaurants.filter(restaurant => restaurant.addedBy.userId === currentUser.id);
      }
      if (tableId === AnalystTableTabs.SUBMITTED_RESTAURANTS) {
        return mockPendingRestaurants.filter(restaurant => restaurant.addedBy.userId === currentUser.id);
      }
      if (tableId === AnalystTableTabs.SUBMITTED_VIDEOS) {
        return mockPendingVideos.filter(video => video.addedBy.userId === currentUser.id);
      }
      return [];
    }

    // If user is manager or admin, show all users who have added restaurants
    if (tableId === ManagerTableTabs.ACTIVE_RESTAURANTS) {
      return mockActiveRestaurants;
    }
    if (tableId === ManagerTableTabs.PENDING_RESTAURANTS) {
      return mockPendingRestaurants;
    }
    if (tableId === ManagerTableTabs.PENDING_VIDEOS) {
      return mockPendingVideos;
    }
    return [];
  }
}

/**
 * Restaurant API service
 */
export class RestaurantApi {
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

    // Type validation for mockPendingRestaurants
    if (!Array.isArray(mockPendingRestaurants)) {
      throw new Error('"mockPendingRestaurants" is not an array');
    }

    let filteredRestaurants = [...mockPendingRestaurants] as PendingRestaurantType[];

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
      filteredRestaurants = filteredRestaurants.filter((restaurant: PendingRestaurantType) =>
        (typeof restaurant.name === 'string' && restaurant.name.toLowerCase().includes(searchTerm)) ||
        (typeof restaurant.address === 'string' && restaurant.address.toLowerCase().includes(searchTerm)) ||
        (typeof restaurant.website === 'string' && restaurant.website.toLowerCase().includes(searchTerm))
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

    // Type validation for mockPendingVideos
    if (!Array.isArray(mockPendingVideos)) {
      throw new Error('"mockPendingVideos" is not an array');
    }

    let filteredPendingVideos = [...mockPendingVideos] as PendingVideoType[];

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
      filteredPendingVideos = filteredPendingVideos.filter((pendingVideo: PendingVideoType) =>
        pendingVideo.name.toLowerCase().includes(searchTerm) || pendingVideo.restaurantId.toLowerCase().includes(searchTerm)
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
        (typeof restaurant.address === 'string' && restaurant.address.toLowerCase().includes(searchTerm))
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

