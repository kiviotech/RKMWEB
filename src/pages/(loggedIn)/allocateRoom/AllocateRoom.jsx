// import React from 'react';
// import './AllocateRoom.scss';
// import SearchBar from '../../../components/ui/SearchBar';
// import CommonHeaderTitle from '../../../components/ui/CommonHeaderTitle';
// import { icons } from '../../../constants';
// import CommonButton from '../../../components/ui/Button';
// import { useNavigate } from 'react-router-dom';
// const AllocateRoomV2 = () => {
//     const guests = [
//         { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
//         { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
//         { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
//     ];
//     const navigate = useNavigate();
//     const navigateToPage = (url) => {
//         navigate(url);
//     };

//     return (
//         <div className="AllocateRoomV2-main-container">
//             <div className="header">
//                 <CommonHeaderTitle title="Request" />
//                 <SearchBar />
//             </div>
//             <div className="allocateRoomV2-card-container">
//                 {guests.map((guest, index) => (
//                     <div className="guest-card" key={index}>
//                         <img
//                             src={icons.userDummyImage}
//                             alt="Guest Avatar"
//                             className="avatar"
//                         />
//                         <h3>{guest.name}</h3>
//                         <div className="guest-details">
//                             <p> Email: <span>{guest.email}</span></p>
//                             <p>Aadhar no: <span>{guest.Aadharno}</span></p>
//                         </div>
//                         <div className="buttons">
//                             <CommonButton
//                                 onClick={() => navigateToPage('/book-room')}
//                                 buttonName="Allocate Room"
//                                 buttonWidth="auto"
//                                 style={{
//                                     backgroundColor: '#9866E9',
//                                     borderColor: 'none',
//                                     fontSize: '18px',
//                                     borderRadius: '7px',
//                                     borderWidth: 0,
//                                     padding: '8px 30px'
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AllocateRoomV2;



import React, { useState, useEffect } from "react";
import "./AllocateRoom.scss";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import { icons } from "../../../constants";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";

const AllocateRoomV2 = () => {
  const [pendingAllocations, setPendingAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await fetchBookingRequests();
        const allAllocations = response.data;

        const pending = allAllocations.filter(
          (allocation) => allocation.attributes.status === "awaiting"
        );
        setPendingAllocations(pending);
        setFilteredAllocations(pending);
      } catch (error) {
        console.error("Error fetching pending room allocations: ", error);
      }
    };

    fetchAllocations();
  }, []);

  const navigateToPage = (url) => {
    navigate(url);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredAllocations(pendingAllocations);
    } else {
      const filtered = pendingAllocations.filter((allocation) =>
        allocation.attributes.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAllocations(filtered);
    }
  };

  return (
    <div className="AllocateRoomV2-main-container">
      <div className="header">
        <CommonHeaderTitle title="Pending Room Allocations" />
        <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
      </div>
      <div className="allocateRoomV2-card-container">
        {filteredAllocations.length > 0 ? (
          filteredAllocations.map((allocation) => (
            <div className="guest-card" key={allocation.id}>
              <img
                src={icons.userDummyImage}
                alt="Guest Avatar"
                className="avatar"
              />
              <h3>Mr. {allocation.attributes.name}</h3>
              <div className="guest-details">
                <p>Email: {allocation.attributes.email}</p>
                <p>Aadhar no: {allocation.attributes.aadhaar_number}</p>
              </div>
              <div className="buttons">
                <CommonButton
                  onClick={() => navigateToPage("/book-room")}
                  buttonName="Allocate Room"
                  buttonWidth="auto"
                  style={{
                    backgroundColor: "#9866E9",
                    borderColor: "none",
                    fontSize: "18px",
                    borderRadius: "7px",
                    borderWidth: 0,
                    padding: "8px 30px",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="no-allocations">
            No pending room allocations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocateRoomV2;
