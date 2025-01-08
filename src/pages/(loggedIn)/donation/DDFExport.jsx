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
  const currentYear = new Date().getFullYear();

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

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await fetchDonations({});
        console.log("DDFEXPORT:", response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchAllDonations();
  }, []);

  const formatDDFData = async (type, quarter) => {
    try {
      const response = await fetchDonations({
        status: "COMPLETED",
        type: type === "80G" ? "SECTION_80G" : "NON_80G",
      });

      if (!Array.isArray(response.data)) return [];

      // Define quarter date ranges with cumulative ranges
      const getQuarterDateRange = (quarter) => {
        const currentYear = new Date().getFullYear();
        switch (quarter) {
          case "Apr-Jun 1st Qtr":
            return {
              start: `${currentYear}-04-01`,
              end: `${currentYear}-06-30`,
            };
          case "July-Sept 2nd Qtr":
            return {
              start: `${currentYear}-04-01`,
              end: `${currentYear}-09-30`,
            }; // From April to Sept
          case "Oct-Dec 3rd Qtr":
            return {
              start: `${currentYear}-04-01`,
              end: `${currentYear}-12-31`,
            }; // From April to Dec
          case "Jan-Mar 4th Qtr":
            return {
              start: `${currentYear}-01-01`,
              end: `${currentYear}-03-31`,
            }; // Only Jan to Mar (no cumulative for now)
          default:
            return null;
        }
      };

      const dateRange = getQuarterDateRange(quarter);

      // Filter donations based on payment method and date
      const filteredDonations = response.data.filter((donation) => {
        const paymentMethod =
          donation.attributes?.transactionType?.toUpperCase();
        const donationDate =
          donation.attributes?.receipt_detail?.data?.attributes?.donation_date;

        // Check if donation date is within the cumulative range
        const isInRange =
          donationDate &&
          donationDate >= dateRange.start &&
          donationDate <= dateRange.end;

        if (!isInRange) return false;

        if (type === "80G") {
          return ["DD", "BANK_TRANSFER", "CHEQUE"].includes(paymentMethod);
        } else {
          return ["CASH", "MONEY_ORDER", "MO"].includes(paymentMethod);
        }
      });

      // Group donations by guest and sum their amounts
      const groupedDonations = filteredDonations.reduce((acc, donation) => {
        const guestId = donation.attributes?.guest?.data?.id;
        if (!guestId) return acc;

        if (!acc[guestId]) {
          acc[guestId] = { ...donation };
        } else {
          // Sum up the donation amounts
          const currentAmount = parseFloat(
            acc[guestId].attributes?.donationAmount || 0
          );
          const newAmount = parseFloat(
            donation.attributes?.donationAmount || 0
          );
          acc[guestId].attributes.donationAmount = (
            currentAmount + newAmount
          ).toString();
        }
        return acc;
      }, {});

      // Convert grouped donations back to array
      return Object.values(groupedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  const handleDDFExport = async (type, quarter) => {
    try {
      const donations = await formatDDFData(type, quarter);

      if (!donations || donations.length === 0) {
        alert("No donations found for the selected quarter");
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
                  onClick={() => handleDDFExport("80G", "Apr-Jun 1st Qtr")}
                >
                  Apr-Jun 1st Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "July-Sept 2nd Qtr")}
                >
                  July-Sept 2nd Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "Oct-Dec 3rd Qtr")}
                >
                  Oct-Dec 3rd Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("80G", "Jan-Mar 4th Qtr")}
                >
                  Jan-Mar 4th Qtr ({currentYear})
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
                  Apr-Jun 1st Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() =>
                    handleDDFExport("Non-80G", "July-Sept 2nd Qtr")
                  }
                >
                  July-Sept 2nd Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("Non-80G", "Oct-Dec 3rd Qtr")}
                >
                  Oct-Dec 3rd Qtr ({currentYear})
                </button>
                <button
                  className="quarter-button"
                  onClick={() => handleDDFExport("Non-80G", "Jan-Mar 4th Qtr")}
                >
                  Jan-Mar 4th Qtr ({currentYear})
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
