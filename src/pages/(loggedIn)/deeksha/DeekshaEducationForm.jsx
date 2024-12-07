import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaEducationForm.scss"

const DeekshaEducationForm = () => {
  const navigate = useNavigate();
  const updateEducation = useDeekshaFormStore((state) => state.updateEducation);
  const entireStore = useDeekshaFormStore();
  const [showLanguageInput, setShowLanguageInput] = useState(false)

  const [education, setEducation] = useState(entireStore.education.educationLevel || "");
  const [occupation, setOccupation] = useState(entireStore.education.occupation || "");
  const [languages, setLanguages] = useState(entireStore.education.languages.length ? entireStore.education.languages : ["English"]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState("");

  // Add new state for errors
  const [errors, setErrors] = useState({
    education: '',
    occupation: '',
    languages: ''
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
        "Urdu"
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
      case 'education':
        return !value ? 'Please select your education level' : '';
      case 'occupation':
        return !value.trim() ? 'Please enter your occupation' : '';
      case 'languages':
        return value.length === 0 ? 'Please select at least one language' : '';
      default:
        return '';
    }
  };

  // Update handlers to validate onChange
  const handleEducationChange = (e) => {
    const value = e.target.value;
    setEducation(value);
    setErrors(prev => ({
      ...prev,
      education: validateField('education', value)
    }));
  };

  const handleOccupationChange = (e) => {
    const value = e.target.value;
    setOccupation(value);
    setErrors(prev => ({
      ...prev,
      occupation: validateField('occupation', value)
    }));
  };

  const handleLanguageChange = (newLanguages) => {
    setLanguages(newLanguages);
    setErrors(prev => ({
      ...prev,
      languages: validateField('languages', newLanguages)
    }));
  };

  // Modify the Link to use a button with validation
  const handleNext = () => {
    const newErrors = {};
    
    if (!education) {
      newErrors.education = 'Please select your education level';
    }
    
    if (!occupation.trim()) {
      newErrors.occupation = 'Please enter your occupation';
    }
    
    if (languages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    setErrors(newErrors);

    // Only navigate if there are no errors
    if (Object.keys(newErrors).length === 0) {
      navigate('/deekshaConsent-form');
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
    console.log('Current Zustand Store State:', useDeekshaFormStore.getState());
  }, [education, occupation, languages, updateEducation]);

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
        <p>Please select your education</p>
        <div className="deekshaEducationform-options">
          {[
            "Early childhood education",
            "Secondary education",
            "Higher education",
            "Undergraduate degree",
            "Post-graduate degree",
          ].map((option) => (
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
        {errors.education && <span className="error-message">{errors.education}</span>}
      </div>

      {/* Occupation Input */}
      <div className="deekshaEducationform-occupation">
        <p>Please enter your occupation :-</p>
        <input
          type="text"
          placeholder="Enter your occupation"
          value={occupation}
          onChange={handleOccupationChange}
        />
        {errors.occupation && <span className="error-message">{errors.occupation}</span>}
      </div>

      {/* Languages Known */}
      <div className="deekshaEducationform-languages">
        <div className="deekshaEducationform-languages-header">
          <p>Please select the languages known :-</p>
          <span className="deekshaEducationform-languages-list">{languages.join(", ")}</span>
        </div>
       

       <select
          onChange={(e) => {
            const newLanguages = !languages.includes(e.target.value) 
              ? [...languages, e.target.value]
              : languages;
            handleLanguageChange(newLanguages);
          }}
          className="deekshaEducationform-language-select"
          style={{ height:'41px',}}
          
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
                placeholder="Add a custom language"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                

              />
              <button onClick={handleLanguageAdd}><span style={{ width: 'auto', display: 'inline-block' }}>+ Add Language </span></button>

            </>
          ) : (
            <p  onClick={() => setShowLanguageInput(true)}>+ Add Language</p>

          )}
        </div>
        {errors.languages && <span className="error-message">{errors.languages}</span>}
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaEducationform-button-group">
        <button
          className="deekshaEducationform-back-button"
          onClick={handleBack}
        >
          Back
        </button>
        <button 
          className="deekshaEducationform-Next-button"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeekshaEducationForm;