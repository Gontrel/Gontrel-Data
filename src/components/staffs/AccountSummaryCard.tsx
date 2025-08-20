import React from "react";

interface AccountSummaryCardProps {
  restaurantsCreated: number;
  restaurantsApproved: number;
  videosCreated: number;
  videosApproved: number;
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  restaurantsCreated,
  restaurantsApproved,
  videosCreated,
  videosApproved,
}) => {
  return (
    <div className="bg-white p-6 rounded-[30px] border-[#F0F1F2] shadow-sm max-w-[475px] h-[301px] px-[30px]">
      <h3 className="text-[26px] font-semibold mb-10 text-[#9DA1A5]">
        Account summary
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6">
            {restaurantsCreated}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Restaurants created
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6">
            {restaurantsApproved}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Restaurants approved
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6 mt-5">
            {videosCreated}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Videos created
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6 mt-5">
            {videosApproved}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Videos approved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryCard;
