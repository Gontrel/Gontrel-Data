import { SearchBar } from "../admin/SearchBar";
import { type DateRangeValue } from "@/utils/dateRange";

interface StaffActionPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddStaff: () => void;
  searchPlaceholder?: string;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
}

export const StaffActionPanel: React.FC<StaffActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  onAddStaff,
  searchPlaceholder = "Search using name or email",
  selectedDateRange,
  onDateRangeChange,
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
        {/* <FilterDropdowns
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
        /> */}
      </div>

      <div className="flex items-center w-full sm:w-auto">
        {/* This will be the Add Staff Button */}
        <button
          onClick={onAddStaff}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Staff
        </button>
      </div>
    </div>
  );
};
