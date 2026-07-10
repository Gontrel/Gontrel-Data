"use client";

import { Sheet } from "../modals/Sheet";
import Icon from "../svgs/Icons";
import { VideoStep } from "../restaurants/VideoStep";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { useVideoStore } from "@/stores/videoStore";
import { CreatePostRequest } from "@/interfaces/requests";
import { Restaurant, VideoData } from "@/interfaces/restaurants";
import { useCallback } from "react";

interface NewPostsSheetProps {
  open: boolean;
  onPostCreated: () => void;
  restaurant: Restaurant;
  onOpenChange: (open: boolean) => void;
}

export const NewPostSheet = ({
  open,
  restaurant,
  onOpenChange,
  onPostCreated,
}: NewPostsSheetProps) => {
  const videos = useVideoStore((state) => state.videos);
  const { resetVideos, setActiveVideoUrl } = useVideoStore();
  const locationId = restaurant?.id;
  const { mutate: createPost, isPending: isLoading } =
    trpc.post.createPost.useMutation({
      onSuccess: (data) => {
        successToast("Post created successfully!");
        onPostCreated();
        handleClose();
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const onSubmit = (currentVideos?: VideoData[]) => {
    const videosToUse = currentVideos || videos;

    videosToUse.forEach((video) => {
      const postData: CreatePostRequest = {
        locationId: locationId,
        videoUrl: video.videoUrl || video.url || "",
        hlsUrl: video.videoUrl,
        firstFrameUrl: video.videoUrl,
        thumbUrl: video.thumbUrl || "",
        locationName: restaurant?.name || video.locationName || "",
        isFoodVisible: video.isFoodVisible ?? false,
        isLowQuality: video.isLowQuality ?? false,
        rating: video.rating || 0,
        ...(video.tags && video.tags.length > 0 && { tags: video.tags }),
        userId: video.userId,
      };
      createPost(postData);
    });
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setActiveVideoUrl(null);
    resetVideos();
  }, [onOpenChange, setActiveVideoUrl, resetVideos]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="w-[638px]"
      className="p-8 flex flex-col"
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">New Post</h2>
          <button
            onClick={handleClose}
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
          onSubmit={(vids) => onSubmit(vids)}
          isLoading={isLoading}
          postOnly={true}
          restaurantName={restaurant?.name}
        />

      </div>
    </Sheet>
  );
};
