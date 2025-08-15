'use client';

import { formatNumber } from '@/lib/utils';
import { StatsCard } from './StatsCard';

interface StatItem {
  label: string;
  value: string | number;
  loading?: boolean;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
  loading?: boolean;
}

/**
 * Responsive grid container for stats cards
 */
export function StatsGrid({
  stats,
  className = '',
  loading = false
}: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
          loading={loading || stat.loading}
        />
      ))}
    </div>
  );
}