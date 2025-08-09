"use client";

import { Play } from 'lucide-react';
import React, { useRef, useEffect, useState, useId } from 'react';
import { useVideoStore } from '@/stores/videoStore';

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

  const { registerVideoPlayer, unregisterVideoPlayer, playVideo } = useVideoStore();

  // Register/unregister video player with store
  useEffect(() => {
    const pauseVideo = () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          setIsPlaying(false);
        } catch {

        }
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
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'metadata');
    }
  }, [videoRef]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
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
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [videoRef]);

  const handleVideoError = async (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;

    try {
      video.pause();
      video.removeAttribute('src');
      await onError?.(e);
    } catch (cleanupError) {
      console.warn('Error during video cleanup after error:', cleanupError);
    }
  }

  return (
    <div className={`relative aspect-video bg-transparent $`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        muted={muted}
        onCanPlay={() => {
          setIsLoading(false);
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(error => {
              console.warn('Autoplay failed:', error);
            });
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          playVideo(videoPlayerId);
          onPlay?.();
        }}
        onPause={() => {
          setIsPlaying(false);
          onPause?.();
        }}
        onEnded={() => setIsPlaying(false)}
        onError={handleVideoError}
        preload="metadata"
        loop={loop}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" />
      </video>

      {/* Custom Controls */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading && (
          <div className="animate-pulse text-blue-400">Loading video...</div>
        )}

        {!isPlaying && !isLoading && (
          <button
            onClick={() => {
              videoRef.current?.play();
            }}
            title="Play video"
            className="bg-black/30 hover:bg-black/50 transition rounded-full p-4"
          >
            <Play className="text-white w-12 h-12" fill="currentColor" />
          </button>
        )}
      </div>

    </div>
  );
};