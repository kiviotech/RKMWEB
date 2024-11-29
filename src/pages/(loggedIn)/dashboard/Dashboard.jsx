import React, { useEffect, useState } from "react";
import "./Dashboard.scss"; // Import the CSS file
import Graph from "../../../components/ui/graph/Graph";
import StatusItem from "../../../components/ui/graph/StatusItem";
import icons from "../../../constants/icons";
import ProgressBar from "../../../components/ui/progressBar/ProgressBar";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";

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

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await fetchBookingRequests();
        if (!response?.data) {
          console.error("No data received from API");
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
        console.error("Error fetching application data:", error);
      }
    };

    fetchApplicationData();
  }, []);

  const series = [
    statuses.awaiting,
    statuses.approved,
    statuses.on_hold,
    statuses.rejected,
    statuses.rescheduled,
  ];
  const colors = ["#FFD439", "#FB8951", "#FC5275", "#A3D65C", "#A463C7"];
  const roomStatusColors = ["#A463C7", "#F7BC4C", "#FC5275", "#A3D65C"];
  const roomStatusSeries = [10, 20, 30, 40];

  const isAllZero = series.every((value) => value === 0);

  const roomStatus = [
    { color: "#A463C7", text: "Available rooms" },
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
        <div className="application-details cards">
          <h4 className="title">Application Details</h4>
          <div className="count">
            <div className="current-guest-count">
              {/* <strong>{currentGuestCount}</strong> */}
              <br />
              <label>Current Guest Count</label>
            </div>
            <div className="total-application-count">
              <strong>{totalApplications}</strong>
              <br />
              <label>Total Applications</label>
            </div>
          </div>

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
                  <span>
                    {statuses.approved}/{totalApplications}
                  </span>
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
              {Object.entries(statuses).map(([status, count], index) => (
                <StatusItem
                  key={index}
                  color={colors[index]}
                  text={status}
                  number={count}
                  paddingLeft={40}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="Request cards"
          onClick={() => navigateToPage("/Requests")}
        >
          <h4 className="title">Requests</h4>
          <div className="request-status">
            <strong>{statuses.awaiting} pending requests</strong>
          </div>
          <div className="view-all-btn">
            <span>
              View all <img src={icons.angleRight} alt="angle" loading="lazy" />
            </span>
          </div>
        </div>

        <div
          className="allocate-rooms cards"
          onClick={() => navigateToPage("/allocate-rooms")}
        >
          <h4 className="title">Allocate Rooms</h4>
          <div className="request-status">
            <strong>{statuses.approved} Approved requests</strong>
          </div>
          <div className="view-all-btn">
            <span>
              View all <img src={icons.angleRight} alt="angle" loading="lazy" />
            </span>
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
                  <div className="graph-one">
                    <Graph
                      series={roomStatusSeries}
                      colors={roomStatusColors}
                      width="180"
                      height="180"
                    />
                    <span>Guest House 1</span>
                  </div>
                  <div className="graph-two" style={{ marginTop: "20px" }}>
                    <Graph
                      series={roomStatusSeries}
                      colors={roomStatusColors}
                      width="180"
                      height="180"
                    />
                    <span>Guest House 3</span>
                  </div>
                </div>

                <div>
                  <div className="graph-three" style={{ marginLeft: "20px" }}>
                    <Graph
                      series={roomStatusSeries}
                      colors={roomStatusColors}
                      width="180"
                      height="180"
                    />
                    <span>Guest House 2</span>
                  </div>
                  <div
                    className="graph-four"
                    style={{ marginTop: "20px", marginLeft: "20px" }}
                  >
                    <Graph
                      series={roomStatusSeries}
                      colors={roomStatusColors}
                      width="180"
                      height="180"
                    />
                    <span>Guest House 4</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="status-list-room-status">
              {roomStatus.map((item, index) => (
                <StatusItem
                  key={index}
                  color={item.color}
                  text={item.text}
                  paddingLeft={40}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
