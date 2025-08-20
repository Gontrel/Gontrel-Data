import React, { useCallback } from "react";
import Icon from "../svgs/Icons";
import Image from "next/image";
import { Post, Location } from "@/interfaces";
import { useRouter } from "next/navigation";
import { formatPostTime } from "@/lib/utils";

type ActivityType = "LOCATION" | "POST" | "PASSWORD_CHANGE";

interface ActivityItemProps {
  type: ActivityType;
  timestamp: string;
  content: string;
  restaurant: Location;
  post: Post;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  timestamp,
  post,
  content,
  restaurant,
}) => {
  const router = useRouter();

  const handlePostClick = useCallback(() => {
  }, []);

  const handleRestaurantClick = useCallback(
    (restaurantId: string) => {
      router.replace(`/restaurants/${restaurantId}`);
    },
    [router]
  );

  const handleRestaurantClick2 = useCallback((restaurantId: string) => {
    console.log("Restaurant ID:", restaurantId);
  }, []);

  return (
    <div className="rounded-[10px] pb-4 bg-[#FAFAFA] max-w-[722px] p-5 shadow-sm border border-[#D2D4D5]">
      {/* The scrollable content is wrapped here */}
      <div className="h-[200px] overflow-y-auto">
        <div className="flex justify-between items-center mb-[27px]">
          {type === "LOCATION" && (
            <p className="font-medium text-[20px] text-[#2E3032] leading-[100%]">
              {content}
            </p>
          )}
          {type === "POST" && (
            <p className="font-medium text-lg text-[#4D5255] leading-[100%]">
              {content}
            </p>
          )}
          {type === "PASSWORD_CHANGE" && (
            <p className="font-medium"> {content}</p>
          )}
          <p className="text-sm text-gray-500">{formatPostTime(timestamp)}</p>
        </div>

        {(type === "LOCATION" || type === "POST") && (post || restaurant) && (
          <div className="flex items-center gap-4 bg-[#F0F1F2] p-3 rounded-[10px] gap-y-7">
            <Image
              src={
                type === "LOCATION"
                  ? restaurant?.image ?? "/images/location.jpeg"
                  : post?.thumbUrl ?? "/images/location.jpeg"
              }
              width={50}
              height={50}
              alt={type === "LOCATION" ? "Restaurant" : "Video"}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <p className="text-sm text-gray-500">{restaurant?.id}</p>
              {type === "LOCATION" && (
                <p className="font-semibold text-[#2E3032] leading-[100%] text-[23px]">
                  {restaurant?.name}
                </p>
              )}
              {type === "POST" && post?.videoUrl && (
                <a
                  href={post?.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0070F3] text-[23px] font-medium underline"
                >
                  <div className="flex gap-4">
                    <Icon name="linkIcon" className="h-5 w-5 text-gray-500" />
                    {post?.videoUrl}
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {type === "LOCATION" && (
          <button
            className="text-[#2E3032] text-lg font-medium mt-2 flex items-center gap-1 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => handleRestaurantClick(restaurant?.id)}
          >
            View restaurant{" "}
            <Icon name="externalLinkIcon" width={14} height={14} />
          </button>
        )}

        {type === "POST" && (
          <div className="flex gap-4 mt-2">
            <button
              className="text-[#2E3032] text-lg font-medium mt-2 flex items-center gap-1 mr-[10px] hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={handlePostClick}
            >
              View video <Icon name="externalLinkIcon" width={14} height={14} />
            </button>
            <button
              className="text-[#2E3032] text-lg font-medium mt-2 flex items-center gap-1 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => handleRestaurantClick2(restaurant?.id)}
            >
              View restaurant{" "}
              <Icon name="externalLinkIcon" width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
