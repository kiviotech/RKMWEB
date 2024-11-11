import React, { useState, useEffect } from "react";
import "./DonationsHistory.scss";
import icons from "../../../constants/icons";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
import useGuestStore from "../../../../guestStore";

const DonationsHistory = ({ openPopup, openPopup1, limit }) => {
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const setSelectedGuest = useGuestStore((state) => state.setSelectedGuest);

<<<<<<< HEAD
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
        console.error("Error fetching guest details:", error);
        setGuestDetails([]);
      } finally {
        setLoading(false);
      }
    };
    getGuests();
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
=======
// export default DonationsHistory;


import React, { useState } from 'react';
import './DonationsHistory.scss';
import icons from '../../../constants/icons';

const DonationsHistory = ({ openPopup,openPopup1  }) => {
  const donations = [
    { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
    { name: 'Ms. Jane Smith', reference: '20240103-003', date: '01/01/2024', amount: '₹500' },
    { name: 'Dr. Alex Brown', reference: '20240103-004', date: '01/02/2024', amount: '₹600' },
    { name: 'Ms. Emily White', reference: '20240103-005', date: '02/02/2024', amount: '₹700' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  // Filter donations based on the search query
  // const filteredDonations = donations.filter(donation =>
  //   donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   donation.reference.includes(searchQuery)
  // );
  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.reference.includes(searchQuery)
  );
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a


  return (
    <div className="donations-history">
      <div className="header">
        <h2>Devotee Details</h2>
        <div className="controls">
          <input
            type="text"
<<<<<<< HEAD
            placeholder="Search Guest by Name or ID"
=======
            placeholder="Search Guest or Reference"
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="sort-btn">
<<<<<<< HEAD
            <img src={icons.sort} alt="sort" />
            Sort by
          </button>
          <button className="filter-btn">
            <img src={icons.filter} alt="filter" />
            Filter
          </button>
=======
            <img src={icons.sort} alt="sort" />Sort by</button>
          <button className="filter-btn">
            <img src={icons.filter} alt="filter" />Filter</button>
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px" }}></th>
            <th>Name</th>
<<<<<<< HEAD
            <th>Diksha no.</th>
            <th>Diksha Date</th>
            <th>Diksha Place</th>
=======
            <th>Reference no.</th>
            <th>Date of Donation</th>
            <th>Donation</th>
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
            <th>Add Donation</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
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
                        onClick={() => {
                          setSelectedGuest(guest);
                          openPopup1();
                        }}
                      >
                        <span>Donated</span>
                        <img src={icons.eyeIcon} alt="View" />
                      </button>
                    ) : (
                      <button
                        className="add-donation"
                        onClick={() => {
                          setSelectedGuest(guest);
                          openPopup();
                        }}
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
=======
          {filteredDonations.map((donation, index) => (
            <tr key={index}>
              <td>
                <div className="avatar"></div>
              </td>
              <td>
                {donation.name}
              </td>
              <td>{donation.reference}</td>
              <td>{donation.date}</td>
              <td>
                {donation.amount}
                {index % 2 === 0 && <span className="red-dot"></span>}
              </td>
              <td>
                {/* <button className='add-donation'>+</button> */}
                <div className='buttons'>
                <button className="add-donation" onClick={openPopup}>+</button> 
                <button className='eye-donation' onClick={openPopup1}><img src={icons.eyeIcon} alt="" /></button>
                </div>
              </td>
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsHistory;
