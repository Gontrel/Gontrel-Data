"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { VideoCard } from "./VideoCard";
import { trpc } from "@/lib/trpc-client";
import { errorToast } from "@/utils/toast";
import { useDebounce } from "@/hooks/useDebounce";
import Icon from "../svgs/Icons";
import { Button } from "../ui/Button";
import { cleanTiktokUrl, isValidTikTokUrl } from "@/lib/utils";
import { VideoData } from "@/interfaces";

interface VideoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: (data: VideoData[]) => void;
  postOnly?: boolean | null;
  isLoading?: boolean;
}

export const VideoStep = ({
  onNext,
  onPrevious,
  onSubmit,
  postOnly,
  isLoading,
}: VideoStepProps) => {
  const videos = useVideoStore((state) => state.videos);
  const {
    addVideo,
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
  const debouncedUrl = useDebounce(currentVideo.url, 1000);

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

  // Effect to handle debounced TikTok URL processing
  useEffect(() => {
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
              author: data.author?.nickname,
            }));
          } else {
            errorToast("Could not retrieve video information from this URL.");
          }
        } catch (error) {
    
          errorToast(
            "Failed to fetch TikTok video information. Please check the URL."
          );
        }
      }
    };

    processTiktokUrl();
  }, [
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

  const handleInputError = () => {
    if (!currentVideo.url) {
      errorToast("Please add a video URL.");
      return false;
    }

    if (currentVideo.tags.length === 0) {
      errorToast("Each video must have at least one tags.");
      return false;
    }
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

  const handleAddOrUpdateVideo = (): boolean => {
    handleInputError();
    const videoData = {
      url: currentVideo.url,
      tags: currentVideo.tags,
      thumbUrl: currentVideo.thumbUrl,
      videoUrl: currentVideo.videoUrl,
      author: currentVideo.author,
      isFoodVisible: currentVideo?.isFoodVisible,
      visibleFood: currentVideo.visibleFood,
      locationName: currentVideo.locationName,
      rating: currentVideo.rating || 0,
      isUpdated: true,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
    } else {

      addVideo(videoData);
    }

    resetVideo();
    return true;
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
        isFoodVisible: videoToEdit.isFoodVisible || false,
        visibleFood: videoToEdit.visibleFood || "",
        rating: videoToEdit.rating || 0,
      });
      setActiveVideoUrl(videoToEdit.videoUrl || videoToEdit.url);
      setTiktokUsername(videoToEdit.author || null);
    }
  };

  const handleOnNext = () => {
    if (currentVideo.url !== "" && currentVideo.tags.length !== 0) {
      handleAddOrUpdateVideo();
      return;
    }

    onNext();
  };

  const resetVideo = () => {
    setCurrentVideo({
      url: "",
      tags: [],
      thumbUrl: "",
      videoUrl: "",
      author: "",
      locationName: "",
      rating: 0,
      isFoodVisible: false,
      visibleFood: "",
    });

    setActiveVideoUrl(null);
    setTiktokUsername(null);
  };

  const handleOnSubmit = async () => {
    handleInputError();
    const videoData = {
      url: currentVideo.url,
      tags: currentVideo.tags,
      thumbUrl: currentVideo.thumbUrl,
      videoUrl: currentVideo.videoUrl,
      author: currentVideo.author,
      locationName: currentVideo.locationName,
      rating: currentVideo.rating || 0,
      visibleFood: currentVideo.visibleFood,
      isFoodVisible: currentVideo.isFoodVisible,
      isUpdated: true,
    };

    const store = useVideoStore.getState();
    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
    } else {
      addVideo(videoData);
    }

    const currentVideos = store.getCurrentVideos();

    resetVideo();
    onSubmit?.(currentVideos);
  };

  const shouldDisable =
    videos.length === 0 &&
    (currentVideo.tags.length < 1 || currentVideo.url === "");

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

      <div className="space-y-4 mb-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={handleEdit}
            removeVideo={removeVideo}
            editFlow={true}
          />
        ))}
      </div>
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
            value={currentVideo.url?.trim()}
            onChange={handleUrlChange}
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

            {
              <div className="flex items-center gap-2 mb-4 mt-4">
                <input
                  type="checkbox"
                  id="food-visible"
                  checked={currentVideo.isFoodVisible} // Use currentVideo state
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

            {editingVideoId && videos?.length >= 0 ? (
              <div className="mt-6 pt-4 flex justify-left">
                <Button
                  onClick={handleAddOrUpdateVideo}
                  className="flex items-center gap-2 text-white bg-[#0070F3] rounded-lg p-4 font-semibold"
                >
                  Update video
                </Button>
              </div>
            ) : null}
            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
              <button
                onClick={handleAddOrUpdateVideo}
                className="flex items-center gap-2 text-[#0070F3] font-semibold"
              >
                <Plus size={20} />
                <span className="text-[#2E3032]  font-semibold text-sm leading-[100%]">
                  {"Add another video"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {!postOnly ? (
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
          <Button
            onClick={handleOnNext}
            disabled={shouldDisable}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              shouldDisable
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0070F3] text-white hover:bg-blue-600"
            }`}
          >
            Next
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleOnSubmit}
          type="submit"
          disabled={shouldDisable}
          loading={isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            shouldDisable
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#0070F3] text-white hover:bg-blue-600"
          }`}
        >
          Submit
        </Button>
      )}
    </div>
  );
};
