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

  const downloadAsExcel = () => {
    // Add title rows
    const title = [
      ["RAMAKRISHNA MISSION, KAMARPUKUR"],
      [
        `DDF - ${
          type === "80G" ? "80G" : "NON-80G"
        } (WITH ID) FOR THE FY 2022-23`,
      ],
      [], // Empty row for spacing
    ];

    // Header row
    const headers = [
      "Sl No.",
      "ID",
      "Unique Identification Number",
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

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([...title, headers, ...dataRows]);

    // Set column widths
    const colWidths = [
      { wch: 8 }, // Sl No.
      { wch: 15 }, // ID
      { wch: 25 }, // Unique ID
      { wch: 25 }, // Name
      { wch: 40 }, // Address
      { wch: 15 }, // Donation Type
      { wch: 15 }, // Mode
      { wch: 15 }, // Amount
    ];
    ws["!cols"] = colWidths;

    // Merge cells for title rows
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // First title row
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Second title row
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
                    ₹
                    {parseFloat(
                      donation.attributes?.donationAmount || 0
                    ).toFixed(2)}
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
