"use client"

import React from "react";
import Icon from "../svgs/Icons";
import ActivityItem from "./ActivityItem";

interface StaffActivitiesProps {
  onDeactivateStaff: () => void;
}

const StaffActivities: React.FC<StaffActivitiesProps> = ({
  onDeactivateStaff,
}) => {
  return (
    <div className="w-2/3 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Staff&apos;s activities</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={onDeactivateStaff}
        >
          <Icon name="deactivateIcon" className="h-5 w-5" />
          Deactivate staff
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select className="border border-gray-300 rounded-lg px-4 py-2">
          <option>All activities</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-2">
          <option>All time</option>
        </select>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {/* Monthly Header */}
        <h3 className="text-lg font-semibold">July 2025</h3>

        <ActivityItem
          type="restaurant"
          timestamp="July 1,2025 at 3:30pm"
          details={{
            id: "#12345678",
            name: "The Gilded Spatula",
            imageUrl: "/assets/images/logo.png",
          }}
        />
        <ActivityItem
          type="video"
          timestamp="July 1,2025 at 3:30pm"
          details={{
            id: "#12345678",
            name: "The Gilded Spatula",
            imageUrl: "/assets/images/logo.png",
            videoUrl: "https://tiktok.com/hiiwieoeoe...",
          }}
        />
        <ActivityItem
          type="password_change"
          timestamp="July 1,2025 at 3:30pm"
        />
        <ActivityItem
          type="restaurant"
          timestamp="July 1,2025 at 3:30pm"
          details={{
            id: "#12345678",
            name: "The Gilded Spatula",
            imageUrl: "/assets/images/logo.png",
          }}
        />
      </div>
    </div>
  );
};

export default StaffActivities;
