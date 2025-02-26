import React, { useEffect, useState, useRef } from "react";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import { useNavigate } from "react-router-dom";
import "./BookRoomBed.scss";

const BookRoomBed = ({
  blockId,
  selectedDateRange,
  numberOfBedsToAllocate,
  refreshTrigger,
  onRoomAllocation,
  arrivalDate,
  departureDate,
  viewMode,
  onBedSelect,
}) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [allocatedRoomNumber, setAllocatedRoomNumber] = useState(null);
  const [allocatedRooms, setAllocatedRooms] = useState([]);
  const navigate = useNavigate();
  const [selectedBeds, setSelectedBeds] = useState({});

  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      if (!arrivalDate) return;

      const startDate = new Date(arrivalDate);
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
  }, [arrivalDate]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (blockId) {
        try {
          setIsLoading(true);
          const blockData = await blockService.fetchBlockById(blockId);
          const roomsData = blockData.data.attributes.rooms.data;
          setRooms(roomsData);

          // Log all room allocation data
          // console.log("=== All Rooms Data ===");
          roomsData.forEach((room) => {
            // console.log("room", room);
          });
        } catch (error) {
          console.error("Error fetching block details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlockDetails();
  }, [blockId, refreshTrigger]);

  // Add logging to debug date range
  useEffect(() => {
    // console.log("Selected Date Range:", selectedDateRange);
    // console.log("Arrival Date:", arrivalDate);
    // console.log("Departure Date:", departureDate);
  }, [selectedDateRange, arrivalDate, departureDate]);

  // Add useEffect to reset selectedBeds when numberOfBedsToAllocate becomes 0
  useEffect(() => {
    if (numberOfBedsToAllocate === 0) {
      setSelectedBeds({}); // Clear all selected beds
      onRoomAllocation([]); // Clear room allocations
    }
  }, [numberOfBedsToAllocate, onRoomAllocation]);

  const handleBedClick = (allocation) => {
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

  const getTooltipContent = (roomBlockings, roomAllocations, currentDate) => {
    // Early return if roomAllocations is undefined or doesn't have data
    if (!roomAllocations?.data) return null;

    // Find allocation with additional safety checks
    const allocation = roomAllocations.data.find((allocation) => {
      // Check for allocations with guests
      if (allocation?.attributes?.guests?.data?.length > 0) {
        try {
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

          // Validate dates
          if (
            isNaN(fromDate.getTime()) ||
            isNaN(toDate.getTime()) ||
            isNaN(checkDate.getTime())
          ) {
            return false;
          }

          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);

          return checkDate >= fromDate && checkDate <= toDate;
        } catch (error) {
          console.error("Error processing dates:", error);
          return false;
        }
      }
      // Check for allocations without guests but with occupancy
      else if (allocation.attributes.room_status === "allocated") {
        return true; // Show tooltip for allocated rooms even without guests
      }
      return false;
    });

    if (allocation) {
      if (allocation.attributes.guests?.data?.length > 0) {
        // Existing guest tooltip content
        const guests = allocation.attributes.guests.data;
        return (
          <div
            className="tooltip-content"
            onClick={() => handleBedClick(allocation)}
            style={{ cursor: "pointer" }}
          >
            <h4>Room Allocation Details:</h4>
            {guests.map((guest, index) => (
              <div key={index} className="guest-details">
                <p>
                  <strong>Guest {index + 1}:</strong>
                </p>
                <p>Name: {guest.attributes.name}</p>
                <p>From: {guest.attributes.arrival_date}</p>
                <p>To: {guest.attributes.departure_date}</p>
                <p>Phone: {guest.attributes.phone_number}</p>
              </div>
            ))}
          </div>
        );
      } else {
        // New tooltip content for rooms with occupancy but no guests
        return (
          <div className="tooltip-content">
            <h4>Room Allocation Details:</h4>
            <p>
              <strong>Status:</strong> Allocated
            </p>
            <p>
              <strong>Occupied Beds:</strong> {allocation.attributes.occupancy}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(allocation.attributes.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(allocation.attributes.updatedAt).toLocaleString()}
            </p>
          </div>
        );
      }
    }

    // Check for blockings if no allocation
    const blocking = roomBlockings?.find((blocking) => {
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

    if (blocking) {
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

  const handleBedIconClick = (room, bedIndex, currentDate) => {
    // Add debug logging
    console.log("Current state:", {
      numberOfBedsToAllocate,
      selectedBeds,
      dateRange: selectedDateRange,
    });

    // Guard against invalid numberOfBedsToAllocate
    if (
      typeof numberOfBedsToAllocate !== "number" ||
      numberOfBedsToAllocate <= 0
    ) {
      console.log(
        "Invalid or zero numberOfBedsToAllocate:",
        numberOfBedsToAllocate
      );
      return;
    }

    // Check if bed is already selected
    const bedKey = `${room.attributes.room_number}-${bedIndex}-${currentDate.year}-${currentDate.month}-${currentDate.day}`;
    const isCurrentlySelected = selectedBeds[bedKey];

    if (isCurrentlySelected) {
      // Deselect logic remains the same...
      const start = new Date(selectedDateRange.arrivalDate);
      const end = new Date(selectedDateRange.departureDate);
      const bedUpdates = {};

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "short" });
        const day = date.getDate();
        const rangeBedKey = `${room.attributes.room_number}-${bedIndex}-${year}-${month}-${day}`;
        bedUpdates[rangeBedKey] = false;
      }

      setSelectedBeds((prev) => {
        const newSelectedBeds = { ...prev };
        Object.keys(bedUpdates).forEach((key) => {
          delete newSelectedBeds[key];
        });
        return newSelectedBeds;
      });

      onBedSelect({
        roomNumber: room.attributes.room_number,
        roomId: room.id,
        bedIndex: bedIndex,
        date: currentDate,
        isDeselecting: true,
      });

      return;
    }

    // Calculate number of days in date range
    const start = new Date(selectedDateRange.arrivalDate);
    const end = new Date(selectedDateRange.departureDate);
    const daysInRange = (end - start) / (1000 * 60 * 60 * 24) + 1;

    // Count currently selected unique beds
    const selectedBedKeys = Object.keys(selectedBeds);
    const uniqueBedsSelected = new Set(
      selectedBedKeys.map((key) => key.split("-").slice(0, 2).join("-"))
    ).size;

    console.log("Selection check:", {
      uniqueBedsSelected,
      numberOfBedsToAllocate,
      daysInRange,
    });

    // Check if we've reached the limit
    if (uniqueBedsSelected >= numberOfBedsToAllocate) {
      console.log("Cannot select more beds - allocation limit reached");
      return;
    }

    // Proceed with selection
    const bedUpdates = {};
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const rangeBedKey = `${room.attributes.room_number}-${bedIndex}-${year}-${month}-${day}`;
      bedUpdates[rangeBedKey] = true;
    }

    setSelectedBeds((prev) => ({
      ...prev,
      ...bedUpdates,
    }));

    onBedSelect({
      roomNumber: room.attributes.room_number,
      roomId: room.id,
      bedIndex: bedIndex,
      date: currentDate,
      isDeselecting: false,
    });

    // Count selected beds for this room
    const selectedBedsCount =
      Object.entries(bedUpdates).filter(([_, isSelected]) => isSelected)
        .length /
      ((new Date(selectedDateRange.departureDate) -
        new Date(selectedDateRange.arrivalDate)) /
        (1000 * 60 * 60 * 24) +
        1);

    // Update allocated rooms
    const updatedRoom = {
      roomId: room.id,
      roomNumber: room.attributes.room_number,
      bedsSelected: selectedBedsCount,
      totalBeds: room.attributes.no_of_beds,
    };

    onRoomAllocation([updatedRoom]);
  };

  const renderBedIcon = (bedIndex, room, currentDate) => {
    const bedKey = `${room.attributes.room_number}-${bedIndex}-${currentDate.year}-${currentDate.month}-${currentDate.day}`;

    // First check if bed is selected
    if (selectedBeds[bedKey] && numberOfBedsToAllocate > 0) {
      // Add numberOfBedsToAllocate check
      return icons.selectedImage;
    }

    // Check blockings
    const isBlocked = room.attributes.room_blockings?.some((blocking) => {
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

    // Get number of allocated beds for current date
    const allocatedBedsCount =
      room.attributes.room_allocations?.data?.reduce((count, allocation) => {
        // Add null checks for nested properties
        const firstGuest = allocation?.attributes?.guests?.data?.[0];
        if (
          !firstGuest?.attributes?.arrival_date ||
          !firstGuest?.attributes?.departure_date
        ) {
          return count;
        }

        const fromDate = new Date(firstGuest.attributes.arrival_date);
        const toDate = new Date(firstGuest.attributes.departure_date);
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

        if (checkDate >= fromDate && checkDate <= toDate) {
          // Safely count guests with null check
          return count + (allocation?.attributes?.guests?.data?.length || 0);
        }
        return count;
      }, 0) || 0;

    const isSelected =
      selectedDateRange &&
      (() => {
        // Create date strings for comparison
        const checkDateStr = `${currentDate.year}-${String(
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.day).padStart(2, "0")}`;

        // Use the exact date strings from selectedDateRange
        return (
          checkDateStr >= selectedDateRange.arrivalDate &&
          checkDateStr <= selectedDateRange.departureDate
        );
      })();

    const tooltipContent = getTooltipContent(
      room.attributes.room_blockings?.data,
      room.attributes.room_allocations,
      currentDate
    );

    if (isBlocked) {
      // Check blocking status and return appropriate icon
      const blocking = room.attributes.room_blockings?.find((blocking) => {
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
        switch (blocking.attributes.room_block_status) {
          case "blocked":
            return icons.Group_4;
          case "maintenance":
            return icons.Group_7;
          case "cleaning":
            return icons.Group_3;
          default:
            return icons.filledBed;
        }
      }
      return icons.filledBed;
    } else {
      // Check for allocations without guests
      const allocation = room.attributes.room_allocations?.data?.find(
        (allocation) => {
          if (allocation.attributes.guests?.data?.length > 0) {
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
          } else {
            // If no guests but room is allocated, check occupancy
            return (
              allocation.attributes.room_status === "allocated" &&
              bedIndex < allocation.attributes.occupancy
            );
          }
        }
      );

      if (allocation) {
        // If there are guests, use existing logic for recommendation letter
        if (allocation.attributes.guests?.data?.length > 0) {
          const hasRecommendationLetter =
            allocation.attributes.guests.data[bedIndex]?.attributes
              ?.booking_request?.data?.attributes?.recommendation_letter?.data;
          return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
        } else {
          // If no guests but room is allocated, show as occupied
          return icons.Group_1;
        }
      }
      return icons.Group2; // Available bed
    }
  };

  const renderBeds = (
    numberOfBeds,
    roomBlockings,
    roomAllocations,
    currentDate,
    room
  ) => {
    const beds = [];

    // Check blockings
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

    // Get number of allocated beds for current date
    const allocatedBedsCount =
      roomAllocations?.data?.reduce((count, allocation) => {
        // Add null checks for nested properties
        const firstGuest = allocation?.attributes?.guests?.data?.[0];
        if (
          !firstGuest?.attributes?.arrival_date ||
          !firstGuest?.attributes?.departure_date
        ) {
          return count;
        }

        const fromDate = new Date(firstGuest.attributes.arrival_date);
        const toDate = new Date(firstGuest.attributes.departure_date);
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

        if (checkDate >= fromDate && checkDate <= toDate) {
          // Safely count guests with null check
          return count + (allocation?.attributes?.guests?.data?.length || 0);
        }
        return count;
      }, 0) || 0;

    const isSelected =
      selectedDateRange &&
      (() => {
        // Create date strings for comparison
        const checkDateStr = `${currentDate.year}-${String(
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.day).padStart(2, "0")}`;

        // Use the exact date strings from selectedDateRange
        return (
          checkDateStr >= selectedDateRange.arrivalDate &&
          checkDateStr <= selectedDateRange.departureDate
        );
      })();

    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate
    );

    // Modify renderBedIcon to handle selected state
    const renderBedIcon = (bedIndex, room, currentDate) => {
      const bedKey = `${room.attributes.room_number}-${bedIndex}-${currentDate.year}-${currentDate.month}-${currentDate.day}`;

      if (selectedBeds[bedKey]) {
        return icons.selectedImage;
      }

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
          switch (blocking.attributes.room_block_status) {
            case "blocked":
              return icons.Group_4;
            case "maintenance":
              return icons.Group_7;
            case "cleaning":
              return icons.Group_3;
            default:
              return icons.filledBed;
          }
        }
        return icons.filledBed;
      } else {
        // Check for allocations without guests
        const allocation = roomAllocations?.data?.find((allocation) => {
          if (allocation.attributes.guests?.data?.length > 0) {
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
          } else {
            // If no guests but room is allocated, check occupancy
            return (
              allocation.attributes.room_status === "allocated" &&
              bedIndex < allocation.attributes.occupancy
            );
          }
        });

        if (allocation) {
          // If there are guests, use existing logic for recommendation letter
          if (allocation.attributes.guests?.data?.length > 0) {
            const hasRecommendationLetter =
              allocation.attributes.guests.data[bedIndex]?.attributes
                ?.booking_request?.data?.attributes?.recommendation_letter
                ?.data;
            return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
          } else {
            // If no guests but room is allocated, show as occupied
            return icons.Group_1;
          }
        }
        return icons.Group2; // Available bed
      }
    };

    // Modify the img tag rendering to include onClick
    const renderBedImage = (bedIndex) => (
      <img
        src={renderBedIcon(bedIndex, room, currentDate)}
        alt="bed"
        className="bed-icon"
        onClick={() => {
          // Allow clicking on both Group2 and selectedImage
          if (
            renderBedIcon(bedIndex, room, currentDate) === icons.Group2 ||
            renderBedIcon(bedIndex, room, currentDate) === icons.selectedImage
          ) {
            handleBedIconClick(room, bedIndex, currentDate);
          }
        }}
        style={{
          cursor:
            renderBedIcon(bedIndex, room, currentDate) === icons.Group2 ||
            renderBedIcon(bedIndex, room, currentDate) === icons.selectedImage
              ? "pointer"
              : "default",
        }}
      />
    );

    if (numberOfBeds > 4) {
      const selectedBedsForRoom = Object.keys(selectedBeds).filter((key) => {
        const [roomNumber] = key.split("-");
        return roomNumber === room.attributes.room_number;
      }).length;

      // Calculate the actual number of selected beds for this date
      const dateStr = `${currentDate.year}-${currentDate.month}-${currentDate.day}`;
      const selectedBedsForDate = Object.keys(selectedBeds).filter((key) => {
        const [roomNumber, _, year, month, day] = key.split("-");
        const keyDateStr = `${year}-${month}-${day}`;
        return (
          roomNumber === room.attributes.room_number && keyDateStr === dateStr
        );
      }).length;

      // Check if the room is blocked or fully allocated
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

      // Handle click on bed count layout
      const handleBedCountClick = () => {
        if (isBlocked) return; // Don't allow clicks on blocked rooms

        // Find the next available bed index
        const nextBedIndex = selectedBedsForDate;
        if (nextBedIndex < numberOfBeds) {
          handleBedIconClick(room, nextBedIndex, currentDate);
        }
      };

      beds.push(
        <div
          key="bed-count-layout"
          className="bed-count-layout"
          title={tooltipContent ? "" : undefined}
          data-tooltip={tooltipContent ? "true" : undefined}
          onClick={handleBedCountClick}
          style={{
            cursor: isBlocked ? "default" : "pointer",
          }}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="bed-count-box">
            <span className="bed-number">{numberOfBeds}</span>
            <span className="bed-status">
              {isBlocked
                ? "Blocked"
                : selectedBedsForDate > 0
                ? `Selected (${selectedBedsForDate}/${numberOfBeds})`
                : allocatedBedsCount > 0
                ? "Occupied"
                : "Available"}
            </span>
          </div>
        </div>
      );
    } else if (numberOfBeds === 3) {
      beds.push(
        <div
          key="three-bed-layout"
          className="three-bed-layout"
          title={tooltipContent ? "" : undefined}
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="top-row">
            {renderBedImage(0)}
            {renderBedImage(1)}
          </div>
          <div className="bottom-row">{renderBedImage(2)}</div>
        </div>
      );
    } else {
      // For other bed configurations
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;
      let bedCount = 0;

      const bedGroups = [];
      for (let i = 0; i < fullGroups; i++) {
        bedGroups.push(
          <div key={`group-${i}`} className="bed-group">
            {renderBedImage(bedCount++)}
            {renderBedImage(bedCount++)}
          </div>
        );
      }

      if (remainingBeds > 0) {
        bedGroups.push(
          <div key="remaining" className="bed-group">
            {renderBedImage(bedCount)}
          </div>
        );
      }

      beds.push(
        <div
          key="bed-layout"
          className="bed-layout"
          title={tooltipContent ? "" : undefined}
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

  // Update findFirstAvailableRoom to handle multiple room allocations
  useEffect(() => {
    if (selectedDateRange && numberOfBedsToAllocate >= 0) {
      const result = findFirstAvailableRoom();

      if (numberOfBedsToAllocate === 0) {
        // Clear all allocations when no beds are needed
        setAllocatedRooms([]);
        onRoomAllocation([]);
      } else if (result) {
        setAllocatedRooms(result);
        onRoomAllocation(result);
      } else {
        setAllocatedRooms([]);
        onRoomAllocation([]);
      }
    }
  }, [selectedDateRange, numberOfBedsToAllocate, rooms]);

  const findFirstAvailableRoom = () => {
    // console.log("=== Finding Available Rooms ===");
    // console.log("Selected Date Range:", selectedDateRange);
    // console.log("Beds Needed:", numberOfBedsToAllocate);

    if (
      !selectedDateRange ||
      !selectedDateRange.arrivalDate ||
      !selectedDateRange.departureDate ||
      numberOfBedsToAllocate <= 0
    ) {
      return null;
    }

    let remainingBedsNeeded = numberOfBedsToAllocate;
    let allocatedRoomsResult = [];

    // Sort rooms by capacity (descending) to allocate larger rooms first
    const sortedRooms = [...rooms].sort(
      (a, b) => b.attributes.no_of_beds - a.attributes.no_of_beds
    );

    for (const room of sortedRooms) {
      // console.log(`\nChecking Room ${room.attributes.room_number}:`, {
      //   totalBeds: room.attributes.no_of_beds,
      //   existingAllocations: room.attributes.room_allocations?.data?.map(
      //     (a) => ({
      //       guests: a.attributes.guests.data.map((g) => ({
      //         arrival: g.attributes.arrival_date,
      //         departure: g.attributes.departure_date,
      //       })),
      //     })
      //   ),
      //   blockings: room.attributes.room_blockings?.data?.map((b) => ({
      //     status: b.attributes.room_block_status,
      //     from: b.attributes.from_date,
      //     to: b.attributes.to_date,
      //   })),
      // });

      // Skip if no more beds needed
      if (remainingBedsNeeded <= 0) break;

      // Check for existing allocations
      const existingAllocations = room.attributes.room_allocations?.data || [];
      let hasConflict = false;

      for (const allocation of existingAllocations) {
        const guests = allocation.attributes.guests.data;
        if (!guests || guests.length === 0) continue;

        const existingArrival = guests[0].attributes.arrival_date;
        const existingDeparture = guests[0].attributes.departure_date;

        const hasOverlap =
          selectedDateRange.arrivalDate <= existingDeparture &&
          selectedDateRange.departureDate >= existingArrival;

        if (hasOverlap) {
          hasConflict = true;
          break;
        }
      }

      if (hasConflict) continue;

      // Check for room blockings
      const roomBlockings = room.attributes.room_blockings?.data || [];
      const isBlocked = roomBlockings.some((blocking) => {
        const blockStart = blocking.attributes.from_date;
        const blockEnd = blocking.attributes.to_date;
        return (
          selectedDateRange.arrivalDate <= blockEnd &&
          selectedDateRange.departureDate >= blockStart
        );
      });

      if (isBlocked) continue;

      // Calculate available beds
      const availableBeds = room.attributes.no_of_beds;

      if (availableBeds > 0) {
        const bedsToAllocate = Math.min(availableBeds, remainingBedsNeeded);

        // Make sure we're including the room ID
        allocatedRoomsResult.push({
          roomNumber: room.attributes.room_number,
          roomId: room.id, // Ensure this is the correct property name
          bedsAllocated: bedsToAllocate,
          totalBeds: availableBeds,
        });
        // console.log("Adding room to allocation:", {
        //   roomNumber: room.attributes.room_number,
        //   roomId: room.id,
        //   bedsAllocated: bedsToAllocate,
        // }); // Debug log

        remainingBedsNeeded -= bedsToAllocate;

        // console.log(`Room ${room.attributes.room_number} is available:`, {
        //   availableBeds,
        //   bedsToAllocate: Math.min(availableBeds, remainingBedsNeeded),
        // });
      }
    }

    // Log final allocation result
    // console.log("\nFinal Allocation Result:", allocatedRoomsResult);

    return allocatedRoomsResult;
  };

  // Update isFirstAvailableRoom to check against all allocated rooms
  const isFirstAvailableRoom = (room, date) => {
    if (
      !selectedDateRange ||
      !allocatedRooms.length ||
      numberOfBedsToAllocate === 0
    )
      return false;
    return allocatedRooms.some(
      (allocated) => allocated.roomNumber === room.attributes.room_number
    );
  };

  const renderListView = () => {
    return (
      <div className="list-view-container">
        <div className="room-numbers-column">
          <div className="list-header fixed-column">Room No.</div>
          {rooms?.map((room) => (
            <div key={room?.id} className="room-info">
              <div className="room-number">
                {room?.attributes?.room_number}
                <span className="capacity">
                  ({room?.attributes?.no_of_beds})
                </span>
              </div>
            </div>
          )) || null}
        </div>

        <div className="scrollable-content" ref={scrollContainerRef}>
          <div className="header-row">
            <div className="scrollable-dates">
              {dates?.map((date, index) => (
                <div key={index} className="date-column">
                  {`${date?.day}${getOrdinalSuffix(date?.day)} ${date?.month}`}
                </div>
              )) || null}
            </div>
          </div>

          {rooms?.map((room) => (
            <div key={room?.id} className="list-row">
              {dates?.map((date, index) => {
                const tooltipContent = room
                  ? getTooltipContent(
                      room?.attributes?.room_blockings?.data,
                      room?.attributes?.room_allocations,
                      date
                    )
                  : null;

                // Check for room blocking status with null checks
                const blocking = room?.attributes?.room_blockings?.data?.find(
                  (blocking) => {
                    if (
                      !blocking?.attributes?.from_date ||
                      !blocking?.attributes?.to_date
                    ) {
                      return false;
                    }

                    try {
                      const fromDate = new Date(blocking.attributes.from_date);
                      const toDate = new Date(blocking.attributes.to_date);
                      const checkDate = new Date(
                        date.year,
                        new Date(
                          Date.parse(`01 ${date.month} 2000`)
                        ).getMonth(),
                        date.day,
                        0,
                        0,
                        0
                      );

                      fromDate.setHours(0, 0, 0, 0);
                      toDate.setHours(0, 0, 0, 0);

                      return checkDate >= fromDate && checkDate <= toDate;
                    } catch (error) {
                      console.error("Error processing blocking dates:", error);
                      return false;
                    }
                  }
                );

                // Get available beds for this date
                const availableBeds = getAvailableBedsForDate(room, date);

                // Get selected beds for this date/room combination
                const dateStr = `${date.year}-${date.month}-${date.day}`;
                const selectedBedsForDate = Object.keys(selectedBeds).filter(
                  (key) => {
                    const [roomNumber, _, year, month, day] = key.split("-");
                    const keyDateStr = `${year}-${month}-${day}`;
                    return (
                      roomNumber === room.attributes.room_number &&
                      keyDateStr === dateStr
                    );
                  }
                ).length;

                // Calculate display count - only show ratio if beds are selected
                const displayCount =
                  selectedBedsForDate > 0
                    ? `${selectedBedsForDate}/${availableBeds}`
                    : availableBeds;

                // Handle click on availability box
                const handleAvailabilityClick = () => {
                  if (blocking || availableBeds === 0) return; // Don't allow clicks on blocked or full rooms

                  // Find the next available bed index
                  const nextBedIndex = selectedBedsForDate;
                  if (nextBedIndex < availableBeds) {
                    handleBedIconClick(room, nextBedIndex, date);
                  }
                };

                // Determine background color based on conditions
                let backgroundColor = "inherit";
                if (blocking?.attributes?.room_block_status) {
                  switch (blocking.attributes.room_block_status) {
                    case "maintenance":
                      backgroundColor = "#666666";
                      break;
                    case "blocked":
                      backgroundColor = "#FFFF00";
                      break;
                    case "reserved":
                      backgroundColor = "#00b050";
                      break;
                  }
                } else if (selectedBedsForDate > 0) {
                  backgroundColor = "#9866e9"; // Color for selected beds
                }

                return (
                  <div
                    key={index}
                    className="availability-box"
                    data-tooltip={!!tooltipContent}
                    style={{
                      backgroundColor,
                      cursor:
                        blocking || availableBeds === 0 ? "default" : "pointer",
                    }}
                    onClick={handleAvailabilityClick}
                  >
                    <div className="bed-count">{displayCount}</div>
                    <div className="availability-label">Available</div>
                    {tooltipContent && (
                      <div className="custom-tooltip">{tooltipContent}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )) || null}
        </div>
      </div>
    );
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

    // Create a proper Date object for comparison
    const checkDate = new Date(
      date.year,
      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
      date.day,
      0,
      0,
      0
    );

    // Check if room is blocked
    const isBlocked = blockings.some((blocking) => {
      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    if (isBlocked) return 0;

    // Calculate occupied beds from allocations
    const occupiedBeds = allocations.reduce((count, allocation) => {
      // If there are guests, count them
      if (allocation.attributes.guests?.data?.length > 0) {
        const guests = allocation.attributes.guests.data;
        const fromDate = new Date(guests[0].attributes.arrival_date);
        const toDate = new Date(guests[0].attributes.departure_date);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + guests.length;
        }
      }
      // If no guests but room is allocated, use the occupancy value
      else if (allocation.attributes.room_status === "allocated") {
        return count + (allocation.attributes.occupancy || 0);
      }
      return count;
    }, 0);

    return totalBeds - occupiedBeds;
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

            {rooms.map((room, roomIndex) => (
              <div key={room.id} className="room-row">
                <div className="scrollable-beds">
                  {dates.map((date, dateIndex) => (
                    <div key={dateIndex} className="bed-cell">
                      {renderBeds(
                        room.attributes.no_of_beds,
                        room.attributes.room_blockings?.data,
                        room.attributes.room_allocations,
                        date,
                        room
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

export default BookRoomBed;
