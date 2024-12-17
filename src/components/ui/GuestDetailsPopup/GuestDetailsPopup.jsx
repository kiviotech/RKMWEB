import React, { useState, useEffect } from "react";
import CommonButton from "../../../components/ui/Button";
import "./GuestDetailsPopup.scss";
import { updateBookingRequest } from "../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../services/src/utils/storage";
import RejectionEmailPopup from "./RejectionEmailPopup";
import { useNavigate } from "react-router-dom";
import { getCelebrations } from "../../../../services/src/api/repositories/celebrationsRepository";

const icons = {
  Reminder: "https://api.iconify.design/mdi:bell-ring-outline.svg",
  Email: "https://api.iconify.design/mdi:email-outline.svg",
  Contact: "https://api.iconify.design/mdi:phone.svg",
  Calendar: "https://api.iconify.design/mdi:calendar.svg",
  DefaultAvatar: "https://api.iconify.design/mdi:account-circle.svg",
  Close: "https://api.iconify.design/mdi:close.svg",
  Location: "https://api.iconify.design/mdi:map-marker.svg",
  Clock: "https://api.iconify.design/mdi:clock-outline.svg",
  Edit: "https://api.iconify.design/mdi:pencil.svg",
  Delete: "https://api.iconify.design/mdi:delete.svg",
};

