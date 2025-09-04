"use client";

import React from "react";
import { DropdownFilter } from "../ui/DropdownFilter";
import { statusOptions } from "@/constants";
import Icon from "../svgs/Icons";

interface ITableHeaderCard {
  title?: string;
  viewFullTable?: string;
  onDateChange: (status: string | undefined) => void;
  selectDateRange: string;
}

export const TableHeaderCard = ({
  title,
  selectDateRange,
  viewFullTable,
  onDateChange,
}: ITableHeaderCard) => {
  // Status icon
  const statusIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
  return (
    <aside className="flex justify-evenly items-center w-full">
      <div className="">
        {title && (
          <p className="text-base lg:text-2xl md:text-2xl text-[#2E3032] font-semibold">
            {title}
          </p>
        )}
      </div>
      <DropdownFilter
        options={statusOptions}
        value={selectDateRange}
        onChange={onDateChange}
        placeholder="Last 7 days"
        icon={statusIcon}
        className="w-48"
      />
      {viewFullTable && (
        <div className=" flex gap-2.5">
          <Icon name="expandIcon" stroke="#24B314" />{" "}
          <p className="text-base font-semibold text-[#2E3032]">
            {viewFullTable}
          </p>
        </div>
      )}
    </aside>
  );
};
