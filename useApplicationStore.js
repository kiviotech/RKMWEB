import { create } from "zustand";

const useApplicationStore = create((set) => ({
  formData: {
    name: "",
    age: "",
    gender: "",
    email: "",
    guestMembers: 1,
    occupation: "",
    deeksha: "",
    aadhaar: "",
    phoneNumber: "",
    address: {
      state: "",
      houseNumber: "",
      district: "",
      streetName: "",
      pinCode: "",
    },
    guests: [
      {
        guestName: "",
        guestAadhaar: "",
        guestRelation: "",
        guestNumber: "",
        guestOccupation: "",
        guestAddress1: {
          state: "",
          houseNumber: "",
          district: "",
          streetName: "",
          pinCode: "",
        },
        guestAddress2: {
          state: "",
          houseNumber: "",
          district: "",
          streetName: "",
          pinCode: "",
        },
      },
    ],
    visitDate: "",
    departureDate: "",
    file: null,
    visited: "",
    reason: "",
    previousVisitDate: "",
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
      if (
        name.startsWith("guestAddress1") ||
        name.startsWith("guestAddress2")
      ) {
        const [addressKey, addressField] = name.split(".");
        updatedGuests[index][addressKey] = {
          ...updatedGuests[index][addressKey],
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
      let updatedGuests = [...state.formData.guests];
      if (guestCount > updatedGuests.length) {
        updatedGuests = [
          ...updatedGuests,
          ...Array(guestCount - updatedGuests.length).fill({
            guestName: "",
            guestAadhaar: "",
            guestRelation: "",
            guestNumber: "",
            guestOccupation: "",
            guestAddress1: {
              state: "",
              houseNumber: "",
              district: "",
              streetName: "",
              pinCode: "",
            },
            guestAddress2: {
              state: "",
              houseNumber: "",
              district: "",
              streetName: "",
              pinCode: "",
            },
          }),
        ];
      } else if (guestCount < updatedGuests.length) {
        updatedGuests = updatedGuests.slice(0, guestCount);
      }

      return {
        formData: {
          ...state.formData,
          guests: updatedGuests,
          guestMembers: guestCount,
        },
      };
    }),
}));

export default useApplicationStore;
