// stores/authStore.ts
import { Admin } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: Admin | null;
  setUser: (user: Admin) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: async (user: Admin) => {
        set({
          user: {
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role,
          },
        });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Utility hooks for easier consumption
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === "admin");
export const useIsAnalyst = () =>
  useAuthStore((state) => state.user?.role === "analyst");
