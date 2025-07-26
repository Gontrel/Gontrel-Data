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

        let leftOffset = 0;
        if (isSticky) {
          const visibleCells = row.getVisibleCells();
          for (let i = 0; i < index; i++) {
            const prevCell = visibleCells[i];
            if (prevCell.column.columnDef.meta?.sticky) {
              const columnWidth = prevCell.column.columnDef.minSize || prevCell.column.getSize();
              leftOffset += columnWidth;
            }
          }
        }

        return (
          <td
            key={cell.id}
            className={`py-5 px-2.5 text-left ${isSticky
              ? `sticky z-10 bg-white border-r border-gray-200`
                : ''
              }`}
            style={isSticky ? {
              left: `${leftOffset}px`,
              width: `${(cell.column.columnDef.minSize || cell.column.getSize()) + 1}px`
            } : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}