import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';
import PendingRestaurants from './PendingRestaurants';
import PendingVideos from './PendingVideos';
import React from 'react'; // Added missing import for React

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
 * Renders the appropriate table based on the active tab
 */
export const TableContent: React.FC<TableContentProps> = ({
  activeTab,
  searchTerm,
  tablePageNumbers,
  tablePageSizes,
  onPageChange,
  onPageSizeChange
}) => {
  const renderActiveRestaurants = () => (
    <ActiveRestaurantsPlaceholder onTotal={() => {}} />
  );

  const renderPendingRestaurants = () => (
    <PendingRestaurants
      searchTerm={searchTerm}
      currentPage={tablePageNumbers[ManagerTableTabsEnum.PENDING_RESTAURANTS]}
      pageSize={tablePageSizes[ManagerTableTabsEnum.PENDING_RESTAURANTS]}
      handleCurrentPage={(page) => onPageChange(ManagerTableTabsEnum.PENDING_RESTAURANTS, page)}
      handlePageSize={(pageSize) => onPageSizeChange(ManagerTableTabsEnum.PENDING_RESTAURANTS, pageSize)}
    />
  );

  const renderPendingVideos = () => (
    <PendingVideos
      searchTerm={searchTerm}
      currentPage={tablePageNumbers[ManagerTableTabsEnum.PENDING_VIDEOS]}
      pageSize={tablePageSizes[ManagerTableTabsEnum.PENDING_VIDEOS]}
      handleCurrentPage={(page) => onPageChange(ManagerTableTabsEnum.PENDING_VIDEOS, page)}
      handlePageSize={(pageSize) => onPageSizeChange(ManagerTableTabsEnum.PENDING_VIDEOS, pageSize)}
    />
  );

  return (
    <div className="w-full">
      {activeTab === ManagerTableTabsEnum.ACTIVE_RESTAURANTS && renderActiveRestaurants()}
      {activeTab === ManagerTableTabsEnum.PENDING_RESTAURANTS && renderPendingRestaurants()}
      {activeTab === ManagerTableTabsEnum.PENDING_VIDEOS && renderPendingVideos()}
    </div>
  );
};