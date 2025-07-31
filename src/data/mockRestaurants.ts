import { TableStatusEnum } from '@/types/enums';
import { ActiveRestaurantType, PendingRestaurantType, PendingVideoType } from '@/types/restaurant';

/**
 * Mock restaurant data matching the Gontrel Admin interface
 * Updated with real restaurant names and addresses from Ireland
 */
export const mockActiveRestaurants: ActiveRestaurantType[] = [
  {
    name: 'Chapter One',
    address: '18-19 Parnell Square, Dublin 1',
    maplink: 'https://maps.google.com/?q=18-19+Parnell+Square,+Dublin+1,+Ireland',
    website: 'https://www.chapteronerestaurant.com',
    menuUrl: 'https://www.chapteronerestaurant.com/menu',
    reservationUrl: 'https://www.chapteronerestaurant.com/reservations',
    addedBy: {
      userId: 'user-001',
      name: 'Sarah Johnson',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      wednesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      thursday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      friday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      saturday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-15T16:30:00'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    name: 'The Greenhouse',
    address: 'Dawson Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=Dawson+Street,+Dublin+2,+Ireland',
    website: 'https://www.thegreenhouserestaurant.ie',
    menuUrl: 'https://www.thegreenhouserestaurant.ie/menu',
    reservationUrl: 'https://www.thegreenhouserestaurant.ie/book',
    addedBy: {
      userId: 'user-002',
      name: 'Mike Chen',
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
    dateAdded: new Date('2024-01-16T14:15:00'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    name: 'L\'Ecrivain',
    address: '109 Lower Baggot Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=109+Lower+Baggot+Street,+Dublin+2,+Ireland',
    website: 'https://www.lecrivain.com',
    menuUrl: 'https://www.lecrivain.com/menu',
    reservationUrl: 'https://www.lecrivain.com/reservations',
    addedBy: {
      userId: 'user-003',
      name: 'Emma Rodriguez',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      wednesday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      thursday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      friday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      saturday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-17T09:45:00'),
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    name: 'Restaurant Patrick Guilbaud',
    address: '21 Upper Merrion Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=21+Upper+Merrion+Street,+Dublin+2,+Ireland',
    website: 'https://www.restaurantpatrickguilbaud.ie',
    menuUrl: 'https://www.restaurantpatrickguilbaud.ie/menu',
    reservationUrl: 'https://www.restaurantpatrickguilbaud.ie/book',
    addedBy: {
      userId: 'user-004',
      name: 'David Thompson',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      wednesday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      thursday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      friday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      saturday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-18T11:20:00'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    name: 'The Winding Stair',
    address: '40 Lower Ormond Quay, Dublin 1',
    maplink: 'https://maps.google.com/?q=40+Lower+Ormond+Quay,+Dublin+1,+Ireland',
    website: 'https://www.winding-stair.com',
    menuUrl: 'https://www.winding-stair.com/menu',
    reservationUrl: 'https://www.winding-stair.com/reservations',
    addedBy: {
      userId: 'user-005',
      name: 'Lisa Wang',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    dateAdded: new Date('2024-01-19T13:10:00'),
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    name: 'Bunsen',
    address: '36 Wexford Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=36+Wexford+Street,+Dublin+2,+Ireland',
    website: 'https://www.bunsen.ie',
    menuUrl: 'https://www.bunsen.ie/menu',
    reservationUrl: 'https://www.bunsen.ie/order',
    addedBy: {
      userId: 'user-006',
      name: 'John Smith',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    dateAdded: new Date('2024-01-20T15:25:00'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    name: 'Uno Mas',
    address: '6 Aungier Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=6+Aungier+Street,+Dublin+2,+Ireland',
    website: 'https://www.unomas.ie',
    menuUrl: 'https://www.unomas.ie/menu',
    reservationUrl: 'https://www.unomas.ie/book',
    addedBy: {
      userId: 'user-007',
      name: 'Anna Kowalski',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
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
    dateAdded: new Date('2024-01-21T10:40:00'),
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  {
    name: 'Pickle',
    address: '43 Camden Street Lower, Dublin 2',
    maplink: 'https://maps.google.com/?q=43+Camden+Street+Lower,+Dublin+2,+Ireland',
    website: 'https://www.picklerestaurant.ie',
    menuUrl: 'https://www.picklerestaurant.ie/menu',
    reservationUrl: 'https://www.picklerestaurant.ie/reservations',
    addedBy: {
      userId: 'user-008',
      name: 'Tom O\'Connor',
      profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '5:30 PM - 10:00 PM',
      wednesday: '5:30 PM - 10:00 PM',
      thursday: '5:30 PM - 10:00 PM',
      friday: '5:30 PM - 10:00 PM',
      saturday: '5:30 PM - 10:00 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-22T12:55:00'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    name: 'The Pig\'s Ear',
    address: '4 Nassau Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=4+Nassau+Street,+Dublin+2,+Ireland',
    website: 'https://www.thepigsear.ie',
    menuUrl: 'https://www.thepigsear.ie/menu',
    reservationUrl: 'https://www.thepigsear.ie/book',
    addedBy: {
      userId: 'user-009',
      name: 'Rachel Green',
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      wednesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      thursday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      friday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      saturday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-23T08:30:00'),
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23')
  },
  {
    name: '777',
    address: '7 South Great George\'s Street, Dublin 2',
    maplink: 'https://maps.google.com/?q=7+South+Great+Georges+Street,+Dublin+2,+Ireland',
    website: 'https://www.777.ie',
    menuUrl: 'https://www.777.ie/menu',
    reservationUrl: 'https://www.777.ie/reservations',
    addedBy: {
      userId: 'user-010',
      name: 'Kevin Murphy',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 11:00 PM',
      wednesday: '5:00 PM - 11:00 PM',
      thursday: '5:00 PM - 11:00 PM',
      friday: '5:00 PM - 11:00 PM',
      saturday: '5:00 PM - 11:00 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-24T17:15:00'),
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  },
  {
    name: 'Ichigo Ichie',
    address: '5 Sheares Street, Cork City',
    maplink: 'https://maps.google.com/?q=5+Sheares+Street,+Cork+City,+Ireland',
    website: 'https://www.ichigoichie.ie',
    menuUrl: 'https://www.ichigoichie.ie/menu',
    reservationUrl: 'https://www.ichigoichie.ie/book',
    addedBy: {
      userId: 'user-011',
      name: 'Sophie Williams',
      profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
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
    dateAdded: new Date('2024-01-25T14:20:00'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    name: 'Market Lane',
    address: '5 Oliver Plunkett Street, Cork City',
    maplink: 'https://maps.google.com/?q=5+Oliver+Plunkett+Street,+Cork+City,+Ireland',
    website: 'https://www.marketlane.ie',
    menuUrl: 'https://www.marketlane.ie/menu',
    reservationUrl: 'https://www.marketlane.ie/reservations',
    addedBy: {
      userId: 'user-012',
      name: 'Paul Davis',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    dateAdded: new Date('2024-01-26T11:45:00'),
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  },
  {
    name: 'Elbow Lane',
    address: '4 Oliver Plunkett Street, Cork City',
    maplink: 'https://maps.google.com/?q=4+Oliver+Plunkett+Street,+Cork+City,+Ireland',
    website: 'https://www.elbowlane.ie',
    menuUrl: 'https://www.elbowlane.ie/menu',
    reservationUrl: 'https://www.elbowlane.ie/book',
    addedBy: {
      userId: 'user-013',
      name: 'Maria Garcia',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
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
    dateAdded: new Date('2024-01-27T16:30:00'),
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27')
  },
  {
    name: 'Cask',
    address: '48 MacCurtain Street, Cork City',
    maplink: 'https://maps.google.com/?q=48+MacCurtain+Street,+Cork+City,+Ireland',
    website: 'https://www.caskcork.com',
    menuUrl: 'https://www.caskcork.com/menu',
    reservationUrl: 'https://www.caskcork.com/reservations',
    addedBy: {
      userId: 'user-014',
      name: 'James Wilson',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 12:00 AM',
      wednesday: '5:00 PM - 12:00 AM',
      thursday: '5:00 PM - 12:00 AM',
      friday: '5:00 PM - 12:00 AM',
      saturday: '5:00 PM - 12:00 AM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-28T13:50:00'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  {
    name: 'The Glass Curtain',
    address: '1-2 Union Quay, Cork City',
    maplink: 'https://maps.google.com/?q=1-2+Union+Quay,+Cork+City,+Ireland',
    website: 'https://www.theglasscurtain.ie',
    menuUrl: 'https://www.theglasscurtain.ie/menu',
    reservationUrl: 'https://www.theglasscurtain.ie/book',
    addedBy: {
      userId: 'user-015',
      name: 'Fiona O\'Brien',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
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
    dateAdded: new Date('2024-01-29T10:25:00'),
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29')
  },
  {
    name: 'The French Table',
    address: '19 O\'Connell Street, Limerick City',
    maplink: 'https://maps.google.com/?q=19+OConnell+Street,+Limerick+City,+Ireland',
    website: 'https://www.thefrenchtable.ie',
    menuUrl: 'https://www.thefrenchtable.ie/menu',
    reservationUrl: 'https://www.thefrenchtable.ie/reservations',
    addedBy: {
      userId: 'user-016',
      name: 'Claire Taylor',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:30 PM',
      wednesday: '6:00 PM - 9:30 PM',
      thursday: '6:00 PM - 9:30 PM',
      friday: '6:00 PM - 9:30 PM',
      saturday: '6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
    dateAdded: new Date('2024-01-30T15:40:00'),
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  },
  {
    name: 'The Curragower',
    address: 'Clancy\'s Strand, Limerick City',
    maplink: 'https://maps.google.com/?q=Clancys+Strand,+Limerick+City,+Ireland',
    website: 'https://www.curragower.ie',
    menuUrl: 'https://www.curragower.ie/menu',
    reservationUrl: 'https://www.curragower.ie/book',
    addedBy: {
      userId: 'user-017',
      name: 'Brian Anderson',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    dateAdded: new Date('2024-01-31T12:05:00'),
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31')
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