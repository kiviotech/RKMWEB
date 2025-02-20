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
  const [blocks, setBlocks] = useState([]);
  const [blockRoomStats, setBlockRoomStats] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch and log blocks data with rooms
        const blocksWithRoomsResponse = await fetchBlocksWithRooms();
        console.log("Blocks with rooms data:", blocksWithRoomsResponse);
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

        // Existing booking requests fetch
        const response = await fetchBookingRequests();
        if (!response?.data) {
          // console.error("No data received from API");
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
        let checkInCount = 0;
        let checkOutCount = 0;

        bookingData.forEach((booking) => {
          const status = booking.attributes?.status;
          if (status && status in statusCount) {
            statusCount[status]++;
          }

          guestCount += booking.attributes?.number_of_guest_members || 0;

          if (status === "approved") {
            checkInCount++;
          }
          // Removed duplicate check for approved status
        });

        setStatuses(statusCount);
        setTotalApplications(bookingData.length);
        setCurrentGuestCount(guestCount);
        setCheckIns(checkInCount);
        setCheckOuts(checkOutCount);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const navigateToPage = (pageRoute) => {
    navigate(pageRoute);
  };

  return (
    <div className="dashboard-main-container">
      <div className="left-main-container">
        <div className="current-guest-count cards">
          <h4 className="title">Current Guest Count</h4>
          <div className="count">9</div>
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
              />
              <StatusItem
                color={colors[1]}
                text="Approved"
                number={statuses.approved}
              />
              <StatusItem
                color={colors[2]}
                text="On hold"
                number={statuses.on_hold}
              />
              <StatusItem
                color={colors[3]}
                text="Rejected"
                number={statuses.rejected}
              />
              <StatusItem
                color={colors[4]}
                text="Confirmed"
                number={statuses.rescheduled}
              />
            </div>
          </div>
        </div>

        <div className="available-rooms cards">
          <div className="section-header">
            <h4>Available Rooms</h4>
            <div className="date-input-container">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-filter"
                placeholder="dd-mm-yyyy"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2V5"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 9.09H20.5"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.6947 13.7H15.7037"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.6947 16.7H15.7037"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9955 13.7H12.0045"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9955 16.7H12.0045"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 13.7H8.30329"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 16.7H8.30329"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="rooms-list">
            {blocks.map((block) => {
              const availableCount =
                blockRoomStats[blocks.indexOf(block)]?.available || 0;

              return (
                <div key={block.id} className="room-item">
                  <span className="room-name">
                    {block.attributes.block_name}
                  </span>
                  <div className="count-container">
                    <span className="dash">-</span>
                    <span className="room-count">
                      {availableCount.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
              total={statuses.approved || 1}
              color={"#A3D65C"}
              backgroundColor={"#E4F5E3"}
            />
          </div>
          <div
            className="check-out cards"
            onClick={() => navigateToPage("/check-out")}
          >
            <ProgressBar
              title="Check-outs"
              completed={checkOuts}
              total={statuses.approved || 1}
              color={"#FC5275"}
              backgroundColor={"#F9C7C7"}
            />
          </div>
        </div>

        <div className="room-seats cards">
          <h4 className="title">Room Stats</h4>
          <div className="room-status-main-section">
            <div className="graph-section-room-status">
              <div className="graph">
                <div>
                  {blocks[0] && (
                    <div className="graph-one">
                      <Graph
                        series={[
                          blockRoomStats[0]?.available || 0,
                          blockRoomStats[0]?.occupied || 0,
                          blockRoomStats[0]?.blocked || 0,
                          blockRoomStats[0]?.cleaning || 0,
                        ]}
                        colors={roomStatusColors}
                        width="180"
                        height="180"
                      />
                      <span>{blocks[0].attributes.block_name}</span>
                    </div>
                  )}
                  {blocks[2] && (
                    <div className="graph-two" style={{ marginTop: "20px" }}>
                      <Graph
                        series={[
                          blockRoomStats[2]?.available || 0,
                          blockRoomStats[2]?.occupied || 0,
                          blockRoomStats[2]?.blocked || 0,
                          blockRoomStats[2]?.cleaning || 0,
                        ]}
                        colors={roomStatusColors}
                        width="180"
                        height="180"
                      />
                      <span>{blocks[2].attributes.block_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  {blocks[1] && (
                    <div className="graph-three" style={{ marginLeft: "20px" }}>
                      <Graph
                        series={[
                          blockRoomStats[1]?.available || 0,
                          blockRoomStats[1]?.occupied || 0,
                          blockRoomStats[1]?.blocked || 0,
                          blockRoomStats[1]?.cleaning || 0,
                        ]}
                        colors={roomStatusColors}
                        width="180"
                        height="180"
                      />
                      <span>{blocks[1].attributes.block_name}</span>
                    </div>
                  )}
                  {blocks[3] && (
                    <div
                      className="graph-four"
                      style={{ marginTop: "20px", marginLeft: "20px" }}
                    >
                      <Graph
                        series={[
                          blockRoomStats[3]?.available || 0,
                          blockRoomStats[3]?.occupied || 0,
                          blockRoomStats[3]?.blocked || 0,
                          blockRoomStats[3]?.cleaning || 0,
                        ]}
                        colors={roomStatusColors}
                        width="180"
                        height="180"
                      />
                      <span>{blocks[3].attributes.block_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="status-list-room-status">
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
                  <button onClick={() => navigateToPage("/guest-house")}>
                    Guest House
                  </button>
                  <button onClick={() => navigateToPage("/dormitory")}>
                    Dormitory
                  </button>
                </div>
              )}
            </div>
            <button
              className="standard-button"
              onClick={() => navigateToPage("/room-availability")}
            >
              Room availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
