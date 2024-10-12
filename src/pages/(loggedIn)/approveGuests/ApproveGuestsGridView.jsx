import React, { useEffect, useState } from 'react';
import './ApproveGuestsGridView.scss';
import icons from '../../../constants/icons';
import CommonButton from '../../../components/ui/Button';
import { getBookingRequests } from '../../../../services/src/api/repositories/bookingRequestRepository';

const ApproveGuestsGridView = ({ selectedDate }) => {
    const [guests, setGuests] = useState([]);
    const [filteredGuests, setFilteredGuests] = useState([]);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const data = await getBookingRequests('awaiting'); // Fetch only 'awaiting' requests
                const bookingData = data?.data?.data;

                if (bookingData) {
                    const guestsList = bookingData.map(item => ({
                        id: item.id,
                        name: item.attributes.name,
                        reason: item.attributes.reason || 'No reason provided',
                        status: item.attributes.approved ? 'approved' : 'awaiting',
                        bed: item.attributes.assignBed || 'N/A',
                        noOfGuestsMember: item.attributes.number_of_guest_members || '0',
                        date: new Date(item.attributes.createdAt),
                    }));

                    setGuests(guestsList);
                    setFilteredGuests(guestsList); // Initialize filtered guests
                }
            } catch (error) {
                console.error('Error fetching guests:', error);
            }
        };

        fetchGuests();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const filtered = guests.filter(guest => new Date(guest.date).toDateString() === selectedDate.toDateString());
            setFilteredGuests(filtered);
        } else {
            setFilteredGuests(guests); // Show all if no date selected
        }
    }, [selectedDate, guests]);

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
                    <div className="grid_view_tableheader">Reason</div>
                    <div className="grid_view_tableheader">No. of guest members</div>
                    <div className="grid_view_tableheader"></div>
                </div>
                <div className="grid_view_tableContBody">
                    {filteredGuests.map((guest, index) => (
                        <div className="grid_view_tableContBodyEachRow" key={index}>
                            <div className="grid_view_tbalebody">
                                <img src={icons.dummyUser} alt="user-image" />
                            </div>
                            <div className="grid_view_tbalebody">{guest.name}</div>
                            <div className="grid_view_tbalebody">
                                {getStatusIcon(guest.status)}
                            </div>
                            <div className="grid_view_tbalebody">{guest.reason}</div>
                            <div className="grid_view_tbalebody">{guest.noOfGuestsMember}</div>
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
                                    onClick={() => onApprove(guest)}
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
