'use client';

import { flexRender, Row } from '@tanstack/react-table';
import { Restaurant } from '../../types/restaurant';

interface RestaurantRowProps {
  row: Row<Restaurant>;
}

/**
 * Individual restaurant table row component
 */
export function RestaurantRow({ row }: RestaurantRowProps) {
  return (
    <tr>
      {row.getVisibleCells().map((cell, index) => {
        const isSticky = cell.column.columnDef.meta?.sticky;
        return (
          <td
            key={cell.id}
            className={`py-5 px-2.5 text-left ${isSticky
                ? 'sticky left-0 z-10 bg-white border-r border-gray-200'
                : ''
              }`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}