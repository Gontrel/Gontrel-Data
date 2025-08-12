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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Account summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold">{restaurantsCreated}</p>
          <p className="text-gray-600">Restaurants created</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{restaurantsApproved}</p>
          <p className="text-gray-600">Restaurants approved</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{videosCreated}</p>
          <p className="text-gray-600">Videos created</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{videosApproved}</p>
          <p className="text-gray-600">Videos approved</p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryCard;
