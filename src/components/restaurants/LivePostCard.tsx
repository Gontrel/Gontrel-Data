"use client";

import { User } from "lucide-react";
import { GontrelPostView } from "../video/GontrelPostView";
import { Post } from "@/interfaces";

interface LivePostCardProps {
  handleApprove?: () => void;
  handleDecline?: () => void;
  post: Post;
  // restaurant: RestaurantAdmin;
}

export const LivePostCard = ({
  handleApprove,
  handleDecline,
  post,
}: LivePostCardProps) => {
  if (!post) {
    post = {
      id: "post_123456789",
      createdAt: "2024-01-15T14:30:00Z",
      modifiedAt: "2024-01-15T14:30:00Z",
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: "firebase_post_123",
      analytics: {
        views: 1250,
        likes: 89,
        shares: 12,
        comments: 23,
      },
      tiktokLink: "https://www.tiktok.com/@kingsyleyyj1009/video/7123456789",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbUrl: "https://example.com/thumbnail.jpg",
      postedAt: "2024-01-15T14:30:00Z",
      status: "pending",
    };
  }

  // Additional mock data for UI display that's not part of the Post interface
  const mockDisplayData = {
    tiktokUsername: "Kingsyleyyj1009",
    restaurantData: {
      name: "BurgerVilla",
      address: "123 Main St, Anytown, USA",
      rating: 4.5,
      placeId: "ChIJN1t_t2ud2AR4PVM_67p73Y",
    },
    uploadedBy: "James Madueke",
    uploadTime: "Today at 3pm",
    tags: ["Funny", "Comedy", "Learn", "Explore"],
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D2D4D5] bg-white max-w-[556px] mx-auto py-6 px-8 gap-y-4.5">
      <GontrelPostView
        videoUrl={post.videoUrl}
        restaurantData={mockDisplayData.restaurantData}
        tiktokUsername={mockDisplayData.tiktokUsername}
        width="w-[497px]"
        height="h-[564px]"
        borderRadius="rounded-[15px]"
      />
      {/* Tags and Uploader Info */}
      <div className="flex gap-2">
        {mockDisplayData.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <User
          size={20}
          fill="white"
          className="mr-2 bg-black p-3 text-white rounded-full"
        />
        <span>Uploaded by: {mockDisplayData.uploadedBy}</span>
        <span className="ml-auto">{mockDisplayData.uploadTime}</span>
      </div>
      <div className="flex items-center border-t border-[#D2D4D5] pt-4 gap-[18px] px-7.5">
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
