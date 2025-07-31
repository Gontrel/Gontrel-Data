import { ManagerTableTabsEnum } from '@/types';
import PendingRestaurants from './PendingRestaurants';
import PendingVideos from './PendingVideos';
import React from 'react'; // Added missing import for React
import ActiveRestaurants from './ActiveRestaurants';

/**
 * Placeholder component for Active Restaurants
 */
const ActiveRestaurantsPlaceholder: React.FC<{ onTotal: (total: number) => void }> = ({ onTotal }) => {
  React.useEffect(() => {
    onTotal(0);
  }, [onTotal]);

  return (
    <div className="flex items-center justify-center h-32 text-gray-500">
      Active Restaurants table coming soon...
    </div>
  );
};

/**
 * Props for TableContent component
 */
interface TableContentProps {
  activeTab: ManagerTableTabsEnum;
  searchTerm: string;
  tablePageNumbers: Record<ManagerTableTabsEnum, number>;
  tablePageSizes: Record<ManagerTableTabsEnum, number>;
  onPageChange: (tab: ManagerTableTabsEnum, page: number) => void;
  onPageSizeChange: (tab: ManagerTableTabsEnum, pageSize: number) => void;
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
      case ManagerTableTabsEnum.ACTIVE_RESTAURANTS:
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