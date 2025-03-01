import React, { useEffect, useState } from "react";
import "./Dashboard.scss"; // Import the CSS file
import Graph from "../../../components/ui/graph/Graph";
import StatusItem from "../../../components/ui/graph/StatusItem";
import icons from "../../../constants/icons";
import ProgressBar from "../../../components/ui/progressBar/ProgressBar";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";
import {
  fetchBlocks,
  fetchBlocksWithRooms,
} from "../../../../services/src/services/blockService";
import { fetchAllGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { fetchRoomAllocationsForCheckin } from "../../../../services/src/services/roomAllocationService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalApplications, setTotalApplications] = useState(0);
  const [currentGuestCount, setCurrentGuestCount] = useState(0);
  const [statuses, setStatuses] = useState({
    awaiting: 0,
    approved: 0,
    on_hold: 0,
    rejected: 0,
    rescheduled: 0,
  });
  const [checkIns, setCheckIns] = useState(0);
  const [checkOuts, setCheckOuts] = useState(0);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [totalCheckOuts, setTotalCheckOuts] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [blockRoomStats, setBlockRoomStats] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Add these labels where you define other constants
  const roomStatusLabels = ["Available Rooms", "Occupied Rooms", "Blocked Rooms", "Cleaning Rooms"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch guest details and calculate arrived guests count
        const guestDetailsResponse = await fetchAllGuestDetails();
        // console.log("Guest Details:", guestDetailsResponse);

        // Calculate current guest count from guest details
        const arriveddGuests = guestDetailsResponse.data.filter(
          (guest) => guest.attributes.status === "Arrived"
        ).length;
        setCurrentGuestCount(arriveddGuests);

        // Fetch and log blocks data with rooms
        const blocksWithRoomsResponse = await fetchBlocksWithRooms();
        // console.log("Blocks with rooms data:", blocksWithRoomsResponse);
        setBlocks(blocksWithRoomsResponse.data || []);

        // Calculate room statistics for each block
        const blockStats = blocksWithRoomsResponse.data.map((block) => {
          const stats = {
            available: 0,
            occupied: 0,
            blocked: 0,
            cleaning: 0,
          };

          block.attributes.rooms.data.forEach((room) => {
            // Check room blockings
            const hasActiveBlocking = room.attributes.room_blockings.data.some(
              (blocking) => blocking.attributes.room_block_status === "blocked"
            );

            // Check room allocations
            const roomAllocations = room.attributes.room_allocations.data;
            const isOccupied = roomAllocations.some(
              (allocation) => allocation.attributes.room_status === "allocated"
            );

            if (hasActiveBlocking) {
              stats.blocked++;
            } else if (isOccupied) {
              stats.occupied++;
            } else {
              stats.available++;
            }
          });

          return stats;
        });

        setBlockRoomStats(blockStats);

        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Fetch room allocations for check-ins
        const checkInAllocations = await fetchRoomAllocationsForCheckin(
          "arrival_date",
          today
        );

        // Fetch room allocations for check-outs
        const checkOutAllocations = await fetchRoomAllocationsForCheckin(
          "departure_date",
          today
        );
        // console.log(checkOutAllocations);

        // Calculate check-ins
        let totalCheckInGuests = 0;
        let arrivedGuests = 0;

        checkInAllocations.data.forEach((allocation) => {
          const guests = allocation.attributes.guests.data;
          totalCheckInGuests += guests.length;
          arrivedGuests += guests.filter(
            (guest) => guest.attributes.status === "Arrived"
          ).length;
        });

        // Calculate check-outs
        let totalCheckOutGuests = 0;
        let departedGuests = 0;

        checkOutAllocations.data.forEach((allocation) => {
          const guests = allocation.attributes.guests.data;
          totalCheckOutGuests += guests.length;
          departedGuests += guests.filter(
            (guest) => guest.attributes.status === "Arrived"
          ).length;
        });

        setCheckIns(arrivedGuests);
        setCheckOuts(departedGuests);
        setTotalCheckIns(totalCheckInGuests);
        setTotalCheckOuts(totalCheckOutGuests);
        setTotalApplications(Math.max(totalCheckInGuests, totalCheckOutGuests));

        // Existing booking requests fetch and processing
        const response = await fetchBookingRequests();
        if (!response?.data) {
          return;
        }

        const bookingData = response.data;
        const statusCount = {
          awaiting: 0,
          approved: 0,
          on_hold: 0,
          rejected: 0,
          rescheduled: 0,
        };

        let guestCount = 0;

        bookingData.forEach((booking) => {
          const status = booking.attributes?.status;
          if (status && status in statusCount) {
            statusCount[status]++;
          }
          guestCount += booking.attributes?.number_of_guest_members || 0;
        });

        setStatuses(statusCount);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const series = [
    statuses.awaiting,
    statuses.approved,
    statuses.on_hold,
    statuses.rejected,
    statuses.rescheduled,
  ];
  const colors = ["#FF8F6B", "#FFB572", "#FFD439", "#FC5275", "#A3D65C"];
  const roomStatusColors = ["#FB8951", "#F7BC4C", "#FC5275", "#A3D65C"];

  const isAllZero = series.every((value) => value === 0);

  const roomStatus = [
    { color: "#FB8951", text: "Available rooms" },
    { color: "#F7BC4C", text: "Occupied rooms" },
    { color: "#FC5275", text: "Blocked rooms" },
    { color: "#A3D65C", text: "Cleaning underway" },
  ];

  const navigateToPage = (pageRoute, state) => {
    navigate(pageRoute, { state });
  };

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="dashboard-main-container">
          <div className="left-main-container">
            <div className="current-guest-count cards">
              <h4 className="title">Current Guest Count</h4>
              <div className="count">{currentGuestCount}</div>
            </div>

            <div className="application-details cards">
              <h4 className="title">Application Details</h4>
              <div className="graph-section">
                <div className="graph">
                  {isAllZero ? (
                    <Graph
                      series={[100]}
                      colors={["#0000FF"]}
                      width="180"
                      height="180"
                    />
                  ) : (
                    <>
                      <div className="total-ratio">
                        {statuses.approved}/{totalApplications}
                      </div>
                      <Graph
                        series={series}
                        colors={colors}
                        width="180"
                        height="180"
                      />
                    </>
                  )}
                </div>

                <div className="status-list">
                  <StatusItem
                    color={colors[0]}
                    text="Awaiting"
                    number={statuses.awaiting}
                    onClick={() => navigateToPage('/requests', { activeTab: 'pending' })}
                  />
                  <StatusItem
                    color={colors[1]}
                    text="Approved"
                    number={statuses.approved}
                    onClick={() => navigateToPage('/requests', { activeTab: 'approved' })}
                  />
                  <StatusItem
                    color={colors[2]}
                    text="On Hold"
                    number={statuses.on_hold}
                    onClick={() => navigateToPage('/requests', { activeTab: 'onHold' })}
                  />
                  <StatusItem
                    color={colors[3]}
                    text="Rejected"
                    number={statuses.rejected}
                    onClick={() => navigateToPage('/requests', { activeTab: 'rejected' })}
                  />
                  <StatusItem
                    color={colors[4]}
                    text="Rescheduled"
                    number={statuses.rescheduled}
                    onClick={() => navigateToPage('/requests', { activeTab: 'rescheduled' })}
                  />
                </div>
              </div>
            </div>

            <div className="room-stats-buttons">
              <div className="dropdown-container">
                <button
                  className="dropdown-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Applications
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigateToPage("/welcome")}>
                      Guest House
                    </button>
                    <button
                      onClick={() =>
                        navigateToPage("/dormitory-application-form")
                      }
                    >
                      Dormitory
                    </button>
                  </div>
                )}
              </div>
              <button
                className="standard-button"
                onClick={() => navigateToPage("/book-room-management")}
              >
                Room availability
              </button>
            </div>
          </div>

          <div className="right-main-container">
            <div className="check-in-check-out-main-section">
              <div
                className="check-in cards"
                onClick={() => navigateToPage("/check-in")}
              >
                <ProgressBar
                  title="Check-ins"
                  completed={checkIns}
                  total={totalCheckIns}
                  color={"#A3D65C"}
                  backgroundColor={"#E4F5E3"}
                  label="Checked-in"
                />
              </div>
              <div
                className="check-out cards"
                onClick={() => navigateToPage("/check-out")}
              >
                <ProgressBar
                  title="Check-outs"
                  completed={checkOuts}
                  total={totalCheckOuts}
                  color={"#FC5275"}
                  backgroundColor={"#F9C7C7"}
                  label="Checked-out"
                />
              </div>
            </div>

            <div className="room-seats cards">
              <h4 className="title">Room Stats</h4>
              <div className="room-status-main-section">
                <div className="graph-section-room-status">
                  <div className="graph">
                    <div className="graphs-container">
                      {blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className={`graph-item`}
                          style={{
                            marginLeft: index % 2 === 1 ? "20px" : "0",
                            marginTop: index >= 2 ? "20px" : "0",
                          }}
                        >
                          <Graph
                            series={[
                              blockRoomStats[index]?.available || 0,
                              blockRoomStats[index]?.occupied || 0,
                              blockRoomStats[index]?.blocked || 0,
                              blockRoomStats[index]?.cleaning || 0,
                            ]}
                            colors={roomStatusColors}
                            width="180"
                            height="180"
                            labels={roomStatusLabels}
                          />
                          <span>{block.attributes.block_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="status-list-room-status"
                  style={{ width: "40%" }}
                >
                  {roomStatus.map((item, index) => (
                    <StatusItem
                      key={index}
                      color={item.color}
                      text={item.text}
                      number={blockRoomStats.reduce(
                        (total, stats) =>
                          total + (Object.values(stats)[index] || 0),
                        0
                      )}
                      paddingLeft={40}
                    />
                  ))}

                  <div className="available-rooms-stats">
                    <div className="stats-header">
                      <h4 className="stats-title">Available Rooms</h4>
                      <div className="date-filter-container">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="stats-date-filter"
                        />
                        <svg
                          className="calendar-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
                            stroke="#666666"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.6667 1.33333V4"
                            stroke="#666666"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33333 1.33333V4"
                            stroke="#666666"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 6.66667H14"
                            stroke="#666666"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="rooms-stats-list">
                      {blocks.map((block) => {
                        const availableCount =
                          blockRoomStats[blocks.indexOf(block)]?.available || 0;

                        return (
                          <div key={block.id} className="room-stats-item">
                            <span className="room-stats-name">
                              {block.attributes.block_name}
                            </span>
                            <div className="stats-count-container">
                              <span className="stats-dash">-</span>
                              <span className="stats-room-count">
                                {availableCount.toString().padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
