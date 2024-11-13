// import React, { useState, useEffect } from "react";
// import "./Rooms.scss";
// import { icons } from "../../../constants";
// import { fetchBeds } from "../../../../services/src/services/bedService";
// import useBookingStore from "../../../../useBookingStore";

// const Rooms = ({
//   rooms,
//   selectedMonth,
//   selectedYear,
//   updateSelectedBedsCount,
//   userData,
// }) => {
//   const [dates, setDates] = useState([]);
//   const [bedStates, setBedStates] = useState([]);
//   const [beds, setBeds] = useState([]);

//   const {
//     allocationData,
//     setBeds: setSelectedBeds,
//     setBookingRequest,
//     setGuests,
//   } = useBookingStore();

//   useEffect(() => {
//     // console.log("Zustand allocation data:", allocationData);
//   }, [allocationData]);

//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   useEffect(() => {
//     if (userData) {
//       setBookingRequest(userData.id);
//       setGuests(userData.guests.map((guest) => guest.id));
//     }
//   }, [userData, setBookingRequest, setGuests]);

//   useEffect(() => {
//     const fetchBedsData = async () => {
//       try {
//         const bedData = await fetchBeds();
//         setBeds(bedData.data);

//         const monthIndex = [
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec",
//         ].indexOf(selectedMonth);
//         const daysInMonth = getDaysInMonth(monthIndex, selectedYear);

//         const newDates = Array.from(
//           { length: daysInMonth },
//           (_, i) => `${i + 1} ${selectedMonth}`
//         );
//         setDates(newDates);

//         const roomBedStates = rooms.map((room) => {
//           const bedsInRoom = bedData.data.filter(
//             (bed) =>
//               bed.attributes.room.data.attributes.room_number ===
//               room.roomNumber
//           );

//           return newDates.map((dateStr) => {
//             const currentDate = resetTimeToMidnight(
//               new Date(`${dateStr}, ${selectedYear}`)
//             );

//             return bedsInRoom.map((bed) => {
//               const bedAllocation =
//                 bed.attributes.room_allocation?.data?.attributes;

//               if (bedAllocation) {
//                 const arrivalDate = resetTimeToMidnight(
//                   new Date(bedAllocation.arrival_date)
//                 );
//                 const departureDate = resetTimeToMidnight(
//                   new Date(bedAllocation.departure_date)
//                 );

//                 if (
//                   currentDate >= arrivalDate &&
//                   currentDate <= departureDate
//                 ) {
//                   return "booked";
//                 }
//               }

//               return "normal";
//             });
//           });
//         });
//         setBedStates(roomBedStates);
//       } catch (error) {
//         console.error("Error fetching beds:", error);
//       }
//     };

//     fetchBedsData();
//   }, [selectedMonth, selectedYear, rooms]);

//   const resetTimeToMidnight = (date) => {
//     return new Date(date.setHours(0, 0, 0, 0));
//   };

//   const handleBedClick = (roomIndex, bedIndex, bedId) => {
//     console.log(bedId);
//     const clickedBed = beds.find((b) => b.id === bedId);

//     if (clickedBed) {
//       console.log("Selected bed details:", clickedBed);
//     } else {
//       console.log("Bed not found");
//     }

//     const arrivalDate = resetTimeToMidnight(
//       new Date(userData.userDetails.arrivalDate)
//     );
//     const departureDate = resetTimeToMidnight(
//       new Date(userData.userDetails.departureDate)
//     );
//     const currentDay = resetTimeToMidnight(new Date());

//     if (arrivalDate < currentDay) {
//       console.log("Bed cannot be selected for past dates.");
//       return;
//     }

//     setBedStates((prevStates) => {
//       const newStates = prevStates.map((roomStates, rIndex) => {
//         if (rIndex !== roomIndex) return roomStates;

//         return roomStates.map((dateStates, dIndex) => {
//           const selectedDate = resetTimeToMidnight(
//             new Date(`${dates[dIndex]}, ${selectedYear}`)
//           );

