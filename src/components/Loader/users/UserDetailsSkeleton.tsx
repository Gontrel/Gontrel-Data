"use client";
import React from "react";

const shimmer = "animate-pulse bg-gray-200";

const UserDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-[#FAFAFA] h-screen">
      <div className="flex gap-[77px] items-start">
        {/* Left column skeleton */}
        <div className="flex-1 max-w-[475px] mt-[35px] space-y-10">
          <div className={`rounded-[30px] shadow p-6 h-[406px] bg-white`}>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full ${shimmer}`} />
              <div className="flex-1 min-w-0">
                <div className={`h-4 w-40 mb-3 rounded ${shimmer}`} />
                <div className={`h-6 w-56 rounded ${shimmer}`} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className={`h-10 rounded ${shimmer}`} />
              <div className={`h-10 rounded ${shimmer}`} />
              <div className={`h-10 rounded ${shimmer}`} />
            </div>
          </div>

          <div className={`bg-white p-6 rounded-[30px] shadow-sm h-[301px]`}>
            <div className={`h-6 w-44 mb-6 rounded ${shimmer}`} />
            <div className="grid grid-cols-2 gap-4">
              <div className={`h-16 rounded ${shimmer}`} />
              <div className={`h-16 rounded ${shimmer}`} />
              <div className={`h-16 rounded ${shimmer}`} />
              <div className={`h-16 rounded ${shimmer}`} />
            </div>
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="flex-1 min-w-0 bg-white rounded-lg shadow p-6">
          <div className={`h-10 w-full mb-4 rounded ${shimmer}`} />
          <div className={`h-10 w-full mb-4 rounded ${shimmer}`} />
          <div className="space-y-3" style={{ maxHeight: "calc(100vh - 300px)" }}>
            <div className={`h-[620px] rounded ${shimmer}`} />
            <div className={`h-[620px] rounded ${shimmer}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
