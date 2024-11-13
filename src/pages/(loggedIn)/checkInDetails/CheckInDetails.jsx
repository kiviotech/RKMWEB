import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CheckInDetails.scss";
import { icons } from "../../../constants";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";
import { fetchRoomAllocations } from "../../../../services/src/services/roomAllocationService";
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

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQRcodeScanned(true);
  };

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await fetchRoomAllocations();
        const allAllocations = response.data;

        console.log("Fetched Room Allocations Data:", allAllocations);

        setTotalRequests(allAllocations.length);
        setAllAllocations(allAllocations);

        // Filter by current date between arrival and departure
        const currentDate = dayjs();
        const allocationsInRange = allAllocations.filter((allocation) => {
          const arrivalDate = dayjs(allocation.attributes.arrival_date);
          const departureDate = dayjs(allocation.attributes.departure_date);
          return (
            currentDate.isAfter(arrivalDate) &&
            currentDate.isBefore(departureDate)
          );
        });

        setFilteredAllocations(allocationsInRange);

        if (allocationsInRange.length > 0) {
          setSelectedUser(allocationsInRange[0]);
        }
      } catch (error) {
        console.error("Error fetching room allocations: ", error);
      }
    };

    fetchAllocations();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAllocations(allAllocations);
    } else {
      const filtered = allAllocations.filter((allocation) =>
        allocation.attributes.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAllocations(filtered);

      if (filtered.length > 0) {
        setSelectedUser(filtered[0]);
      }
    }
  };

  // Function to format dates
  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

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
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={allocation.id}
                    onClick={() => handleSelectUser(allocation)}
                    className={
                      selectedUser?.id === allocation.id ? "selected-row" : ""
                    }
                  >
                    <td>
                      Mr.{" "}
                      {
                        allocation.attributes.booking_request.data.attributes
                          .name
                      }
                    </td>
                    <td>{allocation.id}</td>
                    <td>
                      <button className="check-in-button">Check in</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No room allocations found within the specified date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <GuestDetails
          selectedUser={selectedUser}
          showQRSection={true}
          checkout={false}
        />
      )}
    </div>
  );
};

export default CheckInDetails;
