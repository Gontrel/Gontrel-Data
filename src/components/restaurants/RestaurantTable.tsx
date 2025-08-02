"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { RestaurantRow } from "./RestaurantRow";
import { RestaurantTableHeader } from "./RestaurantTableHeader";
import { TablePagination } from "../ui/TablePagination";
import { TableSkeleton } from "../ui/TableSkeleton";

interface RestaurantTableProps<T> {
  restaurants: T[];
  loading?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  showSelection?: boolean;
  columns: ColumnDef<T>[];
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  onRowClick?: (row: T) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (pageIndex: number) => void;
}

/**
 * Main restaurant table component with sorting, filtering, and pagination
 */
export function RestaurantTable<T>({
  restaurants,
  loading = false,
  onRowSelect,
  onRowClick,
  showSelection = false,
  columns,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  onPageSizeChange,
  onPageChange,
}: RestaurantTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Create table instance
  const table = useReactTable({
    data: restaurants,
    columns: showSelection
      ? columns
      : columns.filter((col) => col.id !== "select"),
    state: {
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1, // Convert to 0-based index
        pageSize: pageSize,
      },
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: showSelection,
    manualPagination: true, // Tell React Table we're handling pagination externally
    pageCount: totalPages, // Set the total number of pages
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPaginationState = updater({
          pageIndex: currentPage - 1,
          pageSize,
        });
        if (onPageChange) onPageChange(newPaginationState.pageIndex);
        if (onPageSizeChange) onPageSizeChange(newPaginationState.pageSize);
      }
    },
  });

  // Notify parent of selected rows
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  if (onRowSelect && selectedRows.length > 0) {
    onRowSelect(selectedRows);
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl p-5 bg-white">
        {/* Responsive scroll container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <RestaurantTableHeader<T> table={table} />
            <tbody className="divide-y divide-[#EBEBEB]">
              {table.getRowModel().rows.map((row) => (
                <RestaurantRow<T>
                  key={row.id}
                  row={row}
                  onRowClick={onRowClick}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <TablePagination
          table={table}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
