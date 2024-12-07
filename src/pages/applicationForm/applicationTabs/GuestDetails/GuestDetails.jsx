import React, { useState, useEffect, useRef } from "react";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";
import "./GuestDetails.scss";

// Define colors for each guest
const guestColors = ["#fef0c2", "#ffdfbf", "#ffcfb9"];

const GuestDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, errors, setErrors, setGuestData, setFormData } =
    useApplicationStore();
  const validRelations = [
    "mother",
    "father", 
    "son",
    "daughter",
    "wife",
    "aunt", 
    "friend",
    "other",
  ];

  const [activeTab, setActiveTab] = useState(`Guest 1`);
  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Initialize empty guests array if needed
    if (!formData.guests || formData.guests.length !== formData.guestMembers) {
      const newGuests = Array(formData.guestMembers)
        .fill()
        .map((_, index) => ({
          guestName: "",
          guestTitle: "",
          guestAadhaar: "",
          guestRelation: "",
          guestNumber: "",
          guestOccupation: "",
          guestAge: "",
          guestGender: "",
          guestEmail: "",
          guestDeeksha: "",
          countryCode: "91", // Default country code for India
          guestAddress: {
            state: "",
            houseNumber: "",
            district: "",
            pinCode: "",
          },
          sameAsApplicant: false,
        }));

      setFormData("guests", newGuests);
    }
  }, [formData.guestMembers, setFormData]);

  useEffect(() => {
    // Simplified country code initialization - just set default for India
    formData.guests.forEach((_, index) => {
      if (!formData.guests[index].countryCode) {
        setGuestData(index, "countryCode", "91");
      }
    });

    // Fetch all country codes with error handling and retry logic
    const fetchCountryCodes = async (retries = 3) => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const codes = data
          .filter((country) => country.idd.root)
          .map((country) => ({
            code: (country.idd.root + (country.idd.suffixes?.[0] || "")).replace(/[^0-9]/g, ""),
            flagUrl: country.flags.svg,
            id: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
        if (retries > 0) {
          console.log(`Retrying... ${retries} attempts left`);
          setTimeout(() => fetchCountryCodes(retries - 1), 1000);
        } else {
          // Fallback to a minimal default list
          setCountryCodes([
            { code: "91", flagUrl: "", id: "IN", name: "India" },
            { code: "1", flagUrl: "", id: "US", name: "United States" },
            { code: "44", flagUrl: "", id: "GB", name: "United Kingdom" },
            { code: "86", flagUrl: "", id: "CN", name: "China" },
            { code: "81", flagUrl: "", id: "JP", name: "Japan" },
          ]);
        }
      }
    };

    fetchCountryCodes();
  }, [formData.guests.length, setGuestData]);

  const guestTabs = Array(formData.guestMembers)
    .fill()
    .map((_, index) => {
      const guest = formData.guests[index];
      return guest?.guestName || `Guest ${index + 1}`;
    });

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(searchQuery) ||
      country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateGuestField = (index, name, value) => {
    switch (name) {
      case "guestTitle":
        if (!value) {
          setErrors(`guestTitle${index}`, "Title is required");
        } else {
          setErrors(`guestTitle${index}`, "");
        }
        break;

      case "guestName":
        if (!value) {
          setErrors(`guestName${index}`, "Name is required");
        } else {
          setErrors(`guestName${index}`, "");
        }
        break;

      case "guestAge":
        if (!value) {
          setErrors(`guestAge${index}`, "Age is required");
        } else if (
          !Number.isInteger(Number(value)) ||
          value <= 0 ||
          value > 120
        ) {
          setErrors(
            `guestAge${index}`,
            "Age must be a valid number between 1 and 120"
          );
        } else {
          setErrors(`guestAge${index}`, "");
        }
        break;

      case "guestGender":
        if (!value) {
          setErrors(`guestGender${index}`, "Gender is required");
        } else if (!["M", "F", "O"].includes(value)) {
          setErrors(`guestGender${index}`, "Gender must be 'M', 'F', or 'O'");
        } else {
          setErrors(`guestGender${index}`, "");
        }
        break;

      case "guestNumber":
        if (!value) {
          setErrors(`guestNumber${index}`, "Phone number is required");
        } else if (!/^\d{10}$/.test(value)) {
          setErrors(
            `guestNumber${index}`,
            "Phone number must be 10 digits long"
          );
        } else {
          setErrors(`guestNumber${index}`, "");
        }
        break;

      case "guestAadhaar":
        if (!value) {
          setErrors(`guestAadhaar${index}`, "Aadhaar is required");
        } else if (!/^\d{12}$/.test(value)) {
          setErrors(
            `guestAadhaar${index}`,
            "Aadhaar number must be 12 digits long"
          );
        } else {
          setErrors(`guestAadhaar${index}`, "");
        }
        break;

      case "guestOccupation":
        if (!value) {
          setErrors(`guestOccupation${index}`, "Occupation is required");
        } else {
          setErrors(`guestOccupation${index}`, "");
        }
        break;

      case "guestDeeksha":
        if (!value) {
          setErrors(`guestDeeksha${index}`, "Deeksha is required");
        } else {
          setErrors(`guestDeeksha${index}`, "");
        }
        break;

      case "guestRelation":
        if (!value) {
          setErrors(
            `guestRelation${index}`,
            "Relation with applicant is required"
          );
        } else if (!validRelations.includes(value.toLowerCase())) {
          setErrors(
            `guestRelation${index}`,
            "Invalid relation. Must be one of: mother, father, son, daughter, wife, aunt, friend, or other."
          );
        } else {
          setErrors(`guestRelation${index}`, "");
        }
        break;

      // Address validations
      case "guestAddress.state":
        if (!value) {
          setErrors(`guestAddressState${index}`, "State is required");
        } else {
          setErrors(`guestAddressState${index}`, "");
        }
        break;

      case "guestAddress.district":
        if (!value) {
          setErrors(`guestAddressDistrict${index}`, "District is required");
        } else {
          setErrors(`guestAddressDistrict${index}`, "");
        }
        break;

      case "guestAddress.pinCode":
        if (!value) {
          setErrors(`guestAddressPinCode${index}`, "Pin Code is required");
        } else if (!/^\d{6}$/.test(value)) {
          setErrors(
            `guestAddressPinCode${index}`,
            "Pin Code must be 6 digits long"
          );
        } else {
          setErrors(`guestAddressPinCode${index}`, "");
        }
        break;

      case "guestEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          setErrors(`guestEmail${index}`, "Email is required");
        } else if (!emailRegex.test(value)) {
          setErrors(`guestEmail${index}`, "Please enter a valid email address");
        } else {
          setErrors(`guestEmail${index}`, "");
        }
        break;

      default:
        break;
    }
  };

  const handleGuestInputChange = async (e, index) => {
    const { name, value } = e.target;
    
    // Ensure guests array exists
    const guests = formData.guests || [];
    if (!guests[index]) {
      return;
    }

    if (name === "guestTitle") {
      setGuestData(index, name, value);
      console.log("Guest Input Change:", { 
        guestIndex: index, 
        field: name, 
        value,
        currentGuest: formData.guests[index]
      });
      validateGuestField(index, name, value);
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const updatedAddress = {
        ...(formData.guests[index][parent] || {}),
        [child]: value,
      };
      setGuestData(index, parent, updatedAddress);
      console.log("Guest Input Change:", { 
        guestIndex: index, 
        field: name, 
        value,
        currentGuest: formData.guests[index]
      });
      validateGuestField(index, name, value);

      if (child === "pinCode" && value.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await response.json();

          if (
            data[0].Status === "Success" &&
            data[0].PostOffice &&
            data[0].PostOffice.length > 0
          ) {
            const postOffice = data[0].PostOffice[0];
            const updatedAddressWithLocation = {
              ...updatedAddress,
              state: postOffice.State,
              district: postOffice.District,
            };
            setGuestData(index, parent, updatedAddressWithLocation);
          } else {
            setErrors(`guestAddressPinCode${index}`, "Invalid pincode");
          }
        } catch (error) {
          console.error("Error fetching address details:", error);
          setErrors(
            `guestAddressPinCode${index}`,
            "Error fetching address details"
          );
        }
      }
    } else {
      setGuestData(index, name, value);
      console.log("Guest Input Change:", { 
        guestIndex: index, 
        field: name, 
        value,
        currentGuest: formData.guests[index]
      });
      validateGuestField(index, name, value);

      if (name === "guestName") {
        setActiveTab(value || `Guest ${index + 1}`);
      }
    }
  };

  const handleBack = () => {
    goToPrevStep();
  };

  const handleProceed = () => {
    console.log("Proceed Attempt - Current Form Status:", {
      totalGuests: formData.guestMembers,
      currentGuests: formData.guests,
      currentTab: activeTab,
      validationErrors: errors,
      formValidation: {
        hasErrors: Object.keys(errors).length > 0,
        errorFields: Object.keys(errors)
      }
    });

    // Find current guest index
    const currentGuestIndex = guestTabs.indexOf(activeTab);
    
    // Validate current guest's required fields
    let currentGuestHasErrors = false;
    const requiredFields = [
      "guestTitle",
      "guestName",
      "guestAge",
      "guestGender",
      "guestEmail",
      "guestNumber",
      "guestRelation"
    ];

    // Log validation status for current guest
    console.log("Validating Current Guest:", {
      guestIndex: currentGuestIndex,
      guestName: formData.guests[currentGuestIndex].guestName,
      missingFields: requiredFields.filter(field => !formData.guests[currentGuestIndex][field]),
      currentErrors: Object.keys(errors).filter(key => key.includes(currentGuestIndex))
    });

    requiredFields.forEach(field => {
      if (!formData.guests[currentGuestIndex][field]) {
        setErrors(`${field}${currentGuestIndex}`, `${field.replace('guest', '')} is required`);
        currentGuestHasErrors = true;
      }
    });

    if (currentGuestHasErrors) {
      console.log("Current Guest Validation Failed:", errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If there are more guests to fill out, move to the next guest tab
    if (currentGuestIndex < formData.guests.length - 1) {
      const nextGuestTab = guestTabs[currentGuestIndex + 1];
      setActiveTab(nextGuestTab);
      console.log("Moving to next guest tab:", nextGuestTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If we're on the last guest and all validations pass, proceed to next step
    let hasErrors = false;
    formData.guests.forEach((guest, index) => {
      requiredFields.forEach(field => {
        if (!guest[field]) {
          setErrors(`${field}${index}`, `${field.replace('guest', '')} is required`);
          hasErrors = true;
        }
      });
    });

    if (!hasErrors) {
      console.log("Guest Details Validation Successful");
      goToNextStep();
    } else {
      console.log("Guest Details Validation Failed:", errors);
      // Move to the first guest with errors
      const firstErrorIndex = formData.guests.findIndex((guest) => 
        requiredFields.some(field => !guest[field])
      );
      if (firstErrorIndex !== -1) {
        setActiveTab(guestTabs[firstErrorIndex]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAddressToggle = (index) => {
    const currentGuest = formData.guests[index];
    const newSameAsApplicant = !currentGuest.sameAsApplicant;
    
    console.log("Address Toggle:", {
      guestIndex: index,
      sameAsApplicant: newSameAsApplicant,
      applicantAddress: formData.address
    });

    // Update the sameAsApplicant flag for this guest
    setGuestData(index, "sameAsApplicant", newSameAsApplicant);

    if (newSameAsApplicant) {
      // Copy applicant's address to guest
      const guestAddress = {
        state: formData.address.state,
        district: formData.address.district,
        pinCode: formData.address.pinCode,
        houseNumber: formData.address.houseNumber,
      };
      
      Object.entries(guestAddress).forEach(([key, value]) => {
        setGuestData(index, `guestAddress.${key}`, value);
      });
      
      console.log("Copied Address to Guest:", {
        guestIndex: index,
        copiedAddress: guestAddress
      });
    }
  };

  const handleRemoveGuest = (index) => {
    console.log("Guest Removal:", {
      guestIndex: index,
      guestDetails: formData.guests[index],
      remainingGuests: formData.guestMembers - 1,
      currentErrors: Object.keys(errors).filter(key => key.includes(index))
    });
    useApplicationStore.getState().removeGuest(index);
  };

  // Add store subscription for detailed updates
  useEffect(() => {
    const unsubscribe = useApplicationStore.subscribe(
      (state) => state,
      (newState, prevState) => {
        console.log('GuestDetails - Store Update:', {
          previous: {
            guestCount: prevState.formData.guestMembers,
            guests: prevState.formData.guests
          },
          current: {
            guestCount: newState.formData.guestMembers,
            guests: newState.formData.guests
          },
          changes: {
            guestMembers: newState.formData.guestMembers !== prevState.formData.guestMembers,
            guests: JSON.stringify(newState.formData.guests) !== JSON.stringify(prevState.formData.guests)
          }
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Add this useEffect for scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="guest-details" style={{ marginLeft: "50px" }}>
      <h2 style={{ marginTop: "55px" }}>Kamarpukur Guesthouse Booking</h2>

      <div className="form-tabs custom-form-tab">
        {guestTabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            style={{
              padding: "18px 30px",
              backgroundColor: guestColors[index % guestColors.length],
            }}
            onClick={() => setActiveTab(tab)}
          >
            <span>{tab}</span>
            <span
              className="remove-guest"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveGuest(index);
              }}
            >
              ×
            </span>
          </div>
        ))}
        {formData.guestMembers < 9 && (
          <div
            className="tab add-guest-tab"
            onClick={() => {
              const newGuestCount = formData.guestMembers + 1;
              setFormData("guestMembers", newGuestCount);
            }}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span className="plus-icon">+</span>
            <span>Add Guest</span>
          </div>
        )}
      </div>

      {guestTabs.map(
        (tab, index) =>
          activeTab === tab && formData.guests?.[index] && (
            <div
              key={index}
              className="tab-content"
              style={{
                backgroundColor: guestColors[index % guestColors.length],
                padding: "20px",
                borderRadius: "0px 8px 8px 8px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "30px" }}
              >
                <div className="form-left-section">
                  <div className="form-group">
                    <label>Name</label>
                    <div className="unified-input">
                      <div className="custom-select">
                        <select
                          name="guestTitle"
                          value={formData.guests[index].guestTitle || ""}
                          onChange={(e) => handleGuestInputChange(e, index)}
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
                        name="guestName"
                        value={formData.guests[index].guestName || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors[`guestTitle${index}`] && (
                      <span className="error">
                        {errors[`guestTitle${index}`]}
                      </span>
                    )}
                    {errors[`guestName${index}`] && (
                      <span className="error">
                        {errors[`guestName${index}`]}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <div className="form-group" style={{ width: "50%" }}>
                      <label>Age</label>
                      <input
                        type="number"
                        name="guestAge"
                        value={formData.guests[index].guestAge || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Add your age"
                      />
                      {errors[`guestAge${index}`] && (
                        <span className="error">
                          {errors[`guestAge${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group" style={{ width: "50%" }}>
                      <label>Gender</label>
                      <select
                        name="guestGender"
                        value={formData.guests[index].guestGender || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                      {errors[`guestGender${index}`] && (
                        <span className="error">
                          {errors[`guestGender${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email ID</label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guests[index].guestEmail || ""}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Email id"
                    />
                    {errors[`guestEmail${index}`] && (
                      <span className="error">
                        {errors[`guestEmail${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="unified-input">
                      <div className="custom-select" ref={dropdownRef}>
                        <div 
                          className="selected-country" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                        >
                          {formData.guests[index].countryCode && (
                            <>
                              <img 
                                src={countryCodes.find(c => c.code === formData.guests[index].countryCode)?.flagUrl} 
                                alt="" 
                                className="flag-icon" 
                              />
                              +{formData.guests[index].countryCode}
                            </>
                          )}
                        </div>
                        {isDropdownOpen && (
                          <div className="country-dropdown">
                            <input
                              type="text"
                              ref={searchInputRef}
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
                                    setGuestData(index, "countryCode", country.code);
                                    setIsDropdownOpen(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <img src={country.flagUrl} alt="" className="flag-icon" />
                                  <span>+{country.code}</span>
                                  <span className="country-name">{country.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        name="guestNumber"
                        value={formData.guests[index].guestNumber || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="921234902"
                      />
                    </div>
                    {errors[`guestNumber${index}`] && (
                      <span className="error">{errors[`guestNumber${index}`]}</span>
                    )}
                  </div>
                </div>

                <div className="form-right-section">
                  <div className="form-group">
                    <label>Occupation</label>
                    <input
                      type="text"
                      name="guestOccupation"
                      value={formData.guests[index].guestOccupation || ""}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Enter your occupation"
                    />
                    {errors[`guestOccupation${index}`] && (
                      <span className="error">
                        {errors[`guestOccupation${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Initiation / Mantra Diksha from</label>
                    <select
                      name="guestDeeksha"
                      value={formData.guests[index].guestDeeksha || ""}
                      onChange={(e) => handleGuestInputChange(e, index)}
                    >
                      <option value="">Select Deeksha</option>
                      <option value="Sri Ramakrishna – Life and Teachings">
                        Sri Ramakrishna – Life and Teachings
                      </option>
                      <option value="Sri Sarada Devi – Life and Teachings">
                        Sri Sarada Devi – Life and Teachings
                      </option>
                      <option value="Swami Vivekananda – His Life and Legacy">
                        Swami Vivekananda – His Life and Legacy
                      </option>
                      <option value="The Gospel of Sri Ramakrishna">
                        The Gospel of Sri Ramakrishna
                      </option>
                      <option value="none">None</option>
                    </select>
                    {errors[`guestDeeksha${index}`] && (
                      <span className="error">
                        {errors[`guestDeeksha${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      name="guestAadhaar"
                      value={formData.guests[index].guestAadhaar || ""}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="••••••••••••"
                    />
                    {errors[`guestAadhaar${index}`] && (
                      <span className="error">
                        {errors[`guestAadhaar${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Relation with Applicant</label>
                    <select
                      name="guestRelation"
                      value={formData.guests[index].guestRelation || ""}
                      onChange={(e) => handleGuestInputChange(e, index)}
                    >
                      <option value="">Select Relation</option>
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="son">Son</option>
                      <option value="daughter">Daughter</option>
                      <option value="wife">Wife</option>
                      <option value="aunt">Aunt</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                    {formData.guests[index].guestRelation === "other" && (
                      <input
                        type="text"
                        name="guestRelationOther"
                        value={formData.guests[index].guestRelationOther || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Please specify relation"
                        style={{ marginTop: "10px" }}
                      />
                    )}
                    {errors[`guestRelation${index}`] && (
                      <span className="error">
                        {errors[`guestRelation${index}`]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="address-section">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3>Address</h3>
                </div>
                <div className="address-toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.guests[index].sameAsApplicant}
                      onChange={() => handleAddressToggle(index)}
                    />
                    <span className="slider"></span>
                  </label>
                  <label className="form-label">
                    Same as applicant address
                  </label>
                </div>

                <div className="formTabSection">
                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>Pin Code</label>
                      <input
                        type="text"
                        name="guestAddress.pinCode"
                        value={(formData.guests[index].guestAddress || {}).pinCode || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter Pincode"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                      {errors[`guestAddressPinCode${index}`] && (
                        <span className="error">
                          {errors[`guestAddressPinCode${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>House Number</label>
                      <input
                        type="text"
                        name="guestAddress.houseNumber"
                        value={(formData.guests[index].guestAddress || {}).houseNumber || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="House Number"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>District</label>
                      <input
                        type="text"
                        name="guestAddress.district"
                        value={(formData.guests[index].guestAddress || {}).district || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter your district"
                        readOnly
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                      {errors[`guestAddressDistrict${index}`] && (
                        <span className="error">
                          {errors[`guestAddressDistrict${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="guestAddress.state"
                        value={(formData.guests[index].guestAddress || {}).state || ""}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter your state"
                        readOnly
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                      {errors[`guestAddressState${index}`] && (
                        <span className="error">
                          {errors[`guestAddressState${index}`]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      )}

      {tabName && (
        <div
          className="submit-button"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 30px",
            gap: "15px",
          }}
        >
          <CommonButton
          className="back"
            buttonName="Back"
            style={{
              backgroundColor: "#FFF",
              color: "#000",
              borderColor: "#4B4B4B",
              fontSize: "18px",
              borderRadius: "7px",
              padding: "15px 20px",
            }}
            onClick={handleBack}
          />
          <div style={{ display: "flex", gap: "15px" }}>
            {formData.guests?.length > 0 && (
              <CommonButton
                buttonName="Delete Guest"
                style={{
                  backgroundColor: "#FFF2EA",
                  color: "#FF4D4F",
                  borderColor: "#FFF2EA",
                  fontSize: "18px",
                  borderRadius: "7px",
                  padding: "15px 20px",
                }}
                onClick={() => handleRemoveGuest(guestTabs.indexOf(activeTab))}
              />
            )}
            <CommonButton
            className="proceed"
              buttonName="Proceed"
              style={{
                backgroundColor: "#EA7704",
                color: "#FFFFFF",
                borderColor: "#EA7704",
                fontSize: "18px",
                borderRadius: "7px",
                padding: "15px 100px",
              }}
              onClick={handleProceed}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDetails;
