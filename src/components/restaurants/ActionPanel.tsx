// Corrected ActionPanel component
import { SearchBar } from "../admin/SearchBar";
import { AddRestaurantButton } from "./AddRestaurantButton";
import { FilterDropdowns } from "../admin/FilterDropdowns";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { useMemo } from "react";
import { useUserOptions } from "@/hooks/useUserHook";
import { type DateRangeValue } from "@/utils/dateRange";
import { ManagerTableTabsEnum } from "@/types";

/**
 * Props for SearchAndActions component
 */
interface ActionPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddRestaurant: () => void;
  searchPlaceholder?: string;
  selectedAnalyst?: string;
  onAnalystChange?: (analyst: string) => void;
  selectedUser?: string;
  onUserChange?: (user: string) => void;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  showFilters?: boolean;
  analystOptions?: Array<{ value: string; label: string }>;
  userOptions?: Array<{ value: string; label: string }>;
  activeTab: string;
}

/**
 * Search and Actions Component
 * Handles search functionality, filter dropdowns, and action buttons
 */
export const ActionPanel: React.FC<ActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  onAddRestaurant,
  searchPlaceholder = "Search using name or location",
  selectedAnalyst = "",
  onAnalystChange = () => {},
  selectedUser = "",
  onUserChange = () => {},
  selectedDateRange,
  onDateRangeChange,
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
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        {showFilters && (
          <div>
            {activeTab === ManagerTableTabsEnum.PENDING_USER_VIDEOS ? (
             
              <FilterDropdowns
                selectedUser={selectedUser}
                activeTab = {activeTab}
                onUserChange={onUserChange}
                usersOptions={mergedUserOptions}
                onDateRangeChange={onDateRangeChange}
              />
            ) : (
              <FilterDropdowns
                selectedUser={selectedAnalyst}
                  activeTab = {activeTab}
                onUserChange={onAnalystChange}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={onDateRangeChange}
                usersOptions={mergedAnalystOptions}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center w-full sm:w-auto">
        <AddRestaurantButton onClick={onAddRestaurant} />
      </div>
    </div>
  );
};