import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import CommonButton from "../../../../../components/ui/Button";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";

const RejectedRequest = ({ selectedDate, label }) => {
  const navigate = useNavigate(); // For routing
  const [isModalOpen, setIsModalOpen] = useState(false); // Manages the visibility of the modal for flagging a guest
  const [requestId, setRequestId] = useState(null); // Stores the ID of the current request being processed
  const [iconId, setIconId] = useState(null); // Stores the ID of the icon that was clicked, used to identify the action
  const [iconType, setIconType] = useState(null); // Stores the type of the icon clicked, used to determine the specific action to be taken
  const [selectedGuest, setSelectedGuest] = useState(null); // Stores the details of the selected guest for display or further actions
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false); // Manages the visibility of the guest details popup
  const [requests, setRequests] = useState([]); // Stores all requests
  const [filteredRequests, setFilteredRequests] = useState([]); // Filtered requests based on date

  // Fetch the booking requests with status "rejected"
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequestsByStatus("rejected");
        const bookingData = data?.data?.data;

        if (bookingData) {
          const rejectedRequests = bookingData.map((item) => ({
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
                isActive: true, // Active icon for rejected status
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
              room: guest.attributes.room,
            })),
            recommendation_letter: item.attributes.recommendation_letter,
          }));

          setRequests(rejectedRequests);
          setFilteredRequests(rejectedRequests); // Initialize filtered requests
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

  // Handle flagging a guest (not necessary for rejected, but keeping for completeness)
  const handleFlag = (selectedReason, reqId = requestId, icon_Id = iconId) => {
    // console.log(`Flagging guest for reason: ${selectedReason}`);
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === reqId
          ? {
              ...request,
              reason: selectedReason, // Update the reason
              icons: request.icons.map((icon) =>
                icon.id === icon_Id
                  ? { ...icon, isActive: !icon.isActive }
                  : { ...icon, isActive: false }
              ),
            }
          : request
      )
    );

    if (icon_Id !== 3) {
      closeModal();
    }
  };

  const getCardBorderColor = (icons) => {
    const activeIcon = icons.find((icon) => icon.isActive);
    if (activeIcon) {
      if (activeIcon.id === 1) return "#FC5275"; // Color of the "Reject" button
      if (activeIcon.id === 2) return "#FFD700"; // Color of the "Flag" button
      if (activeIcon.id === 3) return "#A3D65C"; // Color of the "Approve" button
    }
    return "#D9D9D9";
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
                {/* <img src={icons.userDummyImage} alt="user-image" /> */}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PopUpFlagGuest
        isOpen={isModalOpen}
        onClose={closeModal}
        handleFlag={handleFlag}
        iconType={iconType}
      />
      {selectedGuest && (
        <GuestDetailsPopup
          isOpen={isGuestDetailsPopupOpen}
          onClose={closeModal}
          // guestDetails={selectedGuest}
          // guests={selectedGuest?.guests || []}
          // label={label}
          requestId={selectedGuest.id}
        />
      )}
    </div>
  );
};

export default RejectedRequest;
