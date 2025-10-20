"use client";

import React from "react";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdowns } from "@/components/admin/FilterDropdowns";
import { type DateRangeValue } from "@/utils/dateRange";

interface UsersActionPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
}

export const UsersActionPanel: React.FC<UsersActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedDateRange,
  onDateRangeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
      <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search using name or ID"
        />
        <FilterDropdowns
          activeTab="users"
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
};
