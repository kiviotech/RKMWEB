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

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(searchQuery) ||
      country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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
        if (!value) {
          setErrors(name, "Name is required");
        } else if (value.length < 2) {
          setErrors(name, "Name must be at least 2 characters long");
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
        if (!value) {
          setErrors(name, "Occupation is required");
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
        } else if (!/^\d{10}$/.test(value)) {
          setErrors(name, "Phone number must be 10 digits long");
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
    validateAddressField(name, value);

    if (name === "pinCode" && value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setAddressData("state", postOffice.State);
          setAddressData("district", postOffice.District);
          console.log("Pincode API Response:", {
            state: postOffice.State,
            district: postOffice.District,
          });
        } else {
          setAddressData("state", "");
          setAddressData("district", "");
          console.log("Invalid Pincode Response");
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
        setAddressData("state", "");
        setAddressData("district", "");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
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
        setErrors(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      } else {
        validateAddressField(field, formData.address[field]);
      }
    });

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
          <h2>Kamarpukur Guesthouse Booking</h2>
          <div className="form-section">
            <div className="form-left-section">
              {/* Name Field */}
              <div className="form-group">
                <label>Name</label>
                <div className="unified-input">
                  <div className="custom-select">
                    <select
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Title</option>
                      <option value="Sri">Sri</option>
                      <option value="Smt">Smt.</option>
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Swami">Swami</option>
                      <option value="Dr">Dr.</option>
                      <option value="Prof">Prof.</option>
                      <option value="Kumari">Kumari</option>
                      <option value="Ms">Ms.</option>
                    </select>
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
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
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
                    placeholder="921234902"
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

              <div className="form-group">
                <label>Initiation / Mantra Diksha from</label>
                <select
                  name="deeksha"
                  value={formData.deeksha}
                  onChange={handleInputChange}
                >
                  <option value="">Select Deeksha</option>
                  <option value="Sri Ramakrishna – Life and Teachings">
                    Sri Ramakrishna – Life and Teachings
                  </option>
                  <option value="Sri Sarada Devi – Life and Teachings">
                    Sri Sarada Devi Life and Teachings
                  </option>
                  <option value="Swami Vivekananda – His Life and Legacy">
                    Swami Vivekananda – His Life and Legacy
                  </option>
                  <option value="The Gospel of Sri Ramakrishna">
                    The Gospel of Sri Ramakrishna
                  </option>
                  <option value="none">None</option>
                </select>
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
                  onChange={handleInputChange}
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
                <div
                  className="addressInputBox"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Flat/House No</label>
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
                    readOnly
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Street Name</label>
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
                    readOnly
                  />
                  {errors.district && (
                    <span className="error">{errors.district}</span>
                  )}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.address.landmark}
                    onChange={handleAddressInputChange}
                    placeholder="Enter nearby landmark"
                  />
                  {errors.landmark && (
                    <span className="error">{errors.landmark}</span>
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
