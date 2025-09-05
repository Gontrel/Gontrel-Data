"use client";
import React from "react";
import { TIconNames } from "../svgs/IconNames";
import Icon from "../svgs/Icons";

interface IMetricCardProps {
  title: string;
  value: string | number;
  iconName: TIconNames;
  iconBackgroundColor: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<IMetricCardProps> = ({
  title,
  value,
  iconName,
  iconBackgroundColor,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[200px] min-h-[100px] font-sans">
      <div className="flex flex-row items-center gap-4">
        {isLoading ? (
          <div
            className="w-10 h-10 rounded-lg animate-pulse"
            style={{ backgroundColor: "#E5E7EB" }}
          ></div>
        ) : (
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white"
            style={{ backgroundColor: iconBackgroundColor }}
          >
            <Icon name={iconName} />
          </div>
        )}
        <section>
          <h3 className="text-[#9DA1A5] text-sm font-semibold">
            {isLoading ? (
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              title
            )}
          </h3>

          <div className="mt-2 text-2xl font-bold text-[#2E3032]">
            {isLoading ? (
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MetricCard;
