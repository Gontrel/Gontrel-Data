"use client";

import React from "react";

export enum UsersTableTabsEnum {
  ACTIVE_USERS = "activeUsers",
  BLOCKED_USERS = "blockedUsers",
}

interface UsersTableTabsProps {
  activeTab: UsersTableTabsEnum;
  onTabChange: (tab: UsersTableTabsEnum) => void;
  tableTotals?: Partial<Record<UsersTableTabsEnum, number>>;
}

export function UsersTableTabs({
  activeTab,
  onTabChange,
  tableTotals = {},
}: UsersTableTabsProps): React.JSX.Element {
  const activeTabStyles =
    "text-blue-500 border-b-4 border-blue-500 font-semibold";
  const inactiveTabStyles = "text-gray-300 font-medium";

  const tabs: { key: UsersTableTabsEnum; label: string }[] = [
    { key: UsersTableTabsEnum.ACTIVE_USERS, label: "Active users" },
    { key: UsersTableTabsEnum.BLOCKED_USERS, label: "Blocked users" },
  ];

  return (
    <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
      <div className="flex items-center gap-x-7.5 min-w-0">
        {tabs.map(({ key, label }) => {
          const total = tableTotals[key];
          const showTotal = typeof total === "number" && total >= 0;
          return (
            <button
              key={key}
              type="button"
              className={`text-lg py-3 px-2.5 whitespace-nowrap ${
                activeTab === key ? activeTabStyles : inactiveTabStyles
              }`}
              onClick={() => onTabChange(key)}
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
