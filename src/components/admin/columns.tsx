"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ActiveRestaurantType } from "@/types/restaurant";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import placeholder from "@/assets/images/placeholder.svg";
import { TrendEnum } from "@/types";

export const columns: ColumnDef<ActiveRestaurantType>[] = [
  {
    accessorKey: "name",
    header: "Restaurant name",
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center gap-3">
          {/* <Image
            src={restaurant.image || placeholder}
            alt={restaurant.name}
            width={40}
            height={40}
            className="rounded-lg"
          /> */}
          <div>
            <div className="font-semibold">{restaurant.name}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => (
      <Link
        href={row.original.website}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        View website
      </Link>
    ),
  },
  {
    accessorKey: "totalVideos",
    header: "Total videos",
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: ({ row }) => {
      const trend = row.original.trend;
      let trendClass = "";
      if (trend === TrendEnum.POPULAR_SEARCHES) {
        trendClass = "bg-blue-100 text-blue-800";
      } else if (trend === TrendEnum.TRENDING_TIKTOK) {
        trendClass = "bg-purple-100 text-purple-800";
      } else {
        trendClass = "bg-gray-100 text-gray-800";
      }
      return (
        <span className={`px-2 py-1 rounded-full ${trendClass}`}>{trend}</span>
      );
    },
  },
  {
    accessorKey: "addedBy",
    header: "Added by",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.addedBy.profileImage || placeholder}
          alt={row.original.addedBy.name || "Profile image"}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{row.original.addedBy.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];
