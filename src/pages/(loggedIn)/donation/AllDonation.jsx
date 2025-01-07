import React, { useState, useEffect } from "react";
import {
  fetchDonations,
  updateDonationById,
} from "../../../../services/src/services/donationsService";
import "./AllDonation.scss";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../services/auth";
import { useAuthStore } from "../../../../store/authStore";
import useDonationStore from "../../../../donationStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllDonation = ({
  searchTerm = "",
  dateRange = {},
  selectedStatus = "ALL",
  donatedFor = "ALL",
  currentPage = 1,
  itemsPerPage = 10,
  setTotalPages = () => {}, // Provide default empty function
  filterOptions = {
    receiptNumber: true,
    donorName: true,
    donationDate: true,
    phoneNumber: true,
    donatedFor: true,
    donationStatus: true,
    donationAmount: true,
    action: true,
  },
}) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const user = useAuthStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await fetchDonations();
        console.log("Raw API Response:", response);
        console.log("Donations Data:", response.data);
        setDonations(response.data || []);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const filteredDonations = donations.filter((donation) => {
    const searchString = (searchTerm || "").toLowerCase();
    const donationDate =
      donation.attributes.receipt_detail?.data?.attributes?.donation_date ||
      donation.attributes.updatedAt;

    // Search term filter
    const matchesSearch =
      donation.attributes.guest?.data?.attributes?.name
        ?.toLowerCase()
        .includes(searchString) ||
      donation.attributes.guest?.data?.attributes?.phone_number?.includes(
        searchString
      );

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const donationDateTime = new Date(donationDate).setHours(0, 0, 0, 0);
      const startDateTime = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const endDateTime = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      matchesDateRange =
        donationDateTime >= startDateTime && donationDateTime <= endDateTime;
    }

    // Updated status filter
    const matchesStatus =
      selectedStatus === "ALL" ||
      donation.attributes.status.toUpperCase() === selectedStatus;

    // Add donatedFor filter
    const matchesDonatedFor =
      donatedFor === "ALL" ||
      donation.attributes.donationFor?.toUpperCase() === donatedFor;

    return (
      matchesSearch && matchesDateRange && matchesStatus && matchesDonatedFor
    );
  });

  // Calculate total pages whenever filtered data changes
  useEffect(() => {
    if (filteredDonations && typeof setTotalPages === "function") {
      const total = Math.ceil(filteredDonations.length / itemsPerPage);
      setTotalPages(total);
    }
  }, [filteredDonations, itemsPerPage, setTotalPages]);

  // Add logging for filtered donations
  useEffect(() => {
    console.log("Current Filters:", {
      searchTerm,
      dateRange,
      selectedStatus,
      donatedFor,
      currentPage,
      itemsPerPage,
    });
    console.log("Filtered Donations:", filteredDonations);
  }, [
    filteredDonations,
    searchTerm,
    dateRange,
    selectedStatus,
    donatedFor,
    currentPage,
    itemsPerPage,
  ]);

  // Get current page data
  const getCurrentPageData = () => {
    // Sort donations by date in descending order (newest first)
    const sortedDonations = [...filteredDonations].sort((a, b) => {
      // Get all possible dates for debugging
      const aCreatedAt = new Date(a.attributes.createdAt);
      const bCreatedAt = new Date(b.attributes.createdAt);
      const aUpdatedAt = new Date(a.attributes.updatedAt);
      const bUpdatedAt = new Date(b.attributes.updatedAt);
      const aDonationDate = new Date(
        a.attributes.receipt_detail?.data?.attributes?.donation_date || ""
      );
      const bDonationDate = new Date(
        b.attributes.receipt_detail?.data?.attributes?.donation_date || ""
      );

      // Use the most recent date for each donation
      const dateA = new Date(Math.max(aCreatedAt, aUpdatedAt, aDonationDate));
      const dateB = new Date(Math.max(bCreatedAt, bUpdatedAt, bDonationDate));

      console.log("Comparing dates:", {
        a: { id: a.id, date: dateA },
        b: { id: b.id, date: dateB },
      });

      return dateB - dateA;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedDonations.slice(startIndex, endIndex);
    console.log(
      "Sorted Donations:",
      sortedDonations.map((d) => ({
        id: d.id,
        createdAt: d.attributes.createdAt,
        updatedAt: d.attributes.updatedAt,
        donationDate:
          d.attributes.receipt_detail?.data?.attributes?.donation_date,
      }))
    );
    return currentData;
  };

  const handleCancelClick = (donationId) => {
    console.log("Cancelling donation with ID:", donationId);
    setSelectedDonationId(donationId);
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  const handleCancelDonation = async (donationId) => {
    try {
      // Verify password using stored username
      await loginUser({
        identifier: user.username,
        password: password,
      });

      // If password verification succeeds, proceed with cancellation
      await updateDonationById(donationId, {
        data: {
          status: "cancelled",
        },
      });

      // Update local state
      setDonations(
        donations.map((donation) =>
          donation.id === donationId
            ? {
                ...donation,
                attributes: { ...donation.attributes, status: "cancelled" },
              }
            : donation
        )
      );

      // Close modal and reset states
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError("");
      setSelectedDonationId(null);

      // Add success toast notification
      toast.success("Donation cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("Invalid password");
    }
  };

  const handleSubmit = (donation) => {
    console.log("AllDonation - Processing pending donation:", donation);

    // Extract guest data for easier access
    const guestData = donation.attributes.guest?.data?.attributes || {};
    const receiptData =
      donation.attributes.receipt_detail?.data?.attributes || {};

    // Format the address components
    const address = guestData.address || "";
    const addressParts = address.split(", ");

    // Determine transaction type
    const transactionType = donation.attributes.transactionType || "Cash";

    const donationData = {
      donorDetails: {
        title: guestData.name?.split(" ")[0] || "",
        name: guestData.name?.split(" ").slice(1).join(" ") || "",
        phone: guestData.phone_number?.replace("+91", "") || "",
        email: guestData.email || "",
        deeksha: guestData.deeksha || "",
        identityType: guestData.identity_proof || "",
        identityNumber: guestData.identity_number || "",
        flatNo: addressParts[0] || "",
        streetName: addressParts[1] || "",
        postOffice: addressParts[2] || "",
        district: addressParts[3] || "",
        state: addressParts[4] || "",
        pincode: addressParts[5] || "",
      },
      donationDetails: {
        purpose: donation.attributes.purpose || "",
        donationType: donation.attributes.type || "",
        amount: donation.attributes.donationAmount || "",
        transactionType: transactionType,
        inMemoryOf: donation.attributes.InMemoryOf || "",
        donationFor: donation.attributes.donationFor || "Math",
        status: "pending",
        donationId: donation.id,
      },
      transactionDetails: {
        date: donation.attributes.ddch_date || "",
        transactionId: donation.attributes.ddch_number || "",
        bankName: donation.attributes.bankName || "",
        branchName: donation.attributes.branchName || "",
      },
      donationId: donation.id,
    };

    console.log("AllDonation - Prepared pending donation data:", donationData);

    // Initialize the donation store with the data
    useDonationStore.getState().initializeFromDonationData(donationData);

    navigate("/newDonation", {
      state: { donationData },
    });
  };

  const handleViewDonation = (donation) => {
    console.log("AllDonation - Processing donation:", donation);

    // Extract guest data for easier access
    const guestData = donation.attributes.guest?.data?.attributes || {};
    const receiptData =
      donation.attributes.receipt_detail?.data?.attributes || {};

    // Format the address components
    const address = guestData.address || "";
    const addressParts = address.split(", ");

    // Determine transaction type
    const transactionType = donation.attributes.transactionType || "Cash";

    const donationData = {
      donorDetails: {
        title: guestData.name?.split(" ")[0] || "",
        name: guestData.name?.split(" ").slice(1).join(" ") || "",
        phone: guestData.phone_number?.replace("+91", "") || "",
        email: guestData.email || "",
        deeksha: guestData.deeksha || "",
        identityType: guestData.identity_proof || "",
        identityNumber: guestData.identity_number || "",
        flatNo: addressParts[0] || "",
        streetName: addressParts[1] || "",
        postOffice: addressParts[2] || "",
        district: addressParts[3] || "",
        state: addressParts[4] || "",
        pincode: addressParts[5] || "",
        panNumber: guestData.pan_number || "",
        guestData: donation.attributes.guest?.data || {},
      },
      donationDetails: {
        purpose: donation.attributes.purpose || "",
        donationType: donation.attributes.type || "",
        amount: donation.attributes.donationAmount || "",
        transactionType: transactionType,
        inMemoryOf: donation.attributes.InMemoryOf || "",
        donationFor: donation.attributes.donationFor || "Math",
        status: "completed",
        donationId: donation.id,
        panNumber: guestData.pan_number || "",
      },
      transactionDetails: {
        date: donation.attributes.ddch_date || "",
        transactionId: donation.attributes.ddch_number || "",
        bankName: donation.attributes.bankName || "",
        branchName: donation.attributes.branchName || "",
      },
      donationId: donation.id,
    };

    console.log(
      "AllDonation - Prepared completed donation data:",
      donationData
    );

    // Initialize the donation store with the data
    useDonationStore.getState().initializeFromDonationData(donationData);

    navigate("/newDonation", {
      state: { donationData },
    });
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
                  handleCancelDonation(selectedDonationId);
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
              onClick={() => handleCancelDonation(selectedDonationId)}
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(donations)) return <div>No donations available</div>;

  const currentDonations = getCurrentPageData();

  return (
    <div className="all-donations-container">
      <ToastContainer />
      {renderPasswordModal()}
      <div className="donations-section">
        <div className="table-container">
          {currentDonations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {filterOptions.receiptNumber && <th>Receipt Number</th>}
                  {filterOptions.donorName && <th>Donor Name</th>}
                  {filterOptions.donationDate && <th>Donation Date</th>}
                  {filterOptions.phoneNumber && <th>Phone Number</th>}
                  {filterOptions.donatedFor && <th>Donated For</th>}
                  {filterOptions.donationStatus && <th>Donation Status</th>}
                  {filterOptions.donationAmount && <th>Donation Amount</th>}
                  {filterOptions.action && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {currentDonations.map((donation) => (
                  <tr key={donation.id}>
                    {filterOptions.receiptNumber && (
                      <td>
                        {
                          donation.attributes.receipt_detail?.data?.attributes
                            ?.Receipt_number
                        }
                      </td>
                    )}
                    {filterOptions.donorName && (
                      <td>
                        {donation.attributes.guest?.data?.attributes?.name}
                      </td>
                    )}
                    {filterOptions.donationDate && (
                      <td>
                        {new Date(
                          donation.attributes.receipt_detail?.data?.attributes
                            ?.donation_date || donation.attributes.updatedAt
                        ).toLocaleDateString("en-US", {
                          weekday: "short", // Mon, Tue, etc.
                          day: "numeric", // 1-31
                          month: "short", // Jan, Feb, etc.
                          year: "numeric", // 2024
                        })}
                      </td>
                    )}
                    {filterOptions.phoneNumber && (
                      <td>
                        {
                          donation.attributes.guest?.data?.attributes
                            ?.phone_number
                        }
                      </td>
                    )}
                    {filterOptions.donatedFor && (
                      <td>{donation.attributes.donationFor}</td>
                    )}
                    {filterOptions.donationStatus && (
                      <td>
                        <span
                          className={`status-badge ${donation.attributes.status.toLowerCase()}`}
                        >
                          {donation.attributes.status}
                        </span>
                      </td>
                    )}
                    {filterOptions.donationAmount && (
                      <td>
                        ₹{" "}
                        {Number(
                          donation.attributes.donationAmount
                        ).toLocaleString("en-IN")}
                      </td>
                    )}
                    {filterOptions.action && (
                      <td className="action-cell">
                        {(donation.attributes.status.toLowerCase() ===
                          "pending" ||
                          donation.attributes.status.toLowerCase() ===
                            "completed") && (
                          <>
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancelClick(donation.id)}
                            >
                              Cancel
                            </button>
                            {donation.attributes.status.toLowerCase() ===
                              "completed" && (
                              <button
                                className="view-btn"
                                style={{
                                  color: "#ea7704",
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  fontSize: "14px",
                                }}
                                onClick={() => handleViewDonation(donation)}
                              >
                                View
                              </button>
                            )}
                            {donation.attributes.status.toLowerCase() ===
                              "pending" && (
                              <button
                                className="submit-btn"
                                onClick={() => handleSubmit(donation)}
                              >
                                Submit
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">
              <span className="material-icons">info</span>
              <p>No donations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDonation;
