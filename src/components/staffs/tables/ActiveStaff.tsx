import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// External dependencies
import { GenericTable } from "@/components/tables/GenericTable";
import { createActiveStaffColumns } from "../columns/activeStaffColumns";

// Store and API
import { useActiveStaffs } from "@/hooks/useActiveStaffs";
import { useActiveStaffsStore } from "@/stores/tableStore"; // Assuming a new store for staff tables

// Types and enums
import { StaffTableTypes } from "@/types/user"; // Assuming StaffTableTypes is defined in user.ts

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ActiveStaffProps {
  searchTerm: string;
  selectedAnalyst?: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing active staff
 */
const ActiveStaff = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: ActiveStaffProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { setSelectedRows } = useActiveStaffsStore();

  const { queryData, isLoading } = useActiveStaffs({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    // adminId:
    //   selectedAnalyst && selectedAnalyst !== "all"
    //     ? selectedAnalyst
    //     : undefined,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOnRowClick = useCallback(
    (selectedRows: StaffTableTypes): void => {
      const staffId = selectedRows.id;
      router.push(`/staffs/${staffId}`); // Assuming staff details page route
    },
    [router]
  );

  const handleRowSelection = useCallback(
    (selectedRows: StaffTableTypes[]) => {
      const selectedIds = selectedRows.map((row) => row.id);
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const staff = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const columns = useMemo(
    () => createActiveStaffColumns(handleOnRowClick),
    [handleOnRowClick]
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <GenericTable<StaffTableTypes>
      data={staff}
      loading={isLoading}
      onRowSelect={handleRowSelection}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default ActiveStaff;
