// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Header from '../ui/header/Header';
// import Sidebar from '../ui/sidebar/Sidebar';
// import './Layout.scss'; // Import the SCSS file

// const Layout = () => {
//     const location = useLocation();
//     const isDashboard = location.pathname === '/dashboard';

//     return (
//         <div className="layout-container">
//             <Sidebar />
//             <div className={`content ${isDashboard ? 'dashboard' : ''}`}>
//                 <Header />
//                 <div className="outlet">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Layout;

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/header/Header";
import RoleBasedSidebar from "../ui/RoleBasedSidebar/RoleBasedSidebar";
import { useAuthStore } from "../../../store/authStore";
import "./Layout.scss";

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
  const user = useAuthStore(state => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define the paths where elements should be hidden
  const hideElements = ["/donation", "/donationdetail", "/deeksha"].includes(
    pathname
  );

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container">
      <RoleBasedSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`content ${pathname === "/dashboard" ? "dashboard" : ""} ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <Header hideElements={hideElements} />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
