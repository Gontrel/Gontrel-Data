import { Bell } from "lucide-react";

export const NotificationBell = ({ count }: { count: number }) => {
  return (
    <button
      className="relative p-2 rounded-full hover:bg-gray-100"
      aria-label="Notifications"
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </button>
  );
};
