import React, { useState } from 'react';
import './AllocateRoom.scss';
import icons from '../../../constants/icons';

const initialRooms = Array.from({ length: 36 }, (_, i) => ({
    id: i + 1,
    roomNumber: (Math.floor(i / 3) + 1).toString(),
    booked: false,
    bedNo: i % 3 + 1,
    userDetails: {
        name: `User ${i + 1}`,
        age: 30 + (i % 10),
        gender: i % 2 === 0 ? 'M' : 'F',
        occupation: `Occupation ${i + 1}`,
        email: `user${i + 1}@example.com`,
        arrivalDate: `01/01/2024`,
        departureDate: `01/10/2024`,
        guestMembers: [
            { name: `Mrs. User ${i + 1}`, age: 30 + (i % 10) + 1, gender: 'F', relation: 'Wife' },
            { name: `Mrs. User ${i + 1}`, age: 5, gender: 'F', relation: 'Daughter' }
        ]
    }
}));

const AllocateRoom = () => {
    const [rooms, setRooms] = useState(initialRooms);
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [activeTab, setActiveTab] = useState('Guest House 1');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [activeFloor, setActiveFloor] = useState('All Floors');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedDay, setSelectedDay] = useState(23);
    const [selectedMonth, setSelectedMonth] = useState('Jul');
    const handleMouseEnter = (roomIndex, bedIndex) => {
        setHoveredRoom({ roomIndex, bedIndex });
    };

    const handleMouseLeave = () => {
        setHoveredRoom(null);
    };

    const handleBedClick = (roomIndex, bedIndex) => {
        setRooms(prevRooms =>
            prevRooms.map((room, i) =>
                i === roomIndex * 3 + bedIndex
                    ? { ...room, booked: !room.booked }
                    : room
            )
        );
        setSelectedRoom(rooms[roomIndex * 3 + bedIndex]);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleFloorClick = (floor) => {
        setActiveFloor(floor);
    };

    const handleYearChange = (direction) => {
        setSelectedYear(prevYear => prevYear + direction);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleMonthClick = (day) => {
        setSelectedMonth(day);
    };


    return (
        <div className="allocate-room-container">
            <div className="allocate-room">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'Guest House 1' ? 'active' : ''}`}
                        onClick={() => handleTabClick('Guest House 1')}
                    >
                        Guest House 1
                    </button>
                    <button
                        className={`tab ${activeTab === 'Guest House 2' ? 'active' : ''}`}
                        onClick={() => handleTabClick('Guest House 2')}
                    >
                        Guest House 2
                    </button>
                </div>
                <div className="book-room-main-section">
                    <div className="floors">
                        <label>Floors</label>
                        <button
                            className={`first floor-button ${activeFloor === 'All Floors' ? 'active' : ''}`}
                            onClick={() => handleFloorClick('All Floors')}
                        >
                            All Floors
                        </button>
                        <button
                            className={`floor-button ${activeFloor === 'Floor 1' ? 'active' : ''}`}
                            onClick={() => handleFloorClick('Floor 1')}
                        >
                            Floor 1
                        </button>
                        <button
                            className={`floor-button ${activeFloor === 'Floor 2' ? 'active' : ''}`}
                            onClick={() => handleFloorClick('Floor 2')}
                        >
                            Floor 2
                        </button>
                        <button
                            className={`last floor-button ${activeFloor === 'Floor 3' ? 'active' : ''}`}
                            onClick={() => handleFloorClick('Floor 3')}
                        >
                            Floor 3
                        </button>
                    </div>

                    <div className="months-section">
                        <div className="year-selector">
                            <span>{selectedYear}</span>
                            <button className="year-button" onClick={() => handleYearChange(-1)}>
                                <img src={icons.angleLeft} alt="Previous Year" />
                            </button>
                            <button className="year-button angle-right" onClick={() => handleYearChange(1)}>
                                <img src={icons.angleLeft} alt="Next Year" />
                            </button>
                        </div>
                        <div className='months'>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <div key={month} className={`month ${month === selectedMonth ? 'active' : ''}`} onClick={() => handleMonthClick(month)}>
                                    {month}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="days">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <div
                                key={day}
                                className={`day ${day === selectedDay ? 'active' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <h3 className='room-type-title'>Room Type</h3>
                    <div className="room-types">
                        {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="room-type">
                                <div className="room-type-header">Gh-{i + 1}</div>
                                <div className="rooms">
                                    {Array.from({ length: 3 }, (_, j) => {
                                        const room = rooms[i * 3 + j];
                                        return (
                                            <div
                                                key={j}
                                                className="bed-icon-container"
                                                onMouseEnter={() => handleMouseEnter(i, j)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => handleBedClick(i, j)}
                                            >
                                                <img src={room.booked ? icons.bookedBed : icons.bed} alt="bed" />
                                                {hoveredRoom && hoveredRoom.roomIndex === i && hoveredRoom.bedIndex === j && (
                                                    <div className="tooltip">
                                                        <img src={icons.tooltip} alt="avatar" className="avatar" />
                                                        <div className="tooltip-content">
                                                            <img src={icons.user} alt="avatar" className="avatar" />
                                                            <div className="tooltip-text">
                                                                <strong>{room.userDetails.name}</strong>
                                                                <p>Room {room.roomNumber} - Bed {room.bedNo}</p>
                                                                <a href="#" className="view-more">View more <img src={icons.angleRight} alt="" /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedRoom && (
                <div className="user-details">
                    <div className="user-details-card">
                        <div className="user-image">
                            <img src={icons.userDummyImage} alt="avatar" className="user-avatar" />
                        </div>
                        <h2 style={{ textAlign: 'center' }}>{selectedRoom.userDetails.name}</h2>
                        <div className="age-gender">
                            <p>Age: <span>{selectedRoom.userDetails.age}</span></p>
                            <p>Gender: <span>{selectedRoom.userDetails.gender}</span></p>
                        </div>
                        <p>Occupation: <span>{selectedRoom.userDetails.occupation}</span></p>
                        <p>Email: <span>{selectedRoom.userDetails.email}</span></p>
                        <p>Arrival Date: <span>{selectedRoom.userDetails.arrivalDate}</span></p>
                        <p>Departure Date: <span>{selectedRoom.userDetails.departureDate}</span></p>
                        <h3>Guest Members:</h3>
                        {selectedRoom.userDetails.guestMembers.map((member, index) => (
                            <div style={{ display: 'flex', flexDirection: 'column' }} key={index}>
                                <div className="guest-member-details" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="member-guest-image">
                                        <img src={icons.dummyUser} alt="" />
                                        <strong>{member.name}</strong>
                                    </div>
                                    <div className="age-gender-relation">
                                        {member.age} {member.gender}, {member.relation}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllocateRoom;
