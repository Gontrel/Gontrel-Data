'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import { RestaurantChange } from '../../types/restaurant';
import { Button } from '../ui/Button';
import { formatRelativeTime, truncateText } from '../../lib/utils';

interface PendingChangesTableProps {
  changes: RestaurantChange[];
  loading?: boolean;
  onReviewChange: (change: RestaurantChange) => void;
  onBulkApprove?: (changeIds: string[]) => void;
}

/**
 * Table component for displaying pending changes that need manager review
 */
export function PendingChangesTable({
  changes,
  loading = false,
  onReviewChange,
  onBulkApprove
}: PendingChangesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<RestaurantChange>[]>(() => [
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
      accessorKey: 'restaurantName',
      header: 'Restaurant',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('restaurantName')}</div>
      ),
    },
    {
      accessorKey: 'analystName',
      header: 'Submitted By',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('analystName')}</div>
      ),
    },
    {
      accessorKey: 'changes',
      header: 'Changes',
      cell: ({ row }) => {
        const change = row.getValue('changes') as RestaurantChange;
        const changeSummary = `${change.changes.length} changes`;

        return (
          <div className="text-sm text-gray-600 max-w-xs">
            {truncateText(changeSummary, 60)}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {formatRelativeTime(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => onReviewChange(row.original)}
        >
          Review
        </Button>
      ),
      enableSorting: false,
    },
  ], [onReviewChange]);

  const table = useReactTable({
    data: changes,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: !!onBulkApprove,
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedChangeIds = selectedRows.map(row => row.original.id);

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
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
      {/* Bulk Actions */}
      {onBulkApprove && selectedChangeIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedChangeIds.length} change{selectedChangeIds.length > 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              onClick={() => onBulkApprove(selectedChangeIds)}
            >
              Approve Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : header.column.id}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`
                  border-b transition-colors hover:bg-gray-50/50
                  ${row.getIsSelected() ? 'bg-blue-50' : ''}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {cell.renderValue() as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {changes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg font-medium mb-2">
            No pending changes
          </div>
          <div className="text-gray-400 text-sm">
            All changes have been reviewed and processed.
          </div>
        </div>
      )}
    </div>
  );
}