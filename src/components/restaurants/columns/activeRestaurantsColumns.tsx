import { ColumnDef } from "@tanstack/react-table";
import { ActiveRestaurantType } from "@/types/restaurant";
import { MapPin, Link as LinkIcon, Calendar, Flame, Video } from "lucide-react";
import { TableHeader } from "./utils";
import Image from "next/image";
import { format } from "date-fns";
import Icon from "@/components/svgs/Icons";
import logo from "@/assets/images/logo.png";


export const createActiveRestaurantsColumns = (
): ColumnDef<ActiveRestaurantType>[] => [
  {
    accessorKey: "name",
    header: () => <TableHeader title="Restaurant name" />,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center gap-3.5">
          <div className="flex flex-row items-center">
            <div>
              <div className="font-medium flex flex-wrap text-[17px] leading-[100%] text-[#2E3032] cursor-pointer">
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
        <p className=" text-[17px] font-medium">{row.original?.address?.address}</p>
          <Icon name="websiteLinkIcon" />

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
        {row.original?.posts?.length || 0}
      </div>
    ),
  },
  {
    accessorKey: "addedBy",
    header: () => <TableHeader icon={Calendar} title="Added by" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-row">
            <Image
              src={row.original.admin.profileImage ?? logo} // placeholder is needed.
              alt={row.original?.admin?.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-[17px] flex flex-wrap font-medium">
              {row.original.admin.name}
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
      const date = new Date(row.original?.createdAt);
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
