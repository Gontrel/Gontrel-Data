import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// External dependencies
import { GenericTable } from "@/components/tables/GenericTable";
import { createDeactivatedStaffColumns } from "../column/deactivatedStaffColumns";

// Store and API
import { useDeactivatedStaffs } from "@/hooks/useDeactivatedStaffs";
import { useDeactivatedStaffsStore } from "@/stores/tableStore";

// Types and enums
import { StaffTableTypes } from "@/types/user";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface DeactivatedStaffProps {
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
 * Component for displaying and managing deactivated staff
 */
const DeactivatedStaff = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: DeactivatedStaffProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { setSelectedRows } = useDeactivatedStaffsStore();

  const { queryData, isLoading } = useDeactivatedStaffs({
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
    () => createDeactivatedStaffColumns(handleOnRowClick),
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

export default DeactivatedStaff;
