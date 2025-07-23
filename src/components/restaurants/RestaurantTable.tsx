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
import { ChevronDown, ExternalLink, Clock, User, Globe, MapPin, Utensils, Calendar, Link } from 'lucide-react';
import Image from 'next/image';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onRowSelect?: (selectedRows: Restaurant[]) => void;
  showSelection?: boolean;
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
  showSelection = false
}: RestaurantTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Define table columns
  const columns = useMemo<ColumnDef<Restaurant>[]>(() => [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-2">
          <span>Restaurant name</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#181D1F] max-w-60 truncate">{row.getValue('name')}</div>
      ),
      minSize: 200,
      meta: {
        sticky: true
      }
    },
    {
      accessorKey: 'address',
      header: () => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Address</span>
        </div>
      ),
      cell: ({ row }) => {
        const address = row.getValue('address') as string;
        const maplink = row.original.maplink;

        return (
          <a
            href={maplink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium cursor-pointer flex items-center justify-between gap-3.5 max-w-68"
            title={`View ${address} on Google Maps`}
          >
            <span className="text-black truncate max-w-60">{address}</span>
            <ExternalLink className="w-4.5 h-4.5 text-[#AF08FD]" />
          </a>
        );
      },
      minSize: 200,
    },
    {
      accessorKey: 'website',
      header: () => (
        <div className="flex items-center gap-2">
          <Link className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Website</span>
        </div>
      ),
      cell: ({ row }) => {
        const url = row.getValue('website') as string;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-medium cursor-pointer flex items-center justify-between gap-3.5"
            title={url}
          >
            <span className="text-black">View website</span>
            <ExternalLink className="w-4.5 h-4.5 text-[#AF08FD]" />
          </a>
        );
      },
      minSize: 180,
    },
    {
      accessorKey: 'menuUrl',
      header: () => (
        <div className="flex items-center gap-2">
          <Link className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Menu link</span>
        </div>
      ),
      cell: ({ row }) => {
        const url = row.getValue('menuUrl') as string;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 justify-between font-medium"
            title={url}
          >
            <span className="text-black">View link</span>
            <ExternalLink className="w-4.5 h-4.5 text-[#AF08FD]" />
          </a>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'reservationUrl',
      header: () => (
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-[#8A8A8A]" />
          <span>Reservation link</span>
        </div>
      ),
      cell: ({ row }) => {
        const url = row.getValue('reservationUrl') as string;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 justify-between font-medium"
            title={url}
          >
            <span className="text-black">View link</span>
            <ExternalLink className="w-4.5 h-4.5 text-[#AF08FD]" />
          </a>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'openingHours',
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Opening hours</span>
        </div>
      ),
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
                    Opening hours
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
      accessorKey: 'addedBy',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Added by</span>
        </div>
      ),
      cell: ({ row }) => {
        const addedBy = row.getValue('addedBy') as { name: string; profileImage: string };
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
              <img
                src={addedBy.profileImage}
                alt={addedBy.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-sm text-[#181D1F]">
                {addedBy.name}
              </span>
            </button>
          </div>
        );
      },
      minSize: 150,
    },
    {
      accessorKey: 'dateAdded',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-[#8A8A8A]" />
          <span>Date added</span>
        </div>
      ),
      cell: ({ row }) => {
        const dateAdded = row.getValue('dateAdded') as Date;
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
              <span className="text-[#181D1F] font-medium">
                {formatDate(dateAdded)}
              </span>
            </button>
          </div>
        );
      },
      minSize: 150,
    },
    {
      id: 'action',
      header: () => (
        <div className="flex items-center gap-2">
          <span className="text-black font-medium">Actions</span>
        </div>
      ),
      cell: () => {
        return (
          <div className="relative flex flex-row gap-2.5">
            <button
              onClick={() => {

              }}
              className="flex items-center gap-2 font-medium bg-[#F9F9F9] border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center text-[#009543] cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => {

              }}
              className="flex items-center gap-2 font-medium bg-[#F9F9F9] border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center text-[#0070F3] cursor-pointer"
            >
              Update &amp; approve
            </button>
            <button
              onClick={() => {

              }}
              className="flex items-center gap-2 font-medium bg-[#F9F9F9] border-[#F0EEEE] rounded-[10px] px-2 py-1.5 transition-colors w-full justify-center text-[#C50000] cursor-pointer"
            >
              Decline
            </button>
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
        <div className="rounded-2xl">
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

          {/* Pagination Navigation */}
          <div className="flex items-center gap-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}