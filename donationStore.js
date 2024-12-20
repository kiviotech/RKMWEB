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
  donorTabs: {},
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
      console.log("Adding donation to store:", receipt);

      const currentReceipts = state.donations[type]?.receipts || [];
      const newReceiptGroup = [receipt];

      return {
        donations: {
          ...state.donations,
          [type]: {
            ...state.donations[type],
            receipts: [...currentReceipts, newReceiptGroup],
          },
        },
      };
    }),
  updateDonorDetails: (receiptNumber, details, type = "math") =>
    set((state) => {
      console.log("Updating donor details in store:", {
        receiptNumber,
        details,
        type,
      });

      const donationType = type.toLowerCase();
      const updatedReceipts = state.donations[donationType]?.receipts.map(
        (group) => {
          if (!Array.isArray(group)) return group;

          return group.map((receipt) => {
            if (receipt.receiptNumber === receiptNumber) {
              const updatedDonorDetails = {
                ...receipt.donorDetails,
                ...details,
              };
              console.log("Updated donor details:", updatedDonorDetails);

              return {
                ...receipt,
                donorDetails: updatedDonorDetails,
              };
            }
            return receipt;
          });
        }
      );

      const newState = {
        donations: {
          ...state.donations,
          [donationType]: {
            ...state.donations[donationType],
            receipts: updatedReceipts,
          },
        },
      };

      console.log("New store state:", newState);
      return newState;
    }),
  updateDonationDetails: (receiptNumber, details, type = "math") =>
    set((state) => {
      console.log("Updating donation details in store:", {
        receiptNumber,
        details,
        type,
      });

      const donationType = type.toLowerCase();
      const updatedReceipts = state.donations[donationType]?.receipts.map(
        (group) => {
          if (!Array.isArray(group)) return group;

          return group.map((receipt) => {
            if (receipt.receiptNumber === receiptNumber) {
              const updatedDonationDetails = {
                ...receipt.donationDetails,
                ...details,
                transactionDetails: {
                  ...(receipt.donationDetails?.transactionDetails || {}),
                  ...(details.transactionDetails || {}),
                },
              };
              console.log("Updated donation details:", updatedDonationDetails);

              return {
                ...receipt,
                donationDetails: updatedDonationDetails,
              };
            }
            return receipt;
          });
        }
      );

      const newState = {
        donations: {
          ...state.donations,
          [donationType]: {
            ...state.donations[donationType],
            receipts: updatedReceipts,
          },
        },
      };

      console.log("New store state:", newState);
      return newState;
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
  setDonorTab: (donorId, tabType) =>
    set((state) => ({
      donorTabs: {
        ...state.donorTabs,
        [donorId]: tabType,
      },
    })),
  getState: () => get(),
  debugStore: () => {
    console.log("Current store state:", get());
  },
}));
