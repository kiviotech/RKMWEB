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
      const donations = Array.isArray(response)
        ? response
        : response.data || [];

      // Group donations by receipt mode and type
      const groupedDonations = donations.reduce((acc, donation) => {
        const mode = donation.attributes.transactionType;
        const type = donation.attributes.type;
        const key = `${mode}-${type}`;

        if (!acc[key]) {
          acc[key] = {
            mode,
            type,
            donations: [],
          };
        }
        acc[key].donations.push(donation);
        return acc;
      }, {});

      const printWindow = window.open("", "_blank");

      const htmlContent = `
        <html>
          <head>
            <title>Receipt List</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                line-height: 1.6;
              }
              .page-title {
                text-align: center;
                font-size: 16px;
                margin-bottom: 15px;
                line-height: 1.4;
              }
              .header-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              .header-table th {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                line-height: 1.4;
              }
              .section {
                margin-bottom: 15px;
              }
              .mode-type {
                margin-bottom: 10px;
                line-height: 1.8;
              }
              .mode-line {
                position: relative;
                padding-right: 150px; /* Space for the amount */
              }
              .amount-right {
                position: absolute;
                right: 0;
                font-weight: bold;
              }
              .purpose-group {
                margin-bottom: 15px;
              }
              .purpose-title {
                margin-bottom: 8px;
                line-height: 1.4;
                font-weight: bold;
              }
              .receipt-row {
                display: grid;
                grid-template-columns: 80px 100px 120px 120px 200px 100px;
                margin-bottom: 5px;
                border-bottom: 1px solid #eee;
                gap: 10px;
                line-height: 1.6;
                padding: 4px 0;
              }
              .amount {
                text-align: center;
                font-weight: bold;
                width: 100%;
                white-space: nowrap;
                padding-right: 10px;
              }
              .total {
                text-align: right;
                margin-top: 5px;
                margin-bottom: 10px;
                font-weight: bold;
              }
              .grand-total {
                text-align: center;
                margin-top: 20px;
                font-weight: bold;
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                padding: 15px 0;
                line-height: 1.4;
              }
              .grand-total-amount {
                float: right;
              }
              .mode-type-total {
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 5px;
                font-weight: bold;
                text-align: right;
              }
              .purpose-total {
                float: right;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="page-title">
              Receipt List For ${new Date().toLocaleDateString()} - Math Receipt
            </div>
            
            <table class="header-table">
              <tr>
                <th>Receipt No</th>
                <th>Receipt Date</th>
                <th>DD/CH No</th>
                <th>DD/CH/Bank Tr. Date</th>
                <th>Bank Name</th>
                <th>Amount</th>
              </tr>
            </table>

            ${Object.values(groupedDonations)
              .map(
                ({ mode, type, donations }) => `
              <div class="section">
                <div class="mode-type">
                  <div class="mode-line">
                    Receipt Mode: ${mode} <span class="amount-right">Rs. ${donations
                  .reduce(
                    (sum, donation) =>
                      sum + parseFloat(donation.attributes.donationAmount || 0),
                    0
                  )
                  .toFixed(2)}</span>
                  </div>
                  <div class="mode-line">
                    Type: ${type} <span class="amount-right">Rs. ${donations
                  .reduce(
                    (sum, donation) =>
                      sum + parseFloat(donation.attributes.donationAmount || 0),
                    0
                  )
                  .toFixed(2)}</span>
                  </div>
                </div>
                
                ${Object.entries(
                  donations.reduce((acc, curr) => {
                    const purpose = curr.attributes.purpose || "General";
                    if (!acc[purpose]) {
                      acc[purpose] = [];
                    }
                    acc[purpose].push(curr);
                    return acc;
                  }, {})
                )
                  .map(
                    ([purpose, purposeGroup]) => `
                  <div class="purpose-group">
                    <div class="purpose-title">Purpose: ${purpose} <span class="purpose-total">Rs. ${purposeGroup
                      .reduce(
                        (sum, donation) =>
                          sum +
                          parseFloat(donation.attributes.donationAmount || 0),
                        0
                      )
                      .toFixed(2)}</span></div>
                    ${purposeGroup
                      .map(
                        (donation) => `
                      <div class="receipt-row">
                        <div>${
                          donation.attributes.receipt_detail?.data?.attributes
                            ?.Receipt_number || ""
                        }</div>
                        <div>${new Date(
                          donation.attributes.createdAt
                        ).toLocaleDateString()}</div>
                        <div>${donation.attributes.ddch_date || ""}</div>
                        <div>${
                          donation.attributes.bankName
                            ? `${donation.attributes.bankName} - ${donation.attributes.ddch_number}`
                            : ""
                        }</div>
                        <div>${donation.attributes.donorName || ""}</div>
                        <div class="amount">Rs. ${
                          donation.attributes.donationAmount
                        }</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}

            <div class="grand-total">
              Grand Total (Including all payment modes):
              <span class="grand-total-amount">Rs. ${donations
                .reduce(
                  (sum, donation) =>
                    sum + parseFloat(donation.attributes.donationAmount || 0),
                  0
                )
                .toFixed(2)}</span>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = function () {
        printWindow.print();
      };
    } catch (error) {
      console.error("Error printing donations:", error);
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
