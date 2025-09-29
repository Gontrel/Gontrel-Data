/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdowns } from "@/components/admin/FilterDropdowns";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/svgs/Icons";
import { GenericTable } from "@/components/tables/GenericTable";
import { type DateRangeValue } from "@/utils/dateRange";
import { CompetitionTableTabsEnum, CompetitionTypeEnum } from "@/types";
import { CompetitionTableTabs } from "@/components/competitions/CompetitionTableTabs";
import NewCompetitionSheet, {
  NewCompetitionForm,
} from "@/components/competitions/NewCompetitionSheet";
import { useCreateCompetition, useGetCompetitions } from "@/hooks/useCompetitions";
import {
  CompetitionColumn,
  type CompetitionRow,
} from "@/components/competitions/column/CompetitionColumn";
import { CreateCompetitionRequest } from "@/interfaces";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function CompetitionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CompetitionTableTabsEnum>(
    CompetitionTableTabsEnum.ACTIVE_COMPETITIONS
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showNewCompetition, setShowNewCompetition] = useState(false);
  const [competitionType, setCompetitionType] = useState<string | undefined>(undefined);

  const startDate = useMemo(
    () =>
      dateRange?.startDate
        ? new Date(dateRange.startDate).toISOString().slice(0, 10)
        : undefined,
    [dateRange?.startDate]
  );
  const endDate = useMemo(
    () =>
      dateRange?.endDate
        ? new Date(dateRange.endDate).toISOString().slice(0, 10)
        : undefined,
    [dateRange?.endDate]
  );

  const { queryData: activeTotalsRes, isLoading: activeLoading, refetch: refetchActive } =
    useGetCompetitions({
      currentPage,
      pageSize,
      searchTerm,
      startDate,
      endDate,
      isActive: true,
    });
  const { queryData: completedTotalsRes, isLoading: completedLoading, refetch: refetchCompleted } =
    useGetCompetitions({
      currentPage,
      pageSize,
      searchTerm,
      startDate,
      endDate,
      isActive: false,
    });

   const { handleCreateCompetition: createCompetition, } =
    useCreateCompetition();

  const getTotalFromResponse = (res: unknown): number => {
    if (!res || typeof res !== "object") return 0;
    const obj = res as any;
    if (obj?.pagination?.total && typeof obj.pagination.total === "number")
      return obj.pagination.total;
    if (Array.isArray(obj)) return obj.length;
    if (Array.isArray(obj?.data)) return obj.data.length;
    if (typeof obj?.total === "number") return obj.total;
    return 0;
  };

  const activeTotal = getTotalFromResponse(activeTotalsRes);
  const completedTotal = getTotalFromResponse(completedTotalsRes);

  const totalsMap: Record<CompetitionTableTabsEnum, number> = {
    [CompetitionTableTabsEnum.ACTIVE_COMPETITIONS]: activeTotal,
    [CompetitionTableTabsEnum.COMPLETED_COMPETITIONS]: completedTotal,
  };

  const stats = [
    {
      label: "Total competitions created",
      value: activeTotal + completedTotal,
    },
    { label: "Total competitions active", value: activeTotal },
    { label: "Total competitions completed", value: completedTotal },
  ];

  const isLoading = activeLoading || completedLoading;

  const filtered = useMemo((): CompetitionRow[] => {
    const term = searchTerm.trim().toLowerCase();
    const source: any =
      activeTab === CompetitionTableTabsEnum.ACTIVE_COMPETITIONS
        ? activeTotalsRes
        : completedTotalsRes;
    let arr: CompetitionRow[] = Array.isArray(source)
      ? (source as CompetitionRow[])
      : (source?.data as CompetitionRow[]) ?? [];
    if (term) {
      arr = arr.filter(
        (c: CompetitionRow) =>
          c.title.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term)
      );
    }
    // dateRange filtering placeholder
    return arr;
  }, [activeTab, activeTotalsRes, completedTotalsRes, searchTerm]);

  const totalPages = useMemo(() => {
    const raw: any =
      activeTab === CompetitionTableTabsEnum.ACTIVE_COMPETITIONS
        ? activeTotalsRes
        : completedTotalsRes;
    const total = getTotalFromResponse(raw);
    return Math.max(1, Math.ceil(total / pageSize));
  }, [activeTab, activeTotalsRes, completedTotalsRes, pageSize]);

  // Server already returns paginated list
  const paginated = filtered;

    // Map selectedStatus to CompetitionTypeEnum
    const competitionTypeValue = useMemo(() => {
      if (competitionType === "referral") return CompetitionTypeEnum.REFERRAL;
      return ""
    }, [competitionType]);

  const columns = useMemo(
    () =>
      CompetitionColumn(activeTab, (row) => {
        const idSegment = row.id.startsWith("#") ? row.id.slice(1) : row.id;
        router.push(`/competitions/${idSegment}`);
      }),
    [activeTab, router]
  );

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

  const handleStatusChange = useCallback((status: string | undefined) => {
    setCompetitionType(status);
    setCurrentPage(1);
  }, []);

  const handleNewCompetition = useCallback(() => {
    setShowNewCompetition(true);
  }, []);

  const handleCreateCompetition = useCallback(
    async (data: NewCompetitionForm) => {
      const mapAggregation = (op: NewCompetitionForm["aggregationOp"]) => {
        switch (op) {
          case "Equals":
            return "equal";
          case "Greater than":
            return "greater_than";
          case "Less than":
            return "less_than";
          default:
            return "equal";
        }
      };

      const mapType = (type: NewCompetitionForm["type"]) => {
       const t = (type || "").toLowerCase();
        if (t.includes("referral")) return "referral";
        if (t.includes("leaderboard")) return "leaderboard";
        return "custom";
      };

      const payload: CreateCompetitionRequest = {
        title: data.title,
        type: mapType(data.type),
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
        endDate: data?.endDate ? new Date(data.endDate).toISOString() : undefined,
        eligibleWinners: data?.eligibleWinners,
        eligibleQualifiers: data?.eligibleQualifiers,
        aggregation: mapAggregation(data?.aggregationOp),
        aggregationValue: data?.aggregationValue,
      };

      await createCompetition(payload);
      setShowNewCompetition(false);
      refetchActive();
      refetchCompleted();
    },
    [createCompetition, refetchActive, refetchCompleted]
  );

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Header Stats */}
        <StatsGrid className="lg:grid-cols-3" stats={stats} loading={false} />

        {/* Tabs */}
        <CompetitionTableTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          tableTotals={totalsMap}
        />

        {/* Action Row: search + filters + new button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
          <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
            <div className="flex items-center gap-4.5">
              <FilterDropdowns
                activeTab="competitions"
                selectedStatus={competitionTypeValue}
                onStatusChange={handleStatusChange}
                selectedDateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>

          <div className="flex items-center w-full sm:w-auto">
            <Button
              onClick={handleNewCompetition}
              className="bg-[#0070F3] text-white px-[12px] py-[16px] rounded-[10px] gap-2"
            >
              <Icon name="plusIcon" className="h-5 w-5 text-gray-500" />
              <span> New competition</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <GenericTable<CompetitionRow>
          data={paginated}
          loading={isLoading}
          showSelection={false}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageSizeChange={(size) => setPageSize(size)}
          onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)}
        />
      </div>
      <NewCompetitionSheet
        open={showNewCompetition}
        onOpenChange={setShowNewCompetition}
        onSubmit={handleCreateCompetition}
      />
    </div>
  );
}
