"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/svgs/Icons";
// import { FiUsers, FiSettings, FiMenu, FiX, FiBriefcase } from "react-icons/fi";

const navLinks = [
  {
    name: "Merchant Management",
    href: "/admin/merchant-management",
    icon: <Icon name="dashboardIcon" />,
  },
  {
    name: "User Management",
    href: "/admin/user-management",
    // icon: <FiUsers />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    // icon: <FiSettings />,
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
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl"
          >
            {/* {isOpen ? <FiX /> : <FiMenu />} */}
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
                    }`}
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
