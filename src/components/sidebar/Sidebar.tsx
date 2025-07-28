"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/logo.png";
import Icon from "@/components/svgs/Icons";
import { TIconNames } from "@/components/svgs/IconNames";

interface NavLink {
  href: string;
  label: string;
  icon: TIconNames;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    links: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: "dashboardIcon"
      },
      {
        href: "/restaurants",
        label: "Restaurants",
        icon: "restaurantIcon",
      },
      { href: "/users", label: "Users", icon: "userIcon" },
      { href: "/reports", label: "Reports", icon: "userIcon" },
    ],
  },
  {
    title: "MANAGEMENT",
    links: [
      { href: "/staffs", label: "Staffs", icon: "userIcon" },
      { href: "/settings", label: "Settings", icon: "dashboardIcon" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[300px] bg-white h-screen fixed left-0 top-0 p-8 shadow-md flex flex-col z-50">
      <div className="flex items-center gap-2 mb-12">
        <Image src={logo} alt="Gontrel Logo" width={40} height={40} />
      </div>

      <nav className="flex flex-col gap-8">
        {navSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-gray-400 font-semibold mb-4 uppercase tracking-wider">
              {section.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon name={link.icon} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
