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
}

const StaffProfileCard: React.FC<StaffProfileCardProps> = ({
  id,
  name,
  role,
  email,
  phone,
  address,
  profileImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <Image
          src={profileImage}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-sm text-gray-500">{id}</p>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">{role}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="linkIcon" className="h-5 w-5 text-gray-500" />
          <p className="text-gray-700">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="personIcon" className="h-5 w-5 text-gray-500" />
          <p className="text-gray-700">{phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="mapPinIcon" className="h-5 w-5 text-gray-500" />
          <p className="text-gray-700">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileCard;
