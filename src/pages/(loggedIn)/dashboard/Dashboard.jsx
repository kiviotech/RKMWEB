import React, { useEffect, useState } from 'react';
import './Dashboard.scss'; // Import the CSS file
import Graph from '../../../components/ui/graph/Graph';
import StatusItem from '../../../components/ui/graph/StatusItem';
import icons from '../../../constants/icons';
import ProgressBar from '../../../components/ui/progressBar/ProgressBar';
import CommonButton from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalApplications, setTotalApplications] = useState(0);
  const [currentGuestCount, setCurrentGuestCount] = useState(0);
  const [statuses, setStatuses] = useState({
    Awaiting: 0,
    Approved: 0,
    OnHold: 0,
    Rejected: 0,
    Confirmed: 0,
  });
  const [checkIns, setCheckIns] = useState(0);   // For storing dynamic check-in data
  const [totalCheckIns, setTotalCheckIns] = useState(0); // Total check-ins capacity (can be dynamic too)
  const [checkOuts, setCheckOuts] = useState(100);  // For storing dynamic check-out data
  const [totalCheckOuts, setTotalCheckOuts] = useState(100); // Total check-outs capacity (can be dynamic too)
  useEffect(() => {
    // Fetching booking and application details
    const fetchApplicationData = async () => {
      try {
        const response = await fetchBookingRequests();
        const bookingData = response.data;
  
        // Initialize counters
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
  
        // Iterate over booking data
        for (const booking of bookingData) {
          const status = booking.attributes?.status;
  
          // Update status counts based on the booking status
          if (status in statusCount) {
            statusCount[status]++;
          }
  
          // Update guest count
          guestCount += booking.attributes?.number_of_guest_members || 0;
  
          // Update check-in/check-out counts based on status
          if (status === 'approved') {
            checkInCount++;
          } else if (status === 'approved') {
            checkOutCount++;
          }
        }
   
        // Update state based on derived data
        setStatuses(statusCount);
        setTotalApplications(bookingData.length);
        setCurrentGuestCount(guestCount);
        setCheckIns(checkInCount);
        setCheckOuts(checkOutCount);
      } catch (error) {
        console.error('Error fetching application data:', error);
      }
    };
  
    // Fetch all data on component mount
    fetchApplicationData();
  }, []);
  


  const series = [statuses.awaiting, statuses.approved, statuses.on_hold, statuses.rejected, statuses.rescheduled];
  const colors = [ '#FFD439','#FB8951', '#FC5275', '#A3D65C', '#A463C7'];
  const roomStatusColors = ['#A463C7', '#F7BC4C', '#FC5275', '#A3D65C'];
  const roomStatusSeries = [10, 20, 30, 40];

  const isAllZero = series.every(value => value === 0);

  const roomStatus = [
    { color: '#A463C7', text: 'Available rooms' },
    { color: '#F7BC4C', text: 'Occupied rooms' },
    { color: '#FC5275', text: 'Blocked rooms' },
    { color: '#A3D65C', text: 'Cleaning underway' },
  ];

  const navigateToPage = (pageRoute) => {
    navigate(pageRoute); // Replace with your actual route path
  };

  return (
    <div className="dashboard-main-container">
      <div className="left-main-container">
        <div className="application-details cards">
          <h4 className='title'>Application Details</h4>
          <div className="count">
            <div className="current-guest-count">
              <strong>{currentGuestCount}</strong><br />
              <label>Current Guest Count</label>
            </div>
            <div className="total-application-count">
              <strong>{totalApplications}</strong><br />
              <label>Total Applications</label>
            </div>
          </div>

          <div className="graph-section">
            <div className="graph">
              {isAllZero ? (
                <Graph series={[0]} colors={['#0000FF']} width="180" height="180" /> // Graph with blue color when there are no requests
              ) : (
                <>
                  <span>{statuses.approved}/{totalApplications}</span>
                  <Graph series={series} colors={colors} width="180" height="180" />
                  </>
              )}
            </div>

            <div className="status-list">
              {Object.keys(statuses).map((status, index) => (
                <StatusItem
                  key={index}
                  color={colors[index]}
                  text={status}
                  number={statuses[status]}
                  paddingLeft={40}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="Request cards" onClick={() => navigateToPage('/Requests')}>
          <h4 className='title'>Requests</h4>
          <div className="request-status">
            <strong>{statuses.awaiting} pending requests</strong>
          </div>
          <div className="view-all-btn">
            <span>View all <img src={icons.angleRight} alt="angle" loading='lazy' /></span>
          </div>
        </div>

        <div className="allocate-rooms cards" onClick={() => navigateToPage('/allocate-rooms')}>
          <h4 className='title'>Allocate Rooms</h4>
          <div className="request-status">
            <strong>{statuses.approved} Approved requests</strong>
          </div>
          <div className="view-all-btn">
            <span>View all <img src={icons.angleRight} alt="angle" loading='lazy' /></span>
          </div>
        </div>
      </div>

      <div className="right-main-container">
        <div className="check-in-check-out-main-section">
          <div className="check-in cards" onClick={() => navigateToPage('/check-in')}>
            <ProgressBar title="Check-ins" completed={checkIns} total={statuses.approved} color={'#A3D65C'} backgroundColor={'#E4F5E3'} />
          </div>
          <div className="check-out cards" onClick={() => navigateToPage('/check-out')}>
            <ProgressBar title="Check-outs" completed={checkOuts} total={statuses.approved} color={'#FC5275'} backgroundColor={'#F9C7C7'} />
          </div>
        </div>

        <div className="room-seats cards">
          <h4 className='title'>Room Stats</h4>
          <div className="room-status-main-section">
            <div className="graph-section-room-status">
              <div className="graph">
                <div>
                  <div className="graph-one">
                    <Graph series={roomStatusSeries} colors={roomStatusColors} width="180" height="180" />
                    <span>Guest House 1</span>
                  </div>
                  <div className="graph-two" style={{ marginTop: '20px' }}>
                    <Graph series={roomStatusSeries} colors={roomStatusColors} width="180" height="180" />
                    <span>Guest House 3</span>
                  </div>
                </div>

                <div>
                  <div className="graph-three" style={{ marginLeft: '20px' }}>
                    <Graph series={roomStatusSeries} colors={roomStatusColors} width="180" height="180" />
                    <span>Guest House 2</span>
                  </div>
                  <div className="graph-four" style={{ marginTop: '20px', marginLeft: '20px' }}>
                    <Graph series={roomStatusSeries} colors={roomStatusColors} width="180" height="180" />
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
