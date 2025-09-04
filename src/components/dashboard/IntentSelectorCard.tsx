"use client";

import { Card } from "antd";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import {
  PieTwoAngleChart,
  IChartData,
  IPieConfig,
} from "../charts/PieTwoAngleChart";
import { CardContent } from "../ui/Card";
import { Button } from "../ui/Button";

interface IntentSelectorCardProps {
  title?: string;
  data: IChartData[];
  colors: string[];
  pieConfigs: IPieConfig[];
  filters?: string[];
}

export default function IntentSelectorCard({
  title = "Intent Selector",
  data,
  colors,
  pieConfigs,
  filters = ["Today", "Last 7 days", "Last 30 days"],
}: IntentSelectorCardProps) {
  const [filter, setFilter] = useState(filters[1]);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="w-full p-4 shadow-sm rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="lg:text-2xl sm:text-xl text-2xl text-[#2E3032] font-semibold">
          {title}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              {filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filters.map((f) => (
              <DropdownMenuItem key={f} onClick={() => setFilter(f)}>
                {f}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart */}
      <CardContent className="flex flex-col items-center">
        <PieTwoAngleChart
          chartData={data}
          chartColors={colors}
          pieConfigs={pieConfigs}
        />

        {/* Total in middle */}
        <div className="absolute top-[35%] text-center">
          <p className="text-2xl font-bold">{total?.toLocaleString()}</p>
          <p className="text-sm text-[#9DA1A5]">Selections</p>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {data?.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-[4px]"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm text-[#9DA1A5] font-medium">
                {item.name} ({item.value.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
