"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { VideoStep } from "../restaurants/VideoStep";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { useVideoStore } from "@/stores/videoStore";
import { CreateBulkPostRequest } from "@/interfaces/requests";

interface NewPostsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPostSheet = ({ open, onOpenChange }: NewPostsSheetProps) => {
  const { videos } = useVideoStore();
  const locationId = "6b117b6d-810f-4967-84de-a530a2d87dc1";

  const videosData = videos.map((video) => ({
    tiktokLink: video.url ?? "",
    videoUrl: video.videoUrl || "",
    hlsUrl: video.videoUrl,
    firstFrameUrl: video.videoUrl,
    thumbUrl: video.thumbUrl || "",
    locationName: video.locationName || "",
    rating: video.rating || 0,
    tags: video.tags ?? [],
  }));

  const createBulkPostData: CreateBulkPostRequest = {
    locationId: locationId,
    posts: videosData,
  };

  const { mutate: createBulkPost, isPending: isLoading } =
    trpc.post.createBulkPost.useMutation({
      onSuccess: () => {
        successToast("Post created successfully!");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const onSubmit = () => {
    createBulkPost(createBulkPostData);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[638px]"
      className="p-8 flex flex-col"
    >
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">New Post</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
            aria-label="Close"
          >
            <Icon name="cancelModalIcon" />
          </button>
        </div>
        <p className="text-gray-500 mt-1">Create a new post</p>

        <VideoStep
          onNext={onSubmit}
          onPrevious={onSubmit}
          onSubmit={onSubmit}
          isLoading={isLoading}
          postOnly={true}
        />
      </div>
    </Sheet>
  );
};
