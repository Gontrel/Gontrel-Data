import Skeleton from "antd/es/skeleton/Skeleton";

const StaffDetailsSkeleton = () => {
  return (
    <div className="p-6 bg-[#FAFAFA] h-screen animate-pulse">
      <div className="flex gap-[77px] items-start">
        {/* Left Column Skeleton */}
        <div className="flex-1 max-w-[475px] mt-[35px] space-y-10">
          <div className="p-6 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Account Summary Card Skeleton */}
          <div className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
            <Skeleton className="w-1/2 h-6 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                <Skeleton className="w-1/3 h-5" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                <Skeleton className="w-1/3 h-5" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                <Skeleton className="w-1/3 h-5" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <div className="p-4 space-y-2 bg-gray-50 rounded-md">
                <Skeleton className="w-1/3 h-5" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 p-6 bg-white border rounded-lg shadow-sm">
          {/* Activities Header Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          <div className="flex gap-4 my-4">
            <Skeleton className="w-48 h-10 rounded-md" />
            <Skeleton className="w-48 h-10 rounded-md" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 pt-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsSkeleton;
