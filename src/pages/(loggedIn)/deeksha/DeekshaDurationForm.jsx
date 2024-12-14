import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaDurationForm.scss";

const translations = {
  english: {
    acquaintedQuestion:
      "Are you acquainted with any Swami of the Ramakrishna Math/Mission? If yes, name the Swami and his centre.",
    yes: "Yes",
    no: "No",
    ifYes: "If yes :-",
    selectSwami: "Select the Swami",
    selectCentre: "Select the Centre",
    durationQuestion:
      "How long have you been eager for initiation from Ramakrishna Math?",
    oneMonth: "1 month",
    twoMonths: "2 months",
    threeMonths: "3 months",
    sixMonths: "6 months",
    nineMonths: "9 months",
    others: "Others",
    enterTime: "Please enter specific time",
    back: "Back",
    next: "Next",
    guru1: "Guru 1",
    guru2: "Guru 2",
    guru3: "Guru 3",
    guru4: "Guru 4",
    centre1: "Centre 1",
    centre2: "Centre 2",
  },
  hindi: {
    acquaintedQuestion:
      "क्या आप रामकृष्ण मठ/मिशन के किसी स्वामी से परिचित हैं? यदि हाँ, तो स्वामी और उनके केंद्र का नाम बताएं।",
    yes: "हाँ",
    no: "नहीं",
    ifYes: "यदि हाँ :-",
    selectSwami: "स्वामी चुनें",
    selectCentre: "केंद्र चुनें",
    durationQuestion: "आप कब से रामकृष्ण मठ से दीक्षा लेने के लिए उत्सुक हैं?",
    oneMonth: "1 महीना",
    twoMonths: "2 महीने",
    threeMonths: "3 महीने",
    sixMonths: "6 महीने",
    nineMonths: "9 महीने",
    others: "अन्य",
    enterTime: "कृपया विशिष्ट समय दर्ज करें",
    back: "वापस",
    next: "अगला",
    guru1: "गुरु 1",
    guru2: "गुरु 2",
    guru3: "गुरु 3",
    guru4: "गुरु 4",
    centre1: "केंद्र 1",
    centre2: "केंद्र 2",
  },
  bengali: {
    acquaintedQuestion:
      "আপনি কি রামকৃষ্ণ মঠ/মিশনের কোনো স্বামীর সাথে পরিচিত? যদি হ্যাঁ, তবে স্বামী এবং তাঁর কেন্দ্রের নাম বলুন।",
    yes: "হ্যাঁ",
    no: "না",
    ifYes: "যদি হ্যাঁ :-",
    selectSwami: "স্বামী নির্বাচন করুন",
    selectCentre: "কেন্দ্র নির্বাচন করুন",
    durationQuestion:
      "আপনি কতদিন ধরে রামকৃষ্ণ মঠ থেকে দীক্ষা নেওয়ার জন্য আগ্রহী?",
    oneMonth: "১ মাস",
    twoMonths: "২ মাস",
    threeMonths: "৩ মাস",
    sixMonths: "৬ মাস",
    nineMonths: "৯ মাস",
    others: "অন্যান্য",
    enterTime: "অনুগ্রহ করে নির্দিষ্ট সময় লিখুন",
    back: "পিছনে",
    next: "পরবর্তী",
    guru1: "গুরু ১",
    guru2: "গুরু ২",
    guru3: "গুরু ৩",
    guru4: "গুরু ৪",
    centre1: "কেন্দ্র ১",
    centre2: "কেন্দ্র ২",
  },
};

