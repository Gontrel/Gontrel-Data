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
  totalActivities: number;
  onDeactivateStaff: () => void;
  openChangeRoleModal: () => void;
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
  totalActivities,
  onDeactivateStaff,
  onScroll,
  scrollContainerRef,
  isStaffActive,
  dateRange,
  isFetching,
  onDateRangeChange,
  hasMore,
  openChangeRoleModal,
  onActivityTypeChange,
  activityType,
}) => {
  const [currentMonth, setCurrentMonth] = useState("");
  const activityItemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  // Format date to month string
  const formatMonth = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    });
    return formatter.format(date);
  };

  // Calculate month from first activity (latest)
  useEffect(() => {
    if (activitiesData.length > 0) {
      const firstActivity = activitiesData[0];
      if (firstActivity?.createdAt) {
        try {
          const date = new Date(firstActivity.createdAt);
          if (!isNaN(date.getTime())) {
            const monthString = formatMonth(date);
            console.log("Setting month from first activity:", monthString, "Date:", firstActivity.createdAt);
            setCurrentMonth(monthString);
          } else {
            console.log("Invalid date:", firstActivity.createdAt);
          }
        } catch (error) {
          console.error("Error parsing date:", error, firstActivity.createdAt);
        }
      } else {
        console.log("First activity has no createdAt:", firstActivity);
      }
    } else {
      console.log("No activities data available");
    }
  }, [activitiesData]);

  // Handle scroll to detect month changes
  const handleScrollWithMonthDetection = (
    e: React.UIEvent<HTMLDivElement>
  ) => {
    onScroll(e);

    // Throttle month updates to avoid excessive re-renders
    if (!scrollContainerRef.current || activitiesData.length === 0) return;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const viewportCenter = scrollTop + containerHeight / 2;

      // Find the activity item closest to the viewport center
      let closestActivity: AuditLog | null = null;
      let closestDistance = Infinity;

      for (const activity of activitiesData) {
        const element = activityItemRefs.current.get(activity.id);
        if (!element) continue;

        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const elementCenter = elementTop + elementHeight / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        // Only consider elements that are at least partially visible
        if (elementTop < scrollTop + containerHeight && elementTop + elementHeight > scrollTop) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestActivity = activity;
          }
        }
      }

      // If no visible activity found, use the first activity (latest)
      if (!closestActivity && activitiesData.length > 0) {
        closestActivity = activitiesData[0];
      }

      // Update month based on the closest visible activity
      if (closestActivity?.createdAt) {
        try {
          const date = new Date(closestActivity.createdAt);
          if (!isNaN(date.getTime())) {
            const monthString = formatMonth(date);
            setCurrentMonth(monthString);
          }
        } catch (error) {
          // Invalid date, skip
        }
      }
    });
  };

  // Set ref callback for activity items
  const setActivityItemRef = (activityId: string) => {
    return (element: HTMLDivElement | null) => {
      if (element) {
        activityItemRefs.current.set(activityId, element);
      } else {
        activityItemRefs.current.delete(activityId);
      }
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-l-sm p-6">
      <div className="flex items-center justify-between mb-4 bg-[#FAFAFA] h-[80px]">
        <h2 className="text-lg text-[#2E3032] font-medium">
          Staff&apos;s activities
        </h2>
        <div className="flex flex-row gap-2">
          <button
            className={cn(
              " text-white px-4 py-2 rounded-lg flex items-center gap-2 bg-[#0070F3]"
            )}
            onClick={openChangeRoleModal}
          >
            <Icon name={"changeRoleIcon"} />
            <span className="text-base font-semibold leading-[100%]">
              Change role
            </span>
          </button>
          <button
            className={cn(
              " text-white px-4 py-2 rounded-lg flex items-center gap-2",
              isStaffActive
                ? " bg-[#D80000] hover:bg-[#FDE6E6]/90 text-white"
                : " bg-[#0070F3] hover:bg-[#E6F7FF]/90 text-white"
            )}
            onClick={onDeactivateStaff}
          >
            <Icon name={isStaffActive ? "blockIcon" : "saveIcon"} />
            <span className="text-base font-semibold leading-[100%]">
              {isStaffActive ? "Deactivate staff" : "Reactivate staff"}
            </span>
          </button>
        </div>
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
        onScroll={handleScrollWithMonthDetection}
        className="mt-6 flex-grow overflow-y-auto space-y-6"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-semibold text-[#2E3032]">
            {currentMonth || (activitiesData.length > 0 ? "Loading..." : "No activities")}
          </h3>
          <div className="text-[20px] font-semibold text-[#2E3032]">
            {totalActivities > 0 ? totalActivities : activitiesData.length}{" "}
            {totalActivities === 1 || activitiesData.length === 1 ? "activity" : "activities"}
          </div>
        </div>

        {activitiesData.length > 0 ? (
          <>
            {activitiesData.map((activity) => (
              <div
                key={activity.id}
                ref={setActivityItemRef(activity.id)}
                data-activity-date={activity.createdAt}
              >
                <ActivityItem
                  type={activity.type}
                  content={activity.content}
                  timestamp={activity.createdAt}
                  restaurant={activity.adminLocation}
                  post={activity.adminPost}
                />
              </div>
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
