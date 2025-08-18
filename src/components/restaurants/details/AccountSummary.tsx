import React from "react";

interface AccountSummaryProps {
  totalPosts: number;
  tiktokPosts: number;
  userPosts: number;
}

export const AccountSummary = ({
  totalPosts,
  tiktokPosts,
  userPosts,
}: AccountSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="font-semibold mb-[42px] text-[#9DA1A5] text-base">
        Account summary
      </h2>
      <div className="flex justify-between text-center">
        <div>
          <p className="text-2xl text-[#2E3032] font-bold">{totalPosts ?? 0}</p>
          <p className="text-base text-[#9DA1A5]">Total posts</p>
        </div>
        <div>
          <p className="text-2xl text-[#2E3032] font-bold">
            {tiktokPosts ?? 0}
          </p>
          <p className="text-base  text-[#9DA1A5]">From TikTok</p>
        </div>
        <div>
          <p className="text-2xl text-[#2E3032] font-bold">{userPosts ?? 0}</p>
          <p className="text-base text-[#9DA1A5]">UGC created</p>
        </div>
      </div>
    </div>
  );
};

