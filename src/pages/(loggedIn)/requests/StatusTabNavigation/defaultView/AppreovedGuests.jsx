import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import { getBookingRequests } from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../../../services/src/utils/storage";

const ApprovedGuests = () => {
  const navigate = useNavigate();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const handleButtonClick = (request) => {
    navigate("/book-room", { state: { userData: request } });
  };

  // Fetch only approved booking requests
  useEffect(() => {
    const fetchApprovedBookingRequests = async () => {
      try {
        const data = await getBookingRequests();
        const bookingData = data?.data?.data;
        if (bookingData) {
          const approvedBookingData = bookingData.filter(
            (item) => item.attributes.status === "approved"
          );

          const bookingRequests = approvedBookingData.map((item) => ({
            id: item.id,
            userImage: item.attributes.userImage || "",
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
                isActive: true,
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

          setRequests(bookingRequests);
        }
      } catch (error) {
        console.error("Error fetching approved booking requests:", error);
      }
    };

    fetchApprovedBookingRequests();
  }, []);

  const handleCardClick = (guestDetails) => {
    setSelectedGuest(guestDetails);
    setIsGuestDetailsPopupOpen(true);
  };

  const closeModal = () => {
    setIsGuestDetailsPopupOpen(false);
    setSelectedGuest(null);
  };

  const getCardBorderColor = (icons) => {
    const activeIcon = icons.find((icon) => icon.isActive);
    if (activeIcon) {
      if (activeIcon.id === 1) return "#FC5275";
      if (activeIcon.id === 2) return "#FFD700";
      if (activeIcon.id === 3) return "#A3D65C";
    }
    return "#D9D9D9";
  };

  return (
    <div className="Requests-main-container">
      <div className="requests-cards-section">
        {requests.map((request) => (
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
                <img src={icons.userDummyImage} alt="user" />
                <p>{request.userDetails.name}</p>
              </div>
              <div className="reasons">
                <div>
                  <p style={{ color: getCardBorderColor(request.icons) }}>
                    {request.reason}
                  </p>
                  <p>Number of guest members: {request.noOfGuest}</p>
                  {request.reason === "Has History" && (
                    <p>Assigned Bed(s): {request.assignBed}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="buttons">
              <CommonButton
                buttonName="Allocate Rooms"
                buttonWidth="220px"
                style={{
                  backgroundColor: "#FFBDCB",
                  color: "#FC5275",
                  borderColor: "#FC5275",
                  fontSize: "14px",
                  borderRadius: "7px",
                  borderWidth: 1,
                  // padding: "5px 0px",
                }}
                onClick={() => handleButtonClick(request)} // Pass the request data
              />
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
        />
      )}
    </div>
  );
};

export default ApprovedGuests;
