"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type BarConfig = {
  dataKey: string;
  color?: string;
  stackId?: string;
  name?: string;
};

type BarChartCardProps = {
  title: string;
  data: { name: string; [key: string]: string | number }[];
  bars: BarConfig[];
  className?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  tooltip?: boolean;
  xAxis?: boolean;
  yAxis?: boolean;
};

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  bars,
  className,
  height = 285,
  showLegend = true,
  showGrid = true,
  tooltip = true,
  xAxis = true,
  yAxis = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg p-6", className)}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg p-6", className)}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: -15,
              bottom: 5,
            }}
          >
            {showGrid && <CartesianGrid stroke="#f3f4f6" vertical={false} />}
            {xAxis && (
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
            )}
            {yAxis && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value: number) => {
                  if (value >= 1000) return `${value / 1000}k`;
                  return value.toString();
                }}
              />
            )}
            {tooltip && <Tooltip cursor={{ fill: "#e5e7eb", opacity: 0.5 }} />}
            {showLegend && <Legend />}
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                stackId={bar.stackId}
                fill={
                  bar.color ||
                  ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"][index % 4]
                }
                radius={[4, 4, 0, 0]}
                name={bar.name || bar.dataKey}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
