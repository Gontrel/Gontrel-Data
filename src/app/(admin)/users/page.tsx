"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  UsersTableTabs,
  UsersTableTabsEnum,
} from "@/components/users/UsersTableTabs";
import { UsersActionPanel } from "@/components/users/UsersActionPanel";
import { UsersTableContent } from "@/components/users/UsersTableContent";
import { type DateRangeValue, rangeToYmd } from "@/utils/dateRange";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { useUsersCards } from "@/hooks/useUserHook";

const UsersPage = () => {
  const initialTab: UsersTableTabsEnum = UsersTableTabsEnum.ACTIVE_USERS;
  const [activeTab, setActiveTab] = useState<UsersTableTabsEnum>(initialTab);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { startDate, endDate } = rangeToYmd(dateRange);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback(
    (range: DateRangeValue | undefined) => {
      setDateRange(range);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback(
    (_tab: UsersTableTabsEnum, page: number) => {
      setCurrentPage(page);
    },
    []
  );

  const handlePageSizeChange = useCallback(
    (_tab: UsersTableTabsEnum, size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab: UsersTableTabsEnum) => setActiveTab(tab),
    []
  );

  const { stats: userStats, raw: userCardsRaw, isLoading: statsLoading } = useUsersCards();
  const tableTotals = useMemo(
    () => ({
      [UsersTableTabsEnum.ACTIVE_USERS]: userCardsRaw?.activeUsers ?? 0,
      [UsersTableTabsEnum.BLOCKED_USERS]: userCardsRaw?.blockedUsers ?? 0,
    }),
    [userCardsRaw]
  );

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        <StatsGrid className="lg:grid-cols-3" stats={userStats} loading={statsLoading} />
        <UsersTableTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tableTotals={tableTotals}
        />

        <UsersActionPanel
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          selectedDateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        <UsersTableContent
          activeTab={activeTab}
          searchTerm={searchTerm}
          startDate={startDate}
          endDate={endDate}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => handlePageChange(activeTab, page)}
          onPageSizeChange={(size) => handlePageSizeChange(activeTab, size)}
        />
      </div>
    </div>
  );
};

export default UsersPage;
