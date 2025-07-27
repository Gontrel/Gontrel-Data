'use client';

import { Bell, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderConfig {
  title: string;
  description: string;
}

const headerConfigs: Record<string, HeaderConfig> = {
  '/dashboard': {
    title: 'Dashboard',
    description: ''
  },
  '/restaurants': {
    title: 'Restaurants',
    description: 'Manage restaurant listings and details.'
  },
  '/users': {
    title: 'Users',
    description: 'Manage user accounts and permissions.'
  },
  '/reports': {
    title: 'Reports',
    description: 'View and manage reports.'
  },
  '/staffs': {
    title: 'Staffs',
    description: 'Manage staff accounts and permissions.'
  },
  '/settings': {
    title: 'Settings',
    description: 'Manage application settings.'
  }
};

export function DynamicHeader() {
  const pathname = usePathname();

  const config = headerConfigs[pathname] || {
    title: 'Admin',
    description: 'Manage your application settings and data.'
  };

  return (
    <header className="sticky top-0 z-40 flex flex-row items-center justify-between w-full py-4 sm:py-8.5 px-4 sm:px-10 bg-[#FAFAFA] border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-black">{config.title}</h1>
          <p className="text-base sm:text-lg text-[#8A8A8A] font-medium">{config.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
              3
            </span>
          </div>
          <UserCircle size={24} />
        </div>
      </div>
    </header>
  );
}