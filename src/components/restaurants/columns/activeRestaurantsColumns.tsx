import { ColumnDef } from "@tanstack/react-table";
import { ActiveRestaurantType } from "@/types/restaurant";
import { MapPin, Link as LinkIcon, Calendar, Flame, Video } from "lucide-react";
import { TableHeader } from "./utils";
import Image from "next/image";
import { format } from "date-fns";
import Icon from "@/components/svgs/Icons";

const TrendBadge = ({ trend }: { trend: ActiveRestaurantType["trend"] }) => {
  const baseClasses = "px-3 py-1.5 rounded-full text-sm font-medium";
  const styles = {
    "Popular searches": "bg-[#E6F1FE] text-[#2E3032]",
    "Trending TikTok #": "bg-[#E6F1FE] text-[#2E3032]",
    None: "bg-[#F0F1F2] text-[#2E3032]",
  };
  return <span className={`${baseClasses} ${styles[trend]}`}>{trend}</span>;
};

<<<<<<< HEAD
export const createActiveRestaurantsColumns = (
): ColumnDef<ActiveRestaurantType>[] => [
=======
export const createActiveRestaurantsColumns = (): ColumnDef<ActiveRestaurantType>[] => [
>>>>>>> 097a102cbb65b1dfca1f9a1a9b119a4ac717f5b8
  {
    accessorKey: "name",
    header: () => <TableHeader title="Restaurant name" />,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center gap-3.5">
          <div className="flex flex-row items-center">
            <div>
              <div className="font-medium flex flex-wrap text-[17px] leading-[100%] text-[#2E3032]">
                {restaurant.name}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <TableHeader icon={MapPin} title="Address" />,
    cell: ({ row }) => (
      <div className="flex flex-row gap-[14px]">
        <p className=" text-[17px] font-medium">{row.getValue("address")}</p>
        <a
          href={row.original.maplink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-black font-medium"
        >
          <Icon name="websiteLinkIcon" />
        </a>
      </div>
    ),
  },
  {
    accessorKey: "website",
    header: () => <TableHeader icon={LinkIcon} title="Website" />,
    cell: ({ row }) => (
      <div className="flex flex-row gap-[14px]">
        <p className=" text-[17px] font-medium"> View website </p>
        <a
          href={row.getValue("website")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-black font-medium"
        >
          <Icon name="websiteLinkIcon" />
        </a>
      </div>
    ),
  },
  {
    accessorKey: "totalVideos",
    header: () => <TableHeader icon={Video} title="Total videos" />,
    cell: ({ row }) => (
      <div className="text-center text-[17px] font-medium">
        {row.getValue("totalVideos")}
      </div>
    ),
  },
  {
    accessorKey: "trend",
    header: () => <TableHeader icon={Flame} title="Trend" />,
    cell: ({ row }) => <TrendBadge trend={row.getValue("trend")} />,
  },
  {
    accessorKey: "addedBy",
    header: () => <TableHeader icon={Calendar} title="Added by" />,
    cell: ({ row }) => {
      const addedBy = row.getValue(
        "addedBy"
      ) as ActiveRestaurantType["addedBy"];
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-row">
            <Image
              src={addedBy.profileImage}
              alt={addedBy.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-[17px] flex flex-wrap font-medium">
              {addedBy.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dateAdded",
    header: () => <TableHeader icon={Calendar} title="Date added" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateAdded"));
      return (
        <div className="flex flex-col items-center">
          <div className="text-[#2E3032] text-[17px] font-medium flex flex-wrap">
            {format(date, "MMMM d")}
          </div>
          <div className="text-[#2E3032] text-[17px] font-medium flex flex-wrap">
            {format(date, "h:mma")}
          </div>
        </div>
      );
    },
  },
];
