import { TableStatusEnum } from '@/types/enums';
import { ActiveRestaurantType, PendingRestaurantType, PendingVideoType, SubmittedRestaurantType, SubmittedVideoType } from '@/types/restaurant';

/**
 * Mock restaurant data matching the ActiveRestaurantType interface
 * Updated with real restaurant names and addresses from Ireland
 */
export const mockActiveRestaurants: ActiveRestaurantType[] = [
  {
    id: 'active-rest-001',
    createdAt: '2024-01-15T16:30:00Z',
    modifiedAt: '2024-01-15T16:30:00Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    firebaseId: null,
    address: {
      status: 'APPROVED',
      content: '18-19 Parnell Square, Dublin 1',
    },
    lat: 53.3542,
    lng: -6.2604,
    menu: {
      status: 'APPROVED',
      content: 'https://www.chapteronerestaurant.com/menu'
    },
    name: 'Chapter One',
    openingHours: [
      { dayOfTheWeek: 'monday', opensAt: 0, closesAt: 0 }, // Closed
      { dayOfTheWeek: 'tuesday', opensAt: 1200, closesAt: 1430 },
      { dayOfTheWeek: 'tuesday', opensAt: 1800, closesAt: 2130 },
      { dayOfTheWeek: 'wednesday', opensAt: 1200, closesAt: 1430 },
      { dayOfTheWeek: 'wednesday', opensAt: 1800, closesAt: 2130 },
      { dayOfTheWeek: 'thursday', opensAt: 1200, closesAt: 1430 },
      { dayOfTheWeek: 'thursday', opensAt: 1800, closesAt: 2130 },
      { dayOfTheWeek: 'friday', opensAt: 1200, closesAt: 1430 },
      { dayOfTheWeek: 'friday', opensAt: 1800, closesAt: 2130 },
      { dayOfTheWeek: 'saturday', opensAt: 1200, closesAt: 1430 },
      { dayOfTheWeek: 'saturday', opensAt: 1800, closesAt: 2130 },
      { dayOfTheWeek: 'sunday', opensAt: 0, closesAt: 0 } // Closed
    ],
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'
    ],
    phoneNumber: '+353 1 873 2266',
    priceLevel: 4,
    rating: 4.8,
    reservation: {
      status: 'APPROVED',
      content: 'https://www.chapteronerestaurant.com/reservations'
    },
    toilets: true,
    type: 'Fine Dining',
    website: 'https://www.chapteronerestaurant.com',
    status: 'ACTIVE',
    comment: null,
    admin: {
      id: 'admin-001',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-admin-001',
      name: 'Sarah Johnson',
      phoneNumber: '+353 85 123 4567',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      email: 'sarah.johnson@gontrel.com',
      password: 'hashed_password',
      isVerified: true,
      role: 'MANAGER'
    },
    posts: [],
    tags: ['Fine Dining', 'Dublin', 'Michelin', 'Irish Cuisine'],
    videos: {
      total: 0,
      approved: 0,
      pending: 0,
      declined: 0
    },
    pagination: {
      total: 1,
      perPage: 20,
      pageNumber: 1,
      pageSize: 20,
      lastTokenId: ''
    },
    meta: {
      totalLocations: 1,
      activeLocations: 1,
      pendingLocations: 0,
      declinedLocations: 0,
      totalPosts: 0,
      pendingPosts: 0,
      activePosts: 0,
      declinedPosts: 0
    }
  },
  {
    id: 'active-rest-002',
    createdAt: '2024-01-16T14:15:00Z',
    modifiedAt: '2024-01-16T14:15:00Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    firebaseId: null,
    address: {
      status: 'APPROVED',
      content: 'Dawson Street, Dublin 2',
    },
    lat: 53.3407,
    lng: -6.2574,
    menu: {
      status: 'APPROVED',
      content: 'https://www.thegreenhouserestaurant.ie/menu'
    },
    name: 'The Greenhouse',
    openingHours: [
      { dayOfTheWeek: 'monday', opensAt: 0, closesAt: 0 }, // Closed
      { dayOfTheWeek: 'tuesday', opensAt: 1800, closesAt: 2100 },
      { dayOfTheWeek: 'wednesday', opensAt: 1800, closesAt: 2100 },
      { dayOfTheWeek: 'thursday', opensAt: 1800, closesAt: 2100 },
      { dayOfTheWeek: 'friday', opensAt: 1800, closesAt: 2100 },
      { dayOfTheWeek: 'saturday', opensAt: 1800, closesAt: 2100 },
      { dayOfTheWeek: 'sunday', opensAt: 0, closesAt: 0 } // Closed
    ],
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
    ],
    phoneNumber: '+353 1 676 7015',
    priceLevel: 4,
    rating: 4.7,
    reservation: {
      status: 'APPROVED',
      content: 'https://www.thegreenhouserestaurant.ie/book'
    },
    toilets: true,
    type: 'Fine Dining',
    website: 'https://www.thegreenhouserestaurant.ie',
    status: 'ACTIVE',
    comment: null,
    admin: {
      id: 'admin-002',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-admin-002',
      name: 'Mike Chen',
      phoneNumber: '+353 85 234 5678',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      email: 'mike.chen@gontrel.com',
      password: 'hashed_password',
      isVerified: true,
      role: 'MANAGER'
    },
    posts: [],
    tags: ['Fine Dining', 'Dublin', 'Contemporary', 'European'],
    videos: {
      total: 0,
      approved: 0,
      pending: 0,
      declined: 0
    },
    pagination: {
      total: 1,
      perPage: 20,
      pageNumber: 1,
      pageSize: 20,
      lastTokenId: ''
    },
    meta: {
      totalLocations: 1,
      activeLocations: 1,
      pendingLocations: 0,
      declinedLocations: 0,
      totalPosts: 0,
      pendingPosts: 0,
      activePosts: 0,
      declinedPosts: 0
    }
  },
  {
    id: 'active-rest-003',
    createdAt: '2024-01-17T09:45:00Z',
    modifiedAt: '2024-01-17T09:45:00Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    firebaseId: null,
    address: {
      status: 'APPROVED',
      content: '109 Lower Baggot Street, Dublin 2',
    },
    lat: 53.3385,
    lng: -6.2526,
    menu: {
      status: 'APPROVED',
      content: 'https://www.lecrivain.com/menu'
    },
    name: 'L\'Ecrivain',
    openingHours: [
      { dayOfTheWeek: 'monday', opensAt: 0, closesAt: 0 }, // Closed
      { dayOfTheWeek: 'tuesday', opensAt: 1230, closesAt: 1400 },
      { dayOfTheWeek: 'tuesday', opensAt: 1830, closesAt: 2100 },
      { dayOfTheWeek: 'wednesday', opensAt: 1230, closesAt: 1400 },
      { dayOfTheWeek: 'wednesday', opensAt: 1830, closesAt: 2100 },
      { dayOfTheWeek: 'thursday', opensAt: 1230, closesAt: 1400 },
      { dayOfTheWeek: 'thursday', opensAt: 1830, closesAt: 2100 },
      { dayOfTheWeek: 'friday', opensAt: 1230, closesAt: 1400 },
      { dayOfTheWeek: 'friday', opensAt: 1830, closesAt: 2100 },
      { dayOfTheWeek: 'saturday', opensAt: 1230, closesAt: 1400 },
      { dayOfTheWeek: 'saturday', opensAt: 1830, closesAt: 2100 },
      { dayOfTheWeek: 'sunday', opensAt: 0, closesAt: 0 } // Closed
    ],
    photos: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop'
    ],
    phoneNumber: '+353 1 661 1919',
    priceLevel: 4,
    rating: 4.6,
    reservation: {
      status: 'APPROVED',
      content: 'https://www.lecrivain.com/reservations'
    },
    toilets: true,
    type: 'Fine Dining',
    website: 'https://www.lecrivain.com',
    status: 'ACTIVE',
    comment: null,
    admin: {
      id: 'admin-003',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-admin-003',
      name: 'Emma Rodriguez',
      phoneNumber: '+353 85 345 6789',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      email: 'emma.rodriguez@gontrel.com',
      password: 'hashed_password',
      isVerified: true,
      role: 'MANAGER'
    },
    posts: [],
    tags: ['Fine Dining', 'Dublin', 'French', 'Michelin'],
    videos: {
      total: 0,
      approved: 0,
      pending: 0,
      declined: 0
    },
    pagination: {
      total: 1,
      perPage: 20,
      pageNumber: 1,
      pageSize: 20,
      lastTokenId: ''
    },
    meta: {
      totalLocations: 1,
      activeLocations: 1,
      pendingLocations: 0,
      declinedLocations: 0,
      totalPosts: 0,
      pendingPosts: 0,
      activePosts: 0,
      declinedPosts: 0
    }
  }
];

