"use client";

import React, { useEffect, useState } from "react";
import Icon from "../svgs/Icons";
import ActivityItem from "./ActivityItem";
import DateRangeFilter from "../filters/DateRangeFilter";
import { AuditLog } from "@/interfaces";
import { cn } from "@/lib/utils";
import { DateRangeValue } from "@/utils/dateRange";
import { ActivityType } from "@/types";
import ActivityTypeFilter from "../filters/activityFilter";

interface StaffActivitiesProps {
  activitiesData: AuditLog[];
  onDeactivateStaff: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isStaffActive: boolean;
  isFetching: boolean;
  dateRange: DateRangeValue | undefined;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  hasMore: boolean;
  onActivityTypeChange: (type: ActivityType | undefined) => void;
  activityType: ActivityType | undefined;
}

const StaffActivities: React.FC<StaffActivitiesProps> = ({
  activitiesData,
  onDeactivateStaff,
  onScroll,
  scrollContainerRef,
  isStaffActive,
  dateRange,
  isFetching,
  onDateRangeChange,
  hasMore,
  onActivityTypeChange,
  activityType,
}) => {
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    });
    setCurrentMonth(formatter.format(today));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-l-sm p-6">
      <div className="flex items-center justify-between mb-4 bg-[#FAFAFA] h-[80px]">
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
        <ActivityTypeFilter
          value={activityType}
          onChange={onActivityTypeChange}
        />
        <DateRangeFilter
          value={dateRange}
          onChange={onDateRangeChange}
          placeholder="All Time"
          className="min-w-[280px]"
        />
      </section>

      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="mt-6 flex-grow overflow-y-auto space-y-6"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-semibold text-[#2E3032]">
            {currentMonth}
          </h3>
          <div className="text-[20px] font-semibold text-[#2E3032]">
            {activitiesData.length} activities
          </div>
        </div>

        {activitiesData.length > 0 ? (
          <>
            {activitiesData.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                content={activity.content}
                timestamp={activity.createdAt}
                restaurant={activity.adminLocation}
                post={activity.adminPost}
              />
            ))}
            {isFetching ? (
              <p className="text-center text-gray-500 my-4">Loading more...</p>
            ) : (
              !hasMore && (
                <p className="text-center text-gray-500 my-4">
                  No more activities
                </p>
              )
            )}
          </>
        ) : isFetching ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <p className="text-center text-gray-500">No activities to display.</p>
        )}
      </div>
    </div>
  );
};

export default StaffActivities;
