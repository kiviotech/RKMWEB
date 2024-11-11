// import React, { useState, useEffect } from "react";
// import "./CheckoutDetails.scss";
// import SearchBar from "../../../components/ui/SearchBar";
// import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
// import GuestDetails from "../GuestDetails";
// import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";

// const CheckOutDetails = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [approvedAllocations, setApprovedAllocations] = useState([]);
//   const [filteredAllocations, setFilteredAllocations] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);
//   const [totalRequests, setTotalRequests] = useState(0);
//   const [totalCheckouts, setTotalCheckouts] = useState(0);

//   useEffect(() => {
//     const fetchAllocations = async () => {
//       try {
//         const response = await fetchBookingRequests();
//         const allAllocations = response.data;

//         const approvedAllocations = allAllocations.filter(
//           (allocation) => allocation.attributes.status === "approved"
//         );

//         setApprovedAllocations(approvedAllocations);
//         setFilteredAllocations(approvedAllocations);
//         setTotalRequests(allAllocations.length); // Total booking requests
//         setTotalCheckouts(checkedOutAllocations.length); // Total checkouts

//         if (approvedAllocations.length > 0) {
//           setSelectedUser(approvedAllocations[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching room allocations: ", error);
//       }
//     };

//     fetchAllocations();
//   }, []);

//   const handleSelectUser = (user) => {
//     setSelectedUser(user);
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === "") {
//       setFilteredAllocations(approvedAllocations);
//     } else {
//       const filtered = approvedAllocations.filter((allocation) =>
//         allocation.attributes.name.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredAllocations(filtered);
//       if (filtered.length > 0) {
//         setSelectedUser(filtered[0]);
//       }
//     }
//   };

//   return (
//     <div className="check-in-main-container">
//       <div className="check-in-datails check-out-details">
//         <div className="header">
//           <CommonHeaderTitle title="Check-outs" />
//           <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
//         </div>
//         <div className="progressBar">
//           <div className="progress checkoutProgress">
//             <div
//               className="progress-fill checkoutProgress-fill"
//               style={{
//                 width: `${(totalCheckouts / totalRequests) * 100}%`,
//               }}
//             ></div>
//           </div>
//           <div className="progress-text">
//             Checked-out: {totalCheckouts}/{totalRequests}
//           </div>
//         </div>
//         <div className="table-section">
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Reference no.</th>
//                 <th>Donation</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAllocations.length > 0 ? (
//                 filteredAllocations.map((allocation) => (
//                   <tr
//                     style={{ cursor: "pointer" }}
//                     key={allocation.id}
//                     onClick={() => handleSelectUser(allocation)}
//                     className={
//                       selectedUser?.id === allocation.id ? "selected-row" : ""
//                     }
//                   >
//                     <td>Mr. {allocation.attributes.name}</td>
//                     <td>{allocation.id}</td>
//                     <td>
//                       <span
//                         className={
//                           allocation.attributes.donation === "Paid"
//                             ? "donation-paid"
//                             : "donation-not-paid"
//                         }
//                       >
//                         {allocation.attributes.donation}
//                       </span>
//                     </td>
//                     <td>
//                       <button className="check-in-button checkout">
//                         Check out
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4">No approved room allocations found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {selectedUser && (
//         <GuestDetails selectedUser={selectedUser} showQRSection={false} />
//       )}
//     </div>
//   );
// };

// export default CheckOutDetails;





import React, { useState, useEffect } from "react";
import "./CheckoutDetails.scss";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";
<<<<<<< HEAD
import { fetchRoomAllocations } from "../../../../services/src/services/roomAllocationService";
=======
import { fetchRoomAllocations }  from "../../../../services/src/services/roomAllocationService";
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
import dayjs from "dayjs";

const CheckOutDetails = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalCheckouts, setTotalCheckouts] = useState(0);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await fetchRoomAllocations();
        const allAllocations = response.data;

        const currentDate = dayjs();
        const allocationsToShow = allAllocations.filter((allocation) => {
          const departureDate = dayjs(allocation.attributes.departure_date);
          return (
            currentDate.isSame(departureDate, "day") ||
            currentDate.isAfter(departureDate)
          );
        });

        setAllocations(allocationsToShow);
        setFilteredAllocations(allocationsToShow);
        setTotalRequests(allocationsToShow.length);

        if (allocationsToShow.length > 0) {
          setSelectedUser(allocationsToShow[0]);
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
      setFilteredAllocations(allocations);
    } else {
      const filtered = allocations.filter((allocation) =>
        allocation.attributes.booking_request.data.attributes.name
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredAllocations(filtered);
      if (filtered.length > 0) {
        setSelectedUser(filtered[0]);
      }
    }
  };

  return (
    <div className="check-in-main-container">
      <div className="check-in-datails check-out-details">
        <div className="header">
          <CommonHeaderTitle title="Check-outs" />
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
        </div>
        <div className="progressBar">
          <div className="progress checkoutProgress">
            <div
              className="progress-fill checkoutProgress-fill"
              style={{
                width: `${(totalCheckouts / totalRequests) * 100}%`,
              }}
            ></div>
          </div>
          <div className="progress-text">
            Checked-out: {totalCheckouts}/{totalRequests}
          </div>
        </div>
        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference no.</th>
                <th>Donation</th>
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
                      <span
                        className={
                          allocation.attributes.donation === "Paid"
                            ? "donation-paid"
                            : "donation-not-paid"
                        }
                      >
                        {allocation.attributes.donation}
                      </span>
                    </td>
                    <td>
                      <button className="check-in-button checkout">
                        Check out
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No room allocations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <GuestDetails
          selectedUser={selectedUser}
          showQRSection={false}
          checkout={true}
        />
      )}
    </div>
  );
};

export default CheckOutDetails;
