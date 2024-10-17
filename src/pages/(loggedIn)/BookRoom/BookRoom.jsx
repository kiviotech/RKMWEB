import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./BookRoom.scss";
import icons from "../../../constants/icons";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import CommonButton from "../../../components/ui/Button";
import { toast } from "react-toastify";
import Rooms from "./Rooms.jsx";
import { fetchFloors } from "../../../../services/src/services/floorService.js";

const getCurrentMonth = () => {
  const monthIndex = new Date().getMonth();
  const monthNames = [
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
  ];
  return monthNames[monthIndex];
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const expiryTime = decodedToken.exp * 1000;
  return Date.now() > expiryTime;
};

const BookRoom = () => {
  const location = useLocation();
  const userData = location.state?.userData;

  console.log("User Data:", userData);

  const [activeFloor, setActiveFloor] = useState("All Floors");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedDay, setSelectedDay] = useState(23);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedBedsCount, setSelectedBedsCount] = useState(0);
  const [floors, setFloors] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [guestHouses, setGuestHouses] = useState([
    { guestHouseId: 1, name: "Guest House 1", active: false },
    { guestHouseId: 2, name: "Nivedita Guest House", active: true },
  ]);

  useEffect(() => {
    const getFloors = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (isTokenExpired(token)) {
          toast.error("Your session has expired. Please log in again.");
          return;
        }
        const floorData = await fetchFloors();
        setFloors(floorData.data);

        const allRooms = floorData.data.flatMap((floor) =>
          floor.attributes.rooms.data.map((room) => ({
            roomNumber: room.attributes.room_number,
            floorNumber: floor.attributes.floor_number,
          }))
        );
        setRoomsData(allRooms);
      } catch (error) {
        console.error("Error fetching floors:", error.message);
      }
    };

    getFloors();
  }, []);

  useEffect(() => {
    if (activeFloor === "All Floors") {
      setFilteredRooms(roomsData);
    } else {
      const filtered = roomsData.filter(
        (room) => room.floorNumber === parseInt(activeFloor.split(" ")[1])
      );
      setFilteredRooms(filtered);
    }
  }, [activeFloor, roomsData]);

  const updateSelectedBedsCount = (bedStates) => {
    const count = bedStates
      .flat()
      .filter((state) => state === "selected").length;
    setSelectedBedsCount(count);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const handleFloorClick = (floor) => {
    setActiveFloor(floor);
  };

  const handleYearChange = (direction) => {
    setSelectedYear((prevYear) => prevYear + direction);
  };

  const proceedToBookRooms = () => {
    if (selectedBedsCount === 0) {
      toast.error("Please select Bed!!");
    } else {
      toast.success("Room Booked");
    }
  };

  const guestHouseButton = (id) => {
    setGuestHouses((prevGuestHouses) =>
      prevGuestHouses.map((house) =>
        house.guestHouseId === id
          ? { ...house, active: true }
          : { ...house, active: false }
      )
    );
  };

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const getDayWithSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };

    return `${month} ${getDayWithSuffix(day)}, ${year}`;
  };

  return (
    <div className="allocate-room-container">
      <div className="allocate-room book-room">
        <div className="guest-house-and-booking-section">
          <div className="guest-house-names-container">
            <CommonHeaderTitle title="Guest House" />
            <div className="guestHouse-name">
              {guestHouses.map((house, key) => (
                <CommonButton
                  key={key}
                  buttonName={house.name}
                  buttonWidth="auto"
                  style={{
                    backgroundColor: house.active ? "#9866E9" : "#E8E8E8",
                    borderColor: "none",
                    color: house.active ? "#FFFFFF" : "#000000",
                    fontSize: "18px",
                    borderRadius: "7px",
                    borderWidth: 0,
                    padding: "8px 30px",
                    marginRight: 10,
                  }}
                  onClick={() => guestHouseButton(house.guestHouseId)}
                />
              ))}
            </div>
          </div>

          <div className="booking-details">
            <h2>Booking for {userData?.noOfGuest + 1} members</h2>
            <p>
              {formatDateWithSuffix(userData?.userDetails?.arrivalDate)} -{" "}
              {formatDateWithSuffix(userData?.userDetails?.departureDate)}
            </p>
            <div className="noOfbedSelected">
              <div className="count" style={{ display: "flex", gap: 10 }}>
                <h6 style={{ width: 20 }}>{selectedBedsCount}</h6>
                <h6>beds selected</h6>
              </div>

              <CommonButton
                buttonName="Proceed"
                buttonWidth="auto"
                style={{
                  backgroundColor: "#9866E9",
                  borderColor: "none",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  borderRadius: "7px",
                  borderWidth: 0,
                  padding: "8px 30px",
                  marginRight: 70,
                }}
                onClick={proceedToBookRooms}
              />
            </div>
          </div>
        </div>

        <div className="book-room-main-section book-room">
          <div className="floors">
            <label>Floors</label>
            <button
              className={`first floor-button ${
                activeFloor === "All Floors" ? "active" : ""
              }`}
              onClick={() => handleFloorClick("All Floors")}
            >
              All Floors
            </button>

            {floors.length > 0 ? (
              floors.map((floor, index) => (
                <button
                  key={index}
                  className={`floor-button ${
                    activeFloor === `Floor ${floor.attributes.floor_number}`
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleFloorClick(`Floor ${floor.attributes.floor_number}`)
                  }
                >
                  Floor {floor.attributes.floor_number}
                </button>
              ))
            ) : (
              <p>Loading floors...</p>
            )}
          </div>

          <div className="months-section">
            <div className="year-selector">
              <span>{selectedYear}</span>
              <button
                className="year-button"
                onClick={() => handleYearChange(-1)}
              >
                <img src={icons.angleLeft} alt="Previous Year" />
              </button>
              <button
                className="year-button angle-right"
                onClick={() => handleYearChange(1)}
              >
                <img src={icons.angleLeft} alt="Next Year" />
              </button>
            </div>
            <div className="months">
              {[
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
              ].map((month) => (
                <div
                  key={month}
                  className={`month ${month === selectedMonth ? "active" : ""}`}
                  onClick={() => handleMonthClick(month)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
          <Rooms
            rooms={filteredRooms}
            updateSelectedBedsCount={updateSelectedBedsCount}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            userData={userData}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