//           if (selectedDate >= arrivalDate && selectedDate <= departureDate) {
//             return dateStates.map((state, bIndex) => {
//               if (bIndex !== bedIndex || state === "booked") return state;
//               return state === "normal" ? "selected" : "normal";
//             });
//           }
//           return dateStates;
//         });
//       });

//       const selectedBedsArray = [];
//       newStates.forEach((roomStates, rIdx) => {
//         roomStates.forEach((dateStates, dIdx) => {
//           dateStates.forEach((state, bIdx) => {
//             if (state === "selected") {
//               const bed = beds.find(
//                 (b) =>
//                   b.attributes.room.data.attributes.room_number ===
//                     rooms[rIdx].roomNumber &&
//                   b.attributes.bed_number ===
//                     getBedsForRoom(rooms[rIdx].roomNumber)[bIdx].attributes
//                       .bed_number
//               );
//               if (bed) {
//                 selectedBedsArray.push(bed.id);
//               }
//             }
//           });
//         });
//       });

//       setSelectedBeds(selectedBedsArray);
//       return newStates;
//     });
//   };

//   const getBedsForRoom = (roomNumber) => {
//     return beds.filter(
//       (bed) =>
//         bed.attributes.room.data.attributes.room_number === String(roomNumber)
//     );
//   };

//   return (
//     <div className="rooms-container">
//       <div className="left-sidebar">
//         <h3>Rooms</h3>
//         <ul>
//           {rooms.map((room, index) => (
//             <li key={index}>{room.roomNumber}</li>
//           ))}
//         </ul>
//       </div>
//       <div className="right-content">
//         <div className="rooms-list">
//           {dates.map((date, dateIndex) => (
//             <div className="room-item" key={dateIndex}>
//               <div className="date-label">{date}</div>
//               <div className="room-container">
//                 {rooms.map((room, roomIndex) => (
//                   <div key={roomIndex} className="room-slot">
//                     <div className="beds">
//                       {getBedsForRoom(room.roomNumber).map((bed, bedIndex) => {
//                         const state =
//                           bedStates[roomIndex] &&
//                           bedStates[roomIndex][dateIndex] &&
//                           bedStates[roomIndex][dateIndex][bedIndex];

//                         const bedIcon =
//                           state === "booked"
//                             ? icons.bookedBed
//                             : state === "selected"
//                             ? icons.bedSelected
//                             : icons.bed;

//                         return (
//                           <img
//                             key={bedIndex}
//                             className="bed-image"
//                             src={bedIcon}
//                             alt={`${state} bed`}
//                             onClick={() =>
//                               handleBedClick(roomIndex, bedIndex, bed.id)
//                             }
//                           />
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rooms;

import React, { useState, useEffect } from "react";
import "./Rooms.scss";
import { icons } from "../../../constants";
import { fetchBeds } from "../../../../services/src/services/bedService";
import { fetchRoomAllocations } from "../../../../services/src/services/roomAllocationService";
import useBookingStore from "../../../../useBookingStore";

