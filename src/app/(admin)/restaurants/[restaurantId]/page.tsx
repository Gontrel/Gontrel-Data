"use client";

import { useState, use } from "react";
import {
  MapPin,
  Globe,
  Book,
  Clock,
  Calendar,
  ExternalLink,
  Video,
  Plus,
} from "lucide-react";
import { LivePostCard } from "@/components/restaurants/LivePostCard";
import { NewPostSheet } from "@/components/posts/NewPostsModal";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { GontrelPostView } from "@/components/video/GontrelPostView";
import { useVideoStore } from "@/stores/videoStore";
import { trpc } from "@/lib/trpc-client";
import { Post } from "@/types";
import { RestaurantDetailsSkeleton } from "@/components/Loader/restaurants/RestaurantDetailsSkeleton";

const RestaurantDetailsPage = ({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) => {
  // Unwrap the params Promise using React.use()
  const { restaurantId } = use(params);
  const [activeTab, setActiveTab] = useState("live");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const { activeVideoUrl, setActiveVideoUrl, restaurantData, tiktokUsername } =
    useVideoStore();

  const accountSummary = {
    totalPosts: 20,
    fromTikTok: 10,
    ugcCreated: 10,
  };

  const {
    data: restaurant, // Renamed for clarity
    isLoading,
    isError,
    error,
  } = trpc.restaurant.getRestaurantById.useQuery(
    { locationId: restaurantId },
    { enabled: !!restaurantId }
  );

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


  const handleNewPostModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
      setShowNewPostModal(false);
    }
  };
  return (
    <div className="bg-gray-50 p-8 relative">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handleNewPostModalOpenChange}
        showCloseButton={false}
      >
        {restaurantData && (
          <GontrelPostView
            videoUrl={activeVideoUrl}
            restaurantData={restaurantData}
            tiktokUsername={tiktokUsername || ""}
          />
        )}
      </PreviewVideoModal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fixed">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
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
                  Created by: {restaurant.admin?.name}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <a
                href={restaurant.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Video size={16} /> View TikTok{" "}
                <ExternalLink size={14} className="ml-auto" />
              </a>
              <a
                href={restaurant.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Globe size={16} /> View website{" "}
                <ExternalLink size={14} className="ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <MapPin size={16} /> View address{" "}
                <ExternalLink size={14} className="ml-auto" />
              </a>
              <a
                href={restaurant.menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Book size={16} /> View menu{" "}
                <ExternalLink size={14} className="ml-auto" />
              </a>
              <a
                href={restaurant.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Calendar size={16} /> View reservation{" "}
                <ExternalLink size={14} className="ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Clock size={16} /> View working hours
              </a>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4">Account summary</h2>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-2xl font-bold">
                  {accountSummary.totalPosts}
                </p>
                <p className="text-sm text-gray-500">Total posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {accountSummary.fromTikTok}
                </p>
                <p className="text-sm text-gray-500">From TikTok</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {accountSummary.ugcCreated}
                </p>
                <p className="text-sm text-gray-500">UGC created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
          {/* Header and Filters (fixed height) */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-8 border-b">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`py-2 px-1 ${
                    activeTab === "live"
                      ? "border-b-2 border-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  Live posts {restaurant?.posts?.length}
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-2 px-1 ${
                    activeTab === "pending"
                      ? "border-b-2 border-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  Pending videos (10)
                </button>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> New Post
              </button>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="w-48 p-2 border rounded-lg text-gray-500">
                All post types
              </div>
              <div className="w-48 p-2 border rounded-lg text-gray-500">
                All time
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            className="flex-grow overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {activeTab === "live" &&
              (restaurant.posts && restaurant.posts.length > 0 ? (
                restaurant.posts
                  .filter((post: Post) => post.status === "approved")
                  .map((post: Post) => (
                    <LivePostCard key={post.id} post={post} />
                  ))
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-gray-500">
                    No active posts found.
                  </p>
                </div>
              ))}

            {activeTab === "pending" &&
              (restaurant.posts && restaurant.posts.length > 0 ? (
                restaurant.posts
                  .filter((post: Post) => post.status === "pending")
                  .map((post: Post) => (
                    <LivePostCard key={post.id} post={post} />
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
        onOpenChange={handleNewPostModalOpenChange}
      />
    </div>
  );
};

export default RestaurantDetailsPage;
