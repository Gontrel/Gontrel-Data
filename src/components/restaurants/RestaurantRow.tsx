'use client';

import { flexRender, Row } from '@tanstack/react-table';

interface RestaurantRowProps<T> {
  row: Row<T>;
}

/**
 * Individual restaurant table row component
 */
export function RestaurantRow<T>({ row }: RestaurantRowProps<T>) {
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