import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import { getBookingRequestsByStatus } from '../../../../../../services/src/api/repositories/bookingRequestRepository';
import GuestDetailsPopup from "../../../../../components/ui/GuestDetailsPopup/GuestDetailsPopup";
import PopUpFlagGuest from "../../../../../components/ui/PopUpFlagGuest";
import { useNavigate } from "react-router-dom";

const TabCancelledGridView = ({ selectedDate }) => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconId, setIconId] = useState(null);
  const [iconType, setIconType] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Fetch the rejected booking requests
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getBookingRequestsByStatus('canceled');
        const bookingData = data?.data?.data;

        if (bookingData) {
          const rejectedRequests = bookingData.map((item) => ({
              id: item.id,
              name: item.attributes.name,
              createdAt: new Date(item.attributes.createdAt),
              status: "rejected",
              bed: item.attributes.assignBed || "N/A",
              noOfGuestsMember: item.attributes.number_of_guest_members || "0",
              reason: item.attributes.reason || "No History",
              icons: [
                {
                  id: 1,
                  normal: icons.crossCircle,
                  filled: icons.filledRedCircle,
                  isActive: true,
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
          setGuests(rejectedRequests);
          setFilteredGuests(rejectedRequests);
        }
      } catch (error) {
        console.error("Error fetching rejected requests:", error);
      }
    };

    fetchGuests();
  }, []);

  // Filter guests based on the selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = guests.filter(
        (guest) =>
          new Date(guest.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
      setFilteredGuests(filtered);
    } else {
      setFilteredGuests(guests); // Show all if no date selected
    }
  }, [selectedDate, guests]);

  // Handle the click on icons (approve, flag, reject)
  const handleIconClick = (e, reqId, icon_Id, iconType) => {
    e.stopPropagation(); // Prevent card click event
    setRequestId(reqId);
    setIconId(icon_Id);
    setIsModalOpen(true);
    setIconType(iconType);
    setIsGuestDetailsPopupOpen(false);
  };

  // Handle the click on the guest card to open details
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

  // Render the correct status icons
  const getStatusIcon = (icons) => {
    return icons.map((icon) =>
      icon.isActive ? (
        <img key={icon.id} src={icon.filled} alt="Active" />
      ) : (
        <img key={icon.id} src={icon.normal} alt="Inactive" />
      )
    );
  };

  // Get the card border color based on status
  const getCardBorderColor = (icons) => {
    const activeIcon = icons.find((icon) => icon.isActive);
    if (activeIcon) {
      if (activeIcon.id === 1) return "#FC5275"; // Red for rejected
      if (activeIcon.id === 2) return "#FFD700"; // Yellow for flagged
      if (activeIcon.id === 3) return "#A3D65C"; // Green for approved
    }
    return "#D9D9D9"; // Default border color
  };

  return (
    <div className="grid_view_visit-history">
      {filteredGuests.length > 0 ? (
        <div className="grid_view_tableCont">
          <div className="grid_view_tableContHeader">
            <div className="grid_view_tableheader"></div>
            <div className="grid_view_tableheader">Name</div>
            <div className="grid_view_tableheader">Status</div>
            <div className="grid_view_tableheader">No. of guest members</div>
            <div className="grid_view_tableheader">Bed(s)</div>
            <div className="grid_view_tableheader">Reason</div>
          </div>
          <div className="grid_view_tableContBody">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className="grid_view_tableContBodyEachRow"
                style={{ borderColor: getCardBorderColor(guest.icons) }}
                onClick={() => handleCardClick(guest)}
              >
                <div className="grid_view_tbalebody">
                  <img src={icons.dummyUser} alt="user-image" />
                </div>
                <div className="grid_view_tbalebody">{guest.name}</div>
                <div className="grid_view_tbalebody">
                  {getStatusIcon(guest.icons)}
                </div>
                <div
                  className="grid_view_tbalebody"
                  style={{ textAlign: "center" }}
                >
                  {guest.noOfGuestsMember}
                </div>
                <div className="grid_view_tbalebody">{guest.bed}</div>
                <div className="grid_view_tbalebody">{guest.reason}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No rejected guests found.</p>
      )}

      {/* Modals */}
      <PopUpFlagGuest
        isOpen={isModalOpen}
        onClose={closeModal}
        handleFlag={() => console.log("Flagged!")} // Placeholder function
        iconType={iconType}
      />
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

export default TabCancelledGridView;