/**
 * Mock pending restaurants data for admin approval
 */
export const mockPendingRestaurants: PendingRestaurantType[] = [
  {
    restaurantId: 'pending-001',
    name: 'The Ivy Dublin',
    address: {
      status: TableStatusEnum.PENDING,
      name: '13-17 Dawson Street, Dublin 2'
    },
    maplink: 'https://maps.google.com/?q=13-17+Dawson+Street,+Dublin+2,+Ireland',
    website: 'https://www.theivydublin.com',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.theivydublin.com/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.theivydublin.com/reservations'
    },
    addedBy: {
      userId: 'user-101',
      name: 'Jennifer Walsh',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: '8:00 AM - 11:00 PM',
      tuesday: '8:00 AM - 11:00 PM',
      wednesday: '8:00 AM - 11:00 PM',
      thursday: '8:00 AM - 11:00 PM',
      friday: '8:00 AM - 12:00 AM',
      saturday: '8:00 AM - 12:00 AM',
      sunday: '8:00 AM - 11:00 PM'
    },
    videos: [
      {
        id: 'video-001',
        videoUrl: 'https://www.youtube.com/watch?v=restaurant_tour_1',
        tags: [
          { id: 'tag-001', name: 'Fine Dining' },
          { id: 'tag-002', name: 'Irish Cuisine' },
          { id: 'tag-003', name: 'Dublin' }
        ],
        status: TableStatusEnum.APPROVED
      },
      {
        id: 'video-002',
        videoUrl: 'https://www.youtube.com/watch?v=restaurant_interior_1',
        tags: [
          { id: 'tag-004', name: 'Interior Design' },
          { id: 'tag-005', name: 'Atmosphere' }
        ],
        status: TableStatusEnum.APPROVED
      }
    ],
    dateAdded: new Date('2024-02-01T10:30:00'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    restaurantId: 'pending-002',
    name: 'Forest Avenue',
    address: {
      status: TableStatusEnum.PENDING,
      name: '8 Sussex Terrace, Dublin 4'
    },
    maplink: 'https://maps.google.com/?q=8+Sussex+Terrace,+Dublin+4,+Ireland',
    website: 'https://www.forestavenue.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.forestavenue.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.forestavenue.ie/book'
    },
    addedBy: {
      userId: 'user-102',
      name: 'Michael O\'Sullivan',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:00 PM',
      wednesday: '6:00 PM - 9:00 PM',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-003',
        videoUrl: 'https://www.youtube.com/watch?v=forest_avenue_tour',
        tags: [
          { id: 'tag-006', name: 'Tasting Menu' },
          { id: 'tag-007', name: 'Seasonal' },
          { id: 'tag-008', name: 'Dublin 4' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-02T14:15:00'),
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-02')
  },
  {
    restaurantId: 'pending-003',
    name: 'Liath',
    address: {
      status: TableStatusEnum.PENDING,
      name: '19A Main Street, Blackrock, Co. Dublin'
    },
    maplink: 'https://maps.google.com/?q=19A+Main+Street,+Blackrock,+Co.+Dublin,+Ireland',
    website: 'https://www.liathrestaurant.com',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.liathrestaurant.com/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.liathrestaurant.com/reservations'
    },
    addedBy: {
      userId: 'user-103',
      name: 'Aoife Murphy',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: '6:00 PM - 9:00 PM',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-004',
        videoUrl: 'https://www.youtube.com/watch?v=liath_restaurant',
        tags: [
          { id: 'tag-009', name: 'Michelin Star' },
          { id: 'tag-010', name: 'Blackrock' },
          { id: 'tag-011', name: 'Contemporary Irish' }
        ],
        status: TableStatusEnum.PENDING
      },
      {
        id: 'video-005',
        videoUrl: 'https://www.youtube.com/watch?v=liath_chef_interview',
        tags: [
          { id: 'tag-012', name: 'Chef Interview' },
          { id: 'tag-013', name: 'Behind the Scenes' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-03T16:45:00'),
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03')
  },
  {
    restaurantId: 'pending-004',
    name: 'Variety Jones',
    address: {
      status: TableStatusEnum.PENDING,
      name: '78 Thomas Street, Dublin 8'
    },
    maplink: 'https://maps.google.com/?q=78+Thomas+Street,+Dublin+8,+Ireland',
    website: 'https://www.varietyjones.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.varietyjones.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.varietyjones.ie/book'
    },
    addedBy: {
      userId: 'user-104',
      name: 'Sean Kelly',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 10:00 PM',
      wednesday: '5:00 PM - 10:00 PM',
      thursday: '5:00 PM - 10:00 PM',
      friday: '5:00 PM - 10:00 PM',
      saturday: '5:00 PM - 10:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-006',
        videoUrl: 'https://www.youtube.com/watch?v=variety_jones_tour',
        tags: [
          { id: 'tag-014', name: 'Casual Dining' },
          { id: 'tag-015', name: 'Thomas Street' },
          { id: 'tag-016', name: 'Local Favorite' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-04T11:20:00'),
    createdAt: new Date('2024-02-04'),
    updatedAt: new Date('2024-02-04')
  },
  {
    restaurantId: 'pending-005',
    name: 'Aimsir',
    address: {
      status: TableStatusEnum.PENDING,
      name: 'Cliff at Lyons, Lyons Demesne, Celbridge, Co. Kildare'
    },
    maplink: 'https://maps.google.com/?q=Cliff+at+Lyons,+Lyons+Demesne,+Celbridge,+Co.+Kildare,+Ireland',
    website: 'https://www.aimsir.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.aimsir.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.aimsir.ie/reservations'
    },
    addedBy: {
      userId: 'user-105',
      name: 'Niamh O\'Connor',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: 'Closed',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-007',
        videoUrl: 'https://www.youtube.com/watch?v=aimsir_experience',
        tags: [
          { id: 'tag-017', name: 'Michelin Star' },
          { id: 'tag-018', name: 'Kildare' },
          { id: 'tag-019', name: 'Countryside' },
          { id: 'tag-020', name: 'Luxury Dining' }
        ],
        status: TableStatusEnum.PENDING
      },
      {
        id: 'video-008',
        videoUrl: 'https://www.youtube.com/watch?v=aimsir_garden_tour',
        tags: [
          { id: 'tag-021', name: 'Garden Tour' },
          { id: 'tag-022', name: 'Sustainability' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-05T13:55:00'),
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  }
];

/**
 * Mock pending videos data for admin approval
 */
export const mockPendingVideos: PendingVideoType[] = [
  {
    id: 'pending-video-001',
    restaurantId: 'rest-001',
    name: 'Chapter One - New Menu Feature',
    videos: [{
      id: 'video-009',
      videoUrl: 'https://www.youtube.com/watch?v=chapter_one_new_dish',
      tags: [
        { id: 'tag-023', name: 'New Menu' },
        { id: 'tag-024', name: 'Chef Special' },
        { id: 'tag-025', name: 'Seasonal' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-06T09:30:00'),
    addedBy: {
      userId: 'user-106',
      name: 'Patrick Doyle',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-002',
    restaurantId: 'rest-002',
    name: 'The Greenhouse - Wine Pairing Guide',
    videos: [{
      id: 'video-010',
      videoUrl: 'https://www.youtube.com/watch?v=greenhouse_wine_pairing',
      tags: [
        { id: 'tag-026', name: 'Wine Pairing' },
        { id: 'tag-027', name: 'Sommelier' },
        { id: 'tag-028', name: 'Fine Dining' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-07T15:45:00'),
    addedBy: {
      userId: 'user-107',
      name: 'Isabella Martinez',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-003',
    restaurantId: 'rest-003',
    name: 'L\'Ecrivain - Kitchen Tour',
    videos: [{
      id: 'video-011',
      videoUrl: 'https://www.youtube.com/watch?v=lecrivain_kitchen_tour',
      tags: [
        { id: 'tag-029', name: 'Kitchen Tour' },
        { id: 'tag-030', name: 'Behind the Scenes' },
        { id: 'tag-031', name: 'French Cuisine' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-08T12:20:00'),
    addedBy: {
      userId: 'user-108',
      name: 'Thomas Brown',
      profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-004',
    restaurantId: 'rest-004',
    name: 'Patrick Guilbaud - Service Excellence',
    videos: [{
      id: 'video-012',
      videoUrl: 'https://www.youtube.com/watch?v=patrick_guilbaud_service',
      tags: [
        { id: 'tag-032', name: 'Service Excellence' },
        { id: 'tag-033', name: 'Fine Dining' },
        { id: 'tag-034', name: 'Dublin 2' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-09T17:10:00'),
    addedBy: {
      userId: 'user-109',
      name: 'Grace O\'Malley',
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-005',
    restaurantId: 'rest-005',
    name: 'The Winding Stair - Live Music Night',
    videos: [{
      id: 'video-013',
      videoUrl: 'https://www.youtube.com/watch?v=winding_stair_live_music',
      tags: [
        { id: 'tag-035', name: 'Live Music' },
        { id: 'tag-036', name: 'Atmosphere' },
        { id: 'tag-037', name: 'Cultural' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-10T14:35:00'),
    addedBy: {
      userId: 'user-110',
      name: 'Daniel Lynch',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-006',
    restaurantId: 'rest-006',
    name: 'Bunsen - Burger Making Process',
    videos: [{
      id: 'video-014',
      videoUrl: 'https://www.youtube.com/watch?v=bunsen_burger_making',
      tags: [
        { id: 'tag-038', name: 'Burger Making' },
        { id: 'tag-039', name: 'Behind the Scenes' },
        { id: 'tag-040', name: 'Casual Dining' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-11T10:50:00'),
    addedBy: {
      userId: 'user-111',
      name: 'Sarah O\'Brien',
      profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-007',
    restaurantId: 'rest-007',
    name: 'Uno Mas - Tapas Tour',
    videos: [{
      id: 'video-015',
      videoUrl: 'https://www.youtube.com/watch?v=uno_mas_tapas_tour',
      tags: [
        { id: 'tag-041', name: 'Tapas' },
        { id: 'tag-042', name: 'Spanish Cuisine' },
        { id: 'tag-043', name: 'Aungier Street' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-12T16:25:00'),
    addedBy: {
      userId: 'user-112',
      name: 'Carlos Rodriguez',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'pending-video-008',
    restaurantId: 'rest-008',
    name: 'Pickle - Restaurant Review',
    videos: [{
      id: 'video-016',
      videoUrl: 'https://www.youtube.com/watch?v=pickle_restaurant_review',
      tags: [
        { id: 'tag-044', name: 'Restaurant Review' },
        { id: 'tag-045', name: 'Camden Street' },
        { id: 'tag-046', name: 'Food Blog' }
      ],
      status: TableStatusEnum.PENDING
    }],
    dateAdded: new Date('2024-02-13T11:40:00'),
    addedBy: {
      userId: 'user-113',
      name: 'Emma Thompson',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  }
];

/**
 * Mock submitted restaurants data for admin review
 */
export const mockSubmittedRestaurants: SubmittedRestaurantType[] = [
  {
    restaurantId: 'submitted-001',
    name: 'The Old Spot',
    address: {
      status: TableStatusEnum.PENDING,
      name: '14 Bath Avenue, Dublin 4'
    },
    maplink: 'https://maps.google.com/?q=14+Bath+Avenue,+Dublin+4,+Ireland',
    website: 'https://www.theoldspot.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.theoldspot.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.theoldspot.ie/book'
    },
    comment: 'New gastropub submission with excellent reviews and local following.',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    videos: [
      {
        id: 'video-017',
        videoUrl: 'https://www.youtube.com/watch?v=old_spot_tour',
        tags: [
          { id: 'tag-047', name: 'Gastropub' },
          { id: 'tag-048', name: 'Dublin 4' },
          { id: 'tag-049', name: 'Local Favorite' }
        ],
        status: TableStatusEnum.PENDING
      },
      {
        id: 'video-018',
        videoUrl: 'https://www.youtube.com/watch?v=old_spot_food_review',
        tags: [
          { id: 'tag-050', name: 'Food Review' },
          { id: 'tag-051', name: 'Irish Pub Food' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-14T09:15:00'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14')
  },
  {
    restaurantId: 'submitted-002',
    name: 'Delahunt',
    address: {
      status: TableStatusEnum.PENDING,
      name: '39 Camden Street Lower, Dublin 2'
    },
    maplink: 'https://maps.google.com/?q=39+Camden+Street+Lower,+Dublin+2,+Ireland',
    website: 'https://www.delahunt.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.delahunt.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.delahunt.ie/reservations'
    },
    comment: 'Contemporary Irish restaurant with innovative menu and excellent service.',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:30 PM - 10:00 PM',
      wednesday: '5:30 PM - 10:00 PM',
      thursday: '5:30 PM - 10:00 PM',
      friday: '5:30 PM - 10:00 PM',
      saturday: '5:30 PM - 10:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-019',
        videoUrl: 'https://www.youtube.com/watch?v=delahunt_experience',
        tags: [
          { id: 'tag-052', name: 'Fine Dining' },
          { id: 'tag-053', name: 'Camden Street' },
          { id: 'tag-054', name: 'Contemporary Irish' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-15T16:30:00'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    restaurantId: 'submitted-003',
    name: 'The Legal Eagle',
    address: {
      status: TableStatusEnum.PENDING,
      name: '1 Chancery Place, Dublin 7'
    },
    maplink: 'https://maps.google.com/?q=1+Chancery+Place,+Dublin+7,+Ireland',
    website: 'https://www.thelegaleagle.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.thelegaleagle.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.thelegaleagle.ie/book'
    },
    comment: 'Historic gastropub with craft beer selection and traditional Irish atmosphere.',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    videos: [
      {
        id: 'video-020',
        videoUrl: 'https://www.youtube.com/watch?v=legal_eagle_tour',
        tags: [
          { id: 'tag-055', name: 'Gastropub' },
          { id: 'tag-056', name: 'Dublin 7' },
          { id: 'tag-057', name: 'Historic Building' }
        ],
        status: TableStatusEnum.PENDING
      },
      {
        id: 'video-021',
        videoUrl: 'https://www.youtube.com/watch?v=legal_eagle_beer_selection',
        tags: [
          { id: 'tag-058', name: 'Craft Beer' },
          { id: 'tag-059', name: 'Beer Selection' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-16T13:45:00'),
    createdAt: new Date('2024-02-16'),
    updatedAt: new Date('2024-02-16')
  },
  {
    restaurantId: 'submitted-004',
    name: 'Etto',
    address: {
      status: TableStatusEnum.PENDING,
      name: '18 Merrion Row, Dublin 2'
    },
    maplink: 'https://maps.google.com/?q=18+Merrion+Row,+Dublin+2,+Ireland',
    website: 'https://www.etto.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.etto.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.etto.ie/reservations'
    },
    comment: 'Italian wine bar with authentic cuisine and excellent wine selection.',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 10:00 PM',
      wednesday: '5:00 PM - 10:00 PM',
      thursday: '5:00 PM - 10:00 PM',
      friday: '5:00 PM - 10:00 PM',
      saturday: '5:00 PM - 10:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-022',
        videoUrl: 'https://www.youtube.com/watch?v=etto_restaurant',
        tags: [
          { id: 'tag-060', name: 'Italian' },
          { id: 'tag-061', name: 'Merrion Row' },
          { id: 'tag-062', name: 'Wine Bar' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-17T11:20:00'),
    createdAt: new Date('2024-02-17'),
    updatedAt: new Date('2024-02-17')
  },
  {
    restaurantId: 'submitted-005',
    name: 'The Fumbally',
    address: {
      status: TableStatusEnum.PENDING,
      name: '5 Fumbally Lane, Dublin 8'
    },
    maplink: 'https://maps.google.com/?q=5+Fumbally+Lane,+Dublin+8,+Ireland',
    website: 'https://www.thefumbally.ie',
    menuUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.thefumbally.ie/menu'
    },
    reservationUrl: {
      status: TableStatusEnum.PENDING,
      url: 'https://www.thefumbally.ie/book'
    },
    comment: 'Organic cafe with healthy food options and sustainable practices.',
    openingHours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    videos: [
      {
        id: 'video-023',
        videoUrl: 'https://www.youtube.com/watch?v=fumbally_cafe',
        tags: [
          { id: 'tag-063', name: 'Cafe' },
          { id: 'tag-064', name: 'Dublin 8' },
          { id: 'tag-065', name: 'Breakfast' },
          { id: 'tag-066', name: 'Organic' }
        ],
        status: TableStatusEnum.PENDING
      },
      {
        id: 'video-024',
        videoUrl: 'https://www.youtube.com/watch?v=fumbally_brunch',
        tags: [
          { id: 'tag-067', name: 'Brunch' },
          { id: 'tag-068', name: 'Healthy Food' }
        ],
        status: TableStatusEnum.PENDING
      }
    ],
    dateAdded: new Date('2024-02-18T14:55:00'),
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18')
  }
];

/**
 * Mock submitted videos data for admin review
 */
export const mockSubmittedVideos: SubmittedVideoType[] = [
  {
    id: 'submitted-video-001',
    restaurantId: 'rest-009',
    name: 'Chapter One - Chef Interview',
    videos: [{
      id: 'video-025',
      videoUrl: 'https://www.youtube.com/watch?v=chapter_one_chef_interview',
      tags: [
        { id: 'tag-069', name: 'Chef Interview' },
        { id: 'tag-070', name: 'Behind the Scenes' },
        { id: 'tag-071', name: 'Fine Dining' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Exclusive interview with the head chef about their culinary philosophy and signature dishes.',
    dateAdded: new Date('2024-02-19T10:30:00')
  },
  {
    id: 'submitted-video-002',
    restaurantId: 'rest-010',
    name: 'The Greenhouse - Seasonal Menu Preview',
    videos: [{
      id: 'video-026',
      videoUrl: 'https://www.youtube.com/watch?v=greenhouse_seasonal_menu',
      tags: [
        { id: 'tag-072', name: 'Seasonal Menu' },
        { id: 'tag-073', name: 'Spring Dishes' },
        { id: 'tag-074', name: 'Local Ingredients' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Preview of the new seasonal menu featuring spring ingredients and innovative dishes.',
    dateAdded: new Date('2024-02-20T15:45:00')
  },
  {
    id: 'submitted-video-003',
    restaurantId: 'rest-011',
    name: 'L\'Ecrivain - Wine Tasting Event',
    videos: [{
      id: 'video-027',
      videoUrl: 'https://www.youtube.com/watch?v=lecrivain_wine_tasting',
      tags: [
        { id: 'tag-075', name: 'Wine Tasting' },
        { id: 'tag-076', name: 'Sommelier' },
        { id: 'tag-077', name: 'French Wine' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Special wine tasting event featuring rare French wines paired with signature dishes.',
    dateAdded: new Date('2024-02-21T12:20:00')
  },
  {
    id: 'submitted-video-004',
    restaurantId: 'rest-012',
    name: 'Patrick Guilbaud - Anniversary Celebration',
    videos: [{
      id: 'video-028',
      videoUrl: 'https://www.youtube.com/watch?v=patrick_guilbaud_anniversary',
      tags: [
        { id: 'tag-078', name: 'Anniversary' },
        { id: 'tag-079', name: 'Celebration' },
        { id: 'tag-080', name: 'Fine Dining' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Celebration of the restaurant\'s anniversary with special menu and guest appearances.',
    dateAdded: new Date('2024-02-22T17:10:00')
  },
  {
    id: 'submitted-video-005',
    restaurantId: 'rest-013',
    name: 'The Winding Stair - Poetry Night',
    videos: [{
      id: 'video-029',
      videoUrl: 'https://www.youtube.com/watch?v=winding_stair_poetry_night',
      tags: [
        { id: 'tag-081', name: 'Poetry Night' },
        { id: 'tag-082', name: 'Cultural Event' },
        { id: 'tag-083', name: 'Live Performance' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Monthly poetry night featuring local poets and literary enthusiasts.',
    dateAdded: new Date('2024-02-23T14:35:00')
  },
  {
    id: 'submitted-video-006',
    restaurantId: 'rest-014',
    name: 'Bunsen - Burger Masterclass',
    videos: [{
      id: 'video-030',
      videoUrl: 'https://www.youtube.com/watch?v=bunsen_burger_masterclass',
      tags: [
        { id: 'tag-084', name: 'Burger Masterclass' },
        { id: 'tag-085', name: 'Cooking Demo' },
        { id: 'tag-086', name: 'Behind the Scenes' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Step-by-step guide to making the perfect burger, from meat selection to final assembly.',
    dateAdded: new Date('2024-02-24T10:50:00')
  },
  {
    id: 'submitted-video-007',
    restaurantId: 'rest-015',
    name: 'Uno Mas - Tapas Pairing Guide',
    videos: [{
      id: 'video-031',
      videoUrl: 'https://www.youtube.com/watch?v=uno_mas_tapas_pairing',
      tags: [
        { id: 'tag-087', name: 'Tapas Pairing' },
        { id: 'tag-088', name: 'Spanish Wine' },
        { id: 'tag-089', name: 'Food Pairing' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Comprehensive guide to pairing tapas with Spanish wines and cocktails.',
    dateAdded: new Date('2024-02-25T16:25:00')
  },
  {
    id: 'submitted-video-008',
    restaurantId: 'rest-016',
    name: 'Pickle - Chef\'s Table Experience',
    videos: [{
      id: 'video-032',
      videoUrl: 'https://www.youtube.com/watch?v=pickle_chefs_table',
      tags: [
        { id: 'tag-090', name: 'Chef\'s Table' },
        { id: 'tag-091', name: 'Exclusive Experience' },
        { id: 'tag-092', name: 'Fine Dining' }
      ],
      status: TableStatusEnum.PENDING
    }],
    comment: 'Exclusive chef\'s table experience with personalized menu and wine pairing.',
    dateAdded: new Date('2024-02-26T11:40:00')
  }
];