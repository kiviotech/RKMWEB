import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";

const ConfirmedRequests = ({ selectedDate, searchQuery, label }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Fetch the booking requests
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequestsByStatus("confirmed");
        console.log("Raw API Response:", data);
        const bookingData = data?.data?.data;
        console.log("Booking Data:", bookingData);

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
            assignBed:
              item.attributes.guests?.data?.[0]?.attributes?.room?.data
                ?.attributes?.room_number || "N/A",
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
                isActive: true, // Set to true for confirmed requests
              },
            ],
            reason: item.attributes.reason || "Confirmed",
            guests: item.attributes.guests.data.map((guest) => ({
              id: guest.id,
              name: guest.attributes.name,
              age: guest.attributes.age,
              gender: guest.attributes.gender,
              relation: guest.attributes.relationship,
              roomNumber: guest.attributes.room?.data?.attributes?.room_number,
            })),
          }));

          console.log("Processed Booking Requests:", bookingRequests);
          setRequests(bookingRequests);
          setFilteredRequests(bookingRequests);
        }
      } catch (error) {
        console.error("Error fetching confirmed requests:", error);
      }
    };

    fetchBookingRequests();
  }, []);

  // Filter requests based on selected date and search query
  useEffect(() => {
    let filtered = requests;

    if (selectedDate) {
      filtered = filtered.filter(
        (request) =>
          new Date(request.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
    }

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

    console.log("Filtered Requests:", filtered);
    setFilteredRequests(filtered);
  }, [selectedDate, requests, searchQuery]);

  // Handle the click on the guest card
  const handleCardClick = (guestDetails) => {
    setSelectedGuest(guestDetails);
    setIsGuestDetailsPopupOpen(true);
  };

  // Close modal popups
  const closeModal = () => {
    setIsGuestDetailsPopupOpen(false);
    setSelectedGuest(null);
  };

  return (
    <div className="Requests-main-container">
      <div className="requests-cards-section">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="requests-card"
            style={{ borderColor: "#A3D65C" }}
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
                  <p style={{ color: "#A3D65C" }}>{request.reason}</p>
                  <p>Number of guest members: {request.noOfGuest}</p>
                  <p>Arrival Date: {request.userDetails.arrivalDate}</p>
                  <p>Departure Date: {request.userDetails.departureDate}</p>
                  <p>Assigned Room: {request.assignBed}</p>
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
          label={label}
        />
      )}
    </div>
  );
};

export default ConfirmedRequests;
