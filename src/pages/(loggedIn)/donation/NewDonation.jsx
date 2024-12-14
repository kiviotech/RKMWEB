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
} from "../../../../services/src/services/receiptDetailsService";
import {
  createNewDonation,
  fetchDonationsByField,
  updateDonationById,
  fetchDonationById,
} from "../../../../services/src/services/donationsService";
import { useNavigate, useLocation } from "react-router-dom";

const NewDonation = () => {
  // Add this useEffect at the top of your component, after all the state declarations
  useEffect(() => {
    // Delay the scroll slightly to ensure the DOM is ready
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Force immediate scroll
      });

      // Backup scroll
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    // Add a second timeout as a fallback
    const backupTimeoutId = setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(backupTimeoutId);
    };
  }, []); // Empty dependency array for mount only

  // Also add this to handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Add this useEffect near the top of your component, with other useEffects
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []); // Empty dependency array means this runs once when component mounts

  const [selectedTab, setSelectedTab] = useState("Math");
  const [receiptNumber, setReceiptNumber] = useState("");
  const { user } = useAuthStore();
  const { donations, addDonation, updateDonationDetails } = useDonationStore();
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
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true,
    },
  ]);
  const [selectedDonor, setSelectedDonor] = useState(Date.now());
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

  // Add this near the top of the component with other state declarations
  const donorNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Add this ref near the top with other refs
  const identityInputRef = useRef(null);

  // Add this with your other state declarations at the top
  const [uniqueDonorId, setUniqueDonorId] = useState(() => {
    return `C${Math.floor(100000 + Math.random() * 900000)}`;
  });

  // Add this state to store the highest numbers
  const [highestNumbers, setHighestNumbers] = useState({
    MT: 0,
    MSN: 0,
  });

  console.log("Zustand Store Data:", {
    // auth: { user },
    donations,
  });

  console.log("Received donation data:", donationData);

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
            donationType: "Others (Revenue)", // Set appropriate donation type if available
            amount: donationData.attributes.donationAmount,
            transactionType:
              donationData.attributes.transactionType.toLowerCase(),
            inMemoryOf:
              donationData.attributes.InMemoryOf || "Others (Revenue)", // Set default value here
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
  const parseAddress = (addressString) => {
    const [
      houseNumber = "",
      streetName = "",
      district = "",
      state = "",
      pincode = "",
    ] = addressString.split(",").map((item) => item.trim());

    return {
      houseNumber,
      streetName,
      district,
      state,
      pincode: pincode.replace(/\D/g, ""), // Remove non-digit characters
    };
  };

  React.useEffect(() => {
    const loadGuestDetails = async () => {
      try {
        console.log("Starting to fetch guest details...");
        const details = await fetchGuestDetails();
        console.log("Raw Guest Details Response:", details);

        // Log the structure of the data
        console.log("Guest Details Data Structure:", {
          hasData: Boolean(details?.data),
          dataLength: details?.data?.length,
          firstRecord: details?.data?.[0],
          meta: details?.meta,
        });

        // Log individual guest records
        if (details?.data?.length > 0) {
          details.data.forEach((guest, index) => {
            // console.log(`Guest ${index + 1}:`, {
            //   id: guest.id,
            //   attributes: guest.attributes,
            //   relationships: guest.relationships
            // });
          });
        }

        setGuestDetails(details);
      } catch (error) {
        console.error("Error loading guest details:", error);
        console.error("Error stack:", error.stack);
      }
    };

    loadGuestDetails();
  }, []);

  const generateReceiptNumber = (tab) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = tab === "Mission" ? "MSN" : "MT";
    return `${prefix} ${randomNum}`;
  };

  React.useEffect(() => {
    // Skip if no selected donor
    if (!selectedDonor) return;

    // Generate new receipt number when tab changes
    const generatedNumber = generateReceiptNumber(selectedTab);

    const receiptData = {
      receiptNumber: generatedNumber,
      date: new Date().toLocaleDateString(),
      createdBy: user?.username || "N/A",
      type: selectedTab,
      status: "pending",
      amount: 0,
      donorId: selectedDonor,
      donorDetails: donorDetails,
      donationDetails: {
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
    };

    // Batch these updates together
    setReceiptNumber(generatedNumber);
    setCurrentReceipt(receiptData);
    addDonation(receiptData);
  }, [selectedDonor, selectedTab]); // Dependencies include selectedTab

  // When donor details are updated, update both receipts
  const handleDonorDetailsUpdate = (details) => {
    // Update donor details
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(currentReceipt.receiptNumber, {
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

    // Update receipts for this donor
    const donorReceipts =
      donations.receipts.find(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorId === selectedDonor ||
            group[0].donorDetails?.guestId === selectedDonor)
      ) || [];

    donorReceipts.forEach((receipt) => {
      if (receipt.receiptNumber !== currentReceipt?.receiptNumber) {
        updateDonationDetails(receipt.receiptNumber, { donorDetails: details });
      }
    });
  };

  const handleAddDonation = () => {
    const newReceiptNumber = generateReceiptNumber(selectedTab);
    setReceiptNumber(newReceiptNumber);

    // Generate new unique ID
    const newUniqueId = `C${Math.floor(100000 + Math.random() * 900000)}`;
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

    const newDonor = {
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true,
    };

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
      donations.receipts.find(
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

    const guestData = guest.attributes;

    // Extract address components
    const addressParts = guestData.address?.split(", ") || [];
    const houseNumber = addressParts[0] || "";
    const streetAddress = addressParts.slice(1, -4).join(", ") || ""; // Updated slice
    const postOffice = addressParts[addressParts.length - 4] || ""; // Added postOffice
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
      postOffice: postOffice, // Added postOffice
      district: district,
      state: state,
      guestId: guest.id,
    };

    handleDonorDetailsUpdate(donorDetailsData);
    setSearchTerm("");
    setShowDropdown(false);
  };

  // Modify handleTabClick to update unique donor ID
  const handleTabClick = (tab) => {
    // Check if there's existing donation data and it's completed
    if (donationData && donationData.status === "completed") {
      // Convert tab and donatedFor to lowercase for case-insensitive comparison
      const normalizedTab = tab.toLowerCase();
      const normalizedDonatedFor = donationData.donatedFor.toLowerCase();

      // If trying to switch to a different tab than the original donation
      if (normalizedTab !== normalizedDonatedFor) {
        alert("Cannot change donation type for a completed donation");
        return;
      }
    }

    // If we get here, either there's no donation data, it's not completed,
    // or we're selecting the same tab as the original donation
    setSelectedTab(tab);

    // Update receipt number based on new tab
    const prefix = tab === "Math" ? "MT" : "MSN";
    const nextNumber =
      tab === "Math" ? highestNumbers.MT + 1 : highestNumbers.MSN + 1;
    setReceiptNumber(`${prefix} ${nextNumber}`);
  };

  // Add handler for donation details updates
  const handleDonationDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      const updatedDonationDetails = {
        ...currentReceipt.donationDetails,
        ...details,
        // Ensure we preserve transaction details
        transactionDetails: {
          ...(currentReceipt.donationDetails?.transactionDetails || {}),
          ...(details.transactionDetails || {}),
        },
      };

      setCurrentReceipt({
        ...currentReceipt,
        donationDetails: updatedDonationDetails,
      });

      updateDonationDetails(
        currentReceipt.receiptNumber,
        updatedDonationDetails
      );
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
          ddNumber: "",
          ddDate: "",
          bankName: "",
          branchName: "",
        },
      },
    });

    // Reset donor tags and selected donor
    setDonorTags([
      {
        id: Date.now(),
        name: "New Donor",
        isNewDonor: true,
      },
    ]);
    setSelectedDonor(Date.now());

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

  // Modify handlePrintReceipt to only show the modal
  const handlePrintReceipt = async () => {
    // Check if purpose exists before validation
    if (!currentReceipt?.donationDetails?.purpose) {
      setValidationErrors((prev) => ({
        ...prev,
        purpose: "Purpose is required",
      }));
      return;
    }

    // Add validation for other purpose
    if (
      currentReceipt?.donationDetails?.purpose === "Other" &&
      !currentReceipt?.donationDetails?.otherPurpose
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        otherPurpose: "Please specify the purpose",
      }));
      return;
    }

    // Rest of your validation checks
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the amount");
      return;
    }

    // Validate form fields
    const nameError = validateName(donorDetails.name);
    const phoneError = validatePhone(donorDetails.phone);
    const emailError = validateEmail(donorDetails.email);
    const purposeError = !currentReceipt?.donationDetails?.donationType
      ? "Purpose is required"
      : "";
    const amountError = validateDonationAmount(
      currentReceipt?.donationDetails?.amount
    );

    setValidationErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      purpose: purposeError,
      amount: amountError,
    });

    if (nameError || phoneError || purposeError || amountError) {
      alert("Please fill all required fields");
      return;
    }

    // Validate transaction details if necessary
    if (!validateTransactionDetails()) {
      alert("Please fill all required transaction details");
      return;
    }

    // Show the modal if validation passes
    setIsModalOpen(true);
  };

  // Modify handleConfirmPrint function
  const handleConfirmPrint = async () => {
    try {
      // Remove the email validation check
      // if (!donorDetails.email) {
      //   setValidationErrors((prev) => ({
      //     ...prev,
      //     email: "Email is required",
      //   }));
      //   alert("Email cannot be empty");
      //   return;
      // }

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

      // Create receipt details
      console.log("Creating new receipt");
      const receiptPayload = {
        Receipt_number: receiptNumber,
        status: "completed",
        amount: currentReceipt?.donationDetails?.amount,
        unique_no: uniqueDonorId,
      };
      const receiptResponse = await createNewReceiptDetail(receiptPayload);
      console.log("Created new receipt:", receiptResponse);

      // Create donation
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

      // Create the receipt HTML content
      const receiptContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Ramakrishna Math Letterhead</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background-color: #fff;
                font-family: Arial, sans-serif;
              }

              .letterhead {
                width: 672 px;
                margin: 0 auto;
              }

              .header {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 40px;
              }

              .logo {
                width: 100px;
                height: auto;
              }

              .title-section {
                flex: 1;
              }

              h1 {
                margin: 0;
                color: #4b3968;
                font-size: 24px;
                text-align: center;
              }

              .subtitle {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                color: #4b3968;
              }

              .address {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                color: #4b3968;
              }

              .contact {
                margin: 5px 0;
                font-size: 12px;
                text-align: center;
                color: #4b3968;
              }

              .signature-section {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                margin-bottom: 20px;
                position: relative;
              }

              .received {
                margin: 0 0 5px 0;
                color: #4b3968;
                font-size: 14px;
              }

              .adhyaksha {
                position: absolute;
                right: 0;
                margin: 0;
                padding-top: 5px;
                min-width: 150px;
                text-align: center;
                color: #4b3968;
                font-size: 14px;
              }

              .donation-text {
                font-size: 14px;
                color: #4b3968;
                line-height: 1.6;
                margin: 20px 0 0 0;
                padding: 5px 0 0 0;
                font-weight: 600;
                letter-spacing: 0.2px;
                border-top: 1px solid #4b3968;
              }

              .receipt-details {
                margin: 100px 0px;
                line-height: 2;
                font-size: 16px;  /* Increased from 14px */
              }

              .receipt-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                font-size: 16px;  /* Increased from 14px */
              }

              .donor-details {
                margin-bottom: 25px;
              }

              .donor-details p {
                margin: 0;
                line-height: 2;
                font-size: 16px;  /* Increased from 14px */
              }

              .donor-details p:not(:first-child) {
                margin-left: 40px;  /* Reduced from 160px to 40px */
              }

              .payment-details {
                margin-top: 25px;
              }

              .payment-details p {
                margin: 0;
                line-height: 2;
                font-size: 16px;  /* Increased from 14px */
              }

              .amount {
                margin-top: 5px;
                font-size: 18px;  /* Increased from 14px */
                font-weight: bold;  /* Changed from normal */
              }

              /* Add styles for emphasized text */
              b {
                font-size: 18px;  /* Make bold text slightly larger */
              }
            </style>
          </head>
          <body>
            <div class="letterhead">
              <div class="receipt-details">
                <div class="receipt-row">
                  <span>Receipt <b>No: ${uniqueDonorId} / ${receiptNumber}</b></span>
                  <span class="date">Date: <b>${formattedDate}</b></span>
                </div>
                <div class="donor-details">
                  <p style="margin: 0 0 5px 0;">
                    Received with thanks from
                    <b>${donorDetails.title} ${donorDetails.name}</b>
                  </p>
                  <div style="margin-left: 190px; font-weight: bold;">
                    <p style="margin: 0 0 5px 0;">
                      ${donorDetails.houseNumber || ""}${
        donorDetails.streetName ? `, ${donorDetails.streetName}` : ""
      }
                    </p>
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.postOffice
                          ? `PO: ${donorDetails.postOffice}, `
                          : ""
                      }${
        donorDetails.district ? `Dist: ${donorDetails.district}` : ""
      }
                    </p>
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.state
                          ? `State: ${donorDetails.state}, `
                          : ""
                      }${
        donorDetails.pincode ? `Pin: ${donorDetails.pincode}` : ""
      }
                    </p>
                    ${
                      donorDetails.identityNumber
                        ? `
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.identityType === "PAN"
                          ? `PAN: ${donorDetails.identityNumber}`
                          : `Aadhaar: ${donorDetails.identityNumber}`
                      }
                      </p>
                  `
                        : ""
                    }
                  </div>
                </div>
                <div class="payment-details">
                  <p>The sum of Rupees <b>${numberToWords(
                    parseFloat(currentReceipt?.donationDetails?.amount || 0)
                  )} Only</b></p>

                  <div style="display: flex; gap: 10px; align-items: center;">
                    <p style="margin: 0;">By ${
                      currentReceipt?.donationDetails?.transactionType || "Cash"
                    }</p>
                    ${
                      currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
                      "cash"
                        ? `
                      <p style="margin: 0;">Dt.  ${
                        currentReceipt?.donationDetails?.transactionDetails
                          ?.ddDate || ""
                      }</p>
                      <p style="margin: 0;">Bank: ${
                        currentReceipt?.donationDetails?.transactionDetails
                          ?.bankName || ""
                      }</p>
                    `
                        : ""
                    }
                  </div>

                  <p>As Donation for ${
                    currentReceipt?.donationDetails?.donationType
                  } for ${
        currentReceipt?.donationDetails?.purpose === "Other"
          ? currentReceipt?.donationDetails?.otherPurpose
          : currentReceipt?.donationDetails?.purpose
      }${
        currentReceipt?.donationDetails?.inMemoryOf
          ? ` in memory of ${currentReceipt?.donationDetails?.inMemoryOf}`
          : ""
      }</p>
                  <p class="amount"><b>Rs. ${parseFloat(
                    currentReceipt?.donationDetails?.amount || 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</b></p>
                </div>
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
      `;

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
    // Check donation amount first
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the amount");
      return;
    }

    // Validate form fields
    const nameError = validateName(donorDetails.name);
    const phoneError = validatePhone(donorDetails.phone);
    const emailError = validateEmail(donorDetails.email);

    setValidationErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
    });

    if (nameError || phoneError || emailError) {
      alert("Please fill required fields");
      return;
    }

    // Validate transaction details if necessary
    if (!validateTransactionDetails()) {
      alert("Please fill all required transaction details");
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

        // Create receipt details
        console.log("Creating new receipt with pending status");
        const receiptPayload = {
          Receipt_number: receiptNumber,
          status: "pending",
          amount: currentReceipt?.donationDetails?.amount,
        };
        const receiptResponse = await createNewReceiptDetail(receiptPayload);
        console.log("Created new receipt:", receiptResponse);

        // Create donation
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

        // Create receipt details
        console.log("Creating new receipt with cancelled status");
        const receiptPayload = {
          Receipt_number: receiptNumber,
          status: "cancelled",
          amount: currentReceipt?.donationDetails?.amount,
        };
        const receiptResponse = await createNewReceiptDetail(receiptPayload);
        console.log("Created new receipt:", receiptResponse);

        // Create donation
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
          },
        };

        await createNewDonation(donationPayload);
        console.log("Successfully created new cancelled donation");
      }

      // Reset form and close modal
      resetFormData();
      setShowCancelConfirm(false);
      navigate("/donation");
    } catch (error) {
      console.error("Error processing cancelled donation:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Error processing cancelled donation. Please try again.");
    }
  };

  // Add this function to calculate total donations
  const calculateTotalDonations = () => {
    if (!donations?.receipts || !selectedDonor) return 0;

    const donorReceipts =
      donations.receipts.find(
        (group) =>
          Array.isArray(group) &&
          group.length > 0 &&
          (group[0].donorId === selectedDonor ||
            group[0].donorDetails?.guestId === selectedDonor)
      ) || [];

    return donorReceipts.reduce((total, receipt) => {
      const amount = parseFloat(receipt.donationDetails?.amount || 0);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const handleReset = () => {
    // Generate new unique ID
    setUniqueDonorId(`C${Math.floor(100000 + Math.random() * 900000)}`);

    // Rest of your existing handleReset code...
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
    // ... rest of reset code
  };

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

  // Add this useEffect for handling clicks outside dropdown
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
  const handleDonationAmountChange = (value) => {
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      const amount = parseFloat(value) || 0;

      // Check if amount exceeds 9,999
      setShowPANField(amount > 9999);

      const updatedDonationDetails = {
        ...currentReceipt?.donationDetails,
        amount: value,
      };

      if (currentReceipt?.receiptNumber) {
        const updatedReceipt = {
          ...currentReceipt,
          donationDetails: updatedDonationDetails,
        };
        setCurrentReceipt(updatedReceipt);
        updateDonationDetails(
          currentReceipt.receiptNumber,
          updatedDonationDetails
        );
      }

      // Add amount validation
      setValidationErrors((prev) => ({
        ...prev,
        amount: !value
          ? "Amount is required"
          : amount <= 0
          ? "Amount must be greater than 0"
          : "",
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
        const uniqueNumbers = await fetchUniqueNumbers();
        console.log("Unique Receipt Numbers:", uniqueNumbers);

        // Filter MT and MSN receipts
        const mtReceipts = uniqueNumbers.data.filter((receipt) =>
          receipt.attributes.Receipt_number.startsWith("MT")
        );
        const msnReceipts = uniqueNumbers.data.filter((receipt) =>
          receipt.attributes.Receipt_number.startsWith("MSN")
        );

        // Get highest unique numbers
        const highestMT = mtReceipts.reduce((max, receipt) => {
          const current = parseInt(
            receipt.attributes.unique_no.replace("C", "")
          );
          return Math.max(max, current);
        }, 0);

        const highestMSN = msnReceipts.reduce((max, receipt) => {
          const current = parseInt(
            receipt.attributes.unique_no.replace("C", "")
          );
          return Math.max(max, current);
        }, 0);

        setHighestNumbers({
          MT: highestMT,
          MSN: highestMSN,
        });

        // Set initial unique donor ID based on selected tab
        setUniqueDonorId(
          `C${selectedTab === "Math" ? highestMT + 1 : highestMSN + 1}`
        );
      } catch (error) {
        console.error("Error fetching unique numbers:", error);
      }
    };

    fetchNumbers();
  }, []); // Empty dependency array means this runs once when component mounts

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

    // Generate consent letter content
    const consentLetterContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @media print {
              body {
                padding: 5px;
                max-width: 800px;
                margin: 0 auto;
                line-height: 1.2;
              }
              @page {
                size: A4;
                margin: 20mm;
              }
              .header-info p {
                margin: 0;
                line-height: 1.4;
              }
              .header-info {
                margin-bottom: 15px;  /* Add space after ID NO */
              }
              .address p {
                margin: 0;
                line-height: 1.2;
              }
            }
          </style>
        </head>
        <body>
          <div class="consent-letter">
            <h2 style="text-align: center; margin-bottom: 5px;">CONSENT LETTER</h2>

            <div class="header-info">
              <p>Date: ${formatDate(donationData.donationDate)}</p>
              <p>ID NO: ${donationData.uniqueDonorId}</p>
            </div>

            <div class="address">
              <p>To</p>
              <p>The Adhyaksha</p>
              <p>Ramakrishna Math</p>
              <p>Vill. & P.O.: Kamarpukur</p>
              <p>Dist.: Hooghly, West Bengal, Pin - 712 612</p>
            </div>

            <p>Revered Maharaj,</p>

            <p style="margin-top: 5px;">
              I am donating a sum of Rs. ${
                donationData.amount
              }/- (${numberToWords(donationData.amount)} only)
              by ${donationData.transactionType} as ${
      donationData.donationType
    } for ${donationData.purpose}.
            </p>

            <p>Please accept and oblige.</p>

            <p>With pranams,</p>

            <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
              <p>Yours sincerely,</p>
            </div>

            <div style="margin-top: 5px;">
              <p style="margin: 0;">${donorDetails.title} ${
      donorDetails.name
    }</p>
              ${
                donorDetails.houseNumber || donorDetails.streetName
                  ? `<p style="margin: 0;">Vill: ${[
                      donorDetails.houseNumber,
                      donorDetails.streetName,
                    ]
                      .filter(Boolean)
                      .join(", ")}</p>`
                  : ""
              }
              ${
                donorDetails.postOffice || donorDetails.district
                  ? `<p style="margin: 0;">${[
                      donorDetails.postOffice
                        ? `PO: ${donorDetails.postOffice}`
                        : "",
                      donorDetails.district
                        ? `Dist: ${donorDetails.district}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(", ")}</p>`
                  : ""
              }
              ${
                donorDetails.state || donorDetails.pincode
                  ? `<p style="margin: 0;">${[
                      donorDetails.state ? `State: ${donorDetails.state}` : "",
                      donorDetails.pincode
                        ? `Pin: ${donorDetails.pincode}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(", ")}</p>`
                  : ""
              }
              <p style="margin: 0;">${[
                donorDetails.panNumber ? `PAN: ${donorDetails.panNumber}` : "",
                donorDetails.phone ? `Mobile No.: ${donorDetails.phone}` : "",
              ]
                .filter(Boolean)
                .join(", ")}</p>
              ${
                donorDetails.inMemoryOf
                  ? `<p style="margin: 0;">In Memory of ${donorDetails.inMemoryOf}</p>`
                  : ""
              }
            </div>

            <div style="margin-top: 10px; border-top: 1px solid #000; padding-top: 5px;">
              <h3 style="text-align: center; margin-bottom: 3px;">FOR OFFICE USE ONLY</h3>
              <p>Receipt No.: ${donationData.receiptNumber}, dated ${formatDate(
      donationData.donationDate
    )}</p>
              <p>By ${donationData.transactionType}</p>
              <p>Issued by hand / Send by Post</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `;

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

    // Generate thank letter content
    const thankLetterContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @media print {
              body {
                padding: 5px;
                max-width: 800px;
                margin: 25mm auto; /* Decreased from 45mm to 25mm to reduce top gap */
                line-height: 1.6;
                font-size: 12pt;
              }
              @page {
                size: A4;
                margin: 15mm 20mm; /* Reduced top margin from 25mm to 15mm */
              }
              .header-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 25px; /* Increased from 20px to 25px */
              }
              .donor-address {
                margin-bottom: 25px; /* Increased from 20px to 25px */
              }
              .donor-address p {
                margin: 0;
                line-height: 1.4; /* Increased from 1.2 to 1.4 */
              }
              .acknowledgment {
                margin: 25px 0; /* Increased from 20px to 25px */
                line-height: 1.6; /* Increased from 1.4 to 1.6 */
              }
              .receipt-reference {
                margin: 20px 0; /* Increased from 15px to 20px */
                line-height: 1.4; /* Increased from 1.2 to 1.4 */
              }
              .prayer-section {
                margin: 20px 0; /* Increased from 15px to 20px */
                line-height: 1.4; /* Increased from 1.2 to 1.4 */
              }
              .signature-section {
                margin-top: 35px; /* Added specific margin for signature section */
              }
              .enclosure {
                margin-top: 25px; /* Added specific margin for enclosure */
              }
              .border-box {
                margin-top: 20px; /* Added margin for the bordered box */
                padding: 10px;
                border: 1px solid #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="thank-letter">
            <div class="header-section">
              <div class="ref-numbers">
                <p>Ref. No.: PFDON/2024</p>
                <p>ID NO: ${donationData.uniqueDonorId}</p>
              </div>
              <div class="date">
                <p>Date: ${formatDate(donationData.donationDate)}</p>
              </div>
            </div>

            <div class="donor-address">
              <p>To</p>
              <p>${donationData.title} ${donationData.name}</p>
              <p>${
                donationData.houseNumber
                  ? `Vill: ${donationData.houseNumber}`
                  : ""
              }${
      donationData.streetName ? `, ${donationData.streetName}` : ""
    }</p>
              <p>${
                donationData.postOffice ? `PO: ${donationData.postOffice}` : ""
              }${
      donationData.district ? `, Dist: ${donationData.district}` : ""
    }</p>
              <p>${donationData.state ? `State: ${donationData.state}` : ""}${
      donationData.pincode ? `, Pin: ${donationData.pincode}` : ""
    }</p>
            </div>

            <p>Respected ${donationData.title} ${donationData.name},</p>

            <div class="acknowledgment">
              <p>We, thankfully acknowledge your kind and generous contribution of Rs. ${
                donationData.amount
              }/- (${numberToWords(donationData.amount)} only) ${
      donationData.transactionType
        ? `by ${donationData.transactionType.toLowerCase()}`
        : ""
    } ${donationData.donationType ? `as ${donationData.donationType}` : ""} ${
      donationData.purpose
        ? `for ${
            donationData.purpose === "Other"
              ? donationData.otherPurpose || ""
              : donationData.purpose
          }`
        : ""
    }${
      donationData.inMemoryOf ? ` in memory of ${donationData.inMemoryOf}` : ""
    }.</p>
          </div>

          <div class="receipt-reference">
            <p>Please find attached herewith the official Receipt vide no. (${
              donationData.receiptNumber
            }, dated ${formatDate(
      donationData.donationDate
    )}) for this contribution.</p>
          </div>

          <div class="prayer-section">
            <p>We pray to Sri Ramakrishna, Sri Maa Sarada Devi and Sri Swamiji Maharaj that they may bestow their choicest blessings upon you and members of your family!</p>
          </div>

          <p style="margin-top: 20px;">With best wishes and namaskars,</p>

          <div style="margin-top: 30px; text-align: right;">
            <p>Yours sincerely,</p>
            <p style="margin-top: 20px; margin-bottom: 0;">(Swami Lokottarananda)</p>
            <p style="margin-top: 0;">Adhyaksha</p>
          </div>

          <p style="margin-top: 20px;">Encl: As stated above.</p>

          <div style="border: 1px solid #000; text-align: center;">
            <span>Please Mention Your Id (${
              donationData.uniqueDonorId
            }) In The Future Correspondences.</span>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }
        </script>
      </body>
    </html>
    `;

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
      setDonorDetails({
        title: donationData.donorName.split(" ")[0] || "Sri",
        name: donationData.donorName.split(" ").slice(1).join(" "),
        phoneCode: donationData.phoneNumber.slice(0, 3),
        phone: donationData.phoneNumber.slice(3),
        // ... set other fields as needed
      });

      setCurrentReceipt({
        ...currentReceipt,
        donationDetails: {
          amount: donationData.amount,
          purpose: donationData.donatedFor,
          // ... set other fields as needed
        },
      });
    }
  }, [donationData]);

  return (
    <div className="donations-container">
      <div className="header">
        <div
          className="donor-tags"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>New Donation</h1>
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
                className={`tag ${selectedDonor === tag.id ? "selected" : ""}`}
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
            <button className="add-donation-btn" onClick={handleAddDonation}>
              + Add Donation
            </button>
            <button
              onClick={() => navigate("/donation#tomorrows-guests")}
              className="tomorrows-guest-btn"
              style={{
                backgroundColor: "#8C52FF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Tomorrow's Leaving Guest
            </button>
          </div>
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
                className={`tab ${selectedTab === "Math" ? "active" : ""} ${
                  donationData?.status === "completed" &&
                  donationData?.donatedFor.toLowerCase() !== "math"
                    ? "disabled"
                    : ""
                }`}
                onClick={() => handleTabClick("Math")}
                data-tab="Math"
                disabled={
                  donationData?.status === "completed" &&
                  donationData?.donatedFor.toLowerCase() !== "math"
                }
              >
                Math
              </button>
              <button
                className={`tab ${selectedTab === "Mission" ? "active" : ""} ${
                  donationData?.status === "completed" &&
                  donationData?.donatedFor.toLowerCase() !== "mission"
                    ? "disabled"
                    : ""
                }`}
                onClick={() => handleTabClick("Mission")}
                data-tab="Mission"
                disabled={
                  donationData?.status === "completed" &&
                  donationData?.donatedFor.toLowerCase() !== "mission"
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
                marginBottom: "20px",
              }}
            >
              <h2>Donor Details</h2>
              <div className="unique-id-display">{uniqueDonorId}</div>
            </div>

            {/* First row with Name, Phone, Mantra Diksha */}
            <div className="form-row">
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
                    className={`${
                      shouldDisableFields() ? "disabled-input" : ""
                    }`}
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
                  <input
                    ref={donorNameInputRef}
                    type="text"
                    value={donorDetails.name}
                    onChange={(e) => {
                      if (shouldDisableFields()) return;
                      const newName = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      setDonorDetails({ ...donorDetails, name: newName });
                    }}
                    disabled={shouldDisableFields()}
                    className={`${validationErrors.name ? "error" : ""} ${
                      shouldDisableFields() ? "disabled-input" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="form-group">
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
                    className={`${
                      shouldDisableFields() ? "disabled-input" : ""
                    }`}
                  >
                    <option value="+91">+91</option>
                  </select>
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
                    }}
                    disabled={shouldDisableFields()}
                    className={`${validationErrors.phone ? "error" : ""} ${
                      shouldDisableFields() ? "disabled-input" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Mantra Diksha */}
              <div className="form-group">
                <label>
                  Mantra Diksha <span className="required">*</span>
                </label>
                <select
                  value={donorDetails.mantraDiksha}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({
                      ...donorDetails,
                      mantraDiksha: e.target.value,
                    });
                  }}
                  disabled={shouldDisableFields()}
                  className={`mantra-diksha-select ${
                    shouldDisableFields() ? "disabled-input" : ""
                  }`}
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
              </div>
            </div>

            {/* Second row with Email, Identity Proof, Room No */}
            <div className="form-row">
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  value={donorDetails.email}
                  onChange={(e) => {
                    if (shouldDisableFields()) return;
                    setDonorDetails({ ...donorDetails, email: e.target.value });
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
              </div>

              {/* Identity Proof */}
              <div className="form-group">
                <label>
                  Identity Proof <span className="required">*</span>
                </label>
                <div className="identity-unified-input">
                  <select
                    value={donorDetails.identityType}
                    onChange={(e) => {
                      if (shouldDisableFields()) return;
                      setDonorDetails({
                        ...donorDetails,
                        identityType: e.target.value,
                        identityNumber: "", // Clear the number when type changes
                      });
                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: "", // Clear validation errors when type changes
                      }));
                    }}
                    disabled={shouldDisableFields()}
                    className={shouldDisableFields() ? "disabled-input" : ""}
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                    <option value="VoterId">Voter ID</option>
                    <option value="DrivingLicense">Driving License</option>
                  </select>
                  <input
                    type="text"
                    value={donorDetails.identityNumber}
                    onChange={(e) => {
                      if (shouldDisableFields()) return;
                      const value = e.target.value;
                      const type = donorDetails.identityType;

                      // Apply validation based on identity type
                      let validatedValue = value;
                      switch (type) {
                        case "Aadhaar":
                          validatedValue = value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 12);
                          break;
                        case "PAN":
                          // Allow both letters and numbers for PAN
                          validatedValue = value
                            .replace(/[^A-Za-z0-9]/g, "")
                            .slice(0, 10)
                            .toUpperCase();
                          break;
                        case "Passport":
                          validatedValue = value
                            .replace(/[^A-Za-z0-9]/g, "")
                            .slice(0, 8)
                            .toUpperCase();
                          break;
                        case "VoterId":
                          validatedValue = value
                            .replace(/[^A-Za-z0-9]/g, "")
                            .slice(0, 10)
                            .toUpperCase();
                          break;
                        case "DrivingLicense":
                          validatedValue = value
                            .replace(/[^A-Za-z0-9]/g, "")
                            .slice(0, 15)
                            .toUpperCase();
                          break;
                        default:
                          validatedValue = value;
                      }

                      setDonorDetails({
                        ...donorDetails,
                        identityNumber: validatedValue,
                      });

                      // Validate the input
                      let error = "";
                      switch (type) {
                        case "Aadhaar":
                          error = validateAadhaar(validatedValue);
                          break;
                        case "PAN":
                          error = validatePAN(validatedValue);
                          break;
                        case "Passport":
                          error = validatePassport(validatedValue);
                          break;
                        case "VoterId":
                          error = validateVoterId(validatedValue);
                          break;
                        case "DrivingLicense":
                          error = validateDrivingLicense(validatedValue);
                          break;
                      }

                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: error,
                      }));
                    }}
                    disabled={shouldDisableFields()}
                    className={`${
                      validationErrors.identityNumber ? "error" : ""
                    } ${shouldDisableFields() ? "disabled-input" : ""}`}
                  />
                </div>
                {validationErrors.identityNumber && (
                  <span className="error-message">
                    {validationErrors.identityNumber}
                  </span>
                )}
              </div>

              {/* Guest House Room No. */}
              <div className="form-group">
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

                    // Call fetchPincodeDetails when pincode length is 6
                    if (value.length === 6) {
                      fetchPincodeDetails(value);
                    }
                  }}
                  disabled={shouldDisableFields()}
                  className={`${shouldDisableFields() ? "disabled-input" : ""}`}
                />
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
                {" "}
                ₹ {calculateTotalDonations().toLocaleString("en-IN")}
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
              <button
                className="print-receipt-btn"
                type="button"
                onClick={handlePrintReceipt}
                disabled={isDonationCompleted(donationData)}
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
            }}
          >
            <h2>Donations Details</h2>
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
                className={`${shouldDisableFields() ? "disabled-input" : ""}`}
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
                onChange={(e) => {
                  if (shouldDisableFields()) return;
                  handleDonationAmountChange(e.target.value);
                }}
                disabled={shouldDisableFields()}
                className={`${validationErrors.amount ? "error" : ""} ${
                  shouldDisableFields() ? "disabled-input" : ""
                }`}
              />
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
                <option value="Electronic Modes">Electronic Modes</option>
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
              <div className="card-header" style={{ margin: "0px" }}>
                <h2>Transaction details</h2>
                <button className="consent-btn">Get Consent</button>
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
        <div className="confirmation-dialog">
          <div className="modal-content">
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
                          ?.bankName || ""}
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
      `}</style>
    </div>
  );
};

export default NewDonation;
