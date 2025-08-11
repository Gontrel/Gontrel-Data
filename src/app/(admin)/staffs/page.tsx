import React from "react";

/**
 * Staffs page
 */
const StaffsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Staffs coming soon!</h1>
    </div>
  );
};

export default StaffsPage;

// const StaffsPage = () => {
//   return (
//     <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
//       {/* Restaurant Stats */}
//       <StatsGrid stats={DEFAULT_RESTAURANT_STATS} />

//       {/* Table Tabs */}
//       <TableTabs
//         view={view}
//         activeTab={activeTab}
//         tableTotals={tableTotals}
//         handleTabChange={handleTabChange}
//       />

//       {/* Search and Actions */}
//       <ActionPanel
//         searchTerm={currentTabState.searchTerm}
//         onSearchChange={handleSearch}
//         onAddRestaurant={handleAddRestaurant}
//         selectedAnalyst={currentTabState.selectedAnalyst}
//         onAnalystChange={handleAnalystChange}
//         selectedDateRange={currentTabState.dateRange}
//         onDateRangeChange={handleDateRangeChange}
//         showFilters={true}
//         analystOptions={analystOptions}
//       />

//       {/* Table Content */}
//       <TableContent
//         activeTab={activeTab}
//         searchTerm={currentTabState.searchTerm}
//         selectedAnalyst={currentTabState.selectedAnalyst}
//         startDate={startDate}
//         endDate={endDate}
//         tablePageNumbers={createPageNumbersObject()}
//         tablePageSizes={createPageSizesObject()}
//         onPageChange={handlePageChange}
//         onPageSizeChange={handlePageSizeChange}
//       />
//     </div>
//   );
// };
