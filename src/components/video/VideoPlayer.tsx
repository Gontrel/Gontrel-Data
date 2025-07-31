"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  className = ""
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [isPlaying, setIsPlaying] = useState(false);

  // Hardware-accelerated playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute('playsinline', '');
      videoRef.current.setAttribute('preload', 'metadata');
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.load();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  // Memory management
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <div className={`relative aspect-video bg-black ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        muted={isMuted}
        onCanPlay={() => setIsLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" />
      </video>

      {/* Custom Controls */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading && (
          <div className="animate-pulse text-white">Loading video...</div>
        )}
        
        {!isPlaying && !isLoading && (
          <button
            onClick={() => {
              videoRef.current?.play();
              setIsMuted(false);
            }}
            className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition"
          >
            ▶️
          </button>
        )}
      </div>
    </div>
  );
};