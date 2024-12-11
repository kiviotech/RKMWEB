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

export const useDonationStore = create((set) => ({
  donations: {
    receipts: [],
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
      const currentReceipts = state.donations?.receipts || [];

      // Add donation details to the receipt with default donationType
      const receiptWithDetails = {
        ...receipt,
        donationDetails: {
          ...initialDonationDetails,
          purpose: "",
          donationType: "Others (Revenue)",
        },
      };

      // Find existing donor group
      const donorGroupIndex = currentReceipts.findIndex(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorDetails?.guestId === receipt.donorDetails?.guestId ||
            group[0].donorId === receipt.donorId)
      );

      let newReceipts;
      if (donorGroupIndex >= 0) {
        // Update existing donor group
        newReceipts = [...currentReceipts];
        const existingGroup = newReceipts[donorGroupIndex];
        const existingReceiptIndex = existingGroup.findIndex(
          (r) => r.type === receipt.type
        );

        if (existingReceiptIndex >= 0) {
          existingGroup[existingReceiptIndex] = {
            ...receiptWithDetails,
            donationDetails: {
              ...existingGroup[existingReceiptIndex].donationDetails,
              donationType: "Others (Revenue)",
            },
          };
        } else {
          existingGroup.push(receiptWithDetails);
        }
      } else {
        newReceipts = [...currentReceipts, [receiptWithDetails]];
      }

      return {
        donations: {
          ...state.donations,
          receipts: newReceipts,
        },
      };
    }),
  updateDonorDetails: (receiptNumber, details) =>
    set((state) => {
      const updatedReceipts = (state.donations?.receipts || []).map((group) =>
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
          receipts: updatedReceipts,
        },
      };
    }),
  updateDonationDetails: (receiptNumber, details) =>
    set((state) => {
      const updatedReceipts = (state.donations?.receipts || []).map((group) =>
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
          receipts: updatedReceipts,
        },
      };
    }),
  clearDonations: () =>
    set({
      donations: { receipts: [] },
    }),
}));
