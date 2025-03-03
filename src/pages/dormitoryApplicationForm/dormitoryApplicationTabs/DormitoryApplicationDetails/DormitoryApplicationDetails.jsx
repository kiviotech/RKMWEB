import React, { useState, useEffect, useRef } from "react";
import "./DormitoryApplicationDetails.scss";
import CommonButton from "../../../../components/ui/Button";
import useDormitoryStore from "../../../../../dormitoryStore";

const DormitoryApplicationDetails = ({ goToNextStep, tabName }) => {
  const { formData, updateFormData, updateAddress } = useDormitoryStore();
  const [errors, setErrors] = useState({});

  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeekshaDropdownOpen, setIsDeekshaDropdownOpen] = useState(false);
  const [deekshaSearchQuery, setDeekshaSearchQuery] = useState("");
  const deekshaDropdownRef = useRef(null);

  const [isInstitutionDropdownOpen, setIsInstitutionDropdownOpen] = useState(false);
  const institutionDropdownRef = useRef(null);

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef(null);

  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const titleDropdownRef = useRef(null);

  // Add logging effect for formData changes
  useEffect(() => {
    console.log("Current Zustand Store State:", formData);
  }, [formData]);

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(searchQuery) ||
      country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownRef = useRef(null);

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
    handleCountryCodeChange("91");
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
  }, []);

  // Add logging to form data changes
  const handleFormDataChange = (name, value) => {
    console.log("Updating form data:", { field: name, value });
    updateFormData({ [name]: value });
  };

  // Add logging to address changes
  const handleAddressChange = (name, value) => {
    console.log("Updating address:", { field: name, value });
    updateAddress({ [name]: value });
  };

  const handleSetError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCountryCodeChange = (code) => {
    updateFormData({ countryCode: code });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "institutionName":
        const institutionNameRegex = /^[A-Za-z\s.,'-]+$/;
        if (!value) {
          handleSetError(name, "Institution name is required");
        } else if (value.length < 2) {
          handleSetError(
            name,
            "Institution name must be at least 2 characters long"
          );
        } else if (!institutionNameRegex.test(value)) {
          handleSetError(
            name,
            "Institution name can only contain letters, spaces, and basic punctuation"
          );
        } else {
          handleSetError(name, "");
        }
        break;

      case "contactPersonName":
        if (!value) {
          handleSetError(name, "Contact person name is required");
        } else if (value.length < 2) {
          handleSetError(
            name,
            "Contact person name must be at least 2 characters long"
          );
        } else {
          handleSetError(name, "");
        }
        break;

      case "institutionType":
        if (!value) {
          handleSetError(name, "Institution type is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "title":
        if (!value) {
          handleSetError(name, "Title is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "age":
        if (!value) {
          handleSetError(name, "Age is required");
        } else if (
          !Number.isInteger(Number(value)) ||
          value <= 0 ||
          value > 120
        ) {
          handleSetError(name, "Age must be a valid number between 1 and 120");
        } else {
          handleSetError(name, "");
        }
        break;

      case "gender":
        if (!value) {
          handleSetError(name, "Gender is required");
        } else if (!["M", "F", "O"].includes(value)) {
          handleSetError(name, "Gender must be 'M', 'F', or 'O'");
        } else {
          handleSetError(name, "");
        }
        break;

      case "email":
        // Updated email regex to enforce stricter rules
        const emailRegex = /^[a-zA-Z][\w.-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) {
          handleSetError(name, "Email is required");
        } else if (!emailRegex.test(value)) {
          handleSetError(name, "Please enter a valid email address. Email should start with a letter and can contain letters, numbers, dots, and hyphens");
        } else {
          handleSetError(name, "");
        }
        break;

      case "occupation":
        if (!value) {
          handleSetError(name, "Occupation is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "deeksha":
        if (!value) {
          handleSetError(name, "Deeksha is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "aadhaar":
        if (!value) {
          handleSetError(name, "Aadhaar is required");
        } else if (!/^\d{12}$/.test(value)) {
          handleSetError(name, "Aadhaar number must be 12 digits long");
        } else {
          handleSetError(name, "");
        }
        break;

      case "phoneNumber":
        if (!value) {
          handleSetError(name, "Phone number is required");
        } else if (!/^\d{10}$/.test(value)) {
          handleSetError(name, "Phone number must be 10 digits long");
        } else {
          handleSetError(name, "");
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
          handleSetError(name, "State is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "district":
        if (!value) {
          handleSetError(name, "District is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "pinCode":
        if (!value) {
          handleSetError(name, "Pin Code is required");
        } else if (!/^\d{6}$/.test(value)) {
          handleSetError(name, "Pin Code must be 6 digits long");
        } else {
          handleSetError(name, "");
        }
        break;

      case "streetName":
        handleSetError(name, "");
        break;

      case "houseNumber":
        if (!value) {
          handleSetError(name, "Flat / House / Apartment No is required");
        } else {
          handleSetError(name, "");
        }
        break;

      case "postOffice":
        if (!value) {
          handleSetError(name, "Post Office is required");
        } else {
          handleSetError(name, "");
        }
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "institutionName") {
      // Only update if the value matches the pattern or is empty
      if (/^[A-Za-z\s.,'-]*$/.test(value)) {
        handleFormDataChange(name, value);
      }
    } else {
      handleFormDataChange(name, value);
    }
    validateField(name, value);
  };

  const handleAddressInputChange = async (e) => {
    const { name, value } = e.target;
    handleAddressChange(name, value);
    validateAddressField(name, value);

    if (name === "pinCode" && value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          updateAddress({
            state: postOffice.State,
            district: postOffice.District,
            postOffice: postOffice.Name,
          });
          handleSetError("pinCode", ""); // Clear error if successful
        } else {
          // Set error for invalid pincode
          handleSetError("pinCode", "Invalid pincode");
          // Clear the address fields
          updateAddress({
            state: "",
            district: "",
            postOffice: "",
          });
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
        handleSetError("pinCode", "Invalid pincode");
        updateAddress({
          state: "",
          district: "",
          postOffice: "",
        });
      }
    }
  };

  // Add logging to form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submission - Complete Form Data:", {
      formData,
      address: formData.address,
      errors,
    });

    let hasErrors = false;

    // Update the required fields list to match your actual requirements
    const fieldsToValidate = [
      "institutionName",
      "contactPersonName",
      "institutionType",
      "phoneNumber",
    ];

    // Check if any required field is empty
    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        handleSetError(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      } else {
        validateField(field, formData[field]);
      }
    });

    // Update required address fields - remove streetName
    const addressFieldsToValidate = ["pinCode"]; // removed streetName from here

    // Check if any required address field is empty
    addressFieldsToValidate.forEach((field) => {
      if (!formData.address[field]) {
        handleSetError(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      } else {
        validateAddressField(field, formData.address[field]);
      }
    });

    // Check for any validation errors
    if (Object.values(errors).some((error) => error)) {
      hasErrors = true;
    }

    if (!hasErrors) {
      console.log("Form Submission Successful - Final State:", formData);
      goToNextStep();
    } else {
      console.log("Form Submission Failed - Validation Errors:", errors);
    }
  };

  // Add searchInputRef
  const searchInputRef = useRef(null);

  // Add this array of deeksha options
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

  // Add this filtered options constant
  const filteredDeekshaOptions = deekshaOptions.filter((option) =>
    option.toLowerCase().includes(deekshaSearchQuery.toLowerCase())
  );

  // Add this effect for handling clicks outside the deeksha dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deekshaDropdownRef.current &&
        !deekshaDropdownRef.current.contains(event.target)
      ) {
        setIsDeekshaDropdownOpen(false);
        setDeekshaSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this array of institution options
  const institutionOptions = [
    "School",
    "College",
    "Religious",
    "Others"
  ];

  // Add this effect for handling clicks outside the institution dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        institutionDropdownRef.current &&
        !institutionDropdownRef.current.contains(event.target)
      ) {
        setIsInstitutionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this array of gender options
  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" }
  ];

  // Add this effect for handling clicks outside the gender dropdown
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

  // Add this array of title options
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

  // Add this effect for handling clicks outside the title dropdown
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

  return (
    <div className="application-form">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <h2>Institution/Organization Details</h2>
          <div className="form-section">
            <div className="form-left-section">
              {/* Institution Name Field */}
              <div className="form-group">
                <label>Institution/Organization Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  placeholder="Enter Institution Name"
                />
                {errors.institutionName && (
                  <span className="error">{errors.institutionName}</span>
                )}
              </div>

              {/* Contact Person Name Field */}
              <div className="form-group">
                <label>Contact Person Name</label>
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
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    placeholder="Contact Person Name"
                  />
                </div>
                {errors.title && <span className="error">{errors.title}</span>}
                {errors.contactPersonName && (
                  <span className="error">{errors.contactPersonName}</span>
                )}
              </div>

              {/* Age and Gender Fields */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div className="form-group" style={{ width: "50%" }}>
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="add your age"
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
                                handleCountryCodeChange(country.code);
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
                  />
                </div>
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </div>

            <div className="form-right-section">
              <div className="form-group">
                <label>Type of Institution</label>
                <div className="custom-select" ref={institutionDropdownRef}>
                  <div
                    className="selected-deeksha"
                    onClick={() =>
                      setIsInstitutionDropdownOpen(!isInstitutionDropdownOpen)
                    }
                  >
                    <span>{formData.institutionType || "Select Institution Type"}</span>
                    <svg
                      className={`dropdown-icon ${isInstitutionDropdownOpen ? "open" : ""}`}
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
                  {isInstitutionDropdownOpen && (
                    <div className="deeksha-dropdown">
                      <div className="deeksha-list">
                        {institutionOptions.map((option) => (
                          <div
                            key={option}
                            className="deeksha-option"
                            onClick={() => {
                              handleInputChange({
                                target: { name: "institutionType", value: option },
                              });
                              setIsInstitutionDropdownOpen(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {formData.institutionType === "Others" && (
                  <input
                    type="text"
                    name="otherInstitutionType"
                    value={formData.otherInstitutionType || ""}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    style={{ marginTop: "10px" }}
                  />
                )}
                {errors.institutionType && (
                  <span className="error">{errors.institutionType}</span>
                )}
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
              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                />
                {errors.aadhaar && (
                  <span className="error">{errors.aadhaar}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="address-section">
            <h3>Address</h3>
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
                <div className="form-group">
                  <label>Flat / House / Apartment No</label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.address.houseNumber}
                    onChange={handleAddressInputChange}
                    placeholder="Your flat/house/apartment number"
                  />
                  {errors.houseNumber && (
                    <span className="error">{errors.houseNumber}</span>
                  )}
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
                    readOnly
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
                    placeholder="Street name or landmark"
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
                    readOnly
                  />
                  {errors.district && (
                    <span className="error">{errors.district}</span>
                  )}
                </div>
                <div className="form-group">
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
              buttonName="Next"
              type="submit"
              style={{
                backgroundColor: "#EA7704",
                color: "#FFFFFF",
                borderColor: "#EA7704",
                fontSize: "18px",
                borderRadius: "7px",
                borderWidth: 1,
                padding: "15px 100px",
              }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default DormitoryApplicationDetails;
