"use client";

import { useState, useEffect } from "react";
import { Link, X, Plus } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { VideoCard } from "./VideoCard";
import { trpc } from "@/lib/trpc-client";
import { errorToast } from "@/utils/toast";

interface VideoStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const VideoStep = ({ onNext, onPrevious }: VideoStepProps) => {
  const {
    videos,
    addVideo,
    removeVideo,
    updateVideo,
    setActiveVideoUrl,
  } = useVideoStore();
  const [currentVideo, setCurrentVideo] = useState({ url: "", tags: [] as string[] });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // We use a query, but disable it so it only runs when we call `refetch`
  const { refetch } = trpc.tiktok.getLinkInfo.useQuery(
    { link: currentVideo.url },
    { enabled: false }
  );

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCurrentVideo({ ...currentVideo, url });

    const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/;
    if (tiktokRegex.test(url)) {
      try {
        const { data } = await refetch();
        if (data && data.play) {
          setActiveVideoUrl(data.play);
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

  const handleAddOrUpdateVideo = () => {
    if (!currentVideo.url) return;

    if (editingVideoId) {
      updateVideo(editingVideoId, currentVideo);
      setEditingVideoId(null);
    } else {
      addVideo(currentVideo);
    }

    setCurrentVideo({ url: "", tags: [] });
    setActiveVideoUrl(null);
  };

  const handleEdit = (id: string) => {
    const videoToEdit = videos.find((v) => v.id === id);
    if (videoToEdit) {
      setEditingVideoId(id);
      setCurrentVideo({ url: videoToEdit.url, tags: videoToEdit.tags });
      setActiveVideoUrl(videoToEdit.url);
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
          <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            id="tiktok-link"
            placeholder="https://tiktok.com"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            value={currentVideo.url}
            onChange={handleUrlChange}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
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
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
              <button
                onClick={handleAddOrUpdateVideo}
                className="flex items-center gap-2 text-[#0070F3] font-semibold"
              >
                <Plus size={20} />
                <span className="text-[#2E3032] font-figtree font-semibold text-sm leading-[100%]">
                  {editingVideoId ? "Update video" : "Add another video"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-6 flex items-center gap-4">
        <button
          onClick={onPrevious}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={videos.length === 0}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            videos.length > 0
              ? "bg-[#0070F3] text-white hover:bg-blue-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
