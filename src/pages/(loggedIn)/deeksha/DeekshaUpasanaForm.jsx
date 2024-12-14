import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import { createNewDeeksha } from "../../../../services/src/services/deekshaService";
import "./DeekshaUpasanaForm.scss";

const translations = {
  english: {
    selectBookletLanguage:
      "In which language would you like to take the Upasana Booklet during initiation?",
    selectLanguage: "Select the language",
    back: "Back",
    submit: "Submit",
  },
  hindi: {
    selectBookletLanguage:
      "दीक्षा के दौरान आप किस भाषा में उपासना पुस्तिका लेना चाहेंगे?",
    selectLanguage: "भाषा चुनें",
    back: "वापस",
    submit: "जमा करें",
  },
  bengali: {
    selectBookletLanguage: "দীক্ষার সময় আপনি কোন ভাষায় উপাসনা বইটি নিতে চান?",
    selectLanguage: "ভাষা নির্বাচন করুন",
    back: "পিছনে",
    submit: "জমা দিন",
  },
};

const DeekshaUpasanaForm = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [isBackClicked, setIsBackClicked] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [errors, setErrors] = useState({});

  const { upasana, updateUpasana, formLanguage, guruji } =
    useDeekshaFormStore();
  const selectedLanguage = upasana.selectedLanguage;

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  useEffect(() => {
    // Simulate fetching languages from an API
    const fetchLanguages = async () => {
      const availableLanguages = [
        "English",
        "Bengali",
        "Gujarati",
        "Hindi",
        "Kannada",
        "Malayalam",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Urdu",
      ];
      setLanguages(availableLanguages);
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    console.log("Initial Zustand Store State:", useDeekshaFormStore.getState());
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!selectedLanguage) {
      newErrors.language = "Please select a language";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate("/deekshaBooks-form");
    setIsBackClicked(true);
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const state = useDeekshaFormStore.getState();
    const { resetStore } = useDeekshaFormStore.getState();
    const {
      name,
      gender,
      maritalStatus,
      careOf,
      address,
      contact,
      education,
      consent,
      relation,
      duration,
      books,
      upasana,
    } = state;

    const payload = {
      data: {
        Name: name,
        Address: `${address.houseNumber} ${address.streetName}`,
        Pincode: address.pincode,
        District: address.district,
        State: address.state,
        Country: address.country,
        Phone_no: contact.phoneNumber,
        Email: contact.email,
        Aadhar_no: contact.aadhaar,
        PAN_no: contact.pan,
        Education: education.educationLevel || null,
        Occupation: education.occupation,
        Languages_known: education.languages.join(", ") || null,
        Spouse_consent: Boolean(consent.spouseConsent),
        Initiated_by_anyone: Boolean(consent.previousInitiation),
        Family_Deeksha: Boolean(relation.hasInitiatedFamily),
        Name_family_deeksha: relation.familyMemberName,
        Relation: relation.relationship || null,
        Family_Deeksha_Guru: relation.familyMemberGuru || null,
        Known_Guruji: Boolean(duration.isAcquainted),
        Known_Guru_name: duration.selectedSwami || null,
        Known_Guru_centre: duration.selectedCentre || null,
        Waiting_for_Deeksha: parseInt(duration.eagerDuration) || 0,
        Books_read: books.bookList.join(", "),
        Practice_Deeksha: Boolean(books.japaMeditation),
        Disabilities: Boolean(books.disability),
        Hearing_Problems: Boolean(books.hearing),
        Booklet_language: upasana.selectedLanguage,
        Gender: gender,
        Marital_status: maritalStatus,
        Care_Of: careOf,
        status: "pending",
      },
    };

    try {
      console.log("Sending payload:", payload);
      const response = await createNewDeeksha(payload);

      if (response && response.data) {
        resetStore();
        alert("Deeksha form submitted successfully!");
        navigate("/deeksha");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  const handleLanguageChange = (e) => {
    updateUpasana({ selectedLanguage: e.target.value });
    if (e.target.value) {
      setErrors({ ...errors, language: null });
    }
    console.log(
      "Zustand Store State after language change:",
      useDeekshaFormStore.getState()
    );
  };

  return (
    <div className="deekshaupasanform-container">
      {/* Progress Bar */}
      <div className="deekshaupasanform-progress-bar">
        <div className="deekshaupasanform-progress-bar-inner"></div>
      </div>

      {/* Heading - remains in English */}
      <h1 className="deekshaupasanform-heading">{guruji}</h1>

      {/* Question */}
      <p className="deekshaupasanform-question">{t.selectBookletLanguage}</p>

      {/* Dropdown */}
      <div className="deekshaupasanform-dropdown-container">
        <div className="deekshaupasansearchContainer">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="deekshaupasanform-dropdown"
          >
            <option value="">{t.selectLanguage}</option>
            {languages.map((lang, index) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          {errors.language && (
            <span className="error-message">{errors.language}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="deekshaupasanform-buttons-container">
        {/* Back Button */}
        <button onClick={handleBack} className="deekshaupasanform-back-button">
          {t.back}
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="deekshaupasanform-submit-button"
        >
          {t.submit}
        </button>
      </div>
    </div>
  );
};

export default DeekshaUpasanaForm;
