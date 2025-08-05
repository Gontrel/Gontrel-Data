import React, { useState } from 'react'
import { Sheet } from '@/components/modals/Sheet'
import Icon from '@/components/svgs/Icons';
import { LivePostCard } from '../restaurants/LivePostCard';
import { Post } from '@/interfaces/posts';
import { GontrelRestaurantData } from '@/interfaces/restaurants';
import ConfirmationModal from './ConfirmationModal';


type TableVideoPreviewSheetOnApprove = (restaurantId: string, postId: string) => void;
type TableVideoPreviewSheetOnDecline = (restaurantId: string, postId: string, comment: string) => void;

interface TableVideoPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: Post[];
  onApprove: TableVideoPreviewSheetOnApprove;
  onDecline: TableVideoPreviewSheetOnDecline;
  restaurant: GontrelRestaurantData & { id: string, adminName: string };
}


interface TableVideoPreviewSheetHeaderProps {
  onOpenChange: (open: boolean) => void;
  posts: Post[];
}

const TableVideoPreviewSheetHeader = ({ onOpenChange, posts }: TableVideoPreviewSheetHeaderProps) => {
  return (
    <section className="flex flex-row items-center justify-between pb-5 px-6 pt-9 bg-[#FAFAFA]">
      <h2 className="text-xl font-semibold text-[#2E3032]">
        {`Video preview (${posts?.length ?? 0})`}
      </h2>
      <button onClick={() => onOpenChange(false)} aria-label="Close preview modal" title="Close preview modal">
        <Icon name="cancelModalIcon" fill="transparent" width={32} height={32} />
      </button>
    </section>
  )
}

const TableVideoPreviewSheetContent = ({ posts, onApprove, onDecline, restaurant }: Omit<TableVideoPreviewSheetProps, 'open' | 'onOpenChange'>) => (
  <section className="flex flex-col gap-y-4.5 py-5 px-6">
    {posts!.map((post, index) => (
      <LivePostCard
        key={index}
        handleApprove={onApprove}
        handleDecline={() => onDecline(restaurant.id, post.id, "")}
        post={post}
        restaurant={restaurant}
      />
    ))}
  </section>
)

export const TableVideoPreviewSheet = ({ open, onOpenChange, posts = [], onApprove, onDecline, restaurant }: TableVideoPreviewSheetProps) => {
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean, comment: string, postId: string, restaurantId: string }>({
    isOpen: false,
    comment: "",
    postId: "",
    restaurantId: ""
  });

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      comment: "",
      postId: "",
      restaurantId: ""
    });
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackModal({
      ...feedbackModal,
      comment: event.target.value
    });
  }

  if (posts.length === 0) {
    const post: Post = {
      id: "post_123456789",
      createdAt: "2024-01-15T14:30:00Z",
      modifiedAt: "2024-01-15T14:30:00Z",
      deletedAt: null,
      deletedBy: null,
      updatedBy: null,
      firebaseId: "firebase_post_123",
      analytics: {
        views: 1250,
        likes: 89,
        shares: 12,
        comments: 23
      },
      tiktokLink: "https://www.tiktok.com/@kingsyleyyj1009/video/7123456789",
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbUrl: "https://example.com/thumbnail.jpg",
      postedAt: "2024-01-15T14:30:00Z",
      status: "pending",
      source: "tiktok",
      tags: []
    };
    posts = Array(5).fill(post);
  }
  const handleDecline = (restaurantId: string, postId: string) => {
    setFeedbackModal({ isOpen: true, comment: "", postId, restaurantId });
  }
  const handleSubmitFeedback = () => {
    onDecline(feedbackModal.restaurantId, feedbackModal.postId, feedbackModal.comment);
    closeFeedbackModal();
  }
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[604px]"
      className="bg-white p-0 overflow-y-auto"
    >
      <TableVideoPreviewSheetHeader onOpenChange={onOpenChange} posts={posts} />
      <TableVideoPreviewSheetContent posts={posts} onApprove={onApprove} onDecline={handleDecline} restaurant={restaurant} />
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
  )
}