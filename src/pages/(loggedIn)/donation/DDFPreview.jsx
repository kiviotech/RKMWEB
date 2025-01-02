import React from "react";
import * as XLSX from "xlsx";
import "./DDFPreview.scss";

const DDFPreview = ({ donations, onConfirm, onCancel, type }) => {
  // Helper function to get full form of identity proof
  const getIdentityProofFullForm = (proof) => {
    const proofTypes = {
      PAN: "Permanent Account Number",
      AADHAAR: "Aadhaar Card",
      PASSPORT: "Passport",
      DRIVING_LICENSE: "Driving License",
      VOTER_ID: "Voter ID Card",
    };
    return proofTypes[proof] || proof;
  };

  // Add this function to get current financial year
  const getCurrentFinancialYear = () => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();

    // If current month is January to March (0-2), we're in the previous financial year
    // Otherwise we're in the current financial year
    const startYear = currentMonth <= 2 ? currentYear - 1 : currentYear;
    const endYear = startYear + 1;

    // Return in format "YYYY-YY"
    return `${startYear}-${(endYear % 100).toString().padStart(2, "0")}`;
  };

  const downloadAsExcel = () => {
    // Update the title rows with dynamic financial year
    const title = [
      ["RAMAKRISHNA MISSION, KAMARPUKUR"],
      [
        `DDF - ${
          type === "80G" ? "80G" : "NON-80G"
        } (WITH ID) FOR THE FY ${getCurrentFinancialYear()}`,
      ],
      [], // Empty row for spacing
    ];

    // Header row
    const headers = [
      "Sl No.",
      "ID",
      "Unique Identification Number",
      ...(type === "80G" ? ["Section Code"] : []),
      "Name of donor",
      "Address of donor",
      "Donation Type",
      "Mode of receipt",
      "Amount of donation\n(Indian rupees)",
    ];

    // Prepare data rows
    const dataRows = donations.map((donation, index) => [
      index + 1,
      getIdentityProofFullForm(
        donation.attributes?.guest?.data?.attributes?.identity_proof
      ),
      donation.attributes?.guest?.data?.attributes?.identity_number || "",
      ...(type === "80G" ? ["Section 80G"] : []),
      donation.attributes?.guest?.data?.attributes?.name || "",
      donation.attributes?.guest?.data?.attributes?.address
        ? donation.attributes.guest.data.attributes.address
            .split(",")
            .filter((part) => part.trim() !== "")
            .join(", ")
            .trim()
        : "",
      donation.attributes?.type || "",
      donation.attributes?.transactionType || "",
      parseFloat(donation.attributes?.donationAmount || 0).toFixed(2),
    ]);

    // Calculate total donation amount
    const totalDonation = donations.reduce(
      (sum, donation) =>
        sum + parseFloat(donation.attributes?.donationAmount || 0),
      0
    );

    // Add total row
    const totalRow = [
      "", // Sl No.
      "", // ID
      "", // Unique ID
      ...(type === "80G" ? [""] : []),
      "", // Name
      "", // Address
      "Total", // Donation Type
      "", // Mode
      totalDonation.toFixed(2), // Amount
    ];

    // Create worksheet with total row
    const ws = XLSX.utils.aoa_to_sheet([
      ...title,
      headers,
      ...dataRows,
      totalRow,
    ]);

    // Set column widths
    const colWidths = [
      { wch: 8 }, // Sl No.
      { wch: 15 }, // ID
      { wch: 25 }, // Unique ID
      ...(type === "80G" ? [{ wch: 15 }] : []),
      { wch: 25 }, // Name
      { wch: 40 }, // Address
      { wch: 15 }, // Donation Type
      { wch: 15 }, // Mode
      { wch: 15 }, // Amount
    ];
    ws["!cols"] = colWidths;

    // Merge cells for title rows
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: type === "80G" ? 8 : 7 } }, // First title row
      { s: { r: 1, c: 0 }, e: { r: 1, c: type === "80G" ? 8 : 7 } }, // Second title row
    ];

    // Style the headers
    const headerStyle = {
      fill: { fgColor: { rgb: "B8CCE4" } }, // Light blue background
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
    };

    // Apply styles to header row
    for (let i = 0; i < headers.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 3, c: i });
      ws[cellRef].s = headerStyle;
    }

    // Style the title rows
    const titleStyle = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center" },
    };

    for (let i = 0; i < 2; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
      ws[cellRef].s = titleStyle;
    }

    // Style the total row
    const totalRowIndex = title.length + dataRows.length + 1;
    const totalStyle = {
      font: { bold: true },
      alignment: { horizontal: "right" },
    };

    // Apply total row styles
    const totalCellRef = XLSX.utils.encode_cell({ r: totalRowIndex, c: 5 }); // "Total" text
    const totalAmountCellRef = XLSX.utils.encode_cell({
      r: totalRowIndex,
      c: 7,
    }); // Total amount
    ws[totalCellRef].s = totalStyle;
    ws[totalAmountCellRef].s = totalStyle;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");

    // Download file
    XLSX.writeFile(wb, "donations.xlsx");
  };

  return (
    <div className="ddf-preview-overlay">
      <div className="ddf-preview-modal">
        <h3 style={{ margin: 0 }}>Data Preview</h3>
        <div className="preview-table-container">
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>ID Type</th>
                <th>Unique ID No.</th>
                {type === "80G" && <th>Section Code</th>}
                <th>Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {getIdentityProofFullForm(
                      donation.attributes?.guest?.data?.attributes
                        ?.identity_proof
                    )}
                  </td>
                  <td>
                    {donation.attributes?.guest?.data?.attributes
                      ?.identity_number || ""}
                  </td>
                  {type === "80G" && <td>Section 80G</td>}
                  <td>
                    {donation.attributes?.guest?.data?.attributes?.name || ""}
                  </td>
                  <td>
                    {donation.attributes?.guest?.data?.attributes?.address
                      ? donation.attributes.guest.data.attributes.address
                          .split(",")
                          .filter((part) => part.trim() !== "")
                          .join(", ")
                          .trim()
                      : ""}
                  </td>
                  <td>{donation.attributes?.type || ""}</td>
                  <td>{donation.attributes?.transactionType || ""}</td>
                  <td>
                    ₹{" "}
                    {Number(donation.attributes.donationAmount).toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="preview-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="confirm-button"
            onClick={downloadAsExcel}
            style={{ backgroundColor: "#ea7704", color: "#fff" }}
          >
            Download Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DDFPreview;
