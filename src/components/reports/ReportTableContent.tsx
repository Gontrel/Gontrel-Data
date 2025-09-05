"use client";

import { ReportTableTabsEnum } from "@/types";

import ReportedVideoTable from "./tables/ReportedVideo";

interface ReportTableContentProps {
  activeTab: ReportTableTabsEnum;
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  reportStatus?: string;
  tablePageNumbers: Record<ReportTableTabsEnum, number>;
  tablePageSizes: Record<ReportTableTabsEnum, number>;
  onPageChange: (tab: ReportTableTabsEnum, page: number) => void;
  onPageSizeChange: (tab: ReportTableTabsEnum, pageSize: number) => void;
}

export const ReportTableContent = ({ 
    activeTab, 
    searchTerm, 
    startDate, 
    endDate, 
    reportStatus,
    tablePageNumbers,
    tablePageSizes,
    onPageChange,
    onPageSizeChange
}: ReportTableContentProps) => {



  if (activeTab === ReportTableTabsEnum.REPORTED_VIDEOS) {
    return (
          <ReportedVideoTable
            searchTerm={searchTerm}
            startDate={startDate}
            reportStatus={reportStatus}
            endDate={endDate}
            currentPage={tablePageNumbers[ReportTableTabsEnum.REPORTED_VIDEOS]}
            pageSize={tablePageSizes[ReportTableTabsEnum.REPORTED_VIDEOS]}
            handleCurrentPage={(page: number) =>
              onPageChange(ReportTableTabsEnum.REPORTED_VIDEOS, page)
            }
            handlePageSize={(pageSize: number) =>
              onPageSizeChange(ReportTableTabsEnum.REPORTED_VIDEOS, pageSize)
            }
          />
    );
  }

  return null;
};
