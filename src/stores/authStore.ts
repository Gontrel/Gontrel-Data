import { create, StateCreator } from 'zustand';

export interface UserData {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  profileImage: string;
  isVerified: boolean;
  role: 'admin' | 'user';
  createdAt: string;
  modifiedAt: string;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  setUser: (user: UserData, token: string) => void;
  logout: () => void;
}

const authStateCreator: StateCreator<AuthState> = (set) => ({
  user: null,
  token: null,
  setUser: (user: UserData, token: string) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
});

export const useAuthStore = create(authStateCreator);
