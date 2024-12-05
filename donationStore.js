import { create } from "zustand";

const initialDonorDetails = {
  title: 'Sri',
  name: '',
  phoneCode: '+91',
  phone: '',
  email: '',
  mantraDiksha: '',
  identityType: '',
  identityNumber: '',
  roomNumber: '',
  pincode: '',
  houseNumber: '',
  streetName: '',
  district: '',
  state: ''
};

const initialDonationDetails = {
  amount: 0,
  transactionType: '',
  inMemoryOf: '',
  transactionDetails: {
    ddNumber: '',
    ddDate: '',
    bankName: ''
  }
};

export const useDonationStore = create((set) => ({
  donations: {
    receipts: []
  },
  addDonation: (receipt) => set((state) => {
    const currentReceipts = state.donations?.receipts || [];
    
    // Add donation details to the receipt
    const receiptWithDetails = {
      ...receipt,
      donationDetails: initialDonationDetails
    };
    
    // Find existing donor group
    const donorGroupIndex = currentReceipts.findIndex(group => 
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
      const existingReceiptIndex = existingGroup.findIndex(r => r.type === receipt.type);
      
      if (existingReceiptIndex >= 0) {
        // Preserve existing donation details if they exist
        const existingDonationDetails = existingGroup[existingReceiptIndex].donationDetails || initialDonationDetails;
        existingGroup[existingReceiptIndex] = {
          ...receiptWithDetails,
          donationDetails: existingDonationDetails
        };
      } else {
        // Add new receipt to group
        existingGroup.push(receiptWithDetails);
      }
    } else {
      // Add new donor group
      newReceipts = [
        ...currentReceipts,
        [receiptWithDetails]
      ];
    }

    return {
      donations: {
        ...state.donations,
        receipts: newReceipts
      }
    };
  }),
  updateDonorDetails: (receiptNumber, details) => set((state) => {
    const updatedReceipts = (state.donations?.receipts || []).map(group =>
      Array.isArray(group) ? group.map(receipt =>
        receipt.receiptNumber === receiptNumber
          ? { ...receipt, donorDetails: details }
          : receipt
      ) : []
    );

    return {
      donations: {
        ...state.donations,
        receipts: updatedReceipts
      }
    };
  }),
  updateDonationDetails: (receiptNumber, details) => set((state) => {
    const updatedReceipts = (state.donations?.receipts || []).map(group =>
      Array.isArray(group) ? group.map(receipt =>
        receipt.receiptNumber === receiptNumber
          ? { 
              ...receipt, 
              donationDetails: {
                ...receipt.donationDetails,
                ...details,
                // Preserve transaction details if they exist
                transactionDetails: {
                  ...(receipt.donationDetails?.transactionDetails || {}),
                  ...(details.transactionDetails || {})
                }
              }
            }
          : receipt
      ) : []
    );

    return {
      donations: {
        ...state.donations,
        receipts: updatedReceipts
      }
    };
  }),
  clearDonations: () => set({
    donations: { receipts: [] }
  }),
}));
