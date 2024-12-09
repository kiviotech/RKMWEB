import React, { useState, useEffect, useRef } from "react";
import "./NewDonation.scss";
import { useAuthStore } from "../../../../store/authStore";
import { useDonationStore } from "../../../../donationStore";
import {
  fetchGuestDetails,
  createNewGuestDetails,
} from "../../../../services/src/services/guestDetailsService";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import {
  createNewDonation,
  fetchDonationsByField,
  updateDonationById,
  fetchDonationById,
} from "../../../../services/src/services/donationsService";
import { useNavigate, useLocation } from "react-router-dom";

const NewDonation = () => {
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
      inMemoryOf: "",
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
          email: guestData.email,
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
            donationType: "", // Set appropriate donation type if available
            amount: donationData.attributes.donationAmount,
            transactionType:
              donationData.attributes.transactionType.toLowerCase(),
            inMemoryOf: donationData.attributes.InMemoryOf,
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
        inMemoryOf: "",
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
    const newDonor = {
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true,
    };

    // Add new donor to the array while preserving existing donors
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
    const pincode =
      addressParts[addressParts.length - 1]?.match(/\d{6}/)?.[0] || "";
    const state = addressParts[addressParts.length - 2] || "";
    const district = addressParts[addressParts.length - 3] || "";
    const streetAddress =
      addressParts.slice(0, addressParts.length - 3).join(", ") || "";

    // Remove the title from the name if it exists at the beginning
    const titleRegex =
      /^(Sri|Smt\.|Mr\.|Mrs\.|Swami|Dr\.|Prof\.|Kumari|Ms\.)\s*/i;
    const nameWithoutTitle = guestData.name.replace(titleRegex, "").trim();

    const donorDetailsData = {
      title: guestData.title || "Sri",
      name: nameWithoutTitle, // Use the name without title
      phoneCode: "+91",
      phone: guestData.phone_number?.replace("+91", "") || "",
      email: guestData.email || "",
      mantraDiksha: guestData.deeksha || "",
      identityType: "Aadhaar",
      identityNumber: guestData.aadhaar_number || "",
      roomNumber: "",
      pincode: pincode,
      houseNumber: "",
      streetName: streetAddress,
      district: district,
      state: state,
      guestId: guest.id,
    };

    handleDonorDetailsUpdate(donorDetailsData);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleTabClick = (tabType) => {
    setSelectedTab(tabType);
    setDonorTabs((prev) => ({
      ...prev,
      [selectedDonor]: tabType,
    }));

    // Generate new receipt number when tab changes
    const newReceiptNumber = generateReceiptNumber(tabType);
    setReceiptNumber(newReceiptNumber);

    // Update current receipt with new receipt number
    if (currentReceipt) {
      const updatedReceipt = {
        ...currentReceipt,
        receiptNumber: newReceiptNumber,
        type: tabType,
      };
      setCurrentReceipt(updatedReceipt);
      addDonation(updatedReceipt);
    }
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
    });

    // Reset receipt and current receipt
    setReceiptNumber("");
    setCurrentReceipt(null);

    // Reset donor tags and selected donor
    setDonorTags([
      {
        id: Date.now(),
        name: "New Donor",
        isNewDonor: true,
      },
    ]);
    setSelectedDonor(Date.now());

    // Reset donation details in the store
    handleDonationDetailsUpdate({
      amount: "",
      transactionType: "",
      inMemoryOf: "",
      transactionDetails: {
        ddNumber: "",
        ddDate: "",
        bankName: "",
        branchName: "",
      },
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
    // Check donation amount first
    if (!currentReceipt?.donationDetails?.amount) {
      setValidationErrors((prev) => ({
        ...prev,
        amount: "Amount is required",
      }));
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

  // Move the API calls to handleConfirmPrint
  const handleConfirmPrint = async () => {
    setShowPrintOptions(true);
  };

  // Add new function to handle print selection
  const handlePrintSelection = async (withStamp) => {
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
            status: "completed",
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
        console.log("Successfully updated donation");
      } else {
        console.log("Creating new donation");
        // Create new guest if needed
        let guestId = donorDetails.guestId;
        if (!guestId) {
          console.log("Creating new guest");
          const guestPayload = {
            data: {
              name: `${donorDetails.title} ${donorDetails.name}`,
              phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
              email: donorDetails.email,
              deeksha: donorDetails.mantraDiksha,
              aadhaar_number: donorDetails.identityNumber,
              address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
            },
          };
          const guestResponse = await createNewGuestDetails(guestPayload);
          guestId = guestResponse.data.id;
          console.log("Created new guest with ID:", guestId);
        }

        // Create receipt details
        console.log("Creating new receipt");
        const receiptPayload = {
          Receipt_number: receiptNumber,
          status: "completed",
          amount: currentReceipt?.donationDetails?.amount,
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
        console.log("Successfully created new donation");
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");

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
                margin-left: 150px;  /* Reduced from 160px to 40px */
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
                  <span>Receipt <b>No. ${receiptNumber}</b></span>
                  <span class="date">Date: <b>${formattedDate}</b></span>
                </div>
                <div class="donor-details">
                  <p>
                    Received with thanks from
                    <b>${donorDetails.title} ${donorDetails.name}</b>
                  </p>
                  ${
                    donorDetails.houseNumber || donorDetails.streetName
                      ? `<p><b>${donorDetails.houseNumber}${
                          donorDetails.streetName
                            ? `, ${donorDetails.streetName}`
                            : ""
                        }</b></p>`
                      : ""
                  }
                  <p><b>PO: ${donorDetails.district || ""}, Dist: ${
        donorDetails.district || ""
      }</b></p>
                  <p><b>State: ${donorDetails.state || ""}, Pin: ${
        donorDetails.pincode || ""
      }</b></p>
                  ${
                    donorDetails.identityType === "PAN"
                      ? `<p><b>PAN: ${donorDetails.identityNumber}</b></p>`
                      : ""
                  }
                </div>
                <div class="payment-details">
                  <p>The sum of Rupees <b>${numberToWords(
                    parseFloat(currentReceipt?.donationDetails?.amount || 0)
                  )} Only</b></p>
                  <p>By ${
                    currentReceipt?.donationDetails?.transactionType || "Cash"
                  }</p>
                  <p>As Donation for ${selectedTab} for Thakur Seva</p>
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

      // Write the content to the new window and trigger print
      printWindow.document.write(receiptContent);
      printWindow.document.close();

      // Reset form and close modals
      resetFormData();
      setIsModalOpen(false);
      setShowPrintOptions(false);
      navigate("/donation");
    } catch (error) {
      console.error("Error processing donation:", error);
      alert("Error processing donation. Please try again.");
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
          const guestPayload = {
            data: {
              name: `${donorDetails.title} ${donorDetails.name}`,
              phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
              email: donorDetails.email,
              deeksha: donorDetails.mantraDiksha,
              aadhaar_number: donorDetails.identityNumber,
              address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
            },
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
          const guestPayload = {
            data: {
              name: `${donorDetails.title} ${donorDetails.name}`,
              phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
              email: donorDetails.email,
              deeksha: donorDetails.mantraDiksha,
              aadhaar_number: donorDetails.identityNumber,
              address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
            },
          };
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
    // Reset donor details to initial state
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
    });

    // Reset current receipt and donation details
    const newReceiptNumber = generateReceiptNumber(selectedTab);
    setReceiptNumber(newReceiptNumber);
    setCurrentReceipt({
      receiptNumber: newReceiptNumber,
      donationDetails: {
        donationType: "",
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

    // Reset donor tags to only show "New Donor"
    const newDonorId = Date.now();
    setDonorTags([
      {
        id: newDonorId,
        name: "New Donor",
        isNewDonor: true,
      },
    ]);
    setSelectedDonor(newDonorId);

    // Reset validation errors
    setValidationErrors({
      name: "",
      phone: "",
      email: "",
      identityNumber: "",
    });
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
    if (!number) return "";
    if (!/^\d{12}$/.test(number)) {
      return "Aadhaar number must be exactly 12 digits";
    }
    return "";
  };

  const validatePAN = (number) => {
    if (!number) {
      return "PAN number is required for donations above ₹10,000";
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
      return "PAN must be in format: ABCDE1234F";
    }
    return "";
  };

  const validatePassport = (number) => {
    if (!number) return "";
    if (!/^[A-Z]{1}[0-9]{7}$/.test(number)) {
      return "Passport must be in format: A1234567";
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
      validationErrors.email
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
              className="link-button"
              onClick={() => navigate("/donation#tomorrows-guests")}
              style={{
                background: "none",
                border: "none",
                color: "#8C52FF",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "500",
                padding: "8px 16px",
                textDecoration: "underline",
                whiteSpace: "nowrap",
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
                className={`tab ${selectedTab === "Math" ? "active" : ""}`}
                onClick={() => handleTabClick("Math")}
                data-tab="Math"
              >
                Math
              </button>
              <button
                className={`tab ${selectedTab === "Mission" ? "active" : ""}`}
                onClick={() => handleTabClick("Mission")}
                data-tab="Mission"
              >
                Mission
              </button>
            </div>

            <div
              style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}
            >
              Receipt Number:{" "}
              <span style={{ color: "#6B7280", fontWeight: "normal" }}>
                {receiptNumber}
              </span>
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
          <div className="details-card donor-details">
            <h2>Donor Details</h2>
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
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={donorDetails.name}
                    onChange={(e) => {
                      // Only allow letters and spaces
                      const newName = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      setDonorDetails({ ...donorDetails, name: newName });
                      setSearchTerm(newName);
                      setShowDropdown(true);
                      const nameError = validateName(newName);
                      setValidationErrors((prev) => ({
                        ...prev,
                        name: nameError,
                      }));
                    }}
                    className={validationErrors.name ? "error" : ""}
                  />
                  {validationErrors.name && (
                    <span className="error-message">
                      {validationErrors.name}
                    </span>
                  )}
                  {showDropdown && searchTerm && filteredGuests.length > 0 && (
                    <div className="search-dropdown">
                      {filteredGuests.map((guest) => (
                        <div
                          key={guest.id}
                          className="dropdown-item"
                          onClick={() => handleGuestSelect(guest)}
                        >
                          <div className="guest-info">
                            <span className="guest-name">
                              {guest.attributes.name}
                            </span>
                            <span className="guest-phone">
                              {guest.attributes.phone_number}
                            </span>
                          </div>
                          <div className="guest-details">
                            <span>{guest.attributes.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  >
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="text"
                    placeholder="9212341902"
                    value={donorDetails.phone}
                    onChange={(e) => {
                      // Only allow numbers and limit to 10 digits
                      const newPhone = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setDonorDetails({ ...donorDetails, phone: newPhone });
                      const phoneError = validatePhone(newPhone);
                      setValidationErrors((prev) => ({
                        ...prev,
                        phone: phoneError,
                      }));
                    }}
                    maxLength={10} // Add maxLength attribute
                    className={validationErrors.phone ? "error" : ""}
                  />
                  {validationErrors.phone && (
                    <span className="error-message">
                      {validationErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Mantra Diksha <span className="required">*</span>
                </label>
                <select
                  className="mantra-diksha-select"
                  value={donorDetails.mantraDiksha}
                  onChange={(e) =>
                    setDonorDetails({
                      ...donorDetails,
                      mantraDiksha: e.target.value,
                    })
                  }
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
                  placeholder="johndoe87@gmail.com"
                  value={donorDetails.email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setDonorDetails({ ...donorDetails, email: newEmail });
                    // Validate email on change
                    const emailError = validateEmail(newEmail);
                    setValidationErrors((prev) => ({
                      ...prev,
                      email: emailError,
                    }));
                  }}
                />
                {validationErrors.email && (
                  <span className="error-message">
                    {validationErrors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Identity Proof <span className="required">*</span>
                </label>
                <div className="identity-unified-input">
                  <select
                    value={donorDetails.identityType}
                    onChange={(e) => {
                      setDonorDetails({
                        ...donorDetails,
                        identityType: e.target.value,
                        identityNumber: "", // Reset number when type changes
                      });
                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: "",
                      }));
                    }}
                  >
                    <option value="">Select ID type</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                  </select>
                  <input
                    type="text"
                    placeholder={
                      donorDetails.identityType === "Aadhaar"
                        ? "12 digit number"
                        : donorDetails.identityType === "PAN"
                        ? "ABCDE1234F"
                        : donorDetails.identityType === "Passport"
                        ? "A1234567"
                        : "Enter ID number"
                    }
                    value={donorDetails.identityNumber}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Apply specific formatting based on ID type
                      switch (donorDetails.identityType) {
                        case "Aadhaar":
                          value = value.replace(/\D/g, "").slice(0, 12);
                          break;
                        case "PAN":
                          value = value.toUpperCase().slice(0, 10);
                          break;
                        case "Passport":
                          value = value.toUpperCase().slice(0, 8);
                          break;
                      }

                      setDonorDetails({
                        ...donorDetails,
                        identityNumber: value,
                      });

                      // Validate based on ID type
                      let error = "";
                      switch (donorDetails.identityType) {
                        case "Aadhaar":
                          error = validateAadhaar(value);
                          break;
                        case "PAN":
                          error = validatePAN(value);
                          break;
                        case "Passport":
                          error = validatePassport(value);
                          break;
                      }

                      setValidationErrors((prev) => ({
                        ...prev,
                        identityNumber: error,
                      }));
                    }}
                    className={validationErrors.identityNumber ? "error" : ""}
                  />
                </div>
                {validationErrors.identityNumber && (
                  <span className="error-message">
                    {validationErrors.identityNumber}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Guest House Room No.</label>
                <input
                  type="text"
                  placeholder="Enter Room No. (Optional)"
                  value={donorDetails.roomNumber}
                  onChange={(e) =>
                    setDonorDetails({
                      ...donorDetails,
                      roomNumber: e.target.value,
                    })
                  }
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
                  placeholder="560041"
                  value={donorDetails.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setDonorDetails({ ...donorDetails, pincode: value });
                    if (value.length === 6) {
                      fetchPincodeDetails(value);
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={donorDetails.state}
                  onChange={(e) =>
                    setDonorDetails({ ...donorDetails, state: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  District <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter district"
                  value={donorDetails.district}
                  onChange={(e) =>
                    setDonorDetails({
                      ...donorDetails,
                      district: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Fourth row with House Number and Street Name */}
            <div className="form-row">
              <div className="form-group">
                <label>House Number</label>
                <input
                  type="text"
                  placeholder="Enter house number"
                  value={donorDetails.houseNumber}
                  onChange={(e) =>
                    setDonorDetails({
                      ...donorDetails,
                      houseNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Streetname</label>
                <input
                  type="text"
                  placeholder="Enter street name"
                  value={donorDetails.streetName}
                  onChange={(e) =>
                    setDonorDetails({
                      ...donorDetails,
                      streetName: e.target.value,
                    })
                  }
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
              {/* <button
                className="cancel-btn"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button> */}
              <button
                className="pending-btn"
                type="button"
                onClick={handlePending}
              >
                Pending
              </button>
              <button
                className="print-receipt-btn"
                type="button"
                onClick={handlePrintReceipt}
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
                      return (
                        <tr key={donation.id}>
                          <td>
                            {new Date(
                              attributes.createdAt
                            ).toLocaleDateString()}
                          </td>
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
          <div className="details-card donation-details">
            <h2>Donations Details</h2>
            <div className="form-group">
              <label>
                Purpose <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter donation purpose"
                value={currentReceipt?.donationDetails?.donationType || ""}
                onChange={(e) => {
                  handleDonationDetailsUpdate({
                    donationType: e.target.value,
                  });
                  setValidationErrors((prev) => ({
                    ...prev,
                    purpose: e.target.value ? "" : "Purpose is required",
                  }));
                }}
                className={validationErrors.purpose ? "error" : ""}
              />
              {validationErrors.purpose && (
                <span className="error-message">
                  {validationErrors.purpose}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>
                Donation Amount <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the amount"
                value={currentReceipt?.donationDetails?.amount || ""}
                onChange={(e) => handleDonationAmountChange(e.target.value)}
                className={validationErrors.amount ? "error" : ""}
              />
              {validationErrors.amount && (
                <span className="error-message">{validationErrors.amount}</span>
              )}
            </div>
            {showPANField && (
              <div className="form-group">
                <label>
                  PAN Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
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
                  const newType = e.target.value;
                  handleDonationDetailsUpdate({
                    ...currentReceipt?.donationDetails,
                    transactionType: newType,
                  });
                }}
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="DD">DD</option>
                <option value="M.O">M.O</option>
                <option value="Electronic Modes">Electronic Modes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Donations Type</label>
              <select
                value={currentReceipt?.donationDetails?.inMemoryOf || ""}
                onChange={(e) => {
                  handleDonationDetailsUpdate({
                    inMemoryOf: e.target.value,
                  });
                }}
              >
                <option value="">Select option</option>
                <option value="Others (Revenue)">Others (Revenue)</option>
                <option value="CORPUS">CORPUS</option>
              </select>
            </div>
          </div>

          {showTransactionDetails && (
            <div className="details-card transaction-details">
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
                  onChange={(e) =>
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddDate: e.target.value,
                      },
                    })
                  }
                  className={transactionValidationErrors.ddDate ? "error" : ""}
                />
                {transactionValidationErrors.ddDate && (
                  <span className="error-message">
                    {transactionValidationErrors.ddDate}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>
                  DD/CH Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="DD/CH number"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.ddNumber || ""
                  }
                  onChange={(e) =>
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddNumber: e.target.value,
                      },
                    })
                  }
                  className={
                    transactionValidationErrors.ddNumber ? "error" : ""
                  }
                />
                {transactionValidationErrors.ddNumber && (
                  <span className="error-message">
                    {transactionValidationErrors.ddNumber}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.bankName || ""
                  }
                  onChange={(e) =>
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        bankName: e.target.value,
                      },
                    })
                  }
                  className={
                    transactionValidationErrors.bankName ? "error" : ""
                  }
                />
                {transactionValidationErrors.bankName && (
                  <span className="error-message">
                    {transactionValidationErrors.bankName}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Branch Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter branch name"
                  value={
                    currentReceipt?.donationDetails?.transactionDetails
                      ?.branchName || ""
                  }
                  onChange={(e) =>
                    handleDonationDetailsUpdate({
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        branchName: e.target.value,
                      },
                    })
                  }
                  className={
                    transactionValidationErrors.branchName ? "error" : ""
                  }
                />
                {transactionValidationErrors.branchName && (
                  <span className="error-message">
                    {transactionValidationErrors.branchName}
                  </span>
                )}
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
                    Receipt No: <strong>{receiptNumber}</strong>
                  </span>
                  <span>
                    Date: <strong>{new Date().toLocaleDateString()}</strong>
                  </span>
                </div>
              </div>
              <div className="receipt-body">
                <div className="receipt-thanks">
                  <p>Received with thanks from </p>
                  <div className="receipt-address">
                    <p>
                      <strong>{`${donorDetails.title} ${donorDetails.name}`}</strong>
                      {(donorDetails.houseNumber ||
                        donorDetails.streetName) && (
                        <p>
                          {donorDetails.houseNumber}
                          {donorDetails.streetName &&
                            `, ${donorDetails.streetName}`}
                        </p>
                      )}
                      {(donorDetails.district ||
                        donorDetails.state ||
                        donorDetails.pincode) && (
                        <p>
                          {donorDetails.district &&
                            `PO: ${donorDetails.district}, `}
                          {donorDetails.district &&
                            `Dist: ${donorDetails.district}, `}
                          {donorDetails.state &&
                            `State: ${donorDetails.state}, `}
                          {donorDetails.pincode &&
                            `Pin: ${donorDetails.pincode}`}
                        </p>
                      )}
                      {donorDetails.identityType === "PAN" &&
                        donorDetails.identityNumber && (
                          <p>PAN: {donorDetails.identityNumber}</p>
                        )}
                    </p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p>The sum of Rupees: </p>
                  <div style={{ paddingLeft: "20px" }} className="amt">
                    <p>
                      {numberToWords(
                        parseFloat(currentReceipt?.donationDetails?.amount || 0)
                      )}{" "}
                      Only
                    </p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p>By transaction type: </p>
                  <p style={{ paddingLeft: "20px" }}>
                    {currentReceipt?.donationDetails?.transactionType || "Cash"}
                    {currentReceipt?.donationDetails?.transactionType?.toLowerCase() !==
                      "cash" && (
                      <span>
                        {" "}
                        (
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.ddNumber &&
                          `No: ${currentReceipt.donationDetails.transactionDetails.ddNumber}, `}
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.ddDate &&
                          `Date: ${new Date(
                            currentReceipt.donationDetails.transactionDetails.ddDate
                          ).toLocaleDateString()}, `}
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.bankName &&
                          `Bank: ${currentReceipt.donationDetails.transactionDetails.bankName}, `}
                        {currentReceipt?.donationDetails?.transactionDetails
                          ?.branchName &&
                          `Branch: ${currentReceipt.donationDetails.transactionDetails.branchName}`}
                        )
                      </span>
                    )}
                  </p>
                </div>
                <div className="receipt-amt">
                  <p>As Donation for: </p>
                  <p style={{ paddingLeft: "20px" }}>
                    {currentReceipt?.donationDetails?.donationType || ""}
                    {selectedTab}
                  </p>
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
            <div className="print">
              <button
                className="cancel-button"
                onClick={() => {
                  setIsModalOpen(false);
                  setShowPrintOptions(false);
                }}
              >
                Cancel
              </button>
              <div className="print-dropdown-container">
                <button
                  className="confirm-print-button"
                  onClick={() => setShowPrintOptions(!showPrintOptions)}
                >
                  Confirm & Print
                  <span className="dropdown-arrow">▼</span>
                </button>
                {showPrintOptions && (
                  <div className="print-options-dropdown">
                    <button onClick={() => handlePrintSelection(true)}>
                      Print with Stamp
                    </button>
                    <button onClick={() => handlePrintSelection(false)}>
                      Print without Stamp
                    </button>
                  </div>
                )}
              </div>
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
    </div>
  );
};

export default NewDonation;
