import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import maleIcon from "../../../assets/icons/maleIcon.png"
import FemaleIcon from "../../../assets/icons/FemaleIcon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaForm.scss"

const DikshaForm = () => {
  const { gender, prefix, name, maritalStatus, careOf, age, updatePersonalDetails } = useDeekshaFormStore();
 // Change 1: State for validation errors
 const [errors, setErrors] = useState({
  name: "",
  careOf: "",
  gender: "",
    prefix: "",
    maritalStatus: "",
    age: ""
});
  console.log(gender)

   // Change 2: State for enabling the Next button
   const [isNextEnabled, setIsNextEnabled] = useState(false);

   // Validate fields and enable the "Next" button if all fields are filled correctly
  //  const validateForm = () => {
  //    const isValid = name && careOf && gender && prefix && maritalStatus && age && !errors.name && !errors.careOf;
  //    setIsNextEnabled(isValid); // Enable Next button only if all fields are valid
  //  };

  const validateForm = () => {
    const validationErrors = {};
    
    if (!name.trim()) validationErrors.name = "Name is required";
    else if (/[^a-zA-Z\s]/.test(name)) validationErrors.name = "Only letters are allowed";
    
    if (!careOf.trim()) validationErrors.careOf = "C/O field is required";
    else if (/\d/.test(careOf)) validationErrors.careOf = "Numbers are not allowed";
    
    if (!gender) validationErrors.gender = "Gender is required";
    if (!prefix) validationErrors.prefix = "Prefix is required";
    if (!maritalStatus) validationErrors.maritalStatus = "Marital status is required";
    if (!age) validationErrors.age = "Age is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const calculateProgress = () => {
    const fields = [gender, prefix, name, maritalStatus, careOf, age];
    const filledFields = fields.filter(field => field && field.trim !== '').length;
    const progress = (filledFields / fields.length) * 12.5;
    return `${progress}%`;
  };

  const handleGenderChange = (value) => {
    updatePersonalDetails({ gender: value });
    validateForm(); // Check form validity after each change
  };

  

  const handlePrefixChange = (selectedPrefix) => {
    updatePersonalDetails({ prefix: selectedPrefix });
    validateForm(); // Check form validity after each change
  };

  const handleInputChange = (field, value) => {
    updatePersonalDetails({ [field]: value });
    
    // Clear specific field error when user starts typing
    setErrors(prev => ({ ...prev, [field]: "" }));
    
    // Validate after a short delay to give user time to type
    setTimeout(validateForm, 500);
  };

  console.log('DeekshaForm Store State:', useDeekshaFormStore.getState());

  return (
    <div className="deekshaform-container">
      {/* Updated Progress Bar */}
      <div className="deekshaform-progress-bar-container">
        <div
          className="deekshaform-progress-bar"
          style={{
            width: calculateProgress(), // Dynamic progress
          }}
        ></div>
      </div>

      {/* Form Header */}
      <h2 className="deekshaform-header">
        Srimat Swami Gautamanandaji Maharaj's Diksha Form
      </h2>

      {/* Gender Selection */}
      <div className="deekshaform-gender-container">
        {/* Gender Button Wrapper */}
        <div className="deekshaform-button-wrapper">
          {/* Male Button */}
          <button
            className={`deekshaform-gender-button ${gender === 'Male' ? 'deekshaform-male' : ''
              }`}
            onClick={() => handleGenderChange('Male')}
          >
            <img
              src={maleIcon} // Ensure these images are in the public folder
              alt="Male"
              className="deekshaform-gender-icon"
            />
            Male
          </button>

          {/* Female Button */}
          <button
            className={`deekshaform-gender-button ${gender === 'Female' ? 'deekshaform-female' : ''
              }`}
            onClick={() => handleGenderChange('Female')}
          >
            <img
              src={FemaleIcon} // Ensure these images are in the public folder
              alt="Female"
              className="deekshaform-gender-icon"
            />
            Female
          </button>
        </div>
      </div>

      {/* Updated Prefix Selection */}
      <div className="deekshaform-prefix-container">
        <label className="deekshaform-bold-label">
          Please select the correct Prefix
        </label>
        <div className="deekshaform-checkbox-container">
          {[ 'Smt','Sri', 'Kumar', 'Kumari','Swamy']
            .filter((option) => {


              if (!gender) return ['Sri', 'Smt', 'Kumar', 'Kumari','Swamy'].includes(option);
              if (gender === 'Male') return ['Sri', 'Kumar','Swamy'].includes(option); // Male-specific options
              if (gender === 'Female') return ['Smt', 'Kumari'].includes(option);
              return false

            })
             
            .map((option) => (
              <label key={option} className="deekshaform-checkbox-label">
                <input
                  type="radio"
                  checked={prefix === option}
                  onChange={() => handlePrefixChange(option)}
                  name="prefix"
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '17px' }}>{option}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Updated Name Input */}
      <div className="deekshaform-input-container">
        <label className="deekshaform-bold-label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Your full name"
          className={`deekshaform-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      {/* Updated Marital Status Selection */}
      <div className="deekshaform-marital-status-container">
        <label className="deekshaform-bold-label">Please select the suitable</label>
        <div className="deekshaform-checkbox-container">
          {['Married', 'Unmarried', 'Widow', 'Widower']
            .filter((status) => {
              // Change 1: Remove "Widow" if gender is "Male"
              if (gender === 'Male' && status === 'Widow') return false;
              // Change 2: Remove "Widower" if gender is "Female"
              if (gender === 'Female' && status === 'Widower') return false;
              return true;
            })
            .map((status) => (
              <label key={status} className="deekshaform-checkbox-label">
                <input
                  type="radio"
                  checked={maritalStatus === status}
                  onChange={() => handleInputChange('maritalStatus', status)}
                  name="maritalStatus"
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '17px' }}>{status}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Updated C/O Input */}
      <div className="deekshaform-inline-input-container">
        <label style={{ fontSize: '18px' }}>C/O:</label>
        <input
          type="text"
          value={careOf}
          onChange={(e) => handleInputChange('careOf', e.target.value)}
          placeholder="hint text"
          className={`deekshaform-inline-input ${errors.careOf ? 'error' : ''}`}
        />
        {errors.careOf && <p className="error-text">{errors.careOf}</p>}
      </div>

      {/* Updated Age Selection */}
      <div className="deekshaform-inline-input-container">
        <label className="deekshaform-bold-label">Please select your age:</label>
        <div className="deekshaform-select-container">
          <select
            className="deekshaform-select"
            value={age}
            onChange={(e) => handleInputChange('age', e.target.value)}
          >
            <option value="">Select Age</option>
            {[...Array(95).keys()].map((i) => (
              <option key={i} value={i + 6}>
                {i + 6} yrs
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Back and Next Buttons */}
      <div className="deekshaform-button-container">
        <Link 
          className="deekshaform-footer-button"
          to="/deekshaAdress-form"
          onClick={(e) => {
            if (!validateForm()) {
              e.preventDefault();
              // Optionally scroll to the first error
              const firstErrorField = document.querySelector('.error');
              if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default DikshaForm;