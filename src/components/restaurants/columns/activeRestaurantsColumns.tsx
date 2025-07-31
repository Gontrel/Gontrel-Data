import { ColumnDef } from "@tanstack/react-table";
import { ActiveRestaurantType } from "@/types/restaurant";
import { TableHeader } from "./utils";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants/table";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { PillButton } from "@/components/ui/PillButton";
import { TrendEnum } from "@/types";

export const createActiveRestaurantsColumns = (): ColumnDef<ActiveRestaurantType>[] => [
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
      const name = row.original.address;
      const maplink = row.original.maplink;

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
    accessorKey: "totalVideos",
    header: () => <TableHeader iconName="videoIcon" title="Total videos" />,
    cell: ({ row }) => (
      <div className="text-center text-[17px] font-medium">
        {row.getValue("totalVideos")}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "trend",
    header: () => <TableHeader iconName="flameIcon" title="Trend" />,
    cell: ({ row }) => {
      const textColor = row.getValue("trend") as TrendEnum === TrendEnum.NONE ? "text-[#2E3032]" : "text-[#2E3032]";
      const bgColor = row.getValue("trend") as TrendEnum === TrendEnum.NONE ? "bg-[#F0F1F2]" : "bg-[#E6F1FE]";
      return (
        <PillButton text={row.getValue("trend")} textColor={textColor} bgColor={bgColor} />
      )
    },
    minSize: TABLE_COLUMN_SIZES.TREND,
  },
  {
    accessorKey: "addedBy",
    header: () => <TableHeader iconName="calendarIcon" title="Added by" />,
    cell: ({ row }) => {
      const addedBy = row.getValue(
        "addedBy"
      ) as ActiveRestaurantType["addedBy"];
      return (
        <div className="flex items-center gap-2 px-2 py-1 w-full text-left">
          <Image
            src={addedBy.profileImage}
            alt={addedBy.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-black font-medium">{addedBy.name}</span>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.ADDED_BY,
  },
  {
    accessorKey: "dateAdded",
    header: () => <TableHeader iconName="calendarIcon" title="Date added" />,
    cell: ({ row }) => {
      const dateAdded = row.getValue("dateAdded") as Date;
      return (
        <div className="relative">
          <div
            className="flex items-center gap-2 px-2 py-1 w-full text-left"
          >
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