const GuestDetailsPopup = ({
  isOpen,
  onClose,
  guestDetails,
  guests,
  onStatusChange,
  label,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedVisitRow, setSelectedVisitRow] = useState(null);
  const [selectedGuestName, setSelectedGuestName] = useState(
    guestDetails?.userDetails?.name || ""
  );
  const [showRejectionEmail, setShowRejectionEmail] = useState(false);
  const navigate = useNavigate();
  const [upcomingCelebration, setUpcomingCelebration] = useState(null);

  useEffect(() => {
    if (guestDetails?.guests?.length > 0) {
      const firstGuest = guestDetails.guests[0];
      setSelectedRow(firstGuest.id);
      setSelectedGuestName(
        firstGuest.name || guestDetails?.userDetails?.name || ""
      );
    }
  }, [guestDetails]);

  useEffect(() => {
    const fetchCelebrations = async () => {
      try {
        const response = await getCelebrations();
        console.log("Celebrations response:", response.data);

        // Convert arrival and departure dates to Date objects
        const arrivalDate = new Date(guestDetails?.userDetails?.arrivalDate);
        const departureDate = new Date(
          guestDetails?.userDetails?.departureDate
        );

        // Find celebrations that fall within the stay period
        const upcoming = response?.data?.data?.find((celebration) => {
          const celebrationDate = new Date(
            celebration.attributes.gregorian_date
          );
          return (
            celebrationDate >= arrivalDate && celebrationDate <= departureDate
          );
        });

        if (upcoming) {
          setUpcomingCelebration(upcoming.attributes);
        }
      } catch (error) {
        console.error("Error fetching celebrations:", error);
      }
    };

    fetchCelebrations();
  }, [guestDetails]);

  console.log("GuestDetailsPopup - Full guestDetails:", guestDetails);
  console.log("GuestDetailsPopup - User Details:", guestDetails?.userDetails);
  console.log("GuestDetailsPopup - Guests:", guestDetails?.guests);
  console.log("GuestDetailsPopup - Stay Duration:", {
    arrivalDate: guestDetails?.userDetails?.arrivalDate,
    departureDate: guestDetails?.userDetails?.departureDate,
  });

  const handleRowClick = (guestId) => {
    setSelectedRow(guestId);
    const selectedGuest = guestDetails?.guests?.find(
      (guest) => guest.id === guestId
    );
    setSelectedGuestName(
      selectedGuest?.name || guestDetails?.userDetails?.name || ""
    );
  };

  const handleVisitRowClick = (index) => {
    setSelectedVisitRow(index);
  };

  const arrivalDate = new Date(guestDetails?.userDetails?.arrivalDate);
  const departureDate = new Date(guestDetails?.userDetails?.departureDate);
  const stayDuration = Math.ceil(
    (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
  );

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No token available for API requests");
        return;
      }

      const updatedData = {
        data: {
          status: newStatus,
        },
      };

      // Call the API to update the status
      const response = await updateBookingRequest(requestId, updatedData);

      // If the API call is successful, notify the parent component
      if (response) {
        onStatusChange && onStatusChange(requestId, newStatus);
        onClose(); // Close the popup after successful status change
      }
    } catch (error) {
      console.error(
        `Failed to update the booking request to ${newStatus}:`,
        error
      );
      // You might want to show an error message to the user here
    }
  };

  const handleRejectClick = () => {
    setShowRejectionEmail(true);
  };

  const handleRejectionEmailSubmit = (reasons) => {
    handleStatusChange(guestDetails.id, "rejected");
    setShowRejectionEmail(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleButtonClick = (request) => {
    console.log("Main Request ID:", request.id);
    console.log(
      "Guest IDs:",
      request.guests.map((guest) => guest.id)
    );

    const guestData = {
      requestId: request.id,
      name: request.userDetails.name,
      arrivalDate: request.userDetails.arrivalDate,
      departureDate: request.userDetails.departureDate,
      numberOfGuests: request.noOfGuest,
      guestDetails: {
        ...request.userDetails,
      },
      additionalGuests: request.guests.map((guest) => ({
        id: guest.id,
        name: guest.name,
        age: guest.age,
        gender: guest.gender,
        relation: guest.relation,
        roomNo: guest.room?.data?.attributes?.room_number || "-",
      })),
    };

    console.log("Formatted Guest Data IDs:", {
      requestId: request.id,
      guestIds: guestData.additionalGuests.map((guest) => guest.id),
    });

    navigate("/book-room", {
      state: { guestData },
    });
    onClose(); // Close the popup after navigation
  };

  if (showRejectionEmail) {
    return (
      <RejectionEmailPopup
        onClose={() => setShowRejectionEmail(false)}
        onSubmit={handleRejectionEmailSubmit}
        guestDetail={guestDetails}
      />
    );
  }

  if (!isOpen) return null;

  const renderActionButtons = () => {
    const status =
      guestDetails?.status || guestDetails?.attributes?.status || "awaiting";

    if (label === "pending" || label === "rescheduled") {
      return (
        <div className="action-buttons">
          <button
            className="hold-btn"
            onClick={() => handleStatusChange(guestDetails.id, "on_hold")}
          >
            Put on hold
          </button>
          <button
            className="approve-btn"
            onClick={() => handleStatusChange(guestDetails.id, "approved")}
          >
            Approve
          </button>
          <button className="reject-btn" onClick={handleRejectClick}>
            Reject
          </button>
        </div>
      );
    } else if (label === "approved") {
      return (
        <div className="action-buttons">
          <button
            className="hold-btn"
            onClick={() => handleStatusChange(guestDetails.id, "on_hold")}
          >
            Put on hold
          </button>
          <button className="reject-btn" onClick={handleRejectClick}>
            Reject
          </button>
          <CommonButton
            buttonName={(() => {
              const hasRoom = guestDetails.guests.some(
                (guest) => guest.room?.data?.attributes?.room_number
              );
              return hasRoom ? "View" : "Allocate Rooms";
            })()}
            buttonWidth="220px"
            style={{
              backgroundColor: "#9867E9",
              color: "#fff",
              borderColor: "#9867E9",
              fontSize: "14px",
              borderRadius: "7px",
              borderWidth: 1,
            }}
            onClick={() => handleButtonClick(guestDetails)}
          />
        </div>
      );
    } else if (label === "onHold") {
      return (
        <div className="action-buttons">
          <button
            className="approve-btn"
            onClick={() => handleStatusChange(guestDetails.id, "approved")}
          >
            Approve
          </button>
          <button className="reject-btn" onClick={handleRejectClick}>
            Reject
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="header-section">
            <button
              className="close-btn"
              onClick={onClose}
              style={{ marginTop: "-10px" }}
            >
              <img src={icons.Close} alt="close" className="icon" />
            </button>

            {/* Main Info Section */}
            <div className="main-info">
              <div className="left-section">
                <div className="avatar">
                  <img
                    src={guestDetails?.userImage || icons.DefaultAvatar}
                    alt="profile"
                  />
                </div>
                <div className="user-details">
                  <h2>{guestDetails?.userDetails?.name || "N/A"}</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Age</span>
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.age || "N/A"}
                        </strong>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Gender</span>
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.gender || "N/A"}
                        </strong>
                      </span>
                    </div>
                    <div className="info-item">
                      <img src={icons.Email} alt="email" className="icon" />
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.email || "N/A"}
                        </strong>
                      </span>
                    </div>
                    <div className="info-item">
                      <img src={icons.Contact} alt="phone" className="icon" />
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.mobile || "N/A"}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Occupation</span>
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.occupation || "N/A"}
                        </strong>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Initiation by</span>
                      <span className="value">
                        <strong>
                          {guestDetails?.userDetails?.deeksha || "N/A"}
                        </strong>
                      </span>
                    </div>
                    {/* <div className="info-item">
                                            <span className="label">Initiation by</span>
                                            <span className="value">Gurudev Name</span>
                                        </div> */}
                  </div>
                </div>
              </div>

              <div className="right-section">
                <div className="reminder-bar">
                  <div className="reminder-content">
                    <img
                      src={icons.Reminder}
                      alt="reminder"
                      style={{
                        filter:
                          "invert(37%) sepia(74%) saturate(3383%) hue-rotate(206deg) brightness(101%) contrast(101%)",
                      }}
                    />
                    <span
                      style={{
                        color: "#066bff",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {upcomingCelebration ? (
                        <>
                          Reminder:{" "}
                          <span>
                            {new Date(
                              upcomingCelebration.gregorian_date
                            ).getDate()}
                            th{" "}
                            {new Date(
                              upcomingCelebration.gregorian_date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                            })}{" "}
                            is {upcomingCelebration.event_name}
                          </span>
                        </>
                      ) : (
                        <span>No upcoming celebrations</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="stay-info">
                  <div className="duration">
                    <span className="label">Stay Duration:- </span>
                    <span className="value">
                      <strong>{stayDuration || "N/A"} days</strong>
                    </span>
                  </div>
                  <div className="dates">
                    <div className="date-row">
                      <img src={icons.Calendar} alt="calendar" />
                      <span className="date-label">Arrival Date:</span>
                      <span className="date-value">
                        {formatDate(guestDetails?.userDetails?.arrivalDate)}
                      </span>
                    </div>
                    <div className="date-row">
                      <img src={icons.Calendar} alt="calendar" />
                      <span className="date-label">Departure Date:</span>
                      <span className="date-value">
                        {formatDate(guestDetails?.userDetails?.departureDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visit History Section */}
          <div className="visit-history">
            <div className="history-header">
              <div className="left-title">Guests</div>
              <div className="center-title">
                Visit History of {selectedGuestName}
              </div>
              {/* <div className="right-link">
                                <a href="#" className="check-availability">Check Availability</a>
                            </div> */}
            </div>

            <div className="history-tables">
              {/* Guests Table */}
              <div className="guests-table-container">
                <div className="table-wrapper">
                  <div className="table-scroll">
                    <table className="guests-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Relation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guestDetails?.guests?.map((guest) => (
                          <tr
                            key={guest.id}
                            onClick={() => handleRowClick(guest.id)}
                          >
                            <td
                              style={{
                                backgroundColor:
                                  selectedRow === guest.id
                                    ? "#fff2ea"
                                    : "transparent",
                                color:
                                  selectedRow === guest.id
                                    ? "black"
                                    : "#4b4b4b",
                              }}
                            >
                              {guest.name || "N/A"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  selectedRow === guest.id
                                    ? "#fff2ea"
                                    : "transparent",
                                color:
                                  selectedRow === guest.id
                                    ? "black"
                                    : "#4b4b4b",
                              }}
                            >
                              {guest.age || "N/A"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  selectedRow === guest.id
                                    ? "#fff2ea"
                                    : "transparent",
                                color:
                                  selectedRow === guest.id
                                    ? "black"
                                    : "#4b4b4b",
                              }}
                            >
                              {guest.gender || "N/A"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  selectedRow === guest.id
                                    ? "#fff2ea"
                                    : "transparent",
                                color:
                                  selectedRow === guest.id
                                    ? "black"
                                    : "#4b4b4b",
                              }}
                            >
                              {guest.relation || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Visit Details Table */}
              <div className="visit-details-table">
                <table>
                  <thead>
                    <tr>
                      <th>Last visited date</th>
                      <th>Number of days</th>
                      <th>Room Allocated</th>
                      <th>Donations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestDetails?.visitHistory?.length > 0 ? (
                      guestDetails.visitHistory.map((visit, index) => {
                        // Calculate the difference in months between the visit date and the present date
                        const visitDate = new Date(visit.visitDate);
                        const currentDate = new Date();
                        const monthsDifference =
                          (currentDate.getFullYear() -
                            visitDate.getFullYear()) *
                            12 +
                          (currentDate.getMonth() - visitDate.getMonth());

                        const isWithinSixMonths = monthsDifference < 6;

                        return (
                          <tr
                            key={index}
                            className={isWithinSixMonths ? "highlighted" : ""}
                            onClick={() => handleVisitRowClick(index)}
                          >
                            <td>{visit.visitDate || "N/A"}</td>
                            <td>{visit.numberOfDays || "N/A"}</td>
                            <td>{visit.roomAllocated || "N/A"}</td>
                            <td>₹{visit.donations?.toFixed(2) || "0.00"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No visit history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alert and Action Buttons */}
            <div className="footer" style={{ background: "#fff" }}>
              <div className="alert">
                {/* There is a Revisit within 6 months of Guest name */}
              </div>
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestDetailsPopup;
