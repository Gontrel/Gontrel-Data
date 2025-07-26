"use client";

import { Bell, UserCircle, ChevronDown, Plus } from "lucide-react";
import { Column, Pie } from "@ant-design/charts";
import { Button } from "@/components/ui/Button";

const Dashboard = () => {
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <p className="text-gray-500">You can manage all restaurants here</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
                3
              </span>
            </div>
            <UserCircle size={24} />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Restaurant
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Total restaurants</h3>
          <p className="text-3xl font-bold">3.5k</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Active restaurants</h3>
          <p className="text-3xl font-bold">3.5k</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Pending restaurants</h3>
          <p className="text-3xl font-bold">3.5k</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Pending Videos</h3>
          <p className="text-3xl font-bold">3.5k</p>
        </div>
      </div>
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
          <Pie
            data={pieData}
            angleField="value"
            colorField="type"
            radius={0.8}
            height={300}
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
      </div>
    </div>
  );
};

export default Dashboard;
