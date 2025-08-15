import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WorkingHours } from "@/components/modals/EditWorkingHoursModal";
import { ConverTedWorkingHours, OpeningHour } from "@/interfaces/restaurants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};

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
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
export const convertTimeTo24Hour = (time: string): number => {
  // Handle "24 hours" case
  if (time.toLowerCase() === "24 hours") {
    return 24;
  }

  // Handle "Closed" case
  if (time.toLowerCase() === "Closed") {
    return 0;
  }

  const timeParts = time.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);

  if (!timeParts) {
    return 0;
  }

  let hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);
  const period = timeParts[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours + minutes / 60;
};

export const formatTime = (time: string): string => {
  // If the time string already contains AM or PM, assume it's correctly formatted and return it.
  if (time.toUpperCase().includes("AM") || time.toUpperCase().includes("PM")) {
    return time;
  }

  // Otherwise, assume it's an "HH:mm" string and convert it.
  const parts = time.split(":");
  if (parts.length !== 2) {
    return time; // Return original string if format is unexpected
  }

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) {
    return time; // Return original string if parsing fails
  }

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  return `${hours}:${minutesStr} ${ampm}`;
};

export const transformToModalHours = (
  hours: Record<string, string[]>
): WorkingHours => {
  const result: Partial<WorkingHours> = {};

  Object.entries(hours).forEach(([day, ranges]) => {
    if (!ranges?.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[day] = {
        isOpen: false,
        isAllDay: false,
        slots: [{ start: "09:00 AM", end: "05:00 PM" }],
      };
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any)[day] = {
      isOpen: true,
      isAllDay: ranges.some((r) => r.toLowerCase().includes("24 hours")),
      slots: ranges.map((range) => {
        if (range.toLowerCase().includes("24 hours")) {
          return { start: "12:00 AM", end: "11:59 PM" };
        }
        return parseTimeRange(range);
      }),
    };
  });

  return result as WorkingHours;
};

interface TimeSlot {
  start: string;
  end: string;
}

const parseTimeRange = (range: string): TimeSlot => {
  const convertTo24HourFormat = (timeStr: string | undefined): string => {
    if (!timeStr || timeStr.trim() === "") return "";

    const trimmedTime = timeStr.trim();

    // Check if it's already in HH:mm format
    const hhmmMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmmMatch) {
      const h = hhmmMatch[1].padStart(2, "0");
      const m = hhmmMatch[2];
      return `${h}:${m}`;
    }

    const match = trimmedTime.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
    if (!match) return "";

    const [, hours, minutes, period] = match;
    let h = parseInt(hours, 10);

    if (period.toUpperCase() === "PM" && h < 12) {
      h += 12;
    } else if (period.toUpperCase() === "AM" && h === 12) {
      h = 0; // Midnight case
    }

    return `${h.toString().padStart(2, "0")}:${minutes}`;
  };

  const parts = range.split(" – ");
  const start = convertTo24HourFormat(parts[0]);
  const end = convertTo24HourFormat(parts[1]);
  // If end is empty but start is not, default end to start.
  return { start, end: start && !end ? start : end };
};

export const generateSessionToken = () => {
  return (
    new Date().getTime().toString() + Math.random().toString(36).substring(2)
  );
};

export function formatOpeningHours(
  hours: OpeningHour[]
): ConverTedWorkingHours {
  const result: ConverTedWorkingHours = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  hours.forEach((hour) => {
    const dayName =
      hour.dayOfTheWeek.charAt(0) + hour.dayOfTheWeek.slice(1).toLowerCase();

    const formatTime = (decimalHours: number): string => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours % 1) * 60);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const openTime = formatTime(hour.opensAt);
    const closeTime = formatTime(hour.closesAt);

    // Add the time range to the appropriate day
    result[dayName].push(`${openTime} – ${closeTime}`);
  });

  // Handle days with no hours (set to "Closed")
  Object.keys(result).forEach((day) => {
    if (result[day].length === 0) {
      result[day] = ["00:00 AM – 00:00 PM"];
    }
  });

  return result;
}

export function cleanTiktokUrl(url: string): string {
  const match = url.match(
    /(https?:\/\/)?(www\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+)/
  );

  if (match && match[3]) {
    const cleanedUrl = `https://www.tiktok.com/${match[3]}`;
    return cleanedUrl;
  }

  return url.trim();
}

export const formatPostTime = (isoDateString: string): string => {
  const postDate = new Date(isoDateString);
  const now = new Date();

  // Check if the date is today
  const isToday =
    postDate.getDate() === now.getDate() &&
    postDate.getMonth() === now.getMonth() &&
    postDate.getFullYear() === now.getFullYear();

  // Format the time (e.g., "3pm")
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  });
  const formattedTime = timeFormatter.format(postDate).toLowerCase();

  if (isToday) {
    return `Today at ${formattedTime}`;
  }

  // Format for non-today dates with proper month capitalization
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const dayFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric" });

  const month = monthFormatter.format(postDate);
  const day = dayFormatter.format(postDate);

  return `${month} ${day} at ${formattedTime}`;
};
