import React, { useState, useEffect, useRef } from "react";
import AllDonation from "./AllDonation";
import "./AllDonationDetails.scss";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import ExportDonations from "./ExportDonations";
import DDFExport from "./DDFExport";
import { useAuthStore } from "../../../../store/authStore";

const AllDonationDetails = () => {
  const location = useLocation();
  const donationData = location.state?.donationData;
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [donatedFor, setDonatedFor] = useState("ALL");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    receiptNumber: true,
    donorName: true,
    donationDate: true,
    phoneNumber: true,
    donatedFor: true,
    donationStatus: true,
    donationAmount: true,
    action: true,
  });
  const filterDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateRange({
      startDate: today,
      endDate: today,
    });

    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCurrentPage(1);

    if (name === "startDate") {
      setDateRange((prev) => ({
        ...prev,
        startDate: value,
        endDate:
          prev.endDate && new Date(value) > new Date(prev.endDate)
            ? value
            : prev.endDate,
      }));
    } else if (name === "endDate") {
      setDateRange((prev) => ({
        ...prev,
        endDate: value,
        startDate:
          prev.startDate && new Date(value) < new Date(prev.startDate)
            ? value
            : prev.startDate,
      }));
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDonatedForChange = (e) => {
    setDonatedFor(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    setCurrentPage(1);

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      setDateRange({
        startDate: today,
        endDate: today,
      });
    } else {
      setDateRange({
        startDate: "",
        endDate: "",
      });
    }
  };

  return (
    <div className="all-donation-details">
      <div className="header-container">
        <h1 className="page-title">
          {timeFilter === "today" ? "Today Donations" : "All Donations"}
        </h1>
        <div className="export-buttons">
          {user?.user_role === "superadmin" && <DDFExport />}
          <ExportDonations timeFilter={timeFilter} />
        </div>
      </div>
      <div className="donation-header">
        <div className="left-section">
          <div className="time-filter-buttons">
            <button
              className={`filter-button ${
                timeFilter === "today" ? "active" : ""
              }`}
              onClick={() => handleTimeFilterChange("today")}
            >
              Today Donations
            </button>
            <button
              className={`filter-button ${
                timeFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleTimeFilterChange("all")}
            >
              All Donations
            </button>
          </div>
          <span className="sort-by">Filtered by</span>
          <select
            className="status-dropdown"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="ALL">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            className="donated-for-dropdown"
            value={donatedFor}
            onChange={handleDonatedForChange}
          >
            <option value="ALL">All</option>
            <option value="MATH">Math</option>
            <option value="MISSION">Mission</option>
          </select>
        </div>

        <div className="right-section">
          {timeFilter !== "today" && (
            <div className="date-range">
              <span>From</span>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
              <span>To</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
          )}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="filter-dropdown-container">
              <button
                className="filter-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterPopup(!showFilterPopup);
                }}
              >
                <span className="material-icons-outlined">tune</span>
              </button>
              {showFilterPopup && (
                <div className="filter-dropdown" ref={filterDropdownRef}>
                  <div className="filter-options">
                    {Object.entries(filterOptions).map(([field, checked]) => (
                      <label key={field} className="filter-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleFilterChange(field)}
                        />
                        <span>
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="filter-actions">
                    <button
                      className="reset-btn"
                      onClick={() =>
                        setFilterOptions(
                          Object.fromEntries(
                            Object.keys(filterOptions).map((key) => [key, true])
                          )
                        )
                      }
                    >
                      Reset
                    </button>
                    <button
                      className="apply-btn"
                      onClick={() => setShowFilterPopup(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AllDonation
        searchTerm={searchTerm}
        dateRange={dateRange}
        selectedStatus={selectedStatus}
        donatedFor={donatedFor}
        filterOptions={filterOptions}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setTotalPages={setTotalPages}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;

            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`pagination-btn ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }

            if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="ellipsis">
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDonationDetails;
