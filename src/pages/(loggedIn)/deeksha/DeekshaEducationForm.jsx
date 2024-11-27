import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import useDeekshaFormStore from "../../../../deekshaFormStore"

const DeekshaEducationForm = () => {
  const navigate = useNavigate();
  const updateEducation = useDeekshaFormStore((state) => state.updateEducation);
  const entireStore = useDeekshaFormStore();

  const [education, setEducation] = useState(entireStore.education.educationLevel || "");
  const [occupation, setOccupation] = useState(entireStore.education.occupation || "");
  const [languages, setLanguages] = useState(entireStore.education.languages.length ? entireStore.education.languages : ["English"]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState("");

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
    <div style={{ fontFamily: "Lexend", padding: "20px" }}>
      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#E0E0E0",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            background: "#9867E9",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      {/* Title */}
      <h1 style={{ textAlign: "center", color: "#9867E9" }}>
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h1>

      {/* Education Selection */}
      <div>
        <p
          style={{
            fontFamily: "Lexend",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "30px",
            textAlign: "left",
          }}
        >
          Please select your education
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {[
            "Early childhood education",
            "Secondary education",
            "Higher education",
            "Undergraduate degree",
            "Post-graduate degree",
          ].map((option) => (
            <label
              key={option}
              style={{
                display: "inline-block",
                fontFamily: "Lexend",
                fontSize: "18px",
                fontWeight: 400,
                cursor: "pointer",
                width: "30%",
                marginBottom: "10px",
              }}
            >
              <input
                type="radio"
                name="education"
                value={option}
                checked={education === option}
                onChange={(e) => setEducation(e.target.value)}
                style={{
                  marginRight: "10px",
                  accentColor: education === option ? "#9867E9" : undefined,
                }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Occupation Input */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <p
          style={{
            fontFamily: "Lexend",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "30px",
            textAlign: "left",
            margin: 0,
            width: "auto",
          }}
        >
          Please enter your occupation:
        </p>
        <input
          type="text"
          placeholder="Enter your occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          style={{
            width: "423px",
            height: "56px",
            padding: "10px 20px",
            gap: "20px",
            borderRadius: "5px 0px 0px 0px",
            border: "1px 0px 0px 0px",
            opacity: "0.9",
          }}
        />
      </div>

      {/* Languages Known */}
      <div style={{ marginTop: "20px" }}>
        <p
          style={{
            fontFamily: "Lexend",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "30px",
            textAlign: "left",
          }}
        >
          Please select the languages known:
        </p>
        <div>{languages.join(", ")}</div>
        <select
          onChange={(e) =>
            !languages.includes(e.target.value) &&
            setLanguages([...languages, e.target.value])
          }
          style={{
            width: "423px",
            height: "56px",
            padding: "10px 20px",
            gap: "0px",
            borderRadius: "5px 0px 0px 0px",
            border: "1px 0px 0px 0px",
            opacity: "0.9",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <option value="">Select a language</option>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Add Custom Language */}
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Add a custom language"
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            style={{
              width: "423px",
              height: "56px",
              padding: "10px 20px",
              gap: "0px",
              borderRadius: "5px 0px 0px 0px",
              border: "1px 0px 0px 0px",
              opacity: "0.9",
            }}
          />
          <button
            onClick={handleLanguageAdd}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#9867E9",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Add Language
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <button
          onClick={handleBack}
          style={{
            padding: "12px 25px",
            borderRadius: "5px",
            border: "none",
            background: "#e0e0e0",
            color: "#000",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#9A4EFC")}
          onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
        >
          Back
        </button>
        {/* <button
          style={{
            padding: "12px 25px",
            background: "#9867E9",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Next
        </button> */}

        <Link
        to="/deekshaConsent-form"
          style={{
            padding: "12px 25px", borderRadius: "5px", border: "none", background: "#9A4EFC", color: "#fff", cursor: "pointer", fontSize: "16px"
          }}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaEducationForm;
