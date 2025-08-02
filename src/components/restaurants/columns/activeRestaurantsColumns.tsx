import { ColumnDef } from "@tanstack/react-table";
import { ActiveRestaurantType } from "@/types/restaurant";
import { TableHeader } from "./utils";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants/table";
import { ExternalLink } from "@/components/ui/ExternalLink";
import Logo from "@/assets/images/logo.png";

export const createActiveRestaurantsColumns = (
): ColumnDef<ActiveRestaurantType>[] => [
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
    cell: ({ row }) => (
      <div className="font-medium text-[#181D1F] max-w-60 truncate">
        {row.getValue('name')}
      </div>
    ),
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
        const url = row.getValue('website') as string;
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
      const admin = row.original.admin;
      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <Image
            src={admin.profileImage ?? Logo}
            alt={admin.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = Logo.src;
            }}
          />
          <span className="text-black font-medium">{admin.name}</span>
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
