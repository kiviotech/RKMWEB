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

const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const GuestDetailsPopup = ({ isOpen, onClose, guestDetails, guests, onStatusChange, onAllocateRooms }) => {
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

    const EmailTemplate = ({ onClose, guestData, onSend }) => {
        const [emailContent, setEmailContent] = useState(`Dear Devotee,

Namoskar,

We regret to inform you that we are unable to accommodate your stay request for the following reason:
[Selected rejection reason will be inserted here]

We hope you understand and look forward to serving you in the future.

May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami Vivekananda bless you all!

Pranam and namaskar again.

Yours sincerely,

Swami Lokahanananda
Adhyaksha
RAMAKRISHNA MATH & RAMAKRISHNA MISSION, KAMANKUNUR`);

        return (
            <div className="email-popup-overlay">
                <div className="email-popup-content">
                    <button className="close-button" onClick={onClose}>×</button>
                    <div className="email-template">
                        <div className="email-header">
                            <div className="email-field">
                                <div className="field-label">From:</div>
                                <div className="field-value">emailaddress@gmail.com</div>
                            </div>
                            <div className="email-field">
                                <div className="field-label">To:</div>
                                <div className="recipient-list">
                                    <div className="recipient-tag">
                                        <span className="avatar">A</span>
                                        <span className="name">Sri rock</span>
                                    </div>
                                    <div className="recipient-tag">
                                        <span className="avatar">A</span>
                                        <span className="name">Sri rock</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="email-content">
                            <textarea
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                className="email-content-textarea"
                            />
                        </div>

                        <div className="email-footer">
                            <button onClick={onClose} className="cancel-btn">Cancel</button>
                            <button onClick={onSend} className="send-btn">Send Mail</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RejectConfirmationPopup = ({ onCancel, onConfirm }) => {
        const [selectedReason, setSelectedReason] = useState('');
        const [showEmailTemplate, setShowEmailTemplate] = useState(false);

        const handleSendMailClick = () => {
            if (!selectedReason) {
                alert('Please select a reason for rejection');
                return;
            }
            setShowEmailTemplate(true);
        };

        if (showEmailTemplate) {
            return (
                <EmailTemplate 
                    onClose={onCancel}
                    guestData={guestDetails}
                    onSend={() => onConfirm(selectedReason)}
                />
            );
        }

        return (
            <div className="popup-overlay">
                <div className="rejection-popup">
                    <div className="popup-header">
                        <h3>Select the reason to add in the rejection email</h3>
                        <button className="close-button" onClick={onCancel}>×</button>
                    </div>
                    
                    <div className="reason-options">
                        <label className="reason-option">
                            <input 
                                type="radio" 
                                name="rejectReason" 
                                value="reason1"
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            <span style={{paddingLeft: "50px"}}>Reason 1</span>
                        </label>
                        <label className="reason-option">
                            <input 
                                type="radio" 
                                name="rejectReason" 
                                value="reason2"
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            <span style={{paddingLeft: "50px"}}>Reason 2</span>
                        </label>
                        <label className="reason-option">
                            <input 
                                type="radio" 
                                name="rejectReason" 
                                value="reason3"
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            <span style={{paddingLeft: "50px"}}>Reason 3</span>
                        </label>
                        <label className="reason-option">
                            <input 
                                type="radio" 
                                name="rejectReason" 
                                value="reason4"
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            <span style={{paddingLeft: "50px"}}>Reason 4</span>
                        </label>
                        <label className="reason-option">
                            <input 
                                type="radio" 
                                name="rejectReason" 
                                value="reason5"
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            <span style={{paddingLeft: "50px"}}>Reason 5</span>
                        </label>
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            className="send-mail-btn" 
                            onClick={handleSendMailClick}
                            disabled={!selectedReason}
                        >
                            Send Mail
                        </button>
                        <button 
                            className="cancel-btn" 
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleButtonClick = (details) => {
        if (onAllocateRooms) {
            onAllocateRooms(details);
        }
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
        console.log(status)

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
                                        <span className="label">Age</span>
                                        <span className="value">{guestDetails?.userDetails?.age || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Gender</span>
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
                                        <span className="label">Occupation</span>
                                        <span className="value">{guestDetails?.userDetails?.occupation || "N/A"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Initiation by</span>
                                        <span className="value">{guestDetails?.userDetails?.deeksha || "N/A"}</span>
                                    </div>
                                    {/* <div className="info-item">
                                        <span className="label">Initiation by</span>
                                        <span className="value">Gurudev Name</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="right-section">
                            <div className="reminder-bar">
                                {/* <div className="reminder-content">
                                    <img src={icons.Reminder} alt="reminder" />
                                    <span>Reminder: 26th Aug is Janmasthami</span>
                                </div> */}
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
                                            {formatDateTime(guestDetails?.userDetails?.arrivalDate)}
                                        </span>
                                    </div>
                                    <div className="date-row">
                                        <img src={icons.Calendar} alt="calendar" />
                                        <span className="date-label">Departure Date:</span>
                                        <span className="date-value">
                                            {formatDateTime(guestDetails?.userDetails?.departureDate)}
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
                        {/* <div className="right-link">
                            <a href="#" className="check-availability">Check Availability</a>
                        </div> */}
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
                                        guestDetails.visitHistory.map((visit, index) => {
                                            // Calculate the difference in months between the visit date and the present date
                                            const visitDate = new Date(visit.visitDate);
                                            const currentDate = new Date();
                                            const monthsDifference =
                                                (currentDate.getFullYear() - visitDate.getFullYear()) * 12 +
                                                (currentDate.getMonth() - visitDate.getMonth());

                                            const isWithinSixMonths = monthsDifference < 6;

                                            return (
                                                <tr
                                                    key={index}
                                                    className={isWithinSixMonths ? 'highlighted' : ''}
                                                    onClick={() => handleVisitRowClick(index)}
                                                >
                                                    <td>{visit.visitDate || 'N/A'}</td>
                                                    <td>{visit.numberOfDays || 'N/A'}</td>
                                                    <td>{visit.roomAllocated || 'N/A'}</td>
                                                    <td>₹{visit.donations?.toFixed(2) || '0.00'}</td>
                                                </tr>
                                            );
                                        })
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
                    <div style={{background: "#fff"}} className="footer">
                        <div className="alert">
                            There is a Revisit within 6 months of Guest name
                        </div>
                        {renderActionButtons()}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default GuestDetailsPopup;