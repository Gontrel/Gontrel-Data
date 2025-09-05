"use client";

import { DateRangeValue } from "@/utils/dateRange";
import { SearchBar } from "../admin/SearchBar";
import { FilterDropdowns } from "../admin/FilterDropdowns";

interface ReportActionPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Date
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;

  // Status (NEW)
  selectedStatus?: string;
  onStatusChange?: (status: string | undefined) => void;

  // Other
  showFilters?: boolean;
  analystOptions?: Array<{ value: string; label: string }>;
  userOptions?: Array<{ value: string; label: string }>;
  activeTab: string;
}

export const ReportActionPanel: React.FC<ReportActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search using name or location",

  // Date
  selectedDateRange,
  onDateRangeChange,

  // Status
  selectedStatus = undefined,
  onStatusChange = () => {},

  activeTab,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
      <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        {/* Date range filter can be added here if needed for staff */}
        <FilterDropdowns
          activeTab={activeTab}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};