const DeekshaDurationForm = () => {
  const { duration, updateDuration, formLanguage } = useDeekshaFormStore();
  const navigate = useNavigate();

  // Initialize state from Zustand store
  const [yesIsAcquainted, setYesIsAcquainted] = useState(null);
  const [selectedSwami, setSelectedSwami] = useState(duration.selectedSwami);
  const [selectedCentre, setSelectedCentre] = useState(duration.selectedCentre);
  const [eagerDuration, setEagerDuration] = useState(duration.eagerDuration);
  const [otherDuration, setOtherDuration] = useState(duration.otherDuration);
  const [isBackClicked, setBackClicked] = useState(false);
  const [noIsAcquainted, setNoIsAcquainted] = useState(false);
  const [errors, setErrors] = useState({});

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  // Update Zustand store whenever form values change
  useEffect(() => {
    updateDuration({
      //isAcquainted,
      yesIsAcquainted,
      noIsAcquainted,
      selectedSwami,
      selectedCentre,
      eagerDuration,
      otherDuration,
    });
    // Log entire Zustand store
    // console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
  }, [
    yesIsAcquainted,
    noIsAcquainted,
    selectedSwami,
    selectedCentre,
    eagerDuration,
    otherDuration,
  ]);

  const handleIsAcquaintedSelection = (value) => {
    // setYesIsAcquainted(value); // Set the isAcquainted state
    // setNoIsAcquainted(value);
    // updateDuration({ yesIsAcquainted : value }); // Update the Zustand store with the new value

    // Change 1: Updated this function for mutual exclusivity

    // if (value) {
    //   setYesIsAcquainted(true); // Select Yes
    //   setNoIsAcquainted(false); // Deselect No
    //   updateDuration({ yesIsAcquainted: true, noIsAcquainted: false }); // Update Zustand
    // } else {
    //   setYesIsAcquainted(false); // Deselect Yes
    //   setNoIsAcquainted(true); // Select No
    //   updateDuration({ yesIsAcquainted: false, noIsAcquainted: true }); // Update Zustand
    // }

    if (value) {
      if (yesIsAcquainted) {
        setYesIsAcquainted(false); // Toggle Yes to unselected if already selected
        updateDuration({ yesIsAcquainted: false, noIsAcquainted }); // Update Zustand
      } else {
        setYesIsAcquainted(true); // Select Yes
        setNoIsAcquainted(false); // Deselect No
        updateDuration({ yesIsAcquainted: true, noIsAcquainted: false }); // Update Zustand
      }
    } else {
      if (noIsAcquainted) {
        setNoIsAcquainted(false); // Toggle No to unselected if already selected
        updateDuration({ yesIsAcquainted, noIsAcquainted: false }); // Update Zustand
      } else {
        setYesIsAcquainted(false); // Deselect Yes
        setNoIsAcquainted(true); // Select No
        updateDuration({ yesIsAcquainted: false, noIsAcquainted: true }); // Update Zustand
      }
    }

    console.log("Updated data:", useDeekshaFormStore.getState()); // Log the updated store for debugging
  };

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaRelation-form");
    }, 200); // Navigate after a short delay to show color change
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (yesIsAcquainted) {
      if (!selectedSwami) {
        newErrors.swami = "Please select a Swami";
      }
      if (!selectedCentre) {
        newErrors.centre = "Please select a Centre";
      }
    }

    if (!eagerDuration) {
      newErrors.duration = "Please select a duration";
    }

    if (eagerDuration === "Others" && !otherDuration?.trim()) {
      newErrors.otherDuration = "Please specify the duration";
    }

    if (yesIsAcquainted === null && noIsAcquainted === null) {
      newErrors.acquainted = "Please select Yes or No";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      navigate("/deekshaBooks-form");
    }
  };

  return (
    <div className="deekshadurationform">
      {/* Progress Bar */}
      <div className="deekshadurationform-progressBar">
        <div className="deekshadurationform-progressBar-progress"></div>
      </div>

      {/* Heading */}
      <h1 className="deekshadurationform-heading">
        Srimat Swami Gautamanandaji Maharaj's Diksha Form
      </h1>

      {/* Question: Are you acquainted? */}
      <p className="deekshadurationform-question">{t.acquaintedQuestion}</p>
      <div className="deekshadurationform-yesNoInput">
        {/* Yes Button */}
        <button
          onClick={() => handleIsAcquaintedSelection(true)} // Set isAcquainted to true when "Yes" is clicked
          className={yesIsAcquainted === true ? "active" : "  "} // Add 'active' class when isAcquainted is true
        >
          <img
            src={yesIsAcquainted ? YesIcon : Yes1Icon} // Show active icon when true
            alt="Yes"
          />
        </button>

        {/* No Button */}
        <button
          onClick={() => handleIsAcquaintedSelection(false)} // Set isAcquainted to false when "No" is clicked
          className={noIsAcquainted === false ? "active" : ""} // Add 'active' class when isAcquainted is false
        >
          <img
            src={noIsAcquainted === false ? NoIcon : No1Icon} // Show active icon when false
            alt="No"
          />
        </button>
      </div>

      {errors.acquainted && (
        <span className="error-message">{errors.acquainted}</span>
      )}

      {/* Conditional Dropdowns */}
      {yesIsAcquainted === true && (
        <div className="deekshadurationform-conditionalFields">
          <p>{t.ifYes}</p>
          <div className="selectContainer">
            <select
              value={selectedSwami}
              onChange={(e) => {
                setSelectedSwami(e.target.value);
                if (e.target.value) {
                  setErrors({ ...errors, swami: null });
                }
              }}
            >
              <option value="">{t.selectSwami}</option>
              <option value="Guru 1">{t.guru1}</option>
              <option value="Guru 2">{t.guru2}</option>
              <option value="Guru 3">{t.guru3}</option>
              <option value="Guru 4">{t.guru4}</option>
            </select>
            {errors.swami && (
              <span className="error-message">{errors.swami}</span>
            )}
          </div>
          <div className="selectContainer">
            <select
              value={selectedCentre}
              onChange={(e) => {
                setSelectedCentre(e.target.value);
                if (e.target.value) {
                  setErrors({ ...errors, centre: null });
                }
              }}
            >
              <option value="">{t.selectCentre}</option>
              <option value="Centre1">{t.centre1}</option>
              <option value="Centre2">{t.centre2}</option>
            </select>
            {errors.centre && (
              <span className="error-message">{errors.centre}</span>
            )}
          </div>
        </div>
      )}

      {/* Question: Duration */}
      <p className="deekshadurationform-question">{t.durationQuestion}</p>
      <div className="deekshadurationform-durationOptions">
        {[
          { value: "1 month", label: t.oneMonth },
          { value: "2 months", label: t.twoMonths },
          { value: "3 months", label: t.threeMonths },
          { value: "6 months", label: t.sixMonths },
          { value: "9 months", label: t.nineMonths },
          { value: "Others", label: t.others },
        ].map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="eagerDuration"
              value={option.value}
              checked={eagerDuration === option.value}
              onChange={() => {
                setEagerDuration(option.value);
                setErrors({ ...errors, duration: null });
              }}
            />
            {option.label}
          </label>
        ))}
      </div>
      {errors.duration && (
        <span className="error-message">{errors.duration}</span>
      )}

      {/* Other Duration Input */}
      {eagerDuration === "Others" && (
        <div className="deekshadurationform-otherDurationInput">
          <input
            type="text"
            placeholder={t.enterTime}
            value={otherDuration}
            onChange={(e) => {
              setOtherDuration(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, otherDuration: null });
              }
            }}
          />
          {errors.otherDuration && (
            <span className="error-message">{errors.otherDuration}</span>
          )}
        </div>
      )}

      {/* Back and Next Buttons */}
      <div className="deekshadurationform-button-group">
        <button
          onClick={handleBack}
          className="deekshadurationform-back-button"
        >
          {t.back}
        </button>
        <button
          onClick={handleNext}
          className="deekshadurationform-next-button"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaDurationForm;
