import React from "react";
import "./ExportReport.scss";

const ExportReport = ({ guestData }) => {
  const generateReport = () => {
    const reportContent = `
      <html>
        <head>
          <title>Tomorrow's Leaving Guests Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 14px;
              margin: 0;
              font-weight: bold;
            }
            .header p {
              font-size: 12px;
              margin: 5px 0 0;
            }
            .date {
              text-align: left;
              margin: 10px 0;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #fff;
              font-weight: normal;
            }
            td {
              vertical-align: top;
            }
            .sl-no {
              width: 40px;
              text-align: center;
            }
            .room-no {
              width: 60px;
            }
            .name {
              width: 150px;
            }
            .booking {
              width: 200px;
            }
            .date-col {
              width: 80px;
            }
            .persons {
              width: 60px;
              text-align: center;
            }
            .receipt {
              width: 80px;
            }
            .amount {
              width: 80px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RAMAKRISHNA MATH & RAMAKRISHNA MISSION KANKURGACHI</h1>
            <p>P.O.: Kankurgachi, Dist.: Hooghly, West Bengal-712012, India, Phone-03325-348343 / 9732850544</p>
          </div>
          
          <div class="date">
            DATE: ${new Date().toLocaleDateString()}
          </div>

          <table>
            <thead>
              <tr>
                <th class="sl-no">Sl. No.</th>
                <th class="room-no">Room No.</th>
                <th class="name">Person's Name</th>
                <th class="booking">Booking Description</th>
                <th class="date-col">From</th>
                <th class="date-col">To</th>
                <th class="persons">No. of Persons</th>
                <th class="receipt">Receipt No.</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${guestData
                .map(
                  (guest, index) => `
                <tr>
                  <td class="sl-no">${index + 1}</td>
                  <td class="room-no">${guest.roomNumber}</td>
                  <td class="name">${guest.guestName.replace("Mr. ", "")}</td>
                  <td class="booking">${guest.bookingDescription || "-"}</td>
                  <td class="date-col">${guest.arrivalDate}</td>
                  <td class="date-col">${guest.arrivalDate}</td>
                  <td class="persons">1</td>
                  <td class="receipt">${guest.receiptNo || ""}</td>
                  <td class="amount">${guest.donationAmount || ""}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Create a hidden iframe instead of new window
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Write content to iframe
    iframe.contentWindow.document.write(reportContent);
    iframe.contentWindow.document.close();

    // Print and remove iframe
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };

  return (
    <button
      className="export-report-btn"
      onClick={generateReport}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "8px 12px",
        backgroundColor: "#fff",
        color: "#374151",
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "400",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        height: "36px",
      }}
    >
      <span
        className="material-icons"
        style={{
          fontSize: "18px",
          color: "#6B7280",
        }}
      >
        arrow_downward
      </span>
      Export Donations
    </button>
  );
};

export default ExportReport;
