import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaRelationForm.scss";
// import YesorNoButton from "../../(loggedIn)/deeksha/YesornoButton"
// Icons for relationships
import HusbandIcon from "../../../assets/icons/HusbandIcon.png";
import WifeIcon from "../../../assets/icons/WifeIcon.png";
import FatherIcon from "../../../assets/icons/FatherIcon.png";
import SonIcon from "../../../assets/icons/SonIcon.png";
import DaughterIcon from "../../../assets/icons/DaughterIcon.png";
import MotherIcon from "../../../assets/icons/MotherIcon.png";
import MotherInlawIcon from "../../../assets/icons/MotherInlawIcon.png";
import FatherInlawIcon from "../../../assets/icons/FatherInlawIcon.png";
import GrandFatherIcon from "../../../assets/icons/GrandFatherIcon.png";
import GrandMotherIcon from "../../../assets/icons/GrandMotherIcon.png";

const translations = {
  english: {
    question:
      "Is anyone in your family initiated from Ramakrishna Math? If yes, his/her name, relationship, and Guru's name:",
    yes: "Yes",
    no: "No",
    back: "Back",
    next: "Next",
  },
  hindi: {
    question:
      "क्या आपके परिवार में कोई रामकृष्ण मठ से दीक्षित है? यदि हाँ, तो उनका नाम, रिश्ता और गुरु का नाम:",
    yes: "हाँ",
    no: "नहीं",
    back: "पीछे",
    next: "आगे",
  },
  bengali: {
    question:
      "আপনার পরিবারের কেউ কি রামকৃষ্ণ মঠ থেকে দীক্ষিত? যদি হ্যাঁ, তার নাম, সম্পর্ক এবং গুরুর নাম:",
    yes: "হ্যাঁ",
    no: "না",
    back: "পিছনে",
    next: "পরবর্তী",
  },
};

