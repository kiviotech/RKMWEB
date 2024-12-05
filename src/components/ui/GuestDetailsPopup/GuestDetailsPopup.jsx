import React, { useState, useEffect } from "react";
import CommonButton from "../../../components/ui/Button";
import './GuestDetailsPopup.scss';
import { updateBookingRequest } from "../../../../services/src/api/repositories/bookingRequestRepository";
import { getToken } from "../../../../services/src/utils/storage";

const icons = {
    Reminder: "https://api.iconify.design/mdi:bell-ring-outline.svg",
    Email: "https://api.iconify.design/mdi:email-outline.svg",
    Contact: "https://api.iconify.design/mdi:phone.svg",
    Calendar: "https://api.iconify.design/mdi:calendar.svg",
    DefaultAvatar: "https://api.iconify.design/mdi:account-circle.svg",
    Close: "https://api.iconify.design/mdi:close.svg",
    Location: "https://api.iconify.design/mdi:map-marker.svg",
    Clock: "https://api.iconify.design/mdi:clock-outline.svg",
    Edit: "https://api.iconify.design/mdi:pencil.svg",
    Delete: "https://api.iconify.design/mdi:delete.svg"
};

const GuestDetailsPopup = ({ isOpen, onClose, guestDetails, guests, onStatusChange }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedVisitRow, setSelectedVisitRow] = useState(null);
    const [selectedGuestName, setSelectedGuestName] = useState(guestDetails?.userDetails?.name || "");
    const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

    useEffect(() => {
        if (guestDetails?.guests?.length > 0) {
            const firstGuest = guestDetails.guests[0];
            setSelectedRow(firstGuest.id);
            setSelectedGuestName(firstGuest.name || guestDetails?.userDetails?.name || "");
        }
    }, [guestDetails]);

    console.log('GuestDetailsPopup - Full guestDetails:', guestDetails);
    console.log('GuestDetailsPopup - User Details:', guestDetails?.userDetails);
    console.log('GuestDetailsPopup - Guests:', guestDetails?.guests);
    console.log('GuestDetailsPopup - Stay Duration:', {
        arrivalDate: guestDetails?.userDetails?.arrivalDate,
        departureDate: guestDetails?.userDetails?.departureDate
    });

    if (!isOpen) return null;

    const handleRowClick = (guestId) => {
        setSelectedRow(guestId);
        const selectedGuest = guestDetails?.guests?.find(guest => guest.id === guestId);
        setSelectedGuestName(selectedGuest?.name || guestDetails?.userDetails?.name || "");
    };

    const handleVisitRowClick = (index) => {
        setSelectedVisitRow(index);
    };

    const arrivalDate = new Date(guestDetails?.userDetails?.arrivalDate);
    const departureDate = new Date(guestDetails?.userDetails?.departureDate);
    const stayDuration = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24));

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = await getToken();
            if (!token) {
                console.error("No token available for API requests");
                return;
            }

            const updatedData = {
                data: {
                    status: newStatus,
                },
            };

            // Call the API to update the status
            const response = await updateBookingRequest(requestId, updatedData);
            
            // If the API call is successful, notify the parent component
            if (response) {
                onStatusChange && onStatusChange(requestId, newStatus);
                onClose(); // Close the popup after successful status change
            }
        } catch (error) {
            console.error(`Failed to update the booking request to ${newStatus}:`, error);
            // You might want to show an error message to the user here
        }
    };

    const RejectConfirmationPopup = ({ onCancel, onConfirm }) => {
        return (
            <div className="popup-overlay confirmation-overlay">
                <div className="confirmation-popup" style={{ 
                    width: '400px', 
                    maxWidth: '90vw',
                    padding: '40px 30px',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div className="warning-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                            <path d="M12 3L22 21H2L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3>Are you sure you want to reject this guest?</h3>
                    <p>Once confirmed, the action will be final and cannot be undone.</p>
                    <div className="confirmation-buttons">
                        <button className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                        <button className="reject-confirm-btn" onClick={onConfirm}>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderActionButtons = () => {
        const status = guestDetails?.status || guestDetails?.attributes?.status || 'awaiting';
        
        const handleRejectClick = () => {
            setShowRejectConfirmation(true);
        };

        const handleRejectConfirm = () => {
            handleStatusChange(guestDetails.id, 'rejected');
            setShowRejectConfirmation(false);
        };

        if (status === 'awaiting') {
            return (
                <div className="action-buttons">
                    <button 
                        className="hold-btn"
                        onClick={() => handleStatusChange(guestDetails.id, 'on_hold')}
                    >
                        Put on hold
                    </button>
                    <button 
                        className="approve-btn"
                        onClick={() => handleStatusChange(guestDetails.id, 'approved')}
                    >
                        Approve
                    </button>
                    <button 
                        className="reject-btn"
                        onClick={handleRejectClick}
                    >
                        Reject
                    </button>
                    {showRejectConfirmation && (
                        <RejectConfirmationPopup 
                            onCancel={() => setShowRejectConfirmation(false)}
                            onConfirm={handleRejectConfirm}
                        />
                    )}
                </div>
            );
        } else if (status === 'approved') {
            return (
                <div className="action-buttons">
                    <button 
                        className="hold-btn"
                        onClick={() => handleStatusChange(guestDetails.id, 'on_hold')}
                    >
                        Put on hold
                    </button>
                    <button 
                        className="reject-btn"
                        onClick={handleRejectClick}
                    >
                        Reject
                    </button>
                    <button 
                        className="allocate-btn"
                        onClick={() => handleButtonClick(guestDetails)}
                    >
                        Allocate Rooms
                    </button>
                    {showRejectConfirmation && (
                        <RejectConfirmationPopup 
                            onCancel={() => setShowRejectConfirmation(false)}
                            onConfirm={handleRejectConfirm}
                        />
                    )}
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="header-section">
                    <button className="close-btn" onClick={onClose}>
                        <img src={icons.Close} alt="close" className="icon" />
                    </button>

                    {/* Main Info Section */}
                    <div className="main-info">
                        <div className="left-section">
                            <div className="avatar">
                                <img src={guestDetails?.userImage || icons.DefaultAvatar} alt="profile" />
                            </div>
                            <div className="user-details">
                                <h2>{guestDetails?.userDetails?.name || "N/A"}</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Age:</span>
                                        <span className="value">{guestDetails?.userDetails?.age || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Gender:</span>
                                        <span className="value">{guestDetails?.userDetails?.gender || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <img src={icons.Email} alt="email" className="icon" />
                                        <span className="value">{guestDetails?.userDetails?.email || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <img src={icons.Contact} alt="phone" className="icon" />
                                        <span className="value">{guestDetails?.userDetails?.mobile || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Occupation:</span>
                                        <span className="value">{guestDetails?.userDetails?.occupation || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Diksha:</span>
                                        <span className="value">{guestDetails?.userDetails?.deeksha || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Initiation by:</span>
                                        <span className="value">Gurudev Name</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="right-section">
                            <div className="reminder-bar">
                                <div className="reminder-content">
                                    <img src={icons.Reminder} alt="reminder" />
                                    <span>Reminder: 26th Aug is Janmasthami</span>
                                </div>
                            </div>
                            
                            <div className="stay-info">
                                <div className="duration">
                                    <span className="label">Stay Duration:- </span>
                                    <span className="value">{stayDuration || "N/A"} days</span>
                                </div>
                                <div className="dates">
                                    <div className="date-row">
                                        <img src={icons.Calendar} alt="calendar" />
                                        <span className="date-label">Arrival Date:</span>
                                        <span className="date-value">
                                            {guestDetails?.userDetails?.arrivalDate || "N/A"}
                                        </span>
                                    </div>
                                    <div className="date-row">
                                        <img src={icons.Calendar} alt="calendar" />
                                        <span className="date-label">Departure Date:</span>
                                        <span className="date-value">
                                            {guestDetails?.userDetails?.departureDate || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visit History Section */}
                <div className="visit-history">
                    <div className="history-header">
                        <div className="left-title">Guests</div>
                        <div className="center-title">Visit History of {selectedGuestName}</div>
                        <div className="right-link">
                            <a href="#" className="check-availability">Check Availability</a>
                        </div>
                    </div>

                    <div className="history-tables">
                        {/* Guests Table */}
                        <div className="guests-table-container">
                            <div className="table-wrapper">
                                <div className="table-scroll">
                                    <table className="guests-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Relation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guestDetails?.guests?.map((guest) => (
                                                <tr 
                                                    key={guest.id}
                                                    className={selectedRow === guest.id ? 'selected' : ''}
                                                    onClick={() => handleRowClick(guest.id)}
                                                >
                                                    <td>{guest.name || "N/A"}</td>
                                                    <td>{guest.age || "N/A"}</td>
                                                    <td>{guest.gender || "N/A"}</td>
                                                    <td>{guest.relation || "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Visit Details Table */}
                        <div className="visit-details-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Last visited date</th>
                                        <th>Number of days</th>
                                        <th>Room Allocated</th>
                                        <th>Donations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guestDetails?.visitHistory?.length > 0 ? (
                                        guestDetails.visitHistory.map((visit, index) => (
                                            <tr 
                                                key={index}
                                                className={selectedVisitRow === index ? 'selected' : ''}
                                                onClick={() => handleVisitRowClick(index)}
                                            >
                                                <td>{visit.visitDate || 'N/A'}</td>
                                                <td>{visit.numberOfDays || 'N/A'}</td>
                                                <td>{visit.roomAllocated || 'N/A'}</td>
                                                <td>₹{visit.donations?.toFixed(2) || '0.00'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="no-data">No visit history available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Alert and Action Buttons */}
                    <div className="footer">
                        <div className="alert">
                            There is a Revisit within 6 months of Guest name
                        </div>
                        {renderActionButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestDetailsPopup;