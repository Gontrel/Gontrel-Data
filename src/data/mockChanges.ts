import { RestaurantChange } from '../types/restaurant';

/**
 * Mock pending changes data to demonstrate the approval workflow
 */
export const mockPendingChanges: RestaurantChange[] = [
  {
    id: 'change-001',
    restaurantId: '00001',
    analystId: 'analyst-001',
    changes: [
      {
        field: 'name',
        oldValue: 'Perious Grill',
        newValue: 'Perious Grill & Bar',
        changeType: 'update'
      },
      {
        field: 'tags',
        oldValue: ['#chimac', '#dublinfood', '#koreanfriedchicken', '#asianfusion'],
        newValue: ['#chimac', '#dublinfood', '#koreanfriedchicken', '#asianfusion', '#cocktails', '#bar'],
        changeType: 'update'
      }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-25T10:30:00Z'),
    restaurantName: 'Perious Grill',
    analystName: 'Sarah Johnson'
  },
  {
    id: 'change-002',
    restaurantId: '00002',
    analystId: 'analyst-002',
    changes: [
      {
        field: 'address',
        oldValue: '2 Seaview, Pebble Beach, Portmarnock, Co. Dublin',
        newValue: '3 Seaview, Pebble Beach, Portmarnock, Co. Dublin',
        changeType: 'update'
      },
      {
        field: 'tiktokLinks',
        oldValue: ['https://tiktok.com/@evolveeatery'],
        newValue: ['https://tiktok.com/@evolveeatery', 'https://tiktok.com/@evolveeatery_kitchen'],
        changeType: 'update'
      }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-25T11:15:00Z'),
    restaurantName: 'Evolve Eatery kingswood',
    analystName: 'Mike Chen'
  },
  {
    id: 'change-003',
    restaurantId: '00007',
    analystId: 'analyst-003',
    changes: [
      {
        field: 'menuUrl',
        oldValue: 'https://www.marcos.ie/menu',
        newValue: 'https://www.marcos.ie/menu-2024',
        changeType: 'update'
      },
      {
        field: 'reservationUrl',
        oldValue: 'https://www.marcos.ie/book',
        newValue: 'https://www.marcos.ie/reservations',
        changeType: 'update'
      }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-25T14:20:00Z'),
    restaurantName: 'Marco\'s',
    analystName: 'Emma Walsh'
  },
  {
    id: 'change-004',
    restaurantId: '00009',
    analystId: 'analyst-001',
    changes: [
      {
        field: 'name',
        oldValue: 'Lemongrass fusion restaurant',
        newValue: 'Lemongrass Fusion Restaurant',
        changeType: 'update'
      },
      {
        field: 'tags',
        oldValue: ['#limerick', '#asian', '#fusion', '#limerickcity'],
        newValue: ['#limerick', '#asian', '#fusion', '#limerickcity', '#thai', '#vietnamese'],
        changeType: 'update'
      }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-25T16:45:00Z'),
    restaurantName: 'Lemongrass fusion restaurant',
    analystName: 'Sarah Johnson'
  }
];

/**
 * Mock approved changes for demonstration
 */
export const mockApprovedChanges: RestaurantChange[] = [
  {
    id: 'change-005',
    restaurantId: '00003',
    analystId: 'analyst-002',
    managerId: 'manager-001',
    changes: [
      {
        field: 'tags',
        oldValue: ['#seafood', '#coastal', '#bray', '#irishfood'],
        newValue: ['#seafood', '#coastal', '#bray', '#irishfood', '#sustainable'],
        changeType: 'update'
      }
    ],
    status: 'approved',
    createdAt: new Date('2024-01-24T09:30:00Z'),
    reviewedAt: new Date('2024-01-24T15:20:00Z'),
    notes: 'Good addition of sustainability tag',
    restaurantName: 'Loading Bay',
    analystName: 'Mike Chen'
  }
];

/**
 * Mock rejected changes for demonstration
 */
export const mockRejectedChanges: RestaurantChange[] = [
  {
    id: 'change-006',
    restaurantId: '00005',
    analystId: 'analyst-003',
    managerId: 'manager-001',
    changes: [
      {
        field: 'name',
        oldValue: 'Pandini\'s restaurant',
        newValue: 'Pandini\'s Italian Restaurant',
        changeType: 'update'
      }
    ],
    status: 'rejected',
    createdAt: new Date('2024-01-23T13:15:00Z'),
    reviewedAt: new Date('2024-01-23T16:45:00Z'),
    notes: 'Name change not necessary, current name is clear and established',
    restaurantName: 'Pandini\'s restaurant',
    analystName: 'Emma Walsh'
  }
];

/**
 * Helper function to get all changes by status
 */
export const getChangesByStatus = (status: 'pending' | 'approved' | 'rejected') => {
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
};

/**
 * Helper function to get changes by restaurant ID
 */
export const getChangesByRestaurantId = (restaurantId: string) => {
  return [
    ...mockPendingChanges,
    ...mockApprovedChanges,
    ...mockRejectedChanges
  ].filter(change => change.restaurantId === restaurantId);
};