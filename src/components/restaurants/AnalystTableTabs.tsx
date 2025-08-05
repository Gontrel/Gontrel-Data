'use client';

import React from 'react';
import { AnalystTableTabsEnum } from '@/types/enums';

interface AnalystTableTabsProps {
  activeTab: AnalystTableTabsEnum;
  onTabChange: (tab: AnalystTableTabsEnum) => void;
  tableTotals: Record<AnalystTableTabsEnum, number>;
}

/**
 * AnalystTableTabs Component
 */
export const AnalystTableTabs = ({
  activeTab,
  onTabChange,
  tableTotals
}: AnalystTableTabsProps) => {
  const activeTabStyles = 'text-blue-500 border-b-4 border-blue-500 font-semibold';
  const inactiveTabStyles = 'text-gray-300 font-medium';

  return (
    <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
      <div className="flex items-center gap-x-7.5 min-w-0">
        {(Object.keys(AnalystTableTabsEnum) as Array<keyof typeof AnalystTableTabsEnum>).map((key) => {
          const tabKey = AnalystTableTabsEnum[key];
          const tabLabels: Record<typeof tabKey, string> = {
            [AnalystTableTabsEnum.ACTIVE_RESTAURANTS]: 'Active restaurants',
            [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: 'Submitted restaurants',
            [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: 'Submitted videos'
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
};