import { create } from "zustand";

const useApplicationStore = create((set) => ({
  formData: {
    title: "",
    name: "",
    age: "",
    gender: "",
    email: "",
    guestMembers: 1,
    occupation: "",
    deeksha: "",
    aadhaar: "",
    phoneNumber: "",
    countryCode: "",
    address: {
      state: "",
      houseNumber: "",
      district: "",
      streetName: "",
      postOffice: "",
      pinCode: "",
    },
    guests: [
      {
        guestTitle: "",
        guestName: "",
        guestAge: "",
        guestGender: "",
        guestEmail: "",
        guestNumber: "",
        countryCode: "91",
        guestOccupation: "",
        guestDeeksha: "",
        guestAadhaar: "",
        guestRelation: "",
        guestRelationOther: "",
        guestAddress: {
          state: "",
          houseNumber: "",
          district: "",
          streetName: "",
          postOffice: "",
          pinCode: "",
        },
        sameAsApplicant: false,
      },
    ],
    visitDate: "",
    visitTime: "10:30",
    arrivalDate: "",
    departureDate: "",
    departureTime: "",
    file: null,
    visited: "",
    reason: "",
    previousVisitDate: "",
    knownToMath: "",
  },
  errors: {},

  setFormData: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    })),

  setAddressData: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        address: {
          ...state.formData.address,
          [name]: value,
        },
      },
    })),

  setGuestData: (index, name, value) =>
    set((state) => {
      const updatedGuests = [...state.formData.guests];
      if (name.startsWith("guestAddress.")) {
        const addressField = name.split(".")[1];
        updatedGuests[index].guestAddress = {
          ...updatedGuests[index].guestAddress,
          [addressField]: value,
        };
      } else {
        updatedGuests[index] = { ...updatedGuests[index], [name]: value };
      }
      return {
        formData: {
          ...state.formData,
          guests: updatedGuests,
        },
      };
    }),

  setVisitFormData: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    })),

  setFile: (file) =>
    set((state) => ({
      formData: {
        ...state.formData,
        file: file,
      },
    })),

  setErrors: (name, error) =>
    set((state) => ({
      errors: {
        ...state.errors,
        [name]: error,
      },
    })),

  updateGuestMembers: (guestCount) =>
    set((state) => {
      const initialGuestState = {
        guestTitle: "",
        guestName: "",
        guestAge: "",
        guestGender: "",
        guestEmail: "",
        guestNumber: "",
        countryCode: "91",
        guestOccupation: "",
        guestDeeksha: "",
        guestAadhaar: "",
        guestRelation: "",
        guestRelationOther: "",
        guestAddress: {
          state: "",
          houseNumber: "",
          district: "",
          streetName: "",
          landmark: "",
          postOffice: "",
          pinCode: "",
        },
        sameAsApplicant: false,
      };

      const updatedGuests = Array(guestCount)
        .fill()
        .map((_, index) => {
          if (index < state.formData.guests.length) {
            return state.formData.guests[index];
          } else {
            return { ...initialGuestState };
          }
        });

      return {
        formData: {
          ...state.formData,
          guests: updatedGuests,
          guestMembers: guestCount,
        },
      };
    }),

  setCountryCode: (value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        countryCode: value,
      },
    })),

  removeGuest: (guestIndex) =>
    set((state) => {
      const updatedGuests = state.formData.guests.filter(
        (_, index) => index !== guestIndex
      );

      return {
        formData: {
          ...state.formData,
          guests: updatedGuests,
          guestMembers: Math.max(1, state.formData.guestMembers - 1),
        },
      };
    }),

  resetForm: () =>
    set((state) => ({
      formData: {
        title: "",
        name: "",
        age: "",
        gender: "",
        email: "",
        guestMembers: 1,
        occupation: "",
        deeksha: "",
        aadhaar: "",
        phoneNumber: "",
        countryCode: "",
        address: {
          state: "",
          houseNumber: "",
          district: "",
          streetName: "",
          postOffice: "",
          pinCode: "",
        },
        guests: [],
        visitDate: "",
        visitTime: "",
        departureDate: "",
        departureTime: "",
        file: null,
        visited: "",
        reason: "",
        previousVisitDate: "",
        knownToMath: "",
      },
      errors: {},
    })),
}));

export default useApplicationStore;
