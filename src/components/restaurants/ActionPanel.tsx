import { SearchBar } from "../admin/SearchBar";
import { AddRestaurantButton } from "./AddRestaurantButton";
import { FilterDropdowns } from "../admin/FilterDropdowns";
import { type DateRangeValue } from "@/utils/dateRange";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { useMemo } from "react";

/**
 * Props for SearchAndActions component
 */
interface ActionPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddRestaurant: () => void;
  searchPlaceholder?: string;
  // Filter props
  selectedAnalyst?: string;
  onAnalystChange?: (analyst: string) => void;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  showFilters?: boolean;
  analystOptions?: Array<{ value: string; label: string }>;
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
  selectedAnalyst = "all",
  onAnalystChange = () => {},
  selectedDateRange,
  onDateRangeChange,
  showFilters = true,
  analystOptions = [],
}) => {
  const { options: fetchedAnalystOptions } = useAnalystOptions();

  const mergedAnalystOptions = useMemo(() => {
    // prefer server-fetched options; fallback to provided ones
    return (
      fetchedAnalystOptions.length > 0 ? fetchedAnalystOptions : analystOptions
    ) as Array<{
      value: string;
      label: string;
    }>;
  }, [analystOptions, fetchedAnalystOptions]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
      <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        {showFilters && (
          <FilterDropdowns
            selectedUser={selectedAnalyst}
            onUserChange={onAnalystChange}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={onDateRangeChange}
            usersOptions={mergedAnalystOptions}
          />
        )}
      </div>

      <div className="flex items-center w-full sm:w-auto">
        <AddRestaurantButton onClick={onAddRestaurant} />
      </div>
    </div>
  );
};
