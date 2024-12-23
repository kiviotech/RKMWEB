import React, { useState, useRef, useEffect } from "react";
import "./DDFExport.scss";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import * as XLSX from "xlsx";

const DDFExport = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
      // Parse quarter dates
      let startDate, endDate;
      switch (quarter) {
        case "Apr-Jun 1st Qtr":
          startDate = "2023-04-01";
          endDate = "2023-06-30";
          break;
        case "July-Sept 2nd Qtr":
          startDate = "2023-07-01";
          endDate = "2023-09-30";
          break;
        case "Oct-Dec 3rd Qtr":
          startDate = "2023-10-01";
          endDate = "2023-12-31";
          break;
        default:
          return [];
      }

      // Fetch donations for the selected quarter
      const response = await fetchDonations({
        startDate,
        endDate,
        status: "COMPLETED",
        type: type === "80G" ? "SECTION_80G" : "NON_80G",
      });

      // Filter donations based on transaction type
      let filteredDonations = Array.isArray(response.data)
        ? response.data.filter((donation) => {
            const transactionType = donation.attributes?.transactionType;
            if (type === "80G") {
              return ["Cash", "M.O"].includes(transactionType);
            } else {
              return ["Cheque", "Bank Transfer", "DD"].includes(
                transactionType
              );
            }
          })
        : [];

      // Combine donations with same unique_no
      const uniqueDonations = {};
      filteredDonations.forEach((donation) => {
        const uniqueNo =
          donation.attributes?.receipt_detail?.data?.attributes?.unique_no;
        if (uniqueNo) {
          if (!uniqueDonations[uniqueNo]) {
            uniqueDonations[uniqueNo] = { ...donation };
          } else {
            // Add the donation amount to existing entry
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
      console.log("Export clicked for:", type, quarter);
      const donations = await formatDDFData(type, quarter);
      console.log("Formatted donations:", donations);

      if (!donations || donations.length === 0) {
        alert("No donations found for the selected period");
        return;
      }

      // Create a temporary div to hold our print content
      const printDiv = document.createElement("div");

      // Generate HTML content with updated structure
      printDiv.innerHTML = `
        <div class="print-only">
          <div class="header">
            <img src="https://kamarpukur.rkmm.org/2-8.jpg" alt="Ramakrishna Mission Logo" class="mission-logo" />
            <div class="header-text">
              <h2>RAMAKRISHNA MISSION, KAMARPUKUR</h2>
              <h3>DDF - ${type} - FOR THE FY 2022-23</h3>
              <h4>${quarter}</h4>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>ID</th>
                <th>Unique Identification Number</th>
                <th>Section Code</th>
                <th>Name of donor</th>
                <th>Address of donor</th>
                <th>Donation Type</th>
                <th>Mode of receipt</th>
                <th>Amount of donation<br/>(Indian rupees)</th>
              </tr>
            </thead>
            <tbody>
              ${donations
                .map(
                  (donation, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${
                    donation.attributes?.guest?.data?.attributes
                      ?.aadhaar_number || ""
                  }</td>
                  <td>${
                    donation.attributes?.receipt_detail?.data?.attributes
                      ?.unique_no || ""
                  }</td>
                  <td>${type === "80G" ? "Section 80G" : "Non-80G"}</td>
                  <td>${
                    donation.attributes?.guest?.data?.attributes?.name || ""
                  }</td>
                  <td>${(
                    donation.attributes?.guest?.data?.attributes?.address || ""
                  )
                    .split(",")
                    .filter((part) => part.trim())
                    .join(", ")}</td>
                  <td>${donation.attributes?.type || ""}</td>
                  <td>${donation.attributes?.transactionType || ""}</td>
                  <td style="text-align: right">${parseFloat(
                    donation.attributes?.donationAmount || 0
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td colspan="8" style="text-align: right; font-weight: bold;">Total:</td>
                <td style="text-align: right; font-weight: bold;">
                  ${donations
                    .reduce(
                      (sum, donation) =>
                        sum +
                        parseFloat(donation.attributes?.donationAmount || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      // Update the print styles
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @media print {
          /* Hide all existing page content */
          body > *:not(.print-only) {
            display: none !important;
          }
          
          /* Show only print content */
          .print-only {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Remove any margins and backgrounds */
          @page {
            margin: 0.5cm;
            size: A4;
          }

          body {
            margin: 0;
            padding: 0;
            background: none;
          }
        }

        .print-only {
          font-family: Arial, sans-serif;
        }

        .print-only .header {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 20px;
          text-align: center;
          gap: 20px;
        }

        .print-only .mission-logo {
          width: 60px;
          height: 60px;
        }

        .print-only .header-text {
          flex: 1;
          width: auto;
          padding-bottom: 10px;
        }

        .print-only h2, 
        .print-only h3, 
        .print-only h4 {
          margin: 5px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .print-only h2 {
          font-size: 18px;
          font-weight: bold;
        }

        .print-only h3 {
          font-size: 16px;
        }

        .print-only h4 {
          font-size: 14px;
        }

        .print-only table {
          width: 100%;
          border-collapse: collapse;
        }

        .print-only th,
        .print-only td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }

        .print-only th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        .print-only td {
          height: 25px;
        }

        .print-only .total-row {
          background-color: #f2f2f2;
        }

        .print-only .total-row td {
          border-top: 2px solid #000;
        }
      `;

      // Add elements to page
      printDiv.classList.add("print-only");
      document.body.appendChild(styleSheet);
      document.body.appendChild(printDiv);

      // Trigger print
      window.print();

      // Cleanup
      document.body.removeChild(printDiv);
      document.body.removeChild(styleSheet);

      setShowDropdown(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error generating print preview. Please try again.");
    }
  };

  return (
    <div
      className="ddf-export-container"
      ref={dropdownRef}
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button className="ddf-button">Export DDF</button>
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
                onClick={() => handleDDFExport("Non-80G", "July-Sept 2nd Qtr")}
              >
                July-Sept 2nd Qtr
              </button>
              <button
                className="quarter-button"
                onClick={() => handleDDFExport("Non-80G", "Oct-Dec 3rd Qtr")}
              >
                Oct-Dec 3rd Qtr
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DDFExport;
