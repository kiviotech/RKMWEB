import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../../../services/src/utils/storage";
import { useNavigate } from "react-router-dom";

const TabApprovedGuestsGridView = ({ selectedDate }) => {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();
  const [filteredGuests, setFilteredGuests] = useState([]);

  const handleButtonClick = () => {
    navigate("/book-room");
  };

  // Fetch approved booking requests
  useEffect(() => {
    const fetchApprovedBookingRequests = async () => {
      try {
        const token = await getToken();
        if (!token) {
          // console.error("No token available for API requests");
          return;
        }

        const data = await getBookingRequestsByStatus("approved");
        const bookingData = data?.data?.data;

        if (bookingData) {
          const bookingRequests = bookingData.map((item) => ({
            id: item.id,
            name: item.attributes.name || "Unknown",
            createdAt: new Date(item.attributes.createdAt),
            status: item.attributes.status || "approved",
            bed: item.attributes.assignBed || "N/A",
            noOfGuestsMember: item.attributes.number_of_guest_members || "0",
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
          }));

          setGuests(bookingRequests);
          setFilteredGuests(guestsList); // Initialize filtered guests
        }
      } catch (error) {
        console.error("Error fetching approved booking requests:", error);
      }
    };

    fetchApprovedBookingRequests();
  }, []);

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

  const getStatusIcon = (icons) => {
    return icons.map((icon) =>
      icon.isActive ? (
        <img key={icon.id} src={icon.filled} alt="Active" />
      ) : (
        <img key={icon.id} src={icon.normal} alt="Inactive" />
      )
    );
  };

  const getCardBorderColor = (icons) => {
    const activeIcon = icons.find((icon) => icon.isActive);
    if (activeIcon) {
      if (activeIcon.id === 1) return "#FC5275"; // Red for rejected
      if (activeIcon.id === 2) return "#FFD700"; // Yellow for on_hold
      if (activeIcon.id === 3) return "#A3D65C"; // Green for approved
    }
    return "#D9D9D9"; // Default border color
  };

  return (
    <div className="grid_view_visit-history">
      <div className="grid_view_tableCont">
        {guests.length > 0 && (
          <div className="grid_view_tableContHeader">
            <div className="grid_view_tableheader"></div>
            <div className="grid_view_tableheader">Name</div>
            <div className="grid_view_tableheader">Status</div>
            <div
              className="grid_view_tableheader"
              style={{ minWidth: "200px" }}
            >
              No. of guest members
            </div>
            <div className="grid_view_tableheader">Bed(s)</div>
            <div className="grid_view_tableheader"></div>
          </div>
        )}
        <div className="grid_view_tableContBody">
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <div
                className="grid_view_tableContBodyEachRow"
                key={guest.id}
                style={{
                  borderColor: getCardBorderColor(guest.icons),
                }}
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

                <div className="grid_view_tbalebody">
                  <CommonButton
                    onClick={handleButtonClick}
                    buttonName="Change allocation"
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
                  />
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabApprovedGuestsGridView;
