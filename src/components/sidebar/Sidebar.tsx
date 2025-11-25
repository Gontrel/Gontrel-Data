"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/svgs/Icons";
import { TIconNames } from "@/components/svgs/IconNames";
import { useIsAdmin } from "@/stores/authStore";

interface NavLink {
  href: string;
  label: string;
  icon: TIconNames;
  matchSubPaths?: boolean;
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
        icon: "dashboardIcon",
        matchSubPaths: true,
      },
      {
        href: "/restaurants",
        label: "Restaurants",
        icon: "restaurantIcon",
        matchSubPaths: true,
      },
      { href: "/users", label: "Users", icon: "userIcon", matchSubPaths: true },
      {
        href: "/reports",
        label: "Reports",
        icon: "reportIcon",
        matchSubPaths: true,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    links: [
      {
        href: "/staffs",
        label: "Staffs",
        icon: "groupUserIcon",
        matchSubPaths: true,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: "settingsIcon",
        matchSubPaths: true,
      },
      {
        href: "/messages",
        label: "Messages",
        icon: "messagesIcon",
        matchSubPaths: true,
      },
      {
        href: "/competitions",
        label: "Competitions",
        icon: "competitionIcon",
        matchSubPaths: true,
      },
      {
        href: "/features",
        label: "Feature Flagging",
        icon: "featureIcon",
        matchSubPaths: true,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();

  return (
    <aside className="w-[240px] lg:w-[260px] bg-white h-screen fixed left-0 top-0 p-4 lg:p-6 shadow-md flex flex-col z-20 hidden md:flex">
      <div className="flex items-center gap-2 mb-6 lg:mb-8">
        <Image
          src={"/images/logo.png"}
          alt="Gontrel Logo"
          width={40}
          height={40}
          className="w-[40px] lg:w-[50px] h-auto"
        />
      </div>

      <nav className="flex flex-col gap-6 lg:gap-8 mt-6 lg:mt-8">
        {navSections.map((section) => {
          if (section.title === "MANAGEMENT" && !isAdmin) {
            return null;
          }

          return (
            <div key={section.title}>
              <h2 className="text-[#9DA1A5] leading-[100%] text-sm lg:text-base font-semibold mb-4 lg:mb-5 uppercase tracking-wider">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-3 lg:gap-4">
                {section.links.map((link) => {
                  const isActive = link.matchSubPaths
                    ? pathname.startsWith(link.href)
                    : pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 py-3 px-2 lg:px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-white shadow-lg"
                            : "text-[#9DA1A5]  hover:bg-gray-100"
                        }`}
                      >
                        <Icon
                          name={link.icon}
                          fill={`${isActive ? "#FFFFFF" : "transparent"}`}
                          stroke={`${isActive ? "#FFFFFF" : "#9DA1A5"}`}
                        />
                        <span
                          className={`text-[#9DA1A5] leading-[100%] text-sm lg:text-base font-medium ${
                            isActive ? "text-white" : "text-[#9DA1A5]"
                          }  `}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
