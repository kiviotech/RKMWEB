import React, { useState, useEffect, useRef } from "react";
import AllDonation from "./AllDonation";
import "./AllDonationDetails.scss";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import * as XLSX from "xlsx";

const AllDonationDetails = () => {
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

  useEffect(() => {
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

  useEffect(() => {
    const handleExport = async () => {
      try {
        const data = await fetchDonations();
        console.log("Export data:", data);
      } catch (error) {
        console.error("Error exporting donations:", error);
      }
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setDateRange((prev) => ({
        ...prev,
        startDate: value,
        // If end date exists and is before new start date, update end date
        endDate:
          prev.endDate && new Date(value) > new Date(prev.endDate)
            ? value
            : prev.endDate,
      }));
    } else if (name === "endDate") {
      setDateRange((prev) => ({
        ...prev,
        endDate: value,
        // If start date exists and is after new end date, update start date
        startDate:
          prev.startDate && new Date(value) < new Date(prev.startDate)
            ? value
            : prev.startDate,
      }));
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleDonatedForChange = (e) => {
    setDonatedFor(e.target.value);
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

  const handleExport = async () => {
    try {
      const response = await fetchDonations();
      console.log("Raw Receipt Details:", response);

      const data = response.data.map((item) => ({
        ID: item.id,
        InMemoryOf: item.attributes?.InMemoryOf || "N/A",
        BankName: item.attributes?.bankName || "N/A",
        CreatedAt: item.attributes?.createdAt || "N/A",
        Date: item.attributes?.ddch_date || "N/A",
        Number: item.attributes?.ddch_number || "N/A",
        Amount: item.attributes?.donationAmount || "N/A",
        For: item.attributes?.donationFor || "N/A",
        Status: item.attributes?.status || "N/A",
        TransactionType: item.attributes?.transactionType || "N/A",
        UpdatedAt: item.attributes?.updatedAt || "N/A",
      }));

      console.log("Transformed Data:", data);

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

      XLSX.writeFile(workbook, "Donations.xlsx");
    } catch (error) {
      console.error("Error exporting donations:", error);
    }
  };

  return (
    <div className="all-donation-details">
      <div className="header-container">
        <h1 className="page-title">All Donation</h1>
        <button className="export-btn" onClick={handleExport}>
          <span className="download-icon">↓</span> Export Donations
        </button>
      </div>
      <div className="donation-header">
        <div className="left-section">
          <span className="sort-by">Sort by</span>
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
            <option value="MATH">Math Donation</option>
            <option value="MISSION">Ramakrishna Mission</option>
          </select>
        </div>

        <div className="right-section">
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
          <div className="search-container">
            <input
              type="text"
              placeholder="Search in table"
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

            // Always show first page, last page, current page, and pages around current page
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

            // Show ellipsis for skipped pages
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
