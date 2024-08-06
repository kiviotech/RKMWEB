import React from 'react';
import './Dashboard.scss'; // Import the CSS file
import Graph from '../../../components/ui/graph/Graph';
import StatusItem from '../../../components/ui/graph/StatusItem';
import icons from '../../../constants/icons';
import ProgressBar from '../../../components/ui/progressBar/ProgressBar';
import CommonButton from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const series = [10, 20, 30, 40, 50];
  const colors = ['#FB8951', '#FFD439', '#FC5275', '#A3D65C', '#A463C7'];
  // const labels = ['Approved', 'On hold', 'Rejected', 'Confirmed', 'Awaiting'];
  const roomStatusColors = ['#A463C7', '#F7BC4C', '#FC5275', '#A3D65C'];
  const roomStatusSeries = [10, 20, 30, 40];
  const statuses = [
    { color: '#A463C7', text: 'Awaiting', number: 64 },
    { color: '#FB8951', text: 'Approved', number: 78 },
    { color: '#FFD439', text: 'On hold', number: 34 },
    { color: '#FC5275', text: 'Rejected', number: 65 },
    { color: '#A3D65C', text: 'Confirmed', number: 90 }
  ];
  const roomStatus = [
    { color: '#A463C7', text: 'Available rooms' },
    { color: '#F7BC4C', text: 'Occupied rooms' },
    { color: '#FC5275', text: 'Blocked rooms' },
    { color: '#A3D65C', text: 'Cleaning underway' },
  ];


  const gotoAllocateRoomPage = () => {
    navigate('/allocate-rooms'); // Replace with your actual route path
  }
  return (
    <div className="dashboard-main-container">
      <div className="left-main-container">
        <div className="application-details cards">
          <h4 className='title'>Application Details</h4>
          <div className="count">
            <div className="current-guest-count">
              <strong>0</strong><br />
              <label>Current Guest Count</label>
            </div>
            <div className="total-application-count">
              <strong>331</strong><br />
              <label>Total Applications</label>
            </div>
          </div>

          <div className="graph-section">
            <div className="graph">
              <span>65/331</span>
              <Graph series={series} colors={colors} width="180" height="180" />
            </div>

            <div className="status-list">
              {statuses.map((status, index) => (
                <StatusItem
                  key={index}
                  color={status.color}
                  text={status.text}
                  number={status.number}
                  paddingLeft={40}
                />
              ))}
            </div>
          </div>

        </div>
        <div className="Request cards">
          <h4 className='title'>Requests</h4>
          <div className="request-status">
            <strong>64 pending requests</strong>
          </div>
          <div className="view-all-btn">
            <span>View all <img src={icons.angleRight} alt="angle" loading='lazy' /></span>
          </div>
        </div>
        <div className="allocate-rooms cards">
          <h4 className='title'>Allocate Rooms</h4>
          <div className="request-status">
            <strong>64 pending requests</strong>
          </div>
          <div className="view-all-btn">
            <span>View all <img src={icons.angleRight} alt="angle" loading='lazy' /></span>
          </div>
        </div>
      </div>
      <div className="right-main-container">
        <div className="check-in-check-out-main-section">
          <div className="check-in cards">
            <ProgressBar title="Check-ins" completed={53} total={120} color={'#A3D65C'} backgroundColor={'#E4F5E3'} />
          </div>
          <div className="check-out cards">
            <ProgressBar title="Check-outs" completed={67} total={100} color={'#FC5275'} backgroundColor={'#F9C7C7'} />
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
            <div className="status-list">
              {roomStatus.map((status, index) => (
                <StatusItem
                  key={index}
                  color={status.color}
                  text={status.text}
                />
              ))}
            </div>
          </div>

          <div className="buttons">
            <CommonButton
              buttonName="Applications"
              buttonWidth="auto"
              style={{ backgroundColor: '#9866E9', borderColor: 'none', fontSize: '18px', broderRadius: '16px', borderWidth: 0, padding: '8px 30px' }}
            />
            <CommonButton onClick={gotoAllocateRoomPage}
              buttonName=" Room availability"
              buttonWidth="auto"
              style={{ backgroundColor: '#9866E9', borderColor: '#ffffff', fontSize: '18px', broderRadius: '16px', borderWidth: 0, padding: '8px 30px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
