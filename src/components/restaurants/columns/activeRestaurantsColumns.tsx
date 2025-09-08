import { ColumnDef, Row } from "@tanstack/react-table";
import { ActiveRestaurantTableTypes } from "@/types/restaurant";
import { TableHeader } from "./utils";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { RestaurantTypeEnum } from "@/types";

export const createActiveRestaurantsColumns = (
  onRowClick?: (row: ActiveRestaurantTableTypes) => void
): ColumnDef<ActiveRestaurantTableTypes>[] => [
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
      const handleClick = (
        e: React.MouseEvent,
        row: Row<ActiveRestaurantTableTypes>
      ) => {
        onRowClick?.(row.original);
      };
      const handleKeyDown = (
        e: React.KeyboardEvent,
        row: Row<ActiveRestaurantTableTypes>,
        onRowClick?: (row: ActiveRestaurantTableTypes) => void
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
          <span className="truncate w-full">{row.getValue("name")}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "address",
    header: () => <TableHeader iconName="mapPinIcon" title="Address" />,
    cell: ({ row }) => {
      const name = row.original.address.content;
      const maplink = row.original.mapLink;

      return (
        <div className="flex flex-col gap-y-2">
          <ExternalLink href={maplink} title={`View ${name} on Google Maps`}>
            <span className="text-black truncate max-w-52">{name}</span>
          </ExternalLink>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ADDRESS,
  },
  {
    accessorKey: "website",
    header: () => <TableHeader iconName="linkIcon" title="Website" />,
    cell: ({ row }) => {
      const url = row.original.website ?? "";
      return (
        <ExternalLink href={url} title={url}>
          <span className="text-black">View website</span>
        </ExternalLink>
      );
    },
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "videos.total",
    header: () => <TableHeader iconName="videoIcon" title="Total videos" />,
    cell: ({ row }) => (
      <div className="text-center text-[17px] font-medium">
        {row.original.videos.total}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "restaurant.type",
    header: () => <TableHeader iconName="videoIcon" title="Restaurant type" />,
    cell: ({ row }) => {
      const type = row?.original?.orderType;
      const isTakeAway = type === RestaurantTypeEnum.TAKE_OUT;
      const isDine = type === RestaurantTypeEnum.DINE;
      const isBoth = type === RestaurantTypeEnum.BOTH;

      const formatted = isBoth
        ? "Both"
        : isDine
        ? "Dine in"
        : isTakeAway
        ? "Takeaway"
        : "Unknown";

      return (
        <div className="text-center text-[17px] font-medium">{formatted}</div>
      );
    },
  },

  {
    accessorKey: "order.link",
    header: () => <TableHeader iconName="linkIcon" title="Order Link" />,
    cell: ({ row }) => {
      const orderLink = row.original?.orderLink?.content
        ? row.original?.orderLink?.content
        : "N/A";
      return (
        <ExternalLink href={orderLink} title={orderLink}>
          <span className="text-black">View order link</span>
        </ExternalLink>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ORDER_LINK,
  },
  {
    accessorKey: "status",
    header: () => <TableHeader iconName="statusIcon" title="Status" />,
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <div
          className={`${
            isActive ? "bg-[#E6F9E6]" : "bg-[#FDE6E6]"
          } flex items-center gap-2 rounded-[10px] justify-center p-1`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-[#00B105]" : "bg-[#D80000]"
            }`}
          ></div>
          <span className="text-[17px] font-medium">
            {isActive ? "Active" : "Deactivated"}
          </span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "admin",
    header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
    cell: ({ row }) => {
      const { name, profileImage } = row.original.admin;

      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <Image
            src={profileImage?.length > 0 ? profileImage : "/images/user.png"}
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
    header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
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
