"use client";

import { mergeClasses } from "@/lib/utils";
import { flexRender, Row } from "@tanstack/react-table";
import React from "react";

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
              isSticky ? "sticky z-10" : "relative"
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
