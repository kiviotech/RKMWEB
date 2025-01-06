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

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/header/Header";
import Sidebar from "../ui/sidebar/Sidebar";
import "./Layout.scss";

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;

  // Define the paths where elements should be hidden
  const hideElements = ["/donation", "/donationdetail", "/deeksha"].includes(
    pathname
  );

  return (
    <div className="layout-container">
      <Sidebar />
      <div
        className={`content ${pathname === "/dashboard" ? "dashboard" : ""}`}
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
