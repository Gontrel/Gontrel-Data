"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdowns } from "@/components/admin/FilterDropdowns";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/svgs/Icons";
import { GenericTable } from "@/components/tables/GenericTable";
import { TableHeader } from "@/components/restaurants/columns/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { formatDate } from "@/lib/utils";
import { type DateRangeValue } from "@/utils/dateRange";
import { CompetitionTableTabsEnum } from "@/types";
import { CompetitionTableTabs } from "@/components/competitions/CompetitionTableTabs";
import NewCompetitionSheet, {
  NewCompetitionForm,
} from "@/components/competitions/NewCompetitionSheet";

// -----------------------------------------------------------------------------
// Types & Mock Data
// -----------------------------------------------------------------------------

type CompetitionType = "Referral program" | "Leaderboard" | "Custom";

interface CompetitionRow {
  id: string;
  title: string;
  type: CompetitionType;
  totalParticipants: number;
  eligibleWinners: number;
  eligibleQualifiers: number;
  dateCreated: string; // ISO
  dateCompleted?: string; // ISO when completed
}

const buildMock = (completed = false, count = 37): CompetitionRow[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `#${123456 + i}`,
    title: i % 2 ? "Power Users competition" : "Bambino competition",
    type: "Referral program",
    totalParticipants: 400 + ((i * 73) % 10000),
    eligibleWinners: 1 + (i % 2),
    eligibleQualifiers: 1,
    dateCreated: new Date(2025, 0, 3, 16, 30).toISOString(),
    ...(completed && {
      dateCompleted: new Date(2025, 0, 3, 16, 30).toISOString(),
    }),
  }));

const MOCK_ACTIVE = buildMock(false, 37);
const MOCK_COMPLETED = buildMock(true, 24);

// -----------------------------------------------------------------------------
// Columns
// -----------------------------------------------------------------------------

const createColumns = (
  activeTab: CompetitionTableTabsEnum,
  onRowClick: (row: CompetitionRow) => void
): ColumnDef<CompetitionRow>[] => [
  {
    accessorKey: "title",
    header: () => <TableHeader title="Title" />, // title + id
    cell: ({ row }) => {
      const handleClick = () => onRowClick(row.original as CompetitionRow);
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick(row.original as CompetitionRow);
        }
      };
      return (
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className="flex flex-col py-3 cursor-pointer hover:bg-gray-50 rounded-md px-2"
          aria-label="View competition details"
        >
          <div className="text-[#181D1F] font-semibold text-[17px] truncate">
            {row.original.title}
          </div>
          <div className="text-[#9CA3AF] text-[14px]">{row.original.id}</div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "type",
    header: () => <TableHeader title="Competition type" />,
    cell: ({ row }) => (
      <div className="text-[17px] font-medium">{row.original.type}</div>
    ),
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "totalParticipants",
    header: () => <TableHeader title="Total participants" />,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-[17px] font-medium">
        {row.original.totalParticipants.toLocaleString()}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "eligibleWinners",
    header: () => <TableHeader title="Eligible winners" />,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-[17px] font-medium">
        {row.original.eligibleWinners}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "eligibleQualifiers",
    header: () => <TableHeader title="Eligible qualifiers" />,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-[17px] font-medium">
        {row.original.eligibleQualifiers}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "dateCreated",
    header: () => <TableHeader title="Date created" />,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {formatDate(new Date(row.original.dateCreated))}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
  ...(activeTab === CompetitionTableTabsEnum.COMPLETED_COMPETITIONS
    ? ([
        {
          accessorKey: "dateCompleted",
          header: () => <TableHeader title="Date completed" />,
          cell: ({ row }: { row: any }) => (
            <div className="text-left text-[17px] font-medium">
              {row.original.dateCompleted
                ? formatDate(new Date(row.original.dateCompleted))
                : "-"}
            </div>
          ),
          minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
        },
      ] as ColumnDef<CompetitionRow>[])
    : []),
];

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

  const data = useMemo(
    () =>
      activeTab === CompetitionTableTabsEnum.ACTIVE_COMPETITIONS
        ? MOCK_ACTIVE
        : MOCK_COMPLETED,
    [activeTab]
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let arr = data;
    if (term) {
      arr = arr.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term)
      );
    }
    // dateRange filtering placeholder
    return arr;
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const columns = useMemo(
    () =>
      createColumns(activeTab, (row) => {
        const idSegment = row.id.startsWith("#") ? row.id.slice(1) : row.id;
        router.push(`/competitions/${idSegment}`);
      }),
    [activeTab, router]
  );

  const stats = [
    { label: "Total competitions created", value: 3500 },
    { label: "Total competitions active", value: 3500 },
    { label: "Total competitions completed", value: 3500 },
  ];

  const totalsMap: Record<CompetitionTableTabsEnum, number> = {
    [CompetitionTableTabsEnum.ACTIVE_COMPETITIONS]: MOCK_ACTIVE.length,
    [CompetitionTableTabsEnum.COMPLETED_COMPETITIONS]: MOCK_COMPLETED.length,
  };

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

  const handleNewCompetition = useCallback(() => {
    setShowNewCompetition(true);
  }, []);

  const handleCreateCompetition = useCallback((data: NewCompetitionForm) => {
    // TODO: Hook to backend. For now just close.
    setShowNewCompetition(false);
    // Optionally: toast success and refresh table
  }, []);

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
                activeTab={activeTab}
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
          loading={false}
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
