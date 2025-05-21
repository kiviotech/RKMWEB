import React, { useState, useEffect, useRef } from "react";
import "./DonorDetails.scss";
import useDonationStore from "../../../../donationStore";
import { fetchGuestDetails, searchGuestDetailsByName, searchGuestDetailsByPhone, updateGuestDetailsById } from "../../../../services/src/services/guestDetailsService";
import { fetchReceiptDetails } from "../../../../services/src/services/receiptDetailsService";

const DonorDetails = ({ activeTab }) => {
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

  // Add this new array for identity proof options
  const identityProofOptions = [
    "Aadhaar",
    "PAN Card",
    "Voter ID",
    "Passport",
    "Driving License"
  ];

  const {
    donorTabs,
    activeTabId,
    updateDonorDetails,
    copyDonorDetails,
    updateDonationDetails,
    fieldErrors,
    setFieldErrors,
    updateUniqueNo,
  } = useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonorDetails =
    donorTabs[activeTabId][currentSection].donorDetails;

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [identityError, setIdentityError] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [isDeekshaDropdownOpen, setIsDeekshaDropdownOpen] = useState(false);
  const [deekshaSearchQuery, setDeekshaSearchQuery] = useState("");
  const [showCustomDeeksha, setShowCustomDeeksha] = useState(false);
  const [customDeeksha, setCustomDeeksha] = useState("");
  const deekshaDropdownRef = useRef(null);
  const nameDropdownRef = useRef(null);
  const phoneDropdownRef = useRef(null);
  const [identitySuggestions, setIdentitySuggestions] = useState([]);
  const [showIdentitySuggestions, setShowIdentitySuggestions] = useState(false);
  const identityDropdownRef = useRef(null);

  const isCompleted =
    donorTabs[activeTabId][currentSection].donationDetails.status ===
    "completed";

  const updateAndSyncDonorDetails = (details) => {
    updateDonorDetails(activeTabId, currentSection, details);
    const otherSection = currentSection === "math" ? "mission" : "math";
    copyDonorDetails(activeTabId, currentSection, otherSection);
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors({
      ...fieldErrors,
      donor: {
        ...fieldErrors.donor,
        [fieldName]: undefined,
      },
    });
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;

    // Only allow numbers and limit to 6 digits
    if (!/^\d*$/.test(pincode) || pincode.length > 6) {
      return;
    }

    updateAndSyncDonorDetails({ pincode });
    clearFieldError("pincode");

    // Clear related fields if pincode is incomplete or deleted
    if (pincode.length !== 6) {
      updateAndSyncDonorDetails({
        state: "",
        district: "",
        postOffice: "",
      });

      if (pincode.length > 0) {
        setFieldErrors({
          ...fieldErrors,
          donor: {
            ...fieldErrors.donor,
            pincode: "Pincode must be 6 digits",
          },
        });
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const [data] = await response.json();

      if (data.Status === "Success") {
        const postOfficeData = data.PostOffice[0];
        
        // First update the donor details locally
        updateAndSyncDonorDetails({
          state: postOfficeData.State,
          district: postOfficeData.District,
          postOffice: postOfficeData.Name,
        });
        clearFieldError("pincode");
        
        // If this is an existing guest, update the backend as well
        if (currentDonorDetails.guestId && currentDonorDetails.guestData) {
          // Construct the full address with updated components
          const addressComponents = [
            currentDonorDetails.flatNo,
            currentDonorDetails.streetName,
            postOfficeData.Name, // New post office from API
            postOfficeData.District, // New district from API
            postOfficeData.State, // New state from API
            pincode // New pincode
          ].filter(Boolean);
          
          const updateData = { 
            address: addressComponents.join(', ')
          };
          
          // Call the function to update the backend
          saveGuestDetailsToBackend(currentDonorDetails.guestId, updateData);
        }
      } else {
        // Clear related fields and show error for invalid pincode
        updateAndSyncDonorDetails({
          state: "",
          district: "",
          postOffice: "",
        });
        setFieldErrors({
          ...fieldErrors,
          donor: {
            ...fieldErrors.donor,
            pincode: "Invalid pincode",
          },
        });
      }
    } catch (error) {
      // console.error("Error fetching pincode data:", error);
      // Clear related fields and show error for failed API call
      updateAndSyncDonorDetails({
        state: "",
        district: "",
        postOffice: "",
      });
      setFieldErrors({
        ...fieldErrors,
        donor: {
          ...fieldErrors.donor,
          pincode: "Error validating pincode",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    if (!email) return ""; // Don't show error for empty email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if we have guest data - only reset if editing name or phone
    if (currentDonorDetails.guestData && (name === "name" || name === "phone")) {
      // These are identity fields, so clear all guest data if they're changed
      // console.log("Clearing guest data due to identity field edit");
      updateAndSyncDonorDetails({
        guestId: null,
        guestData: null,
        title: "",
        name: "",
        phone: "",
        email: "",
        deeksha: "",
        identityType: "Aadhaar",
        identityNumber: "",
        pincode: "",
        state: "",
        district: "",
        postOffice: "",
        flatNo: "",
        streetName: "",
        roomNo: "",
      });

      // Also clear PAN number in donation details
      updateDonationDetails(activeTabId, "math", {
        panNumber: "",
      });
      updateDonationDetails(activeTabId, "mission", {
        panNumber: "",
      });

      // Then set the current field value
      updateAndSyncDonorDetails({ [name]: value });
      return;
    } else if (currentDonorDetails.guestData && currentDonorDetails.guestId) {
      // For other fields, just update them without resetting the form
      // When a guest record exists, we'll update their details in the backend
      console.log(`Updating field ${name} for existing guest ${currentDonorDetails.guestId}`);
      
      // Update the field locally
      updateAndSyncDonorDetails({ [name]: value });
      
      // Schedule backend update after a short delay to avoid too many API calls
      // Only for certain fields that we allow editing for existing guests
      if (['email', 'deeksha', 'flatNo', 'streetName', 'postOffice', 'roomNo'].includes(name)) {
        // Prepare update data based on field being edited
        let updateData = { [name]: value };
        
        // For address components, rebuild the full address
        if (['flatNo', 'streetName', 'postOffice'].includes(name)) {
          const addressComponents = [
            name === 'flatNo' ? value : currentDonorDetails.flatNo,
            name === 'streetName' ? value : currentDonorDetails.streetName,
            name === 'postOffice' ? value : currentDonorDetails.postOffice,
            currentDonorDetails.district,
            currentDonorDetails.state,
            currentDonorDetails.pincode
          ].filter(Boolean);
          
          updateData = { address: addressComponents.join(', ') };
        }
        
        // For room number, use the field name from the API
        if (name === 'roomNo') {
          updateData = { room_no: value };
        }
        
        // Call the function to update backend
        saveGuestDetailsToBackend(currentDonorDetails.guestId, updateData);
      }
      
      // Handle validation and error clearing
      if (name === "email") {
        const error = validateEmail(value);
        setEmailError(error);
        if (error) {
          setFieldErrors({
            ...fieldErrors,
            donor: {
              ...fieldErrors.donor,
              email: error,
            },
          });
        } else {
          clearFieldError("email");
        }
      }
      
      if (name === "roomNo" && !/^[a-zA-Z0-9]*$/.test(value)) {
        return; // Don't update if special characters are entered
      }
      
      clearFieldError(name);
      return;
    }

    // Original input handling logic for new guests
    if (name === "email") {
      const error = validateEmail(value);
      setEmailError(error);
      if (error) {
        setFieldErrors({
          ...fieldErrors,
          donor: {
            ...fieldErrors.donor,
            email: error,
          },
        });
      } else {
        clearFieldError("email");
      }
    }

    // Add room number validation
    if (name === "roomNo") {
      // Only allow alphanumeric characters
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        return; // Don't update if special characters are entered
      }
    }

    updateAndSyncDonorDetails({ [name]: value });
    clearFieldError(name);
  };

  const handleTitleChange = (e) => {
    updateAndSyncDonorDetails({ title: e.target.value });
  };

  const handleNameChange = (e) => {
    // Get the value, remove leading spaces, and replace multiple spaces with single space
    let value = e.target.value.trimLeft().replace(/\s+/g, " ");

    // Check if we have guest data
    if (currentDonorDetails.guestData) {
      // Clear all guest data and fields
      // console.log("Clearing guest data due to manual edit");
      updateAndSyncDonorDetails({
        guestId: null,
        guestData: null,
        title: "",
        name: "",
        phone: "",
        email: "",
        deeksha: "",
        identityType: "Aadhaar",
        identityNumber: "",
        pincode: "",
        state: "",
        district: "",
        postOffice: "",
        flatNo: "",
        streetName: "",
        roomNo: "",
      });

      // Also clear PAN number in donation details
      updateDonationDetails(activeTabId, "math", {
        panNumber: "",
      });
      updateDonationDetails(activeTabId, "mission", {
        panNumber: "",
      });
    }

    // Allow only letters, numbers, and single spaces (no leading spaces)
    if (/^[A-Za-z0-9][A-Za-z0-9\s]*$/.test(value) || value === "") {
      updateAndSyncDonorDetails({ name: value });
      clearFieldError("name");

      // Filter suggestions based on input
      if (value.length > 0) {
        // Use the API to search guests by name instead of filtering locally
        searchGuestDetailsByName(value)
          .then(response => {
            setNameSuggestions(response.data);
            setShowNameSuggestions(response.data.length > 0);
          })
          .catch(error => {
            console.error("Error searching guests by name:", error);
            setNameSuggestions([]);
            setShowNameSuggestions(false);
          });
      } else {
        setNameSuggestions([]);
        setShowNameSuggestions(false);
        // Set error for empty name
        setFieldErrors({
          ...fieldErrors,
          donor: {
            ...fieldErrors.donor,
            name: "Name is required",
          },
        });
      }
    } else {
      // Update error message to reflect new requirements
      setFieldErrors({
        ...fieldErrors,
        donor: {
          ...fieldErrors.donor,
          name: "Name must start with a letter or number (single spaces between words only)",
        },
      });
    }
  };

  const handleDeekshaChange = (e) => {
    const value = e.target.value;
    updateAndSyncDonorDetails({ deeksha: value });
    clearFieldError("deeksha");
    
    // If this is an existing guest, update the backend as well
    if (currentDonorDetails.guestId && currentDonorDetails.guestData) {
      saveGuestDetailsToBackend(currentDonorDetails.guestId, { deeksha: value });
    }
  };

  const handleOtherDeekshaChange = (e) => {
    const value = e.target.value;
    updateAndSyncDonorDetails({ otherDeeksha: value });
    
    // Also update the deeksha field for consistency
    updateAndSyncDonorDetails({ deeksha: value });
    
    // If this is an existing guest, update the backend as well
    if (currentDonorDetails.guestId && currentDonorDetails.guestData) {
      saveGuestDetailsToBackend(currentDonorDetails.guestId, { deeksha: value });
    }
  };

  const validateIdentityNumber = (type, value) => {
    if (!value) return ""; // Don't show error for empty value

    switch (type) {
      case "Aadhaar":
        if (!/^\d+$/.test(value))
          return "Aadhaar number should only contain digits";
        if (value.length < 12)
          return (
            "Aadhaar number must be 12 digits (currently: " + value.length + ")"
          );
        if (value.length > 12) return "Aadhaar number cannot exceed 12 digits";
        break;

      case "PAN Card":
        if (!/^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(value))
          return "Invalid PAN format";
        if (value.length < 10)
          return "PAN must be 10 characters (currently: " + value.length + ")";
        if (value.length > 10) return "PAN cannot exceed 10 characters";
        if (value.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          return "Invalid PAN format (must be like ABCDE1234F)";
        }
        break;

      case "Voter ID":
        if (!/^[A-Z0-9/]*$/.test(value))
          return "Invalid Voter ID format (only letters, numbers, and / allowed)";
        if (value.length > 20) return "Voter ID cannot exceed 20 characters";
        break;

      case "Passport":
        if (!/^[A-Z]{0,1}[0-9]{0,7}$/.test(value))
          return "Invalid Passport format";
        if (value.length < 8)
          return (
            "Passport must be 8 characters (currently: " + value.length + ")"
          );
        if (value.length > 8) return "Passport cannot exceed 8 characters";
        if (value.length === 8 && !/^[A-Z]{1}[0-9]{7}$/.test(value)) {
          return "Invalid Passport format (must be like A1234567)";
        }
        break;

      case "Driving License":
        if (!/^[A-Z]{0,2}[0-9]{0,13}$/.test(value))
          return "Invalid Driving License format";
        if (value.length < 15)
          return (
            "Driving License must be 15 characters (currently: " +
            value.length +
            ")"
          );
        if (value.length > 15)
          return "Driving License cannot exceed 15 characters";
        if (value.length === 15 && !/^[A-Z]{2}[0-9]{13}$/.test(value)) {
          return "Invalid Driving License format (must be like DL0420160000000)";
        }
        break;
    }
    return "";
  };

  const handleIdentityInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    const identityType = currentDonorDetails.identityType;

    const error = validateIdentityNumber(identityType, value);
    setIdentityError(error);

    // Filter suggestions based on identity input
    if (value.length > 0) {
      const filtered = guestList.filter((guest) =>
        guest.attributes.identity_number?.includes(value)
      );
      setIdentitySuggestions(filtered);
      setShowIdentitySuggestions(filtered.length > 0);
    } else {
      setIdentitySuggestions([]);
      setShowIdentitySuggestions(false);
    }

    // Only update if the input matches the expected format or is empty
    switch (identityType) {
      case "PAN Card":
        if (/^[A-Z0-9]*$/.test(value) && value.length <= 10) {
          updateAndSyncDonorDetails({ identityNumber: value });
          updateDonationDetails(activeTabId, "math", {
            panNumber: value,
          });
          updateDonationDetails(activeTabId, "mission", {
            panNumber: value,
          });
        }
        break;
      case "Aadhaar":
        if (/^\d*$/.test(value) && value.length <= 12) {
          updateAndSyncDonorDetails({ identityNumber: value });
        }
        break;
      case "Voter ID":
        if (/^[A-Z0-9/]*$/.test(value) && value.length <= 20) {
          updateAndSyncDonorDetails({ identityNumber: value });
        }
        break;
      case "Passport":
        if (/^[A-Z0-9]*$/.test(value) && value.length <= 8) {
          updateAndSyncDonorDetails({ identityNumber: value });
        }
        break;
      case "Driving License":
        if (/^[A-Z0-9]*$/.test(value) && value.length <= 15) {
          updateAndSyncDonorDetails({ identityNumber: value });
        }
        break;
      default:
        updateAndSyncDonorDetails({ identityNumber: value });
    }

    clearFieldError("identityNumber");
  };

  const handleIdentityTypeChange = (e) => {
    const newIdentityType = e.target.value;
    updateAndSyncDonorDetails({
      identityType: newIdentityType,
      identityNumber: "", // Reset the number when type changes
    });

    // If changing from PAN Card, clear PAN number from donation details
    if (currentDonorDetails.identityType === "PAN Card") {
      updateDonationDetails(activeTabId, "math", {
        panNumber: "",
      });
      updateDonationDetails(activeTabId, "mission", {
        panNumber: "",
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Check if we have guest data
    if (currentDonorDetails.guestData) {
      // Clear all guest data and fields
      // console.log("Clearing guest data due to manual edit");
      updateAndSyncDonorDetails({
        guestId: null,
        guestData: null,
        title: "",
        name: "",
        phone: "",
        email: "",
        deeksha: "",
        identityType: "Aadhaar",
        identityNumber: "",
        pincode: "",
        state: "",
        district: "",
        postOffice: "",
        flatNo: "",
        streetName: "",
        roomNo: "",
      });

      // Also clear PAN number in donation details
      updateDonationDetails(activeTabId, "math", {
        panNumber: "",
      });
      updateDonationDetails(activeTabId, "mission", {
        panNumber: "",
      });
    }

    // Allow only numbers, and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      updateAndSyncDonorDetails({ phone: value });
      clearFieldError("phone");

      // Filter suggestions based on phone input
      if (value.length > 0) {
        // Use the API to search guests by phone instead of filtering locally
        searchGuestDetailsByPhone(value)
          .then(response => {
            setPhoneSuggestions(response.data);
            setShowPhoneSuggestions(response.data.length > 0);
          })
          .catch(error => {
            console.error("Error searching guests by phone:", error);
            setPhoneSuggestions([]);
            setShowPhoneSuggestions(false);
          });

        // Set error if length is not 10
        if (value.length !== 10) {
          setPhoneError(
            `Phone number must be 10 digits (currently: ${value.length})`
          );
          // Also set the field error to ensure it blocks form submission
          setFieldErrors({
            ...fieldErrors,
            donor: {
              ...fieldErrors.donor,
              phone: `Phone number must be 10 digits (currently: ${value.length})`,
            },
          });
        } else {
          setPhoneError("");
          clearFieldError("phone");
        }
      } else {
        setPhoneSuggestions([]);
        setShowPhoneSuggestions(false);
        setPhoneError("");
        clearFieldError("phone");
      }
    }
  };

  useEffect(() => {
    // We don't need to load all guests at once anymore
    // Only load receipt details initially for receipt numbers
    const fetchReceiptDetailsData = async () => {
      try {
        const receipts = await fetchReceiptDetails();
        // console.log("All Receipts:", receipts);
      } catch (error) {
        console.error("Error fetching receipt details:", error);
      }
    };

    fetchReceiptDetailsData();

    // Add click outside handlers (preserve this part)
    const handleClickOutside = (event) => {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(event.target)) {
        setShowNameSuggestions(false);
      }
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target)) {
        setShowPhoneSuggestions(false);
      }
      if (identityDropdownRef.current && !identityDropdownRef.current.contains(event.target)) {
        setShowIdentitySuggestions(false);
      }
      if (deekshaDropdownRef.current && !deekshaDropdownRef.current.contains(event.target)) {
        setIsDeekshaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fieldErrors]);

  const handleSuggestionClick = (guest) => {
    // console.log("Selected Guest Data:", guest);

    const {
      name = "",
      phone_number = "",
      email = "",
      deeksha = "",
      identity_proof = "Aadhaar",
      identity_number = "",
      address = "",
      unique_no = "",
      pan_number = "",
    } = guest.attributes || {};

    // Extract title and name
    const titleMatch = name.match(
      /^(Sri\.|Smt\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Kumari\.|Swami\.)\s*/
    );
    const title = titleMatch ? titleMatch[1] : "";
    const nameWithoutTitle = name.replace(
      /^(Sri\.|Smt\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Kumari\.|Swami\.)\s*/,
      ""
    );

    // Split address by commas and trim whitespace
    const addressParts = (address || "").split(",").map((part) => part.trim());

    // Extract components based on position from the end
    const pincode = addressParts.length > 0 ? addressParts[addressParts.length - 1] || "" : ""; // Last
    const state = addressParts.length > 1 ? addressParts[addressParts.length - 2] || "" : ""; // 2nd last
    const district = addressParts.length > 2 ? addressParts[addressParts.length - 3] || "" : ""; // 3rd last
    const postOffice = addressParts.length > 3 ? addressParts[addressParts.length - 4] || "" : ""; // 4th last
    const streetName = addressParts.length > 4 ? addressParts[addressParts.length - 5] || "" : ""; // 5th last
    const flatNo = addressParts.length > 5 ? addressParts[addressParts.length - 6] || "" : ""; // 6th last

    // Update donor details
    updateAndSyncDonorDetails({
      guestId: guest.id,
      guestData: guest,
      title: title,
      name: nameWithoutTitle,
      phone: phone_number ? phone_number.replace("+91", "") : "",
      email,
      deeksha,
      identityType: identity_proof,
      identityNumber: identity_number,
      pincode,
      state,
      district,
      postOffice,
      flatNo,
      streetName,
    });

    // Add this: Update PAN number in donation details for both math and mission
    if (pan_number) {
      updateDonationDetails(activeTabId, "math", {
        panNumber: pan_number,
      });
      updateDonationDetails(activeTabId, "mission", {
        panNumber: pan_number,
      });
    }

    // Update unique_no if it exists
    if (unique_no) {
      updateUniqueNo(activeTabId, unique_no);
    }

    setShowNameSuggestions(false);
    setShowPhoneSuggestions(false);
    setShowIdentitySuggestions(false);
  };

  const hasGuestData = () => {
    return !!currentDonorDetails.guestData;
  };

  // Update the saveGuestDetailsToBackend function to use updateGuestDetailsById
  const saveGuestDetailsToBackend = async (guestId, updateData) => {
    if (guestId) {
      try {
        // Call the API to update guest details
        await updateGuestDetailsById(guestId, updateData);
        console.log("Guest details updated successfully:", updateData);
        
        // We could add a toast notification here if desired
      } catch (error) {
        console.error("Error updating guest details:", error);
        // We could add error handling/toast notification here
      }
    }
  };

  return (
    <div
      className={`donor-details ${donorTabs[activeTabId].activeSection === "mission" ? "mission-bg" : ""
        }`}
    >
      <div className="donor-details__header">
        <h2>Donor Details</h2>
        <span className="language-switch">
          {donorTabs[activeTabId].uniqueNo}
        </span>
      </div>

      <form className="donor-details__form">
        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Name of Donor <span className="required">*</span>
            </label>
            <div className="donor-details__name-input">
              <select
                className="donor-select"
                value={currentDonorDetails.title}
                onChange={handleTitleChange}
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                  height: "45px",
                }}
              >
                <option value="">Title</option>
                <option value="Sri.">Sri.</option>
                <option value="Smt.">Smt.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Swami.">Swami.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Kumari.">Kumari.</option>
                <option value="Ms.">Ms.</option>
              </select>
              <div
                className="autocomplete-container"
                style={{ position: "relative", flex: 1 }}
                ref={nameDropdownRef}
              >
                <input
                  className="donor-input"
                  type="text"
                  value={currentDonorDetails.name}
                  onChange={handleNameChange}
                  pattern="[A-Za-z0-9\s.]+"
                  title="Please enter letters, numbers, spaces, and dots"
                  disabled={isCompleted}
                  style={{
                    backgroundColor: isCompleted ? "#f5f5f5" : "white",
                    opacity: isCompleted ? 0.7 : 1,
                  }}
                />
                {fieldErrors.donor?.name && (
                  <span
                    className="error-message"
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {fieldErrors.donor.name}
                  </span>
                )}
                {showNameSuggestions && nameSuggestions.length > 0 && (
                  <ul
                    className="suggestions-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {nameSuggestions.map((guest) => (
                      <li
                        key={guest.id}
                        onClick={() => handleSuggestionClick(guest)}
                        style={{
                          padding: "8px 12px",
                          lineHeight: "1.5",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "white")
                        }
                      >
                        Name: <b>{guest.attributes.name || ''}</b>
                        <br />
                        Phone:{" "}
                        <b>
                          {guest.attributes.phone_number ? guest.attributes.phone_number.replace("+91", "") : ''}
                        </b>
                        <br />
                        Identity Proof:{" "}
                        <b>{guest.attributes.identity_number || ''}</b>
                        <br />
                        Address:{" "}
                        <b>
                          {guest.attributes.address ? guest.attributes.address.replace(/^,\s*,\s*/, "") : ''}
                        </b>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Phone No. <span className="required">*</span>
            </label>
            <div
              className="autocomplete-container"
              style={{ position: "relative" }}
              ref={phoneDropdownRef}
            >
              <input
                className="donor-input"
                type="tel"
                name="phone"
                value={currentDonorDetails.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
              />
              {showPhoneSuggestions && phoneSuggestions.length > 0 && (
                <ul
                  className="suggestions-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {phoneSuggestions.map((guest) => (
                    <li
                      key={guest.id}
                      onClick={() => handleSuggestionClick(guest)}
                      style={{
                        padding: "8px 12px",
                        lineHeight: "1.5",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      Name: <b>{guest.attributes.name || ''}</b>
                      <br />
                      Phone:{" "}
                      <b>{guest.attributes.phone_number ? guest.attributes.phone_number.replace("+91", "") : ''}</b>
                      <br />
                      Identity Proof: <b>{guest.attributes.identity_number || ''}</b>
                      <br />
                      Address:{" "}
                      <b>{guest.attributes.address ? guest.attributes.address.replace(/^,\s*,\s*/, "") : ''}</b>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(phoneError || fieldErrors.donor?.phone) && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {phoneError || fieldErrors.donor.phone}
              </span>
            )}
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Initiation / Mantra Diksha from{" "}
              <span className="required">*</span>
            </label>
            <div
              className="custom-dropdown"
              style={{ position: "relative" }}
              ref={deekshaDropdownRef}
            >
              <div
                className="dropdown-header"
                onClick={() =>
                  !isCompleted &&
                  setIsDeekshaDropdownOpen(!isDeekshaDropdownOpen)
                }
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: isCompleted ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: isCompleted ? "#f5f5f5" : "#FFF",
                  opacity: isCompleted ? 0.7 : 1,
                }}
              >
                <span>
                  {showCustomDeeksha
                    ? "Others"
                    : currentDonorDetails.deeksha || "Select Deeksha"}
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
                    type="text"
                    placeholder="Search..."
                    value={deekshaSearchQuery}
                    onChange={(e) => setDeekshaSearchQuery(e.target.value)}
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
                            setShowCustomDeeksha(true);
                            setCustomDeeksha("");
                            updateAndSyncDonorDetails({ deeksha: "" });
                          } else {
                            setShowCustomDeeksha(false);
                            updateAndSyncDonorDetails({ deeksha: option });
                            clearFieldError("deeksha");
                          }
                          setIsDeekshaDropdownOpen(false);
                          setDeekshaSearchQuery("");
                        }}
                        className="deeksha-option"
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        {option}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {showCustomDeeksha && (
              <input
                type="text"
                placeholder="Please specify your Mantra Diksha"
                value={customDeeksha}
                onChange={(e) => {
                  if (!isCompleted) {
                    const value = e.target.value;
                    // Only allow letters, spaces, and dots
                    if (/^[A-Za-z\s.]*$/.test(value)) {
                      setCustomDeeksha(value);
                      updateAndSyncDonorDetails({ deeksha: value });
                      if (value.trim()) {
                        clearFieldError("deeksha");
                      } else {
                        setFieldErrors({
                          ...fieldErrors,
                          donor: {
                            ...fieldErrors.donor,
                            deeksha: "Please specify Mantra Diksha",
                          },
                        });
                      }
                    }
                  }
                }}
                style={{
                  marginTop: "10px",
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
                disabled={isCompleted}
                className="donor-input"
              />
            )}
            {fieldErrors.donor?.deeksha && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.deeksha}
              </span>
            )}
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Guest House Room No.</label>
            <input
              className="donor-input"
              type="text"
              name="roomNo"
              value={currentDonorDetails.roomNo}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Email</label>
            <input
              className="donor-input"
              type="email"
              name="email"
              value={currentDonorDetails.email}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
            {emailError && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {emailError}
              </span>
            )}
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              Identity Proof <span className="required">*</span>
            </label>
            <div className="donor-details__identity-input">
              <select
                className="identity-select"
                value={currentDonorDetails.identityType}
                onChange={handleIdentityTypeChange}
                disabled={isCompleted || hasGuestData()}
                style={{
                  backgroundColor:
                    isCompleted || hasGuestData() ? "#f5f5f5" : "white",
                  opacity: isCompleted || hasGuestData() ? 0.7 : 1,
                }}
              >
                {identityProofOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div
                className="autocomplete-container"
                style={{ position: "relative", flex: 1 }}
                ref={identityDropdownRef}
              >
                <input
                  className="identity-input"
                  type="text"
                  value={currentDonorDetails.identityNumber}
                  onChange={handleIdentityInputChange}
                  disabled={isCompleted || hasGuestData()}
                  style={{
                    backgroundColor:
                      isCompleted || hasGuestData() ? "#f5f5f5" : "white",
                    opacity: isCompleted || hasGuestData() ? 0.7 : 1,
                  }}
                />
                {showIdentitySuggestions && identitySuggestions.length > 0 && (
                  <ul
                    className="suggestions-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {identitySuggestions.map((guest) => (
                      <li
                        key={guest.id}
                        onClick={() => handleSuggestionClick(guest)}
                        style={{
                          padding: "8px 12px",
                          lineHeight: "1.5",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "white")
                        }
                      >
                        Name: <b>{guest.attributes.name || ''}</b>
                        <br />
                        Phone:{" "}
                        <b>
                          {guest.attributes.phone_number ? guest.attributes.phone_number.replace("+91", "") : ''}
                        </b>
                        <br />
                        Identity Proof:{" "}
                        <b>{guest.attributes.identity_number || ''}</b>
                        <br />
                        Address:{" "}
                        <b>
                          {guest.attributes.address ? guest.attributes.address.replace(/^,\s*,\s*/, "") : ''}
                        </b>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {(identityError || fieldErrors.donor.identityNumber) && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {identityError || fieldErrors.donor.identityNumber}
              </span>
            )}
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">
              Pincode <span className="required">*</span>
            </label>
            <div className="pincode-input-wrapper">
              <input
                className="donor-input"
                type="text"
                value={currentDonorDetails.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#f5f5f5" : "white",
                  opacity: isCompleted ? 0.7 : 1,
                }}
              />
              {loading && <span className="loading-spinner">🔄</span>}
            </div>
            {fieldErrors.donor?.pincode && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {fieldErrors.donor.pincode}
              </span>
            )}
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              State <span className="required">*</span>
            </label>
            <input
              className="donor-input"
              type="text"
              name="state"
              value={currentDonorDetails.state}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">
              District <span className="required">*</span>
            </label>
            <input
              className="donor-input"
              type="text"
              name="district"
              value={currentDonorDetails.district}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>
        </div>

        <div className="donor-details__row">
          <div className="donor-details__field">
            <label className="donor-label">Flat / House / Apartment No</label>
            <input
              className="donor-input"
              type="text"
              name="flatNo"
              value={currentDonorDetails.flatNo}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Street Name / Landmark</label>
            <input
              className="donor-input"
              type="text"
              name="streetName"
              value={currentDonorDetails.streetName}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>

          <div className="donor-details__field">
            <label className="donor-label">Post Office</label>
            <input
              className="donor-input"
              type="text"
              name="postOffice"
              value={currentDonorDetails.postOffice}
              onChange={handleInputChange}
              disabled={isCompleted}
              style={{
                backgroundColor: isCompleted ? "#f5f5f5" : "white",
                opacity: isCompleted ? 0.7 : 1,
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonorDetails;
