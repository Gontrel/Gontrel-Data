import { SearchBar } from "../admin/SearchBar";
import { AddRestaurantButton } from "./AddRestaurantButton";
import { FilterDropdowns } from "../admin/FilterDropdowns";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { useMemo } from "react";
import { useUserOptions } from "@/hooks/useUserHook";
import { type DateRangeValue } from "@/utils/dateRange";
import { ManagerTableTabsEnum } from "@/types";

/**
 * Props for ActionPanel component
 */
interface ActionPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddRestaurant: () => void;
  searchPlaceholder?: string;

  // Analyst/User
  selectedAnalyst?: string;
  onAnalystChange?: (analyst: string | undefined) => void;
  selectedUser?: string;
  onUserChange?: (user: string | undefined) => void;

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

/**
 * Search and Actions Component
 */
export const ActionPanel: React.FC<ActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  onAddRestaurant,
  searchPlaceholder = "Search using name or location",

  // Analyst/User
  selectedAnalyst = "",
  onAnalystChange = () => {},
  selectedUser = "",
  onUserChange = () => {},

  // Date
  selectedDateRange,
  onDateRangeChange,

  // Status
  selectedStatus = undefined,
  onStatusChange = () => {},

  // Other
  showFilters = true,
  analystOptions = [],
  userOptions = [],
  activeTab,
}) => {
  const { options: fetchedAnalystOptions } = useAnalystOptions();
  const { options: fetchedUserOptions } = useUserOptions({ quantity: 100 });

  const mergedAnalystOptions = useMemo(() => {
    return fetchedAnalystOptions.length > 0
      ? fetchedAnalystOptions
      : analystOptions;
  }, [analystOptions, fetchedAnalystOptions]);

  const mergedUserOptions = useMemo(() => {
    return fetchedUserOptions.length > 0 ? fetchedUserOptions : userOptions;
  }, [userOptions, fetchedUserOptions]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
      <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
        {/* Search */}
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />

        {/* Filters */}
        {showFilters && (
          <div>
            {/* Pending user videos */}
            {activeTab === ManagerTableTabsEnum.PENDING_USER_VIDEOS && (
              <FilterDropdowns
                selectedUser={selectedUser}
                activeTab={activeTab}
                onUserChange={onUserChange}
                usersOptions={mergedUserOptions}
                onDateRangeChange={onDateRangeChange}
              />
            )}
            {activeTab === ManagerTableTabsEnum.ACTIVE_VIDEOS && (
              <FilterDropdowns
                activeTab={activeTab}
                selectedDateRange={selectedDateRange}
                onUserChange={onAnalystChange}
                onDateRangeChange={onDateRangeChange}
                selectedStatus={selectedStatus}
                onStatusChange={onStatusChange}
                usersOptions={mergedAnalystOptions}
              />
            )}

            {activeTab !== ManagerTableTabsEnum.PENDING_USER_VIDEOS &&
              activeTab !== ManagerTableTabsEnum.ACTIVE_VIDEOS && (
                <FilterDropdowns
                  selectedUser={selectedAnalyst}
                  activeTab={activeTab}
                  onUserChange={onAnalystChange}
                  selectedDateRange={selectedDateRange}
                  onDateRangeChange={onDateRangeChange}
                  usersOptions={mergedAnalystOptions}
                />
              )}
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="flex items-center w-full sm:w-auto">
        <AddRestaurantButton onClick={onAddRestaurant} />
      </div>
    </div>
  );
};
