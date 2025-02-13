import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import maleIcon from "../../../assets/icons/maleIcon.png";
import FemaleIcon from "../../../assets/icons/FemaleIcon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaForm.scss";
import LanguagePopup from "./LanguagePopup";

const translations = {
  english: {
    male: "Male",
    female: "Female",
    selectPrefix: "Please select the correct Prefix",
    name: "Name",
    yourFullName: "Your full name",
    selectSuitable: "Please select the suitable",
    married: "Married",
    unmarried: "Unmarried",
    widow: "Widow",
    widower: "Widower",
    careOf: "C/O:",
    hintText: "hint text",
    selectAge: "Please select your age:",
    years: "yrs",
    next: "Next",
    sri: "Sri",
    kumar: "Kumar",
    swamy: "Swamy",
    smt: "Smt",
    kumari: "Kumari",
  },
  hindi: {
    male: "पुरुष",
    female: "महिला",
    selectPrefix: "कृपया सही उपसर्ग चुनें",
    name: "नाम",
    yourFullName: "आपका पूरा नाम",
    selectSuitable: "कृपया उपयुक्त चुनें",
    married: "विवाहित",
    unmarried: "अविवाहित",
    widow: "विधवा",
    widower: "विधुर",
    careOf: "देखभाल में:",
    hintText: "संकेत टेक्स्ट",
    selectAge: "कृपया अपनी आयु चुनें:",
    years: "वर्ष",
    next: "अगला",
    sri: "श्री",
    kumar: "कुमार",
    swamy: "स्वामी",
    smt: "श्रीमती",
    kumari: "कुमारी",
  },
  bengali: {
    male: "পুরুষ",
    female: "মহিলা",
    selectPrefix: "সঠিক উপসর্গ নির্বাচন করুন",
    name: "নাম",
    yourFullName: "আপনার পুরো নাম",
    selectSuitable: "অনুগ্রহ করে উপযুক্ত নির্বাচন করুন",
    married: "বিবাহিত",
    unmarried: "অবিবাহিত",
    widow: "বিধবা",
    widower: "বিপত্নীক",
    careOf: "যত্নে:",
    hintText: "ইঙ্গিত টেক্সট",
    selectAge: "অনুগ্রহ করে আপনার বয়স নির্বাচন করুন:",
    years: "বছর",
    next: "পরবর্তী",
    sri: "শ্রী",
    kumar: "কুমার",
    swamy: "স্বামী",
    smt: "শ্রীমতি",
    kumari: "কুমারী",
  },
};

