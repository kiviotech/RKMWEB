import { create } from "zustand";

const initialDonorDetails = {
  title: "",
  name: "",
  phoneCode: "+91",
  phone: "",
  email: "",
  mantraDiksha: "",
  identityType: "",
  identityNumber: "",
  roomNumber: "",
  pincode: "",
  houseNumber: "",
  streetName: "",
  district: "",
  state: "",
};

const initialDonationDetails = {
  amount: 0,
  transactionType: "",
  purpose: "",
  donationType: "Others (Revenue)",
  inMemoryOf: "",
  transactionDetails: {
    ddNumber: "",
    ddDate: "",
    bankName: "",
  },
};

export const useDonationStore = create((set, get) => ({
  donationTabs: {}, // Object to hold main tabs with Math and Mission sub-tabs

  // Add a new main donation tab (Add Donation tab)
  addDonationTab: (tabId) => {
    set((state) => {
      const updatedTabs = {
        ...state.donationTabs,
        [tabId]: {
          math: [], // Donations for Math sub-tab
          mission: [], // Donations for Mission sub-tab
        },
      };
      console.log("Donation Tabs after addDonationTab:", updatedTabs); // Log the updated tabs
      return { donationTabs: updatedTabs };
    });
  },

  // Add a donation to a specific sub-tab (Math or Mission) under a specific "Add Donation" tab
  addDonation: (tabId, subTab, donationDetails) => {
    set((state) => {
      const updatedTabs = {
        ...state.donationTabs,
        [tabId]: {
          // If 'math' is selected, reset 'mission' array, and if 'mission' is selected, reset 'math' array
          [subTab]: [donationDetails], // Add donation only to the selected sub-tab
          // Ensure the other sub-tab is cleared
          ...(subTab === "Math"
            ? { mission: [] } // If 'math' is selected, clear 'mission' array
            : { Math: [] }), // If 'mission' is selected, clear 'math' array
        },
      };
      console.log("Donation Tabs after addDonation:", updatedTabs); // Log the updated tabs
      return { donationTabs: updatedTabs };
    });
  },

  // Update donation details for a specific donation by receipt number
  updateDonationDetails: (tabId, subTab, receiptNumber, updatedDetails) => {
    set((state) => {
      const currentSubTabDonations = state.donationTabs[tabId]?.[subTab] || [];
      const updatedDonations = currentSubTabDonations.map((donation) =>
        donation.receiptNumber === receiptNumber
          ? { ...donation, ...updatedDetails }
          : donation
      );
      const updatedTabs = {
        ...state.donationTabs,
        [tabId]: {
          ...state.donationTabs[tabId],
          [subTab]: updatedDonations,
        },
      };
      console.log("Donation Tabs after updateDonationDetails:", updatedTabs); // Log the updated tabs
      return { donationTabs: updatedTabs };
    });
  },

  // Get all donations for a specific sub-tab (Math or Mission) under a specific main tab
  getDonationsForSubTab: (tabId, subTab) => {
    const donations = get().donationTabs[tabId]?.[subTab] || [];
    console.log(`Donations for ${tabId} - ${subTab}:`, donations); // Log the donations for the sub-tab
    return donations;
  },

  // Remove a specific donation by receipt number from a sub-tab
  removeDonation: (tabId, subTab, receiptNumber) => {
    set((state) => {
      const currentSubTabDonations = state.donationTabs[tabId]?.[subTab] || [];
      const filteredDonations = currentSubTabDonations.filter(
        (donation) => donation.receiptNumber !== receiptNumber
      );
      const updatedTabs = {
        ...state.donationTabs,
        [tabId]: {
          ...state.donationTabs[tabId],
          [subTab]: filteredDonations,
        },
      };
      console.log("Donation Tabs after removeDonation:", updatedTabs); // Log the updated tabs
      return { donationTabs: updatedTabs };
    });
  },

  // Remove an entire main donation tab (including all Math and Mission sub-tabs)
  removeDonationTab: (tabId) => {
    set((state) => {
      const { [tabId]: _, ...remainingTabs } = state.donationTabs;
      console.log("Donation Tabs after removeDonationTab:", remainingTabs); // Log the remaining tabs
      return { donationTabs: remainingTabs };
    });
  },

  // Clear all donation tabs
  clearAllDonationTabs: () => set({ donationTabs: {} }),
}));

export default useDonationStore;
