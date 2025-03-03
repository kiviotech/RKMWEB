import React, { useState, useEffect, useRef } from "react";
import "./ApplicationDetails.scss";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";
import { icons } from "../../../../constants";
import ApplicationFormHeader from "../../ApplicationFormHeader";

const ApplicationDetails = ({ goToNextStep, tabName }) => {
  const {
    formData,
    errors,
    setFormData,
    setAddressData,
    setErrors,
    setCountryCode,
  } = useApplicationStore();

  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeekshaDropdownOpen, setIsDeekshaDropdownOpen] = useState(false);
  const [deekshaSearchQuery, setDeekshaSearchQuery] = useState("");
  const [showCustomDeeksha, setShowCustomDeeksha] = useState(false);
  const [customDeeksha, setCustomDeeksha] = useState("");

  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const titleDropdownRef = useRef(null);

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef(null);

  const deekshaOptions = [
    "Srimat Swami Atmasthanandaji Maharaj",
    "Srimat Swami Bhuteshanandaji Maharaj",
    "Srimat Swami Divyanandaji Maharaj",
    "Srimat Swami Gahananandaji Maharaj",
    "Srimat Swami Gambhiranandaji Maharaj",
    "Srimat Swami Gautamanandaji Maharaj",
    "Srimat Swami Girishanandaji Maharaj",
    "Srimat Swami Gitanandaji Maharaj",
    "Srimat Swami Kailashanandaji Maharaj",
    "Srimat Swami Madhavanandaji Maharaj",
    "Srimat Swami Nirvananandaji Maharaj",
    "Srimat Swami Omkaranandaji Maharaj",
    "Srimat Swami Prabhanandaji Maharaj",
    "Srimat Swami Prameyanandaji Maharaj",
    "Srimat Swami Ranganathanandaji Maharaj",
    "Srimat Swami Shivamayanandaji Maharaj",
    "Srimat Swami Smarananandaji Maharaj",
    "Srimat Swami Suhitanandaji Maharaj",
    "Srimat Swami Tapasyanandaji Maharaj",
    "Srimat Swami Vagishanandaji Maharaj",
    "Srimat Swami Vimalatmanandaji Maharaj",
    "Srimat Swami Vireshwaranandaji Maharaj",
    "Srimat Swami Yatiswaranandaji Maharaj",
    "Others",
    "none",
  ];

  const filteredDeekshaOptions = deekshaOptions.filter((option) =>
    option.toLowerCase().includes(deekshaSearchQuery.toLowerCase())
  );

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const deekshaDropdownRef = useRef(null);

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(searchQuery) ||
      country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const titleOptions = [
    "Sri",
    "Smt.",
    "Mr.",
    "Mrs.",
    "Swami",
    "Dr.",
    "Prof.",
    "Kumari",
    "Ms."
  ];

  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set default country code
    setCountryCode("91");

    // Fetch country codes list
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const codes = data
          .filter((country) => country.idd.root)
          .map((country) => ({
            code: (
              country.idd.root + (country.idd.suffixes?.[0] || "")
            ).replace(/[^0-9]/g, ""),
            flagUrl: country.flags.svg,
            id: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });
  }, [setCountryCode]);

  useEffect(() => {
    console.log("Current Zustand Store State:", {
      formData,
      errors,
    });
  }, [formData, errors]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deekshaDropdownRef.current &&
        !deekshaDropdownRef.current.contains(event.target)
      ) {
        setIsDeekshaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        titleDropdownRef.current &&
        !titleDropdownRef.current.contains(event.target)
      ) {
        setIsTitleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target)
      ) {
        setIsGenderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value) {
          setErrors(name, "Title is required");
        } else {
          setErrors(name, "");
        }
        break;

      case "name":
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!value) {
          setErrors(name, "Name is required");
        } else if (value.length < 2) {
          setErrors(name, "Name must be at least 2 characters long");
        } else if (!nameRegex.test(value)) {
          setErrors(name, "Name can only contain letters and spaces");
        } else {
          setErrors(name, "");
        }
        break;

      case "age":
        if (!value) {
          setErrors(name, "Age is required");
        } else if (
          !Number.isInteger(Number(value)) ||
          value <= 0 ||
          value > 120
        ) {
          setErrors(name, "Age must be a valid number between 1 and 120");
        } else {
          setErrors(name, "");
        }
        break;

      case "gender":
        if (!value) {
          setErrors(name, "Gender is required");
        } else if (!["M", "F", "O"].includes(value)) {
          setErrors(name, "Gender must be 'M', 'F', or 'O'");
        } else {
          setErrors(name, "");
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          setErrors(name, "Email is required");
        } else if (!emailRegex.test(value)) {
          setErrors(name, "Please enter a valid email address");
        } else {
          setErrors(name, "");
        }
        break;

      case "occupation":
        const occupationRegex = /^[A-Za-z\s]+$/;
        if (!value) {
          setErrors(name, "Occupation is required");
        } else if (!occupationRegex.test(value)) {
          setErrors(name, "Occupation can only contain letters and spaces");
        } else {
          setErrors(name, "");
        }
        break;

      case "deeksha":
        if (!value) {
          setErrors(name, "Deeksha is required");
        } else {
          setErrors(name, "");
        }
        break;

      case "aadhaar":
        if (!value) {
          setErrors(name, "Aadhaar is required");
        } else if (!/^\d{12}$/.test(value)) {
          setErrors(name, "Aadhaar number must be 12 digits long");
        } else {
          setErrors(name, "");
        }
        break;

      case "phoneNumber":
        if (!value) {
          setErrors(name, "Phone number is required");
        } else if (value.length < 10) {
          setErrors(name, "Phone number must be 10 digits");
        } else if (!/^\d{10}$/.test(value)) {
          setErrors(name, "Phone number must contain exactly 10 digits");
        } else {
          setErrors(name, "");
        }
        break;

      default:
        break;
    }
  };

  const validateAddressField = (name, value) => {
    switch (name) {
      case "state":
        if (!value) {
          setErrors(name, "State is required");
        } else {
          setErrors(name, "");
        }
        break;

      case "district":
        if (!value) {
          setErrors(name, "District is required");
        } else {
          setErrors(name, "");
        }
        break;

      case "pinCode":
        if (!value) {
          setErrors(name, "Pin Code is required");
        } else if (!/^\d{6}$/.test(value)) {
          setErrors(name, "Pin Code must be 6 digits long");
        } else {
          setErrors(name, "");
        }
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData(name, sanitizedValue);
      validateField(name, sanitizedValue);
      return;
    }

    if (name === "occupation") {
      const sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData(name, sanitizedValue);
      validateField(name, sanitizedValue);
      return;
    }

    if (name === "phoneNumber") {
      // Only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(name, numericValue);
      validateField(name, numericValue);
      return;
    }

    setFormData(name, value);
    console.log("Input Change:", { field: name, value });

    if (name === "guestMembers") {
      useApplicationStore.getState().updateGuestMembers(parseInt(value));
      console.log("Updated Guest Members:", parseInt(value));
    }

    validateField(name, value);
  };

  const handleAddressInputChange = async (e) => {
    const { name, value } = e.target;
    setAddressData(name, value);
    console.log("Address Input Change:", { field: name, value });

    if (name === "pinCode") {
      // Clear previous error first
      setErrors(name, "");

      if (!value) {
        setErrors(name, "Pin Code is required");
        setAddressData("state", "");
        setAddressData("district", "");
        setAddressData("postOffice", "");
      } else if (!/^\d{6}$/.test(value)) {
        setErrors(name, "Pin Code must be 6 digits long");
        setAddressData("state", "");
        setAddressData("district", "");
        setAddressData("postOffice", "");
      } else {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await response.json();

          if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setAddressData("state", postOffice.State);
            setAddressData("district", postOffice.District);
            setAddressData("postOffice", postOffice.Name);
            setErrors(name, ""); // Clear any existing error
            console.log("Pincode API Response:", {
              state: postOffice.State,
              district: postOffice.District,
              postOffice: postOffice.Name,
            });
          } else {
            setErrors(name, "Invalid Pin Code");
            setAddressData("state", "");
            setAddressData("district", "");
            setAddressData("postOffice", "");
            console.log("Invalid Pincode Response:", data);
          }
        } catch (error) {
          console.error("Error fetching address details:", error);
          setErrors(name, "Error validating Pin Code");
          setAddressData("state", "");
          setAddressData("district", "");
          setAddressData("postOffice", "");
        }
      }
    } else {
      validateAddressField(name, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    let emptyFields = [];
    console.log("Form Submission Attempt - Current State:", formData);

    // Validate all fields
    const fieldsToValidate = [
      "title",
      "name",
      "age",
      "gender",
      "email",
      "occupation",
      "deeksha",
      "aadhaar",
      "phoneNumber",
    ];

    // Check if any required field is empty
    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        emptyFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        setErrors(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      } else {
        validateField(field, formData[field]);
      }
    });

    const addressFieldsToValidate = ["state", "district", "pinCode"];

    // Check if any required address field is empty
    addressFieldsToValidate.forEach((field) => {
      if (!formData.address[field]) {
        emptyFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        setErrors(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      } else {
        validateAddressField(field, formData.address[field]);
      }
    });

    // Show alert if there are empty fields
    if (emptyFields.length > 0) {
      alert(
        `Please fill in the following required fields:\n${emptyFields.join(
          "\n"
        )}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Check for any validation errors
    Object.values(errors).forEach((error) => {
      if (error) hasErrors = true;
    });

    if (!hasErrors) {
      console.log("Form Submission Successful - Final State:", formData);
      goToNextStep();
    } else {
      console.log("Form Submission Failed - Validation Errors:", errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="application-form">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <h2>Applicant Details</h2>
          <div className="form-section">
            <div className="form-left-section">
              {/* Name Field */}
              <div className="form-group">
                <label>Name</label>
                <div className="unified-input">
                  <div className="custom-select" ref={titleDropdownRef}>
                    <div
                      className="selected-deeksha"
                      onClick={() =>
                        setIsTitleDropdownOpen(!isTitleDropdownOpen)
                      }
                    >
                      <span>{formData.title || "Title"}</span>
                      <svg
                        className={`dropdown-icon ${isTitleDropdownOpen ? "open" : ""}`}
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isTitleDropdownOpen && (
                      <div className="deeksha-dropdown">
                        <div className="deeksha-list">
                          {titleOptions.map((option) => (
                            <div
                              key={option}
                              className="deeksha-option"
                              onClick={() => {
                                handleInputChange({
                                  target: { name: "title", value: option },
                                });
                                setIsTitleDropdownOpen(false);
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                {errors.title && <span className="error">{errors.title}</span>}
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              {/* Age and Gender */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div className="form-group" style={{ width: "50%" }}>
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Add your age"
                  />
                  {errors.age && <span className="error">{errors.age}</span>}
                </div>
                <div className="form-group" style={{ width: "50%" }}>
                  <label>Gender</label>
                  <div className="custom-select" ref={genderDropdownRef}>
                    <div
                      className="selected-deeksha"
                      onClick={() =>
                        setIsGenderDropdownOpen(!isGenderDropdownOpen)
                      }
                    >
                      <span>
                        {formData.gender
                          ? genderOptions.find(g => g.value === formData.gender)?.label
                          : "Select Gender"}
                      </span>
                      <svg
                        className={`dropdown-icon ${isGenderDropdownOpen ? "open" : ""}`}
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isGenderDropdownOpen && (
                      <div className="deeksha-dropdown">
                        <div className="deeksha-list">
                          {genderOptions.map((option) => (
                            <div
                              key={option.value}
                              className="deeksha-option"
                              onClick={() => {
                                handleInputChange({
                                  target: { name: "gender", value: option.value },
                                });
                                setIsGenderDropdownOpen(false);
                              }}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.gender && (
                    <span className="error">{errors.gender}</span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email id"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              {/* Phone Number Field */}
              <div className="form-group">
                <label>Phone number</label>
                <div className="unified-input">
                  <div className="custom-select" ref={dropdownRef}>
                    <div
                      className="selected-country"
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        setTimeout(() => {
                          if (searchInputRef.current) {
                            searchInputRef.current.focus();
                          }
                        }, 0);
                      }}
                    >
                      {formData.countryCode && (
                        <>
                          <img
                            src={
                              countryCodes.find(
                                (c) => c.code === formData.countryCode
                              )?.flagUrl
                            }
                            alt=""
                            className="flag-icon"
                          />
                          +{formData.countryCode}
                        </>
                      )}
                    </div>
                    {isDropdownOpen && (
                      <div className="country-dropdown">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search country..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="country-list">
                          {filteredCountryCodes.map((country) => (
                            <div
                              key={country.id}
                              className="country-option"
                              onClick={() => {
                                setCountryCode(country.code);
                                setIsDropdownOpen(false);
                                setSearchQuery("");
                              }}
                            >
                              <img
                                src={country.flagUrl}
                                alt=""
                                className="flag-icon"
                              />
                              <span>+{country.code}</span>
                              <span className="country-name">
                                {country.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    maxLength="10"
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                  />
                </div>
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </div>

            <div className="form-right-section">
              {/* Occupation Field */}
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Enter your occupation"
                />
                {errors.occupation && (
                  <span className="error">{errors.occupation}</span>
                )}
              </div>

              {/* Deeksha Field */}
              <div className="form-group">
                <label>Initiation / Mantra Diksha from </label>
                <div className="custom-select" ref={deekshaDropdownRef}>
                  <div
                    className="selected-deeksha"
                    onClick={() =>
                      setIsDeekshaDropdownOpen(!isDeekshaDropdownOpen)
                    }
                  >
                    <span>{formData.deeksha || "Select Deeksha"}</span>
                    <svg
                      className={`dropdown-icon ${isDeekshaDropdownOpen ? "open" : ""
                        }`}
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {isDeekshaDropdownOpen && (
                    <div className="deeksha-dropdown">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={deekshaSearchQuery}
                        onChange={(e) => setDeekshaSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="deeksha-list">
                        {filteredDeekshaOptions.map((option) => (
                          <div
                            key={option}
                            className="deeksha-option"
                            onClick={() => {
                              handleInputChange({
                                target: { name: "deeksha", value: option },
                              });
                              setIsDeekshaDropdownOpen(false);
                              setDeekshaSearchQuery("");
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.deeksha && (
                  <span className="error">{errors.deeksha}</span>
                )}
              </div>

              {/* Aadhaar Number */}
              <div className="form-group" style={{ position: "relative" }}>
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12);
                    handleInputChange({
                      target: {
                        name: "aadhaar",
                        value,
                      },
                    });
                  }}
                  placeholder="••••••••••••"
                />
                {errors.aadhaar && (
                  <span className="error">{errors.aadhaar}</span>
                )}
              </div>

              {/* Phone Number (moved to left section) */}
              <div className="form-group guest-members-group">
                <div className="additional-guests-wrapper">
                  <label>Number of Additional guests</label>
                  <div className="number-control">
                    <button
                      type="button"
                      className="control-button"
                      onClick={() => {
                        const newValue = Math.max(
                          0,
                          parseInt(formData.guestMembers || 0) - 1
                        );
                        handleInputChange({
                          target: { name: "guestMembers", value: newValue },
                        });
                      }}
                    >
                      −
                    </button>
                    <span className="number-display">
                      {formData.guestMembers || 0}
                    </span>
                    <button
                      type="button"
                      className="control-button"
                      onClick={() => {
                        const newValue = Math.min(
                          9,
                          parseInt(formData.guestMembers || 0) + 1
                        );
                        handleInputChange({
                          target: { name: "guestMembers", value: newValue },
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                {errors.guestMembers && (
                  <span className="error">{errors.guestMembers}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Fields */}
          <div className="address-section">
            <h3 style={{ textAlign: "left" }}>Address</h3>
            <div className="formTabSection">
              <div className="addressInputBox">
                <div className="form-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.address.pinCode}
                    onChange={handleAddressInputChange}
                    placeholder="Enter Pincode"
                  />
                  {errors.pinCode && (
                    <span className="error">{errors.pinCode}</span>
                  )}
                </div>
                <div
                  className="addressInputBox"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Flat / House / Apartment No</label>
                    <input
                      type="text"
                      name="houseNumber"
                      value={formData.address.houseNumber}
                      onChange={handleAddressInputChange}
                      placeholder="Your house number"
                    />
                    {errors.houseNumber && (
                      <span className="error">{errors.houseNumber}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="addressInputBox">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressInputChange}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Street Name / Landmark</label>
                  <input
                    type="text"
                    name="streetName"
                    value={formData.address.streetName}
                    onChange={handleAddressInputChange}
                    placeholder="Enter street name"
                  />
                  {errors.streetName && (
                    <span className="error">{errors.streetName}</span>
                  )}
                </div>
              </div>

              <div className="addressInputBox">
                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.address.district}
                    onChange={handleAddressInputChange}
                    placeholder="Enter your district"
                  />
                  {errors.district && (
                    <span className="error">{errors.district}</span>
                  )}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Post Office</label>
                  <input
                    type="text"
                    name="postOffice"
                    value={formData.address.postOffice}
                    onChange={handleAddressInputChange}
                    placeholder="Enter post office"
                  />
                  {errors.postOffice && (
                    <span className="error">{errors.postOffice}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {tabName && (
          <div className="submit-button">
            <CommonButton
              buttonName="Add Guest"
              style={{
                backgroundColor: "#EA7704",
                color: "#FFFFFF",
                borderColor: "#EA7704",
                fontSize: "18px",
                borderRadius: "7px",
                borderWidth: 1,
                padding: "15px 100px",
              }}
              onClick={handleSubmit}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplicationDetails;
