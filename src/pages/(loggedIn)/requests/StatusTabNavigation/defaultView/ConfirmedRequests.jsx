import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { updateBookingRequestById } from "../../../../../../services/src/services/bookingRequestService";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import { deleteRoomAllocationById } from "../../../../../../services/src/services/roomAllocationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
              item?.attributes?.room_allocations?.data[0]?.attributes?.room
                ?.data?.attributes?.room_number,
            roomAllocation: item?.attributes?.room_allocations?.data,
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
            recommendation_letter: item.attributes.recommendation_letter,
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

  const handleCancelBooking = async (e, request) => {
    e.stopPropagation();
    try {
      const roomAllocationId = request?.roomAllocation?.[0]?.id;
      if (roomAllocationId) {
        await deleteRoomAllocationById(roomAllocationId);
        // Update the booking request status to "awaiting"
        await updateBookingRequestById(request.id, {
          data: {
            status: "canceled",
            room_allocations: {
              disconnect: [roomAllocationId],
            },
          },
        });

        toast.success("Booking cancelled successfully!");

        // Fetch updated data and process it the same way as initial load
        const data = await getBookingRequestsByStatus("confirmed");
        const bookingData = data?.data?.data;
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
              item?.attributes?.room_allocations?.data[0]?.attributes?.room
                ?.data?.attributes?.room_number,
            roomAllocation: item?.attributes?.room_allocations?.data,
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
            recommendation_letter: item.attributes.recommendation_letter,
          }));
          setRequests(bookingRequests);
          setFilteredRequests(bookingRequests);
        }
      } else {
        toast.error("No room allocation found for this booking");
        console.error("No room allocation ID found for this booking");
      }
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className="Requests-main-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="requests-cards-section">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="requests-card"
            style={{ borderColor: "#A3D65C", position: "relative" }}
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
                  <p style={{ color: "#A3D65C" }}>{request.reason}</p>
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
                  <p>Assigned Room: {request.assignBed}</p>
                  {console.log("request", request)}
                </div>
              </div>
            </div>
            <div
              className="request-actions"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
                padding: "0 20px 10px",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add reschedule logic here
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#FFA500",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Reschedule
              </button>
              <button
                onClick={(e) => handleCancelBooking(e, request)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#FF4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
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
