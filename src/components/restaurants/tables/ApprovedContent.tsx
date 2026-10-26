import React, { useMemo } from "react";
import { GenericTable } from "@/components/tables/GenericTable";
import { useApprovedContent } from "@/hooks/useApprovedContent";
import {
  createApprovedContentColumns,
  ApprovedContentTableType,
} from "../columns/approvedContentColumns";

interface ApprovedContentProps {
  searchTerm: string;
  selectedAnalyst?: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

const ApprovedContent = ({
  searchTerm,
  selectedAnalyst,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: ApprovedContentProps) => {
  const { queryData, isLoading } = useApprovedContent({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    adminId: selectedAnalyst || undefined,
  });

  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const contentData: ApprovedContentTableType[] = useMemo(() => {
    const data = queryData?.data || [];
    return data.map((item) => ({
      id: item.location?.id || item.id,
      name: item.location?.name || item.name,
      admin: item.admin,
      location: item.location || item,
      postCount: item.postCount,
      createdAt: item.location?.createdAt || item.createdAt,
      address: item.location?.address || item.address,
      menu: item.location?.menu || item.menu,
      reservation: item.location?.reservation || item.reservation,
    }));
  }, [queryData?.data]);

  const columns = useMemo(() => createApprovedContentColumns(), []);

  return (
    <div>
      <GenericTable<ApprovedContentTableType>
        data={contentData}
        loading={isLoading}
        showSelection={false}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageSizeChange={handlePageSize}
        onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
      />
    </div>
  );
};

export default ApprovedContent;
