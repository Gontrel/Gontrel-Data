import React from 'react'
import { Sheet } from '@/components/modals/Sheet'
import Icon from '@/components/svgs/Icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VideoData } from '@/stores/videoStore';
import { LivePostCard } from '../restaurants/LivePostCard';
import { Post } from '@/types';

interface TableVideoPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: Post[];
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

const TableVideoPreviewSheetContent = ({ posts }: Pick<TableVideoPreviewSheetProps, "posts">) => (
  <section className="flex flex-col gap-y-4.5 py-5 px-6">
    {posts!.map((post, index) => (
      <LivePostCard
        key={index}
        handleApprove={() => { }}
        handleDecline={() => { }}
        post={post}
      />
    ))}
  </section>
)

const TableVideoPreviewSheet = ({ open, onOpenChange, posts = [] }: TableVideoPreviewSheetProps) => {
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
      status: "pending"
    };
    posts = Array(5).fill(post);
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
      <TableVideoPreviewSheetContent posts={posts} />
    </Sheet>
  )
}

export default TableVideoPreviewSheet