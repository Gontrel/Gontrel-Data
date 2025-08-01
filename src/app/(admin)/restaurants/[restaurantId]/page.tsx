"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Bell,
  User,
  MapPin,
  Globe,
  Book,
  Clock,
  Calendar,
  ExternalLink,
  Video,
  Plus,
} from "lucide-react";
import LivePostCard from "@/components/restaurants/LivePostCard";
import { PreviewVideoModal } from "@/components/restaurants/PreviewVideoModal";
import { NewPostSheet } from "@/components/posts/NewPostsModal";
import { useVideoStore } from "@/stores/videoStore";

const RestaurantDetailsPage = ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const restaurant = {
    id: params.restaurantId,
    name: "The Gilded Spatula",
    creator: "James Madueke",
    imageUrl: "/placeholder-image.jpg",
    tiktokUrl: "#",
    websiteUrl: "#",
    address: "123 Gourmet Lane, Foodie City",
    menuUrl: "#",
    reservationUrl: "#",
  };

  const accountSummary = {
    totalPosts: 20,
    fromTikTok: 10,
    ugcCreated: 10,
  };

  const [activeTab, setActiveTab] = useState("live");

  const { activeVideoUrl, setActiveVideoUrl } = useVideoStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const handlePreviewModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handlePreviewModalOpenChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Restaurant Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">#{restaurant.id}</p>
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <p className="text-sm text-gray-500">
                  Created by: {restaurant.creator}
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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
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
                Live posts (200)
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
            <button onClick={() => setShowNewPostModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} /> New Post
            </button>
          </div>
          <div className="flex gap-4 mb-6">
            {/* Filters - will be implemented later */}
            <div className="w-48 p-2 border rounded-lg text-gray-500">
              All post types
            </div>
            <div className="w-48 p-2 border rounded-lg text-gray-500">
              All time
            </div>
          </div>

          {activeTab === "live" ? (
            <LivePostCard />
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>Pending videos will be displayed here.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Restaurant Modal */}
      <NewPostSheet
        open={showNewPostModal}
        onOpenChange={setShowNewPostModal}
      />
    </div>
  );
};

export default RestaurantDetailsPage;
