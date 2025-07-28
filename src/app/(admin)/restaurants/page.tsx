"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/admin/SearchBar";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { ManagerTableTabs } from "@/constant/table";
import PendingRestaurants from "@/components/restaurants/PendingRestaurants";
import PendingVideos from "@/components/restaurants/PendingVideos";
import ActiveRestaurants from "@/components/restaurants/ActiveRestaurants";
import { NewRestaurantSheet } from "@/components/restaurants/NewRestaurantSheet";
import { PreviewVideoModal } from "@/components/restaurants/PreviewVideoModal";
import { useVideoStore } from "@/stores/videoStore";

/**
 * Restaurants Page
 */
export default function RestaurantsPage() {
  const { activeVideoUrl, setActiveVideoUrl } = useVideoStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ManagerTableTabs>(
    ManagerTableTabs.ACTIVE_RESTAURANTS
  );
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);
  const [tablePageNumbers, setTablePageNumbers] = useState<
    Record<ManagerTableTabs, number>
  >({
    [ManagerTableTabs.ACTIVE_RESTAURANTS]: 1,
    [ManagerTableTabs.PENDING_RESTAURANTS]: 1,
    [ManagerTableTabs.PENDING_VIDEOS]: 1,
  });

  const [tablePageSizes, setTablePageSizes] = useState<
    Record<ManagerTableTabs, number>
  >({
    [ManagerTableTabs.ACTIVE_RESTAURANTS]: 10,
    [ManagerTableTabs.PENDING_RESTAURANTS]: 10,
    [ManagerTableTabs.PENDING_VIDEOS]: 10,
  });

  const setTablePageNumber = (tab: ManagerTableTabs, page: number): void => {
    if (typeof page !== "number" || !Number.isInteger(page) || page < 1) {
      console.error(`Invalid page number: ${page} for tab: ${tab}`);
      return;
    }
    setTablePageNumbers((prev) => ({
      ...prev,
      [tab]: page,
    }));
  };

  const handlePreviewModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
    }
  };

  const setTablePageSize = (tab: ManagerTableTabs, pageSize: number): void => {
    if (
      typeof pageSize !== "number" ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 50
    ) {
      console.error(`Invalid page size: ${pageSize} for tab: ${tab}`);
      return;
    }
    setTablePageSizes((prev) => ({
      ...prev,
      [tab]: pageSize,
    }));

    setTablePageNumber(tab, 1);
  };


  const activeTabStyles = 'text-[#0070F3] border-b-4 border-[#0070F3] font-semibold';
  const inactiveTabStyles = 'text-[#8A8A8A]';



  // TODO: Stats data - this could come from the API
  const statsData = [
    {
      label: "Total restaurants",
      value: "3.5k",
    },
    {
      label: "Total active restaurants",
      value: "3.2k",
    },
    {
      label: "Pending restaurants",
      value: "300",
    },
    {
      label: "Inactive restaurants",
      value: "150",
    },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const renderContent = () => {
    switch (activeTab) {
      case ManagerTableTabs.ACTIVE_RESTAURANTS:
        return (
          <ActiveRestaurants
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabs.ACTIVE_RESTAURANTS]}
            pageSize={tablePageSizes[ManagerTableTabs.ACTIVE_RESTAURANTS]}
            handleCurrentPage={(page) =>
              setTablePageNumber(ManagerTableTabs.ACTIVE_RESTAURANTS, page)
            }
            handlePageSize={(pageSize) =>
              setTablePageSize(ManagerTableTabs.ACTIVE_RESTAURANTS, pageSize)
            }
          />
        );
      case ManagerTableTabs.PENDING_RESTAURANTS:
        return (
          <PendingRestaurants
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabs.PENDING_RESTAURANTS]}
            pageSize={tablePageSizes[ManagerTableTabs.PENDING_RESTAURANTS]}
            handleCurrentPage={(page) =>
              setTablePageNumber(ManagerTableTabs.PENDING_RESTAURANTS, page)
            }
            handlePageSize={(pageSize) =>
              setTablePageSize(ManagerTableTabs.PENDING_RESTAURANTS, pageSize)
            }
          />
        );
      case ManagerTableTabs.PENDING_VIDEOS:
        return (
          <PendingVideos
            searchTerm={searchTerm}
            currentPage={tablePageNumbers[ManagerTableTabs.PENDING_VIDEOS]}
            pageSize={tablePageSizes[ManagerTableTabs.PENDING_VIDEOS]}
            handleCurrentPage={(page) =>
              setTablePageNumber(ManagerTableTabs.PENDING_VIDEOS, page)
            }
            handlePageSize={(pageSize) =>
              setTablePageSize(ManagerTableTabs.PENDING_VIDEOS, pageSize)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handlePreviewModalOpenChange}
      />
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full relative z-0">
        {/* Restaurant Stats */}
        <StatsGrid stats={statsData} />

        {/* Table Tabs */}
        <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5 overflow-x-auto">
          <div className="flex items-center gap-x-7.5 min-w-0">
            <button
              className={`text-lg font-medium py-3 px-2.5 whitespace-nowrap ${
                activeTab === ManagerTableTabs.ACTIVE_RESTAURANTS
                  ? activeTabStyles
                  : inactiveTabStyles
              }`}
              onClick={() => setActiveTab(ManagerTableTabs.ACTIVE_RESTAURANTS)}
            >
              Active restaurants
            </button>
            <button
              className={`text-lg font-medium py-3 px-2.5 whitespace-nowrap ${
                activeTab === ManagerTableTabs.PENDING_RESTAURANTS
                  ? activeTabStyles
                  : inactiveTabStyles
              }`}
              onClick={() => setActiveTab(ManagerTableTabs.PENDING_RESTAURANTS)}
            >
              Pending restaurants
            </button>
            <button
              className={`text-lg font-medium py-3 px-2.5 whitespace-nowrap ${
                activeTab === ManagerTableTabs.PENDING_VIDEOS
                  ? activeTabStyles
                  : inactiveTabStyles
              }`}
              onClick={() => setActiveTab(ManagerTableTabs.PENDING_VIDEOS)}
            >
              Pending videos
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              className="bg-[#0070F3] text-white px-3 py-4 rounded-[10px] hover:bg-[#0070F3] transition-colors w-full sm:w-auto"
              title="Submit for approval"
              onClick={() => setShowNewRestaurantModal(true)}
            >
              <span className="flex items-center gap-2 justify-center">
                <Plus className="w-6 h-6" />
                Add Restaurant
              </span>
            </button>
          </div>
        </div>

        {/* Restaurant Table */}
        <div className="w-full">
          {activeTab === ManagerTableTabs.ACTIVE_RESTAURANTS && (
            <ActiveRestaurants
              searchTerm={searchTerm}
              currentPage={
                tablePageNumbers[ManagerTableTabs.ACTIVE_RESTAURANTS]
              }
              pageSize={tablePageSizes[ManagerTableTabs.ACTIVE_RESTAURANTS]}
              handleCurrentPage={(page) =>
                setTablePageNumber(ManagerTableTabs.ACTIVE_RESTAURANTS, page)
              }
              handlePageSize={(pageSize) =>
                setTablePageSize(ManagerTableTabs.ACTIVE_RESTAURANTS, pageSize)
              }
            />
          )}
          {activeTab === ManagerTableTabs.PENDING_RESTAURANTS && (
            <PendingRestaurants
              searchTerm={searchTerm}
              currentPage={
                tablePageNumbers[ManagerTableTabs.PENDING_RESTAURANTS]
              }
              pageSize={tablePageSizes[ManagerTableTabs.PENDING_RESTAURANTS]}
              handleCurrentPage={(page) =>
                setTablePageNumber(ManagerTableTabs.PENDING_RESTAURANTS, page)
              }
              handlePageSize={(pageSize) =>
                setTablePageSize(ManagerTableTabs.PENDING_RESTAURANTS, pageSize)
              }
            />
          )}
          {activeTab === ManagerTableTabs.PENDING_VIDEOS && (
            <PendingVideos
              searchTerm={searchTerm}
              currentPage={tablePageNumbers[ManagerTableTabs.PENDING_VIDEOS]}
              pageSize={tablePageSizes[ManagerTableTabs.PENDING_VIDEOS]}
              handleCurrentPage={(page) =>
                setTablePageNumber(ManagerTableTabs.PENDING_VIDEOS, page)
              }
              handlePageSize={(pageSize) =>
                setTablePageSize(ManagerTableTabs.PENDING_VIDEOS, pageSize)
              }
            />
          )}
        </div>
      </div>

      {/* New Restaurant Modal */}
      <NewRestaurantSheet
        open={showNewRestaurantModal}
        onOpenChange={setShowNewRestaurantModal}
      />

    </div>
  );
}
