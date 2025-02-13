import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaEducationForm.scss";

const translations = {
  english: {
    title: "Please select your education",
    educationLevels: {
      early: "Early childhood education",
      secondary: "Secondary education",
      higher: "Higher education",
      undergraduate: "Undergraduate degree",
      postgraduate: "Post-graduate degree",
    },
    occupation: {
      title: "Please enter your occupation :-",
      placeholder: "Enter your occupation",
    },
    languages: {
      title: "Please select the languages known :-",
      addLanguage: "+ Add Language",
    },
    navigation: {
      back: "Back",
      next: "Next",
    },
  },
  hindi: {
    title: "कृपया अपनी शिक्षा का चयन करें",
    educationLevels: {
      early: "प्रारंभिक शिक्षा",
      secondary: "माध्यमिक शिक्षा",
      higher: "उच्च शिक्षा",
      undergraduate: "स्नातक की डिग्री",
      postgraduate: "स्नातकोत्तर डिग्री",
    },
    occupation: {
      title: "कृपया अपना व्यवसाय दर्ज करें :-",
      placeholder: "अपना व्यवसाय दर्ज करें",
    },
    languages: {
      title: "कृपया जानी जाने वाली भाषाएं चुनें :-",
      addLanguage: "+ भाषा जोड़ें",
    },
    navigation: {
      back: "वापस",
      next: "आगे",
    },
  },
  bengali: {
    title: "অনুগ্রহ করে আপনার শিক্ষা নির্বাচন করুন",
    educationLevels: {
      early: "প্রাথমিক শিক্ষা",
      secondary: "মাধ্যমিক শিক্ষা",
      higher: "উচ্চ শিক্ষা",
      undergraduate: "স্নাতক ডিগ্রি",
      postgraduate: "স্নাতকোত্তর ডিগ্রি",
    },
    occupation: {
      title: "অনুগ্রহ করে আপনার পেশা লিখুন :-",
      placeholder: "আপনার পেশা লিখুন",
    },
    languages: {
      title: "অনুগ্রহ করে জানা ভাষাগুলি নির্বাচন করুন :-",
      addLanguage: "+ ভাষা যোগ করুন",
    },
    navigation: {
      back: "পিছনে",
      next: "পরবর্তী",
    },
  },
};

