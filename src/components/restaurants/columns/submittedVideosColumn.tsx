import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { getBgColor, getTextColor } from "@/lib/tableUtils";
import { PillButton } from "@/components/ui/PillButton";
import { TableHeader } from "./utils";
import Logo from "@/assets/images/logo.png";
import { SubmittedVideoTableTypes } from "@/types/restaurant";
import { ApprovalStatusEnum } from "@/types";

/**
 * Creates column definitions for submitted videos table
 */
export const createSubmittedVideosColumns = (
  handleOpenVideoPreview: (locationId: string, adminId: string) => void,
  handleOpenResubmitModal: (restaurant: SubmittedVideoTableTypes) => void,
  onRowClick?: (row: SubmittedVideoTableTypes) => void
): ColumnDef<SubmittedVideoTableTypes>[] => [
    {
      accessorKey: 'id',
      header: () => (
        <TableHeader title="#" />
      ),
      cell: ({ row, table }) => {
        const { pageSize, pageIndex } = table.getState().pagination;
        const rowIndex = row.index + 1;
        const calculatedId = (pageIndex * pageSize) + rowIndex;

        return (
          <div className="font-medium text-[#181D1F] w-fit truncate">
            {calculatedId}
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ID,
      meta: { sticky: true }
    },
    {
      accessorKey: 'name',
      header: () => (
        <TableHeader title="Restaurant name" />
      ),
      cell: ({ row }) => {
        const handleClick = (e: React.MouseEvent, row: Row<SubmittedVideoTableTypes>) => {
          onRowClick?.(row.original);
        };
        const handleKeyDown = (
          e: React.KeyboardEvent,
          row: Row<SubmittedVideoTableTypes>,
          onRowClick?: (row: SubmittedVideoTableTypes) => void
        ) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick?.(row.original);
          }
        };
        return (
          <div
            onClick={(e) => handleClick(e, row)}
            onKeyDown={(e) => handleKeyDown(e, row, onRowClick)}
            role="button"
            tabIndex={0}
            aria-label="View restaurant details"
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center py-5 px-2.5 cursor-pointer font-medium text-[#181D1F] hover:text-blue-500 max-w-60 w-full h-full hover:bg-gray-50 overflow-hidden"
          >
            <span className="truncate w-full">{row.original.location?.name ?? ""}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.NAME,
      meta: { sticky: true }
    },
    {
      accessorKey: "posts",
      header: () => <TableHeader iconName="videoIcon" title="Video" />,
      cell: ({ row }) => {
        const { postCount } = row.original;
        return (
          <div className="flex flex-col gap-y-2 w-fit">
            <PillButton
              text={`${postCount} video${postCount > 1 ? "s" : ""}`}
              textColor={getTextColor([{ status: ApprovalStatusEnum.PENDING }])}
              bgColor={getBgColor([{ status: ApprovalStatusEnum.PENDING }])}
            />
            <span className="text-left text-blue-500 hover:underline hover:cursor-pointer" onClick={() => handleOpenVideoPreview(row.original.location?.id ?? "", row.original.admin.id ?? "")}>View</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.VIDEO,
    },
    {
      accessorKey: "addedBy",
      header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
      cell: ({ row }) => {
        const addedBy = row.original.admin.name;
        return (
          <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
            <Image
              src={Logo.src}
              alt={addedBy ?? "Gontrel"}
              width={40}
              height={40}
              className="object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = Logo.src;
              }}
            />
            <span className="font-medium text-black">{addedBy ?? "James"}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDED_BY,
    },
    {
      accessorKey: "dateAdded",
      header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
      cell: ({ row }) => {
        const dateAdded = new Date(row.original.location?.createdAt ?? row.original.admin.createdAt);

        return (
          <div className="relative">
            <div className="flex items-center w-full gap-2 px-2 py-1 text-left">
              <span className="text-[#181D1F] font-medium">
                {formatDate(dateAdded)}
              </span>
            </div>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
    },
  ];