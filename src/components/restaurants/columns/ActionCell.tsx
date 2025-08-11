// components/ActionCell.tsx
import { useFeedbackStore } from "@/stores/feedbackStore";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { ApprovalStatusEnum } from "@/types/enums";
import { PendingRestaurantTableTypes } from "@/types/restaurant";

interface ActionCellProps {
  row: { original: PendingRestaurantTableTypes };
  handleSendFeedback: (restaurant: PendingRestaurantTableTypes) => void;
  handleSaveRestaurant: (restaurant: PendingRestaurantTableTypes) => void;
}

export const ActionCell = ({
  row,
  handleSendFeedback,
  handleSaveRestaurant,
}: ActionCellProps) => {
  const { sentFeedbackIds, markAsSent } = useFeedbackStore();
  const { posts, address, menu, reservation, id } = row.original;

  const hasRejected =
    posts.some((post) => post.status === ApprovalStatusEnum.REJECTED) ||
    address.status === ApprovalStatusEnum.REJECTED ||
    menu.status === ApprovalStatusEnum.REJECTED ||
    reservation.status === ApprovalStatusEnum.REJECTED;

  const hasPending =
    posts.some((post) => post.status === ApprovalStatusEnum.PENDING) ||
    address.status === ApprovalStatusEnum.PENDING ||
    menu.status === ApprovalStatusEnum.PENDING ||
    reservation.status === ApprovalStatusEnum.PENDING;

  const hasApproved =
    posts.some((post) => post.status === ApprovalStatusEnum.APPROVED) ||
    address.status === ApprovalStatusEnum.APPROVED ||
    menu.status === ApprovalStatusEnum.APPROVED ||
    reservation.status === ApprovalStatusEnum.APPROVED;

  const isFeedbackSent = sentFeedbackIds.has(id);

  let label = "";
  let variant: "danger" | "primary" = "primary";
  let disabled = true;

  if (hasRejected) {
    if (isFeedbackSent) {
      label = "Sent";
      disabled = true;
    } else {
      label = "Send Feedback";
      variant = "danger";
      disabled = false;
    }
  } else if (hasPending) {
    label = "Send Feedback";
    variant = "danger";
    disabled = true;
  } else if (hasApproved) {
    label = "Save";
    disabled = false;
  }

  return (
    <ActionButtons
      actions={[
        {
          label,
          onClick: () => {
            if (hasRejected && !isFeedbackSent) {
              handleSendFeedback(row.original);
              markAsSent(id);
            } else if (hasApproved) {
              handleSaveRestaurant(row.original);
            }
          },
          variant,
          disabled,
        },
      ]}
      className="w-42.5 h-12"
    />
  );
};
