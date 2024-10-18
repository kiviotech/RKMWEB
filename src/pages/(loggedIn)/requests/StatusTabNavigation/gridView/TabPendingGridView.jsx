import React, { useEffect, useState } from 'react';
import icons from '../../../../../constants/icons';
import CommonButton from '../../../../../components/ui/Button';
import { getBookingRequestsByStatus, updateBookingRequest } from '../../../../../../services/src/api/repositories/bookingRequestRepository';
import "./GridView.scss"


const TabPendingGridView = ({ selectedDate }) => {

    const [guests, setGuests] = useState([]);
    const [filteredGuests, setFilteredGuests] = useState([]);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const data = await getBookingRequestsByStatus('awaiting'); // Fetch only 'awaiting' requests
                const bookingData = data?.data?.data;
                console.log(bookingData)

                if (bookingData) {
                    const guestsList = bookingData.map(item => ({
                        id: item.id,
                        name: item.attributes.name,
                        createdAt: new Date(item.attributes.createdAt),
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
                                <img src={icons.person} alt="user-image"/>
                            </div>
                            <div className="grid_view_tbalebody">{guest.name}</div>
                            <div className="grid_view_tbalebody">
                                {getStatusIcon(guest.status)}
                            </div>

                            <div className="grid_view_tbalebody">{guest.reason}</div>
                            <div className="grid_view_tbalebody">{guest.noOfGuestsMember}</div>

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

export default TabPendingGridView;
