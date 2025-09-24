"use client";

import React from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { Button } from "../ui/Button";

export type MessageSchedule = "immediately" | "scheduled";
export type MessageType = "In-App notification" | "Push notification" | "Email";
export type MessagePlatform = "Android" | "iOS" | "Android & iOS" | "Web";

export interface NewMessageFormState {
  title: string;
  body: string;
  type: MessageType;
  platform: MessagePlatform;
  schedule: MessageSchedule;
  scheduledFor?: string; // ISO datetime string
}

interface NewMessageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: NewMessageFormState;
  onChange: (patch: Partial<NewMessageFormState>) => void;
  onSubmit: () => void;
}

export const NewMessageSheet: React.FC<NewMessageSheetProps> = ({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      width="w-[638px]"
      className="flex flex-row justify-center"
    >
      <div className="py-6 w-[518px] flex flex-col justify-between">
        <section>
          <div className="flex flex-row justify-between mb-7">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#2E3032] mb-2">
                New message
              </h2>
              <p className=" text-[#2E3032] text-lg font-medium ">
                Communicate with your users
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

          <div className="w-full space-y-6">
            {/* Message title */}
            <div>
              <label className="block text-[20px] font-semibold text-[#2E3032]">
                Message title
              </label>
              <input
                type="text"
                placeholder="Title here"
                value={value.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              />
            </div>

            {/* Message body */}
            <div>
              <label className="block text-[20px] font-semibold text-[#2E3032]">
                Message body
              </label>
              <textarea
                placeholder="Body here"
                value={value.body}
                onChange={(e) => onChange({ body: e.target.value })}
                rows={4}
                className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3] resize-none"
              />
            </div>

            {/* Message type */}
            <div>
              <label className="block text-[20px] font-semibold text-[#2E3032]">
                Message type
              </label>
              <select
                className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                value={value.type}
                onChange={(e) =>
                  onChange({ type: e.target.value as MessageType })
                }
              >
                <option>In-App message</option>
                <option>Push notification</option>
                <option>Email</option>
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-[20px] font-semibold text-[#2E3032]">
                Platform
              </label>
              <select
                className="mt-3 w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                value={value.platform}
                onChange={(e) =>
                  onChange({ platform: e.target.value as MessagePlatform })
                }
              >
                <option>iOS</option>
                <option>Android</option>
                <option>Android & iOS</option>
                <option>Web</option>
              </select>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-[20px] font-semibold text-[#2E3032]">
                Message schedule
              </label>
              <div className="mt-3 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={value.schedule === "immediately"}
                    onChange={() =>
                      onChange({
                        schedule: "immediately",
                        scheduledFor: undefined,
                      })
                    }
                  />
                  <span>Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={value.schedule === "scheduled"}
                    onChange={() => onChange({ schedule: "scheduled" })}
                  />
                  <span>Scheduled</span>
                </label>
              </div>

              {value.schedule === "scheduled" && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    value={value.scheduledFor ?? ""}
                    onChange={(e) => onChange({ scheduledFor: e.target.value })}
                    className="w-full px-[16px] py-[18px] border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Button
            onClick={onSubmit}
            className="w-full bg-[#0070F3] text-white py-[16px] rounded-[14px]"
          >
            Submit
          </Button>
        </div>
      </div>
    </Sheet>
  );
};

export default NewMessageSheet;
