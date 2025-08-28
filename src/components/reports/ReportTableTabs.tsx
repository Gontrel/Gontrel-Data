"use client";

import { StaffTableTabsEnum } from "@/types";
import React from "react";

interface StaffTableTabsProps {
  activeTab: StaffTableTabsEnum;
  onTabChange: (tab: StaffTableTabsEnum) => void;
  tableTotals: Record<StaffTableTabsEnum, number>;
}

/**
 * StaffTableTabs Component
 */
export function StaffTableTabs({
  activeTab,
  onTabChange,
  tableTotals,
}: StaffTableTabsProps): React.JSX.Element {
  const activeTabStyles =
    "text-blue-500 border-b-4 border-blue-500 font-semibold";
  const inactiveTabStyles = "text-gray-300 font-medium";

  return (
    <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
      <div className="flex items-center gap-x-7.5 min-w-0">
        {(
          Object.keys(StaffTableTabsEnum) as Array<
            keyof typeof StaffTableTabsEnum
          >
        ).map((key) => {
          const tabKey = StaffTableTabsEnum[key];
          const tabLabels: Record<typeof tabKey, string> = {
            [StaffTableTabsEnum.ACTIVE_STAFF]: "Active Staff",
            [StaffTableTabsEnum.DEACTIVATED_STAFF]: "Deactivated Staff",
          };
          const total = tableTotals[tabKey];
          const showTotal = typeof total === "number" && total >= 0; // Changed to >= 0 as 0 is a valid total
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
