import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaContactForm.scss";
import { icons } from "../../../constants";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@sweetalert2/theme-dark";
import whatsapp from "../../../assets/icons/whatsapp.png";

const MySwal = withReactContent(Swal);

const translations = {
  english: {
    enterPhone: "Please enter your phone number:",
    plus: "+",
    yourNumber: "your number",
    isWhatsapp: "Is this your WhatsApp number?",
    enterEmail: "Please enter your e-mail id:",
    emailPlaceholder: "noname@nodomain.com",
    enterAadhaar: "Please enter your Aadhaar number:",
    aadhaarPlaceholder: "123456789012",
    skipSubmit: "Skip & Submit",
    back: "Back",
    next: "Next",
    wantToSubmit: "Do you want to submit?",
    confirm: "Confirm",
    cancel: "Cancel",
  },
  hindi: {
    enterPhone: "कृपया अपना फोन नंबर दर्ज करें:",
    plus: "+",
    yourNumber: "आपका नंबर",
    isWhatsapp: "क्या यह आपका व्हाट्सएप नंबर है?",
    enterEmail: "कृपया अपना ईमेल आईडी दर्ज करें:",
    emailPlaceholder: "noname@nodomain.com",
    enterAadhaar: "कृपया अपना आधार नंबर दर्ज करें:",
    aadhaarPlaceholder: "123456789012",
    skipSubmit: "छोड़ें और जमा करें",
    back: "वापस",
    next: "अगला",
    wantToSubmit: "क्या आप जमा करना चाहते हैं?",
    confirm: "पुष्टि करें",
    cancel: "रद्द करें",
  },
  bengali: {
    enterPhone: "অনুগ্রহ করে আপনার ফোন নম্বর লিখুন:",
    plus: "+",
    yourNumber: "আপনার নম্বর",
    isWhatsapp: "এটি কি আপনার হোয়াটসঅ্যাপ নম্বর?",
    enterEmail: "অনুগ্রহ করে আপনার ইমেল আইডি লিখুন:",
    emailPlaceholder: "noname@nodomain.com",
    enterAadhaar: "অনুগ্রহ করে আপনার আধার নম্বর লিখুন:",
    aadhaarPlaceholder: "123456789012",
    skipSubmit: "এড়িয়ে যান এবং জমা দিন",
    back: "পিছনে",
    next: "পরবর্তী",
    wantToSubmit: "আপনি জমা দিতে চান?",
    confirm: "নিশ্চিত করুন",
    cancel: "বাতিল করুন",
  },
};

