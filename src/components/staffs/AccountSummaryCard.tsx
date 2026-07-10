import { AdminRoleEnum } from "@/types/enums";
import { useCurrentUser } from "@/stores/authStore";
import React, { useState } from "react";
import { GetStaffSummaryResponse } from "@/interfaces/responses";

interface AccountSummaryCardProps {
  data: GetStaffSummaryResponse;
}

type TabType = "created" | "approved";

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ data }) => {
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>("created");

  // Check if tabs should be visible (hide for analyst and user roles)
  const shouldShowTabs =
    currentUser?.role !== AdminRoleEnum.ANALYST &&
    currentUser?.role !== AdminRoleEnum.USER;

  return (
    <div className="bg-white p-6 rounded-[30px] border-[#F0F1F2] shadow-sm max-w-[475px] px-[30px]">
      <h3 className="text-[26px] font-semibold mb-10 text-[#9DA1A5]">
        Account summary
      </h3>

      {shouldShowTabs && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveTab("created")}
            className={`flex items-center justify-center gap-3 py-3 px-2 lg:px-3 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "created"
                ? "bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-white shadow-lg"
                : "text-[#9DA1A5] hover:bg-gray-100"
            }`}
          >
            Created tasks
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex items-center justify-center gap-3 py-3 px-2 lg:px-3 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "approved"
                ? "bg-gradient-to-r from-[#B405FE] to-[#1D5FF5] text-white shadow-lg"
                : "text-[#9DA1A5] hover:bg-gray-100"
            }`}
          >
            Approved tasks
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {activeTab === "created" ? (
          <>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.totalLocations || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Restaurants created
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.approvedLocations || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Restaurants approved
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.totalPosts || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Videos created
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.approvedPosts || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Videos approved
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.locationsApprovedBy || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Restaurants approved
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.postsApprovedBy || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Videos approved
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.locationsDeclinedBy || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Restaurants declined
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2E3032] mb-6">
                {data?.postsDeclinedBy || 0}
              </p>
              <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
                Videos declined
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSummaryCard;
