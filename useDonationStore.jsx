import { create } from "zustand";

// Create Zustand store
const useDonationStore = create((set) => ({
  donations: [
    {
      name: "Mr. John Dee",
      reference: "20240103-002",
      date: "00/00/0000",
      amount: "₹432",
      arrivalDate: "00/00/0000",
      timeUntilCheckout: "2 hrs",
    },
    {
      name: "Ms. Jane Smith",
      reference: "20240103-003",
      date: "01/01/2024",
      amount: "₹500",
      arrivalDate: "01/01/2024",
      timeUntilCheckout: "20 hrs",
    },
    {
      name: "Dr. Alex Brown",
      reference: "20240103-004",
      date: "01/02/2024",
      amount: "₹600",
      arrivalDate: "01/02/2024",
      timeUntilCheckout: "1 day 6 hrs",
    },
    {
      name: "Ms. Emily White",
      reference: "20240103-005",
      date: "02/02/2024",
      amount: "₹700",
      arrivalDate: "02/02/2024",
      timeUntilCheckout: "1.5 hrs",
    },
  ],

  selectedDonation: null,

  // Function to set the selected donation
  setSelectedDonation: (donation) => {
    console.log("Setting selected donation:", donation); // Add this log
    set({ selectedDonation: donation });
  },
}));

export default useDonationStore;
