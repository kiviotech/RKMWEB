import React, { useEffect, useState, useRef } from "react";
import "./BookDormitoryRoomBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import { useNavigate } from "react-router-dom";

const BookDormitoryRoomBed = ({ blockId, refreshTrigger, viewMode, arrivalDate, departureDate, onRoomSelect, selectedGuests, setSelectedGuests }) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [selectedBeds, setSelectedBeds] = useState({});
  const [selectedBedCounts, setSelectedBedCounts] = useState({});

  // Add effect to clear selections when refreshTrigger changes
  useEffect(() => {
    setSelectedBeds({});
    setSelectedBedCounts({});
  }, [refreshTrigger]);

  // Modified useEffect for date generation
  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      const startDate = arrivalDate ? new Date(arrivalDate) : new Date();

      // Generate dates for next 365 days starting from arrival date
      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        datesArray.push({
          day: date.getDate(),
          month: date.toLocaleString("default", { month: "short" }),
          year: date.getFullYear(),
        });
      }
      setDates(datesArray);
    };

    generateDates();
  }, [arrivalDate]); // Add arrivalDate as dependency

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (blockId) {
        try {
          setIsLoading(true);
          const blockData = await blockService.fetchBlockById(blockId);
          const roomsData = blockData.data.attributes.rooms.data;
          setRooms(roomsData);
        } catch (error) {
          console.error("Error fetching block details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlockDetails();
  }, [blockId, refreshTrigger]);

  const handleBedManagementClick = (allocation) => {
    if (allocation) {
      // Get the booking request ID from the first guest's booking request
      const bookingRequestId =
        allocation.attributes.guests.data[0]?.attributes?.booking_request?.data
          ?.id;
      // console.log("Booking Request ID:", allocation);
      if (bookingRequestId) {
        navigate("/requests", {
          state: {
            activeTab: "confirmed",
            openGuestDetails: true,
            requestId: bookingRequestId,
          },
        });
      } else {
        console.warn("No booking request ID found for this allocation");
      }
    }
  };

  // Helper function to check if a date is within arrival and departure range
  const isDateInRange = (dateToCheck, arrivalDate, departureDate) => {
    if (!arrivalDate || !departureDate) return false;

    const checkDate = new Date(
      dateToCheck.year,
      new Date(Date.parse(`01 ${dateToCheck.month} 2000`)).getMonth(),
      dateToCheck.day
    );
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);

    checkDate.setHours(0, 0, 0, 0);
    arrival.setHours(0, 0, 0, 0);
    departure.setHours(0, 0, 0, 0);

    return checkDate >= arrival && checkDate <= departure;
  };

  // Add this helper function to check for date range conflicts
  const hasAllocationInDateRange = (room, startDate, endDate) => {
    const allocations = room.attributes?.room_allocations?.data || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return allocations.some(allocation => {
      const guests = allocation.attributes?.guests?.data;
      if (!guests?.[0]?.attributes) return false;

      const allocationStart = new Date(guests[0].attributes.arrival_date);
      const allocationEnd = new Date(guests[0].attributes.departure_date);
      allocationStart.setHours(0, 0, 0, 0);
      allocationEnd.setHours(0, 0, 0, 0);

      // Check if date ranges overlap
      return (
        (start <= allocationEnd && end >= allocationStart) ||
        (allocationStart <= end && allocationEnd >= start)
      );
    });
  };

  // Modified handleBedCountClick to handle date range
  const handleBedCountClick = (roomId, roomNumber, dateIndex, totalAvailableBeds) => {
    if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
      alert("Please select devotees first before selecting a bed.");
      return;
    }

    const requestedCount = selectedGuests[0]?.attributes?.count || 0;
    const room = rooms.find(r => r.id === roomId);

    // Check for allocation conflicts
    if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
      alert("This room is already allocated for some dates in your selected range. Please choose another room.");
      return;
    }

    // Check minimum available beds across the date range
    let minAvailableBeds = totalAvailableBeds;
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = {
        year: d.getFullYear(),
        month: d.toLocaleString("default", { month: "short" }),
        day: d.getDate()
      };
      const availableBedsForDate = getAvailableBedsForDate(room, currentDate);
      minAvailableBeds = Math.min(minAvailableBeds, availableBedsForDate);
    }

    if (requestedCount > minAvailableBeds) {
      alert(`Cannot allocate ${requestedCount} beds. Only ${minAvailableBeds} beds are available for the selected date range. Please select a different room or reduce the number of devotees.`);
      return;
    }

    setSelectedBedCounts(prev => {
      const updates = {};
      const dateKey = `${roomId}-${dateIndex}`;
      const currentCount = prev[dateKey] || 0;

      // Apply the same count to all dates in range
      dates.forEach((date, idx) => {
        if (isDateInRange(date, arrivalDate, departureDate)) {
          const key = `${roomId}-${idx}`;
          // If already selected, clear selection, otherwise set to requested count
          updates[key] = currentCount > 0 ? 0 : requestedCount;
        }
      });

      // If selecting (not deselecting), call onRoomSelect and update selectedGuests
      if (currentCount === 0) {
        onRoomSelect(roomNumber, {
          startDate: arrivalDate,
          endDate: departureDate
        });

        // Update the selectedGuests with room number
        setSelectedGuests(prevGuests =>
          prevGuests.map(guest => ({
            ...guest,
            roomNumber: roomNumber
          }))
        );
      }

      return { ...prev, ...updates };
    });
  };

  // Modified handleListViewBedSelection
  const handleListViewBedSelection = (roomId, roomNumber, date, totalAvailableBeds) => {
    if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
      alert("Please select devotees first before selecting a bed.");
      return;
    }

    const requestedCount = selectedGuests[0]?.attributes?.count || 0;

    // Find the room object
    const room = rooms.find(r => r.id === roomId);

    // Check for allocation conflicts
    if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
      alert("This room is already allocated for some dates in your selected range. Please choose another room.");
      return;
    }

    // Check if requested count exceeds available beds for any date in the range
    let minAvailableBeds = totalAvailableBeds;
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = {
        year: d.getFullYear(),
        month: d.toLocaleString("default", { month: "short" }),
        day: d.getDate()
      };
      const availableBedsForDate = getAvailableBedsForDate(room, currentDate);
      minAvailableBeds = Math.min(minAvailableBeds, availableBedsForDate);
    }

    if (requestedCount > minAvailableBeds) {
      alert(`Cannot allocate ${requestedCount} beds. Only ${minAvailableBeds} beds are available for the selected date range. Please select a different room or reduce the number of devotees.`);
      return;
    }

    const dateIndex = dates.findIndex(d =>
      d.year === date.year &&
      d.month === date.month &&
      d.day === date.day
    );

    if (dateIndex === -1) return;

    const key = `${roomId}-${dateIndex}`;
    const currentCount = selectedBedCounts[key] || 0;

    // If already selected, clear the selection
    if (currentCount > 0) {
      const updates = {};
      dates.forEach((d, idx) => {
        if (isDateInRange(d, arrivalDate, departureDate)) {
          updates[`${roomId}-${idx}`] = 0;
          // Clear individual bed selections
          for (let i = 0; i < totalAvailableBeds; i++) {
            selectedBeds[`${roomId}-${idx}-${i}`] = false;
          }
        }
      });
      setSelectedBedCounts(prev => ({ ...prev, ...updates }));
      setSelectedBeds(prev => ({ ...prev }));
    } else {
      // Select beds
      const updates = {};
      const bedUpdates = {};
      dates.forEach((d, idx) => {
        if (isDateInRange(d, arrivalDate, departureDate)) {
          updates[`${roomId}-${idx}`] = requestedCount;
          // Set individual bed selections
          for (let i = 0; i < totalAvailableBeds; i++) {
            bedUpdates[`${roomId}-${idx}-${i}`] = i < requestedCount;
          }
        }
      });
      setSelectedBedCounts(prev => ({ ...prev, ...updates }));
      setSelectedBeds(prev => ({ ...prev, ...bedUpdates }));

      // Call onRoomSelect only when selecting (not deselecting)
      onRoomSelect(roomNumber, {
        startDate: arrivalDate,
        endDate: departureDate
      });

      // Update the selectedGuests with room number and roomId
      if (setSelectedGuests) {
        setSelectedGuests(prevGuests =>
          prevGuests.map(guest => ({
            ...guest,
            roomNumber: roomNumber,
            roomId: roomId
          }))
        );
      }
    }
  };

  // Modified handleBedClick to sync with list view
  const handleBedClick = (roomId, roomNumber, dateIndex, bedIndex, totalAvailableBeds) => {
    if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
      alert("Please select devotees first before selecting a bed.");
      return;
    }

    const requestedCount = selectedGuests[0]?.attributes?.count || 0;
    const room = rooms.find(r => r.id === roomId);

    // Check for allocation conflicts
    if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
      alert("This room is already allocated for some dates in your selected range. Please choose another room.");
      return;
    }

    // Check minimum available beds across the date range
    let minAvailableBeds = totalAvailableBeds;
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = {
        year: d.getFullYear(),
        month: d.toLocaleString("default", { month: "short" }),
        day: d.getDate()
      };
      const availableBedsForDate = getAvailableBedsForDate(room, currentDate);
      minAvailableBeds = Math.min(minAvailableBeds, availableBedsForDate);
    }

    if (requestedCount > minAvailableBeds) {
      alert(`Cannot allocate ${requestedCount} beds. Only ${minAvailableBeds} beds are available for the selected date range. Please select a different room or reduce the number of devotees.`);
      return;
    }

    setSelectedBeds(prev => {
      const updates = {};
      const hasSelection = Array(totalAvailableBeds).fill(null)
        .some((_, i) => prev[`${roomId}-${dateIndex}-${i}`]);

      dates.forEach((date, idx) => {
        if (isDateInRange(date, arrivalDate, departureDate)) {
          if (hasSelection) {
            for (let i = 0; i < totalAvailableBeds; i++) {
              updates[`${roomId}-${idx}-${i}`] = false;
            }
          } else {
            for (let i = 0; i < totalAvailableBeds; i++) {
              updates[`${roomId}-${idx}-${i}`] = i < requestedCount;
            }
          }
        }
      });

      // Sync with list view bed counts
      setSelectedBedCounts(prevCounts => {
        const countUpdates = {};
        dates.forEach((date, idx) => {
          if (isDateInRange(date, arrivalDate, departureDate)) {
            const dateKey = `${roomId}-${idx}`;
            countUpdates[dateKey] = hasSelection ? 0 : requestedCount;
          }
        });
        return { ...prevCounts, ...countUpdates };
      });

      if (!hasSelection) {
        onRoomSelect(roomNumber, {
          startDate: arrivalDate,
          endDate: departureDate
        });

        setSelectedGuests(prevGuests =>
          prevGuests.map(guest => ({
            ...guest,
            roomNumber: roomNumber,
            roomId: roomId
          }))
        );
      }

      return { ...prev, ...updates };
    });
  };

  // Modified getSelectedCount function
  const getSelectedCount = (roomId, dateIndex) => {
    if (totalBeds <= 4) {
      let count = 0;
      for (let i = 0; i < totalBeds; i++) {
        if (selectedBeds[`${roomId}-${dateIndex}-${i}`]) {
          count++;
        }
      }
      return count;
    } else {
      return selectedBedCounts[`${roomId}-${dateIndex}`] || 0;
    }
  };

  // Add this function before renderBeds
  const renderBedIcon = (bedIndex, roomId, dateIndex, totalBeds, roomBlockings, roomAllocations, currentDate) => {
    // Check for blockings
    const isBlocked = roomBlockings?.some((blocking) => {
      if (!blocking?.attributes) return false;

      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    if (isBlocked) {
      return icons.blockedImage;
    }

    // Find active allocation for this date
    const allocation = roomAllocations?.data?.find((allocation) => {
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );

      // Check guest dates
      if (allocation?.attributes?.guests?.data?.[0]?.attributes) {
        const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
        const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        if (checkDate >= fromDate && checkDate <= toDate) {
          return true;
        }
      }

      // Check booking request dates
      if (allocation?.attributes?.booking_request?.data?.attributes) {
        const request = allocation.attributes.booking_request.data.attributes;
        const fromDate = new Date(request.arrival_date);
        const toDate = new Date(request.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        if (checkDate >= fromDate && checkDate <= toDate) {
          return true;
        }
      }

      return false;
    });

    if (allocation) {
      // Calculate occupied beds
      let occupiedBeds = 0;

      // First try to get occupancy from allocation
      if (typeof allocation.attributes.occupancy === 'number') {
        occupiedBeds = allocation.attributes.occupancy;
      }
      // Then try guests count
      else if (allocation.attributes?.guests?.data?.length > 0) {
        occupiedBeds = allocation.attributes.guests.data.length;
      }
      // Finally try booking request count
      else if (allocation.attributes?.booking_request?.data?.attributes?.count) {
        occupiedBeds = allocation.attributes.booking_request.data.attributes.count;
      }

      // If this bed is within occupied range
      if (bedIndex < occupiedBeds) {
        const hasRecommendationLetter =
          allocation.attributes?.booking_request?.data?.attributes?.recommendation_letter?.data;
        return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
      }
    }

    // Check if bed is selected
    const bedKey = `${roomId}-${dateIndex}-${bedIndex}`;
    if (selectedBeds[bedKey]) {
      return icons.selectedImage;
    }

    // If not blocked, allocated, or selected, show as available
    return icons.Group2;
  };

  const renderBeds = (
    numberOfBeds,
    roomBlockings,
    roomAllocations,
    currentDate,
    roomId,
    dateIndex,
    roomNumber
  ) => {
    const isInRange = isDateInRange(currentDate, arrivalDate, departureDate);
    const beds = [];

    // Find allocation for this date
    const allocation = roomAllocations?.data?.find((allocation) => {
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );

      if (allocation?.attributes?.guests?.data?.[0]?.attributes) {
        const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
        const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= fromDate && checkDate <= toDate;
      }

      if (allocation?.attributes?.booking_request?.data?.attributes) {
        const request = allocation.attributes.booking_request.data.attributes;
        const fromDate = new Date(request.arrival_date);
        const toDate = new Date(request.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= fromDate && checkDate <= toDate;
      }

      return false;
    });

    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate,
      handleBedManagementClick
    );

    // Get available beds count
    const availableBeds = getAvailableBedsForDate({
      attributes: {
        no_of_beds: numberOfBeds,
        room_blockings: { data: roomBlockings },
        room_allocations: roomAllocations
      }
    }, currentDate);

    // Check both blockings and allocations
    const isBlocked = roomBlockings?.some((blocking) => {
      if (!blocking?.attributes) return false;

      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    }) || false;

    // Add getBedIcon function here
    const getBedIcon = (bedIndex) => {
      const icon = renderBedIcon(bedIndex, roomId, dateIndex, numberOfBeds, roomBlockings, roomAllocations, currentDate);
      const isClickable = !isBlocked && isInRange && (icon === icons.Group2 || icon === icons.selectedImage);

      return (
        <img
          src={icon}
          alt="bed"
          className={`bed-icon ${isInRange ? 'in-range' : ''}`}
          onClick={() => {
            if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
              alert("Please select devotees first before selecting a bed.");
              return;
            }
            if (isClickable) {
              handleBedClick(roomId, roomNumber, dateIndex, bedIndex, numberOfBeds);
            }
          }}
          style={{
            cursor: isClickable ? 'pointer' : 'default',
            opacity: 1
          }}
        />
      );
    };

    if (numberOfBeds > 4) {
      const key = `${roomId}-${dateIndex}`;
      const selectedCount = selectedBedCounts[key] || 0;
      const availableBeds = numberOfBeds - (allocation?.attributes?.occupancy || 0);

      beds.push(
        <div
          key="bed-count-layout"
          className={`bed-count-layout ${isInRange ? 'in-range' : ''}`}
          data-tooltip={tooltipContent ? "true" : undefined}
          onClick={() => {
            if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
              alert("Please select devotees first before selecting a bed.");
              return;
            }
            if (!isBlocked && isInRange) {
              handleBedCountClick(roomId, roomNumber, dateIndex, availableBeds);
            }
          }}
          style={{
            cursor: (!isBlocked && isInRange) ? 'pointer' : 'default',
            backgroundColor: getBackgroundColor(isBlocked, !!allocation, allocation),
            borderRadius: "8px"
          }}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className={`bed-count-box ${isInRange ? 'in-range' : ''}`}>
            <span className="bed-number">
              {isInRange && selectedCount > 0
                ? `${selectedCount}/${availableBeds}`
                : availableBeds
              }
            </span>
            <span className="bed-status">
              {isBlocked
                ? "Blocked"
                : !!allocation
                  ? "Available"
                  : "Available"}
            </span>
          </div>
        </div>
      );
    } else if (numberOfBeds === 3) {
      beds.push(
        <div
          key="three-bed-layout"
          className={`three-bed-layout ${isInRange ? 'in-range' : ''}`}
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="top-row">
            {getBedIcon(0)}
            {getBedIcon(1)}
          </div>
          <div className="bottom-row">
            {getBedIcon(2)}
          </div>
        </div>
      );
    } else {
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;

      const bedGroups = [];
      for (let i = 0; i < fullGroups; i++) {
        bedGroups.push(
          <div key={`group-${i}`} className="bed-group">
            {getBedIcon(i * 2)}
            {getBedIcon(i * 2 + 1)}
          </div>
        );
      }

      if (remainingBeds > 0) {
        bedGroups.push(
          <div key="remaining" className="bed-group">
            {getBedIcon(fullGroups * 2)}
          </div>
        );
      }

      beds.push(
        <div
          key="bed-layout"
          className={`bed-layout ${isInRange ? 'in-range' : ''}`}
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          {bedGroups}
        </div>
      );
    }

    return beds;
  };

  // Helper function to add ordinal suffix to dates
  const getOrdinalSuffix = (day) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  // Update getAvailableBedsForDate function
  const getAvailableBedsForDate = (room, date) => {
    const totalBeds = room.attributes.no_of_beds;
    const allocations = room.attributes.room_allocations?.data || [];
    const blockings = room.attributes.room_blockings?.data || [];

    // Check if room is blocked
    const isBlocked = blockings.some((blocking) => {
      if (!blocking?.attributes) return false;
      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      const checkDate = new Date(
        date.year,
        new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
        date.day,
        0,
        0,
        0
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    if (isBlocked) return 0;

    // Calculate occupied beds from allocations
    const occupiedBeds = allocations.reduce((count, allocation) => {
      const checkDate = new Date(
        date.year,
        new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
        date.day,
        0,
        0,
        0
      );

      let isOccupied = false;
      let occupancyCount = 0;

      // Check booking request dates and occupancy
      if (allocation.attributes?.booking_request?.data?.attributes) {
        const request = allocation.attributes.booking_request.data.attributes;
        const startDate = new Date(request.arrival_date);
        const endDate = new Date(request.departure_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (checkDate >= startDate && checkDate <= endDate) {
          isOccupied = true;
          // Use allocation's occupancy if available, otherwise use booking request's count
          occupancyCount = allocation.attributes.occupancy || request.count || 0;
        }
      }

      // Check guest allocation dates
      if (allocation.attributes?.guests?.data?.length > 0) {
        const guest = allocation.attributes.guests.data[0];
        if (guest?.attributes) {
          const startDate = new Date(guest.attributes.arrival_date);
          const endDate = new Date(guest.attributes.departure_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (checkDate >= startDate && checkDate <= endDate) {
            isOccupied = true;
            occupancyCount = allocation.attributes.guests.data.length;
          }
        }
      }

      return count + (isOccupied ? occupancyCount : 0);
    }, 0);

    const availableBeds = totalBeds - occupiedBeds;
    return Math.max(0, availableBeds);
  };

  const renderListView = () => {
    return (
      <div className="list-view-container">
        <div className="room-numbers-column">
          <div className="list-header fixed-column">Room No.</div>
          {rooms.map((room) => (
            <div key={room.id} className="room-info">
              <div className="room-number">
                {room.attributes.room_number}
                <span className="capacity">({room.attributes.no_of_beds})</span>
              </div>
            </div>
          ))}
        </div>

        <div className="scrollable-content" ref={scrollContainerRef}>
          <div className="header-row">
            <div className="scrollable-dates">
              {dates.map((date, index) => (
                <div key={index} className="date-column">
                  <div className="year">{date.year}</div>
                  <div>{`${date.day} ${date.month}`}</div>
                </div>
              ))}
            </div>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="list-row">
              {dates.map((date, index) => {
                const totalBeds = room.attributes.no_of_beds;
                const availableBeds = getAvailableBedsForDate(room, date);
                const key = `${room.id}-${index}`;
                const selectedCount = selectedBedCounts[key] || 0;
                const isInRange = isDateInRange(date, arrivalDate, departureDate);

                // Find allocation for this date
                const allocation = room.attributes?.room_allocations?.data?.find((allocation) => {
                  if (allocation?.attributes?.guests?.data?.length > 0) {
                    const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
                    const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);
                    const checkDate = new Date(
                      date.year,
                      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                      date.day,
                      0,
                      0,
                      0
                    );
                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate >= fromDate && checkDate <= toDate;
                  } else if (allocation?.attributes?.booking_request?.data?.attributes) {
                    const bookingRequest = allocation.attributes.booking_request.data.attributes;
                    const fromDate = new Date(bookingRequest.arrival_date);
                    const toDate = new Date(bookingRequest.departure_date);
                    const checkDate = new Date(
                      date.year,
                      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                      date.day,
                      0,
                      0,
                      0
                    );
                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate >= fromDate && checkDate <= toDate;
                  }
                  return false;
                });

                const isBlocked = room.attributes?.room_blockings?.data?.some(
                  (blocking) => {
                    if (!blocking?.attributes) return false;

                    const fromDate = new Date(blocking.attributes.from_date);
                    const toDate = new Date(blocking.attributes.to_date);
                    const checkDate = new Date(
                      date.year,
                      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                      date.day,
                      0,
                      0,
                      0
                    );

                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);

                    return checkDate >= fromDate && checkDate <= toDate;
                  }
                );
                const hasAllocation = !!allocation;

                const tooltipContent = getTooltipContent(
                  room.attributes?.room_blockings?.data,
                  room.attributes?.room_allocations,
                  date,
                  handleBedManagementClick
                );

                return (
                  <div
                    key={index}
                    className={`availability-box ${isInRange ? 'in-range' : ''}`}
                    data-tooltip={tooltipContent ? "true" : undefined}
                    style={{
                      backgroundColor: getBackgroundColor(isBlocked, hasAllocation, allocation),
                      cursor: (!isBlocked && !hasAllocation && isInRange && availableBeds > 0) ? 'pointer' : 'default',
                    }}
                    onClick={(e) => {
                      // Prevent bed selection if clicking on tooltip
                      if (e.target.closest('.tooltip-content')) {
                        return;
                      }
                      if (!selectedGuests?.length || !selectedGuests[0]?.attributes?.count) {
                        alert("Please select devotees first before selecting a bed.");
                        return;
                      }
                      if (!isBlocked && !hasAllocation && isInRange && availableBeds > 0) {
                        handleListViewBedSelection(room.id, room.attributes.room_number, date, availableBeds);
                      }
                    }}
                  >
                    <div className={`bed-count ${isInRange ? 'in-range' : ''}`}>
                      {isInRange && selectedCount > 0
                        ? `${selectedCount}/${availableBeds}`
                        : availableBeds}
                    </div>
                    <div className="availability-label">
                      {isBlocked ? "Blocked" : hasAllocation ? "Available" : "Available"}
                    </div>
                    {tooltipContent && (
                      <div className="custom-tooltip">{tooltipContent}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Update the getBackgroundColor function
  const getBackgroundColor = (isBlocked, hasAllocation, allocation) => {
    if (isBlocked) {
      return "#FFFF00"; // Yellow for blocked rooms
    }
    if (hasAllocation) {
      // Check for recommendation letter
      const hasRecommendationLetter = allocation?.attributes?.booking_request?.data?.attributes?.recommendation_letter?.data;
      return hasRecommendationLetter ? "#FFA500" : "#F28E86"; // Orange if has recommendation, pink otherwise
    }
    return "inherit";
  };

  return (
    <div className="bed-management-container">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : viewMode === "dashboard" ? (
        renderListView()
      ) : (
        <div className="bed-grid">
          <div className="room-numbers-column">
            <div className="room-header fixed-column"></div>
            {rooms.map((room) => (
              <div key={room.id} className="room-number">
                {room.attributes.room_number}
              </div>
            ))}
          </div>

          <div className="scrollable-content" ref={scrollContainerRef}>
            <div className="header-row">
              <div className="scrollable-dates">
                {dates.map((date, index) => (
                  <div key={index} className="date-header">
                    <div className="year">{date.year}</div>
                    <div>{`${date.day} ${date.month}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {rooms.map((room) => (
              <div key={room.id} className="room-row">
                <div className="scrollable-beds" style={{ padding: room.attributes.no_of_beds <= 4 ? "10px" : "0px" }}>
                  {dates.map((date, dateIndex) => (
                    <div key={dateIndex} className="bed-cell"
                      style={{ padding: room.attributes.no_of_beds <= 4 ? "10px" : "0px" }}
                    >
                      {renderBeds(
                        room.attributes.no_of_beds,
                        room.attributes.room_blockings?.data,
                        room.attributes.room_allocations,
                        date,
                        room.id,
                        dateIndex,
                        room.attributes.room_number
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Update the getTooltipContent function to log allocation data
const getTooltipContent = (
  roomBlockings,
  roomAllocations,
  currentDate,
  onBedManagementClick
) => {
  // Check for allocations first
  const allocation = roomAllocations?.data?.find((allocation) => {
    if (allocation?.attributes?.guests?.data?.length > 0) {
      // Check using guest data
      if (!allocation.attributes.guests.data[0]?.attributes) return false;

      const fromDate = new Date(
        allocation.attributes.guests.data[0].attributes.arrival_date
      );
      const toDate = new Date(
        allocation.attributes.guests.data[0].attributes.departure_date
      );
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    } else if (allocation?.attributes?.booking_request?.data?.attributes) {
      // Check using booking request data
      const bookingRequest = allocation.attributes.booking_request.data.attributes;
      const fromDate = new Date(bookingRequest.arrival_date);
      const toDate = new Date(bookingRequest.departure_date);
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    }
    return false;
  });

  if (allocation) {
    if (allocation.attributes?.guests?.data?.length > 0) {
      // Show guest details if available
      const guests = allocation.attributes.guests.data;
      return (
        <div
          className="tooltip-content"
          onClick={() => onBedManagementClick?.(allocation)}
          style={{ cursor: "pointer" }}
        >
          <h4>Room Allocation Details:</h4>
          {guests.map((guest, index) => (
            <div key={index} className="guest-details">
              <p><strong>Guest {index + 1}:</strong></p>
              <p>Name: {guest.attributes?.name}</p>
              <p>From: {guest.attributes?.arrival_date}</p>
              <p>To: {guest.attributes?.departure_date}</p>
              <p>Phone: {guest.attributes?.phone_number}</p>
            </div>
          ))}
        </div>
      );
    } else if (allocation.attributes?.booking_request?.data?.attributes) {
      // Show booking request details if no guests
      const bookingRequest = allocation.attributes.booking_request.data.attributes;
      return (
        <div
          className="tooltip-content"
          onClick={() => onBedManagementClick?.(allocation)}
          style={{ cursor: "pointer" }}
        >
          <h4>Booking Request Details:</h4>
          <p><strong>Name:</strong> {bookingRequest.name}</p>
          <p><strong>From:</strong> {bookingRequest.arrival_date}</p>
          <p><strong>To:</strong> {bookingRequest.departure_date}</p>
          <p><strong>Phone:</strong> {bookingRequest.phone_number}</p>
          <p><strong>Occupancy:</strong> {allocation.attributes.occupancy}</p>
        </div>
      );
    }
  }

  // Check for blockings if no allocation
  const blocking = roomBlockings?.find((blocking) => {
    if (!blocking?.attributes) return false;

    const fromDate = new Date(blocking.attributes.from_date);
    const toDate = new Date(blocking.attributes.to_date);
    const checkDate = new Date(
      currentDate.year,
      new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
      currentDate.day
    );
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= fromDate && checkDate <= toDate;
  });

  if (blocking?.attributes) {
    return (
      <div className="tooltip-content">
        <h4>Room Blocking Details:</h4>
        <p>
          <strong>Status:</strong> {blocking.attributes.room_block_status}
        </p>
        <p>
          <strong>From:</strong> {blocking.attributes.from_date}
        </p>
        <p>
          <strong>To:</strong> {blocking.attributes.to_date}
        </p>
        <p>
          <strong>Reason:</strong> {blocking.attributes.reason_for_blocking}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(blocking.attributes.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(blocking.attributes.updatedAt).toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

export default BookDormitoryRoomBed;