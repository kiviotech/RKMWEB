import { create } from "zustand";

const useBookingStore = create((set) => ({
  allocationData: {
    allocation_date: new Date().toISOString().split("T")[0],
    arrival_date: "",
    departure_date: "",
    booking_request: "",
    beds: [],
    guests: [],
  },

  setBookingRequest: (bookingRequestId) =>
    set((state) => ({
      allocationData: {
        ...state.allocationData,
        booking_request: bookingRequestId,
      },
    })),

  setGuests: (guestIds) =>
    set((state) => ({
      allocationData: {
        ...state.allocationData,
        guests: guestIds,
      },
    })),

  setBeds: (bedIds) =>
    set((state) => ({
      allocationData: {
        ...state.allocationData,
        beds: [...new Set([...state.allocationData.beds, ...bedIds])],
      },
    })),

  setArrivalDate: (arrivalDate) =>
    set((state) => ({
      allocationData: {
        ...state.allocationData,
        arrival_date: arrivalDate,
      },
    })),

  setDepartureDate: (departureDate) =>
    set((state) => ({
      allocationData: {
        ...state.allocationData,
        departure_date: departureDate,
      },
    })),

  resetAllocationData: () =>
    set({
      allocationData: {
        allocation_date: new Date().toISOString().split("T")[0],
        arrival_date: "",
        departure_date: "",
        booking_request: "",
        beds: [],
        guests: [],
      },
    }),
}));

export default useBookingStore;
