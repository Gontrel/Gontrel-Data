"use client";

import { DropdownFilter } from "../ui/DropdownFilter";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { AdminRoleEnum } from "@/types/enums";
import { type DateRangeValue } from "@/utils/dateRange";
import { useCurrentUser } from "@/stores/authStore";

/**
 * Props for FilterDropdowns component
 */
interface FilterDropdownsProps {
  selectedUser: string;
  onUserChange: (analyst: string) => void;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  usersOptions?: Array<{ value: string; label: string }>;
}

/**
 * Filter dropdowns component for analysts and time periods
 */
export function FilterDropdowns({
  selectedUser,
  onUserChange,
  selectedDateRange,
  onDateRangeChange,
  usersOptions,
}: FilterDropdownsProps) {
  const currentUser = useCurrentUser();
  const isAnalyst = currentUser?.role === AdminRoleEnum.ANALYST;

  // Person icon for analyst filter
  const personIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const optionsWithAll = [
    { value: "all", label: "All analysts" },
    ...(usersOptions ?? []),
  ];

  return (
    <div className="flex items-center gap-4.5">
      {/* Analyst Filter */}
      {optionsWithAll && optionsWithAll.length > 0 && !isAnalyst && (
        <DropdownFilter
          options={optionsWithAll}
          value={selectedUser}
          onChange={onUserChange}
          placeholder="All analysts"
          icon={personIcon}
          className="w-48"
        />
      )}
      {/* Time Period Filter */}
      {onDateRangeChange && (
        <DateRangeFilter
          value={selectedDateRange}
          onChange={onDateRangeChange}
          placeholder="All Time"
          className="w-[280px]"
        />
      )}
    </div>
  );
}