const Rooms = ({
  rooms,
  selectedMonth,
  selectedYear,
  updateSelectedBedsCount,
  userData,
}) => {
  const [dates, setDates] = useState([]);
  const [bedStates, setBedStates] = useState([]);
  const [beds, setBeds] = useState([]);
  const [allocations, setAllocations] = useState([]); // Store allocations
  const [hoveredBedDetails, setHoveredBedDetails] = useState(null); // State for hovered bed details
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State for tooltip position

  const {
    allocationData,
    setBeds: setSelectedBeds,
    setBookingRequest,
    setGuests,
  } = useBookingStore();

  useEffect(() => {
    // Fetch bed and room allocation data on component mount
    const fetchBedsAndAllocations = async () => {
      try {
        const bedData = await fetchBeds();
        const allocationData = await fetchRoomAllocations(); // Fetch allocations

        setBeds(bedData.data);
        setAllocations(allocationData.data); // Set fetched allocations

        const monthIndex = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].indexOf(selectedMonth);
        const daysInMonth = getDaysInMonth(monthIndex, selectedYear);

        const newDates = Array.from(
          { length: daysInMonth },
          (_, i) => `${i + 1} ${selectedMonth}`
        );
        setDates(newDates);

        const roomBedStates = rooms.map((room) => {
          const bedsInRoom = bedData.data.filter(
            (bed) =>
              bed.attributes.room.data.attributes.room_number ===
              room.roomNumber
          );

          return newDates.map((dateStr) => {
            const currentDate = resetTimeToMidnight(
              new Date(`${dateStr}, ${selectedYear}`)
            );

            return bedsInRoom.map((bed) => {
              const bedAllocation =
                bed.attributes.room_allocation?.data?.attributes;

              if (bedAllocation) {
                const arrivalDate = resetTimeToMidnight(
                  new Date(bedAllocation.arrival_date)
                );
                const departureDate = resetTimeToMidnight(
                  new Date(bedAllocation.departure_date)
                );

                if (
                  currentDate >= arrivalDate &&
                  currentDate <= departureDate
                ) {
                  return "booked";
                }
              }

              return "normal";
            });
          });
        });
        setBedStates(roomBedStates);
      } catch (error) {
        console.error("Error fetching beds and allocations:", error);
      }
    };

    fetchBedsAndAllocations();
  }, [selectedMonth, selectedYear, rooms]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const resetTimeToMidnight = (date) => {
    return new Date(date.setHours(0, 0, 0, 0));
  };

  const handleBedHover = (bedId, event) => {
    // Find the hovered bed from the list of beds by matching the bed ID
    const hoveredBed = beds.find((b) => b.id === bedId);

    if (hoveredBed) {
      const roomAllocationId = hoveredBed.attributes.room_allocation?.data?.id;

      // Find the matching room allocation for this bed by comparing room_allocation.id
      const roomAllocation = allocations.find(
        (allocation) => allocation.id === roomAllocationId
      );

      if (roomAllocation) {
        let guestDetails = null;

        // Check if the room allocation contains guest details
        if (roomAllocation.attributes.guests) {
          const guests = roomAllocation.attributes.guests;

          // If guests is an array, map over the array to display details of all guests
          if (Array.isArray(guests)) {
            guestDetails = guests.map((guest) => ({
              name: guest.name,
              phone: guest.phone,
              aadhaar: guest.aadhaar,
              occupation: guest.occupation,
            }));
          } else {
            // If guests is an object (not an array), directly extract the details
            guestDetails = {
              name: guests.name,
              phone: guests.phone,
              aadhaar: guests.aadhaar,
              occupation: guests.occupation,
            };
          }
        }

        // Pass the allocation and guest details to the tooltip
        setHoveredBedDetails({
          roomNumber: hoveredBed.attributes.room.data.attributes.room_number,
          bedNumber: hoveredBed.attributes.bed_number,
          allocation: {
            arrival_date: roomAllocation.attributes.arrival_date,
            departure_date: roomAllocation.attributes.departure_date,
            booking_id: roomAllocation.attributes.booking_id,
          }, // Pass the allocation details correctly here
          guests:
            roomAllocation.attributes.booking_request.data.attributes.name, // Pass the extracted guest details here
          guestPhoneNumber:
            roomAllocation.attributes.booking_request.data.attributes
              .phone_number,
        });

        // Set the position of the tooltip based on the mouse event's position
        setTooltipPosition({
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        console.log("No matching room allocation found for this bed.");
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredBedDetails(null); // Clear details on mouse leave
  };

  const handleBedClick = (roomIndex, bedIndex, bedId) => {
    const clickedBed = beds.find((b) => b.id === bedId);

    if (clickedBed) {
      const arrivalDate = resetTimeToMidnight(
        new Date(userData.userDetails.arrivalDate)
      );
      const departureDate = resetTimeToMidnight(
        new Date(userData.userDetails.departureDate)
      );
      const currentDay = resetTimeToMidnight(new Date());

      if (arrivalDate < currentDay) {
        console.log("Bed cannot be selected for past dates.");
        return;
      }

      setBedStates((prevStates) => {
        const newStates = prevStates.map((roomStates, rIndex) => {
          if (rIndex !== roomIndex) return roomStates;

          return roomStates.map((dateStates, dIndex) => {
            const selectedDate = resetTimeToMidnight(
              new Date(`${dates[dIndex]}, ${selectedYear}`)
            );

            if (selectedDate >= arrivalDate && selectedDate <= departureDate) {
              return dateStates.map((state, bIndex) => {
                if (bIndex !== bedIndex || state === "booked") return state;
                return state === "normal" ? "selected" : "normal";
              });
            }
            return dateStates;
          });
        });

        // Collect the selected beds
        const selectedBedsArray = [];
        newStates.forEach((roomStates, rIdx) => {
          roomStates.forEach((dateStates, dIdx) => {
            dateStates.forEach((state, bIdx) => {
              if (state === "selected") {
                const bed = beds.find(
                  (b) =>
                    b.attributes.room.data.attributes.room_number ===
                      rooms[rIdx].roomNumber &&
                    b.attributes.bed_number ===
                      getBedsForRoom(rooms[rIdx].roomNumber)[bIdx].attributes
                        .bed_number
                );
                if (bed) {
                  selectedBedsArray.push(bed.id);
                }
              }
            });
          });
        });

        setSelectedBeds(selectedBedsArray); // Update Zustand with selected beds
        return newStates;
      });
    }
  };

  const getBedsForRoom = (roomNumber) => {
    return beds.filter(
      (bed) =>
        bed.attributes.room.data.attributes.room_number === String(roomNumber)
    );
  };

  return (
    <div className="rooms-container">
      <div className="left-sidebar">
        <h3>Rooms</h3>
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>{room.roomNumber}</li>
          ))}
        </ul>
      </div>
      <div className="right-content">
        <div className="rooms-list">
          {dates.map((date, dateIndex) => (
            <div className="room-item" key={dateIndex}>
              <div className="date-label">{date}</div>
              <div className="room-container">
                {rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className="room-slot">
                    <div className="beds">
                      {getBedsForRoom(room.roomNumber).map((bed, bedIndex) => {
                        const state =
                          bedStates[roomIndex] &&
                          bedStates[roomIndex][dateIndex] &&
                          bedStates[roomIndex][dateIndex][bedIndex];

                        const bedIcon =
                          state === "booked"
                            ? icons.bookedBed
                            : state === "selected"
                            ? icons.bedSelected
                            : icons.bed;

                        return (
                          <div
                            key={bedIndex}
                            className="bed-item"
                            onMouseEnter={(e) =>
                              state === "booked" && handleBedHover(bed.id, e)
                            }
                            onMouseLeave={handleMouseLeave}
                            onClick={() =>
                              state !== "booked" &&
                              handleBedClick(roomIndex, bedIndex, bed.id)
                            }
                          >
                            <img
                              className="bed-image"
                              src={bedIcon}
                              alt={`${state} bed`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Render the tooltip for the hovered bed */}
        {hoveredBedDetails && (
          <div
            className="bed-tooltip"
            style={{
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
            }}
          >
            <p>Room Number: {hoveredBedDetails.roomNumber}</p>
            <p>Bed Number: {hoveredBedDetails.bedNumber}</p>
            {hoveredBedDetails.allocation && (
              <>
                <p>
                  Arrival Date:{" "}
                  {hoveredBedDetails.allocation.arrival_date || "N/A"}
                </p>
                <p>
                  Departure Date:{" "}
                  {hoveredBedDetails.allocation.departure_date || "N/A"}
                </p>
              </>
            )}
            {/* Display guest details if matched */}
            {hoveredBedDetails.guests ? (
              Array.isArray(hoveredBedDetails.guests) ? (
                hoveredBedDetails.guests.map((guest, index) => (
                  <div key={index}>
                    <p>Guest Name: {guest.name || "N/A"}</p>
                    <p>Phone: {guest.phone || "N/A"}</p>
                    <p>Aadhaar: {guest.aadhaar || "N/A"}</p>
                    <p>Occupation: {guest.occupation || "N/A"}</p>
                  </div>
                ))
              ) : (
                <>
                  <p>Guest Name: {hoveredBedDetails.guests || "N/A"}</p>
                  <p>Phone: {hoveredBedDetails.guestPhoneNumber || "N/A"}</p>
                </>
              )
            ) : (
              <p>No guest information available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
