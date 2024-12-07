import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaConsentForm.scss"
// import {icons} from "../../../constants"

const DeekshaConsentForm = () => {
  const navigate = useNavigate();
  const { updateConsent, consent } = useDeekshaFormStore();

  // State management for selections
  const [spouseConsent, setSpouseConsent] = useState(consent.spouseConsent || "");
  const [previousInitiation, setPreviousInitiation] = useState(consent.previousInitiation);

  // Update handlers
  const handleSpouseConsent = (value) => {
    console.log('previous',spouseConsent)
    if (spouseConsent !== value) {
      setSpouseConsent(value); // Select the new value
      updateConsent({ spouseConsent: value });
    } else {
      setSpouseConsent(""); // Deselect the value if clicked again
      updateConsent({ spouseConsent: "" });
    }
    console.log('updated',spouseConsent)
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
        <p>If married and you alone seek initiation, do you have the consent of your spouse?</p>
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
        <p>Have you been initiated by anyone earlier?</p>
        <div className="deekshaconsentform-options">
          <button
            className={`yes ${previousInitiation === "yes" ? "yes-selected" : ""}`}
            onClick={() => handlePreviousInitiation("yes")}
          >
            <img src={previousInitiation === "yes" ? YesIcon : Yes1Icon} className="deekshaconsentformimageStyle" alt="Yes" />
          </button>

          <button
            className={`no ${previousInitiation === "no" ? "no-selected" : ""}`}
            onClick={() => handlePreviousInitiation("no")}
          >
            <img src={previousInitiation === "no" ? No1Icon : NoIcon} className="deekshaconsentformimageStyle" alt="No" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaConsentform-button-group">
        <button onClick={handleBack} className="deekshaConsentform-back-button">
          Back
        </button>
        <Link className="deekshaConsentform-next-button" to="/deekshaRelation-form">
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaConsentForm;