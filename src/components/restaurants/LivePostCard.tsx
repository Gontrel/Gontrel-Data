"use client";

import {
  User,
  Check,
  X
} from "lucide-react";
import { GontrelPostView } from "../video/GontrelPostView";
import { Post } from "@/interfaces/posts";
import { ApprovalStatusEnum } from "@/types";
import { ActionButtons } from "../ui/ActionButtons";
import { GontrelRestaurantData } from "@/interfaces/restaurants";


interface LivePostCardProps {
  handleApprove?: (restaurantId: string, postId: string) => void;
  handleDecline?: (restaurantId: string, postId: string) => void;
  post: Post;
  restaurant?: GontrelRestaurantData & { id: string, adminName: string };
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
        restaurantData={restaurant ? {
          name: restaurant.name,
          menu: restaurant.menu,
          reservation: restaurant.reservation,
          rating: restaurant.rating
        } : undefined}
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
        <span>Uploaded by: {restaurant?.adminName}</span>
        <span className="ml-auto">{ }</span>
      </div>
      {handleApprove && handleDecline && (post.status === ApprovalStatusEnum.PENDING ? (
        <div className="flex items-center border-t border-[#D2D4D5] pt-4 gap-[18px] px-7.5">
          {/* Action Buttons */}
          <ActionButtons
            actions={[
              {
                icon: <Check className="w-6 h-6" />,
                label: "Approve",
                onClick: () => {
                  post.status = ApprovalStatusEnum.APPROVED;
                  handleApprove?.(restaurant?.id ?? "", post.id)
                },
                variant: "success",
                active: true,
              },
              {
                icon: <X className="w-6 h-6" />,
                label: "Decline",
                onClick: () => {
                  post.status = ApprovalStatusEnum.REJECTED;
                  handleDecline?.(restaurant?.id ?? "", post.id)
                },
                variant: "danger",
                active: true,
              },
            ]}
            className="w-full h-13"
          />
        </div>
      ) : (
        <div className="flex items-center border-t border-[#D2D4D5] pt-4 gap-[18px] px-7.5 justify-center">
          <ActionButtons
            actions={[
              {
                icon: post.status === ApprovalStatusEnum.APPROVED ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />,
                label: post.status === ApprovalStatusEnum.APPROVED ? "Approved" : "Declined",
                onClick: () => { },
                variant: post.status === ApprovalStatusEnum.APPROVED ? "success" : "danger",
                active: true,
                disabled: true,
              }
            ]}
            className="w-full h-13"
          />
        </div>
      ))
      }
    </div >
  );
};
