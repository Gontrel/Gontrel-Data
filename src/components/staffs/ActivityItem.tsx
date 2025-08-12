import React from "react";
import Icon from "../svgs/Icons";

type ActivityType = "restaurant" | "video" | "password_change";

interface ActivityItemProps {
  type: ActivityType;
  timestamp: string;
  details?: {
    id?: string;
    name?: string;
    imageUrl?: string;
    videoUrl?: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  timestamp,
  details,
}) => {
  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-center mb-2">
        {type === "restaurant" && (
          <p className="font-medium">Staff created a restaurant</p>
        )}
        {type === "video" && (
          <p className="font-medium">
            Staff created a video for {details?.name}
          </p>
        )}
        {type === "password_change" && (
          <p className="font-medium">Staff changed their password</p>
        )}
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
      {(type === "restaurant" || type === "video") && details && (
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
          <img
            src={details.imageUrl}
            alt={type === "restaurant" ? "Restaurant" : "Video"}
            className="w-16 h-16 rounded object-cover"
          />
          <div>
            <p className="text-sm text-gray-500">{details.id}</p>
            {type === "restaurant" && (
              <p className="font-semibold">{details.name}</p>
            )}
            {type === "video" && details.videoUrl && (
              <a href="#" className="text-blue-600 underline">
                {details.videoUrl}
              </a>
            )}
          </div>
        </div>
      )}
      {type === "restaurant" && (
        <button className="text-blue-600 text-sm mt-2 flex items-center gap-1">
          View restaurant{" "}
          <Icon name="externalLinkIcon" width={14} height={14} fill="#2563EB" />
        </button>
      )}
      {type === "video" && (
        <div className="flex gap-4 mt-2">
          <button className="text-blue-600 text-sm flex items-center gap-1">
            View video{" "}
            <Icon
              name="externalLinkIcon"
              width={14}
              height={14}
              fill="#2563EB"
            />
          </button>
          <button className="text-blue-600 text-sm flex items-center gap-1">
            View restaurant{" "}
            <Icon
              name="externalLinkIcon"
              width={14}
              height={14}
              fill="#2563EB"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
