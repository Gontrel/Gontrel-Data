'use client';

import React from 'react';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Props for the ManagerTableTabs component
 */
interface ManagerTableTabsProps {
  /** Currently active tab */
  activeTab: ManagerTableTabsEnum;
  /** Function to handle tab changes */
  onTabChange: (tab: ManagerTableTabsEnum) => void;
  /** Record of totals for each tab to display in brackets */
  tableTotals: Record<ManagerTableTabsEnum, number>;
}

/**
 * ManagerTableTabs Component
 *
 * Renders a horizontal tab navigation for managing different restaurant views.
 * Displays tab labels with optional count indicators in brackets.
 */
export function ManagerTableTabs({
  activeTab,
  onTabChange,
  tableTotals
}: ManagerTableTabsProps): React.JSX.Element {
  const activeTabStyles = 'text-blue-500 border-b-4 border-blue-500 font-semibold';
  const inactiveTabStyles = 'text-gray-300 font-medium';

  return (
    <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
      <div className="flex items-center gap-x-7.5 min-w-0">
        {/**
          * Dynamically render tab buttons for each ManagerTableTabs entry.
          * Only show the count in brackets if the value is a positive number.
          * Uses strict TypeScript checks and avoids string concatenation.
          */}
        {(Object.keys(ManagerTableTabsEnum) as Array<keyof typeof ManagerTableTabsEnum>).map((key) => {
          const tabKey = ManagerTableTabsEnum[key];
          // Define tab labels for display
          const tabLabels: Record<typeof tabKey, string> = {
            [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: 'Active restaurants',
            [ManagerTableTabsEnum.PENDING_RESTAURANTS]: 'Pending restaurants',
            [ManagerTableTabsEnum.PENDING_VIDEOS]: 'Pending videos'
          };
          // Get the total for this tab
          const total = tableTotals[tabKey];
          // Only show brackets if total is a positive number
          const showTotal = typeof total === 'number' && total > 0;
          // Type validation for tab label
          const label = tabLabels[tabKey] ?? tabKey;

          return (
            <button
              key={tabKey}
              type="button"
              className={`text-lg py-3 px-2.5 whitespace-nowrap ${
                activeTab === tabKey ? activeTabStyles : inactiveTabStyles
              }`}
              onClick={() => onTabChange(tabKey)}
            >
              {label}
              {showTotal && <span>{` (${total})`}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}