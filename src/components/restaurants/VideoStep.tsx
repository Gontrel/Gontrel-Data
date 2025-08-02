"use client";

import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, X, Plus, Loader } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { VideoCard } from "./VideoCard";
import { trpc } from "@/lib/trpc-client";
import { errorToast } from "@/utils/toast";
import { useDebounce } from "@/hooks/useDebounce";
import Icon from "../svgs/Icons";

interface VideoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: () => void;
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
  const {
    videos,
    addVideo,
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
  const [urlInput, setUrlInput] = useState<string>("");

  // Debounce the URL input to avoid excessive API calls
  const debouncedUrl = useDebounce(urlInput, 500);

  // We use a query, but disable it so it only runs when we call `refetch`
  const { refetch } = trpc.external.getTiktokLinkInfo.useQuery(
    { link: debouncedUrl },
    { enabled: false }
  );

  // Effect to handle debounced TikTok URL processing
  useEffect(() => {
    const processTiktokUrl = async () => {
      const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/;

      if (debouncedUrl && tiktokRegex.test(debouncedUrl)) {
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
          console.error("TikTok URL processing error:", error);
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
    let value = "";
    if ("clipboardData" in e) {
      value = e.clipboardData.getData("text");
    } else {
      value = e.target.value;
    }

    // Update both the input state and current video URL immediately for UI responsiveness
    setUrlInput(value);
    setCurrentVideo({ ...currentVideo, url: value });
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const tag = event.currentTarget.value.trim();
      if (tag && !currentVideo.tags.includes(tag)) {
        setCurrentVideo({ ...currentVideo, tags: [...currentVideo.tags, tag] });
        event.currentTarget.value = "";
      }
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
      return;
    }

    if (currentVideo.tags.length === 0) {
      errorToast("Each video must have at least one tags.");
      return;
    }
  };

  const handleAddOrUpdateVideo = async () => {
    await handleInputError();
    const videoData = {
      url: currentVideo.url,
      tags: currentVideo.tags || [],
      thumbUrl: currentVideo.thumbUrl,
      videoUrl: currentVideo.videoUrl,
      author: currentVideo.author,
      locationName: currentVideo.locationName,
      rating: currentVideo.rating || 0,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, videoData);
    } else {
      addVideo(videoData);
    }

    setCurrentVideo({
      url: "",
      tags: [],
      thumbUrl: "",
      videoUrl: "",
      author: "",
      locationName: "",
      rating: 0,
    });
    setActiveVideoUrl(null);
    setTiktokUsername(null);
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

  return (
    <div className="flex justify-center flex-col h-full w-[518px]">
      <div className="space-y-4 mb-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onEdit={handleEdit} />
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
            {editingVideoId && videos?.length >= 0 ? (
              <div className="mt-6 pt-4 flex justify-left">
                <button
                  onClick={handleAddOrUpdateVideo}
                  className="flex items-center gap-2 text-white bg-[#0070F3] rounded-lg p-4 font-semibold"
                >
                  Update video
                </button>
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
        <div className="flex-shrink-0 pt-6 flex items-center gap-4">
          <button
            onClick={() => {
              resetVideos();
              setActiveVideoUrl(null);
              setTiktokUsername(null);
              onPrevious();
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={videos.length === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              videos.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0070F3] text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      ) : (
        <button
          onClick={onSubmit}
          type="submit"
          disabled={videos.length === 0 || isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            videos.length === 0 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#0070F3] text-white hover:bg-blue-600"
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" />
              <p>Submit</p>
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}
    </div>
  );
};
