"use client";

import React from "react";
import { CompetitionTableTabsEnum } from "@/types";

interface CompetitionTableTabsProps {
  activeTab: CompetitionTableTabsEnum;
  onTabChange: (tab: CompetitionTableTabsEnum) => void;
  tableTotals: Record<CompetitionTableTabsEnum, number>;
}

export function CompetitionTableTabs({
  activeTab,
  onTabChange,
  tableTotals,
}: CompetitionTableTabsProps): React.JSX.Element {
  const activeTabStyles = "text-blue-500 border-b-4 border-blue-500 font-semibold";
  const inactiveTabStyles = "text-gray-300 font-medium";

  const tabLabels: Record<CompetitionTableTabsEnum, string> = {
    [CompetitionTableTabsEnum.ACTIVE_COMPETITIONS]: "Active competitions",
    [CompetitionTableTabsEnum.COMPLETED_COMPETITIONS]: "Completed competitions",
  };

  return (
    <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
      <div className="flex items-center gap-x-7.5 min-w-0">
        {(Object.values(CompetitionTableTabsEnum) as CompetitionTableTabsEnum[]).map(
          (tabKey) => {
            const total = tableTotals[tabKey];
            const showTotal = typeof total === "number" && total >= 0;
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
          }
        )}
      </div>
    </div>
  );
}
