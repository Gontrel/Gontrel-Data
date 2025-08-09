import { ColumnDef, Row } from "@tanstack/react-table";
import { ActiveRestaurantTableTypes } from "@/types/restaurant";
import { TableHeader } from "./utils";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { ExternalLink } from "@/components/ui/ExternalLink";
import Logo from "@/assets/images/logo.png";

export const createActiveRestaurantsColumns = (
  onRowClick?: (row: ActiveRestaurantTableTypes) => void
): ColumnDef<ActiveRestaurantTableTypes>[] => [
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
        const handleClick = (e: React.MouseEvent, row: Row<ActiveRestaurantTableTypes>) => {
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
            <span className="truncate w-full">{row.getValue('name')}</span>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.NAME,
      meta: { sticky: true }
    },
    {
      accessorKey: 'address',
      header: () => (
        <TableHeader iconName="mapPinIcon" title="Address" />
      ),
      cell: ({ row }) => {
        const name = row.original.address.content;
        const maplink = `https://maps.google.com/?q=${encodeURIComponent(name)}`;

        return (
          <div className="flex flex-col gap-y-2">
            <ExternalLink
              href={maplink}
              title={`View ${name} on Google Maps`}
            >
              <span className="text-black truncate max-w-52">{name}</span>
            </ExternalLink>
          </div>
        );
      },
      minSize: TABLE_COLUMN_SIZES.ADDRESS,
    },
    {
      accessorKey: 'website',
      header: () => (
        <TableHeader iconName="linkIcon" title="Website" />
      ),
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
      accessorKey: "admin",
      header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
      cell: ({ row }) => {
        const { name, profileImage } = row.original.admin;
        return (
          <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
            <Image
              src={profileImage?.length > 0 ? profileImage : Logo.src}
              alt={name}
              width={40}
              height={40}
              className="rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = Logo.src;
              }}
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
            <div
              className="flex items-center gap-2 px-2 py-1 w-full text-left"
            >
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
