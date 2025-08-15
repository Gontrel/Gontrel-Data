'use client';

interface StatsCardProps {
  label: string;
  value: string | number;
  className?: string;
  loading?: boolean;
}

/**
 * Reusable stats card component for displaying metrics
 */
export function StatsCard({
  label,
  value,
  className = '',
  loading = false
}: StatsCardProps) {
  if (loading) {
    return (
      <div className={`flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-0 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-0 ${className}`}>
      <p className="text-lg font-semibold text-[#8A8A8A]">{label}</p>
      <p className="text-3xl text-black font-semibold">{value}</p>
    </div>
  );
}