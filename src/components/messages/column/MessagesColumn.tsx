import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { TABLE_COLUMN_SIZES } from "@/constants";

// ----------------------------------------------------------------------------
// Table columns definition

type MessagePlatform = "Android" | "iOS" | "Android & iOS" | "Web";

type MessageType = "Push notification" | "In-App notification" | "Email";

export interface MessageRow {
  id: string;
  title: string;
  preview: string;
  type: MessageType;
  platform: MessagePlatform;
  date: string; // ISO string
}

/**
 * Returns the column definitions for the messages table.
 * @param onRowClick Optional callback when a row is clicked.
 */

export const MessagesColumn = (
  onRowClick?: (row: MessageRow) => void
): ColumnDef<MessageRow>[] => [
  {
    accessorKey: "title",
    header: "Message", // combined title + preview
    cell: ({ row }) => {
      const handleClick = () => onRowClick?.(row.original as MessageRow);
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick?.(row.original as MessageRow);
        }
      };
      return (
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className="flex flex-col py-3"
        >
          <div className="text-[#181D1F] font-semibold text-[17px]">{`⚡ ${row.original.title}`}</div>
          <div className="text-[#6B7280] text-[15px] truncate max-w-[520px]">
            {row.original.preview}
          </div>
        </div>
      );
    },
    minSize: TABLE_COLUMN_SIZES.NAME,
    meta: { sticky: true },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {row.original.type}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.VIDEO,
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {row.original.platform}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.WEBSITE,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-left text-[17px] font-medium">
        {formatDate(new Date(row.original.date))}
      </div>
    ),
    minSize: TABLE_COLUMN_SIZES.DATE_ADDED,
  },
];
