"use client";

import React from "react";

export interface FeatureToggleConfirmModalProps {
  isOpen: boolean;
  featureName: string;
  nextActionLabel: "activate" | "deactivate";
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export default function FeatureToggleConfirmModal({
  isOpen,
  featureName,
  nextActionLabel,
  onCancel,
  onConfirm,
  loading,
}: FeatureToggleConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] shadow-lg w-[520px] max-w-[92vw] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <h3 className="text-lg font-semibold text-[#2E3032]">
            Confirm action
          </h3>
        </div>
        <p className="text-sm text-[#6B7280] mb-4">
          Are you sure you want to save these feature flagging actions?
        </p>
        <div className="rounded-[12px] bg-[#F9FAFB] border border-[#E5E7EB] p-4 mb-6">
          <div className="text-xs text-[#6B7280] mb-1">Feature</div>
          <div className="text-[#2E3032] font-medium">
            {featureName} ({nextActionLabel})
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex-1 py-3 rounded-[10px] border border-[#E5E7EB] text-[#111827]"
            onClick={onCancel}
            disabled={!!loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 rounded-[10px] bg-[#0070F3] text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={!!loading}
          >
            {loading ? "Saving..." : "Confirm changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
