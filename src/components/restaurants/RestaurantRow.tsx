"use client";

import { mergeClasses } from "@/lib/utils";
import { flexRender, Row } from "@tanstack/react-table";

interface RestaurantRowProps<T> {
  row: Row<T>;
  onRowClick?: (rowData: T) => void;
}

/**
 * Individual restaurant table row component
 */
export function RestaurantRow<T>({ row, onRowClick }: RestaurantRowProps<T>) {
  const handleClick = (e: React.MouseEvent) => {
    // Ignore clicks on interactive elements like buttons or links
    if (
      (e.target as HTMLElement).closest('button, a, input, [role="button"]')
    ) {
      return;
    }
    // console.error(
    //   "Ignore clicks on interactive elements like buttons or links"
    // );
    onRowClick?.(row.original);
  };

  return (
    <tr
      onClick={handleClick}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={
        onRowClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRowClick(row.original);
              }
            }
          : undefined
      }
    >
      {row.getVisibleCells().map((cell, index) => {
        const isSticky = cell.column.columnDef.meta?.sticky;

        let leftOffset = 0;
        if (isSticky) {
          const visibleCells = row.getVisibleCells();
          for (let i = 0; i < index; i++) {
            const prevCell = visibleCells[i];
            if (prevCell.column.columnDef.meta?.sticky) {
              const columnWidth =
                prevCell.column.columnDef.minSize || prevCell.column.getSize();
              leftOffset += columnWidth;
            }
          }
        }

        const stickyCellClass = isSticky ? "sticky z-10" : "";

        return (
          <td
            key={cell.id}
            className={mergeClasses(
              `py-5 px-2.5 text-left bg-white`,
              stickyCellClass
            )}
            style={
              isSticky
                ? {
                    left: `${leftOffset}px`,
                    width: `${
                      cell.column.columnDef.minSize || cell.column.getSize()
                    }px`,
                  }
                : {
                    width: `${
                      cell.column.columnDef.minSize || cell.column.getSize()
                    }px`,
                  }
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
