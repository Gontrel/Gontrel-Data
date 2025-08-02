"use client";

import React from "react";
import { VideoModal } from "./VideoModal";
import Icon from "../svgs/Icons";
import { useVideoStore } from "@/stores/videoStore";

interface PreviewModalProps {
  width?: string;
  showCloseButton?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const PreviewVideoModal = ({ open, onOpenChange, children, width = "w-[1177px]", showCloseButton = true }: PreviewModalProps) => {
  const { setActiveVideoUrl } = useVideoStore();

  const handleClose = () => {
    setActiveVideoUrl(null);
  };

  return (
    <VideoModal
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width={width}
      className="flex flex-row z-30"
    >
      <div className="relative h-full flex flex-row">
        {showCloseButton && <button
          onClick={handleClose}
          className=" right-6 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close preview modal"
          title="Close preview modal"
        >
          <Icon name="cancelModalIcon" className="w-6 h-6" />
        </button>}
        {/* Transparent Left Side (638px) - Shows content behind */}
        <div className="w-[638px] bg-transparent flex flex-row items-center">
          <section className="w-[539px] h-full flex flex-col items-center mt-[33px]">
            <h2 className="text-2xl font-semibold self-start text-[#2E3032] ml-[40px]">
              Video preview
            </h2>

            <div className="mt-[40px]">
              {children}
            </div>
          </section>
          <aside className="flex">
          </aside>
        </div>

        {/* Gray Right Side (Scrollable Content) */}
        <div className="flex-1 bg-transparent flex flex-col overflow-y-auto z-10"></div>
      </div>
    </VideoModal>
  );
};

export { PreviewVideoModal };
