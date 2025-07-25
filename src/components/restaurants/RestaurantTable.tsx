'use client';

import { useState, useMemo } from 'react';
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
import { ExpandableContent } from '../ui/ExpandableContent';
import { ActionButtons } from '../ui/ActionButtons';
import { ExternalLink } from '../ui/ExternalLink';
import { Clock, Calendar, MapPin, Link } from 'lucide-react';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onRowSelect?: (selectedRows: Restaurant[]) => void;
  showSelection?: boolean;
  columns: ColumnDef<Restaurant>[];
}

/**
 * Format date to "January 3 2025 4:30pm" format
 */
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  return date.toLocaleDateString('en-US', options);
};

/**
 * Main restaurant table component with sorting, filtering, and pagination
 */
export function RestaurantTable({
  restaurants,
  loading = false,
  onRowSelect,
  showSelection = false,
  columns
}: RestaurantTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Create table instance
  const table = useReactTable({
    data: restaurants,
    columns: showSelection ? columns : columns.filter(col => col.id !== 'select'),
    state: {
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: showSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
        <TablePagination table={table} />
      </div>
    </div>
  );
}