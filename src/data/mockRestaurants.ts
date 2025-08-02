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
  }
];

/**
 * Mock pending restaurants data for admin approval
 */
export const mockPendingRestaurants: PendingRestaurantType[] = [
  {
    id: 'pending-001',
    createdAt: '2024-02-01T00:00:00Z',
    modifiedAt: '2024-02-01T00:00:00Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    firebaseId: null,
    name: 'The Ivy Dublin',
    address: {
      status: TableStatusEnum.PENDING,
      content: '13-17 Dawson Street, Dublin 2'
    },
    lat: 53.3407,
    lng: -6.2574,
    menu: {
      status: TableStatusEnum.PENDING,
      content: 'https://www.theivydublin.com/menu'
    },
    openingHours: [
      { dayOfTheWeek: 'monday', opensAt: 800, closesAt: 2300 },
      { dayOfTheWeek: 'tuesday', opensAt: 800, closesAt: 2300 },
      { dayOfTheWeek: 'wednesday', opensAt: 800, closesAt: 2300 },
      { dayOfTheWeek: 'thursday', opensAt: 800, closesAt: 2300 },
      { dayOfTheWeek: 'friday', opensAt: 800, closesAt: 2400 },
      { dayOfTheWeek: 'saturday', opensAt: 800, closesAt: 2400 },
      { dayOfTheWeek: 'sunday', opensAt: 800, closesAt: 2300 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
    ],
    phoneNumber: '+353 1 123 4567',
    priceLevel: 3,
    rating: 4.5,
    reservation: {
      status: TableStatusEnum.PENDING,
      content: 'https://www.theivydublin.com/reservations'
    },
    toilets: true,
    type: 'Fine Dining',
    website: 'https://www.theivydublin.com',
    status: 'PENDING',
    comment: null,
    mapLink: 'https://maps.google.com/?q=13-17+Dawson+Street,+Dublin+2,+Ireland',
    country: 'Ireland',
    admin: {
      id: 'admin-101',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-admin-101',
      name: 'Jennifer Walsh',
      phoneNumber: '+353 85 123 4567',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      email: 'jennifer.walsh@gontrel.com',
      password: 'hashed_password',
      isVerified: true,
      role: 'MANAGER'
    },
    posts: [],
    tags: ['Fine Dining', 'Irish Cuisine', 'Dublin'],
    videos: {
      total: 0,
      approved: 0,
      pending: 0,
      declined: 0
    }
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
    posts: [{
      id: 'video-009',
      createdAt: '2024-02-06T09:30:00Z',
      modifiedAt: '2024-02-06T09:30:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-video-009',
      analytics: {},
      tiktokLink: '',
      videoUrl: 'https://www.youtube.com/watch?v=chapter_one_new_dish',
      thumbUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      postedAt: null,
      source: 'youtube',
      status: TableStatusEnum.PENDING,
      tags: [
        {
          id: 'tag-023',
          createdAt: '2024-02-06T09:30:00Z',
          modifiedAt: '2024-02-06T09:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-023',
          count: 1,
          name: 'New Menu',
          imageUrl: '',
          resource: 'restaurant',
          type: 'menu',
          isTaste: false
        },
        {
          id: 'tag-024',
          createdAt: '2024-02-06T09:30:00Z',
          modifiedAt: '2024-02-06T09:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-024',
          count: 1,
          name: 'Chef Special',
          imageUrl: '',
          resource: 'restaurant',
          type: 'dish',
          isTaste: false
        },
        {
          id: 'tag-025',
          createdAt: '2024-02-06T09:30:00Z',
          modifiedAt: '2024-02-06T09:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-025',
          count: 1,
          name: 'Seasonal',
          imageUrl: '',
          resource: 'restaurant',
          type: 'season',
          isTaste: false
        }
      ]
    }],
    dateAdded: new Date('2024-02-06T09:30:00'),
    addedBy: 'Patrick Doyle',
    createdAt: '2024-02-06T09:30:00Z'
  }
];

/**
 * Mock submitted restaurants data for admin review
 */
export const mockSubmittedRestaurants: SubmittedRestaurantType[] = [
  {
    id: 'submitted-001',
    createdAt: '2024-02-14T09:15:00Z',
    modifiedAt: '2024-02-14T09:15:00Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    firebaseId: null,
    name: 'The Old Spot',
    address: {
      status: TableStatusEnum.PENDING,
      content: '14 Bath Avenue, Dublin 4'
    },
    lat: 53.3271,
    lng: -6.2442,
    menu: {
      status: TableStatusEnum.PENDING,
      content: 'https://www.theoldspot.ie/menu'
    },
    openingHours: [
      { dayOfTheWeek: 'monday', opensAt: 1200, closesAt: 2200 },
      { dayOfTheWeek: 'tuesday', opensAt: 1200, closesAt: 2200 },
      { dayOfTheWeek: 'wednesday', opensAt: 1200, closesAt: 2200 },
      { dayOfTheWeek: 'thursday', opensAt: 1200, closesAt: 2200 },
      { dayOfTheWeek: 'friday', opensAt: 1200, closesAt: 2300 },
      { dayOfTheWeek: 'saturday', opensAt: 1200, closesAt: 2300 },
      { dayOfTheWeek: 'sunday', opensAt: 1200, closesAt: 2200 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
    ],
    phoneNumber: '+353 1 668 0900',
    priceLevel: 2,
    rating: 4.3,
    reservation: {
      status: TableStatusEnum.PENDING,
      content: 'https://www.theoldspot.ie/book'
    },
    toilets: true,
    type: 'Gastropub',
    website: 'https://www.theoldspot.ie',
    status: 'PENDING',
    comment: 'New gastropub submission with excellent reviews and local following.',
    mapLink: 'https://maps.google.com/?q=14+Bath+Avenue,+Dublin+4,+Ireland',
    country: 'Ireland',
    admin: {
      id: 'admin-201',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-admin-201',
      name: 'Michael O\'Connor',
      phoneNumber: '+353 85 123 4567',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      email: 'michael.oconnor@gontrel.com',
      password: 'hashed_password',
      isVerified: true,
      role: 'MANAGER'
    },
    posts: [
      {
        id: 'video-017',
        createdAt: '2024-02-14T09:15:00Z',
        modifiedAt: '2024-02-14T09:15:00Z',
        deletedAt: null,
        deletedBy: null,
        updatedBy: null,
        firebaseId: 'firebase-video-017',
        analytics: {},
        tiktokLink: '',
        videoUrl: 'https://www.youtube.com/watch?v=old_spot_tour',
        thumbUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        postedAt: null,
        source: 'youtube',
        status: TableStatusEnum.PENDING,
        tags: [
          {
            id: 'tag-047',
            createdAt: '2024-02-14T09:15:00Z',
            modifiedAt: '2024-02-14T09:15:00Z',
            deletedAt: null,
            deletedBy: null,
            updatedBy: null,
            firebaseId: 'firebase-tag-047',
            count: 1,
            name: 'Gastropub',
            imageUrl: '',
            resource: 'restaurant',
            type: 'venue',
            isTaste: false
          },
          {
            id: 'tag-048',
            createdAt: '2024-02-14T09:15:00Z',
            modifiedAt: '2024-02-14T09:15:00Z',
            deletedAt: null,
            deletedBy: null,
            updatedBy: null,
            firebaseId: 'firebase-tag-048',
            count: 1,
            name: 'Dublin 4',
            imageUrl: '',
            resource: 'restaurant',
            type: 'location',
            isTaste: false
          },
          {
            id: 'tag-049',
            createdAt: '2024-02-14T09:15:00Z',
            modifiedAt: '2024-02-14T09:15:00Z',
            deletedAt: null,
            deletedBy: null,
            updatedBy: null,
            firebaseId: 'firebase-tag-049',
            count: 1,
            name: 'Local Favorite',
            imageUrl: '',
            resource: 'restaurant',
            type: 'rating',
            isTaste: false
          }
        ]
      }
    ],
    tags: ['Gastropub', 'Dublin 4', 'Local Favorite', 'Irish Cuisine'],
    videos: {
      total: 1,
      approved: 0,
      pending: 1,
      declined: 0
    }
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
    posts: [{
      id: 'video-025',
      createdAt: '2024-02-19T10:30:00Z',
      modifiedAt: '2024-02-19T10:30:00Z',
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: 'firebase-video-025',
      analytics: {},
      tiktokLink: '',
      videoUrl: 'https://www.youtube.com/watch?v=chapter_one_chef_interview',
      thumbUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      postedAt: null,
      source: 'youtube',
      status: TableStatusEnum.PENDING,
      tags: [
        {
          id: 'tag-069',
          createdAt: '2024-02-19T10:30:00Z',
          modifiedAt: '2024-02-19T10:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-069',
          count: 1,
          name: 'Chef Interview',
          imageUrl: '',
          resource: 'restaurant',
          type: 'content',
          isTaste: false
        },
        {
          id: 'tag-070',
          createdAt: '2024-02-19T10:30:00Z',
          modifiedAt: '2024-02-19T10:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-070',
          count: 1,
          name: 'Behind the Scenes',
          imageUrl: '',
          resource: 'restaurant',
          type: 'content',
          isTaste: false
        },
        {
          id: 'tag-071',
          createdAt: '2024-02-19T10:30:00Z',
          modifiedAt: '2024-02-19T10:30:00Z',
          deletedAt: null,
          deletedBy: null,
          updatedBy: null,
          firebaseId: 'firebase-tag-071',
          count: 1,
          name: 'Fine Dining',
          imageUrl: '',
          resource: 'restaurant',
          type: 'cuisine',
          isTaste: false
        }
      ]
    }],
    dateAdded: new Date('2024-02-19T10:30:00'),
    addedBy: 'Patrick Doyle',
    createdAt: '2024-02-19T10:30:00Z'
  }
];