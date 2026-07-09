"use client";

import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import React, { useRef, useEffect, useState, useId, useCallback } from "react";
import { useVideoStore } from "@/stores/videoStore";

interface VideoProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => Promise<void>;
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  muted?: boolean;
  loop?: boolean;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const VideoPlayer = ({
  videoRef: externalRef,
  onPlay,
  onPause,
  onError,
  src,
  poster,
  autoPlay = false,
  className = "",
  muted = true,
  loop = true,
}: VideoProps) => {
  const videoPlayerId = useId();
  const internalRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalRef || internalRef;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { registerVideoPlayer, unregisterVideoPlayer, playVideo } =
    useVideoStore();

  // Register/unregister video player with store
  useEffect(() => {
    const pauseVideo = () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          setIsPlaying(false);
        } catch {}
      }
    };

    const videoPlayerInstance = {
      id: videoPlayerId,
      ref: videoRef,
      pause: pauseVideo,
    };

    registerVideoPlayer(videoPlayerInstance);

    return () => {
      unregisterVideoPlayer(videoPlayerId);
    };
  }, [videoPlayerId, videoRef, registerVideoPlayer, unregisterVideoPlayer]);

  // Hardware-accelerated playback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "metadata");
      video.muted = isMuted;
    }
  }, [videoRef, isMuted]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video) {
            video.load();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (video) observer.observe(video);

    return () => observer.disconnect();
  }, [videoRef]);

  // Memory management
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [videoRef]);

  // Time, duration, and progress listeners
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
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, [videoRef]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;
      const newTime = parseFloat(e.target.value);
      video.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [videoRef]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;
      const newVolume = parseFloat(e.target.value);
      video.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && video.muted) {
        video.muted = false;
        setIsMuted(false);
      }
    },
    [videoRef]
  );

  const skip = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
    },
    [videoRef]
  );

  const handleVideoError = async (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = e.currentTarget;
    try {
      video.pause();
      video.removeAttribute("src");
      await onError?.(e);
    } catch {}
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      // Only handle if video is focused or visible
      const rect = video.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      // Skip if video is off-screen (e.g. hidden behind a portal/overlay)
      if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) return;
      // Skip if a full-screen overlay portal is open (e.g. TimestampView)
      const fullScreenPortal = document.querySelector('.fixed.right-0.top-0.h-full.z-50');
      if (fullScreenPortal) return;

      // Don't capture keyboard shortcuts when user is typing in an input
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        active?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(5);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videoRef, togglePlay, skip, toggleMute]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative aspect-video bg-black group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className={`${className} w-full h-full`}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        muted={isMuted}
        onCanPlay={() => {
          setIsLoading(false);
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          playVideo(videoPlayerId);
          onPlay?.();
          showControlsTemporarily();
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowControls(true);
          onPause?.();
        }}
        onEnded={() => setIsPlaying(false)}
        onError={handleVideoError}
        onClick={togglePlay}
        preload="metadata"
        loop={loop}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" />
      </video>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="animate-pulse text-blue-400">Loading video...</div>
        </div>
      )}

      {/* Center play button */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
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
              onClick={togglePlay}
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
          </div>
        </div>
      </div>
    </div>
  );
};
