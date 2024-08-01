import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../ui/header/Header';
import Sidebar from '../ui/sidebar/Sidebar';
import './Layout.scss'; // Import the SCSS file

const Layout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
