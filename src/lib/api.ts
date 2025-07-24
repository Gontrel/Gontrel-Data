import { Restaurant, RestaurantChange, ApiResponse, PaginatedResponse } from '../types/restaurant';
import { mockRestaurants } from '../data/mockRestaurants';
import { mockPendingChanges, mockApprovedChanges, mockRejectedChanges } from '../data/mockChanges';
import { mockUsers, getCurrentUser, type User } from '../data/mockUsers';

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
  static async getRestaurant(name: string, currentUserId?: string): Promise<Restaurant | null> {
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

/**
 * Change management API service
 */
export class ChangeApi {
  /**
   * Get pending changes for managers to review
   */
  static async getPendingChanges(): Promise<RestaurantChange[]> {
    await delay(400);
    return mockPendingChanges;
  }

  /**
   * Get changes by restaurant ID
   */
  static async getChangesByRestaurant(restaurantId: string): Promise<RestaurantChange[]> {
    await delay(300);
    return [
      ...mockPendingChanges,
      ...mockApprovedChanges,
      ...mockRejectedChanges
    ].filter(change => change.restaurantId === restaurantId);
  }

  /**
   * Get changes by status
   */
  static async getChangesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<RestaurantChange[]> {
    await delay(300);

    switch (status) {
      case 'pending':
        return mockPendingChanges;
      case 'approved':
        return mockApprovedChanges;
      case 'rejected':
        return mockRejectedChanges;
      default:
        return [];
    }
  }

  /**
   * Submit a new change (analyst action)
   */
  static async submitChange(change: Omit<RestaurantChange, 'id' | 'status' | 'createdAt'>): Promise<RestaurantChange> {
    await delay(500);

    const newChange: RestaurantChange = {
      ...change,
      id: `change-${Date.now()}`,
      status: 'pending',
      createdAt: new Date()
    };

    // In a real app, this would be saved to the database
    console.log('Change submitted:', newChange);

    return newChange;
  }

  /**
   * Approve a change (manager action)
   */
  static async approveChange(changeId: string, managerId: string, notes?: string): Promise<ApiResponse<RestaurantChange>> {
    await delay(600);

    // Find the change in pending changes
    const changeIndex = mockPendingChanges.findIndex(change => change.id === changeId);

    if (changeIndex === -1) {
      throw new Error('Change not found');
    }

    const change = mockPendingChanges[changeIndex];
    const updatedChange: RestaurantChange = {
      ...change,
      status: 'approved',
      managerId,
      reviewedAt: new Date(),
      notes
    };

    // Remove from pending and add to approved
    mockPendingChanges.splice(changeIndex, 1);
    mockApprovedChanges.push(updatedChange);

    // In a real app, this would update the production restaurant data
    console.log('Change approved:', updatedChange);

    return {
      data: updatedChange,
      success: true,
      message: 'Change approved successfully'
    };
  }

  /**
   * Reject a change (manager action)
   */
  static async rejectChange(changeId: string, managerId: string, notes?: string): Promise<ApiResponse<RestaurantChange>> {
    await delay(600);

    // Find the change in pending changes
    const changeIndex = mockPendingChanges.findIndex(change => change.id === changeId);

    if (changeIndex === -1) {
      throw new Error('Change not found');
    }

    const change = mockPendingChanges[changeIndex];
    const updatedChange: RestaurantChange = {
      ...change,
      status: 'rejected',
      managerId,
      reviewedAt: new Date(),
      notes
    };

    // Remove from pending and add to rejected
    mockPendingChanges.splice(changeIndex, 1);
    mockRejectedChanges.push(updatedChange);

    console.log('Change rejected:', updatedChange);

    return {
      data: updatedChange,
      success: true,
      message: 'Change rejected'
    };
  }

  /**
   * Bulk approve multiple changes
   */
  static async bulkApproveChanges(changeIds: string[], managerId: string): Promise<ApiResponse<RestaurantChange[]>> {
    await delay(1000);

    const approvedChanges: RestaurantChange[] = [];

    for (const changeId of changeIds) {
      try {
        const result = await this.approveChange(changeId, managerId);
        approvedChanges.push(result.data);
      } catch (error) {
        console.error(`Failed to approve change ${changeId}:`, error);
      }
    }

    return {
      data: approvedChanges,
      success: true,
      message: `Successfully approved ${approvedChanges.length} changes`
    };
  }
}