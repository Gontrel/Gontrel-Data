/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/admin/SearchBar";
import {
  useGetCompetitionById,
  useGetCompetitionParticipants,
  useToggleCompetitionActive,
} from "@/hooks/useCompetitions";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import WinnerSelectionModal, {
  WinnerParticipant,
} from "@/components/modals/WinnerSelectionModal";

interface Participant {
  id: string;
  displayName: string;
  email: string;
  profileImage: string;
  referralCount: number;
  totalSubmission: number;
}


export default function CompetitionDetailPage() {
  const params = useParams<{ competitionId: string }>();
  const competitionId = params?.competitionId;

  const { data: apiData, refetch: refetchCompetition } =
    useGetCompetitionById(competitionId);
  const { toggleCompetition, isLoading: isToggling } =
    useToggleCompetitionActive();
  // Modal flow state
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showConfirmWinners, setShowConfirmWinners] = useState(false);
  const [selectedWinnerIds, setSelectedWinnerIds] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const data = useMemo(() => {
    if (apiData) {
      const base: any = Array.isArray(apiData)
        ? apiData[0]
        : (apiData as any)?.data ?? apiData;
      const idRaw = base?.id ?? base?.competitionId ?? competitionId;
      const participants = (base?.participants ?? []).map(
        (p: any, i: number) => ({
          id: p?.id ?? `#${idRaw}-${i + 1}`,
          name: p?.name ?? p?.username ?? "Participant",
          avatar: p?.avatar ?? "/images/Avatar.png",
          totalSubmission: p?.totalSubmission ?? p?.submissions ?? 0,
        })
      );
      const condition = base?.aggregation
        ? `${String(base.aggregation).replace(/_/g, " ")}${
            base?.aggregationValue !== undefined
              ? ` = ${base.aggregationValue}`
              : ""
          }`
        : undefined;

      return {
        id: String(idRaw).startsWith("#") ? String(idRaw) : `#${String(idRaw)}`,
        title: base?.title ?? "Competition",
        condition,
        type: base?.type,
        endDateISO: base?.endDate ?? base?.endDateISO,
        totalParticipants: base?.totalParticipants ?? participants.length,
        eligibleWinners: base?.eligibleWinners,
        eligibleQualifiers: base?.eligibleQualifiers,
        participants,
      };
    }
  }, [apiData, competitionId]);

  const [participantsPage, setParticipantsPage] = useState(1);
  const { data: participantsRes } = useGetCompetitionParticipants({
    pageNumber: participantsPage,
    quantity: 10,
    searchTerm,
  });

  // Entry point from button: open the first confirmation modal
  const handleEndCompetitionClick = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  // After first confirm: open winner selection
  const handleConfirmEnd = useCallback(() => {
    setShowEndConfirm(false);
    setShowWinnersModal(true);
  }, []);

  // After saving selected winners: open final confirmation
  const handleSaveWinners = useCallback((ids: string[]) => {
    setSelectedWinnerIds(ids);
    setShowWinnersModal(false);
    setShowConfirmWinners(true);
  }, []);

  // Final confirmation: call toggle, then refetch
  const handleConfirmWinners = useCallback(async () => {
    if (!competitionId) return;
    await toggleCompetition({
      competitionId: competitionId,
      winners: selectedWinnerIds,
    });
    setShowConfirmWinners(false);
    await refetchCompetition();
  }, [competitionId, toggleCompetition, selectedWinnerIds, refetchCompetition]);

  // Source for the scrollable list
  const participantsSrc = useMemo(() => {
    const arr = (participantsRes?.data as any[]) ?? data?.participants ?? [];
    return arr;
  }, [participantsRes?.data, data?.participants]);

  // Filter against participantsSrc
  const filteredParticipants: Participant[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const src = participantsSrc;
    if (!term) return src;
    return src.filter(
      (p: any) =>
        (p.name || p.displayName || "").toLowerCase().includes(term) ||
        (p.id || "").toLowerCase().includes(term)
    );
  }, [participantsSrc, searchTerm]);

  // Load more button (simple pagination)
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    participantsRes?.pagination && (
      <div className="mt-3">
        <Button
          onClick={() => {
            setParticipantsPage((p) => p + 1);
          }}
          className="bg-white text-[#0070F3] border border-[#E5E7EB] px-3 py-2 rounded-[10px]"
        >
          Load more
        </Button>
      </div>
    );
  }
  const formatLongDate = useCallback((iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const s = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return s.replace(/ (\d{4})$/, ", $1");
  }, []);

  return (
    <>
      <ConfirmationModal
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        title="End competition?"
        description="Are you sure you want to end this competition? You will be prompted to select the winner(s)."
        showCommentField={false}
        cancelLabel="Cancel"
        confirmLabel="End competition"
        onConfirm={handleConfirmEnd}
      />

      <WinnerSelectionModal
        isOpen={showWinnersModal}
        onClose={() => setShowWinnersModal(false)}
        participants={participantsSrc as WinnerParticipant[]}
        maxWinners={data?.eligibleWinners ?? 1}
        onSave={handleSaveWinners}
      />

      <ConfirmationModal
        isOpen={showConfirmWinners}
        onClose={() => setShowConfirmWinners(false)}
        title="Confirm winner selection?"
        description={`You selected ${selectedWinnerIds.length} winner(s). Proceed to confirm?`}
        showCommentField={false}
        cancelLabel="Cancel"
        confirmLabel="Confirm winners"
        successButtonClassName="w-full h-18 bg-[#0070F3] text-white rounded-[20px] transition-colors text-[20px] font-semibold"
        onConfirm={handleConfirmWinners}
      />

      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full">
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Top card */}
              <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-6 relative">
                {/* Completed badge when inactive */}
                {data?.type && data?.endDateISO && !apiData?.isActive && (
                  <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Completed
                  </span>
                )}
                <div className="text-sm text-[#9CA3AF]">{data?.id}</div>
                <h2 className="text-2xl font-semibold text-[#2E3032] mt-1">
                  {data?.title}
                </h2>
                {!!data?.condition && (
                  <div className="text-[#6B7280] mt-1">
                    Condition: {data?.condition}
                  </div>
                )}
                <div className="mt-4 text-[#2E3032]">
                  <span className="font-semibold text-lg">Type:</span> {data?.type}{" "}
                  <span className="mx-2">|</span>
                  <span className="font-semibold text-lg">End:</span>{" "}
                  {data?.endDateISO ? formatLongDate(data?.endDateISO) : "-"}
                </div>

                <div className="mt-4">
                  <span className="font-semibold text-lg text-[#2E3032]">
                    Date ended:
                  </span>{" "}
                  {formatLongDate(data?.endDateISO)}
                </div>
              </div>

              {/* Completed info card ) */}
              {
                <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-9">
                  <div className="text-sm text-[#9CA3AF]">Complete summary</div>
                  <div className="mt-[30px] grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-[#2E3032] font-medium mb-2">
                        {data?.totalParticipants ?? 0}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        Total participants
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[#2E3032] font-medium mb-2 ">
                        {data?.eligibleWinners ?? 0}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        Total winners
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[#2E3032] font-medium mb-2">
                        {data?.eligibleWinners ?? 0}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        Total eligible winners
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            {/* Right column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[]">
                    {apiData?.isActive && (
                      <span className="text-xs text-[#9CA3AF]">
                        Participants {participantsRes?.pagination?.total ?? 0}
                      </span>
                    )}

                    {!apiData?.isActive && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2E3032] font-medium">
                          Winner
                        </span>
                        <span className="text-xs text-[#9CA3AF]">
                          participant
                        </span>
                      </div>
                    )}
                  </h3>

                  {apiData?.isActive && (
                    <Button
                      onClick={handleEndCompetitionClick}
                      disabled={isToggling}
                      className="border border-[#E5E7EB]  bg-[#D80000] px-3 py-2 rounded-[10px]"
                    >
                      {isToggling ? "Ending..." : "End competition"}
                    </Button>
                  )}
                </div>

                <div className="mb-4">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search using name or ID"
                  />
                </div>

                <div className="space-y-3 max-h-[90vh] overflow-y-auto pr-1 ">
                  {filteredParticipants?.map((p: any) => (
                    <div
                      key={p?.id}
                      className="flex items-center justify-between bg-[#FAFAFA] rounded-[16px] border border-[#E5E7EB] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={p?.profileImage ?? "/images/logo.png"}
                          alt={p?.displayName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="text-xs text-[#9CA3AF]">
                            {data?.id}
                          </div>
                          <div className="text-[16px] font-semibold text-[#2E3032]">
                            {p?.displayName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#9CA3AF]">
                          Total submission
                        </div>
                        <div className="text-[16px] font-semibold text-[#2E3032]">
                          {p?.referralCount ?? 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
