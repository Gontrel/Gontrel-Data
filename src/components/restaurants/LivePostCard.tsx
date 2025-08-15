"use client";

import { Check, X } from "lucide-react";
import { GontrelPostView } from "../video/GontrelPostView";
import { Post } from "@/interfaces/posts";
import { AdminRoleEnum, ApprovalStatusEnum } from "@/types";
import { ActionButtons } from "../ui/ActionButtons";
import { GontrelRestaurantData } from "@/interfaces/restaurants";
import Icon from "../svgs/Icons";
import { formatPostTime } from "@/lib/utils";
import EditDeletePopup from "../popups/editAndDelete";

interface LivePostCardProps {
  handleApprove?: (restaurantId: string, postId: string) => void;
  handleDecline?: (restaurantId: string, postId: string) => void;
  handleOpenEditModal?: () => void;
  handleOpenDeleteModal?: () => void;
  RestaurantDetailsFlow?: boolean;
  post: Post;
  restaurant?: GontrelRestaurantData & { id: string; adminName: string };
}

export const LivePostCard = ({
  handleApprove,
  handleDecline,
  handleOpenEditModal,
  handleOpenDeleteModal,
  restaurant,
  post,
  RestaurantDetailsFlow = false,
}: LivePostCardProps) => {
  const isUser = post.admin?.role === AdminRoleEnum.USER;
  const showEditAndDelete =
    RestaurantDetailsFlow && post.status === ApprovalStatusEnum.APPROVED;

  const gontrelRestaurantData: GontrelRestaurantData = {
    name: restaurant?.name ?? "",
    menu:
      typeof restaurant?.menu === "string"
        ? restaurant?.menu
        : restaurant?.menu?.content ?? "",
    reservation:
      typeof restaurant?.reservation === "string"
        ? restaurant?.reservation
        : restaurant?.reservation?.content ?? "",
    rating: restaurant?.rating ?? 0,
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D2D4D5] bg-white max-w-[556px] mx-auto py-6 px-8 gap-y-4.5 mt-4 relative">
      <div className="w-full overflow-hidden">
        {" "}
        {/* Added wrapper div */}
        <GontrelPostView
          videoUrl={post.videoUrl}
          restaurantData={gontrelRestaurantData}
          width="w-full"
          height="h-[564px]"
          borderRadius="rounded-[15px]"
        />
      </div>

      {/* Tags and Uploader Info - Improved wrapping */}
      <div className="flex flex-wrap gap-2 w-full">
        {post?.tags?.map((tag) => (
          <span
            key={tag.id}
            className="bg-[#F0F1F2] text-[#2E3032] text-xs font-medium px-3 py-[10px] rounded-[10px] whitespace-nowrap flex-shrink-0"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex items-center flex-row text-sm text-gray-500">
        <p className="bg-[#2E3032] rounded-full gap-2 mr-2">
          {" "}
          <Icon name="personIcon" stroke="#FFF" />
        </p>
        <p>
          Uploaded by:{" "}
          {isUser ? (
            <span> {post.admin?.name} (User) </span>
          ) : (
            <span> {post.admin?.name}</span>
          )}{" "}
        </p>
        <p className="ml-auto">{}</p>

        <div className="flex items-center text-sm text-gray-500">
          <span className="text-[#9DA1A5] text-base font-medium mr-6.5">
            {formatPostTime(post?.createdAt)}
          </span>
          {showEditAndDelete && (
            <div className="relative">
              <EditDeletePopup
                onEdit={() => handleOpenEditModal?.()}
                onDelete={() => handleOpenDeleteModal?.()}
                triggerElement={
                  <button className="bg-[#FAFAFA] border border-[#D2D4D5] rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <div className="flex space-x-1">
                      <span className="w-1 h-1 rounded-full bg-[#0070F3]"></span>
                      <span className="w-1 h-1 rounded-full bg-[#0070F3]"></span>
                      <span className="w-1 h-1 rounded-full bg-[#0070F3]"></span>
                    </div>
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {handleApprove &&
        handleDecline &&
        (post.status === ApprovalStatusEnum.PENDING ? (
          <div className="flex items-center border-t border-[#D2D4D5] pt-4 gap-[18px] px-7.5">
            <ActionButtons
              actions={[
                {
                  icon: <Check className="w-6 h-6" />,
                  label: "Approve",
                  onClick: () => {
                    post.status = ApprovalStatusEnum.APPROVED;
                    handleApprove?.(restaurant?.id ?? "", post.id);
                  },
                  variant: "success",
                  active: true,
                },
                {
                  icon: <X className="w-6 h-6" />,
                  label: "Decline",
                  onClick: () => {
                    post.status = ApprovalStatusEnum.REJECTED;
                    handleDecline?.(restaurant?.id ?? "", post.id);
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
                  icon:
                    post.status === ApprovalStatusEnum.APPROVED ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    ),
                  label:
                    post.status === ApprovalStatusEnum.APPROVED
                      ? "Approved"
                      : "Declined",
                  onClick: () => {},
                  variant:
                    post.status === ApprovalStatusEnum.APPROVED
                      ? "success"
                      : "danger",
                  active: true,
                  disabled: true,
                },
              ]}
              className="w-full h-13"
            />
          </div>
        ))}
    </div>
  );
};
