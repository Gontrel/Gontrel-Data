"use client";

import { useEffect, useRef } from "react";
import { VideoOverlay } from "./VideoOverlay";
import { VideoPlayer } from "./VideoPlayer";
import { Restaurant, RestaurantData } from "@/interfaces/restaurants";

/**
 * Props interface for the GontrelPostView component
 */
interface GontrelPostViewProps {
  /** The URL of the video to display */
  videoUrl: string | null;
  restaurantData: RestaurantData | Restaurant | undefined;
  tiktokUsername?: string | null;
  width?: string;
  height?: string;
  borderRadius?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export const GontrelPostView = ({
  videoUrl,
  restaurantData,
  tiktokUsername,
  width = "w-[448px]",
  height = "h-[564px]",
  borderRadius = "rounded-[15px]",
  autoPlay = false,
  muted = true,
  loop = true,
  className = "",
  onPlay,
  onPause,
}: GontrelPostViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Toggles video play/pause state
   */
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  /**
   * Handles video play event
   */
  const handlePlay = () => {
    onPlay?.();
  };

  /**
   * Handles video pause event
   */
  const handlePause = () => {
    onPause?.();
  };

  // Clean up video when URL changes
  useEffect(() => {
    if (!videoUrl && videoRef.current) {
      videoRef.current.src = "";
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div
        className={`${width} ${height} flex items-center justify-center bg-gray-100 ${borderRadius} ${className}`}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Enter a TikTok URL to see a preview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <VideoPlayer
        videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        src={videoUrl}
        className={`${borderRadius} ${width} ${height} object-cover`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <VideoOverlay
        onTogglePlay={togglePlay}
        restaurantName={restaurantData?.name || ""}
        menuLink={
          typeof restaurantData?.menu === "string"
            ? restaurantData?.menu || ""
            : restaurantData?.menu?.content
        }
        bookLink={
          typeof restaurantData?.reservation === "string"
            ? restaurantData?.reservation || ""
            : restaurantData?.reservation?.content
        }
        deliveryTime={"0 min"}
        openingHours="12:00pm - 2:00pm"
        rating={restaurantData?.rating || 0}
        tiktokUsername={tiktokUsername || ""}
      />
    </div>
  );
};

export type { GontrelPostViewProps };
