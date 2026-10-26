"use client";

import { useState, useEffect } from "react";
import { Check, X, ExternalLink, AlertTriangle } from "lucide-react";
import Icon from "@/components/svgs/Icons";
import { TIconNames } from "@/components/svgs/IconNames";
import { ApprovalStatusEnum } from "@/types/enums";

interface EditableLinkFieldProps {
  label: string;
  iconName: TIconNames;
  value: string;
  status: ApprovalStatusEnum;
  originalValue: string;
  originalStatus: ApprovalStatusEnum;
  onChange: (value: string) => void;
  onStatusChange: (status: ApprovalStatusEnum) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const EditableLinkField = ({
  label,
  iconName,
  value,
  status,
  originalValue,
  originalStatus,
  onChange,
  onStatusChange,
  placeholder = "Enter URL...",
  disabled = false,
}: EditableLinkFieldProps) => {
  const [localValue, setLocalValue] = useState(value);
  const hasChanged = localValue !== originalValue;
  const shouldShowActionableButtons = hasChanged || status === ApprovalStatusEnum.PENDING;
  const isApproved = status === ApprovalStatusEnum.APPROVED;
  const isDeclined = status === ApprovalStatusEnum.REJECTED;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);

    if (newValue !== originalValue) {
      onStatusChange(ApprovalStatusEnum.PENDING);
    } else {
      onStatusChange(originalStatus);
    }
  };

  const handleOpenLink = () => {
    if (localValue) {
      let url: string;
      if (label.toLowerCase() === "address") {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localValue)}`;
      } else {
        url = localValue.startsWith("http") ? localValue : `https://${localValue}`;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleApprove = () => {
    onStatusChange(ApprovalStatusEnum.APPROVED);
  };

  const handleDecline = () => {
    onStatusChange(ApprovalStatusEnum.REJECTED);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Icon name={iconName} className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-[#2E3032]">{label}</span>
        <button
          onClick={handleOpenLink}
          disabled={!localValue}
          className="text-blue-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
          title={label.toLowerCase() === "address" ? "Open Address in Google Maps" : `Open ${label} in new tab`}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {localValue && !shouldShowActionableButtons && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isApproved && <Check className="w-4 h-4 text-green-500" />}
            {isDeclined && <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
        )}
      </div>

      {shouldShowActionableButtons ? (
        <div className="flex gap-1">
          <button
            onClick={handleApprove}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
              isApproved
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-green-600 border-green-500 hover:bg-green-50"
            }`}
          >
            <Check className="w-4 h-4" />
            {isApproved ? "Approved" : "Approve"}
          </button>
          <button
            onClick={handleDecline}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
              isDeclined
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-red-500 border-red-500 hover:bg-red-50"
            }`}
          >
            <X className="w-4 h-4" />
            {isDeclined ? "Declined" : "Decline"}
          </button>
        </div>
      ) : (
        <div className="flex gap-1">
          {isApproved && (
            <>
              <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-medium bg-green-500 text-white">
                <Check className="w-4 h-4" />
                Approved
              </div>
              <button
                onClick={handleDecline}
                className="w-8 flex items-center justify-center py-1.5 rounded-lg text-sm font-medium border border-red-500 text-red-500 bg-white hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {isDeclined && (
            <>
              <button
                onClick={handleApprove}
                className="w-8 flex items-center justify-center py-1.5 rounded-lg text-sm font-medium border border-green-500 text-green-600 bg-white hover:bg-green-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-medium bg-red-500 text-white">
                <X className="w-4 h-4" />
                Declined
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
