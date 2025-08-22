"use client";

import React from "react";
import Icon from "../svgs/Icons";
import { ActivityType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";

interface ActivityTypeFilterProps {
  value: ActivityType | undefined;
  onChange: (type: ActivityType | undefined) => void;
}

const activityTypeOptions = [
  { value: undefined, label: "All activities" },
  { value: ActivityType.POST, label: "Posts" },
  { value: ActivityType.LOCATION, label: "Locations" },
  { value: ActivityType.APPROVAL, label: "Approvals" },
  { value: ActivityType.PASSWORD, label: "Password" },
];

const ActivityTypeFilter: React.FC<ActivityTypeFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-48 p-2 border border-[#D9D9D9] flex flex-row items-center justify-between rounded-lg text-gray-500 cursor-pointer">
          <span>
            {activityTypeOptions.find((opt) => opt.value === value)?.label ||
              "All activities"}
          </span>
          <Icon name="arrowdownIcon" stroke="#0070F3" width={10} height={10} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white rounded-[20px] border-[1px] px-[12px] py-4 border-[#D2D4D5] shadow-lg">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(val: string) => onChange(val as ActivityType)}
        >
          {activityTypeOptions.map((option) => (
            <DropdownMenuRadioItem
              key={option.label}
              value={option.value || ""}
              className="px-2 my-1 cursor-pointer flex items-center justify-start rounded-lg hover:bg-[#E6F1FE] hover:text-[#0070F3]"
            >
              <span className="w-full">{option.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActivityTypeFilter;
