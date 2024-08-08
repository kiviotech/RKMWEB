import React from 'react';
import './GuestDetailsPopup.scss';
import icons from '../../../constants/icons';
import CommonButton from '../Button';

const GuestDetailsPopup = ({ isOpen, onClose, guestDetails }) => {
    if (!isOpen) return null;
    const visits = [
        { arrived: '00/00/0000', departed: '00/00/0000', guestHouse: 'Vivekananda Atithi House', donations: '₹100.00' },
        { arrived: '00/00/0000', departed: '00/00/0000', guestHouse: 'Vivekananda Atithi House', donations: '₹100.00' },
        { arrived: '00/00/0000', departed: '00/00/0000', guestHouse: 'Vivekananda Atithi House', donations: '₹100.00' },
    ];

    const guests = [
        { name: 'Mrs. John Dee', age: 35, gender: 'F', relation: 'Wife' },
        { name: 'Ms. John Dee', age: 5, gender: 'F', relation: 'Child' },
    ];
    return (

        <div className="popup-overlay">
            <div className="popup-content">
                {/* <div className="popup-header">
                    <h1>Guest Details</h1>
                    <button className="close-btn" onClick={onClose}>X</button>
                    </div> */}
                <div className="user-details">
                    <div className="user-details-card">
                        <div className="user-image">
                            <img src={icons.userDummyImage} alt="avatar" className="user-avatar" />
                        </div>
                        <h2 style={{ textAlign: 'center' }}>{guestDetails.userDetails.name}</h2>
                        <div className="age-gender">
                            <p><span>Age :</span>  {guestDetails.userDetails.age}</p>
                            <p><span>Gender : </span> {guestDetails.userDetails.gender}</p>
                        </div>
                        <p><span>Occupation :</span> </p>

                        <p><span>Email:</span> {guestDetails.userDetails.email}</p>
                        <p><span>Aadhar no. :</span> {guestDetails.userDetails.addharNo}</p>
                        <p><span>Mobile no. :</span> {guestDetails.userDetails.mobile}</p>

                        <h3>Deeksha :</h3>
                        <div style={{marginTop:30}}>
                            <p><span style={{ color: '#9867E9' }}>Arrival Date :</span> {guestDetails.userDetails.arrivalDate}</p>
                            <p><span style={{ color: '#9867E9' }}>Departure Date :</span> {guestDetails.userDetails.departureDate}</p>
                        </div>

                    </div>
                </div>

            </div>

            <div className="popup-content">

                <div className="user-details">
                    <div className="popup-header">
                        <button className="close-btn" onClick={onClose}>X</button>
                    </div>
                    <div className="user-details-card">
                        <div className="visit-history">
                            <h2>Last visited</h2>
                            <div className="guests-section">
                                <div className="tableCont">
                                    <div className="tableContHeader">

                                        <div className="tableheader">Arrived on</div>
                                        <div className="tableheader">Departed on</div>
                                        <div className="tableheader">Guest House</div>
                                        <div className="tableheader">Donations</div>
                                    </div>
                                    <div className="tableContBody">
                                        {visits.map((guest) => (
                                            <div className="tableContBodyEachRow" key={guest.id}>

                                                <div className="tbalebody">{guest.arrived}</div>
                                                <div className="tbalebody">{guest.departed}</div>
                                                <div className="tbalebody">{guest.guestHouse}</div>
                                                <div className="tbalebody">{guest.donations}</div>

                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div className="guests">
                                <h2>Guests</h2>
                                <div className="tableCont" style={{ marginTop: '-20px' }}>
                                    <div className="tableContHeader">
                                        <div className="tableheader" style={{ width: '50px' }}></div>
                                        <div className="tableheader tableHeader-guests"></div>
                                        <div className="tableheader" style={{ width: '100px' }}>Age</div>
                                        <div className="tableheader" style={{ width: '100px' }}>Gender</div>
                                        <div className="tableheader" style={{ width: '200px' }}>Relation</div>
                                        <div className="tableheader" style={{ width: '50px' }}></div>
                                        <div className="tableheader" style={{ width: '50px' }}></div>
                                    </div>
                                    <div className="tableContBody">
                                        {guests.map((guest) => (
                                            <div className="tableContBodyEachRow" key={guest.id}>
                                                <div className="tbalebody" style={{ width: '50px' }}>
                                                    <img src={icons.dummyUser} alt="user-image" />
                                                </div>
                                                <div className="tbalebody tableHeader-guests">{guest.name}</div>
                                                <div className="tbalebody" style={{ width: '100px' }}>{guest.age}</div>
                                                <div className="tbalebody" style={{ width: '100px' }}>{guest.gender}</div>
                                                <div className="tbalebody" style={{ width: '200px' }}>{guest.gender}</div>
                                                <div className="tbalebody" style={{ width: '50px' }}>
                                                    <svg onClick={() => onApprove(guest)} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 45 40" fill="none">
                                                        <circle cx="21.5" cy="21.5" r="21" fill="#ECF8DB" stroke="#A3D65C" />
                                                        <path d="M11 21.0678L18.5 29L32 16" stroke="#A3D65C" strokeWidth="4" />
                                                    </svg>

                                                </div>
                                                <div className="tbalebody" style={{ width: '50px' }}>

                                                    <svg onClick={() => onReject(guest)} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 45 45" fill="none">
                                                        <circle cx="21.5" cy="21.5" r="21" fill="#FFBDCB" stroke="#FC5275" />
                                                        <path d="M13.4765 13.4766L29.9999 30M13.4765 30L29.9999 13.4766" stroke="#FC5275" strokeWidth="4" />
                                                    </svg>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='action-button'>
                                    <CommonButton
                                        buttonName="Approve"
                                        buttonWidth="auto"
                                        style={{ backgroundColor: '#ECF8DB', color: '#A3D65C', borderColor: '#A3D65C', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '5px 20px' }}
                                    />
                                    <CommonButton
                                        buttonName="Reject"
                                        buttonWidth="auto"
                                        style={{ backgroundColor: '#FFBDCB', color: '#FC5275', borderColor: '#FC5275', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '5px 20px' }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>



    );
};

export default GuestDetailsPopup;
