import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDeekshaFormStore = create(
  persist(
    (set) => ({
      gender: "Male",
      prefix: "",
      name: "",
      maritalStatus: "",
      careOf: "",
      age: "",
      guruji: "",
      formLanguage: "",

      address: {
        pincode: "",
        country: "",
        state: "",
        district: "",
        houseNumber: "",
        streetName: "",
      },

      contact: {
        phoneNumber: "",
        email: "",
        aadhaar: "",
        pan: "",
      },

      education: {
        educationLevel: "",
        occupation: "",
        languages: [],
      },

      consent: {
        spouseConsent: false,
        previousInitiation: false,
      },

      relation: {
        hasInitiatedFamily: false,
        familyMemberName: "",
        familyMemberGuru: "",
        relationship: "",
      },

      duration: {
        isAcquainted: false,
        selectedSwami: "",
        selectedCentre: "",
        eagerDuration: "",
        otherDuration: "",
      },

      books: {
        bookList: [""],
        japaMeditation: false,
        disability: false,
        hearing: false,
      },
      upasana: {
        selectedLanguage: "",
      },

      // Actions
      updatePersonalDetails: (details) =>
        set((state) => ({ ...state, ...details })),

      updateAddress: (address) =>
        set((state) => ({ address: { ...state.address, ...address } })),

      updateContact: (contact) =>
        set((state) => ({ contact: { ...state.contact, ...contact } })),

      updateEducation: (education) =>
        set((state) => ({ education: { ...state.education, ...education } })),

      updateConsent: (consent) =>
        set((state) => ({ consent: { ...state.consent, ...consent } })),

      updateRelation: (relation) =>
        set((state) => ({ relation: { ...state.relation, ...relation } })),

      updateDuration: (duration) =>
        set((state) => ({ duration: { ...state.duration, ...duration } })),

      updateBooks: (books) =>
        set((state) => ({ books: { ...state.books, ...books } })),

      updateUpasana: (upasana) =>
        set((state) => ({ upasana: { ...state.upasana, ...upasana } })),

      resetStore: () =>
        set({
          gender: "Male",
          prefix: "",
          name: "",
          maritalStatus: "",
          careOf: "",
          age: "",
          guruji: "",
          formLanguage: "",
          address: {
            pincode: "",
            country: "",
            state: "",
            district: "",
            houseNumber: "",
            streetName: "",
          },
          contact: {
            phoneNumber: "",
            email: "",
            aadhaar: "",
            pan: "",
          },
          education: {
            educationLevel: "",
            occupation: "",
            languages: [],
          },
          consent: {
            spouseConsent: false,
            previousInitiation: false,
          },
          relation: {
            hasInitiatedFamily: false,
            familyMemberName: "",
            familyMemberGuru: "",
            relationship: "",
          },
          duration: {
            isAcquainted: false,
            selectedSwami: "",
            selectedCentre: "",
            eagerDuration: "",
            otherDuration: "",
          },
          books: {
            bookList: [""],
            japaMeditation: false,
            disability: false,
            hearing: false,
          },
          upasana: {
            selectedLanguage: "",
          },
        }),
    }),
    {
      name: "deeksha-form-storage",
    }
  )
);

export default useDeekshaFormStore;
