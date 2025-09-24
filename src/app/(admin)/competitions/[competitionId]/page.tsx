"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/admin/SearchBar";
import { formatDate } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  totalSubmission: number;
}

interface CompetitionDetailData {
  id: string; // like #12345678
  title: string;
  condition: string; // e.g., Referral = 2
  type: string; // referral program
  endDateISO: string;
  totalParticipants: number;
  eligibleWinners: number;
  eligibleQualifiers: number;
  participants: Participant[];
}

function buildMockDetail(idParam: string): CompetitionDetailData {
  const id = `#${idParam}`;
  const participants: Participant[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `#${idParam}-${i + 1}`,
    name: i % 2 ? "James Gunn" : "Sofia Perez",
    avatar: "/images/Avatar.png",
    totalSubmission: 3,
  }));
  return {
    id,
    title: "Bambino competition",
    condition: "Referral = 2",
    type: "referral program",
    endDateISO: new Date(2025, 8, 2).toISOString(),
    totalParticipants: 20,
    eligibleWinners: 10,
    eligibleQualifiers: 20,
    participants,
  };
}

export default function CompetitionDetailPage() {
  const params = useParams<{ competitionId: string }>();
  const router = useRouter();
  const competitionId = params?.competitionId || "123456";

  const data = useMemo(() => buildMockDetail(competitionId), [competitionId]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredParticipants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data.participants;
    return data.participants.filter(
      (p) => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
  }, [data.participants, searchTerm]);

  const handleBack = useCallback(() => {
    router.push("/competitions");
  }, [router]);

  const handleEndCompetition = useCallback(() => {
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full">


        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top card: title/condition/type/end */}
            <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-6">
              <div className="text-sm text-[#9CA3AF]">{data.id}</div>
              <h2 className="text-2xl font-semibold text-[#2E3032] mt-1">{data.title}</h2>
              <div className="text-[#6B7280] mt-1">Condition: {data.condition}</div>
              <div className="mt-4 text-[#2E3032]">
                <span className="font-medium">Type:</span> {data.type} <span className="mx-2">|</span>
                <span className="font-medium">End:</span> {formatDate(new Date(data.endDateISO))}
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-6">
              <h3 className="text-sm text-[#6B7280] mb-4">Competition summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#2E3032]">{data.totalParticipants}</div>
                  <div className="text-sm text-[#6B7280]">Total participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#2E3032]">{data.eligibleWinners}</div>
                  <div className="text-sm text-[#6B7280]">Eligible winners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#2E3032]">{data.eligibleQualifiers}</div>
                  <div className="text-sm text-[#6B7280]">Eligible qualifiers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#2E3032]">Participants</h3>
                <Button onClick={handleEndCompetition} className="bg-white text-[#EF4444] border border-[#E5E7EB] px-3 py-2 rounded-[10px]">
                  End competition
                </Button>
              </div>

              <div className="mb-4">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search using name or ID" />
              </div>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {filteredParticipants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-[#FAFAFA] rounded-[16px] border border-[#E5E7EB] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Image src={p.avatar} alt={p.name} width={40} height={40} className="rounded-full" />
                      <div>
                        <div className="text-xs text-[#9CA3AF]">{data.id}</div>
                        <div className="text-[16px] font-semibold text-[#2E3032]">{p.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#9CA3AF]">Total submission</div>
                      <div className="text-[16px] font-semibold text-[#2E3032]">{p.totalSubmission}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
