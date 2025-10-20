"use client";
import React from "react";
import Icon from "@/components/svgs/Icons";
import { cn } from "@/lib/utils";

interface UserActionsHeaderProps {
  title: string;
  isActive: boolean;
  onToggle: () => void;
}

const UserActionsHeader: React.FC<UserActionsHeaderProps> = ({ title, isActive, onToggle }) => {
  return (
    <div className="flex items-center justify-between mb-4 bg-[#FAFAFA] h-[80px]">
      <h2 className="text-lg text-[#2E3032] font-medium">{title}</h2>
      <button
        className={cn(
          " text-white px-4 py-2 rounded-lg flex items-center gap-2",
          isActive
            ? "bg-[#FDE6E6] border-[#F35454] hover:bg-[#FDE6E6]/90 text-[#D80000]"
            : "bg-[#E6F7FF] border-[#0070F3] hover:bg-[#E6F7FF]/90 text-[#0070F3]"
        )}
        onClick={onToggle}
      >
        <Icon name={isActive ? "blockIcon" : "saveIcon"} />
        <span className="text-base font-semibold leading-[100%]">
          {isActive ? "Deactivate user" : "unblock user"}
        </span>
      </button>
    </div>
  );
};

export default UserActionsHeader;
