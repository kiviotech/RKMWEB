import { create } from "zustand";
import { fetchReceiptDetails } from "./services/src/services/receiptDetailsService";
import { fetchGuestUniqueNo } from "./services/src/services/guestDetailsService";

const initialDonorDetails = {
  guestId: "",
  title: "",
  name: "",
  phone: "",
  deeksha: "",
  otherDeeksha: "",
  roomNo: "",
  email: "",
  identityType: "Aadhaar",
  identityNumber: "",
  pincode: "",
  state: "",
  district: "",
  postOffice: "",
  flatNo: "",
  streetName: "",
};

const initialDonationDetails = {
  purpose: "",
  specifiedPurpose: "",
  donationType: "Others (Revenue)",
  amount: "",
  panNumber: "",
  transactionType: "Cash",
  inMemoryOf: "",
  status: "",
  donationId: null,
};

const initialTransactionDetails = {
  date: "",
  transactionId: "",
  bankName: "",
  branchName: "",
};

const initialTabState = {
  math: {
    donorDetails: { ...initialDonorDetails },
    donationDetails: { ...initialDonationDetails },
    transactionDetails: { ...initialTransactionDetails },
  },
  mission: {
    donorDetails: { ...initialDonorDetails },
    donationDetails: { ...initialDonationDetails },
    transactionDetails: { ...initialTransactionDetails },
  },
  activeSection: "math",
};

