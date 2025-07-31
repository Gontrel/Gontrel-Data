'use client'
import React from 'react'
import { AdminRoleEnum, AnalystTableTabsEnum, ManagerTableTabsEnum } from '@/types/enums'
import { ManagerTableTabs } from './ManagerTableTabs';
import { AnalystTableTabs } from './AnalystTableTabs';

interface TableTabsProps {
  view: AdminRoleEnum;
  activeTab: ManagerTableTabsEnum | AnalystTableTabsEnum;
  tableTotals: Record<ManagerTableTabsEnum | AnalystTableTabsEnum, number>;
  handleTabChange: (tab: ManagerTableTabsEnum | AnalystTableTabsEnum) => void;
}

const TableTabs = ({ view, activeTab, tableTotals, handleTabChange }: TableTabsProps) => {
  return (
    view === AdminRoleEnum.ANALYST ? (
      <AnalystTableTabs
        activeTab={activeTab as AnalystTableTabsEnum}
        onTabChange={handleTabChange}
        tableTotals={tableTotals}
      />
    ) : (
      <ManagerTableTabs
        activeTab={activeTab as ManagerTableTabsEnum}
        onTabChange={handleTabChange}
        tableTotals={tableTotals}
      />
    )
  )
}

export default TableTabs