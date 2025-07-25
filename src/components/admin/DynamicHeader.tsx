'use client';

import { usePathname } from 'next/navigation';

interface HeaderConfig {
  title: string;
  description: string;
}

const headerConfigs: Record<string, HeaderConfig> = {
  '/restaurants': {
    title: 'Restaurants',
    description: 'Manage restaurant listings and details.'
  },
  '/user-management': {
    title: 'User Management',
    description: 'Manage user accounts and permissions.'
  }
};

/**
 * Dynamic header component that changes based on the current route
 * This is a client component that only handles the dynamic header logic
 */
export function DynamicHeader() {
  const pathname = usePathname();

  // Get header config for current path, fallback to admin default
  const config = headerConfigs[pathname] || {
    title: 'Admin',
    description: 'Manage your application settings and data.'
  };

  return (
    <div className="sticky top-0 z-40 flex flex-row items-center justify-between w-full py-4 sm:py-8.5 px-4 sm:px-10 bg-[#FAFAFA] border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-black">{config.title}</h1>
          <p className="text-base sm:text-lg text-[#8A8A8A] font-medium">{config.description}</p>
        </div>
      </div>
    </div>
  );
}