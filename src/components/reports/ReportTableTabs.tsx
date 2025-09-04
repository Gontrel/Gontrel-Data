"use client";

import { ReportTableTabsEnum } from "@/types";

interface Tab {
  id: ReportTableTabsEnum;
  label: string;
  count: number;
}

interface ReportTableTabsProps {
  activeTab: ReportTableTabsEnum;
  tableTotals: Record<ReportTableTabsEnum, number>;
  onTabChange: (tab: ReportTableTabsEnum) => void;
}

export const ReportTableTabs = ({ activeTab, tableTotals, onTabChange }: ReportTableTabsProps) => {
  const tabs: Tab[] = [
    {
      id: ReportTableTabsEnum.REPORTED_VIDEOS,
      label: "Reported Videos",
      count: tableTotals[ReportTableTabsEnum.REPORTED_VIDEOS] ?? 0,
    },
    {
      id: ReportTableTabsEnum.REPORTED_USERS,
      label: "Reported Users",
      count: tableTotals[ReportTableTabsEnum.REPORTED_USERS] ?? 0,
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </nav>
    </div>
  );
};
