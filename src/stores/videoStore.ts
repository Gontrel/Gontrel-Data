import { create, StateCreator } from 'zustand';

export interface VideoData {
  id: string;
  url: string;
  tags: string[];
  thumbUrl?: string;
  videoUrl?: string;
  author?: string;
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


export interface VideoState {
  videos: VideoData[];
  restaurantData: RestaurantData;
  activeVideoUrl: string | null;
  tiktokUsername: string | null;
  addVideo: (video: Omit<VideoData, 'id'>) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, video: Partial<VideoData>) => void;
  setActiveVideoUrl: (url: string | null) => void;
  setTiktokUsername: (username: string | null) => void;
  resetVideos: () => void;
  addRestaurantData: (restaurantData: RestaurantData) => void;
}

const videoStateCreator: StateCreator<VideoState> = (set) => ({
  restaurantData: {} as RestaurantData,
  videos: [],
  activeVideoUrl: null,
  tiktokUsername: null,
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
  setTiktokUsername: (username) => set({ tiktokUsername: username }),
  resetVideos: () => set({ videos: [] }),
  addRestaurantData: (restaurantData: RestaurantData) =>
    set({ restaurantData: restaurantData }),
});

export const useVideoStore = create(videoStateCreator);
