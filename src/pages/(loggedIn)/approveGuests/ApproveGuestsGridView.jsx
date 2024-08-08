import React from 'react';
import './ApproveGuestsGridView.scss';
import icons from '../../../constants/icons';
import CommonButton from '../../../components/ui/Button';

const guests = [
    { name: 'Mrs. John Dee', status: 'rejected', reason: 'Reason for them getting flagged', noOfGuestsMember: '1' },
    { name: 'Mrs. John Dee', status: 'flaged', reason: 'Reason for them getting flagged', noOfGuestsMember: '2' },
    { name: 'Mrs. John Dee', status: 'approved', reason: 'Reason for them getting flagged', noOfGuestsMember: '7' },
    { name: 'Mrs. John Dee', status: 'waiting', reason: 'Reason for them getting flagged', noOfGuestsMember: '90' },
];

const ApproveGuestsGridView = () => {
    const onApprove = (guest) => {
        console.log('Approved guest:', guest);
    };

    const onReject = (guest) => {
        console.log('Rejected guest:', guest);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'rejected':
                return (
                    <>
                        <img src={icons.filledRedCircle} alt="Rejected" />
                        <img src={icons.marked}  alt="Default" />
                        <img src={icons.checkCircle}  alt="Default" />
                    </>
                );
            case 'flaged':
                return (
                    <>
                        <img src={icons.crossCircle}  alt="Default" />
                        <img src={icons.markedYellow} alt="Flagged" />
                        <img src={icons.checkCircle}  alt="Default" />
                    </>
                );
            case 'approved':
                return (
                    <>
                        <img src={icons.crossCircle}  alt="Default" />
                        <img src={icons.marked}  alt="Default" />
                        <img src={icons.checkCircleMarked} alt="Approved" />
                    </>
                );
            default:
                return (
                    <>
                        <img src={icons.crossCircle}  alt="Default" />
                        <img src={icons.marked}  alt="Default" />
                        <img src={icons.checkCircle}  alt="Default" />
                    </>
                );
        }
    };

    const getReasonStyle = (status) => {
        switch (status) {
            case 'rejected':
                return { color: '#FC5275' };
            case 'flaged':
                return { color: '#FFC107' };
            case 'approved':
                return { color: '#A3D65C' };
            case 'waiting':
                return { color: '#FFA500' };
            default:
                return {};
        }
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
                    {guests.map((guest, index) => (
                        <div className="grid_view_tableContBodyEachRow" key={index}>
                            <div className="grid_view_tbalebody">
                                <img src={icons.dummyUser} alt="user-image" />
                            </div>
                            <div className="grid_view_tbalebody">{guest.name}</div>
                            <div className="grid_view_tbalebody">
                                {getStatusIcon(guest.status)}
                            </div>
                            <div className="grid_view_tbalebody" style={getReasonStyle(guest.status)}>
                                {guest.reason}
                            </div>
                            <div className="grid_view_tbalebody">{guest.noOfGuestsMember}</div>
                            <div className="grid_view_tbalebody">
                                <CommonButton
                                    buttonName="Approve"
                                    buttonWidth="auto"
                                    style={{ backgroundColor: '#ECF8DB', color: '#A3D65C', borderColor: '#A3D65C', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '5px 20px' }}
                                    onClick={() => onApprove(guest)}
                                />
                                <CommonButton
                                    buttonName="Reject"
                                    buttonWidth="auto"
                                    style={{ backgroundColor: '#FFBDCB', color: '#FC5275', borderColor: '#FC5275', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '5px 20px' }}
                                    onClick={() => onReject(guest)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApproveGuestsGridView;
