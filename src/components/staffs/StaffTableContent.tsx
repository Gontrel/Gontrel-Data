import React from "react";
import { StaffTableTabsEnum } from "@/app/(admin)/staffs/page";
import ActiveStaff from "./tables/ActiveStaff";
import DeactivatedStaff from "./tables/DeactivatedStaff";

/**
 * Props for StaffTableContent component
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
 * Staff Table Content Component
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
          <ActiveStaff
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
      case StaffTableTabsEnum.DEACTIVATED_STAFF:
        return (
          <DeactivatedStaff
            searchTerm={searchTerm}
            selectedAnalyst={selectedAnalyst}
            startDate={startDate}
            endDate={endDate}
            currentPage={tablePageNumbers[StaffTableTabsEnum.DEACTIVATED_STAFF]}
            pageSize={tablePageSizes[StaffTableTabsEnum.DEACTIVATED_STAFF]}
            handleCurrentPage={(page: number) =>
              onPageChange(StaffTableTabsEnum.DEACTIVATED_STAFF, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(StaffTableTabsEnum.DEACTIVATED_STAFF, pageSize)
            }
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Unknown table tab selected.
          </div>
        );
    }
  };

  return <div className="w-full">{renderTableContent()}</div>;
};
