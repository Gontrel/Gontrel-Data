import { TableStatus } from '@/constant/table';
import { PendingRestaurantType, PendingVideoType } from '@/types/restaurant';


/**
 * Mock pending restaurants data for admin approval
 */
export const mockPendingRestaurants: PendingRestaurantType[] = [
  {
    restaurantId: 'pending-001',
    name: 'The Ivy Dublin',
    address: {
      status: TableStatus.PENDING,
      name: '13-17 Dawson Street, Dublin 2'
    },
    maplink: 'https://maps.google.com/?q=13-17+Dawson+Street,+Dublin+2,+Ireland',
    website: 'https://www.theivydublin.com',
    menuUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.theivydublin.com/menu'
    },
    reservationUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.theivydublin.com/reservations'
    },
    addedBy: {
      userId: 'user-101',
      name: 'Jennifer Walsh',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
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
        status: TableStatus.APPROVED
      },
      {
        id: 'video-002',
        videoUrl: 'https://www.youtube.com/watch?v=restaurant_interior_1',
        tags: [
          { id: 'tag-004', name: 'Interior Design' },
          { id: 'tag-005', name: 'Atmosphere' }
        ],
        status: TableStatus.APPROVED
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
      status: TableStatus.PENDING,
      name: '8 Sussex Terrace, Dublin 4'
    },
    maplink: 'https://maps.google.com/?q=8+Sussex+Terrace,+Dublin+4,+Ireland',
    website: 'https://www.forestavenue.ie',
    menuUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.forestavenue.ie/menu'
    },
    reservationUrl: {
      status: TableStatus.PENDING,
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
        status: TableStatus.PENDING
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
      status: TableStatus.PENDING,
      name: '19A Main Street, Blackrock, Co. Dublin'
    },
    maplink: 'https://maps.google.com/?q=19A+Main+Street,+Blackrock,+Co.+Dublin,+Ireland',
    website: 'https://www.liathrestaurant.com',
    menuUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.liathrestaurant.com/menu'
    },
    reservationUrl: {
      status: TableStatus.PENDING,
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
        status: TableStatus.PENDING
      },
      {
        id: 'video-005',
        videoUrl: 'https://www.youtube.com/watch?v=liath_chef_interview',
        tags: [
          { id: 'tag-012', name: 'Chef Interview' },
          { id: 'tag-013', name: 'Behind the Scenes' }
        ],
        status: TableStatus.PENDING
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
      status: TableStatus.PENDING,
      name: '78 Thomas Street, Dublin 8'
    },
    maplink: 'https://maps.google.com/?q=78+Thomas+Street,+Dublin+8,+Ireland',
    website: 'https://www.varietyjones.ie',
    menuUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.varietyjones.ie/menu'
    },
    reservationUrl: {
      status: TableStatus.PENDING,
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
        status: TableStatus.PENDING
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
      status: TableStatus.PENDING,
      name: 'Cliff at Lyons, Lyons Demesne, Celbridge, Co. Kildare'
    },
    maplink: 'https://maps.google.com/?q=Cliff+at+Lyons,+Lyons+Demesne,+Celbridge,+Co.+Kildare,+Ireland',
    website: 'https://www.aimsir.ie',
    menuUrl: {
      status: TableStatus.PENDING,
      url: 'https://www.aimsir.ie/menu'
    },
    reservationUrl: {
      status: TableStatus.PENDING,
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
        status: TableStatus.PENDING
      },
      {
        id: 'video-008',
        videoUrl: 'https://www.youtube.com/watch?v=aimsir_garden_tour',
        tags: [
          { id: 'tag-021', name: 'Garden Tour' },
          { id: 'tag-022', name: 'Sustainability' }
        ],
        status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
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
      status: TableStatus.PENDING
    }],
    dateAdded: new Date('2024-02-13T11:40:00'),
    addedBy: {
      userId: 'user-113',
      name: 'Emma Thompson',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  }
];