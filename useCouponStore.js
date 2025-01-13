import { create } from "zustand";

const useCouponStore = create((set) => ({
  selectedDate: new Date().toISOString().split("T")[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useCouponStore;
