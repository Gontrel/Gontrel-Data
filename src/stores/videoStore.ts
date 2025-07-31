import { create, StateCreator } from 'zustand';

export interface VideoData {
  id: string;
  url: string;
  tags: string[];
}

export interface VideoState {
  videos: VideoData[];
  activeVideoUrl: string | null;
  addVideo: (video: Omit<VideoData, 'id'>) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, video: Partial<VideoData>) => void;
  setActiveVideoUrl: (url: string | null) => void;
}

const videoStateCreator: StateCreator<VideoState> = (set) => ({
  videos: [],
  activeVideoUrl: null,
  addVideo: (video: Omit<VideoData, 'id'>) =>
    set((state: VideoState) => ({
      videos: [...state.videos, { ...video, id: Date.now().toString() }],
    })),
  removeVideo: (id: string) =>
    set((state: VideoState) => ({ videos: state.videos.filter((v) => v.id !== id) })),
  updateVideo: (id: string, updatedVideo: Partial<VideoData>) =>
    set((state: VideoState) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, ...updatedVideo } : v
      ),
    })),
  setActiveVideoUrl: (url) => set({ activeVideoUrl: url }),
});

export const useVideoStore = create(videoStateCreator);
