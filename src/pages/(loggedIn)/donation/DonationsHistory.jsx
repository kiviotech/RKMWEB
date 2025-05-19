import React, { useState, useEffect } from "react";
import "./DonationsHistory.scss";
import icons from "../../../constants/icons";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
import useGuestStore from "../../../../guestStore";

const DonationsHistory = ({ openPopup, openPopup1, limit }) => {
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setSelectedGuest = useGuestStore((state) => state.setSelectedGuest);

  const refreshData = () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const getGuests = async () => {
      try {
        const response = await fetchGuestDetails();
        if (response && response.data && Array.isArray(response.data)) {
          const guests = response.data.map((item) => ({
            id: item.id,
            ...item.attributes,
          }));
          setGuestDetails(guests);
        } else {
          setGuestDetails([]);
        }
      } catch (error) {
        // console.error("Error fetching guest details:", error);
        setGuestDetails([]);
      } finally {
        setLoading(false);
      }
    };
    getGuests();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const data = limit || 4;
  const filteredGuests = guestDetails
    .filter(
      (guest) =>
        guest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.id?.toString().includes(searchQuery)
    )
    .slice(0, data);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleOpenPopup = (guest) => {
    openPopup(guest);
  };

  const handleOpenPopup1 = (guest) => {
    setSelectedGuest(guest);
    refreshData();
    openPopup1();
  };

  return (
    <div className="donations-history">
      <div className="header">
        <h2>Devotee Details</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search Guest by Name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="sort-btn">
            <img src={icons.sort} alt="sort" />
            Sort by
          </button>
          <button 
            className="refresh-btn" 
            onClick={refreshData}
            title="Refresh data"
          >
            <img src={icons.refresh || icons.reload || icons.update || "https://img.icons8.com/material-outlined/24/000000/refresh.png"} alt="refresh" />
          </button>
          <button className="filter-btn">
            <img src={icons.filter} alt="filter" />
            Filter
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px" }}></th>
            <th>Name</th>
            <th>Diksha no.</th>
            <th>Diksha Date</th>
            <th>Diksha Place</th>
            <th>Add Donation</th>
          </tr>
        </thead>
        <tbody>
          {/* {console.log("filtered", filteredGuests)} */}
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <tr key={guest.id}>
                <td>
                  <div className="avatar"></div>
                </td>
                <td>{guest.name || "N/A"}</td>
                <td>{guest.dikshaNumber || "N/A"}</td>
                <td>{guest.dikshaDate || "N/A"}</td>
                <td>{guest.dikshaPlace || "N/A"}</td>
                <td>
                  <div className="buttons">
                    {guest.donations?.data?.length > 0 ? (
                      <button
                        className="eye-donation"
                        onClick={() => handleOpenPopup1(guest)}
                      >
                        <span>Donated</span>
                        <img src={icons.eyeIcon} alt="View" />
                      </button>
                    ) : (
                      <button
                        className="add-donation"
                        onClick={() => handleOpenPopup(guest)}
                      >
                        <img src={icons.plus} alt="Add" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No guests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsHistory;
