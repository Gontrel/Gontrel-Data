'use client';

import { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

interface RestaurantTableHeaderProps<T> {
  table: Table<T>;
}

/**
 * Table header component with sortable columns
 */
export function RestaurantTableHeader<T>({ table }: RestaurantTableHeaderProps<T>) {
  return (
    <thead className='bg-[#F9F9F9] border-b border-[#EBEBEB]'>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              const isSticky = header.column.columnDef.meta?.sticky;
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`px-2.5 py-5.5 text-left text-lg text-black font-semibold ${isSticky
                      ? 'sticky left-0 z-20 bg-[#F9F9F9] border-r border-[#EBEBEB]'
                      : ''
                    }`}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        )
      })}
    </thead>
  );
}