const DikshaForm = () => {
  const {
    guruji,
    gender,
    prefix,
    name,
    maritalStatus,
    careOf,
    age,
    formLanguage,
    updatePersonalDetails,
  } = useDeekshaFormStore();
  // Change 1: State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    careOf: "",
    gender: "",
    prefix: "",
    maritalStatus: "",
    age: "",
  });
  // console.log(gender);

  // Change 2: State for enabling the Next button
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // Validate fields and enable the "Next" button if all fields are filled correctly
  //  const validateForm = () => {
  //    const isValid = name && careOf && gender && prefix && maritalStatus && age && !errors.name && !errors.careOf;
  //    setIsNextEnabled(isValid); // Enable Next button only if all fields are valid
  //  };

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) validationErrors.name = "Name is required";
    else if (/[^a-zA-Z\s]/.test(name))
      validationErrors.name = "Only letters are allowed";

    if (!careOf.trim()) validationErrors.careOf = "C/O field is required";
    else if (/\d/.test(careOf))
      validationErrors.careOf = "Numbers are not allowed";

    if (!gender) validationErrors.gender = "Gender is required";
    if (!prefix) validationErrors.prefix = "Prefix is required";
    if (!maritalStatus)
      validationErrors.maritalStatus = "Marital status is required";
    if (!age) validationErrors.age = "Age is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const calculateProgress = () => {
    const fields = [gender, prefix, name, maritalStatus, careOf, age];
    const filledFields = fields.filter(
      (field) => field && field.trim !== ""
    ).length;
    const progress = (filledFields / fields.length) * 12.5;
    return `${progress}%`;
  };

  const handleGenderChange = (value) => {
    updatePersonalDetails({ gender: value });
    validateForm(); // Check form validity after each change
  };

  const handlePrefixChange = (selectedPrefix) => {
    updatePersonalDetails({ prefix: selectedPrefix });
    validateForm(); // Check form validity after each change
  };

  const handleInputChange = (field, value) => {
    updatePersonalDetails({ [field]: value });

    // Clear specific field error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Validate after a short delay to give user time to type
    setTimeout(validateForm, 500);
  };

  // console.log("DeekshaForm Store State:", useDeekshaFormStore.getState());

  const [showLanguagePopup, setShowLanguagePopup] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    updatePersonalDetails({ formLanguage: language.toLowerCase() });
    setShowLanguagePopup(false);
  };

  return (
    <>
      <LanguagePopup
        isOpen={showLanguagePopup}
        onClose={() => setShowLanguagePopup(false)}
      />
      <div className="deekshaform-container">
        {/* Updated Progress Bar */}
        <div className="deekshaform-progress-bar-container">
          <div
            className="deekshaform-progress-bar"
            style={{
              width: calculateProgress(), // Dynamic progress
            }}
          ></div>
        </div>

        {/* Form Header */}
        <h2 className="deekshaform-header">{guruji}</h2>

        {/* Updated Gender Selection */}
        <div className="deekshaform-gender-container">
          <div className="deekshaform-button-wrapper">
            <button
              className={`deekshaform-gender-button ${
                gender === "Male" ? "deekshaform-male" : ""
              }`}
              onClick={() => handleGenderChange("Male")}
            >
              <img
                src={maleIcon}
                alt="Male"
                className="deekshaform-gender-icon"
              />
              {t.male}
            </button>

            <button
              className={`deekshaform-gender-button ${
                gender === "Female" ? "deekshaform-female" : ""
              }`}
              onClick={() => handleGenderChange("Female")}
            >
              <img
                src={FemaleIcon}
                alt="Female"
                className="deekshaform-gender-icon"
              />
              {t.female}
            </button>
          </div>
        </div>

        {/* Updated Prefix Selection */}
        <div className="deekshaform-prefix-container">
          <label className="deekshaform-bold-label">{t.selectPrefix}</label>
          <div className="deekshaform-checkbox-container">
            {[
              { key: "Smt", translation: t.smt },
              { key: "Sri", translation: t.sri },
              { key: "Kumar", translation: t.kumar },
              { key: "Kumari", translation: t.kumari },
              { key: "Swamy", translation: t.swamy },
            ]
              .filter((option) => {
                if (!gender) return true;
                if (gender === "Male")
                  return ["Sri", "Kumar", "Swamy"].includes(option.key);
                if (gender === "Female")
                  return ["Smt", "Kumari"].includes(option.key);
                return false;
              })
              .map((option) => (
                <label key={option.key} className="deekshaform-checkbox-label">
                  <input
                    type="radio"
                    checked={prefix === option.key}
                    onChange={() => handlePrefixChange(option.key)}
                    name="prefix"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "17px" }}>{option.translation}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Updated Name Input */}
        <div className="deekshaform-input-container">
          <label className="deekshaform-bold-label">{t.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t.yourFullName}
            className={`deekshaform-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Updated Marital Status Selection */}
        <div className="deekshaform-marital-status-container">
          <label className="deekshaform-bold-label">{t.selectSuitable}</label>
          <div className="deekshaform-checkbox-container">
            {[
              { key: "Married", translation: t.married },
              { key: "Unmarried", translation: t.unmarried },
              { key: "Widow", translation: t.widow },
              { key: "Widower", translation: t.widower },
            ]
              .filter((status) => {
                if (gender === "Male" && status.key === "Widow") return false;
                if (gender === "Female" && status.key === "Widower")
                  return false;
                return true;
              })
              .map((status) => (
                <label key={status.key} className="deekshaform-checkbox-label">
                  <input
                    type="radio"
                    checked={maritalStatus === status.key}
                    onChange={() =>
                      handleInputChange("maritalStatus", status.key)
                    }
                    name="maritalStatus"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "17px" }}>{status.translation}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Updated C/O Input */}
        <div className="deekshaform-inline-input-container">
          <label style={{ fontSize: "18px" }}>{t.careOf}</label>
          <input
            type="text"
            value={careOf}
            onChange={(e) => handleInputChange("careOf", e.target.value)}
            placeholder={t.hintText}
            className={`deekshaform-inline-input ${
              errors.careOf ? "error" : ""
            }`}
          />
          {errors.careOf && <p className="error-text">{errors.careOf}</p>}
        </div>

        {/* Updated Age Selection */}
        <div className="deekshaform-inline-input-container">
          <label className="deekshaform-bold-label">{t.selectAge}</label>
          <div className="deekshaform-select-container">
            <select
              className="deekshaform-select"
              value={age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            >
              <option value="">Select Age</option>
              {[...Array(95).keys()].map((i) => (
                <option key={i} value={i + 6}>
                  {i + 6} {t.years}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Back and Next Buttons */}
        <div className="deekshaform-button-container">
          <Link
            className="deekshaform-footer-button"
            to="/deekshaAdress-form"
            onClick={(e) => {
              if (!validateForm()) {
                e.preventDefault();
                // Optionally scroll to the first error
                const firstErrorField = document.querySelector(".error");
                if (firstErrorField) {
                  firstErrorField.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }
            }}
          >
            {t.next}
          </Link>
        </div>
      </div>
    </>
  );
};

export default DikshaForm;
