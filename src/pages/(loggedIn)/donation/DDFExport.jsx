import React, { useState, useRef, useEffect } from "react";
import "./DDFExport.scss";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import * as XLSX from "xlsx";
import missionLogo from "../../../constants/icons";
import DDFPreview from "./DDFPreview";

const DDFExport = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const formatDDFData = async (type, quarter) => {
    try {
      const currentYear = new Date().getFullYear();

      // Set date ranges based on quarter
      let startDate, endDate;
      switch (quarter) {
        case "Apr-Jun 1st Qtr":
          startDate = `${currentYear}-04-01`;
          endDate = `${currentYear}-06-30`;
          break;
        case "July-Sept 2nd Qtr":
          startDate = `${currentYear}-07-01`;
          endDate = `${currentYear}-09-30`;
          break;
        case "Oct-Dec 3rd Qtr":
          startDate = `${currentYear}-10-01`;
          endDate = `${currentYear}-12-31`;
          break;
        case "Jan-Mar 4th Qtr":
          // For Jan-Mar, use the next year since it's the last quarter of the fiscal year
          startDate = `${currentYear + 1}-01-01`;
          endDate = `${currentYear + 1}-03-31`;
          break;
        default:
          return [];
      }

      // Fetch all completed donations
      const response = await fetchDonations({
        status: "COMPLETED",
        type: type === "80G" ? "SECTION_80G" : "NON_80G",
      });

      // Filter donations based on date range and transaction type
      let filteredDonations = Array.isArray(response.data)
        ? response.data.filter((donation) => {
            const transactionType = donation.attributes?.transactionType;
            const donationDate =
              donation.attributes?.receipt_detail?.data?.attributes
                ?.donation_date;

            // Check if donation date falls within the specific quarter
            const isInDateRange =
              donationDate >= startDate && donationDate <= endDate;

            // Filter by transaction type - SWAPPED CONDITIONS
            const hasValidTransactionType =
              type === "80G"
                ? ["Cheque", "Bank Transfer", "DD"].includes(transactionType)
                : ["Cash", "M.O"].includes(transactionType);

            return isInDateRange && hasValidTransactionType;
          })
        : [];

      // Combine donations with same unique_no with cumulative totals
      const uniqueDonations = {};
      filteredDonations.forEach((donation) => {
        const uniqueNo =
          donation.attributes?.receipt_detail?.data?.attributes?.unique_no;
        if (uniqueNo) {
          if (!uniqueDonations[uniqueNo]) {
            uniqueDonations[uniqueNo] = { ...donation };
          } else {
            // Add to running total from April 1st
            const currentAmount =
              parseFloat(uniqueDonations[uniqueNo].attributes.donationAmount) ||
              0;
            const newAmount =
              parseFloat(donation.attributes.donationAmount) || 0;
            uniqueDonations[uniqueNo].attributes.donationAmount = (
              currentAmount + newAmount
            ).toString();
          }
        }
      });

      return Object.values(uniqueDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  const handleDDFExport = async (type, quarter) => {
    try {
      const donations = await formatDDFData(type, quarter);

      if (!donations || donations.length === 0) {
        alert("No donations found for the selected period");
        return;
      }

      // Show preview instead of directly printing
      setPreviewData({
        donations,
        type,
        quarter,
      });
      setShowDropdown(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error generating preview. Please try again.");
    }
  };

  const handlePrintConfirm = () => {
    const { donations, type, quarter } = previewData;

    // Create a temporary div for printing
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <h2>DDF Report - ${type} (${quarter})</h2>
      <table>
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>ID</th>
            <th>Unique ID No.</th>
            ${type === "80G" && <th>Section Code</th>}
            <th>Name</th>
            <th>Address</th>
            <th>Type</th>
            <th>Mode</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${donations
            .map(
              (donation, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${
                donation.attributes?.guest?.data?.attributes?.aadhaar_number ||
                ""
              }</td>
              <td>${
                donation.attributes?.receipt_detail?.data?.attributes
                  ?.unique_no || ""
              }</td>
              ${type === "80G" && `<td>Section 80G</td>`}
              <td>${
                donation.attributes?.guest?.data?.attributes?.name || ""
              }</td>
              <td>${
                donation.attributes?.guest?.data?.attributes?.address || ""
              }</td>
              <td>${donation.attributes?.type || ""}</td>
              <td>${donation.attributes?.transactionType || ""}</td>
              <td>₹${parseFloat(
                donation.attributes?.donationAmount || 0
              ).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>DDF Report</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    setPreviewData(null); // Close preview after printing
  };

  return (
    <>
      <div
        className="ddf-export-container"
        ref={dropdownRef}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button className="ddf-button">Export Report</button>
        {showDropdown && (
          <div className="ddf-dropdown">
            <div className="dropdown-item">
              <span>DDF - 80G</span>
              <div className="nested-dropdown">
                <button
                  className="quarter-button"
                  onClick={() => {
                    console.log("Clicked Apr-Jun 1st Qtr");
                    handleDDFExport("80G", "Apr-Jun 1st Qtr");
                  }}
                >
                  Apr-Jun 1st Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "July-Sept 2nd Qtr")}
                >
                  July-Sept 2nd Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "Oct-Dec 3rd Qtr")}
                >
                  Oct-Dec 3rd Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "Jan-Mar 4th Qtr")}
                >
                  Jan-Mar 4th Qtr
                </button>
              </div>
            </div>
            <div className="dropdown-item">
              <span>DDF - Non-80G</span>
              <div className="nested-dropdown">
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("Non-80G", "Apr-Jun 1st Qtr")}
                >
                  Apr-Jun 1st Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() =>
                    handleDDFExport("Non-80G", "July-Sept 2nd Qtr")
                  }
                >
                  July-Sept 2nd Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("Non-80G", "Oct-Dec 3rd Qtr")}
                >
                  Oct-Dec 3rd Qtr
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("Non-80G", "Jan-Mar 4th Qtr")}
                >
                  Jan-Mar 4th Qtr
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {previewData && (
        <DDFPreview
          donations={previewData.donations}
          type={previewData.type}
          onConfirm={handlePrintConfirm}
          onCancel={() => setPreviewData(null)}
        />
      )}
    </>
  );
};

export default DDFExport;
