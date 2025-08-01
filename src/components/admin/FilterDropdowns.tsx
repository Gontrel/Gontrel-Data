'use client';

import { DropdownFilter } from '../ui/DropdownFilter';

/**
 * Props for FilterDropdowns component
 */
interface FilterDropdownsProps {
  selectedAnalyst: string;
  onAnalystChange: (analyst: string) => void;
  selectedTimePeriod: string;
  onTimePeriodChange: (period: string) => void;
  analystOptions?: Array<{ value: string; label: string }>;
  timePeriodOptions?: Array<{ value: string; label: string }>;
}

/**
 * Filter dropdowns component for analysts and time periods
 */
export function FilterDropdowns({
  selectedAnalyst,
  onAnalystChange,
  selectedTimePeriod,
  onTimePeriodChange,
  analystOptions = [
    { value: 'all', label: 'All analysts' },
    { value: 'analyst1', label: 'John Doe' },
    { value: 'analyst2', label: 'Jane Smith' },
    { value: 'analyst3', label: 'Mike Johnson' }
  ],
  timePeriodOptions = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: 'quarter', label: 'This quarter' },
    { value: 'year', label: 'This year' }
  ]
}: FilterDropdownsProps) {
  // Person icon for analyst filter
  const personIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Calendar icon for time period filter
  const calendarIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="flex items-center gap-4.5">
      <DropdownFilter
        options={analystOptions}
        value={selectedAnalyst}
        onChange={onAnalystChange}
        placeholder="All analysts"
        icon={personIcon}
        className="w-48"
      />
      <DropdownFilter
        options={timePeriodOptions}
        value={selectedTimePeriod}
        onChange={onTimePeriodChange}
        placeholder="All time"
        icon={calendarIcon}
        className="w-48"
      />
    </div>
  );
}