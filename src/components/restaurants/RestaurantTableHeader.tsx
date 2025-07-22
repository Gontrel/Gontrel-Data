'use client';

import { Table } from '@tanstack/react-table';
import { Restaurant } from '../../types/restaurant';

interface RestaurantTableHeaderProps {
  table: Table<Restaurant>;
}

/**
 * Table header component with sortable columns
 */
export function RestaurantTableHeader({ table }: RestaurantTableHeaderProps) {
  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => ( // map over the headerGroup headers array
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : header.column.id}
              </th>
            ))}
          </tr>
        )
      })}
    </thead>
  );
}