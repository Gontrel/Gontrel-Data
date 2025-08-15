'use client';

import { useState, useEffect } from 'react';
import { Table } from '@tanstack/react-table';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  showPageSizeSelector?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (pageIndex: number) => void;
}

/**
 * Reusable pagination component for data tables
 */
export function TablePagination<TData>({
  table,
  showPageSizeSelector = true,
  onPageSizeChange,
  onPageChange
}: TablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const currentPageSize = table.getState().pagination.pageSize;

  // Local state for the input value
  const [inputValue, setInputValue] = useState<string>(currentPageSize.toString());

  // Update input value when page size changes externally
  useEffect(() => {
    setInputValue(currentPageSize.toString());
  }, [currentPageSize]);

  const handlePageSizeChange = (newPageSize: number) => {
    table.setPageSize(newPageSize);
    // Notify parent component about page size change
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
    // Notify parent component about page change
    if (onPageChange) {
      onPageChange(pageIndex);
    }
  };

  /**
   * Apply the page size change with validation
   */
  const applyPageSizeChange = (value: string) => {
    const parsedValue = parseInt(value);

    // Validate and apply the change
    if (!parsedValue || parsedValue < 1) {
      setInputValue('10');
      handlePageSizeChange(10);
    } else if (parsedValue > 50) {
      setInputValue('50');
      handlePageSizeChange(50);
    } else {
      setInputValue(parsedValue.toString());
      handlePageSizeChange(parsedValue);
    }
  };

  /**
   * Handle input change (only updates local state)
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * Handle input blur event
   */
  const handleInputBlur = () => {
    applyPageSizeChange(inputValue);
  };

  /**
   * Handle key down event for Enter key
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyPageSizeChange(inputValue);
    }
  };

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
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
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
                onClick={() => handlePageChange(0)}
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
                    onClick={() => handlePageChange(i)}
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
                  onClick={() => handlePageChange(pageCount - 1)}
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