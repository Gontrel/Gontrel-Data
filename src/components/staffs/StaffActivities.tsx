"use client";

import React from "react";
import Icon from "../svgs/Icons";
import ActivityItem from "./ActivityItem";
import DateRangeFilter from "../filters/DateRangeFilter";
import { AuditLog } from "@/interfaces";
import { cn } from "@/lib/utils";

interface StaffActivitiesProps {
  activitiesData: AuditLog[];
  onDeactivateStaff: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isStaffActive: boolean;
}

const StaffActivities: React.FC<StaffActivitiesProps> = ({
  activitiesData,
  onDeactivateStaff,
  onScroll,
  scrollContainerRef,
  isStaffActive,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-l-sm p-6 w-full pl-[34px]">
      <div className="flex items-center justify-between mb-4 bg-[#FAFAFA] h-[80px] w-full">
        <h2 className="text-lg text-[#2E3032] font-medium">
          Staff&apos;s activities
        </h2>
        <button
          className={cn(
            " text-white px-4 py-2 rounded-lg flex items-center gap-2",
            isStaffActive
              ? "bg-[#FDE6E6] border-[#F35454] hover:bg-[#FDE6E6]/90 text-[#D80000]"
              : "bg-[#E6F7FF] border-[#0070F3] hover:bg-[#E6F7FF]/90 text-[#0070F3]"
          )}
          onClick={onDeactivateStaff}
        >
          <Icon name={isStaffActive ? "blockIcon" : "saveIcon"} />
          <span className="text-base font-semibold leading-[100%]">
            {isStaffActive ? "Deactivate staff" : "Reactivate staff"}
          </span>
        </button>
      </div>

      <section className="flex justify-between">
        <div className="w-48 p-2 border border-[#D9D9D9] flex flex-row items-center justify-between rounded-lg text-gray-500">
          <span>All activities</span>
          <Icon name="arrowdownIcon" stroke="#0070F3" width={15} height={15} />
        </div>
        <DateRangeFilter
          value={{ startDate: new Date(), endDate: new Date() }}
          onChange={() => {}}
          placeholder="All Time"
          className="min-w-[280px]"
        />
      </section>

      {/* This is the container for the ActivityItems that will scroll */}
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="mt-6 h-[500px] flex-grow overflow-y-auto space-y-6"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <h3 className="text-[20px] font-semibold text-[#2E3032]">July 2025</h3>
        {activitiesData.length > 0 ? (
          activitiesData.map((activity) => (
            <ActivityItem
              key={activity.id}
              type={activity.type}
              content={activity.content}
              timestamp={activity.createdAt}
              restaurant={activity.adminLocation}
              post={activity.adminPost}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No activities to display.</p>
        )}
      </div>
    </div>
  );
};

export default StaffActivities;
