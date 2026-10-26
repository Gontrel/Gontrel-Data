"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import { Post, Tag } from "@/interfaces/posts";
import { formatPostTime } from "@/lib/utils";
import { AdminRoleEnum } from "@/types/enums";

interface RestaurantDetailRightPanelProps {
  currentPost: Post | null;
  tags: Tag[];
  cuisines: string[];
  availableTags: Tag[];
  availableCuisines: string[];
  onTagsChange: (tags: Tag[]) => void;
  onCuisinesChange: (cuisines: string[]) => void;
  onDeleteMedia: (postId: string) => void;
  onSaveChanges: () => void;
  onTimestampAdd?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  stats?: {
    totalLikes: number;
    totalSaves: number;
    totalViews: number;
    totalShares: number;
    totalBookings: number;
    totalInteractions: number;
  };
  googleRating?: number;
  gontrelRating?: number;
}

export const RestaurantDetailRightPanel = ({
  currentPost,
  tags,
  cuisines,
  availableTags,
  availableCuisines,
  onTagsChange,
  onCuisinesChange,
  onDeleteMedia,
  onSaveChanges,
  onTimestampAdd,
  isSaving = false,
  hasChanges = false,
  stats = {
    totalLikes: 0,
    totalSaves: 0,
    totalViews: 0,
    totalShares: 0,
    totalBookings: 0,
    totalInteractions: 0,
  },
  googleRating,
  gontrelRating,
}: RestaurantDetailRightPanelProps) => {
  const [tagInput, setTagInput] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);
  const tagInputRef = useRef<HTMLDivElement>(null);
  const cuisineInputRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.some((t) => t.id === tag.id)
  );

  const filteredCuisines = availableCuisines.filter(
    (cuisine) =>
      cuisine.toLowerCase().includes(cuisineInput.toLowerCase()) &&
      !cuisines.includes(cuisine)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
      if (cuisineInputRef.current && !cuisineInputRef.current.contains(event.target as Node)) {
        setShowCuisineDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...tags, tag]);
    setTagInput("");
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter((t) => t.id !== tagId));
  };

  const handleAddTagFromInput = () => {
    if (tagInput.trim()) {
      const existingTag = availableTags.find(
        (t) => t.name.toLowerCase() === tagInput.toLowerCase()
      );
      if (existingTag && !tags.some((t) => t.id === existingTag.id)) {
        handleAddTag(existingTag);
      }
    }
  };

  const handleAddCuisine = (cuisine: string) => {
    if (!cuisines.includes(cuisine)) {
      onCuisinesChange([...cuisines, cuisine]);
    }
    setCuisineInput("");
    setShowCuisineDropdown(false);
  };

  const handleRemoveCuisine = (cuisine: string) => {
    onCuisinesChange(cuisines.filter((c) => c !== cuisine));
  };

  const isUser = currentPost?.source === AdminRoleEnum.USER;

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {currentPost && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
                {(currentPost.user?.profileImage || currentPost.admin?.profileImage) ? (
                  <Image
                    src={currentPost.user?.profileImage || currentPost.admin?.profileImage || "/images/user.png"}
                    alt="Uploader"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">?</span>
                  </div>
                )}
                {isUser && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500">Uploaded by:</p>
                <p className="text-sm font-medium text-[#2E3032]">
                  {isUser
                    ? `${currentPost.user?.displayName || "Unknown"} (User)`
                    : currentPost.admin?.name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatPostTime(currentPost.submissionDate || currentPost.createdAt)}
              </span>
              <div className="w-px h-6 bg-gray-200" />
              <button
                onClick={() => onDeleteMedia(currentPost.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete media"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <hr className="border-gray-100" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#2E3032]">Tag</label>
            <button
              onClick={onTimestampAdd}
              disabled={!onTimestampAdd}
              className={`flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 transition-colors ${
                onTimestampAdd
                  ? "text-blue-500 hover:text-blue-600 border-blue-500 hover:bg-blue-50 cursor-pointer"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <Clock className="w-4 h-4" />
              Add time stamp
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="flex items-center gap-1 bg-gray-100 text-[#2E3032] text-sm pl-4 pr-2 py-2 rounded-full"
              >
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </span>
            ))}
          </div>

          <div ref={tagInputRef} className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex-1 flex items-center px-4">
                <span className="text-gray-300 mr-2">|</span>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagDropdown(true);
                  }}
                  onFocus={() => setShowTagDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTagFromInput();
                    }
                  }}
                  placeholder="Type a tag and press enter"
                  className="flex-1 py-3 text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddTagFromInput}
                className="px-4 py-3 text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showTagDropdown && filteredTags.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#2E3032]">Cuisine</label>

          <div ref={cuisineInputRef} className="relative">
            {cuisines.length > 0 ? (
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                <span className="flex-1 text-sm text-[#2E3032]">{cuisines[0]}</span>
                <button
                  onClick={() => handleRemoveCuisine(cuisines[0])}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => {
                    setCuisineInput(e.target.value);
                    setShowCuisineDropdown(true);
                  }}
                  onFocus={() => setShowCuisineDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (cuisineInput.trim() && !cuisines.includes(cuisineInput.trim())) {
                        handleAddCuisine(cuisineInput.trim());
                      }
                    }
                  }}
                  placeholder="Type a cuisine..."
                  className="flex-1 px-4 py-3 text-sm focus:outline-none"
                />
              </div>
            )}

            {showCuisineDropdown && filteredCuisines.length > 0 && cuisines.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCuisines.slice(0, 10).map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => handleAddCuisine(cuisine)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {(currentPost?.visibleFood || currentPost?.comment) && (
          <p className="text-sm text-[#2E3032] leading-relaxed">
            {currentPost.visibleFood || currentPost.comment}
          </p>
        )}

        <div className="flex items-center gap-2">
          {googleRating !== undefined && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-sm font-bold text-blue-600">G</span>
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-medium text-[#2E3032]">{googleRating}</span>
            </div>
          )}
          {gontrelRating !== undefined && (
            <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
              {gontrelRating}/10
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-3 gap-y-4 py-2">
          <div className="text-center border-r border-gray-200">
            <p className="text-xs text-gray-500">Total likes:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalLikes}</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-xs text-gray-500">Total saves:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalSaves}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Total views:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalViews}</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-xs text-gray-500">Total shares:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalShares}</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-xs text-gray-500">Total bookings:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Total interactions:</p>
            <p className="text-lg font-semibold text-[#2E3032]">{stats.totalInteractions}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onSaveChanges}
          disabled={isSaving || !hasChanges}
          className={`w-full py-3 rounded-lg font-medium transition-colors border ${
            hasChanges
              ? "border-blue-500 text-blue-500 hover:bg-blue-50"
              : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
