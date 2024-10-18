import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";

const ApprovedGuests = ({ selectedDate }) => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false); 

    useEffect(() => {
        const fetchApprovedGuests = async () => {
            try {
                const data = await getBookingRequestsByStatus('approved');
                const guestData = data?.data?.data;
                
                if (guestData) {
                    const guestRequests = guestData.map(item => ({
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
                            createdAt: item.attributes.created_at // Ensure this is part of the response
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
                                isActive: true,
                            },
                        ]
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

    const gotoAllocateRoomPage = () => {
        navigate("/book-room");
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
                        style={{ borderColor: "#A3D65C" }} // Default border color
                        // onClick={() => handleCardClick(request)}
                    >
                        <div className="actions-button">
                            {request.icons.map((icon) => (
                                <img
                                    key={icon.id}
                                    src={icon.isActive ? icon.filled : icon.normal}
                                    alt={`icon-${icon.id}`} // Added descriptive alt text
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
                                    <p style={{ color: "#A3D65C" }}>{request.reason}</p>
                                    <p>Number of guest members: {request.noOfGuest}</p>
                                    <p>Assigned Bed(s): {request.assignBed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                                    <CommonButton
                                        buttonName="Allocate Rooms"
                                        buttonWidth="auto"
                                        onClick={gotoAllocateRoomPage}
                                        style={{
                                            backgroundColor: "#FFBDCB",
                                            color: "#FC5275",
                                            borderColor: "#FC5275",
                                            fontSize: "14px",
                                            borderRadius: "7px",
                                            borderWidth: 1,
                                            // padding: "8px 20px",
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

export default ApprovedGuests;
