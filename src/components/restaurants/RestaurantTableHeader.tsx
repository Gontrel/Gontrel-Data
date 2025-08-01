'use client';

import { mergeClasses } from '@/lib/utils';
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
            {headerGroup.headers.map((header, index) => {
              const isSticky = header.column.columnDef.meta?.sticky;

              // Calculate left offset for sticky columns
              let leftOffset = 0;
              if (isSticky) {
                // Get all visible headers up to this point to calculate cumulative width
                const visibleHeaders = headerGroup.headers;
                for (let i = 0; i < index; i++) {
                  const prevHeader = visibleHeaders[i];
                  if (prevHeader.column.columnDef.meta?.sticky) {
                    // Use minSize from column definition or fallback to getSize
                    const columnWidth = prevHeader.column.columnDef.minSize || prevHeader.getSize();
                    leftOffset += columnWidth;
                  }
                }
              }

              const stickyHeaderClass = isSticky ? 'sticky z-20' : '';
              const stickyHeaderStyle = isSticky ? {
                left: `${leftOffset}px`,
                width: `${(header.column.columnDef.minSize || header.getSize())}px`
              } : {
                width: `${(header.column.columnDef.minSize || header.getSize())}px`
              };

              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={mergeClasses('px-2.5 py-5.5 text-left text-lg text-black font-semibold bg-[#F9F9F9]', stickyHeaderClass)}
                  style={stickyHeaderStyle}
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