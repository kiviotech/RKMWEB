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
    // Prepare data for Excel
    const excelData = donations.map((donation, index) => ({
      "Sl No.": index + 1,
      "ID Type": getIdentityProofFullForm(
        donation.attributes?.guest?.data?.attributes?.identity_proof
      ),
      "Unique ID No.":
        donation.attributes?.guest?.data?.attributes?.identity_number || "",
      ...(type === "80G" && { "Section Code": "Section 80G" }),
      Name: donation.attributes?.guest?.data?.attributes?.name || "",
      Address: donation.attributes?.guest?.data?.attributes?.address
        ? donation.attributes.guest.data.attributes.address
            .split(",")
            .filter((part) => part.trim() !== "")
            .join(", ")
            .trim()
        : "",
      Type: donation.attributes?.type || "",
      Mode: donation.attributes?.transactionType || "",
      Amount: parseFloat(donation.attributes?.donationAmount || 0).toFixed(2),
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
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
