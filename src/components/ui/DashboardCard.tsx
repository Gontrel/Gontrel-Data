'use client';


import React from 'react';
import { cn } from '@/lib/utils';

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className,
  title,
  action,
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardCard;
