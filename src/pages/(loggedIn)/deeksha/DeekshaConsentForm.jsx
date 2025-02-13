import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaConsentForm.scss";
// import {icons} from "../../../constants"

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
  const { updateConsent, consent, formLanguage } = useDeekshaFormStore();

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  // State management for selections
  const [spouseConsent, setSpouseConsent] = useState(
    consent.spouseConsent || ""
  );
  const [previousInitiation, setPreviousInitiation] = useState(
    consent.previousInitiation
  );

  // Update handlers
  const handleSpouseConsent = (value) => {
    // console.log("previous", spouseConsent);
    if (spouseConsent !== value) {
      setSpouseConsent(value); // Select the new value
      updateConsent({ spouseConsent: value });
    } else {
      setSpouseConsent(""); // Deselect the value if clicked again
      updateConsent({ spouseConsent: "" });
    }
    // console.log("updated", spouseConsent);
  };

  const handlePreviousInitiation = (value) => {
    if (previousInitiation === value) {
      setPreviousInitiation(""); // Deselect the option
      updateConsent({ previousInitiation: "" });
    } else {
      setPreviousInitiation(value); // Select the new value
      updateConsent({ previousInitiation: value });
    }
  };

  const handleBack = () => {
    navigate("/deekshaEducation-form");
  };

  return (
    <div className="deekshaconsentform-container">
      {/* Progress Bar */}
      <div className="deekshaconsentform-progress-bar">
        <div
          className="deekshaconsentform-progress"
          style={{ width: "50%" }} // Adjust dynamically as needed
        ></div>
      </div>

      {/* Headline */}
      <h1>Srimat Swami Gautamanandaji Maharaj's Diksha Form</h1>

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
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaConsentform-button-group">
        <button onClick={handleBack} className="deekshaConsentform-back-button">
          {t.back}
        </button>
        <Link
          className="deekshaConsentform-next-button"
          to="/deekshaRelation-form"
        >
          {t.next}
        </Link>
      </div>
    </div>
  );
};

export default DeekshaConsentForm;
