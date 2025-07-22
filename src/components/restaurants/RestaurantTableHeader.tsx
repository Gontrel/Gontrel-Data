'use client';

import { Table } from '@tanstack/react-table';
import { Restaurant } from '../../types/restaurant';
import { flexRender } from '@tanstack/react-table';

interface RestaurantTableHeaderProps {
  table: Table<Restaurant>;
}

/**
 * Table header component with sortable columns
 */
export function RestaurantTableHeader({ table }: RestaurantTableHeaderProps) {
  return (
    <thead className='bg-gray-100 border-b border-[#BABFC7]'>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => ( // map over the headerGroup headers array
              <th key={header.id} colSpan={header.colSpan} className='p-4 text-left text-sm text-[#181D1F]'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        )
      })}
    </thead>
  );
}