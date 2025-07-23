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
import { ChevronDown, ExternalLink, Clock, User, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

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
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <input
    //       type="checkbox"
    //       checked={table.getIsAllPageRowsSelected()}
    //       onChange={table.getToggleAllPageRowsSelectedHandler()}
    //       className="rounded border-gray-300"
    //       aria-label="Select all rows"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <input
    //       type="checkbox"
    //       checked={row.getIsSelected()}
    //       onChange={row.getToggleSelectedHandler()}
    //       className="rounded border-gray-300"
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: 'Restaurant Name',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-[#181D1F]">{row.getValue('name')}</div>
      ),
      minSize: 200,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => {
        const address = row.getValue('address') as string;
        const truncatedAddress = address.length > 25 ? address.substring(0, 25) + '...' : address;
        const maplink = row.original.maplink;

        return (
          <a
            href={maplink}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-xs truncate text-sm text-blue-600 hover:underline hover:text-blue-800 transition-colors cursor-pointer"
            title={`View ${address} on Google Maps`}
          >
            {truncatedAddress}
          </a>
        );
      },
      minSize: 250,
    },
    {
      accessorKey: 'website',
      header: 'Website',
      cell: ({ row }) => {
        const url = row.getValue('website') as string;
        const truncatedUrl = url.length > 25 ? url.substring(0, 25) + '...' : url;
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate max-w-xs"
              title={url}
            >
              {truncatedUrl}
            </a>
          </div>
        );
      },
      minSize: 180,
    },
    {
      accessorKey: 'menuUrl',
      header: 'Menu',
      cell: ({ row }) => {
        const url = row.getValue('menuUrl') as string;
        const truncatedUrl = url.length > 20 ? url.substring(0, 20) + '...' : url;
        return (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate max-w-xs"
              title={url}
            >
              {truncatedUrl}
            </a>
          </div>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'reservationUrl',
      header: 'Reservation',
      cell: ({ row }) => {
        const url = row.getValue('reservationUrl') as string;
        const truncatedUrl = url.length > 20 ? url.substring(0, 20) + '...' : url;
        return (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate max-w-xs"
              title={url}
            >
              {truncatedUrl}
            </a>
          </div>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'openingHours',
      header: 'Opening Hours',
      cell: ({ row }) => {
        const openingHours = row.getValue('openingHours') as Record<string, string>;
        const isExpanded = expandedRows.has(`hours-${row.id}`);

        return (
          <div className="relative">
            <button
              onClick={() => {
                const newExpanded = new Set(expandedRows);
                const key = `hours-${row.id}`;
                if (isExpanded) {
                  newExpanded.delete(key);
                } else {
                  newExpanded.add(key);
                }
                setExpandedRows(newExpanded);
              }}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded transition-colors w-full text-left"
            >
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-[#181D1F]">
                View Hours
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-80">
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Opening Hours
                  </div>
                  <div className="space-y-1 text-sm">
                    {Object.entries(openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize text-[#181D1F]">
                          {day}
                        </span>
                        <span className="text-gray-600">
                          {hours}
                        </span>
                      </div>
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800'
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
      minSize: 100,
    },
    {
      accessorKey: 'addedBy',
      header: 'Added By',
      cell: ({ row }) => {
        const addedBy = row.getValue('addedBy') as { username: string; profileImage: string };
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
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-[#181D1F]">
                {addedBy.username}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-64">
                <div className="p-3">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={addedBy.profileImage}
                      alt={addedBy.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm text-[#181D1F]">
                        {addedBy.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        Analyst
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      },
      minSize: 150,
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
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-[#DDDDDD]">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-black">Show</span>
            <input
              type="number"
              min="1"
              max="50"
              value={table.getState().pagination.pageSize}
              onChange={e => {
                const value = parseInt(e.target.value);
                if (value > 0 && value <= 50) {
                  table.setPageSize(value);
                }
              }}
              onBlur={e => {
                const value = parseInt(e.target.value);
                if (!value || value < 1) {
                  table.setPageSize(10);
                } else if (value > 50) {
                  table.setPageSize(50);
                }
              }}
              className="border border-[#83A8FF] focus:border-blue-500 rounded-lg font-medium bg-white focus:outline-none w-9 h-8 text-center no-spinners"
              aria-label="Page size"
            />
            <span className="font-medium text-black">Entries per page</span>
          </div>

          {/* Pagination Info */}
          {/* <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{' '}
            of{' '}
            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
            results
          </div> */}

          {/* Pagination Navigation */}
          <div className="flex items-center gap-1">
            {/* <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center justify-center w-8 h-8 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button> */}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pageCount = table.getPageCount();
                const currentPage = table.getState().pagination.pageIndex;
                const pages = [];

                // Always show first page
                pages.push(
                  <button
                    key={0}
                    onClick={() => table.setPageIndex(0)}
                    className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${currentPage === 0
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:bg-blue-100'
                      }`}
                  >
                    1
                  </button>
                );

                // Show ellipsis if there are many pages before current
                if (currentPage > 3) {
                  pages.push(
                    <span key="ellipsis2" className="flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg">
                      ...
                    </span>
                  );
                }

                // Show pages around current page
                for (let i = Math.max(1, currentPage - 1); i <= Math.min(pageCount - 2, currentPage + 1); i++) {
                  if (i > 0 && i < pageCount - 1) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => table.setPageIndex(i)}
                        className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${currentPage === i
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-blue-100'
                          }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                }

                // Show ellipsis if there are many pages after current
                if (currentPage < pageCount - 4) {
                  pages.push(
                    <span key="ellipsis2" className="flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg">
                      ...
                    </span>
                  );
                }

                // Always show last page if there's more than one page
                if (pageCount > 1) {
                  pages.push(
                    <button
                      key={pageCount - 1}
                      onClick={() => table.setPageIndex(pageCount - 1)}
                      className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${currentPage === pageCount - 1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-blue-100'
                        }`}
                    >
                      {pageCount}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            {/* <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center justify-center w-8 h-8 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}