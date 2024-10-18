import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import CommonButton from "../../../../../components/ui/Button";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest"; 
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from "react-router-dom";
import { getBookingRequestsByStatus, updateBookingRequest } from "../../../../../../services/src/api/repositories/bookingRequestRepository"; // Add updateBookingRequest

const PendingRequest = ({ selectedDate }) => {
    const navigate = useNavigate(); // for routing

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [iconId, setIconId] = useState(null);
    const [iconType, setIconType] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]); 

    // Fetch booking requests when component mounts
    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const data = await getBookingRequestsByStatus('awaiting');
                const bookingData = data?.data?.data;

                if (bookingData) {
                    const bookingRequests = bookingData.map((item) => ({
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
                            deeksha: item.attributes.deeksha,
                        },
                        assignBed: item.attributes.assignBed || "N/A",
                        noOfGuest: item.attributes.number_of_guest_members || "0",
                        isMarked: item.attributes.isMarked || false,
                        approved: item.attributes.approved || false,
                        icons: [
                            { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                            { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                            { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false }
                        ],
                        reason: item.attributes.reason || "No History",
                        guests: item.attributes.guests.data.map(guest => ({
                            id: guest.id,
                            name: guest.attributes.name,
                            age: guest.attributes.age,
                            gender: guest.attributes.gender,
                            relation: guest.attributes.relationship,
                        })),
                    }));

                    setRequests(bookingRequests);
                    setFilteredRequests(bookingRequests);
                }
            } catch (error) {
                console.error("Error fetching booking requests:", error);
            }
        };

        fetchBookingRequests();
    }, []);

    // Filter requests based on selected date
    useEffect(() => {
        if (selectedDate) {
            const filtered = requests
                .filter((request) => new Date(request.createdAt).toDateString() === selectedDate.toDateString())
                .sort((a, b) => a.createdAt - b.createdAt);

            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(requests);
        }
    }, [selectedDate, requests]);

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
            console.log("Error response data:", error.response?.data?.error);
        }
    };

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
                              icon.id === icon_Id ? { ...icon, isActive: !icon.isActive } : { ...icon, isActive: false }
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
                    <div key={request.id} className="requests-card" style={{ borderColor: getCardBorderColor(request.icons) }}>
                        <div className="actions-button">
                            {request.icons.map((icon) => (
                                <img
                                    key={icon.id}
                                    src={icon.isActive ? icon.filled : icon.normal}
                                    alt="icon"
                                    onClick={(e) => handleIconClick(e, request.id, icon.id, icon.normal)}
                                    style={{ display: "inline-block", marginRight: "5px", cursor: "pointer" }}
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
                                    {request.reason === "Has History" && <p>Assigned Bed(s): {request.assignBed}</p>}
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
            <PopUpFlagGuest isOpen={isModalOpen} onClose={closeModal} handleFlag={handleFlag} iconType={iconType} />
            {selectedGuest && (
                <GuestDetailsPopup isOpen={isGuestDetailsPopupOpen} onClose={closeModal} guestDetails={selectedGuest} guests={selectedGuest?.guests || []} />
            )}
        </div>
    );
};

export default PendingRequest;
