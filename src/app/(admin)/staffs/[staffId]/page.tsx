"use client";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import AccountSummaryCard from "@/components/staffs/AccountSummaryCard";
import StaffActivities from "@/components/staffs/StaffActivities";
import StaffProfileCard from "@/components/staffs/StaffProfileCard";
import { PAGE_SIZE } from "@/constants";
import { AuditLog } from "@/interfaces";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { DateRangeValue } from "@/utils/dateRange";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ActivityType } from "@/types";
import StaffDetailsSkeleton from "@/components/Loader/staffs/staffDetails";

const StaffDetails = ({ params }: { params: Promise<{ staffId: string }> }) => {
  const { staffId } = use(params);
  const utils = trpc.useContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [comment, setComment] = useState<string>("");
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(
    undefined
  );

  const {
    data: staffProfileData,
    refetch: refetchStaffProfile,
    isLoading: isLoadingStaffProfile,
  } = trpc.staffs.getStaffProfile.useQuery({
    adminId: staffId,
  });

  const {
    data: staffAccountSummaryData,
    refetch: refetchStaffAccountSummary,
    isLoading: isLoadingStaffAccountSummary,
  } = trpc.staffs.getStaffsAccountSummary.useQuery(
    {
      adminId: staffId,
    },
    { enabled: !!staffId }
  );

  const { mutate } = trpc.staffs.toggleStaffStatus.useMutation({
    onSuccess: () => {
      successToast("Staff status updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      errorToast(error.message);
    },
  });

  const fetchActivities = useCallback(
    async (pageNumber: number, filtersChanged = false) => {
      if (isFetching || (!hasMore && !filtersChanged)) return;

      setIsFetching(true);
      try {
        const startDateString = dateRange?.startDate
          ? format(dateRange.startDate, "yyyy-MM-dd")
          : undefined;
        const endDateString = dateRange?.endDate
          ? format(dateRange.endDate, "yyyy-MM-dd")
          : undefined;

        const response = await utils.staffs.getStaffActivities.fetch({
          adminId: staffId,
          quantity: PAGE_SIZE,
          pageNumber,
          type: activityType,
          startDate: startDateString,
          endDate: endDateString,
        });

        const activityData: AuditLog[] = response?.data ?? [];

        if (activityData.length < PAGE_SIZE) {
          setHasMore(false);
        }

        if (filtersChanged) {
          setActivity(activityData);
        } else {
          setActivity((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newActivities = activityData.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prev, ...newActivities];
          });
        }
      } catch (error) {
        console.error("Failed to fetch staff activities:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [
      isFetching,
      hasMore,
      staffId,
      utils.staffs.getStaffActivities,
      dateRange,
      activityType,
    ]
  );

  const handleDeactivateStaff = () => {
    setConfirmationModalOpen(true);
  };

  const isStaffActive = staffProfileData?.isActive ?? false;

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    setPage(1);
    setActivity([]);
    setHasMore(true);
  }, [dateRange, activityType]);

  useEffect(() => {
    fetchActivities(page);
  }, [page, fetchActivities]);

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const toggleStaffActivation = useCallback(async () => {
    mutate({ adminId: staffId, comment: comment });
  }, [staffId, comment, mutate]);

  const handleConfirmation = useCallback(() => {
    toggleStaffActivation();
    setConfirmationModalOpen(false);
    refetchStaffProfile();
    refetchStaffAccountSummary();

    fetchActivities(1, true);
  }, [
    refetchStaffProfile,
    toggleStaffActivation,
    refetchStaffAccountSummary,
    fetchActivities,
  ]);

  if (isLoadingStaffProfile && isLoadingStaffAccountSummary && isFetching) {
    return <StaffDetailsSkeleton />;
  }

  return (
    <div className="p-6 bg-[#FAFAFA] h-screen">
      <div className="flex gap-[77px] items-start">
        <div className="flex-1 max-w-[475px] mt-[35px] space-y-10">
          <StaffProfileCard
            id={staffProfileData?.id ?? ""}
            name={staffProfileData?.name ?? ""}
            role={staffProfileData?.role ?? ""}
            email={staffProfileData?.email ?? ""}
            phone={staffProfileData?.phoneNumber || ""}
            address={staffProfileData?.address || ""}
            isStaffActive={isStaffActive || false}
            profileImage={
              staffProfileData?.profileImage || "/images/avatar.png"
            }
          />

          <AccountSummaryCard
            restaurantsCreated={staffAccountSummaryData?.totalLocations || 0}
            restaurantsApproved={
              staffAccountSummaryData?.approvedLocations || 0
            }
            videosCreated={staffAccountSummaryData?.totalPosts || 0}
            videosApproved={staffAccountSummaryData?.approvedPosts || 0}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Staff's Activities */}
          <StaffActivities
            onDeactivateStaff={handleDeactivateStaff}
            activitiesData={activity}
            onScroll={handleScroll}
            isFetching={isFetching}
            scrollContainerRef={scrollContainerRef}
            isStaffActive={isStaffActive}
            dateRange={dateRange}
            hasMore={hasMore}
            onDateRangeChange={setDateRange}
            activityType={activityType}
            onActivityTypeChange={setActivityType}
          />
        </div>
      </div>

      {/* Staff Deactivation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseModal}
        title={`${isStaffActive ? "Deactivate staff?" : "Re-activate staff?"}`}
        description={`${
          isStaffActive
            ? "Are you sure you want to deactivate this staff?"
            : "Are you sure you want to re-activate this staff?"
        }`}
        comment={isStaffActive ? comment : ""}
        showCommentField={isStaffActive ? true : false}
        onCommentChange={handleCommentChange}
        onConfirm={handleConfirmation}
        confirmLabel={`${
          isStaffActive ? "Deactivate staff" : "Re-activate staff"
        }`}
        commentPlaceholder="Add reason here"
        commentLabel="Reason"
        successButtonClassName={`w-full h-18 text-white rounded-[20px] transition-colors text-[20px] font-semibold ${
          isStaffActive ? "bg-[#D80000]" : "bg-[#0070F3]"
        }`}
      />
    </div>
  );
};

export default StaffDetails;
