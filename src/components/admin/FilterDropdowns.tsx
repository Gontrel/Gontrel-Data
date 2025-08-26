"use client";

import { DropdownFilter } from "../ui/DropdownFilter";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { AdminRoleEnum, ManagerTableTabsEnum } from "@/types/enums";
import { type DateRangeValue } from "@/utils/dateRange";
import { useCurrentUser } from "@/stores/authStore";

/**
 * Props for FilterDropdowns component
 */
interface FilterDropdownsProps {
  selectedUser?: string;
  onUserChange?: (user: string | undefined) => void;

  selectedStatus?: string;
  onStatusChange?: (status: string | undefined) => void;

  activeTab: string;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange?: (range: DateRangeValue | undefined) => void;
  usersOptions?: Array<{ value: string; label: string }>;
}

/**
 * Filter dropdowns component for analysts, status and time periods
 */
export function FilterDropdowns({
  selectedUser = undefined,
  onUserChange = () => {},
  selectedStatus = undefined,
  onStatusChange = () => {},
  selectedDateRange,
  onDateRangeChange,
  activeTab,
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

  // Status icon
  const statusIcon = (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const optionsWithAll = [
    activeTab === ManagerTableTabsEnum.PENDING_USER_VIDEOS
      ? { value: "all", label: "All users" }
      : { value: undefined, label: "All analysts" },
    ...(usersOptions ?? []),
  ];

  const statusOptions = [
    { value: undefined, label: "All statuses" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex items-center gap-4.5">
      {/* Analyst/User Filter (only when NOT active videos) */}
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

      {activeTab === ManagerTableTabsEnum.ACTIVE_VIDEOS && (
        <DropdownFilter
          options={statusOptions}
          value={selectedStatus}
          onChange={onStatusChange}
          placeholder="All statuses"
          icon={statusIcon}
          className="w-48"
        />
      )}

      {/* Date Range Filter (always visible) */}
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