const DeekshaEducationForm = () => {
  const navigate = useNavigate();
  const { updateEducation, formLanguage } = useDeekshaFormStore();
  const entireStore = useDeekshaFormStore();
  const [showLanguageInput, setShowLanguageInput] = useState(false);

  const [education, setEducation] = useState(
    entireStore.education.educationLevel || ""
  );
  const [occupation, setOccupation] = useState(
    entireStore.education.occupation || ""
  );
  const [languages, setLanguages] = useState(
    entireStore.education.languages.length
      ? entireStore.education.languages
      : ["English"]
  );
  const [allLanguages, setAllLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState("");

  // Add new state for errors
  const [errors, setErrors] = useState({
    education: "",
    occupation: "",
    languages: "",
  });

  // Fetch languages (includes Indian languages too)
  useEffect(() => {
    const fetchLanguages = async () => {
      // Define Indian languages
      const indianLanguages = [
        "Kannada",
        "Telugu",
        "Tamil",
        "Bengali",
        "Hindi",
        "Malayalam",
        "Marathi",
        "Gujarati",
        "Punjabi",
        "Urdu",
      ];

      // Sort and set Indian languages
      setAllLanguages(indianLanguages.sort());
    };
    fetchLanguages();
  }, []);

  const handleLanguageAdd = () => {
    if (customLanguage && !languages.includes(customLanguage)) {
      setLanguages([...languages, customLanguage]);
      setCustomLanguage("");
    }
  };

  // Handle Back button click
  const handleBack = () => {
    navigate("/deekshaContact-form");
  };

  // Modify the validation to be a separate function
  const validateField = (field, value) => {
    switch (field) {
      case "education":
        return !value ? "Please select your education level" : "";
      case "occupation":
        return !value.trim() ? "Please enter your occupation" : "";
      case "languages":
        return value.length === 0 ? "Please select at least one language" : "";
      default:
        return "";
    }
  };

  // Update handlers to validate onChange
  const handleEducationChange = (e) => {
    const value = e.target.value;
    setEducation(value);
    setErrors((prev) => ({
      ...prev,
      education: validateField("education", value),
    }));
  };

  const handleOccupationChange = (e) => {
    const value = e.target.value;
    setOccupation(value);
    setErrors((prev) => ({
      ...prev,
      occupation: validateField("occupation", value),
    }));
  };

  const handleLanguageChange = (newLanguages) => {
    setLanguages(newLanguages);
    setErrors((prev) => ({
      ...prev,
      languages: validateField("languages", newLanguages),
    }));
  };

  // Modify the Link to use a button with validation
  const handleNext = () => {
    const newErrors = {};

    if (!education) {
      newErrors.education = "Please select your education level";
    }

    if (!occupation.trim()) {
      newErrors.occupation = "Please enter your occupation";
    }

    if (languages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }

    setErrors(newErrors);

    // Only navigate if there are no errors
    if (Object.keys(newErrors).length === 0) {
      navigate("/deekshaConsent-form");
    }
  };

  // Update Zustand store whenever form fields change
  useEffect(() => {
    updateEducation({
      educationLevel: education,
      occupation: occupation,
      languages: languages,
    });
    // Log entire store after update
    // console.log("Current Zustand Store State:", useDeekshaFormStore.getState());
  }, [education, occupation, languages, updateEducation]);

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  return (
    <div className="deekshaEducationform-container">
      {/* Progress Bar */}
      <div className="deekshaEducationform-progress-bar">
        <div className="deekshaEducationform-progress"></div>
      </div>

      {/* Title */}
      <h1>Srimat Swami Gautamanandaji Maharaj’s Diksha Form</h1>

      {/* Education Selection */}
      <div className="deekshaEducationform-education-selection">
        <p>{t.title}</p>
        <div className="deekshaEducationform-options">
          {Object.values(t.educationLevels).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="education"
                value={option}
                checked={education === option}
                onChange={handleEducationChange}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.education && (
          <span className="error-message">{errors.education}</span>
        )}
      </div>

      {/* Occupation Input */}
      <div className="deekshaEducationform-occupation">
        <p>{t.occupation.title}</p>
        <input
          type="text"
          placeholder={t.occupation.placeholder}
          value={occupation}
          onChange={handleOccupationChange}
        />
        {errors.occupation && (
          <span className="error-message">{errors.occupation}</span>
        )}
      </div>

      {/* Languages Known */}
      <div className="deekshaEducationform-languages">
        <div className="deekshaEducationform-languages-header">
          <p>{t.languages.title}</p>
          <span className="deekshaEducationform-languages-list">
            {languages.join(", ")}
          </span>
        </div>

        <select
          onChange={(e) => {
            const newLanguages = !languages.includes(e.target.value)
              ? [...languages, e.target.value]
              : languages;
            handleLanguageChange(newLanguages);
          }}
          className="deekshaEducationform-language-select"
          style={{ height: "41px" }}
        >
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Add Custom Language */}
        <div className="deekshaEducationform-custom-language">
          {showLanguageInput ? (
            <>
              <input
                type="text"
                placeholder={t.languages.addLanguage}
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
              />
              <button onClick={handleLanguageAdd}>
                <span>{t.languages.addLanguage}</span>
              </button>
            </>
          ) : (
            <p onClick={() => setShowLanguageInput(true)}>
              {t.languages.addLanguage}
            </p>
          )}
        </div>
        {errors.languages && (
          <span className="error-message">{errors.languages}</span>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaEducationform-button-group">
        <button
          className="deekshaEducationform-back-button"
          onClick={handleBack}
        >
          {t.navigation.back}
        </button>
        <button
          className="deekshaEducationform-Next-button"
          onClick={handleNext}
        >
          {t.navigation.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaEducationForm;
