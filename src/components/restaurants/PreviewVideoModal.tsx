"use client";

import { useEffect, useRef, useState } from "react";
import { VideoModal } from "../modals/VideoModal";
import { VideoOverlay } from "./VideoOverlay";
import { useVideoStore, VideoState } from "@/stores/videoStore";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreviewVideoModal = ({
  open,
  onOpenChange,
}: PreviewModalProps) => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const activeVideoUrl = useVideoStore((state: VideoState) => state.activeVideoUrl);

  // Extract TikTok video ID from URL
  const getTiktokId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:tiktok\.com\/)(?:@[\w.-]+\/video\/|v\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const videoId = getTiktokId(activeVideoUrl);
  const embedUrl = videoId
    ? `https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`
    : null;

  const togglePlay = () => {
    if (videoRef.current && videoRef.current.contentWindow) {
      const command = isPaused ? 'playVideo' : 'pauseVideo';
      videoRef.current.contentWindow.postMessage({ type: command }, '*');
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    // When the embed URL changes, reload the iframe to ensure the API is ready.
    if (embedUrl && videoRef.current) {
      videoRef.current.src = embedUrl;
      setIsPaused(true);
    } else if (!embedUrl && videoRef.current) {
      videoRef.current.src = "";
    }
  }, [embedUrl]);

  // Clean up when modal closes
  useEffect(() => {
    if (!open && videoRef.current) {
      // Reset the iframe to stop playback
      videoRef.current.src = "";
    }

    console.log("activeVideoUrl", activeVideoUrl);
  }, [open]);

  return (
    <VideoModal
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[1177px]"
      className="flex flex-row z-30"
    >
      <div className="relative h-full flex flex-row">
        {/* Transparent Left Side (638px) - Shows content behind */}
        <div className="w-[638px] bg-transparent">

          <div className="flex-shrink-0 ">
              <h2 className="text-2xl font-semibold ">Video Preview</h2>
          </div>
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            {embedUrl ? (
              <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                <iframe
                  ref={videoRef}
                  src={embedUrl}
                  className="w-full h-full rounded-lg shadow-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <VideoOverlay 
                  isPaused={isPaused} 
                  onTogglePlay={togglePlay}
                  restaurantName="Burger Villa"
                  rating={4.5}
                  tiktokUsername="Kingvsleyyy1009"
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Enter a TikTok URL to see a preview.</p>
              </div>
            )}
          </div>
        </div>

        {/* Gray Right Side (Scrollable Content) */}
        <div className="flex-1 bg-transparent flex flex-col overflow-y-auto"></div>
      </div>
    </VideoModal>
  );
};

export { PreviewVideoModal };

//   <div className="flex-shrink-0 ">
//     <div className="flex items-center justify-between">
//       <h2 className="text-2xl font-semibold ">Video Preview</h2>
//       <button
//         onClick={() => onOpenChange(false)}
//         className="p-2 rounded-full hover:bg-gray-100"
//       >
//         ✕
//       </button>
//     </div>
//   </div>

//   <div className="flex-grow overflow-y-auto pr-4 -mr-4">
//     {embedUrl ? (
//       <div className="aspect-[9/16] w-full max-w-md mx-auto">
//         <iframe
//           ref={videoRef}
//           src={embedUrl}
//           className="w-full h-full rounded-lg shadow-lg"
//           allowFullScreen
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         />
//       </div>
//     ) : (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Invalid TikTok URL</p>
//       </div>
//     )}
//   </div>
