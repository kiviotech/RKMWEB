import React, { useState, useEffect, useRef } from "react";
import "./NewDonation.scss";
import { useAuthStore } from "../../../../store/authStore";
import { useDonationStore } from "../../../../donationStore";
import {
  fetchGuestDetails,
  createNewGuestDetails,
} from "../../../../services/src/services/guestDetailsService";
import {
  createNewReceiptDetail,
  fetchUniqueNumbers,
  fetchReceiptNumbers,
} from "../../../../services/src/services/receiptDetailsService";
import {
  createNewDonation,
  fetchDonationsByField,
  updateDonationById,
  fetchDonationById,
} from "../../../../services/src/services/donationsService";
import { useNavigate, useLocation } from "react-router-dom";
import ReceiptTemplate from "./ReceiptTemplate";
import ThankLetterTemplate from "./ThankLetterTemplate";
import ConsentLetterTemplate from "./ConsentLetterTemplate";

const NewDonation = () => {
  // Add this useEffect at the top of your component
  useEffect(() => {
    // Try multiple scroll methods to ensure it works across different browsers
    const scrollToTop = () => {
      // Method 1: Using window.scrollTo
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      // Method 2: Using document.documentElement
      document.documentElement.scrollTop = 0;

      // Method 3: Using document.body
      document.body.scrollTop = 0;
    };

    // Execute scroll immediately
    scrollToTop();

    // Also try after a small delay to ensure content is loaded
    setTimeout(scrollToTop, 100);

    return () => {
      // Reset scroll restoration when component unmounts
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const [selectedTab, setSelectedTab] = useState("Math");
  const [receiptNumber, setReceiptNumber] = useState("");
  const { user } = useAuthStore();
  const { addDonationTab, addDonation } = useDonationStore();
  const [donorDetails, setDonorDetails] = useState({
    title: "Sri",
    name: "",
    phoneCode: "+91",
    phone: "",
    email: "",
    mantraDiksha: "",
    identityType: "Aadhaar",
    identityNumber: "",
    roomNumber: "",
    pincode: "",
    houseNumber: "",
    streetName: "",
    district: "",
    state: "",
    postOffice: "",
    panNumber: "",
  });
  const [donorTags, setDonorTags] = useState([
    {
      id: "tab1",
      name: "New Donor",
      isNewDonor: true,
    },
  ]);
  const [selectedDonor, setSelectedDonor] = useState(
    donorTags[0]?.id || "tab1"
  );
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({
    donationDetails: {
      donationType: "",
      amount: "",
      transactionType: "cash",
      inMemoryOf: "", // Remove default value
      transactionDetails: {
        ddNumber: "",
        ddDate: "",
        bankName: "",
        branchName: "",
      },
    },
  });

  const [donorTabs, setDonorTabs] = useState({});
  const [donationHistory, setDonationHistory] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    phone: "",
    email: "",
    identityNumber: "",
    purpose: "",
    amount: "",
  });
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPendingConfirm, setShowPendingConfirm] = useState(false);
  const location = useLocation();
  const donationData = location.state?.donationData;
  const donationId = location.state?.donationData?.id;

  // Add this to your validation states
  const [showPANField, setShowPANField] = useState(false);

  // Add new state for print options dropdown
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  // Add this near the top with other state declarations
  const [stampImageUrl, setStampImageUrl] = useState({
    withStamp:
      "http://localhost:1337/uploads/large_Whats_App_Image_2024_12_08_at_10_25_43_PM_336d2cb2f0.jpeg",
    withoutStamp:
      "http://localhost:1337/uploads/medium_Whats_App_Image_2024_12_09_at_10_31_00_AM_d828ff9d49.jpeg",
  });

  // Add these refs at the top of your component with other refs
  const donorNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const deekshaDropdownRef = useRef(null);
  const emailInputRef = useRef(null); // Add this line
  const identityInputRef = useRef(null); // Add this line

  // Add this with your other state declarations at the top
  const [uniqueDonorId, setUniqueDonorId] = useState("");

  // Add this state to store the highest numbers
  const [highestNumbers, setHighestNumbers] = useState({
    MT: 0,
    MSN: 0,
  });

  // Add these state declarations
  const [isDeekshaDropdownOpen, setIsDeekshaDropdownOpen] = useState(false);
  const [deekshaSearchQuery, setDeekshaSearchQuery] = useState("");

  // Add state for custom deeksha
  const [showCustomDeeksha, setShowCustomDeeksha] = useState(false);
  const [customDeeksha, setCustomDeeksha] = useState("");

  // Add the deeksha options array
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

  // console.log("Zustand Store Data:", {
  //   // auth: { user },
  //   donations,
  // });

  // console.log("Received donation data:", donationData);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) return;

      try {
        const response = await fetchDonationById(donationId);
        const donationData = response.data;
        const guestData = donationData.attributes.guest.data.attributes;
        const receiptData =
          donationData.attributes.receipt_detail.data.attributes;

        // Update donor details
        setDonorDetails({
          title: guestData.name.split(" ")[0] || "Sri", // Extract title from name
          name: guestData.name.split(" ").slice(1).join(" "), // Extract name without title
          phoneCode: "+91",
          phone: guestData.phone_number.replace("+91", ""),
          email:
            guestData.email ||
            `${guestData.name.split(" ").slice(1).join(" ")}@gmail.com`,
          mantraDiksha: guestData.deeksha,
          identityType: "Aadhaar",
          identityNumber: guestData.aadhaar_number,
          roomNumber: "",
          // Parse address components
          ...parseAddress(guestData.address),
          guestId: donationData.attributes.guest.data.id,
        });

        // Set selected tab based on donationFor
        setSelectedTab(donationData.attributes.donationFor);

        // Update receipt number
        setReceiptNumber(receiptData.Receipt_number);

        // Update current receipt with donation details
        setCurrentReceipt({
          receiptNumber: receiptData.Receipt_number,
          donationDetails: {
            donationType: donationData.attributes.type || "Others (Revenue)", // Use type field here
            purpose: donationData.attributes.purpose || "General", // Add purpose field
            amount: donationData.attributes.donationAmount,
            transactionType:
              donationData.attributes.transactionType.toLowerCase(),
            inMemoryOf:
              donationData.attributes.InMemoryOf || "Others (Revenue)",
            transactionDetails: {
              ddNumber: donationData.attributes.ddch_number || "",
              ddDate: donationData.attributes.ddch_date || "",
              bankName: donationData.attributes.bankName || "",
              branchName: donationData.attributes.branchName || "",
            },
          },
        });
      } catch (err) {
        console.error("Error fetching donation:", err);
      }
    };

    fetchDonation();
  }, [donationId]);

  // Add this helper function to parse address string
  const parseAddress = (address) => {
    try {
      // console.log("Raw address:", address);
      // Split by commas and trim whitespace
      const parts = address.split(",").map((part) => part.trim());
      // console.log("Address parts:", parts);

      // Get the last 3 known positions
      const length = parts.length;
      const pincode = parts[length - 1] || "";
      const state = parts[length - 2] || "";
      const district = parts[length - 3] || "";
      const postOffice = parts[length - 4] || "";

      // Combine remaining parts for street/house
      const remainingParts = parts.slice(0, length - 4);
      const houseNumber = remainingParts[0] || "";
      const streetName = remainingParts.slice(1).join(", ") || "";

      const parsedAddress = {
        houseNumber,
        streetName,
        postOffice,
        district,
        state,
        pincode: pincode.replace(/\D/g, ""), // Remove non-digits from pincode
      };

      console.log("Parsed address:", parsedAddress);
      return parsedAddress;
    } catch (error) {
      console.error("Error parsing address:", error);
      return {
        houseNumber: "",
        streetName: "",
        postOffice: "",
        district: "",
        state: "",
        pincode: "",
      };
    }
  };

  React.useEffect(() => {
    const loadGuestDetails = async () => {
      try {
        const response = await fetchGuestDetails();
        // Log individual guest records
        if (response?.data?.length > 0) {
          // console.log("\nGuest Records:");
          response.data.forEach((guest, index) => {
            console.log(`Guest ${index + 1}:`, {
              id: guest.id,
              name: guest.attributes?.name,
              phone: guest.attributes?.phone_number,
              email: guest.attributes?.email,
              address: guest.attributes?.address,
              deeksha: guest.attributes?.deeksha,
              status: guest.attributes?.status,
            });
          });
        } else {
          console.log("No guest records found");
        }

        // Store the data in state
        setGuestDetails(response);
      } catch (error) {
        console.error("Error loading guest details:", error);
        console.error("Error stack:", error.stack);

        // Log additional error details if available
        if (error.response) {
          console.error("Error response:", {
            status: error.response.status,
            data: error.response.data,
          });
        }
      }
    };

    loadGuestDetails();
  }, []); // Empty dependency array means this runs once on mount

  // Modify this useEffect to use sequential numbers instead of random ones
  React.useEffect(() => {
    // Skip if no selected donor
    if (!selectedDonor) return;

    // Generate receipt number based on highest number + 1
    const prefix = selectedTab === "Mission" ? "MSN" : "MT";
    const currentHighest =
      selectedTab === "Mission" ? highestNumbers.MSN : highestNumbers.MT;
    const nextNumber = currentHighest + 1;
    const generatedNumber = `${prefix} ${nextNumber}`;

    const receiptData = {
      tabId: selectedDonor,
      receiptNumber: generatedNumber,
      date: new Date().toLocaleDateString(),
      createdBy: user?.username || "N/A",
      type: selectedTab,
      status: "pending",
      amount: 0,
      // donorId: selectedDonor,
      donorDetails: donorDetails,
      donationDetails: {
        amount: "",
        transactionType: "cash",
        inMemoryOf: "",
        transactionDetails: {
          ddNumber: "",
          ddDate: "",
          bankName: "",
          branchName: "",
        },
      },
    };
    console.log("receipt data", receiptData);
    console.log("donor", selectedDonor);
    console.log("tab", selectedTab);

    // Batch these updates together
    setReceiptNumber(generatedNumber);
    setCurrentReceipt(receiptData);
    addDonation(selectedDonor, selectedTab, receiptData);
  }, [selectedDonor, selectedTab]); // Dependencies include selectedTab

  // When donor details are updated, update both receipts
  const handleDonorDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(selectedDonor, currentReceipt.receiptNumber, {
        donorDetails: details,
      });
    }

    setDonorDetails(details);

    // Update the donor tag name when the donor details are updated
    if (details.name) {
      setDonorTags((prevTags) =>
        prevTags.map((tag) =>
          tag.id === selectedDonor
            ? { ...tag, name: details.name || "New Donor" }
            : tag
        )
      );
    }

    // Update receipts for this donor in Zustand
    const donorReceipts =
      donations[tabId]?.receipts.find(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorId === selectedDonor ||
            group[0].donorDetails?.guestId === selectedDonor)
      ) || [];

    donorReceipts.forEach((receipt) => {
      if (receipt.receiptNumber !== currentReceipt?.receiptNumber) {
        updateDonationDetails(selectedDonor, receipt.receiptNumber, {
          donorDetails: details,
        });
      }
    });
  };

  // Modify handleAddDonation to use sequential numbers
  const handleAddDonation = () => {
    // Limit the maximum number of tabs to 5
    if (donorTags.length >= 5) {
      alert("Maximum number of tabs reached.");
      return;
    }

    // If donation data exists, navigate to the new donation page
    if (donationData) {
      navigate("/newDonation");
      return;
    }

    // Generate next receipt number based on current highest number
    const prefix = selectedTab === "Mission" ? "MSN" : "MT";
    const currentHighest =
      selectedTab === "Mission" ? highestNumbers.MSN : highestNumbers.MT;
    const nextNumber = currentHighest + 1;
    const newReceiptNumber = `${prefix} ${nextNumber}`;

    setReceiptNumber(newReceiptNumber);

    // Generate next unique ID for the donor
    const newUniqueId = `C${nextNumber}`;
    setUniqueDonorId(newUniqueId);

    setCurrentReceipt({
      receiptNumber: newReceiptNumber,
      donationDetails: {
        donationType: "Others (Revenue)",
        amount: "",
        transactionType: "cash",
        inMemoryOf: "",
        transactionDetails: {
          ddNumber: "",
          ddDate: "",
          bankName: "",
          branchName: "",
        },
      },
    });

    // Generate tabId dynamically
    const newTabId = `tab${donorTags.length + 1}`; // e.g., tab1, tab2, etc.

    // Create a new donor object
    const newDonor = {
      id: newTabId, // Use tabId as the unique identifier for tabs
      name: "New Donor",
      isNewDonor: true,
    };

    // Add the new donor and tabId
    setDonorTags((prev) => [...prev, newDonor]);
    setSelectedDonor(newDonor.id);

    // Reset form for the new donor
    setDonorDetails({
      title: "Sri",
      name: "",
      phoneCode: "+91",
      phone: "",
      email: "",
      mantraDiksha: "",
      identityType: "Aadhaar",
      identityNumber: "",
      roomNumber: "",
      pincode: "",
      houseNumber: "",
      streetName: "",
      district: "",
      state: "",
      postOffice: "",
    });
  };

  const handleRemoveTag = (idToRemove) => {
    setDonorTags(donorTags.filter((tag) => tag.id !== idToRemove));
    setSelectedDonor(null);
    // Clear the form when removing the tag
    setDonorDetails({
      title: "Sri",
      name: "",
      phoneCode: "+91",
      phone: "",
      email: "",
      mantraDiksha: "",
      identityType: "Aadhaar",
      identityNumber: "",
      roomNumber: "",
      pincode: "",
      houseNumber: "",
      streetName: "",
      district: "",
      state: "",
      postOffice: "",
    });
  };

  const handleTagClick = (id) => {
    setSelectedDonor(id);
    setSelectedTab(donorTabs[id] || "Math");

    // Find the donor's receipts
    const donorReceipts =
      donations[tabId]?.receipts.find(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorId === id || group[0].donorDetails?.guestId === id)
      ) || [];

    // Get the first receipt to access donor details
    const firstReceipt = donorReceipts[0];

    if (firstReceipt?.donorDetails) {
      setDonorDetails(firstReceipt.donorDetails);
    } else {
      // For new donors, keep the current name but reset other fields
      const currentTag = donorTags.find((tag) => tag.id === id);
      setDonorDetails({
        title: "Sri",
        name: currentTag?.name || "", // Keep the current name
        phoneCode: "+91",
        phone: "",
        email: "",
        mantraDiksha: "",
        identityType: "Aadhaar",
        identityNumber: "",
        roomNumber: "",
        pincode: "",
        houseNumber: "",
        streetName: "",
        district: "",
        state: "",
        postOffice: "",
      });
    }
  };

  // Filter guests based on search term
  const filteredGuests =
    guestDetails?.data?.filter((guest) => {
      const searchLower = searchTerm.toLowerCase();
      const name = guest.attributes.name?.toLowerCase() || "";
      const phone = guest.attributes.phone_number || "";
      return name.includes(searchLower) || phone.includes(searchTerm);
    }) || [];

  // Handle guest selection
  const handleGuestSelect = (guest) => {
    console.log("Selected Guest Data:", {
      guestId: guest.id,
      attributes: guest.attributes,
      fullData: guest,
    });

    // Check if guest has donations with receipt details
    const guestDonations = guest.attributes.donations?.data || [];
    let existingUniqueNo = null;

    // Look for a receipt with unique_no
    for (const donation of guestDonations) {
      const receiptDetail = donation.attributes.receipt_detail?.data;
      if (receiptDetail && receiptDetail.attributes.unique_no) {
        existingUniqueNo = receiptDetail.attributes.unique_no;
        break;
      }
    }

    const guestData = guest.attributes;

    // Extract address components
    const addressParts = guestData.address?.split(", ") || [];
    const houseNumber = addressParts[0] || "";
    const streetAddress = addressParts.slice(1, -4).join(", ") || "";
    const postOffice = addressParts[addressParts.length - 4] || "";
    const district = addressParts[addressParts.length - 3] || "";
    const state = addressParts[addressParts.length - 2] || "";
    const pincode =
      addressParts[addressParts.length - 1]?.match(/\d{6}/)?.[0] || "";

    // Remove the title from the name if it exists at the beginning
    const titleRegex =
      /^(Sri|Smt\.|Mr\.|Mrs\.|Swami|Dr\.|Prof\.|Kumari|Ms\.)\s*/i;
    const nameWithoutTitle = guestData.name.replace(titleRegex, "").trim();

    const donorDetailsData = {
      title: guestData.title || "Sri",
      name: nameWithoutTitle,
      phoneCode: "+91",
      phone: guestData.phone_number?.replace("+91", "") || "",
      email: guestData.email,
      mantraDiksha: guestData.deeksha || "",
      identityType: "Aadhaar",
      identityNumber: guestData.aadhaar_number || "",
      roomNumber: "",
      pincode: pincode,
      houseNumber: houseNumber,
      streetName: streetAddress,
      postOffice: postOffice,
      district: district,
      state: state,
      guestId: guest.id,
    };

    handleDonorDetailsUpdate(donorDetailsData);

    // Update unique donor ID if found in receipt details
    if (existingUniqueNo) {
      setUniqueDonorId(existingUniqueNo);
    } else {
      // Generate new unique ID based on current highest number
      const nextNumber =
        selectedTab === "Math" ? highestNumbers.MT + 1 : highestNumbers.MSN + 1;
      setUniqueDonorId(`C${nextNumber}`);
    }

    setSearchTerm("");
    setShowDropdown(false);
  };

  // Modify the handleTabClick function
  const handleTabClick = (tab) => {
    // Only allow changing tabs if there's no donation data or if it's not completed
    if (donationData && donationData.status === "completed") {
      return;
    }

    setSelectedTab(tab);

    // Update receipt number based on new tab
    const prefix = tab === "Mission" ? "MSN" : "MT";
    const currentHighest =
      tab === "Mission" ? highestNumbers.MSN : highestNumbers.MT;
    const nextNumber = currentHighest + 1;
    const newReceiptNumber = `${prefix} ${nextNumber}`;

    setReceiptNumber(newReceiptNumber);

    // Update unique donor ID
    setUniqueDonorId(`C${nextNumber}`);

    // Clear current receipt if it exists
    if (currentReceipt) {
      setCurrentReceipt({
        ...currentReceipt,
        receiptNumber: newReceiptNumber,
        donationDetails: {
          ...currentReceipt.donationDetails,
          purpose: "", // Reset purpose when changing tabs
        },
      });
    }
  };

  // Add handler for donation details updates
  const handleDonationDetailsUpdate = (updates) => {
    setCurrentReceipt((prev) => {
      const updatedDonationDetails = {
        ...prev?.donationDetails,
        ...updates,
      };

      // If purpose is being updated and it's not "Other", clear otherPurpose
      if (updates.purpose && updates.purpose !== "Other") {
        updatedDonationDetails.otherPurpose = "";
      }

      const updatedReceipt = {
        ...prev,
        donationDetails: updatedDonationDetails,
      };

      // If there's a receipt number, update the donation details
      if (prev?.receiptNumber) {
        updateDonationDetails(prev.receiptNumber, updatedDonationDetails);
      }

      return updatedReceipt;
    });

    // Clear validation errors when updating purpose
    if (updates.purpose) {
      setValidationErrors((prev) => ({
        ...prev,
        purpose: "",
        otherPurpose: "",
      }));
    }
  };

  const resetFormData = () => {
    setDonorDetails({
      title: "Sri",
      name: "",
      phoneCode: "+91",
      phone: "",
      email: "",
      mantraDiksha: "",
      identityType: "Aadhaar",
      identityNumber: "",
      roomNumber: "",
      pincode: "",
      houseNumber: "",
      streetName: "",
      district: "",
      state: "",
      postOffice: "",
    });
    // Reset receipt and current receipt with "Others (Revenue)" as default
    setReceiptNumber("");
    setCurrentReceipt({
      receiptNumber: "",
      donationDetails: {
        donationType: "Others (Revenue)", // Set default donation type here
        amount: "",
        transactionType: "cash",
        inMemoryOf: "",
        transactionDetails: {
          ddDate: "",
          ddNumber: "",
          bankName: "",
          branchName: "",
        },
      },
    });

    // Reset donor tags and selected donor
    setDonorTags([
      {
        id: "tab1",
        name: "New Donor",
        isNewDonor: true,
      },
    ]);
    setSelectedDonor("tab1");

    // Reset validation errors
    setValidationErrors({
      name: "",
      phone: "",
      email: "",
      identityNumber: "",
    });
  };

  // Add this validation function
  const validateDonationAmount = (amount) => {
    if (!amount) return "Amount is required";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0)
      return "Amount must be greater than 0";
    return "";
  };

  // Modify handlePrintReceipt function
  const handlePrintReceipt = async () => {
    // Clear all previous validation errors immediately
    setValidationErrors({});

    let hasErrors = false;
    let errorMessage = "Please enter";
    let errorFields = [];

    // Check all required fields and build error message
    if (!donorDetails.name.trim()) {
      errorFields.push("donor name");
      hasErrors = true;
    }

    if (!donorDetails.phone || donorDetails.phone.length !== 10) {
      errorFields.push("phone number");
      hasErrors = true;
    }

    if (!donorDetails.mantraDiksha) {
      errorFields.push("mantra diksha");
      hasErrors = true;
    }

    if (!donorDetails.identityNumber) {
      errorFields.push("identity proof");
      hasErrors = true;
    }

    if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
      errorFields.push("pincode");
      hasErrors = true;
    }

    // Check donation details
    if (!currentReceipt?.donationDetails?.purpose) {
      errorFields.push("purpose");
      hasErrors = true;
    }

    if (
      !currentReceipt?.donationDetails?.amount ||
      parseFloat(currentReceipt?.donationDetails?.amount) <= 0
    ) {
      errorFields.push("donation amount");
      hasErrors = true;
    }

    // Check transaction details if not cash
    const transactionType =
      currentReceipt?.donationDetails?.transactionType?.toLowerCase();
    if (
      ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
        transactionType
      )
    ) {
      const details = currentReceipt?.donationDetails?.transactionDetails;

      if (!details?.ddDate) {
        errorFields.push("date");
        hasErrors = true;
      }
      if (!details?.ddNumber) {
        errorFields.push("number");
        hasErrors = true;
      }
      if (!details?.bankName) {
        errorFields.push("bank name");
        hasErrors = true;
      }
      if (!details?.branchName) {
        errorFields.push("branch name");
        hasErrors = true;
      }
    }

    if (hasErrors) {
      // Format error message with proper grammar
      errorMessage +=
        " " + errorFields.join(errorFields.length > 1 ? ", " : "");
      if (errorFields.length > 1) {
        const lastIndex = errorMessage.lastIndexOf(",");
        errorMessage =
          errorMessage.slice(0, lastIndex) +
          " and" +
          errorMessage.slice(lastIndex + 1);
      }

      // Show alert and wait for it to be dismissed
      await new Promise((resolve) => {
        setTimeout(() => {
          alert(errorMessage);
          resolve();
        }, 0);
      });

      // After alert is dismissed, set validation errors
      setTimeout(() => {
        const newErrors = {};
        if (!donorDetails.name.trim()) {
          newErrors.name = "Donor name is required";
        }
        if (!donorDetails.phone || donorDetails.phone.length !== 10) {
          newErrors.phone = "Phone number must be 10 digits";
        }
        if (!donorDetails.mantraDiksha) {
          newErrors.mantraDiksha = "Mantra Diksha is required";
        }
        if (!donorDetails.identityNumber) {
          newErrors.identityNumber = "Identity proof is required";
        }
        if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
          newErrors.pincode = "Valid 6-digit pincode is required";
        }
        if (!currentReceipt?.donationDetails?.purpose) {
          newErrors.purpose = "Purpose is required";
        }
        if (
          !currentReceipt?.donationDetails?.amount ||
          parseFloat(currentReceipt?.donationDetails?.amount) <= 0
        ) {
          newErrors.amount = "Valid donation amount is required";
        }

        // Set transaction-related errors if applicable
        if (
          ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
            transactionType
          )
        ) {
          const details = currentReceipt?.donationDetails?.transactionDetails;
          if (!details?.ddDate) newErrors.ddDate = "Date is required";
          if (!details?.ddNumber) newErrors.ddNumber = "Number is required";
          if (!details?.bankName) newErrors.bankName = "Bank name is required";
          if (!details?.branchName)
            newErrors.branchName = "Branch name is required";
        }

        setValidationErrors(newErrors);

        // Scroll to first empty field (maintaining existing scroll order and adding new fields)
        if (!donorDetails.name.trim()) {
          donorNameInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.phone || donorDetails.phone.length !== 10) {
          phoneInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.mantraDiksha) {
          deekshaDropdownRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.identityNumber) {
          identityInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
          document
            .querySelector('input[name="pincode"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (!currentReceipt?.donationDetails?.purpose) {
          document
            .querySelector('[name="purpose"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (
          !currentReceipt?.donationDetails?.amount ||
          parseFloat(currentReceipt?.donationDetails?.amount) <= 0
        ) {
          document
            .querySelector('[name="amount"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (
          ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
            transactionType
          )
        ) {
          // Scroll to first empty transaction field
          if (!details?.ddDate) {
            document
              .querySelector('[name="ddDate"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.ddNumber) {
            document
              .querySelector('[name="ddNumber"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.bankName) {
            document
              .querySelector('[name="bankName"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.branchName) {
            document
              .querySelector('[name="branchName"]')
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);

      return;
    }

    setIsModalOpen(true);
  };

  // Add this function to validate fields
  const validateFields = () => {
    const errors = {};

    // Basic validation for required fields
    if (!donorDetails.name) errors.name = "Name is required";
    if (!donorDetails.phone) errors.phone = "Phone number is required";
    if (!currentReceipt?.donationDetails?.amount)
      errors.amount = "Amount is required";
    if (!currentReceipt?.donationDetails?.purpose)
      errors.purpose = "Purpose is required";

    // Update validation errors
    setValidationErrors(errors);

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  // Modify handleConfirmPrint function
  const handleConfirmPrint = async () => {
    try {
      // ... rest of your existing code ...

      // Create new guest if needed
      let guestId = donorDetails.guestId;
      if (!guestId) {
        console.log("Creating new guest");
        const guestPayload = {
          name: `${donorDetails.title} ${donorDetails.name}`,
          phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
          email:
            donorDetails.email ||
            `${donorDetails.name.replace(/\s+/g, "").toLowerCase()}@gmail.com`, // Generate default email
          deeksha: donorDetails.mantraDiksha,
          aadhaar_number: donorDetails.identityNumber,
          address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.postOffice}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
          status: "none",
        };
        const guestResponse = await createNewGuestDetails(guestPayload);
        guestId = guestResponse.data.id;
        console.log("Created new guest with ID:", guestId);
      }

      // ... rest of your existing code ...

      // Create receipt details with counter number
      console.log("Creating new receipt");
      const receiptPayload = {
        Receipt_number: receiptNumber,
        status: "completed",
        amount: currentReceipt?.donationDetails?.amount,
        unique_no: uniqueDonorId,
        counter: user?.counter || "N/A", // Add counter number from user data
      };
      const receiptResponse = await createNewReceiptDetail(receiptPayload);
      console.log("Created new receipt:", receiptResponse);

      // Create donation with counter number
      console.log("Creating new donation record");
      const donationPayload = {
        data: {
          InMemoryOf:
            currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
          donationAmount: currentReceipt?.donationDetails?.amount,
          transactionType:
            currentReceipt?.donationDetails?.transactionType
              ?.charAt(0)
              .toUpperCase() +
              currentReceipt?.donationDetails?.transactionType?.slice(1) ||
            "Cash",
          donationFor: selectedTab,
          status: "completed",
          donationDate: getCurrentFormattedDate(),
          guest: guestId,
          receipt_detail: receiptResponse.data.id,
          purpose: currentReceipt?.donationDetails?.purpose || "General",
          type:
            currentReceipt?.donationDetails?.donationType || "Others (Revenue)",
          counter: user?.counter || "N/A", // Add counter number from user data
          ...(currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
            "cash" && {
            ddch_number:
              currentReceipt?.donationDetails?.transactionDetails?.ddNumber ||
              "",
            ddch_date:
              currentReceipt?.donationDetails?.transactionDetails?.ddDate || "",
            bankName:
              currentReceipt?.donationDetails?.transactionDetails?.bankName ||
              "",
            branchName:
              currentReceipt?.donationDetails?.transactionDetails?.branchName ||
              "",
          }),
          unique_no: uniqueDonorId,
        },
      };

      await createNewDonation(donationPayload);
      console.log("Successfully created new donation");

      // Create a hidden iframe for printing
      const printFrame = document.createElement("iframe");
      printFrame.style.display = "none";
      document.body.appendChild(printFrame);

      // Format the date in DD-MM-YYYY format
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Use the ReceiptTemplate component
      const receiptContent = ReceiptTemplate({
        uniqueDonorId,
        receiptNumber,
        formattedDate,
        donorDetails,
        currentReceipt,
        numberToWords,
        user,
      });

      // Write content to iframe and print
      const iframeWindow = printFrame.contentWindow;
      iframeWindow.document.open();
      iframeWindow.document.write(receiptContent);
      iframeWindow.document.close();

      // Set up print settings
      const printSettings = {
        silent: true,
        printBackground: true,
        deviceWidth: "210mm",
        deviceHeight: "297mm",
      };

      // Modify the onload handler to include modal closing and form reset
      iframeWindow.onload = () => {
        iframeWindow.focus();
        iframeWindow.print(printSettings);

        // Clean up and close modal
        setTimeout(() => {
          document.body.removeChild(printFrame);
          setIsModalOpen(false); // Close the modal
          resetFormData();
          window.location.reload(); // Add this line to reload the page
        }, 1000);
      };
    } catch (error) {
      console.error("Error processing donation:", error);
      alert("Error processing donation. Please try again.");
      setIsModalOpen(false); // Close modal even if there's an error
    }
  };

  // Modify the handlePending function
  const handlePending = async () => {
    // Clear all previous validation errors immediately
    setValidationErrors({});

    let hasErrors = false;
    let errorMessage = "Please enter";
    let errorFields = [];

    // Check all required fields and build error message
    if (!donorDetails.name.trim()) {
      errorFields.push("donor name");
      hasErrors = true;
    }

    if (!donorDetails.phone || donorDetails.phone.length !== 10) {
      errorFields.push("phone number");
      hasErrors = true;
    }

    if (!donorDetails.mantraDiksha) {
      errorFields.push("mantra diksha");
      hasErrors = true;
    }

    if (!donorDetails.identityNumber) {
      errorFields.push("identity proof");
      hasErrors = true;
    }

    if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
      errorFields.push("pincode");
      hasErrors = true;
    }

    // Check donation details
    if (!currentReceipt?.donationDetails?.purpose) {
      errorFields.push("purpose");
      hasErrors = true;
    }

    if (
      !currentReceipt?.donationDetails?.amount ||
      parseFloat(currentReceipt?.donationDetails?.amount) <= 0
    ) {
      errorFields.push("donation amount");
      hasErrors = true;
    }

    // Check transaction details if not cash
    const transactionType =
      currentReceipt?.donationDetails?.transactionType?.toLowerCase();
    if (
      ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
        transactionType
      )
    ) {
      const details = currentReceipt?.donationDetails?.transactionDetails;

      if (!details?.ddDate) {
        errorFields.push("date");
        hasErrors = true;
      }
      if (!details?.ddNumber) {
        errorFields.push("number");
        hasErrors = true;
      }
      if (!details?.bankName) {
        errorFields.push("bank name");
        hasErrors = true;
      }
      if (!details?.branchName) {
        errorFields.push("branch name");
        hasErrors = true;
      }
    }

    if (hasErrors) {
      // Format error message with proper grammar
      errorMessage +=
        " " + errorFields.join(errorFields.length > 1 ? ", " : "");
      if (errorFields.length > 1) {
        const lastIndex = errorMessage.lastIndexOf(",");
        errorMessage =
          errorMessage.slice(0, lastIndex) +
          " and" +
          errorMessage.slice(lastIndex + 1);
      }

      // Show alert and wait for it to be dismissed
      await new Promise((resolve) => {
        setTimeout(() => {
          alert(errorMessage);
          resolve();
        }, 0);
      });

      // After alert is dismissed, set validation errors
      setTimeout(() => {
        const newErrors = {};
        if (!donorDetails.name.trim()) {
          newErrors.name = "Donor name is required";
        }
        if (!donorDetails.phone || donorDetails.phone.length !== 10) {
          newErrors.phone = "Phone number must be 10 digits";
        }
        if (!donorDetails.mantraDiksha) {
          newErrors.mantraDiksha = "Mantra Diksha is required";
        }
        if (!donorDetails.identityNumber) {
          newErrors.identityNumber = "Identity proof is required";
        }
        if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
          newErrors.pincode = "Valid 6-digit pincode is required";
        }
        if (!currentReceipt?.donationDetails?.purpose) {
          newErrors.purpose = "Purpose is required";
        }
        if (
          !currentReceipt?.donationDetails?.amount ||
          parseFloat(currentReceipt?.donationDetails?.amount) <= 0
        ) {
          newErrors.amount = "Valid donation amount is required";
        }

        // Set transaction-related errors if applicable
        if (
          ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
            transactionType
          )
        ) {
          const details = currentReceipt?.donationDetails?.transactionDetails;
          if (!details?.ddDate) newErrors.ddDate = "Date is required";
          if (!details?.ddNumber) newErrors.ddNumber = "Number is required";
          if (!details?.bankName) newErrors.bankName = "Bank name is required";
          if (!details?.branchName)
            newErrors.branchName = "Branch name is required";
        }

        setValidationErrors(newErrors);

        // Scroll to first empty field (maintaining existing scroll order and adding new fields)
        if (!donorDetails.name.trim()) {
          donorNameInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.phone || donorDetails.phone.length !== 10) {
          phoneInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.mantraDiksha) {
          deekshaDropdownRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.identityNumber) {
          identityInputRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!donorDetails.pincode || donorDetails.pincode.length !== 6) {
          document
            .querySelector('input[name="pincode"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (!currentReceipt?.donationDetails?.purpose) {
          document
            .querySelector('[name="purpose"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (
          !currentReceipt?.donationDetails?.amount ||
          parseFloat(currentReceipt?.donationDetails?.amount) <= 0
        ) {
          document
            .querySelector('[name="amount"]')
            ?.scrollIntoView({ behavior: "smooth" });
        } else if (
          ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
            transactionType
          )
        ) {
          // Scroll to first empty transaction field
          if (!details?.ddDate) {
            document
              .querySelector('[name="ddDate"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.ddNumber) {
            document
              .querySelector('[name="ddNumber"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.bankName) {
            document
              .querySelector('[name="bankName"]')
              ?.scrollIntoView({ behavior: "smooth" });
          } else if (!details?.branchName) {
            document
              .querySelector('[name="branchName"]')
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);

      return;
    }

    setShowPendingConfirm(true);
  };

  const confirmPending = async () => {
    try {
      if (donationId) {
        // Update existing donation
        console.log("Updating existing donation with ID:", donationId);
        const updatePayload = {
          data: {
            InMemoryOf:
              currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount,
            transactionType:
              currentReceipt?.donationDetails?.transactionType
                ?.charAt(0)
                .toUpperCase() +
                currentReceipt?.donationDetails?.transactionType?.slice(1) ||
              "Cash",
            donationFor: selectedTab,
            status: "pending",
            donationDate: getCurrentFormattedDate(),
            purpose: currentReceipt?.donationDetails?.purpose || "General",
            type:
              currentReceipt?.donationDetails?.donationType ||
              "Others (Revenue)",
            ...(currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
              "cash" && {
              ddch_number:
                currentReceipt?.donationDetails?.transactionDetails?.ddNumber ||
                "",
              ddch_date:
                currentReceipt?.donationDetails?.transactionDetails?.ddDate ||
                "",
              bankName:
                currentReceipt?.donationDetails?.transactionDetails?.bankName ||
                "",
              branchName:
                currentReceipt?.donationDetails?.transactionDetails
                  ?.branchName || "",
            }),
            counter: user?.counter || "N/A", // Add counter number
          },
        };

        await updateDonationById(donationId, updatePayload);
        console.log("Successfully updated donation to pending status");
      } else {
        console.log("Creating new pending donation");
        // Create new guest if needed
        let guestId = donorDetails.guestId;
        if (!guestId) {
          console.log("Creating new guest");
          // Create guest payload without extra nesting
          const guestPayload = {
            name: `${donorDetails.title} ${donorDetails.name}`,
            phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
            email: donorDetails.email,
            deeksha: donorDetails.mantraDiksha,
            aadhaar_number: donorDetails.identityNumber,
            address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.postOffice}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
          };
          const guestResponse = await createNewGuestDetails(guestPayload);
          guestId = guestResponse.data.id;
          console.log("Created new guest with ID:", guestId);
        }

        // Create receipt details with counter
        console.log("Creating new receipt with pending status");
        const receiptPayload = {
          Receipt_number: receiptNumber,
          status: "pending",
          amount: currentReceipt?.donationDetails?.amount,
          counter: user?.counter || "N/A", // Add counter number
        };
        const receiptResponse = await createNewReceiptDetail(receiptPayload);
        console.log("Created new receipt:", receiptResponse);

        // Create donation with counter
        console.log("Creating new donation record with pending status");
        const donationPayload = {
          data: {
            InMemoryOf:
              currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount,
            transactionType:
              currentReceipt?.donationDetails?.transactionType
                ?.charAt(0)
                .toUpperCase() +
                currentReceipt?.donationDetails?.transactionType?.slice(1) ||
              "Cash",
            donationFor: selectedTab,
            status: "pending",
            donationDate: getCurrentFormattedDate(),
            guest: guestId,
            receipt_detail: receiptResponse.data.id,
            ...(currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
              "cash" && {
              ddch_number:
                currentReceipt?.donationDetails?.transactionDetails?.ddNumber ||
                "",
              ddch_date:
                currentReceipt?.donationDetails?.transactionDetails?.ddDate ||
                "",
              bankName:
                currentReceipt?.donationDetails?.transactionDetails?.bankName ||
                "",
              branchName:
                currentReceipt?.donationDetails?.transactionDetails
                  ?.branchName || "",
            }),
            counter: user?.counter || "N/A", // Add counter number
          },
        };

        await createNewDonation(donationPayload);
        console.log("Successfully created new pending donation");
      }

      // Reset form and close modal
      resetFormData();
      setShowPendingConfirm(false);
      navigate("/donation");
    } catch (error) {
      console.error("Error processing pending donation:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Error processing pending donation. Please try again.");
    }
  };

  // Modify the handleCancel function
  const handleCancel = async () => {
    // Check donation amount first
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the amount");
      return;
    }

    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      if (donationId) {
        // Update existing donation
        console.log("Updating existing donation with ID:", donationId);
        const updatePayload = {
          data: {
            InMemoryOf:
              currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount,
            transactionType:
              currentReceipt?.donationDetails?.transactionType
                ?.charAt(0)
                .toUpperCase() +
                currentReceipt?.donationDetails?.transactionType?.slice(1) ||
              "Cash",
            donationFor: selectedTab,
            status: "cancelled",
            donationDate: getCurrentFormattedDate(),
            ...(currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
              "cash" && {
              ddch_number:
                currentReceipt?.donationDetails?.transactionDetails?.ddNumber ||
                "",
              ddch_date:
                currentReceipt?.donationDetails?.transactionDetails?.ddDate ||
                "",
              bankName:
                currentReceipt?.donationDetails?.transactionDetails?.bankName ||
                "",
              branchName:
                currentReceipt?.donationDetails?.transactionDetails
                  ?.branchName || "",
            }),
            counter: user?.counter || "N/A", // Add counter number
          },
        };

        await updateDonationById(donationId, updatePayload);
        console.log("Successfully updated donation to cancelled status");
      } else {
        console.log("Creating new cancelled donation");
        // Create new guest if needed
        let guestId = donorDetails.guestId;
        if (!guestId) {
          console.log("Creating new guest");
          // Create guest payload without extra nesting
          const guestPayload = {
            data: {
              name: `${donorDetails.title} ${donorDetails.name}`,
              phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
              email: donorDetails.email,
              deeksha: donorDetails.mantraDiksha,
              aadhaar_number: donorDetails.identityNumber,
              address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.postOffice}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
            },
          };
          // Send the payload directly without wrapping in data object
          const guestResponse = await createNewGuestDetails(guestPayload);
          guestId = guestResponse.data.id;
          console.log("Created new guest with ID:", guestId);
        }

        // Create receipt details with counter
        console.log("Creating new receipt with cancelled status");
        const receiptPayload = {
          Receipt_number: receiptNumber,
          status: "cancelled",
          amount: currentReceipt?.donationDetails?.amount,
          counter: user?.counter || "N/A", // Add counter number
        };
        const receiptResponse = await createNewReceiptDetail(receiptPayload);
        console.log("Created new receipt:", receiptResponse);

        // Create donation with counter
        console.log("Creating new donation record with cancelled status");
        const donationPayload = {
          data: {
            InMemoryOf:
              currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount,
            transactionType:
              currentReceipt?.donationDetails?.transactionType
                ?.charAt(0)
                .toUpperCase() +
                currentReceipt?.donationDetails?.transactionType?.slice(1) ||
              "Cash",
            donationFor: selectedTab,
            status: "cancelled",
            donationDate: getCurrentFormattedDate(),
            guest: guestId,
            receipt_detail: receiptResponse.data.id,
            ...(currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
              "cash" && {
              ddch_number:
                currentReceipt?.donationDetails?.transactionDetails?.ddNumber ||
                "",
              ddch_date:
                currentReceipt?.donationDetails?.transactionDetails?.ddDate ||
                "",
              bankName:
                currentReceipt?.donationDetails?.transactionDetails?.bankName ||
                "",
              branchName:
                currentReceipt?.donationDetails?.transactionDetails
                  ?.branchName || "",
            }),
            counter: user?.counter || "N/A", // Add counter number
          },
        };

        await createNewDonation(donationPayload);
        console.log("Successfully created new cancelled donation");
      }

      // Reset form and close modal
      resetFormData();
      setShowCancelConfirm(false);
      navigate("/donation#recent-donations");
    } catch (error) {
      console.error("Error processing cancelled donation:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Error processing cancelled donation. Please try again.");
    }
  };

  // Add this function to calculate total donations
  const calculateTotalDonations = () => {
    // If viewing a completed donation, use that amount
    if (donationData && donationData.amount) {
      return parseFloat(donationData.amount);
    }

    // Otherwise use the current receipt amount
    return parseFloat(currentReceipt?.donationDetails?.amount || 0);
  };

  const handleReset = () => {
    // Reset donor details
    setDonorDetails({
      title: "Sri",
      name: "",
      phoneCode: "+91",
      phone: "",
      email: "",
      mantraDiksha: "",
      identityType: "Aadhaar",
      identityNumber: "",
      roomNumber: "",
      pincode: "",
      houseNumber: "",
      streetName: "",
      district: "",
      state: "",
      postOffice: "",
      guestId: null,
      panNumber: "",
    });

    // Reset current receipt
    setCurrentReceipt({
      receiptNumber: null,
      donationDetails: {
        purpose: "",
        donationType: "Others (Revenue)",
        amount: "",
        transactionType: "Cash",
        inMemoryOf: "",
        otherPurpose: "",
        transactionDetails: {
          ddDate: "",
          ddNumber: "",
          bankName: "",
          branchName: "",
        },
      },
    });

    // Reset validation errors
    setValidationErrors({});
    setTransactionValidationErrors({
      ddDate: "",
      ddNumber: "",
      bankName: "",
      branchName: "",
    });

    // Reset other states
    setShowPANField(false);
    setSearchTerm("");
    setShowDropdown(false);
    setIsDeekshaDropdownOpen(false);
    setDeekshaSearchQuery("");
    setShowCustomDeeksha(false);
    setCustomDeeksha("");
  };

  // Add this useEffect to reset fields on navigation
  useEffect(() => {
    handleReset();
  }, [location]);

  // Add this useEffect to fetch donation history when donor changes
  React.useEffect(() => {
    const fetchDonorHistory = async () => {
      if (!donorDetails.guestId) return;

      try {
        const response = await fetchDonationsByField(
          "guest",
          donorDetails.guestId
        );
        setDonationHistory(response.data || []);
      } catch (error) {
        console.error("Error fetching donation history:", error);
      }
    };

    fetchDonorHistory();
  }, [donorDetails.guestId]);

  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return "Name should only contain letters and spaces";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return "Phone number must be 10 digits";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return ""; // Remove required validation
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Add these validation functions near your other validation functions
  const validateAadhaar = (number) => {
    if (!number) return "Aadhaar number is required";
    if (!/^\d{12}$/.test(number)) {
      return "Aadhaar number must be exactly 12 digits";
    }
    return "";
  };

  const validatePAN = (number) => {
    if (!number) return "PAN number is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
      return "PAN must be in format: ABCDE1234F";
    }
    return "";
  };

  const validatePassport = (number) => {
    if (!number) return "Passport number is required";
    if (!/^[A-Z]{1}[0-9]{7}$/.test(number)) {
      return "Passport must be in format: A1234567";
    }
    return "";
  };

  // Add these validation functions near your other validation functions
  const validateVoterId = (number) => {
    if (!number) return "Voter ID is required";
    if (!/^[A-Z]{3}[0-9]{7}$/.test(number)) {
      return "Voter ID must be in format: ABC1234567";
    }
    return "";
  };

  const validateDrivingLicense = (number) => {
    if (!number) return "Driving License is required";
    if (!/^[A-Z]{2}[0-9]{13}$/.test(number)) {
      return "Driving License must be in format: DL0120160000000";
    }
    return "";
  };

  // Add this function to check if form is valid
  const isFormValid = () => {
    // Check required fields
    if (!donorDetails.name || !donorDetails.phone) {
      return false;
    }

    // Check validation errors
    if (
      validationErrors.name ||
      validationErrors.phone ||
      validationErrors.email ||
      validationErrors.purpose ||
      validationErrors.amount
    ) {
      return false;
    }

    // Check if donation amount exists and is valid
    const amount = parseFloat(currentReceipt?.donationDetails?.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return false;
    }

    // Check if purpose is selected
    if (!currentReceipt?.donationDetails?.purpose) {
      return false;
    }

    // If purpose is "Other", check if otherPurpose is specified
    if (
      currentReceipt?.donationDetails?.purpose === "Other" &&
      !currentReceipt?.donationDetails?.otherPurpose
    ) {
      return false;
    }

    return true;
  };

  // Add this function to fetch pincode details
  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingPincode(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setDonorDetails((prev) => ({
          ...prev,
          district: postOffice.District,
          state: postOffice.State,
          postOffice: postOffice.Name, // Optional: Also update post office
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    } finally {
      setIsLoadingPincode(false);
    }
  };

  // Add this useEffect after other useEffects
  useEffect(() => {
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

  // Add this useEffect to handle clicks outside the dropdown
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

  // Modify the condition to show transaction details
  const showTransactionDetails =
    currentReceipt?.donationDetails?.transactionType &&
    currentReceipt.donationDetails.transactionType.toLowerCase() !== "cash";

  // Add this function near the top of your component, with other utility functions
  const numberToWords = (num) => {
    const single = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const double = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      if (num < 20) return double[num - 10];
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + single[num % 10] : "")
      );
    };

    const formatHundreds = (num) => {
      if (num < 100) return formatTens(num);
      return (
        single[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " and " + formatTens(num % 100) : "")
      );
    };

    const formatLakhs = (num) => {
      if (num < 1000) return formatHundreds(num);
      if (num < 100000)
        return (
          formatHundreds(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + formatHundreds(num % 1000) : "")
        );
      return (
        formatHundreds(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + formatLakhs(num % 100000) : "")
      );
    };

    if (num === 0) return "Zero";

    const amount = Math.floor(num);
    const paise = Math.round((num - amount) * 100);

    let result = formatLakhs(amount);
    if (paise) {
      result += " and " + formatTens(paise) + " Paise";
    }

    return result;
  };

  // Add this helper function at the top level
  const getCurrentFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  };

  // Add this to your existing validation states
  const [transactionValidationErrors, setTransactionValidationErrors] =
    useState({
      ddDate: "",
      ddNumber: "",
      bankName: "",
      branchName: "",
    });

  // Add this validation function
  const validateTransactionDetails = () => {
    // First check if purpose exists
    if (!currentReceipt?.donationDetails?.purpose) {
      setValidationErrors((prev) => ({
        ...prev,
        purpose: "Purpose is required",
      }));
      return false;
    }

    const transactionType =
      currentReceipt?.donationDetails?.transactionType?.toLowerCase();
    const details = currentReceipt?.donationDetails?.transactionDetails;

    if (
      ["cheque", "bank transfer", "dd", "m.o", "electronic modes"].includes(
        transactionType
      )
    ) {
      const errors = {
        ddDate: !details?.ddDate ? "Date is required" : "",
        ddNumber: !details?.ddNumber ? "Number is required" : "",
        bankName: !details?.bankName ? "Bank name is required" : "",
        branchName: !details?.branchName ? "Branch name is required" : "",
      };

      setTransactionValidationErrors(errors);
      return !Object.values(errors).some((error) => error);
    }

    return true;
  };

  // Modify the donation amount change handler
  const handleDonationAmountChange = (e) => {
    const value = e.target.value;

    // Allow empty string or valid number with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = parseFloat(value) || 0;
      setShowPANField(numericValue > 9999);

      const updatedDonationDetails = {
        ...currentReceipt?.donationDetails,
        amount: value,
      };

      setCurrentReceipt((prev) => ({
        ...prev,
        donationDetails: updatedDonationDetails,
      }));

      if (currentReceipt?.receiptNumber) {
        updateDonationDetails(
          selectedDonor,
          currentReceipt.receiptNumber,
          updatedDonationDetails
        );
      }

      // Update validation error immediately
      setValidationErrors((prev) => ({
        ...prev,
        amount:
          !value || numericValue <= 0 ? "Amount must be greater than 0" : "",
      }));
    }
  };

  // Add this useEffect after other useEffects
  useEffect(() => {
    // Focus the donor name input when component mounts
    if (donorNameInputRef.current) {
      donorNameInputRef.current.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        // Get receipt numbers
        const response = await fetchReceiptNumbers();
        // console.log('first', response.data)
        const receiptNumbers = response.data?.map(
          (receipt) => receipt.attributes.Receipt_number
        );

        // Separate MT and MSN numbers
        const mtNumbers = receiptNumbers
          .filter((num) => num.startsWith("MT"))
          .map((num) => parseInt(num.replace("MT", "")));
        const msnNumbers = receiptNumbers
          .filter((num) => num.startsWith("MSN"))
          .map((num) => parseInt(num.replace("MSN", "")));

        // Find highest numbers
        const highestMT = Math.max(...mtNumbers);
        const highestMSN = Math.max(...msnNumbers);

        // Set the next receipt number based on selected tab
        const nextNumber =
          selectedTab === "Math" ? highestMT + 1 : highestMSN + 1;
        const prefix = selectedTab === "Math" ? "MT" : "MSN";
        setReceiptNumber(`${prefix} ${nextNumber}`);

        setHighestNumbers({
          MT: highestMT,
          MSN: highestMSN,
        });

        // Set initial unique donor ID based on selected tab without leading zeros
        const nextDonorNumber =
          selectedTab === "Math" ? highestMT + 1 : highestMSN + 1;
        setUniqueDonorId(`C${nextDonorNumber}`);
      } catch (error) {
        console.error("Error fetching unique numbers:", error);
      }
    };

    fetchNumbers();
  }, [selectedTab]); // Add selectedTab as dependency

  // Add this helper function near your other utility functions
  const isDonationCompleted = (donationData) => {
    return donationData?.status?.toLowerCase() === "completed";
  };

  // Add this function to prepare donation data for consent letter
  const prepareConsentLetterData = () => {
    return {
      uniqueDonorId,
      donationDate: getCurrentFormattedDate(),
      amount: currentReceipt?.donationDetails?.amount,
      transactionType:
        currentReceipt?.donationDetails?.transactionType || "Cash",
      donationType:
        currentReceipt?.donationDetails?.donationType || "Others(Revenue)",
      purpose:
        currentReceipt?.donationDetails?.purpose === "Other"
          ? currentReceipt?.donationDetails?.otherPurpose
          : currentReceipt?.donationDetails?.purpose,
      title: donorDetails.title,
      name: donorDetails.name,
      houseNumber: donorDetails.houseNumber,
      streetName: donorDetails.streetName,
      postOffice: donorDetails.postOffice,
      district: donorDetails.district,
      state: donorDetails.state,
      pincode: donorDetails.pincode,
      panNumber: donorDetails.panNumber || donorDetails.identityNumber,
      phone: `${donorDetails.phoneCode}${donorDetails.phone}`,
      inMemoryOf: currentReceipt?.donationDetails?.inMemoryOf,
      receiptNumber: receiptNumber,
    };
  };

  // Modify the handleConsentLetterClick function
  const handleConsentLetterClick = () => {
    const donationData = prepareConsentLetterData();

    // Create a new iframe for printing
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Generate consent letter content using the template
    const consentLetterContent = ConsentLetterTemplate({
      donationData,
      formatDate,
      numberToWords,
    });

    // Write content to iframe and print
    const iframeWindow = printFrame.contentWindow;
    iframeWindow.document.open();
    iframeWindow.document.write(consentLetterContent);
    iframeWindow.document.close();

    // Clean up iframe after printing
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  };

  // Add this helper function to format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  // Modify the handleThankLetterClick function
  const handleThankLetterClick = () => {
    const donationData = prepareConsentLetterData();

    // Create a new iframe for printing
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Generate thank letter content using the template
    const thankLetterContent = ThankLetterTemplate({
      donationData,
      formatDate,
      numberToWords,
    });

    // Write content to iframe and print
    const iframeWindow = printFrame.contentWindow;
    iframeWindow.document.open();
    iframeWindow.document.write(thankLetterContent);
    iframeWindow.document.close();

    // Clean up iframe after printing
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  };

  // Helper function to check if fields should be disabled
  const shouldDisableFields = () => {
    return donationData && donationData.status === "completed";
  };

  // Pre-fill form with donation data if available
  useEffect(() => {
    if (donationData) {
      // Split the donor name into title and name parts
      const fullName = donationData.donorName || "";
      const nameParts = fullName.split(" ");
      const title = nameParts[0] || "Sri"; // Default to 'Sri' if no title
      const name = nameParts.slice(1).join(" "); // Join the rest as the name

      setDonorDetails((prevDetails) => ({
        ...prevDetails,
        title: title,
        name: name,
        phoneCode: donationData.phoneNumber?.slice(0, 3) || "+91",
        phone: donationData.phoneNumber?.slice(3) || "",
        // ... set other fields as needed
      }));

      setCurrentReceipt((prevReceipt) => ({
        ...prevReceipt,
        receiptNumber: donationData.receiptNumber,
        donationDetails: {
          amount: donationData.amount,
          purpose: donationData.donatedFor,
          // ... set other fields as needed
        },
      }));

      // Log the processed data for debugging
      // console.log("Processed donor details:", {
      //   title: title,
      //   name: name,
      //   fullName: fullName,
      // });
    }
  }, [donationData]);

  // Add this useEffect to handle tab key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (document.activeElement === donorNameInputRef.current) {
          e.preventDefault();
          phoneInputRef.current?.focus();
        } else if (document.activeElement === phoneInputRef.current) {
          e.preventDefault();
          deekshaDropdownRef.current
            ?.querySelector(".dropdown-header")
            ?.focus();
        } else if (document.activeElement === emailInputRef.current) {
          e.preventDefault();
          identityInputRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add this state to track which dropdown is active
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Modify the name input section
  <div className="form-group">
    <label>
      Name of Donor <span className="required">*</span>
    </label>
    <div className="donor-unified-input">
      <select
        value={donorDetails.title}
        onChange={(e) =>
          setDonorDetails({
            ...donorDetails,
            title: e.target.value,
          })
        }
        disabled={shouldDisableFields()}
        className={shouldDisableFields() ? "disabled-input" : ""}
      >
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

      <div className="searchable-dropdown">
        <input
          ref={donorNameInputRef}
          type="text"
          value={donorDetails.name}
          onChange={(e) => {
            if (shouldDisableFields()) return;
            const newValue = e.target.value.replace(/[^A-Za-z\s.]/g, "");
            setDonorDetails((prev) => ({
              ...prev,
              name: newValue,
            }));
            setSearchTerm(newValue);
            setShowDropdown(true);
            // Remove the validation error setting from here
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowDropdown(false);
            }, 200);
            // Remove the validation error setting from here
          }}
          placeholder="Enter donor name"
          className={`${validationErrors.name ? "error" : ""} ${
            shouldDisableFields() ? "disabled-input" : ""
          }`}
          disabled={shouldDisableFields()}
        />
        {validationErrors.name && (
          <div className="error-message">{validationErrors.name}</div>
        )}
      </div>
    </div>
  </div>;

  {
    activeDropdown === "name" && searchTerm && (
      <div className="dropdown-list">
        {/* ... existing name dropdown content ... */}
      </div>
    );
  }

  // Modify the phone input section
  <input
    ref={phoneInputRef}
    type="text"
    value={donorDetails.phone}
    onChange={(e) => {
      if (shouldDisableFields()) return;
      const newPhone = e.target.value.replace(/\D/g, "").slice(0, 10);
      setDonorDetails({ ...donorDetails, phone: newPhone });
      setActiveDropdown("phone"); // Set active dropdown to phone
      // Clear validation error when user types
      setValidationErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }}
    onBlur={() => {
      // Remove validation on blur
      setTimeout(() => {
        setActiveDropdown(null);
      }, 200);
    }}
    disabled={shouldDisableFields()}
    className={`${validationErrors.phone ? "error" : ""} ${
      shouldDisableFields() ? "disabled-input" : ""
    }`}
  />;

  {
    activeDropdown === "phone" && donorDetails.phone && (
      <div className="dropdown-list">
        {/* ... existing phone dropdown content ... */}
      </div>
    );
  }

  // Modify the click outside handler useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".phone-unified-input") &&
        !event.target.closest(".searchable-dropdown")
      ) {
        setActiveDropdown(null); // Clear active dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Find the donations container element
    const element = document.getElementById("donations-container");

    if (element) {
      // Scroll the element into view with a slight delay to ensure rendering
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }, 100);
    }
  }, [location]); // Run when location changes

  // Pincode input section with corrected error message positioning
  <div className="form-group">
    <label>
      Pincode <span className="required">*</span>
    </label>
    <div className="input-wrapper">
      <input
        type="text"
        value={donorDetails.pincode}
        onChange={(e) => {
          if (shouldDisableFields()) return;
          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
          setDonorDetails({ ...donorDetails, pincode: value });
          // Clear validation error when user types
          setValidationErrors((prev) => ({
            ...prev,
            pincode: "",
          }));

          // Call fetchPincodeDetails when pincode length is 6
          if (value.length === 6) {
            fetchPincodeDetails(value);
          }
        }}
        onBlur={() => {
          // Show validation error if field is empty or invalid when focus is lost
          if (!donorDetails.pincode) {
            setValidationErrors((prev) => ({
              ...prev,
              pincode: "Pincode is required",
            }));
          } else if (donorDetails.pincode.length !== 6) {
            setValidationErrors((prev) => ({
              ...prev,
              pincode: "Pincode must be 6 digits",
            }));
          }
        }}
        disabled={shouldDisableFields()}
        className={`${validationErrors.pincode ? "error" : ""} ${
          shouldDisableFields() ? "disabled-input" : ""
        }`}
      />
      {isLoadingPincode && (
        <span className="loading-indicator">Loading...</span>
      )}
    </div>
    {validationErrors.pincode && (
      <div className="error-message">{validationErrors.pincode}</div>
    )}
  </div>;

  // Add this useEffect after your other useEffects
  useEffect(() => {
    const getReceiptNumbers = async () => {
      try {
        const response = await fetchReceiptNumbers();
        const receiptNumbers = response.data?.map(
          (receipt) => receipt.attributes.Receipt_number
        );

        // Separate MT and MSN numbers
        const mtNumbers = receiptNumbers
          .filter((num) => num.startsWith("MT"))
          .map((num) => parseInt(num.replace("MT", "")));
        const msnNumbers = receiptNumbers
          .filter((num) => num.startsWith("MSN"))
          .map((num) => parseInt(num.replace("MSN", "")));

        // Find highest numbers
        const highestMT = Math.max(...mtNumbers);
        const highestMSN = Math.max(...msnNumbers);

        // console.log("Receipt Numbers Analysis:", {
        //   highestMT: `MT ${highestMT}`,
        //   highestMSN: `MSN ${highestMSN}`,
        //   nextMT: `MT ${highestMT + 1}`,
        //   nextMSN: `MSN ${highestMSN + 1}`,
        // });
      } catch (error) {
        console.error("Error fetching receipt numbers:", error);
      }
    };

    getReceiptNumbers();
  }, []);

  return (
    <div
      id="donations-container"
      className="donations-container"
      style={{ scrollMarginTop: "0px" }}
    >
      <div className="header">
        <div
          className="donor-tags"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>New Donation</h1>
          {/* Only show donor tags and Add Donation button if no donation details exist */}
          {!donationData && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {donorTags.map((tag) => (
                <div
                  key={tag.id}
                  className={`tag ${
                    selectedDonor === tag.id ? "selected" : ""
                  }`}
                  onClick={() => handleTagClick(tag.id)}
                >
                  {tag.name}
                  <span
                    className="close"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag.id);
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
          <button className="add-donation-btn" onClick={handleAddDonation}>
            + Add Donation
          </button>
        </div>
        <div>
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="infor-row">
              <label className="info-label">Counter: </label>
              <span className="info-data">{user?.counter}</span>
            </div>
            <div className="info-row">
              <label className="info-label">User: </label>
              <span className="info-data">{user?.username || "User Name"}</span>
            </div>
            <div className="info-row">
              <label className="info-label">Date: </label>
              <span className="info-data">
                {new Date().toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flex: 1,
            }}
          >
            <div className="tabs">
              <button
                className={`tab ${selectedTab === "Math" ? "active" : ""}`}
                onClick={() => handleTabClick("Math")}
                data-tab="Math"
                disabled={
                  donationData?.status === "completed" &&
                  donationData?.donatedFor?.toLowerCase() !== "math"
                }
              >
                Math
              </button>
              <button
                className={`tab ${selectedTab === "Mission" ? "active" : ""}`}
                onClick={() => handleTabClick("Mission")}
                data-tab="Mission"
                disabled={
                  donationData?.status === "completed" &&
                  donationData?.donatedFor?.toLowerCase() !== "mission"
                }
              >
                Mission
              </button>
            </div>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                Receipt Number:{" "}
                <span style={{ color: "#6B7280", fontWeight: "normal" }}>
                  {receiptNumber}
                </span>
              </div>
              <div>
                {shouldDisableFields() && (
                  <div className="view-only-banner">
                    <span>
                      This donation has been completed and cannot be edited
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {!donationData && ( // Only show reset button if there's no donation data
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "transparent",
                  border: "none",
                  color: "#8C52FF",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onClick={handleReset}
              >
                <span style={{ fontSize: "16px" }}>↻</span> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="donor-section">
          <div
            className="details-card donor-details"
            style={{
              backgroundColor:
                selectedTab === "Math"
                  ? "#ffb888"
                  : selectedTab === "Mission"
                  ? "#99fb98"
                  : "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Donor Details</h2>
              <div className="unique-id-display">{uniqueDonorId}</div>
            </div>

            {/* First row with Name and Phone */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>
                  Name of Donor <span className="required">*</span>
                </label>
                <div className="donor-unified-input">
                  <select
                    value={donorDetails.title}
                    onChange={(e) =>
                      setDonorDetails({
                        ...donorDetails,
                        title: e.target.value,
                      })
                    }
                    disabled={shouldDisableFields()}
                    className={shouldDisableFields() ? "disabled-input" : ""}
                  >
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

                  <div className="searchable-dropdown">
                    <input
                      ref={donorNameInputRef}
                      type="text"
                      value={donorDetails.name}
                      onChange={(e) => {
                        if (shouldDisableFields()) return;
                        const newValue = e.target.value.replace(
                          /[^A-Za-z\s.]/g,
                          ""
                        );
                        setDonorDetails((prev) => ({
                          ...prev,
                          name: newValue,
                        }));
                        setSearchTerm(newValue);
                        setShowDropdown(true);
                        // Remove the validation error setting from here
                      }}
                      onBlur={() => {
                        // Delay hiding dropdown to allow for click events
                        setTimeout(() => {
                          setShowDropdown(false);
                        }, 200);

                        if (!donorDetails.name.trim()) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            name: "Donor name is required",
                          }));
                        }
                      }}
                      placeholder="Enter donor name"
                      className={`${validationErrors.name ? "error" : ""} ${
                        shouldDisableFields() ? "disabled-input" : ""
                      }`}
                      disabled={shouldDisableFields()}
                    />

                    {showDropdown && searchTerm && (
                      <div className="dropdown-list">
                        {guestDetails?.data
                          ?.filter((guest) => {
                            const guestName =
                              guest.attributes.name.toLowerCase();
                            return guestName.includes(searchTerm.toLowerCase());
                          })
                          .map((guest) => (
                            <div
                              key={guest.id}
                              className="dropdown-item"
                              onClick={() => {
                                // Log full guest details
                                console.log("Selected Guest Details:", {
                                  id: guest.id,
                                  ...guest.attributes,
                                });

                                // Check for and log unique receipt number
                                const uniqueReceiptNo =
                                  guest.attributes.donations?.data?.[0]
                                    ?.attributes?.receipt_detail?.data
                                    ?.attributes?.unique_no;
                                if (uniqueReceiptNo) {
                                  console.log(
                                    "Unique Receipt Number:",
                                    uniqueReceiptNo
                                  );
                                  // You can also set this in your state if needed
                                  setUniqueDonorId(uniqueReceiptNo);
                                }

                                // Extract title and name
                                const fullName = guest.attributes.name;
                                const nameParts = fullName.split(" ");
                                const title = nameParts[0];
                                const name = nameParts.slice(1).join(" ");

                                // Log the processed name details
                                console.log("Processed donor details:", {
                                  title: title,
                                  name: name,
                                  fullName: fullName,
                                });

                                setDonorDetails({
                                  ...donorDetails,
                                  title: title || "Sri",
                                  name: name,
                                  phone:
                                    guest.attributes.phone_number?.replace(
                                      "+91",
                                      ""
                                    ) || "",
                                  email: guest.attributes.email || "",
                                  mantraDiksha: guest.attributes.deeksha || "",
                                  guestId: guest.id,
                                  // Add Aadhaar details
                                  identityType: guest.attributes.aadhaar_number
                                    ? "Aadhaar"
                                    : "PAN",
                                  identityNumber:
                                    guest.attributes.aadhaar_number || "",
                                  // Parse and set address fields if available
                                  ...(guest.attributes.address &&
                                    parseAddress(guest.attributes.address)),
                                });
                                setShowDropdown(false);
                              }}
                            >
                              <div className="guest-info">
                                <div className="guest-name">
                                  {guest.attributes.name}
                                </div>
                                <div className="guest-phone">
                                  {guest.attributes.phone_number}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {validationErrors.name && (
                  <div className="error-message">{validationErrors.name}</div>
                )}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>
                  Phone No. <span className="required">*</span>
                </label>
                <div className="phone-unified-input">
                  <select
                    value={donorDetails.phoneCode}
                    onChange={(e) =>
                      setDonorDetails({
                        ...donorDetails,
                        phoneCode: e.target.value,
                      })
                    }
                    disabled={shouldDisableFields()}
                    className={shouldDisableFields() ? "disabled-input" : ""}
                  >
                    <option value="+91">+91</option>
                  </select>
                  <div className="searchable-dropdown">
                    <input
                      ref={phoneInputRef}
                      type="text"
                      value={donorDetails.phone}
                      onChange={(e) => {
                        if (shouldDisableFields()) return;
                        const newPhone = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setDonorDetails({ ...donorDetails, phone: newPhone });
                        setActiveDropdown("phone");
                        // Clear validation error when user types
                        setValidationErrors((prev) => ({
                          ...prev,
                          phone: "",
                        }));
                      }}
                      onBlur={() => {
                        // Remove validation on blur
                        setTimeout(() => {
                          setActiveDropdown(null);
                        }, 200);
                      }}
                      disabled={shouldDisableFields()}
                      className={`${validationErrors.phone ? "error" : ""} ${
                        shouldDisableFields() ? "disabled-input" : ""
                      }`}
                    />
                    {validationErrors.phone && (
                      <div className="error-message">
                        {validationErrors.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* New row for Mantra Diksha and Guest House Room No. */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Initiation / Mantra Diksha from</label>
                <div
                  className="custom-dropdown"
                  style={{ position: "relative" }}
                  ref={deekshaDropdownRef}
                >
                  <div
                    className="dropdown-header"
                    onClick={() => {
                      if (shouldDisableFields()) return;
                      setIsDeekshaDropdownOpen(!isDeekshaDropdownOpen);
                      setTimeout(() => {
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                        }
                      }, 100);
                    }}
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!shouldDisableFields()) {
                          setIsDeekshaDropdownOpen(!isDeekshaDropdownOpen);
                        }
                      }
                    }}
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: shouldDisableFields() ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: shouldDisableFields()
                        ? "#f3f4f6"
                        : "#FFF",
                      opacity: shouldDisableFields() ? 0.7 : 1,
                      outline: "none",
                    }}
                  >
                    <span>{donorDetails.mantraDiksha || "Select Deeksha"}</span>
                    {!shouldDisableFields() && (
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
                    )}
                  </div>
                  {isDeekshaDropdownOpen && !shouldDisableFields() && (
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
                              } else {
                                setShowCustomDeeksha(false);
                                setDonorDetails({
                                  ...donorDetails,
                                  mantraDiksha: option,
                                });
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

                {/* Custom deeksha input - this value will be stored in the database */}
                {showCustomDeeksha && (
                  <input
                    type="text"
                    placeholder="Please specify your Mantra Diksha"
                    value={customDeeksha}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomDeeksha(value);
                      // Directly set the custom value as mantraDiksha
                      setDonorDetails({
                        ...donorDetails,
                        mantraDiksha: value, // This is what gets stored in the database
                      });
                    }}
                    style={{ marginTop: "10px" }}
                  />
                )}

                {validationErrors.mantraDiksha && (
                  <span className="error">{validationErrors.mantraDiksha}</span>
                )}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Guest House Room No.</label>
                <input
                  type="text"
                  value={donorDetails.roomNumber}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      roomNumber: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={shouldDisableFields() ? "disabled-input" : ""}
                />
              </div>
            </div>

            {/* Second row with Email, Identity Proof */}
            <div className="form-row">
              <div className="form-group half-width">
                <label>Email</label>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={donorDetails.email}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({ ...donorDetails, email: e.target.value });
                    // Clear validation error when user types
                    setValidationErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  onBlur={() => {
                    // Validate email on blur
                    const error = validateEmail(donorDetails.email);
                    setValidationErrors((prev) => ({ ...prev, email: error }));
                  }}
                  placeholder="Enter email address"
                  className={`${validationErrors.email ? "error" : ""} ${
                    shouldDisableFields() ? "disabled-input" : ""
                  }`}
                  disabled={shouldDisableFields()}
                />
                {validationErrors.email && (
                  <div className="error-message">{validationErrors.email}</div>
                )}
              </div>

              {/* Identity proof field */}
              <div className="form-group half-width">
                <label>
                  Identity Proof <span className="required">*</span>
                </label>
                <div className="identity-input-group">
                  <select
                    value={donorDetails.identityType}
                    onChange={(e) => {
                      if (shouldDisableFields()) return;
                      setDonorDetails({
                        ...donorDetails,
                        identityType: e.target.value,
                        identityNumber: "", // Clear the number when type changes
                      });
                      // Clear validation error when type changes
                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: "",
                      }));
                    }}
                    disabled={shouldDisableFields()}
                    className={shouldDisableFields() ? "disabled-input" : ""}
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                  <input
                    ref={identityInputRef}
                    type="text"
                    value={donorDetails.identityNumber}
                    onChange={(e) => {
                      if (shouldDisableFields()) return;
                      setDonorDetails({
                        ...donorDetails,
                        identityNumber: e.target.value.toUpperCase(),
                      });
                      // Clear validation error when user types
                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: "",
                      }));
                    }}
                    onBlur={() => {
                      // Validate based on selected identity type
                      let error = "";
                      switch (donorDetails.identityType) {
                        case "Aadhaar":
                          error = validateAadhaar(donorDetails.identityNumber);
                          break;
                        case "PAN":
                          error = validatePAN(donorDetails.identityNumber);
                          break;
                        case "Passport":
                          error = validatePassport(donorDetails.identityNumber);
                          break;
                        case "Voter ID":
                          error = validateVoterId(donorDetails.identityNumber);
                          break;
                        case "Driving License":
                          error = validateDrivingLicense(
                            donorDetails.identityNumber
                          );
                          break;
                      }
                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: error,
                      }));
                    }}
                    placeholder={`Enter ${donorDetails.identityType} number`}
                    className={`${
                      validationErrors.identityNumber ? "error" : ""
                    } ${shouldDisableFields() ? "disabled-input" : ""}`}
                    disabled={shouldDisableFields()}
                  />
                </div>
                {validationErrors.identityNumber && (
                  <div className="error-message">
                    {validationErrors.identityNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Third row with Pincode, State, District */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Pincode <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={donorDetails.pincode}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setDonorDetails({ ...donorDetails, pincode: value });
                    // Clear validation error when user types
                    setValidationErrors((prev) => ({
                      ...prev,
                      pincode: "",
                    }));

                    // Call fetchPincodeDetails when pincode length is 6
                    if (value.length === 6) {
                      fetchPincodeDetails(value);
                    }
                  }}
                  onBlur={() => {
                    // Show validation error if field is empty or invalid when focus is lost
                    if (!donorDetails.pincode) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        pincode: "Pincode is required",
                      }));
                    } else if (donorDetails.pincode.length !== 6) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        pincode: "Pincode must be 6 digits",
                      }));
                    }
                  }}
                  disabled={shouldDisableFields()}
                  className={`${validationErrors.pincode ? "error" : ""} ${
                    shouldDisableFields() ? "disabled-input" : ""
                  }`}
                />
                {validationErrors.pincode && (
                  <div className="error-message">
                    {validationErrors.pincode}
                  </div>
                )}
                {isLoadingPincode && (
                  <span className="loading-indicator">Loading...</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={donorDetails.state}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      state: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>

              <div className="form-group">
                <label>
                  District <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={donorDetails.district}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      district: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
            </div>

            {/* Fourth row with House Number, Street Name, and PO */}
            <div className="form-row">
              <div className="form-group">
                <label>Flat / House / Apartment No</label>
                <input
                  type="text"
                  value={donorDetails.houseNumber}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      houseNumber: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>

              <div className="form-group">
                <label>Street Name / Landmark</label>
                <input
                  type="text"
                  value={donorDetails.streetName}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      streetName: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>

              <div className="form-group">
                <label>Post Office</label>
                <input
                  type="text"
                  value={donorDetails.postOffice}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      postOffice: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
            </div>
          </div>

          <div className="donation-footer">
            <div className="total-amount">
              <span className="label">Total Donation Amount</span>
              <span className="amount" style={{ paddingLeft: "20px" }}>
                ₹{" "}
                {parseFloat(calculateTotalDonations()).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="action-buttons">
              {/* Consent Letter Button */}
              <button
                className="letter-btn consent-letter"
                type="button"
                onClick={handleConsentLetterClick}
                disabled={!isDonationCompleted(donationData)}
                style={{
                  opacity: isDonationCompleted(donationData) ? 1 : 0.5,
                  cursor: isDonationCompleted(donationData)
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 7H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 12H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 17H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Consent Letter
              </button>

              {/* Thank Letter Button */}
              <button
                className="letter-btn thank-letter"
                type="button"
                onClick={handleThankLetterClick}
                disabled={!isDonationCompleted(donationData)}
                style={{
                  opacity: isDonationCompleted(donationData) ? 1 : 0.5,
                  cursor: isDonationCompleted(donationData)
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 5L12 12L3 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 5H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Thank Letter
              </button>

              {/* Existing buttons */}
              <button
                className="pending-btn"
                type="button"
                onClick={handlePending}
                disabled={isDonationCompleted(donationData)}
                style={{
                  opacity: isDonationCompleted(donationData) ? 0.5 : 1,
                  cursor: isDonationCompleted(donationData)
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Pending
              </button>
              {isDonationCompleted(donationData) ? (
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  style={{
                    backgroundColor: "#FEE5E5",
                    color: "#DC2626",
                    border: "1px solid #DC2626",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Cancel Donation
                </button>
              ) : (
                <button
                  className="print-receipt-btn"
                  type="button"
                  onClick={handlePrintReceipt}
                  style={{
                    opacity: isDonationCompleted(donationData) ? 0.5 : 1,
                    cursor: isDonationCompleted(donationData)
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17H17V22H7V17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 3H7V8H17V3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 8H19C20.1046 8 21 8.89543 21 10V16C21 17.1046 20.1046 18 19 18H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Print Receipt
                </button>
              )}
            </div>
          </div>

          <div className="details-card donation-history">
            <h2>Donation History</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donation for</th>
                  <th>Transaction Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {guestDetails?.data?.find((g) => g.id === donorDetails.guestId)
                  ?.attributes?.donations?.data?.length > 0 ? (
                  guestDetails.data
                    .find((g) => g.id === donorDetails.guestId)
                    ?.attributes?.donations?.data.map((donation) => {
                      const attributes = donation.attributes;
                      // Format the date to dd-mm-yyyy
                      const date = new Date(attributes.createdAt);
                      const formattedDate = date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });

                      return (
                        <tr key={donation.id}>
                          <td>{formattedDate}</td>
                          <td>{attributes.donationFor}</td>
                          <td>
                            <span
                              className={attributes.transactionType?.toLowerCase()}
                            >
                              {attributes.transactionType}
                            </span>
                          </td>
                          <td>
                            ₹
                            {parseFloat(
                              attributes.donationAmount || 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <span
                              className={`status ${attributes.status?.toLowerCase()}`}
                            >
                              {attributes.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="no-history">
                      No donation history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="donation-section">
          <div
            className="details-card donation-details"
            style={{
              backgroundColor:
                selectedTab === "Math"
                  ? "#ffb888"
                  : selectedTab === "Mission"
                  ? "#99fb98"
                  : "white",
              marginBottom: "10px",
            }}
          >
            <h2 style={{ margin: "0px" }}>Donations Details</h2>
            <div className="form-group">
              <label>
                Purpose <span className="required">*</span>
              </label>
              <select
                value={currentReceipt?.donationDetails?.purpose || ""}
                onChange={(e) => {
                  if (shouldDisableFields()) return;
                  handleDonationDetailsUpdate({
                    purpose: e.target.value,
                  });
                }}
                disabled={shouldDisableFields()}
                className={`${validationErrors.purpose ? "error" : ""} ${
                  shouldDisableFields() ? "disabled-input" : ""
                }`}
              >
                <option value="">Select Purpose</option>
                {selectedTab === "Math" ? (
                  <>
                    <option value="Thakur Seva">Thakur Seva</option>
                    <option value="Sadhu Seva">Sadhu Seva</option>
                    <option value="Nara Narayan Seva">Nara Narayan Seva</option>
                    <option value="General Fund for Various Activities">
                      General Fund for Various Activities
                    </option>
                    <option value="Welfare Fund">Welfare Fund</option>
                    <option value="Thakur's Tithi Puja Celebrations">
                      Thakur's Tithi Puja Celebrations
                    </option>
                    <option value="Holy Mother's Tithi Puja Celebrations">
                      Holy Mother's Tithi Puja Celebrations
                    </option>
                    <option value="Swamiji Tithi Puja Celebrations">
                      Swamiji Tithi Puja Celebrations
                    </option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Helping Poor Students">
                      Helping Poor Students
                    </option>
                    <option value="Rural Development Fund">
                      Rural Development Fund
                    </option>
                    <option value="Welfare Fund">Welfare Fund</option>
                    <option value="General Fund for Various Activities">
                      General Fund for Various Activities
                    </option>
                    <option value="All Round Child Development Project">
                      All Round Child Development Project
                    </option>
                    <option value="Charitable Dispensary & Eye (Day) Care Centre">
                      Charitable Dispensary & Eye (Day) Care Centre
                    </option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              {validationErrors.purpose && (
                <span className="error-message">
                  {validationErrors.purpose}
                </span>
              )}
            </div>

            {/* Add this conditional input field for both Math and Mission */}
            {currentReceipt?.donationDetails?.purpose === "Other" && (
              <div className="form-group">
                <label>
                  Specify Other Purpose <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={currentReceipt?.donationDetails?.otherPurpose || ""}
                  onChange={(e) => {
                    handleDonationDetailsUpdate({
                      otherPurpose: e.target.value,
                    });
                    setValidationErrors((prev) => ({
                      ...prev,
                      otherPurpose: e.target.value
                        ? ""
                        : "Please specify the purpose",
                    }));
                  }}
                  placeholder=""
                  className={validationErrors.otherPurpose ? "error" : ""}
                />
                {validationErrors.otherPurpose && (
                  <span className="error-message">
                    {validationErrors.otherPurpose}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Donations Type</label>
              <select
                value={
                  currentReceipt?.donationDetails?.donationType ||
                  "Others (Revenue)"
                }
                onChange={(e) => {
                  if (shouldDisableFields()) return;
                  handleDonationDetailsUpdate({
                    donationType: e.target.value,
                  });
                }}
                disabled={shouldDisableFields()}
                className={`${shouldDisableFields() ? "disabled-input" : ""}`}
              >
                <option value="Others (Revenue)">Others (Revenue)</option>
                <option value="CORPUS">CORPUS</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                Donation Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                value={currentReceipt?.donationDetails?.amount || ""}
                onChange={handleDonationAmountChange}
                disabled={shouldDisableFields()}
                className={`${validationErrors.amount ? "error" : ""} ${
                  shouldDisableFields() ? "disabled-input" : ""
                }`}
                placeholder=""
              />
              {validationErrors.amount && (
                <div className="error-message">{validationErrors.amount}</div>
              )}
            </div>
            {showPANField && (
              <div className="form-group">
                <label>
                  PAN Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={donorDetails.panNumber || ""}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setDonorDetails({
                      ...donorDetails,
                      panNumber: value,
                    });
                    const panError = validatePAN(value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      pan: panError,
                    }));
                  }}
                  className={validationErrors.pan ? "error" : ""}
                />
                {validationErrors.pan && (
                  <span className="error-message">{validationErrors.pan}</span>
                )}
              </div>
            )}
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                value={
                  currentReceipt?.donationDetails?.transactionType || "Cash"
                }
                onChange={(e) => {
                  if (shouldDisableFields()) return;
                  handleDonationDetailsUpdate({
                    transactionType: e.target.value,
                  });
                }}
                disabled={shouldDisableFields()}
                className={`${shouldDisableFields() ? "disabled-input" : ""}`}
              >
                <option value="Cash">Cash</option>
                <option value="M.O">M.O</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="DD">DD</option>
              </select>
            </div>
            <div className="form-group">
              <label>In Memory of</label>
              <input
                type="text"
                value={currentReceipt?.donationDetails?.inMemoryOf || ""}
                onChange={(e) => {
                  if (shouldDisableFields()) return;
                  handleDonationDetailsUpdate({
                    inMemoryOf: e.target.value,
                  });
                }}
                disabled={shouldDisableFields()}
                className={`${shouldDisableFields() ? "disabled-input" : ""}`}
              />
            </div>
          </div>

          {showTransactionDetails && (
            <div
              className="details-card transaction-details"
              style={{
                backgroundColor:
                  selectedTab === "Math"
                    ? "#ffb888"
                    : selectedTab === "Mission"
                    ? "#99fb98"
                    : "white",
              }}
            >
              <div
                className="card-header"
                style={{ margin: "0px", border: "none", padding: "0px" }}
              >
                <h2>Transaction details</h2>
              </div>
              <div className="form-group">
                <label>
                  DD/CH Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.ddDate || ""
                  }
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddDate: e.target.value,
                      },
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>
                  DD/CH Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.ddNumber || ""
                  }
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddNumber: e.target.value,
                      },
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.bankName || ""
                  }
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        bankName: e.target.value,
                      },
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>
                  Branch Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.branchName || ""
                  }
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        branchName: e.target.value,
                      },
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showCancelConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <div className="warning-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 9L9 15"
                  stroke="#FF4D4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 9L15 15"
                  stroke="#FF4D4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#FF4D4F"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3>Are you sure you want to cancel this Donation?</h3>
            <p>
              Once confirmed, the action will be final and cannot be undone.
            </p>
            <div className="dialog-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowCancelConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-button" onClick={confirmCancel}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="confirmation-dialog"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="model-header">
              <h4>Receipt Preview</h4>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="receipt-content">
              <div className="receipt-header">
                <div className="receipt-info">
                  <span>
                    Receipt No:{" "}
                    <strong>
                      {uniqueDonorId} / {receiptNumber}
                    </strong>
                  </span>
                  <span>
                    Date: <strong>{new Date().toLocaleDateString()}</strong>
                  </span>
                </div>
              </div>
              <div className="receipt-body">
                <div className="receipt-thanks">
                  <p>Received With Thanks From </p>
                  <div className="receipt-address">
                    <p>
                      <strong>{`${donorDetails.title} ${donorDetails.name}`}</strong>
                      {(donorDetails.houseNumber ||
                        donorDetails.streetName) && (
                        <p>
                          <strong>
                            {donorDetails.houseNumber}
                            {donorDetails.streetName &&
                              `, ${donorDetails.streetName}`}
                          </strong>
                        </p>
                      )}
                      {(donorDetails.postOffice || donorDetails.district) && (
                        <p>
                          {donorDetails.postOffice && (
                            <strong>PO: {donorDetails.postOffice}</strong>
                          )}
                          {donorDetails.postOffice && donorDetails.district && (
                            <strong>, </strong>
                          )}
                          {donorDetails.district && (
                            <strong>Dist: {donorDetails.district}</strong>
                          )}
                        </p>
                      )}
                      {(donorDetails.state || donorDetails.pincode) && (
                        <p>
                          {donorDetails.state && (
                            <strong>State: {donorDetails.state}</strong>
                          )}
                          {donorDetails.state && donorDetails.pincode && (
                            <strong>, </strong>
                          )}
                          {donorDetails.pincode && (
                            <strong>Pin: {donorDetails.pincode}</strong>
                          )}
                        </p>
                      )}
                      {/* Show PAN if available, otherwise show other identity */}
                      {donorDetails.panNumber ? (
                        <p>
                          <strong>PAN: {donorDetails.panNumber}</strong>
                        </p>
                      ) : (
                        donorDetails.identityNumber && (
                          <p>
                            <strong>
                              {donorDetails.identityType}:{" "}
                              {donorDetails.identityNumber}
                            </strong>
                          </p>
                        )
                      )}
                    </p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p
                    style={{
                      minWidth: "120px",
                      flexShrink: 0,
                      marginTop: "0",
                      alignSelf: "flex-start",
                    }}
                  >
                    By Transaction Type:{" "}
                  </p>
                  <div
                    style={{
                      paddingLeft: "5px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "4px",
                    }}
                  >
                    <p style={{ margin: "0" }}>
                      {currentReceipt?.donationDetails?.transactionType?.toLowerCase() ===
                      "cash"
                        ? "Cash"
                        : currentReceipt?.donationDetails?.transactionType ||
                          "Cash"}
                    </p>
                    {currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
                      "cash" && (
                      <p style={{ margin: "0" }}>
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.bankName || ""}{" "}
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.branchName || ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="receipt-amt">
                  <p
                    style={{ minWidth: "120px", flexShrink: 0, marginTop: "0" }}
                  >
                    The Sum of Rupees:{" "}
                  </p>
                  <div
                    style={{
                      paddingLeft: "5px",
                      flex: 1,
                      wordBreak: "break-word",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                    className="amt"
                  >
                    <p style={{ margin: "0" }}>
                      <strong>
                        {numberToWords(
                          parseFloat(
                            currentReceipt?.donationDetails?.amount || 0
                          )
                        )}{" "}
                        Only
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p
                    style={{ minWidth: "120px", flexShrink: 0, marginTop: "0" }}
                  >
                    As Donation for:{" "}
                  </p>
                  <div
                    style={{
                      // paddingLeft: "5px",
                      flex: 1,
                      wordBreak: "break-word",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <p style={{ margin: "0" }}>
                      {currentReceipt?.donationDetails?.donationType} for{" "}
                      {currentReceipt?.donationDetails?.purpose === "Other"
                        ? currentReceipt?.donationDetails?.otherPurpose
                        : currentReceipt?.donationDetails?.purpose}
                      {currentReceipt?.donationDetails?.inMemoryOf && (
                        <span>{` in memory of ${currentReceipt.donationDetails.inMemoryOf}`}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="receipt-amount">
                <strong>
                  ₹{" "}
                  {parseFloat(
                    currentReceipt?.donationDetails?.amount || 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </div>
            <div
              className="print"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "12px",
                marginTop: "20px",
                padding: "16px",
              }}
            >
              <button
                className="cancel-button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: "white",
                  color: "#6B7280",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "400",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  height: "36px",
                  textAlign: "center",
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-print-button"
                onClick={handleConfirmPrint}
                style={{
                  backgroundColor: "#F47B20",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "400",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  height: "36px",
                  width: "120px", // Fixed width for the confirm button
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Confirm Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showPendingConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <div className="warning-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V14"
                  stroke="#FFB020"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17.5V18"
                  stroke="#FFB020"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#FFB020"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h3>Are you sure you want to keep this Donation in pending?</h3>
            <p>
              Once confirmed, the action will be final and cannot be undone.
            </p>
            <div className="dialog-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowPendingConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-button" onClick={confirmPending}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .disabled-input {
          background-color: #f3f4f6;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .disabled-input:hover {
          border-color: #d1d5db;
        }

        .view-only-banner {
          background-color: #edf2f7;
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
        }

        .loading-indicator {
          margin-left: 8px;
          font-size: 12px;
          color: #666;
        }

        .form-group {
          position: relative;
        }

        .form-group .loading-indicator {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .tab.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .searchable-dropdown {
          position: relative;
          flex: 1;
        }

        .searchable-dropdown input {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }

        .dropdown-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          max-height: 200px;
          overflow-y: auto;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .guest-details {
          font-size: 0.85em;
          color: #666;
          margin-top: 2px;
        }

        .guest-details span {
          margin-right: 10px;
        }

        .custom-dropdown {
          width: 100%;
          height: 40px;
        }

        .dropdown-header {
          height: 38px;
          min-height: 38px;
          max-height: 38px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px !important;
          line-height: 38px;
        }

        .dropdown-options {
          position: absolute;
          top: calc(100% + 2px);
          left: 0;
          right: 0;
          max-height: 200px;
          overflow-y: auto;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dropdown-options input {
          width: 100%;
          height: 36px;
          padding: 8px;
          border: none;
          border-bottom: 1px solid #ccc;
          outline: none;
        }

        .dropdown-options div {
          padding: 8px 10px;
          cursor: pointer;
          height: 36px;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .dropdown-options div:hover {
          background-color: #f5f5f5;
        }

        .form-group {
          min-height: 70px;
          margin-bottom: 15px;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .error {
          border-color: #dc2626 !important;
          &:focus {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 1px #dc2626 !important;
          }
        }
        .form-group {
          position: relative;
          margin-bottom: 24px;
        }

        .input-wrapper {
          position: relative;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
        }

        input.error {
          border-color: #dc2626 !important;
        }

        .loading-indicator {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
        :global(.error-message) {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .guest-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .guest-name {
          font-weight: 500;
          color: #111827;
        }

        .guest-phone {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .tabs {
          display: flex;
          gap: 10px;
        }

        .tab {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f3f4f6;
          color: #6b7280;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tab.active {
          background-color: ${selectedTab === "Math" ? "#ffb888" : "#99fb98"};
          color: #1f2937;
        }

        .tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tab:not(:disabled):hover {
          background-color: ${selectedTab === "Math" ? "#ffa677" : "#88ea87"};
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .donor-unified-input {
          display: flex;
          gap: 8px;
        }

        .donor-unified-input select {
          width: 80px;
          flex-shrink: 0;
        }

        .phone-unified-input {
          display: flex;
          gap: 8px;
        }

        .phone-unified-input select {
          width: 80px;
          flex-shrink: 0;
        }

        .searchable-dropdown {
          flex: 1;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;

          .form-group.half-width {
            flex: 1;
            min-width: 0; // Prevents flex items from overflowing

            .identity-input-group {
              display: flex;
              gap: 10px;

              select {
                width: 130px;
                min-width: 130px;
              }

              input {
                flex: 1;
              }
            }
          }
        }

        // Ensure error messages don't break the layout
        .error-message {
          position: absolute;
          font-size: 12px;
          color: #dc2626;
          margin-top: 2px;
        }

        // Adjust input padding to accommodate error messages
        .form-group {
          margin-bottom: 20px; // Increase bottom margin to make room for error messages

          input,
          select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;

            &.error {
              border-color: #dc2626;
            }

            &.disabled-input {
              background-color: #f3f4f6;
              cursor: not-allowed;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default NewDonation;
