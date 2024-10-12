import { create } from 'zustand';

const useApplicationStore = create((set) => ({
  formData: {
    // Page 1: NewApplicationForm.jsx
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    aadhar: "",
    occupation: "",
    guestMembers: 1,
    // address: "",
    // address: {
    //   state: "",
    //   houseNumber: "",
    //   district: "",
    //   streetName: "",
    //   pinCode: "",
    // },
    
    // Page 2: NewApplicationFormP2.jsx (Guest Details)
    // guests: [
    //   {
    //     guestName: "",
    //     guestAadhar: "",
    //     guestPhone: "",
    //     guestEmail: "",
    //     countryCode: "+91",
    //     guestAddress: {
          
    //       addressLine: "",
    //       state: "",
    //       houseNumber: "",
    //       district: "",
    //       streetName: "",
    //       pinCode: "",
    //     },
    //     // guestAddress: "",
    //   }
    // ],
    
    // Page 3: NewApplicationFormP3.jsx (Visit Details)
    // visitDate: "",
    // departureDate: "",
    // previouslyVisited: false,
    // previousVisitDate: "",
    // reasonForRevisit: "",
    // recommendationLetter: null, // for file upload
  },

  // For handling validation errors if needed
  errors: {},

  // Method to update form data dynamically
  updateFormData: (key, value) => set((state) => ({
    formData: {
      ...state.formData,
      [key]: value,
    },
  })),

  // Method to update nested fields (like address or guests)
  updateNestedData: (section, key, value) => set((state) => ({
    formData: {
      ...state.formData,
      [section]: {
        ...state.formData[section],
        [key]: value,
      },
    },
  })),
}));

export default useApplicationStore;
