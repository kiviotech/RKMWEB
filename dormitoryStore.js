import { create } from "zustand";

const initialFormData = {
  title: "",
  institutionName: "",
  contactPersonName: "",
  institutionType: "",
  otherInstitutionType: "",
  age: "",
  gender: "",
  email: "",
  deeksha: "",
  aadhaar: "",
  countryCode: "91",
  phoneNumber: "",
  address: {
    pinCode: "",
    houseNumber: "",
    state: "",
    district: "",
    streetName: "",
  },
  accommodation: {
    totalPeople: "",
    maleDevotees: "",
    femaleDevotees: "",
    specialRequests: "",
  },
  visitDetails: {
    visitDate: "",
    visitTime: "",
    departureDate: "",
    departureTime: "",
    visited: "",
    previousVisitDate: "",
    reason: "",
    file: null,
  },
  errors: {},
};

const useDormitoryStore = create((set) => ({
  formData: initialFormData,
  updateFormData: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
    })),
  updateAddress: (newAddress) =>
    set((state) => ({
      formData: {
        ...state.formData,
        address: { ...state.formData.address, ...newAddress },
      },
    })),
  resetForm: () => set({ formData: initialFormData }),
  updateVisitDetails: (newVisitDetails) =>
    set((state) => ({
      formData: {
        ...state.formData,
        visitDetails: { ...state.formData.visitDetails, ...newVisitDetails },
      },
    })),
  setErrors: (fieldName, error) =>
    set((state) => ({
      formData: {
        ...state.formData,
        errors: {
          ...state.formData.errors,
          [fieldName]: error,
        },
      },
    })),
  clearErrors: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        errors: {},
      },
    })),
}));

export default useDormitoryStore;
