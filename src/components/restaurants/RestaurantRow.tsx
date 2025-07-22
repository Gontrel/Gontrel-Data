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
      {row.getVisibleCells().map(cell => {
        return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      })}
    </tr>
  );
}