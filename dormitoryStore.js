import { create } from "zustand";
import { fetchGuestUniqueNo } from "./services/src/services/guestDetailsService";

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
  nextUniqueNumber: 1,
  uniqueNo: "",
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
  fetchLatestUniqueNumber: async () => {
    try {
      const guestDetails = await fetchGuestUniqueNo();

      const uniqueNumbers = guestDetails.data
        .filter((item) => item.attributes.unique_no)
        .map((item) => parseInt(item.attributes.unique_no.substring(1)));

      const highestUniqueNo =
        uniqueNumbers.length > 0 ? Math.max(...uniqueNumbers) + 1 : 1;

      set((state) => ({
        nextUniqueNumber: highestUniqueNo,
        uniqueNo: `C${highestUniqueNo}`,
      }));
    } catch (error) {
      console.error("Failed to fetch unique number:", error);
    }
  },
}));

export default useDormitoryStore;
