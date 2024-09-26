import React, { useState } from "react";
import "./Requests.scss";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import SearchBar from "../../../components/ui/SearchBar";
import icons from "../../../constants/icons";
import ApproveGuests from "../approveGuests/ApproveGuests";
import ApproveGuestsGridView from "../approveGuests/ApproveGuestsGridView";
import DefaulView from "../requests/StatusTabNavigation/defaultView/DefaultView";
import GridView from "../requests/StatusTabNavigation/gridView/GridView";

const Requests = () => {
    const [isGuestsGridViewVisible, setIsGuestsGridViewVisible] = useState(false);
    const [activeToggler, setActiveToggler] = useState("dashboard");
    const [activeTab, setActiveTab] = useState("all");

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
        { label: "All", id: "all", Requests: 4 },
        { label: "Approved", id: "approved", Requests: 4 },
        { label: "On hold", id: "onHold", Requests: 4 },
        { label: "Rejected", id: "rejected", Requests: 4 },
        { label: "Pending", id: "pending", Requests: 4 },
        { label: "Rescheduled", id: "rescheduled", Requests: 4 },
        { label: "Cancelled", id: "cancelled", Requests: 4 },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    // Function to render tab content based on active tab
    const renderTabContent = () => {
        if (activeTab === "all") {
            return isGuestsGridViewVisible ? <ApproveGuestsGridView /> : <ApproveGuests />;
        }  else {
            return (
                <div>
                    {!isGuestsGridViewVisible ? <DefaulView tabLabels={activeTab} /> : <GridView tabLabels={activeTab} />}
                </div>
            );
        }
    };

    return (
        <>
            <div className="top-section">
                <CommonHeaderTitle title="Requests" />
                <div className="toggler" style={{ display: "flex", gap: "30px" }}>
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
                        borderTopLeftRadius: activeTab === "all" ? "0px" : "15px",
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
