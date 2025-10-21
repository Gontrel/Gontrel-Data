"use client";

import React from "react";
import Icon from "../svgs/Icons";
import { Button } from "../ui/Button";
import { formatDate } from "@/lib/utils";
import { Sheet } from "../modals/Sheet";

interface MessageConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body: string;
  type: string;
  platform: string;
  dateISO?: string; 
  onSendAgain?: () => void;
  onDelete?: () => void;
}

const MessageConfirmationModal: React.FC<MessageConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  body,
  type,
  platform,
  dateISO,
  onSendAgain,
  onDelete,
}) => {
  const handleClose = () => onOpenChange(false);
  const dateLabel = dateISO ? formatDate(new Date(dateISO)) : formatDate(new Date());

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[638px]"
      className="flex flex-row justify-center z-50"
    >
      <div className="py-6 w-[518px] flex flex-col justify-between">
        <section>
          {/* Header */}
          <div className="flex flex-row justify-between mb-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#2E3032] flex items-center gap-2">
                <span className="text-yellow-500">⚡</span>
                <span>{title || "Faster, Smoother, Better"}</span>
              </h2>
              <p className="text-[#2E3032] text-lg font-medium">
                {body || "Update your Gontrel app to see what's new inside"}
              </p>
            </div>
            <button
              onClick={handleClose}
              title="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Icon name="cancelModalIcon" className="w-6 h-6" />
            </button>
          </div>

          {/* Meta details */}
          <div className="space-y-2 text-[#2E3032]">
            <p>
              <span className="font-semibold">Type:</span> {type || "Push notifications"}
            </p>
            <p>
              <span className="font-semibold">Platform:</span> {platform || "iOS"}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {dateLabel}
            </p>
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-[#E5E7EB]" />

          {/* Simple mock chart placeholder */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <div className="grid grid-cols-7 gap-3 items-end h-40">
              {["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].map((day, idx) => {
                const height = idx === 5 ? 80 : 56; // mock highlight Sat
                const isActive = idx === 5;
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 rounded-md ${isActive ? "bg-[#0070F3]" : "bg-[#E5E7EB]"}`}
                      style={{ height: `${height}px` }}
                      title={isActive ? `${0} Impressions` : undefined}
                    />
                    <span className="text-xs text-[#6B7280]">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button onClick={onSendAgain} className="flex-1 bg-[#0070F3] text-white py-[16px] rounded-[14px]">
            Send again
          </Button>
          <Button onClick={onDelete} className="flex-1 bg-white text-[#EF4444] border border-[#E5E7EB] py-[16px] rounded-[14px]">
            Delete
          </Button>
        </div>
      </div>
    </Sheet>
  );
};

export default MessageConfirmationModal;
