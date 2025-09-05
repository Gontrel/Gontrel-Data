"use client";

import { ChevronDownIcon } from "lucide-react";
import React, { useState, useCallback } from "react";
import { ResponsiveContainer } from "recharts";

// Define the shape of your data
interface FeatureData {
  name: string;
  value: number; // Represents the percentage
  color: string; // Color for the bar
}

// Define the props for your component
interface ILineChartChartProps {
  title?: string;
  data: FeatureData[];
  initialDateRange?: string;
  dateRangeOptions?: { label: string; value: string }[];
  onDateRangeChange?: (value: string) => void;
}

const LineChart: React.FC<ILineChartChartProps> = ({
  title = "Most used features",
  data,
  initialDateRange = "last7days",
  dateRangeOptions = [
    { label: "Last 7 days", value: "last7days" },
    { label: "Last 30 days", value: "last30days" },
    { label: "Last 90 days", value: "last90days" },
  ],
  onDateRangeChange,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDateRangeSelect = useCallback(
    (value: string) => {
      setSelectedDateRange(value);
      setIsDropdownOpen(false);
      onDateRangeChange?.(value);
    },
    [onDateRangeChange]
  );

  const currentRangeLabel =
    dateRangeOptions.find((option) => option.value === selectedDateRange)
      ?.label || "Select Range";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      {/* Header with Title and Dropdown */}
      <div className="flex justify-between items-center mb-[19.5%]">
        <h2 className="text-xl font-semibold text-[#2E3032]">{title}</h2>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {currentRangeLabel}
            <ChevronDownIcon
              className="ml-1 -mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDateRangeSelect(option.value)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={256}>
        <div className="flex flex-col space-y-3 mt-[20px] pr-4">
          {" "}
          {/* Add pr-4 to align with chart area */}
          {data.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-start py-1"
            >
              <span className="text-gray-700 w-[100px] text-left pr-2 text-sm">
                {item.name}
              </span>
              <div
                className="flex-grow h-3 bg-gray-200 rounded-full mr-2"
                style={{ width: "100%" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
              <span className="text-gray-600 font-medium text-sm w-10 text-right">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
