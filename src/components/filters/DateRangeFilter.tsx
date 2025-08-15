"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';
import { FilterButton } from '@/components/ui/FilterButton';
import { Calendar } from '@/components/ui/Calendar';
import { subDays, subMonths, format, startOfDay, endOfDay, Locale } from 'date-fns';
import { makePreset, normalizeRange, clamp, toUTCInclusive, type DateRangeValue } from '@/utils/dateRange';
import { mergeClasses } from '@/lib/utils';
import Icon from '../svgs/Icons';

type DateRangeFilterProps = {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  convertToUTC?: boolean;
  timeZone?: string;
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  placeholder?: string;
  now?: Date;
};

const CALENDAR_CLASSES: React.ComponentProps<typeof Calendar>['classNames'] = {
  months: 'flex flex-col gap-4',
  month: 'space-y-4',
  caption_label: 'text-lg font-semibold text-gray-900',
  table: 'w-full border-collapse',
  weekday: 'w-10 h-10 text-center text-sm text-gray-500 font-medium flex items-center justify-center',
  week: 'flex w-full',
  day: 'h-10 w-10 p-0 font-normal text-center relative flex items-center justify-center',
  today: 'font-semibold text-gray-900',
  outside: 'text-gray-400',
  disabled: 'opacity-30 cursor-not-allowed text-gray-300',
  selected: 'bg-blue-600 text-white hover:bg-blue-700',
  range_start: 'bg-blue-600 text-white rounded-md',
  range_end: 'bg-blue-600 text-white rounded-md',
  range_middle: 'bg-blue-100 text-blue-900',
};

export default function DateRangeFilter({
  value,
  onChange,
  convertToUTC = true,
  locale,
  weekStartsOn = 1,
  minDate,
  maxDate,
  className,
  placeholder = 'Date range',
  now,
}: Omit<DateRangeFilterProps, 'timeZone'>) {
  const today = useMemo(() => now ?? new Date(), [now]);

  const presets = useMemo(
    () => [
      { label: 'Last 7 days', get: () => makePreset(subDays(today, 6), today, minDate, maxDate) },
      { label: 'Last 14 days', get: () => makePreset(subDays(today, 13), today, minDate, maxDate) },
      { label: 'Last 30 days', get: () => makePreset(subDays(today, 29), today, minDate, maxDate) },
      { label: 'Last 3 months', get: () => makePreset(subMonths(today, 3), today, minDate, maxDate) },
      { label: 'Last 12 months', get: () => makePreset(subMonths(today, 12), today, minDate, maxDate) },
      { label: 'Custom', get: () => ({ from: undefined, to: undefined }) },
    ],
    [maxDate, minDate, today]
  );

  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  function toDateRange(v?: DateRange | DateRangeValue): DateRange | undefined {
    if (!v) return undefined;
    if ('startDate' in v && 'endDate' in v) {
      return normalizeRange({ from: v.startDate, to: v.endDate });
    }
    return normalizeRange(v);
  }

  const [temp, setTemp] = useState<DateRange | undefined>(toDateRange(value));

  useEffect(() => {
    const r = toDateRange(value as DateRange | DateRangeValue | undefined);
    setTemp(r);
  }, [value]);

  function handleSelectRange(r?: DateRange) {
    const n = normalizeRange(r);
    if (!n?.from || !n?.to) return setTemp(n);
    setTemp({
      from: clamp(startOfDay(new Date(n.from)), minDate, maxDate),
      to: clamp(endOfDay(new Date(n.to)), minDate, maxDate),
    });
    // Auto-switch to Custom when user manually selects dates
    setActivePreset('Custom');
  }

  function handlePresetClick(get: () => DateRange, label: string) {
    setTemp(get());
    setActivePreset(label);
  }

  const handleApply = useCallback(() => {
    if (!onChange) return;
    if (!temp?.from || !temp?.to) {
      onChange(undefined);
      setOpen(false);
      return;
    }
    const range = convertToUTC ? toUTCInclusive(temp) : temp;
    onChange({ startDate: range.from as Date, endDate: range.to as Date });
    setOpen(false);
  }, [onChange, temp, convertToUTC]);

  function handleCancel() {
    setTemp(toDateRange(value as DateRange | DateRangeValue | undefined));
    setOpen(false);
    // Reset active preset when canceling
    setActivePreset(null);
  }

  const label =
    temp?.from && temp?.to
      ? `${format(temp.from, 'd MMM yyyy', { locale })} - ${format(temp.to, 'd MMM yyyy', { locale })}`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterButton
          variant="outline"
          className={mergeClasses('flex items-center justify-between w-fit max-w-[200px] h-14 px-4 py-2',
            'bg-white border border-[#D9D9D9] rounded-lg',
            'text-left text-gray-600 font-medium',
            'placeholder:text-[#9DA1A5]',
            'hover:border-gray-400 focus:outline-none focus:border-blue-500',
            'transition-colors duration-200', className)}
          aria-label="Open date range filter"
        >
          <div className="flex flex-row items-center gap-2 w-full relative">
            <Icon name="calendarIcon" className="w-6 h-6" />
            <span className="flex-1 truncate font-medium text-lg">{label}</span>
            <Chevron color="#0070F3" />
          </div>
        </FilterButton>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 w-auto max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200" role="dialog" aria-label="Date range">
        <div className="flex">
          <aside className="w-56 border-r border-gray-200 p-6 bg-gray-50/50">
            <ul className="space-y-1">
              {presets.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(p.get, p.label)}
                    className={`w-full text-left rounded-lg px-4 py-3 transition-all duration-200 text-sm font-medium ${
                      activePreset === p.label
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="p-6 min-w-[400px]">
            <Calendar
              mode="range"
              selected={temp}
              onSelect={handleSelectRange}
              numberOfMonths={1}
              fixedWeeks
              classNames={CALENDAR_CLASSES}
              fromDate={minDate}
              toDate={maxDate}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />

            <div className="mt-6 flex items-center justify-between gap-3">
              <div></div>
              <div className="flex gap-3">
                <FilterButton
                  variant="ghost"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </FilterButton>
                <FilterButton
                  onClick={handleApply}
                  disabled={!temp?.from || !temp?.to}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </FilterButton>
              </div>
            </div>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Chevron({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="shrink-0">
      <path d="M5 7l5 5 5-5" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}


