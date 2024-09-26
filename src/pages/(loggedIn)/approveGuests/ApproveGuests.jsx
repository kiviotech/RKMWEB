import React, { useState } from "react";
import "./ApproveGuests.scss";
import icons from "../../../constants/icons";
import CommonButton from "../../../components/ui/Button";
import PopUpFlagGuest from "../../../components/ui/PopUpFlagGuest"; // Adjust the import path as needed
import GuestDetailsPopup from "../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { useNavigate } from 'react-router-dom';

const ApproveGuests = () => {
    const navigate = useNavigate(); // for routing
    const [requests, setRequests] = useState([
        {
            id: 1,
            userImage: "",
            userDetails: {
                name: "Mr. John Deep",
                age: 27,
                gender: "M",
                email: "johnDeep@gmail.com",
                addharNo: "1234567890",
                mobile: "3545345443",
                arrivalDate: "2023-08-07",
                departureDate: "2023-08-14",
                occupation: "Engineer",
            },
            assignBed: 'Bed 305, 306',
            noOfGuest: "1",
            isMarked: false,
            approved: true,
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
        },
        {
            id: 2,
            userImage: "",
            userDetails: {
                name: "Mr. John Deep",
                age: 27,
                gender: "M",
                email: "johnDeep@gmail.com",
                addharNo: "1234567890",
                mobile: "3545345443",
                arrivalDate: "2023-08-07",
                departureDate: "2023-08-14",
                occupation: "Engineer",
            },

            assignBed: '',
            reason: "Approved",
            noOfGuest: "1",
            isMarked: false,
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
        },
        {
            id: 3,
            userImage: "",
            userDetails: {
                name: "Mr. John Deep",
                age: 27,
                gender: "M",
                email: "johnDeep@gmail.com",
                addharNo: "1234567890",
                mobile: "3545345443",
                arrivalDate: "2023-08-07",
                departureDate: "2023-08-14",
                occupation: "Engineer",
            },
            assignBed: 'Bed 309, 301',
            isMarked: false,
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
        },
        {
            id: 4,
            userImage: "",
            userDetails: {
                name: "Mr. John Deep",
                age: 27,
                gender: "M",
                email: "johnDeep@gmail.com",
                addharNo: "1234567890",
                mobile: "3545345443",
                arrivalDate: "2023-08-07",
                departureDate: "2023-08-14",
                occupation: "Engineer",
            },
            assignBed: '',
            reason: "Approved",
            noOfGuest: "1",
            isMarked: false,
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
        },
        // Other requests...
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false); // Manages the visibility of the modal for flagging a guest.
    const [requestId, setRequestId] = useState(null); // Stores the ID of the current request being processed.
    const [iconId, setIconId] = useState(null); // Stores the ID of the icon that was clicked, used to identify the action.
    const [iconType, setIconType] = useState(null); // Stores the type of the icon clicked, used to determine the specific action to be taken.
    const [selectedGuest, setSelectedGuest] = useState(null); // Stores the details of the selected guest for display or further actions.
    const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false); // Manages the visibility of the guest details popup.

    // function and state to handle toggler buttons

    const handleIconClick = (e, reqId, icon_Id, iconType) => {
        e.stopPropagation(); // Prevent card click event
        if (icon_Id === 3) {
            // Check if the last icon is clicked
            handleFlag("Approved", reqId, icon_Id);
        }
        // else {
        //     setRequestId(reqId);
        //     setIconId(icon_Id);
        //     setIsModalOpen(true);
        //     setIconType(iconType);
        //     setIsGuestDetailsPopupOpen(false);
        // }
    };

    const handleCardClick = (guestDetails) => {
        if (!isModalOpen) {
            setSelectedGuest(guestDetails);
            setIsGuestDetailsPopupOpen(true);
        }
    };

    const closeModal = () => {
        setIsGuestDetailsPopupOpen(false);
        setSelectedGuest(null);
        setIsModalOpen(false);
    };

    const handleFlag = (selectedReason, reqId = requestId, icon_Id = iconId) => {
        console.log(`Flagging guest for reason: ${selectedReason}`);
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
            if (activeIcon.id === 1) return "#FC5275"; // color of the "Reject" button
            if (activeIcon.id === 2) return "#FFD700"; // color of the "Flag" button (or a similar color)
            if (activeIcon.id === 3) return "#A3D65C"; // color of the "Approve" button
        }
        return "#A3D65C"; // default border color
    };


    const gotoAllocateRoomPage = () => {
        navigate("/book-room")
    }
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
                                    <p>Assigned Bed(s): {request.assignBed}</p>
                                </div>



                                <div className="buttons">
                                    {request.assignBed === '' ? (
                                        <CommonButton onClick={gotoAllocateRoomPage}
                                            buttonName="Allocate"
                                            buttonWidth="auto"
                                            style={{
                                                backgroundColor: "#ECF8DB",
                                                color: "#A3D65C",
                                                borderColor: "#A3D65C",
                                                fontSize: "18px",
                                                borderRadius: "7px",
                                                borderWidth: 1,
                                                padding: "8px 20px",
                                            }}
                                        />
                                    ) : (
                                        <CommonButton onClick={gotoAllocateRoomPage}
                                            buttonName="Change allocation"
                                            buttonWidth="auto"
                                            style={{
                                                backgroundColor: "#FFBDCB",
                                                color: "#FC5275",
                                                borderColor: "#FC5275",
                                                fontSize: "18px",
                                                borderRadius: "7px",
                                                borderWidth: 1,
                                                padding: "8px 20px",
                                            }}
                                        />
                                    )}
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
                    guestDetails={selectedGuest}
                />
            )}
        </div>
    );
};

export default ApproveGuests;
