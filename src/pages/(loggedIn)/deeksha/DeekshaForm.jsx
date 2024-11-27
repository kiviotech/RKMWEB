import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import maleIcon from "../../../assets/icons/maleIcon.png"
import FemaleIcon from "../../../assets/icons/FemaleIcon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"

const DikshaForm = () => {
  const { gender, prefix, name, maritalStatus, careOf, age, updatePersonalDetails } = useDeekshaFormStore();

  const calculateProgress = () => {
    const fields = [gender, prefix, name, maritalStatus, careOf, age];
    const filledFields = fields.filter(field => field && field.trim !== '').length;
    const progress = (filledFields / fields.length) * 12.5;
    return `${progress}%`;
  };

  const handleGenderChange = (value) => {
    updatePersonalDetails({ gender: value });
  };

  const handlePrefixChange = (selectedPrefix) => {
    updatePersonalDetails({ prefix: selectedPrefix });
  };

  const handleInputChange = (field, value) => {
    updatePersonalDetails({ [field]: value });
  };

  console.log('DeekshaForm Store State:', useDeekshaFormStore.getState());

  return (
    <div style={styles.container}>
      {/* Updated Progress Bar */}
      <div style={{
        width: "100%",
        height: "8px",
        background: "#E0E0E0",
        borderRadius: "4px",
        marginBottom: "20px",
      }}>
        <div style={{
          width: calculateProgress(), // Dynamic progress
          height: "100%",
          background: "#9867E9",
          borderRadius: "4px",
          transition: "width 0.3s ease-in-out", // Smooth transition
        }}></div>
      </div>

      {/* Form Header */}
      <h2 style={styles.header}>
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h2>

      {/* Gender Selection */}
      <div style={styles.genderContainer}>
        {/* Gender Button Wrapper */}
        <div style={styles.buttonWrapper}>
          {/* Male Button */}
          <button
            style={{
              ...styles.genderButton,
              backgroundColor: gender === 'Male' ? '#9867E9' : '#fff',
              color: gender === 'Male' ? '#fff' : '#000',
              borderRadius: '5px 0 0 5px', // Rounded left corner
            }}
            onClick={() => handleGenderChange('Male')}
          >
            <img
              src={maleIcon} // Ensure these images are in the public folder
              alt="Male"
              style={styles.genderIcon}
            />
            Male
          </button>

          {/* Female Button */}
          <button
            style={{
              ...styles.genderButton,
              backgroundColor: gender === 'Female' ? '#9867E9' : '#fff',
              color: gender === 'Female' ? '#fff' : '#000',
              borderRadius: '0 5px 5px 0', // Rounded right corner
            }}
            onClick={() => handleGenderChange('Female')}
          >
            <img
              src={FemaleIcon} // Ensure these images are in the public folder
              alt="Female"
              style={styles.genderIcon}
            />
            Female
          </button>
        </div>
      </div>

      {/* Updated Prefix Selection */}
      <div style={styles.prefixContainer}>
        <label style={styles.boldLabel}>Please select the correct Prefix</label>
        <div style={styles.checkboxContainer}>
          {['Sri', 'Smt', 'Kumar', 'Kumari'].map((option) => (
            <label key={option} style={styles.checkboxLabel}>
              <input 
                type="radio" 
                checked={prefix === option}
                onChange={() => handlePrefixChange(option)}
                name="prefix"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Updated Name Input */}
      <div style={styles.inputContainer}>
        <label style={styles.boldLabel}>Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Your full name" 
          style={styles.input} 
        />
      </div>

      {/* Updated Marital Status Selection */}
      <div style={styles.maritalStatusContainer}>
        <label style={styles.boldLabel}>Please select the suitable</label>
        <div style={styles.checkboxContainer}>
          {['Married', 'Unmarried', 'Widow', 'Widower'].map((status) => (
            <label key={status} style={styles.checkboxLabel}>
              <input 
                type="radio"
                checked={maritalStatus === status}
                onChange={() => handleInputChange('maritalStatus', status)}
                name="maritalStatus"
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {/* Updated C/O Input */}
      <div style={styles.inlineInputContainer}>
        <label style={styles.boldLabel}>C/O:</label>
        <input 
          type="text" 
          value={careOf}
          onChange={(e) => handleInputChange('careOf', e.target.value)}
          placeholder="hint text" 
          style={styles.inlineInput} 
        />
      </div>

      {/* Updated Age Selection */}
      <div style={styles.inlineInputContainer}>
        <label style={styles.boldLabel}>Please select your age:</label>
        <select 
          style={styles.select}
          value={age}
          onChange={(e) => handleInputChange('age', e.target.value)}
        >
          <option value="">Select Age</option>
          {[...Array(30).keys()].map((i) => (
            <option key={i} value={`${i + 23}`}>
              {i + 23} yrs
            </option>
          ))}
        </select>
      </div>

      {/* Back and Next Buttons */}
      <div style={styles.buttonContainer}>
        <Link style={styles.footerButton} to="/previous-page">
          Back
        </Link>
        <Link style={styles.footerButton} to="/deekshaAdress-form">
          Next
        </Link>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '40px',
    fontFamily: 'lexend',
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontWeight: '500',
    fontSize: '24px',
  },
  progressBarContainer: {
    backgroundColor: '#ccc',
    height: '5px',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  progressBar: {
    backgroundColor: '#9867E9',
    height: '5px',
    borderRadius: '5px',
  },
  header: {
    textAlign: 'center',
    color: '#9867E9',
    fontSize: '32px',
    marginBottom: '20px',
  },
  genderContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  buttonWrapper: {
    display: 'flex',
    borderRadius: '5px',
    overflow: 'hidden', // Ensures the buttons appear joined together
  },
  genderButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, color 0.3s', // Smooth transition
    width: '100px', // Fixed width for consistent button size
  },
  genderIcon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  prefixContainer: {
    marginBottom: '20px',
  },
  boldLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'inline-block',
  },
  checkboxContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px', // Space between checkboxes
    marginTop: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  inlineInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  inlineInput: {
    border: 'none',
    borderBottom: '2px solid #6c63ff',
    padding: '5px',
    fontSize: '16px',
    flex: 1,
  },
  input: {
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  select: {
    padding: '10px',
    width: '200px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    marginTop: '20px',
  },
  footerButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
    backgroundColor: '#9867E9',
    color: '#fff',
    transition: '0.3s',
  },
};

export default DikshaForm;
