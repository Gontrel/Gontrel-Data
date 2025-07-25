'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import { Restaurant } from '../../types/restaurant';
import { RestaurantRow } from './RestaurantRow';
import { RestaurantTableHeader } from './RestaurantTableHeader';
import { TablePagination } from '../ui/TablePagination';
import { TableSkeleton } from '../ui/TableSkeleton';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onRowSelect?: (selectedRows: Restaurant[]) => void;
  showSelection?: boolean;
  columns: ColumnDef<Restaurant>[];
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (pageIndex: number) => void;
}

/**
 * Main restaurant table component with sorting, filtering, and pagination
 */
export function RestaurantTable({
  restaurants,
  loading = false,
  onRowSelect,
  showSelection = false,
  columns,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  onPageSizeChange,
  onPageChange
}: RestaurantTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Create table instance
  const table = useReactTable({
    data: restaurants,
    columns: showSelection ? columns : columns.filter(col => col.id !== 'select'),
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
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: showSelection,
    manualPagination: true, // Tell React Table we're handling pagination externally
    pageCount: totalPages, // Set the total number of pages
  });

  // Notify parent of selected rows
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  if (onRowSelect && selectedRows.length > 0) {
    onRowSelect(selectedRows);
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl p-5 bg-white overflow-hidden">
        {/* Responsive scroll container */}
        <div className="rounded-2xl overflow-x-auto scrollbar-thin scrollbar-thumb-[#DDDDDD] scrollbar-track-[#F8F8F8]">
          <table className="w-full min-w-max">
            <RestaurantTableHeader table={table} />
            <tbody className="divide-y divide-[#EBEBEB]">
              {table.getRowModel().rows.map((row) => (
                <RestaurantRow key={row.id} row={row} />
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