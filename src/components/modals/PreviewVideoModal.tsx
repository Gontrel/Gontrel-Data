"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { VideoModal } from "./VideoModal";
import Icon from "../svgs/Icons";
import { useVideoStore } from "@/stores/videoStore";
import { Maximize2, Minimize2, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

interface PreviewModalProps {
  width?: string;
  showCloseButton?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const PreviewVideoModal = ({ open, onOpenChange, children, width = "w-[1177px]", showCloseButton = true }: PreviewModalProps) => {
  const { activeVideoUrl, setActiveVideoUrl } = useVideoStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setActiveVideoUrl(null);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (open && activeVideoUrl && videoRef.current) {
      videoRef.current.src = activeVideoUrl;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      setIsPlaying(false);
    }
  }, [open, activeVideoUrl]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <VideoModal
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width={width}
      className="flex flex-row z-30"
    >
      <div className="relative h-full flex flex-row">
        {showCloseButton && <button
          onClick={handleClose}
          className=" right-6 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close preview modal"
          title="Close preview modal"
        >
          <Icon name="cancelModalIcon" className="w-6 h-6" />
        </button>}
        {/* Transparent Left Side (638px) - Shows content behind */}
        <div className="w-[638px] bg-transparent flex flex-row items-center">
          <section className="w-[539px] h-full flex flex-col items-center mt-[33px]">
            <h2 className="text-2xl font-semibold self-start text-[#2E3032] ml-[40px]">
              Video preview
            </h2>

            <div className="mt-[40px]">
              <div
                ref={containerRef}
                className="bg-black rounded-lg overflow-hidden relative group"
                style={{ width: 448, height: 400 }}
                onMouseMove={showControlsTemporarily}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  playsInline
                  preload="auto"
                  onClick={togglePlayPause}
                  onPlay={() => { setIsPlaying(true); showControlsTemporarily(); }}
                  onPause={() => { setIsPlaying(false); setShowControls(true); }}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Center play/pause button */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlayPause}
                      title="Play video"
                      className="bg-black/30 hover:bg-black/50 transition rounded-full p-4"
                    >
                      <Play className="text-white w-12 h-12" fill="currentColor" />
                    </button>
                  </div>
                )}

                {/* Bottom Controls Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300 ${
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                      style={{
                        background: `linear-gradient(to right, #0070F3 ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%)`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlayPause}
                        title={isPlaying ? "Pause" : "Play"}
                        className="text-white hover:text-blue-400 transition"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5" fill="currentColor" />
                        )}
                      </button>

                      {/* Skip backward */}
                      <button
                        onClick={() => skip(-5)}
                        title="Rewind 5s"
                        className="text-white hover:text-blue-400 transition"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      {/* Skip forward */}
                      <button
                        onClick={() => skip(5)}
                        title="Forward 5s"
                        className="text-white hover:text-blue-400 transition"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      {/* Time display */}
                      <span className="text-xs text-white/90 font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Volume */}
                      <button
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                        className="text-white hover:text-blue-400 transition"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                        style={{
                          background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`,
                        }}
                      />

                      {/* Fullscreen toggle */}
                      <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                        className="text-white hover:text-blue-400 transition"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <aside className="flex flex-col justify-center pl-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
              <span>{isFullscreen ? "Exit fullscreen" : "Expand"}</span>
            </button>
          </aside>
        </div>

        {/* Gray Right Side (Scrollable Content) */}
        <div className="flex-1 bg-transparent flex flex-col overflow-y-auto z-10"></div>
      </div>
    </VideoModal>
  );
};

export { PreviewVideoModal };
