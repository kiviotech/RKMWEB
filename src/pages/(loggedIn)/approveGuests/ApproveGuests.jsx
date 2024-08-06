import React, { useState } from 'react';
import './ApproveGuests.scss';
import SearchBar from '../../../components/ui/SearchBar';
import icons from '../../../constants/icons';
import CommonButton from '../../../components/ui/Button';
import PopUpFlagGuest from '../../../components/ui/PopUpFlagGuest'; // Adjust the import path as needed

const ApproveGuests = () => {
    const [requests, setRequests] = useState([
        {
            id: 1, userImage: '', name: 'Mr. John Deep',
            reason: 'No History', noOfGuest: '1', isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 2, userImage: '', name: 'Mr. John Deep',
            reason: 'No History', noOfGuest: '1', isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 3, userImage: '', name: 'Mr. John Deep',
            reason: 'No History', noOfGuest: '1', isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        {
            id: 4, userImage: '', name: 'Mr. John Deep',
            reason: 'No History', noOfGuest: '1', isMarked: false,
            icons: [
                { id: 1, normal: icons.crossCircle, filled: icons.filledRedCircle, isActive: false },
                { id: 2, normal: icons.marked, filled: icons.markedYellow, isActive: false },
                { id: 3, normal: icons.checkCircle, filled: icons.checkCircleMarked, isActive: false },
            ]
        },
        // Other requests...
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [iconId, setIconId] = useState(null);
    const [iconType, setIconType] = useState(null);
    const handleIconClick = (reqId, icon_Id, iconType) => {
        if (icon_Id === 3) { // Check if the last icon is clicked
            handleFlag("safe to approve", reqId, icon_Id);
        } else {
            setRequestId(reqId);
            setIconId(icon_Id);
            setIsModalOpen(true);
            setIconType(iconType);
        }
    };

    const closeModal = () => {
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
                <h3 className='title'>Requests</h3>
                <SearchBar />
            </div>
            <div className="requests-cards-section">
                {requests.map(request => (
                    <div
                        key={request.id}
                        className="requests-card"
                        style={{ borderColor: getCardBorderColor(request.icons) }}
                    >
                        <div className="actions-button">
                            {request.icons.map(icon => (
                                <img
                                    key={icon.id}
                                    src={icon.isActive ? icon.filled : icon.normal}
                                    alt="icon"
                                    onClick={() => handleIconClick(request.id, icon.id, icon.normal)}
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
            <PopUpFlagGuest isOpen={isModalOpen} onClose={closeModal} handleFlag={handleFlag} iconType={iconType} />
        </div>
    );
}

export default ApproveGuests;
