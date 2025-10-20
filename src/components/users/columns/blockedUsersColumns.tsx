import { ColumnDef, Row } from "@tanstack/react-table";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { TableHeader } from "@/components/restaurants/columns/utils";
import { formatDate } from "@/lib/utils";
import { User } from "@/interfaces";
import Image from "next/image";

export const createBlockedUsersColumns = (
  onRowClick?: (row: User) => void
): ColumnDef<User>[] => [
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
    accessorKey: "displayName",
    header: () => <TableHeader iconName="personIcon2" title="User" />,
    cell: ({ row }) => {
      const handleClick = (e: React.MouseEvent, r: Row<User>) =>
        onRowClick?.(r.original);
      const handleKeyDown = (e: React.KeyboardEvent, r: Row<User>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick?.(r.original);
        }
      };
      return (
        <div
          onClick={(e) => handleClick(e, row)}
          onKeyDown={(e) => handleKeyDown(e, row)}
          role="button"
          tabIndex={0}
          aria-label="View user details"
          className="absolute top-0 bottom-0 left-0 right-0 flex items-center gap-2 py-5 px-2.5 cursor-pointer font-medium text-[#181D1F] hover:text-blue-500 max-w-60 w-full h-full hover:bg-gray-50 overflow-hidden"
        >
          <Image
            src={row.original.profileImage || "/images/avatar.png"}
            alt={row.original.displayName}
            className="w-6 h-6 rounded-full object-cover"
            width={24}
            height={24}
          />
          <span className="truncate w-full">{row.getValue("displayName")}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "email",
    header: () => <TableHeader iconName="emailIcon2" title="Email address" />,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium flex-wrap">
        {row.original.email}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "postCount",
    header: () => <TableHeader iconName="videoIcon" title="Videos posted" />,
    cell: ({ row }) => (
      <div className="text-center text-[17px] font-medium">
        {row.original?.postCount ?? 0}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "locationCount",
    header: () => (
      <TableHeader iconName="restaurantIcon" title="Restaurants visited" />
    ),
    cell: ({ row }) => (
      <div className="text-center text-[17px] font-medium">
        {row.original?.locationCount ?? 0}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "comment",
    header: () => <TableHeader iconName="commentIcon" title="Comment" />,
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium truncate max-w-80">
        {row.original?.comment ?? "-"}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.NAME,
  },
  {
    accessorKey: "deletedAt",
    header: () => <TableHeader iconName="calendarIcon" title="Date blocked" />,
    cell: ({ row }) => {
      const deletedAt = row.original?.deletedAt ?? "";
      return (
        <div className="relative">
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <span className="text-[#181D1F] font-medium">
              {deletedAt ? formatDate(new Date(deletedAt)) : "-"}
            </span>
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
];
