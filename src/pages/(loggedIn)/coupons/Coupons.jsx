import React, { useState, useRef, useEffect } from 'react';
import './Coupons.scss';

const Coupons = () => {
  const tableData = [
    {
      guestName: 'Sri. John Doe',
      bookingId: '#000000',
      roomNumbers: 'GH-01',
      numberOfMembers: 3,
      couponsIssued: 3,
      checkInStatus: 'Checked-In',
      action: 'Re-issue'
    },
    {
      guestName: 'Smt. Padma',
      bookingId: '#000000',
      roomNumbers: 'GH-02',
      numberOfMembers: 2,
      couponsIssued: 0,
      checkInStatus: 'Pending',
      action: 'Check-In'
    },
    {
      guestName: 'Sri. John Doe',
      bookingId: '#000000',
      roomNumbers: 'F-102',
      numberOfMembers: 13,
      couponsIssued: 12,
      checkInStatus: 'Checked-In',
      action: 'Re-issue'
    },
    {
      guestName: 'Smt. Padma',
      bookingId: '#000000',
      roomNumbers: 'YN-02',
      numberOfMembers: 2,
      couponsIssued: 0,
      checkInStatus: 'Checked-In',
      action: 'Issue'
    },
    {
      guestName: 'Sri. John Doe',
      bookingId: '#000000',
      roomNumbers: 'GH-23',
      numberOfMembers: 4,
      couponsIssued: 4,
      checkInStatus: 'Checked-In',
      action: 'Re-issue'
    },
    {
      guestName: 'External Members',
      bookingId: '-',
      roomNumbers: '-',
      numberOfMembers: 20,
      couponsIssued: 0,
      checkInStatus: '-',
      action: 'Issue'
    },
    {
      guestName: 'Workers',
      bookingId: '-',
      roomNumbers: '-',
      numberOfMembers: 6,
      couponsIssued: 6,
      checkInStatus: '-',
      action: 'Re-issue'
    },
    {
      guestName: 'Group A',
      bookingId: '-',
      roomNumbers: '-',
      numberOfMembers: 30,
      couponsIssued: 10,
      checkInStatus: '-',
      action: 'Issue'
    }
  ];

  // Replace searchTerm state with dateFilter
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  // Add new states for search and filter
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    guestName: true,
    bookingId: true,
    roomNumbers: true,
    numberOfMembers: true,
    couponsIssued: true,
    checkInStatus: true,
    action: true
  });

  // Add ref for filter dropdown
  const filterDropdownRef = useRef(null);

  // Function to handle filter changes
  const handleFilterChange = (field) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Add effect to handle clicks outside filter dropdown
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

  // Add new state for popup
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntryForm, setManualEntryForm] = useState({
    name: '',
    members: '',
    coupons: '',
    foodCategory: 'VIP'
  });

  // Add handler for form submission
  const handleManualEntrySubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    setShowManualEntry(false);
    setManualEntryForm({
      name: '',
      members: '',
      coupons: '',
      foodCategory: 'VIP'
    });
  };

  // Add new state for check-in modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    name: '',
    members: '',
    roomNumber: '',
    coupons: '',
    foodCategory: 'VIP'
  });

  // Add handler for check-in form submission
  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    setShowCheckInModal(false);
    setCheckInForm({
      name: '',
      members: '',
      roomNumber: '',
      coupons: '',
      foodCategory: 'VIP'
    });
  };

  // Modify the table action button to trigger the check-in modal
  const handleActionClick = (action) => {
    if (action.toLowerCase() === 'check-in') {
      setShowCheckInModal(true);
    }
    // Handle other actions as needed
  };

  return (
    <div className="coupons-container">
      <div className="stats-section">
        <div className="stats-card guest-house">
          <h2>Guest House Members</h2>
          <div className="number">126</div>
          <div className="pending">
            <span className="material-icons-outlined">schedule</span>
            5 pending request
          </div>
        </div>

        <div className="stats-card external">
          <h2>External Members</h2>
          <div className="number">23</div>
          <div className="pending">
            <span className="material-icons-outlined">schedule</span>
            2 pending request
          </div>
        </div>

        <div className="stats-card total">
          <h2>Total Coupons</h2>
          <div className="number">149</div>
          <div className="pending">
            <span className="material-icons-outlined">schedule</span>
            7 pending request
          </div>
        </div>

        <div className="action-buttons">
          <button className="add-members" onClick={() => setShowManualEntry(true)}>+ Add Other members</button>
          <button className="export">↗ Export Summary</button>
        </div>
      </div>

      {/* Add Manual Entry Popup */}
      {showManualEntry && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal" style={{
            background: 'white',
            borderRadius: '10px',
            width: '460px',
            height: '500px',
            maxWidth: '90%',
            position: 'relative',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #000'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#000',
              margin: '0 0 24px 0',
              position: 'absolute',
              top: '24px',
              left: '24px'
            }}>Manual Entry</h2>
            <button 
              onClick={() => setShowManualEntry(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                padding: '8px'
              }}
            >×</button>
            <form onSubmit={handleManualEntrySubmit} style={{ marginTop: '48px' }}>
              <div className="form-group" style={{ marginBottom: '16px', width: '412px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#666',
                  fontSize: '16px'
                }}>Name</label>
                <input
                  type="text"
                  value={manualEntryForm.name}
                  onChange={(e) => setManualEntryForm({...manualEntryForm, name: e.target.value})}
                  placeholder="John Doe"
                  style={{
                    width: '412px',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#333'
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#666',
                  fontSize: '16px'
                }}>Members</label>
                <input
                  type="number"
                  value={manualEntryForm.members}
                  onChange={(e) => setManualEntryForm({...manualEntryForm, members: e.target.value})}
                  placeholder="1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#333'
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#666',
                  fontSize: '16px'
                }}>Coupons</label>
                <input
                  type="number"
                  value={manualEntryForm.coupons}
                  onChange={(e) => setManualEntryForm({...manualEntryForm, coupons: e.target.value})}
                  placeholder="1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#333'
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#666',
                  fontSize: '16px'
                }}>Food Category</label>
                <select
                  value={manualEntryForm.foodCategory}
                  onChange={(e) => setManualEntryForm({...manualEntryForm, foodCategory: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#333',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="VIP">VIP</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#FF6600',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px',
                  marginTop: '8px',
                }}
              >
                Add Member and Issue Coupon
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Check-In Modal with increased width */}
      {showCheckInModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal" style={{
            background: 'white',
            borderRadius: '10px',
            width: '700px',
            height: '400px',
            maxWidth: '90%',
            position: 'relative',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #000'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#000',
              margin: '0 0 24px 0',
              position: 'absolute',
              top: '24px',
              left: '24px'
            }}>Check-In & Coupon Issue</h2>
            <button 
              onClick={() => setShowCheckInModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                padding: '8px'
              }}
            >×</button>
            <form onSubmit={handleCheckInSubmit} style={{ marginTop: '48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '652px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#666',
                    fontSize: '16px'
                  }}>Name</label>
                  <input
                    type="text"
                    value={checkInForm.name}
                    onChange={(e) => setCheckInForm({...checkInForm, name: e.target.value})}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#333'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#666',
                    fontSize: '16px'
                  }}>Members</label>
                  <input
                    type="number"
                    value={checkInForm.members}
                    onChange={(e) => setCheckInForm({...checkInForm, members: e.target.value})}
                    placeholder="1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#333'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '652px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#666',
                    fontSize: '16px'
                  }}>Room Number</label>
                  <input
                    type="text"
                    value={checkInForm.roomNumber}
                    onChange={(e) => setCheckInForm({...checkInForm, roomNumber: e.target.value})}
                    placeholder="GH-012"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#333'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#666',
                    fontSize: '16px'
                  }}>Coupons</label>
                  <input
                    type="number"
                    value={checkInForm.coupons}
                    onChange={(e) => setCheckInForm({...checkInForm, coupons: e.target.value})}
                    placeholder="1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#333'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '652px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#666',
                    fontSize: '16px'
                  }}>Food Category</label>
                  <select
                    value={checkInForm.foodCategory}
                    onChange={(e) => setCheckInForm({...checkInForm, foodCategory: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#333',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '652px', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    border: '1px solid #FF6600',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#FF6600',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Scan QR
                </button>
                <button
                  type="submit"
                  style={{
                    width: '300px',
                    padding: '12px',
                    background: '#FF6600',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  Confirm Check-In & Issue Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="issuance-section">
        <div className="header">
          <h2>Coupon Issuance</h2>
          <div className="header-actions">
            <div className="search-box">
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <div className="filter-dropdown-container" style={{ display: 'inline-block' }}>
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
          </div>
        </div>

        <table>
          <thead>
            <tr>
              {filterOptions.guestName && <th>Guest Name</th>}
              {filterOptions.bookingId && <th>Booking ID</th>}
              {filterOptions.roomNumbers && <th>Room Numbers</th>}
              {filterOptions.numberOfMembers && <th>Number of Members</th>}
              {filterOptions.couponsIssued && <th>Coupons Issued</th>}
              {filterOptions.checkInStatus && <th>Check-In Status</th>}
              {filterOptions.action && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {filterOptions.guestName && <td>{row.guestName}</td>}
                {filterOptions.bookingId && <td>{row.bookingId}</td>}
                {filterOptions.roomNumbers && <td>{row.roomNumbers}</td>}
                {filterOptions.numberOfMembers && <td>{row.numberOfMembers}</td>}
                {filterOptions.couponsIssued && <td>{row.couponsIssued}</td>}
                {filterOptions.checkInStatus && (
                  <td>
                    <span className={`status ${row.checkInStatus.toLowerCase()}`}>
                      {row.checkInStatus}
                    </span>
                  </td>
                )}
                {filterOptions.action && (
                  <td>
                    <button 
                      className={`action-btn ${row.action.toLowerCase()}`}
                      onClick={() => handleActionClick(row.action)}
                    >
                      {row.action}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
