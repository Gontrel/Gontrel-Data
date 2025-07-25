'use client';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Predefined width values for consistent skeleton rendering
 */
const skeletonWidths = [
  '120px', '180px', '140px', '160px', '200px',
  '150px', '170px', '130px', '190px', '110px',
  '220px', '160px', '140px', '180px', '200px',
  '130px', '170px', '150px', '190px', '120px'
];

/**
 * Reusable table loading skeleton component
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  className = ''
}: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-2xl">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(rows)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                {[...Array(columns)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 rounded"
                    style={{
                      width: skeletonWidths[(i * columns + j) % skeletonWidths.length]
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}