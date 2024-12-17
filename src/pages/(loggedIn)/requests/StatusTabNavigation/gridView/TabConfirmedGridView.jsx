import React, { useEffect, useState } from "react";
import icons from "../../../../../constants/icons";
import { getBookingRequestsByStatus } from "../../../../../../services/src/api/repositories/bookingRequestRepository";
import "./GridView.scss";

const TabConfirmedGridView = ({ selectedDate }) => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);

  // Fetch the confirmed booking requests
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequestsByStatus("confirmed");
        console.log("Raw API Response (Grid):", data);
        const bookingData = data?.data?.data;
        console.log("Booking Data (Grid):", bookingData);

        if (bookingData) {
          const bookingRequests = bookingData.map((item) => ({
            id: item.id,
            name: item.attributes.name || "Unknown",
            createdAt: new Date(item.attributes.createdAt),
            reason: item.attributes.reason || "Confirmed",
            status: item.attributes.status || "confirmed",
            bed:
              item.attributes.guests?.data?.[0]?.attributes?.room?.data
                ?.attributes?.room_number || "N/A",
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
                isActive: true, // Always active for confirmed requests
              },
            ],
          }));

          console.log("Processed Grid Booking Requests:", bookingRequests);
          setGuests(bookingRequests);
          setFilteredGuests(bookingRequests);
        }
      } catch (error) {
        console.error("Error fetching confirmed requests:", error);
      }
    };

    fetchBookingRequests();
  }, []);

  // Filter guests based on selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = guests.filter(
        (guest) =>
          new Date(guest.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
      console.log("Date Filtered Guests:", filtered);
      setFilteredGuests(filtered);
    } else {
      setFilteredGuests(guests);
    }
  }, [selectedDate, guests]);

  // Function to get the status icon based on the current status
  const getStatusIcon = (icons) => {
    return icons.map((icon) =>
      icon.isActive ? (
        <img key={icon.id} src={icon.filled} alt="Active" />
      ) : (
        <img key={icon.id} src={icon.normal} alt="Inactive" />
      )
    );
  };

  return (
    <div className="grid_view_visit-history">
      <div className="grid_view_tableCont">
        <div className="grid_view_tableContHeader">
          <div className="grid_view_tableheader"></div>
          <div className="grid_view_tableheader">Name</div>
          <div className="grid_view_tableheader">Status</div>
          <div className="grid_view_tableheader">No. of guest members</div>
          <div className="grid_view_tableheader">Assigned Bed</div>
        </div>
        <div className="grid_view_tableContBody">
          {filteredGuests.map((guest) => (
            <div
              className="grid_view_tableContBodyEachRow"
              key={guest.id}
              style={{
                borderColor: "#A3D65C",
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabConfirmedGridView;
