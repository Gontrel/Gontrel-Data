// "use client";

// import AddStaffModal from "@/components/modals/AddStaffModal";
// import { StaffActionPanel } from "@/components/staffs/StaffActionPanel";
// import { StaffTableContent } from "@/components/staffs/StaffTableContent";
// import { StaffTableTabs } from "@/components/staffs/StaffTableTabs";
// import { StatsGrid } from "@/components/ui/StatsGrid";
// import { useTableTotals } from "@/hooks/useTableTotals";
// import { useTabState } from "@/hooks/useTabState";
// import { trpc } from "@/lib/trpc-client";
// import { useCurrentUser } from "@/stores/authStore";
// import {
//   AdminRoleEnum,
//   ReportTableTabsEnum,
//   StaffTableTabsEnum,
//   StatsData,
// } from "@/types";
// import { rangeToYmd, DateRangeValue } from "@/utils/dateRange";
// import { useState, useEffect, useCallback } from "react";

// export default function Reports() {
//   const currentUser = useCurrentUser();

//   const [view, setView] = useState<AdminRoleEnum | null>(null);
//   const [showAddStaffModal, setShowAddStaffModal] = useState(false);

//   const initialTab: ReportTableTabsEnum = ReportTableTabsEnum.REPORTED_VIDEOS;

//   const [activeTab, setActiveTab] = useState<ReportTableTabsEnum>(initialTab);

//   useEffect(() => {
//     if (currentUser?.role && !view) {
//       setView(currentUser.role);
//     }
//   }, [currentUser?.role, view]);

//   const { data: dataStats, isLoading: statsIsLoading } =
//     trpc.staffs.getStaffsStats.useQuery();

//   const {
//     tabStates,
//     updateTabSearchTerm,
//     updateTabDateRange,
//     updateTabPage,
//     updateTabPageSize,
//     getTabState,
//   } = useTabState();

//   const tableTotals = useTableTotals(tabStates);

//   // Current tab's state
//   const currentTabState = getTabState(activeTab);
//   const { startDate, endDate } = rangeToYmd(currentTabState.dateRange);

//   /**
//    * Creates page numbers object for all tabs
//    */
//   const createPageNumbersObject = useCallback(
//     () => ({
//       [ReportTableTabsEnum.REPORTED_VIDEOS]:
//         tabStates[ReportTableTabsEnum.REPORTED_VIDEOS].currentPage,
//       [ReportTableTabsEnum.REPORTED_USERS]:
//         tabStates[ReportTableTabsEnum.REPORTED_USERS].currentPage,
//     }),
//     [tabStates]
//   );

//   /**
//    * Creates page sizes object for all tabs
//    */
//   const createPageSizesObject = useCallback(
//     () => ({
//       [ReportTableTabsEnum.REPORTED_VIDEOS]:
//         tabStates[ReportTableTabsEnum.REPORTED_VIDEOS].pageSize,
//       [ReportTableTabsEnum.REPORTED_USERS]:
//         tabStates[ReportTableTabsEnum.REPORTED_USERS].pageSize,
//     }),
//     [tabStates]
//   );

//   /**
//    * Handles search term changes for the active tab
//    */
//   const handleSearch = useCallback(
//     (term: string) => {
//       updateTabSearchTerm(activeTab, term);
//     },
//     [activeTab, updateTabSearchTerm]
//   );

//   /**
//    * Handles time period filter changes for the active tab
//    */
//   const handleDateRangeChange = useCallback(
//     (range: DateRangeValue | undefined) => {
//       updateTabDateRange(activeTab, range);
//     },
//     [activeTab, updateTabDateRange]
//   );

//   const handleAddStaff = useCallback(() => {
//     setShowAddStaffModal(true);
//   }, [setShowAddStaffModal]);

//   const handlePageChange = useCallback(
//     (tab: ReportTableTabsEnum, page: number) => {
//       updateTabPage(tab, page);
//     },
//     [updateTabPage]
//   );

//   /**
//    * Handles page size change for any tab
//    */
//   const handlePageSizeChange = useCallback(
//     (tab: ReportTableTabsEnum, pageSize: number) => {
//       updateTabPageSize(tab, pageSize);
//     },
//     [updateTabPageSize]
//   );

//   /**
//    * Handles tab change with state preservation
//    */
//   const handleTabChange = useCallback((tab: ReportTableTabsEnum) => {
//     setActiveTab(tab);
//   }, []);

//   return (
//     <div className="min-h-screen relative bg-[#FAFAFA]">
//       {/* Main Content */}
//       <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
//         {/* Staff Stats - Placeholder for now */}

//         {/* Table Tabs */}
//         <StaffTableTabs
//           activeTab={activeTab}
//           tableTotals={tableTotals}
//           onTabChange={handleTabChange}
//         />

//         {/* Search and Actions */}
//         <StaffActionPanel
//           searchTerm={currentTabState.searchTerm}
//           onSearchChange={handleSearch}
//           onAddStaff={handleAddStaff}
//           selectedDateRange={currentTabState.dateRange}
//           onDateRangeChange={handleDateRangeChange}
//         />

//         {/* Table Content */}
//         <StaffTableContent
//           activeTab={activeTab}
//           searchTerm={currentTabState.searchTerm}
//           selectedAnalyst={currentTabState.selectedAnalyst}
//           startDate={startDate}
//           endDate={endDate}
//           tablePageNumbers={createPageNumbersObject()}
//           tablePageSizes={createPageSizesObject()}
//           onPageChange={handlePageChange}
//           onPageSizeChange={handlePageSizeChange}
//         />
//       </div>
//     </div>
//   );
// }
