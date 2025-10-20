"use client";

import React from "react";
import { UsersTableTabsEnum } from "./UsersTableTabs";
import ActiveUsers from "./tables/ActiveUsers";
import BlockedUsers from "./tables/BlockedUsers";

interface UsersTableContentProps {
  activeTab: UsersTableTabsEnum;
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const UsersTableContent: React.FC<UsersTableContentProps> = ({
  activeTab,
  searchTerm,
  startDate,
  endDate,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (activeTab === UsersTableTabsEnum.ACTIVE_USERS) {
    return (
      <ActiveUsers
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }

  if (activeTab === UsersTableTabsEnum.BLOCKED_USERS) {
    return (
      <BlockedUsers
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }

  return null;
};
