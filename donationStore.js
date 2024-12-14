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
      const receiptWithDetails = {
        ...receipt,
        donationDetails: {
          ...initialDonationDetails,
          purpose: "",
          donationType: "Others (Revenue)",
        },
      };
      const donorGroupIndex = currentReceipts.findIndex(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorDetails?.guestId === receipt.donorDetails?.guestId ||
            group[0].donorId === receipt.donorId)
      );
      let newReceipts;
      if (donorGroupIndex >= 0) {
        newReceipts = [...currentReceipts];
        const existingGroup = newReceipts[donorGroupIndex];
        existingGroup.push(receiptWithDetails);
      } else {
        newReceipts = [...currentReceipts, [receiptWithDetails]];
      }
      return {
        donations: {
          ...state.donations,
          [type]: {
            ...state.donations[type],
            receipts: newReceipts,
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
  updateDonationDetails: (receiptNumber, details, type) =>
    set((state) => {
      const updatedReceipts = (
        state.donations[type.toLowerCase()]?.receipts || []
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
          [type.toLowerCase()]: {
            ...state.donations[type.toLowerCase()],
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
}));
