import { AdminRoleEnum } from '@/types/enums';

/**
 * User model with role-based access control
 */
export type User = {
  id: string;
  username: string;
  profileImage: string;
  role: AdminRoleEnum;
  name: string;
  email: string;
};

/**
 * Mock user data for the Gontrel Admin interface
 * Includes analysts, managers, and admins with realistic profile images
 */
export const mockUsers: User[] = [
  // Analysts - can only see their own added restaurants
  {
    id: 'user-001',
    username: 'sarah.analyst',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gontrel.com'
  },
  {
    id: 'user-002',
    username: 'mike.analyst',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Mike Chen',
    email: 'mike.chen@gontrel.com'
  },
  {
    id: 'user-003',
    username: 'emma.analyst',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@gontrel.com'
  },
  {
    id: 'user-004',
    username: 'david.analyst',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'David Thompson',
    email: 'david.thompson@gontrel.com'
  },
  {
    id: 'user-005',
    username: 'lisa.analyst',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Lisa Wang',
    email: 'lisa.wang@gontrel.com'
  },
  {
    id: 'user-006',
    username: 'john.analyst',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'John Smith',
    email: 'john.smith@gontrel.com'
  },
  {
    id: 'user-007',
    username: 'anna.analyst',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Anna Kowalski',
    email: 'anna.kowalski@gontrel.com'
  },
  {
    id: 'user-008',
    username: 'tom.analyst',
    profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Tom O\'Connor',
    email: 'tom.oconnor@gontrel.com'
  },
  {
    id: 'user-009',
    username: 'rachel.analyst',
    profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Rachel Green',
    email: 'rachel.green@gontrel.com'
  },
  {
    id: 'user-010',
    username: 'kevin.analyst',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Kevin Murphy',
    email: 'kevin.murphy@gontrel.com'
  },
  {
    id: 'user-011',
    username: 'sophie.analyst',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Sophie Williams',
    email: 'sophie.williams@gontrel.com'
  },
  {
    id: 'user-012',
    username: 'paul.analyst',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Paul Davis',
    email: 'paul.davis@gontrel.com'
  },
  {
    id: 'user-013',
    username: 'maria.analyst',
    profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Maria Garcia',
    email: 'maria.garcia@gontrel.com'
  },
  {
    id: 'user-014',
    username: 'james.analyst',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'James Wilson',
    email: 'james.wilson@gontrel.com'
  },
  {
    id: 'user-015',
    username: 'fiona.analyst',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Fiona O\'Brien',
    email: 'fiona.obrien@gontrel.com'
  },
  {
    id: 'user-016',
    username: 'claire.analyst',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Claire Taylor',
    email: 'claire.taylor@gontrel.com'
  },
  {
    id: 'user-017',
    username: 'brian.analyst',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ANALYST,
    name: 'Brian Anderson',
    email: 'brian.anderson@gontrel.com'
  },

  // Managers - can see all restaurants
  {
    id: 'user-101',
    username: 'alex.manager',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.MANAGER,
    name: 'Alex Johnson',
    email: 'alex.johnson@gontrel.com'
  },
  {
    id: 'user-102',
    username: 'sophia.manager',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.MANAGER,
    name: 'Sophia Chen',
    email: 'sophia.chen@gontrel.com'
  },
  {
    id: 'user-103',
    username: 'marcus.manager',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.MANAGER,
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@gontrel.com'
  },

  // Admins - can see all restaurants and manage users
  {
    id: 'user-201',
    username: 'admin.gontrel',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ADMIN,
    name: 'Admin User',
    email: 'admin@gontrel.com'
  },
  {
    id: 'user-202',
    username: 'super.admin',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: AdminRoleEnum.ADMIN,
    name: 'Super Admin',
    email: 'superadmin@gontrel.com'
  }
];

/**
 * Get current user (hardcoded as a manager for development)
 */
export const getCurrentUser = (): User => {
  // Hardcoded current user as a manager
  return mockUsers.find(user => user.username === 'alex.manager') || mockUsers[0];
};

/**
 * Get user by ID
 */
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Get user by username
 */
export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username === username);
};