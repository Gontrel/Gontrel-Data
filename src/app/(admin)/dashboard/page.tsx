"use client";
import { ChevronDown } from "lucide-react";
import { Column, Pie } from "@ant-design/charts";
import { StatsGrid } from "@/components/ui/StatsGrid";
import ActiveRestaurants from "@/components/restaurants/tables/ActiveRestaurants";

export default function DashboardPage() {
  const barData = [
    { day: "Mon", value: 190, type: "TikTok sourced" },
    { day: "Mon", value: 160, type: "User-generated" },
    { day: "Tue", value: 120, type: "TikTok sourced" },
    { day: "Tue", value: 290, type: "User-generated" },
    { day: "Wed", value: 280, type: "TikTok sourced" },
    { day: "Wed", value: 130, type: "User-generated" },
    { day: "Thu", value: 280, type: "TikTok sourced" },
    { day: "Thu", value: 20, type: "User-generated" },
    { day: "Fri", value: 210, type: "TikTok sourced" },
    { day: "Fri", value: 0, type: "User-generated" },
    { day: "Sat", value: 360, type: "TikTok sourced" },
    { day: "Sat", value: 0, type: "User-generated" },
    { day: "Sun", value: 210, type: "TikTok sourced" },
    { day: "Sun", value: 0, type: "User-generated" },
  ];

  const pieData = [
    { type: "Active", value: 27 },
    { type: "Pending", value: 25 },
    { type: "Inactive", value: 18 },
  ];

  const config = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height: 300,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  // TODO: Stats data - this could come from the API
  const statsData = [
    {
      label: 'Total restaurants',
      value: '3.5k'
    },
    {
      label: 'Total active restaurants',
      value: '3.2k'
    },
    {
      label: 'Pending restaurants',
      value: '300'
    },
    {
      label: 'Inactive restaurants',
      value: '150'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">

        {/* Restaurant Stats */}
        <StatsGrid stats={statsData} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Content type</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                    User-generated
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    TikTok sourced
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                Last 7 days
                <ChevronDown size={16} />
              </div>
            </div>
            <Column
              data={barData}
              isStack={true}
              xField="day"
              yField="value"
              seriesField="type"
              color={["#60a5fa", "#a855f7"]}
              height={300}
              legend={false}
              columnStyle={{
                radius: [4, 4, 0, 0],
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Restaurant Status</h3>
            {config && <Pie {...config} />}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ActiveRestaurants
            searchTerm=""
            currentPage={1}
            handleCurrentPage={() => { }}
            pageSize={5}
            handlePageSize={() => { }}
          />
        </div>
      </div>
    </div>
  );
};
