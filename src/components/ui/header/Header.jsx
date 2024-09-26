import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.scss'; // Using SCSS for styling
import icons from '../../../constants/icons';

const Header = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="logo">Logo</div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/check-in" className={({ isActive }) => isActive ? 'active' : ''}>
                        Check-in Details
                        {location.pathname === '/check-in' && (
                            <button className="close-button" style={{ fontSize: '18px' }}>&times;</button>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/check-out" className={({ isActive }) => isActive ? 'active' : ''}>
                        Check-out Details
                        {location.pathname === '/check-out' && (
                            <button className="close-button" style={{ fontSize: '18px' }}>&times;</button>
                        )}
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/Requests" className={({ isActive }) => isActive ? 'active' : ''}>
                        Requests  {location.pathname === '/Requests' && (
                            <button className="close-button" style={{ fontSize: '18px' }}>&times;</button>
                        )}
                    </NavLink>
                </li>

                {location.pathname === '/book-room' && (
                    <li>
                        <NavLink
                            to="/book-room"
                            className={({ isActive }) =>
                                isActive ||
                                    location.pathname === '/approve-guests' ||
                                    location.pathname === '/book-room'
                                    ? 'active'
                                    : ''
                            }
                        >
                            Allocate rooms
                            {(location.pathname === '/approve-guests' || location.pathname === '/book-room') && (
                                <button className="close-button" style={{ fontSize: '18px' }}>&times;</button>
                            )}
                        </NavLink>
                    </li>
                )}


            </ul>
            <div className="notification-icon">
                <img className='notification' src={icons.notification} alt="Notifications" />
                <img className='user-image' src={icons.dummyUser} alt="dummy-user" />
            </div>
        </nav>
    );
};

export default Header;