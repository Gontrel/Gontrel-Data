import React, { useState } from "react";
import { Sheet } from "@/components/modals/Sheet";
import Icon from "@/components/svgs/Icons";
import { LivePostCard } from "../restaurants/LivePostCard";
import { Post } from "@/interfaces/posts";
import {
  GontrelRestaurantData,
  GontrelRestaurantDetailedData,
} from "@/interfaces/restaurants";
import ConfirmationModal from "./ConfirmationModal";
import { AnalystTableTabsEnum, ManagerTableTabsEnum } from "@/types/enums";
import { trpc } from "@/lib/trpc-client";
import { LivePostCardSkeleton } from "../Loader/restaurants/LivePostCardSkeleton";

type TableVideoPreviewSheetOnApprove = (
  restaurantId: string,
  postId: string
) => void;
type TableVideoPreviewSheetOnDecline = (
  restaurantId: string,
  postId: string,
  comment: string
) => void;

interface TableVideoPreviewSheetProps {
  table: ManagerTableTabsEnum | AnalystTableTabsEnum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: Post[];
  restaurant: GontrelRestaurantDetailedData;
  onApprove?: TableVideoPreviewSheetOnApprove;
  onDecline?: TableVideoPreviewSheetOnDecline;
  submissionId?: string;
}

interface TableVideoPreviewSheetContentProps {
  posts: Post[];
  onApprove?: TableVideoPreviewSheetOnApprove;
  onDecline?: TableVideoPreviewSheetOnDecline;
  restaurant: GontrelRestaurantData & { id: string; adminName: string };
}

interface TableVideoPreviewSheetHeaderProps {
  onOpenChange: (open: boolean) => void;
  posts: Post[];
}

const TableVideoPreviewSheetHeader = ({
  onOpenChange,
  posts,
}: TableVideoPreviewSheetHeaderProps) => {
  return (
    <section className="flex flex-row items-center justify-between pb-5 px-6 pt-9 bg-[#FAFAFA]">
      <h2 className="text-xl font-semibold text-[#2E3032]">
        {`Video preview (${posts?.length ?? 0})`}
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

const TableVideoPreviewSheetContent = ({
  posts,
  onApprove,
  onDecline,
  restaurant,
}: TableVideoPreviewSheetContentProps) => (
  <section className="flex flex-col gap-y-4.5 py-5 items-center">
    {posts.length > 0 ? (
      posts.map((post, index) => (
        <LivePostCard
          key={index}
          handleApprove={onApprove ?? undefined}
          handleDecline={
            onDecline ? () => onDecline(restaurant.id, post.id, "") : undefined
          }
          post={post}
          restaurant={restaurant}
        />
      ))
    ) : (
      <div className="flex flex-col gap-y-4.5">
        <LivePostCardSkeleton />
      </div>
    )}
  </section>
);

export const TableVideoPreviewSheet = ({
  table,
  open,
  onOpenChange,
  posts = [],
  onApprove,
  onDecline,
  restaurant,
  submissionId,
}: TableVideoPreviewSheetProps) => {
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    comment: string;
    postId: string;
    restaurantId: string;
  }>({
    isOpen: false,
    comment: "",
    postId: "",
    restaurantId: "",
  });

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      comment: "",
      postId: "",
      restaurantId: "",
    });
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeedbackModal({
      ...feedbackModal,
      comment: event.target.value,
    });
  };

  if (
    table === ManagerTableTabsEnum.PENDING_VIDEOS ||
    table === ManagerTableTabsEnum.PENDING_USER_VIDEOS ||
    table === AnalystTableTabsEnum.SUBMITTED_VIDEOS
  ) {
    const { data: queryData } = trpc.post.getPosts.useQuery({
      submissionId: submissionId ?? "",
    });
    posts = queryData?.data ?? [];
  }

  const handleDecline = (restaurantId: string, postId: string) => {
    setFeedbackModal({ isOpen: true, comment: "", postId, restaurantId });
  };
  const handleSubmitFeedback = () => {
    onDecline?.(
      feedbackModal.restaurantId,
      feedbackModal.postId,
      feedbackModal.comment
    );
    closeFeedbackModal();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[604px]"
      className="bg-white overflow-y-auto"
    >
      <TableVideoPreviewSheetHeader onOpenChange={onOpenChange} posts={posts} />
      <TableVideoPreviewSheetContent
        posts={posts}
        onApprove={onApprove}
        onDecline={handleDecline}
        restaurant={restaurant}
      />
      <ConfirmationModal
        isOpen={feedbackModal.isOpen && open}
        onClose={closeFeedbackModal}
        title="Decline post?"
        description="Are you sure you want to decline this post?"
        comment={feedbackModal.comment}
        onCommentChange={handleCommentChange}
        onConfirm={handleSubmitFeedback}
        confirmLabel="Send feedback"
        cancelLabel="Cancel"
      />
    </Sheet>
  );
};
