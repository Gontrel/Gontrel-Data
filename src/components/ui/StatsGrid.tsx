"use client";

import { formatNumber } from "@/lib/utils";
import { StatsCard } from "./StatsCard";

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

export function StatsGrid({
  stats,
  className = "lg:grid-cols-4",
  loading = false,
}: StatsGridProps) {
  const displayStats = loading
    ? Array.from({ length: stats.length || 4 }).map(() => ({
        label: "",
        value: "",
        loading: true,
      }))
    : stats;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {displayStats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={
            typeof stat.value === "number"
              ? formatNumber(stat.value)
              : stat.value
          }
          loading={loading || stat.loading}
        />
      ))}
    </div>
  );
}