const useDonationStore = create((set) => ({
  donorTabs: {
    1: {
      ...initialTabState,
      receiptNumbers: {
        math: "",
        mission: "",
      },
      uniqueNo: "",
    },
  },
  activeTabId: 1,
  nextReceiptNumbers: {
    mtNumber: 1,
    msnNumber: 1,
    uniqueNumber: 1,
  },
  fieldErrors: {
    donor: {},
    donation: {},
    transaction: {},
  },

  // Reset store to initial state
  resetStore: () =>
    set({
      donorTabs: {
        1: { ...initialTabState },
      },
      activeTabId: 1,
    }),

  // Reset specific tab to initial state
  resetTab: (tabId) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: { ...initialTabState },
      },
    })),

  // Add new donor tab
  addNewDonorTab: () =>
    set((state) => {
      const existingTabIds = Object.keys(state.donorTabs).map(Number);
      const newTabId =
        existingTabIds.length > 0 ? Math.max(...existingTabIds) + 1 : 1;
      const lastTabId =
        existingTabIds.length > 0 ? Math.max(...existingTabIds) : 0;
      const lastTab = state.donorTabs[lastTabId];

      // Safe default values
      const nextMT = lastTab?.receiptNumbers?.math
        ? parseInt(lastTab.receiptNumbers.math.split(" ")[1]) + 1
        : state.nextReceiptNumbers.mtNumber;
      const nextMSN = lastTab?.receiptNumbers?.mission
        ? parseInt(lastTab.receiptNumbers.mission.split(" ")[1]) + 1
        : state.nextReceiptNumbers.msnNumber;
      const nextUniqueNo = lastTab?.uniqueNo
        ? parseInt(lastTab.uniqueNo.substring(1)) + 1
        : state.nextReceiptNumbers.uniqueNumber;

      return {
        donorTabs: {
          ...state.donorTabs,
          [newTabId]: {
            ...initialTabState,
            receiptNumbers: {
              math: `MT ${nextMT}`,
              mission: `MSN ${nextMSN}`,
            },
            uniqueNo: `C${nextUniqueNo}`,
          },
        },
        activeTabId: newTabId,
      };
    }),

  // Remove donor tab
  removeDonorTab: (id) =>
    set((state) => {
      // If it's the last tab, create a new empty tab instead of removing
      if (Object.keys(state.donorTabs).length <= 1) {
        return {
          donorTabs: {
            1: {
              // Reset to tab ID 1
              ...initialTabState,
              receiptNumbers: {
                math: `MT ${state.nextReceiptNumbers.mtNumber}`,
                mission: `MSN ${state.nextReceiptNumbers.msnNumber}`,
              },
              uniqueNo: `C${state.nextReceiptNumbers.uniqueNumber}`,
            },
          },
          activeTabId: 1,
        };
      }

      // Normal removal logic for non-last tabs
      const newDonorTabs = { ...state.donorTabs };
      delete newDonorTabs[id];

      // Reassign IDs to maintain sequential order
      const sortedTabIds = Object.keys(newDonorTabs).sort(
        (a, b) => Number(a) - Number(b)
      );
      const reorderedTabs = {};
      sortedTabIds.forEach((oldId, index) => {
        const newId = index + 1;
        reorderedTabs[newId] = newDonorTabs[oldId];
      });

      // Update receipt numbers for all tabs
      const baseMT = state.nextReceiptNumbers.mtNumber;
      const baseMSN = state.nextReceiptNumbers.msnNumber;
      const baseUniqueNo = state.nextReceiptNumbers.uniqueNumber;

      Object.keys(reorderedTabs).forEach((id, index) => {
        reorderedTabs[id] = {
          ...reorderedTabs[id],
          receiptNumbers: {
            math: `MT ${baseMT + index}`,
            mission: `MSN ${baseMSN + index}`,
          },
          uniqueNo: `C${baseUniqueNo + index}`,
        };
      });

      // If the removed tab was active, set a new active tab
      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === id) {
        newActiveTabId = 1; // Default to first tab when active tab is removed
      } else if (state.activeTabId > id) {
        // Adjust active tab ID if it was after the removed tab
        newActiveTabId = state.activeTabId - 1;
      }

      return {
        donorTabs: reorderedTabs,
        activeTabId: newActiveTabId,
      };
    }),

  // Set active tab
  setActiveTab: (tabId) =>
    set({
      activeTabId: tabId,
    }),

  // Set active section (math/mission)
  setActiveSection: (tabId, section) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          activeSection: section,
        },
      },
    })),

  // Update donor details
  updateDonorDetails: (tabId, section, details) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          [section]: {
            ...state.donorTabs[tabId][section],
            donorDetails: {
              ...state.donorTabs[tabId][section].donorDetails,
              ...details,
            },
          },
        },
      },
    })),

  // Update donation details
  updateDonationDetails: (tabId, section, details) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          [section]: {
            ...state.donorTabs[tabId][section],
            donationDetails: {
              ...state.donorTabs[tabId][section].donationDetails,
              ...details,
            },
          },
        },
      },
    })),

  // Update transaction details
  updateTransactionDetails: (tabId, section, details) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          [section]: {
            ...state.donorTabs[tabId][section],
            transactionDetails: {
              ...state.donorTabs[tabId][section].transactionDetails,
              ...details,
            },
          },
        },
      },
    })),

  // Copy donor details from math to mission or vice versa
  copyDonorDetails: (tabId, fromSection, toSection) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          [toSection]: {
            ...state.donorTabs[tabId][toSection],
            donorDetails: {
              ...state.donorTabs[tabId][fromSection].donorDetails,
            },
          },
        },
      },
    })),

  // Add this new action
  fetchLatestReceiptNumbers: async () => {
    try {
      const [receiptDetails, guestDetails] = await Promise.all([
        fetchReceiptDetails(),
        fetchGuestUniqueNo(),
      ]);

      const mtNumbers = receiptDetails.data
        .filter((item) => item.attributes.Receipt_number?.startsWith("MT"))
        .map((item) => parseInt(item.attributes.Receipt_number.split(" ")[1]));

      const msnNumbers = receiptDetails.data
        .filter((item) => item.attributes.Receipt_number?.startsWith("MSN"))
        .map((item) => parseInt(item.attributes.Receipt_number.split(" ")[1]));

      // Get unique numbers from guestDetails instead
      const uniqueNumbers = guestDetails.data
        .filter((item) => item.attributes.unique_no)
        .map((item) => parseInt(item.attributes.unique_no.substring(1)));

      // Add debug logs
      console.log("MT Numbers:", mtNumbers);
      console.log("MSN Numbers:", msnNumbers);
      console.log("Unique Numbers:", uniqueNumbers);

      const highestMT = mtNumbers.length > 0 ? Math.max(...mtNumbers) + 1 : 1;
      const highestMSN =
        msnNumbers.length > 0 ? Math.max(...msnNumbers) + 1 : 1;
      const highestUniqueNo =
        uniqueNumbers.length > 0 ? Math.max(...uniqueNumbers) + 1 : 1;

      // Add debug logs for final values
      console.log("Highest MT:", highestMT);
      console.log("Highest MSN:", highestMSN);
      console.log("Highest Unique Number:", highestUniqueNo);

      set((state) => {
        // Update next receipt numbers
        const newState = {
          nextReceiptNumbers: {
            mtNumber: highestMT,
            msnNumber: highestMSN,
            uniqueNumber: highestUniqueNo,
          },
        };

        // Update all tabs including the initial tab
        const updatedTabs = {};
        Object.keys(state.donorTabs).forEach((tabId, index) => {
          updatedTabs[tabId] = {
            ...state.donorTabs[tabId],
            receiptNumbers: {
              math: `MT ${highestMT + index}`,
              mission: `MSN ${highestMSN + index}`,
            },
            uniqueNo: `C${highestUniqueNo + index}`,
          };
        });

        return {
          ...newState,
          donorTabs: updatedTabs,
        };
      });

      console.log("Next Available Unique Number: C", highestUniqueNo);
    } catch (error) {
      console.error("Failed to fetch receipt details:", error);
    }
  },

  setFieldErrors: (errors) =>
    set((state) => ({
      fieldErrors: {
        ...state.fieldErrors,
        ...errors,
      },
    })),
  clearFieldErrors: () =>
    set({
      fieldErrors: {
        donor: {},
        donation: {},
        transaction: {},
      },
    }),

  // Add this to your store actions
  updateUniqueNo: (tabId, uniqueNo) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...state.donorTabs[tabId],
          uniqueNo: uniqueNo,
        },
      },
    })),

  // Add to your existing store
  initializeFromDonationData: (donationData) => {
    console.log("Store - Initializing with donation data:", donationData);
    set((state) => {
      const nextTabId = Object.keys(state.donorTabs).length;

      // Fix the donor details mapping
      const correctedDonorDetails = {
        ...donationData.donorDetails,
        pincode: donationData.donorDetails.district, // district contains pincode
        state: donationData.donorDetails.postOffice, // postOffice contains state (Odisha)
        district: donationData.donorDetails.streetName, // streetName contains district (Sundergarh)
        postOffice: donationData.donorDetails.flatNo, // flatNo contains post office (Kacharu)
        flatNo: "", // Clear flatNo
        streetName: "", // Clear streetName
      };

      const donationDetailsWithStatus = {
        ...donationData.donationDetails,
        status: donationData.donationDetails.status,
        donationId: donationData.donationId,
      };

      console.log("Status being set:", donationDetailsWithStatus.status);
      console.log(
        "Donation ID being set:",
        donationDetailsWithStatus.donationId
      );

      return {
        donorTabs: {
          ...state.donorTabs,
          [nextTabId]: {
            math: {
              donorDetails: correctedDonorDetails,
              donationDetails: donationDetailsWithStatus,
              transactionDetails: donationData.transactionDetails,
            },
            mission: {
              donorDetails: correctedDonorDetails,
              donationDetails: donationDetailsWithStatus,
              transactionDetails: donationData.transactionDetails,
            },
            activeSection:
              donationData.donationDetails.donationFor?.toLowerCase() || "math",
          },
        },
        activeTabId: nextTabId,
      };
    });
  },

  // Add this new action
  clearInitializedData: (tabId) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [tabId]: {
          ...initialTabState,
          receiptNumbers: {
            math: `MT ${state.nextReceiptNumbers.mtNumber}`,
            mission: `MSN ${state.nextReceiptNumbers.msnNumber}`,
          },
          uniqueNo: `C${state.nextReceiptNumbers.uniqueNumber}`,
        },
      },
    })),
}));

export default useDonationStore;