const DeekshaContactForm = () => {
  const navigate = useNavigate();
  const { contact, updateContact, formLanguage } = useDeekshaFormStore();

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  // Log entire Zustand store when component mounts
  React.useEffect(() => {
    const fullStore = useDeekshaFormStore.getState();
    console.log("Full Deeksha Form Store:", fullStore);
  }, []);

  // Add error state
  const [errors, setErrors] = React.useState({
    phoneNumber: "",
    email: "",
    aadhaar: "",
  });

  // Add these new state variables
  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Add filtered country codes
  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(searchQuery) ||
      country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add these useEffects
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
    updateContact({ countryCode: "91" });

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

  // Update handleInputChange to prevent non-numeric input for phone number
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow numeric input for phone number
    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      updateContact({ [name]: numericValue });
      validateField(name, numericValue);
    } else {
      updateContact({ [name]: value });
      validateField(name, value);
    }

    // Log full store after each update
    const fullStore = useDeekshaFormStore.getState();
    console.log("Full Store After Update:", fullStore);
  };

  // Update the validateField function to be stricter
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "phoneNumber":
        if (!value || value.trim() === "") {
          newErrors.phoneNumber = "Phone number is required";
        } else if (value.length !== 10) {
          newErrors.phoneNumber = "Phone number must be exactly 10 digits";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.phoneNumber = "Phone number can only contain digits";
        } else {
          newErrors.phoneNumber = "";
        }
        break;

      case "email":
        if (!value || value.trim() === "") {
          newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          newErrors.email = "";
        }
        break;

      case "aadhaar":
        if (!value || value.trim() === "") {
          newErrors.aadhaar = "Aadhaar number is required";
        } else if (value.length !== 12) {
          newErrors.aadhaar = "Aadhaar number must be exactly 12 digits";
        } else if (!/^\d{12}$/.test(value)) {
          newErrors.aadhaar = "Aadhaar number can only contain digits";
        } else {
          newErrors.aadhaar = "";
        }
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  // Update isFormValid to check for required fields
  const isFormValid = () => {
    const { phoneNumber, email, aadhaar } = contact;

    // Check if required fields are present
    if (!phoneNumber || !email || !aadhaar) {
      // Validate empty fields to show error messages
      validateField("phoneNumber", phoneNumber || "");
      validateField("email", email || "");
      validateField("aadhaar", aadhaar || "");
      return false;
    }

    // Validate all fields
    const isPhoneValid = validateField("phoneNumber", phoneNumber);
    const isEmailValid = validateField("email", email);
    const isAadhaarValid = validateField("aadhaar", aadhaar);

    return isPhoneValid && isEmailValid && isAadhaarValid;
  };

  const handleBack = () => {
    navigate("/deekshaAdress-form"); // Updated route for Back button
  };

  const handleNext = () => {
    alert("Proceeding to the next page...");
  };

  const handlePopup = (e) => {
    e.preventDefault(); // Prevent default navigation

    const { phoneNumber, email, aadhaar } = contact;

    // Check for empty fields
    if (!phoneNumber || !email || !aadhaar) {
      // Update error states for empty fields
      setErrors({
        phoneNumber: !phoneNumber ? "Phone number is required" : "",
        email: !email ? "Email is required" : "",
        aadhaar: !aadhaar ? "Aadhaar number is required" : "",
      });
      return; // Stop here if any field is empty
    }

    // Only show popup if all required fields are filled
    MySwal.fire({
      text: "Do you want to add additional Information?",
      imageUrl: icons.informationIcon,
      imageWidth: 70,
      imageHeight: 70,
      imageAlt: "Custom image",
      showCancelButton: true,
      confirmButtonText: "Skip and Submit",
      cancelButtonText: "Continue",
      background: "#ffffff",
      buttonsStyling: false,
      customClass: {
        confirmButton: "skipButton",
        cancelButton: "cancelButton",
      },
      backdrop: `rgba(0, 0, 0, 0.4) left top no-repeat`,
      didOpen: () => {
        const confirmButton = MySwal.getConfirmButton();
        const cancelButton = MySwal.getCancelButton();

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        const popup = MySwal.getPopup();
        popup.appendChild(buttonContainer);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/deekshaUpasana-form");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/deekshaEducation-form");
      }
    });
  };

  // submitPopup

  const handleSubmit = () => {
    const { phoneNumber, email, aadhaar } = contact;

    // Check for empty fields
    if (!phoneNumber || !email || !aadhaar) {
      setErrors({
        phoneNumber: !phoneNumber ? "Phone number is required" : "",
        email: !email ? "Email is required" : "",
        aadhaar: !aadhaar ? "Aadhaar number is required" : "",
      });
      return;
    }

    Swal.fire({
      text: t.wantToSubmit,
      background: "#ffffff",
      showCancelButton: true,
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
      customClass: {
        confirmButton: "confirmButton",
        cancelButton: "cancelbutton",
        popup: "popup",
      },
      buttonsStyling: false,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "25px";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        const popup = Swal.getPopup();
        popup.appendChild(buttonContainer);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/deekshaUpasana-form");
        console.log("Form submitted!");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancel clicked!");
      }
    });
  };

  return (
    <div className="diksha-form-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" />
      </div>

      {/* Title */}
      <h2 className="title">
        Srimat Swami Gautamanandaji Maharaj's Diksha Form
      </h2>

      {/* Form */}
      <form>
        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label">{t.enterPhone}</label>
          <div className="phone-input">
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
                <span className="prefix">{t.plus}</span>
                {contact.countryCode && (
                  <>
                    <img
                      src={
                        countryCodes.find((c) => c.code === contact.countryCode)
                          ?.flagUrl
                      }
                      alt=""
                      className="flag-icon"
                    />
                    <span className="code">{contact.countryCode}</span>
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
                          updateContact({ countryCode: country.code });
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
                        <span className="country-name">{country.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder={t.yourNumber}
              value={contact.phoneNumber}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                // Allow only numbers, backspace, delete, arrow keys, and tab
                if (
                  !/[\d\b]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`input-field ${errors.phoneNumber ? "error" : ""}`}
            />
            {errors.phoneNumber && (
              <span className="error-message">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="switch-wrapper">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            <img src={icons.whatsapp} alt="whatsapp.png" className="whatsapp" />
            <span className="label-text">{t.isWhatsapp}</span>
          </div>
        </div>

        {/* Email ID */}
        <div className="form-group">
          <label className="form-label">{t.enterEmail}</label>
          <input
            type="email"
            name="email"
            placeholder={t.emailPlaceholder}
            value={contact.email}
            onChange={handleInputChange}
            className={`input-field ${errors.email ? "error" : ""}`}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Aadhaar Number */}
        <div className="form-group">
          <label className="form-label">{t.enterAadhaar}</label>
          <input
            maxLength={12}
            type="text"
            name="aadhaar"
            placeholder={t.aadhaarPlaceholder}
            value={contact.aadhaar}
            onChange={handleInputChange}
            className={`input-field ${errors.aadhaar ? "error" : ""}`}
          />
          {errors.aadhaar && (
            <span className="error-message">{errors.aadhaar}</span>
          )}
        </div>
      </form>

      <div className="footer">
        <span onClick={handleSubmit}>{t.skipSubmit}</span>

        <div className="button-group">
          <button onClick={handleBack} className="back-button">
            {t.back}
          </button>
          <Link
            to="/deekshaEducation-form"
            className="next-button"
            onClick={handlePopup}
          >
            {t.next}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeekshaContactForm;
