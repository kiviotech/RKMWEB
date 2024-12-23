import React from "react";
import "./DDFPreview.scss";

const DDFPreview = ({ donations, onConfirm, onCancel, type }) => {
  return (
    <div className="ddf-preview-overlay">
      <div className="ddf-preview-modal">
        <h3 style={{ margin: 0 }}>Data Preview</h3>
        <div className="preview-table-container">
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>ID</th>
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
                    {donation.attributes?.guest?.data?.attributes
                      ?.aadhaar_number || ""}
                  </td>
                  <td>
                    {donation.attributes?.receipt_detail?.data?.attributes
                      ?.unique_no || ""}
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
            onClick={onConfirm}
            style={{ backgroundColor: "#ea7704", color: "#fff" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DDFPreview;
