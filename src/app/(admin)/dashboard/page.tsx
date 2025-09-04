"use client";

import React, { useState } from "react";
import DashboardGrid from "@/components/ui/DashboardGrid";
import IntentSelectorCard from "@/components/dashboard/IntentSelectorCard";
import { IChartData, IPieConfig } from "@/components/charts/PieTwoAngleChart";
import MetricCard from "@/components/ui/MetricCard";
import { TIconNames } from "@/components/svgs/IconNames";
import RestaurantAnalyticsChart from "@/components/dashboard/RestaurantAnalyticsChart";
import TopPerformingRestaurant from "@/components/dashboard/TopPerformingRestaurant";
import ActiveRestaurants from "@/components/restaurants/tables/ActiveRestaurants";
import LineChart from "@/components/charts/LineChart";
import MapComponent from "@/components/dashboard/MapComponent";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (status: string | undefined) => {
    const today = new Date();
    let calculatedStartDate = "";
    const calculatedEndDate = today.toISOString().split("T")[0];

    if (status === "last7days") {
      const last7Days = new Date();
      last7Days.setDate(today.getDate() - 7);
      calculatedStartDate = last7Days.toISOString().split("T")[0];
    }
    // Add other date range cases here (e.g., 'last30days', 'last90days')

    setStartDate(calculatedStartDate);
    setEndDate(calculatedEndDate);
  };
  const metricCards = [
    {
      title: "Total posts",
      value: "2,420",
      change: 18,
      iconName: "restaurantIcon" as TIconNames,
      iconBackgroundColor: "#FFE1CF",
    },

    {
      title: "Total restaurants",
      value: "1,210",
      change: 12,
      iconName: "restaurantIcon" as TIconNames,
      iconBackgroundColor: "#FFE6FD",
    },
    {
      title: "Total users",
      value: "316",
      change: 8,
      iconName: "personIcon3" as TIconNames,
      iconBackgroundColor: "#E6F9E6",
    },
    {
      title: "New users today",
      value: "56",
      change: 5,
      iconName: "restaurantIcon" as TIconNames,
      iconBackgroundColor: "#E6F1FE",
    },
  ];

  const salesData = [
    { name: "Mon", food: 400, drinks: 240, dessert: 0 },
    { name: "Tue", food: 300, drinks: 139, dessert: 0 },
    { name: "Wed", food: 200, drinks: 980, dessert: 0 },
    { name: "Thu", food: 278, drinks: 390, dessert: 0 },
    { name: "Fri", food: 189, drinks: 480, dessert: 0 },
    { name: "Sat", food: 0, drinks: 0, dessert: 0 },
    { name: "Sun", food: 0, drinks: 0, dessert: 0 },
  ];

  const barConfig = [
    { dataKey: "food", color: "#3B82F6", stackId: "stack1", name: "Food" },
    { dataKey: "drinks", color: "#10B981", stackId: "stack1", name: "Drinks" },
    { dataKey: "dessert", color: "#F59E0B", name: "Dessert" },
  ];
  const salesData2 = [
    { name: "Mon", food: 400, drinks: 0, dessert: 0 },
    { name: "Tue", food: 300, drinks: 0, dessert: 0 },
    { name: "Wed", food: 200, drinks: 0, dessert: 0 },
    { name: "Thu", food: 278, drinks: 0, dessert: 0 },
    { name: "Fri", food: 189, drinks: 0, dessert: 0 },
    { name: "Sat", food: 0, drinks: 0, dessert: 0 },
    { name: "Sun", food: 0, drinks: 0, dessert: 0 },
  ];

  const barConfig2 = [
    { dataKey: "food", color: "#3B82F6", name: "Food" },
    { dataKey: "drinks", color: "#10B981", name: "Drinks" },
    { dataKey: "dessert", color: "#F59E0B", name: "Dessert" },
  ];

  // Pie Chart Data
  const chartData: IChartData[] = [
    { name: "Just Browsing", value: 2000 },
    { name: "Planning for an Occasion", value: 100 },
    { name: "Hungry Right Now", value: 200 },
  ];
  const chartColors = ["#0070F3", "#DCC619", "#CB19BA"];
  const pieConfigs: IPieConfig[] = [
    { cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 3 },
  ];

  const MOCK_FEATURE_DATA = [
    { name: "Search", value: 100, color: "#2563EB" },
    { name: "Explore", value: 30, color: "#FACC15" },
    { name: "Newly Added", value: 34, color: "#EC4899" }, // Pink
    { name: "Near You", value: 50, color: "#10B981" }, // Green
  ];

  const handleDateRangeChange = (range: string) => {
    console.log("Date range selected:", range);
  };

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA]">
      {/* Metric Cards */}
      <DashboardGrid
        cols={4}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metricCards?.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </DashboardGrid>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RestaurantAnalyticsChart
          title="Content type"
          data={salesData}
          bars={barConfig}
          showLegend={false}
        />

        <IntentSelectorCard
          title="Intent Selector"
          data={chartData}
          colors={chartColors}
          pieConfigs={pieConfigs}
        />
      </section>

      {/* <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformingRestaurant
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          selectDateRange={""}
          currentPage={1}
          pageSize={5}
        />
      </section> */}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <ActiveRestaurants
          searchTerm=""
          currentPage={1}
          handleCurrentPage={() => {}}
          pageSize={5}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          handlePageSize={function (pageSize: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title={"Most used features"}
          data={MOCK_FEATURE_DATA}
          onDateRangeChange={handleDateRangeChange}
        />

        <RestaurantAnalyticsChart
          title="New users chart"
          data={salesData2}
          bars={barConfig2}
          showLegend={false}
        />
      </section>

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RestaurantAnalyticsChart
          title="Average Video Watch Time"
          data={salesData2}
          bars={barConfig2}
          showLegend={false}
        />
        <RestaurantAnalyticsChart
          title="Average Time Spent On App Per User"
          data={salesData2}
          bars={barConfig2}
          showLegend={false}
        />
      </section>

      {/* Charts Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title={"Top Searches"}
          data={MOCK_FEATURE_DATA}
          onDateRangeChange={handleDateRangeChange}
        />

        <RestaurantAnalyticsChart
          title="Average Time Spent On App Per User"
          data={salesData2}
          bars={barConfig2}
          showLegend={false}
        />
      </section>

      <section className="mt-2">
        <MapComponent />
      </section>
    </div>
  );
}
