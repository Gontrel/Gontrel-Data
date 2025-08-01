import { WorkingHours } from "@/components/restaurants/EditWorkingHoursModal";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isValidUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 */
export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date).toLowerCase();

  return `${formattedDate}\n${formattedTime}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert number to k, m, b, t, etc.
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
export const convertTimeTo24Hour = (time: string): number => {
  // Handle "24 hours" case
  if (time.toLowerCase() === "24 hours") {
    return 24;
  }

  const [hoursStr, minutesPeriod] = time.split(":");
  const period = minutesPeriod.slice(-2).toUpperCase();
  const minutesStr = minutesPeriod.slice(0, 2);

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours;
};

export const transformToModalHours = (
  hours: Record<string, string[]>
): WorkingHours => {
  const days: (keyof WorkingHours)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const initialModalHours: any = {};

  const parseTime = (time: string) => {
    // Handle "24 hours" case
    if (time.toLowerCase() === "24 hours") {
      return "00:00"; // or "24:00" if you prefer
    }

    const [timePart, modifier] = time.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier && modifier.toLowerCase() === "pm" && hours < 12) {
      hours += 12;
    }
    if (modifier && modifier.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
  };

  days.forEach((day) => {
    const dayKey = day.charAt(0).toUpperCase() + day.slice(1);
    const dayData = hours[dayKey];

    if (dayData && dayData.length > 0) {
      // Check if it's "24 hours"
      if (dayData[0].toLowerCase() === "24 hours") {
        initialModalHours[day] = {
          isOpen: true,
          isAllDay: true,
          slots: [{ start: "00:00", end: "23:59" }], // or "24:00" if your system supports it
        };
      } else {
        initialModalHours[day] = {
          isOpen: true,
          isAllDay: false,
          slots: dayData.map((range) => {
            const [start, end] = range.split(" - ");
            return { start: parseTime(start), end: parseTime(end) };
          }),
        };
      }
    } else {
      initialModalHours[day] = {
        isOpen: false,
        isAllDay: false,
        slots: [{ start: "09:00", end: "17:00" }],
      };
    }
  });

  return initialModalHours as WorkingHours;
};

export  const formatTime = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      const hours = h % 12 || 12;
      const minutes = String(m).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      return `${hours}:${minutes} ${ampm}`;
    };
