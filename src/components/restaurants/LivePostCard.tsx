"use client";

import { User } from "lucide-react";
import { GontrelPostView } from "../video/GontrelPostView";
import { Restaurant } from "@/interfaces/restaurants";
import { Post } from "@/interfaces/posts";

interface LivePostCardProps {
  handleApprove?: () => void;
  handleDecline?: () => void;
  post: Post;
  restaurant?: Restaurant;
}

export const LivePostCard = ({
  handleApprove,
  handleDecline,
  restaurant,
  post,
}: LivePostCardProps) => {

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D2D4D5] bg-white max-w-[556px] mx-auto py-6 px-8 gap-y-4.5">
      <GontrelPostView
        videoUrl={post.videoUrl}
        restaurantData={restaurant}
        width="w-[497px]"
        height="h-[564px]"
        borderRadius="rounded-[15px]"
      />
      {/* Tags and Uploader Info */}
      <div className="flex gap-2">
        {post?.tags?.map((tag) => (
          <span
            key={tag.id}
            className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <User
          size={20}
          fill="white"
          className="mr-2 bg-black p-3 text-white rounded-full"
        />
        <span>Uploaded by: {restaurant?.admin?.name}</span>
        <span className="ml-auto">{}</span>
      </div>
      <div className="flex items-center border-t border-[#D2D4D5] pt-2 pb-6 gap-[18px] px-7.5">
        {/* Action Buttons */}
        <button
          onClick={handleApprove}
          disabled={!handleApprove}
          className="flex items-center gap-2 font-medium bg-[#009543] text-white rounded-[10px] px-4 py-2.5 transition-colors justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-1"
        >
          <span>Approve</span>
        </button>
        <button
          onClick={handleDecline}
          disabled={!handleDecline}
          className="flex items-center gap-2 font-medium bg-[#C50000] text-white rounded-[10px] px-4 py-2.5 transition-colors justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-1"
        >
          <span>Decline</span>
        </button>
      </div>
    </div>
  );
};
