import { Restaurant } from '../types/restaurant';

/**
 * Mock restaurant data matching the Gontrel Admin interface
 * Updated with real restaurant names and addresses from Ireland
 */
export const mockRestaurants: Restaurant[] = [
  {
    name: 'Chapter One',
    address: '18-19 Parnell Square, Dublin 1',
    maplink: 'https://maps.google.com/?q=18-19+Parnell+Square,+Dublin+1,+Ireland',
    website: 'https://www.chapteronerestaurant.com',
    menuUrl: 'https://www.chapteronerestaurant.com/menu',
    reservationUrl: 'https://www.chapteronerestaurant.com/reservations',
    addedBy: {
      userId: 'user-001',
      username: 'sarah.analyst',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      wednesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      thursday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      friday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      saturday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
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
      username: 'mike.analyst',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:00 PM',
      wednesday: '6:00 PM - 9:00 PM',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
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
      username: 'emma.analyst',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      wednesday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      thursday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      friday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      saturday: '12:30 PM - 2:00 PM, 6:30 PM - 9:00 PM',
      sunday: 'Closed'
    },
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
      username: 'david.analyst',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      wednesday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      thursday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      friday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      saturday: '12:30 PM - 2:00 PM, 7:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
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
      username: 'lisa.analyst',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
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
      username: 'john.analyst',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
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
      username: 'anna.analyst',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 10:00 PM',
      wednesday: '5:00 PM - 10:00 PM',
      thursday: '5:00 PM - 10:00 PM',
      friday: '5:00 PM - 10:00 PM',
      saturday: '5:00 PM - 10:00 PM',
      sunday: 'Closed'
    },
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
      username: 'tom.analyst',
      profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:30 PM - 10:00 PM',
      wednesday: '5:30 PM - 10:00 PM',
      thursday: '5:30 PM - 10:00 PM',
      friday: '5:30 PM - 10:00 PM',
      saturday: '5:30 PM - 10:00 PM',
      sunday: 'Closed'
    },
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
      username: 'rachel.analyst',
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      wednesday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      thursday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      friday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      saturday: '12:00 PM - 2:30 PM, 6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
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
      username: 'kevin.analyst',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 11:00 PM',
      wednesday: '5:00 PM - 11:00 PM',
      thursday: '5:00 PM - 11:00 PM',
      friday: '5:00 PM - 11:00 PM',
      saturday: '5:00 PM - 11:00 PM',
      sunday: 'Closed'
    },
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
      username: 'sophie.analyst',
      profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:00 PM',
      wednesday: '6:00 PM - 9:00 PM',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
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
      username: 'paul.analyst',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
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
      username: 'maria.analyst',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 10:00 PM',
      wednesday: '5:00 PM - 10:00 PM',
      thursday: '5:00 PM - 10:00 PM',
      friday: '5:00 PM - 10:00 PM',
      saturday: '5:00 PM - 10:00 PM',
      sunday: 'Closed'
    },
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
      username: 'james.analyst',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 12:00 AM',
      wednesday: '5:00 PM - 12:00 AM',
      thursday: '5:00 PM - 12:00 AM',
      friday: '5:00 PM - 12:00 AM',
      saturday: '5:00 PM - 12:00 AM',
      sunday: 'Closed'
    },
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
      username: 'fiona.analyst',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:00 PM',
      wednesday: '6:00 PM - 9:00 PM',
      thursday: '6:00 PM - 9:00 PM',
      friday: '6:00 PM - 9:00 PM',
      saturday: '6:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
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
      username: 'claire.analyst',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: 'Closed',
      tuesday: '6:00 PM - 9:30 PM',
      wednesday: '6:00 PM - 9:30 PM',
      thursday: '6:00 PM - 9:30 PM',
      friday: '6:00 PM - 9:30 PM',
      saturday: '6:00 PM - 9:30 PM',
      sunday: 'Closed'
    },
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
      username: 'brian.analyst',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    status: 'active',
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 10:00 PM'
    },
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31')
  }
];