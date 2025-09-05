"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ActiveRestaurantTableTypes } from "@/types/restaurant";
import { TABLE_COLUMN_SIZES } from "@/constants";
import { TableHeader } from "@/components/restaurants/columns/utils";

export const TopPerformingVideoColumn =
  (): ColumnDef<ActiveRestaurantTableTypes>[] => [
    {
      accessorKey: "name",
      header: () => <TableHeader title="Restaurant" />,
      cell: ({ row }) => {
        return (
          <div
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
      accessorKey: "Views",
      header: () => <TableHeader iconName="videoIcon" title="Views" />,
      cell: ({ row }) => (
        <div className="text-center text-[17px] font-medium">
          {row.original.videos.total}
        </div>
      ),
      minSize: TABLE_COLUMN_SIZES.VIDEO,
    },
  ];
