"use client";

import React, { useMemo, useCallback } from "react";
import { GenericTable } from "@/components/tables/GenericTable";
import { createBlockedUsersColumns } from "../columns/blockedUsersColumns";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/interfaces";
import { useRouter } from "next/navigation";

interface BlockedUsersProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  startDate?: string;
  endDate?: string;
}

const BlockedUsers: React.FC<BlockedUsersProps> = ({
  searchTerm,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  startDate,
  endDate,
}) => {
  const { queryData, isLoading } = useUsers({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    blocked: true,
  });

  const data = useMemo(() => queryData?.data ?? [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = useMemo(
    () => Math.ceil((paginationData?.total || 0) / pageSize),
    [paginationData?.total, pageSize]
  );

  const router = useRouter();
  const handleOnRowClick = useCallback(
    (row: User) => {
      if (row?.id) router.push(`/users/${row.id}`);
    },
    [router]
  );

  const columns = useMemo(
    () => createBlockedUsersColumns(handleOnRowClick),
    [handleOnRowClick]
  );

  return (
    <GenericTable<User>
      data={data}
      loading={isLoading}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageSizeChange={onPageSizeChange}
      onPageChange={(pageIndex) => onPageChange(pageIndex + 1)}
    />
  );
};

export default BlockedUsers;
