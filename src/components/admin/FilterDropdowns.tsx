'use client';

import { DropdownFilter } from '../ui/DropdownFilter';
import DateRangeFilter from '@/components/filters/DateRangeFilter';
import { type DateRangeValue } from '@/utils/dateRange';

/**
 * Props for FilterDropdowns component
 */
interface FilterDropdownsProps {
  selectedAnalyst: string;
  onAnalystChange: (analyst: string) => void;
  selectedDateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  analystOptions?: Array<{ value: string; label: string }>;
}

/**
 * Filter dropdowns component for analysts and time periods
 */
export function FilterDropdowns({
  selectedAnalyst,
  onAnalystChange,
  selectedDateRange,
  onDateRangeChange,
  analystOptions
}: FilterDropdownsProps) {


  // Person icon for analyst filter
  const personIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const optionsWithAll = [
    { value: 'all', label: 'All analysts' },
    ...(analystOptions ?? [])
  ];

  return (
    <div className="flex items-center gap-4.5">
      {/* Analyst Filter */}
      {optionsWithAll && optionsWithAll.length > 0 && <DropdownFilter
        options={optionsWithAll}
        value={selectedAnalyst}
        onChange={onAnalystChange}
        placeholder="All analysts"
        icon={personIcon}
        className="w-48"
      />}
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