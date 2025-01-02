import React from "react";
import "./LanguagePopup.scss";
import useDeekshaFormStore from "../../../../deekshaFormStore";

const LanguagePopup = ({ isOpen, onClose }) => {
  const updatePersonalDetails = useDeekshaFormStore(
    (state) => state.updatePersonalDetails
  );

  if (!isOpen) return null;

  const handleLanguageSelect = (language) => {
    updatePersonalDetails({ formLanguage: language });
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="language-popup-overlay">
      <div className="language-popup">
        <h2>Select Your Preferred Language</h2>
        <div className="language-buttons">
          <button onClick={() => handleLanguageSelect("english")}>
            English
          </button>
          <button onClick={() => handleLanguageSelect("hindi")}>हिंदी</button>
          <button onClick={() => handleLanguageSelect("bengali")}>বাংলা</button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
