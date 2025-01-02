import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      counter: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setCounter: (counter) => set({ counter }),
      logout: () => set({ user: null, token: null, counter: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
