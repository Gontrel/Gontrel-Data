import { type DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, format } from 'date-fns';

export type DateRangeValue = { startDate: Date; endDate: Date };

export function clamp(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && date < minDate) return minDate;
  if (maxDate && date > maxDate) return maxDate;
  return date;
}

export function normalizeRange(range?: DateRange): DateRange | undefined {
  if (!range?.from || !range?.to) return range;
  const a = range.from;
  const b = range.to;
  return a <= b ? range : { from: b, to: a };
}

export function setTime(
  date: Date,
  hours?: number,
  minutes?: number,
  inclusiveEnd = false
) {
  const d = new Date(date);
  if (inclusiveEnd) d.setHours(hours ?? 23, minutes ?? 59, 59, 999);
  else d.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return d;
}

export function makePreset(
  from: Date,
  to: Date,
  minDate?: Date,
  maxDate?: Date
): DateRange {
  const start = clamp(startOfDay(from), minDate, maxDate);
  const end = clamp(endOfDay(to), minDate, maxDate);
  return { from: start, to: end };
}

export function toUTCInclusive(range: DateRange): DateRange {
  // For query params we only need yyyy-MM-dd local dates; keep as-is.
  return range;
}

export function toYmd(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function rangeToYmd(range?: DateRangeValue): { startDate?: string; endDate?: string } {
  if (!range) return {};
  return { startDate: toYmd(range.startDate), endDate: toYmd(range.endDate) };
}


