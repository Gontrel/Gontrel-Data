import { Restaurant } from '../types/restaurant';

/**
 * Mock restaurant data matching the Gontrel Admin interface
 * Updated with real restaurant names and addresses from Ireland
 */
export const mockRestaurants: Restaurant[] = [
  // Dublin Restaurants (10)
  {
    id: '00001',
    name: 'Chapter One',
    address: '18-19 Parnell Square, Dublin 1',
    tiktokLinks: ['https://tiktok.com/@chapteronedublin', 'https://tiktok.com/@chapteronedublin'],
    tags: ['#fine-dining', '#michelin', '#irish'],
    menuUrl: 'https://www.chapteronerestaurant.com/menu',
    reservationUrl: 'https://www.chapteronerestaurant.com/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '00002',
    name: 'The Greenhouse',
    address: 'Dawson Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@greenhousedublin'],
    tags: ['#fine-dining', '#michelin-star', '#contemporary'],
    menuUrl: 'https://www.thegreenhouserestaurant.ie/menu',
    reservationUrl: 'https://www.thegreenhouserestaurant.ie/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '00003',
    name: 'L\'Ecrivain',
    address: '109 Lower Baggot Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@lecrivaindublin'],
    tags: ['#fine-dining', '#french', '#elegant'],
    menuUrl: 'https://www.lecrivain.com/menu',
    reservationUrl: 'https://www.lecrivain.com/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '00004',
    name: 'Restaurant Patrick Guilbaud',
    address: '21 Upper Merrion Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@patrickguilbaud'],
    tags: ['#fine-dining', '#michelin-star', '#luxury'],
    menuUrl: 'https://www.restaurantpatrickguilbaud.ie/menu',
    reservationUrl: 'https://www.restaurantpatrickguilbaud.ie/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '00005',
    name: 'The Winding Stair',
    address: '40 Lower Ormond Quay, Dublin 1',
    tiktokLinks: ['https://tiktok.com/@windingstair'],
    tags: ['#irish', '#traditional'],
    menuUrl: 'https://www.winding-stair.com/menu',
    reservationUrl: 'https://www.winding-stair.com/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '00006',
    name: 'Bunsen',
    address: '36 Wexford Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@bunsenburger'],
    tags: ['#burgers', '#casual'],
    menuUrl: 'https://www.bunsen.ie/menu',
    reservationUrl: 'https://www.bunsen.ie/order',
    city: 'Dublin',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '00007',
    name: 'Uno Mas',
    address: '6 Aungier Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@unomasdublin'],
    tags: ['#spanish', '#tapas'],
    menuUrl: 'https://www.unomas.ie/menu',
    reservationUrl: 'https://www.unomas.ie/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '00008',
    name: 'Pickle',
    address: '43 Camden Street Lower, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@pickledublin'],
    tags: ['#indian', '#modern', '#spicy'],
    menuUrl: 'https://www.picklerestaurant.ie/menu',
    reservationUrl: 'https://www.picklerestaurant.ie/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '00009',
    name: 'The Pig\'s Ear',
    address: '4 Nassau Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@pigseardublin'],
    tags: ['#irish', '#traditional'],
    menuUrl: 'https://www.thepigsear.ie/menu',
    reservationUrl: 'https://www.thepigsear.ie/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: '00010',
    name: '777',
    address: '7 South Great George\'s Street, Dublin 2',
    tiktokLinks: ['https://tiktok.com/@777dublin'],
    tags: ['#mexican', '#tequila'],
    menuUrl: 'https://www.777.ie/menu',
    reservationUrl: 'https://www.777.ie/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  },

  // Cork Restaurants (5)
  {
    id: '00011',
    name: 'Ichigo Ichie',
    address: '5 Sheares Street, Cork City',
    tiktokLinks: ['https://tiktok.com/@ichigoichiecork'],
    tags: ['#japanese', '#kaiseki'],
    menuUrl: 'https://www.ichigoichie.ie/menu',
    reservationUrl: 'https://www.ichigoichie.ie/book',
    city: 'Cork',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '00012',
    name: 'Market Lane',
    address: '5 Oliver Plunkett Street, Cork City',
    tiktokLinks: ['https://tiktok.com/@marketlanecork'],
    tags: ['#irish', '#casual'],
    menuUrl: 'https://www.marketlane.ie/menu',
    reservationUrl: 'https://www.marketlane.ie/reservations',
    city: 'Cork',
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  },
  {
    id: '00013',
    name: 'Elbow Lane',
    address: '4 Oliver Plunkett Street, Cork City',
    tiktokLinks: ['https://tiktok.com/@elbowlanecork'],
    tags: ['#bbq', '#smoked-meat'],
    menuUrl: 'https://www.elbowlane.ie/menu',
    reservationUrl: 'https://www.elbowlane.ie/book',
    city: 'Cork',
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27')
  },
  {
    id: '00014',
    name: 'Cask',
    address: '48 MacCurtain Street, Cork City',
    tiktokLinks: ['https://tiktok.com/@caskcork'],
    tags: ['#cocktails', '#speakeasy'],
    menuUrl: 'https://www.caskcork.com/menu',
    reservationUrl: 'https://www.caskcork.com/reservations',
    city: 'Cork',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: '00015',
    name: 'The Glass Curtain',
    address: '1-2 Union Quay, Cork City',
    tiktokLinks: ['https://tiktok.com/@glasscurtaincork'],
    tags: ['#fine-dining', '#contemporary'],
    menuUrl: 'https://www.theglasscurtain.ie/menu',
    reservationUrl: 'https://www.theglasscurtain.ie/book',
    city: 'Cork',
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29')
  },

  // Limerick Restaurants (2)
  {
    id: '00016',
    name: 'The French Table',
    address: '19 O\'Connell Street, Limerick City',
    tiktokLinks: ['https://tiktok.com/@frenchtablelimerick'],
    tags: ['#french', '#fine-dining', '#romantic'],
    menuUrl: 'https://www.thefrenchtable.ie/menu',
    reservationUrl: 'https://www.thefrenchtable.ie/reservations',
    city: 'Limerick',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: '00017',
    name: 'The Curragower',
    address: 'Clancy\'s Strand, Limerick City',
    tiktokLinks: ['https://tiktok.com/@curragowerlimerick'],
    tags: ['#irish', '#traditional'],
    menuUrl: 'https://www.curragower.ie/menu',
    reservationUrl: 'https://www.curragower.ie/book',
    city: 'Limerick',
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31')
  }
];