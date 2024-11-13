import React, { useEffect, useState } from "react";
import { icons } from "../../../../../constants";
import CommonButton from "../../../../../components/ui/Button";
import { getBookingRequestsByStatus, updateBookingRequest } from '../../../../../../services/src/api/repositories/bookingRequestRepository';
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../../../../services/src/utils/storage";

const TabOnHoldGridView = ({ selectedDate }) => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);

  useEffect(() => {
    const fetchOnHoldRequests = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No token available for API requests");
          return;
        }

        const data = await getBookingRequestsByStatus('on_hold');
        const bookingData = data?.data?.data;

        if (bookingData) {
          const onHoldRequests = bookingData.map((item) => ({
              id: item.id,
              name: item.attributes.name,
              createdAt: new Date(item.attributes.createdAt),
              status: "on_hold",
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
                  isActive: true,
                },
                {
                  id: 3,
                  normal: icons.checkCircle,
                  filled: icons.checkCircleMarked,
                  isActive: false,
                },
              ],
            }));

          setGuests(onHoldRequests);
          setFilteredGuests(onHoldRequests);
        }
      } catch (error) {
        console.error("Error fetching on-hold requests:", error);
      }
    };

    fetchOnHoldRequests();
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
      setFilteredGuests(guests);
    }
  }, [selectedDate, guests]);

  const handleStatusChange = async (guestId, newStatus) => {
    const token = await getToken();
    if (!token) {
      console.error("No token available for API requests");
      return;
    }

    try {
      const updatedData = { data: { status: newStatus } };
      const response = await updateBookingRequest(guestId, updatedData);
      console.log(
        `Booking request updated to ${newStatus} successfully`,
        response
      );

      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === guestId
            ? {
                ...guest,
                status: newStatus,
                icons: guest.icons.map((icon) => {
                  if (newStatus === "approved" && icon.id === 3) {
                    return { ...icon, isActive: true };
                  } else if (newStatus === "on_hold" && icon.id === 2) {
                    return { ...icon, isActive: true };
                  } else if (newStatus === "rejected" && icon.id === 1) {
                    return { ...icon, isActive: true };
                  } else {
                    return { ...icon, isActive: false };
                  }
                }),
              }
            : guest
        )
      );
    } catch (error) {
      console.error(`Failed to update booking request to ${newStatus}`, error);
    }
  };

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
      {filteredGuests.length > 0 ? (
        <div className="grid_view_tableCont">
          <div className="grid_view_tableContHeader">
            <div className="grid_view_tableheader"></div>
            <div className="grid_view_tableheader">Name</div>
            <div className="grid_view_tableheader">Status</div>
            <div className="grid_view_tableheader">No. of guest members</div>
            <div className="grid_view_tableheader">Bed(s)</div>
            <div className="grid_view_tableheader"></div>
          </div>
          <div className="grid_view_tableContBody">
            {filteredGuests.map((guest) => (
              <div
                className="grid_view_tableContBodyEachRow"
                key={guest.id}
                style={{
                  borderColor:
                    guest.status === "on_hold" ? "#FFD700" : "#D9D9D9",
                }}
              >
                <div className="grid_view_tbalebody">
                  <img src={icons.dummyUser} alt="user" />
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
                <div className="grid_view_tbalebody buttons">
                  <CommonButton
                    onClick={() => handleStatusChange(guest.id, "approved")}
                    buttonName="Approve"
                    buttonWidth="45%"
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
                    onClick={() => handleStatusChange(guest.id, "rejected")}
                    buttonName="Reject"
                    buttonWidth="45%"
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
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default TabOnHoldGridView;
