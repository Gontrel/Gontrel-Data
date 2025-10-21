import React from "react";

interface UserSummaryCardProps {
  postCount: number;
  restaurantsPosted: number;
  followers: number;
  following: number;
}

const UserSummaryCard: React.FC<UserSummaryCardProps> = ({
  postCount,
  restaurantsPosted,
  followers,
  following,
}) => {
  return (
    <div className="bg-white p-6 rounded-[30px] border-[#F0F1F2] shadow-sm max-w-[475px] h-[301px] px-[30px]">
      <h3 className="text-[26px] font-semibold mb-10 text-[#9DA1A5]">
        Account summary
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6">
            {postCount}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Post made
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6">
            {restaurantsPosted}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Restaurants posted
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6 mt-5">
            {followers}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Followers
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#2E3032] mb-6 mt-5">
            {following}
          </p>
          <p className="text-[#9DA1A5] text-base font-semibold leading-[100%]">
            Following
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSummaryCard;
