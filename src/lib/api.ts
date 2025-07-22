import { Restaurant, RestaurantChange, ApiResponse, PaginatedResponse } from '../types/restaurant';
import { TableTab } from '../data/mockTables';
import { mockRestaurants } from '../data/mockRestaurants';
import { mockPendingChanges, mockApprovedChanges, mockRejectedChanges } from '../data/mockChanges';
import { mockTables } from '../data/mockTables';

/**
 * Simulate API delay for realistic development experience
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Table management API service
 */
export class TableApi {
  /**
   * Get all available tables
   */
  static async getTables(): Promise<TableTab[]> {
    await delay(200);
    return mockTables;
  }

  /**
   * Get table by ID
   */
  static async getTable(id: string): Promise<TableTab | null> {
    await delay(100);
    return mockTables.find(table => table.id === id) || null;
  }

  /**
   * Create a new table
   */
  static async createTable(table: Omit<TableTab, 'id' | 'count' | 'createdAt' | 'updatedAt'>): Promise<TableTab> {
    await delay(500);

    const newTable: TableTab = {
      ...table,
      id: `table-${Date.now()}`,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, this would be saved to the database
    console.log('Table created:', newTable);

    return newTable;
  }

  /**
   * Update table
   */
  static async updateTable(id: string, updates: Partial<TableTab>): Promise<TableTab> {
    await delay(400);

    const tableIndex = mockTables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      throw new Error('Table not found');
    }

    const updatedTable = {
      ...mockTables[tableIndex],
      ...updates,
      updatedAt: new Date()
    };

    mockTables[tableIndex] = updatedTable;

    return updatedTable;
  }

  /**
   * Delete table
   */
  static async deleteTable(id: string): Promise<void> {
    await delay(300);

    const tableIndex = mockTables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      throw new Error('Table not found');
    }

    mockTables.splice(tableIndex, 1);
    console.log('Table deleted:', id);
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
    tableId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Restaurant>> {
    await delay(300); // Simulate network delay

    let filteredRestaurants = [...mockRestaurants];

    // Filter by table (in this case, we'll use city as a proxy for table)
    if (params.tableId) {
      const table = mockTables.find(t => t.id === params.tableId);
      if (table) {
        filteredRestaurants = filteredRestaurants.filter(
          restaurant => restaurant.city.toLowerCase() === table.name.toLowerCase()
        );
      }
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.address.toLowerCase().includes(searchTerm) ||
          restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm))
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
   * Get restaurant by ID
   */
  static async getRestaurant(id: string): Promise<Restaurant | null> {
    await delay(200);
    return mockRestaurants.find(restaurant => restaurant.id === id) || null;
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