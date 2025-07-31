"use client";

import { useEffect, useRef, useState } from "react";
import { VideoModal } from "../modals/VideoModal";
import { VideoOverlay } from "./VideoOverlay";
import Icon from "../svgs/Icons";
import { useVideoStore, RestaurantData } from "@/stores/videoStore";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

}

const PreviewVideoModal = ({ open, onOpenChange, }: PreviewModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { activeVideoUrl, restaurantData, tiktokUsername, setActiveVideoUrl } = useVideoStore();

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Clean up when modal closes
  useEffect(() => {
    if (!open && videoRef.current) {
      // Reset the iframe to stop playback
      videoRef.current.src = "";
    }
  }, [open]);

  const handleClose = () => {
    setActiveVideoUrl(null);
  };

  return (
    <VideoModal
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[1177px]"
      className="flex flex-row z-30"
    >
      <div className="relative h-full flex flex-row">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"
        >
          <Icon name="cancelModalIcon" className="w-6 h-6" />
        </button>
        {/* Transparent Left Side (638px) - Shows content behind */}
        <div className="w-[638px] bg-transparent flex flex-row items-center">
          <section className="w-[539px] h-full flex flex-col items-center mt-[33px]">
            <h2 className="text-2xl font-semibold font-figtree self-start text-[#2E3032] ml-[40px]">
              Video Preview
            </h2>

            <div className="mt-[40px]">
              {activeVideoUrl ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={activeVideoUrl}
                    className="rounded-[15px] w-[448px] h-[564px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onPlay={() => setIsPaused(false)}
                    onPause={() => setIsPaused(true)}
                  />
                  <VideoOverlay
                    isPaused={isPaused}
                    onTogglePlay={togglePlay}
                    restaurantName={restaurantData.name || ""}
                    rating={restaurantData.rating || 0}
                    tiktokUsername={tiktokUsername || ""}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Enter a TikTok URL to see a preview.
                  </p>
                </div>
              )}
            </div>
          </section>
          <aside className="flex"></aside>
        </div>

        {/* Gray Right Side (Scrollable Content) */}
        <div className="flex-1 bg-transparent flex flex-col overflow-y-auto"></div>
      </div>
    </VideoModal>
  );
};

export { PreviewVideoModal };
