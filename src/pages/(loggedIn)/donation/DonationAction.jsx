import "./DonationAction.scss";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewGuestDetails } from "../../../../services/src/services/guestDetailsService";
import {
  createNewDonation,
  updateDonationById,
} from "../../../../services/src/services/donationsService";
import { useEffect, useState } from "react";
import ReceiptPreviewModal from "./ReceiptPreviewModal";
import { loginUser } from "../../../../services/auth";
import ConsentLetterTemplate from "./ConsentLetterTemplate";
import ThankLetterTemplate from "./ThankLetterTemplate";
import ReceiptTemplate from "./ReceiptTemplate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DonationAction = ({
  totalAmount = 0,
  activeTab,
  transactionType,
  onDonationSuccess,
}) => {
  const { donorTabs, activeTabId, setFieldErrors, updateDonationDetails } =
    useDonationStore();
  const { user } = useAuthStore();
  const currentSection = activeTab.toLowerCase();
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [uniqueNumbers, setUniqueNumbers] = useState([]);
  const [showPendingConfirmation, setShowPendingConfirmation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const validateFields = () => {
    const errors = {
      donor: {},
      donation: {},
      transaction: {},
    };
    const missingFields = [];

    // Get current tab and section details
    const currentTab = donorTabs[activeTabId];
    const donorDetails = currentTab[currentSection].donorDetails;
    const donationDetails = currentTab[currentSection].donationDetails;
    const transactionDetails = currentTab[currentSection].transactionDetails;

    // Amount validation
    if (!donationDetails.amount) {
      missingFields.push("Donation Amount");
      errors.donation.amount = "Amount is required";
    } else if (parseFloat(donationDetails.amount) <= 0) {
      missingFields.push("Donation Amount (must be greater than 0)");
      errors.donation.amount = "Amount must be greater than 0";
    }

    // Phone number validation
    if (!donorDetails.phone) {
      missingFields.push("Phone Number");
      errors.donor.phone = "Phone number is required";
    } else if (donorDetails.phone.length !== 10) {
      missingFields.push("Phone Number (must be 10 digits)");
      errors.donor.phone = `Phone number must be 10 digits (currently: ${donorDetails.phone.length})`;
    }

    // Identity proof validation with specific format checks
    if (!donorDetails.identityNumber) {
      missingFields.push("Identity Proof");
      errors.donor.identityNumber = "Identity proof is required";
    } else {
      // Add format validation based on identity type
      const identityError = validateIdentityNumber(
        donorDetails.identityType,
        donorDetails.identityNumber
      );
      if (identityError) {
        missingFields.push(`Identity Proof Format: ${identityError}`);
        errors.donor.identityNumber = identityError;
      }
    }

    // Donor Details validation
    if (!donorDetails.name) {
      missingFields.push("Name of Donor");
      errors.donor.name = "Name is required";
    }
    if (!donorDetails.pincode) {
      missingFields.push("Pincode");
      errors.donor.pincode = "Pincode is required";
    } else if (donorDetails.pincode.length !== 6) {
      missingFields.push("Pincode (must be 6 digits)");
      errors.donor.pincode = "Pincode must be 6 digits";
    } else if (
      !donorDetails.state ||
      !donorDetails.district ||
      !donorDetails.postOffice
    ) {
      missingFields.push("Invalid Pincode (unable to fetch location details)");
      errors.donor.pincode = "Invalid pincode - location details not found";
    }
    if (!donorDetails.deeksha || donorDetails.deeksha === "") {
      missingFields.push("Mantra Diksha");
      errors.donor.deeksha = "Mantra Diksha is required";
    }
    if (donorDetails.deeksha === "Others" && !donorDetails.otherDeeksha) {
      missingFields.push("Other Mantra Diksha Details");
      errors.donor.otherDeeksha = "Please specify Mantra Diksha";
    }

    // Donation Details validation
    if (!donationDetails.purpose) {
      missingFields.push("Purpose");
      errors.donation.purpose = "Purpose is required";
    }
    if (!donationDetails.donationType) {
      missingFields.push("Donation Type");
      errors.donation.donationType = "Donation type is required";
    }

    // Transaction Details validation if applicable
    if (["Cheque", "Bank Transfer", "DD"].includes(transactionType)) {
      if (!transactionDetails.date) {
        missingFields.push("Transaction Date");
        errors.transaction.date = "Date is required";
      }
      if (!transactionDetails.transactionId) {
        missingFields.push("Transaction Number");
        errors.transaction.transactionId = "Transaction number is required";
      }
      if (!transactionDetails.bankName) {
        missingFields.push("Bank Name");
        errors.transaction.bankName = "Bank name is required";
      }
    }

    // Set all errors in the store
    setFieldErrors(errors);

    const hasErrors = missingFields.length > 0;

    if (hasErrors) {
      alert(
        `Please correct the following issues:\n${missingFields.join("\n")}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    return true;
  };

  // Helper function to validate identity number format
  const validateIdentityNumber = (type, value) => {
    switch (type) {
      case "Aadhaar":
        if (!/^\d{12}$/.test(value)) {
          return "Aadhaar number must be exactly 12 digits";
        }
        break;
      case "PAN Card":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          return "Invalid PAN format (must be like ABCDE1234F)";
        }
        break;
      case "Voter ID":
        if (!/^[A-Z]{3}[0-9]{7}$/.test(value)) {
          return "Invalid Voter ID format (must be like ABC1234567)";
        }
        break;
      case "Passport":
        if (!/^[A-Z]{1}[0-9]{7}$/.test(value)) {
          return "Invalid Passport format (must be like A1234567)";
        }
        break;
      case "Driving License":
        if (!/^[A-Z]{2}[0-9]{13}$/.test(value)) {
          return "Invalid Driving License format (must be like DL0420160000000)";
        }
        break;
    }
    return "";
  };

  const createReceipt = async (status) => {
    if (!validateFields()) return;

    const currentTab = donorTabs[activeTabId];
    const currentDonorDetails = currentTab[currentSection].donorDetails;
    const currentDonationDetails = currentTab[currentSection].donationDetails;
    const currentTransactionDetails =
      currentTab[currentSection].transactionDetails;

    try {
      // Create receipt first
      const receiptResponse = await createNewReceiptDetail({
        Receipt_number: currentTab.receiptNumbers[currentSection],
        donation_date: new Date().toISOString().split("T")[0],
        createdby: user?.id,
        counter: user?.counter,
        status: status,
      });

      // Track if a new guest was created
      let isNewGuest = false;
      let guestId = currentDonorDetails.guestId;

      if (!guestId) {
        const guestResponse = await createNewGuestDetails({
          name: `${currentDonorDetails.title} ${currentDonorDetails.name}`,
          phone_number: currentDonorDetails.phone,
          deeksha:
            currentDonorDetails.deeksha === "Others"
              ? currentDonorDetails.otherDeeksha
              : currentDonorDetails.deeksha,
          email: currentDonorDetails.email,
          identity_proof: currentDonorDetails.identityType,
          identity_number: currentDonorDetails.identityNumber,
          unique_no: currentTab.uniqueNo,
          address: [
            currentDonorDetails.flatNo,
            currentDonorDetails.streetName,
            currentDonorDetails.postOffice,
            currentDonorDetails.district,
            currentDonorDetails.state,
            currentDonorDetails.pincode,
          ]
            .filter(Boolean)
            .join(", "),
        });
        guestId = guestResponse.data.id;
        isNewGuest = true;
      }

      // Map the currentSection to accepted donationFor values
      const donationForMapping = {
        math: "Math",
        mission: "Mission",
      };

      // Create donation with the appropriate guestId
      const donationData = {
        data: {
          guest: guestId,
          receipt_detail: receiptResponse.data.id,
          donationAmount: currentDonationDetails.amount,
          transactionType: transactionType,
          donationFor: donationForMapping[currentSection],
          InMemoryOf: currentDonationDetails.inMemoryOf,
          status: status,
          purpose: currentDonationDetails.purpose,
          type: currentDonationDetails.donationType,
        },
      };

      // Add bank-related fields only for Cheque, Bank Transfer, or DD
      if (["Cheque", "Bank Transfer", "DD"].includes(transactionType)) {
        donationData.data = {
          ...donationData.data,
          bankName: currentTransactionDetails?.bankName || "",
          branchName: currentTransactionDetails?.branchName || "",
          ddch_date: currentTransactionDetails?.date || "",
          ddch_number: currentTransactionDetails?.transactionId || "",
        };
      }

      console.log("Donation data with IDs:", donationData);
      await createNewDonation(donationData);

      // alert(
      //   `Receipt ${
      //     status === "pending" ? "saved as pending" : "created"
      //   } successfully!`
      // );

      // If this was a new guest, trigger a refresh of the donor details
      if (isNewGuest) {
        // You can either emit an event or call a refresh function directly
        const event = new CustomEvent("refreshDonorDetails");
        window.dispatchEvent(event);
      }

      return receiptResponse;
    } catch (error) {
      console.error(
        "Error creating receipt, guest details, or donation:",
        error
      );
      alert("Failed to create receipt. Please try again.");
      throw error;
    }
  };

  const handlePrintReceipt = () => {
    const currentTab = donorTabs[activeTabId];
    const currentDonationDetails = currentTab[currentSection].donationDetails;
    const amount = parseFloat(currentDonationDetails.amount) || 0;

    if (amount <= 0) {
      alert("Donation amount must be greater than 0");
      return;
    }

    if (!validateFields()) return;

    setReceiptData({
      receiptNumber: currentTab.receiptNumbers[currentSection],
      uniqueNo: currentTab.uniqueNo,
      date: new Date().toLocaleDateString(),
      donorName: `${currentTab[currentSection].donorDetails.title} ${currentTab[currentSection].donorDetails.name}`,
      address: {
        flatNo: currentTab[currentSection].donorDetails.flatNo,
        postOffice: currentTab[currentSection].donorDetails.postOffice,
        district: currentTab[currentSection].donorDetails.district,
        state: currentTab[currentSection].donorDetails.state,
        pincode: currentTab[currentSection].donorDetails.pincode,
      },
      transactionType: transactionType,
      donationType: currentDonationDetails.donationType,
      amount: amount.toFixed(2),
      purpose: currentDonationDetails.purpose,
      otherPurpose: currentDonationDetails.specifiedPurpose,
      identityType: currentTab[currentSection].donorDetails.identityType,
      identityNumber: currentTab[currentSection].donorDetails.identityNumber,
      inMemoryOf: currentDonationDetails.inMemoryOf,
      transactionDetails: {
        date: currentTab[currentSection].transactionDetails.date,
        transactionId:
          currentTab[currentSection].transactionDetails.transactionId,
        bankName: currentTab[currentSection].transactionDetails.bankName,
        branchName: currentTab[currentSection].transactionDetails.branchName,
      },
      user: {
        username: user?.username,
        counter: user?.counter?.replace("Counter ", ""),
      },
    });

    setShowReceiptPreview(true);
  };

  const handleConfirmPrint = async () => {
    try {
      // Get current tab and donation details
      const currentTab = donorTabs[activeTabId];
      const currentDonationId =
        currentTab[currentSection]?.donationDetails?.donationId;
      const currentStatus = currentTab[currentSection]?.donationDetails?.status;

      console.log("Current donation details:", {
        donationId: currentDonationId,
        status: currentStatus,
        section: currentSection,
        tab: currentTab,
      });

      if (currentStatus === "pending" && currentDonationId) {
        console.log(
          "Attempting to update pending donation:",
          currentDonationId
        );

        // Update donation status in the database
        const updateResponse = await updateDonationById(currentDonationId, {
          data: {
            status: "completed",
            // Include any other required fields that might be needed
            updatedAt: new Date().toISOString(),
          },
        });

        console.log("Update response:", updateResponse);

        if (!updateResponse || !updateResponse.data) {
          throw new Error("Failed to get response from update operation");
        }

        // Update status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "completed",
        });

        console.log("Store updated successfully");
      } else {
        console.log("Creating new receipt as donation is not pending");
        await createReceipt("completed");
      }

      setShowReceiptPreview(false);

      // Call the success callback
      onDonationSuccess?.();

      // Fetch new receipt numbers
      const { fetchLatestReceiptNumbers } = useDonationStore.getState();
      await fetchLatestReceiptNumbers();

      // Remove the current tab after successful printing
      const { removeDonorTab } = useDonationStore.getState();
      removeDonorTab(activeTabId);
    } catch (error) {
      console.error("Error in handleConfirmPrint:", error);
      alert(`Failed to process donation: ${error.message}`);
    }
  };

  const handlePending = () => {
    const currentTab = donorTabs[activeTabId];
    const currentDonationDetails = currentTab[currentSection].donationDetails;
    const amount = parseFloat(currentDonationDetails.amount) || 0;

    if (amount <= 0) {
      alert("Donation amount must be greater than 0");
      return;
    }

    // First validate fields before showing confirmation
    if (!validateFields()) return;

    setShowPendingConfirmation(true);
  };

  const handleConfirmPending = async () => {
    try {
      setShowPendingConfirmation(false);

      // Validate fields again just to be safe
      if (!validateFields()) return;

      // Get current tab and donation details
      const currentTab = donorTabs[activeTabId];
      const currentDonationId =
        currentTab[currentSection]?.donationDetails?.donationId;

      console.log("Setting donation to pending:", {
        donationId: currentDonationId,
        section: currentSection,
        tab: currentTab,
      });

      if (currentDonationId) {
        // Update existing donation status to pending
        const updateResponse = await updateDonationById(currentDonationId, {
          data: {
            status: "pending",
            updatedAt: new Date().toISOString(),
          },
        });

        console.log("Update response:", updateResponse);

        if (!updateResponse || !updateResponse.data) {
          throw new Error("Failed to update donation status");
        }

        // Update the donation status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "pending",
        });
      } else {
        // Create new donation with pending status if no donation ID exists
        console.log(
          "No existing donation found, creating new pending donation"
        );
        const receiptResponse = await createReceipt("pending");
        console.log("New pending receipt created:", receiptResponse);

        // Update store with new donation details
        updateDonationDetails(activeTabId, currentSection, {
          status: "pending",
          donationId: receiptResponse?.data?.id,
        });
      }

      // Call the success callback
      onDonationSuccess?.();

      // Fetch new receipt numbers
      const { fetchLatestReceiptNumbers } = useDonationStore.getState();
      await fetchLatestReceiptNumbers();

      // Remove the current tab after successful operation
      const { removeDonorTab } = useDonationStore.getState();
      removeDonorTab(activeTabId);
    } catch (error) {
      console.error("Error handling pending donation:", error);
      alert(`Failed to process pending donation: ${error.message}`);
    }
  };

  const handleCancelClick = () => {
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  const handleCancelDonation = async () => {
    try {
      // Get the current donation ID from the store
      const currentTab = donorTabs[activeTabId];
      const donationId =
        currentTab[currentSection]?.donationDetails?.donationId;

      console.log("Cancelling donation with ID:", donationId);

      // Verify password using stored username
      await loginUser({
        identifier: user.username,
        password: password,
      });

      // If password verification succeeds, proceed with cancellation
      if (donationId) {
        await updateDonationById(donationId, {
          data: {
            status: "cancelled",
          },
        });

        // Update the donation status in the store
        updateDonationDetails(activeTabId, currentSection, {
          status: "cancelled",
        });

        // Close modal and reset states
        setShowPasswordModal(false);
        setPassword("");
        setPasswordError("");

        // Add success toast notification
        toast.success("Donation cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Remove the tab from the store
        const { removeDonorTab } = useDonationStore.getState();
        removeDonorTab(activeTabId);
      } else {
        console.error("No donation ID found");
        setPasswordError("Unable to cancel donation: No donation ID found");
      }
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("Invalid password or unable to cancel donation");
    }
  };

  const renderPasswordModal = () => {
    return (
      <div
        className="modal-overlay"
        style={{
          display: showPasswordModal ? "flex" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
          }}
        >
          <h3>Enter Password to Confirm</h3>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCancelDonation();
                }
              }}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "10px",
                paddingRight: "35px",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
                marginTop: "3px",
              }}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                </svg>
              )}
            </span>
          </div>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassword("");
                setPasswordError("");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#gray",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCancelDonation}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ea7704",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleConsentLetter = () => {
    // Add number to words conversion function
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

      if (num === 0) return "Zero";

      const convert = (num) => {
        if (num < 100) return formatTens(num);
        if (num < 1000)
          return (
            single[Math.floor(num / 100)] +
            " Hundred" +
            (num % 100 ? " and " + formatTens(num % 100) : "")
          );
        if (num < 100000)
          return (
            convert(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 ? " " + convert(num % 1000) : "")
          );
        if (num < 10000000)
          return (
            convert(Math.floor(num / 100000)) +
            " Lakh" +
            (num % 100000 ? " " + convert(num % 100000) : "")
          );
        return (
          convert(Math.floor(num / 10000000)) +
          " Crore" +
          (num % 10000000 ? " " + convert(num % 10000000) : "")
        );
      };

      return convert(Math.floor(num)) + " Rupees Only";
    };

    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const amount =
      parseFloat(
        donorTabs[activeTabId][currentSection].donationDetails.amount
      ) || 0;

    // Create the HTML content without the automatic print trigger
    const htmlContent = ConsentLetterTemplate({
      donationData: {
        donationDate: new Date().toISOString(),
        uniqueDonorId: donorTabs[activeTabId].uniqueNo,
        amount: amount,
        transactionType,
        donationType:
          donorTabs[activeTabId][currentSection].donationDetails.donationType,
        purpose: donorTabs[activeTabId][currentSection].donationDetails.purpose,
        title: donorTabs[activeTabId][currentSection].donorDetails.title,
        name: donorTabs[activeTabId][currentSection].donorDetails.name,
        houseNumber: donorTabs[activeTabId][currentSection].donorDetails.flatNo,
        streetName:
          donorTabs[activeTabId][currentSection].donorDetails.streetName,
        postOffice:
          donorTabs[activeTabId][currentSection].donorDetails.postOffice,
        district: donorTabs[activeTabId][currentSection].donorDetails.district,
        state: donorTabs[activeTabId][currentSection].donorDetails.state,
        pincode: donorTabs[activeTabId][currentSection].donorDetails.pincode,
        phone: donorTabs[activeTabId][currentSection].donorDetails.phone,
        inMemoryOf:
          donorTabs[activeTabId][currentSection].donationDetails.inMemoryOf,
        receiptNumber: donorTabs[activeTabId].receiptNumbers[currentSection],
      },
      formatDate: (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN"),
      numberToWords: numberToWords,
    });

    // Remove any existing print script from the content
    const contentWithoutPrintScript = htmlContent.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

    // Write the content to the iframe
    printFrame.contentDocument.write(contentWithoutPrintScript);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  const handleThankLetter = () => {
    // Add number to words conversion function
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

      if (num === 0) return "Zero";

      const convert = (num) => {
        if (num < 100) return formatTens(num);
        if (num < 1000)
          return (
            single[Math.floor(num / 100)] +
            " Hundred" +
            (num % 100 ? " and " + formatTens(num % 100) : "")
          );
        if (num < 100000)
          return (
            convert(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 ? " " + convert(num % 1000) : "")
          );
        if (num < 10000000)
          return (
            convert(Math.floor(num / 100000)) +
            " Lakh" +
            (num % 100000 ? " " + convert(num % 100000) : "")
          );
        return (
          convert(Math.floor(num / 10000000)) +
          " Crore" +
          (num % 10000000 ? " " + convert(num % 10000000) : "")
        );
      };

      return convert(Math.floor(num)) + " Rupees Only";
    };

    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const amount =
      parseFloat(
        donorTabs[activeTabId][currentSection].donationDetails.amount
      ) || 0;

    // Create the HTML content without the automatic print trigger
    const htmlContent = ThankLetterTemplate({
      donationData: {
        donationDate: new Date().toISOString(),
        uniqueDonorId: donorTabs[activeTabId].uniqueNo,
        amount: amount,
        transactionType,
        donationType:
          donorTabs[activeTabId][currentSection].donationDetails.donationType,
        purpose: donorTabs[activeTabId][currentSection].donationDetails.purpose,
        title: donorTabs[activeTabId][currentSection].donorDetails.title,
        name: donorTabs[activeTabId][currentSection].donorDetails.name,
        houseNumber: donorTabs[activeTabId][currentSection].donorDetails.flatNo,
        streetName:
          donorTabs[activeTabId][currentSection].donorDetails.streetName,
        postOffice:
          donorTabs[activeTabId][currentSection].donorDetails.postOffice,
        district: donorTabs[activeTabId][currentSection].donorDetails.district,
        state: donorTabs[activeTabId][currentSection].donorDetails.state,
        pincode: donorTabs[activeTabId][currentSection].donorDetails.pincode,
        phone: donorTabs[activeTabId][currentSection].donorDetails.phone,
        inMemoryOf:
          donorTabs[activeTabId][currentSection].donationDetails.inMemoryOf,
        receiptNumber: donorTabs[activeTabId].receiptNumbers[currentSection],
      },
      formatDate: (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN"),
      numberToWords: numberToWords,
    });

    // Remove any existing print script from the content
    const contentWithoutPrintScript = htmlContent.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

    // Write the content to the iframe
    printFrame.contentDocument.write(contentWithoutPrintScript);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  const handlePrint = () => {
    if (!validateFields()) return;

    // Generate receipt content
    const receiptContent = ReceiptTemplate({
      receiptData: {
        ...receiptData,
        user: {
          username: user?.username,
          counter: user?.counter?.replace("Counter ", ""),
        },
      },
    });

    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Write the content to the iframe
    printFrame.contentDocument.write(receiptContent);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  // Calculate total amount including completed donations
  const calculatedTotalAmount = () => {
    const currentDonationDetails =
      donorTabs[activeTabId]?.[currentSection]?.donationDetails;

    if (!currentDonationDetails) return 0;

    // Parse the amount, defaulting to 0 if invalid
    const amount = parseFloat(currentDonationDetails.amount) || 0;
    return amount;
  };

  // Add check for completed status
  const isCompleted =
    donorTabs[activeTabId][currentSection]?.donationDetails?.status ===
    "completed";

  return (
    <>
      <ToastContainer />
      <div className="donation-action-bar">
        <div className="donation-total-amount">
          <span>Total Donation Amount</span>
          <span>₹ {calculatedTotalAmount().toFixed(2)}</span>
        </div>

        <div className="donation-actions">
          <button
            className="donation-action-btn consent-letter"
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 1 : 0.7,
              cursor: isCompleted ? "pointer" : "not-allowed",
            }}
            disabled={!isCompleted}
            onClick={handleConsentLetter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            Consent Letter
          </button>

          <button
            className="donation-action-btn thank-letter"
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 1 : 0.7,
              cursor: isCompleted ? "pointer" : "not-allowed",
            }}
            disabled={!isCompleted}
            onClick={handleThankLetter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Thanks Letter
          </button>

          <button
            className="donation-action-btn pending"
            style={{
              border: "1px solid #ccc",
              opacity: isCompleted ? 0.7 : 1,
              cursor: isCompleted ? "not-allowed" : "pointer",
            }}
            onClick={handlePending}
            disabled={isCompleted}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pending
          </button>

          <button
            className="donation-action-btn print-receipt"
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isCompleted ? "#fc5275" : "#8b5cf6",
              backgroundColor: isCompleted ? "#ffbdcb" : "#8b5cf6",
              color: isCompleted ? "#fc5275" : "#fff",
            }}
            onClick={isCompleted ? handleCancelClick : handlePrintReceipt}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isCompleted ? (
                <>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </>
              ) : (
                <>
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <path d="M6 14h12v8H6z" />
                </>
              )}
            </svg>
            {isCompleted ? "Cancel" : "Print Receipt"}
          </button>
        </div>
      </div>

      <ReceiptPreviewModal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        receiptData={receiptData}
        onConfirmPrint={handleConfirmPrint}
      />

      {/* Add Pending Confirmation Modal */}
      {showPendingConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
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
            <h2 style={{ fontWeight: 500, fontSize: "1.2rem" }}>
              Are you sure you want to keep this Donation in pending?
            </h2>
            <p>
              Once confirmed, the action will be final and cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPendingConfirmation(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirmPending}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {renderPasswordModal()}
    </>
  );
};

export default DonationAction;
