'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type DashboardGridProps = {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
  cols = 12,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
      style={{
        '--dashboard-grid-cols': cols,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default DashboardGrid;
