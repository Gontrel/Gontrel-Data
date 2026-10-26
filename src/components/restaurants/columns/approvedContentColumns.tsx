import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { TableHeader } from "./utils";
import { Location, Address, Menu, Reservation } from "@/interfaces/restaurants";
import { Admin } from "@/interfaces/user";

export interface ApprovedContentTableType {
  id: string;
  name: string;
  admin: Admin;
  location: Location;
  postCount: number;
  createdAt: string;
  address?: Address;
  menu?: Menu;
  reservation?: Reservation;
}

export const createApprovedContentColumns = (): ColumnDef<ApprovedContentTableType>[] => [
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
    header: () => <TableHeader title="Restaurant name" />,
    cell: ({ row }) => {
      const locationId = row.original.location?.id || row.original.id;
      return (
        <Link
          href={`/restaurants/content/${locationId}`}
          className="absolute top-0 bottom-0 left-0 right-0 flex items-center py-5 px-2.5 cursor-pointer font-medium text-[#181D1F] hover:text-blue-600 max-w-60 w-full h-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate w-full">
            {row.original.location?.name || row.original.name || ""}
          </span>
        </Link>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "postCount",
    header: () => <TableHeader iconName="videoIcon" title="Total media" />,
    cell: ({ row }) => {
      const postCount = row.original.postCount || 0;
      return (
        <div className="text-[#181D1F]">
          {postCount} {postCount === 1 ? "Video" : "Videos"}
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "admin",
    header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
    cell: ({ row }) => {
      const admin = row.original.admin;
      const name = admin?.name || "Unknown";
      const profileImage = admin?.profileImage;

      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <Image
            src={profileImage && profileImage.length > 0 ? profileImage : "/images/user.png"}
            alt={name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-black font-medium">{name}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ADDED_BY,
  },
  {
    accessorKey: "createdAt",
    header: () => <TableHeader iconName="calendarIcon" title="Date Added" />,
    cell: ({ row }) => {
      const createdAt = row.original.location?.createdAt || row.original.createdAt;
      const dateAdded = createdAt ? new Date(createdAt) : null;

      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <span className="text-[#181D1F] font-medium">
            {dateAdded ? formatDate(dateAdded) : "N/A"}
          </span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
];
