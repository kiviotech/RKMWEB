import React, { useEffect, useState } from "react";
// import "./ApproveGuests.scss";
import icons from "../../../../../constants/icons";
import CommonButton from "../../../../../components/ui/Button";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import {
  getBookingRequestsByStatus,
  updateBookingRequest,
} from "../../../../../../services/src/api/repositories/bookingRequestRepository"; // Add updateBookingRequest
import { getToken } from "../../../../../../services/src/utils/storage";

const PendingRequests = ({ selectedDate, searchQuery, label }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [iconId, setIconId] = useState(null);
  const [iconType, setIconType] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Fetch the booking requests
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequestsByStatus("awaiting");
        console.log("Raw API Response:", data);
        const bookingData = data?.data?.data;
        console.log("Booking Data Array:", bookingData);
        if (bookingData) {
          const bookingRequests = bookingData.map((item) => ({
            id: item.id,
            status: item.attributes.status,
            userImage: item.attributes.userImage || "",
            createdAt: new Date(item.attributes.createdAt),
            userDetails: {
              name: item.attributes.name,
              age: item.attributes.age,
              gender: item.attributes.gender,
              email: item.attributes.email,
              addharNo: item.attributes.aadhaar_number,
              mobile: item.attributes.phone_number,
              arrivalDate: item.attributes.arrival_date,
              departureDate: item.attributes.departure_date,
              occupation: item.attributes.occupation,
              deeksha: item.attributes.deeksha,
            },
            assignBed: item.attributes.assignBed || "N/A",
            noOfGuest: item.attributes.number_of_guest_members || "0",
            isMarked: item.attributes.isMarked || false,
            approved: item.attributes.approved || false,
            icons: [
              {
                id: 1,
                normal: icons.crossCircle,
                filled: icons.filledRedCircle,
                isActive: false,
              },
              {
                id: 2,
                normal: icons.marked,
                filled: icons.markedYellow,
                isActive: false,
              },
              {
                id: 3,
                normal: icons.checkCircle,
                filled: icons.checkCircleMarked,
                isActive: false,
              },
            ],
            reason: item.attributes.reason || "No History",
            guests: item.attributes.guests.data.map((guest) => ({
              id: guest.id,
              name: guest.attributes.name,
              age: guest.attributes.age,
              gender: guest.attributes.gender,
              relation: guest.attributes.relationship,
            })),
            recommendation_letter: item.attributes.recommendation_letter,
          }));

          console.log("Transformed Booking Requests:", bookingRequests);
          setRequests(bookingRequests);
          setFilteredRequests(bookingRequests);
        }
      } catch (error) {
        console.error("Error fetching booking requests:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
    };

    fetchBookingRequests();
  }, []);

  // Filter requests based on selected date
  useEffect(() => {
    let filtered = requests;

    // Filter by date if selected
    if (selectedDate) {
      filtered = filtered.filter(
        (request) =>
          new Date(request.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
    }

    // Filter by search query if present
    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.userDetails.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          request.guests.some((guest) =>
            guest.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sort by creation date
    filtered = filtered.sort((a, b) => a.createdAt - b.createdAt);

    setFilteredRequests(filtered);
  }, [selectedDate, requests, searchQuery]);

  // Function to update booking request status
  const handleStatusChange = async (requestId, newStatus) => {
    // Update the local state to reflect the status change
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );

    // Also update the filtered requests
    setFilteredRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  };

  // Handle the click on icons (approve, flag, reject)
  const handleIconClick = (e, reqId, icon_Id, iconType) => {
    e.stopPropagation();
    if (icon_Id === 3) {
      handleFlag("Has History", reqId, icon_Id);
    } else {
      setRequestId(reqId);
      setIconId(icon_Id);
      setIsModalOpen(true);
      setIconType(iconType);
      setIsGuestDetailsPopupOpen(false);
    }
  };

  // Handle the click on the guest card
  const handleCardClick = (guestDetails) => {
    if (!isModalOpen) {
      setSelectedGuest(guestDetails);
      setIsGuestDetailsPopupOpen(true);
    }
  };

  // Close modal popups
  const closeModal = () => {
    setIsGuestDetailsPopupOpen(false);
    setSelectedGuest(null);
    setIsModalOpen(false);
  };

  const handleFlag = (selectedReason, reqId = requestId, icon_Id = iconId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === reqId
          ? {
              ...request,
              reason: selectedReason,
              icons: request.icons.map((icon) =>
                icon.id === icon_Id
                  ? { ...icon, isActive: !icon.isActive }
                  : { ...icon, isActive: false }
              ),
            }
          : request
      )
    );
    if (icon_Id !== 3) closeModal();
  };

  const getCardBorderColor = (icons) => {
    const activeIcon = icons.find((icon) => icon.isActive);
    if (activeIcon) {
      if (activeIcon.id === 1) return "#FC5275"; // Red for reject
      if (activeIcon.id === 2) return "#FFD700"; // Yellow for on_hold
      if (activeIcon.id === 3) return "#A3D65C"; // Green for approve
    }
    return "#D9D9D9"; // Default border color
  };

  return (
    <div className="Requests-main-container">
      <div className="requests-cards-section">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="requests-card"
            style={{
              borderColor: getCardBorderColor(request.icons),
              position: "relative",
            }}
            onClick={() => handleCardClick(request)}
          >
            {request.recommendation_letter?.data?.length > 0 && (
              <span
                style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  position: "absolute",
                  top: "17px",
                  right: "20px",
                  zIndex: 1,
                }}
              >
                Special Request
              </span>
            )}
            <div className="actions-button">
              {request.icons.map((icon) => (
                <img
                  key={icon.id}
                  src={icon.isActive ? icon.filled : icon.normal}
                  alt="icon"
                  onClick={(e) =>
                    handleIconClick(e, request.id, icon.id, icon.normal)
                  }
                  style={{
                    display: "inline-block",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
            <div className="request-details">
              <div className="request-user-image">
                {/* <img src={icons.userDummyImage} alt="user" /> */}
                <p>{request.userDetails.name}</p>
              </div>
              <div className="reasons">
                <div>
                  <p style={{ color: getCardBorderColor(request.icons) }}>
                    {request.reason}
                  </p>
                  <p>Number of guest members: {request.guests.length}</p>
                  <p>
                    Arrival Date:{" "}
                    {new Date(request.userDetails.arrivalDate)
                      .toLocaleDateString("en-GB")
                      .split("/")
                      .join("-")}
                  </p>
                  <p>
                    Departure Date:{" "}
                    {new Date(request.userDetails.departureDate)
                      .toLocaleDateString("en-GB")
                      .split("/")
                      .join("-")}
                  </p>
                  {request.reason === "Has History" && (
                    <p>Assigned Bed(s): {request.assignBed}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedGuest && (
        <GuestDetailsPopup
          isOpen={isGuestDetailsPopupOpen}
          onClose={closeModal}
          guestDetails={selectedGuest}
          guests={selectedGuest?.guests || []}
          onStatusChange={handleStatusChange}
          label={label}
        />
      )}
    </div>
  );
};

export default PendingRequests;
