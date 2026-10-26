"use client";

import { useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { Post } from "@/interfaces/posts";
import { GontrelRestaurantData } from "@/interfaces/restaurants";

interface MediaCarouselProps {
  posts: Post[];
  restaurant: GontrelRestaurantData;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export interface MediaCarouselRef {
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
}

export const MediaCarousel = forwardRef<MediaCarouselRef, MediaCarouselProps>(({
  posts,
  restaurant,
  currentIndex,
  onIndexChange,
}, ref) => {
  const currentPost = posts[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useImperativeHandle(ref, () => ({
    getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
  }));

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, volume, isMuted, isPlaying]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setIsPlaying(true);
    }
  }, [currentIndex, onIndexChange]);

  const handleNext = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      onIndexChange(currentIndex + 1);
      setIsPlaying(true);
    }
  }, [currentIndex, posts.length, onIndexChange]);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

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
          ref={videoRef}
          key={currentPost.id || currentIndex}
          src={currentPost.videoUrl}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          autoPlay
          loop
          playsInline
          onClick={togglePlayPause}
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
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 19.293%, rgba(0, 0, 0, 0) 73.717%, rgba(0, 0, 0, 0.6) 100%)"
        }}
      />

      {/* Play/Pause Overlay Icon */}
      {currentPost.videoUrl && !isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlayPause}
        >
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Video Controls (top right) */}
      {currentPost.videoUrl && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>

          {/* Volume Control */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Volume Slider */}
            {showVolumeSlider && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-black/70 rounded-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 accent-white cursor-pointer"
                  style={{ writingMode: "horizontal-tb" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

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
});

MediaCarousel.displayName = "MediaCarousel";
