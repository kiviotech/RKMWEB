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
import { toast } from "react-toastify";

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
    counter: true,
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
      // Get the most relevant date for each donation
      const dateA = new Date(
        a.attributes.createdAt ||
          a.attributes.receipt_detail?.data?.attributes?.donation_date ||
          a.attributes.updatedAt
      );
      const dateB = new Date(
        b.attributes.createdAt ||
          b.attributes.receipt_detail?.data?.attributes?.donation_date ||
          b.attributes.updatedAt
      );
      return dateB - dateA; // Sort in descending order (newest first)
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedDonations.slice(startIndex, endIndex);
    console.log("Current Page Data:", currentData);
    return currentData;
  };

  const handleCancelClick = (donationId) => {
    const donationToCancel = donations.find((d) => d.id === donationId);
    const donationCounter =
      donationToCancel?.attributes?.receipt_detail?.data?.attributes?.counter;
    const userCounter = user?.counter;

    // Check if user's counter matches donation counter or if user has Counter 3
    if (userCounter === "Counter 3" || userCounter === donationCounter) {
      setSelectedDonationId(donationId);
      setShowPasswordModal(true);
      setPassword("");
      setPasswordError("");
    } else {
      // Show error toast for unauthorized cancellation
      toast.error("You can only cancel donations from your assigned counter");
    }
  };

  const handleCancelDonation = async (donationId) => {
    try {
      const donationToCancel = donations.find((d) => d.id === donationId);
      const donationCounter =
        donationToCancel?.attributes?.receipt_detail?.data?.attributes?.counter;
      const userCounter = user?.counter;

      // Check if user's counter matches donation counter or if user has Counter 3
      if (userCounter === "Counter 3" || userCounter === donationCounter) {
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

        // Show success toast
        toast.success("Donation cancelled successfully");
      } else {
        // Show error toast for unauthorized cancellation
        toast.error("You can only cancel donations from your assigned counter");
        setShowPasswordModal(false);
        setPassword("");
        setPasswordError("");
        setSelectedDonationId(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("Invalid password");
      toast.error("Failed to cancel donation");
    }
  };

  const handleSubmit = (donation) => {
    console.log("Submitting donation:", donation);
    console.log("Donation data being passed:", donation);
    navigate("/newDonation", {
      state: {
        donationData: {
          id: donation.id,
          receiptNumber:
            donation.attributes.receipt_detail?.data?.attributes
              ?.Receipt_number,
          donorName: donation.attributes.guest?.data?.attributes?.name,
          donationDate:
            donation.attributes.receipt_detail?.data?.attributes?.donation_date,
          phoneNumber:
            donation.attributes.guest?.data?.attributes?.phone_number,
          donatedFor: donation.attributes.donationFor,
          status: donation.attributes.status,
          amount: donation.attributes.donationAmount,
          createdBy:
            donation.attributes.receipt_detail?.data?.attributes?.createdBy
              ?.data?.id || donation.attributes.createdBy?.data?.id,
        },
      },
    });
  };

  const handleViewDonation = (donation) => {
    navigate("/newDonation", {
      state: {
        donationData: {
          id: donation.id,
          receiptNumber:
            donation.attributes.receipt_detail?.data?.attributes
              ?.Receipt_number,
          donorName: donation.attributes.guest?.data?.attributes?.name,
          donationDate:
            donation.attributes.receipt_detail?.data?.attributes?.donation_date,
          phoneNumber:
            donation.attributes.guest?.data?.attributes?.phone_number,
          donatedFor: donation.attributes.donationFor,
          status: donation.attributes.status,
          amount: donation.attributes.donationAmount,
          createdBy:
            donation.attributes.receipt_detail?.data?.attributes?.createdBy
              ?.data?.id || donation.attributes.createdBy?.data?.id,
          // Add counter information
          counter:
            donation.attributes.receipt_detail?.data?.attributes?.counter,
          // Rest of the existing fields...
          inMemoryOf: donation.attributes.InMemoryOf,
          bankName: donation.attributes.bankName,
          ddchDate: donation.attributes.ddch_date,
          ddchNumber: donation.attributes.ddch_number,
          purpose: donation.attributes.purpose,
          transactionType: donation.attributes.transactionType,
          type: donation.attributes.type,
          // Guest details
          guestDetails: {
            aadhaarNumber:
              donation.attributes.guest?.data?.attributes?.aadhaar_number,
            address: donation.attributes.guest?.data?.attributes?.address,
            age: donation.attributes.guest?.data?.attributes?.age,
            arrivalDate:
              donation.attributes.guest?.data?.attributes?.arrival_date,
            departureDate:
              donation.attributes.guest?.data?.attributes?.departure_date,
            deeksha: donation.attributes.guest?.data?.attributes?.deeksha,
            email: donation.attributes.guest?.data?.attributes?.email,
            gender: donation.attributes.guest?.data?.attributes?.gender,
            occupation: donation.attributes.guest?.data?.attributes?.occupation,
            relationship:
              donation.attributes.guest?.data?.attributes?.relationship,
            guestStatus: donation.attributes.guest?.data?.attributes?.status,
          },
        },
      },
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
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "10px",
                paddingRight: "35px", // Add space for the eye icon
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              )}
            </button>
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
                  {filterOptions.counter && <th>Counter</th>}
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
                          className={`status-badge ${donation.attributes.status}`}
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
                    {filterOptions.counter && (
                      <td>
                        {
                          donation.attributes.receipt_detail?.data?.attributes
                            ?.counter
                        }
                      </td>
                    )}
                    {filterOptions.action && (
                      <td className="action-cell">
                        {donation.attributes.status &&
                          (donation.attributes.status.toLowerCase() ===
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
