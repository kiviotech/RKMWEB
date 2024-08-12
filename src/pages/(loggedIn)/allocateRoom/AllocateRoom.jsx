import React from 'react';
import './AllocateRoom.scss';
import SearchBar from '../../../components/ui/SearchBar';
import CommonHeaderTitle from '../../../components/ui/CommonHeaderTitle';
import { icons } from '../../../constants';
import CommonButton from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
const AllocateRoomV2 = () => {
    const guests = [
        { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
        { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
        { name: 'Mr. John Dee', email: 'john.dee@gmail.com', Aadharno: 'john.dee@gmail.com' },
    ];
    const navigate = useNavigate();
    const navigateToPage = (url) => {
        navigate(url);
    };

    return (
        <div className="AllocateRoomV2-main-container">
            <div className="header">
                <CommonHeaderTitle title="Request" />
                <SearchBar />
            </div>
            <div className="allocateRoomV2-card-container">
                {guests.map((guest, index) => (
                    <div className="guest-card" key={index}>
                        <img
                            src={icons.userDummyImage}
                            alt="Guest Avatar"
                            className="avatar"
                        />
                        <h3>{guest.name}</h3>
                        <div className="guest-details">
                            <p> Email: <span>{guest.email}</span></p>
                            <p>Aadhar no: <span>{guest.Aadharno}</span></p>
                        </div>
                        <div className="buttons">
                            <CommonButton
                                onClick={() => navigateToPage('/book-room')}
                                buttonName="Allocate Room"
                                buttonWidth="auto"
                                style={{
                                    backgroundColor: '#9866E9',
                                    borderColor: 'none',
                                    fontSize: '18px',
                                    borderRadius: '7px',
                                    borderWidth: 0,
                                    padding: '8px 30px'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllocateRoomV2;
