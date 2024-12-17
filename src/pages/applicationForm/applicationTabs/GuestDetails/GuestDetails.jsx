import React, { useState, useEffect, useRef } from "react";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";
import "./GuestDetails.scss";

// Define colors for each guest
const guestColors = ["#C2F3D3", "#C2F3F2", "#ffcfb9"];

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
  const [isDeekshaDropdownOpen, setIsDeekshaDropdownOpen] = useState(false);
  const [deekshaSearchQuery, setDeekshaSearchQuery] = useState("");
  const deekshaDropdownRef = useRef(null);

  // Add new state for managing custom deeksha inputs for each guest
  const [showCustomDeekshas, setShowCustomDeekshas] = useState({});
  const [customDeekshas, setCustomDeekshas] = useState({});

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
            streetName: "",
            landmark: "",
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
            code: (
              country.idd.root + (country.idd.suffixes?.[0] || "")
            ).replace(/[^0-9]/g, ""),
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
        setSearchQuery("");
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
        if (value && !emailRegex.test(value)) {
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
        currentGuest: formData.guests[index],
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
        currentGuest: formData.guests[index],
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
        currentGuest: formData.guests[index],
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
    // Find current guest index
    const currentGuestIndex = guestTabs.indexOf(activeTab);
    let emptyFields = [];

    // Required fields for validation (removed email)
    const requiredFields = [
      { key: "guestTitle", label: "Title" },
      { key: "guestName", label: "Name" },
      { key: "guestAge", label: "Age" },
      { key: "guestGender", label: "Gender" },
      { key: "guestNumber", label: "Phone Number" },
      { key: "guestRelation", label: "Relation with Applicant" },
      { key: "guestOccupation", label: "Occupation" },
      { key: "guestDeeksha", label: "Deeksha" },
      { key: "guestAadhaar", label: "Aadhaar" },
    ];

    // Required address fields
    const requiredAddressFields = [
      { key: "pinCode", label: "Pin Code" },
      { key: "state", label: "State" },
      { key: "district", label: "District" },
    ];

    // Check required fields for current guest
    requiredFields.forEach(({ key, label }) => {
      if (!formData.guests[currentGuestIndex][key]) {
        emptyFields.push(label);
        setErrors(`${key}${currentGuestIndex}`, `${label} is required`);
      }
    });

    // Check required address fields if not using same as applicant address
    if (!formData.guests[currentGuestIndex].sameAsApplicant) {
      requiredAddressFields.forEach(({ key, label }) => {
        if (!formData.guests[currentGuestIndex].guestAddress?.[key]) {
          emptyFields.push(`Address ${label}`);
          setErrors(
            `guestAddress${key}${currentGuestIndex}`,
            `${label} is required`
          );
        }
      });
    }

    // Show alert if there are empty fields
    if (emptyFields.length > 0) {
      alert(
        `Please fill in the following required fields for ${activeTab}:\n${emptyFields.join(
          "\n"
        )}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If there are more guests to fill out, move to the next guest tab
    if (currentGuestIndex < formData.guests.length - 1) {
      const nextGuestTab = guestTabs[currentGuestIndex + 1];
      setActiveTab(nextGuestTab);
      console.log("Moving to next guest tab:", nextGuestTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate all guests before final proceed
    let hasErrors = false;
    formData.guests.forEach((guest, index) => {
      let guestEmptyFields = [];

      // Check required fields for each guest
      requiredFields.forEach(({ key, label }) => {
        if (!guest[key]) {
          guestEmptyFields.push(label);
          setErrors(`${key}${index}`, `${label} is required`);
          hasErrors = true;
        }
      });

      // Check required address fields for each guest
      if (!guest.sameAsApplicant) {
        requiredAddressFields.forEach(({ key, label }) => {
          if (!guest.guestAddress?.[key]) {
            guestEmptyFields.push(`Address ${label}`);
            setErrors(`guestAddress${key}${index}`, `${label} is required`);
            hasErrors = true;
          }
        });
      }

      if (guestEmptyFields.length > 0) {
        alert(
          `Please fill in the following required fields for Guest ${
            index + 1
          }:\n${guestEmptyFields.join("\n")}`
        );
        setActiveTab(guestTabs[index]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    });

    if (!hasErrors) {
      console.log("Guest Details Validation Successful");
      goToNextStep();
    }
  };

  const handleAddressToggle = (index) => {
    const currentGuest = formData.guests[index];
    const newSameAsApplicant = !currentGuest.sameAsApplicant;

    console.log("Address Toggle:", {
      guestIndex: index,
      sameAsApplicant: newSameAsApplicant,
      applicantAddress: formData.address,
    });

    // Update the sameAsApplicant flag for this guest
    setGuestData(index, "sameAsApplicant", newSameAsApplicant);

    if (newSameAsApplicant) {
      // Copy applicant's address to guest, including streetName and postOffice
      const guestAddress = {
        state: formData.address.state,
        district: formData.address.district,
        pinCode: formData.address.pinCode,
        houseNumber: formData.address.houseNumber,
        streetName: formData.address.streetName,
        postOffice: formData.address.postOffice,
      };

      Object.entries(guestAddress).forEach(([key, value]) => {
        setGuestData(index, `guestAddress.${key}`, value);
      });

      console.log("Copied Address to Guest:", {
        guestIndex: index,
        copiedAddress: guestAddress,
      });
    }
  };

  const handleRemoveGuest = (index) => {
    console.log("Guest Removal:", {
      guestIndex: index,
      guestDetails: formData.guests[index],
      remainingGuests: formData.guestMembers - 1,
      currentErrors: Object.keys(errors).filter((key) => key.includes(index)),
    });
    useApplicationStore.getState().removeGuest(index);
  };

  // Add store subscription for detailed updates
  useEffect(() => {
    const unsubscribe = useApplicationStore.subscribe(
      (state) => state,
      (newState, prevState) => {
        console.log("GuestDetails - Store Update:", {
          previous: {
            guestCount: prevState.formData.guestMembers,
            guests: prevState.formData.guests,
          },
          current: {
            guestCount: newState.formData.guestMembers,
            guests: newState.formData.guests,
          },
          changes: {
            guestMembers:
              newState.formData.guestMembers !==
              prevState.formData.guestMembers,
            guests:
              JSON.stringify(newState.formData.guests) !==
              JSON.stringify(prevState.formData.guests),
          },
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Add this useEffect for scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="guest-details" style={{ marginLeft: "50px" }}>
      <h2 style={{ marginTop: "55px" }}>Guest Details</h2>

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
          activeTab === tab &&
          formData.guests?.[index] && (
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
                                src={
                                  countryCodes.find(
                                    (c) =>
                                      c.code ===
                                      formData.guests[index].countryCode
                                  )?.flagUrl
                                }
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
                                    setGuestData(
                                      index,
                                      "countryCode",
                                      country.code
                                    );
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
                        name="guestNumber"
                        value={formData.guests[index].guestNumber || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          handleGuestInputChange(
                            {
                              target: {
                                name: "guestNumber",
                                value,
                              },
                            },
                            index
                          );
                        }}
                        placeholder="921234902"
                      />
                    </div>
                    {errors[`guestNumber${index}`] && (
                      <span className="error">
                        {errors[`guestNumber${index}`]}
                      </span>
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
                    <div
                      className="custom-dropdown"
                      style={{ position: "relative" }}
                      ref={deekshaDropdownRef}
                    >
                      <div
                        className="dropdown-header"
                        onClick={() => {
                          setIsDeekshaDropdownOpen(!isDeekshaDropdownOpen);
                          setTimeout(() => {
                            if (searchInputRef.current) {
                              searchInputRef.current.focus();
                            }
                          }, 100);
                        }}
                        style={{
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#FFF",
                        }}
                      >
                        <span>
                          {formData.guests[index].guestDeeksha ||
                            "Select Deeksha"}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transform: isDeekshaDropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="#6B7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {isDeekshaDropdownOpen && (
                        <div
                          className="dropdown-options"
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            maxHeight: "200px",
                            overflowY: "auto",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            zIndex: 1000,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search..."
                            value={deekshaSearchQuery}
                            onChange={(e) =>
                              setDeekshaSearchQuery(e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "none",
                              borderBottom: "1px solid #ccc",
                              outline: "none",
                            }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                          {deekshaOptions
                            .filter((option) =>
                              option
                                .toLowerCase()
                                .includes(deekshaSearchQuery.toLowerCase())
                            )
                            .map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  if (option === "Others") {
                                    setShowCustomDeekshas((prev) => ({
                                      ...prev,
                                      [index]: true,
                                    }));
                                    setCustomDeekshas((prev) => ({
                                      ...prev,
                                      [index]: "",
                                    }));
                                    setGuestData(index, "guestDeeksha", "");
                                  } else {
                                    setShowCustomDeekshas((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }));
                                    setGuestData(index, "guestDeeksha", option);
                                  }
                                  setIsDeekshaDropdownOpen(false);
                                  setDeekshaSearchQuery("");
                                }}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                  ":hover": {
                                    backgroundColor: "#f5f5f5",
                                  },
                                }}
                              >
                                {option}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Add custom deeksha input field for guests */}
                    {showCustomDeekshas[index] && (
                      <input
                        type="text"
                        placeholder="Please specify your Mantra Diksha"
                        value={customDeekshas[index] || ""}
                        onChange={(e) => {
                          setCustomDeekshas((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }));
                          setGuestData(index, "guestDeeksha", e.target.value);
                        }}
                        style={{ marginTop: "10px" }}
                      />
                    )}

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
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12);
                        handleGuestInputChange(
                          {
                            target: {
                              name: "guestAadhaar",
                              value,
                            },
                          },
                          index
                        );
                      }}
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
                        value={
                          (formData.guests[index].guestAddress || {}).pinCode ||
                          ""
                        }
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
                      <label>Flat / House / Apartment No</label>
                      <input
                        type="text"
                        name="guestAddress.houseNumber"
                        value={
                          (formData.guests[index].guestAddress || {})
                            .houseNumber || ""
                        }
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="House Number"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="guestAddress.state"
                        value={
                          (formData.guests[index].guestAddress || {}).state ||
                          ""
                        }
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter your state"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                      {errors[`guestAddressState${index}`] && (
                        <span className="error">
                          {errors[`guestAddressState${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Street Name / Landmark</label>
                      <input
                        type="text"
                        name="guestAddress.streetName"
                        value={
                          (formData.guests[index].guestAddress || {})
                            .streetName || ""
                        }
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter street name"
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
                        value={
                          (formData.guests[index].guestAddress || {})
                            .district || ""
                        }
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter your district"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
                      {errors[`guestAddressDistrict${index}`] && (
                        <span className="error">
                          {errors[`guestAddressDistrict${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Post Office</label>
                      <input
                        type="text"
                        name="guestAddress.postOffice"
                        value={
                          (formData.guests[index].guestAddress || {})
                            .postOffice || ""
                        }
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Enter post office"
                        disabled={formData.guests[index].sameAsApplicant}
                      />
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
