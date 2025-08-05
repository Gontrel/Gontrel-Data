import React from "react";
import { ActionButtons } from "../ui/ActionButtons";
import { CenterModal } from "../ui/CenterModal";
import Icon from "../svgs/Icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  comment: string;
  onCommentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  showCommentField?: boolean;
  commentPlaceholder?: string;
  commentLabel?: string;
}

/**
 * Reusable confirmation modal with optional comment field
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  description,
  comment,
  onCommentChange,
  onConfirm,
  confirmLabel = "Send feedback",
  cancelLabel = "Cancel",
  showCommentField = true,
  commentPlaceholder = "Add comment here",
  commentLabel = "Comment",
}: ConfirmationModalProps) => {
  return (
    <CenterModal
      showCloseButton={false}
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6 justify-center items-center p-15">
        <div className="bg-gradient-to-r from-[#C7B206] to-[#C50000] rounded-full w-24 h-24 flex items-center justify-center">
          <Icon name="warningIcon" width={40} height={40} />
        </div>
        <h1 className="text-3xl font-semibold text-[#2E3032]">{title}</h1>
        <p
          className="text-xl text-[#2E3032] text-center font-medium"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {showCommentField && (
          <div className="w-full flex flex-col gap-y-4.5">
            <label htmlFor="feedback-comment" className="text-xl font-medium text-[#2E3032]">
              {commentLabel}
            </label>
            <textarea
              id="feedback-comment"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={onCommentChange}
              className="w-full px-5 py-6 border-[1.5px] border-[#D2D4D5] placeholder:text-[#9DA1A5] text-[#2E3032] rounded-[20px] resize-none text-xl font-medium"
              rows={4}
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 w-full mt-11.5">
          <ActionButtons
            className="w-full"
            actions={[
              {
                label: cancelLabel,
                onClick: onClose,
                variant: "primary",
                active: false,
                className: "w-full h-18 bg-[#F0F1F2] text-[#2E3032] rounded-[20px] transition-colors text-[20px] font-semibold",
              },
              {
                label: confirmLabel,
                onClick: onConfirm,
                variant: "danger",
                active: true,
                className: "w-full h-18 bg-[#D80000] text-white rounded-[20px] transition-colors text-[20px] font-semibold"
              },
            ]}
          />
        </div>
      </div>
    </CenterModal>
  );
};

export default ConfirmationModal