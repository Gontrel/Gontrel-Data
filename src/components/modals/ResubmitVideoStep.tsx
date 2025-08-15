"use client";

import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { useDebounce } from "@/hooks/useDebounce";
import { VideoCard } from "../restaurants/VideoCard";
import Icon from "@/components/svgs/Icons";
import { Post } from "@/interfaces/posts";
import { VideoData } from "@/interfaces/restaurants";
import { Button } from "@/components/ui/Button";
import { RestaurantData } from "@/types";
import { cleanTiktokUrl, mergeClasses } from "@/lib/utils";
interface ResubmitVideoStepProps {
  onNext: () => void;
  handleResubmit?: () => void;
  onPrevious: () => void;
  restaurant: RestaurantData;
  isLoading?: boolean;
  editFlow?: boolean;
  isRestaurantFlow?: boolean;
}

export const ResubmitVideoStepStep = ({
  onNext,
  onPrevious,
  handleResubmit,
  isRestaurantFlow,
  restaurant,
  editFlow = false,
}: ResubmitVideoStepProps) => {
  console.log(restaurant, "restaurantrestaurantrestaurant");
  const videos = useVideoStore((state) => state.videos);
  const {
    addVideos,
    updateVideo,
    setActiveVideoUrl,
    resetVideos,
    setTiktokUsername,
  } = useVideoStore();
  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    tags: [] as string[],
    thumbUrl: "",
    author: "",
    videoUrl: "",
    locationName: "",
    rating: 0,
  });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Debounce the URL input to avoid excessive API calls
  const debouncedUrl = useDebounce(currentVideo.url, 500);

  // We use a query, but disable it so it only runs when we call `refetch`
  const { refetch, isLoading: isLoadingTiktok } =
    trpc.external.getTiktokLinkInfo.useQuery(
      { link: debouncedUrl },
      { enabled: false }
    );

  const { mutate: updatePost, isPending: isLoadingUpdate } =
    trpc.post.updatePost.useMutation({
      onSuccess: () => {
        successToast("Post updated successfully!");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  // Effect to handle debounced TikTok URL processing
  useEffect(() => {
    const processTiktokUrl = async () => {
      const match = debouncedUrl.match(
        /https:\/\/www\.tiktok\.com\/@[^\/]+\/video\/\d+/
      );

      if (debouncedUrl && match) {
        try {
          const { data } = await refetch();
          if (data && data.play) {
            setActiveVideoUrl(data.play);
            setTiktokUsername(data.author?.nickname);
            setCurrentVideo((prev) => ({
              ...prev,
              url: debouncedUrl,
              thumbUrl: data?.cover,
              videoUrl: data?.play,
              author: data.author?.nickname,
            }));
          } else {
            errorToast("Could not retrieve video information from this URL.");
          }
        } catch {
          errorToast(
            "Failed to fetch TikTok video information. Please check the URL."
          );
        }
      }
    };

    processTiktokUrl();
  }, [debouncedUrl, refetch, setActiveVideoUrl, setTiktokUsername]);

  const handleUrlChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ClipboardEvent<HTMLInputElement>
  ) => {
    let cleanedUrl = "";
    if ("clipboardData" in e) {
      cleanedUrl = cleanTiktokUrl(e.clipboardData.getData("text"));
    } else {
      cleanedUrl = cleanTiktokUrl(e.target.value);
    }
    // Update both the input state and current video URL immediately for UI responsiveness
    setCurrentVideo({ ...currentVideo, url: cleanedUrl });
  };

  const convertPosts = async (posts: Post[]): Promise<VideoData[]> => {
    return posts.map((post) => ({
      id: post.id,
      url: post.tiktokLink,
      tags: post.tags.map((tag) => tag.name),
      thumbUrl: post.thumbUrl,
      videoUrl: post.videoUrl,
      author: post.updatedBy,
      status: post?.status,
      isUpdated: false,
    }));
  };

  useEffect(() => {
    const loadAndAddVideos = async () => {
      try {
        console.log(restaurant?.posts, "restaurant?.postsrestaurant?.posts");
        const convertedPosts = await convertPosts(restaurant?.posts ?? []);

        addVideos(convertedPosts);
      } catch {}
    };

    loadAndAddVideos();
  }, [restaurant?.posts, addVideos]);

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.currentTarget.value.trim();

      if (!inputValue) return;

      // Split tags by commas and trim whitespace
      const newTags = inputValue
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (newTags.length === 0) {
        errorToast("Please enter valid tags.");
        return;
      }

      const uniqueTags = newTags.filter(
        (tag) => !currentVideo.tags.includes(tag)
      );

      if (uniqueTags.length === 0) {
        errorToast("All tags already exist.");
        return;
      }

      setCurrentVideo({
        ...currentVideo,
        tags: [...currentVideo.tags, ...uniqueTags],
      });

      event.currentTarget.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentVideo({
      ...currentVideo,
      tags: currentVideo.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  let shouldResubmit = 0;

  const handleAddOrUpdateVideo = () => {
    if (!currentVideo.url) {
      errorToast("Please add a video URL.");
      return;
    }

    if (currentVideo.tags.length === 0) {
      errorToast("Each video must have at least one tags.");
      return;
    }

    const videoData = {
      url: currentVideo.url,
      tags: currentVideo.tags,
      thumbUrl: currentVideo.thumbUrl,
      videoUrl: currentVideo.videoUrl,
      author: currentVideo.author,
      locationName: currentVideo.locationName,
      rating: currentVideo.rating || 0,
      isUpdated: true,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
      setEditingVideoId(null);

      const payload = {
        locationId: restaurant?.id,
        postId: editingVideoId,
        tiktokLink: videoData.url,
        videoUrl: videoData.videoUrl,
        thumbUrl: videoData.thumbUrl,
        tags: [videoData.tags],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatePost(payload as any);
      shouldResubmit++;
    }
  };

  const handleEdit = (id: string) => {
    const videoToEdit = videos.find((v) => v.id === id);
    if (videoToEdit) {
      setEditingVideoId(id);
      setCurrentVideo({
        url: videoToEdit.url,
        tags: videoToEdit.tags,
        thumbUrl: videoToEdit.thumbUrl || "",
        videoUrl: videoToEdit.videoUrl || "",
        author: videoToEdit.author || "",
        locationName: videoToEdit.locationName || "",
        rating: videoToEdit.rating || 0,
      });
      setActiveVideoUrl(videoToEdit.videoUrl || videoToEdit.url);
      setTiktokUsername(videoToEdit.author || null);
    }
  };

  const handleOnNext = () => {
    if (currentVideo.url !== "" && currentVideo.tags.length !== 0)
      handleAddOrUpdateVideo();
    if (isRestaurantFlow) {
      onNext();
      return;
    }
  };

  const shouldDisable =
    currentVideo.tags.length <= 1 && currentVideo.url === "";

  const shouldDisableNext =
    videos.every((video) => video.status === "approved") &&
    currentVideo.tags.length > 1 &&
    currentVideo.url !== "";

  const shouldResubmitModal = shouldResubmit > 0 ? true : false;

  return (
    <div className="flex justify-center flex-col h-full w-[518px]">
      {isLoadingTiktok && (
        <div className="absolute inset-0 bg-transparent bg-opacity-20 z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader className="animate-spin w-8 h-8 text-[#0070F3]" />
            <p className="mt-3 text-gray-700">Fetching TikTok video...</p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={handleEdit}
            editFlow={editFlow}
          />
        ))}
      </div>
      {editingVideoId && (
        <div className="flex-grow">
          <label htmlFor="tiktok-link" className="text-lg font-semibold">
            TikTok link
          </label>
          <div className="relative mt-3">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Icon name="linkIcon" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="tiktok-link"
              placeholder="https://tiktok.com"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              value={currentVideo.url?.trim()}
              onChange={handleUrlChange}
              onPaste={handleUrlChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Create a synthetic event that matches the expected input change event
                  const syntheticEvent = {
                    target: { value: e.currentTarget.value },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleUrlChange(syntheticEvent);
                }
              }}
            />
          </div>

          {currentVideo.url && (
            <div className="mt-6">
              <label htmlFor="tag-input" className="text-lg font-semibold">
                Tag
              </label>
              <div className="relative mt-3">
                <input
                  type="text"
                  id="tag-input"
                  placeholder="Type a tag and press enter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  onKeyDown={handleTagKeyDown}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {currentVideo.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      aria-label={`Remove tag "${tag}"`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {editingVideoId && videos?.length >= 0 && (
                <div className="mt-6 pt-4 flex justify-left">
                  <Button
                    disabled={shouldDisable}
                    loading={isLoadingUpdate}
                    onClick={handleAddOrUpdateVideo}
                    className={mergeClasses(
                      "flex items-center gap-4 text-white bg-[#0070F3] rounded-[10px] py-[10px] px-[40px] text-[14px] font-semibold h-11",
                      "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
                      "hover:bg-blue-600"
                    )}
                  >
                    <Icon
                      name="saveIcon"
                      stroke={
                        isLoadingUpdate ||
                        currentVideo.tags.length === 0 ||
                        currentVideo.url === ""
                          ? "#99a1af"
                          : "white"
                      }
                    />
                    <span>Save</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex-shrink-0 pt-6 flex items-center gap-4 mb-10">
        <Button
          onClick={() => {
            resetVideos();
            setActiveVideoUrl(null);
            setTiktokUsername(null);
            onPrevious();
          }}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Previous
        </Button>
        {isRestaurantFlow && (
          <Button
            onClick={handleOnNext}
            disabled={shouldDisableNext}
            className={mergeClasses(
              "w-full py-3 rounded-lg font-semibold transition-colors bg-[#0070F3] text-white hover:bg-blue-600",
              "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            )}
          >
            Next
          </Button>
        )}

        {!isRestaurantFlow && (
          <Button
            onClick={handleResubmit}
            disabled={shouldResubmitModal}
            className={mergeClasses(
              "w-full py-3 rounded-lg font-semibold transition-colors bg-[#0070F3] text-white hover:bg-blue-600",
              "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            )}
          >
            Resubmit
          </Button>
        )}
      </div>
    </div>
  );
};
