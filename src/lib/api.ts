import { Restaurant, PaginatedResponse } from '../types/restaurant';
import { mockRestaurants } from '../data/mockRestaurants';
import { mockUsers, getCurrentUser } from '../data/mockUsers';
import { AnalyticsTableTabs, ManagerTableTabs } from '@/constant/table';

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
  static async getTable(currentUserId?: string): Promise<Restaurant[]> {
    await delay(200);

    const currentUser = currentUserId ? mockUsers.find(u => u.id === currentUserId) : getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // If user is analyst, only show their own table
    if (currentUser.role === 'analyst') {
      return mockRestaurants.filter(restaurant => restaurant.addedBy.userId === currentUser.id);
    }

    // If user is manager or admin, show all users who have added restaurants
    const usersWithRestaurants = mockUsers.filter(user => {
      const hasRestaurants = mockRestaurants.some(restaurant => restaurant.addedBy.userId === user.id);
      return hasRestaurants;
    });

    return usersWithRestaurants.map(user => mockRestaurants.filter(restaurant => restaurant.addedBy.userId === user.id)).flat();
  }
}

/**
 * Restaurant API service
 */
export class RestaurantApi {
  /**
   * Get restaurants by table with optional search and pagination
   */
  static async getRestaurants(params: {
    search?: string;
    page?: number;
    limit?: number;
    currentUserId?: string;
  }): Promise<PaginatedResponse<Restaurant>> {
    await delay(300); // Simulate network delay

    const currentUser = params.currentUserId ? mockUsers.find(u => u.id === params.currentUserId) : getCurrentUser();

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

    let filteredRestaurants = [...mockRestaurants];

    // Role-based filtering
    if (currentUser.role === 'analyst') {
      // Analysts can only see their own restaurants
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.addedBy.userId === currentUser.id);
    }
    // Managers and admins can see all restaurants

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.address.toLowerCase().includes(searchTerm) ||
          restaurant.website.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
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
   * Get restaurant by name (since we removed ID)
   */
  static async getRestaurant(tableId: ManagerTableTabs | AnalyticsTableTabs, name: string, currentUserId?: string): Promise<Restaurant | null> {
    await delay(200);

    const currentUser = currentUserId ? mockUsers.find(u => u.id === currentUserId) : getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const restaurant = mockRestaurants.find(restaurant => restaurant.name === name);

    if (!restaurant) {
      return null;
    }

    // Role-based access control
    if (currentUser.role === 'analyst' && restaurant.addedBy.userId !== currentUser.id) {
      return null; // Analysts can only see their own restaurants
    }

    return restaurant;
  }
}

