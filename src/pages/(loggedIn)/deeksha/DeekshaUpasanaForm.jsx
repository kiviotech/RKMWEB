import React, { useState, useEffect } from "react";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import { createNewDeeksha } from "../../../../services/src/services/deekshaService";

const DeekshaUpasanaForm = () => {
  const [languages, setLanguages] = useState([]);
  const [isBackClicked, setIsBackClicked] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  
  const { upasana, updateUpasana } = useDeekshaFormStore();
  const selectedLanguage = upasana.selectedLanguage;

  useEffect(() => {
    // Simulate fetching languages from an API
    const fetchLanguages = async () => {
      const availableLanguages = [
        "English",
        "Bengali",
        "Gujarati",
        "Hindi",
        "Kannada",
        "Malayalam",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Urdu"
      ];
      setLanguages(availableLanguages);
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    console.log('Initial Zustand Store State:', useDeekshaFormStore.getState());
  }, []);

  const handleBack = () => {
    setIsBackClicked(true);
  };

  const handleSubmit = async () => {
    const state = useDeekshaFormStore.getState();
    const { resetStore } = useDeekshaFormStore.getState();
    const { 
      name, gender, maritalStatus, careOf,
      address, contact, education, consent,
      relation, duration, books, upasana 
    } = state;

    const payload = {
      data: {
        Name: name,
        Address: `${address.houseNumber} ${address.streetName}`.trim(),
        Pincode: address.pincode,
        District: address.district,
        State: address.state,
        Country: address.country,
        Phone_no: contact.phoneNumber,
        Email: contact.email,
        Aadhar_no: contact.aadhaar,
        PAN_no: contact.pan,
        Education: education.educationLevel,
        Occupation: education.occupation,
        Languages_known: education.languages.join(', ') || null,
        Spouse_consent: Boolean(consent.spouseConsent),
        Initiated_by_anyone: Boolean(consent.previousInitiation),
        Family_Deeksha: Boolean(relation.hasInitiatedFamily),
        Name_family_deeksha: relation.familyMemberName,
        Relation: relation.relationship || null,
        Family_Deeksha_Guru: relation.familyMemberGuru || null,
        Known_Guruji: Boolean(duration.isAcquainted),
        Known_Guru_name: duration.selectedSwami || null,
        Known_Guru_centre: duration.selectedCentre || null,
        Waiting_for_Deeksha: parseInt(duration.eagerDuration) || 0,
        Books_read: books.bookList.join(', '),
        Practice_Deeksha: Boolean(books.japaMeditation),
        Disabilities: Boolean(books.disability),
        Hearing_Problems: Boolean(books.hearing),
        Booklet_language: upasana.selectedLanguage,
        Gender: gender,
        Marital_status: maritalStatus,
        Care_Of: careOf,
        status: "pending"
      }
    };

    try {
      console.log('Sending payload:', payload);
      const response = await createNewDeeksha(payload);
      
      if (response && response.data) {
        resetStore();
        alert('Deeksha form submitted successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  const handleLanguageChange = (e) => {
    updateUpasana({ selectedLanguage: e.target.value });
    console.log('Zustand Store State after language change:', useDeekshaFormStore.getState());
  };

  return (
    <div
      style={{
        fontFamily: "Lexend, sans-serif",
        padding: "40px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      {/* Progress Bar */}
      <div style={{
        width: "100%",
        height: "8px",
        background: "#E0E0E0",
        borderRadius: "4px",
        marginBottom: "20px",
      }}>
        <div style={{
          width: "100%", // 8/8 steps (final form)
          height: "100%",
          background: "#9867E9",
          borderRadius: "4px",
        }}></div>
      </div>

      {/* Heading */}
      <h1
        style={{
          width: "887px",
          height: "40px",
          margin: "30px auto",
          color: "#9867E9",
          fontSize: "32px",
          fontWeight: 600,
          lineHeight: "40px",
          textAlign: "center",
        }}
      >
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h1>

      {/* Question */}
      <p
        style={{
          fontSize: "24px",
          fontWeight: 500,
          lineHeight: "30px",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        In which language would you like to take the Upasana Booklet during
        initiation?
      </p>

      {/* Dropdown */}
      <div style={{ textAlign: "center", margin: "20px auto" }}>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{
            width: "423px",
            height: "56px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "18px",
          }}
        >
          <option value="">Select the language</option>
          {languages.map((lang, index) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            width: "168px",
            height: "70px",
            borderRadius: "7px 0px 0px 0px",
            border: "1px solid #ccc",
            background: isBackClicked ? "#9867E9" : "#e0e0e0",
            color: isBackClicked ? "#fff" : "#000",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Back
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "170px",
            height: "70px",
            borderRadius: "7px 0px 0px 0px",
            border: "none",
            background: isSubmitClicked ? "#9867E9" : "#e0e0e0",
            color: isSubmitClicked ? "#fff" : "#000",
            cursor: "pointer",
            position: "absolute",
            right: "0",
            bottom: "0",
            fontSize: "18px",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DeekshaUpasanaForm;