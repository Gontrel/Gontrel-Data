export interface TableTab {
  id: string;
  name: string;
  count: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock table data representing different data tables users can create
 */
export const mockTables: TableTab[] = [
  {
    id: 'dublin-restaurants',
    name: 'Dublin',
    count: 10,
    description: 'Restaurants in Dublin area',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'cork-restaurants',
    name: 'Cork',
    count: 5,
    description: 'Restaurants in Cork area',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: 'limerick-restaurants',
    name: 'Limerick',
    count: 2,
    description: 'Restaurants in Limerick area',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: 'galway-restaurants',
    name: 'Galway',
    count: 8,
    description: 'Restaurants in Galway area',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'waterford-restaurants',
    name: 'Waterford',
    count: 3,
    description: 'Restaurants in Waterford area',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-21')
  }
];

/**
 * Helper function to get table by ID
 */
export const getTableById = (id: string): TableTab | undefined => {
  return mockTables.find(table => table.id === id);
};

/**
 * Helper function to get default table
 */
export const getDefaultTable = (): TableTab => {
  return mockTables[0]; // Dublin as default
};