"use client";

import { mergeClasses } from "@/lib/utils";
import { flexRender, Row } from "@tanstack/react-table";
import React from "react";

interface RestaurantRowProps<T> {
  row: Row<T>;
  onRowClick?: (rowData: T) => void;
}

export function RestaurantRow<T>({ row, onRowClick }: RestaurantRowProps<T>) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e: React.MouseEvent, row: Row<T>) => {
    // Ignore clicks on interactive elements
    // const interactiveElements = [
    //   "button",
    //   "a",
    //   "input",
    //   "select",
    //   "textarea",
    //   '[role="button"]',
    //   '[role="checkbox"]',
    //   '[contenteditable="true"]',
    // ].join(",");

    // if ((e.target as HTMLElement).closest(interactiveElements)) {
    //   return;
    // }
    onRowClick?.(row.original);
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: Row<T>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(row.original);
    }
  };

  return (
    <tr
      onClick={(e) => handleClick(e, row)}
      onKeyDown={(e) => handleKeyDown(e, row)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      aria-label={onRowClick ? "View restaurant details" : undefined}
      className={mergeClasses(
        "group",
        isHovered && onRowClick && "bg-gray-50",
        onRowClick &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      )}
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

        return (
          <td
            key={cell.id}
            className={mergeClasses(
              "py-5 px-2.5 text-left bg-white transition-colors duration-150",
              isSticky && "sticky z-10",
              isHovered && onRowClick && "bg-gray-50"
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
