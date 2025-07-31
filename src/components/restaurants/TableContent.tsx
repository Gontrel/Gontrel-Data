import { AnalystTableTabsEnum, ManagerTableTabsEnum } from '@/types';
import PendingRestaurants from './tables/PendingRestaurants';
import PendingVideos from './tables/PendingVideos';
import React from 'react'; // Added missing import for React
import ActiveRestaurants from './tables/ActiveRestaurants';
import SubmittedRestaurants from './tables/SubmittedRestaurants';
import SubmittedVideos from './tables/SubmittedVideos';

/**
 * Props for TableContent component
 */
interface TableContentProps {
  activeTab: ManagerTableTabsEnum | AnalystTableTabsEnum;
  searchTerm: string;
  tablePageNumbers: Record<ManagerTableTabsEnum | AnalystTableTabsEnum, number>;
  tablePageSizes: Record<ManagerTableTabsEnum | AnalystTableTabsEnum, number>;
  onPageChange: (tab: ManagerTableTabsEnum | AnalystTableTabsEnum, page: number) => void;
  onPageSizeChange: (tab: ManagerTableTabsEnum | AnalystTableTabsEnum, pageSize: number) => void;
}

/**
 * Table Content Component
 */
export const TableContent: React.FC<TableContentProps> = ({
  activeTab,
  searchTerm,
  tablePageNumbers,
  tablePageSizes,
  onPageChange,
  onPageSizeChange
}) => {
  const renderTableContent = (): React.ReactNode => {
    switch (activeTab) {
      case ManagerTableTabsEnum.ACTIVE_RESTAURANTS || AnalystTableTabsEnum.ACTIVE_RESTAURANTS:
        return (
          <ActiveRestaurants
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]}
            pageSize={tablePageSizes[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]}
            handleCurrentPage={(page: number) =>
              onPageChange(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, pageSize)
            }
          />
        );
      case ManagerTableTabsEnum.PENDING_RESTAURANTS:
        return (
          <PendingRestaurants
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabsEnum.PENDING_RESTAURANTS]}
            pageSize={tablePageSizes[ManagerTableTabsEnum.PENDING_RESTAURANTS]}
            handleCurrentPage={(page: number) =>
              onPageChange(ManagerTableTabsEnum.PENDING_RESTAURANTS, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(ManagerTableTabsEnum.PENDING_RESTAURANTS, pageSize)
            }
          />
        );
      case ManagerTableTabsEnum.PENDING_VIDEOS:
        return (
          <PendingVideos
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabsEnum.PENDING_VIDEOS]}
            pageSize={tablePageSizes[ManagerTableTabsEnum.PENDING_VIDEOS]}
            handleCurrentPage={(page: number) =>
              onPageChange(ManagerTableTabsEnum.PENDING_VIDEOS, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(ManagerTableTabsEnum.PENDING_VIDEOS, pageSize)
            }
          />
        );
      case AnalystTableTabsEnum.SUBMITTED_RESTAURANTS:
        return (
          <SubmittedRestaurants
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]}
            handleCurrentPage={(page: number) =>
              onPageChange(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, page)
            }
            pageSize={tablePageSizes[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]}
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, pageSize)
            }
          />
        );
      case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
        return (
          <SubmittedVideos
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[AnalystTableTabsEnum.SUBMITTED_VIDEOS]}
            handleCurrentPage={(page: number) =>
              onPageChange(AnalystTableTabsEnum.SUBMITTED_VIDEOS, page)
            }
            pageSize={tablePageSizes[AnalystTableTabsEnum.SUBMITTED_VIDEOS]}
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(AnalystTableTabsEnum.SUBMITTED_VIDEOS, pageSize)
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

  return (
    <div className="w-full">
      {renderTableContent()}
    </div>
  );
};