const DeekshaRelationForm = () => {
  const updateRelation = useDeekshaFormStore((state) => state.updateRelation);
  const relation = useDeekshaFormStore((state) => state.relation);
  const [isYesSelected, setYesSelected] = useState(null); // Default: neither Yes nor No selected
  const [activeRelation, setActiveRelation] = useState(null);
  const [isBackClicked, setBackClicked] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formLanguage = useDeekshaFormStore((state) => state.formLanguage);

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaConsent-form");
    }, 200); // Navigate after a short delay to show color change
  };

  // Update family member details with validation
  const handleFamilyMemberDetails = (field, value) => {
    updateRelation({ [field]: value });

    // Clear specific error when user starts typing/selecting
    const newErrors = { ...errors };
    if (field === "familyMemberName" && value.trim()) {
      delete newErrors.name;
    }
    if (field === "familyMemberGuru" && value) {
      delete newErrors.guru;
    }
    setErrors(newErrors);

    console.log("Current Store State:", useDeekshaFormStore.getState());
  };

  // Update relationship selection with validation
  const handleRelationSelection = (relation) => {
    setActiveRelation(relation);
    updateRelation({ relationship: relation });

    // Clear relationship error when selected
    const newErrors = { ...errors };
    delete newErrors.relationship;
    setErrors(newErrors);

    console.log("Current Store State:", useDeekshaFormStore.getState());
  };

  // Update Yes/No selection with validation
  const handleYesNoSelection = (value) => {
    if (value === true) {
      setYesSelected(true);
    } else {
      setYesSelected(false);
      // Clear all errors when "No" is selected
      setErrors({});
    }
    updateRelation({ hasInitiatedFamily: value });

    console.log("Current Store State:", useDeekshaFormStore.getState());
  };

  // Validate fields on blur
  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (isYesSelected) {
      switch (field) {
        case "name":
          if (!relation.familyMemberName?.trim()) {
            newErrors.name = "Name is required";
          }
          break;
        case "guru":
          if (!relation.familyMemberGuru) {
            newErrors.guru = "Please select a Guru";
          }
          break;
        case "relationship":
          if (!relation.relationship) {
            newErrors.relationship = "Please specify the relationship";
          }
          break;
        default:
          break;
      }
    }

    setErrors(newErrors);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (isYesSelected) {
      if (!relation.familyMemberName?.trim()) {
        newErrors.name = "Name is required";
      }
      if (!relation.familyMemberGuru) {
        newErrors.guru = "Please select a Guru";
      }
      if (!relation.relationship) {
        newErrors.relationship = "Please specify the relationship";
      }
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // If "No" is selected, proceed directly
    if (!isYesSelected) {
      navigate("/deekshaDuration-form");
      return;
    }

    // If "Yes" is selected, validate the form
    const isValid = validateForm();
    if (isValid) {
      navigate("/deekshaDuration-form");
    } else {
      console.log("Form validation failed", errors);
    }
  };

  return (
    <div className="deekshaRelationForm">
      {/* Progress Bar */}
      <div className="deekshaRelationForm-progressBar">
        <div className="deekshaRelationForm-progressBar-progress"></div>
      </div>

      {/* Heading */}
      <h1 className="deekshaRelationForm-heading">
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h1>

      {/* Question */}
      <div className="deekshaRelationForm-yesNoInput">
        <p className="deekshaRelationForm-question">{t.question}</p>

        {/* Yes/No Input */}

        <div
          className="deekshaRelationForm-yesNoInput-column"
          style={{ flexDirection: "row" }}
        >
          <button style={{ display: "inline-block", marginRight: "10px" }}>
            <img
              src={isYesSelected == true ? YesIcon : Yes1Icon}
              alt={t.yes}
              onClick={() => handleYesNoSelection(true)}
              className="deeksharelationImageStyle"
            />
          </button>
          <button style={{ display: "inline-block" }}>
            <img
              src={!isYesSelected == false ? NoIcon : No1Icon}
              alt={t.no}
              onClick={() => handleYesNoSelection(false)}
              className="deeksharelationImageStyle"
            />
          </button>

          {/* <YesorNoButton onValueChange={handleYesNoSelection} /> */}
          {/* <YesorNoButton/> */}
        </div>

        {/* Conditional Rendering: Show Fields if "Yes" */}
        {isYesSelected && (
          <div className="deekshaRelationForm-yesNoInput-conditionalFields">
            <div className="deekshaRelationForm-yesNoInput-conditionalFields-ifYes">
              <span style={{ fontWeight: "bold" }}>If Yes :-</span>

              <div style={{ width: "100%" }}>
                <input
                  type="text"
                  placeholder="Enter their Name"
                  value={relation.familyMemberName}
                  onChange={(e) =>
                    handleFamilyMemberDetails(
                      "familyMemberName",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("name")}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div style={{ width: "100%" }}>
                <select
                  value={relation.familyMemberGuru}
                  onChange={(e) =>
                    handleFamilyMemberDetails(
                      "familyMemberGuru",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("guru")}
                >
                  <option value="">Select the Guru</option>
                  <option value="Guru1">Guru1</option>
                  <option value="Guru2">Guru2</option>
                  <option value="Guru3">Guru3</option>
                  <option value="Guru4">Guru4</option>
                </select>
                {errors.guru && (
                  <span className="error-message">{errors.guru}</span>
                )}
              </div>
            </div>

            <h3>Please specify the relation:</h3>
            {errors.relationship && (
              <span className="error-message" style={{ textAlign: "center" }}>
                {errors.relationship}
              </span>
            )}

            <div className="deekshaRelationForm-yesNoInput-conditionalFields-relationship-icons">
              {[
                { label: "Husband", icon: HusbandIcon },
                { label: "Wife", icon: WifeIcon },
                { label: "Father", icon: FatherIcon },
                { label: "Son", icon: SonIcon },
                { label: "Daughter", icon: DaughterIcon },
                { label: "Mother", icon: MotherIcon },
                { label: "Mother-in-law", icon: MotherInlawIcon },
                { label: "Father-in-law", icon: FatherInlawIcon },
                { label: "GrandFather", icon: GrandFatherIcon },
                { label: "GrandMother", icon: GrandMotherIcon },
                // Add other relations...
              ].map((relation, index) => (
                <div
                  key={index}
                  className={`relation-item ${
                    activeRelation === relation.label ? "active" : ""
                  }`}
                  onClick={() => handleRelationSelection(relation.label)}
                >
                  <img src={relation.icon} alt={relation.label} />
                  <span>{relation.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back and Next Buttons */}
      <div className="deekshaRelationform-button-group">
        <button
          onClick={handleBack}
          className="deekshaRelationform-back-button"
        >
          {t.back}
        </button>
        <button
          onClick={handleNext}
          className="deekshaRelationform-next-button"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaRelationForm;
