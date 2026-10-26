"use client";

import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Post } from "@/interfaces/posts";
import { GontrelRestaurantData } from "@/interfaces/restaurants";

interface MediaCarouselProps {
  posts: Post[];
  restaurant: GontrelRestaurantData;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const MediaCarousel = ({
  posts,
  restaurant,
  currentIndex,
  onIndexChange,
}: MediaCarouselProps) => {
  const currentPost = posts[currentIndex];

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  const handleNext = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, posts.length, onIndexChange]);

  if (!currentPost) {
    return (
      <div className="flex items-center justify-center h-[686px] bg-gray-100 rounded-[20px]">
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  const userAvatar = currentPost.user?.profileImage || currentPost.admin?.profileImage;
  const username = currentPost.user?.username || currentPost.admin?.name || "Unknown";
  const rating = restaurant.rating ?? 0;

  return (
    <div className="relative w-[400px] h-[686px] rounded-[20px] overflow-hidden">
      {/* Background Image/Video */}
      {currentPost.videoUrl ? (
        <video
          key={currentPost.id || currentIndex}
          src={currentPost.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : currentPost.thumbUrl ? (
        <Image
          key={currentPost.id || currentIndex}
          src={currentPost.thumbUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 rounded-[20px]"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 19.293%, rgba(0, 0, 0, 0) 73.717%, rgba(0, 0, 0, 0.6) 100%)"
        }}
      />

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === posts.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-2 p-2">
          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#B0D3FB] flex-shrink-0">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={username}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400" />
            )}
          </div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className="font-semibold text-lg text-white truncate flex-1"
                style={{ textShadow: "0px 0px 10px black" }}
              >
                {restaurant.name}
              </p>
              {rating > 0 && (
                <div className="bg-[#B0ECB2] px-1 py-0.5 rounded-full flex items-center flex-shrink-0">
                  <span className="text-[#2E3032] text-sm font-normal">
                    <span className="text-sm">{rating}</span>
                    <span className="text-[10px] font-medium">/10</span>
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-white/60">{username}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full pr-40">
          <div
            className="h-full"
            style={{
              backgroundImage: "linear-gradient(178deg, #BD00FF 9.644%, #0070F3 92.061%)"
            }}
          />
        </div>
      </div>
    </div>
  );
};
