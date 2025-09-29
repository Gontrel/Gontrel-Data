import React, { useMemo, useState } from "react";
import Image from "next/image";
import { CenterModal } from "../ui/CenterModal";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/Button";

export interface WinnerParticipant {
  id: string;
  displayName?: string;
  profileImage?: string;
  referralCount?: number;
}

interface WinnerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: WinnerParticipant[];
  maxWinners: number;
  onSave: (selectedIds: string[]) => void;
  onAutoSelect?: () => void;
}

const WinnerSelectionModal: React.FC<WinnerSelectionModalProps> = ({
  isOpen,
  onClose,
  participants,
  maxWinners,
  onSave,
  onAutoSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return participants;
    return participants.filter((p) =>
      (p.displayName || "").toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
  }, [participants, searchTerm]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const nextVal = !prev[id];
      // prevent selecting more than maxWinners
      if (nextVal && selectedCount >= maxWinners) return prev;
      return { ...prev, [id]: nextVal };
    });
  };

  const handleSave = () => {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onSave(ids);
  };

  const handleAutoSelect = () => {
    if (onAutoSelect) return onAutoSelect();
    // Default auto-select: top N by referralCount
    const sorted = [...participants]
      .sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0))
      .slice(0, Math.max(0, maxWinners));
    const map: Record<string, boolean> = {};
    sorted.forEach((p) => (map[p.id] = true));
    setSelected(map);
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
    //   width="3xl"
      className="bg-white"
      showCloseButton
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2E3032]">Select winner(s)</h2>
            <div className="text-sm text-[#6B7280] mt-1">{selectedCount} / {maxWinners}</div>
          </div>
          <button
            className="text-[#0070F3] text-sm font-medium"
            onClick={handleAutoSelect}
            type="button"
          >
            Auto-select
          </button>
        </div>

        <div className="mt-4">
          <div className="text-sm text-[#2E3032] mb-2">Participants</div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search using name or ID" />
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto mt-4 pr-1">
          {filtered.map((p) => {
            const checked = !!selected[p.id];
            const canSelectMore = selectedCount < maxWinners || checked;
            return (
              <label
                key={p.id}
                className={`flex items-center justify-between bg-[#FAFAFA] rounded-[16px] border border-[#E5E7EB] p-3 cursor-pointer ${!canSelectMore ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={checked}
                    onChange={() => toggle(p.id)}
                    disabled={!canSelectMore}
                  />
                  <Image src={p.profileImage || "/images/Avatar.png"} alt={p.displayName || "Participant"} width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="text-xs text-[#9CA3AF]">#{p.id}</div>
                    <div className="text-[16px] font-semibold text-[#2E3032]">{p.displayName || "Participant"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9CA3AF]">Total submission</div>
                  <div className="text-[16px] font-semibold text-[#2E3032]">{p.referralCount ?? 0}</div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            className="w-full bg-[#0070F3] text-white rounded-[12px] h-12"
          >
            Save selection
          </Button>
        </div>
      </div>
    </CenterModal>
  );
};

export default WinnerSelectionModal;


