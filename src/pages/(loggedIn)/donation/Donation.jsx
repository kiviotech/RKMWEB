import React, { useState, useEffect, useRef } from "react"
import "./Donation.scss"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { useNavigate } from "react-router-dom"
import AllDonation from './AllDonation'
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService"
import { fetchDonations } from "../../../../services/src/services/donationsService"

const Donation = () => {
  const navigate = useNavigate()
  // Data for the donut chart
  const [distributionData, setDistributionData] = useState([
    { name: "Math Donation", value: 0, color: "#8b5cf6" },
    { name: "Ramakrishna mission", value: 0, color: "#f97316" }
  ]);

  // Replace static monthlyData with dynamic state
  const [monthlyData, setMonthlyData] = useState([]);

  const [guestData, setGuestData] = useState([]);

  // Add pagination states for both sections
  const [leavingGuestsPage, setLeavingGuestsPage] = useState(1);
  const [leavingGuestsTotalPages, setLeavingGuestsTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Add state for tomorrow's guests search
  const [tomorrowGuestSearchTerm, setTomorrowGuestSearchTerm] = useState('');

  // Add function to filter guest data based on search term
  const getFilteredGuestData = () => {
    return guestData.filter(guest => {
      const searchStr = tomorrowGuestSearchTerm.toLowerCase();
      return (
        guest.roomNumber.toString().toLowerCase().includes(searchStr) ||
        guest.guestName.toLowerCase().includes(searchStr) ||
        guest.arrivalDate.toLowerCase().includes(searchStr) ||
        guest.donation.toLowerCase().includes(searchStr) ||
        (guest.donationAmount && guest.donationAmount.toLowerCase().includes(searchStr))
      );
    });
  };

  // Update getPaginatedGuestData to use filtered data
  const getPaginatedGuestData = () => {
    const filteredData = getFilteredGuestData();
    const startIndex = (leavingGuestsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Update useEffect to set total pages based on filtered data
  useEffect(() => {
    const filteredData = getFilteredGuestData();
    setLeavingGuestsTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [guestData, tomorrowGuestSearchTerm]); // Add dependencies

  useEffect(() => {
    const getGuestDetails = async () => {
      try {
        const response = await fetchGuestDetails();
        // Transform the data to match the table structure
        const formattedData = response.data.map(guest => ({
          roomNumber: guest.attributes.room?.data?.attributes?.room_number || '-',
          guestName: `Mr. ${guest.attributes.name}`,
          arrivalDate: new Date(guest.attributes.createdAt).toLocaleDateString(),
          noOfGuests: 1, // You might want to get this from somewhere specific
          stayDuration: '3 days', // Calculate this based on your data
          donation: guest.attributes.donations?.data?.length > 0 ? 'Donated' : 'Not yet donated',
          donationAmount: guest.attributes.donations?.data?.length > 0 
            ? `₹${guest.attributes.donations.data[0]?.attributes?.amount?.toLocaleString('en-IN') || 0}`
            : null,
        }));
        
        console.log("Tomorrow's Leaving Guest Data:", formattedData);
        
        setGuestData(formattedData);
        setLeavingGuestsTotalPages(Math.ceil(formattedData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching guest details:", error);
      }
    };

    getGuestDetails();
  }, []);

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

  // Add new state for tomorrow's guests filter popup and options
  const [showTomorrowFilterPopup, setShowTomorrowFilterPopup] = useState(false);
  const [tomorrowFilterOptions, setTomorrowFilterOptions] = useState({
    roomNumber: true,
    guestName: true,
    arrivalDate: true,
    noOfGuests: true,
    stayDuration: true,
    donation: true,
    donationAmount: true,
    action: true
  });

  // Add ref for tomorrow's filter dropdown
  const tomorrowFilterDropdownRef = useRef(null);

  // Function to handle tomorrow's filter changes
  const handleTomorrowFilterChange = (field) => {
    setTomorrowFilterOptions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Add effect to handle clicks outside tomorrow's filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tomorrowFilterDropdownRef.current && !tomorrowFilterDropdownRef.current.contains(event.target)) {
        setShowTomorrowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update the Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="pagination">
        <button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          
          // Always show first page, last page, current page, and pages around current page
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            );
          }
          
          // Show ellipsis for skipped pages
          if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return <span key={pageNumber} className="ellipsis">...</span>;
          }
          
          return null;
        })}
        
        <button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  // Add new state variables
  const [totalDonation, setTotalDonation] = useState(0);
  const [mathDonation, setMathDonation] = useState(0);
  const [missionDonation, setMissionDonation] = useState(0);

  // Add this new state for growth percentage
  const [growthPercentage, setGrowthPercentage] = useState(0);

  // Update the useEffect for fetching donations
  useEffect(() => {
    const getAllDonations = async () => {
      try {
        const response = await fetchDonations();
        const donations = response.data;

        // Process donations for monthly data
        const monthlyTotals = donations.reduce((acc, donation) => {
          // Only include active/completed donations
          if (donation.attributes.status !== 'cancelled') {
            const date = new Date(donation.attributes.createdAt);
            const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
            const amount = parseFloat(donation.attributes.donationAmount) || 0;

            if (!acc[monthYear]) {
              acc[monthYear] = 0;
            }
            acc[monthYear] += amount;
          }
          return acc;
        }, {});

        // Convert to array and ensure we have data for the last 7 months
        const today = new Date();
        const last7Months = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        }).reverse();

        const sortedMonthlyData = last7Months.map(monthYear => ({
          name: monthYear,
          amount: monthlyTotals[monthYear] || 0
        }));

        setMonthlyData(sortedMonthlyData);

        // Calculate growth percentage using the last two months
        if (sortedMonthlyData.length >= 2) {
          const currentMonth = sortedMonthlyData[sortedMonthlyData.length - 1].amount;
          const previousMonth = sortedMonthlyData[sortedMonthlyData.length - 2].amount;
          const growth = previousMonth !== 0 
            ? ((currentMonth - previousMonth) / previousMonth) * 100
            : 0;
          setGrowthPercentage(growth);
        }

        // Calculate totals
        const totals = donations.reduce((acc, donation) => {
          const amount = parseFloat(donation.attributes.donationAmount) || 0;
          
          // Only count active/completed donations (not cancelled)
          if (donation.attributes.status !== 'cancelled') {
            acc.total += amount;
            
            if (donation.attributes.donationFor === 'Math') {
              acc.math += amount;
            } else if (donation.attributes.donationFor === 'Mission') {
              acc.mission += amount;
            }
          }
          
          return acc;
        }, { total: 0, math: 0, mission: 0 });

        setTotalDonation(totals.total);
        setMathDonation(totals.math);
        setMissionDonation(totals.mission);

        // Calculate percentages for the distribution chart
        const mathPercentage = (totals.math / totals.total) * 100;
        const missionPercentage = (totals.mission / totals.total) * 100;

        // Update the distribution data
        setDistributionData([
          { name: "Math Donation", value: mathPercentage, color: "#8b5cf6" },
          { name: "Ramakrishna mission", value: missionPercentage, color: "#f97316" }
        ]);

      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    getAllDonations();
  }, []);

  // Function to calculate percentages
  const calculatePercentages = (math, mission) => {
    const total = math + mission;
    if (total === 0) return [0, 0];
    
    const mathPercentage = (math / total) * 100;
    const missionPercentage = (mission / total) * 100;
    
    return [
      mathPercentage.toFixed(2),
      missionPercentage.toFixed(2)
    ];
  };

  const [mathPercent, missionPercent] = calculatePercentages(mathDonation, missionDonation);

  // Calculate dynamic Y-axis ticks based on the maximum donation amount
  const maxDonationAmount = Math.max(...monthlyData.map(data => data.amount));
  const yAxisTicks = Array.from({ length: 5 }, (_, i) => (maxDonationAmount / 4) * i);

  // Function to handle print receipt action
  const handlePrintReceipt = (donation) => {
    console.log('Print Receipt for:', donation);
  };

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
                  <h4>₹{mathDonation.toLocaleString('en-IN')}</h4>
                </div>
                <span className="percentage">{mathPercent}%</span>
              </div>
              <div className="distribution-item">
                <div className="item-dot mission"></div>
                <div className="item-details">
                  <span>Ramakrishna mission</span>
                  <h4>₹{missionDonation.toLocaleString('en-IN')}</h4>
                </div>
                <span className="percentage">{missionPercent}%</span>
              </div>
            </div>
            <div className="donut-chart">
              <PieChart width={250} height={250}>
                <Pie
                  data={distributionData}
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          padding: '12px',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(8px)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: 'translateY(-4px)',
                          opacity: active ? '1' : '0',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: payload[0].payload.color,
                              marginRight: '8px',
                              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              transform: 'scale(1.2)',
                            }} />
                            <span style={{
                              color: '#1F2937',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'opacity 0.2s ease-in-out',
                            }}>
                              {payload[0].payload.name}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827',
                            transition: 'transform 0.3s ease',
                            transform: 'translateX(0)',
                          }}>
                            {`${payload[0].value.toFixed(2)}%`}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Total Donations Card */}
        <div className="card total-donations-card">
          <h3>Total Donations</h3>
          <div className="total-content">
            <div className="left-section">
              <div className="amount">₹{totalDonation.toLocaleString('en-IN')}</div>
              <div className="growth-indicator">
                <span className={growthPercentage >= 0 ? 'positive' : 'negative'}>
                  {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(2)}%
                </span>
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
                  ticks={yAxisTicks}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '10px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                        }}>
                          <p style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#333',
                          }}>{data.name}</p>
                          <p style={{
                            margin: '5px 0 0',
                            fontSize: '12px',
                            color: '#666',
                          }}>Total Donation</p>
                          <p style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#111',
                          }}>₹{(data.amount).toLocaleString('en-IN')}</p>
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
              <input 
                type="text" 
                placeholder="Search in table" 
                value={tomorrowGuestSearchTerm}
                onChange={(e) => setTomorrowGuestSearchTerm(e.target.value)}
              />
              <div className="filter-dropdown-container">
                <button 
                  className="filter-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTomorrowFilterPopup(!showTomorrowFilterPopup);
                  }}
                >
                  <span className="material-icons-outlined">tune</span>
                </button>
                {showTomorrowFilterPopup && (
                  <div className="filter-dropdown" ref={tomorrowFilterDropdownRef}>
                    <div className="filter-options">
                      {Object.entries(tomorrowFilterOptions).map(([field, checked]) => (
                        <label key={field} className="filter-option">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleTomorrowFilterChange(field)}
                          />
                          <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                    <div className="filter-actions">
                      <button 
                        className="reset-btn" 
                        onClick={() => setTomorrowFilterOptions(Object.fromEntries(Object.keys(tomorrowFilterOptions).map(key => [key, true])))}
                      >
                        Reset
                      </button>
                      <button className="apply-btn" onClick={() => setShowTomorrowFilterPopup(false)}>
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {tomorrowFilterOptions.roomNumber && <th>Room number</th>}
                {tomorrowFilterOptions.guestName && <th>Guest Name</th>}
                {tomorrowFilterOptions.arrivalDate && <th>Arrival date</th>}
                {tomorrowFilterOptions.noOfGuests && <th>No. of Guests</th>}
                {tomorrowFilterOptions.stayDuration && <th>Stay Duration</th>}
                {tomorrowFilterOptions.donation && <th>Donation</th>}
                {tomorrowFilterOptions.donationAmount && <th>Donation Amount</th>}
                {tomorrowFilterOptions.action && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {getPaginatedGuestData().map((guest, index) => (
                <tr key={index}>
                  {tomorrowFilterOptions.roomNumber && <td>{guest.roomNumber}</td>}
                  {tomorrowFilterOptions.guestName && <td>{guest.guestName}</td>}
                  {tomorrowFilterOptions.arrivalDate && <td>{guest.arrivalDate}</td>}
                  {tomorrowFilterOptions.noOfGuests && <td>{guest.noOfGuests}</td>}
                  {tomorrowFilterOptions.stayDuration && <td>{guest.stayDuration}</td>}
                  {tomorrowFilterOptions.donation && (
                    <td>
                      <span className={`donation-status ${guest.donation === 'Donated' ? 'donated' : 'not-donated'}`}>
                        {guest.donation}
                      </span>
                    </td>
                  )}
                  {tomorrowFilterOptions.donationAmount && <td>{guest.donationAmount || '-'}</td>}
                  {tomorrowFilterOptions.action && (
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
                          <button onClick={() => handlePrintReceipt(guest)}>
                            <span className="material-icons" style={{ color: '#8B5CF6' }}>print</span>
                            <span>Print Receipt</span>
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-wrapper">
            <Pagination
              currentPage={leavingGuestsPage}
              totalPages={leavingGuestsTotalPages}
              onPageChange={setLeavingGuestsPage}
            />
          </div>
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

      <AllDonation 
        searchTerm={searchTerm} 
        filterOptions={filterOptions}
        itemsPerPage={10}
        currentPage={1}
        setTotalPages={(total) => {/* handle total pages if needed */}}
      />
    </div>
  )
}

export default Donation