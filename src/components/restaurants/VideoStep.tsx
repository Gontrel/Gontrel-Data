"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Loader, Upload, Search, Clock } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { VideoCard } from "./VideoCard";
import { trpc } from "@/lib/trpc-client";
import { errorToast, successToast } from "@/utils/toast";
import { useCurrentUser } from "@/stores/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import Icon from "../svgs/Icons";
import { Button } from "../ui/Button";
import { cleanTiktokUrl } from "@/lib/utils";
import { uploadVideoFile } from "@/lib/upload";
import { VideoData } from "@/interfaces";
import { TimestampView } from "@/components/video/TimestampView";
import { TargetTimeStamp } from "@/interfaces/posts";

interface VideoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: (data: VideoData[]) => void;
  postOnly?: boolean | null;
  isLoading?: boolean;
  restaurantName?: string;
  locationId?: string;
  postId?: string;
  existingTimeStamps?: TargetTimeStamp[];
}

export const VideoStep = ({
  onNext,
  onPrevious,
  onSubmit,
  postOnly,
  isLoading,
  restaurantName,
  locationId,
  postId,
  existingTimeStamps,
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
    isLowQuality: false,
    visibleFood: "",
    rating: 0,
  });

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useCurrentUser();

  // Creator search state
  const [creatorQuery, setCreatorQuery] = useState("");
  const [creatorSuggestions, setCreatorSuggestions] = useState<Array<{
    userID: string;
    displayName: string;
    username: string;
    profileImage: string;
  }>>([]);
  const [selectedCreator, setSelectedCreator] = useState<{
    userID: string;
    displayName: string;
    username: string;
    profileImage: string;
  } | null>(null);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
  const [isSearchingCreators, setIsSearchingCreators] = useState(false);
  const creatorSearchRef = useRef<HTMLDivElement>(null);

  // Creator search API call
  const searchCreators = async (query: string) => {
    if (!query.trim()) {
      setCreatorSuggestions([]);
      return;
    }
    setIsSearchingCreators(true);
    try {
      const res = await fetch(
        `https://gontrel-test.up.railway.app/get-user-search-suggestions?query=${encodeURIComponent(query)}&quantity=5&sessionToken=${user?.id || ""}`,
        {
          headers: {
            "x-api-key": "5qegXo2xfJ7UypzWsA3Sq1WbQoL9ARtK2dcGFCDC",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to search creators");
      const data = await res.json();
      setCreatorSuggestions(Array.isArray(data) ? data : []);
      setShowCreatorDropdown(true);
    } catch {
      setCreatorSuggestions([]);
    } finally {
      setIsSearchingCreators(false);
    }
  };

  // Click outside to close creator dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        creatorSearchRef.current &&
        !creatorSearchRef.current.contains(event.target as Node)
      ) {
        setShowCreatorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        const validationResult = await validateTikTokRetech();

        if (!validationResult?.data?.valid) {
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
        } catch {
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

    const cleanedUrl = cleanTiktokUrl(url);
    setCurrentVideo({ ...currentVideo, url: cleanedUrl, videoUrl: cleanedUrl });
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
      errorToast("Each video must have at least one tag.");
      return false;
    }
    return true;
  };

  const handleSetFoodVisibility = (checked: boolean) => {
    setCurrentVideo((prev) => ({
      ...prev,
      isFoodVisible: checked,
    }));
  };

  const handleSetLowQuality = (checked: boolean) => {
    setCurrentVideo((prev) => ({
      ...prev,
      isLowQuality: checked,
    }));
  };

  const handleFoodTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const foodType = e.target.value;
    setCurrentVideo((prev) => ({
      ...prev,
      visibleFood: foodType,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    const validExt = [".mp4", ".mov", ".wav"];
    if (!validTypes.includes(file.type) && !validExt.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      errorToast("Please upload a valid video file (MP4, MOV, WEBM, or WAV).");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadVideoFile(file, user?.id, (e) => {
        if (e.total && e.total > 0) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      setCurrentVideo((prev) => ({
        ...prev,
        url: result.videoUrl,
        videoUrl: result.videoUrl,
        thumbUrl: result.thumbUrl,
      }));
      successToast("Video uploaded successfully!");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; statusText: string; data: unknown }; config?: { url?: string }; message?: string };
      const errorDetail = {
        message: axiosErr?.message || "Unknown error",
        status: axiosErr?.response?.status,
        statusText: axiosErr?.response?.statusText,
        responseData: axiosErr?.response?.data,
        requestUrl: axiosErr?.config?.url,
      };
      const msg = err instanceof Error ? err.message : "Failed to upload video. Please try again.";
      errorToast(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddOrUpdateVideo = (): boolean => {
    const isValid = handleInputError();
    if (!isValid) return false;

    const videoData = {
      url: currentVideo.url,
      tags: currentVideo.tags,
      thumbUrl: currentVideo.thumbUrl,
      videoUrl: currentVideo.videoUrl,
      author: currentVideo.author,
      isFoodVisible: currentVideo?.isFoodVisible,
      isLowQuality: currentVideo?.isLowQuality,
      visibleFood: currentVideo.visibleFood,
      locationName: currentVideo.locationName,
      rating: currentVideo.rating || 0,
      isUpdated: true,
      userId: selectedCreator?.userID,
      creatorName: selectedCreator?.displayName,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
    } else {
      addVideo(videoData);
    }

    resetVideo();
    setSelectedCreator(null);
    setCreatorQuery("");
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
        isLowQuality: videoToEdit.isLowQuality || false,
        visibleFood: videoToEdit.visibleFood || "",
        rating: videoToEdit.rating || 0,
      });
      if (videoToEdit.userId && videoToEdit.creatorName) {
        setSelectedCreator({
          userID: videoToEdit.userId,
          displayName: videoToEdit.creatorName,
          username: videoToEdit.creatorName,
          profileImage: "",
        });
        setCreatorQuery(videoToEdit.creatorName);
      } else {
        setSelectedCreator(null);
        setCreatorQuery("");
      }
      setActiveVideoUrl(videoToEdit.videoUrl || videoToEdit.url);
      setTiktokUsername(videoToEdit.author || null);
    }
  };

  const handleOnNext = () => {
    // If there's a pending video with URL, try to add it first
    if (currentVideo.url !== "") {
      const success = handleAddOrUpdateVideo();
      if (!success) return; // Validation failed, don't proceed
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
      isLowQuality: false,
      visibleFood: "",
    });

    setActiveVideoUrl(null);
    setTiktokUsername(null);
  };

  const handleOnSubmit = () => {
    const isValid = handleInputError();
    if (!isValid) return;

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
      isLowQuality: currentVideo.isLowQuality,
      isUpdated: true,
      userId: selectedCreator?.userID,
      creatorName: selectedCreator?.displayName,
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

  const [showTimestampView, setShowTimestampView] = useState(false);

  if (showTimestampView && currentVideo.videoUrl) {
    return createPortal(
      <div className="fixed right-0 top-0 h-full bg-white z-50 overflow-y-auto rounded-l-3xl" style={{ width: 1200 }}>
        <TimestampView
            videoUrl={currentVideo.videoUrl}
            onBack={() => setShowTimestampView(false)}
            locationId={locationId || ""}
            postId={postId || ""}
            existingTimeStamps={existingTimeStamps}
          />
      </div>,
      document.body
    );
  }

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
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 z-20 rounded-lg flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center w-64">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className="bg-[#0070F3] h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-700 font-medium">{uploadProgress}% uploaded</p>
          </div>
        </div>
      )}

      <div className="flex-grow">
        <label htmlFor="video-link" className="text-lg font-semibold">
          Video link
        </label>
        <div className="relative mt-3">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon name="linkIcon" className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="url"
            id="video-link"
            placeholder="Paste google drive or wetransfer link"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            value={currentVideo.url?.trim()}
            onChange={handleUrlChange}
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

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div
          className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Upload from device</span>
          <span className="text-xs text-gray-400 mt-1">MP4, MOV, or WAV</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mov,.wav"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {currentVideo.url && (
          <div className="mt-6">
            {/* Creator Search */}
            <label className="text-lg font-semibold">Creator</label>
            <div className="relative mt-3" ref={creatorSearchRef}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search creator..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                value={
                  selectedCreator
                    ? selectedCreator.displayName
                    : creatorQuery
                }
                onChange={(e) => {
                  setCreatorQuery(e.target.value);
                  setSelectedCreator(null);
                  searchCreators(e.target.value);
                }}
                onFocus={() => {
                  if (creatorSuggestions.length > 0) {
                    setShowCreatorDropdown(true);
                  }
                }}
              />
              {isSearchingCreators && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader className="animate-spin w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Creator suggestions dropdown */}
              {showCreatorDropdown && creatorSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {creatorSuggestions.map((creator) => (
                    <button
                      key={creator.userID}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      onClick={() => {
                        setSelectedCreator(creator);
                        setCreatorQuery(creator.displayName);
                        setShowCreatorDropdown(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {creator.profileImage ? (
                          <img
                            src={creator.profileImage}
                            alt={creator.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">
                            {creator.displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {creator.displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {creator.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6">
              <label htmlFor="tag-input" className="text-lg font-semibold">
                Tag
              </label>
              <button
                type="button"
                onClick={() => {
                  useVideoStore.getState().pauseAllVideosExcept("");
                  setActiveVideoUrl(null);
                  setShowTimestampView(true);
                }}
                className="flex items-center gap-1 h-8 min-w-[100px] px-4 py-1.5 rounded-lg border border-[#0070F3] bg-white text-[#0070F3] text-sm font-medium leading-5"
              >
                <Clock size={16} />
                <span>Add time stamp</span>
              </button>
            </div>
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
              <div className="flex items-center gap-2 mb-4 mt-4">
                <input
                  type="checkbox"
                  id="low-quality"
                  checked={currentVideo.isLowQuality}
                  onChange={(e) => handleSetLowQuality(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="low-quality">
                  Video is low quality
                </label>
              </div>
            }

            {currentVideo.isFoodVisible && (
              <div>
                <label
                  htmlFor="food-type"
                  className="text-lg font-semibold text-[#2E3032]"
                >
                  What type of food?
                </label>
                <div className="relative mt-3">
                  <input
                    type="text"
                    id="food-type"
                    placeholder="Enter food here"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                    value={currentVideo.visibleFood?.trim()}
                    onChange={handleFoodTypeChange}
                  />
                </div>
              </div>
            )}

            {editingVideoId && videos?.length >= 0 ? (
              <div className="mt-6 pt-4 flex justify-left">
                <Button
                  onClick={async () => await handleAddOrUpdateVideo()}
                  disabled={isUploading}
                  className="flex items-center gap-2 text-white bg-[#0070F3] rounded-lg p-4 font-semibold"
                >
                  Update video
                </Button>
              </div>
            ) : null}
            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
              <button
                onClick={async () => await handleAddOrUpdateVideo()}
                disabled={isUploading}
                className="flex items-center gap-2 text-[#0070F3] font-semibold disabled:opacity-50"
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
          disabled={shouldDisable || isUploading}
          loading={isLoading || isUploading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            shouldDisable || isUploading
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
