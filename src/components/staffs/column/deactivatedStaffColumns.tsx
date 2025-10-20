import { ColumnDef, Row } from "@tanstack/react-table";
import { StaffTableTypes } from "@/types/user";
import { TableHeader } from "@/components/restaurants/columns/utils"; // Reusing the existing TableHeader
import { TABLE_COLUMN_SIZES } from "@/constants";
import { formatDate } from "@/lib/utils";

export const createDeactivatedStaffColumns = (
  onRowClick?: (row: StaffTableTypes) => void
): ColumnDef<StaffTableTypes>[] => [
  {
    accessorKey: "id",
    header: () => <TableHeader title="#" />,
    cell: ({ row, table }) => {
      const { pageSize, pageIndex } = table.getState().pagination;
      const rowIndex = row.index + 1;
      const calculatedId = pageIndex * pageSize + rowIndex;

      return (
        <div className="font-medium text-[#181D1F] w-fit truncate">
          {calculatedId}
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ID,
    meta: { sticky: true },
  },
  {
    accessorKey: "name",
    header: () => <TableHeader iconName="personIcon2" title="Staff" />,
    cell: ({ row }) => {
      const handleClick = (e: React.MouseEvent, row: Row<StaffTableTypes>) => {
        onRowClick?.(row.original);
      };
      const handleKeyDown = (
        e: React.KeyboardEvent,
        row: Row<StaffTableTypes>,
        onRowClick?: (row: StaffTableTypes) => void
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
          aria-label="View staff details"
          className="absolute top-0 bottom-0 left-0 right-0 flex items-center py-5 px-2.5 cursor-pointer font-medium text-[#181D1F] hover:text-blue-500 max-w-60 w-full h-full hover:bg-gray-50 overflow-hidden"
        >
          <span className="truncate w-full">{row.getValue("name")}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },

  {
    accessorKey: "role",
    header: () => <TableHeader iconName="personIcon" title="Role" />,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {row.original?.role ?? ""}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO, // Reusing size for now
  },

  {
    accessorKey: "email",
    header: () => <TableHeader iconName="emailIcon2" title="Email Adress" />,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium flex-wrap">
        {row.original?.email ?? ""}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },

  {
    accessorKey: "comment",
    header: () => <TableHeader iconName="commentIcon" title="Comment" />,
    cell: ({ row }) => {
      const comment = row.original?.comment ?? "";
      return (
        <div className="relative">
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <span className="text-[#181D1F] font-medium">{comment}</span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },

  {
    accessorKey: "createdAt",
    header: () => <TableHeader iconName="calendarIcon" title="Date Added" />,
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt ?? "";
      return (
        <div className="relative">
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <span className="text-[#181D1F] font-medium">
              {formatDate(new Date(createdAt))}
            </span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
];
