import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import { getBookingRequests } from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";

const ApprovedGuests = ({ selectedDate }) => {
  const navigate = useNavigate();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleButtonClick = (request) => {
    const guestData = {
      name: request.userDetails.name,
      arrivalDate: request.userDetails.arrivalDate,
      departureDate: request.userDetails.departureDate,
      numberOfGuests: request.noOfGuest,
      guestDetails: {
        ...request.userDetails,
        // Add any additional fields needed from userDetails
      },
      additionalGuests: request.guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        age: guest.age,
        gender: guest.gender,
        relation: guest.relation, // This matches the expected format in BookRoom
        roomNo: "-" // Initialize with no room assigned
      }))
    };
    
    navigate("/book-room", { 
      state: { guestData } 
    });
  };

  // Fetch only approved booking requests
  useEffect(() => {
    const fetchApprovedBookingRequests = async () => {
      try {
        const data = await getBookingRequestsByStatus('approved');
        const bookingData = data?.data?.data;
        
        console.log('Raw booking data:', data);
        console.log('Booking data array:', bookingData);

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

          console.log('Transformed booking requests:', bookingRequests);

          setRequests(bookingRequests);
          setFilteredRequests(bookingRequests);
        }
      } catch (error) {
        setError("Error fetching approved guests");
        console.error("Error fetching approved booking requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedBookingRequests();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = requests
        .filter((request) => {
          const requestDate = new Date(request.createdAt).toDateString();
          console.log(request)
          return requestDate === selectedDate.toDateString(); // Compare only the date
        })
        .sort((a, b) => a.createdAt - b.createdAt); // Sort by date

      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests); // Show all if no date selected
    }
  }, [selectedDate, requests]);


  const handleCardClick = (guestDetails) => {
    setSelectedGuest(guestDetails);
    setIsGuestDetailsPopupOpen(true);
  };

  const closeModal = () => {
    setIsGuestDetailsPopupOpen(false);
    setSelectedGuest(null);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    if (newStatus !== 'approved') {
      // Remove the request from the approved list if the status is changed to something else
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      // Also update the filtered requests
      setFilteredRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loader component
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

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
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ApprovedGuests;
