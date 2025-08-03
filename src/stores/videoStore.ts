import { create, StateCreator } from "zustand";
import React from "react";

export interface VideoData {
  id: string;
  url: string;
  tags: string[];
  thumbUrl?: string;
  videoUrl?: string;
  author?: string;
  locationName?: string;
  rating?: number;
}

export interface RestaurantData {
  sessionToken?: string;
  placeId: string;
  address: string;
  menu?: string;
  name?: string;
  photos?: string[];
  rating?: number;
  reservation?: string;
  website?: string;
  posts?: VideoData[];
  openingHours?: openingHours[];
}

export interface openingHours {
  dayOfTheWeek: string;
  opensAt: number;
  closesAt: number;
}

export interface VideoPlayerInstance {
  id: string;
  ref: React.RefObject<HTMLVideoElement | null>;
  pause: () => void;
}

export interface VideoState {
  videos: VideoData[];
  restaurantData: RestaurantData;
  activeVideoUrl: string | null;
  tiktokUsername: string | null;
  currentlyPlayingVideoId: string | null;
  videoPlayerInstances: Map<string, VideoPlayerInstance>;
  addVideo: (video: Omit<VideoData, "id">) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, video: Partial<VideoData>) => void;
  setActiveVideoUrl: (url: string | null) => void;
  setTiktokUsername: (username: string | null) => void;
  resetVideos: () => void;
  addRestaurantData: (restaurantData: RestaurantData) => void;
  registerVideoPlayer: (instance: VideoPlayerInstance) => void;
  unregisterVideoPlayer: (id: string) => void;
  playVideo: (id: string) => void;
  pauseAllVideosExcept: (playingVideoId: string) => void;
}

const videoStateCreator: StateCreator<VideoState> = (set, get) => ({
  restaurantData: {} as RestaurantData,
  videos: [],
  activeVideoUrl: null,
  tiktokUsername: null,
  currentlyPlayingVideoId: null,
  videoPlayerInstances: new Map<string, VideoPlayerInstance>(),
  // addVideo: (video: Omit<VideoData, "id">) =>
  //   set((state: VideoState) => ({
  //     videos: [...state.videos, { ...video, id: Date.now().toString() }],
  //   })),

  addVideo: (video: Omit<VideoData, "id">) => {
    const newVideo = {
      ...video,
      id: Date.now().toString(),
    };
    set({ videos: [...get().videos, newVideo] });
    return newVideo;
  },
  removeVideo: (id: string) =>
    set((state: VideoState) => ({
      videos: state.videos.filter((v) => v.id !== id),
    })),
  updateVideo: (id: string, updatedVideo: Partial<VideoData>) =>
    set((state: VideoState) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, ...updatedVideo } : v
      ),
    })),
  setActiveVideoUrl: (url) => set({ activeVideoUrl: url }),
  setTiktokUsername: (username) => set({ tiktokUsername: username }),
  resetVideos: () => set({ videos: [] }),
  addRestaurantData: (restaurantData: RestaurantData) =>
    set({ restaurantData: restaurantData }),
  registerVideoPlayer: (instance: VideoPlayerInstance) =>
    set((state: VideoState) => {
      const newInstances = new Map(state.videoPlayerInstances);
      newInstances.set(instance.id, instance);
      return { videoPlayerInstances: newInstances };
    }),
  unregisterVideoPlayer: (id: string) =>
    set((state: VideoState) => {
      const newInstances = new Map(state.videoPlayerInstances);
      newInstances.delete(id);
      return {
        videoPlayerInstances: newInstances,
        currentlyPlayingVideoId:
          state.currentlyPlayingVideoId === id
            ? null
            : state.currentlyPlayingVideoId,
      };
    }),
  playVideo: (id: string) => {
    const state = get();
    // Pause all other videos first
    state.pauseAllVideosExcept(id);
    set({ currentlyPlayingVideoId: id });
  },
  pauseAllVideosExcept: (playingVideoId: string) => {
    const state = get();
    state.videoPlayerInstances.forEach((instance, id) => {
      if (id !== playingVideoId && instance.ref.current) {
        instance.pause();
      }
    });
  },
});

export const useVideoStore = create(videoStateCreator);
