import React, { useState } from 'react';
import './ApproveGuests.scss';
import SearchBar from '../../../components/ui/SearchBar';
import icons from '../../../constants/icons';
import CommonButton from '../../../components/ui/Button';
import PopUpFlagGuest from '../../../components/ui/PopUpFlagGuest'; // Adjust the import path as needed
import GuestDetailsPopup from '../../../components/ui/GuestDetailsPopup/GuestDetailsPopup';
import ApproveGuestsGridView from './ApproveGuestsGridView';
import CommonHeaderTitle from '../../../components/ui/CommonHeaderTitle';


// Define your icons here
const togglers = {
    dashboard: {
        default: icons.toggglerDashboard,
        active: icons.toggglerDashboardWite
    },
    gridView: {
        default: icons.togglerGridView,
        active: icons.togglerGridViewWhite
    }
};

const ApproveGuests = () => {
    const [requests, setRequests] = useState([
        {
            id: 1,
            userImage: '',
            userDetails: {
                name: 'Mr. John Deep',
                age: 27,
                gender: 'M',
                email: 'johnDeep@gmail.com',
                addharNo: '1234567890',
                mobile: '3545345443',
                arrivalDate: '2023-08-07',
                departureDate: '2023-08-14',
                occupation: 'Engineer'
            },
            reason: 'No History',
            noOfGuest: '1',
            isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 2,
            userImage: '',
            userDetails: {
                name: 'Mr. John Deep',
                age: 27,
                gender: 'M',
                email: 'johnDeep@gmail.com',
                addharNo: '1234567890',
                mobile: '3545345443',
                arrivalDate: '2023-08-07',
                departureDate: '2023-08-14',
                occupation: 'Engineer'
            },
            reason: 'No History',
            noOfGuest: '1',
            isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 3,
            userImage: '',
            userDetails: {
                name: 'Mr. John Deep',
                age: 27,
                gender: 'M',
                email: 'johnDeep@gmail.com',
                addharNo: '1234567890',
                mobile: '3545345443',
                arrivalDate: '2023-08-07',
                departureDate: '2023-08-14',
                occupation: 'Engineer'
            },
            reason: 'No History',
            noOfGuest: '1',
            isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 4,
            userImage: '',
            userDetails: {
                name: 'Mr. John Deep',
                age: 27,
                gender: 'M',
                email: 'johnDeep@gmail.com',
                addharNo: '1234567890',
                mobile: '3545345443',
                arrivalDate: '2023-08-07',
                departureDate: '2023-08-14',
                occupation: 'Engineer'
            },
            reason: 'No History',
            noOfGuest: '1',
            isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        // Other requests...
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);// Manages the visibility of the modal for flagging a guest.
    const [requestId, setRequestId] = useState(null);// Stores the ID of the current request being processed.
    const [iconId, setIconId] = useState(null);// Stores the ID of the icon that was clicked, used to identify the action.
    const [iconType, setIconType] = useState(null); // Stores the type of the icon clicked, used to determine the specific action to be taken.
    const [selectedGuest, setSelectedGuest] = useState(null);// Stores the details of the selected guest for display or further actions.
    const [isGuestDetailsPopupOpen, setIsGuestDetailsPopupOpen] = useState(false);// Manages the visibility of the guest details popup.

    // function and state to handle toggler buttons
    const [isGuestsGridViewVisible, setIsGuestsGridViewVisible] = useState(false);// Toggles the visibility of the user details in grid view.
    const [activeToggler, setActiveToggler] = useState('dashboard');

    const handleTogglerClick = (view) => {
        setActiveToggler(view);
        setIsGuestsGridViewVisible(view === 'gridView');
    };

    // Common styles for togglers
    const commonStyle = {
        cursor: 'pointer',
        borderRadius: '5px'
    };

    // Determine styles for active and default states
    const getStyle = (view) => ({
        ...commonStyle,
        background: activeToggler === view ? 'var(--primary-color)' : 'transparent',
    });
    const handleIconClick = (e, reqId, icon_Id, iconType) => {
        e.stopPropagation(); // Prevent card click event
        if (icon_Id === 3) { // Check if the last icon is clicked
            handleFlag("safe to approve", reqId, icon_Id);
        } else {
            setRequestId(reqId);
            setIconId(icon_Id);
            setIsModalOpen(true);
            setIconType(iconType);
            setIsGuestDetailsPopupOpen(false);
        }
    };

    const handleCardClick = (guestDetails) => {
        if (!isModalOpen) {
            setSelectedGuest(guestDetails);
            setIsGuestDetailsPopupOpen(true);
        }
    };

    const closeModal = () => {
        setIsGuestDetailsPopupOpen(false);
        setSelectedGuest(null);
        setIsModalOpen(false);
    };

    const handleFlag = (selectedReason, reqId = requestId, icon_Id = iconId) => {
        console.log(`Flagging guest for reason: ${selectedReason}`);
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === reqId
                    ? {
                        ...request,
                        reason: selectedReason, // Update the reason
                        icons: request.icons.map(icon =>
                            icon.id === icon_Id
                                ? { ...icon, isActive: !icon.isActive }
                                : { ...icon, isActive: false }
                        )
                    }
                    : request
            )
        );

        if (icon_Id !== 3) {
            closeModal();
        }
    };

    const getCardBorderColor = (icons) => {
        const activeIcon = icons.find(icon => icon.isActive);
        if (activeIcon) {
            if (activeIcon.id === 1) return '#FC5275'; // color of the "Reject" button
            if (activeIcon.id === 2) return '#FFD700'; // color of the "Flag" button (or a similar color)
            if (activeIcon.id === 3) return '#A3D65C'; // color of the "Approve" button
        }
        return '#ccc'; // default border color
    };

    return (
        <div className='Requests-main-container'>
            <div className="top-section">
                <CommonHeaderTitle title="Requests" />
                <div className="toggler" style={{ display: 'flex', gap: '30px' }}>
                    <div className="toggleGridView">
                        {/* Dashboard Toggler */}
                        <img
                            src={activeToggler === 'dashboard' ? togglers.dashboard.active : togglers.dashboard.default}
                            alt="Dashboard"
                            onClick={() => handleTogglerClick('dashboard')}
                            style={getStyle('dashboard')}
                        />

                        {/* Grid View Toggler */}
                        <img
                            src={activeToggler === 'gridView' ? togglers.gridView.active : togglers.gridView.default}
                            alt="Grid View"
                            onClick={() => handleTogglerClick('gridView')}
                            style={getStyle('gridView')}
                        />
                    </div>
                    <SearchBar />
                </div>

            </div>
            {!isGuestsGridViewVisible && (
                <div className="requests-cards-section">
                    {requests.map(request => (
                        <div
                            key={request.id}
                            className="requests-card"
                            style={{ borderColor: getCardBorderColor(request.icons) }}
                            onClick={() => handleCardClick(request)}
                        >
                            <div className="actions-button">
                                {request.icons.map(icon => (
                                    <img
                                        key={icon.id}
                                        src={icon.isActive ? icon.filled : icon.normal}
                                        alt="icon"
                                        onClick={(e) => handleIconClick(e, request.id, icon.id, icon.normal)}
                                        style={{ display: 'inline-block', marginRight: '5px', cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                            <div className="request-details">
                                <div className="request-user-imag">
                                    <img src={icons.userDummyImage} alt="user-image" />
                                    <p>{request.name}</p>
                                </div>
                                <div className='reasons'>
                                    <p style={{ color: getCardBorderColor(request.icons) }}>{request.reason}</p>
                                    <p>Number of guest members: {request.noOfGuest}</p>
                                </div>
                            </div>
                            <div className="buttons">
                                <CommonButton
                                    buttonName="Approve"
                                    buttonWidth="auto"
                                    style={{ backgroundColor: '#ECF8DB', color: '#A3D65C', borderColor: '#A3D65C', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '8px 20px' }}
                                />
                                <CommonButton
                                    buttonName="Reject"
                                    buttonWidth="auto"
                                    style={{ backgroundColor: '#FFBDCB', color: '#FC5275', borderColor: '#FC5275', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '8px 20px' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PopUpFlagGuest isOpen={isModalOpen} onClose={closeModal} handleFlag={handleFlag} iconType={iconType} />
            {selectedGuest && (
                <GuestDetailsPopup
                    isOpen={isGuestDetailsPopupOpen}
                    onClose={closeModal}
                    guestDetails={selectedGuest}
                />
            )}

            {isGuestsGridViewVisible && (
                <ApproveGuestsGridView />
            )}
        </div>
    );
}

export default ApproveGuests;
