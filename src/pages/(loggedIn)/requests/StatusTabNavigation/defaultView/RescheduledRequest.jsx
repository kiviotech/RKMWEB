import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { getBookingRequestsByStatus, updateBookingRequest } from "../../../../../../services/src/api/repositories/bookingRequestRepository"; // Ensure updateBookingRequest is imported

const RescheduledRequest = ({ selectedDate }) => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchApprovedGuests = async () => {
            try {
                const data = await getBookingRequestsByStatus("rescheduled");
                const guestData = data?.data?.data;

                if (guestData) {
                    const guestRequests = guestData.map((item) => ({
                        id: item.id,
                        userImage: item.attributes.userImage || "",
                        createdAt: new Date(item.attributes.createdAt),
                        userDetails: {
                            name: item.attributes.name,
                            age: item.attributes.age,
                            gender: item.attributes.gender,
                            email: item.attributes.email,
                            addharNo: "XXXX-XXXX-XXXX",
                            mobile: item.attributes.phone_number,
                            arrivalDate: item.attributes.arrival_date,
                            departureDate: item.attributes.departure_date,
                            occupation: item.attributes.occupation,
                            createdAt: item.attributes.created_at,
                        },
                        assignBed: item.attributes.assignBed || "N/A",
                        noOfGuest: item.attributes.number_of_guest_members || "0",
                        reason: item.attributes.reason || "No History",
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
                    }));
                    setRequests(guestRequests);
                    setFilteredRequests(guestRequests);
                }
            } catch (error) {
                setError("Error fetching approved guests");
                console.error("Error fetching approved guests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedGuests();
    }, []);

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
            if (activeIcon.id === 1) return "#FC5275"; // color of the "Reject" button
            if (activeIcon.id === 2) return "#FFD700"; // color of the "Flag" button (or a similar color)
            if (activeIcon.id === 3) return "#A3D65C"; // color of the "Approve" button
        }
        return "#D9D9D9"; // default border color
    };

    // Function to update booking request status
    const handleStatusChange = async (e, requestId, newStatus) => {
        e.stopPropagation();

        try {
            const updatedData = {
                data: {
                    status: newStatus,
                },
            };

            // Call the API to update the booking request status
            const response = await updateBookingRequest(requestId, updatedData);

            // Log the response and update the UI
            console.log(`Booking request updated to ${newStatus} successfully`, response);

            // Update the state to reflect the status change
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId
                        ? {
                              ...request,
                              reason: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                              icons: request.icons.map((icon) => {
                                  if (icon.id === 3 && newStatus === "approved") {
                                      return { ...icon, isActive: true };
                                  } else if (icon.id === 2 && newStatus === "on_hold") {
                                      return { ...icon, isActive: true };
                                  } else if (icon.id === 1 && newStatus === "rejected") {
                                      return { ...icon, isActive: true };
                                  } else {
                                      return { ...icon, isActive: false };
                                  }
                              }),
                          }
                        : request
                )
            );
        } catch (error) {
            console.error(`Failed to update the booking request to ${newStatus}`, error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loader component
    }

    if (error) {
        return <div>{error}</div>; // Display error message
    }

    return (
        <div className="Requests-main-container">
            <div className="requests-cards-section">
                {filteredRequests.map((request) => (
                    <div
                        key={request.id}
                        className="requests-card"
                        style={{ borderColor: getCardBorderColor(request.icons) }}
                    >
                        <div className="actions-button">
                            {request.icons.map((icon) => (
                                <img
                                    key={icon.id}
                                    src={icon.isActive ? icon.filled : icon.normal}
                                    alt={`icon`} // Added descriptive alt text
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
                                <img src={icons.person} alt="user-image" />
                                <p>{request.userDetails.name}</p>
                            </div>
                            <div className="reasons">
                                <div>
                                    <p style={{ color: getCardBorderColor(request.icons) }}>{request.reason}</p>
                                    <p>Number of guest members: {request.noOfGuest}</p>
                                    <p>Assigned Bed(s): {request.assignBed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            <CommonButton
                                buttonName="Approve"
                                buttonWidth="28%"
                                onClick={(e) => handleStatusChange(e, request.id, "approved")}
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
                                buttonName="Put on Hold"
                                buttonWidth="40%"
                                onClick={(e) => handleStatusChange(e, request.id, "on_hold")}
                                style={{
                                    backgroundColor: "#FFF4B2",
                                    color: "#F2900D",
                                    borderColor: "#F2900D",
                                    fontSize: "14px",
                                    borderRadius: "7px",
                                    borderWidth: 1,
                                }}
                            />
                            <CommonButton
                                buttonName="Reject"
                                buttonWidth="28%"
                                onClick={(e) => handleStatusChange(e, request.id, "rejected")}
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
            {selectedGuest && (
                <GuestDetailsPopup
                    isOpen={isGuestDetailsPopupOpen}
                    onClose={closeModal}
                    guestDetails={selectedGuest}
                />
            )}
        </div>
    );
};

export default RescheduledRequest;
