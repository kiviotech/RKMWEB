import React, { useEffect, useState } from "react";
import "./ApproveGuestsGridView.scss";
import icons from "../../../constants/icons";
import CommonButton from "../../../components/ui/Button";
import {
  getBookingRequests,
  updateBookingRequest,
} from "../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../services/src/utils/storage";

const ApproveGuestsGridView = () => {
  const [guests, setGuests] = useState([]);

  // Fetch the booking requests (similar to ApproveGuests component)
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const data = await getBookingRequests();
        const bookingData = data?.data?.data;

        if (bookingData) {
          const filteredBookingData = bookingData.filter(
            (item) => item.attributes.status === "awaiting"
          );

          const bookingRequests = filteredBookingData.map((item) => ({
            id: item.id,
            name: item.attributes.name || "Unknown",
            reason: item.attributes.reason || "No History",
            status: item.attributes.status || "awaiting",
            bed: item.attributes.assignBed || "N/A",
            noOfGuestsMember: item.attributes.number_of_guest_members || "0",
            icons: [
              {
                id: 1,
                normal: icons.crossCircle,
                filled: icons.filledRedCircle,
                isActive: item.attributes.status === "rejected",
              },
              {
                id: 2,
                normal: icons.marked,
                filled: icons.markedYellow,
                isActive: item.attributes.status === "on_hold",
              },
              {
                id: 3,
                normal: icons.checkCircle,
                filled: icons.checkCircleMarked,
                isActive: item.attributes.status === "approved",
              },
            ],
          }));

          setGuests(bookingRequests);
        }
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      }
    };

    fetchBookingRequests();
  }, []);

  // Function to update booking request status
  const handleStatusChange = async (e, guestId, newStatus) => {
    e.stopPropagation();

    const token = await getToken(); // Fetch token
    if (!token) {
      // console.error("No token available for API requests");
      return;
    }

    try {
      // Update the request on the server
      const updatedData = { data: { status: newStatus } };
      const response = await updateBookingRequest(guestId, updatedData);
      // console.log(
      //   `Booking request updated to ${newStatus} successfully`,
      //   response
      // );

      // Update local state to reflect the status change
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === guestId
            ? {
                ...guest,
                status: newStatus, // Update status
                icons: guest.icons.map((icon) => {
                  if (newStatus === "approved" && icon.id === 3) {
                    return { ...icon, isActive: true }; // Activate approved icon
                  } else if (newStatus === "on_hold" && icon.id === 2) {
                    return { ...icon, isActive: true }; // Activate on_hold icon
                  } else if (newStatus === "rejected" && icon.id === 1) {
                    return { ...icon, isActive: true }; // Activate rejected icon
                  } else {
                    return { ...icon, isActive: false }; // Deactivate other icons
                  }
                }),
              }
            : guest
        )
      );
    } catch (error) {
      console.error(
        `Failed to update the booking request to ${newStatus}`,
        error
      );
    }
  };

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

  // Dynamic border color based on status
  const getCardBorderColor = (status) => {
    switch (status) {
      case "approved":
        return "#A3D65C"; // Green for approved
      case "on_hold":
        return "#FFD700"; // Yellow for on hold
      case "rejected":
        return "#FC5275"; // Red for rejected
      default:
        return "#D9D9D9"; // Default color
    }
  };

  return (
    <div className="grid_view_visit-history">
      <div className="grid_view_tableCont">
        <div className="grid_view_tableContHeader">
          <div className="grid_view_tableheader"></div>
          <div className="grid_view_tableheader">Name</div>
          <div className="grid_view_tableheader">Status</div>
          <div className="grid_view_tableheader">Reason</div>
          <div className="grid_view_tableheader">No. of guest members</div>
          <div className="grid_view_tableheader">Actions</div>
        </div>
        <div className="grid_view_tableContBody">
          {guests.map((guest) => (
            <div
              className="grid_view_tableContBodyEachRow"
              key={guest.id}
              style={{
                borderColor: getCardBorderColor(guest.status),
              }}
            >
              <div className="grid_view_tbalebody">
                <img src={icons.dummyUser} alt="user-image" />
              </div>
              <div className="grid_view_tbalebody">{guest.name}</div>
              <div className="grid_view_tbalebody">
                {getStatusIcon(guest.icons)}
              </div>
              <div className="grid_view_tbalebody">{guest.reason}</div>
              <div className="grid_view_tbalebody">
                {guest.noOfGuestsMember}
              </div>
              <div className="grid_view_tbalebody buttons">
                <CommonButton
                  buttonName="Approve"
                  buttonWidth="30%"
                  onClick={(e) => handleStatusChange(e, guest.id, "approved")}
                  style={{
                    backgroundColor: "#ECF8DB",
                    color: "#A3D65C",
                    borderColor: "#A3D65C",
                    fontSize: "14px",
                    borderRadius: "7px",
                    borderWidth: 1,
                    // padding: "5px 10px",
                    marginRight: "5px",
                  }}
                />
                <CommonButton
                  buttonName="Put on Hold"
                  buttonWidth="40%"
                  onClick={(e) => handleStatusChange(e, guest.id, "on_hold")}
                  style={{
                    backgroundColor: "#FFF4B2",
                    color: "#F2900D",
                    borderColor: "#F2900D",
                    fontSize: "14px",
                    borderRadius: "7px",
                    borderWidth: 1,
                    // padding: "5px 10px",
                    marginRight: "5px",
                  }}
                />
                <CommonButton
                  buttonName="Reject"
                  buttonWidth="30%"
                  onClick={(e) => handleStatusChange(e, guest.id, "rejected")}
                  style={{
                    backgroundColor: "#FFBDCB",
                    color: "#FC5275",
                    borderColor: "#FC5275",
                    fontSize: "14px",
                    borderRadius: "7px",
                    borderWidth: 1,
                    // padding: "5px 10px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproveGuestsGridView;
