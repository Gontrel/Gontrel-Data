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
import { ChevronDown, SquareArrowOutUpRight } from 'lucide-react';

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
        <span className="text-sm text-[#181D1F]">
          {row.getValue('id')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Restaurant name',
      cell: ({ row }) => (
        <div className="text-sm text-[#181D1F]">{row.getValue('name')}</div>
      ),
      minSize: 200, // Minimum width in pixels
    },
    {
      accessorKey: 'address',
      header: 'Map Address',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-[#181D1F]">
          {row.getValue('address')}
        </div>
      ),
      minSize: 250, // Minimum width in pixels
    },
    {
      accessorKey: 'tiktokLinks',
      header: 'TikTok links',
      cell: ({ row }) => {
        const links = row.getValue('tiktokLinks') as string[];
        const isExpanded = expandedRows.has(row.id);

        return (
          <div className="relative">
            <button
              onClick={() => {
                const newExpanded = new Set(expandedRows);
                if (isExpanded) {
                  newExpanded.delete(row.id);
                } else {
                  newExpanded.add(row.id);
                }
                setExpandedRows(newExpanded);
              }}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors w-full text-left"
            >
              <SquareArrowOutUpRight className='w-4 h-4 text-blue-500' />
              <span className="text-sm text-[#181D1F]">
                {links.length} link{links.length !== 1 ? 's' : ''}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && links.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-64 max-w-96">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                    TikTok Links
                  </div>
                  <div className="space-y-1">
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded truncate"
                        title={link}
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.getValue('tags') as string[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#181D1F] max-w-xs truncate">
              {tags.slice(0, 3).join(' ')}
              {tags.length > 3 && '...'}
            </span>
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
            <span className="text-sm text-[#181D1F] hover:underline truncate max-w-xs" title={url}>
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
            <span className="text-sm text-[#181D1F] hover:underline truncate max-w-xs" title={url}>
              {truncatedUrl}
            </span>
          </div>
        );
      },
    },
  ], [expandedRows]);

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
  });

  // Notify parent of selected rows
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  if (onRowSelect && selectedRows.length > 0) {
    onRowSelect(selectedRows);
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-[#DDDDDD]">
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
      <div className="rounded-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Responsive scroll container */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#DDDDDD] scrollbar-track-[#F8F8F8]">
          <table className="w-full min-w-max">
            <RestaurantTableHeader table={table} />
            <tbody className="divide-y divide-[#DDDDDD]">
              {table.getRowModel().rows.map((row) => (
                <RestaurantRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}