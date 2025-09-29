"use client";

import React, { useCallback } from "react";

export interface FeatureCreateModalProps {
  isOpen: boolean;
  name: string;
  onChangeName: (val: string) => void;
  onClose: () => void;
  onCreate: () => Promise<void> | void;
  loading?: boolean;
}

export default function FeatureCreateModal({
  isOpen,
  name,
  onChangeName,
  onClose,
  onCreate,
  loading,
}: FeatureCreateModalProps) {
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && name.trim() && !loading) {
        await onCreate();
      }
    },
    [name, loading, onCreate]
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[16px] shadow-lg w-[520px] max-w-[92vw] p-6">
        <div className="flex items-start justify-between mb-8">
          <h3 className="text-lg font-semibold text-[#2E3032]">New feature</h3>
          <button className="text-[#6B7280]" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="block text-sm text-[#374151] mb-4">
          Feature name
        </label>
        <input
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] outline-none focus:ring-2 focus:ring-[#0070F3] mb-[80px]"
          placeholder="Name here"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-full py-3 rounded-[10px] bg-[#0070F3] text-white disabled:opacity-60"
          onClick={onCreate}
          disabled={loading || !name.trim()}
        >
          {loading ? "Creating..." : "Create Feature"}
        </button>
      </div>
    </div>
  );
}
