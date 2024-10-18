import React, { useState, useEffect } from "react";
import "./Rooms.scss";
import { icons } from "../../../constants";
import { fetchBeds } from "../../../../services/src/services/bedService";
import { createNewRoomAllocation } from "../../../../services/src/services/roomAllocationService";

const Rooms = ({
  rooms,
  selectedMonth,
  selectedYear,
  updateSelectedBedsCount,
  userData,
  selectedBedsCount,
}) => {
  const [dates, setDates] = useState([]);
  const [bedStates, setBedStates] = useState([]);
  const [beds, setBeds] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
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
    const days = getDaysInMonth(monthIndex, selectedYear);
    const newDates = Array.from(
      { length: days },
      (_, i) => `${i + 1} ${selectedMonth}`
    );
    setDates(newDates);

    const fetchBedsData = async () => {
      try {
        const bedData = await fetchBeds();
        setBeds(bedData.data);

        const roomBedStates = rooms.map((room) => {
          const bedsInRoom = bedData.data.filter(
            (bed) =>
              bed.attributes.room.data.attributes.room_number ===
              room.roomNumber
          );
          return Array.from({ length: days }, () =>
            Array(bedsInRoom.length).fill("normal")
          );
        });

        setBedStates(roomBedStates);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };

    fetchBedsData();
  }, [selectedMonth, selectedYear, rooms]);

  const getDateRange = (arrivalDate, departureDate) => {
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);
    const dates = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(
        new Date(d).toLocaleDateString("default", {
          month: "short",
          day: "numeric",
        })
      );
    }
    return dates;
  };

  const arrivalDate = new Date(userData?.userDetails?.arrivalDate);
  const departureDate = new Date(userData?.userDetails?.departureDate);

  const dateRange = getDateRange(arrivalDate, departureDate);

  const handleBedClick = async (roomIndex, dateIndex, bedIndex, bedNumber) => {
    const selectedDate = new Date(`${dates[dateIndex]}, ${selectedYear}`);

    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      console.log("Bed cannot be selected for past dates.");
      return;
    }

    const currentState = bedStates[roomIndex][dateIndex][bedIndex];

    if (currentState === "booked") return;

    const newState = currentState === "normal" ? "selected" : "normal";

    setBedStates((prevStates) => {
      const newStates = [...prevStates];

      dates.forEach((date, i) => {
        if (dateRange.includes(date)) {
          if (newStates[roomIndex][i][bedIndex] !== "booked") {
            newStates[roomIndex][i][bedIndex] = newState;
          }
        }
      });

      updateSelectedBedsCount(newStates);
      return newStates;
    });

    console.log("Bed number clicked:", bedNumber);

    // POST request to save room allocation
    // try {
    //   const allocationData = {
    //     allocation_date: selectedDate.toISOString().split("T")[0],
    //     booking_request: userData.bookingRequestId,
    //     beds: [bedNumber],
    //     guest: userData.guestId,
    //   };

    //   const response = await createNewRoomAllocation(allocationData);
    //   console.log("Room allocation saved successfully:", response);
    // } catch (error) {
    //   console.error("Error creating new room allocation:", error);
    // }
  };

  const getBedsForRoom = (roomNumber) => {
    const roomNumberString = String(roomNumber);
    const filteredBeds = beds.filter(
      (bed) =>
        bed.attributes.room.data.attributes.room_number === roomNumberString
    );
    return filteredBeds;
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
                    {/* <div className="room-number">{room.roomNumber}</div> */}
                    <div className="beds">
                      {getBedsForRoom(room.roomNumber).map((bed, bedIndex) => (
                        <img
                          key={bedIndex}
                          className="bed-image"
                          src={
                            bed.attributes.status === "booked"
                              ? icons.bookedBed
                              : bedStates[roomIndex] &&
                                bedStates[roomIndex][dateIndex] &&
                                bedStates[roomIndex][dateIndex][bedIndex] ===
                                  "selected"
                              ? icons.bedSelected
                              : icons.bed
                          }
                          alt={
                            bed.attributes.status === "booked"
                              ? "booked bed"
                              : bedStates[roomIndex] &&
                                bedStates[roomIndex][dateIndex] &&
                                bedStates[roomIndex][dateIndex][bedIndex] ===
                                  "selected"
                              ? "selected bed"
                              : "normal bed"
                          }
                          onClick={() =>
                            handleBedClick(
                              roomIndex,
                              dateIndex,
                              bedIndex,
                              bed.attributes.bed_number
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
