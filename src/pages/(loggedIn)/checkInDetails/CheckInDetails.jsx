import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CheckInDetails.scss";
import { icons } from "../../../constants";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";
import dayjs from "dayjs";

const CheckInDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allAllocations, setAllAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [checkIns, setCheckIns] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResponse = await fetchBookingRequests();
        const bookingData = bookingResponse.data;
        console.log("Booking Data:", bookingData);

        // Filter for tomorrow's bookings
        const tomorrow = dayjs().add(1, "day").startOf("day");
        const tomorrowsBookings = bookingData.filter((booking) => {
          const arrivalDate = dayjs(booking.attributes.arrival_date).startOf(
            "day"
          );
          return arrivalDate.isSame(tomorrow);
        });

        setAllAllocations(tomorrowsBookings);
        setFilteredAllocations(tomorrowsBookings);
        setTotalRequests(tomorrowsBookings.length);

        if (tomorrowsBookings.length > 0) {
          setSelectedUser(tomorrowsBookings[0]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQRcodeScanned(true);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAllocations(allAllocations);
    } else {
      const filtered = allAllocations.filter((booking) =>
        booking.attributes.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAllocations(filtered);

      if (filtered.length > 0) {
        setSelectedUser(filtered[0]);
      }
    }
  };

  return (
    <div className="check-in-main-container">
      <div className="check-in-datails">
        <div className="header">
          <CommonHeaderTitle title="Check-ins" />
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
        </div>

        <div className="progressBar">
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${(checkIns / totalRequests) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Checked-in: {checkIns}/{totalRequests}
          </div>
        </div>

        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference no.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allAllocations.length === 0 ? (
                <tr>
                  <td colSpan="3">No check-ins scheduled for tomorrow.</td>
                </tr>
              ) : (
                filteredAllocations.map((booking) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={booking.id}
                    onClick={() => handleSelectUser(booking)}
                    className={
                      selectedUser?.id === booking.id ? "selected-row" : ""
                    }
                  >
                    <td>Mr. {booking.attributes.name}</td>
                    <td style={{ textAlign: "center" }}>{booking.id}</td>
                    <td>
                      <button className="check-in-button">Check in</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <GuestDetails
          selectedUser={{
            id: selectedUser.id,
            attributes: {
              booking_request: {
                data: {
                  id: selectedUser.id,
                  attributes: selectedUser.attributes,
                },
              },
            },
          }}
          showQRSection={true}
          checkout={false}
        />
      )}
    </div>
  );
};

export default CheckInDetails;
