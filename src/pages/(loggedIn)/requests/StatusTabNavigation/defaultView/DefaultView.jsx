import React, { useState } from "react";
import "../../../allocateRoom/AllocateRoom.scss";
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest";
import './DefaultView.scss';

const DefaultView = ({ tabLabels }) => {
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
      reason: "Reason for them getting flagged",
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
          isActive: true,
        },
        {
          id: 3,
          normal: icons.checkCircle,
          filled: icons.checkCircleMarked,
          isActive: false,
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

  const handleIconClick = (e, reqId, icon_Id, iconType) => {
    e.stopPropagation(); // Prevent card click event
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
    if (tabLabels === "rejected") {
      return "#FC5275"; // Border color for rejected
    } else if (tabLabels === "On hold") {
      return "#FFD700"; // Example default for "On hold"
    } else {
      const activeIcon = icons.find((icon) => icon.isActive);
      if (activeIcon) {
        if (activeIcon.id === 1) return "#FC5275"; // color of the "Reject" button
        if (activeIcon.id === 2) return "#FFD700"; // color of the "Flag" button (or a similar color)
        if (activeIcon.id === 3) return "#A3D65C"; // color of the "Approve" button
      }
      return "#A3D65C"; // default border color
    }
  };

  const getIconByTabLabel = (icons) => {
    if (tabLabels === "rejected") {
      return icons.map((icon) =>
        icon.id === 1 ? { ...icon, isActive: true } : { ...icon, isActive: false }
      );
    } else if (tabLabels === "On hold") {
      return icons.map((icon) =>
        icon.id === 2 ? { ...icon, isActive: true } : { ...icon, isActive: false }
      );
    }
    return icons;
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
              {getIconByTabLabel(request.icons).map((icon) => (
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
                <p style={{ color: getCardBorderColor(request.icons) }}>
                  {request.reason}
                </p>
                <p>Number of guest members: {request.noOfGuest}</p>

                <div className="buttons">
                  <CommonButton
                    buttonName="Approve"
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

                  <CommonButton
                    buttonName="Reject"
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

export default DefaultView;
