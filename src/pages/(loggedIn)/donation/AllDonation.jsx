import React, { useState, useEffect } from "react";
import {
  fetchDonations,
  updateDonationById,
} from "../../../../services/src/services/donationsService";
import "./AllDonation.scss";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredDonations.slice(startIndex, endIndex);
    console.log("Current Page Data:", currentData);
    return currentData;
  };

  const handleCancelDonation = async (donationId) => {
    console.log("Cancelling donation:", donationId);
    try {
      await updateDonationById(donationId, {
        data: {
          status: "cancelled",
        },
      });

      // Update the local state to reflect the change
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
    } catch (error) {
      console.error("Cancel Donation Error:", error);
      // Optionally add error handling UI feedback here
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

  const handleViewDonation = (donationId) => {
    // Implement the logic to handle the "View" button click
    // For example, you can navigate to a detailed view page
    navigate(`/donation/${donationId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(donations)) return <div>No donations available</div>;

  const currentDonations = getCurrentPageData();

  return (
    <div className="all-donations-container">
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
                      <td>{donation.attributes.donationAmount}</td>
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
                              onClick={() => handleCancelDonation(donation.id)}
                            >
                              Cancel
                            </button>
                            {donation.attributes.status.toLowerCase() ===
                              "completed" && (
                              <button
                                className="view-btn"
                                onClick={() => handleViewDonation(donation.id)}
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
