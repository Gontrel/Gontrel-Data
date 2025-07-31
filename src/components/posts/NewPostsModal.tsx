"use client";

import { useState } from "react";
import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { VideoStep } from "../restaurants/VideoStep";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { useVideoStore } from "@/stores/videoStore";

interface NewPostsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPostSheet = ({
  open,
  onOpenChange,
}: NewPostsSheetProps) => {

  const {videos} = useVideoStore();

  const videosData = videos.map((video) => ({
       tiktokLink: video.url,
        videoUrl: video.videoUrl,
        thumbUrl: video.thumbUrl,
        locationName: video.locationName,
        rating: video.rating,
        tags: video.tags, 
    }))

    const { mutate: createPost, isPending: isLoading } = trpc.post.createPost.useMutation({
        onSuccess: () => {
         successToast("Post created successfully!");
        },
        onError: (error) => {
          errorToast(error.message);
        },
      });


  const onSubmit = () => {
    createPost( videosData[0])
     // TODO: change later after the endpoint has been changes
    // createPost( videosData)
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

        <VideoStep onNext={onSubmit} onPrevious={onSubmit} onSubmit={onSubmit} isLoading={isLoading} postOnly={true} />
      </div>

    </Sheet>
  );
};
