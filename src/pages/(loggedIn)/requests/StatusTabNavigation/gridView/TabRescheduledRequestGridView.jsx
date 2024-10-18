import React, { useEffect, useState } from 'react';
import { icons } from '../../../../../constants';
import CommonButton from '../../../../../components/ui/Button';
import { getBookingRequestsByStatus, updateBookingRequest } from '../../../../../../services/src/api/repositories/bookingRequestRepository';
import { useNavigate } from 'react-router-dom';

const TabRescheduledRequestGridView = ({ selectedDate }) => {
    let navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [filteredGuests, setFilteredGuests] = useState([]);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const data = await getBookingRequestsByStatus('rescheduled'); // Fetch only 'rescheduled' guests
                const bookingData = data?.data?.data;

                if (bookingData) {
                    const guestsList = bookingData.map(item => ({
                        id: item.id,
                        name: item.attributes.name,
                        createdAt: new Date(item.attributes.createdAt),
                        status: item.attributes.approved ? 'approved' : 'awaiting',
                        bed: item.attributes.assignBed || 'N/A',
                        noOfGuestsMember: item.attributes.number_of_guest_members || '0',
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
            const filtered = guests.filter(guest => new Date(guest.createdAt).toDateString() === selectedDate.toDateString());
            setFilteredGuests(filtered);
        } else {
            setFilteredGuests(guests); // Show all if no date selected
        }
    }, [selectedDate, guests]);

    // Function to handle status changes (approve, put on hold, reject)
    const handleStatusChange = async (guestId, newStatus) => {
        try {
            const updatedData = {
                data: {
                    status: newStatus,
                },
            };

            // Call the API to update the guest's booking request status
            await updateBookingRequest(guestId, updatedData);

            // Update the state to reflect the new status
            setGuests((prevGuests) =>
                prevGuests.map((guest) =>
                    guest.id === guestId
                        ? { ...guest, status: newStatus }
                        : guest
                )
            );
        } catch (error) {
            console.error(`Failed to update the guest status to ${newStatus}:`, error);
        }
    };

    const gotoAllocateRoomPage = () => {
        navigate('/book-room');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" />
                        <img src={icons.marked} alt="Default" />
                        <img src={icons.checkCircleMarked} alt="Approved" />
                    </>
                );
            case 'awaiting':
                return (
                    <>
                        <img src={icons.crossCircle} alt="Default" />
                        <img src={icons.marked} alt="Default" />
                        <img src={icons.checkCircle} alt="Default" />
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
                    {filteredGuests.map((guest, index) => (
                        <div className="grid_view_tableContBodyEachRow" key={index}>
                            <div className="grid_view_tbalebody">
                                <img src={icons.person} alt="user-image" />
                            </div>
                            <div className="grid_view_tbalebody">{guest.name}</div>
                            <div className="grid_view_tbalebody">
                                {getStatusIcon(guest.status)}
                            </div>
                            <div className="grid_view_tbalebody" style={{ textAlign: 'center' }}>{guest.noOfGuestsMember}</div>
                            <div className="grid_view_tbalebody">{guest.bed}</div>
                            <div className="grid_view_tbalebody buttons">
                                <CommonButton
                                    buttonName="Approve"
                                    buttonWidth="30%"
                                    onClick={() => handleStatusChange(guest.id, "approved")}
                                    style={{
                                        backgroundColor: "#ECF8DB",
                                        color: "#A3D65C",
                                        borderColor: "#A3D65C",
                                        fontSize: "12px",
                                        borderRadius: "7px",
                                        borderWidth: 1,
                                        padding: 0
                                    }}
                                />
                                <CommonButton
                                    buttonName="Put on Hold"
                                    buttonWidth="40%"
                                    onClick={() => handleStatusChange(guest.id, "on_hold")}
                                    style={{
                                        backgroundColor: "#FFF4B2",
                                        color: "#F2900D",
                                        borderColor: "#F2900D",
                                        fontSize: "12px",
                                        borderRadius: "7px",
                                        borderWidth: 1,
                                    }}
                                />
                                <CommonButton
                                    buttonName="Reject"
                                    buttonWidth="30%"
                                    onClick={() => handleStatusChange(guest.id, "rejected")}
                                    style={{
                                        backgroundColor: "#FFBDCB",
                                        color: "#FC5275",
                                        borderColor: "#FC5275",
                                        fontSize: "12px",
                                        borderRadius: "7px",
                                        borderWidth: 1,
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

export default TabRescheduledRequestGridView;
