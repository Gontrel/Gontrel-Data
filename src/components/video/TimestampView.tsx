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

const FRAME_WIDTH = 33;
const FRAME_HEIGHT = 60;
const FRAMES_PER_SECOND = 1;

export const TimestampView = ({ videoUrl, onBack, locationId, postId, existingTimeStamps, onSaveTimestamps }: TimestampViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(videoUrl)}`;
  const [frames, setFrames] = useState<string[]>([]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(
    null
  );
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExtracting, setIsExtracting] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameTags, setFrameTags] = useState<Record<number, string[]>>({});
  const [tagInput, setTagInput] = useState("");
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

  const isExtractingRef = useRef(false);
  const isSeekingRef = useRef(false);

  const extractFrames = useCallback(async () => {
    if (isExtractingRef.current) return;
    isExtractingRef.current = true;
    setIsExtracting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      isExtractingRef.current = false;
      setIsExtracting(false);
      return;
    }

    // Pause video before extracting frames to avoid Chrome seeking glitches
    video.pause();
    setIsPlaying(false);
    video.muted = true;

    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      isExtractingRef.current = false;
      setIsExtracting(false);
      return;
    }

    const videoDuration = video.duration;
    if (!videoDuration || isNaN(videoDuration)) {
      isExtractingRef.current = false;
      setIsExtracting(false);
      return;
    }

    setDuration(videoDuration);
    const frameCount = Math.ceil(videoDuration * FRAMES_PER_SECOND);
    const interval = 1 / FRAMES_PER_SECOND;
    const extractedFrames: string[] = [];

    for (let i = 0; i < frameCount; i++) {
      const seekTime = Math.max(0.01, Math.min(i * interval, videoDuration - 0.1));
      await new Promise<void>((resolve) => {
        let done = false;
        const capture = () => {
          if (done) return;
          done = true;
          try {
            ctx.drawImage(video, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
            extractedFrames.push(dataUrl);
          } catch (err) {
            extractedFrames.push("");
          }
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };

        const onSeeked = () => {
          // Use requestVideoFrameCallback if available (Chrome) for accurate frame capture
          if ("requestVideoFrameCallback" in video) {
            const videoWithFrameCallback = video as HTMLVideoElement & {
              requestVideoFrameCallback: (callback: () => void) => number;
            };
            videoWithFrameCallback.requestVideoFrameCallback(() => capture());
          } else {
            requestAnimationFrame(() => setTimeout(capture, 20));
          }
        };

        video.addEventListener("seeked", onSeeked);
        video.currentTime = seekTime;

        // Safety timeout in case seeked never fires
        setTimeout(() => {
          if (!done) {
            done = true;
            video.removeEventListener("seeked", onSeeked);
            try {
              ctx.drawImage(video, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
              extractedFrames.push(canvas.toDataURL("image/jpeg", 0.6));
            } catch {
              extractedFrames.push("");
            }
            resolve();
          }
        }, 1000);
      });
    }

    setFrames(extractedFrames);
    setIsExtracting(false);
    video.currentTime = 0;
    video.muted = false;
    isExtractingRef.current = false;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = async () => {
      // Wait for frames to finish extracting before playing
      await extractFrames();
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay was blocked by browser
      });
    };

    const handleError = (e: Event) => {
      // Video error occurred
    };

    video.addEventListener("loadeddata", handleCanPlay);
    video.addEventListener("error", handleError);
    if (video.readyState >= 2) {
      void handleCanPlay();
    }
    const handleSeeked = () => {
      isSeekingRef.current = false;
    };
    video.addEventListener("seeked", handleSeeked);
    return () => {
      video.removeEventListener("loadeddata", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [extractFrames, videoUrl]);

  const seekToFrame = (index: number) => {
    setSelectedFrameIndex(index);
    const video = videoRef.current;
    if (video && duration) {
      isSeekingRef.current = true;
      video.currentTime = Math.min(index / FRAMES_PER_SECOND, duration - 0.1);
      // Move indicator to this frame's position
      const indicator = indicatorRef.current;
      if (indicator) {
        const indicatorPos = index * FRAME_WIDTH + FRAME_WIDTH / 2;
        indicator.style.left = `${indicatorPos}px`;
      }
    }
  };

  const handleFrameClick = (index: number) => {
    seekToFrame(index);
    // Reset editing state when clicking a new frame
    setEditingIndex(null);
    // Load existing saved tags for this frame into frameTags
    const frameTime = index / FRAMES_PER_SECOND;
    const existingIndex = savedTimestamps.findIndex(ts => ts.time === frameTime);
    if (existingIndex !== -1) {
      setFrameTags(prev => ({
        ...prev,
        [index]: savedTimestamps[existingIndex].tags,
      }));
    }
    // Pause when a frame is clicked
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const addTagToFrame = () => {
    if (selectedFrameIndex === null || !tagInput.trim()) return;
    const tag = tagInput.trim();
    setFrameTags((prev) => ({
      ...prev,
      [selectedFrameIndex]: [...(prev[selectedFrameIndex] || []), tag],
    }));
    setTagInput("");
  };

  const removeTagFromFrame = (frameIndex: number, tagToRemove: string) => {
    setFrameTags((prev) => ({
      ...prev,
      [frameIndex]: prev[frameIndex]?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  const handleSave = () => {
    if (selectedFrameIndex === null) return;
    const time = selectedFrameIndex / FRAMES_PER_SECOND;
    const tags = frameTags[selectedFrameIndex] || [];
    const thumbUrl = frames[selectedFrameIndex] || "";

    if (editingIndex !== null) {
      // Update existing timestamp (via edit button)
      setSavedTimestamps(prev => prev.map((item, i) =>
        i === editingIndex ? { time, tags, thumbUrl } : item
      ));
      setEditingIndex(null);
    } else {
      // Check if a timestamp already exists for this time
      const existingIndex = savedTimestamps.findIndex(ts => ts.time === time);
      if (existingIndex !== -1) {
        // Update existing timestamp at same time
        setSavedTimestamps(prev => prev.map((item, i) =>
          i === existingIndex ? { time, tags, thumbUrl } : item
        ));
      } else {
        // Add new timestamp
        setSavedTimestamps(prev => [...prev, { time, tags, thumbUrl }]);
      }
    }
  };

  const handleDelete = (index: number) => {
    setSavedTimestamps(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    const timestamp = savedTimestamps[index];
    const frameIndex = Math.floor(timestamp.time * FRAMES_PER_SECOND);
    setSelectedFrameIndex(frameIndex);
    setFrameTags(prev => ({
      ...prev,
      [frameIndex]: timestamp.tags
    }));
    setEditingIndex(index);
  };

  const handleSaveChanges = async () => {
    const timestampsToSave = savedTimestamps.map(timestamp => ({
      ...timestamp,
      thumbUrl: timestamp.thumbUrl || frames[Math.floor(timestamp.time * FRAMES_PER_SECOND)] || "",
    }));

    if (!postId && onSaveTimestamps) {
      onSaveTimestamps(timestampsToSave);
      onBack();
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin-post', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId,
          postId,
          targetTimeStamps: timestampsToSave.map(ts => ({
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

  const rafRef = useRef<number | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);

  // Keep isPlayingRef in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const updateIndicator = (scrollLeft: number) => {
    const el = scrollRef.current;
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    // Indicator position = scroll position + half viewport (center of view)
    const indicatorPos = scrollLeft + el.clientWidth / 2;
    indicator.style.left = `${indicatorPos}px`;
  };

  const handleTimeUpdate = () => {
    if (isSeekingRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    if (duration > 0) {
      const frameIndex = Math.min(
        Math.floor(video.currentTime * FRAMES_PER_SECOND),
        Math.ceil(duration * FRAMES_PER_SECOND) - 1
      );
      setSelectedFrameIndex((prev) => (prev === frameIndex ? prev : frameIndex));

      // Auto-save: if we just played past a frame that had tags, save them
      if (selectedFrameIndex !== null) {
        const selectedTime = selectedFrameIndex / FRAMES_PER_SECOND;
        if (video.currentTime > selectedTime + 0.5) {
          const tags = frameTags[selectedFrameIndex];
          if (tags && tags.length > 0) {
            const existingIndex = savedTimestamps.findIndex(ts => ts.time === selectedTime);
            const thumbUrl = frames[selectedFrameIndex] || "";
            if (existingIndex === -1) {
              setSavedTimestamps(prev => [...prev, { time: selectedTime, tags, thumbUrl }]);
            } else if (JSON.stringify(savedTimestamps[existingIndex].tags) !== JSON.stringify(tags)) {
              setSavedTimestamps(prev => prev.map((item, i) =>
                i === existingIndex ? { time: selectedTime, tags, thumbUrl } : item
              ));
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (duration <= 0) return;
    let rafId: number;

    const animate = () => {
      const video = videoRef.current;
      const el = scrollRef.current;
      const indicator = indicatorRef.current;
      if (video && el && indicator && isPlayingRef.current && !isDragging.current) {
        const progress = video.currentTime / duration;
        const totalWidth = frames.length * FRAME_WIDTH;
        const indicatorPos = progress * totalWidth;

        // Move the indicator
        indicator.style.left = `${indicatorPos}px`;

        // Only scroll when indicator nears the edges
        const viewportWidth = el.clientWidth;
        const currentScroll = el.scrollLeft;
        const indicatorInView = indicatorPos - currentScroll;
        const margin = viewportWidth * 0.3;

        if (indicatorInView > viewportWidth - margin) {
          // Indicator nearing right edge, scroll right
          const targetScroll = indicatorPos - viewportWidth + margin;
          el.scrollLeft = Math.min(targetScroll, totalWidth - viewportWidth);
        } else if (indicatorInView < margin) {
          // Indicator nearing left edge, scroll left
          const targetScroll = indicatorPos - margin;
          el.scrollLeft = Math.max(0, targetScroll);
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [duration, frames.length]);

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    // Pause video when user starts dragging
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollLeft = scrollStart.current - (e.pageX - startX.current);

    // Move indicator to center of viewport
    updateIndicator(el.scrollLeft);

    // Seek video based on indicator position (center of viewport)
    if (duration > 0) {
      const totalWidth = frames.length * FRAME_WIDTH;
      const indicatorPos = el.scrollLeft + el.clientWidth / 2;
      const progress = Math.max(0, Math.min(1, indicatorPos / totalWidth));
      const video = videoRef.current;
      if (video) {
        video.currentTime = progress * duration;
        setCurrentTime(video.currentTime);
        const frameIndex = Math.min(
          Math.floor(progress * duration * FRAMES_PER_SECOND),
          Math.ceil(duration * FRAMES_PER_SECOND) - 1
        );
        setSelectedFrameIndex(frameIndex);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
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
      {/* Loading overlay */}
      {isExtracting && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070F3]"></div>
            <span className="text-sm text-gray-600">Extracting frames...</span>
          </div>
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
        {/* Left side: Video preview + frame strip */}
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

          {/* Frame strip with indicator */}
          <div className="mt-3 relative" style={{ width: 400 }}>
            {/* Scrollable frame strip */}
            <div
              ref={scrollRef}
              className="rounded select-none"
              style={{
                width: 400,
                height: 60,
                borderRadius: 4,
                overflowX: "scroll",
                overflowY: "hidden",
                cursor: "grab",
                WebkitOverflowScrolling: "touch",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {isExtracting ? (
                <div className="flex items-center justify-center text-gray-400 text-xs" style={{ width: 400, height: 60 }}>
                  Extracting frames...
                </div>
              ) : (
                <div
                  className="flex h-full relative"
                  style={{
                    width: `${frames.length * FRAME_WIDTH}px`,
                  }}
                >
                  {/* Scrub indicator bar - inside scroll content, moves across frames */}
                  <div
                    ref={indicatorRef}
                    className="absolute pointer-events-none z-10"
                    style={{
                      width: 3,
                      height: 72,
                      top: -6,
                      left: 0,
                      background: "rgba(0, 112, 243, 1)",
                      borderRadius: 2,
                      transform: "translateX(-50%)",
                    }}
                  />
                  {frames.map((frame, index) => (
                    <button
                      key={index}
                      onClick={() => handleFrameClick(index)}
                      className="flex-shrink-0 overflow-hidden border-0 p-0"
                      style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                      }}
                    >
                      <img
                        src={frame}
                        alt={`Frame ${index}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Selected frame info + saved timestamps list */}
        <div className="flex-1 flex flex-col">
          {selectedFrameIndex !== null ? (
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
                {formatTime(selectedFrameIndex / FRAMES_PER_SECOND)}
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
                {frameTags[selectedFrameIndex]?.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTagFromFrame(selectedFrameIndex, tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!frameTags[selectedFrameIndex] || frameTags[selectedFrameIndex].length === 0) && (
                  <div className="text-sm text-gray-400">No tags added yet</div>
                )}
              </div>

              {/* Auto-save hint */}
              <div className="text-xs text-gray-400 mb-6">
                Tags auto-save when video plays past this time
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm mb-6">
              Click on a frame to add tags
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
                      height: 80,
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
                      {/* Frame thumbnail */}
                      {(() => {
                        const frameIdx = Math.floor(savedTimestamp.time * FRAMES_PER_SECOND);
                        const frame = savedTimestamp.thumbUrl || frames[frameIdx];
                        return frame ? (
                          <img
                            src={frame}
                            alt={`Frame at ${formatTime(savedTimestamp.time)}`}
                            className="flex-shrink-0 rounded object-cover"
                            style={{ width: 45, height: 56 }}
                          />
                        ) : (
                          <div
                            className="flex-shrink-0 rounded bg-gray-200"
                            style={{ width: 45, height: 56 }}
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
