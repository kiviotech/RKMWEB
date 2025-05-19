import React, { useEffect, useState, useRef } from "react";
import "./BookRoomBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import { useNavigate } from "react-router-dom";

const BookRoomBed = ({ blockId, refreshTrigger, viewMode, arrivalDate, departureDate, onRoomSelect, selectedGuests, roomType }) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [selectedBeds, setSelectedBeds] = useState({});
  const [selectedBedCounts, setSelectedBedCounts] = useState({});

  // Add effect to reset selections when refreshTrigger changes
  useEffect(() => {
    setSelectedBeds({});
    setSelectedBedCounts({});
  }, [refreshTrigger]);

  // Modify the date generation useEffect
  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      // Use arrival date as the start date, or current date if no arrival date
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
          const blockData = await blockService.fetchBlockById(blockId, roomType);
          const roomsData = blockData.data.attributes.rooms.data;

          // Filter rooms based on roomType if specified
          const filteredRooms = roomType
            ? roomsData.filter(room => room.attributes.room_type === roomType)
            : roomsData;

          setRooms(filteredRooms);
        } catch (error) {
          console.error("Error fetching block details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlockDetails();
  }, [blockId, refreshTrigger, roomType]); // Add roomType as dependency

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

  // Add this helper function near the top of the component
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

  // Modified handleBedCountClick to properly handle guest allocation
  const handleBedCountClick = (roomId, roomNumber, dateIndex, totalBeds) => {
    if (!selectedGuests?.length) {
      alert("Please select a guest first before allocating a room");
      return;
    }

    // Find the room object
    const room = rooms.find(r => r.id === roomId);

    // Check for allocation conflicts
    if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
      alert("This room is already allocated for some dates in your selected range. Please choose another room.");
      return;
    }

    const dateKey = `${roomId}-${dateIndex}`;
    const currentCount = selectedBedCounts[dateKey] || 0;
    const newCount = currentCount < totalBeds ? currentCount + 1 : 0;

    setSelectedBedCounts(prev => {
      const updates = {};

      // Apply the same count to all dates in range
      dates.forEach((date, idx) => {
        if (isDateInRange(date, arrivalDate, departureDate)) {
          const key = `${roomId}-${idx}`;
          updates[key] = newCount;
        }
      });

      // If selecting (not deselecting), call onRoomSelect with guest info
      if (newCount > currentCount) {
        onRoomSelect(roomNumber, {
          startDate: arrivalDate,
          endDate: departureDate,
          guest: selectedGuests[0], // Add guest information
          roomId: roomId
        });
      }

      return { ...prev, ...updates };
    });
  };

  // Modified handleBedClick to properly sync with list view
  const handleBedClick = (roomId, roomNumber, dateIndex, bedIndex) => {
    if (!selectedGuests?.length) {
      alert("Please select a guest first before allocating a room");
      return;
    }

    // Find the room object
    const room = rooms.find(r => r.id === roomId);

    // Check for allocation conflicts
    if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
      alert("This room is already allocated for some dates in your selected range. Please choose another room.");
      return;
    }

    const clickedDate = dates[dateIndex];
    const bedKey = `${roomId}-${dateIndex}-${bedIndex}`;

    // If bed is already selected, don't allow deselection
    if (selectedBeds[bedKey]) return;

    // Create all updates first
    const bedUpdates = {};
    const countUpdates = {};
    const newValue = true; // Always set to true, no toggling

    // Calculate updates for all dates in range
    dates.forEach((date, idx) => {
      if (isDateInRange(date, arrivalDate, departureDate)) {
        bedUpdates[`${roomId}-${idx}-${bedIndex}`] = newValue;

        // Calculate count for this date
        let selectedCount = 0;
        for (let i = 0; i < 4; i++) {
          const isBedSelected = i === bedIndex ?
            newValue :
            selectedBeds[`${roomId}-${idx}-${i}`];
          if (isBedSelected) {
            selectedCount++;
          }
        }
        countUpdates[`${roomId}-${idx}`] = selectedCount;
      }
    });

    // Apply all updates at once
    setSelectedBeds(prev => ({
      ...prev,
      ...bedUpdates
    }));

    setSelectedBedCounts(prev => ({
      ...prev,
      ...countUpdates
    }));

    // If selecting, call onRoomSelect
    if (newValue) {
      onRoomSelect(roomNumber, {
        startDate: arrivalDate,
        endDate: departureDate,
        guest: selectedGuests[0],
        roomId: roomId
      });
    }
  };

  // Helper function to get selected count for a room and date
  const getSelectedCount = (roomId, dateIndex) => {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (selectedBeds[`${roomId}-${dateIndex}-${i}`]) {
        count++;
      }
    }
    return count;
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

    // Get tooltip content based on allocations and blockings
    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate,
      handleBedManagementClick
    );

    // Check both blockings and allocations
    const isBlocked = roomBlockings?.some((blocking) => {
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

    // Check for recommendation letter
    const hasRecommendationLetter = roomAllocations?.data?.some(allocation => {
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );

      if (allocation.attributes.booking_request?.data) {
        const fromDate = new Date(allocation.attributes.booking_request.data.attributes.arrival_date);
        const toDate = new Date(allocation.attributes.booking_request.data.attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return allocation.attributes.booking_request.data.attributes.recommendation_letter?.data;
        }
      }
      return false;
    });

    // Calculate occupied beds considering both direct guests and booking request occupancy
    const occupiedBeds = roomAllocations?.data?.reduce((count, allocation) => {
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );

      // If there are guests in the allocation, use their dates
      if (allocation.attributes.guests?.data?.length > 0) {
        const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
        const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + allocation.attributes.guests.data.length;
        }
      }
      // If no guests but has booking request, use occupancy
      else if (allocation.attributes.booking_request?.data) {
        const fromDate = new Date(allocation.attributes.booking_request.data.attributes.arrival_date);
        const toDate = new Date(allocation.attributes.booking_request.data.attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + (allocation.attributes.occupancy || 0);
        }
      }
      return count;
    }, 0) || 0;

    // Get background color based on conditions
    const getBackgroundColor = (isBlocked, hasAllocation, blocking) => {
      if (isBlocked) {
        // If blocking object is provided, check for block_color
        if (blocking && blocking.attributes.block_color) {
          console.log("BookRoomBed Global - Using block_color:", blocking.attributes.block_color);
          return blocking.attributes.block_color;
        }
        console.log("BookRoomBed Global - No block_color, using default yellow");
        return "#FFFF00"; // default yellow for blocks without color
      }
      if (hasAllocation) {
        return "#F28E86"; // or whatever color you use for allocated rooms
      }
      return "inherit";
    };

    // Helper function to get bed icon based on allocation status and recommendation letter
    const getBedIcon = (bedIndex, roomId, dateIndex) => {
      if (isBlocked) {
        // Check blocking status and return appropriate icon
        const blocking = roomBlockings?.find((blocking) => {
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

        if (blocking) {
          switch (blocking.attributes.room_block) {
            case "Maintenance":
              return icons.Group_3;
            case "Secretary Maharaji Request":
              return icons.Group_7;
            case "Hospital/ Dispensary":
              return icons.Group_5;
            default:
              return icons.filledBed;
          }
        }
        return icons.filledBed;
      }

      const allocation = roomAllocations?.data?.find((allocation) => {
        const fromDate = new Date(
          allocation.attributes.guests.data[0].attributes.arrival_date
        );
        const toDate = new Date(
          allocation.attributes.guests.data[0].attributes.departure_date
        );
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

      if (allocation && bedIndex < allocation.attributes.guests.data.length) {
        const guest = allocation.attributes.guests.data[bedIndex];
        const hasRecommendationLetter =
          guest?.attributes?.booking_request?.data?.attributes
            ?.recommendation_letter?.data;
        return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
      }

      // Check if bed is selected
      const bedKey = `${roomId}-${dateIndex}-${bedIndex}`;
      if (selectedBeds[bedKey]) {
        return icons.selectedImage;
      }

      return icons.Group2;
    };

    // Modify the img tag rendering to include onClick handler with roomNumber
    const renderBedIcon = (bedIndex) => {
      const icon = getBedIcon(bedIndex, roomId, dateIndex);
      const isClickable = !isBlocked && isInRange && selectedGuests?.length > 0 && (icon === icons.Group2 || icon === icons.selectedImage);

      return (
        <img
          src={icon}
          alt="bed"
          className={`bed-icon ${isInRange ? 'in-range' : ''}`}
          onClick={() => {
            if (isClickable) {
              handleBedClick(roomId, roomNumber, dateIndex, bedIndex);
            }
          }}
          style={{
            cursor: isClickable ? 'pointer' : 'default',
            opacity: 1 // Remove opacity change
          }}
        />
      );
    };

    if (numberOfBeds > 4) {
      const key = `${roomId}-${dateIndex}`;
      const selectedCount = selectedBedCounts[key] || 0;
      const availableBeds = numberOfBeds - occupiedBeds;
      const allBedsSelected = selectedCount >= availableBeds;

      beds.push(
        <div
          key="bed-count-layout"
          className={`bed-count-layout ${isInRange ? 'in-range' : ''}`}
          data-tooltip={tooltipContent ? "true" : undefined}
          onClick={() => {
            if (!isBlocked && isInRange && selectedGuests?.length > 0 && availableBeds > 0 && !allBedsSelected) {
              handleBedCountClick(roomId, roomNumber, dateIndex, availableBeds);
            }
          }}
          style={{
            cursor: (!isBlocked && isInRange && selectedGuests?.length > 0 && availableBeds > 0 && !allBedsSelected) ? 'pointer' : 'default',
            backgroundColor: getBackgroundColor(isBlocked, hasRecommendationLetter, roomBlockings?.find((blocking) =>
              isDateInRange(currentDate, blocking.attributes.from_date, blocking.attributes.to_date)
            )),
            borderRadius: "8px",
          }}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className={`bed-count-box ${isInRange ? 'in-range' : ''}`}>
            <span className="bed-number">
              {isInRange && selectedCount > 0
                ? <>
                  {availableBeds - selectedCount}
                  <div className="beds-occupied">
                    {selectedCount} beds occupied
                  </div>
                </>
                : availableBeds
              }
            </span>
            <span className="bed-status">
              {isBlocked
                ? "Blocked"
                : occupiedBeds > 0
                  ? "Available"
                  : allBedsSelected
                    ? "Full"
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
            {renderBedIcon(0)}
            {renderBedIcon(1)}
          </div>
          <div className="bottom-row">
            {renderBedIcon(2)}
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
            {renderBedIcon(i * 2)}
            {renderBedIcon(i * 2 + 1)}
          </div>
        );
      }

      if (remainingBeds > 0) {
        bedGroups.push(
          <div key="remaining" className="bed-group">
            {renderBedIcon(fullGroups * 2)}
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

  // Add helper function to calculate available beds
  const getAvailableBedsForDate = (room, date) => {
    const totalBeds = room.attributes.no_of_beds;
    const allocations = room.attributes.room_allocations?.data || [];
    const blockings = room.attributes.room_blockings?.data || [];

    // Check if room is blocked
    const isBlocked = blockings.some((blocking) => {
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
      // Get the date to check
      const checkDate = new Date(
        date.year,
        new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
        date.day,
        0,
        0,
        0
      );

      // If there are guests in the allocation, use their dates
      if (allocation.attributes.guests?.data?.length > 0) {
        const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
        const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + allocation.attributes.guests.data.length;
        }
      }
      // If no guests in allocation but has booking request, use occupancy
      else if (allocation.attributes.booking_request?.data) {
        const fromDate = new Date(allocation.attributes.booking_request.data.attributes.arrival_date);
        const toDate = new Date(allocation.attributes.booking_request.data.attributes.departure_date);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + (allocation.attributes.occupancy || 0);
        }
      }

      return count;
    }, 0);

    const availableBeds = totalBeds - occupiedBeds;
    return Math.max(0, availableBeds);
  };

  // Modified handleListViewBedSelection to include room parameter
  const handleListViewBedSelection = (roomId, date, totalAvailableBeds, room) => {
    // DEBUG LOGGING START
    console.log('[Dormitory Selection] roomId:', roomId, 'room:', room);
    console.log('[Dormitory Selection] arrivalDate:', arrivalDate, 'departureDate:', departureDate);
    const debugBedsPerDate = dates
      .filter(d => isDateInRange(d, arrivalDate, departureDate))
      .map(d => ({
        date: d,
        availableBeds: getAvailableBedsForDate(room, d)
      }));
    console.log('[Dormitory Selection] Available beds per date in range:', debugBedsPerDate);
    // DEBUG LOGGING END

    // For dormitory rooms, only block if any date in the range has 0 available beds
    if (room.attributes.no_of_beds > 10) {
      const isFullyBooked = dates.some(d => {
        const inRange = isDateInRange(d, arrivalDate, departureDate);
        const beds = getAvailableBedsForDate(room, d);
        console.log('[isFullyBooked debug]', {
          date: d,
          inRange,
          availableBeds: beds,
          fullyBookedOnThisDate: inRange && beds === 0
        });
        return beds === 0 && inRange;
      });
      if (isFullyBooked) {
        alert("No beds available for some dates in your selected range. Please choose another room or date.");
        return;
      }
    }

    if (!selectedGuests?.length) {
      alert("Please select a guest first before allocating a room");
      return;
    }

    // Only check for allocation conflicts for non-dormitory rooms
    if (!(room.attributes.no_of_beds > 10)) {
      if (hasAllocationInDateRange(room, arrivalDate, departureDate)) {
        alert("This room is already allocated for some dates in your selected range. Please choose another room.");
        return;
      }
    }

    // Calculate all updates first
    const bedUpdates = {};
    const countUpdates = {};
    const currentKey = `${roomId}-${date.year}-${date.month}-${date.day}`;
    const currentCount = selectedBedCounts[currentKey] || 0;
    const newCount = currentCount < totalAvailableBeds ? currentCount + 1 : 0;

    // Calculate updates for all dates in range
    dates.forEach((d, idx) => {
      if (isDateInRange(d, arrivalDate, departureDate)) {
        const dateKey = `${roomId}-${d.year}-${d.month}-${d.day}`;
        countUpdates[dateKey] = newCount;

        // Update bed selections
        for (let i = 0; i < totalAvailableBeds; i++) {
          bedUpdates[`${roomId}-${idx}-${i}`] = i < newCount;
        }
      }
    });

    // Apply all updates at once
    setSelectedBedCounts(prev => ({
      ...prev,
      ...countUpdates
    }));

    setSelectedBeds(prev => ({
      ...prev,
      ...bedUpdates
    }));

    // If selecting a new bed, call onRoomSelect
    if (currentCount < totalAvailableBeds) {
      onRoomSelect(room.attributes.room_number, {
        startDate: arrivalDate,
        endDate: departureDate,
        guest: selectedGuests[0],
        roomId: room.id
      });
    }
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
                const tooltipContent = getTooltipContent(
                  room.attributes?.room_blockings?.data,
                  room.attributes?.room_allocations,
                  date,
                  handleBedManagementClick
                );

                const isBlocked = room.attributes?.room_blockings?.data?.some(
                  (blocking) => {
                    if (!blocking?.attributes) return false;
                    return isDateInBlockingRange(blocking, date);
                  }
                );

                const hasRecommendationLetter = room.attributes?.room_allocations?.data?.some(allocation => {
                  const checkDate = new Date(
                    date.year,
                    new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                    date.day,
                    0,
                    0,
                    0
                  );

                  if (allocation.attributes.booking_request?.data) {
                    const fromDate = new Date(allocation.attributes.booking_request.data.attributes.arrival_date);
                    const toDate = new Date(allocation.attributes.booking_request.data.attributes.departure_date);
                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);

                    if (checkDate >= fromDate && checkDate <= toDate) {
                      return allocation.attributes.booking_request.data.attributes.recommendation_letter?.data;
                    }
                  }
                  return false;
                });

                const hasAllocation = room.attributes?.room_allocations?.data?.some(
                  (allocation) => {
                    if (!allocation?.attributes?.guests?.data?.[0]?.attributes)
                      return false;
                    return isDateInAllocationRange(allocation, date);
                  }
                );

                const dateKey = `${room.id}-${date.year}-${date.month}-${date.day}`;
                const selectedCount = totalBeds <= 4
                  ? getSelectedCount(room.id, index)
                  : (selectedBedCounts[dateKey] || 0);
                const isInRange = isDateInRange(date, arrivalDate, departureDate);

                const getBackgroundColor = (isBlocked, hasAllocation, blocking) => {
                  if (isBlocked) {
                    // If blocking object is provided, check for block_color
                    if (blocking && blocking.attributes.block_color) {
                      console.log("BookRoomBed Global - Using block_color:", blocking.attributes.block_color);
                      return blocking.attributes.block_color;
                    }
                    console.log("BookRoomBed Global - No block_color, using default yellow");
                    return "#FFFF00"; // default yellow for blocks without color
                  }
                  if (hasAllocation) {
                    return "#F28E86"; // or whatever color you use for allocated rooms
                  }
                  return "inherit";
                };

                const allBedsSelected = selectedCount >= availableBeds;
                // Updated logic: allow clicking dormitory cells if availableBeds > 0, regardless of allocations
const isDormitory = room.attributes.no_of_beds > 10;
const isClickable = !isBlocked && isInRange && availableBeds > 0 && !allBedsSelected && (isDormitory || !hasAllocation);

                return (
                  <div
                    key={index}
                    className={`availability-box ${isInRange ? 'in-range' : ''}`}
                    data-tooltip={tooltipContent ? "true" : undefined}
                    style={{
                      backgroundColor: getBackgroundColor(isBlocked, hasAllocation, room.attributes?.room_blockings?.data?.find((blocking) =>
                        isDateInRange(date, blocking.attributes.from_date, blocking.attributes.to_date)
                      )),
                      cursor: isClickable ? 'pointer' : 'default',
                      opacity: 1
                    }}
                    onClick={(e) => {
                      if (e.target.closest('.tooltip-content')) {
                        return;
                      }
                      if (!selectedGuests?.length) {
                        alert("Please select a guest first before allocating a room");
                        return;
                      }
                      if (isClickable) {
                        handleListViewBedSelection(room.id, date, availableBeds, room);
                      }
                    }}
                  >
                    <div className={`bed-count ${isInRange ? 'in-range' : ''}`}>
                      {isInRange
                        ? (selectedCount > 0
                          ? <>
                            {availableBeds - selectedCount}
                            <div className="availability-label">
                              Available
                            </div>
                            <div className="beds-occupied">
                              {selectedCount} Beds Occupied
                            </div>
                          </>
                          : <>
                            {availableBeds}
                            <div className="availability-label">
                              Available
                            </div>
                          </>)
                        : <>
                          {availableBeds}
                          <div className="availability-label">
                            Available
                          </div>
                        </>
                      }
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

  // Helper functions for date checks
  const isDateInBlockingRange = (blocking, date) => {
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
  };

  const isDateInAllocationRange = (allocation, date) => {
    const fromDate = new Date(
      allocation.attributes.guests.data[0].attributes.arrival_date
    );
    const toDate = new Date(
      allocation.attributes.guests.data[0].attributes.departure_date
    );
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
                <div className="scrollable-beds">
                  {dates.map((date, dateIndex) => {
                    const isInRange = isDateInRange(date, arrivalDate, departureDate);
                    return (
                      <div
                        key={dateIndex}
                        className="bed-cell"
                        style={{ padding: room.attributes.no_of_beds <= 4 ? "10px" : "0px" }}
                        onClick={() => {
                          if (!selectedGuests?.length) {
                            alert("Please select a guest first before allocating a room");
                            return;
                          }
                        }}
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Update the getTooltipContent function signature to accept the handler
const getTooltipContent = (
  roomBlockings,
  roomAllocations,
  currentDate,
  onBedManagementClick
) => {
  // Find all allocations for this date
  const checkDate = new Date(
    currentDate.year,
    new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
    currentDate.day
  );
  checkDate.setHours(0, 0, 0, 0);

  const allocationsForDate = (roomAllocations?.data || []).filter((allocation) => {
    // Check dates from either guests or booking request
    if (allocation.attributes.guests?.data?.length > 0) {
      const fromDate = new Date(allocation.attributes.guests.data[0].attributes.arrival_date);
      const toDate = new Date(allocation.attributes.guests.data[0].attributes.departure_date);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    } else if (allocation.attributes.booking_request?.data) {
      const fromDate = new Date(allocation.attributes.booking_request.data.attributes.arrival_date);
      const toDate = new Date(allocation.attributes.booking_request.data.attributes.departure_date);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    }
    return false;
  });

  if (allocationsForDate.length > 0) {
    return (
      <div className="tooltip-content">
        <h4>Bookings for this date:</h4>
        {allocationsForDate.map((allocation, allocIdx) => (
          <div key={allocIdx} className="booking-details" style={{marginBottom:8}}>
            <div style={{fontWeight:'bold', marginBottom:4}}>Booking {allocIdx + 1}:</div>
            {allocation.attributes.guests?.data?.length > 0 ? (
              <div>
                {allocation.attributes.guests.data.map((guest, guestIdx) => (
                  <div key={guestIdx} className="guest-details" style={{marginLeft:12, marginBottom:4}}>
                    <span>👤 <b>{guest.attributes?.name}</b></span><br />
                    <span>From: {guest.attributes?.arrival_date}</span><br />
                    <span>To: {guest.attributes?.departure_date}</span><br />
                    <span>Phone: {guest.attributes?.phone_number}</span>
                  </div>
                ))}
              </div>
            ) : allocation.attributes.booking_request?.data ? (
              <div style={{marginLeft:12}}>
                <span><b>Booking Request:</b> {allocation.attributes.booking_request.data.attributes.name}</span><br />
                <span>From: {allocation.attributes.booking_request.data.attributes.arrival_date}</span><br />
                <span>To: {allocation.attributes.booking_request.data.attributes.departure_date}</span><br />
                <span>Occupancy: {allocation.attributes.occupancy}</span><br />
                <span>Phone: {allocation.attributes.booking_request.data.attributes.phone_number}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
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

export default BookRoomBed;
