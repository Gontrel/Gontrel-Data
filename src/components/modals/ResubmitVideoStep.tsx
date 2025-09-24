"use client";

import { useState, useEffect, useCallback } from "react";
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
import { cleanTiktokUrl, isValidTikTokUrl, mergeClasses } from "@/lib/utils";
import { CreateBulkPostRequest } from "@/interfaces";
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
  const videos = useVideoStore((state) => state.videos);
  const {
    addVideos,
    updateVideo,
    setActiveVideoUrl,
    resetVideos,
    removeVideo,
    setTiktokUsername,
  } = useVideoStore();
  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    tags: [] as string[],
    thumbUrl: "",
    author: "",
    videoUrl: "",
    locationName: "",
    isFoodVisible: false,
    visibleFood: "",
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

  const {
    refetch: validateTikTokRetech,
    isLoading: isLoadingTiktokValidation,
  } = trpc.external.validateTikTokLink.useQuery(
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

  const { mutate: createBulkPost, isPending: isLoadingPostCreated } =
    trpc.post.createBulkPost.useMutation({
      onSuccess: () => {
        successToast("Post created successfully!");
        (async () => {
          const convertedPosts = await convertPosts(restaurant?.posts ?? []);
          resetVideos();
          addVideos(convertedPosts);
        })();
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const { mutate: deleteVideoMutation, isPending: isLoadingPostRemoval } =
    trpc.post.deletePost.useMutation({
      onSuccess: (_, variables) => {
        successToast("Post successfully deleted");
        if (variables?.postId) {
          removeVideo(variables?.postId);
        }
      },
    });

  const handleRemoveVideo = useCallback(
    (currentPostId: string) => {
      if (!currentPostId) return;

      deleteVideoMutation({ postId: currentPostId });
    },
    [deleteVideoMutation]
  );

  // Effect to handle debounced TikTok URL processing
  useEffect(() => {
    if (editingVideoId) return;
    const processTiktokUrl = async () => {
      const match = debouncedUrl.match(
        /https:\/\/www\.tiktok\.com\/@[^\/]+\/video\/\d+/
      );

      if (debouncedUrl && match) {
        const validUrlTiktok = await validateTikTokRetech();

        if (!validUrlTiktok?.data?.valid) {
          errorToast("Tiktok link already exist");
          return;
        }

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
              author: data?.author?.nickname,
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
  }, [
    editingVideoId,
    debouncedUrl,
    validateTikTokRetech,
    refetch,
    setActiveVideoUrl,
    setTiktokUsername,
  ]);

  const handleUrlChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ClipboardEvent<HTMLInputElement>
  ) => {
    let url = "";
    if ("clipboardData" in e) {
      url = e.clipboardData.getData("text");
    } else {
      url = e.target.value;
    }

    const isValidTiktokurl = isValidTikTokUrl(url);
    if (!isValidTiktokurl) {
      errorToast("Invalid TikTok URL");
    }

    const cleanedUrl = cleanTiktokUrl(url);
    setCurrentVideo({ ...currentVideo, url: cleanedUrl });
  };

  const convertPosts = async (posts: Post[]): Promise<VideoData[]> => {
    return posts?.map((post) => ({
      id: post.id,
      url: post.tiktokLink,
      tags: post.tags.map((tag) => tag.name),
      thumbUrl: post.thumbUrl,
      videoUrl: post.videoUrl,
      author: post.updatedBy,
      status: post?.status,
      visibleFood: post?.visibleFood,
      isFoodVisible: post?.isFoodVisible,
      isUpdated: false,
    }));
  };

  useEffect(() => {
    const loadAndAddVideos = async () => {
      try {
        const convertedPosts = await convertPosts(restaurant?.posts ?? []);
        resetVideos();
        addVideos(convertedPosts);
      } catch {}
    };

    loadAndAddVideos();
  }, [restaurant?.posts, resetVideos, addVideos]);

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

  const handleAddOrUpdateVideo = async () => {
    if (!currentVideo?.url) {
      errorToast("Please add a video URL.");
      return;
    }

    if (currentVideo?.tags?.length === 0) {
      errorToast("Each video must have at least one tags.");
      return;
    }

    const videoData = {
      url: currentVideo?.url,
      tags: currentVideo?.tags,
      thumbUrl: currentVideo?.thumbUrl,
      videoUrl: currentVideo?.videoUrl,
      author: currentVideo?.author,
      locationName: currentVideo?.locationName,
      isFoodVisible: currentVideo?.isFoodVisible,
      rating: currentVideo?.rating || 0,
      visibleFood: currentVideo?.visibleFood || "",
      isUpdated: true,
    };

    const payload = {
      locationId: restaurant?.id,
      postId: editingVideoId,
      tiktokLink: videoData?.url,
      videoUrl: videoData?.videoUrl,
      thumbUrl: videoData?.thumbUrl,
      isFoodVisible: videoData?.isFoodVisible,
      visibleFood: videoData?.visibleFood,
      tags: [...videoData?.tags],
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
      setEditingVideoId(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updatePost(payload as any);
      shouldResubmit++;
      return;
    }

    const createBulkPostData: CreateBulkPostRequest = {
      locationId: payload?.locationId,
      posts: [
        {
          videoUrl: payload?.videoUrl,
          tiktokLink: payload?.tiktokLink,
          thumbUrl: payload?.thumbUrl,
          isFoodVisible: payload?.isFoodVisible,
          visibleFood: payload?.visibleFood || "",
          tags: payload?.tags,
        },
      ],
    };

    await createBulkPost(createBulkPostData);
  };

  const handleSetFoodVisibility = (checked: boolean) => {
    setCurrentVideo((prev) => ({
      ...prev,
      isFoodVisible: checked,
    }));
  };

  const handleFoodTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const foodType = e.target.value;
    setCurrentVideo((prev) => ({
      ...prev,
      visibleFood: foodType,
    }));
  };

  const handleEdit = (id: string) => {
    const videoToEdit = videos.find((v) => v.id === id);

    if (videoToEdit) {
      setEditingVideoId(id);
      setCurrentVideo({
        url: videoToEdit?.url,
        tags: videoToEdit?.tags,
        thumbUrl: videoToEdit?.thumbUrl || "",
        videoUrl: videoToEdit?.videoUrl || "",
        author: videoToEdit.author || "",
        visibleFood: videoToEdit.visibleFood || "",
        locationName: videoToEdit?.locationName || "",
        isFoodVisible: videoToEdit?.isFoodVisible ?? false,
        rating: videoToEdit?.rating || 0,
      });
      setActiveVideoUrl(videoToEdit?.videoUrl || videoToEdit?.url);
    }
  };

  const handleOnNext = () => {
    onNext();
  };

  const shouldDisable =
    currentVideo.tags.length <= 1 && currentVideo.url === "";

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

      {isLoadingTiktokValidation && (
        <div className="absolute inset-0 bg-transparent bg-opacity-20 z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader className="animate-spin w-8 h-8 text-[#0070F3]" />
            <p className="mt-3 text-gray-700">Validating TikTok video...</p>
          </div>
        </div>
      )}

      {isLoadingPostCreated && (
        <div className="absolute inset-0 bg-transparent bg-opacity-20 z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader className="animate-spin w-8 h-8 text-[#0070F3]" />
            <p className="mt-3 text-gray-700">Creating post...</p>
          </div>
        </div>
      )}

      {isLoadingPostRemoval && (
        <div className="absolute inset-0 bg-transparent bg-opacity-20 z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader className="animate-spin w-8 h-8 text-[#0070F3]" />
            <p className="mt-3 text-gray-700">Removing post...</p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {videos?.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={handleEdit}
            removeVideo={handleRemoveVideo}
            editFlow={editFlow}
          />
        ))}
      </div>
      {(editingVideoId || videos?.length === 0) && (
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
              placeholder="https://www.tiktok.com/@username/video/1234567890"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              value={currentVideo?.url?.trim()}
              onChange={handleUrlChange}
              onPaste={handleUrlChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const syntheticEvent = {
                    target: { value: e.currentTarget.value },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleUrlChange(syntheticEvent);
                }
              }}
            />
          </div>

          {currentVideo?.url && (
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
                {currentVideo?.tags.map((tag) => (
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

              {
                <div className="flex items-center gap-2 mb-4 mt-4">
                  <input
                    type="checkbox"
                    id="food-visible"
                    checked={currentVideo.isFoodVisible}
                    onChange={(e) => handleSetFoodVisibility(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="food-visible">
                    Food is visible in the next 3 seconds
                  </label>
                </div>
              }

              {
                <div>
                  <label
                    htmlFor="food-type"
                    className="text-lg font-semibold text-[#2E3032]"
                  >
                    What type of food?
                  </label>
                  <div className="relative mt-3">
                    <input
                      type="url"
                      id="food-type"
                      placeholder="Enter food here"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                      value={currentVideo.visibleFood?.trim()}
                      onChange={handleFoodTypeChange}
                    />
                  </div>
                </div>
              }

              {(editingVideoId || videos?.length >= 0) && (
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
        {!editFlow && (
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
        )}

        {isRestaurantFlow && (
          <Button
            onClick={handleOnNext}
            // disabled={shouldDisableNext}
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
