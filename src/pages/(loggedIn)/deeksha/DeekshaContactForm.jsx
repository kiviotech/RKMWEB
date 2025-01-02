import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaConsentForm.scss";

const translations = {
  english: {
    spouseConsentQuestion:
      "If married and you alone seek initiation, do you have the consent of your spouse?",
    previousInitiationQuestion: "Have you been initiated by anyone earlier?",
    back: "Back",
    next: "Next",
  },
  hindi: {
    spouseConsentQuestion:
      "यदि विवाहित हैं और आप अकेले दीक्षा लेना चाहते हैं, तो क्या आपको अपने जीवनसाथी की सहमति है?",
    previousInitiationQuestion: "क्या आपको पहले किसी ने दीक्षा दी है?",
    back: "वापस",
    next: "आगे",
  },
  bengali: {
    spouseConsentQuestion:
      "বিবাহিত হলে এবং আপনি একা দীক্ষা নিতে চাইলে, আপনার স্বামী/স্ত্রীর সম্মতি আছে কি?",
    previousInitiationQuestion: "আপনি কি আগে কারও কাছ থেকে দীক্ষা নিয়েছেন?",
    back: "পিছনে",
    next: "পরবর্তী",
  },
};

const DeekshaConsentForm = () => {
  const navigate = useNavigate();
  const { updateConsent, consent, formLanguage, guruji } =
    useDeekshaFormStore();
  const [errors, setErrors] = useState({});

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  // State management for selections
  const [spouseConsent, setSpouseConsent] = useState(
    consent.spouseConsent || ""
  );
  const [previousInitiation, setPreviousInitiation] = useState(
    consent.previousInitiation || ""
  );

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!spouseConsent) {
      newErrors.spouseConsent = "Please select an option";
    }
    if (!previousInitiation) {
      newErrors.previousInitiation = "Please select an option";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handlers
  const handleSpouseConsent = (value) => {
    if (spouseConsent !== value) {
      setSpouseConsent(value);
      updateConsent({ spouseConsent: value });
      setErrors({ ...errors, spouseConsent: null });
    } else {
      setSpouseConsent("");
      updateConsent({ spouseConsent: "" });
    }
  };

  const handlePreviousInitiation = (value) => {
    if (previousInitiation !== value) {
      setPreviousInitiation(value);
      updateConsent({ previousInitiation: value });
      setErrors({ ...errors, previousInitiation: null });
    } else {
      setPreviousInitiation("");
      updateConsent({ previousInitiation: "" });
    }
  };

  const handleBack = () => {
    navigate("/deekshaEducation-form");
  };

  const handleNext = () => {
    if (validateForm()) {
      navigate("/deekshaRelation-form");
    }
  };

  return (
    <div className="deekshaconsentform-container">
      {/* Progress Bar */}
      <div className="deekshaconsentform-progress-bar">
        <div
          className="deekshaconsentform-progress"
          style={{ width: "50%" }}
        ></div>
      </div>

      {/* Headline */}
      <h1>{guruji}</h1>

      {/* First Question */}
      <div className="deekshaconsentform-question">
        <p>{t.spouseConsentQuestion}</p>
        <div className="deekshaconsentform-options">
          <button
            className={`yes ${spouseConsent === "yes" ? "yes-selected" : ""}`}
            onClick={() => handleSpouseConsent("yes")}
          >
            <img
              src={spouseConsent === "yes" ? YesIcon : Yes1Icon}
              className="deekshaconsentformimageStyle"
              alt="Yes"
            />
          </button>

          <button
            className={`no ${spouseConsent === "no" ? "no-selected" : ""}`}
            onClick={() => handleSpouseConsent("no")}
          >
            <img
              src={spouseConsent === "no" ? No1Icon : NoIcon}
              className="deekshaconsentformimageStyle"
              alt="No"
            />
          </button>
        </div>
        {errors.spouseConsent && (
          <span className="error-message">{errors.spouseConsent}</span>
        )}
      </div>

      {/* Second Question */}
      <div className="deekshaconsentform-question">
        <p>{t.previousInitiationQuestion}</p>
        <div className="deekshaconsentform-options">
          <button
            className={`yes ${
              previousInitiation === "yes" ? "yes-selected" : ""
            }`}
            onClick={() => handlePreviousInitiation("yes")}
          >
            <img
              src={previousInitiation === "yes" ? YesIcon : Yes1Icon}
              className="deekshaconsentformimageStyle"
              alt="Yes"
            />
          </button>

          <button
            className={`no ${previousInitiation === "no" ? "no-selected" : ""}`}
            onClick={() => handlePreviousInitiation("no")}
          >
            <img
              src={previousInitiation === "no" ? No1Icon : NoIcon}
              className="deekshaconsentformimageStyle"
              alt="No"
            />
          </button>
        </div>
        {errors.previousInitiation && (
          <span className="error-message">{errors.previousInitiation}</span>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaConsentform-button-group">
        <button onClick={handleBack} className="deekshaConsentform-back-button">
          {t.back}
        </button>
        <button onClick={handleNext} className="deekshaConsentform-next-button">
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaConsentForm;
