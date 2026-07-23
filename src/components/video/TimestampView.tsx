"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, Play, Pause, Trash2 } from "lucide-react";
import { TargetTimeStamp } from "@/interfaces/posts";

interface TimestampViewProps {
  videoUrl: string;
  onBack: () => void;
  locationId: string;
  postId: string;
  existingTimeStamps?: TargetTimeStamp[];
  onSaveTimestamps?: (timestamps: { time: number; tags: string[]; thumbUrl: string }[]) => void;
}

const THUMB_WIDTH = 720;
const THUMB_HEIGHT = 1280;
const THUMB_QUALITY = 0.9;

export const TimestampView = ({ videoUrl, onBack, locationId, postId, existingTimeStamps, onSaveTimestamps }: TimestampViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(videoUrl)}`;
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameTags, setFrameTags] = useState<Record<number, string[]>>({});
  const [tagInput, setTagInput] = useState("");
  const [viewingThumb, setViewingThumb] = useState<string | null>(null);
  const [savedTimestamps, setSavedTimestamps] = useState<{ time: number; tags: string[]; thumbUrl: string }[]>(
    existingTimeStamps?.map(ts => ({ time: parseFloat(ts.time), tags: ts.tags, thumbUrl: ts.thumbUrl || "" })) || []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync savedTimestamps when existingTimeStamps changes (e.g. after refetch)
  useEffect(() => {
    if (existingTimeStamps) {
      setSavedTimestamps(existingTimeStamps.map(ts => ({ time: parseFloat(ts.time), tags: ts.tags, thumbUrl: ts.thumbUrl || "" })));
    }
  }, [existingTimeStamps]);

  const captureThumbnail = useCallback((): string => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return "";
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    if (!videoWidth || !videoHeight) return "";
    canvas.width = THUMB_WIDTH;
    canvas.height = THUMB_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const scale = Math.max(THUMB_WIDTH / videoWidth, THUMB_HEIGHT / videoHeight);
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;
    const offsetX = (THUMB_WIDTH - scaledWidth) / 2;
    const offsetY = (THUMB_HEIGHT - scaledHeight) / 2;
    ctx.drawImage(video, offsetX, offsetY, scaledWidth, scaledHeight);
    return canvas.toDataURL("image/jpeg", THUMB_QUALITY);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoaded = () => {
      setDuration(video.duration || 0);
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    video.addEventListener("loadedmetadata", handleLoaded);
    if (video.readyState >= 1) void handleLoaded();
    return () => video.removeEventListener("loadedmetadata", handleLoaded);
  }, [videoUrl]);

  const addTagToFrame = () => {
    if (!tagInput.trim()) return;
    const video = videoRef.current;
    const time = video ? video.currentTime : currentTime;
    const tag = tagInput.trim();
    const timeKey = Math.floor(time);
    setFrameTags((prev) => ({
      ...prev,
      [timeKey]: [...(prev[timeKey] || []), tag],
    }));
    setTagInput("");
  };

  const removeTagFromFrame = (tagToRemove: string) => {
    const video = videoRef.current;
    const time = video ? video.currentTime : currentTime;
    const timeKey = Math.floor(time);
    setFrameTags((prev) => ({
      ...prev,
      [timeKey]: prev[timeKey]?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  const handleSave = () => {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;
    const timeKey = Math.floor(time);
    const tags = frameTags[timeKey] || [];
    if (tags.length === 0) return;
    const thumbUrl = captureThumbnail();

    if (editingIndex !== null) {
      setSavedTimestamps(prev => prev.map((item, i) =>
        i === editingIndex ? { time, tags, thumbUrl } : item
      ));
      setEditingIndex(null);
    } else {
      const existingIndex = savedTimestamps.findIndex(ts => Math.abs(ts.time - time) < 0.5);
      if (existingIndex !== -1) {
        setSavedTimestamps(prev => prev.map((item, i) =>
          i === existingIndex ? { time, tags, thumbUrl } : item
        ));
      } else {
        setSavedTimestamps(prev => [...prev, { time, tags, thumbUrl }]);
      }
    }
  };

  const handleDelete = (index: number) => {
    setSavedTimestamps(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    const timestamp = savedTimestamps[index];
    const video = videoRef.current;
    if (video) {
      video.currentTime = timestamp.time;
      setCurrentTime(timestamp.time);
    }
    const timeKey = Math.floor(timestamp.time);
    setFrameTags(prev => ({
      ...prev,
      [timeKey]: timestamp.tags
    }));
    setEditingIndex(index);
  };

  const uploadThumbnail = async (dataUrl: string): Promise<string> => {
    if (!dataUrl || dataUrl.startsWith("http")) return dataUrl;
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob, `timestamp_${Date.now()}.jpg`);
    const uploadResponse = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });
    if (!uploadResponse.ok) throw new Error("Failed to upload thumbnail");
    const data = await uploadResponse.json();
    return data.url || data.videoUrl || data.thumbUrl || data.location || "";
  };

  const handleSaveChanges = async () => {
    const timestampsToSave = savedTimestamps.map(timestamp => ({
      ...timestamp,
      thumbUrl: timestamp.thumbUrl || "",
    }));

    if (!postId && onSaveTimestamps) {
      onSaveTimestamps(timestampsToSave);
      onBack();
      return;
    }

    setIsSaving(true);
    try {
      const uploadedTimestamps = await Promise.all(
        timestampsToSave.map(async ts => ({
          ...ts,
          thumbUrl: await uploadThumbnail(ts.thumbUrl),
        }))
      );

      const response = await fetch('/api/admin-post', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId,
          postId,
          targetTimeStamps: uploadedTimestamps.map(ts => ({
            time: ts.time.toString(),
            tags: ts.tags,
            thumbUrl: ts.thumbUrl,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || 'Failed to save timestamps';
        alert(`Error (${response.status}): ${errorMessage}`);
        return;
      }

      // Show success toast
      alert(`Success (${response.status}): Timestamps saved successfully!`);
      onBack();
    } catch (error: unknown) {
      // Show actual error
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const isPlayingRef = useRef(false);

  // Keep isPlayingRef in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    // Auto-save: if we just played past a time that had tags, save them
    const timeKey = Math.floor(video.currentTime);
    const tags = frameTags[timeKey];
    if (tags && tags.length > 0) {
      const tagTime = timeKey;
      const existingIndex = savedTimestamps.findIndex(ts => Math.abs(ts.time - tagTime) < 0.5);
      if (existingIndex === -1) {
        const thumbUrl = captureThumbnail();
        setSavedTimestamps(prev => [...prev, { time: tagTime, tags, thumbUrl }]);
      } else if (JSON.stringify(savedTimestamps[existingIndex].tags) !== JSON.stringify(tags)) {
        const thumbUrl = captureThumbnail();
        setSavedTimestamps(prev => prev.map((item, i) =>
          i === existingIndex ? { time: tagTime, tags, thumbUrl } : item
        ));
      }
    }
  };

  useEffect(() => {
    if (duration <= 0) return;
    let rafId: number;
    const animate = () => {
      const video = videoRef.current;
      if (video && isPlayingRef.current) {
        setCurrentTime(video.currentTime);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [duration]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Spacebar to play/pause (unless typing in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = progress * duration;
    setCurrentTime(video.currentTime);
    if (!video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full w-full p-6 overflow-y-auto relative">
      {/* Thumbnail view modal */}
      {viewingThumb && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setViewingThumb(null)}
        >
          <img
            src={viewingThumb}
            alt="Thumbnail preview"
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: 8 }}
          />
          <button
            onClick={() => setViewingThumb(null)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ×
          </button>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#0070F3] font-medium text-sm mb-4"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Title */}
      <span
        style={{
          fontFamily: "Figtree",
          fontWeight: 600,
          fontStyle: "normal",
          fontSize: "24px",
          lineHeight: "32px",
          letterSpacing: "0%",
          color: "rgba(0, 0, 0, 1)",
          display: "inline-block",
          marginBottom: 16,
        }}
      >
        Add timestamp
      </span>

      <div className="flex gap-6 w-full">
        {/* Left side: Video preview + timeline */}
        <div className="flex flex-col flex-shrink-0" style={{ width: 400, minWidth: 400 }}>
          {/* Video preview frame */}
          <div
            className="bg-black rounded-lg overflow-hidden relative"
            style={{ width: 400, height: 500 }}
          >
            <video
              ref={videoRef}
              src={proxyUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              playsInline
              crossOrigin="anonymous"
              preload="auto"
            />
            {/* Play/Pause overlay */}
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
            >
              {isPlaying ? (
                <Pause size={48} className="text-white/80" />
              ) : (
                <Play size={48} className="text-white/80" />
              )}
            </button>
          </div>

          {/* Timeline scrubber */}
          <div className="mt-3" style={{ width: 400 }}>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              onClick={handleTimelineClick}
              className="relative bg-gray-200 rounded-full"
              style={{ width: "100%", height: 8, cursor: "pointer" }}
            >
              <div
                className="absolute top-0 left-0 rounded-full"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  height: "100%",
                  background: "rgba(0, 112, 243, 1)",
                }}
              />
              <div
                className="absolute rounded-full bg-white border-2 border-[#0070F3]"
                style={{
                  width: 14,
                  height: 14,
                  top: -3,
                  left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  transform: "translateX(-50%)",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side: Current time info + saved timestamps list */}
        <div className="flex-1 flex flex-col">
          {duration > 0 ? (
            <div className="flex flex-col">
              {/* Time display */}
              <div
                style={{
                  fontFamily: "Figtree",
                  fontWeight: 600,
                  fontSize: "32px",
                  lineHeight: "40px",
                  color: "rgba(0, 0, 0, 1)",
                  marginBottom: 16,
                }}
              >
                {formatTime(currentTime)}
              </div>

              {/* Tag input */}
              <input
                type="text"
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTagToFrame();
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3] mb-4"
              />

              {/* Tags display */}
              <div className="flex flex-wrap gap-2 mb-4">
                {frameTags[Math.floor(videoRef.current?.currentTime || currentTime)]?.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTagFromFrame(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!frameTags[Math.floor(videoRef.current?.currentTime || currentTime)] || frameTags[Math.floor(videoRef.current?.currentTime || currentTime)].length === 0) && (
                  <div className="text-sm text-gray-400">No tags added yet</div>
                )}
              </div>

              {/* Save timestamp button */}
              <button
                onClick={handleSave}
                disabled={!(frameTags[Math.floor(videoRef.current?.currentTime || currentTime)]?.length > 0)}
                style={{
                  width: 140,
                  height: 40,
                  borderRadius: 8,
                  opacity: frameTags[Math.floor(videoRef.current?.currentTime || currentTime)]?.length > 0 ? 1 : 0.5,
                  background: "rgba(0, 112, 243, 1)",
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                {editingIndex !== null ? "Update Timestamp" : "Save Timestamp"}
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm mb-6">
              Loading video...
            </div>
          )}

          {/* Saved timestamps list - always visible */}
          {savedTimestamps.length > 0 && (
            <div className="flex flex-col flex-1">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Saved Timestamps
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                {savedTimestamps.map((savedTimestamp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                    style={{
                      width: 574,
                      height: 110,
                      borderRadius: 8,
                      borderWidth: 1,
                      paddingTop: 12,
                      paddingRight: 24,
                      paddingBottom: 12,
                      paddingLeft: 12,
                      gap: 22,
                      background: "rgba(255, 255, 255, 1)",
                      border: "1px solid rgba(240, 241, 242, 1)",
                    }}
                  >
                    {/* Left-aligned group: frame + timestamp + tags */}
                    <div className="flex items-center gap-4">
                      {/* Frame thumbnail - clickable to view */}
                      {(() => {
                        const frame = savedTimestamp.thumbUrl;
                        return frame ? (
                          <img
                            src={frame}
                            alt={`Frame at ${formatTime(savedTimestamp.time)}`}
                            className="flex-shrink-0 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ width: 67, height: 90 }}
                            onClick={() => setViewingThumb(frame)}
                          />
                        ) : (
                          <div
                            className="flex-shrink-0 rounded bg-gray-200"
                            style={{ width: 67, height: 90 }}
                          />
                        );
                      })()}

                      {/* Timestamp and tags column */}
                      <div className="flex flex-col gap-2">
                      {/* Timestamp */}
                      <div
                        style={{
                          fontFamily: "Figtree",
                          fontWeight: 500,
                          fontSize: 16,
                          lineHeight: "20px",
                          letterSpacing: 0,
                          color: "rgba(23, 26, 28, 1)",
                        }}
                      >
                        {formatTime(savedTimestamp.time)}
                      </div>

                      {/* Tags pills */}
                      <div className="flex flex-wrap gap-2">
                        {savedTimestamp.tags.map((tag: string, tagIndex: number) => (
                          <div
                            key={tagIndex}
                            style={{
                              height: 32,
                              borderRadius: 40,
                              borderWidth: 1,
                              paddingTop: 4,
                              paddingRight: 16,
                              paddingBottom: 4,
                              paddingLeft: 16,
                              gap: 8,
                              background: "rgba(230, 241, 254, 1)",
                              border: "1px solid rgba(138, 189, 249, 1)",
                            }}
                            className="text-sm font-medium"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                      </div>
                    </div>

                    {/* Right side: Edit and trash row */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-[#0070F3] font-medium text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <div className="w-px h-4 bg-gray-300" />
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Changes button at bottom of list */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  style={{
                    width: 120,
                    height: 44,
                    minWidth: 120,
                    borderRadius: 8,
                    opacity: isSaving ? 0.5 : 1,
                    paddingTop: 6,
                    paddingRight: 16,
                    paddingBottom: 6,
                    paddingLeft: 16,
                    gap: 4,
                    background: "rgba(0, 112, 243, 1)",
                    fontFamily: "Figtree",
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "20px",
                    letterSpacing: 0,
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
