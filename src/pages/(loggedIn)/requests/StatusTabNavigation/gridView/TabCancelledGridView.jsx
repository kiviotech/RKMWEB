import React, { useEffect, useState } from 'react';
import { icons } from '../../../../../constants';
import CommonButton from '../../../../../components/ui/Button';
import { getBookingRequestsByStatus } from '../../../../../../services/src/api/repositories/bookingRequestRepository';
import { useNavigate } from 'react-router-dom';
import "./GridView.scss"


const TabCancelledGridView = ({ selectedDate }) => {
    let navigate=useNavigate()
    const [ guests, setGuests ]= useState([]);
    const [filteredGuests, setFilteredGuests] = useState([]);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const data = await getBookingRequestsByStatus('canceled'); // Fetch only 'approved' guests
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


    const onApprove = (guest) => {
        console.log('Approved guest:', guest);
    };

    const onReject = (guest) => {
        console.log('Rejected guest:', guest);
    };

    // const gotoAllocateRoomPage=()=>{
    //     navigate('/book-room')        
    // }

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
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default TabCancelledGridView;