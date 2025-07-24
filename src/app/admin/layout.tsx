"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings,
  Menu,
  X,
  Building,
  ClipboardList,
} from "lucide-react";

const navLinks = [
  {
    name: "Restaurant Management",
    href: "/admin/restaurant-management",
    icon: <Building />,
  },
  {
    name: "User Management",
    href: "/admin/user-management",
    icon: <Users />,
  },
  {
    name: "Pending Changes",
    href: "/admin/pending-changes",
    icon: <ClipboardList />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings />,
  },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-center p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Nav */}
        <nav className="px-4">
          <ul className="space-y-4">
            {navLinks.map(({ name, href, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors font-figtree ${
                      isActive
                        ? "bg-blue-500 text-white "
                        : "hover:bg-gray-700 text-gray-300"
                    } ${!isOpen && "justify-center"}`}
                  >
                    <span className="text-xl font-figtree">{icon}</span>
                    {isOpen && (
                      <span className="text-base font-figtree">{name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-6 overflow-auto">{children}</section>
    </main>
  );
}
