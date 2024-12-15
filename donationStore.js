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
  donations: {
    math: { receipts: [] },
    mission: { receipts: [] },
  },
  receiptNumbers: {
    Math: 1,
    Mission: 1,
  },
  getNextReceiptNumber: (type) =>
    set((state) => ({
      receiptNumbers: {
        ...state.receiptNumbers,
        [type]: state.receiptNumbers[type] + 1,
      },
    })),
  setInitialReceiptNumbers: (mathNumber, missionNumber) =>
    set({
      receiptNumbers: {
        Math: mathNumber,
        Mission: missionNumber,
      },
    }),
  addDonation: (receipt) =>
    set((state) => {
      const type = receipt.type.toLowerCase();
      const currentReceipts = state.donations[type]?.receipts || [];

      // Check if donor already exists in this tab
      const existingDonorGroup = currentReceipts.find(
        (group) =>
          Array.isArray(group) &&
          group[0]?.donorDetails?.guestId === receipt.donorDetails?.guestId
      );

      // If donor exists, don't add duplicate
      if (existingDonorGroup) {
        return state;
      }

      const receiptWithDetails = {
        ...receipt,
        donationDetails: {
          ...initialDonationDetails,
          purpose: receipt.donationDetails?.purpose || "",
          donationType:
            receipt.donationDetails?.donationType || "Others (Revenue)",
        },
      };

      return {
        donations: {
          ...state.donations,
          [type]: {
            ...state.donations[type],
            receipts: [...currentReceipts, [receiptWithDetails]],
          },
        },
      };
    }),
  updateDonorDetails: (receiptNumber, details, type) =>
    set((state) => {
      const updatedReceipts = (
        state.donations[type.toLowerCase()]?.receipts || []
      ).map((group) =>
        Array.isArray(group)
          ? group.map((receipt) =>
              receipt.receiptNumber === receiptNumber
                ? { ...receipt, donorDetails: details }
                : receipt
            )
          : []
      );
      return {
        donations: {
          ...state.donations,
          [type.toLowerCase()]: {
            ...state.donations[type.toLowerCase()],
            receipts: updatedReceipts,
          },
        },
      };
    }),
  updateDonationDetails: (receiptNumber, details, type = "") =>
    set((state) => {
      // Default to math if no type provided
      const donationType = type.toLowerCase() || "math";

      const updatedReceipts = (
        state.donations[donationType]?.receipts || []
      ).map((group) =>
        Array.isArray(group)
          ? group.map((receipt) =>
              receipt.receiptNumber === receiptNumber
                ? {
                    ...receipt,
                    donationDetails: {
                      ...receipt.donationDetails,
                      ...details,
                      donationType:
                        details.donationType ||
                        receipt.donationDetails?.donationType ||
                        "Others (Revenue)",
                      transactionDetails: {
                        ...(receipt.donationDetails?.transactionDetails || {}),
                        ...(details.transactionDetails || {}),
                      },
                    },
                  }
                : receipt
            )
          : []
      );
      return {
        donations: {
          ...state.donations,
          [donationType]: {
            ...state.donations[donationType],
            receipts: updatedReceipts,
          },
        },
      };
    }),
  clearDonations: () =>
    set({
      donations: {
        math: { receipts: [] },
        mission: { receipts: [] },
      },
    }),
  getDonorData: (guestId, type) => {
    const state = get();
    const receipts = state.donations[type.toLowerCase()]?.receipts || [];
    const donorGroup = receipts.find(
      (group) =>
        Array.isArray(group) && group[0]?.donorDetails?.guestId === guestId
    );
    return donorGroup ? donorGroup[0] : null;
  },
}));
