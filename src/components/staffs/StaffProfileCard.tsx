import React from "react";
import Icon from "../svgs/Icons";
import Image from "next/image";

interface StaffProfileCardProps {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  isStaffActive: boolean;
}

const StaffProfileCard: React.FC<StaffProfileCardProps> = ({
  id,
  name,
  role,
  email,
  phone,
  address,
  profileImage,
  isStaffActive,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-[406px]">
      <div className="flex items-center gap-4">
        <Image
          src={profileImage}
          width={100}
          height={100}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-base text-[#9DA1A5] leading-[100%]">{id}</p>
          <h2 className="text-[23px] font-semibold text-[#2E3032] leading-[100%] py-2 ">
            {name}
          </h2>
          <aside className="flex items-center gap-1">
            <Icon name="personIcon2" className="h-5 w-5 text-gray-500" />
            <p className="text-base text-[#9DA1A5] leading-[100%]">{role}</p>
          </aside>
        </div>
        {!isStaffActive && (
          <div
            className={`flex items-center justify-center py-[10px] px-[30px] rounded-[10px]  gap-x-4 ${"bg-[#FDE6E6] border-[#F35454]"} `}
          >
            <span
              className={`text-lg font-semibold leading-[100%] ${"text-[#ED0000]"}`}
            >
              Deactivated
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 bg-[#FAFAFA] p-2 rounded border-[#F0F1F2] shadow">
          <Icon name="emailIcon" fill="#2E3032" />
          <p className="text-[#2E3032] text-lg font-semibold leading-[100%]">
            {email ?? "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAFAFA] p-2 rounded border-[#F0F1F2] shadow">
          <Icon name="phoneIcon" className="h-5 w-5 text-gray-500" />
          <p className="text-[#2E3032] text-lg font-semibold leading-[100%]">
            {phone ?? "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAFAFA] p-2 rounded border-[#F0F1F2] shadow">
          <Icon name="mapIcon" className="h-5 w-5 text-gray-500" />
          <p className="text-[#2E3032] text-lg font-semibold leading-[100%]">
            {address ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileCard;
