import React, { useState } from 'react';
import { icons } from '../../../../../constants';
import CommonButton from '../../../../../components/ui/Button';
import './GridView.scss'
const guests = [
    { name: 'Mrs. John Dee', status: 'flaged', reason: 'Reason for them getting flagged', noOfGuestsMember: '1' },
    { name: 'Mrs. John Dee', status: 'flaged', reason: 'Reason for them getting flagged', noOfGuestsMember: '2' },
    { name: 'Mrs. John Dee', status: 'flaged', reason: 'Reason for them getting flagged', noOfGuestsMember: '7' },
    { name: 'Mrs. John Dee', status: 'flaged', reason: 'Reason for them getting flagged', noOfGuestsMember: '90' },
];

const GridView = ({ tabLabels }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);


    const [isEmailPopupVisible, setIsEmailPopupVisible] = useState(false);
    const [emailContent, setEmailContent] = useState({
        from: 'emailaddress@gmail.com',
        to: 'emailaddress@gmail.com',
        subject: 'Rejection of your request etc',
        body: 'Dear -, \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
    });
    const onReject = (guest) => {
        setSelectedGuest(guest);
        setIsPopupVisible(true);
    };

    const handlePopupClose = () => {
        setIsPopupVisible(false);
        setSelectedGuest(null);
    };

    const handleReject = () => {
        console.log('Rejected guest:', selectedGuest);
        // Add logic to reject the guest
        handlePopupClose();
    };

    const handleEditMail = () => {
        console.log('Editing mail for:', selectedGuest);
        setIsEmailPopupVisible(true);
        // Add logic to handle email editing
        handlePopupClose();
    };


    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailContent((prevState) => ({ ...prevState, [name]: value }));
    };

    const sendEmail = () => {
        console.log('Sending email with content:', emailContent);
        setIsEmailPopupVisible(false);
    };

    const getStatusIcon = (status) => {
        const isOnHold = tabLabels === 'On Hold';
        const isRejected = tabLabels === 'Rejected';

        switch (status) {
            case 'rejected':
                return (
                    <>
                        <img src={icons.filledRedCircle} alt="Rejected" className={isRejected ? 'active' : 'inactive'} />
                        <img src={icons.marked} alt="Default" className={isRejected ? 'inactive' : 'inactive'} />
                        <img src={icons.checkCircle} alt="Default" className={isRejected ? 'inactive' : 'inactive'} />
                    </>
                );
            case 'flaged':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" className={isOnHold ? 'inactive' : 'inactive'} />
                        <img src={icons.markedYellow} alt="Flagged" className={isOnHold ? 'active' : 'inactive'} />
                        <img src={icons.checkCircle} alt="Default" className={isOnHold ? 'inactive' : 'inactive'} />
                    </>
                );
            case 'approved':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" className={isOnHold || isRejected ? 'inactive' : 'inactive'} />
                        <img src={icons.marked} alt="Default" className={isOnHold || isRejected ? 'inactive' : 'inactive'} />
                        <img src={icons.checkCircleMarked} alt="Approved" className={isOnHold || isRejected ? 'inactive' : 'active'} />
                    </>
                );
            default:
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" className='inactive' />
                        <img src={icons.marked} alt="Default" className='inactive' />
                        <img src={icons.checkCircle} alt="Default" className='inactive' />
                    </>
                );
        }
    };


    const [isTyping, setIsTyping] = useState({

        to: false,
        subject: false,
        body: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleEmailChange(e); // Call your existing email change handler
        setIsTyping({ ...isTyping, [name]: value.length > 0 });
    };
    return (
        <div className="grid_view_visit-history">
            <div className="grid_view_tableCont">
                <div className="grid_view_tableContHeader">
                    <div className="grid_view_tableheader"></div>
                    <div className="grid_view_tableheader">Name</div>
                    <div className="grid_view_tableheader">Status</div>
                    <div className="grid_view_tableheader">Reason</div>
                    <div className="grid_view_tableheader">No. of guest members</div>
                    <div className="grid_view_tableheader"></div>
                </div>
                <div className="grid_view_tableContBody">
                    {guests.map((guest, index) => {
                        // Dynamically change guest status based on tabLabels
                        const modifiedGuest = {
                            ...guest,
                            status:
                                tabLabels === 'On Hold'
                                    ? 'flaged'
                                    : tabLabels === 'rejected'
                                        ? 'rejected'
                                        : guest.status,
                        };

                        // Determine the color based on the status
                        const reasonColor = tabLabels === 'On Hold' ? 'defaultColor' :
                            tabLabels === 'rejected' ? '#FC5275' :
                                '#F7BC4C'; // Default color for other cases

                        return (
                            <div className="grid_view_tableContBodyEachRow" key={index}> {/* Ensure 'key' prop is unique */}
                                <div className="grid_view_tbalebody">
                                    <img src={icons.dummyUser} alt="user-image" />
                                </div>
                                <div className="grid_view_tbalebody">{modifiedGuest.name}</div>
                                <div className="grid_view_tbalebody">
                                    {getStatusIcon(modifiedGuest.status)}
                                </div>
                                <div className="grid_view_tbalebody" style={{ color: reasonColor }}>
                                    {modifiedGuest.reason}
                                </div>
                                <div className="grid_view_tbalebody">{modifiedGuest.noOfGuestsMember}</div>

                                <div className="grid_view_tbalebody">
                                    <CommonButton
                                        buttonName="Allocate"
                                        buttonWidth="auto"
                                        style={{
                                            backgroundColor: "#ECF8DB",
                                            color: "#A3D65C",
                                            borderColor: "#A3D65C",
                                            fontSize: "18px",
                                            borderRadius: "7px",
                                            borderWidth: 1,
                                            padding: "5px 10px",
                                        }}
                                    />

                                    <CommonButton
                                        buttonName="Reject"
                                        buttonWidth="220px"
                                        style={{
                                            backgroundColor: "#FFBDCB",
                                            color: "#FC5275",
                                            borderColor: "#FC5275",
                                            fontSize: "18px",
                                            borderRadius: "7px",
                                            borderWidth: 1,
                                            padding: "5px 0px",
                                        }}
                                        onClick={() => onReject(guest)}
                                    />
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            {isPopupVisible && (
                <div className="popup_overlay">
                    <div className="popup_content">
                        <img src={icons.warning} alt="warning" />
                        <h3>Are you sure you want to reject this guest?</h3>
                        <p>
                            Once confirmed, the action will be final and cannot be undone.
                            An email will be sent to inform them about the rejection.
                        </p>
                        <div className="popup_actions">
                            <CommonButton buttonName="Cancel" style={{
                                backgroundColor: "#FFF",
                                color: "#4B4B4B",
                                borderColor: "#4B4B4B",
                                fontSize: "18px",
                                borderRadius: "7px",
                                borderWidth: 1,
                                padding: "8px 20px",
                            }} onClick={handlePopupClose} />
                            <CommonButton buttonName="Edit Mail" style={{
                                backgroundColor: "#FFF",
                                color: "#4B4B4B",
                                borderColor: "#4B4B4B",
                                fontSize: "18px",
                                borderRadius: "7px",
                                borderWidth: 1,
                                padding: "8px 20px",
                            }} onClick={handleEditMail} />
                            <CommonButton
                                buttonName="Reject"
                                style={{
                                    backgroundColor: "#FFBDCB",
                                    color: "#FC5275",
                                    borderColor: "#FC5275",
                                }}
                                onClick={handleReject}
                            />
                        </div>
                    </div>
                </div>
            )}


            {isEmailPopupVisible && (
                <div className="popup_overlay">
                    <div className="popup_content email_popup">
                        <div className="email_form">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label>From:</label>
                                <input
                                    type="email"
                                    name="from"
                                    value={emailContent.from}

                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label>To:</label>
                                <input style={{ border: 'none' }}
                                    type="email"
                                    name="to"
                                    value={emailContent.to}
                                    className={isTyping.to ? 'typing' : ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="divider"></div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: "20px" }}>
                                <label>Subject:</label>
                                <input style={{ border: 'none' }}
                                    type="text"
                                    name="subject"
                                    value={emailContent.subject}
                                    className={isTyping.subject ? 'typing' : ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <textarea style={{ border: 'none' }}
                                name="body"
                                value={emailContent.body}
                                className={isTyping.body ? 'typing' : ''}
                                onChange={handleInputChange}
                            ></textarea>

                            <div className="divider"></div>
                        </div>

                        <div className="popup_actions email-popupbutton">
                            <div style={{gap:15,display:'flex',height:"30px",cursor:'pointer'}}>
                                <img src={icons.Trash} alt="Trash" />
                                <img src={icons.Paperclip} alt="Paperclip" />
                            </div>
                            <div style={{gap:15,display:'flex',height:"40px"}}> 
                                <CommonButton buttonName="Cancel" onClick={() => setIsEmailPopupVisible(false)} style={{
                                    backgroundColor: "#FFF",
                                    color: "#4B4B4B",
                                    borderColor: "#4B4B4B",
                                    fontSize: "18px",
                                    borderRadius: "7px",
                                    borderWidth: 1,
                                    padding: "8px 20px",

                                }} />
                                
                                <CommonButton buttonName="Send" style={{
                                    borderColor: "#9867E9",
                                }} onClick={sendEmail} />
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GridView;
