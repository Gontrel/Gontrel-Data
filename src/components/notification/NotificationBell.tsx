import { Bell } from "lucide-react";

export const NotificationBell = ({ count }: { count: number }) => {
  return (
    <button
      className="relative w-15 h-15 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-sm transition"
      aria-label="Notifications"
    >
      <Bell size={18} className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] leading-none">
          {count}
        </span>
      )}
    </button>
  );
};
