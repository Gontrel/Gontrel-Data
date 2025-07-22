import { Restaurant } from '../types/restaurant';

/**
 * Mock restaurant data matching the Gontrel Admin interface
 */
export const mockRestaurants: Restaurant[] = [
  {
    id: '00001',
    name: 'Perious Grill',
    address: '89 Ballinclea, Heights, Castlegregory, Co. Kerry',
    tiktokLinks: ['https://tiktok.com/@periousgrill', 'https://tiktok.com/@periousgrill2'],
    tags: ['#chimac', '#dublinfood', '#koreanfriedchicken', '#asianfusion'],
    menuUrl: 'https://www.periousgrill.com/menu',
    reservationUrl: 'https://www.periousgrill.com/reserve',
    city: 'Dublin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '00002',
    name: 'Evolve Eatery kingswood',
    address: '2 Seaview, Pebble Beach, Portmarnock, Co. Dublin',
    tiktokLinks: ['https://tiktok.com/@evolveeatery'],
    tags: ['#healthy', '#vegan', '#organic', '#dublin'],
    menuUrl: 'https://www.evolveeatery.com/menu',
    reservationUrl: 'https://www.evolveeatery.com/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '00003',
    name: 'Loading Bay',
    address: '45 Ocean Drive, Sunnyvale, Bray, Co. Wicklow',
    tiktokLinks: ['https://tiktok.com/@loadingbay'],
    tags: ['#seafood', '#coastal', '#bray', '#irishfood'],
    menuUrl: 'https://www.loadingbay.ie/menu',
    reservationUrl: 'https://www.loadingbay.ie/reservations',
    city: 'Dublin',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '00004',
    name: 'Deanos wood fired pizza',
    address: '12 Main Street, Blackrock, Co. Dublin',
    tiktokLinks: ['https://tiktok.com/@deanoswoodfired'],
    tags: ['#pizza', '#woodfired', '#italian', '#dublin'],
    menuUrl: 'https://www.deanos.ie/menu',
    reservationUrl: 'https://www.deanos.ie/book',
    city: 'Dublin',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '00005',
    name: 'Pandini\'s restaurant',
    address: '78 South Circular Road, Dublin 8',
    tiktokLinks: ['https://tiktok.com/@pandinis'],
    tags: ['#italian', '#pasta', '#dublin8', '#authentic'],
    menuUrl: 'https://www.pandinis.ie/menu',
    reservationUrl: 'https://www.pandinis.ie/reserve',
    city: 'Dublin',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '00006',
    name: 'cluck chicken tallaght',
    address: '15 Main Street, Tallaght, Dublin 24',
    tiktokLinks: ['https://tiktok.com/@cluckchicken'],
    tags: ['#chicken', '#friedchicken', '#tallaght', '#dublin24'],
    menuUrl: 'https://www.cluckchicken.ie/menu',
    reservationUrl: 'https://www.cluckchicken.ie/order',
    city: 'Dublin',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '00007',
    name: 'Marco\'s',
    address: '23 Patrick Street, Cork City',
    tiktokLinks: ['https://tiktok.com/@marcoscork'],
    tags: ['#cork', '#irish', '#traditional', '#corkcity'],
    menuUrl: 'https://www.marcos.ie/menu',
    reservationUrl: 'https://www.marcos.ie/book',
    city: 'Cork',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '00008',
    name: 'Tuckk inn',
    address: '67 Oliver Plunkett Street, Cork',
    tiktokLinks: ['https://tiktok.com/@tuckkinn'],
    tags: ['#cork', '#streetfood', '#casual', '#corkcity'],
    menuUrl: 'https://www.tuckkinn.ie/menu',
    reservationUrl: 'https://www.tuckkinn.ie/order',
    city: 'Cork',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '00009',
    name: 'Lemongrass fusion restaurant',
    address: '34 O\'Connell Street, Limerick City',
    tiktokLinks: ['https://tiktok.com/@lemongrassfusion'],
    tags: ['#limerick', '#asian', '#fusion', '#limerickcity'],
    menuUrl: 'https://www.lemongrassfusion.ie/menu',
    reservationUrl: 'https://www.lemongrassfusion.ie/reserve',
    city: 'Limerick',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: '00010',
    name: 'The Spice Route',
    address: '89 Henry Street, Limerick',
    tiktokLinks: ['https://tiktok.com/@spiceroute'],
    tags: ['#limerick', '#indian', '#curry', '#spicy'],
    menuUrl: 'https://www.spiceroute.ie/menu',
    reservationUrl: 'https://www.spiceroute.ie/book',
    city: 'Limerick',
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  }
];