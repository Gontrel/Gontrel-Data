'use client';

import { mergeClasses } from '../../lib/utils';

interface TableTab {
  id: string;
  name: string;
  count: number;
}

interface TableTabsProps {
  tables: TableTab[];
  selectedTable: string;
  onTableChange: (tableId: string) => void;
  loading?: boolean;
  onAddTable?: () => void;
}

/**
 * Dynamic table tabs component for switching between different data tables
 */
export function TableTabs({
  tables,
  selectedTable,
  onTableChange,
  loading = false,
  onAddTable
}: TableTabsProps) {
  if (loading) {
    return (
      <div className="flex space-x-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse" style={{ width: `${80 + i * 20}px` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-1">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onTableChange(table.id)}
          className={mergeClasses(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            selectedTable === table.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          )}
        >
          {table.name} ({table.count})
        </button>
      ))}

      {/* Add new table button */}
      <button
        onClick={onAddTable}
        className="px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 flex items-center gap-1"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add +
      </button>
    </div>
  );
}