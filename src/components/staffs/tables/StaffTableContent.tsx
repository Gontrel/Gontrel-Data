import ActiveRestaurants from "@/components/restaurants/tables/ActiveRestaurants";
import PendingRestaurants from "@/components/restaurants/tables/PendingRestaurants";
import PendingVideos from "@/components/restaurants/tables/PendingVideos";
import SubmittedRestaurants from "@/components/restaurants/tables/SubmittedRestaurants";
import SubmittedVideos from "@/components/restaurants/tables/SubmittedVideos";
import {
  ManagerTableTabsEnum,
  AnalystTableTabsEnum,
  StaffTableTabsEnum,
} from "@/types";

/**
 * Props for TableContent component
 */
interface StaffTableContentProps {
  activeTab: StaffTableTabsEnum;
  searchTerm: string;
  selectedAnalyst?: string;
  startDate?: string;
  endDate?: string;
  tablePageNumbers: Record<StaffTableTabsEnum, number>;
  tablePageSizes: Record<StaffTableTabsEnum, number>;
  onPageChange: (tab: StaffTableTabsEnum, page: number) => void;
  onPageSizeChange: (tab: StaffTableTabsEnum, pageSize: number) => void;
}

/**
 * Table Content Component
 */
export const StaffTableContent: React.FC<StaffTableContentProps> = ({
  activeTab,
  searchTerm,
  selectedAnalyst,
  startDate,
  endDate,
  tablePageNumbers,
  tablePageSizes,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderTableContent = (): React.ReactNode => {
    switch (activeTab) {
      case StaffTableTabsEnum.ACTIVE_STAFF:
        return (
          <ActiveRestaurants
            searchTerm={searchTerm}
            selectedAnalyst={selectedAnalyst}
            startDate={startDate}
            endDate={endDate}
            currentPage={tablePageNumbers[StaffTableTabsEnum.ACTIVE_STAFF]}
            pageSize={tablePageSizes[StaffTableTabsEnum.ACTIVE_STAFF]}
            handleCurrentPage={(page: number) =>
              onPageChange(StaffTableTabsEnum.ACTIVE_STAFF, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(StaffTableTabsEnum.ACTIVE_STAFF, pageSize)
            }
          />
        );
      case StaffTableTabsEnum.BLOCKED_STAFF:
        return (
          <PendingRestaurants
            searchTerm={searchTerm}
            selectedAnalyst={selectedAnalyst}
            startDate={startDate}
            endDate={endDate}
            currentPage={
              tablePageNumbers[ManagerTableTabsEnum.PENDING_RESTAURANTS]
            }
            pageSize={tablePageSizes[ManagerTableTabsEnum.PENDING_RESTAURANTS]}
            handleCurrentPage={(page: number) =>
              onPageChange(ManagerTableTabsEnum.PENDING_RESTAURANTS, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(
                ManagerTableTabsEnum.PENDING_RESTAURANTS,
                pageSize
              )
            }
          />
        );
      default:
        // Fallback for unknown tab
        return (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Unknown table tab selected.
          </div>
        );
    }
  };

  return <div className="w-full">{renderTableContent()}</div>;
};
