import { SearchBar } from '../admin/SearchBar';
import { AddRestaurantButton } from './AddRestaurantButton';
import { FilterDropdowns } from '../admin/FilterDropdowns';

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
  selectedTimePeriod?: string;
  onTimePeriodChange?: (period: string) => void;
  showFilters?: boolean;
}

/**
 * Search and Actions Component
 * Handles search functionality, filter dropdowns, and action buttons
 */
export const ActionPanel: React.FC<ActionPanelProps> = ({
  searchTerm,
  onSearchChange,
  onAddRestaurant,
  searchPlaceholder = 'Search using name or location',
  selectedAnalyst = 'all',
  onAnalystChange = () => {},
  selectedTimePeriod = 'all',
  onTimePeriodChange = () => {},
  showFilters = true
}) => {
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
            selectedAnalyst={selectedAnalyst}
            onAnalystChange={onAnalystChange}
            selectedTimePeriod={selectedTimePeriod}
            onTimePeriodChange={onTimePeriodChange}
          />
        )}
      </div>


      <div className="flex items-center w-full sm:w-auto">
        <AddRestaurantButton onClick={onAddRestaurant} />
      </div>
    </div>
  );
};