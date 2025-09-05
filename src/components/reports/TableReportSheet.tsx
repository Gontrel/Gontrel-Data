import React, { useState } from "react";
import { Sheet } from "@/components/modals/Sheet";
import { ReportedPostDataItem } from "@/interfaces/posts";
import { ReportDetailsCard } from "./ReportDetailsCard";
import ConfirmationModal from "../modals/ConfirmationModal";
import Icon from "../svgs/Icons";

// Corrected type definitions for clarity
export type TableReportPreviewSheetOnApprove = (
  restaurantId: string,
  postId: string
) => void;
export type TableReportPreviewSheetOnDecline = (
  restaurantId: string,
  postId: string,
  comment: string
) => void;

interface TableReportPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ReportedPostDataItem;
  onApprove?: () => void;
  onDecline?: () => void;
}

interface TableReportPreviewSheetHeaderProps {
  onOpenChange: (open: boolean) => void;
}

const TableReportPreviewSheetHeader = ({
  onOpenChange,
}: TableReportPreviewSheetHeaderProps) => {
  return (
    <section className="flex flex-row items-center justify-between pb-5 px-6 pt-9 bg-[#FFF]">
      <h2 className="text-xl font-semibold text-[#2E3032]">
        Reported videos
      </h2>
      <button
        onClick={() => onOpenChange(false)}
        aria-label="Close preview modal"
        title="Close preview modal"
      >
        <Icon
          name="cancelModalIcon"
          fill="transparent"
          width={32}
          height={32}
        />
      </button>
    </section>
  );
};

export const TableReportPreviewSheet = ({
  open,
  onOpenChange,
  data,
  onApprove,
  onDecline,
}: TableReportPreviewSheetProps) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    comment: string;
    actionType: "approve" | "decline" | null;
  }>({
    isOpen: false,
    comment: "",
    actionType: null,
  });

  const closeActionModal = () => {
    setModalState({ isOpen: false, comment: "", actionType: null });
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalState({
      ...modalState,
      comment: event.target.value,
    });
  };

  // One function to handle opening the modal for both actions
  const handleOpenActionModal = (action: "approve" | "decline") => {
    setModalState({
      isOpen: true,
      comment: "",
      actionType: action,
    });
  };

  const handleSubmitAction = () => {
    if (modalState.actionType === "approve") {
      onApprove?.();
    } else if (modalState.actionType === "decline") {
      onDecline?.();
    }
    closeActionModal();
  };

  // Simplified and corrected reporter/uploader data
  const reporter = {
    name: data?.user?.displayName ?? data?.user?.username ?? "",
    avatar: data?.user?.profileImage ?? "/images/location.png",
    date: data?.createdAt ?? "",
    comment: data?.reason ?? "",
    status: data?.status ?? "",
  };

  const uploader = {
    name: data?.post?.user?.displayName ?? data?.post?.user?.username ?? "",
    avatar: data?.post?.user?.profileImage ?? "/images/location.png",
    date: data?.post?.createdAt ?? "",
  };

  const isDecline = modalState.actionType === "decline";

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[604px]"
      className="bg-white overflow-y-auto"
    >
      <TableReportPreviewSheetHeader onOpenChange={onOpenChange} />
  
        <ReportDetailsCard
          reporter={reporter}
          uploader={uploader}
          onApprove={() => handleOpenActionModal("approve")}
          onDecline={() => handleOpenActionModal("decline")}
          status={data?.status ?? ""}
        />


      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeActionModal}
        title={isDecline ? "Decline report?" : "Approve report?"}
        description={
          isDecline
            ? "Are you sure you want to decline this report? This action cannot be undone."
            : "Are you sure you want to approve this report? This action cannot be undone."
        }
        showCommentField={false} 
        onCommentChange={handleCommentChange}
        onConfirm={handleSubmitAction}
        confirmLabel={isDecline ? "Decline report" : "Approve report"}
        cancelLabel="Cancel"
        successButtonClassName={`w-full h-18 text-white rounded-[20px] transition-colors text-[20px] font-semibold ${
          isDecline ? "bg-[#008A04]":  "bg-[#D80000]"
        }`}
      />
    </Sheet>
  );
};