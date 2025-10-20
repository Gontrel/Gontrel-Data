/* eslint-disable @typescript-eslint/no-explicit-any */
import { TABLE_COLUMN_SIZES } from "@/constants";
import { formatDate } from "@/lib/utils";
import { CompetitionTableTabsEnum } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export type CompetitionType = "Referral program" | "Leaderboard" | "Custom";

export interface CompetitionRow {
  id: string;
  title: string;
  type: CompetitionType;
  totalParticipants: number;
  eligibleWinners: number;
  eligibleQualifiers: number;
  createdAt: string; 
  dateCompleted?: string; 
}

export const CompetitionColumn = (
  activeTab: CompetitionTableTabsEnum,
  onRowClick: (row: CompetitionRow) => void
): ColumnDef<CompetitionRow>[] => [
  {
    accessorKey: "title",
    header: () => <span className="text-black font-semibold">Title</span>, 
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
          <div className="text-[#9CA3AF] text-[14px]">{row.original.title}</div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "type",
    header: () => <span className="text-black font-semibold">Competition type</span>,
    cell: ({ row }) => (
      <div className="text-[17px] font-medium">{row.original.type}</div>
    ),
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "totalParticipants",
    header: () => <span className="text-black font-semibold">Total participants</span>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums text-[17px] font-medium">
        {(row.original.totalParticipants ?? 0).toLocaleString()}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "eligibleWinners",
    header: () => <span className="text-black font-semibold">Eligible winners</span>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums text-[17px] font-medium">
        {row.original.eligibleWinners ?? 0}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "eligibleQualifiers",
    header: () => <span className="text-black font-semibold">Eligible qualifiers</span>,
    cell: ({ row }) => (
      <div className="text-center tabular-nums text-[17px] font-medium">
        {row.original.eligibleQualifiers ?? 0}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "dateCreated",
    header: () => <span className="text-black font-semibold">Date created</span>,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {row.original.createdAt ? formatDate(new Date(row.original.createdAt)) : "-"}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
  ...(activeTab === CompetitionTableTabsEnum.COMPLETED_COMPETITIONS
    ? ([
        {
          accessorKey: "dateCompleted",
          header: () => <span className="text-black font-semibold">Date completed</span>,
          cell: ({ row }: { row: any }) => (
            <div className="text-center text-[17px] font-medium">
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