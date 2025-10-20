import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";

export type FeatureStatus = "Active" | "Inactive";
export type FeatureEnvironment = "Production" | "Test" | "Staging";

export interface FeatureRow {
  id: string;
  name: string;
  environment: FeatureEnvironment;
  createdAt: string; // ISO string
  status: FeatureStatus;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-2 ${
        active ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: FeatureStatus;
  onChange: (v: FeatureStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between min-w-[128px] px-3 py-2 rounded-[10px] border border-[#E5E7EB] bg-white text-sm"
      >
        <span className="flex items-center">
          <StatusDot active={value === "Active"} /> {value}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white shadow p-1 z-10">
          {["Active", "Inactive"].map((opt) => (
            <button
              key={opt}
              className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F9FAFB] text-sm"
              onClick={() => {
                onChange(opt as FeatureStatus);
                setOpen(false);
              }}
            >
              <span className={`flex items-center ${opt === "Active" ? "bg-[#E6F9E6]" : "bg-[#FDE6E6] rounded-[4px]"}`}> 
                <StatusDot active={opt === "Active"} /> {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const FeatureColumn = (
  onStatusChange?: (rowId: string, status: FeatureStatus) => void
): ColumnDef<FeatureRow>[] => [
  {
    id: "feature",
    header: () => <span className="text-sm text-[#6B7280]">Feature</span>,
    cell: ({ row }) => (
      <div className="flex flex-col py-3">
        <div className="text-[#2E3032] font-medium">{row.original.name}</div>
        <div className="text-xs text-[#9CA3AF]">{row.original.id}</div>
      </div>
    ),
  },
  {
    id: "environment",
    header: () => <span className="text-sm text-[#6B7280]">Environment</span>,
    cell: ({ row }) => (
      <div className="text-left text-[15px] font-medium text-[#2E3032]">
        {row.original.environment}
      </div>
    ),
  },
  {
    id: "date",
    header: () => <span className="text-sm text-[#6B7280]">Date created</span>,
    cell: ({ row }) => (
      <div className="text-left text-[15px] font-medium text-[#2E3032]">
        {formatDate(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    id: "status",
    header: () => <span className="text-sm text-[#6B7280]">Status</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <StatusDropdown
          value={row.original.status}
          onChange={(v) => onStatusChange?.(row.original.id, v)}
        />
      </div>
    ),
  },
];
