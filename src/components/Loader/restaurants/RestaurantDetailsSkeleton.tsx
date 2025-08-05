"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { Plus } from "lucide-react";

export const RestaurantDetailsSkeleton = () => {
  return (
    <div className="bg-gray-50 p-8 relative">
      {/* Left Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Restaurant Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Skeleton className="h-5 w-[120px] mb-4" />
            <div className="flex justify-between text-center">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-8 mx-auto mb-2" />
                  <Skeleton className="h-4 w-[80px] mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-8 border-b">
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[120px]" />
            </div>
            <Skeleton className="h-10 w-[120px] flex items-center justify-center">
              <Plus className="opacity-0" size={16} />
            </Skeleton>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Scrollable Content Area */}
          <div
            className="flex-grow overflow-y-auto pr-2"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
