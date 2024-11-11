import { create } from "zustand";

const useGuestStore = create((set) => ({
  selectedGuest: null,
  setSelectedGuest: (guest) => set({ selectedGuest: guest }),
  clearSelectedGuest: () => set({ selectedGuest: null }),
}));

export default useGuestStore;
