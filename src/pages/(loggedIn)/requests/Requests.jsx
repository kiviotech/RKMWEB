import React, { useState, useRef } from "react";
import "./Requests.scss";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import SearchBar from "../../../components/ui/SearchBar";
import icons from "../../../constants/icons";
import ApproveGuests from "../approveGuests/ApproveGuests";
import ApproveGuestsGridView from "../approveGuests/ApproveGuestsGridView";
import DefaulView from "../requests/StatusTabNavigation/defaultView/DefaultView";
import GridView from "../requests/StatusTabNavigation/gridView/GridView";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApprovedGuestsGridView from './StatusTabNavigation/gridView/TabApprovedGuestsGridView'
import AppreovedGuests from "../requests/StatusTabNavigation/defaultView/AppreovedGuests"

const Requests = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [isGuestsGridViewVisible, setIsGuestsGridViewVisible] = useState(false);
    const [activeToggler, setActiveToggler] = useState("dashboard");
    const [activeTab, setActiveTab] = useState("pending");

    // Common styles for togglers
    const commonStyle = {
        cursor: "pointer",
        borderRadius: "5px",
    };

    // Determine styles for active and default states
    const getStyle = (view) => ({
        ...commonStyle,
        background: activeToggler === view ? "var(--primary-color)" : "transparent",
    });

    // Define your icons here
    const togglers = {
        dashboard: {
            default: icons.toggglerDashboard,
            active: icons.toggglerDashboardWite,
        },
        gridView: {
            default: icons.togglerGridView,
            active: icons.togglerGridViewWhite,
        },
    };

    const handleTogglerClick = (view) => {
        setActiveToggler(view);
        setIsGuestsGridViewVisible(view === "gridView");
    };

    // Tabs configuration
    const tabs = [
        { label: "Pending", id: "pending", Requests: 4 },
        { label: "Rescheduled", id: "rescheduled", Requests: 4 },
        { label: "Cancelled", id: "cancelled", Requests: 4 },
        { label: "Approved", id: "approved", Requests: 4 },
        { label: "On hold", id: "onHold", Requests: 4 },
        { label: "Rejected", id: "rejected", Requests: 4 },

    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    // Function to render tab content based on active tab
    const renderTabContent = () => {
        if (activeTab === "pending") {
            return isGuestsGridViewVisible ? <ApproveGuestsGridView selectedDate={startDate} /> : <ApproveGuests selectedDate={startDate} />;
        } else if (activeTab === "approved") {
            return isGuestsGridViewVisible ? <ApprovedGuestsGridView /> : <AppreovedGuests />;
        } else {
            return (
                <div>
                    {!isGuestsGridViewVisible ? <DefaulView tabLabels={activeTab} /> : <GridView tabLabels={activeTab} />}
                </div>
            );
        }
    };



    // Use a ref to access the DatePicker instance
    const datePickerRef = useRef(null);

    // Function to handle SVG icon click
    const handleIconClick = () => {
        datePickerRef.current.setOpen(true);  // Open the DatePicker
    };
    return (
        <>
            <div className="top-section">
                <CommonHeaderTitle title="Requests" />
                <div className="toggler" style={{ display: "flex", gap: "30px" }}>
                    <div style={{ position: 'relative', display: "flex", alignItems: 'center', marginTop: '-20px' }}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd'th' MMMM, yyyy"
                            customInput={
                                <input
                                    type="text"
                                    value={`${startDate.getDate()}th ${startDate.toLocaleString('default', { month: 'long' })}, ${startDate.getFullYear()}`}
                                    readOnly
                                />
                            }
                            ref={datePickerRef}  // Attach the ref here
                        />
                        {/* SVG Icon */}
                        <svg
                            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}  // Add cursor pointer for better UX
                            onClick={handleIconClick}  // Attach the click handler
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="20"
                            viewBox="0 0 18 20"
                            fill="none"
                        >
                            <path
                                d="M15.3 2H14.4V1C14.4 0.734784 14.3052 0.48043 14.1364 0.292893C13.9676 0.105357 13.7387 0 13.5 0C13.2613 0 13.0324 0.105357 12.8636 0.292893C12.6948 0.48043 12.6 0.734784 12.6 1V2H5.4V1C5.4 0.734784 5.30518 0.48043 5.1364 0.292893C4.96761 0.105357 4.73869 0 4.5 0C4.26131 0 4.03239 0.105357 3.8636 0.292893C3.69482 0.48043 3.6 0.734784 3.6 1V2H2.7C1.98392 2 1.29716 2.31607 0.790812 2.87868C0.284464 3.44129 0 4.20435 0 5V17C0 17.7956 0.284464 18.5587 0.790812 19.1213C1.29716 19.6839 1.98392 20 2.7 20H15.3C16.0161 20 16.7028 19.6839 17.2092 19.1213C17.7155 18.5587 18 17.7956 18 17V5C18 4.20435 17.7155 3.44129 17.2092 2.87868C16.7028 2.31607 16.0161 2 15.3 2ZM16.2 17C16.2 17.2652 16.1052 17.5196 15.9364 17.7071C15.7676 17.8946 15.5387 18 15.3 18H2.7C2.4613 18 2.23239 17.8946 2.0636 17.7071C1.89482 17.5196 1.8 17.2652 1.8 17V8H16.2V17ZM16.2 6H1.8V5C1.8 4.73478 1.89482 4.48043 2.0636 4.29289C2.23239 4.10536 2.4613 4 2.7 4H15.3C15.5387 4 15.7676 4.10536 15.9364 4.29289C16.1052 4.48043 16.2 4.73478 16.2 5V6Z"
                                fill="#98A2AF"
                            />
                        </svg>
                    </div>

                    <div className="toggleGridView">
                        {/* Dashboard Toggler */}
                        <img
                            src={activeToggler === "dashboard" ? togglers.dashboard.active : togglers.dashboard.default}
                            alt="Dashboard"
                            onClick={() => handleTogglerClick("dashboard")}
                            style={getStyle("dashboard")}
                        />
                        {/* Grid View Toggler */}
                        <img
                            src={activeToggler === "gridView" ? togglers.gridView.active : togglers.gridView.default}
                            alt="Grid View"
                            onClick={() => handleTogglerClick("gridView")}
                            style={getStyle("gridView")}
                        />
                    </div>
                    <SearchBar />
                </div>
            </div>

            <div className="tabs-container">
                <ul className="tabs-list">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.label}
                            {activeTab === tab.id && <span> ({tab.Requests})</span>}
                        </li>
                    ))}
                </ul>

                {/* Render content based on active tab */}
                <div
                    className="tab-content"
                    style={{
                        borderTopLeftRadius: activeTab === "pending" ? "0px" : "15px",
                        borderTopRightRadius: "15px",
                        borderBottomLeftRadius: "15px",
                        borderBottomRightRadius: "15px",
                        border: "2px solid #B6C2D3",
                        padding: "3rem",
                    }}
                >
                    {renderTabContent()}
                </div>
            </div>
        </>
    );
};

export default Requests;
