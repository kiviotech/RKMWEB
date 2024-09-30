import React from 'react';
import { icons } from '../../../../../constants';
import CommonButton from '../../../../../components/ui/Button';

const guests = [
    { name: 'Mrs. John Dee', status: 'approved', bed: 'Bed 305, 304', noOfGuestsMember: '1' },
    { name: 'Mrs. John Dee', status: 'approved', bed: 'Bed 305, 304', noOfGuestsMember: '2' },
    { name: 'Mrs. John Dee', status: 'approved', bed: '', noOfGuestsMember: '7' },
    { name: 'Mrs. John Dee', status: 'approved', bed: 'Bed 305, 304', noOfGuestsMember: '90' },
];

const TabApprovedGuestsGridView = () => {
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
                        <img src={icons.marked} alt="Default" />
                        <img src={icons.checkCircle} alt="Default" />
                    </>
                );
            case 'flaged':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" />
                        <img src={icons.markedYellow} alt="Flagged" />
                        <img src={icons.checkCircle} alt="Default" />
                    </>
                );
            case 'approved':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" />
                        <img src={icons.marked} alt="Default" />
                        <img src={icons.checkCircleMarked} alt="Approved" />
                    </>
                );
            default:
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" />
                        <img src={icons.marked} alt="Default" />
                        <img src={icons.checkCircle} alt="Default" />
                    </>
                );
        }
    };


    return (
        <div className="grid_view_visit-history">
            <div className="grid_view_tableCont">
                <div className="grid_view_tableContHeader">
                    <div className="grid_view_tableheader"></div>
                    <div className="grid_view_tableheader">Name</div>
                    <div className="grid_view_tableheader">Status</div>

                    <div className="grid_view_tableheader" style={{ minWidth: "200px" }}>No. of guest members</div>
                    <div className="grid_view_tableheader">Bed(s)</div>

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

                            <div className="grid_view_tbalebody" style={{ textAlign: 'center' }}>{guest.noOfGuestsMember}</div>
                            <div className="grid_view_tbalebody">{guest.bed}</div>

                            <div className="grid_view_tbalebody">


                                <CommonButton
                                    buttonName="Change allocation"
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
                                />

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default TabApprovedGuestsGridView;