import { ActionButtons } from "@/components/ui/ActionButtons";
import { ApprovalStatusEnum } from "@/types/enums";
import { PendingRestaurantTableTypes } from "@/types/restaurant";

interface SaveCommentCellProps {
  row: { original: PendingRestaurantTableTypes };
  onRequestComment: (restaurant: PendingRestaurantTableTypes) => void;
}

export const SaveCommentCell = ({
  row,
  onRequestComment,
}: SaveCommentCellProps) => {
  const { posts, address, menu, reservation, orderLink } = row.original;

  const hasRejected =
    posts.some((post) => post.status === ApprovalStatusEnum.REJECTED) ||
    address.status === ApprovalStatusEnum.REJECTED ||
    menu.status === ApprovalStatusEnum.REJECTED ||
    orderLink.status === ApprovalStatusEnum.REJECTED ||
    reservation.status === ApprovalStatusEnum.REJECTED;

  const hasPending =
    posts.some((post) => post.status === ApprovalStatusEnum.PENDING) ||
    address.status === ApprovalStatusEnum.PENDING ||
    menu.status === ApprovalStatusEnum.PENDING ||
    orderLink.status === ApprovalStatusEnum.PENDING ||
    reservation.status === ApprovalStatusEnum.PENDING;

  const hasApproved =
    posts.some((post) => post.status === ApprovalStatusEnum.APPROVED) ||
    address.status === ApprovalStatusEnum.APPROVED ||
    menu.status === ApprovalStatusEnum.APPROVED ||
    orderLink.status === ApprovalStatusEnum.APPROVED ||
    reservation.status === ApprovalStatusEnum.APPROVED;

  const canSaveWithComment = hasApproved && !hasPending && !hasRejected;

  return (
    <ActionButtons
      actions={[
        {
          label: "Save & Comment",
          onClick: () => onRequestComment(row.original),
          variant: "primary",
          disabled: !canSaveWithComment,
        },
      ]}
      className="w-42.5 h-12"
    />
  );
};

