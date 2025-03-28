import React, { useState, useEffect } from "react";
import BookRoomManagementHeader from "./BookRoomManagementHeader/BookRoomManagementHeader";
import BookRoomManagementBed from "./BookRoomManagementBed/BookRoomManagementBed";
import BookRoomManagementSetting from "./BookRoomManagementSetting/BookRoomManagementSetting";
import { useLocation } from 'react-router-dom';
import { fetchBookingRequestById } from "../../../../services/src/services/bookingRequestService";

const BookRoomManagement = () => {
  const location = useLocation();
  const { bookingRequestId, isRescheduling } = location.state || {};

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard");
  const [selectedGuestDetails, setSelectedGuestDetails] = useState(null);
  const [allocatedGuestCount, setAllocatedGuestCount] = useState(0);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [totalGuestCount, setTotalGuestCount] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [startDate, setStartDate] = useState(null);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBlockCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRoomAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBlockSelect = (blockId, roomType) => {
    setSelectedBlockId(blockId);
    setSelectedRoomType(roomType);
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  const handleRoomSelect = (roomNumber, details) => {
    console.log('Selected room:', roomNumber, details);
    setSelectedRooms(prev => [...prev, {
      roomNumber,
      roomId: details.roomId,
      guestName: details.guest?.name,
      arrivalDate: details.startDate,
      departureDate: details.endDate
    }]);
  };

  const clearRoomSelections = () => {
    setSelectedRooms([]);
  };

  const handleGuestClick = (guestDetails) => {
    setSelectedGuestDetails(guestDetails);
    if (guestDetails) {
      setAllocatedGuestCount(0);
      clearRoomSelections();
    }
  };

  const clearGuestDetails = () => {
    setSelectedGuestDetails(null);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
  };

  useEffect(() => {
    if (selectedGuestDetails?.guests) {
      setTotalGuestCount(selectedGuestDetails.guests.length);
      setArrivalDate(selectedGuestDetails.guests[0].arrivalDate);
      setDepartureDate(selectedGuestDetails.guests[0].departureDate);
    }
  }, [selectedGuestDetails]);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (bookingRequestId && isRescheduling) {
        try {
          const response = await fetchBookingRequestById(bookingRequestId);
          const bookingData = response.data;

          setSelectedGuestDetails({
            id: bookingData.id,
            guests: bookingData.attributes.guests.data.map(guest => ({
              id: guest.id,
              name: guest.attributes.name,
              arrivalDate: guest.attributes.arrival_date,
              departureDate: guest.attributes.departure_date,
              phoneNumber: guest.attributes.phone_number,
              bookingRequestId: bookingRequestId
            }))
          });

          setArrivalDate(new Date(bookingData.attributes.arrival_date));
          setDepartureDate(new Date(bookingData.attributes.departure_date));
        } catch (error) {
          console.error("Error fetching booking request:", error);
        }
      }
    };

    fetchBookingData();
  }, [bookingRequestId, isRescheduling]);

  useEffect(() => {
    window.refreshBookRoomManagement = () => {
      handleRefresh();
      setSelectedBlockId(null);
      setViewMode("dashboard");
      setSelectedGuestDetails(null);
      setAllocatedGuestCount(0);
      setArrivalDate(null);
      setDepartureDate(null);
      setTotalGuestCount(0);
      setSelectedRooms([]);
    };

    return () => {
      delete window.refreshBookRoomManagement;
    };
  }, []);

  return (
    <div>
      <BookRoomManagementHeader
        refreshTrigger={refreshTrigger}
        onBlockSelect={handleBlockSelect}
        onViewChange={handleViewChange}
        onDateChange={handleDateChange}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomManagementBed
            blockId={selectedBlockId}
            roomType={selectedRoomType}
            refreshTrigger={refreshTrigger}
            viewMode={viewMode}
            onGuestClick={handleGuestClick}
            arrivalDate={arrivalDate}
            departureDate={departureDate}
            onRoomSelect={handleRoomSelect}
            selectedGuests={selectedGuestDetails?.guests}
            maxSelections={totalGuestCount}
            startDate={startDate}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomManagementSetting
            onBlockCreated={handleRefresh}
            selectedBlockId={selectedBlockId}
            onRoomAdded={handleRefresh}
            onRoomAllocated={handleRefresh}
            guestDetails={selectedGuestDetails}
            selectedRooms={selectedRooms}
            onClearSelections={clearRoomSelections}
            onClearGuestDetails={clearGuestDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagement;
