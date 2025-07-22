'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import { Restaurant } from '../../types/restaurant';
import { RestaurantRow } from './RestaurantRow';
import { RestaurantTableHeader } from './RestaurantTableHeader';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onRowSelect?: (selectedRows: Restaurant[]) => void;
  showSelection?: boolean;
}

/**
 * Main restaurant table component with sorting, filtering, and pagination
 */
export function RestaurantTable({
  restaurants,
  loading = false,
  onRowSelect,
  showSelection = false
}: RestaurantTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Define table columns
  const columns = useMemo<ColumnDef<Restaurant>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="rounded border-gray-300"
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'No.',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-600">
          {row.getValue('id')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Restaurant name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Map Address',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-gray-600">
          {row.getValue('address')}
        </div>
      ),
    },
    {
      accessorKey: 'tiktokLinks',
      header: 'TikTok links',
      cell: ({ row }) => {
        const links = row.getValue('tiktokLinks') as string[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{links.length} links</span>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        );
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.getValue('tags') as string[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 max-w-xs truncate">
              {tags.slice(0, 3).join(' ')}
              {tags.length > 3 && '...'}
            </span>
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        );
      },
    },
    {
      accessorKey: 'menuUrl',
      header: 'Menu',
      cell: ({ row }) => {
        const url = row.getValue('menuUrl') as string;
        const truncatedUrl = url.length > 20 ? url.substring(0, 20) + '...' : url;
        return (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-sm text-blue-600 hover:underline truncate max-w-xs" title={url}>
              {truncatedUrl}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'reservationUrl',
      header: 'Reservation',
      cell: ({ row }) => {
        const url = row.getValue('reservationUrl') as string;
        const truncatedUrl = url.length > 20 ? url.substring(0, 20) + '...' : url;
        return (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-sm text-blue-600 hover:underline truncate max-w-xs" title={url}>
              {truncatedUrl}
            </span>
          </div>
        );
      },
    },
  ], []);

  // Create table instance
  const table = useReactTable({
    data: restaurants,
    columns: showSelection ? columns : columns.filter(col => col.id !== 'select'),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: showSelection,
  });

  // Notify parent of selected rows
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  if (onRowSelect && selectedRows.length > 0) {
    onRowSelect(selectedRows);
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <RestaurantTableHeader table={table} />
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <RestaurantRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}