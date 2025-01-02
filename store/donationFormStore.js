import { create } from "zustand";

const initialDonorDetails = {
  title: "Sri",
  name: "",
  phoneCode: "+91",
  phone: "",
  mantraDiksha: "",
  email: "",
  identityType: "Aadhaar",
  identityNumber: "",
  guestHouseNo: "",
  pincode: "",
  state: "",
  district: "",
  houseNumber: "",
  streetName: "",
  postOffice: "",
};

const initialDonationDetails = {
  purpose: "",
  donationType: "Others (Revenue)",
  amount: "",
  otherPurpose: "",
  transactionType: "cash",
  inMemoryOf: "",
  transactionDetails: {
    ddNumber: "",
    ddDate: "",
    bankName: "",
    branchName: "",
  },
};

export const useDonationFormStore = create((set) => ({
  // Donor Details (shared between Math and Mission)
  donorDetails: initialDonorDetails,

  // Separate Donation Details for Math and Mission
  mathDonationDetails: initialDonationDetails,
  missionDonationDetails: initialDonationDetails,

  // Active Tab
  activeTab: "Math",

  // Actions
  setDonorDetails: (details) =>
    set((state) => ({
      donorDetails: {
        ...state.donorDetails,
        ...details,
      },
    })),

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  setDonationDetails: (details) =>
    set((state) => {
      // Create the update object based on active tab
      const updateKey =
        state.activeTab === "Math"
          ? "mathDonationDetails"
          : "missionDonationDetails";

      return {
        // Preserve all existing state
        ...state,
        // Update only the specific donation details
        [updateKey]: {
          ...state[updateKey],
          ...details,
        },
      };
    }),

  // Reset Form
  resetForm: () =>
    set({
      donorDetails: initialDonorDetails,
      mathDonationDetails: initialDonationDetails,
      missionDonationDetails: initialDonationDetails,
    }),

  // Reset specific tab's donation details
  resetTabDonationDetails: (tab) =>
    set((state) => ({
      [tab === "Math" ? "mathDonationDetails" : "missionDonationDetails"]:
        initialDonationDetails,
    })),
}));
