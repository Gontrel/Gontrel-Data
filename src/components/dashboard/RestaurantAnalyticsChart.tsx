"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Card } from "antd";
import { useState } from "react";
import { CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { BarChartCard } from "../charts/BarChartCard";

interface IRestaurantAnalyticsChartProps {
  title?: string;
  showLegend?: boolean;
  data: { name: string; [key: string]: string | number }[];
  bars: BarConfig[];
  filters?: { label: string; key: "daily" | "weekly" | "monthly" }[];
}

type BarConfig = {
  dataKey: string;
  color?: string;
  stackId?: string;
  name?: string;
};

const RestaurantAnalyticsChart = ({
  title = "Restaurant Sales",
  data,
  showLegend,
  bars,
  filters = [
    { label: "Today", key: "daily" },
    { label: "Last 7 days", key: "weekly" },
    { label: "Last 30 days", key: "monthly" },
  ],
}: IRestaurantAnalyticsChartProps) => {
  const [filter, setFilter] = useState(filters[1]);

  return (
    <Card className="w-full h-[450px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="lg:text-2xl sm:text-xl text-2xl text-[#2E3032] font-semibold">
          {title}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              {filter?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filters?.map((f) => (
              <DropdownMenuItem key={f.key} onClick={() => setFilter(f)}>
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="h-[350px]">
        <BarChartCard
          title="Sales Breakdown"
          data={data}
          bars={bars}
          showLegend={showLegend}
        />
      </CardContent>
    </Card>
  );
};

export default RestaurantAnalyticsChart;
