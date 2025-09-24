"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface ConfirmMessageModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  type: string;
  platform: string;
  scheduleLabel?: string; // formatted schedule label if scheduled
  loading?: boolean;
}

const ConfirmMessageModal: React.FC<ConfirmMessageModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  body,
  type,
  platform,
  scheduleLabel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center")}
      aria-modal
      role="dialog"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Card */}
      <div className="relative z-10 w-[680px] max-w-[92vw] bg-white rounded-[24px] shadow-xl p-8">
        <h3 className="text-xl font-semibold text-[#2E3032] mb-6">Preview</h3>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2E3032] flex items-center gap-2">
              <span className="text-yellow-500">⚡</span>
              <span>{title || "Faster, Smoother, Better"}</span>
            </h2>
            <p className="text-[#2E3032] text-lg font-medium">
              {body || "Update your Gontrel app to see what's new inside"}
            </p>
          </div>

          <div className="h-px bg-[#E5E7EB]" />

          <div className="space-y-3 text-[#2E3032]">
            <p><span className="font-semibold">Type:</span> {type || "Push notifications"}</p>
            <p><span className="font-semibold">Platform:</span> {platform || "iOS"}</p>
            {scheduleLabel && (
              <p><span className="font-semibold">Schedule:</span> {scheduleLabel}</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button onClick={onClose} className="flex-1 bg-[#E9EBEE] text-[#2E3032] py-[16px] rounded-[14px]" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-[#0070F3] text-white py-[16px] rounded-[14px]" loading={loading} loadingText="Sending...">
            Send message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMessageModal;
