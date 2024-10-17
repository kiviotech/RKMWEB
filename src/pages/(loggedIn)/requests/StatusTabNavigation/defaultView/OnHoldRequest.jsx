import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import CommonButton from "../../../../../components/ui/Button";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import {
  getBookingRequests,
  updateBookingRequest,
} from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../../../services/src/utils/storage"; // Ensure this utility fetches your token

const OnHoldRequest = ({ selectedDate }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [iconId, setIconId] = useState(null);
  const [iconType, setIconType] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Fetch the booking requests with "on_hold" status
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequests();
        const bookingData = data?.data?.data;

        if (bookingData) {
          const onHoldRequests = bookingData
            .filter((item) => item.attributes.status === "on_hold")
            .map((item) => ({
              id: item.id,
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
                  isActive: true, // Since status is "on_hold"
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
            }));

          setRequests(onHoldRequests);
          setFilteredRequests(onHoldRequests); // Initialize filtered requests
        }
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      }
    };

    fetchBookingRequests();
  }, []);

  // Filter requests by selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = requests
        .filter((request) => {
          const requestDate = new Date(request.createdAt).toDateString();
          return requestDate === selectedDate.toDateString(); // Compare only the date
        })
        .sort((a, b) => a.createdAt - b.createdAt); // Sort by date

      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests); // Show all if no date selected
    }
  }, [selectedDate, requests]);

  // Handle guest approval or rejection
  const handleStatusChange = async (e, requestId, newStatus) => {
    e.stopPropagation();

    const token = await getToken(); // Fetch token
    if (!token) {
      console.error("No token available for API requests");
      return;
    }

    try {
      // Payload structure with the new status
      const updatedData = {
        data: {
          status: newStatus,
        },
      };
      const response = await updateBookingRequest(requestId, updatedData);
      console.log(
        `Booking request updated to ${newStatus} successfully`,
        response
      );

      // Update local state to reflect the status change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                reason: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), // Update reason with status
                icons: request.icons.map((icon) => {
                  if (icon.id === 3 && newStatus === "approved") {
                    return { ...icon, isActive: true }; // Activate the check icon for approved
                  } else if (icon.id === 2 && newStatus === "on_hold") {
                    return { ...icon, isActive: true }; // Activate the warning icon for on_hold
                  } else if (icon.id === 1 && newStatus === "rejected") {
                    return { ...icon, isActive: true }; // Activate the cross icon for rejected
                  } else {
                    return { ...icon, isActive: false }; // Deactivate other icons
                  }
                }),
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        `Failed to update the booking request to ${newStatus}`,
        error
      );
    }
  };

  // Handle the click on icons (approve, flag, reject)
  const handleIconClick = (e, reqId, icon_Id, iconType) => {
    e.stopPropagation(); // Prevent card click event
    setRequestId(reqId);
    setIconId(icon_Id);
    setIsModalOpen(true);
    setIconType(iconType);
    setIsGuestDetailsPopupOpen(false);
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
            style={{ borderColor: getCardBorderColor(request.icons) }}
            onClick={() => handleCardClick(request)}
          >
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
              <div className="request-user-imag">
                <img src={icons.userDummyImage} alt="user-image" />
                <p>{request.userDetails.name}</p>
              </div>
              <div className="reasons">
                <div>
                  <p style={{ color: getCardBorderColor(request.icons) }}>
                    {request.reason}
                  </p>
                  <p>Number of guest members: {request.noOfGuest}</p>
                  <p>Arrival Date: {request.userDetails.arrivalDate}</p>
                  <p>Departure Date: {request.userDetails.departureDate}</p>
                  {request.reason === "Has History" && (
                    <p>Assigned Bed(s): {request.assignBed}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="buttons">
              <CommonButton
                onClick={(e) => handleStatusChange(e, request.id, "approved")}
                buttonName="Approve"
                buttonWidth="auto"
                style={{
                  backgroundColor: "#ECF8DB",
                  color: "#A3D65C",
                  borderColor: "#A3D65C",
                  fontSize: "14px",
                  borderRadius: "7px",
                  borderWidth: 1,
                }}
              />

              <CommonButton
                onClick={(e) => handleStatusChange(e, request.id, "rejected")}
                buttonName="Reject"
                buttonWidth="auto"
                style={{
                  backgroundColor: "#FFBDCB",
                  color: "#FC5275",
                  borderColor: "#FC5275",
                  fontSize: "14px",
                  borderRadius: "7px",
                  borderWidth: 1,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* <PopUpFlagGuest
        isOpen={isModalOpen}
        onClose={closeModal}
        handleFlag={handleFlag}
        iconType={iconType}
      /> */}
      {selectedGuest && (
        <GuestDetailsPopup
          isOpen={isGuestDetailsPopupOpen}
          onClose={closeModal}
          guestDetails={selectedGuest}
          guests={selectedGuest?.guests || []} // Pass guests data here
        />
      )}
    </div>
  );
};

export default OnHoldRequest;
