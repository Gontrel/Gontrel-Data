'use client';

import React from 'react';
import { ManagerTableTabsEnum } from '@/types';

interface ManagerTableTabsProps {
  activeTab: ManagerTableTabsEnum;
  onTabChange: (tab: ManagerTableTabsEnum) => void;
  tableTotals: Record<ManagerTableTabsEnum, number>;
}

/**
 * ManagerTableTabs Component
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
        {(Object.keys(ManagerTableTabsEnum) as Array<keyof typeof ManagerTableTabsEnum>).map((key) => {
          const tabKey = ManagerTableTabsEnum[key];
          const tabLabels: Record<typeof tabKey, string> = {
            [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: 'Active restaurants',
            [ManagerTableTabsEnum.PENDING_RESTAURANTS]: 'Pending restaurants',
            [ManagerTableTabsEnum.PENDING_VIDEOS]: 'Pending videos'
          };
          const total = tableTotals[tabKey];
          const showTotal = typeof total === 'number' && total > 0;
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