import {
  AnalystTableTabsEnum,
  ApprovalStatusEnum,
  ManagerTableTabsEnum,
  ReportTableTabsEnum,
  StaffTableTabsEnum,
} from "@/types/enums";
import { usePendingRestaurants } from "./usePendingRestaurants";
import { usePendingVideos } from "./usePendingVideos";
import { useActiveRestaurants } from "./useActiveRestaurants";
import { useSubmittedRestaurants } from "./useSubmittedRestaurants";
import { useSubmittedVideos } from "./useSubmittedVideos";
import { useActiveStaffs } from "./useActiveStaffs";
import { useDeactivatedStaffs } from "./useDeactivatedStaffs";
import { TabState } from "@/interfaces";
import { usePendingUserVideos } from "./usePendingUserVideos";
import { useActiveVideos } from "./useActiveVideos";
import { useReportedUsers } from "./useReportedUsers";
import { useReportedVideos } from "./useReportedVideos";

/**
 * Custom hook to fetch table totals for each tab independently using tRPC
 */
export const useTableTotals = (
  tabStates: Record<
    ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum,
    TabState
  >
) => {
  // Fetch pending restaurants total with tab-specific search
  const { queryData: pendingRestaurantsTotal } = usePendingRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm || "",
    startDate:
      tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
    adminId:
      tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.selectedAnalyst ||
      undefined,
  });

  // Fetch pending videos total with tab-specific search
  const { queryData: pendingUserVideosTotal } = usePendingUserVideos({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS]?.searchTerm || "",
    startDate:
      tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
    userId:
      tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS]?.selectedAnalyst ||
      undefined,
  });

  // Fetch pending videos total with tab-specific search
  const { queryData: pendingVideosTotal } = usePendingVideos({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm || "",
    startDate:
      tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
    adminId:
      tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.selectedAnalyst ||
      undefined,
  });

  const { queryData: activeVideosTotal } = useActiveVideos({
    currentPage: 1,
    pageSize: 10,
    videoStatus:
      tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS]?.videoStatus || undefined,
    searchTerm: tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS]?.searchTerm || "",
    startDate:
      tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
    adminId:
      tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS]?.selectedAnalyst ||
      undefined,
  });

  // Fetch active restaurants total with tab-specific search
  const { queryData: activeRestaurantsTotal } = useActiveRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm || "",
    startDate:
      tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
  });

  // Fetch submitted restaurants total with tab-specific search (for analysts)
  const { queryData: submittedRestaurantsTotal } = useSubmittedRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.searchTerm || "",
    startDate:
      tabStates[
        AnalystTableTabsEnum.SUBMITTED_RESTAURANTS
      ]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
  });

  // Fetch submitted videos total with tab-specific search (for analysts)
  const { queryData: submittedVideosTotal } = useSubmittedVideos({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.searchTerm || "",
    startDate:
      tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
  });

  // Fetch active staffs total with tab-specific search
  const { queryData: activeStaffsTotal } = useActiveStaffs({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[StaffTableTabsEnum.ACTIVE_STAFF]?.searchTerm || "",
    startDate:
      tabStates[StaffTableTabsEnum.ACTIVE_STAFF]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[StaffTableTabsEnum.ACTIVE_STAFF]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
  });

  // Fetch deactivated staffs total with tab-specific search
  const { queryData: deactivatedStaffsTotal } = useDeactivatedStaffs({
    currentPage: 1,
    pageSize: 1,
    searchTerm:
      tabStates[StaffTableTabsEnum.DEACTIVATED_STAFF]?.searchTerm || "",
    startDate:
      tabStates[StaffTableTabsEnum.DEACTIVATED_STAFF]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[StaffTableTabsEnum.DEACTIVATED_STAFF]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
  });

  const { queryData: reportedVideosTotal } = useReportedVideos({
    status: tabStates[ReportTableTabsEnum.REPORTED_VIDEOS]?.status ?? undefined,
    currentPage: 1,
    pageSize: 10,
    searchTerm: tabStates[ReportTableTabsEnum.REPORTED_VIDEOS]?.searchTerm || "",
    startDate:
      tabStates[ReportTableTabsEnum.REPORTED_VIDEOS]?.dateRange?.startDate
        ?.toISOString()
        .split("T")[0] || undefined,
    endDate:
      tabStates[ReportTableTabsEnum.REPORTED_VIDEOS]?.dateRange?.endDate
        ?.toISOString()
        .split("T")[0] || undefined,
    adminId:
      tabStates[ReportTableTabsEnum.REPORTED_VIDEOS]?.selectedAnalyst ||
      undefined,
  });


  // Extract totals from tRPC responses
  const getTotalFromResponse = (response: unknown): number => {
    if (!response || typeof response !== "object") return 0;

    const responseObj = response as Record<string, unknown>;

    // Handle different response structures
    if (responseObj.pagination && typeof responseObj.pagination === "object") {
      const pagination = responseObj.pagination as Record<string, unknown>;
      if (typeof pagination.total === "number") {
        return pagination.total;
      }
    }

    if (typeof responseObj.total === "number") {
      return responseObj.total;
    }

    if (responseObj.data && Array.isArray(responseObj.data)) {
      return responseObj.data.length;
    }

    return 0;
  };

  const pendingRestaurantsCount = getTotalFromResponse(pendingRestaurantsTotal);
  const pendingVideosCount = getTotalFromResponse(pendingVideosTotal);
  const activeVideosCount = getTotalFromResponse(activeVideosTotal);
  const activeRestaurantsCount = getTotalFromResponse(activeRestaurantsTotal);
  const submittedRestaurantsCount = getTotalFromResponse(
    submittedRestaurantsTotal
  );
  const submittedVideosCount = getTotalFromResponse(submittedVideosTotal);
  const activeStaffsCount = getTotalFromResponse(activeStaffsTotal);
  const deactivatedStaffsCount = getTotalFromResponse(deactivatedStaffsTotal);
  const pendingUserVideosCount = getTotalFromResponse(pendingUserVideosTotal);
  const reportedVideosCount = getTotalFromResponse(reportedVideosTotal);

  return {
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: activeRestaurantsCount,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: pendingRestaurantsCount,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: pendingVideosCount,
    [ManagerTableTabsEnum.ACTIVE_VIDEOS]: activeVideosCount,
    [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: submittedRestaurantsCount,
    [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: submittedVideosCount,
    [StaffTableTabsEnum.ACTIVE_STAFF]: activeStaffsCount,
    [StaffTableTabsEnum.DEACTIVATED_STAFF]: deactivatedStaffsCount,
    [ManagerTableTabsEnum.PENDING_USER_VIDEOS]: pendingUserVideosCount,
    [ReportTableTabsEnum.REPORTED_VIDEOS]: reportedVideosCount
  };
};
