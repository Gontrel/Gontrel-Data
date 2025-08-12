"use client";

import AccountSummaryCard from "@/components/staffs/AccountSummaryCard";
import StaffActivities from "@/components/staffs/StaffActivities";
import StaffProfileCard from "@/components/staffs/StaffProfileCard";
import React from "react";

const StaffDetails = () => {
  const handleOnActivateStaff = () => {};

  return (
    <div className="flex flex-col gap-6 p-6 text-base">
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="w-1/3 flex flex-col gap-6">
          <StaffProfileCard
            id="#12345678"
            name="James Gunn"
            role="Analyst"
            email="jamesgunn@gmail.com"
            phone="+1 234 567 989"
            address="Badman BLVD, Wakanda, 1010"
            profileImage="/assets/images/logo.png"
          />

          <AccountSummaryCard
            restaurantsCreated={20}
            restaurantsApproved={10}
            videosCreated={20}
            videosApproved={30}
          />
        </div>

        {/* Staff's Activities */}
        <StaffActivities onDeactivateStaff={handleOnActivateStaff} />
      </div>
    </div>
  );
};

export default StaffDetails;
