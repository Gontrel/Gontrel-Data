"use client";

import { usePathname, useRouter } from "next/navigation";
import Icon from "../svgs/Icons";
import { NotificationBell } from "../notification/NotificationBell";
import { UserProfile } from "../users/UserProfile";

interface HeaderConfig {
  title: string;
  description: string;
  showBackButton?: boolean;
}

const headerConfigs: Record<string, HeaderConfig> = {
  "/dashboard": {
    title: "Dashboard",
    description: "",
    showBackButton: false,
  },
  "/restaurants": {
    title: "Restaurants",
    description: "Manage restaurant listings and details.",
    showBackButton: false,
  },
  "/users": {
    title: "Users",
    description: "Manage user accounts and permissions.",
    showBackButton: false,
  },
  "/reports": {
    title: "Reports",
    description: "View and manage reports.",
    showBackButton: false,
  },
  "/staffs": {
    title: "Staffs",
    description: "Manage staff accounts and permissions.",
    showBackButton: false,
  },
  "/settings": {
    title: "Settings",
    description: "Manage application settings.",
    showBackButton: false,
  },

  // Sub routes
  "/restaurants/**": {
    title: "Back",
    description: "",
    showBackButton: true,
  },
};

const getConfigForPath = (path: string) => {
  // Check exact matches first
  if (headerConfigs[path]) return headerConfigs[path];

  // Then check sub-routes
  if (path.startsWith("/restaurants/")) return headerConfigs["/restaurants/**"];

  return {
    title: "Admin",
    description: "Manage your application settings and data.",
  };
};

export function DynamicHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const config = getConfigForPath(pathname);

  return (
    <header className="sticky top-0 flex flex-row items-center justify-between w-full py-4 sm:py-8.5 px-4 sm:px-10 bg-[#FAFAFA] border-b border-gray-200 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {config.showBackButton && (
            <button
              className="bg-[#F0F1F2] py-[10px] px-[30px] rounded-[10px] flex flex-row justify-between items-center gap-4 "
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <Icon name="arrowBackIcon" className="w-5 h-5" />
              <span className="text-lg sm:text-2xl font-semibold text-black">
                {config?.title}
              </span>
            </button>
          )}

          {!config.showBackButton && (
            <div className="flex flex-col gap-y-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-black">
                {config.title}
              </h1>
              {config.description && (
                <p className="text-base sm:text-lg text-[#8A8A8A] font-medium">
                  {config.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell count={3} />
        <UserProfile />
      </div>
    </header>
  );
}
