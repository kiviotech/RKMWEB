import React, { useState, useRef, useEffect } from "react";
import "./CheckInDetailsHeader.scss";
import { fetchRoomAllocationsForCheckin } from "../../../../../services/src/services/roomAllocationService";

const CheckInDetailsHeader = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("today");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const handlePrintTodayGuests = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchRoomAllocationsForCheckin(
        "arrival_date",
        today
      );
      const todayAllocations = response.data || [];

      const printDiv = document.createElement("div");
      printDiv.className = "print-content";

      // Updated styles with removed borders for header
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            max-width: 1200px;
            margin: 20px auto;
            text-align: center;
          }
          td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center !important;
            font-family: Arial, sans-serif;
          }
          .header-row td {
            text-align: center !important;
            font-weight: bold;
            border: none !important;
          }
          .header-row-1 {
            border-top: 1px solid #ddd;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
          }
          .header-row-2 {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
          }
          .data-row td {
            border: 1px solid #ddd;
          }
          tr {
            text-align: center;
          }
          .date-donation-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          .date-cell {
            text-align: center !important;
            width: 50%;
          }
          .donation-cell {
            text-align: center !important;
            width: 50%;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      // Updated table structure with header section
      printDiv.innerHTML = `
        <table>
          <tr class="header-row header-row-1">
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              RAMAKRISHNA MATH & RAMAKRISHNA MISSION KAMARPUKUR
            </td>
          </tr>
          <tr class="header-row header-row-2">
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              P.O. Kamarpukur, Dist.: Hoogly, West Bengal-712612, India, Phone: 03211-244221 / 7872800844
            </td>
          </tr>
          <tr>
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              E-mail: kamarpukur@rkmm.org Website: kamarpukur.rkmm.org
            </td>
          </tr>
          <tr class="data-row">
            <td colspan="6" style="text-align: center !important;">Date:- ${new Date().toLocaleDateString(
              "en-GB"
            )}</td>
            <td rowspan="2" style="text-align: center !important;">No. of Guests</td>
            <td colspan="2" style="text-align: center !important;">Donation Details</td>
          </tr>
          <tr class="data-row">
            <td style="text-align: center !important;">S.No.</td>
            <td style="text-align: center !important;">Room No.</td>
            <td style="text-align: center !important;">Guest Name</td>
            <td style="text-align: center !important;">Booking Description</td>
            <td style="text-align: center !important;">Arrival Date</td>
            <td style="text-align: center !important;">Departure Date</td>
            <td style="text-align: center !important;">Receipt No.</td>
            <td style="text-align: center !important;">Amount</td>
          </tr>
          ${todayAllocations
            .map((allocation, index) => {
              const arrivalDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.arrival_date
              );
              const departureDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.departure_date
              );
              const stayDuration = Math.ceil(
                (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
              );

              return `
              <tr class="data-row">
                <td style="text-align: center !important;">${index + 1}</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.room.data.attributes.room_number
                }</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.guests.data[0]?.attributes?.name ||
                  "N/A"
                }</td>
                <td style="text-align: center !important;"></td>
                <td style="text-align: center !important;">${arrivalDate.toLocaleDateString(
                  "en-GB"
                )}</td>
                <td style="text-align: center !important;">${departureDate.toLocaleDateString(
                  "en-GB"
                )}</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.guests.data?.length || 0
                }</td>
                <td style="text-align: center !important;"></td>
                <td style="text-align: center !important;"></td>
              </tr>
            `;
            })
            .join("")}
        </table>
      `;

      // Add the print div to the document
      document.body.appendChild(printDiv);

      // Print the document
      window.print();

      // Cleanup
      document.body.removeChild(printDiv);
      document.head.removeChild(styleSheet);
    } catch (error) {
      console.error("Error fetching allocations for printing:", error);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handlePrintTomorrowGuests = async () => {
    try {
      const tomorrow = getTomorrowDate();
      const response = await fetchRoomAllocationsForCheckin(
        "arrival_date",
        tomorrow
      );
      const tomorrowAllocations = response.data || [];

      const printDiv = document.createElement("div");
      printDiv.className = "print-content";

      // Updated styles with removed borders for header
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            max-width: 1200px;
            margin: 20px auto;
            text-align: center;
          }
          td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center !important;
            font-family: Arial, sans-serif;
          }
          .header-row td {
            text-align: center !important;
            font-weight: bold;
            border: none !important;
          }
          .header-row-1 {
            border-top: 1px solid #ddd;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
          }
          .header-row-2 {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
          }
          .data-row td {
            border: 1px solid #ddd;
          }
          tr {
            text-align: center;
          }
          .date-donation-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          .date-cell {
            text-align: center !important;
            width: 50%;
          }
          .donation-cell {
            text-align: center !important;
            width: 50%;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      // Updated table structure with header section
      printDiv.innerHTML = `
        <table>
          <tr class="header-row header-row-1">
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              RAMAKRISHNA MATH & RAMAKRISHNA MISSION KAMARPUKUR
            </td>
          </tr>
          <tr class="header-row header-row-2">
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              P.O. Kamarpukur, Dist.: Hoogly, West Bengal-712612, India, Phone: 03211-244221 / 7872800844
            </td>
          </tr>
          <tr>
            <td colspan="10" style="text-align: center !important; padding: 5px;">
              E-mail: kamarpukur@rkmm.org Website: kamarpukur.rkmm.org
            </td>
          </tr>
          <tr class="data-row">
            <td colspan="6" style="text-align: center !important;">Date:- ${new Date(
              tomorrow
            ).toLocaleDateString("en-GB")}</td>
            <td rowspan="2" style="text-align: center !important;">No. of Guests</td>
            <td colspan="2" style="text-align: center !important;">Donation Details</td>
          </tr>
          <tr class="data-row">
            <td style="text-align: center !important;">S.No.</td>
            <td style="text-align: center !important;">Room No.</td>
            <td style="text-align: center !important;">Guest Name</td>
            <td style="text-align: center !important;">Booking Description</td>
            <td style="text-align: center !important;">Arrival Date</td>
            <td style="text-align: center !important;">Departure Date</td>
            <td style="text-align: center !important;">Receipt No.</td>
            <td style="text-align: center !important;">Amount</td>
          </tr>
          ${tomorrowAllocations
            .map((allocation, index) => {
              const arrivalDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.arrival_date
              );
              const departureDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.departure_date
              );
              const stayDuration = Math.ceil(
                (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
              );

              return `
              <tr class="data-row">
                <td style="text-align: center !important;">${index + 1}</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.room.data.attributes.room_number
                }</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.guests.data[0]?.attributes?.name ||
                  "N/A"
                }</td>
                <td style="text-align: center !important;"></td>
                <td style="text-align: center !important;">${arrivalDate.toLocaleDateString(
                  "en-GB"
                )}</td>
                <td style="text-align: center !important;">${departureDate.toLocaleDateString(
                  "en-GB"
                )}</td>
                <td style="text-align: center !important;">${
                  allocation.attributes.guests.data?.length || 0
                }</td>
                <td style="text-align: center !important;"></td>
                <td style="text-align: center !important;"></td>
              </tr>
            `;
            })
            .join("")}
        </table>
      `;

      // Add the print div to the document
      document.body.appendChild(printDiv);

      // Print the document
      window.print();

      // Cleanup
      document.body.removeChild(printDiv);
      document.head.removeChild(styleSheet);
    } catch (error) {
      console.error("Error fetching allocations for printing:", error);
    }
  };

  return (
    <div className="check-in-details-header">
      <button
        className={`tab-button ${
          activeTab === "today" ? "active" : "inactive"
        }`}
        onClick={() => handleTabChange("today")}
      >
        Today's Arrival Guest
      </button>
      <button
        className={`tab-button ${
          activeTab === "tomorrow" ? "active" : "inactive"
        }`}
        onClick={() => handleTabChange("tomorrow")}
      >
        Tomorrow's Arrival Guest
      </button>

      <div className="print-section">
        <select defaultValue="all">
          <option value="all">All</option>
          {/* Add more options as needed */}
        </select>
        <div className="print-dropdown-container" ref={dropdownRef}>
          <button
            className="print-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Print Report
            <span>▼</span>
          </button>
          {showDropdown && (
            <div className="print-dropdown">
              <button onClick={handlePrintTodayGuests}>
                Today's Arrival Guest
              </button>
              <button onClick={handlePrintTomorrowGuests}>
                Tomorrow's Arrival Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailsHeader;
