"use client";

import { useState, useEffect } from "react";
import { Link, X, Plus } from "lucide-react";
import { useVideoStore } from "@/stores/videoStore";
import { VideoCard } from "./VideoCard";

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

  useEffect(() => {
    setActiveVideoUrl(currentVideo.url);
  }, [currentVideo.url, setActiveVideoUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVideo({ ...currentVideo, url: e.target.value });
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
    <div className="flex flex-col h-full">
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
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentVideo.url}
            onChange={handleUrlChange}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center gap-2 text-blue-500 font-semibold"
              >
                <Plus size={20} />
                <span>{editingVideoId ? 'Update video' : 'Add another video'}</span>
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
          disabled
          className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
