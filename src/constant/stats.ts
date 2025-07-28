import { StatsData } from '@/types/restaurant';

/**
 * Default stats data for the restaurants dashboard
 * This could be replaced with API data in the future
 */
export const DEFAULT_RESTAURANT_STATS: StatsData[] = [
  {
    label: 'Total active restaurants',
    value: 855
  },
  {
    label: 'Total pending restaurants',
    value: 251
  },
  {
    label: 'Total active videos',
    value: 1717
  },
  {
    label: 'Total pending videos',
    value: 52
  }
];