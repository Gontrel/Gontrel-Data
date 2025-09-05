"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface IChartData {
  name: string;
  value: number;
}

export interface IPieConfig {
  cx: number | string;
  cy: number | string;
  innerRadius: number;
  outerRadius: number;
  paddingAngle?: number;
  startAngle?: number;
  endAngle?: number;
}

interface IReusablePieChartProps {
  chartData: IChartData[];
  chartColors: string[];
  pieConfigs: IPieConfig[];
}

export const PieTwoAngleChart: React.FC<IReusablePieChartProps> = ({
  chartData,
  chartColors,
  pieConfigs,
}) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        {pieConfigs.map((config, index) => (
          <Pie
            key={`pie-${index}`}
            data={chartData}
            dataKey="value"
            {...config}
          >
            {chartData.map((entry, dataIndex) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={chartColors[dataIndex % chartColors.length]}
              />
            ))}
          </Pie>
        ))}
      </PieChart>
    </ResponsiveContainer>
  );
};
