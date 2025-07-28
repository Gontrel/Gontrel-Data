'use client';

import React from 'react';

/**
 * Generic tab configuration interface
 */
export interface TabConfig<T extends string> {
  /** Unique identifier for the tab */
  key: T;
  /** Display label for the tab */
  label: string;
  /** Optional count to display in brackets */
  count?: number;
}

/**
 * Props for the TableTabs component
 */
interface TableTabsProps<T extends string> {
  /** Array of tab configurations */
  tabs: TabConfig<T>[];
  /** Currently active tab */
  activeTab: T;
  /** Function to handle tab changes */
  onTabChange: (tab: T) => void;
  /** Optional custom CSS classes for the container */
  className?: string;
  /** Optional custom CSS classes for active tab */
  activeTabClassName?: string;
  /** Optional custom CSS classes for inactive tab */
  inactiveTabClassName?: string;
}

/**
 * TableTabs Component
 *
 * A generic tab navigation component that can be used for different table types.
 * Supports customizable styling and optional count indicators.
 */
export function TableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  activeTabClassName = 'text-blue-500 border-b-4 border-blue-500 font-semibold',
  inactiveTabClassName = 'text-gray-300 font-medium'
}: TableTabsProps<T>): React.JSX.Element {
  return (
    <div className={`flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto ${className}`}>
      <div className="flex items-center gap-x-7.5 min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const showCount = typeof tab.count === 'number' && tab.count > 0;

          return (
            <button
              key={tab.key}
              type="button"
              className={`text-lg py-3 px-2.5 whitespace-nowrap ${
                isActive ? activeTabClassName : inactiveTabClassName
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
              {showCount && <span>{` (${tab.count})`}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}