"use client";

import React, { useCallback, useMemo, useState } from "react";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/Button";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { GenericTable } from "@/components/tables/GenericTable";
import {
  FeatureColumn,
  type FeatureRow,
  type FeatureStatus,
} from "@/components/features/FeatureColumn";
import {
  useAdminListFeatureFlags,
  useGetFeatureFlagCards,
  useToggleFeatureFlagActive,
  useCreateFeatureFlag,
} from "@/hooks/useFeatureFlaggesHook";
import FeatureToggleConfirmModal from "@/components/features/FeatureToggleConfirmModal";
import FeatureCreateModal from "@/components/features/FeatureCreateModal";

// Type for the feature pending a status toggle
type PendingToggle = {
  id: string;
  name: string;
  nextStatus: FeatureStatus;
};

export default function FeaturesPage() {
  // State for filters and pagination
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState<"All" | "Production" | "Test" | "Staging">(
    "All"
  );
  const [envOpen, setEnvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for modals and forms
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<PendingToggle | null>(
    null
  );
  const [newFeatureName, setNewFeatureName] = useState("");

  // API Hooks: Queries for fetching data
  const {
    data: cards,
    isLoading: cardsLoading,
    refetch: refetchCards,
  } = useGetFeatureFlagCards();
  const {
    data: listData,
    isLoading: listLoading,
    refetch: refetchList,
  } = useAdminListFeatureFlags({
    currentPage,
    pageSize,
    searchTerm: query || undefined,
    environment: env === "All" ? undefined : env.toLowerCase(),
  });

  // API Hooks: Mutations for creating and toggling features
  const { toggle, isToggling } = useToggleFeatureFlagActive();
  const { create, isCreating } = useCreateFeatureFlag();

  // Map API response to the format expected by the table
  const tableRows: FeatureRow[] = useMemo(() => {
    const items = listData?.data ?? [];
    const toTitleCaseEnv = (e?: string): FeatureRow["environment"] => {
      const v = (e || "").toLowerCase();
      if (v === "production") return "Production";
      if (v === "staging") return "Staging";
      return "Test";
    };
    return items.map((it: any) => ({
      id: it.id,
      name: it.name,
      environment: toTitleCaseEnv(it.environment),
      createdAt: it.createdAt,
      status: (it.enabled ? "Active" : "Inactive") as FeatureStatus,
    }));
  }, [listData]);

  // Derived state for pagination and stats
  const total = listData?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const stats = useMemo(
    () => [
      { label: "Total features", value: cards?.all ?? 0 },
      { label: "Active features", value: cards?.active ?? 0 },
      { label: "Inactive Features", value: cards?.inActive ?? 0 },
    ],
    [cards]
  );

  // Memoized table columns with a callback to handle status toggles
  const columns = useMemo(
    () =>
      FeatureColumn((rowId: string, currentStatus: FeatureStatus) => {
        const featureToToggle = tableRows.find((row) => row.id === rowId);
        if (featureToToggle) {
          setPendingToggle({
            id: featureToToggle.id,
            name: featureToToggle.name,
            nextStatus: currentStatus === "Active" ? "Inactive" : "Active",
          });
          setToggleModalOpen(true);
        }
      }),
    [tableRows]
  );

  // Handlers
  const handleSearch = useCallback((val: string) => {
    setQuery(val);
    setCurrentPage(1);
  }, []);

  const handleSelectEnv = useCallback(
    (value: "All" | "Production" | "Test" | "Staging") => {
      setEnv(value);
      setEnvOpen(false);
      setCurrentPage(1);
    },
    []
  );

  const handleToggleConfirm = async () => {
    if (!pendingToggle) return;
    await toggle({
      featureFlagId: pendingToggle.id,
    });
    setToggleModalOpen(false);
    setPendingToggle(null);
    await Promise.all([refetchList(), refetchCards()]);
  };

  const handleCreateFeature = async () => {
    const payload = {
      name: newFeatureName.trim(),
    };
    if (!payload.name) return;
    await create(payload);
    setCreateModalOpen(false);
    setNewFeatureName("");
    await Promise.all([refetchList(), refetchCards()]);
  };

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        <StatsGrid
          className="lg:grid-cols-3"
          stats={stats}
          loading={cardsLoading}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5">
          <div className="flex-1 gap-4.5 flex flex-row justify-between w-full">
            <SearchBar
              value={query}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
            <div className="flex items-center gap-4.5">
              <div className="relative">
                <button
                  className="flex items-center justify-between min-w-[180px] px-4 py-2 rounded-[10px] border border-[#E5E7EB] bg-white text-sm"
                  onClick={() => setEnvOpen((s) => !s)}
                >
                  <span>{env === "All" ? "All environments" : env}</span>
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
                {envOpen && (
                  <div className="absolute right-0 mt-2 w-[200px] rounded-[10px] border border-[#E5E7EB] bg-white shadow p-1 z-10">
                    {["All", "Production", "Test", "Staging"].map((e) => (
                      <button
                        key={e}
                        className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#F9FAFB] text-sm"
                        onClick={() => handleSelectEnv(e as any)}
                      >
                        {e === env ? "✓ " : ""}
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center w-full sm:w-auto">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#0070F3] text-white px-[12px] py-[16px] rounded-[10px] gap-2"
            >
              <span>+ New feature</span>
            </Button>
          </div>
        </div>

        <GenericTable<FeatureRow>
          data={tableRows}
          loading={listLoading}
          showSelection={false}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)}
        />
      </div>

      {/* Modal Components */}
      <FeatureToggleConfirmModal
        isOpen={toggleModalOpen && !!pendingToggle}
        featureName={pendingToggle?.name ?? "Feature"}
        nextActionLabel={
          pendingToggle?.nextStatus === "Active" ? "activate" : "deactivate"
        }
        loading={isToggling}
        onCancel={() => setToggleModalOpen(false)}
        onConfirm={handleToggleConfirm}
      />

      <FeatureCreateModal
        isOpen={createModalOpen}
        name={newFeatureName}
        onChangeName={setNewFeatureName}
        onClose={() => setCreateModalOpen(false)}
        loading={isCreating}
        onCreate={handleCreateFeature}
      />
    </div>
  );
}
