import React, { useState, useEffect, useRef } from "react"
import "./Donation.scss"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { useNavigate } from "react-router-dom"
import AllDonation from './AllDonation'

const Donation = () => {
  const navigate = useNavigate()
  // Data for the donut chart
  const distributionData = [
    { name: "Math Donation", value: 35.45, color: "#8b5cf6" },
    { name: "Ramakrishna mission", value: 64.55, color: "#f97316" }
  ]

  // Updated monthly data to match the graph
  const monthlyData = [
    { name: 'Jun', amount: 5000 },
    { name: 'Jul', amount: 10000 },
    { name: 'Aug', amount: 32900 },
    { name: 'Sept', amount: 15000 },
    { name: 'Oct', amount: 18000 },
    { name: 'Nov', amount: 12000 },
    { name: 'Dec', amount: 2000 }
  ]

  const leavingGuests = [
    {
      roomNumber: 'GH-101',
      guestName: 'Mr. John Doe',
      arrivalDate: '00/00/0000',
      noOfGuests: 5,
      stayDuration: '3 days',
      donation: 'Not yet donated',
      donationAmount: null,
    },
    {
      roomNumber: 'GH-103',
      guestName: 'Mr. Sophia William',
      arrivalDate: '00/00/0000',
      noOfGuests: 3,
      stayDuration: '5 days',
      donation: 'Not yet donated',
      donationAmount: null,
    },
    {
      roomNumber: 'GH-102',
      guestName: 'Mr. John Doe',
      arrivalDate: '00/00/0000',
      noOfGuests: 2,
      stayDuration: '5 days',
      donation: 'Donated',
      donationAmount: '₹7,750.00',
    },
    // ... add other rows similarly
  ];

  // Add state for tracking which dropdown is open
  const [openActionId, setOpenActionId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Function to handle dropdown toggle
  const toggleDropdown = (index, event) => {
    event.stopPropagation();
    if (openActionId === index) {
      setOpenActionId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: rect.left - 170,
      });
      setOpenActionId(index);
    }
  };

  // Add click handler to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to handle action clicks
  const handleActionClick = (action, guest) => {
    switch(action) {
      case 'notification':
        console.log('Send all notifications for', guest.guestName);
        break;
      case 'whatsapp':
        console.log('Send WhatsApp to', guest.guestName);
        break;
      case 'email':
        console.log('Send email to', guest.guestName);
        break;
      case 'sms':
        console.log('Send SMS to', guest.guestName);
        break;
      case 'call':
        console.log('Call', guest.guestName);
        break;
      default:
        break;
    }
    setOpenActionId(null); // Close dropdown after action
  };

  // Add search state
  const [searchTerm, setSearchTerm] = useState('');

  // Add new state for filter popup
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    receiptNumber: true,
    donorName: true,
    donationDate: true,
    phoneNumber: true,
    donatedFor: true,
    donationStatus: true,
    donationAmount: true,
    action: true
  });

  // Function to handle filter changes
  const handleFilterChange = (field) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Add useRef for the filter dropdown
  const filterDropdownRef = useRef(null);

  // Add effect to handle clicks outside the filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="donation-container">
      <div className="header">
        <h2>Donations</h2>
        <button className="add-donation-btn" onClick={() => navigate('/newDonation')}>
          <span>+</span> Add New Donation
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Distribution Card */}
        <div className="card distribution-card">
          <h3>Donations Distribution</h3>
          <div className="distribution-content">
            <div className="distribution-list">
              <div className="distribution-item">
                <div className="item-dot math"></div>
                <div className="item-details">
                  <span>Math Donation</span>
                  <h4>₹14,907</h4>
                </div>
                <span className="percentage">35.45%</span>
              </div>
              <div className="distribution-item">
                <div className="item-dot mission"></div>
                <div className="item-details">
                  <span>Ramakrishna mission</span>
                  <h4>₹29,660</h4>
                </div>
                <span className="percentage">64.55%</span>
              </div>
            </div>
            <div className="donut-chart">
              <PieChart width={160} height={160}>
                <Pie
                  data={distributionData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>

        {/* Total Donations Card */}
        <div className="card total-donations-card">
          <h3>Total Donations</h3>
          <div className="total-content">
            <div className="left-section">
              <div className="amount">₹44,567</div>
              <div className="growth-indicator">
                <span>+12.02%</span>
                <p>than last month</p>
              </div>
            </div>
            <div className="right-section">
              <LineChart width={400} height={200} data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={{ stroke: '#E5E7EB', strokeDasharray: '5 5' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  ticks={[10000, 20000, 30000, 40000]}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip">
                          <p className="date">3rd August</p>
                          <p className="label">Total Donation</p>
                          <p className="amount">32.9k</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#82ca9d" }}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </div>
          </div>
        </div>
      </div>

      <div className="leaving-guests-section">
        <div className="section-header">
          <h3>Tomorrow's Leaving Guest</h3>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Search in table" />
              <button className="filter-btn" onClick={() => setShowFilterPopup(true)}>
                <span className="material-icons-outlined">tune</span>
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room number</th>
                <th>Guest Name</th>
                <th>Arrival date</th>
                <th>No. of Guests</th>
                <th>Stay Duration</th>
                <th>Donation</th>
                <th>Donation Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leavingGuests.map((guest, index) => (
                <tr key={index}>
                  <td>{guest.roomNumber}</td>
                  <td>{guest.guestName}</td>
                  <td>{guest.arrivalDate}</td>
                  <td>{guest.noOfGuests}</td>
                  <td>{guest.stayDuration}</td>
                  <td>
                    <span className={`donation-status ${guest.donation === 'Donated' ? 'donated' : 'not-donated'}`}>
                      {guest.donation}
                    </span>
                  </td>
                  <td>{guest.donationAmount || '-'}</td>
                  <td className="action-cell">
                    <button 
                      className="action-btn"
                      onClick={(e) => toggleDropdown(index, e)}
                    >
                      <span className="material-icons">more_vert</span>
                    </button>
                    
                    {openActionId === index && (
                      <div 
                        className="action-dropdown"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`
                        }}
                      >
                        <button onClick={() => handleActionClick('notification', guest)}>
                          <span className="material-icons" style={{ color: '#8B5CF6' }}>notifications</span>
                          <span>Send all notifications</span>
                        </button>
                        <button onClick={() => handleActionClick('whatsapp', guest)}>
                          <span className="material-icons" style={{ color: '#25D366' }}>message</span>
                          <span>Send Whatsapp</span>
                        </button>
                        <button onClick={() => handleActionClick('email', guest)}>
                          <span className="material-icons" style={{ color: '#8B5CF6' }}>mail</span>
                          <span>Send an E-mail</span>
                        </button>
                        <button onClick={() => handleActionClick('sms', guest)}>
                          <span className="material-icons" style={{ color: '#8B5CF6' }}>chat</span>
                          <span>Send SMS</span>
                        </button>
                        <button onClick={() => handleActionClick('call', guest)}>
                          <span className="material-icons" style={{ color: '#8B5CF6' }}>phone</span>
                          <span>Call the Guest</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recent-donations-section">
        <div className="section-header">
          <h3>Recent Donations</h3>
          <div className="header-actions">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by name, receipt number, or phone" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="filter-dropdown-container">
                <button 
                  className="filter-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilterPopup(!showFilterPopup);
                  }}
                >
                  <span className="material-icons-outlined">tune</span>
                </button>
                {showFilterPopup && (
                  <div className="filter-dropdown" ref={filterDropdownRef}>
                    <div className="filter-options">
                      {Object.entries(filterOptions).map(([field, checked]) => (
                        <label key={field} className="filter-option">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleFilterChange(field)}
                          />
                          <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                    <div className="filter-actions">
                      <button 
                        className="reset-btn" 
                        onClick={() => setFilterOptions(Object.fromEntries(Object.keys(filterOptions).map(key => [key, true])))}
                      >
                        Reset
                      </button>
                      <button className="apply-btn" onClick={() => setShowFilterPopup(false)}>
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="view-all" onClick={() => navigate('/allDonationDetails')}>View All</button>
          </div>
        </div>
      </div>

      <AllDonation searchTerm={searchTerm} filterOptions={filterOptions} />
    </div>
  )
}

export default Donation