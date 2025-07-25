'use client';

import { Table } from '@tanstack/react-table';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  showPageSizeSelector?: boolean;
}

/**
 * Reusable pagination component for data tables
 */
export function TablePagination<TData>({
  table,
  showPageSizeSelector = true
}: TablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Page Size Selector */}
      {showPageSizeSelector && (
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
      )}

      {/* Pagination Navigation */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          {(() => {
            const pages = [];

            // Always show first page
            pages.push(
              <button
                key={0}
                onClick={() => table.setPageIndex(0)}
                className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${
                  currentPage === 0
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
                <span key="ellipsis1" className="flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg">
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
                    className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${
                      currentPage === i
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
                  className={`flex items-center justify-center w-9 h-8 border border-[#83A8FF] rounded-lg transition-colors ${
                    currentPage === pageCount - 1
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
  );
}