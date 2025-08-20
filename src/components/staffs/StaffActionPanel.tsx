import { FilterDropdowns } from "../admin/FilterDropdowns";
import { SearchBar } from "../admin/SearchBar";
import { type DateRangeValue } from "@/utils/dateRange";
import { Button } from "../ui/Button";
import Icon from "../svgs/Icons";

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
        <FilterDropdowns
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
          selectedUser={""}
          onUserChange={function (error: string): void {
            throw new Error(`Function not implemented. ${error}`);
          }}
        />
      </div>

      <div className="flex items-center w-full sm:w-auto">
        {/* This will be the Add Staff Button */}
        <Button
          onClick={onAddStaff}
          className="bg-[#0070F3] text-white px-[12px] py-[16px] rounded-[10px] gap-2"
        >
          <Icon name="plusIcon" className="h-5 w-5 text-gray-500" />
          <span> Add Staff</span>
        </Button>
      </div>
    </div>
  );
};
