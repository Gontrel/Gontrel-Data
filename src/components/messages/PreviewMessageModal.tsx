"use client";

import React from "react";
import Image from "next/image";
import Icon from "../svgs/Icons";
import { VideoModal } from "../modals/VideoModal";

interface PreviewMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body: string;
  platform: string;
  type: string;
  width?: string;
  showCloseButton?: boolean;
}

const PreviewMessageModal: React.FC<PreviewMessageModalProps> = ({
  open,
  onOpenChange,
  title,
  body,
  platform,
  type,
  width = "w-[1177px]",
  showCloseButton = true,
}) => {
  const handleClose = () => onOpenChange(false);

  return (
    <VideoModal
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width={width}
      className="flex flex-row"
    >
      <div className="relative h-full flex flex-row w-full">
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 z-10"
            aria-label="Close preview modal"
            title="Close preview modal"
          >
            <Icon name="cancelModalIcon" className="w-6 h-6" />
          </button>
        )}

        {/* Preview area on the left */}
        <aside className="flex-1 p-10">
          <h2 className="text-2xl font-semibold text-[#2E3032] mb-6">Preview</h2>

          {/* Phone mock */}
          <div className="relative mx-0 bg-[#EDEEEF] rounded-[36px] w-[320px] h-[640px] border border-[#E1E2E3] flex items-start justify-center overflow-y-auto py-6">
            {/* Notch */}
            <div className="absolute top-3 w-24 h-3 rounded-full bg-[#CFD1D4]" />

            {/* Notification card */}
            <div className="mt-16 w-[280px] rounded-xl bg-white shadow-md p-3 flex items-start gap-3">
              <div className="flex-shrink-0">
                <Image src="/images/logo.png" alt="Gontrel" width={32} height={32} className="rounded-lg" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#2E3032] break-words leading-snug">
                  {title || "Title is going to show here"}
                </div>
                <div className="text-[13px] text-[#6B7280] whitespace-pre-wrap break-words leading-snug mt-1">
                  {body || "Body will appear here"}
                </div>
                <div className="mt-1 text-[11px] text-[#9CA3AF]">
                  {type} • {platform}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right transparent area to leave space for the NewMessageSheet in front */}
        <div className="w-[638px] bg-transparent flex flex-row items-center" />
      </div>
    </VideoModal>
  );
};

export default PreviewMessageModal;
