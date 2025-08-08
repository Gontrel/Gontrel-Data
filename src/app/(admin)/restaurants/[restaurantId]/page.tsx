"use client";

import { useState, use } from "react";
import { Plus } from "lucide-react";
import { LivePostCard } from "@/components/restaurants/LivePostCard";
import { NewPostSheet } from "@/components/posts/NewPostsModal";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { GontrelPostView } from "@/components/video/GontrelPostView";
import { useVideoStore } from "@/stores/videoStore";
import { trpc } from "@/lib/trpc-client";
import { RestaurantDetailsSkeleton } from "@/components/Loader/restaurants/RestaurantDetailsSkeleton";
import { Post } from "@/interfaces/posts";
import Icon from "@/components/svgs/Icons";
import { GontrelRestaurantData } from "@/interfaces";

const RestaurantDetailsPage = ({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) => {
  const { restaurantId } = use(params);
  const [activeTab, setActiveTab] = useState("live");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const { activeVideoUrl, setActiveVideoUrl, restaurantData, tiktokUsername } =
    useVideoStore();

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = trpc.restaurant.getRestaurantById.useQuery(
    { locationId: restaurantId },
    { enabled: !!restaurantId }
  );

  const activeRestaurantPosts: Post[] = [];
  const pendingRestaurantPosts: Post[] = [];

  if (restaurant?.posts) {
    for (let i = 0; i < restaurant.posts.length; i++) {
      const post = restaurant.posts[i];

      if (post?.status === "pending") {
        pendingRestaurantPosts.push(post);
      } else if (post?.status === "approved") {
        activeRestaurantPosts.push(post);
      }
    }
  }

  // Handle loading and error states
  if (isLoading) {
    return <RestaurantDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  // Fallback for when data is not yet available
  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Restaurant not found.
      </div>
    );
  }

  const gontrelRestaurantData: GontrelRestaurantData = {
    name: restaurant.name,
    menu: restaurant.menu,
    reservation: restaurant.reservation,
    rating: restaurant.rating,
  };

  const handleNewPostModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
      setShowNewPostModal(false);
    }
  };
  return (
    <div className="bg-[#FAFAFA] p-8 relative">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handleNewPostModalOpenChange}
        showCloseButton={false}
      >
        {restaurantData && (
          <GontrelPostView
            videoUrl={activeVideoUrl}
            restaurantData={gontrelRestaurantData}
            tiktokUsername={tiktokUsername || ""}
          />
        )}
      </PreviewVideoModal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fixed">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8 w-[512px]">
          {/* Restaurant Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={restaurant?.imageUrl}
                alt={restaurant?.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">#{restaurant?.id}</p>
                <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
                <p className="text-sm text-gray-500">
                  Created by: {restaurant?.admin?.name}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <a
                href={restaurant?.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantTiktokIcon" className="w-5 h-5" /> View
                TikTok <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-lg hover:bg-gray-200"
              >
                <Icon name="worldIcon" className="w-5 h-5" /> View website{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.address?.content}
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantLocationIcon" className="w-5 h-5" />
                View address
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.menu?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="menuIcon" className="w-5 h-5" /> <p>View menu</p>{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={restaurant?.reservation?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-[#FAFAFA]  rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantReversationIcon" className="w-5 h-5" />
                View reservation{" "}
                <Icon name="externalLinkIcon" className="w-5 h-5" />
              </a>
              <a
                href={""} //restaurant.opening_hours[0]
                className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-lg hover:bg-gray-200"
              >
                <Icon name="restaurantTimeIcon" className="w-5 h-5" /> View
                working hours
              </a>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-[42px] text-[#9DA1A5] text-base">
              Account summary
            </h2>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.totalPosts ?? 0}
                </p>
                <p className="text-base text-[#9DA1A5]">Total posts</p>
              </div>
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.tiktokPosts ?? 0}
                </p>
                <p className="text-base  text-[#9DA1A5]">From TikTok</p>
              </div>
              <div>
                <p className="text-2xl text-[#2E3032] font-bold">
                  {restaurant?.summary?.userPosts ?? 0}
                </p>
                <p className="text-base text-[#9DA1A5]">UGC created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white p-6 ml-[91px] rounded-2xl shadow-sm flex flex-col w-[744px] h-[980px]">
          {/* Header and Filters (fixed height) */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`py-[10px] px-[20px] ${
                    activeTab === "live"
                      ? "border-2 border-[#F0F1F2] font-semibold rounded-[10px]"
                      : "text-[#9DA1A5]"
                  }`}
                >
                  Live posts ({activeRestaurantPosts?.length})
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-[10px] px-[20px] ${
                    activeTab === "pending"
                      ? "border-2 border-[#F0F1F2] font-semibold rounded-[10px]"
                      : "text-gray-500"
                  }`}
                >
                  Pending videos ({pendingRestaurantPosts?.length})
                </button>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-[#0070F3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> New Post
              </button>
            </div>
            <div className="flex flex-row justify-between mb-6">
              <div
                className="w-48 p-2 border flex flex-row items-center justify-between
               rounded-lg text-gray-500"
              >
                <span> All post types</span>
                <Icon
                  name="arrowdownIcon"
                  stroke="#0070F3"
                  width={24}
                  height={24}
                />
              </div>

              <div className="w-48 border rounded-lg flex flex-row items-center justify-between gap-2 text-gray-500 p-[14px]">
                <div className="flex flex-row items-center justify-between gap-2">
                  <Icon
                    name="postCalendarIcon"
                    stroke="#0070F3"
                    width={24}
                    height={24}
                  />
                  <span>All time</span>
                </div>
                <Icon
                  name="arrowdownIcon"
                  stroke="#0070F3"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            className="flex-grow overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {activeTab === "live" &&
              (activeRestaurantPosts.length > 0 ? (
                activeRestaurantPosts.map((post: Post) => (
                  <LivePostCard
                    key={post.id}
                    post={post}
                    restaurant={restaurant}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-gray-500">
                    No active posts found.
                  </p>
                </div>
              ))}

            {activeTab === "pending" &&
              (pendingRestaurantPosts.length > 0 ? (
                pendingRestaurantPosts.map((post: Post) => (
                  <LivePostCard
                    key={post.id}
                    post={post}
                    restaurant={restaurant}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-gray-500">
                    No pending posts found.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* New Restaurant Modal */}
      <NewPostSheet
        open={showNewPostModal}
        restaurant={restaurant}
        onOpenChange={handleNewPostModalOpenChange}
      />
    </div>
  );
};

export default RestaurantDetailsPage;
